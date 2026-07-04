# ==========================
# Stage 1 - Build React App
# ==========================
FROM node:lts-alpine3.23 AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build


# ==========================
# Stage 2 - Nginx
# ==========================
FROM nginx:1.21.6

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /app/build /usr/share/nginx/html

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]