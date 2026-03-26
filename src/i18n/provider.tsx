"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { Dictionary } from "./dictionaries/en";
import type { Locale } from "./config";
import id from "./dictionaries/id";

/**
 * Context holding the current dictionary + locale.
 */
interface I18nContextValue {
  dict: Dictionary;
  locale: Locale;
}

const I18nContext = createContext<I18nContextValue>({
  dict: id,
  locale: "id",
});

/**
 * Provider that wraps the app with the active dictionary.
 */
export function I18nProvider({
  children,
  dict,
  locale,
}: {
  children: ReactNode;
  dict: Dictionary;
  locale: Locale;
}) {
  return (
    <I18nContext.Provider value={{ dict, locale }}>
      {children}
    </I18nContext.Provider>
  );
}

/**
 * Hook to access the current dictionary and locale from client components.
 */
export function useDictionary(): I18nContextValue {
  return useContext(I18nContext);
}
