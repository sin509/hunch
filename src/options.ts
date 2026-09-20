import browser from "webextension-polyfill";
import { DEFAULT_SETTINGS, hasApiAccess, loadSettings, requestApiAccess, saveSettings } from "./shared/settings";
import { commandShortcutFromEvent, resetShortcut, setShortcut, shortcutLabel } from "./shared/shortcut";

const field = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;
const apiKey = field<HTMLInputElement>("apiKey");
const model = field<HTMLInputElement>("model");
const banner = field("nokey");
const saved = field("saved");

function showKeyBanner(hasKey: boolean) {
  banner.style.display = hasKey ? "none" : "block";
  if (!hasKey) apiKey.focus();
}

const shortcut = field<HTMLInputElement>("shortcut");
const shortcutNote = field("shortcutNote");

async function showShortcut(note = "") {
  shortcut.value = await shortcutLabel();
  shortcutNote.textContent = note;
}

async function recordShortcut(e: KeyboardEvent) {
  e.preventDefault();
  if (["Control", "Alt", "Shift", "Meta"].includes(e.key)) return; // wait for the real key
  const mac = (await browser.runtime.getPlatformInfo()).os === "mac";
  const combo = commandShortcutFromEvent(e, mac);
  if (!combo) return void showShortcut("Use Ctrl, Alt or Cmd together with a letter, number or function key.");
  try {
    await setShortcut(combo);
    await showShortcut("Saved");
  } catch (err) {
    await showShortcut(err instanceof Error ? err.message : "Firefox refused that shortcut.");
  }
  shortcut.blur();
}

shortcut.addEventListener("focus", () => (shortcut.value = "press keys…"));
shortcut.addEventListener("blur", () => void showShortcut(shortcutNote.textContent ?? ""));
shortcut.addEventListener("keydown", (e) => void recordShortcut(e));
field("resetShortcut").addEventListener("click", async () => {
  await resetShortcut();
  await showShortcut("Back to the default");
});

async function load() {
  await showShortcut();
  const s = await loadSettings();
  apiKey.value = s.apiKey;
  model.value = s.model;
  showKeyBanner(Boolean(s.apiKey));
}

async function save() {
  const s = {
    apiKey: apiKey.value.trim(),
    model: model.value.trim() || DEFAULT_SETTINGS.model,
  };
  await saveSettings(s);

  if (!(await hasApiAccess())) await requestApiAccess();
  showKeyBanner(Boolean(s.apiKey));
  saved.textContent = "Saved";
  setTimeout(() => (saved.textContent = ""), 1500);
}

field("save").addEventListener("click", () => void save());
void load();
