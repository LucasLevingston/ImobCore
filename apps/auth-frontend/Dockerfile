FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
COPY apps/auth-frontend/package.json ./apps/auth-frontend/package.json
COPY packages/ui/package.json ./packages/ui/package.json
RUN npm ci --workspace=auth-frontend --workspace=@microfrontends/ui --include-workspace-root

FROM node:20-alpine AS build
WORKDIR /app
ARG NEXT_PUBLIC_API_GATEWAY_URL=http://localhost:3004
ENV NEXT_PUBLIC_API_GATEWAY_URL=${NEXT_PUBLIC_API_GATEWAY_URL}
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/auth-frontend/node_modules ./apps/auth-frontend/node_modules
COPY packages/ui ./packages/ui
COPY apps/auth-frontend ./apps/auth-frontend
RUN npm run build --workspace=auth-frontend

FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/apps/auth-frontend/.next/standalone ./
COPY --from=build /app/apps/auth-frontend/.next/static ./apps/auth-frontend/.next/static
COPY --from=build /app/apps/auth-frontend/public ./apps/auth-frontend/public
USER node
EXPOSE 3000
HEALTHCHECK --interval=10s --timeout=3s --start-period=15s CMD wget -qO- http://localhost:3000/login || exit 1
CMD ["node", "apps/auth-frontend/server.js"]
