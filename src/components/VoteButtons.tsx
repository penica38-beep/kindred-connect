import { useState } from "react";
import { CheckCircle, HelpCircle, XCircle } from "lucide-react";
import { toast } from "sonner";
import type { VoteType } from "@/lib/types";
import { voteReport, getVotedReports, setVotedReport } from "@/lib/reports";

interface VoteButtonsProps {
  reportId: string;
  votes: { truth: number; needProve: number; fake: number };
}

export function VoteButtons({ reportId, votes }: VoteButtonsProps) {
  const [voted, setVoted] = useState<VoteType | null>(
    getVotedReports()[reportId] || null
  );
  const [localVotes, setLocalVotes] = useState(votes);

  const handleVote = async (type: VoteType, e: React.MouseEvent) => {
    e.stopPropagation();
    if (voted) return;
    setVoted(type);
    setLocalVotes((v) => ({ ...v, [type]: v[type] + 1 }));
    setVotedReport(reportId, type);

    const label = type === "truth" ? "✅ সত্য" : type === "needProve" ? "🔍 প্রমাণ চাই" : "❌ মিথ্যা";
    toast.success(`আপনার ভোট "${label}" সফলভাবে জমা হয়েছে!`, {
      duration: 3000,
    });

    try {
      await voteReport(reportId, type);
    } catch (err) {
      console.error("Vote failed", err);
    }
  };

  const total = localVotes.truth + localVotes.needProve + localVotes.fake;

  const buttons: { type: VoteType; label: string; emoji: string; icon: typeof CheckCircle; colorClass: string; activeClass: string; barColor: string }[] = [
    {
      type: "truth",
      label: "সত্য",
      emoji: "✅",
      icon: CheckCircle,
      colorClass: "border-vote-truth/40 text-vote-truth hover:bg-vote-truth/10 hover:border-vote-truth",
      activeClass: "bg-vote-truth text-vote-truth-foreground border-vote-truth shadow-md shadow-vote-truth/25",
      barColor: "bg-vote-truth",
    },
    {
      type: "needProve",
      label: "প্রমাণ চাই",
      emoji: "🔍",
      icon: HelpCircle,
      colorClass: "border-vote-proof/40 text-vote-proof hover:bg-vote-proof/10 hover:border-vote-proof",
      activeClass: "bg-vote-proof text-vote-proof-foreground border-vote-proof shadow-md shadow-vote-proof/25",
      barColor: "bg-vote-proof",
    },
    {
      type: "fake",
      label: "মিথ্যা",
      emoji: "❌",
      icon: XCircle,
      colorClass: "border-vote-fake/40 text-vote-fake hover:bg-vote-fake/10 hover:border-vote-fake",
      activeClass: "bg-vote-fake text-vote-fake-foreground border-vote-fake shadow-md shadow-vote-fake/25",
      barColor: "bg-vote-fake",
    },
  ];

  return (
    <div className="space-y-2">
      <div className="flex gap-2 w-full">
        {buttons.map((b) => {
          const isActive = voted === b.type;
          const Icon = b.icon;
          const pct = total > 0 ? Math.round((localVotes[b.type] / total) * 100) : 0;
          return (
            <button
              key={b.type}
              onClick={(e) => handleVote(b.type, e)}
              disabled={!!voted}
              className={`flex-1 relative flex flex-col items-center gap-1 px-2 py-2.5 rounded-xl border-2 text-xs font-semibold transition-all duration-200 overflow-hidden ${
                isActive
                  ? b.activeClass
                  : voted
                  ? "opacity-40 border-border text-muted-foreground cursor-default"
                  : b.colorClass
              }`}
              style={{ transform: isActive ? "scale(1.02)" : "scale(1)" }}
            >
              <div className="flex items-center gap-1">
                <Icon className="w-4 h-4 shrink-0" />
                <span className="font-display">{b.label}</span>
              </div>
              <span className="text-[11px] font-bold opacity-90">{localVotes[b.type]}</span>
              {voted && total > 0 && (
                <span className="text-[10px] opacity-70">{pct}%</span>
              )}
            </button>
          );
        })}
      </div>
      {voted && total > 0 && (
        <div className="flex h-1.5 rounded-full overflow-hidden bg-muted">
          {buttons.map((b) => {
            const pct = Math.round((localVotes[b.type] / total) * 100);
            return pct > 0 ? (
              <div
                key={b.type}
                className={`${b.barColor} transition-all duration-500`}
                style={{ width: `${pct}%` }}
              />
            ) : null;
          })}
        </div>
      )}
    </div>
  );
}
