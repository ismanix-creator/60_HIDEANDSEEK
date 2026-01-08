#!/usr/bin/env bash
#
# @file        restart-project-server.sh
# @description Stoppt und startet ausschließlich 60_HIDEANDSEEK (Ports aus ENV)
# @version     1.2.4
# @updated     2026-01-08 19:20:00 CET
# @author      Akki Scholze
#
# @changelog
#   1.2.4 - 2026-01-08 - Ngrok-Domain aus APP_BASE_URL, keine NGROK_DOMAIN Referenz
#   1.2.3 - 2026-01-08 - Ngrok startet wieder, Domain aus APP_BASE_URL abgeleitet
#   1.2.2 - 2026-01-08 - Kein NGROK_DOMAIN im Code; ngrok start entfällt
#   1.2.0 - 2026-01-08 - Env-Pull nur bei Bedarf (fehlend/älter 30min) + Flags (--pull-env/--no-env-pull)
#   1.1.1 - 2026-01-08 - Nutzt ENV-Ports/Domain dynamisch in Logs
#   1.1.0 - 2026-01-08 - Lädt ENV vor jedem Restart via pnpm env:pull (KeePassXC), keine Hardcodes
#   1.0.1 - 2026-01-08 - Backend path korrigiert: dist/server/server/index.js
#   1.0.0 - 2026-01-07 - Initial version

set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname "${BASH_SOURCE[0]}")" && pwd -P)"
PROJECT_DIR="$(cd -- "$SCRIPT_DIR" && pwd -P)"
cd "$PROJECT_DIR"

usage() {
  cat <<'USAGE'
restart-project-server.sh [--pull-env|--force-env-pull] [--no-env-pull] [--help]
Pulls .env from KeePassXC if missing or older than 30min (unless --no-env-pull). --pull-env forces pull.
Aborts on env:pull failure. No secrets are logged.
USAGE
}

force_pull=0
skip_pull=0

for arg in "$@"; do
  case "$arg" in
    --pull-env|--force-env-pull) force_pull=1 ;;
    --no-env-pull) skip_pull=1 ;;
    --help) usage; exit 0 ;;
    *) usage; exit 2 ;;
  esac
done

maybe_pull_env() {
  if (( skip_pull )); then
    echo "[env] --no-env-pull set -> skipping pull"
    return
  fi

  if (( force_pull )); then
    echo "[env] forced pull -> running pnpm env:pull"
    pnpm env:pull || exit 1
    return
  fi

  if [[ ! -f "$PROJECT_DIR/.env" ]]; then
    echo "[env] .env missing -> pulling from KeePassXC"
    pnpm env:pull || exit 1
    return
  fi

  if command -v stat >/dev/null 2>&1; then
    now=$(date +%s)
    mtime=$(stat -c %Y "$PROJECT_DIR/.env" 2>/dev/null || stat -f %m "$PROJECT_DIR/.env" 2>/dev/null || echo 0)
    max_age=$((30 * 60))
    age=$((now - mtime))
    if (( age > max_age )); then
      echo "[env] .env older than 30min -> pulling from KeePassXC"
      pnpm env:pull || exit 1
      return
    fi
    echo "[env] .env fresh -> skipping pull"
  else
    echo "[env] stat not available -> pulling from KeePassXC"
    pnpm env:pull || exit 1
  fi
}

maybe_pull_env

if [[ ! -f "$PROJECT_DIR/.env" ]]; then
  echo "Failed to generate .env" >&2
  exit 1
fi
set -a
source "$PROJECT_DIR/.env"
set +a

BACKEND_PORT="${BACKEND_PORT:?BACKEND_PORT required}"
FRONTEND_PORT="${FRONTEND_PORT:?FRONTEND_PORT required}"
BACKEND_HOST="${BACKEND_HOST:?BACKEND_HOST required}"
APP_BASE_URL="${APP_BASE_URL:?APP_BASE_URL required}"
LOG="$PROJECT_DIR/logs/restart-project.log"
mkdir -p "$(dirname "$LOG")"

PORTS_TO_KILL=("$BACKEND_PORT" "$FRONTEND_PORT")

stop_port() {
  local port=$1
  echo "Stopping processes on port $port..." | tee -a "$LOG"
  local pids
  pids=$(lsof -ti tcp:"$port" 2>/dev/null || true)
  if [[ -n "$pids" ]]; then
    echo "Found PIDs: $pids" | tee -a "$LOG"
    for pid in $pids; do
      echo "Sending SIGTERM to PID $pid" | tee -a "$LOG"
      kill "$pid" 2>/dev/null || true
      sleep 1
      if kill -0 "$pid" 2>/dev/null; then
        echo "PID $pid still alive, sending SIGKILL" | tee -a "$LOG"
        kill -9 "$pid" 2>/dev/null || true
      fi
      echo "Killed PID $pid" | tee -a "$LOG"
    done
  else
    echo "No process on port $port" | tee -a "$LOG"
  fi
}

