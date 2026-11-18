#!/usr/bin/env bash
# Publish the site to ritupatil.me (GitHub Pages, repo Iamritupatil.github.io, branch main).
# Usage: scripts/deploy-pages.sh [path-to-local-clone-of-Iamritupatil.github.io]
set -euo pipefail
cd "$(dirname "$0")/.."
PAGES="${1:-../iamritupatil.github.io}"

rm -rf out
PREVIEW_EXPORT=1 npx next build

# Replace the old build but keep the repo's own files (CNAME, README, .git)
find "$PAGES" -mindepth 1 -maxdepth 1 ! -name .git ! -name CNAME ! -name README.md -exec rm -rf {} +
cp -r out/. "$PAGES"/
touch "$PAGES/.nojekyll" # GitHub Pages would otherwise hide the _next folder

cd "$PAGES"
git add -A
git commit -m "Update portfolio site" && git push origin main
