#!/bin/bash
set -e
cd "/Users/pkostelnik/Library/CloudStorage/OneDrive-Persönlich/Documents/github/copilotovh"
OUT="/Users/pkostelnik/Library/CloudStorage/OneDrive-Persönlich/Documents/github/copilotovh/_cmd_output.txt"
> "$OUT"

echo "=== STEP 1: git status --short ===" >> "$OUT"
git status --short 2>&1 >> "$OUT"

echo "" >> "$OUT"
echo "=== STEP 2: git add ===" >> "$OUT"
git add index.html index_en.html styles.css lang-detect.js 2>&1 >> "$OUT"
echo "(exit: $?)" >> "$OUT"

echo "" >> "$OUT"
echo "=== STEP 3: git commit ===" >> "$OUT"
git commit -m 'fix: CSP, accessibility, SEO & code quality improvements

- Remove unsafe-inline from CSP, add .noscript-msg CSS class
- Add Open Graph meta tags (og:title, og:description, og:type, og:locale)
- Add hreflang alternate links for DE/EN SEO
- Add aria-label on hero, grid, cta sections
- Add sr-only class and screen reader hint on external footer link
- Add role=contentinfo on footer inside custom element
- Validate localStorage langPref value (de/en only)
- Consolidate duplicate dark-mode CSS rules
- Fix crossorigin attribute on preconnect link' 2>&1 >> "$OUT"

echo "" >> "$OUT"
echo "=== STEP 4: git push ===" >> "$OUT"
git push 2>&1 >> "$OUT"

echo "" >> "$OUT"
echo "=== STEP 5: git status -sb ===" >> "$OUT"
git status -sb 2>&1 >> "$OUT"

echo "" >> "$OUT"
echo "=== ALL DONE ===" >> "$OUT"
