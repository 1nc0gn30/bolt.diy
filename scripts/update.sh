#!/bin/bash
# ZOTHOS WebGen local update: rebuilds from the local git checkout.
# No upstream release fetch — this fork is detached from stackblitz-labs/bolt.diy.
set -e
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$(dirname "$SCRIPT_DIR")"
echo "Updating ZOTHOS WebGen from local checkout ($(git rev-parse --short HEAD))..."
pnpm install
pnpm run build
echo "Update complete."
