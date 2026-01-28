import { useState } from "react";
import { TreeNodeData } from "./types";
import { TreeNode } from "./TreeNode";
import "./TreeNode.css";

interface TreeViewProps {
  data: TreeNodeData[];
}

// Collect all node IDs that have children for initial expanded state
const collectExpandableIds = (nodes: TreeNodeData[]): string[] => {
  const ids: string[] = [];
  const traverse = (nodeList: TreeNodeData[]) => {
    for (const node of nodeList) {
      if (node.children && node.children.length > 0) {
        ids.push(node.id);
        traverse(node.children);
      }
    }
  };
  traverse(nodes);
  return ids;
};

export const TreeView = ({ data }: TreeViewProps) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(() => new Set());

  const handleSelect = (id: string) => {
    setSelectedId((prev) => (prev === id ? null : id));
  };

  const handleToggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className="tree-view">
      {data.map((node, index) => (
        <div key={node.id} className="tree-view__item">
          {/* Vertical line connecting root-level items */}
          {index < data.length - 1 && (
            <div
              className="tree-view__root-connector"
              style={{ top: "64px", height: "calc(100% - 40px)" }}
            />
          )}
          <TreeNode
            node={node}
            isLast={index === data.length - 1}
            selectedId={selectedId}
            expandedIds={expandedIds}
            onSelect={handleSelect}
            onToggleExpand={handleToggleExpand}
          />
        </div>
      ))}
    </div>
  );
};
