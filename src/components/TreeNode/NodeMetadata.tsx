import { Clock, Coins, Hash } from "lucide-react";
import "./TreeNode.css";

interface NodeMetadataProps {
  duration: number;
  tokens: number;
  cost: number;
}

const formatDuration = (ms: number): string => {
  if (ms < 1000) return `${ms}ms`;
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  if (minutes > 0) {
    return `${minutes}m ${remainingSeconds}s`;
  }
  return `${seconds}s`;
};

const formatCost = (cost: number): string => {
  return `$${cost.toFixed(4)}`;
};

export const NodeMetadata = ({ duration, tokens, cost }: NodeMetadataProps) => {
  return (
    <div className="node-metadata">
      <span className="node-metadata__item">
        <Clock className="node-metadata__icon" />
        {formatDuration(duration)}
      </span>
      <span className="node-metadata__item">
        <Hash className="node-metadata__icon" />
        {tokens}
      </span>
      <span className="node-metadata__item">
        <Coins className="node-metadata__icon" />
        {formatCost(cost)}
      </span>
    </div>
  );
};
