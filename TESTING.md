# Testing Guide

## Important: Clear Browser Cache!

The fixes for title rendering are in place, but you may see the old behavior due to browser caching.

### How to Clear Cache and Test

**Chrome/Edge:**
1. Open DevTools (F12 or Cmd+Option+I)
2. Right-click the refresh button
3. Select "Empty Cache and Hard Reload"

**Or simply:**
- Press `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows)

**Or use incognito mode:**
- `Cmd+Shift+N` (Mac) or `Ctrl+Shift+N` (Windows)

## What Should Work Now

### 1. Title Links (TAICO Example)
**URL:** http://127.0.0.1:3001/content-viewer.html?type=conference&org=taico&year=2026&subdir=february

**Expected:** Title shows as clickable "TAICO" link, not `[TAICO](https://www.taico.ca/)`

### 2. Back to Portfolio Button
**All content-viewer pages** should have working "Back to Portfolio" button that returns to `index.html`

**Examples to test:**
- http://127.0.0.1:3001/content-viewer.html?type=conference&org=bugcrowd&year=2025&subdir=october/merritcollege
- http://127.0.0.1:3001/content-viewer.html?type=conference&org=taico&year=2026&subdir=february

### 3. Browse on GitHub Button
All content pages should have "Browse on GitHub" button (not "Browse Directory") that links to the actual GitHub repo.

### 4. Lakera Paths Fixed
- **Lakera December 2023:** http://127.0.0.1:3001/content-viewer.html?type=conference&org=lakera&year=2023&subdir=december/2023
- **Lakera April 2024:** http://127.0.0.1:3001/content-viewer.html?type=conference&org=lakera&year=2024&subdir=april/2024

### 5. Linktree URL
Homepage social links section should have correct Linktree: https://linktr.ee/adsdawson

## Verification

Run this to verify the server is serving the updated files:

```bash
# Should return "3" (renderInlineMarkdown function exists)
curl -s "http://127.0.0.1:3001/content-viewer.html" | grep -c "renderInlineMarkdown"

# Should return "1" (correct Linktree URL)
curl -s "http://127.0.0.1:3001/index.html" | grep -c "linktr.ee/adsdawson"
```

If these return 0, restart the server:
```bash
pkill -f http-server
npx http-server docs -p 3001 --cors
```
