import { useState, useCallback } from "react";
import { TreeNodeData } from "./types";
import { TreeNode } from "./TreeNode";
import { NodeDrawer } from "./NodeDrawer";
import "./TreeNode.css";

interface TreeViewProps {
  data: TreeNodeData[];
}

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

// Flatten all nodes for lookup by id
const findNodeById = (nodes: TreeNodeData[], id: string): TreeNodeData | null => {
  for (const node of nodes) {
    if (node.id === id) return node;
    if (node.children) {
      const found = findNodeById(node.children, id);
      if (found) return found;
    }
    if (node.trueBranch) {
      const found = findNodeById(node.trueBranch, id);
      if (found) return found;
    }
    if (node.falseBranch) {
      const found = findNodeById(node.falseBranch, id);
      if (found) return found;
    }
  }
  return null;
};

export const TreeView = ({ data }: TreeViewProps) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(() => new Set());
  const [drawerOpen, setDrawerOpen] = useState(false);

  const selectedNode = selectedId ? findNodeById(data, selectedId) : null;

  const handleSelect = useCallback((id: string) => {
    setSelectedId((prev) => {
      if (prev === id) {
        setDrawerOpen(false);
        return null;
      }
      setDrawerOpen(true);
      return id;
    });
  }, []);

  const handleCloseDrawer = useCallback(() => {
    setDrawerOpen(false);
    setSelectedId(null);
  }, []);

  const handleToggleExpand = useCallback((id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  return (
    <>
      <div className="tree-view">
        {data.map((node, index) => (
          <div key={node.id} className="tree-view__item">
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
      <NodeDrawer
        node={selectedNode}
        open={drawerOpen}
        onClose={handleCloseDrawer}
      />
    </>
  );
};
