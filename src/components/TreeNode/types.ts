export type NodeType = "agent" | "tool" | "prompt" | "eval";

export interface TreeNodeData {
  id: string;
  name: string;
  type: NodeType;
  duration: number;
  cost: number;
  tokens: number;
  children?: TreeNodeData[];
}
