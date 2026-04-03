export function formatGw(value: number): string {
  return `${value.toFixed(1)} GW`
}

export function formatPct(value: number): string {
  return `${Math.round(value * 100)}%`
}
