import type { Theme } from './theme.types'

// Isolado do ThemeProvider — mesmo racional de get-initial-theme.ts: efeito
// colateral de DOM/storage testável sem montar um componente React.
export function applyTheme(storageKey: string, theme: Theme): void {
  document.documentElement.classList.toggle('dark', theme === 'dark')
  window.localStorage.setItem(storageKey, theme)
}
