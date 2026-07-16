// Contrato arquitetural — sem implementação nesta fase (ver ai-provider.ts).
export interface EmbeddingProvider {
  embed(text: string): Promise<number[]>
}
