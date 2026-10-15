import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { type ReactNode, useRef } from "react";
import { useOverlay } from "./useOverlay";

interface SheetProps {
  open: boolean;
  onClose: () => void;
  title: string;
  /** Line below the title (e.g. form and date). */
  subtitle?: ReactNode;
  children: ReactNode;
}

/** Right side panel for opening an existing item; full screen on mobile. */
export function Sheet({ open, onClose, title, subtitle, children }: SheetProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  useOverlay(open, onClose, panelRef);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <motion.div
            className="absolute inset-0 bg-ink/40 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            tabIndex={-1}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex h-full w-full flex-col bg-white shadow-premium outline-none sm:max-w-lg"
          >
            <div className="flex items-start justify-between gap-4 px-6 pb-4 pt-6">
              <div className="min-w-0">
                <h2 className="truncate font-display text-2xl font-medium text-ink">{title}</h2>
                {subtitle && <div className="mt-2">{subtitle}</div>}
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Fechar"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sand-100 text-ink transition-colors hover:bg-sand-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
              >
                <X className="h-5 w-5" strokeWidth={1.75} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
