// Ponto único de acesso a `window.location` pós-logout — usado por UserMenu e
// PortalSidebar, que antes duplicavam essa chamada cada um do seu jeito (e o
// fallback do PortalSidebar nem usava useLogout, então nunca limpava sessão
// local em caso de falha de rede).
export function reloadAfterLogout(): void {
  window.location.reload()
}
