// Contrato arquitetural — sem implementação nesta fase (ver ai-provider.ts).
export interface ChatProvider {
  complete(prompt: string): Promise<string>
}
