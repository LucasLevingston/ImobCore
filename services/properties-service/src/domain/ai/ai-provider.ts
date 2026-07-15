// Contrato arquitetural — sem implementação nesta fase. Existe pra uma fase futura de
// IA plugar um provider concreto (ex.: OpenAI, Bedrock) sem tocar em domain/application.
export interface AIProvider {
  isAvailable(): Promise<boolean>
}
