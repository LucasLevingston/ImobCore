FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
COPY services/auth-service/package.json ./services/auth-service/package.json
RUN npm ci --workspace=auth-service --include-workspace-root

FROM node:20-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/services/auth-service/node_modules ./services/auth-service/node_modules
COPY services/auth-service ./services/auth-service
RUN npx --prefix services/auth-service prisma generate --schema services/auth-service/prisma/schema.prisma

FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/services/auth-service ./services/auth-service
USER node
EXPOSE 3001
HEALTHCHECK --interval=10s --timeout=3s --start-period=10s CMD wget -qO- http://localhost:3001/health || exit 1
CMD ["node", "--import", "tsx", "services/auth-service/src/main/server.ts"]
