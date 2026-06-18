import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { brandLogoAlt, brandLogoPath, donateUrl, siteNav } from '../siteContent'
import { homepageContent } from './homeContent'
import { donationSponsorshipContent } from '../content/donationSponsorshipContent'

const adminModules = [
  {
    id: 'frontend-view',
    label: 'Frontend view',
    description: 'Current public-site content, brand structure, and live data markers.',
  },
  {
    id: 'sponsor-dashboard',
    label: 'Sponsor dashboard',
    description: 'Donation, sponsorship, and verification readiness.',
  },
  {
    id: 'pages-overview',
    label: 'Pages overview',
    description: 'About, apply, contact, and story content snapshots.',
  },
  {
    id: 'status-tracking',
    label: 'Status tracking',
    description: 'TBD_VERIFIED items, coming-soon markers, and missing fields.',
  },
  {
    id: 'trust-notes',
    label: 'Trust notes',
    description: 'Compliance, audit, and follow-up guidance.',
  },
]

const pageSnapshots = [
  {
    title: 'About page',
    path: '/preview/about',
    summary: 'A mobility and inclusion overview with mission-led positioning.',
    highlights: [
      'Trust purpose',
      'Partnership model',
      'Support pathways',
    ],
  },
  {
    title: 'Apply page',
    path: '/preview/apply',
    summary: 'Support application flow with referral, need, and follow-up guidance.',
    highlights: [
      'Referral details',
      'Clinical documentation',
      'Email application flow',
    ],
  },
  {
    title: 'Contact page',
    path: '/preview/contact',
    summary: 'Direct contact route with verified and placeholder details.',
    highlights: [
      'Email address',
      'Phone placeholder',
      'Support routing guidance',
    ],
  },
  {
    title: "Her Story page",
    path: '/preview/her-story',
    summary: 'Editorial placeholder for the founder journey and lived experience.',
    highlights: [
      'Story placeholders',
      'Mission context',
      'External reference note',
    ],
  },
]

function CopyButton({ value }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1200)
    } catch {
      setCopied(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="rounded-full border border-brand-orchid/30 px-3 py-1 text-xs font-semibold text-ink transition hover:border-brand-rose hover:text-brand-rose"
    >
      {copied ? 'Copied' : 'Copy'}
    </button>
  )
}

function DataRow({ label, value, note }) {
  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-ink/10 bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-brand-plum/70">{label}</p>
          <p className="mt-2 text-sm leading-6 text-ink/80">{value}</p>
          {note ? <p className="mt-2 text-xs uppercase tracking-[0.14em] text-brand-sun/80">{note}</p> : null}
        </div>
        <CopyButton value={value} />
      </div>
    </div>
  )
}

