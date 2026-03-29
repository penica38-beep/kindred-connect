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
  const truthPct = total ? Math.round((localVotes.truth / total) * 100) : 0;
  const proofPct = total ? Math.round((localVotes.needProve / total) * 100) : 0;
  const fakePct = total ? Math.round((localVotes.fake / total) * 100) : 0;

  const buttons: {
    type: VoteType;
    label: string;
    icon: typeof CheckCircle;
    pct: number;
    barColor: string;
    activeText: string;
    activeBg: string;
    inactiveText: string;
    inactiveBorder: string;
  }[] = [
    {
      type: "truth",
      label: "সত্য",
      icon: CheckCircle,
      pct: truthPct,
      barColor: "bg-vote-truth",
      activeText: "text-vote-truth-foreground",
      activeBg: "bg-vote-truth",
      inactiveText: "text-vote-truth",
      inactiveBorder: "border-vote-truth/40 hover:border-vote-truth",
    },
    {
      type: "needProve",
      label: "প্রমাণ চাই",
      icon: HelpCircle,
      pct: proofPct,
      barColor: "bg-vote-proof",
      activeText: "text-vote-proof-foreground",
      activeBg: "bg-vote-proof",
      inactiveText: "text-vote-proof",
      inactiveBorder: "border-vote-proof/40 hover:border-vote-proof",
    },
    {
      type: "fake",
      label: "মিথ্যা",
      icon: XCircle,
      pct: fakePct,
      barColor: "bg-vote-fake",
      activeText: "text-vote-fake-foreground",
      activeBg: "bg-vote-fake",
      inactiveText: "text-vote-fake",
      inactiveBorder: "border-vote-fake/40 hover:border-vote-fake",
    },
  ];

  return (
    <div className="space-y-2 w-full">
      {buttons.map((b) => {
        const isActive = voted === b.type;
        const Icon = b.icon;
        return (
          <button
            key={b.type}
            onClick={(e) => handleVote(b.type, e)}
            disabled={!!voted}
            className={`relative w-full flex items-center gap-2.5 px-4 py-3 rounded-xl border-2 text-sm font-semibold transition-all overflow-hidden ${
              isActive
                ? `${b.activeBg} ${b.activeText} border-transparent shadow-md`
                : voted
                ? "opacity-40 border-border text-muted-foreground cursor-default"
                : `${b.inactiveText} ${b.inactiveBorder} bg-card hover:shadow-sm`
            }`}
          >
            {/* Percentage bar background */}
            {voted && !isActive && (
              <div
                className={`absolute inset-y-0 left-0 ${b.barColor} opacity-10 transition-all duration-500`}
                style={{ width: `${b.pct}%` }}
              />
            )}
            {isActive && (
              <div
                className="absolute inset-y-0 left-0 bg-white/15 transition-all duration-500"
                style={{ width: `${b.pct}%` }}
              />
            )}
            <Icon className="w-5 h-5 shrink-0 relative z-10" />
            <span className="font-display relative z-10 flex-1 text-left">{b.label}</span>
            <span className="relative z-10 text-xs font-bold opacity-90">
              {voted ? `${b.pct}%` : localVotes[b.type]}
            </span>
          </button>
        );
      })}
      {voted && total > 0 && (
        <div className="flex items-center gap-1.5">
          <div className="flex-1 h-2 rounded-full overflow-hidden bg-muted flex">
            {truthPct > 0 && <div className="bg-vote-truth transition-all duration-500" style={{ width: `${truthPct}%` }} />}
            {proofPct > 0 && <div className="bg-vote-proof transition-all duration-500" style={{ width: `${proofPct}%` }} />}
            {fakePct > 0 && <div className="bg-vote-fake transition-all duration-500" style={{ width: `${fakePct}%` }} />}
          </div>
          <span className="text-[10px] text-muted-foreground whitespace-nowrap">{total} ভোট</span>
        </div>
      )}
    </div>
  );
}
