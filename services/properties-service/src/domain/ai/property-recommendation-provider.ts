// Contrato arquitetural — sem implementação nesta fase (ver ai-provider.ts).
export interface PropertyRecommendationProvider {
  recommend(propertyId: string, limit: number): Promise<string[]>
}
