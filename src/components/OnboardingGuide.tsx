import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight, ChevronLeft } from "lucide-react";

interface GuideStep {
  icon: string;
  title: string;
  description: string;
}

interface OnboardingGuideProps {
  pageKey: string;
  steps: GuideStep[];
}

const STORAGE_KEY = "onboarding_seen";

function getSeenPages(): string[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function markSeen(pageKey: string) {
  const seen = getSeenPages();
  if (!seen.includes(pageKey)) {
    seen.push(pageKey);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seen));
  }
}

export function OnboardingGuide({ pageKey, steps }: OnboardingGuideProps) {
  const [visible, setVisible] = useState(false);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const seen = getSeenPages();
    if (!seen.includes(pageKey)) {
      const timer = setTimeout(() => setVisible(true), 600);
      return () => clearTimeout(timer);
    }
  }, [pageKey]);

  const handleClose = () => {
    setVisible(false);
    markSeen(pageKey);
  };

  const handleNext = () => {
    if (current < steps.length - 1) {
      setCurrent((c) => c + 1);
    } else {
      handleClose();
    }
  };

  const handlePrev = () => {
    setCurrent((c) => Math.max(0, c - 1));
  };

  if (!visible || steps.length === 0) return null;

  const step = steps[current];
  const isLast = current === steps.length - 1;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-card rounded-2xl shadow-2xl border w-full max-w-sm overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Progress dots */}
            <div className="flex justify-center gap-1.5 pt-4 pb-2">
              {steps.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === current ? "w-6 bg-primary" : "w-1.5 bg-muted-foreground/20"
                  }`}
                />
              ))}
            </div>

            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-3 right-3 w-7 h-7 rounded-full bg-muted/80 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.2 }}
                className="px-6 py-4 text-center"
              >
                <div className="text-4xl mb-3">{step.icon}</div>
                <h3 className="font-display font-bold text-lg text-foreground mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Footer */}
            <div className="flex items-center justify-between px-5 pb-5 pt-2">
              <button
                onClick={handlePrev}
                disabled={current === 0}
                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground disabled:opacity-0 transition-all"
              >
                <ChevronLeft className="w-4 h-4" /> পূর্ববর্তী
              </button>

              <button
                onClick={handleNext}
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold font-display hover:opacity-90 transition-opacity"
              >
                {isLast ? "শুরু করুন" : "পরবর্তী"}
                {!isLast && <ChevronRight className="w-4 h-4" />}
              </button>
            </div>

            {/* Skip */}
            {!isLast && (
              <div className="text-center pb-4">
                <button
                  onClick={handleClose}
                  className="text-xs text-muted-foreground/60 hover:text-muted-foreground transition-colors"
                >
                  এড়িয়ে যান
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
