# NOVA — Design system

Everything here lives in `src/styles/index.css` as Tailwind v4 `@theme` tokens.
There is no JS theme object and no second source of truth. If a value is not in
this file, it should not be in a component.

---

## 1. The three rules

Most of what makes this page look expensive comes from restraint, not
decoration. Three rules do the work:

1. **One accent, used sparingly.** Golden amber appears on exactly one filled
   button per view, the active state, and anything an agent did. A second
   accent colour would halve the value of the first.
2. **Depth comes from hairlines and an inset top highlight**, never from grey
   box-shadows. On a near-black canvas a grey shadow reads as smudge.
3. **One entrance curve and one spring.** Every scroll reveal uses the same
   easing and the same duration. Inconsistent entrance timing is the loudest
   "assembled from templates" tell there is.

---

## 2. Colour

Warm near-black, not blue-black. This single decision separates the page from
the default dark-SaaS palette more than any other.

### Surfaces

| Token | Value | Role |
| --- | --- | --- |
| `--color-canvas` | `#0b0a09` | Page background |
| `--color-canvas-deep` | `#060505` | Footer, insets, deeper wells |
| `--color-surface` | `#131110` | Cards, panels |
| `--color-elevated` | `#1b1917` | Raised panels, popovers, app chrome |
| `--color-raised` | `#232019` | Hover and active surface |

### Lines

| Token | Value | Role |
| --- | --- | --- |
| `--color-line` | `#262220` | Default hairline |
| `--color-line-strong` | `#38322e` | Emphasised divider, rails, skeleton bars |

### Text — with measured contrast on `canvas`

| Token | Value | Ratio | Role |
| --- | --- | --- | --- |
| `--color-primary` | `#f5f2ed` | **17.7:1** | Headings, high emphasis |
| `--color-secondary` | `#a8a099` | **7.7:1** | Body copy, descriptions |
| `--color-muted` | `#8a837a` | **5.3:1** | Captions, meta, mono labels |

`muted` is the floor of the system and the one token that is contrast-pinned
rather than design-picked. It carries 9–11px mono meta labels, so it sits at the
lightest value that still reads as a third step below `secondary` while clearing
4.5:1 on `canvas` (5.3:1), `surface` (5.0:1) **and** `elevated` (4.7:1).

> It was originally `#6d665f`, which looked better and failed AA at 3.5:1 in 130+
> places. The automated audit caught it. Legibility won.
>
> One consequence: keycaps (`Kbd`) sit on `raised`, the lightest surface, where
> even the new `muted` lands at 4.3:1 — so they use `secondary` instead.

### Accent

| Token | Value | Role |
| --- | --- | --- |
| `--color-accent` | `#f2b13c` | The only fill colour. 10.5:1 on canvas. |
| `--color-accent-hover` | `#ffc65c` | Hover |
| `--color-accent-press` | `#d99c26` | Active |
| `--color-accent-ink` | `#15110a` | Text on accent fills. **10.0:1 on accent.** |

Amber rather than the blue/violet of the category: it is warm enough to sit in
the charcoal ramp without looking pasted on, and it reads as considered rather
than as "AI product".

### Semantic

| Token | Value | Hue | Role |
| --- | --- | --- | --- |
| `--color-success` | `#4fbe87` | 145° | Completed runs, delivered |
| `--color-warning` | `#f98e4f` | 22° | Outliers, high priority |
| `--color-error` | `#e04f5f` | 353° | Reserved; unused on this page |

Warning is pushed to orange-coral rather than amber so it cannot be mistaken for
the accent, which sits at 40°.

---

## 3. Typography

Four families, each with one job.

| Family | Token | Used for |
| --- | --- | --- |
| **Bricolage Grotesque** (variable) | `--font-display` | `text-display` / `h1` / `h2`, the wordmark, the marquee |
| **Instrument Sans** (variable) | `--font-sans` | Body, UI, and everything inside the product |
| **Instrument Serif** (italic) | `--font-serif` | Emphasis words inside headlines, and the featured pull-quote |
| **JetBrains Mono** (variable) | `--font-mono` | Kickers, meta, data, tool calls, keycaps |

**Why a separate display face.** Instrument Sans is an excellent interface
typeface and a forgettable display one — at 96px it reads as the same neutral
grotesque every SaaS page defaults to, which is precisely what makes a page look
generated rather than designed. Bricolage Grotesque was drawn as a humanist,
deliberately irregular counter to exactly those faces, and its **optical-size
axis** tightens and reproportions the letterforms as the type grows, so a large
heading looks drawn rather than scaled up. `font-optical-sizing: auto` does that
work automatically.

It is bound to the *type steps* (`.text-display`, `.text-h1`, `.text-h2`) rather
than to `h1`/`h2` elements, because `h3` and `h4` also label panes inside the
product UI — where the denser, more neutral Instrument Sans is the right voice.
`font-*` utilities still override it, so the escape hatch survives.

