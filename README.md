# NOVA — AI workspace marketing site

A production-quality, frontend-only marketing site for a fictional AI workspace
startup. Built as portfolio piece #1 to demonstrate SaaS landing page design,
product UI design, a real design system, motion craft, and responsive
engineering.

**NOVA is not a real company.** Every customer, testimonial, metric and document
in this build is invented. The footer says so.

Two routes: `/` (the marketing page) and `/login` (a frontend-only sign-in UI —
see [Frontend-only by design](#frontend-only-by-design)).

For the design rationale and portfolio write-up, see
**[CASE-STUDY.md](CASE-STUDY.md)**.

---

## Quick start

```bash
npm install
npm run dev        # http://localhost:5173
```

| Script             | What it does                                            |
| ------------------ | ------------------------------------------------------- |
| `npm run dev`      | Vite dev server with HMR                                |
| `npm run build`    | Typecheck (`tsc -b`) then production build to `dist/`   |
| `npm run preview`  | Serve the built output locally                          |
| `npm run typecheck`| Typecheck only                                          |
| `npm run lint:icons`| Report icon registry entries nothing references        |
| `npm run check:contrast`| Audit every chrome/auth colour pair against WCAG AA |

Requires Node 20+. No environment variables, no API keys, no backend.

---

## Stack

| Concern    | Choice                        | Why                                                              |
| ---------- | ----------------------------- | ---------------------------------------------------------------- |
| Build      | Vite 8                        | One page, no SSR needed. Fast dev loop.                           |
| UI         | React 19 + TypeScript (strict)| Strict mode, `noUnusedLocals`, `erasableSyntaxOnly`.             |
| Styling    | Tailwind CSS v4               | CSS-first `@theme` config — tokens live in CSS, not a JS object.  |
| Motion     | `motion` v13 (Framer Motion)  | Layout animations (`layoutId`) and scroll-linked values.          |
| Icons      | `lucide-react`                | Behind a local registry so data files stay serialisable.          |
| Fonts      | `@fontsource` (self-hosted)   | No external requests, no FOUT from a CDN.                         |

Runtime dependencies: 10. There is no component library, no CSS framework beyond
Tailwind, no state manager, no animation helper library.

**Bundle:** 543 kB raw / **163 kB gzipped** JS, 78 kB / 15 kB CSS. That is
almost entirely React DOM plus the Motion feature set. It is deliberately a
single chunk: the two routes share nearly all of their components, so splitting
them would duplicate more than it saves.

Routing is ~30 lines over the History API (`lib/router.ts`) rather than a
router dependency — two routes did not justify one.

---

## Project structure

```
src/
├── styles/index.css        Design tokens (@theme), base layer, custom utilities
├── lib/
│   ├── cn.ts               Theme-aware class merging  ← see note below
│   ├── motion.ts           The site's entire motion vocabulary
│   └── router.ts           History API routing for / and /login (no dependency)
├── pages/
│   ├── Login.tsx           Frontend-only sign-in + password-reset UI
│   └── AuthStack.tsx       The sign-in page's 3D product stack
├── hooks/                  useScrolled, useScrollSpy, useLockBodyScroll,
│                           useHotkey, useTypewriter, useMediaQuery, useAgentRun,
│                           usePointerSpotlight, useCountUp
├── data/                   ALL content and mock records — no JSX in here
│   ├── site.ts             Brand, nav, footer, social links
│   ├── customers.ts        Fictional logo wall
│   ├── problem.ts          Fragmented-workflow story
│   ├── features.ts         Six capabilities + bento spans
│   ├── workspace.ts        Documents, tasks, activity, agents, analytics,
│   │                       AI thread, command palette, notifications
│   ├── agent.ts            The replayed agent run
│   ├── workflow.ts         Five workflow stages
│   ├── testimonials.ts / pricing.ts / faq.ts
└── components/
    ├── primitives/         Button, Container, Section, SectionHeading, Kicker,
    │                       Reveal, WordReveal, Magnetic, Scramble, Tilt3D,
    │                       SegmentedControl, Icon, BrandGlyphs
    ├── chrome/             Navbar, IndexOverlay, Logo, Footer, ScrollProgress
    ├── product/            The application UI: AppShell, Sidebar, DocumentList,
    │                       TaskList, ActivityFeed, AnalyticsPane, AgentsPane,
    │                       AiPanel, CommandPalette, Toast, Avatar, StatusDot,
    │                       Sparkline, Kbd, WorkspacePane, HeroPreview
    ├── visuals/            FeatureVisuals (6), StageVisuals (5)
    └── sections/           The twelve page sections
```

77 source files, ~9,000 lines. No section component owns its own spacing,
colour values, or motion curves.

### One thing worth reading: `lib/cn.ts`

tailwind-merge only knows Tailwind's *default* scales. This theme adds custom
font sizes (`text-micro`) and custom colours (`text-accent-ink`) that both look
like `text-*`, so out of the box it files them in the same conflict group and
silently drops one:

```ts
twMerge('text-accent-ink', 'text-micro') // -> 'text-micro'   (colour lost)
twMerge('text-micro', 'text-primary')    // -> 'text-primary' (size lost)
```

That is not hypothetical — it stripped the dark ink off every small primary
button and knocked the app-UI type scale back to the inherited 16px. `cn.ts`
declares both scales to `extendTailwindMerge`. If you add a token, add it there.

---

## Design system

Full specification in **[DESIGN-SYSTEM.md](DESIGN-SYSTEM.md)**. The short
version:

- **One warm-charcoal surface ramp** (`canvas → surface → elevated → raised`),
  deliberately warm-tinted rather than blue-black.
- **Exactly one accent** — golden amber `#f2b13c` — used for a single filled
  button per view, active state, and agent identity. Nothing else is coloured.
- **Four type families**: Bricolage Grotesque (display/headings — humanist and
  deliberately irregular, with an optical-size axis), Instrument Sans (UI and
  body), Instrument Serif italic (emphasis words inside headlines only),
  JetBrains Mono (kickers, meta, data).
- **Depth comes from hairlines and an inset top highlight**, never grey shadows.
- **Every colour pair meets WCAG AA**, verified by an automated audit (below).

---

## Implemented interactions

Everything listed here works. Nothing is a static mock-up of an interaction.

**Navigation — masthead, then rail**
- At rest the header is a masthead, not a bar: no fill, no border, no blur. The
  wordmark sits on the hero's left margin rule and one hairline spans the dead
  centre, so the header reads as the hero's first line rather than a hat on it.
- Past 24px it collapses to a full-bleed rail on solid canvas with a hairline
  under it — an architectural band, deliberately not a floating pill.
- **There is no persistent link row.** On a one-page site four repeated links
  are furniture; the space they would occupy carries a position readout instead
  — section number, section name, and one tick per section with the passed ones
  lit (`useScrollSpy`). The nav reports where you are rather than offering
  destinations you are already scrolling through.
- The full section index is one click away at **every** breakpoint, not just on
  phones: display-scale numbered links, body-scroll lock, Escape to close, Tab
  trapped inside, `aria-current` on the live section, focus returned to the
  trigger.
- Skip-to-content link on both routes, visible on focus.

**Depth (real 3D, not a skew)**
- `Tilt3D` puts its contents on a plane with `transform-style: preserve-3d`
  inside a perspective frame. Children marked `depth-1/2/3` sit on their own Z
  planes, so a tilt produces genuine parallax between layers — near things sweep
  further than far ones — instead of one flat sheet shearing.
- Used on the hero product view (the agent notification floats 58px in front of
  the glass), the six capability cards, the pricing cards (the featured plan
  sits closer and tips further), and the sign-in stack.
- It publishes the same pointer position the `spotlight-*` utilities read, so
  the highlight lands on the edge the tilt raises rather than disagreeing with
  it. Coarse pointers get no tilt; `prefers-reduced-motion` drops it entirely.

**Sign-in (`/login`)**
- Validation with `aria-invalid` + `aria-describedby`, focus moved to the first
  failing field, one polite live region for the whole form.
- Password show/hide with `aria-pressed`; "Forgot password?" switches the form
  into a reset mode that keeps the typed email and hides the password field and
  the SSO row.
- The reset response is deliberately non-enumerating ("if that address has an
  account…"), so the form cannot be used to discover which emails are registered.

**Hero**
- **The headline is uncovered word by word.** Each word sits in its own mask and
  rises from beneath it — the page's signature entrance, reused on every heading.
- **The product preview settles out of 3D.** It enters tilted back ~15° in
  perspective and flattens as you scroll into it. Scroll-driven, so it is
  reversible and paced by the reader rather than by a timer.
- Texture layers drift at different rates to the copy — depth, not parallax
  theatrics.
- The primary CTA is magnetic: it leans toward the cursor and springs back.
- Floating "agent finished" notification card arrives on a delay.

**Problem section**
- Five convergence curves draw themselves on scroll (`pathLength`), funnelling
  the fragmented stages into one surface.

**Type band**
- A full-bleed marquee between the bento grid and the product window, with
  alternate words outlined rather than filled. It is always drifting, but
  **scroll velocity adds to its speed and skews it**, and scrolling up reverses
  it — so it responds to the reader instead of looping obliviously.

**Feature grid**
- **Cards track the cursor**: a warm wash follows it across the surface and the
  1px border lights only where it is. Driven by CSS custom properties written
  straight to the node, so a pointer crossing six cards costs zero renders.
- Six bespoke visualisations, each with its own scroll-triggered behaviour:
  source chips landing, a live rewrite typing out, agent progress bars filling,
  a read-pass sweeping a table, a version history assembling, a workflow chain
  building.

**Product experience (the interactive one)**
- Sidebar switches panes; the active pill slides with a shared layout animation.
- Tabs filter **real records** — Documents by kind, Tasks by human/agent owner.
- Task checkboxes cycle todo → doing → done, with strikethrough.
- Agent cards expand and collapse (one at a time).
- Analytics bars and share meters grow from zero on first view.
- **⌘K / Ctrl+K opens a working command palette** — type to filter, ↑/↓ to move
  across group boundaries, ↵ to run, Esc to dismiss. Navigation commands
  actually switch panes; others raise a confirmation toast.
  The shortcut is bound **only while the section is in the viewport**, so the
  page never steals your browser's find shortcut.
- Notification bell opens a popover.
- Assistant streams a response when the section scrolls into view: a
  "reading sources" pause first, then irregular character bursts, then
  citations resolving in after the answer completes.
- Below `lg` the sidebar becomes a scrolling chip rail so pane switching
  survives to 390px.

**Agent section**
- A recorded agent run replays on scroll, paced by each step's own duration.
  Steps move queued → running → done, each revealing its tool call, result and
  elapsed time; the deliverable card lands at the end. "Replay this run" restarts it.

**Workflow section**
- Desktop: scroll-linked five-stage stepper in a sticky viewport — progress rail
  fills continuously, copy and visual crossfade per stage, and you can scroll
  backwards through it.
- Below `lg`: a plain stacked list. Scroll-linked staging fights a thumb, so it
  is not used there.

**Throughout**
- Section kickers decode out of random glyphs on entry — mono is already the
  typeface for "a machine produced this".
- An oversized outlined index numeral sits behind each section heading, so no
  two sections open on the same empty margin.
- KPI figures count up on first view, in tabular numerals so nothing twitches.
- A spring-smoothed reading-progress hairline pins to the top of the viewport,
  fading in only once you have started reading.

**Pricing / FAQ / footer**
- Monthly ↔ yearly switch with radiogroup semantics and arrow-key support;
  price, unit line and footnote all change, numerals sliding vertically.
- FAQ accordion, one open at a time, plus mark rotating to a close mark.
- Hover states on every interactive element; `:focus-visible` ring everywhere.

**Reduced motion** — `prefers-reduced-motion: reduce` is honoured throughout.
Entrances render in place, the typewriter resolves instantly, the agent run
jumps to its finished state, and the CSS base layer clamps every remaining
animation and transition.

---

## Responsive

Designed and verified at **1440 / 1280 / 768 / 390**. Layouts are re-composed,
not scaled:

| Breakpoint | What changes |
| ---------- | ------------ |
| 1440 / 1280 | Editorial 12-column grids; three-pane app shell; scroll-linked workflow |
| 768 | Bento collapses 6-col → 2-col; app sidebar becomes a chip rail; assistant stacks beneath the workspace; workflow becomes a stacked list |
| 390 | Single column; logo wall becomes a slow marquee rather than a ragged wrap; the masthead sheds its rule and the rail sheds its counter; stat tiles stack; sign-in drops its 3D panel |

---

## Accessibility

- Semantic landmarks, one `h1`, verified heading order with no skipped levels.
- Keyboard: full tab traversal, palette and accordion keyboard models, arrow
  keys in the billing radiogroup, Escape closes overlays, focus restored on
  dismiss, skip link.
- `aria-expanded` / `aria-controls` on every disclosure, `aria-current` on
  active nav, `role="radiogroup"`/`radio` on the billing switch,
  `aria-live="polite"` on the streaming answer and toast.
- Decorative layers (`bg-grid`, grain, wordmarks, rails, separators) are
  `aria-hidden`.
- `prefers-reduced-motion` and `forced-colors` both handled.
- **All text meets WCAG AA contrast**, confirmed by measurement rather than eye.

---

## How this was QA'd

A Playwright pass drives the built site at all four viewports and asserts:

- no horizontal overflow (and names the offending element if there is);
- no console errors or page errors;
- every in-page anchor resolves to an element that exists;
- exactly one `h1` and no heading-level jumps;
- **computed contrast ratio for every text node** against its real composited
  background, at the correct AA threshold for its size and weight, skipping
  `aria-hidden` decorative text;
- the interactions actually work — ⌘K opens the palette, the sidebar switches
  panes, the yearly toggle really changes the Pro price to 19, the FAQ opens,
  the mobile menu opens and closes on Escape.

That audit is what caught the `tailwind-merge` bug described above, and 140+
contrast failures traced to a single token being too dark. The final run
reports **no problems at any viewport**.

The script is not checked in — it needs Playwright, which would otherwise be a
heavyweight devDependency on a static site. Ask if you want it.

---

## Frontend-only by design

No database, no auth, no payments, no AI API, no server, no analytics, no
telemetry. The build makes **zero network requests** at runtime — fonts are
self-hosted and every icon is inlined. All state is local React state; all
content is typed mock data in `src/data/`.

**What this means concretely:**

| Looks like | Actually is |
| --- | --- |
| `/login` sign-in and password reset | UI only. Input is validated client-side, then the form says plainly that there is no account server. **Nothing is transmitted, stored, or persisted — not even to `localStorage`.** |
| "Continue with Google" / "SAML SSO" | Styled buttons with no OAuth wiring. |
| Customers, testimonials, metrics, documents | Invented. No real company, person, or number appears anywhere. |
| The agent run, AI assistant, command palette | Local state machines and timers replaying a scripted sequence. |
| Pricing and billing period | Static data. No checkout, no payment provider. |

Because there is no auth, **do not put this behind anything that matters** — the
sign-in page is a design artefact, not a security boundary.

The separation is strict: **data files contain no JSX and no component imports**
— icons are referenced by string name through a registry, so every record is
plain serialisable data shaped the way an API would return it.

### Where a real backend would plug in

| Surface | Module to replace | Becomes |
| --- | --- | --- |
| Documents, tasks, activity, spaces | `data/workspace.ts` | `GET /workspace/*` — the row types are already the response shapes |
| Task status cycling | `TaskList` local state | `PATCH /tasks/:id` with optimistic update (the state shape already supports rollback) |
| Assistant panel | `useTypewriter` + `aiThread` | SSE or streaming `fetch` from a Messages-API-backed endpoint; the phase machine (`idle → thinking → streaming`) already models real latency, and `sources` is the citation payload |
| Command palette | `commandGroups` | Server-side search with debounced query; `onSelect` is already the command dispatch point |
| Agent run | `data/agent.ts` + `useAgentRun` | Subscribe to a run's event stream; `completed` is driven by events instead of timers — the render logic does not change |
| Analytics | `data/workspace.ts` → `analytics` | Aggregation endpoint; `Sparkline` and `AnalyticsPane` already take plain number arrays |
| Notifications | `notifications` | WebSocket or polling into the existing popover |
| Pricing | `data/pricing.ts` | Billing provider's product catalogue; `BillingPeriod` maps to price IDs |
| Sign-in | `pages/Login.tsx` `handleSubmit` | `POST /auth/session` — the validation, pending, error and live-region states are already wired; only the fetch is missing |
| Password reset | the same form's reset mode | `POST /auth/reset` — keep the non-enumerating response |
| OAuth / SSO | the two `SsoButton`s | Provider redirect URLs |
| Sign-up, sales contact | `href="#..."` anchors | Real routes |
| FAQ, testimonials, customers | `data/*.ts` | CMS collections; field names are already CMS-shaped |

Every component reads from `data/` and nothing else, so swapping a module for
fetches does not touch a single view.

---

## Deploying

The build is plain static files. No server, no environment variables, no
secrets — nothing to configure and nothing that can leak.

**One requirement:** `/login` is a client-side route with no file behind it, so
the host must fall back to `index.html` for unknown paths. `vercel.json` and
`netlify.toml` both do this already; a host without that rule will 404 on a
cold load or refresh of `/login`.

### Option 1 — Vercel (easiest)

1. Push this folder to a GitHub repository.
2. Go to [vercel.com/new](https://vercel.com/new) and import that repository.
3. Vercel reads `vercel.json` and fills everything in. Press **Deploy**.

You get a live URL in about a minute. Every push to the default branch
redeploys automatically.

### Option 2 — Netlify

1. Push to GitHub.
2. [app.netlify.com/start](https://app.netlify.com/start) → pick the repository.
3. `netlify.toml` supplies the build command and publish directory. Press
   **Deploy**.

### Option 3 — drag and drop, no Git

```bash
npm install
npm run build
```

Then drag the generated `dist/` folder onto
[app.netlify.com/drop](https://app.netlify.com/drop). That is the whole process.

### Option 4 — GitHub Pages

Two caveats here, both because Pages is a plain file server.

1. It serves from a subpath, so set the asset base first: in `vite.config.ts`,
   add `base: '/your-repo-name/'`.
2. It has no rewrite rule, so a cold load of `/login` 404s. The usual fix is to
   copy `dist/index.html` to `dist/404.html` after building — Pages serves that
   for unknown paths, and the app then routes correctly.

```bash
npm run build
cp dist/index.html dist/404.html
npx gh-pages -d dist
```

### Verify before you deploy

```bash
npm run build            # typechecks, then builds to dist/
npm run preview          # serves dist/ at http://localhost:4173
npm run check:contrast   # WCAG AA audit of the chrome and auth colour pairs
npm run lint:icons       # flags icon registry entries nothing references
```

If `preview` looks right, the deployment will too — it is the same output.
Check `/login` in `preview` as well as `/`, since that is the path that depends
on the host's fallback rule.

**Caching note.** Both config files cache `/assets/*` for a year (safe: Vite
fingerprints every filename) while keeping `index.html` uncached, so a redeploy
reaches people who have visited before. Getting this backwards is the usual
reason a "deployed" site keeps showing the old version.

---

## Deliberate scope boundaries

Worth stating plainly rather than leaving you to find them:

- **It is a single page.** Nav and footer links resolve to the nearest relevant
  section rather than to pages that do not exist. No link is dead, but
  "Documentation" goes to the FAQ, not to docs.
- **Social links** point at the real platform home pages, since NOVA has no
  accounts.
- **Copy is fiction**, including the metrics in the product UI.
- **No test suite.** For a static marketing page the QA pass above covers more
  of the actual risk than unit tests would; if this became a product surface,
  the interactive components (palette, accordion, billing switch, task list)
  are the ones with logic worth testing.
