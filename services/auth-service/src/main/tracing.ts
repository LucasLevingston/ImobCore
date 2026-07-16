import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node'
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http'
import { resourceFromAttributes } from '@opentelemetry/resources'
import { NodeSDK, tracing } from '@opentelemetry/sdk-node'
import { ATTR_SERVICE_NAME } from '@opentelemetry/semantic-conventions'
// Prisma 7: @prisma/instrumentation agora ship um build ESM real (dist/index.mjs
// + exports condicional) — o import nomeado direto resolve sem o workaround de
// CJS default-import que a v5 exigia (verificado via tsx neste projeto).
import { PrismaInstrumentation } from '@prisma/instrumentation'

// PRECISA ser importado antes de qualquer outro módulo (--import, nunca um
// import normal dentro de server.ts) — a instrumentação de http/Prisma
// funciona por monkey-patch nos módulos na primeira vez que são carregados;
// se algo já importou 'http' ou '@prisma/client' antes desse arquivo rodar,
// aquela referência já capturada fica sem instrumentação (docs seção 25).
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
