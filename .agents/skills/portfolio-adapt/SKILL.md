---
name: portfolio-adapt
description: Adapt portfolio pages across mobile, tablet, desktop, touch, keyboard, and assistive-technology contexts.
user-invocable: true
argument-hint: "[page] [target context]"
---

# Portfolio Adaptation

Adapt the information hierarchy, not only the pixel dimensions. Preserve the same content and route semantics across contexts.

## Required checks

- Test at 320px, 375px, 768px, 1024px, and a wide desktop viewport.
- Test portrait and landscape mobile layouts.
- Confirm `document.documentElement.scrollWidth <= window.innerWidth` at narrow widths.
- Keep primary content before decorative or secondary content in DOM order.
- Use fluid sizing, `min-width: 0`, wrapping, and content-driven breakpoints.
- Keep interactive targets comfortably touchable; use 44px as the baseline target size.
- Ensure keyboard focus is visible and the tab order follows reading order.
- Test at 200% zoom and with reduced motion enabled.

## Design rules

- Prefer one readable column on phones and intentional multi-column composition on larger screens.
- Do not hide critical information or actions on mobile.
- Avoid nested scrolling regions unless the content model requires them.
- Preserve accessible names and heading hierarchy when visual layouts change.
- Verify real browser screenshots and interaction, not only computed CSS.
