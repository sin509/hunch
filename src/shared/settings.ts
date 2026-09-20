import browser from "webextension-polyfill";

export interface Settings {
  apiKey: string;
  model: string;
}

export const DEFAULT_SETTINGS: Settings = { apiKey: "", model: "jev-latest" };

export async function loadSettings(): Promise<Settings> {
  const stored = (await browser.storage.local.get("settings")) as { settings?: Partial<Settings> };
  return { ...DEFAULT_SETTINGS, ...stored.settings };
}

export function saveSettings(s: Settings): Promise<void> {
  return browser.storage.local.set({ settings: s });
}

export const API_ORIGIN = { origins: ["https://api.typesafe.ai/*"] };

export const hasApiAccess = () => browser.permissions.contains(API_ORIGIN);
export const requestApiAccess = () => browser.permissions.request(API_ORIGIN);
