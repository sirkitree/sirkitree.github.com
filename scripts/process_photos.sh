#!/usr/bin/env bash
# Process photo exports (e.g. Google Photos downloads) for the /photos/ gallery.
#
# Usage:
#   1. Drop raw exports into assets/photos/originals/  (gitignored)
#   2. Run: ./scripts/process_photos.sh
#   3. Commit assets/photos/full/ and assets/photos/thumbs/
#
# Each image is re-encoded with ImageMagick: auto-rotated, resized, and
# stripped of ALL metadata (EXIF/GPS/IPTC) so location data never reaches
# the public repo.
set -euo pipefail
cd "$(dirname "$0")/.."

ORIGINALS=assets/photos/originals
FULL=assets/photos/full
THUMBS=assets/photos/thumbs

mkdir -p "$ORIGINALS" "$FULL" "$THUMBS"

if ! command -v magick >/dev/null 2>&1; then
  echo "ImageMagick is required: brew install imagemagick" >&2
  exit 1
fi

shopt -s nullglob nocaseglob
processed=0
skipped=0

for src in "$ORIGINALS"/*.{jpg,jpeg,png,heic,heif,webp,tif,tiff}; do
  base=$(basename "$src")
  name="${base%.*}"
  # Slugify: lowercase, spaces/underscores to dashes, strip anything else
  slug=$(printf '%s' "$name" | tr '[:upper:]' '[:lower:]' | tr ' _' '--' | tr -cd 'a-z0-9-')
  if [ -z "$slug" ]; then
    echo "skipping $base (filename produced empty slug)" >&2
    continue
  fi

  out_full="$FULL/$slug.jpg"
  out_thumb="$THUMBS/$slug.jpg"

  if [ -f "$out_full" ] && [ -f "$out_thumb" ]; then
    skipped=$((skipped + 1))
    continue
  fi

  echo "processing $base -> $slug.jpg"
  magick "$src" -auto-orient -strip -resize '2000x2000>' -quality 85 "$out_full"
  magick "$src" -auto-orient -strip -resize '640x640>'   -quality 80 "$out_thumb"
  processed=$((processed + 1))
done

echo "done: $processed processed, $skipped already up to date"
echo "full: $(du -sh "$FULL" | cut -f1)  thumbs: $(du -sh "$THUMBS" | cut -f1)"
