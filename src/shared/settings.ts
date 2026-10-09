import { type ModelCard, TypeSafeClient } from "@typesafe-ai/sdk";
import browser from "webextension-polyfill";

export interface Settings {
  apiKey: string;
  model: string;
  baseURL: string;
}

export const DEFAULT_API_HOST = "https://api.typesafe.ai";

export const DEFAULT_SETTINGS: Settings = { apiKey: "", model: "jev-latest", baseURL: "" };

export async function loadSettings(): Promise<Settings> {
  const stored = (await browser.storage.local.get("settings")) as { settings?: Partial<Settings> };
  return { ...DEFAULT_SETTINGS, ...stored.settings };
}

export function saveSettings(s: Settings): Promise<void> {
  return browser.storage.local.set({ settings: s });
}

/** Match pattern for permissions APIs, or a short error if the custom URL is unusable. */
export function apiOriginPermission(baseURL: string): { origins: string[] } | { error: string } {
  const trimmed = baseURL.trim();
  if (!trimmed) return { origins: [`${DEFAULT_API_HOST}/*`] };
  try {
    const { origin, protocol } = new URL(trimmed);
    if (origin === "null" || (protocol !== "https:" && protocol !== "http:")) {
      return { error: "API base URL must be an http(s) URL." };
    }
    return { origins: [`${origin}/*`] };
  } catch {
    return { error: "Invalid API base URL." };
  }
}

export function clientBaseURL(baseURL: string): string | undefined {
  const trimmed = baseURL.trim();
  return trimmed || undefined;
}

export async function hasApiAccess(baseURL: string): Promise<boolean> {
  const perm = apiOriginPermission(baseURL);
  if ("error" in perm) return false;
  return browser.permissions.contains(perm);
}

export async function requestApiAccess(baseURL: string): Promise<boolean> {
  const perm = apiOriginPermission(baseURL);
  if ("error" in perm) return false;
  return browser.permissions.request(perm);
}

export function listModels(settings: Pick<Settings, "apiKey" | "baseURL">): Promise<ModelCard[]> {
  return new TypeSafeClient({
    apiKey: settings.apiKey,
    baseURL: clientBaseURL(settings.baseURL),
    dangerouslyAllowBrowser: true,
  }).models.list();
}
