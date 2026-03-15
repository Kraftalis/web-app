"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { IconSearch, IconX } from "@/components/icons";
import { useDictionary } from "@/i18n";

/**
 * SearchButton — expandable search button with ⌘K shortcut.
 * Opens a search overlay/input when clicked or when ⌘K is pressed.
 */

export default function SearchButton() {
  const { dict } = useDictionary();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
  }, []);

  // ⌘K / Ctrl+K keyboard shortcut
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        close();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [close]);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  // Click outside to close
  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (
        overlayRef.current &&
        !overlayRef.current.contains(e.target as Node)
      ) {
        close();
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open, close]);

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm text-slate-400 transition-colors hover:bg-slate-100"
        aria-label={dict.common.search}
      >
        <IconSearch size={16} />
        <span className="hidden sm:inline">
          {dict.topbar.searchPlaceholder}
        </span>
        <kbd className="ml-2 hidden rounded bg-white px-1.5 py-0.5 text-[10px] font-medium text-slate-400 shadow-sm ring-1 ring-slate-200 sm:inline">
          ⌘K
        </kbd>
      </button>

      {/* Search Overlay */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />

          {/* Search Panel */}
          <div
            ref={overlayRef}
            className="relative z-10 w-full max-w-lg rounded-xl border border-slate-200 bg-white shadow-2xl"
          >
            {/* Search Input */}
            <div className="flex items-center gap-3 border-b border-slate-100 px-4 py-3">
              <IconSearch size={18} className="text-slate-400" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={dict.topbar.searchPlaceholderLong}
                className="flex-1 bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="rounded p-0.5 text-slate-400 hover:text-slate-600"
                >
                  <IconX size={14} />
                </button>
              )}
              <kbd className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-400">
                ESC
              </kbd>
            </div>

            {/* Results Area */}
            <div className="max-h-72 overflow-y-auto px-2 py-2">
              {!query ? (
                <div className="px-3 py-8 text-center">
                  <p className="text-sm text-slate-400">
                    {dict.topbar.startTyping}
                  </p>
                </div>
              ) : (
                <div className="px-3 py-8 text-center">
                  <p className="text-sm text-slate-500">
                    {dict.topbar.noResults} &ldquo;{query}&rdquo;
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    {dict.topbar.tryDifferent}
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-slate-100 px-4 py-2">
              <div className="flex items-center gap-3 text-[11px] text-slate-400">
                <span>
                  <kbd className="rounded bg-slate-100 px-1 py-0.5 font-mono text-[10px]">
                    ↑↓
                  </kbd>{" "}
                  {dict.topbar.navigate}
                </span>
                <span>
                  <kbd className="rounded bg-slate-100 px-1 py-0.5 font-mono text-[10px]">
                    ↵
                  </kbd>{" "}
                  {dict.topbar.select}
                </span>
              </div>
              <button
                onClick={close}
                className="text-[11px] text-slate-400 hover:text-slate-600"
              >
                {dict.common.close}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
