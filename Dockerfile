FROM oven/bun:1-alpine AS builder
WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY . .
RUN bun run build

FROM oven/bun:1-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY package.json bun.lock ./
RUN bun install --production --frozen-lockfile

COPY --from=builder /app/dist ./dist

EXPOSE 3000
CMD ["bun", "run", "dist/src/main.js"]
