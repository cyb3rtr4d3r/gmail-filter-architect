FROM node:20-alpine AS base

# Krok 1: Instalace závislostí
FROM base AS deps
# Zajišťuje kompatibilitu pro gyp apod.
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

# Krok 2: Sestavení (Build) aplikace
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

# Krok 3: Produkční image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Kopírování public složky a standalone buildu z builder verze
COPY --from=builder /app/public ./public

# Vytvoření .next složky s patřičnými právy
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Standalone build (vyžaduje `output: "standalone"` v next.config.ts) minimalizuje velikost finalního image
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
