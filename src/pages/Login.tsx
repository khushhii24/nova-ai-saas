import { useId, useRef, useState, type FormEvent, type ReactNode, type Ref } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { Button } from '@/components/primitives/Button'
import { Icon, type IconName } from '@/components/primitives/Icon'
import { Logo } from '@/components/chrome/Logo'
import { GoogleGlyph } from '@/components/primitives/BrandGlyphs'
import { WordReveal } from '@/components/primitives/WordReveal'
import { AuthStack } from './AuthStack'
import { useRouteLink } from '@/lib/router'
import { EASE_OUT } from '@/lib/motion'
import { cn } from '@/lib/cn'

type Errors = { email?: string; password?: string }

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const rise = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE_OUT } },
}

/**
 * Sign-in page.
 *
 * Built as a page rather than a modal: a dialog over the marketing page says
 * "this is a detour from the pitch", and the point of giving Log in its own
 * route is that signing in is a destination.
 *
 * The composition inherits the masthead's grammar instead of inventing a second
 * one — same container, same mono kickers, same single amber. The right half is
 * the only decoration, and it is built from the product's own material rather
 * than from an abstract gradient.
 *
 * There is no server in this build, so submit validates properly, shows a real
 * pending state, and then says so plainly rather than faking a session.
 */
export function Login() {
  const reduceMotion = useReducedMotion()
  const goHome = useRouteLink('/')
  const goPricing = useRouteLink('/#pricing')

  const emailId = useId()
  const passwordId = useId()
  const emailErrorId = `${emailId}-error`
  const passwordErrorId = `${passwordId}-error`

  const emailRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)

  const [mode, setMode] = useState<'signin' | 'reset'>('signin')
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<Errors>({})
  const [status, setStatus] = useState<'idle' | 'pending' | 'done'>('idle')

  const isReset = mode === 'reset'

  function switchMode(next: 'signin' | 'reset') {
    setMode(next)
    setErrors({})
    setStatus('idle')
    // The email carries over — asking someone to retype it after they clicked
    // "Forgot password?" is the classic way to lose them.
    //
    // setTimeout rather than requestAnimationFrame: rAF is suspended while a
    // tab is hidden, so a background tab would restore with focus never moved.
    window.setTimeout(() => emailRef.current?.focus(), 0)
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const email = emailRef.current?.value.trim() ?? ''
    const password = passwordRef.current?.value ?? ''
    const next: Errors = {}

    if (!email) next.email = 'Enter your work email.'
    else if (!EMAIL_RE.test(email)) next.email = 'That does not look like an email address.'

    if (!isReset) {
      if (!password) next.password = 'Enter your password.'
      else if (password.length < 8) next.password = 'Passwords are at least 8 characters.'
    }

    setErrors(next)
    setStatus('idle')

    // Focus the first field that failed. An error nobody is sent to is an error
    // a keyboard user has to go hunting for.
    if (next.email) {
      emailRef.current?.focus()
      return
    }
    if (next.password) {
      passwordRef.current?.focus()
      return
    }

    setStatus('pending')
    window.setTimeout(() => setStatus('done'), 900)
  }

  return (
    <div className="relative min-h-dvh overflow-x-hidden bg-canvas">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-grain opacity-[0.16] mix-blend-soft-light"
      />

      <a
        href="#login-form"
        className={cn(
          'fixed left-5 top-3 z-[90] -translate-y-20 rounded-md border border-line-strong',
          'bg-elevated px-4 py-2 text-caption text-primary',
          'transition-transform duration-200 ease-[var(--ease-out-quint)]',
          'focus-visible:translate-y-0',
        )}
      >
        Skip to sign-in form
      </a>

      <header className="relative z-10">
        <div className="mx-auto flex h-[var(--nav-h)] w-full max-w-[86rem] items-center justify-between px-5 sm:px-7 lg:px-10">
          <a
            href="/"
            onClick={goHome}
            aria-label="NOVA — back to site"
            className="rounded-sm transition-opacity duration-200 hover:opacity-80"
          >
            <Logo />
          </a>

          <a
            href="/"
            onClick={goHome}
            className={cn(
              'group/back flex items-center gap-2 rounded-sm px-2 py-2',
              'font-mono text-kicker uppercase text-secondary',
              'transition-colors duration-200 hover:text-primary',
            )}
          >
            <Icon
              name="arrow-right"
              size={13}
              className={cn(
                'rotate-180 transition-transform duration-300',
                'ease-[var(--ease-out-quint)] group-hover/back:-translate-x-0.5',
              )}
            />
            Back to site
          </a>
        </div>
      </header>

      <main className="relative z-10">
        <div className="mx-auto grid w-full max-w-[86rem] gap-x-12 px-5 sm:px-7 lg:grid-cols-12 lg:px-10">
          {/* ---------------------------------------------------------- form */}
          <div className="lg:col-span-5">
            <motion.div
              className={cn(
                'flex flex-col justify-center py-10',
                'lg:min-h-[calc(100dvh-var(--nav-h)-5rem)] lg:py-16',
              )}
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
              }}
              initial={reduceMotion ? 'visible' : 'hidden'}
              animate="visible"
            >
              <motion.div variants={rise} className="mb-7 flex items-center gap-3">
                <span className="font-mono text-kicker uppercase text-muted">
                  {isReset ? 'Reset password' : 'Sign in'}
                </span>
                <span aria-hidden="true" className="h-px flex-1 bg-line-strong" />
              </motion.div>

              <h1
                data-route-heading
                tabIndex={-1}
                className="text-h1 text-gradient-warm focus-visible:outline-none"
              >
                <WordReveal
                  key={mode}
                  text={isReset ? 'Forgot it? No problem.' : 'Welcome back.'}
                  emphasis={isReset ? 'problem.' : 'back.'}
                  trigger="mount"
                  delay={0.12}
                  as="span"
                />
              </h1>

              <motion.p variants={rise} className="mt-4 max-w-[40ch] text-caption text-secondary">
                {isReset
                  ? 'Give us the address on the account and we will send a link to set a new password.'
                  : 'Your workspace, your agents, and everything they finished while you were away.'}
              </motion.p>

              <motion.form
                id="login-form"
                variants={rise}
                onSubmit={handleSubmit}
                noValidate
                className="mt-9 flex flex-col gap-5"
              >
                <Field
                  id={emailId}
                  ref={emailRef}
                  label="Work email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@company.com"
                  icon="at"
                  error={errors.email}
                  errorId={emailErrorId}
                />

                {!isReset && (
                  <div>
                    <Field
                      id={passwordId}
                      ref={passwordRef}
                      label="Password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      placeholder="At least 8 characters"
                      icon="lock"
                      error={errors.password}
                      errorId={passwordErrorId}
                      trailing={
                        <button
                          type="button"
                          onClick={() => setShowPassword((value) => !value)}
                          aria-pressed={showPassword}
                          aria-label={showPassword ? 'Hide password' : 'Show password'}
                          className={cn(
                            'grid size-7 shrink-0 place-items-center rounded-sm text-muted',
                            'transition-colors duration-200 hover:text-primary',
                          )}
                        >
                          <Icon name={showPassword ? 'eye-off' : 'eye'} size={15} />
                        </button>
                      }
                    />

                    <div className="mt-3.5 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
                      <Remember />
                      <button
                        type="button"
                        onClick={() => switchMode('reset')}
                        className={cn(
                          'rounded-sm text-micro text-muted underline-offset-4',
                          'transition-colors duration-200 hover:text-primary hover:underline',
                        )}
                      >
                        Forgot password?
                      </button>
                    </div>
                  </div>
                )}

                <Button
                  type="submit"
                  size="lg"
                  trailingIcon={status === 'pending' ? undefined : 'arrow-right'}
                  disabled={status === 'pending'}
                  className="mt-1 w-full"
                >
                  {status === 'pending'
                    ? isReset
                      ? 'Sending…'
                      : 'Signing in…'
                    : isReset
                      ? 'Send reset link'
                      : 'Continue'}
                </Button>

                {/* One live region for the whole form, so a result is announced
                    once rather than once per field. The slot is always present
                    so nothing below it jumps when a message arrives. */}
                <p
                  role="status"
                  aria-live="polite"
                  className="flex min-h-[1.5rem] items-start gap-2 text-micro text-secondary"
                >
                  {status === 'done' && (
                    <>
                      <Icon
                        name="info"
                        size={13}
                        aria-hidden="true"
                        className="mt-px shrink-0 text-accent"
                      />
                      <span>
                        {isReset
                          ? 'If that address has an account, a reset link is on its way.'
                          : 'Those details are valid.'}{' '}
                        NOVA is a concept build, so there is no account server behind this form.
                      </span>
                    </>
                  )}
                </p>

                {isReset ? (
                  <button
                    type="button"
                    onClick={() => switchMode('signin')}
                    className={cn(
                      'group/back mx-auto flex items-center gap-2 rounded-sm px-2 py-1',
                      'text-micro text-muted transition-colors duration-200 hover:text-primary',
                    )}
                  >
                    <Icon
                      name="arrow-right"
                      size={13}
                      aria-hidden="true"
                      className={cn(
                        'rotate-180 transition-transform duration-300',
                        'ease-[var(--ease-out-quint)] group-hover/back:-translate-x-0.5',
                      )}
                    />
                    Back to sign in
                  </button>
                ) : (
                  <>
                    <div className="flex items-center gap-4" aria-hidden="true">
                      <span className="h-px flex-1 bg-line" />
                      <span className="font-mono text-kicker uppercase text-muted">or</span>
                      <span className="h-px flex-1 bg-line" />
                    </div>

                    <div className="grid gap-2.5 sm:grid-cols-2">
                      <SsoButton label="Google">
                        <GoogleGlyph className="size-4" aria-hidden="true" />
                      </SsoButton>
                      <SsoButton label="SAML SSO">
                        <Icon name="shield" size={14} aria-hidden="true" />
                      </SsoButton>
                    </div>
                  </>
                )}
              </motion.form>

              <motion.p variants={rise} className="mt-8 text-micro text-muted">
                New to NOVA?{' '}
                <a
                  href="/#pricing"
                  onClick={goPricing}
                  className={cn(
                    'rounded-sm text-primary underline underline-offset-4',
                    'transition-colors duration-200 hover:text-accent',
                  )}
                >
                  Create an account
                </a>{' '}
                — free to start, no card.
              </motion.p>
            </motion.div>
          </div>

          {/* -------------------------------------------------------- visual */}
          <div className="hidden lg:col-span-7 lg:block">
            <div className="sticky top-[var(--nav-h)]">
              <AuthStack />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

