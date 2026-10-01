# Handsy Design System (Formerly Heatwave)

**Tagline:** *Keep your friends close. Keep your hands closer.*
**Domain:** `handsy.party`

## 1. Principles
- **Accessible Tacky-Pop Tactile:** Combines brutalist zero-blur solid drop shadows with sharp-meets-rounded geometric shapes.
- **Strict Token Boundaries:** Zero arbitrary hex codes. All styles MUST map to `tailwind.config.js` semantic tokens.

## 2. Canvas & Surfaces
- **Day Party Buttermilk (`canvas-light`):** `#FFF7F2`
- **Lounge Night Plum Noir (`canvas-night`):** `#1E1022`
- **Card Surface Light:** `#FFFFFF`
- **Card Surface Night (Fig Slate):** `#311938`

## 3. Typography
- **Display (The Stage):** `Bricolage Grotesque` (Variable Grotesque Sans) - used for prompts, hero headers, and expressive, high-impact typography.
- **Body & Meta (The Controller):** `Plus Jakarta Sans` (Geometric Sans) - used for options, descriptions, pills, badges, timers, and tactical power buttons. Excellent legibility at small sizes.
*Note: No other fonts are permitted in the application.*

## 4. Contrast & Asymmetric Inversion
Text colors dynamically invert to meet WCAG AA contrast (≥ 4.5:1).
- **Dark Ink (`ink-primary`):** `#1C1024` on light, `#FDF6FF` on night.
- When an element is filled with **Wrong Answers (Tangerine, `#FF7700`)** or **Consensus (Poolside Cyan, `#00CDE5`)**, the inner text MUST be strictly `#1C1024` for max contrast.
- When an element is filled with **Dare (Hot Coral, `#D91456`)** or **Truth (Grape Violet, `#6818D6`)**, the inner text MUST be strictly `#FFFFFF`.

## 5. Shadow Primitives
No soft blurs. All elevations use offset brutalist shapes:
- `shadow-solid`: `4px 4px 0px 0px var(--shadow-color)`
- `shadow-solid-sm`: `2px 2px 0px 0px var(--shadow-color)`

## 6. Components
- `<PlayingCard>`: Soft `rounded-3xl` outer silhouette, sharp 90-degree 4px solid inner border (`rounded-none`). Intersecting rounded emblems cleanly cut the stroke.
- `<ChoiceGrid>`: `rounded-2xl`, 2px solid outlines, text respects Asymmetric Inversion.
- `<PowerDock>`: Sticky dock, asymmetric corners for buttons (`rounded-tl-2xl rounded-br-2xl rounded-tr-sm rounded-bl-sm`), rectangular `Space Mono` charge badges.
