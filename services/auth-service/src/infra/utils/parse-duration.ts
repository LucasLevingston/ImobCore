const UNIT_TO_MS: Record<string, number> = {
  s: 1000,
  m: 60 * 1000,
  h: 60 * 60 * 1000,
  d: 24 * 60 * 60 * 1000,
}

const DURATION_PATTERN = /^(\d+)(s|m|h|d)$/

// Parser mínimo pro formato usado em JWT_*_EXPIRES_IN ("15m", "7d") — sem
// depender de uma lib externa só pra isso (YAGNI)
export function parseDurationToMs(duration: string): number {
  const match = DURATION_PATTERN.exec(duration)
  const value = match?.[1]
  const unit = match?.[2]
  const unitMs = unit ? UNIT_TO_MS[unit] : undefined

  if (!value || !unitMs) {
    throw new Error(`Formato de duração inválido: "${duration}". Use algo como "15m" ou "7d".`)
  }

  return Number(value) * unitMs
}
