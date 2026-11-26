---
name: portfolio-polish
description: Perform the final quality pass on portfolio pages after behavior is complete, fixing visual, copy, accessibility, and interaction details.
user-invocable: true
argument-hint: "[page or feature]"
---

# Portfolio Polish

Run only after the feature works and its regression checks pass. Improve details without adding scope or destabilizing proven behavior.

## Pass sequence

1. Compare the page against existing portfolio patterns and its declared visual direction.
2. Check type hierarchy, line length, baseline alignment, spacing rhythm, and overflow.
3. Check contrast, focus rings, hover/active states, icon labels, landmarks, and reduced motion.
4. Check copy for factual precision, consistent capitalization, useful empty states, and clear source attribution.
5. Check desktop, tablet, phone, zoom, and keyboard views with the real browser.
6. Remove debug output, stale selectors, unused data, and accidental generated noise.

## Quality bar

- Every interactive control has default, hover, focus, active, and failure behavior where applicable.
- Every external link has intentional target behavior and safe opener isolation.
- Every dynamic collection handles zero, one, and many records.
- Decorative treatment never outranks the primary content.
- Keep color tokens, spacing values, and typography decisions coherent within the page.
- Fix only evidence-backed issues; do not rewrite stable unrelated code.

## Deliverable

Return the changed files, verified scenarios, remaining accepted limitations, and exact commands run. Never claim visual verification without a browser observation or screenshot.
