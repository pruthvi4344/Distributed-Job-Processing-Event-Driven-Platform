# ---- Build stage ----
FROM node:20-alpine AS build
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

COPY . .
# VITE_API_BASE_URL is intentionally NOT passed as a build ARG here: docker-compose
# supplies it as a container *runtime* env var, and the runtime env-config.js
# mechanism (see docker-entrypoint.sh) takes precedence over whatever gets baked in
# at build time. Building without it simply falls back to http://localhost:8000.
RUN npm run build

# ---- Runtime stage ----
FROM nginx:alpine AS runtime

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY docker-entrypoint.sh /docker-entrypoint.d/40-flowgrid-env-config.sh
RUN chmod +x /docker-entrypoint.d/40-flowgrid-env-config.sh

EXPOSE 80

# nginx:alpine's own entrypoint runs every executable script in /docker-entrypoint.d/
# before starting nginx, so our env-config generator runs automatically — no need to
# override CMD/ENTRYPOINT.
