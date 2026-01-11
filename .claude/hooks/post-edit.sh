#!/bin/bash
# PostEdit Hook für 60_HIDEANDSEEK

EDITED_FILE=$1

echo "=== Post-Edit Quality-Check ==="
echo "File: $EDITED_FILE"
echo

# Check 1: TypeScript Validation (nur für .ts/.tsx Files)
if [[ "$EDITED_FILE" =~ \.(ts|tsx)$ ]]; then
  echo "🔍 TypeScript Check..."
  if command -v tsc &> /dev/null; then
    tsc --noEmit "$EDITED_FILE" 2>&1 | head -5
    if [ $? -eq 0 ]; then
      echo "  ✅ TypeScript OK"
    else
      echo "  ⚠️ TypeScript Errors (siehe oben)"
    fi
  else
    echo "  ⚠️ tsc not found, skipping"
  fi
  echo
fi

# Check 2: ESLint (falls konfiguriert)
if [ -f ".eslintrc.json" ] || [ -f ".eslintrc.js" ] || [ -f "eslint.config.js" ]; then
  echo "🔍 ESLint Check..."
  if command -v eslint &> /dev/null; then
    eslint "$EDITED_FILE" 2>&1 | head -5
    if [ $? -eq 0 ]; then
      echo "  ✅ ESLint OK"
    else
      echo "  ⚠️ ESLint Issues (siehe oben)"
    fi
  else
    echo "  ⚠️ eslint not found, skipping"
  fi
  echo
fi

# Check 3: Test-File exists?
TEST_FILE="${EDITED_FILE%.tsx}.test.tsx"
TEST_FILE="${TEST_FILE%.ts}.test.ts"

if [ ! -f "$TEST_FILE" ]; then
  echo "⚠️ Kein Test-File gefunden: $TEST_FILE"
  echo "   Erwäge Tests zu schreiben!"
else
  echo "✅ Test-File existiert: $TEST_FILE"
fi

echo "==================================="
