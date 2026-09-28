/**
 * WCAG 2.1 contrast audit for the chrome (masthead, rail, index overlay).
 *
 * Every foreground/background pair these components actually paint, checked
 * against the level it owes: 4.5:1 for text (SC 1.4.3 AA) and 3:1 for
 * meaning-bearing graphics and focus indicators (SC 1.4.11).
 *
 * Run: node scripts/check-contrast.mjs
 */

const hex = (h) => {
  const v = h.replace('#', '')
  return [0, 2, 4].map((i) => parseInt(v.slice(i, i + 2), 16) / 255)
}
const lin = (c) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4))
const L = (h) => {
  const [r, g, b] = hex(h).map(lin)
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}
const ratio = (a, b) => {
  const [hi, lo] = [L(a), L(b)].sort((m, n) => n - m)
  return (hi + 0.05) / (lo + 0.05)
}

/** Mirrors the @theme block in src/styles/index.css. */
const T = {
  canvas: '#0b0a09',
  elevated: '#1b1917',
  lineStrong: '#38322e',
  primary: '#f5f2ed',
  secondary: '#a8a099',
  muted: '#8a837a',
  accent: '#f2b13c',
  accentInk: '#15110a',
  /** muted at 70% resolved over canvas — unlit rail tick, form control edge. */
  tickOff: '#645f58',
  error: '#e04f5f',
  /** bg-elevated/50 and /40 resolved over canvas — the login field + SSO fills. */
  field: '#131210',
  sso: '#111010',
}

const pairs = [
  ['RAIL   section label', T.primary, T.canvas, 4.5],
  ['RAIL   NN counter', T.secondary, T.canvas, 4.5],
  ['RAIL   "/" separator', T.muted, T.canvas, 4.5],
  ['RAIL   "Index" trigger', T.secondary, T.canvas, 4.5],
  ['RAIL   "Index" trigger, hover', T.primary, T.canvas, 4.5],
  ['RAIL   "Get started" on accent', T.accentInk, T.accent, 4.5],
  ['MAST   "Index" over hero', T.secondary, T.canvas, 4.5],
  ['MAST   NOVA wordmark', T.primary, T.canvas, 4.5],
  ['INDEX  section link, inactive', T.secondary, T.canvas, 4.5],
  ['INDEX  section link, active', T.primary, T.canvas, 4.5],
  ['INDEX  number, inactive', T.muted, T.canvas, 4.5],
  ['INDEX  number, active', T.accent, T.canvas, 4.5],
  ['INDEX  "You are here"', T.accent, T.canvas, 4.5],
  ['INDEX  close icon on elevated', T.secondary, T.elevated, 4.5],
  ['SKIP   link on elevated', T.primary, T.elevated, 4.5],
  ['RAIL   lit tick', T.accent, T.canvas, 3.0],
  ['RAIL   unlit tick', T.tickOff, T.canvas, 3.0],
  ['FOCUS  ring on canvas', T.accent, T.canvas, 3.0],
  ['FOCUS  ring on elevated', T.accent, T.elevated, 3.0],

  // --- /login -------------------------------------------------------------
  ['LOGIN  headline', T.primary, T.canvas, 4.5],
  ['LOGIN  body copy', T.secondary, T.canvas, 4.5],
  ['LOGIN  field label', T.muted, T.canvas, 4.5],
  ['LOGIN  typed value', T.primary, T.field, 4.5],
  ['LOGIN  placeholder', T.muted, T.field, 4.5],
  ['LOGIN  field icon', T.muted, T.field, 4.5],
  ['LOGIN  error message', T.error, T.canvas, 4.5],
  ['LOGIN  "Keep me signed in"', T.secondary, T.canvas, 4.5],
  ['LOGIN  "Forgot password?"', T.muted, T.canvas, 4.5],
  ['LOGIN  submit label on accent', T.accentInk, T.accent, 4.5],
  ['LOGIN  SSO label', T.secondary, T.sso, 4.5],
  ['LOGIN  status note', T.secondary, T.canvas, 4.5],
  ['LOGIN  "Back to site"', T.secondary, T.canvas, 4.5],
  ['LOGIN  checkbox tick on accent', T.accentInk, T.accent, 4.5],
  // Control boundaries — SC 1.4.11. A text input has no content until you type,
  // so its edge is the only thing identifying it as a control.
  ['LOGIN  input border', T.tickOff, T.canvas, 3.0],
  ['LOGIN  input border, focus', T.accent, T.field, 3.0],
  ['LOGIN  input border, error', T.error, T.canvas, 3.0],
  ['LOGIN  checkbox border', T.tickOff, T.canvas, 3.0],
]

let failed = 0
console.log('pair'.padEnd(34) + 'ratio'.padStart(7) + '   need   result')
console.log('-'.repeat(62))
for (const [name, fg, bg, need] of pairs) {
  const r = ratio(fg, bg)
  const ok = r >= need
  if (!ok) failed += 1
  console.log(
    name.padEnd(34) + r.toFixed(2).padStart(7) + `   ${need.toFixed(1)}    ${ok ? 'pass' : 'FAIL'}`,
  )
}
console.log('-'.repeat(62))
console.log(failed === 0 ? 'All pairs pass.' : `${failed} pair(s) failing.`)
process.exit(failed === 0 ? 0 : 1)
