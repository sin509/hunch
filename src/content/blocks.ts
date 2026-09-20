import { type Block, blockId } from "../shared/protocol";
import { MAX_BLOCK_CHARS, MIN_BLOCK_CHARS } from "../shared/questions";

export interface PageBlock extends Block {
  el: HTMLElement;
}

type Candidate = { text: string; el: HTMLElement };

export function extractBlocks(): PageBlock[] {
  return uniqueBy(textBlocks(document.body), (c) => c.text)
    .filter((c) => c.text.length >= MIN_BLOCK_CHARS)
    .flatMap((c) => splitAtBlockLimit(c.text).map((text) => ({ text, el: c.el })))
    .map((c, i) => ({ id: blockId(i + 1), ...c }));
}

function textBlocks(el: HTMLElement): Candidate[] {
  if (el.isContentEditable || !el.checkVisibility()) return [];
  const display = getComputedStyle(el).display;
  if (display === "table-row") return [{ text: [...el.children].map(fullText).filter(Boolean).join(" | "), el }];
  const children = [...el.children].filter(isHtml).flatMap(textBlocks);
  const isBlock = !display.startsWith("inline") && display !== "contents";
  return isBlock ? [{ text: ownText(el), el }, ...children] : children;
}

function splitAtBlockLimit(text: string): string[] {
  const out: string[] = [];
  let rest = text;
  while (rest.length > MAX_BLOCK_CHARS) {
    const space = rest.lastIndexOf(" ", MAX_BLOCK_CHARS);
    const cut = space > MAX_BLOCK_CHARS / 2 ? space : MAX_BLOCK_CHARS;
    out.push(rest.slice(0, cut).trim());
    rest = rest.slice(cut).trim();
  }
  if (rest) out.push(rest);
  return out;
}

const fullText = (el: Element) => (el.textContent ?? "").replace(/\s+/g, " ").trim();

function ownText(el: Element): string {
  let text = "";
  for (const node of el.childNodes) {
    if (node.nodeType === Node.TEXT_NODE) text += node.textContent ?? "";
    else if (node instanceof Element && getComputedStyle(node).display.startsWith("inline"))
      text += node.textContent ?? "";
  }
  return text.replace(/\s+/g, " ").trim();
}

const isHtml = (el: Element): el is HTMLElement => el instanceof HTMLElement;

function uniqueBy<T>(items: T[], key: (item: T) => string): T[] {
  const seen = new Set<string>();
  return items.filter((item) => !seen.has(key(item)) && seen.add(key(item)));
}
