import type { Locale } from "./config";
import type { Dictionary } from "./dictionaries/en";

/**
 * Dynamically load a dictionary by locale.
 * Uses dynamic import so only the requested locale is bundled.
 */
const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  en: () => import("./dictionaries/en").then((m) => m.default),
  id: () => import("./dictionaries/id").then((m) => m.default),
};

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  return dictionaries[locale]();
}
