#!/usr/bin/env sh
# Build the ZIP that the Chrome Web Store dashboard accepts.
set -e
cd "$(dirname "$0")/.."
VERSION=$(node -p "require('./manifest.json').version")
OUT="dist/fakenamely-extension-$VERSION.zip"
mkdir -p dist
rm -f "$OUT"
zip -q -r "$OUT" manifest.json popup.html popup.css popup.js icons
echo "wrote $OUT"