echo "=== $(date '+%Y-%m-%d %H:%M:%S %Z') Restart started ===" | tee -a "$LOG"

echo "Stopping 60_HIDEANDSEEK ports..." | tee -a "$LOG"
for port in "${PORTS_TO_KILL[@]}"; do
  stop_port "$port"
done

echo "" | tee -a "$LOG"
echo "========================================" | tee -a "$LOG"
echo "Starting 60_HIDEANDSEEK (FE: $FRONTEND_PORT / BE: $BACKEND_PORT)" | tee -a "$LOG"
echo "========================================" | tee -a "$LOG"

echo "Building backend for 60_HIDEANDSEEK..." | tee -a "$LOG"
if pnpm build:server >>"$LOG" 2>&1; then
  echo "Backend build successful" | tee -a "$LOG"

  echo "Starting backend on port $BACKEND_PORT..." | tee -a "$LOG"
  nohup env HOST="$BACKEND_HOST" PORT="$BACKEND_PORT" node dist/server/server/index.js >>"$LOG" 2>&1 &
backend_pid=$!
disown
sleep 2

if kill -0 "$backend_pid" 2>/dev/null; then
  echo "Backend started (PID $backend_pid)" | tee -a "$LOG"
  else
    echo "Backend failed to start" | tee -a "$LOG"
  fi
else
  echo "Backend build failed for 60_HIDEANDSEEK" | tee -a "$LOG"
fi

echo "Starting frontend on port $FRONTEND_PORT..." | tee -a "$LOG"
nohup env BACKEND_PORT="$BACKEND_PORT" pnpm exec vite --port "$FRONTEND_PORT" >>"$LOG" 2>&1 &
frontend_pid=$!
disown
sleep 2

if kill -0 "$frontend_pid" 2>/dev/null; then
  echo "Frontend started (PID $frontend_pid)" | tee -a "$LOG"
else
  echo "Frontend failed to start" | tee -a "$LOG"
fi

ngrok_host="${APP_BASE_URL#http://}"
ngrok_host="${ngrok_host#https://}"
ngrok_host="${ngrok_host%%/*}"

echo "Starting ngrok for 60_HIDEANDSEEK..." | tee -a "$LOG"
nohup ngrok http --domain="$ngrok_host" "$FRONTEND_PORT" >>"$LOG" 2>&1 &
ngrok_pid=$!
disown
sleep 2

if kill -0 "$ngrok_pid" 2>/dev/null; then
  echo "ngrok started (PID $ngrok_pid)" | tee -a "$LOG"
  echo "Public URL: $APP_BASE_URL" | tee -a "$LOG"
else
  echo "ngrok failed to start" | tee -a "$LOG"
fi

echo "" | tee -a "$LOG"
echo "========================================" | tee -a "$LOG"
echo "Access checks" | tee -a "$LOG"
echo "========================================" | tee -a "$LOG"

sleep 3

for port in "$BACKEND_PORT" "$FRONTEND_PORT"; do
  if curl -s --max-time 3 "http://localhost:$port/" >/dev/null; then
    echo "http://localhost:$port is UP" | tee -a "$LOG"
  else
    echo "http://localhost:$port is DOWN or not responding" | tee -a "$LOG"
  fi
done

echo "" | tee -a "$LOG"
echo "========================================" | tee -a "$LOG"
echo "Summary" | tee -a "$LOG"
echo "========================================" | tee -a "$LOG"

backend_status="❌"
frontend_status="❌"
ngrok_status="❌"

if lsof -ti tcp:"$BACKEND_PORT" >/dev/null 2>&1; then
  backend_status="✅"
fi

if lsof -ti tcp:"$FRONTEND_PORT" >/dev/null 2>&1; then
  frontend_status="✅"
fi

if pgrep -f "ngrok http" >/dev/null 2>&1; then
  ngrok_status="✅"
fi

echo "60_HIDEANDSEEK:" | tee -a "$LOG"
echo "  - Frontend: http://localhost:$FRONTEND_PORT $frontend_status" | tee -a "$LOG"
echo "  - Backend:  http://localhost:$BACKEND_PORT $backend_status" | tee -a "$LOG"
echo "  - ngrok:    $APP_BASE_URL $ngrok_status" | tee -a "$LOG"
echo "" | tee -a "$LOG"
echo "Log: $LOG" | tee -a "$LOG"
echo "=== $(date '+%Y-%m-%d %H:%M:%S %Z') Restart finished ===" | tee -a "$LOG"
