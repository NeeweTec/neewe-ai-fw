#!/usr/bin/env bash
# NEEWE build pipeline — Sprint 1 minimum
#
# Copies src/neewe-core/* into the sibling neewe-ai-marketplace repo's
# plugins/neewe-core/ directory. The marketplace plugin.json + marketplace.json
# already live there and are preserved.
#
# Future (Sprint 2 / EP-OPUS-1): replaced by a TS compiler that
# reads src/manifests/*.yaml and emits skills/, agents/, hooks/, settings/.

set -euo pipefail

FW_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SRC_DIR="${FW_ROOT}/src/neewe-core"
MARKETPLACE_ROOT="${NEEWE_MARKETPLACE_PATH:-$(cd "${FW_ROOT}/../neewe-ai-marketplace" && pwd)}"
TARGET_DIR="${MARKETPLACE_ROOT}/plugins/neewe-core"

if [ ! -d "$SRC_DIR" ]; then
  echo "ERROR: source dir not found: $SRC_DIR" >&2
  exit 1
fi

if [ ! -d "$TARGET_DIR" ]; then
  echo "ERROR: marketplace target not found: $TARGET_DIR" >&2
  echo "Set NEEWE_MARKETPLACE_PATH or clone neewe-ai-marketplace alongside neewe-ai-fw." >&2
  exit 1
fi

echo "[build] source:  $SRC_DIR"
echo "[build] target:  $TARGET_DIR"
echo ""

# Preserve marketplace-only files (.claude-plugin/plugin.json, README.md).
# Copy the rest verbatim.
for item in skills agents hooks output-styles monitors bin dashboard settings.json; do
  src="$SRC_DIR/$item"
  if [ -e "$src" ]; then
    if [ -d "$src" ]; then
      mkdir -p "$TARGET_DIR/$item"
      cp -r "$src"/* "$TARGET_DIR/$item/" 2>/dev/null || true
      echo "[build] copied dir  $item/"
    else
      cp "$src" "$TARGET_DIR/$item"
      echo "[build] copied file $item"
    fi
  fi
done

# Make hook scripts executable.
if [ -d "$TARGET_DIR/hooks" ]; then
  find "$TARGET_DIR/hooks" -type f \( -name "*.sh" -o ! -name "*.*" \) -exec chmod +x {} \; 2>/dev/null || true
fi

echo ""
echo "[build] done."
