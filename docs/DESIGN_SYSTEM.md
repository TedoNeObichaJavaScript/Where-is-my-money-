# Parite — Holographic Design System ("Out of Space")

The look: a calm, premium **cosmic** interface. Indigo-black void, aurora light, glass panels
floating over blurred nebula orbs. Drama comes from **color and light**, not clutter. Glow is
rationed — only the hero number and the primary action emit light.

## 1. Principles

1. **Indigo-black, never pure black.** `#000000` reads flat and cheap. Base is `#0A0A14`.
2. **≤ 2 neons.** One deep base + one dominant accent + one secondary. More = tacky.
3. **Glow the one thing.** The balance hero and the center "Add" button glow. Nothing else.
4. **Glass needs a busy backdrop.** Blur panels only sit over gradients/orbs, never flat color.
5. **Light carries hierarchy.** Restrained geometric type; let color and depth do the work.
6. **Motion is physical.** Springs, not linear tweens. UI-thread (Reanimated) only — never drop frames.
7. **Accessible by structure.** Never encode meaning in red/green alone. Maintain text contrast.

## 2. Color

### Canvas
| Token | Hex | Use |
|---|---|---|
| `bg` | `#0A0A14` | app background (void) |
| `surface` | `#12121F` | elevated sections |
| `card` | `#1A1A2E` | glass card base fill |
| `cardGlass` | `rgba(17,25,40,0.55)` | glass fill over orbs |
| `border` | `rgba(255,255,255,0.12)` | hairline glass border |
| `text` | `#E2F3FF` | primary text |
| `textMuted` | `#8A93B2` | secondary text |

### Aurora accents (default theme)
| Token | Hex |
|---|---|
| `accent` (teal) | `#04E2B7` |
| `accentBright` | `#0EF3C5` |
| `accentBlue` | `#5B8DFF` |
| `deep` | `#025385` |

### Semantic
| Token | Hex | Note |
|---|---|---|
| `income` | `#04E2B7` | + pair with ↑ icon, not color alone |
| `expense` | `#FF6AD5` | magenta, pair with ↓ icon |
| `warning` | `#E8C07A` | |

### Alternate themes (selectable)
- **Prism** (high energy): magenta `#FF6AD5` · `#FF9DFB` · cyan `#7AF5FF` · `#5B8DFF`
- **Nebula** (moody): `#091833` base · violet `#711C91` · `#EA00D9` · `#0ABDC6`

## 3. Gradients

```ts
auroraBg     = ['#025385', '#04E2B7', '#0EF3C5', '#5B8DFF']   // 120deg, animate position
nebulaOrbA   = radial('30% 20%', '#711C91', 'transparent 60%')
nebulaOrbB   = radial('75% 70%', '#EA00D9', 'transparent 55%')
hero         = ['#0A0A14', '#1A0A2E', '#2D1B4E']              // 160deg
iridescent   = ['#FF6AD5', '#7AF5FF', '#5B8DFF', '#FF9DFB']   // 135deg, screen blend
```
Add extra stops + OKLCH interpolation to kill banding on dark gradients.

## 4. Glass (dark recipe)

```
fill:    rgba(17,25,40,0.55)
blur:    12px  (sweet spot 10–20)  + saturate(160%)
border:  1px solid rgba(255,255,255,0.12)
radius:  16
shadow:  0 8px 32px rgba(0,0,0,0.36)   // depth, soft + large + low-opacity
```
RN: `expo-blur` `<BlurView intensity={30} tint="dark">` + semi-transparent overlay + border.

## 5. Glow / shadows

```
depth:      0 8px 32px rgba(0,0,0,0.36)               // every card
neonHalo:   0 0 4px  rgba(4,226,183,0.9),             // primary action only
            0 0 12px rgba(4,226,183,0.5),
            0 0 28px rgba(4,226,183,0.25)
textGlow:   0 0 8px rgba(94,141,255,0.6)              // hero number only
```
RN has no multi-shadow on one view → stack layered absolutely-positioned glow layers, or use
a Skia blurred halo behind the element. Reserve Skia for the hero + Add button.

## 6. Typography

- Display font: **Space Grotesk** (geometric, slightly technical — fits cosmic).
- Body font: **Inter**.
- Scale (pt): Display 48 · Title 28 · Heading 20 · Body 16 · Caption 13 · Micro 11.
- Money hero uses tabular/monospace figures so digits don't jitter while animating.

| Style | Size | Weight | Use |
|---|---|---|---|
| Hero | 48 | 700 | balance number |
| Title | 28 | 600 | screen titles |
| Heading | 20 | 600 | section headers |
| Body | 16 | 400/500 | rows, labels |
| Caption | 13 | 500 | meta, deltas |

## 7. Spacing & radius

- Spacing: 4pt grid → `xs 4 · sm 8 · md 12 · base 16 · lg 24 · xl 32 · 2xl 48`.
- Radius: `sm 8 · md 12 · base 16 · lg 20 · xl 28 · pill 999`.
- Touch targets ≥ 44pt. Center Add button ≈ 64pt.

## 8. Motion

- Durations: fast 120ms · base 220ms · slow 360ms.
- Spring (default): `{ damping: 18, stiffness: 180, mass: 1 }`.
- Number count-up: 600ms ease-out on value change.
- Press: scale 0.96 + glow intensify, spring back.
- Use Reanimated worklets for everything interactive; Moti for mount/unmount.

## 9. Responsiveness (iOS + Android)

- Design in **points**, test extremes: iPhone SE 375pt → 16 Pro Max 440pt.
- `useSafeAreaInsets()` for top/bottom — never hardcode notch/Dynamic Island height.
- `scale()` util normalizes against a 375pt guideline width; clamp so text never balloons.
- Tab bar sits above `insets.bottom`; hero/header below `insets.top`.
- Respect `prefers-reduced-motion` (disable count-up + ambient drift).

## 10. Performance budget

- 60fps minimum, target 120fps on ProMotion.
- Ambient gradient drift on UI thread, paused when app backgrounded.
- Blur is expensive on old Android — cap concurrent BlurViews; fall back to solid `card` fill
  below Android 12 or when `reduceTransparency` is on.
- Lists use FlashList; charts use Skia (GPU) not SVG for >50 points.
