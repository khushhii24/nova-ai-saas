# NOVA — Case study

**Marketing site and product UI for an AI workspace platform**
Concept project · Design + frontend · 2026

---

## Project summary

NOVA is a fictional AI workspace platform: research, writing, analysis,
automation and AI agents in one place, instead of spread across a dozen tools.

The site had to sell a product category that is currently drowning in noise.
Every AI company claims the same things in the same violet gradients, so the
brief was not "describe the features" — it was **make the claim credible**.

The answer was to stop describing the product and start showing it. The page
contains a working application: a dashboard with a functioning command palette,
tabs that filter real records, task checkboxes that change state, and an agent
run that replays step by step at the pace its own timings describe. A visitor
does not have to take the claim on trust; they can press ⌘K.

---

## Design challenge

Four problems, in the order they mattered:

**1. The category looks identical.** Dark background, violet gradient, glowing
blob, three equal feature cards. Any page that follows that pattern is invisible
regardless of how well it is built.

**2. AI demos are not believed.** Marketing pages show polished screenshots of
AI doing impressive things, and readers have learned to discount them. A static
image of an agent "working" proves nothing.

**3. The page has to be *product* work, not just *page* work.** The audience
buys software. Showing that I can design a landing page is half the job; showing
that I can design the application behind it is the other half.

**4. It has to survive scrutiny.** A portfolio piece gets opened in dev tools,
resized, and tabbed through. Craft that only exists at 1440px is not craft.

---

## Design direction

### Warm, not cold

The single most consequential decision: the entire surface ramp is **warm
near-black** (`#0b0a09`) rather than the blue-black the category defaults to.
It costs nothing and separates the page from its competitors before a single
word is read.

### One accent, rationed

Golden amber `#f2b13c`, and nothing else. It appears on exactly one filled
button per view, the active state, and anything an agent touched. Amber was
chosen over the category's blue/violet because it is warm enough to belong in
the charcoal ramp, and because it reads as *considered* rather than as
*AI product*. Semantic colours are deliberately hue-separated from it so a
warning can never be mistaken for the brand.

### Type as the differentiator

Four families, each with one job:

- **Bricolage Grotesque** — display. Drawn as a humanist, deliberately irregular
  counter to neutral grotesques, with an **optical-size axis** that reproportions
  the letterforms as type grows. Large headings look drawn, not scaled.
- **Instrument Sans** — body and the entire product UI.
- **Instrument Serif italic** — a single emphasis word inside a headline.
  *intelligent*, *Everything*, *unfair*. Never a whole sentence.
- **JetBrains Mono** — anything a machine produced or measured: timestamps,
  counts, tool calls, keycaps.

The display face is bound to the *type steps*, not to `h1`/`h2` elements,
because `h3` also labels panes inside the product — where the denser, more
neutral Instrument Sans is correct. Mixing a characterful face into a dashboard
makes product UI look costumed.

### Depth without shadows

On a near-black canvas a grey box-shadow reads as smudge. Every elevated surface
leads with a **1px inset top highlight** — a catch of light on the top edge —
followed by a long, very soft, nearly-black drop. Combined with a fine 1px grid
and an SVG film grain, it stops the page reading as flat vector fill.

### Breaking the card wall

The feature grid runs a six-column bento on an **alternating rhythm** — 4+2,
then 2+4, then 3+3 — so the wide block changes sides each row and the eye lands
somewhere new. Between the grid and the product window sits a full-bleed type
band, the one moment on the page that is not a bordered box.

---

## Key features demonstrated

| Area | What it shows |
| --- | --- |
| **Marketing design** | Editorial asymmetric hero, alternating bento, inverted closing CTA, twelve-section narrative |
| **Product UI design** | Three-pane workspace, sidebar, filterable tables, agent roster, analytics, assistant panel, command palette |
| **Design system** | Tokenised colour/type/space/radius/elevation, reusable primitives, documented rules |
| **Motion design** | Five distinct signature techniques, one shared vocabulary, full reduced-motion support |
| **Data visualisation** | Hand-built sparklines, column chart, share meters — no charting dependency |
| **Interaction design** | Working keyboard models, real filtering, honest state changes |
| **Accessibility** | AA contrast verified by measurement, full keyboard traversal, semantic structure |
| **Responsive engineering** | Recomposed layouts at five breakpoints, plus container-query components |

---

## Implementation

**React 19 · TypeScript (strict) · Tailwind CSS v4 · Motion · Vite 8**

Ten runtime dependencies. No component library, no CSS framework beyond
Tailwind, no state manager, no charting library, no animation helpers.

### Architecture

```
styles/index.css   Design tokens as Tailwind v4 @theme — one source of truth
lib/               Class merging, the shared motion vocabulary
hooks/             Nine behavioural hooks, each doing one thing
data/              All content and mock records. No JSX, no component imports
components/
  primitives/      Button, Section, WordReveal, Magnetic, Scramble, Icon…
  chrome/          Navbar, MobileMenu, Footer, ScrollProgress
  product/         The application UI — shared by two different page sections
  visuals/         Eleven bespoke visualisations
  sections/        Twelve page sections, composed from the above
```

73 source files, ~7,600 lines. No file exceeds ~330 lines.