/* ---------------------------------------------------------------- field --- */

type FieldProps = {
  id: string
  label: string
  type: string
  autoComplete: string
  placeholder: string
  icon: IconName
  error?: string
  errorId: string
  trailing?: ReactNode
  ref: Ref<HTMLInputElement>
}

function Field({
  id,
  label,
  type,
  autoComplete,
  placeholder,
  icon,
  error,
  errorId,
  trailing,
  ref,
}: FieldProps) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block font-mono text-kicker uppercase text-muted">
        {label}
      </label>

      <div
        className={cn(
          'group/field flex items-center gap-3 rounded-md border bg-elevated/50 pl-3.5 pr-2',
          'transition-colors duration-200 focus-within:border-accent',
          error ? 'border-error' : 'border-muted/70 hover:border-muted',
        )}
      >
        <Icon
          name={icon}
          size={15}
          aria-hidden="true"
          className={cn(
            'shrink-0 transition-colors duration-200',
            error ? 'text-error' : 'text-muted group-focus-within/field:text-accent',
          )}
        />
        <input
          ref={ref}
          id={id}
          name={id}
          type={type}
          autoComplete={autoComplete}
          placeholder={placeholder}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className={cn(
            'h-12 w-full min-w-0 bg-transparent text-caption text-primary',
            'placeholder:text-muted focus-visible:outline-none',
          )}
        />
        {trailing}
      </div>

      {error && (
        <p id={errorId} className="mt-2 flex items-center gap-1.5 text-micro text-error">
          <Icon name="status-alert" size={12} aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  )
}

