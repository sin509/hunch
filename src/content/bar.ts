import { element } from "./element";

export interface BarHandlers {
  onQuery(query: string): void;
  onStep(dir: 1 | -1): void;
  onClose(): void;
}

export interface Status {
  counter?: string;
  verdict?: { text: string; tone: "found" | "absent" | "busy" | "error" | "none" };
  meta?: string;
  progress?: { done: number; total: number };
}

export class FindBar {
  readonly root: HTMLElement;
  private readonly input: HTMLInputElement;
  private readonly counter: HTMLElement;
  private readonly verdict: HTMLElement;
  private readonly meta: HTMLElement;
  private readonly progress: HTMLElement;

  constructor(handlers: BarHandlers) {
    this.input = element("input", {
      class: "hunch-input",
      type: "text",
      placeholder: "What are you looking for?",
      spellcheck: "false",
      autocomplete: "off",
    });
    this.counter = element("span", { class: "hunch-counter" });
    this.verdict = element("span", { class: "hunch-verdict" });
    this.meta = element("span", { class: "hunch-meta" });
    this.progress = element("div", { class: "hunch-progress-fill" });
    const prev = element("button", { class: "hunch-nav", title: "Previous (Shift+Enter)" }, "▲");
    const next = element("button", { class: "hunch-nav", title: "Next (Enter)" }, "▼");
    const close = element("button", { class: "hunch-close", title: "Close (Esc)" }, "✕");
    this.root = element(
      "div",
      { class: "hunch-bar", role: "search" },
      this.input,
      this.counter,
      prev,
      next,
      this.verdict,
      this.meta,
      close,
      element("div", { class: "hunch-progress" }, this.progress),
    );

    close.addEventListener("click", handlers.onClose);
    prev.addEventListener("click", () => handlers.onStep(-1));
    next.addEventListener("click", () => handlers.onStep(1));
    this.input.addEventListener("input", () => handlers.onQuery(this.input.value.trim()));
    this.input.addEventListener("keydown", (e) => {
      if (e.key === "Escape") handlers.onClose();
      else if (e.key === "Enter") {
        e.preventDefault();
        handlers.onStep(e.shiftKey ? -1 : 1);
      }
    });
  }

  focus() {
    this.input.focus();
    this.input.select();
  }

  set(status: Status) {
    if (status.counter !== undefined) this.counter.textContent = status.counter;
    if (status.meta !== undefined) this.meta.textContent = status.meta;
    if (status.verdict) {
      this.verdict.textContent = status.verdict.text;
      this.verdict.className = `hunch-verdict hunch-${status.verdict.tone}`;
    }
    if (status.progress) {
      const { done, total } = status.progress;
      this.progress.style.width = total ? `${Math.round((done / total) * 100)}%` : "0";
      this.progress.parentElement!.classList.toggle("hunch-active", total > 0 && done < total);
    }
  }
}
