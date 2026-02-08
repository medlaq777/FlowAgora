# Stage 1: Dependency Installation
FROM node:22-alpine AS deps
WORKDIR /usr/src/app

# Install dependencies for native modules (if needed for bcrypt/etc)
RUN apk add --no-cache python3 make g++

COPY package*.json ./
RUN npm ci

# Stage 2: Builder
FROM node:22-alpine AS builder
WORKDIR /usr/src/app
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY . .
RUN npm run build

# Stage 3: Runner
FROM node:22-alpine AS runner
WORKDIR /usr/src/app

ENV NODE_ENV=production

# Don't run as root
USER node

# Copy only necessary files
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY package.json ./

EXPOSE 3000

CMD ["node", "dist/main"]
