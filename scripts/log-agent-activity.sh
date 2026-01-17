#!/bin/bash
# Agent Activity Logger
# Usage: log-agent-activity.sh <AGENT_NAME> <ACTIVITY>

if [ "$#" -ne 2 ]; then
    echo "Usage: $0 <AGENT_NAME> <ACTIVITY>"
    exit 1
fi

AGENT_NAME="$1"
ACTIVITY="$2"
TIMESTAMP=$(TZ="Europe/Berlin" date +"%Y-%m-%dT%H:%M:%S%z")
LOG_FILE="logs/agent-activity.log"

# Create logs directory if not exists
mkdir -p logs

# Create log entry
ENTRY="$TIMESTAMP | $AGENT_NAME | $ACTIVITY"

# Prepend entry and rotate (keep only first 20 lines)
if [ -f "$LOG_FILE" ]; then
    { echo "$ENTRY"; head -n 19 "$LOG_FILE"; } > "$LOG_FILE.tmp"
    mv "$LOG_FILE.tmp" "$LOG_FILE"
else
    echo "$ENTRY" > "$LOG_FILE"
fi

echo "✅ Logged: $ENTRY"
