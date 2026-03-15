export {
  defaultLocale,
  locales,
  localeNames,
  localeFlags,
  getLocaleFromCookie,
} from "./config";
export type { Locale } from "./config";
export type { Dictionary } from "./dictionaries/en";
export { getDictionary } from "./get-dictionary";
export { I18nProvider, useDictionary } from "./provider";
