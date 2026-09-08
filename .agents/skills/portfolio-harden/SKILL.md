---
name: portfolio-harden
description: Harden static portfolio pages against malformed content, unsafe links, overflow, accessibility failures, and graceful-degradation gaps.
user-invocable: true
argument-hint: "[page or data path]"
---

# Portfolio Hardening

Use when a page must remain trustworthy as content grows. Preserve the site's visual language while making failure states explicit and recoverable.

## Data and DOM safety

- Escape every data-derived value before inserting HTML, or build nodes with `textContent`.
- Treat missing, null, wrong-type, and partially populated records as expected maintenance inputs.
- Render the remaining valid records when one record is malformed; do not let one item abort the collection.
- Validate identifiers before using string methods and validate arrays before mapping.
- Keep generated JSON synchronized with the runtime source through the existing build command.

## Links and disclosure

- Allow only intended URL schemes; reject `javascript:`, `data:`, and ambiguous protocol-relative URLs.
- Add `rel="noopener noreferrer"` to HTTPS links opened in a new context.
- Label researcher-provided context separately from authoritative vendor or registry facts.
- Do not publish credentials, internal filesystem paths, tokens, or unverified impact claims.

## Resilience

- Provide useful empty, not-found, and no-JavaScript states.
- Break long identifiers, URLs, titles, and translated strings without horizontal scrolling.
- Format dates with `Intl` while retaining source timestamps in data when provenance matters.
- Support keyboard operation, visible focus, zoom, reduced motion, and screen-reader landmarks.
- Verify behavior with malformed-record smoke fixtures and real narrow/desktop browser views.
