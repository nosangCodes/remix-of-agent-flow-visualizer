import { TreeView, TreeNodeData } from "@/components/TreeNode";

const treeData: TreeNodeData[] = [
  {
    id: "agent_1",
    name: "Research Agent",
    type: "agent",
    status: "running",
    duration: 2340,
    cost: 0.0023,
    tokens: 1250,
    children: [
      {
        id: "tool_1_1",
        name: "Web Search",
        type: "tool",
        status: "completed",
        duration: 890,
        cost: 0.0008,
        tokens: 320,
      },
      {
        id: "tool_1_2",
        name: "Document Parser",
        type: "tool",
        status: "running",
        duration: 450,
        cost: 0.0005,
        tokens: 180,
      },
      {
        id: "prompt_1_1",
        name: "Summarize Results",
        type: "prompt",
        status: "idle",
        duration: 1000,
        cost: 0.001,
        tokens: 750,
        children: [
          {
            id: "prompt_1_1_1",
            name: "Final Report",
            type: "prompt",
            status: "idle",
            duration: 1000,
            cost: 0.001,
            tokens: 750,
          },
        ],
      },
    ],
  },
  {
    id: "prompt_1",
    name: "Generate Report",
    type: "prompt",
    status: "completed",
    duration: 1560,
    cost: 0.0015,
    tokens: 890,
  },
  {
    id: "agent_2",
    name: "Validation Agent",
    type: "agent",
    status: "error",
    duration: 3200,
    cost: 0.0031,
    tokens: 1680,
    children: [
      {
        id: "tool_2_1",
        name: "Fact Checker",
        type: "tool",
        status: "completed",
        duration: 1200,
        cost: 0.0012,
        tokens: 560,
      },
      {
        id: "eval_2_1",
        name: "Quality Check",
        type: "eval",
        status: "error",
        duration: 800,
        cost: 0.0007,
        tokens: 420,
      },
      {
        id: "prompt_2_1",
        name: "Fix Issues",
        type: "prompt",
        status: "idle",
        duration: 1200,
        cost: 0.0012,
        tokens: 700,
      },
    ],
  },
  {
    id: "eval_1",
    name: "Final Evaluation",
    type: "eval",
    status: "idle",
    duration: 980,
    cost: 0.0009,
    tokens: 520,
    children: [
      {
        id: "tool_eval_1",
        name: "Fact Checker",
        type: "tool",
        status: "idle",
        duration: 1200,
        cost: 0.0012,
        tokens: 560,
      },
    ],
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-6 text-2xl font-semibold text-foreground">
          Agent Execution Tree
        </h1>
        <div className="rounded-xl border border-border bg-card shadow-sm">
          <TreeView data={treeData} />
        </div>
      </div>
    </div>
  );
};

export default Index;
