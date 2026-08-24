import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Picture } from '../components/Picture'
import { donationSponsorshipContent as content } from '../content/donationSponsorshipContent'
import { trackCta } from '../siteContent'

export function DonatePage() {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    supportAs: 'Individual donor',
    interest: 'Once-off donation',
    amount: '',
    companyName: '',
    message: '',
    consent: false,
  })
  const [attemptedSubmit, setAttemptedSubmit] = useState(false)

  const errors = useMemo(() => {
    const next = {}
    if (!form.fullName.trim()) next.fullName = 'Full name is required.'
    if (!form.email.trim() && !form.phone.trim()) next.contact = 'Please add either an email address or a phone number.'
    if (!form.supportAs) next.supportAs = 'Please choose how you want to support.'
    if (!form.interest) next.interest = 'Please choose your support interest.'
    if (!form.consent) next.consent = 'Consent is required before we can contact you.'
    if (form.supportAs === 'Corporate sponsor' && !form.companyName.trim()) next.companyName = 'Company or organisation name is required for corporate sponsorship.'
    return next
  }, [form])

  // No submission endpoint is connected yet, so the form hands off to the
  // visitor's mail client rather than silently doing nothing. A form that
  // validates, clears no state and gives no feedback reads as broken — this at
  // least completes the visitor's intent. Swap for a real POST (and drop the
  // mailto) once the Firestore-backed lead intake is wired to this page.
  const ENQUIRY_ADDRESS = 'info@mphomaditrustfund.org.za'
  const [submitted, setSubmitted] = useState(false)

  const update = (field) => (event) => {
    const value = field === 'consent' ? event.target.checked : event.target.value
    setForm((current) => ({ ...current, [field]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    setAttemptedSubmit(true)
    if (Object.keys(errors).length > 0) return

    const lines = [
      `Name: ${form.fullName}`,
      form.email ? `Email: ${form.email}` : null,
      form.phone ? `Phone: ${form.phone}` : null,
      `Supporting as: ${form.supportAs}`,
      `Interest: ${form.interest}`,
      form.amount ? `Amount / value: ${form.amount}` : null,
      form.companyName ? `Organisation: ${form.companyName}` : null,
      form.message ? `\nMessage:\n${form.message}` : null,
      '\nI consent to be contacted about this enquiry.',
    ].filter(Boolean)

    const subject = `${form.interest} enquiry — ${form.fullName}`
    window.location.href = `mailto:${ENQUIRY_ADDRESS}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join('\n'))}`
    trackCta('donation_enquiry_submit')
    setSubmitted(true)
  }

  const heroCtas = [
    { label: content.ctas.support, href: '#individual-giving' },
    { label: content.ctas.sponsor, href: '#corporate-sponsorship' },
    { label: content.ctas.requestSponsorInfo, href: '#enquiry-form' },
  ]

  return (
    <main className="section-shell py-16 md:py-24">
      <section className="grid gap-10 md:grid-cols-12 md:items-start">
        <div className="space-y-6 md:col-span-7">
          <p className="text-base font-semibold uppercase tracking-[0.2em] text-brand-rose">{content.hero.eyebrow}</p>
          <h1 className="max-w-4xl font-display text-4xl leading-tight md:text-6xl">{content.hero.title}</h1>
          <p className="max-w-3xl text-xl leading-relaxed text-ink/80">{content.hero.copy}</p>
          <div className="flex flex-wrap gap-4">
            {heroCtas.map((item) => (
              <a key={item.label} href={item.href} className="rounded-full border border-brand-orchid/30 bg-white px-6 py-3 text-base font-semibold text-ink transition hover:border-brand-orchid">
                {item.label}
              </a>
            ))}
            <a href="#enquiry-form" onClick={() => trackCta('donate_click')} className="donate-pulse rounded-full bg-brand-rose px-6 py-3 text-base font-semibold text-white hover:bg-brand-plum">
              {content.ctas.support}
            </a>
          </div>
        </div>

        <aside className="rounded-[2rem] bg-white p-6 shadow-[0_12px_40px_rgba(31,31,36,0.08)] md:col-span-5">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-sun">I want to...</p>
          <div className="mt-4 grid gap-3">
            {content.pathways.map((item) => (
              <a key={item.label} href={item.href} className="rounded-2xl border border-ink/10 px-4 py-3 text-left text-base text-ink transition hover:border-brand-rose hover:bg-brand-rose/5">
                {item.label}
              </a>
            ))}
          </div>
        </aside>
      </section>

      <section className="mt-16 rounded-[2rem] brand-stripe p-8 md:p-10">
        <div className="grid gap-8 md:grid-cols-12">
          <div className="md:col-span-6">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-rose">Trust before the ask</p>
            <h2 className="mt-3 font-display text-3xl leading-tight md:text-5xl">{content.trust.title}</h2>
            <p className="mt-4 text-xl leading-relaxed text-ink/80">{content.trust.copy}</p>
          </div>
          <div className="md:col-span-6">
            <ul className="space-y-4 rounded-[1.5rem] bg-white p-6 text-lg text-ink/80 shadow-[0_10px_30px_rgba(31,31,36,0.08)]">
              {content.trust.benefits.map((item) => (
                <li key={item} className="border-b border-ink/10 pb-3">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section id="individual-giving" className="mt-16 grid gap-8 md:grid-cols-12">
        <div className="md:col-span-5">
          <p className="text-base font-semibold uppercase tracking-[0.2em] text-brand-rose">Individual giving</p>
          <h2 className="mt-3 font-display text-3xl leading-tight md:text-5xl">Choose a giving path that fits you</h2>
          <p className="mt-4 text-xl leading-relaxed text-ink/80">Individuals can give once, support monthly, donate goods, or offer professional help without needing to figure out the whole system first.</p>
        </div>
        <div className="md:col-span-7 grid gap-6 md:grid-cols-2">
          {content.givingOptions.map((option) => (
            <article key={option.title} className="rounded-[1.5rem] border border-ink/10 bg-white p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-rose">{option.amount}</p>
              <h3 className="mt-3 font-display text-2xl">{option.title}</h3>
              <p className="mt-4 text-lg leading-relaxed text-ink/80">{option.copy}</p>
              <a href="#enquiry-form" className="mt-6 inline-flex rounded-full bg-brand-plum px-5 py-2.5 text-sm font-semibold text-white">
                {option.cta}
              </a>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-base font-semibold uppercase tracking-[0.2em] text-brand-rose">Donation amounts</p>
            <h2 className="mt-3 font-display text-3xl md:text-5xl">Choose an amount with visible impact</h2>
          </div>
          <p className="max-w-2xl text-lg leading-relaxed text-ink/70">Each card stays honest about what the amount can help with, depending on current programme needs.</p>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-5">
          {content.donationAmounts.map((item) => (
            <article key={item.amount} className="rounded-[1.5rem] border border-ink/10 bg-white p-6">
              <p className="font-display text-3xl text-brand-plum">{item.amount}</p>
              <p className="mt-4 text-base leading-relaxed text-ink/80">{item.impact}</p>
              <a href="#enquiry-form" className="mt-6 inline-flex rounded-full border border-brand-orchid/30 px-4 py-2 text-sm font-semibold text-ink">
                {item.cta}
              </a>
            </article>
          ))}
        </div>
      </section>

      <section id="corporate-sponsorship" className="mt-16 rounded-[2rem] bg-brand-plum p-8 text-white md:p-10">
        <div className="grid gap-8 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/75">Corporate sponsorship</p>
            <h2 className="mt-3 font-display text-3xl leading-tight md:text-5xl">Partner with the Trust in a way that supports CSI / CSR goals</h2>
            <p className="mt-4 text-xl leading-relaxed text-white/85">Sponsors can back community-focused programmes while building visible, responsible social impact.</p>
            <Picture
              name="06_award_presentation"
              alt="A Trust representative receiving a partnership document at an Ekurhuleni Metropolitan Municipality presentation"
              className="mt-6 aspect-[3/2] w-full rounded-[1.5rem]"
              focus="object-center"
            />
            <ul className="mt-6 space-y-3 text-base text-white/85">
              {content.sponsorBenefits.map((item) => (
                <li key={item} className="border-b border-white/10 pb-3">
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-wrap gap-4">
              <a href="#enquiry-form" className="rounded-full bg-white px-6 py-3 text-base font-semibold text-brand-plum">
                {content.ctas.requestSponsorInfo}
              </a>
              <a href="#verification" className="rounded-full border border-white/20 px-6 py-3 text-base font-semibold text-white">
                {content.ctas.requestVerification}
              </a>
            </div>
          </div>
          <div className="md:col-span-7 grid gap-4 md:grid-cols-2">
            {content.sponsorTiers.map((tier) => (
              <article key={tier.title} className="rounded-[1.5rem] bg-white p-5 text-ink shadow-[0_10px_30px_rgba(31,31,36,0.08)]">
                <h3 className="font-display text-2xl text-brand-plum">{tier.title}</h3>
                <p className="mt-3 text-sm font-semibold uppercase tracking-[0.14em] text-brand-rose">{tier.fit}</p>
                <p className="mt-3 text-base leading-relaxed text-ink/80">{tier.focus}</p>
                <p className="mt-3 text-sm font-semibold uppercase tracking-[0.12em] text-brand-sun">{tier.recognition}</p>
                <a href="#enquiry-form" className="mt-5 inline-flex rounded-full border border-brand-orchid/30 px-4 py-2 text-sm font-semibold text-ink">
                  {content.ctas.sponsor}
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="ways-to-support" className="mt-16 grid gap-8 md:grid-cols-12">
        <div className="md:col-span-5">
          <p className="text-base font-semibold uppercase tracking-[0.2em] text-brand-rose">Ways to support</p>
          <h2 className="mt-3 font-display text-3xl leading-tight md:text-5xl">Choose the form of support that suits you</h2>
        </div>
        <div className="md:col-span-7 grid gap-4 md:grid-cols-2">
          {content.supportWays.map((item) => (
            <div key={item} className="rounded-[1.25rem] border border-ink/10 bg-white px-5 py-4 text-lg text-ink/80">
              {item}
            </div>
          ))}
        </div>
      </section>

      <section id="verification" className="mt-16 grid gap-8 md:grid-cols-12">
        <div className="md:col-span-5">
          <p className="text-base font-semibold uppercase tracking-[0.2em] text-brand-rose">Verification and compliance</p>
          <h2 className="mt-3 font-display text-3xl leading-tight md:text-5xl">We do not want donors or sponsors to give blindly</h2>
          <p className="mt-4 text-xl leading-relaxed text-ink/80">You are welcome to request verification documents and speak to the team before making any commitment.</p>
          <div className="mt-6 flex flex-wrap gap-4">
            <a href="#enquiry-form" className="rounded-full bg-brand-rose px-6 py-3 text-base font-semibold text-white">
              {content.ctas.requestVerification}
            </a>
            <a href="#enquiry-form" className="rounded-full border border-brand-orchid/30 px-6 py-3 text-base font-semibold text-ink">
              {content.ctas.speakToTeam}
            </a>
          </div>
        </div>
        <div className="md:col-span-7 grid gap-4 md:grid-cols-2">
          {content.trust.verification.map((item) => (
            <div key={item} className="rounded-[1.25rem] border border-ink/10 bg-white px-5 py-4 text-lg text-ink/80">
              {item}
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16 rounded-[2rem] border border-ink/10 bg-white p-6 md:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-rose">Before you donate</p>
        <ul className="mt-4 grid gap-3 md:grid-cols-2">
          {content.trust.checklist.map((item) => (
            <li key={item} className="rounded-2xl bg-[#fafafa] px-4 py-3 text-base text-ink/80">
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section id="enquiry-form" className="mt-16 grid gap-8 md:grid-cols-12">
        <div className="md:col-span-5">
          <p className="text-base font-semibold uppercase tracking-[0.2em] text-brand-rose">Enquiry form</p>
          <h2 className="mt-3 font-display text-3xl leading-tight md:text-5xl">Tell us how you want to support</h2>
          {/* The internal lead schema and pipeline statuses that used to render
              here were developer notes, not visitor content — removed. They
              still live in donationSponsorshipContent.js for the portal work. */}
          <p className="mt-4 text-xl leading-relaxed text-ink/80">
            Send the team a note about the support you have in mind and someone will come back to you directly.
          </p>
          <p className="mt-4 text-lg leading-relaxed text-ink/70">
            Prefer to write to us yourself? Email{' '}
            <a className="underline" href="mailto:info@mphomaditrustfund.org.za">info@mphomaditrustfund.org.za</a>.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="grid gap-4 rounded-[1.75rem] border border-ink/10 bg-white p-6 md:col-span-7 md:grid-cols-2">
          <label className="flex min-w-0 flex-col gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-ink/70">
            Full name
            <input value={form.fullName} onChange={update('fullName')} type="text" className="w-full rounded-2xl border border-ink/10 bg-[#fafafa] px-4 py-3 text-base normal-case text-ink outline-none focus:border-brand-rose" />
            {attemptedSubmit && errors.fullName ? <span className="normal-case font-normal text-brand-rose">{errors.fullName}</span> : null}
          </label>
          <label className="flex min-w-0 flex-col gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-ink/70">
            Email address
            <input value={form.email} onChange={update('email')} type="email" className="w-full rounded-2xl border border-ink/10 bg-[#fafafa] px-4 py-3 text-base normal-case text-ink outline-none focus:border-brand-rose" />
          </label>
          <label className="flex min-w-0 flex-col gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-ink/70">
            Phone number
            <input value={form.phone} onChange={update('phone')} type="tel" className="w-full rounded-2xl border border-ink/10 bg-[#fafafa] px-4 py-3 text-base normal-case text-ink outline-none focus:border-brand-rose" />
            {attemptedSubmit && errors.contact ? <span className="normal-case font-normal text-brand-rose">{errors.contact}</span> : null}
          </label>
          <label className="flex min-w-0 flex-col gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-ink/70">
            I want to support as
            <select value={form.supportAs} onChange={update('supportAs')} className="w-full rounded-2xl border border-ink/10 bg-[#fafafa] px-4 py-3 text-base normal-case text-ink outline-none focus:border-brand-rose">
              {content.form.supportTypes.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
          <label className="flex min-w-0 flex-col gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-ink/70">
            Donation / sponsorship interest
            <select value={form.interest} onChange={update('interest')} className="w-full rounded-2xl border border-ink/10 bg-[#fafafa] px-4 py-3 text-base normal-case text-ink outline-none focus:border-brand-rose">
              {content.form.interests.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
            {attemptedSubmit && errors.interest ? <span className="normal-case font-normal text-brand-rose">{errors.interest}</span> : null}
          </label>
          <label className="flex min-w-0 flex-col gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-ink/70">
            Amount or estimated support value
            <input value={form.amount} onChange={update('amount')} type="text" placeholder="Optional" className="w-full rounded-2xl border border-ink/10 bg-[#fafafa] px-4 py-3 text-base normal-case text-ink outline-none focus:border-brand-rose" />
          </label>
          <label className="flex min-w-0 flex-col gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-ink/70">
            Company / organisation name
            <input value={form.companyName} onChange={update('companyName')} type="text" placeholder="Required for corporate sponsor" className="w-full rounded-2xl border border-ink/10 bg-[#fafafa] px-4 py-3 text-base normal-case text-ink outline-none focus:border-brand-rose" />
            {attemptedSubmit && errors.companyName ? <span className="normal-case font-normal text-brand-rose">{errors.companyName}</span> : null}
          </label>
          <label className="md:col-span-2 flex min-w-0 flex-col gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-ink/70">
            Message
            <textarea value={form.message} onChange={update('message')} rows="4" placeholder="Tell us how you would like to support" className="w-full rounded-2xl border border-ink/10 bg-[#fafafa] px-4 py-3 text-base normal-case text-ink outline-none focus:border-brand-rose" />
          </label>
          <label className="md:col-span-2 flex items-start gap-3 text-base text-ink/80">
            <input checked={form.consent} onChange={update('consent')} type="checkbox" className="mt-1 h-5 w-5 rounded border-ink/20 text-brand-rose focus:ring-brand-rose" />
            <span>I consent to be contacted about this donation or sponsorship enquiry.</span>
          </label>
          {attemptedSubmit && errors.consent ? <p className="md:col-span-2 text-sm text-brand-rose">{errors.consent}</p> : null}
          <div className="md:col-span-2 flex flex-wrap gap-4 pt-2">
            <button type="submit" className="donate-pulse rounded-full bg-brand-rose px-6 py-3 text-base font-semibold text-white hover:bg-brand-plum">
              {content.ctas.submitEnquiry}
            </button>
            <Link to="/preview/contact" className="rounded-full border border-brand-orchid/40 px-6 py-3 text-base font-semibold hover:border-brand-orchid">
              {content.ctas.speakToTeam}
            </Link>
          </div>
          {submitted ? (
            <p className="md:col-span-2 rounded-2xl bg-brand-rose/5 px-4 py-3 text-base text-ink/80" role="status">
              Your email app should have opened with this enquiry ready to send. If it did not, email{' '}
              <a className="underline" href={`mailto:${ENQUIRY_ADDRESS}`}>{ENQUIRY_ADDRESS}</a> directly.
            </p>
          ) : (
            <p className="md:col-span-2 text-sm text-ink/60">
              Submitting opens your email app with these details filled in, so you can review the enquiry before it is sent.
            </p>
          )}
        </form>
      </section>

      <section className="mt-16 grid gap-8 md:grid-cols-12">
        <div className="md:col-span-5">
          <p className="text-base font-semibold uppercase tracking-[0.2em] text-brand-rose">Sponsorship proposal</p>
          <h2 className="mt-3 font-display text-3xl leading-tight md:text-5xl">Request a written proposal for your organisation</h2>
          <p className="mt-4 text-xl leading-relaxed text-ink/80">{content.sponsorProposal.label}</p>
        </div>
        <div className="md:col-span-7 rounded-[1.75rem] border border-ink/10 bg-white p-6">
          <div className="flex flex-wrap gap-4">
            <a href="#enquiry-form" className="rounded-full bg-brand-plum px-6 py-3 text-base font-semibold text-white">
              {content.ctas.requestSponsorInfo}
            </a>
            {/* The download button appears only once a real file exists. A
                disabled-looking button for a document nobody can obtain is a
                dead end for the visitor — the request CTA above already works. */}
            {content.sponsorProposal.available ? (
              <a href={content.sponsorProposal.href} className="rounded-full border border-brand-orchid/30 px-6 py-3 text-base font-semibold text-ink">
                {content.ctas.downloadProposal}
              </a>
            ) : null}
          </div>
          <p className="mt-4 text-sm text-ink/60">Tell us a little about your organisation in the enquiry form and the team will send a proposal suited to it.</p>
        </div>
      </section>

      <section className="mt-16 grid gap-6 md:grid-cols-2">
        <div className="rounded-[1.75rem] border border-ink/10 bg-white p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-rose">FAQ</p>
          <div className="mt-4 space-y-4">
            {content.faq.map((item) => (
              <details key={item.q} className="rounded-2xl border border-ink/10 px-4 py-3">
                <summary className="cursor-pointer list-none font-semibold text-ink">{item.q}</summary>
                <p className="mt-3 text-base leading-relaxed text-ink/75">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
        <div className="rounded-[1.75rem] bg-brand-rose p-6 text-white">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/75">Final call to action</p>
          <h2 className="mt-3 font-display text-3xl leading-tight md:text-5xl">Support the mission in a way that matches your capacity.</h2>
          <p className="mt-4 text-xl leading-relaxed text-white/85">Whether you want to give once, support monthly, or explore sponsorship, the next step is simple and transparent.</p>
          <div className="mt-6 flex flex-wrap gap-4">
            <a href="#enquiry-form" onClick={() => trackCta('donate_click')} className="rounded-full bg-white px-6 py-3 text-base font-semibold text-brand-rose">
              {content.ctas.support}
            </a>
            <Link to="/preview/contact" className="rounded-full border border-white/20 px-6 py-3 text-base font-semibold text-white">
              {content.ctas.speakToTeam}
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
