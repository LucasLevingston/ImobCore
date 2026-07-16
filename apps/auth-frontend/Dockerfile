FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
COPY apps/auth-frontend/package.json ./apps/auth-frontend/package.json
COPY packages/ui/package.json ./packages/ui/package.json
# --ignore-scripts: o postinstall da raiz roda `prisma generate`, que não se
# aplica a este workspace e falharia sem os services/* copiados neste estágio
RUN npm ci --workspace=auth-frontend --workspace=@microfrontends/ui --include-workspace-root --ignore-scripts
# npm's hoisting decides per-install whether this workspace needs any locally
# nested packages at all — with a clean-enough dependency tree it may hoist
# everything to root and never create this dir, so the COPY below would fail
RUN mkdir -p apps/auth-frontend/node_modules

FROM node:20-alpine AS build
WORKDIR /app
ARG NEXT_PUBLIC_API_GATEWAY_URL=http://localhost:3004
ENV NEXT_PUBLIC_API_GATEWAY_URL=${NEXT_PUBLIC_API_GATEWAY_URL}
# npm run --workspace precisa do package.json raiz pra resolver o workspace;
# tsconfig.json/.eslintrc.json de cada app estendem os arquivos base da raiz
COPY package.json package-lock.json tsconfig.base.json .eslintrc.base.json ./
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/auth-frontend/node_modules ./apps/auth-frontend/node_modules
COPY packages/ui ./packages/ui
COPY apps/auth-frontend ./apps/auth-frontend
RUN npm run build --workspace=auth-frontend

FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
# server.js do output standalone usa process.env.HOSTNAME pra decidir onde
# escutar — o Docker seta HOSTNAME=<container id> automaticamente em todo
# container, então sem isso o server bind só no IP interno do container
# (nunca em 127.0.0.1/localhost, quebrando o healthcheck e qualquer acesso
# de fora do próprio processo)
# server.js do output standalone escuta na porta 3000 por padrão a menos que
# PORT esteja setado — já bate com esta porta, mas deixamos explícito
ENV HOSTNAME=0.0.0.0
ENV PORT=3000
COPY --from=build /app/apps/auth-frontend/.next/standalone ./
COPY --from=build /app/apps/auth-frontend/.next/static ./apps/auth-frontend/.next/static
COPY --from=build /app/apps/auth-frontend/public ./apps/auth-frontend/public
USER node
EXPOSE 3000
# 127.0.0.1, não localhost — dentro do Alpine "localhost" pode resolver pra
# ::1 (IPv6) primeiro; o server Next.js (standalone) só escuta em IPv4
HEALTHCHECK --interval=10s --timeout=3s --start-period=15s CMD wget -qO- http://127.0.0.1:3000/login || exit 1
CMD ["node", "apps/auth-frontend/server.js"]
