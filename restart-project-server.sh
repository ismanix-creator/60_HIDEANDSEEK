#!/usr/bin/env bash
#
# @file        restart-project-server.sh
# @description Stoppt und startet ausschließlich 60_HIDEANDSEEK (Ports 5173/3001 + ngrok)
# @version     1.0.1
# @updated     2026-01-08 00:30:00 CET
# @author      agenten-koordinator
#
# @changelog
#   1.0.1 - 2026-01-08 - Backend path korrigiert: dist/server/server/index.js
#   1.0.0 - 2026-01-07 - Initial version

set -euo pipefail

PROJECT_DIR="/home/akki/dev/codes/60_HIDEANDSEEK"
cd "$PROJECT_DIR"

BACKEND_PORT=3001
FRONTEND_PORT=5173
BACKEND_HOST="127.0.0.1"
NGROK_DOMAIN="liana-unrowdy-silva.ngrok-free.dev"

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

stop_ngrok() {
  echo "Stopping ngrok processes..." | tee -a "$LOG"
  pkill -f "ngrok http" 2>/dev/null || true
  sleep 1
}

echo "=== $(date '+%Y-%m-%d %H:%M:%S %Z') Restart started ===" | tee -a "$LOG"

echo "Stopping 60_HIDEANDSEEK ports..." | tee -a "$LOG"
stop_ngrok
for port in "${PORTS_TO_KILL[@]}"; do
  stop_port "$port"
done

echo "" | tee -a "$LOG"
echo "========================================" | tee -a "$LOG"
echo "Starting 60_HIDEANDSEEK (5173/3001)" | tee -a "$LOG"
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
nohup env BACKEND_PORT="$BACKEND_PORT" pnpm dev --port "$FRONTEND_PORT" >>"$LOG" 2>&1 &
frontend_pid=$!
disown
sleep 2

if kill -0 "$frontend_pid" 2>/dev/null; then
  echo "Frontend started (PID $frontend_pid)" | tee -a "$LOG"
else
  echo "Frontend failed to start" | tee -a "$LOG"
fi

echo "Starting ngrok for 60_HIDEANDSEEK..." | tee -a "$LOG"
nohup ngrok http --domain="$NGROK_DOMAIN" "$FRONTEND_PORT" >>"$LOG" 2>&1 &
ngrok_pid=$!
disown
sleep 2

if kill -0 "$ngrok_pid" 2>/dev/null; then
  echo "ngrok started (PID $ngrok_pid)" | tee -a "$LOG"
  echo "Public URL: https://$NGROK_DOMAIN" | tee -a "$LOG"
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
echo "  - ngrok:    https://$NGROK_DOMAIN $ngrok_status" | tee -a "$LOG"
echo "" | tee -a "$LOG"
echo "Log: $LOG" | tee -a "$LOG"
echo "=== $(date '+%Y-%m-%d %H:%M:%S %Z') Restart finished ===" | tee -a "$LOG"
