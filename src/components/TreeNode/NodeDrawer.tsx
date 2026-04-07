import { useState, useEffect } from "react";
import { X, Clock, Coins, Hash, Play, CheckCircle2, AlertCircle, Circle, Pencil, Check } from "lucide-react";
import { TreeNodeData, NodeType, NodeStatus } from "./types";
import { NodeIcon } from "./NodeIcon";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import "./NodeDrawer.css";

interface NodeDrawerProps {
  node: TreeNodeData | null;
  open: boolean;
  onClose: () => void;
  onUpdateNode: (id: string, updates: Partial<TreeNodeData>) => void;
}

const nodeTypeDescriptions: Record<NodeType, string> = {
  agent: "Run an agent through LLM",
  tool: "Execute an external tool",
  prompt: "Send a prompt to LLM",
  eval: "Evaluate output quality",
  condition: "Branch based on a condition",
};

const statusConfig: Record<NodeStatus, { label: string; icon: React.ReactNode; className: string }> = {
  idle: { label: "Idle", icon: <Circle className="w-3.5 h-3.5" />, className: "node-drawer__status--idle" },
  running: { label: "Running", icon: <Play className="w-3.5 h-3.5" />, className: "node-drawer__status--running" },
  completed: { label: "Completed", icon: <CheckCircle2 className="w-3.5 h-3.5" />, className: "node-drawer__status--completed" },
  error: { label: "Error", icon: <AlertCircle className="w-3.5 h-3.5" />, className: "node-drawer__status--error" },
};

const formatDuration = (ms: number): string => {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
};

const formatCost = (cost: number): string => {
  if (cost === 0) return "$0.00";
  return `$${cost.toFixed(4)}`;
};

