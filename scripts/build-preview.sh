#!/usr/bin/env bash
# Builds a static export and rewrites absolute asset paths to relative ones,
# so the site works when hosted under any sub-path (e.g. a preview link).
set -euo pipefail
cd "$(dirname "$0")/.."
OUT="${1:-preview}"

PREVIEW_EXPORT=1 NEXT_PUBLIC_PREVIEW=1 npx next build
rm -rf "$OUT" && cp -r out "$OUT" && rm -rf out
rm -f "$OUT/404.html" "$OUT/index.txt" "$OUT/projects.txt" "$OUT/favicon.ico"
rm -rf "$OUT/_not-found" "$OUT/404"

# HTML + JS: "/_next/..", "/images/..", "/icons/.." -> relative
find "$OUT" -type f \( -name '*.html' -o -name '*.js' \) -print0 | xargs -0 sed -i -E \
  -e 's#"/(_next|images|icons|sounds)/#"\1/#g' \
  -e 's#\\"/(_next|images|icons|sounds)/#\\"\1/#g' \
  -e 's#url\(/(images|icons)/#url(\1/#g'\
  -e 's#"/llms.txt"#"llms.txt"#g'
# CSS: font urls live next to the css folder
find "$OUT" -type f -name '*.css' -print0 | xargs -0 sed -i -E 's#url\(/_next/static/media/#url(../media/#g'

# Some static hosts reserve names starting with "_": move _next -> assets
mv "$OUT/_next" "$OUT/assets"
# The build-id folder (holds _buildManifest.js) is not needed at runtime for the app router
for d in "$OUT"/assets/static/*/; do
  case "$(basename "$d")" in chunks|css|media) ;; *) rm -rf "$d" ;; esac
done
find "$OUT" -type f \( -name '*.html' -o -name '*.js' -o -name '*.css' \) -print0 | xargs -0 sed -i -e 's#_next/#assets/#g'

# Escape literal U+FFFD in JS string literals (some hosts reject the raw character)
find "$OUT" -type f -name '*.js' -print0 | xargs -0 sed -i -e $'s#\xef\xbf\xbd#\\\\uFFFD#g'
# Unused by the app router at runtime
rm -rf "$OUT/assets/static/chunks/pages" "$OUT/assets/static/chunks/app/_not-found"

echo "Preview built in $OUT"
