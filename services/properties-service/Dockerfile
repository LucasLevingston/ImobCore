FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
COPY services/properties-service/package.json ./services/properties-service/package.json
# --ignore-scripts: o postinstall da raiz roda `prisma generate` pra todo
# workspace, mas nesse estágio só o package.json foi copiado (schema.prisma
# ainda não existe aqui) — a geração real acontece explicitamente abaixo,
# no estágio build, depois que o código-fonte completo é copiado
RUN npm ci --workspace=properties-service --include-workspace-root --ignore-scripts

FROM node:20-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/services/properties-service/node_modules ./services/properties-service/node_modules
COPY services/properties-service ./services/properties-service
RUN npx --prefix services/properties-service prisma generate --schema services/properties-service/prisma/schema.prisma --config services/properties-service/prisma.config.ts

FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
# Prisma 7 removeu o motor Rust (Query Compiler WASM + driver adapter puro
# JS/TS agora) — sem binário nativo, então sem dependência de qual OpenSSL
# o Alpine tem. apk add openssl (necessário até a Fase 9) não é mais preciso.
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/services/properties-service ./services/properties-service
# `prisma migrate deploy` em runtime (abaixo) escreve em node_modules/@prisma/engines
# — sem isso o usuário node não-root não tem permissão (tudo veio via COPY como root)
RUN chown -R node:node /app
USER node
EXPOSE 3002
# 127.0.0.1, não localhost — dentro do Alpine "localhost" resolve pra ::1
# (IPv6) primeiro, mas o Fastify só escuta em 0.0.0.0 (IPv4)
HEALTHCHECK --interval=10s --timeout=3s --start-period=10s CMD wget -qO- http://127.0.0.1:3002/health || exit 1
# Aplica migrações pendentes antes de subir o server — necessário pra um
# banco novo (container fresco) já nascer com as tabelas certas
CMD ["sh", "-c", "npx prisma migrate deploy --schema services/properties-service/prisma/schema.prisma --config services/properties-service/prisma.config.ts && node --import tsx --import ./services/properties-service/src/main/tracing.ts services/properties-service/src/main/server.ts"]
