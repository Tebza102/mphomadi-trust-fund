import { useId, useState } from 'react'

/**
 * Password input with a show/hide toggle. Used anywhere the site asks for a
 * password (preview gate, team portal sign-in) so visitors can check what
 * they typed instead of guessing at a masked field.
 */
export function PasswordField({ label, value, onChange, autoComplete, required = false }) {
  const [revealed, setRevealed] = useState(false)
  const inputId = useId()

  return (
    <label htmlFor={inputId} className="flex flex-col gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-ink/70">
      {label}
      <span className="relative flex items-center">
        <input
          id={inputId}
          type={revealed ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          required={required}
          autoComplete={autoComplete}
          className="w-full rounded-2xl border border-ink/10 bg-[#fafafa] px-4 py-3 pr-12 text-base normal-case text-ink outline-none transition focus:border-brand-rose"
        />
        <button
          type="button"
          onClick={() => setRevealed((current) => !current)}
          aria-label={revealed ? 'Hide password' : 'Show password'}
          aria-pressed={revealed}
          className="absolute right-2 flex h-8 w-8 items-center justify-center rounded-full text-ink/50 outline-none transition hover:text-ink focus-visible:ring-2 focus-visible:ring-brand-rose"
        >
          {revealed ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-5 w-5" aria-hidden="true">
              <path d="M3 3l18 18" strokeLinecap="round" />
              <path
                d="M10.6 5.1c.45-.07.92-.1 1.4-.1 5 0 9 4.5 10 7-.35.9-1.1 2.2-2.25 3.35M6.5 6.5C4.3 8 2.8 10 2 12c1 2.5 5 7 10 7 1.6 0 3.1-.4 4.4-1.1"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path d="M9.9 10a3 3 0 004.1 4.1" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-5 w-5" aria-hidden="true">
              <path
                d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="12" cy="12" r="3" />
            </svg>
          )}
        </button>
      </span>
    </label>
  )
}
