import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Loader2 } from "lucide-react";

export type SubmitPhase = "idle" | "loading" | "success";

interface ConfirmSubmitButtonProps {
  phase: SubmitPhase;
  idleLabel: string;
  loadingLabel: string;
  successLabel: string;
}

const easeOut = [0.16, 1, 0.3, 1] as const;

// Pulse rings that burst out of the check, like the Pulso circle's heartbeat.
const RING_DELAYS = [0, 0.18, 0.36];

/**
 * Full-width submit button that confirms the send in place: on success it fills with the brand
 * gradient, draws a check and bursts pulse rings before the form gives way to the success state.
 */
export function ConfirmSubmitButton({
  phase,
  idleLabel,
  loadingLabel,
  successLabel,
}: ConfirmSubmitButtonProps) {
  const reduceMotion = useReducedMotion();
  const isSuccess = phase === "success";

  return (
    <motion.button
      type="submit"
      disabled={phase !== "idle"}
      aria-live="polite"
      animate={isSuccess && !reduceMotion ? { scale: [1, 0.96, 1.03, 1] } : { scale: 1 }}
      transition={{ duration: 0.5, ease: easeOut }}
      className="group relative mt-1 inline-flex min-h-14 items-center justify-center overflow-hidden rounded-full bg-ink px-6 py-4 text-base font-medium text-white transition-shadow duration-300 hover:shadow-glow focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 disabled:cursor-default"
    >
      {/* Brand gradient (magenta-600 → orange-700: white text passes AA on both ends). */}
      <motion.span
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-magenta-600 to-orange-700"
        initial={false}
        animate={{ opacity: isSuccess ? 1 : 0 }}
        transition={{ duration: 0.35 }}
      />
      {/* Light sweep across the button when it confirms. */}
      {isSuccess && !reduceMotion && (
        <motion.span
          aria-hidden="true"
          className="absolute inset-y-0 w-1/3 -skew-x-12 bg-white/25 blur-md"
          initial={{ left: "-40%" }}
          animate={{ left: "120%" }}
          transition={{ duration: 0.9, ease: "easeInOut", delay: 0.15 }}
        />
      )}

      <AnimatePresence mode="wait" initial={false}>
        {phase === "idle" && (
          <motion.span
            key="idle"
            className="relative flex items-center gap-2"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {idleLabel}
            <ArrowRight
              className="h-5 w-5 text-orange-400 transition-transform duration-300 group-hover:translate-x-1"
              aria-hidden="true"
            />
          </motion.span>
        )}

        {phase === "loading" && (
          <motion.span
            key="loading"
            className="relative flex items-center gap-2"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
            {loadingLabel}
          </motion.span>
        )}

        {isSuccess && (
          <motion.span
            key="success"
            className="relative flex items-center gap-3 font-semibold"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: easeOut }}
          >
            <span className="relative flex h-8 w-8 items-center justify-center">
              {!reduceMotion &&
                RING_DELAYS.map((delay) => (
                  <motion.span
                    key={delay}
                    aria-hidden="true"
                    className="absolute inset-0 rounded-full border-2 border-white"
                    initial={{ scale: 0.6, opacity: 0.9 }}
                    animate={{ scale: 2.6, opacity: 0 }}
                    transition={{ duration: 1, delay: 0.2 + delay, ease: "easeOut" }}
                  />
                ))}
              <motion.span
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20"
                initial={{ scale: reduceMotion ? 1 : 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 420, damping: 18 }}
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                  <motion.path
                    d="M5 12.5l4.5 4.5L19 7.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.75}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: reduceMotion ? 1 : 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.45, delay: 0.15, ease: "easeOut" }}
                  />
                </svg>
              </motion.span>
            </span>
            {successLabel}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
