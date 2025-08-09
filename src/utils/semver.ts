export function cmp(a: string, b: string): number {
  const pa = a.replace(/^v/i, '').split('.').map(n => parseInt(n || '0', 10));
  const pb = b.replace(/^v/i, '').split('.').map(n => parseInt(n || '0', 10));
  for (let i = 0; i < 3; i++) {
    const ai = pa[i] ?? 0, bi = pb[i] ?? 0;
    if (ai > bi) return 1;
    if (ai < bi) return -1;
  }
  return 0;
}
