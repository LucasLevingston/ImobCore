FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
COPY apps/properties-frontend/package.json ./apps/properties-frontend/package.json
COPY packages/ui/package.json ./packages/ui/package.json
RUN npm ci --workspace=properties-frontend --workspace=@microfrontends/ui --include-workspace-root

FROM node:20-alpine AS build
WORKDIR /app
ARG NEXT_PUBLIC_API_GATEWAY_URL=http://localhost:3004
ARG NEXT_PUBLIC_AUTH_FRONTEND_URL=http://localhost:3000
ENV NEXT_PUBLIC_API_GATEWAY_URL=${NEXT_PUBLIC_API_GATEWAY_URL}
ENV NEXT_PUBLIC_AUTH_FRONTEND_URL=${NEXT_PUBLIC_AUTH_FRONTEND_URL}
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/properties-frontend/node_modules ./apps/properties-frontend/node_modules
COPY packages/ui ./packages/ui
COPY apps/properties-frontend ./apps/properties-frontend
RUN npm run build --workspace=properties-frontend

FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/apps/properties-frontend/.next/standalone ./
COPY --from=build /app/apps/properties-frontend/.next/static ./apps/properties-frontend/.next/static
COPY --from=build /app/apps/properties-frontend/public ./apps/properties-frontend/public
USER node
EXPOSE 3003
HEALTHCHECK --interval=10s --timeout=3s --start-period=15s CMD wget -qO- http://localhost:3003/api/health || exit 1
CMD ["node", "apps/properties-frontend/server.js"]
