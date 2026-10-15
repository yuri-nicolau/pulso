import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check, ChevronDown, X } from "lucide-react";
import {
  type KeyboardEvent,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import { findByTypeahead, nextListIndex } from "../../utils/listbox";

export interface SelectOption<V extends string> {
  value: V;
  label: string;
  /** Tailwind class (e.g. "bg-orange-500") for a colored dot, matching the badges. */
  dotClassName?: string;
  /** How many items this option would show, displayed at the right. */
  count?: number;
}

interface SelectProps<V extends string> {
  /** Visible name of the field ("Status"), always shown on the trigger. */
  label: string;
  value: V;
  onChange: (value: V) => void;
  options: SelectOption<V>[];
  /** The "no filter" value: the trigger shows only the label and offers no clear button. */
  resetValue?: V;
}

const TYPEAHEAD_RESET_MS = 600;

/**
 * Accessible single-select dropdown (listbox pattern). A popover under the trigger from `sm` up,
 * a bottom sheet on phones. Keyboard: arrows, Home/End, type-to-jump, Enter/Space to pick,
 * Escape to close.
 */
export function Select<V extends string>({
  label,
  value,
  onChange,
  options,
  resetValue,
}: SelectProps<V>) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [alignRight, setAlignRight] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 640px)");
  const reduceMotion = useReducedMotion();
  const id = useId();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const typeahead = useRef({
    query: "",
    timer: undefined as ReturnType<typeof setTimeout> | undefined,
  });

  const selectedIndex = options.findIndex((option) => option.value === value);
  const selected = options[selectedIndex];
  const isFiltered = resetValue !== undefined && value !== resetValue;
  const optionId = (index: number) => `${id}-option-${index}`;

  const close = useCallback((returnFocus = true) => {
    setOpen(false);
    if (returnFocus) triggerRef.current?.focus();
  }, []);

  function openList(highlight: number = selectedIndex) {
    setActiveIndex(highlight >= 0 ? highlight : 0);
    setOpen(true);
  }

  function pick(index: number) {
    const option = options[index];
    if (option) onChange(option.value);
    close();
  }

  // Focus the list when it opens so the keyboard drives it right away.
  useEffect(() => {
    if (open) listRef.current?.focus();
  }, [open]);

  // Keep the highlighted option visible while moving through a long list.
  useEffect(() => {
    if (open && activeIndex >= 0) {
      document.getElementById(optionId(activeIndex))?.scrollIntoView({ block: "nearest" });
    }
  });

  // Desktop popover: open towards the left when there's no room on the right.
  useLayoutEffect(() => {
    if (!open || !isDesktop) return;
    const panel = panelRef.current;
    if (!panel) return;
    const wrapper = wrapperRef.current?.getBoundingClientRect();
    if (!wrapper) return;
    setAlignRight(wrapper.left + panel.offsetWidth > window.innerWidth - 16);
  }, [open, isDesktop]);

  // Desktop: a click outside closes. Phones: the backdrop handles it and the page doesn't scroll.
  useEffect(() => {
    if (!open) return;
    if (isDesktop) {
      const onPointerDown = (event: PointerEvent) => {
        if (!wrapperRef.current?.contains(event.target as Node)) close(false);
      };
      document.addEventListener("pointerdown", onPointerDown);
      return () => document.removeEventListener("pointerdown", onPointerDown);
    }
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open, isDesktop, close]);

  function handleTriggerKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      openList(event.key === "ArrowUp" && selectedIndex < 0 ? options.length - 1 : selectedIndex);
    }
  }

  function handleListKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const next = nextListIndex(activeIndex, event.key, options.length);
    if (next !== null) {
      event.preventDefault();
      setActiveIndex(next);
      return;
    }
    switch (event.key) {
      case "Enter":
      case " ":
        event.preventDefault();
        if (activeIndex >= 0) pick(activeIndex);
        return;
      case "Escape":
        event.preventDefault();
        close();
        return;
      case "Tab":
        close(false);
        return;
    }
    if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
      const state = typeahead.current;
      clearTimeout(state.timer);
      state.query += event.key;
      state.timer = setTimeout(() => {
        state.query = "";
      }, TYPEAHEAD_RESET_MS);
      const labels = options.map((option) => option.label);
      // A fresh query searches after the current option; a growing one may stay on it.
      const from = state.query.length === 1 ? activeIndex : activeIndex - 1;
      const match = findByTypeahead(labels, state.query, from);
      if (match >= 0) setActiveIndex(match);
    }
  }

  const list = (
    <div
      ref={listRef}
      id={`${id}-list`}
      role="listbox"
      tabIndex={-1}
      aria-labelledby={`${id}-label`}
      aria-activedescendant={activeIndex >= 0 ? optionId(activeIndex) : undefined}
      onKeyDown={handleListKeyDown}
      className="max-h-[min(22rem,60vh)] overflow-y-auto overscroll-contain outline-none"
    >
      {options.map((option, index) => {
        const isSelected = index === selectedIndex;
        const isActive = index === activeIndex;
        return (
          // biome-ignore lint/a11y/useKeyWithClickEvents: the listbox handles the keyboard (aria-activedescendant).
          <div
            key={option.value}
            id={optionId(index)}
            role="option"
            tabIndex={-1}
            aria-selected={isSelected}
            onClick={() => pick(index)}
            onMouseMove={() => setActiveIndex(index)}
            className={`flex cursor-pointer select-none items-center gap-3 rounded-xl px-3 py-3 text-sm text-ink sm:py-2.5 ${
              isActive ? "bg-sand-100" : ""
            } ${isSelected ? "font-semibold" : ""}`}
          >
            <span
              aria-hidden="true"
              className={`h-2 w-2 shrink-0 rounded-full ${option.dotClassName ?? "bg-transparent"}`}
            />
            <span className="flex-1 whitespace-nowrap">{option.label}</span>
            {option.count !== undefined && (
              <span className="min-w-6 text-right text-xs tabular-nums text-ink-muted">
                {option.count}
              </span>
            )}
            <Check
              aria-hidden="true"
              className={`h-4 w-4 shrink-0 ${isSelected ? "text-ink" : "invisible"}`}
              strokeWidth={2.25}
            />
          </div>
        );
      })}
    </div>
  );

  return (
    <div ref={wrapperRef} className="relative">
      <div
        className={`flex items-center rounded-full transition-colors ${
          isFiltered ? "bg-ink text-white" : "bg-sand-100 text-ink hover:bg-sand-200"
        }`}
      >
        <button
          ref={triggerRef}
          type="button"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={open ? `${id}-list` : undefined}
          onClick={() => (open ? close(false) : openList())}
          onKeyDown={handleTriggerKeyDown}
          className={`flex min-h-10 items-center gap-2 rounded-full py-2 pl-4 text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-orange-500 ${
            isFiltered ? "pr-1" : "pr-3"
          }`}
        >
          <span id={`${id}-label`} className={isFiltered ? "text-white/70" : ""}>
            {label}
            {isFiltered && ":"}
          </span>
          {isFiltered && selected && (
            <span className="flex items-center gap-1.5">
              {selected.dotClassName && (
                <span
                  aria-hidden="true"
                  className={`h-2 w-2 rounded-full ${selected.dotClassName}`}
                />
              )}
              {selected.label}
            </span>
          )}
          <ChevronDown
            aria-hidden="true"
            className={`h-4 w-4 transition-transform duration-200 ${open ? "rotate-180" : ""} ${
              isFiltered ? "text-white/80" : "text-ink-muted"
            }`}
          />
        </button>
        {isFiltered && (
          <button
            type="button"
            onClick={() => {
              if (resetValue !== undefined) onChange(resetValue);
              triggerRef.current?.focus();
            }}
            aria-label={`Limpar filtro de ${label.toLowerCase()}`}
            className="mr-1 flex h-8 w-8 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/15 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        )}
      </div>

      <AnimatePresence>
        {open &&
          (isDesktop ? (
            <motion.div
              ref={panelRef}
              key="popover"
              initial={{ opacity: 0, y: reduceMotion ? 0 : -4, scale: reduceMotion ? 1 : 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: reduceMotion ? 0 : -4, scale: reduceMotion ? 1 : 0.98 }}
              transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
              className={`absolute top-full z-30 mt-2 w-max min-w-full max-w-[20rem] origin-top rounded-2xl bg-white p-1.5 shadow-premium ${
                alignRight ? "right-0" : "left-0"
              }`}
            >
              {list}
            </motion.div>
          ) : (
            <div key="sheet" className="fixed inset-0 z-50 flex items-end">
              <motion.div
                aria-hidden="true"
                className="absolute inset-0 bg-ink/40"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => close()}
              />
              <motion.div
                initial={{ y: reduceMotion ? 0 : "100%", opacity: reduceMotion ? 0 : 1 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: reduceMotion ? 0 : "100%", opacity: reduceMotion ? 0 : 1 }}
                transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                className="relative w-full rounded-t-3xl bg-white px-3 pb-[max(1rem,env(safe-area-inset-bottom))] pt-2 shadow-premium"
              >
                <div
                  aria-hidden="true"
                  className="mx-auto mb-2 h-1 w-10 rounded-full bg-sand-300"
                />
                <p className="px-3 pb-2 pt-1 font-display text-lg font-medium text-ink">{label}</p>
                {list}
              </motion.div>
            </div>
          ))}
      </AnimatePresence>
    </div>
  );
}
