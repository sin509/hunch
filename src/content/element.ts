type Tag = keyof HTMLElementTagNameMap;
type Attributes = Record<string, string>;
type Child = Node | string;

export function element<T extends Tag>(
  tag: T,
  attributes: Attributes = {},
  ...children: Child[]
): HTMLElementTagNameMap[T] {
  const el = document.createElement(tag);
  for (const [name, value] of Object.entries(attributes)) el.setAttribute(name, value);
  el.append(...children);
  return el;
}