/* ------------------------------------------------------------- remember --- */

/**
 * A real checkbox, visually hidden, with the drawn box as its label sibling —
 * so it keeps native semantics, native keyboard behaviour and the form's own
 * focus ring instead of a div pretending to be an input.
 */
function Remember() {
  return (
    <label className="group/remember flex cursor-pointer items-center gap-2.5 text-micro text-secondary">
      <input type="checkbox" name="remember" className="peer sr-only" />
      <span
        aria-hidden="true"
        className={cn(
          'grid size-4 shrink-0 place-items-center rounded-xs border border-muted/70',
          'transition-colors duration-200 group-hover/remember:border-muted',
          'peer-checked:border-accent peer-checked:bg-accent',
          'peer-checked:[&>svg]:opacity-100',
          'peer-focus-visible:outline peer-focus-visible:outline-2',
          'peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent',
        )}
      >
        <Icon
          name="check"
          size={11}
          className="text-accent-ink opacity-0 transition-opacity duration-200"
        />
      </span>
      Keep me signed in
    </label>
  )
}

/* ------------------------------------------------------------------ sso --- */

function SsoButton({ label, children }: { label: string; children: ReactNode }) {
  return (
    <button
      type="button"
      className={cn(
        'flex h-11 items-center justify-center gap-2.5 rounded-md border border-line',
        'bg-elevated/40 text-micro text-secondary transition-colors duration-200',
        'hover:border-line-strong hover:bg-raised hover:text-primary',
      )}
    >
      {children}
      Continue with {label}
    </button>
  )
}