### Three decisions worth defending

**Data is strictly separate from presentation.** Data files contain no JSX and
import no components — icons are referenced by *string name* through a registry.
Every record is plain serialisable data shaped the way an API would return it,
so swapping in a real backend never touches a view.

**Vertical rhythm is owned by one component.** Section components never set
their own padding. That is how spacing drifts and a page starts to look
assembled rather than designed.

**Components respond to their container, not the window.** The KPI tile renders
both in a wide hero preview and in a ~430px dashboard pane. It uses a container
query to drop its sparkline when *it* is narrow — a media query would have been
wrong in one of the two places.

---

## Interactions

**Signature motion**

- **Word mask** — every heading is uncovered word by word, each word rising from
  its own mask. Per-word rather than per-line, so it survives any rewrap.
- **Perspective settle** — the hero product window enters tilted ~15° back and
  flattens as you scroll into it. Scroll-driven, therefore reversible.
- **Velocity marquee** — the type band drifts constantly, but scroll speed adds
  to its speed and skews it, and scrolling up reverses it.
- **Pointer spotlight** — cards light where the cursor is, wash and border edge.
- **Magnetic pull** — primary CTAs lean toward the cursor and spring back.

**Working product interactions**

- `⌘K` command palette — type to filter, ↑/↓ across group boundaries, ↵ to run,
  Esc to dismiss. Bound **only while the section is in view**, so the page never
  steals the browser's find shortcut.
- Sidebar switches panes; tabs filter real records by kind and by owner.
- Task checkboxes cycle todo → doing → done. Agent cards expand.
- The assistant streams: a "reading sources" pause, then irregular character
  bursts, then citations resolving after the answer completes.
- The agent run replays paced by each step's own duration, with a replay control.
- Billing switch with radiogroup semantics and arrow-key support.
- Scroll-linked five-stage workflow on desktop; a plain stacked list below
  `lg`, because scroll-linked staging fights a thumb.

**Everything honours `prefers-reduced-motion`** — checked in JavaScript per
component, not just clamped in CSS.

---

## Quality process

A Playwright pass drives the built site at **1023 / 1024 / 1180 / 1440 / 1280 /
768 / 390** and asserts: no horizontal overflow, no console errors, every anchor
resolves, exactly one `h1` with no skipped levels, and the **computed contrast
ratio of every text node** against its real composited background at the correct
AA threshold for its size. It also drives the interactions to confirm they work.

That audit earned its keep three times:

1. It caught a `tailwind-merge` misconfiguration silently deleting classes — the
   library did not know this theme's custom colour and font-size scales, so it
   filed them in one conflict group and dropped whichever came first. It had
   stripped the dark ink off every small primary button and knocked the entire
   app-UI type scale back to 16px.
2. It found **140+ contrast failures** traced to one token being too dark.
3. At 1024 it surfaced KPI labels truncating to "Agent…" — the finding that led
   to the container-query rewrite.

Final state: clean at every width.

---

## Backend readiness

Frontend-only by design. All state is local React state; all content is typed
mock data.

| Surface | Module to replace | Becomes |
| --- | --- | --- |
| Documents, tasks, activity, spaces | `data/workspace.ts` | `GET /workspace/*` — row types are already the response shapes |
| Task status | `TaskList` local state | `PATCH /tasks/:id`, optimistic |
| Assistant | `useTypewriter` + `aiThread` | Streaming endpoint; the `idle → thinking → streaming` machine already models real latency, and `sources` is the citation payload |
| Command palette | `commandGroups` | Debounced server search; `onSelect` is the dispatch point |
| Agent run | `data/agent.ts` + `useAgentRun` | Run event stream — `completed` becomes event-driven; render logic unchanged |
| Analytics | `analytics` | Aggregation endpoint; the charts take plain number arrays |
| Notifications | `notifications` | WebSocket into the existing popover |
| Pricing | `data/pricing.ts` | Billing provider catalogue |
| CTAs | `#` anchors | Real sign-up / login / sales routes |
| FAQ, testimonials, customers | `data/*.ts` | CMS collections — fields are already CMS-shaped |

---

## Portfolio description

> **NOVA — AI workspace platform**
> Brand direction, design system, marketing site and product UI.
>
> A concept build for an AI workspace startup, designed to solve a credibility
> problem rather than a layout one: in a category where every page makes the
> same claims, NOVA proves them instead. The site embeds a working application —
> a command palette, filterable tables, live state changes, and an agent run
> that replays at its real pace — so visitors can test the promise rather than
> read it.
>
> Built on a tokenised design system: a warm near-black surface ramp, a single
> rationed accent, and a four-family type hierarchy led by a humanist display
> face with an optical-size axis. Depth comes from hairlines and inset
> highlights rather than shadows, and five distinct motion techniques share one
> easing vocabulary.
>
> React 19, TypeScript, Tailwind CSS v4 and Motion, on ten runtime dependencies
> with no component library. Layouts are recomposed — not scaled — across seven
> tested widths, and every text colour meets WCAG AA by measurement rather than
> by eye.

**Short version (one line):**

> Brand, design system, marketing site and product UI for an AI workspace
> concept — with a working command palette, live dashboard and replayable agent
> run built in React, TypeScript and Tailwind.
