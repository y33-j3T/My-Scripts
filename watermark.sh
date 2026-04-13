#!/bin/bash

convert -size 1000x1000 xc:none \
  -gravity center \
  -pointsize 180 \
  -fill "rgba(128,128,128,0.3)" \
  -annotate -45 "CONFIDENTIAL" \
  watermark.pdf

mkdir -p watermarked

for f in *.pdf; do
  [ "$f" = "watermark.pdf" ] && continue
  pdftk "$f" stamp watermark.pdf output "watermarked/$f"
done
