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
    toast.success(`আপনার ভোট "${label}" সফলভাবে জমা হয়েছে!`, { duration: 3000 });

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

  const options: {
    type: VoteType;
    label: string;
    icon: typeof CheckCircle;
    pct: number;
    count: number;
    color: string;
    bgColor: string;
    lightBg: string;
  }[] = [
    {
      type: "truth",
      label: "সত্য",
      icon: CheckCircle,
      pct: truthPct,
      count: localVotes.truth,
      color: "hsl(var(--vote-truth))",
      bgColor: "hsl(var(--vote-truth))",
      lightBg: "hsl(var(--vote-truth) / 0.12)",
    },
    {
      type: "needProve",
      label: "প্রমাণ চাই",
      icon: HelpCircle,
      pct: proofPct,
      count: localVotes.needProve,
      color: "hsl(var(--vote-proof))",
      bgColor: "hsl(var(--vote-proof))",
      lightBg: "hsl(var(--vote-proof) / 0.12)",
    },
    {
      type: "fake",
      label: "মিথ্যা",
      icon: XCircle,
      pct: fakePct,
      count: localVotes.fake,
      color: "hsl(var(--vote-fake))",
      bgColor: "hsl(var(--vote-fake))",
      lightBg: "hsl(var(--vote-fake) / 0.12)",
    },
  ];

  // Find the winning option
  const maxPct = Math.max(truthPct, proofPct, fakePct);

  return (
    <div className="w-full space-y-1.5">
      {options.map((opt) => {
        const isActive = voted === opt.type;
        const isWinner = voted && opt.pct === maxPct && opt.pct > 0;
        const Icon = opt.icon;

        return (
          <button
            key={opt.type}
            onClick={(e) => handleVote(opt.type, e)}
            disabled={!!voted}
            className="relative w-full text-left transition-all duration-200"
            style={{ display: "block" }}
          >
            {/* Before voting: clean option style */}
            {!voted ? (
              <div
                className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl border-2 transition-all hover:shadow-sm"
                style={{
                  borderColor: `hsl(var(--border))`,
                  background: "hsl(var(--card))",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = opt.color;
                  e.currentTarget.style.background = opt.lightBg;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "hsl(var(--border))";
                  e.currentTarget.style.background = "hsl(var(--card))";
                }}
              >
                <Icon className="w-5 h-5 shrink-0" style={{ color: opt.color }} />
                <span className="text-sm font-semibold font-display flex-1" style={{ color: "hsl(var(--foreground))" }}>
                  {opt.label}
                </span>
                <span className="text-xs font-medium" style={{ color: "hsl(var(--muted-foreground))" }}>
                  {opt.count}
                </span>
              </div>
            ) : (
              /* After voting: Facebook poll bar style */
              <div
                className="relative overflow-hidden rounded-xl border-2 transition-all"
                style={{
                  borderColor: isActive ? opt.color : "hsl(var(--border))",
                  background: "hsl(var(--card))",
                }}
              >
                {/* Percentage fill bar */}
                <div
                  className="absolute inset-y-0 left-0 transition-all duration-700 ease-out rounded-xl"
                  style={{
                    width: `${opt.pct}%`,
                    background: isActive ? opt.bgColor : opt.lightBg,
                    opacity: isActive ? 0.15 : 0.6,
                  }}
                />

                <div className="relative flex items-center gap-2.5 px-4 py-2.5">
                  {isActive && (
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                      style={{ background: opt.bgColor }}
                    >
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M2.5 6L5 8.5L9.5 3.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  )}
                  {!isActive && (
                    <Icon className="w-5 h-5 shrink-0" style={{ color: opt.color, opacity: 0.5 }} />
                  )}

                  <span
                    className="text-sm font-display flex-1"
                    style={{
                      fontWeight: isWinner || isActive ? 700 : 500,
                      color: isActive ? opt.color : "hsl(var(--foreground))",
                    }}
                  >
                    {opt.label}
                  </span>

                  <span
                    className="text-sm font-bold tabular-nums"
                    style={{
                      color: isActive ? opt.color : "hsl(var(--muted-foreground))",
                    }}
                  >
                    {opt.pct}%
                  </span>
                </div>
              </div>
            )}
          </button>
        );
      })}

      {/* Total votes footer */}
      {voted && total > 0 && (
        <p className="text-xs text-muted-foreground text-right pt-0.5 pr-1">
          {total} জন ভোট দিয়েছেন
        </p>
      )}
    </div>
  );
}
