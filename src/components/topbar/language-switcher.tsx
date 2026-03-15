"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useDictionary } from "@/i18n";
import { locales, localeNames, localeFlags, type Locale } from "@/i18n/config";
import { setLocaleCookie } from "@/components/topbar/actions";

/**
 * LanguageSwitcher — dropdown to switch between supported locales.
 * Stores the preference in a cookie (`NEXT_LOCALE`) via server action and reloads.
 */
export default function LanguageSwitcher() {
  const { locale } = useDictionary();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => setOpen(false), []);

  // Click outside to close
  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        close();
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open, close]);

  const switchLocale = async (newLocale: Locale) => {
    close();
    await setLocaleCookie(newLocale);
    router.refresh();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50"
        aria-label="Switch language"
      >
        <span>{localeFlags[locale]}</span>
        <span className="hidden sm:inline">{locale.toUpperCase()}</span>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1.5 w-44 rounded-lg border border-slate-200 bg-white shadow-lg">
          {locales.map((l) => (
            <button
              key={l}
              onClick={() => switchLocale(l)}
              className={`flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm transition-colors hover:bg-slate-50 first:rounded-t-lg last:rounded-b-lg ${
                l === locale
                  ? "bg-blue-50 font-medium text-blue-700"
                  : "text-slate-700"
              }`}
            >
              <span>{localeFlags[l]}</span>
              <span>{localeNames[l]}</span>
              {l === locale && <span className="ml-auto text-blue-600">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
