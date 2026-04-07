import { useState, useCallback } from "react";
import { TreeNodeData } from "./types";
import { TreeNode } from "./TreeNode";
import { NodeDrawer } from "./NodeDrawer";
import "./TreeNode.css";

interface TreeViewProps {
  data: TreeNodeData[];
  onChange?: (data: TreeNodeData[]) => void;
}

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

const updateNodeInTree = (
  nodes: TreeNodeData[],
  id: string,
  updater: (node: TreeNodeData) => TreeNodeData
): TreeNodeData[] => {
  return nodes.map((node) => {
    if (node.id === id) return updater(node);
    const updated = { ...node };
    if (updated.children) {
      updated.children = updateNodeInTree(updated.children, id, updater);
    }
    if (updated.trueBranch) {
      updated.trueBranch = updateNodeInTree(updated.trueBranch, id, updater);
    }
    if (updated.falseBranch) {
      updated.falseBranch = updateNodeInTree(updated.falseBranch, id, updater);
    }
    return updated;
  });
};

export const TreeView = ({ data: initialData, onChange }: TreeViewProps) => {
  const [data, setData] = useState<TreeNodeData[]>(initialData);
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
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const handleUpdateNode = useCallback(
    (id: string, updates: Partial<TreeNodeData>) => {
      setData((prev) => {
        const next = updateNodeInTree(prev, id, (node) => ({ ...node, ...updates }));
        onChange?.(next);
        return next;
      });
    },
    [onChange]
  );

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
        onUpdateNode={handleUpdateNode}
      />
    </>
  );
};
