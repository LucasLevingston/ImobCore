FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
COPY services/api-gateway/package.json ./services/api-gateway/package.json
# --ignore-scripts: o postinstall da raiz roda `prisma generate`, que não se
# aplica a este workspace e falharia sem os services/* copiados neste estágio
RUN npm ci --workspace=api-gateway --include-workspace-root --ignore-scripts

FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/services/api-gateway/node_modules ./services/api-gateway/node_modules
COPY services/api-gateway ./services/api-gateway
USER node
EXPOSE 3004
# 127.0.0.1, não localhost — dentro do Alpine "localhost" resolve pra ::1
# (IPv6) primeiro, mas o Fastify só escuta em 0.0.0.0 (IPv4)
HEALTHCHECK --interval=10s --timeout=3s --start-period=10s CMD wget -qO- http://127.0.0.1:3004/health || exit 1
CMD ["node", "--import", "tsx", "services/api-gateway/src/main/server.ts"]
