// Extrai o primeiro nome de um nome completo — usado na saudação da home
// pra evitar `Bem-vindo(a), Lucas Levingston Silva de Andrade` quebrando o layout
export function firstName(fullName: string): string {
  return fullName.trim().split(/\s+/).filter(Boolean)[0] ?? ''
}
