import { ChevronUp } from "lucide-react";
import { TreeNodeData } from "./types";
import { NodeIcon } from "./NodeIcon";
import { NodeMetadata } from "./NodeMetadata";
import "./TreeNode.css";

interface TreeNodeProps {
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

// Constants for alignment - icon is 40px, padding is 12px
// Center of icon from content edge: 12px padding + 20px (half of 40px icon) = 32px
const ICON_CENTER_OFFSET = 32;
const DEPTH_INDENT = 40;
const CHILD_MARGIN = 8; // matches .tree-node__child margin-top

export const TreeNode = ({
  node,
  isLast = false,
  isFirst = true,
  depth = 0,
  parentHasMoreSiblings = [],
  selectedId,
  expandedIds,
  onSelect,
  onToggleExpand,
}: TreeNodeProps) => {
  const hasChildren = node.children && node.children.length > 0;
  const isSelected = selectedId === node.id;
  const isExpanded = expandedIds.has(node.id);

  const handleClick = () => {
    onSelect?.(node.id);
  };

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleExpand(node.id);
  };

  const contentClasses = [
    "tree-node__content",
    (hasChildren || onSelect) && "tree-node__content--clickable",
    isSelected && "tree-node__content--selected",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="tree-node">
      {/* Connecting lines for nested items */}
      {depth > 0 && (
        <>
          {/* Vertical lines from parent levels */}
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
          {/* Horizontal connector line */}
          <div
            className="tree-node__horizontal-line"
            style={{
              left: `${(depth - 1) * DEPTH_INDENT + ICON_CENTER_OFFSET}px`,
              top: `${ICON_CENTER_OFFSET}px`,
              width: `${DEPTH_INDENT - ICON_CENTER_OFFSET + ICON_CENTER_OFFSET}px`,
            }}
          />
          {/* Vertical line to this node */}
          <div
            className="tree-node__connector-line"
            style={{
              left: `${(depth - 1) * DEPTH_INDENT + ICON_CENTER_OFFSET}px`,
              top: isFirst ? 0 : `-${CHILD_MARGIN}px`,
              height: isLast 
                ? `${ICON_CENTER_OFFSET + (isFirst ? 0 : CHILD_MARGIN)}px` 
                : `calc(100% + ${isFirst ? 0 : CHILD_MARGIN}px)`,
            }}
          />
        </>
      )}

      {/* Node content */}
      <div
        className={contentClasses}
        style={{ marginLeft: `${depth * DEPTH_INDENT}px` }}
        onClick={handleClick}
      >
        <NodeIcon type={node.type} />
        <div className="tree-node__info">
          <span className="tree-node__name">{node.name}</span>
          <NodeMetadata
            duration={node.duration}
            tokens={node.tokens}
            cost={node.cost}
          />
        </div>
        {hasChildren && (
          <button className="tree-node__toggle" onClick={handleToggle}>
            <ChevronUp
              className={`tree-node__toggle-icon ${
                !isExpanded ? "tree-node__toggle-icon--collapsed" : ""
              }`}
            />
          </button>
        )}
      </div>

      {/* Children */}
      {hasChildren && isExpanded && (
        <div className="tree-node__children">
          {node.children!.map((child, index) => (
            <div key={child.id} className="tree-node__child">
              <TreeNode
                node={child}
                isLast={index === node.children!.length - 1}
                isFirst={index === 0}
                depth={depth + 1}
                parentHasMoreSiblings={[
                  ...parentHasMoreSiblings,
                  index !== node.children!.length - 1,
                ]}
                selectedId={selectedId}
                expandedIds={expandedIds}
                onSelect={onSelect}
                onToggleExpand={onToggleExpand}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
