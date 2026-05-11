export function splitNumberedPoints(text: string): string[] {
  if (!text) return [];

  const normalized = text
    .replace(/\r\n/g, "\n")
    .replace(/\s+/g, " ")
    .trim();

  const matches = [...normalized.matchAll(/(?:^|\s)(\d+)\.\s/g)];

  if (matches.length <= 1) {
    return [normalized];
  }

  const parts: string[] = [];

  for (let i = 0; i < matches.length; i++) {
    const current = matches[i];
    const next = matches[i + 1];
    const start = current.index ?? 0;
    const end = next?.index ?? normalized.length;
    const chunk = normalized.slice(start, end).trim();
    if (chunk) parts.push(chunk);
  }

  return parts.length ? parts : [normalized];
}
