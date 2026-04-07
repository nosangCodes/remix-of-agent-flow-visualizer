export type NodeType = "agent" | "tool" | "prompt" | "eval" | "condition";
export type NodeStatus = "idle" | "running" | "completed" | "error";

export interface ConditionBranch {
  label: string;
  children: TreeNodeData[];
}

export interface TreeNodeData {
  id: string;
  name: string;
  type: NodeType;
  status?: NodeStatus;
  duration: number;
  cost: number;
  tokens: number;
  children?: TreeNodeData[];
  /** For condition nodes: expression being evaluated */
  conditionExpression?: string;
  /** For condition nodes: true/false branches */
  trueBranch?: TreeNodeData[];
  falseBranch?: TreeNodeData[];
}
