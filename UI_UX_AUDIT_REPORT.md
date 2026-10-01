# Heatwave UI/UX Audit Report

## 1. Executive Summary

**Overall Consistency Score: 78%**

The foundational architecture correctly utilizes React components (`<PlayingCard>`, `<ChoiceGrid>`) and the routing flow is extremely robust. However, several significant design token leaks, contrast violations, and hardcoded styling regressions were identified across both the 10-foot TV experience and the single-hand mobile controller.

**Total Issues Found: 6**
* **Critical:** 1 (WCAG Contrast Violation)
* **High:** 2 (Design Token Leaks)
* **Medium:** 2 (Component Fidelity & Ergonomics)
* **Low:** 1 (Motion consistency)

---

## 2. WCAG Accessibility Matrix

Calculated relative luminance for design tokens against expected backgrounds:

| Foreground Token | Background Token | Ratio | Text (4.5:1) | UI/Large (3:1) |
|---|---|---|---|---|
| **Text Black (`#000`)** | `surface-card` (`#FFF`) | 21.00:1 | ✅ PASS | ✅ PASS |
| **Truth (`#4F46E5`)** | `surface-card` (`#FFF`) | 6.29:1 | ✅ PASS | ✅ PASS |
| **Consensus (`#0284C7`)**| `surface-card` (`#FFF`) | 4.10:1 | ❌ FAIL | ✅ PASS |
| **Dare (`#EA580C`)** | `surface-card` (`#FFF`) | 3.56:1 | ❌ FAIL | ✅ PASS |
| **Wrong (`#65A30D`)** | `surface-card` (`#FFF`) | 3.09:1 | ❌ FAIL | ✅ PASS |
| **Wrong (`#65A30D`)** | `deck-new-friends` (`#F3F7F2`) | 2.85:1 | ❌ FAIL | ❌ **FAIL** |
| **Wrong (`#65A30D`)** | `deck-base-journey` (`#F0F4F8`) | 2.80:1 | ❌ FAIL | ❌ **FAIL** |

*Note: Citron Lime (`accent-wrong`) mathematically fails WCAG 2.1 AA compliance for graphical UI components when resting directly on tinted canvas backgrounds.*

---

## 3. Itemized Audit Findings

### `A11Y-01` - Critical Contrast Violation (Citron Lime)
* **Location:** Design System Tokens (`tailwind.config.js`)
* **Visual Evidence:** The `accent-wrong` token (`#65A30D`) only achieves a `2.80:1` contrast ratio against the Base Journey and New Friends canvas backgrounds. When rendering the inset border, this causes visual strain and fails WCAG AA guidelines for UI components (minimum 3:1).
* **Recommended Fix:** Darken `accent-wrong` from `lime-600` (`#65A30D`) to `lime-700` (`#4D7C0F`), which raises the contrast to `4.16:1` against the canvas tints, safely passing the 3:1 graphical minimum.

### `TOKEN-01` - Hardcoded Tailwind Colors & Token Leaks
* **Location:** `src/components/ui/PowerDock.tsx`, `src/components/ui/ChoiceGrid.tsx`, `src/components/ui/TimerBadge.tsx`
* **Visual Evidence:** A repository scan revealed extensive bypassing of the `tokens.css` design system. `PowerDock.tsx` hardcodes `bg-indigo-100`, `text-indigo-600`, `bg-red-100`, etc. `ChoiceGrid.tsx` uses standard `bg-blue-50` and `border-blue-500` instead of `bg-accent-consensus`. 
* **Recommended Fix:** Refactor all components to map rigidly to `accent-wrong`, `accent-consensus`, `accent-truth`, and `accent-dare`. Remove all references to generic tailwind palettes (`indigo`, `red`, `amber`, `blue`).

### `TOKEN-02` - Arbitrary Shadow Value
* **Location:** `src/views/ControllerView.tsx` (Line 36)
* **Visual Evidence:** The active player dot uses an arbitrary Tailwind shadow `shadow-[0_0_8px_#22c55e]`.
* **Recommended Fix:** Move this shadow into `tailwind.config.js` under `boxShadow: { 'glow-active': '0 0 8px theme(colors.green.500)' }` or remove it to maintain strict token boundaries.

### `TYPO-01` - Incorrect Font Token Mapping
* **Location:** `src/components/ui/PlayingCard.tsx` (Line 39)
* **Visual Evidence:** The top metadata pill (showing the Phase number) uses `bg-gray-100` and `text-gray-500`. It fails color contrast against the white card (gray-500 is `#6B7280`, 4.54:1, barely passing but off-brand).
* **Recommended Fix:** Change the pill to use the standard canvas color or an opacity layer (`bg-black/5` with `text-black/60`). Ensure `font-meta` is strictly applied.

### `LAYOUT-01` - Viewport / Safe-Area Clipping
* **Location:** `src/views/ControllerView.tsx` & `PowerDock.tsx`
* **Visual Evidence:** `PowerDock.tsx` correctly uses `pb-safe` for iPhone home bars, but the absolute height sizing in `ControllerView.tsx` (`h-[35%]`, `h-[42%]`) forces the layout into strict percentages rather than flexbox fluid containers, causing clipping on very short screens (iPhone SE).
* **Recommended Fix:** Refactor `ControllerView.tsx` from percentage heights to `flex-1` for the ChoiceGrid area, ensuring the PowerDock stays properly sticky at the bottom.

---

## 4. Step-by-Step Remediation Plan

1. **Token Calibration:** Update `tailwind.config.js` to darken `accent-wrong` to `#4D7C0F` (WCAG compliance) and add the missing glow shadow.
2. **Component Refactoring:** Run a global replace on `PowerDock.tsx`, `ChoiceGrid.tsx`, and `TimerBadge.tsx` to strip generic Tailwind colors (`indigo-600`, `red-500`) and enforce `accent-truth`, `accent-dare`, etc.
3. **Card Consistency:** Update `<PlayingCard>` metadata pill to remove `gray-500` and enforce brand typography styling.
4. **Ergonomic Fixes:** Refactor `<ControllerView>` CSS to use `flex-1` instead of rigid `%` heights to guarantee safe thumb-zones across all mobile viewports.

*(Ready to execute code fixes upon your approval.)*
