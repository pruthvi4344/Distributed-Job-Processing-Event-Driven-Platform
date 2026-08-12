#!/bin/sh
# Generates /usr/share/nginx/html/env-config.js at container start so the SPA can
# read the FastAPI base URL from a *runtime* env var, since Vite env vars are
# normally baked in at *build* time and docker-compose only gives us the value
# when the container actually starts.
set -eu

OUTPUT_FILE="/usr/share/nginx/html/env-config.js"
API_BASE_URL="${VITE_API_BASE_URL:-http://localhost:8000}"

cat > "$OUTPUT_FILE" <<EOF
window.__FLOWGRID_API_BASE__ = "${API_BASE_URL}";
EOF

echo "[flowgrid] wrote ${OUTPUT_FILE} with API base: ${API_BASE_URL}"
