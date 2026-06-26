# Parite — Design System (Refined Dark)

A clean, calm, trustworthy finance aesthetic. Flat indigo-charcoal canvas, subtle
bordered surfaces, one restrained emerald accent, and a consistent **Lucide** line-icon
set. Clarity and legibility over decoration — no neon, no gradients, no glow.

> Note: the app originally shipped a "holographic / cosmic" look; it was replaced because
> heavy gradients, neon glow, and emoji icons read as edgy and unpolished for a finance
> app. See `docs/rn/DECISIONS.md` (ADR-015..018) for the rationale.

## 1. Principles

1. **Calm over flashy.** A finance app must feel trustworthy. Restraint is the style.
2. **One accent.** A single emerald accent marks the primary action and active state. Nothing else competes.
3. **Flat surfaces.** Cards are a solid fill + 1px hairline border — no blur, no shadow drama.
4. **Icons are literal.** Every category/account/tab uses a precise Lucide line icon (1:1 with the thing).
5. **Legibility first.** High text contrast, clear hierarchy, generous spacing.
6. **Accessible.** Never encode meaning in color alone — the +/− sign carries direction; income is green but always paired with the sign.

## 2. Color

### Canvas
| Token | Hex | Use |
|---|---|---|
| `bg` | `#0F1216` | app background |
| `surface` / `card` | `#181B21` | cards, grouped rows |
| `surfaceAlt` | `#13161B` | tab bar, sunken areas |
| `border` | `#232830` | hairline card border |
| `borderStrong` | `#2D343E` | raised surfaces (sheets) |
| `text` | `#E7E9EE` | primary text |
| `textMuted` | `#7A828F` | secondary text |
| `textFaint` | `#4B515C` | tertiary / disabled |

### Accent (emerald)
| Token | Hex |
|---|---|
| `accent` | `#3DD68C` |
| `accentBright` | `#52E39C` |
| `accentBlue` | `#5B8DEF` (links / info) |
| `onAccent` | `#0F1216` (text on accent) |

### Semantic
| Token | Hex | Note |
|---|---|---|
| `income` | `#3DD68C` | paired with `+` |
| `expense` | `#E7E9EE` | neutral; the `−` sign conveys direction |
| `warning` | `#F59E0B` | |
| `danger` | `#EF4444` | delete / erase |

### Category palette (refined, distinct, non-neon)
`#F4725E · #3DD68C · #5B8DEF · #8B5CF6 · #F59E0B · #EC4899 · #06B6D4 · #EF4444 ·
#3B82F6 · #F472B6 · #14B8A6 · #94A3B8` — used as the icon tint over a `${color}22` tile.

## 3. Iconography

- **Library:** [Lucide](https://lucide.dev) via `lucide-react-native` (line, `strokeWidth: 2`).
- **Mapping:** `src/components/icons/catalog.ts` maps each seeded `nameKey` → an exact icon
  (Food→Utensils, Groceries→ShoppingCart, Transport→Car, Bills→Receipt, Health→HeartPulse,
  Salary→Wallet, Cash→Banknote, Card→CreditCard, Savings→PiggyBank, …).
- **Tile:** `IconTile` renders the icon in a soft `${color}22` rounded square — no glow.
- **Tabs:** Home→House, History→Receipt, Stats→ChartColumn, Profile→User; center Add→Plus.

## 4. Surfaces

- **Card:** `surface` fill, `border` 1px, radius 16 (raised: `borderStrong`, radius 20).
- **No glass blur** (the `expo-blur` BlurView survives only in the bottom Sheet).
- **Shadows:** soft, subtle depth only (`shadow.depth` / `depthSm`). No colored glow.

## 5. Typography

- Display: **Space Grotesk** (balance figures, tabular). Body/UI: **Inter**.
- Scale (pt): Hero 48 · Title 28 · Heading 20 · Body 16 · Caption 13 · Micro 11.
- Money uses tabular figures so digits don't jitter.

## 6. Spacing & radius

- Spacing 4pt grid: `xs 4 · sm 8 · md 12 · base 16 · lg 24 · xl 32`.
- Radius: `sm 8 · md 12 · base 16 · lg 20 · pill 999`. Touch targets ≥ 44pt.

## 7. Buttons & controls

- **Primary:** solid `accent` fill, `onAccent` label, radius 16 (`NeonButton` — name kept).
- **Center Add:** rounded-square (16) accent FAB with a Plus icon. Tap → add expense, long-press → add income.
- **Segmented (Expense/Income):** sliding accent thumb over `surface`.
- **Tab bar:** solid `surfaceAlt`, hairline top border; active item in `accent`.

## 8. Motion

- Durations: fast 120ms · base 220ms · slow 360ms. Spring default `{ damping 18, stiffness 180 }`.
- Press: scale 0.96 spring-back. Number count-up 600ms ease-out. List rows fade-up, staggered.
- Respect reduce-motion.

## 9. Responsiveness

- Design in points; test iPhone SE (375) → 16 Pro Max (440). `useSafeAreaInsets()` for notch /
  Dynamic Island / home indicator — never hardcode. `scale()` clamps against a 375pt guideline.
