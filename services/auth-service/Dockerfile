FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
COPY services/auth-service/package.json ./services/auth-service/package.json
# --ignore-scripts: o postinstall da raiz roda `prisma generate` pra todo
# workspace, mas nesse estágio só o package.json foi copiado (schema.prisma
# ainda não existe aqui) — a geração real acontece explicitamente abaixo,
# no estágio build, depois que o código-fonte completo é copiado
RUN npm ci --workspace=auth-service --include-workspace-root --ignore-scripts

FROM node:20-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/services/auth-service/node_modules ./services/auth-service/node_modules
COPY services/auth-service ./services/auth-service
RUN npx --prefix services/auth-service prisma generate --schema services/auth-service/prisma/schema.prisma

FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
# Prisma detecta a versão do OpenSSL em runtime pra escolher o engine binário
# certo (binaryTargets no schema.prisma) — sem o pacote instalado, a detecção
# falha silenciosamente e cai no binário errado (compilado pra OpenSSL 1.1)
RUN apk add --no-cache openssl
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/services/auth-service ./services/auth-service
# `prisma migrate deploy` em runtime (abaixo) escreve em node_modules/@prisma/engines
# — sem isso o usuário node não-root não tem permissão (tudo veio via COPY como root)
RUN chown -R node:node /app
USER node
EXPOSE 3001
# 127.0.0.1, não localhost — dentro do Alpine "localhost" resolve pra ::1
# (IPv6) primeiro, mas o Fastify só escuta em 0.0.0.0 (IPv4)
HEALTHCHECK --interval=10s --timeout=3s --start-period=10s CMD wget -qO- http://127.0.0.1:3001/health || exit 1
# Aplica migrações pendentes antes de subir o server — necessário pra um
# banco novo (container fresco) já nascer com as tabelas certas
CMD ["sh", "-c", "npx prisma migrate deploy --schema services/auth-service/prisma/schema.prisma && node --import tsx --import ./services/auth-service/src/main/tracing.ts services/auth-service/src/main/server.ts"]
