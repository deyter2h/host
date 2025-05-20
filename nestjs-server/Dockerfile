# nestjs-server/Dockerfile

# 1) Build stage
FROM node:24-alpine AS builder
WORKDIR /app

# Copy package.json only, then install (including devDeps)
COPY package-lock.json ./
COPY package.json ./

RUN npm ci
# Copy the rest of your source and compile
COPY . .
RUN npm run build

# 2) Production stage
FROM node:24-alpine
WORKDIR /app

# Copy compiled output and node_modules from the builder
COPY --from=builder /app/dist       ./dist
COPY --from=builder /app/node_modules ./node_modules

ENV NODE_ENV=production
EXPOSE 3000
CMD ["node", "dist/main.js"]
