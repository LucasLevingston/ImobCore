export function getInitials(name: string): string {
  const [first, second] = name.trim().split(/\s+/)
  return `${first?.[0]}${second?.[0] ?? ''}`.toUpperCase()
}
