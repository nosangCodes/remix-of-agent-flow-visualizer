import { TreeNodeData } from "./types";
import { NodeIcon } from "./NodeIcon";
import { NodeMetadata } from "./NodeMetadata";
import { TreeNode } from "./TreeNode";
import { ChevronUp } from "lucide-react";
import "./TreeNode.css";

interface ConditionNodeProps {
  node: TreeNodeData;
  isLast?: boolean;
  isFirst?: boolean;
  depth?: number;
  parentHasMoreSiblings?: boolean[];
  selectedId?: string | null;
  expandedIds: Set<string>;
  onSelect?: (id: string) => void;
  onToggleExpand: (id: string) => void;
}

const ICON_CENTER_OFFSET = 32;
const DEPTH_INDENT = 40;
const CHILDREN_CONTAINER_MARGIN = 8;
const CHILD_MARGIN = 8;

export const ConditionNode = ({
  node,
  isLast = false,
  isFirst = true,
  depth = 0,
  parentHasMoreSiblings = [],
  selectedId,
  expandedIds,
  onSelect,
  onToggleExpand,
}: ConditionNodeProps) => {
  const isSelected = selectedId === node.id;
  const isExpanded = expandedIds.has(node.id);
  const hasBranches =
    (node.trueBranch && node.trueBranch.length > 0) ||
    (node.falseBranch && node.falseBranch.length > 0);

  const isRunning = node.status === "running";
  const isCompleted = node.status === "completed";
  const isError = node.status === "error";

  const handleClick = () => {
    onSelect?.(node.id);
  };

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleExpand(node.id);
  };

  const contentClasses = [
    "tree-node__content",
    "tree-node__content--clickable",
    isSelected && !isRunning && "tree-node__content--selected",
    isRunning && "tree-node__content--running",
    isCompleted && "tree-node__content--completed",
    isError && "tree-node__content--error",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="tree-node">
      {/* Connecting lines for nested items */}
      {depth > 0 && (
        <>
          {parentHasMoreSiblings.map(
            (hasMore, index) =>
              hasMore && (
                <div
                  key={index}
                  className="tree-node__vertical-line"
                  style={{ left: `${index * DEPTH_INDENT + ICON_CENTER_OFFSET}px` }}
                />
              )
          )}
          <div
            className="tree-node__horizontal-line"
            style={{
              left: `${(depth - 1) * DEPTH_INDENT + ICON_CENTER_OFFSET}px`,
              top: `${ICON_CENTER_OFFSET}px`,
              width: `${DEPTH_INDENT}px`,
            }}
          />
          <div
            className="tree-node__connector-line"
            style={{
              left: `${(depth - 1) * DEPTH_INDENT + ICON_CENTER_OFFSET}px`,
              top: isFirst ? `-${CHILDREN_CONTAINER_MARGIN}px` : `-${CHILD_MARGIN}px`,
              height: isLast
                ? `${ICON_CENTER_OFFSET + (isFirst ? CHILDREN_CONTAINER_MARGIN : CHILD_MARGIN)}px`
                : `calc(100% + ${isFirst ? CHILDREN_CONTAINER_MARGIN : CHILD_MARGIN}px)`,
            }}
          />
        </>
      )}

      {/* Condition node content */}
      <div
        className={contentClasses}
        style={{ marginLeft: `${depth * DEPTH_INDENT}px` }}
        onClick={handleClick}
      >
        {isRunning && <div className="tree-node__running-border" />}

        <NodeIcon type="condition" />
        <div className="tree-node__info">
          <span className="tree-node__name">{node.name}</span>
          {node.conditionExpression && (
            <span className="condition-node__expression">
              {node.conditionExpression}
            </span>
          )}
          <NodeMetadata
            duration={node.duration}
            tokens={node.tokens}
            cost={node.cost}
          />
        </div>
        {hasBranches && (
          <button className="tree-node__toggle" onClick={handleToggle}>
            <ChevronUp
              className={`tree-node__toggle-icon ${
                !isExpanded ? "tree-node__toggle-icon--collapsed" : ""
              }`}
            />
          </button>
        )}
      </div>

      {/* Branches */}
      {hasBranches && isExpanded && (
        <div className="tree-node__children">
          {/* True Branch */}
          {node.trueBranch && node.trueBranch.length > 0 && (
            <div className="tree-node__child">
              <div className="tree-node">
                {/* Connector lines for branch label */}
                <div
                  className="tree-node__horizontal-line"
                  style={{
                    left: `${depth * DEPTH_INDENT + ICON_CENTER_OFFSET}px`,
                    top: `${ICON_CENTER_OFFSET}px`,
                    width: `${DEPTH_INDENT}px`,
                  }}
                />
                <div
                  className="tree-node__connector-line"
                  style={{
                    left: `${depth * DEPTH_INDENT + ICON_CENTER_OFFSET}px`,
                    top: `-${CHILDREN_CONTAINER_MARGIN}px`,
                    height:
                      node.falseBranch && node.falseBranch.length > 0
                        ? `calc(100% + ${CHILDREN_CONTAINER_MARGIN}px)`
                        : `${ICON_CENTER_OFFSET + CHILDREN_CONTAINER_MARGIN}px`,
                  }}
                />

                <div
                  className="condition-node__branch-label condition-node__branch-label--true"
                  style={{ marginLeft: `${(depth + 1) * DEPTH_INDENT}px` }}
                >
                  <div className="condition-node__branch-badge condition-node__branch-badge--true">
                    ✓ True
                  </div>
                </div>

                <div className="tree-node__children">
                  {node.trueBranch.map((child, index) => (
                    <div key={child.id} className="tree-node__child">
                      <TreeNode
                        node={child}
                        isLast={index === node.trueBranch!.length - 1}
                        isFirst={index === 0}
                        depth={depth + 2}
                        parentHasMoreSiblings={[
                          ...parentHasMoreSiblings,
                          node.falseBranch !== undefined && node.falseBranch.length > 0,
                          index !== node.trueBranch!.length - 1,
                        ]}
                        selectedId={selectedId}
                        expandedIds={expandedIds}
                        onSelect={onSelect}
                        onToggleExpand={onToggleExpand}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* False Branch */}
          {node.falseBranch && node.falseBranch.length > 0 && (
            <div className="tree-node__child">
              <div className="tree-node">
                {/* Connector lines for branch label */}
                <div
                  className="tree-node__horizontal-line"
                  style={{
                    left: `${depth * DEPTH_INDENT + ICON_CENTER_OFFSET}px`,
                    top: `${ICON_CENTER_OFFSET}px`,
                    width: `${DEPTH_INDENT}px`,
                  }}
                />
                <div
                  className="tree-node__connector-line"
                  style={{
                    left: `${depth * DEPTH_INDENT + ICON_CENTER_OFFSET}px`,
                    top: `-${CHILD_MARGIN}px`,
                    height: `${ICON_CENTER_OFFSET + CHILD_MARGIN}px`,
                  }}
                />

                <div
                  className="condition-node__branch-label condition-node__branch-label--false"
                  style={{ marginLeft: `${(depth + 1) * DEPTH_INDENT}px` }}
                >
                  <div className="condition-node__branch-badge condition-node__branch-badge--false">
                    ✗ False
                  </div>
                </div>

                <div className="tree-node__children">
                  {node.falseBranch.map((child, index) => (
                    <div key={child.id} className="tree-node__child">
                      <TreeNode
                        node={child}
                        isLast={index === node.falseBranch!.length - 1}
                        isFirst={index === 0}
                        depth={depth + 2}
                        parentHasMoreSiblings={[
                          ...parentHasMoreSiblings,
                          false,
                          index !== node.falseBranch!.length - 1,
                        ]}
                        selectedId={selectedId}
                        expandedIds={expandedIds}
                        onSelect={onSelect}
                        onToggleExpand={onToggleExpand}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