function Badge({ children, tone = 'neutral' }) {
  const toneClass =
    tone === 'warning'
      ? 'border-amber-200 bg-amber-50 text-amber-950'
      : tone === 'success'
        ? 'border-emerald-200 bg-emerald-50 text-emerald-950'
        : 'border-ink/10 bg-white text-ink/75'

  return <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] ${toneClass}`}>{children}</span>
}

function SectionCard({ title, description, children, eyebrow }) {
  return (
    <section className="rounded-[2rem] border border-ink/10 bg-white/90 p-6 shadow-[0_24px_80px_-50px_rgba(47,22,71,0.45)] md:p-8">
      {eyebrow ? <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-rose">{eyebrow}</p> : null}
      <h2 className="mt-2 font-display text-3xl leading-tight text-ink md:text-4xl">{title}</h2>
      <p className="mt-3 max-w-3xl text-sm leading-6 text-ink/70">{description}</p>
      <div className="mt-6">{children}</div>
    </section>
  )
}

function ModulePanel({ moduleId, searchTerm }) {
  const normalizedSearch = searchTerm.trim().toLowerCase()

  const modules = useMemo(
    () => ({
      'frontend-view': (
        <div className="grid gap-6">
          <SectionCard
            eyebrow="Module"
            title="Frontend view"
            description="The current public-site content in one operational snapshot."
          >
            <div className="grid gap-4 md:grid-cols-4">
              <div className="rounded-[1.5rem] bg-brand-plum px-5 py-5 text-white">
                <p className="text-xs uppercase tracking-[0.18em] text-white/70">Source</p>
                <p className="mt-2 text-2xl font-semibold">Static content modules</p>
              </div>
              <div className="rounded-[1.5rem] border border-ink/10 bg-white px-5 py-5">
                <p className="text-xs uppercase tracking-[0.18em] text-brand-plum/70">Backend</p>
                <p className="mt-2 text-2xl font-semibold">Not connected</p>
              </div>
              <div className="rounded-[1.5rem] border border-ink/10 bg-white px-5 py-5">
                <p className="text-xs uppercase tracking-[0.18em] text-brand-plum/70">Status</p>
                <p className="mt-2 text-2xl font-semibold">Review-ready</p>
              </div>
              <div className="rounded-[1.5rem] border border-ink/10 bg-white px-5 py-5">
                <p className="text-xs uppercase tracking-[0.18em] text-brand-plum/70">Markers</p>
                <p className="mt-2 text-2xl font-semibold">Visible</p>
              </div>
            </div>
          </SectionCard>

          <SectionCard
            title="Brand and navigation"
            description="Core values that drive the public site and its menu structure."
          >
            <div className="grid gap-4 md:grid-cols-2">
              <DataRow label="Brand logo path" value={brandLogoPath} note="Used by the header" />
              <DataRow label="Brand logo alt text" value={brandLogoAlt} note="Used for accessibility" />
              <DataRow label="Navigation items" value={siteNav.map((item) => `${item.label} -> ${item.href}`).join(' | ')} note="Shared site navigation" />
              <DataRow label="Donate URL" value={donateUrl} note="Primary giving link" />
            </div>
          </SectionCard>

          <SectionCard
            title="Homepage content"
            description="Live landing-page data used by the public homepage."
          >
            <div className="grid gap-4 md:grid-cols-2">
              <DataRow label="Hero eyebrow" value={homepageContent.hero.eyebrow} />
              <DataRow label="Hero title" value={homepageContent.hero.title} />
              <DataRow label="Hero mission" value={homepageContent.hero.mission} />
              <DataRow label="Founder story" value={homepageContent.founderStory.copy} />
              <DataRow label="Challenge title" value={homepageContent.challenge.title} />
              <DataRow label="Journey steps" value={homepageContent.journey.join(' -> ')} />
              <DataRow label="Ways to help" value={homepageContent.waysToHelp.join(' | ')} />
              <DataRow label="Impact fields" value={homepageContent.impact.map((item) => `${item.label}: ${item.value}`).join(' | ')} />
            </div>
          </SectionCard>
        </div>
      ),
      'sponsor-dashboard': (
        <div className="grid gap-6">
          <SectionCard
            eyebrow="Module"
            title="Sponsor dashboard"
            description="Donation and sponsorship content with visible verification status."
          >
            <div className="grid gap-4 md:grid-cols-4">
              <Badge tone="warning">TBD_VERIFIED visible</Badge>
              <Badge tone="warning">Coming soon document</Badge>
              <Badge tone="neutral">Frontend only</Badge>
              <Badge tone="success">Public route live</Badge>
            </div>
          </SectionCard>

          <SectionCard
            title="Donation and sponsorship content"
            description="All giving-path data used by the donation page."
          >
            <div className="grid gap-4 md:grid-cols-2">
              <DataRow label="Donation hero" value={donationSponsorshipContent.hero.title} />
              <DataRow label="Donation copy" value={donationSponsorshipContent.hero.copy} />
              <DataRow label="Pathways" value={donationSponsorshipContent.pathways.map((item) => item.label).join(' | ')} />
              <DataRow label="Giving options" value={donationSponsorshipContent.givingOptions.map((item) => `${item.title}: ${item.amount}`).join(' | ')} />
              <DataRow label="Sponsor tiers" value={donationSponsorshipContent.sponsorTiers.map((item) => `${item.title} (${item.fit})`).join(' | ')} />
              <DataRow label="Support methods" value={donationSponsorshipContent.supportWays.join(' | ')} />
              <DataRow label="FAQ prompts" value={donationSponsorshipContent.faq.map((item) => item.q).join(' | ')} />
              <DataRow label="Lead shape" value={donationSponsorshipContent.leadShape} note="Draft schema only" />
            </div>
          </SectionCard>

          <SectionCard
            title="Verification and placeholder tracking"
            description="Current items that still need confirmation before they can be treated as final."
          >
            <div className="grid gap-4 md:grid-cols-2">
              {[
                ...homepageContent.impact.filter((item) => String(item.value).includes('TBD_VERIFIED')).map((item) => `${item.label}: ${item.value}`),
                `Donate URL: ${donateUrl}`,
                ...donationSponsorshipContent.trust.verification,
                donationSponsorshipContent.sponsorProposal.label,
              ]
                .filter((item) => !normalizedSearch || item.toLowerCase().includes(normalizedSearch))
                .map((item) => (
                  <div key={item} className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm leading-6 text-amber-950">
                    {item}
                  </div>
                ))}
            </div>
          </SectionCard>
        </div>
      ),
      'pages-overview': (
        <div className="grid gap-6">
          <SectionCard
            eyebrow="Module"
            title="Pages overview"
            description="A review layer for the non-homepage pages currently in the site."
          >
            <div className="grid gap-4 md:grid-cols-2">
              {pageSnapshots.map((page) => (
                <article key={page.path} className="rounded-[1.5rem] border border-ink/10 bg-white p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-rose">{page.title}</p>
                      <p className="mt-2 text-sm text-ink/60">{page.path}</p>
                    </div>
                    <CopyButton value={`${page.title} ${page.path}`} />
                  </div>
                  <p className="mt-4 text-sm leading-6 text-ink/80">{page.summary}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {page.highlights.map((item) => (
                      <Badge key={item}>{item}</Badge>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </SectionCard>

          <SectionCard
            title="Page content notes"
            description="The current public routes remain editorial placeholders until approved copy is supplied."
          >
            <div className="grid gap-4 md:grid-cols-2">
              <DataRow label="About page focus" value="Mission, mobility, inclusion, and partnership model." />
              <DataRow label="Apply page focus" value="Referral details, support need, and follow-up process." />
              <DataRow label="Contact page focus" value="Email-first contact with a verified and placeholder mix." />
              <DataRow label="Her Story page focus" value="Editorial placeholder for founder journey and trust origin." />
            </div>
          </SectionCard>
        </div>
      ),
      'status-tracking': (
        <div className="grid gap-6">
          <SectionCard
            eyebrow="Module"
            title="Status tracking"
            description="Quick access to content gaps, unverified values, and future publishing items."
          >
            <div className="grid gap-4 md:grid-cols-3">
              <Badge tone="warning">TBD_VERIFIED</Badge>
              <Badge tone="warning">Coming soon</Badge>
              <Badge tone="warning">Placeholder content</Badge>
            </div>
          </SectionCard>

          <SectionCard
            title="Current gaps"
            description="Items that should stay visible until they are verified."
          >
            <div className="grid gap-4 md:grid-cols-2">
              {[
                'Children Supported metric',
                'Assistive Devices Provided metric',
                'Families Reached metric',
                'Active Support Cases metric',
                'Phone number on Contact page',
                'Sponsorship proposal PDF',
                'Donation provider confirmation',
                'Board / leadership verification',
              ].map((item) => (
                <div key={item} className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm leading-6 text-amber-950">
                  {item}
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      ),
      'trust-notes': (
        <div className="grid gap-6">
          <SectionCard
            eyebrow="Module"
            title="Trust notes"
            description="Operational notes for review, compliance, and audit-minded administration."
          >
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-ink/10 bg-white p-4 text-sm leading-6 text-ink/75">
                All data is frontend-only and reads from existing content modules.
              </div>
              <div className="rounded-2xl border border-ink/10 bg-white p-4 text-sm leading-6 text-ink/75">
                No backend, API, or persistence layer is connected yet.
              </div>
              <div className="rounded-2xl border border-ink/10 bg-white p-4 text-sm leading-6 text-ink/75">
                TBD_VERIFIED markers remain visible until the related details are confirmed.
              </div>
              <div className="rounded-2xl border border-ink/10 bg-white p-4 text-sm leading-6 text-ink/75">
                This panel is intended for review, content management prep, and future admin expansion.
              </div>
            </div>
          </SectionCard>

          <SectionCard
            title="Audit and follow-up guidance"
            description="Rules to keep the future admin layer safe and traceable."
          >
            <div className="grid gap-4 md:grid-cols-2">
              <DataRow label="Verification note" value={donationSponsorshipContent.trust.verification.join(' | ')} />
              <DataRow label="Audit guidance" value="Log create, update, delete, import, reconciliation, export, and lock actions when finance features are added." />
            </div>
          </SectionCard>
        </div>
      ),
    }),
    [normalizedSearch],
  )

  return modules[moduleId] ?? modules['frontend-view']
}

export function AdminPage() {
  const [activeModule, setActiveModule] = useState('frontend-view')
  const [searchTerm, setSearchTerm] = useState('')

  const activeMeta = adminModules.find((item) => item.id === activeModule) ?? adminModules[0]

  return (
    <main className="section-shell py-16 md:py-24">
      <section className="grid gap-8 md:grid-cols-12 md:items-end">
        <div className="md:col-span-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-rose">Admin Panel</p>
          <h1 className="mt-3 max-w-4xl font-display text-4xl leading-tight md:text-6xl">Rich operations view for current site data.</h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-ink/80">
            Review the live public-site content by module, starting with <strong>Frontend view</strong>, then move through sponsor, page, status, and trust sections.
          </p>
        </div>
        <div className="md:col-span-4 md:justify-self-end">
          <Link
            to="/preview"
            className="inline-flex rounded-full border border-brand-orchid/30 px-5 py-3 text-sm font-semibold text-ink transition hover:border-brand-rose hover:text-brand-rose"
          >
            Back to site
          </Link>
        </div>
      </section>

      <section className="mt-10 grid gap-4 md:grid-cols-4">
        <div className="rounded-[1.75rem] bg-brand-plum px-6 py-5 text-white">
          <p className="text-sm uppercase tracking-[0.18em] text-white/70">Active module</p>
          <p className="mt-2 text-2xl font-semibold">{activeMeta.label}</p>
        </div>
        <div className="rounded-[1.75rem] border border-ink/10 bg-white px-6 py-5">
          <p className="text-sm uppercase tracking-[0.18em] text-brand-plum/70">Backend</p>
          <p className="mt-2 text-2xl font-semibold">Not connected</p>
        </div>
        <div className="rounded-[1.75rem] border border-ink/10 bg-white px-6 py-5">
          <p className="text-sm uppercase tracking-[0.18em] text-brand-plum/70">Scope</p>
          <p className="mt-2 text-2xl font-semibold">Frontend only</p>
        </div>
        <div className="rounded-[1.75rem] border border-ink/10 bg-white px-6 py-5">
          <p className="text-sm uppercase tracking-[0.18em] text-brand-plum/70">Status</p>
          <p className="mt-2 text-2xl font-semibold">Review-ready</p>
        </div>
      </section>

      <section className="mt-12 grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="rounded-[2rem] border border-ink/10 bg-white/90 p-4 md:p-5">
          <div className="space-y-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-rose">Sidebar</p>
              <p className="mt-2 text-sm leading-6 text-ink/70">Switch between the admin modules below.</p>
            </div>
            <label className="block">
              <span className="sr-only">Search admin data</span>
              <input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                type="search"
                placeholder="Search data..."
                className="w-full rounded-2xl border border-ink/10 bg-[#fafafa] px-4 py-3 text-sm outline-none focus:border-brand-rose"
              />
            </label>
            <nav className="space-y-2">
              {adminModules.map((item) => {
                const isActive = item.id === activeModule
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveModule(item.id)}
                    className={`w-full rounded-[1.25rem] border px-4 py-4 text-left transition ${
                      isActive
                        ? 'border-brand-rose bg-brand-rose/8 text-brand-plum'
                        : 'border-ink/10 bg-white text-ink/80 hover:border-brand-orchid/40'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.16em]">{item.label}</p>
                        <p className="mt-2 text-xs leading-5 text-ink/60">{item.description}</p>
                      </div>
                      {isActive ? <Badge tone="success">Active</Badge> : null}
                    </div>
                  </button>
                )
              })}
            </nav>
          </div>
        </aside>

        <div className="space-y-6">
          <SectionCard
            eyebrow="Module summary"
            title={activeMeta.label}
            description={activeMeta.description}
          >
            <div className="flex flex-wrap gap-3">
              <Badge tone="success">Frontend view</Badge>
              <Badge tone="neutral">No backend</Badge>
              <Badge tone="warning">TBD_VERIFIED visible</Badge>
              <Badge tone="warning">Copyable data blocks</Badge>
            </div>
          </SectionCard>

          <ModulePanel moduleId={activeModule} searchTerm={searchTerm} />
        </div>
      </section>
    </main>
  )
}
