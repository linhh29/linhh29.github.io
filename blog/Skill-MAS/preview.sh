#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT"

pick_port() {
  for port in 8765 8877 8989 9090 9377 3000; do
    if ! lsof -iTCP:"$port" -sTCP:LISTEN >/dev/null 2>&1; then
      echo "$port"
      return 0
    fi
  done
  echo "8765"
}

PORT="$(pick_port)"
URL="http://127.0.0.1:${PORT}/"

echo "Serving Skill-MAS blog from:"
echo "  $ROOT"
echo ""
echo "Open in browser:"
echo "  $URL"
echo ""
echo "Press Ctrl+C to stop."
echo ""

if command -v open >/dev/null 2>&1; then
  (sleep 0.5 && open "$URL") &
fi

python3 -m http.server "$PORT"
