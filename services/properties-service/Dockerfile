FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
COPY services/properties-service/package.json ./services/properties-service/package.json
RUN npm ci --workspace=properties-service --include-workspace-root

FROM node:20-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/services/properties-service/node_modules ./services/properties-service/node_modules
COPY services/properties-service ./services/properties-service
RUN npx --prefix services/properties-service prisma generate --schema services/properties-service/prisma/schema.prisma

FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/services/properties-service ./services/properties-service
USER node
EXPOSE 3002
HEALTHCHECK --interval=10s --timeout=3s --start-period=10s CMD wget -qO- http://localhost:3002/health || exit 1
CMD ["node", "--import", "tsx", "services/properties-service/src/main/server.ts"]
