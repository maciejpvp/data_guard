export interface SearchableItem {
  id: string;
  blob: string;
}

export function searchItems<T extends SearchableItem>(
  items: T[],
  query: string,
): T[] {
  if (!query.trim()) return items;

  const lowerQuery = query.toLowerCase();

  return items.filter((item) => {
    return item.blob.toLowerCase().includes(lowerQuery);
  });
}
