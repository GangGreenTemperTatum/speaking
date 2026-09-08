---
name: portfolio-audit
description: Audit static portfolio pages for accessibility, security, performance, responsive behavior, and maintainability.
user-invocable: true
argument-hint: "[page or feature]"
---

# Portfolio Audit

Use for a technical quality review of this static portfolio. Inspect the actual HTML, CSS, data source, and browser surface; do not infer behavior from source alone.

## Review order

1. **Correctness** — verify routes, data rendering, filters, external links, empty states, and generated artifacts.
2. **Accessibility** — check landmarks, heading order, names and roles, keyboard focus, contrast, zoom, reduced motion, and meaningful link text.
3. **Security** — check HTML sinks, URL schemes, external-window isolation, untrusted data boundaries, and accidental sensitive disclosure.
4. **Responsive behavior** — exercise 320px, 375px, tablet, and desktop widths; check overflow, readable line lengths, and touch targets.
5. **Performance** — check blocking resources, unnecessary network calls, layout shifts, image dimensions, and repeated DOM work.
6. **Maintainability** — identify duplicated data, generated-file drift, stale scripts, and changes outside the requested surface.

## Evidence standard

- Classify findings P0 blocking, P1 major, P2 minor, or P3 polish.
- Include file, selector or symbol, observed behavior, user impact, and a concrete fix.
- Separate verified facts from recommendations.
- Report positive findings and accepted pre-existing scope.
- Never declare a page ready without exercising the real browser surface.
