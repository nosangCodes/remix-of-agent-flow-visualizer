import { NodeType } from "./types";
import "./TreeNode.css";

interface NodeIconProps {
  type: NodeType;
  className?: string;
}

export const NodeIcon = ({ type, className = "" }: NodeIconProps) => {
  const emojiMap: Record<NodeType, string> = {
    agent: "🔀",
    tool: "📦",
    prompt: "💬",
    eval: "✅",
  };

  return (
    <div className={`node-icon node-icon--${type} ${className}`}>
      {emojiMap[type]}
    </div>
  );
};