Display tracking is looser than it would be for a neutral grotesque
(−0.03em rather than −0.038em at display size): Bricolage carries more character
in its letterforms, and over-tightening flattens it back into anonymity.

The serif is the editorial move. It appears only as a single italicised word
inside a headline — *intelligent*, *Everything*, *to work*, *unfair* — via the
`font-editorial` utility. Used on a whole paragraph it would look like a
different website.

Mono is not decoration either: it marks things a machine produced or measured —
timestamps, counts, tool names, shortcuts.

### Scale

Fluid via `clamp()`, so there are no breakpoint-specific font sizes anywhere.

| Token | Size | Leading | Tracking | Use |
| --- | --- | --- | --- | --- |
| `text-display` | `clamp(2.75rem, 7.2vw, 6rem)` | 0.94 | −0.03em | Hero only |
| `text-h1` | `clamp(2.25rem, 4.6vw, 3.75rem)` | 1.02 | −0.025em | Workflow stages, final CTA |
| `text-h2` | `clamp(1.875rem, 3.3vw, 3rem)` | 1.06 | −0.021em | Section headings |
| `text-h3` | `clamp(1.25rem, 1.8vw, 1.625rem)` | 1.2 | −0.017em | Card and FAQ headings |
| `text-lead` | `clamp(1.0625rem, 1.25vw, 1.25rem)` | 1.55 | −0.011em | Section intros |
| `text-body` | `1rem` | 1.65 | −0.006em | Default |
| `text-caption` | `0.875rem` | 1.5 | — | Card copy, buttons |
| `text-micro` | `0.8125rem` | 1.45 | — | Application UI |
| `text-kicker` | `0.6875rem` | 1 | +0.16em | Mono eyebrows |

Negative tracking scales with size — the larger the type, the tighter it is set.
That relationship is what makes large display type look drawn rather than
stretched.

**Application UI is deliberately smaller than marketing copy** (`text-micro`
13px and below). Real software has denser type than the page selling it;
matching the two makes product screenshots read as illustrations.

---

## 4. Rhythm and layout

Vertical rhythm is owned by one component, `<Section>`. Section components never
set their own `py` — that is how spacing drifts.

| Density | Padding |
| --- | --- |
| `tight` | `py-16 md:py-20 lg:py-24` |
| `default` | `py-20 md:py-28 lg:py-36` |
| `loose` | `py-24 md:py-36 lg:py-48` |

Widths are owned by `<Container>`:

| Width | Max | Use |
| --- | --- | --- |
| `text` | 44rem | Prose (~68ch) |
| `default` | 76rem | Standard content column |
| `wide` | 86rem | Product surfaces and full-bleed grids |

Sections that face each other across a boundary use `rule` — a hairline that
fades out at both ends rather than hitting the viewport edge.

The feature grid runs a **six-column bento with an alternating rhythm**:
`4+2`, then `2+4`, then `3+3`. The wide block changes sides each row, so the eye
lands somewhere new. Six equal cards would read as a template regardless of
what was inside them.

---

## 5. Radii and elevation

| Token | Value |
| --- | --- |
| `--radius-xs` → `--radius-2xl` | 4 / 6 / 9 / 13 / 18 / 24px |

Restrained on purpose. Most surfaces use 9–13px; only the closing CTA panel
reaches 24px. Large radii read friendly-consumer, not editorial.

Elevation is three composed shadows, defined in `:root` and exposed as
utilities:

```css
--lift-1: inset 0 1px 0 0 rgb(255 255 255 / 0.04);
--lift-2: inset 0 1px 0 0 rgb(255 255 255 / 0.055), 0 24px 48px -28px rgb(0 0 0 / 0.9);
--lift-3: inset 0 1px 0 0 rgb(255 255 255 / 0.07), 0 40px 80px -40px rgb(0 0 0 / 0.95), …
```

Every level leads with an **inset top highlight** — a 1px catch of light on the
top edge. That is what makes a panel sit *above* a dark surface. The drop is
long, very soft and nearly black; it adds weight without adding grey.

---

## 6. Texture

Three decorative layers, all `aria-hidden`, all nearly invisible individually:

| Utility | What it is | Where |
| --- | --- | --- |
| `bg-grid` / `bg-grid-sm` | 1px rules at 56px / 22px, 2.8–4% white | Hero, mobile menu, unified panel, featured quote |
| `bg-grain` | SVG `feTurbulence`, ~16–22% | Hero, closing CTA |
| `rule-x` | Hairline that fades at both ends | Section boundaries |

Grain is the cheapest available fix for the flat-vector look that makes a dark
page read as a render. On the light closing panel it is `mix-blend-multiply`; on
dark it is `mix-blend-soft-light`.

The hero also uses a **warm top-light** — a linear gradient falling from the top
edge at 6% accent — instead of the radial glow blob the category defaults to.
Light falls from somewhere; it does not hover in the middle of the page.

---

## 7. Motion

The whole vocabulary is `src/lib/motion.ts`. Two rules:

1. Only `opacity`, `transform` and `clip` animate. Never layout properties —
   with one deliberate exception, the accordion, which animates height because
   nothing else expresses a disclosure.
