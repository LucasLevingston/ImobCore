import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node'
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http'
import { resourceFromAttributes } from '@opentelemetry/resources'
import { NodeSDK, tracing } from '@opentelemetry/sdk-node'
import { ATTR_SERVICE_NAME } from '@opentelemetry/semantic-conventions'
// Import nomeado falha em ESM: o pacote expõe PrismaInstrumentation via getter
// no CJS, e o detector estático de named exports (cjs-module-lexer) do Node
// não reconhece esse padrão — "does not provide an export named..."
import PrismaInstrumentationPkg from '@prisma/instrumentation'

// PRECISA ser importado antes de qualquer outro módulo (--import, nunca um
// import normal dentro de server.ts) — a instrumentação de http/Prisma
// funciona por monkey-patch nos módulos na primeira vez que são carregados;
// se algo já importou 'http' ou '@prisma/client' antes desse arquivo rodar,
// aquela referência já capturada fica sem instrumentação (docs seção 25).
const { PrismaInstrumentation } = PrismaInstrumentationPkg
const otlpEndpoint = process.env.OTEL_EXPORTER_OTLP_ENDPOINT

const sdk = new NodeSDK({
  resource: resourceFromAttributes({ [ATTR_SERVICE_NAME]: 'auth-service' }),
  // Sem OTEL_EXPORTER_OTLP_ENDPOINT configurado (dev local), exporta pro
  // console — com endpoint (produção), manda pro collector via OTLP/HTTP
  traceExporter: otlpEndpoint
    ? new OTLPTraceExporter({ url: otlpEndpoint })
    : new tracing.ConsoleSpanExporter(),
  instrumentations: [
    getNodeAutoInstrumentations({
      // Watch de arquivo do próprio filesystem gera span pra cada leitura —
      // ruído puro pra esse serviço, sem valor de debug
      '@opentelemetry/instrumentation-fs': { enabled: false },
    }),
    new PrismaInstrumentation(),
  ],
})

sdk.start()

for (const signal of ['SIGTERM', 'SIGINT'] as const) {
  process.once(signal, () => {
    void sdk.shutdown().finally(() => process.exit(0))
  })
}
