import { useState } from "react";
import { motion } from "framer-motion";
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

  const buttons: { type: VoteType; label: string; icon: typeof CheckCircle; emoji: string; gradient: string; activeGradient: string; borderColor: string }[] = [
    {
      type: "truth",
      label: "সত্য",
      icon: CheckCircle,
      emoji: "✅",
      gradient: "from-emerald-50 to-green-50 border-emerald-200 text-emerald-700 hover:from-emerald-100 hover:to-green-100 hover:border-emerald-300",
      activeGradient: "from-emerald-500 to-green-600 text-white border-emerald-600 shadow-emerald-200",
      borderColor: "border-emerald-200",
    },
    {
      type: "needProve",
      label: "প্রমাণ চাই",
      icon: HelpCircle,
      emoji: "🔍",
      gradient: "from-blue-50 to-indigo-50 border-blue-200 text-blue-700 hover:from-blue-100 hover:to-indigo-100 hover:border-blue-300",
      activeGradient: "from-blue-500 to-indigo-600 text-white border-blue-600 shadow-blue-200",
      borderColor: "border-blue-200",
    },
    {
      type: "fake",
      label: "মিথ্যা",
      icon: XCircle,
      emoji: "❌",
      gradient: "from-red-50 to-rose-50 border-red-200 text-red-700 hover:from-red-100 hover:to-rose-100 hover:border-red-300",
      activeGradient: "from-red-500 to-rose-600 text-white border-red-600 shadow-red-200",
      borderColor: "border-red-200",
    },
  ];

  return (
    <div className="flex gap-2 w-full">
      {buttons.map((b) => {
        const isActive = voted === b.type;
        const Icon = b.icon;
        return (
          <motion.button
            key={b.type}
            whileTap={{ scale: 0.93 }}
            whileHover={!voted ? { scale: 1.03, y: -1 } : undefined}
            onClick={(e) => handleVote(b.type, e)}
            disabled={!!voted}
            className={`flex-1 flex flex-col items-center gap-0.5 px-2 py-2.5 rounded-xl border bg-gradient-to-br text-xs font-semibold transition-all duration-200 ${
              isActive
                ? `${b.activeGradient} shadow-lg`
                : voted
                ? "opacity-40 from-gray-50 to-gray-100 border-gray-200 text-gray-400 cursor-default"
                : b.gradient
            }`}
          >
            <span className="text-base leading-none">{b.emoji}</span>
            <span className="font-display text-[11px] leading-tight">{b.label}</span>
            <span className={`text-[10px] font-bold ${isActive ? "opacity-90" : "opacity-70"}`}>
              {localVotes[b.type]}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}
