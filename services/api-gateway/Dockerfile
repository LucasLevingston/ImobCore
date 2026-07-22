# node:20-alpine (musl) reproduz de forma determinística um bug do npm CLI
# ("Exit handler never called!", npm/cli#4028) durante `npm ci` deste
# workspace especificamente — extrai o node_modules com pacotes truncados
# (tsx, fastify, typescript ficam com diretório vazio) sem sinalizar erro.
# Não reproduz em auth-service/properties-service (mesma versão do tsx) nem
# fora de Alpine — troca pra base Debian (glibc) evita o bug por completo.
FROM node:20-bookworm-slim AS deps
WORKDIR /app
COPY package.json package-lock.json ./
COPY services/api-gateway/package.json ./services/api-gateway/package.json
# --ignore-scripts: o postinstall da raiz roda `prisma generate`, que não se
# aplica a este workspace e falharia sem os services/* copiados neste estágio
RUN npm ci --workspace=api-gateway --include-workspace-root --ignore-scripts
# npm's hoisting decides per-install whether this workspace needs any locally
# nested packages at all — com uma dependency tree limpa o bastante, pode
# hoistear tudo pra raiz e nunca criar esse dir, então o COPY abaixo falharia
RUN mkdir -p services/api-gateway/node_modules

FROM node:20-bookworm-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/services/api-gateway/node_modules ./services/api-gateway/node_modules
COPY services/api-gateway ./services/api-gateway
USER node
EXPOSE 3004
# node -e em vez de wget/curl — a imagem slim do Debian não inclui nenhum
# dos dois por padrão, e instalar via apt só pro healthcheck infla a imagem
# à toa quando o Node já tem fetch nativo (Node 20+)
HEALTHCHECK --interval=10s --timeout=3s --start-period=10s CMD node -e "fetch('http://127.0.0.1:3004/health').then(r => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"
CMD ["node", "--import", "tsx", "services/api-gateway/src/main/server.ts"]
