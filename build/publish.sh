#!/usr/bin/env bash
# NEEWE manual publish — Sprint 1 fallback when CI/PAT isn't configured yet.
#
# Builds neewe-core from src/ and pushes to the sibling neewe-ai-marketplace clone.
# Auto-bumps version in plugin.json + marketplace.json.
#
# Usage:
#   bash build/publish.sh <version>      # e.g. bash build/publish.sh 0.2.0
#
# Prereqs:
#   - neewe-ai-marketplace cloned as a sibling dir, or NEEWE_MARKETPLACE_PATH set
#   - jq installed (for version bump)
#   - git auth to push to NeeweTec/neewe-ai-marketplace

set -euo pipefail

VERSION="${1:-}"
if [ -z "$VERSION" ]; then
  echo "ERROR: missing version arg. Usage: bash build/publish.sh 0.2.0" >&2
  exit 1
fi

FW_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
MARKETPLACE_ROOT="${NEEWE_MARKETPLACE_PATH:-$(cd "${FW_ROOT}/../neewe-ai-marketplace" && pwd)}"

if [ ! -d "${MARKETPLACE_ROOT}/.git" ]; then
  echo "ERROR: not a git repo: ${MARKETPLACE_ROOT}" >&2
  exit 1
fi

if ! command -v jq >/dev/null 2>&1; then
  echo "ERROR: jq required. Install via your package manager (brew install jq, apt install jq, etc.)" >&2
  exit 1
fi

echo "[publish] FW root:        $FW_ROOT"
echo "[publish] Marketplace:    $MARKETPLACE_ROOT"
echo "[publish] Target version: $VERSION"
echo ""

# 1. Build (copies src/neewe-core/* into marketplace/plugins/neewe-core/).
echo "[publish] Step 1/4 — building..."
NEEWE_MARKETPLACE_PATH="$MARKETPLACE_ROOT" bash "${FW_ROOT}/build/build.sh"

# 2. Bump versions.
echo ""
echo "[publish] Step 2/4 — bumping versions..."
PLUGIN_JSON="${MARKETPLACE_ROOT}/plugins/neewe-core/.claude-plugin/plugin.json"
MKT_JSON="${MARKETPLACE_ROOT}/.claude-plugin/marketplace.json"
jq --arg v "$VERSION" '.version = $v' "$PLUGIN_JSON" > "${PLUGIN_JSON}.tmp" && mv "${PLUGIN_JSON}.tmp" "$PLUGIN_JSON"
jq --arg v "$VERSION" '.version = $v | .plugins[0].version = $v' "$MKT_JSON" > "${MKT_JSON}.tmp" && mv "${MKT_JSON}.tmp" "$MKT_JSON"
echo "[publish]   plugin.json    → version: $VERSION"
echo "[publish]   marketplace.json → version: $VERSION"

# 3. Commit (if there are changes).
echo ""
echo "[publish] Step 3/4 — committing in marketplace..."
cd "$MARKETPLACE_ROOT"
git add -A
if git diff --cached --quiet; then
  echo "[publish]   No changes to publish."
  exit 0
fi

FW_SHA=$(cd "$FW_ROOT" && git rev-parse --short HEAD)
git commit -m "release: v${VERSION} (from neewe-ai-fw@${FW_SHA})

Published from NeeweTec/neewe-ai-fw HEAD ${FW_SHA}.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"

# 4. Push.
echo ""
echo "[publish] Step 4/4 — pushing..."
git push origin main
git tag "v${VERSION}" 2>/dev/null || echo "[publish]   (tag v${VERSION} already exists, skipping)"
git push origin "v${VERSION}" 2>/dev/null || true

echo ""
echo "[publish] done. Released v${VERSION}."
