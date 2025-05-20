# Stage 1: build Angular
FROM node:18-alpine AS builder
WORKDIR /app

# Copy manifests & install
COPY package*.json ./
RUN npm ci

# Copy sources & build
COPY . .
RUN npm run build -- --configuration production

# Stage 2: serve with nginx
FROM nginx:stable-alpine
# remove default
RUN rm -rf /usr/share/nginx/html/*

# copy build output
COPY --from=builder /app/dist/angular-front/browser /usr/share/nginx/html

# copy your custom config
COPY default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx","-g","daemon off;"]
