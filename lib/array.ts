// Shared by the admin content-editor forms wherever a row list needs
// up/down reordering — returns a new array with the item at `index` swapped
// with its neighbor `offset` positions away. No-op past either end.
export function moveItem<T>(items: T[], index: number, offset: -1 | 1): T[] {
  const target = index + offset;
  if (target < 0 || target >= items.length) return items;
  const next = [...items];
  [next[index], next[target]] = [next[target], next[index]];
  return next;
}
