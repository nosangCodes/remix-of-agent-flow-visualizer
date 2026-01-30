export type NodeType = "agent" | "tool" | "prompt" | "eval";
export type NodeStatus = "idle" | "running" | "completed" | "error";

export interface TreeNodeData {
  id: string;
  name: string;
  type: NodeType;
  status?: NodeStatus;
  duration: number;
  cost: number;
  tokens: number;
  children?: TreeNodeData[];
}
