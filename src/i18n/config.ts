/**
 * i18n configuration — supported locales and defaults.
 */

export const defaultLocale = "id" as const;
export const locales = ["en", "id"] as const;

export type Locale = (typeof locales)[number];

/**
 * Get the locale from a cookie value or return the default.
 */
export function getLocaleFromCookie(cookieValue?: string | null): Locale {
  if (cookieValue && locales.includes(cookieValue as Locale)) {
    return cookieValue as Locale;
  }
  return defaultLocale;
}

/**
 * Locale display names.
 */
export const localeNames: Record<Locale, string> = {
  en: "English",
  id: "Bahasa Indonesia",
};

/**
 * Locale flag emojis for the switcher.
 */
export const localeFlags: Record<Locale, string> = {
  en: "🇬🇧",
  id: "🇮🇩",
};