2. One curve for entrances, one spring for anything the user directly caused.

| Token | Value | Use |
| --- | --- | --- |
| `EASE_OUT` | `cubic-bezier(0.22, 1, 0.36, 1)` | Every entrance and scroll reveal |
| `EASE_IN_OUT` | `cubic-bezier(0.76, 0, 0.24, 1)` | Reversible state (accordions, tabs) |
| `SPRING` | stiffness 380, damping 32 | Toggles, sliding indicators |
| `SPRING_SOFT` | stiffness 240, damping 28 | Panels and drawers |

Durations sit between 0.2s (state change) and 0.85s (large entrance). Stagger is
0.055–0.09s and chains are kept short — a long cascade reads as a showreel.

`<Reveal>` is the single scroll-entrance for the entire site, so the rhythm of
reveals is identical top to bottom.

### The signature moves

Five pieces of motion define how the page feels. Everything else is the shared
`Reveal` entrance.

| Move | Where | What it does |
| --- | --- | --- |
| **Word mask** | Every heading | Each word sits in its own overflow-hidden box and rises from beneath it, so a headline is *uncovered* rather than faded. Masking per word (not per line) survives any measure and any rewrap. |
| **Perspective settle** | Hero preview | The product window enters tilted ~15° back and flattens as you scroll into it. Scroll-driven, so it is reversible. |
| **Velocity marquee** | Type band | Always drifting; scroll velocity adds to its speed and skews it, and scrolling up reverses direction. |
| **Pointer spotlight** | Feature and pricing cards | A warm wash follows the cursor and the 1px border lights only where it is. |
| **Magnetic pull** | Primary CTAs only | The button leans toward the cursor and springs back. |

Two rules keep these from becoming a showreel. **One showstopper per section** —
never two competing for the same glance. And **the spotlight and magnet write to
the DOM, not to state**: `usePointerSpotlight` sets CSS custom properties
directly, so a cursor crossing six cards triggers zero React renders. A card
grid that re-renders on mousemove is the difference between premium and janky.

The outlined word treatment in the marquee (`text-outline`) exists so alternate
words read as negative space rather than as a second weight — rhythm without
introducing another colour or another font.

### Motion that carries information

Three animations are not decoration and are worth calling out:

- **The convergence curves** in the problem section draw on scroll. The argument
  — five fragmented tools funnelling into one surface — is made geometrically
  rather than in prose.
- **The assistant stream** pauses on "reading 3 sources" before any text
  appears, then lands characters in 1–3 character bursts at jittered intervals.
  A perfectly even typewriter is the tell that it is a CSS animation.
- **The agent run** is paced by each step's own `durationMs`, so a sweep the
  copy describes as twelve seconds does not finish in one.

### Reduced motion

`useReducedMotion()` is checked in every animated component, not just relied on
via CSS. Entrances render in place, the typewriter resolves to the full string,
the agent run jumps to finished, and the CSS base layer clamps everything left
to 0.01ms.

---

## 8. Component inventory

**Primitives** — `Button` (4 variants × 3 sizes), `Container`, `Section`,
`SectionHeading`, `Kicker`, `Reveal`, `WordReveal`, `Magnetic`, `Scramble`,
`SegmentedControl`, `Icon`, `BrandGlyphs`.

**Chrome** — `Navbar`, `MobileMenu`, `Logo`, `Footer`, `ScrollProgress`.

**Product UI** — `AppShell` + `ShellButton`, `Sidebar`, `WorkspacePane`,
`DocumentList`, `TaskList`, `ActivityFeed`, `AnalyticsPane`, `AgentsPane`,
`AiPanel`, `CommandPalette`, `Toast`, `Avatar` + `AvatarStack`, `StatusDot`,
`Sparkline`, `Kbd`, `HeroPreview`.

**Visuals** — six feature visualisations, five workflow stage visualisations.

The product UI components are shared between the hero preview and the
interactive dashboard, which is why both read as the same application. The two
sections deliberately show **different screens** — showing one dashboard twice
is the tell that a page only had one asset to work with.

---

## 9. Conventions

- Icons are referenced **by string name** through `components/primitives/Icon`.
  Data files never import a component. `npm run lint:icons` reports unused
  registry entries, which matter because an object literal is not tree-shakeable.
- Stroke width is **1.6** everywhere, not Lucide's default 2. Finer strokes read
  more expensive at small sizes.
- Agents and people are always visually distinguished — agents get the accent
  and a mono face. In a product where both edit the same document, that
  distinction is the entire trust story and is never left to a label alone.
- Focus is one treatment site-wide: a 2px accent ring at 2px offset, declared
  once on `:focus-visible`.
- When you add a colour or font-size token, **add it to `lib/cn.ts` as well** —
  see the README for why.
- Headings take **plain strings**, not JSX. `WordReveal` needs to split on
  spaces, so emphasis is declared with the `emphasis` prop rather than by
  wrapping a `<span>` in the markup.