export const NodeDrawer = ({ node, open, onClose, onUpdateNode }: NodeDrawerProps) => {
  const [editingName, setEditingName] = useState(false);
  const [nameValue, setNameValue] = useState("");
  const [expressionValue, setExpressionValue] = useState("");

  // Sync local state when node changes
  useEffect(() => {
    if (node) {
      setNameValue(node.name);
      setExpressionValue(node.conditionExpression || "");
      setEditingName(false);
    }
  }, [node?.id]);

  if (!node) return null;

  const status = node.status || "idle";
  const statusInfo = statusConfig[status];

  const handleNameSave = () => {
    if (nameValue.trim()) {
      onUpdateNode(node.id, { name: nameValue.trim() });
    }
    setEditingName(false);
  };

  const handleNameKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleNameSave();
    if (e.key === "Escape") {
      setNameValue(node.name);
      setEditingName(false);
    }
  };

  const handleExpressionChange = (val: string) => {
    setExpressionValue(val);
    onUpdateNode(node.id, { conditionExpression: val });
  };

  const handleTypeChange = (val: string) => {
    onUpdateNode(node.id, { type: val as NodeType });
  };

  const handleStatusChange = (val: string) => {
    onUpdateNode(node.id, { status: val as NodeStatus });
  };

  return (
    <>
      <div
        className={`node-drawer__backdrop ${open ? "node-drawer__backdrop--open" : ""}`}
        onClick={onClose}
      />

      <div className={`node-drawer ${open ? "node-drawer--open" : ""}`}>
        {/* Header */}
        <div className="node-drawer__header">
          <div className="node-drawer__header-left">
            <NodeIcon type={node.type} />
            <div className="node-drawer__header-info">
              {editingName ? (
                <div className="node-drawer__name-edit">
                  <Input
                    value={nameValue}
                    onChange={(e) => setNameValue(e.target.value)}
                    onKeyDown={handleNameKeyDown}
                    onBlur={handleNameSave}
                    autoFocus
                    className="h-8 text-sm font-semibold"
                  />
                  <button className="node-drawer__name-save" onClick={handleNameSave}>
                    <Check className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="node-drawer__name-display">
                  <h2 className="node-drawer__title">{node.name}</h2>
                  <button
                    className="node-drawer__name-edit-btn"
                    onClick={() => setEditingName(true)}
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
              <p className="node-drawer__subtitle">{nodeTypeDescriptions[node.type]}</p>
            </div>
          </div>
          <button className="node-drawer__close" onClick={onClose}>
            <X className="w-4 h-4" />
          </button>
        </div>

        <Separator />

        <div className="node-drawer__body">
          {/* Status */}
          <div className="node-drawer__section">
            <label className="node-drawer__label">Status</label>
            <Select value={status} onValueChange={handleStatusChange}>
              <SelectTrigger>
                <div className={`node-drawer__status-inline ${statusInfo.className}`}>
                  {statusInfo.icon}
                  <span>{statusInfo.label}</span>
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="idle">⚪ Idle</SelectItem>
                <SelectItem value="running">🔵 Running</SelectItem>
                <SelectItem value="completed">🟢 Completed</SelectItem>
                <SelectItem value="error">🔴 Error</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Type selector */}
          <div className="node-drawer__section">
            <label className="node-drawer__label">
              Node Type <span className="node-drawer__required">*</span>
            </label>
            <Select value={node.type} onValueChange={handleTypeChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="agent">🔀 Agent</SelectItem>
                <SelectItem value="tool">📦 Tool</SelectItem>
                <SelectItem value="prompt">💬 Prompt</SelectItem>
                <SelectItem value="eval">✅ Eval</SelectItem>
                <SelectItem value="condition">⑂ Condition</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Model selector */}
          {(node.type === "agent" || node.type === "prompt") && (
            <div className="node-drawer__section">
              <label className="node-drawer__label">
                Model <span className="node-drawer__required">*</span>
              </label>
              <Select defaultValue="gpt-4o">
                <SelectTrigger>
                  <SelectValue placeholder="Select model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                  <SelectItem value="gpt-4o-mini">GPT-4o Mini</SelectItem>
                  <SelectItem value="claude-3.5">Claude 3.5 Sonnet</SelectItem>
                  <SelectItem value="gemini-pro">Gemini Pro</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Tool selector */}
          {node.type === "tool" && (
            <div className="node-drawer__section">
              <label className="node-drawer__label">
                Tool <span className="node-drawer__required">*</span>
              </label>
              <Select defaultValue="web-search">
                <SelectTrigger>
                  <SelectValue placeholder="Select tool" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="web-search">Web Search</SelectItem>
                  <SelectItem value="code-interpreter">Code Interpreter</SelectItem>
                  <SelectItem value="file-reader">File Reader</SelectItem>
                  <SelectItem value="api-call">API Call</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Condition expression — editable textarea */}
          {node.type === "condition" && (
            <div className="node-drawer__section">
              <label className="node-drawer__label">
                Condition Expression <span className="node-drawer__required">*</span>
              </label>
              <Textarea
                value={expressionValue}
                onChange={(e) => handleExpressionChange(e.target.value)}
                placeholder="e.g. results.score >= 0.8"
                className="node-drawer__expression-input"
                rows={3}
              />
              <p className="node-drawer__hint">
                JavaScript expression that evaluates to true or false
              </p>
            </div>
          )}

          {/* Retry policy */}
          <div className="node-drawer__section">
            <label className="node-drawer__label">Retry on Failure</label>
            <Select defaultValue="none">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No retry</SelectItem>
                <SelectItem value="1">1 retry</SelectItem>
                <SelectItem value="2">2 retries</SelectItem>
                <SelectItem value="3">3 retries</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Timeout */}
          <div className="node-drawer__section">
            <label className="node-drawer__label">Timeout</label>
            <Select defaultValue="30s">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10s">10 seconds</SelectItem>
                <SelectItem value="30s">30 seconds</SelectItem>
                <SelectItem value="60s">1 minute</SelectItem>
                <SelectItem value="300s">5 minutes</SelectItem>
                <SelectItem value="none">No timeout</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* Execution metrics */}
          <div className="node-drawer__section">
            <label className="node-drawer__label">Execution Metrics</label>
            <div className="node-drawer__metrics">
              <div className="node-drawer__metric">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <div>
                  <span className="node-drawer__metric-label">Duration</span>
                  <span className="node-drawer__metric-value">{formatDuration(node.duration)}</span>
                </div>
              </div>
              <div className="node-drawer__metric">
                <Hash className="w-4 h-4 text-muted-foreground" />
                <div>
                  <span className="node-drawer__metric-label">Tokens</span>
                  <span className="node-drawer__metric-value">{node.tokens.toLocaleString()}</span>
                </div>
              </div>
              <div className="node-drawer__metric">
                <Coins className="w-4 h-4 text-muted-foreground" />
                <div>
                  <span className="node-drawer__metric-label">Cost</span>
                  <span className="node-drawer__metric-value">{formatCost(node.cost)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Children summary */}
          {node.children && node.children.length > 0 && (
            <div className="node-drawer__section">
              <label className="node-drawer__label">Children</label>
              <div className="node-drawer__children-list">
                {node.children.map((child) => (
                  <div key={child.id} className="node-drawer__child-item">
                    <NodeIcon type={child.type} className="node-drawer__child-icon" />
                    <span className="node-drawer__child-name">{child.name}</span>
                    <Badge variant="secondary" className="node-drawer__child-badge">
                      {child.status || "idle"}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Condition branches */}
          {node.type === "condition" && (
            <>
              {node.trueBranch && node.trueBranch.length > 0 && (
                <div className="node-drawer__section">
                  <label className="node-drawer__label">
                    <span className="node-drawer__branch-dot node-drawer__branch-dot--true" />
                    True Branch
                  </label>
                  <div className="node-drawer__children-list">
                    {node.trueBranch.map((child) => (
                      <div key={child.id} className="node-drawer__child-item">
                        <NodeIcon type={child.type} className="node-drawer__child-icon" />
                        <span className="node-drawer__child-name">{child.name}</span>
                        <Badge variant="secondary" className="node-drawer__child-badge">
                          {child.status || "idle"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {node.falseBranch && node.falseBranch.length > 0 && (
                <div className="node-drawer__section">
                  <label className="node-drawer__label">
                    <span className="node-drawer__branch-dot node-drawer__branch-dot--false" />
                    False Branch
                  </label>
                  <div className="node-drawer__children-list">
                    {node.falseBranch.map((child) => (
                      <div key={child.id} className="node-drawer__child-item">
                        <NodeIcon type={child.type} className="node-drawer__child-icon" />
                        <span className="node-drawer__child-name">{child.name}</span>
                        <Badge variant="secondary" className="node-drawer__child-badge">
                          {child.status || "idle"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};
