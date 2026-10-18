/**
 * Repeatable performance measurement for the public site.
 *
 *   node test/perf/measure.mjs <baseUrl> [--runs 3] [--profile mobile|desktop|both] [--out results.json]
 *
 * Run it against a production build (`npm run build && npx vite preview`), a
 * Vercel Preview or production. Nothing here is imported by the app, so none of
 * it can reach the production bundle.
 *
 * The first arrival deliberately holds a branded overlay for ~8.25s, so a single
 * "LCP" would misreport that sequence as slow rendering. Each number below is
 * therefore measured in its own scenario:
 *
 *   fresh session, /          overlayStart          first frame the white overlay owns the screen
 *                             heartFrame            first frame with the heart loaded and fully visible
 *                             overlayLcp            last LCP candidate while the overlay was up
 *                             overlayEnd            overlay removed (from navigation start)
 *                             dismissToStableHero   overlay removed -> hero image decoded and no further layout shift
 *   repeat session, /         repeatHomeLcp         no full welcome (same session)
 *   repeat session, deep link deepLinkLcp           /her-story and /about
 *   repeat session, /portal/login
 *                             portalReady           navigation start -> portal heading visible
 *                             portalChunkToReady    first lazily requested script -> portal heading (null if nothing was lazy)
 *   repeat session, /donate   firebase before / after typing in the form
 *
 * Per route it also records requests, transferred kB, script kB, whether any
 * script loaded in that step contains Firebase code, whether Firebase opened its
 * IndexedDB databases during that page load (i.e. initialised), and requests to Firebase/Google endpoints.
 *
 * Profiles: mobile = 390x844, 1.6 Mbps / 150 ms RTT, 4x CPU slowdown.
 *           desktop = 1440x900, no throttling.
 * Each run uses a new browser context, so every fresh-session scenario is a cold cache.
 */
/* global document, window, location, getComputedStyle, indexedDB, requestAnimationFrame -- used inside page callbacks, which run in the browser */
import { chromium } from 'playwright'
import { writeFileSync } from 'node:fs'

const args = process.argv.slice(2)
const base = (args.find((a) => !a.startsWith('--')) || 'http://localhost:4173').replace(/\/$/, '')
const opt = (name, fallback) => {
  const i = args.indexOf(`--${name}`)
  return i >= 0 ? args[i + 1] : fallback
}
const RUNS = Number(opt('runs', 3))
const PROFILE = opt('profile', 'both')
const OUT = opt('out', null)

const PROFILES = {
  mobile: { viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true, net: { latency: 150, downloadThroughput: 200000, uploadThroughput: 93750 }, cpu: 4 },
  desktop: { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1, isMobile: false, hasTouch: false, net: null, cpu: 1 },
}

const FIREBASE_HOSTS = /identitytoolkit|securetoken|firestore\.googleapis|firebaseinstallations|firebaseappcheck|content-firebaseappcheck|recaptcha|cloudfunctions|\.run\.app|firebase/i

const INIT = () => {
  const q = (window.__perf = { lcp: [], shifts: [], overlayStart: null, heartFrame: null, closingAt: null, overlayEnd: null, heroReady: null, portalReady: null, idbOpened: [] })
  const now = () => Math.round(performance.now())
  // Firebase opens its IndexedDB databases (auth persistence, heartbeat) when it
  // initialises. Databases outlive the page, so record opens per page load.
  try {
    const open = indexedDB.open.bind(indexedDB)
    indexedDB.open = (name, ...rest) => { q.idbOpened.push(String(name)); return open(name, ...rest) }
  } catch { /* unavailable */ }
  try {
    new PerformanceObserver((l) => l.getEntries().forEach((e) => q.lcp.push({ t: Math.round(e.startTime), el: (e.element?.tagName || '?') + (e.url ? ':' + e.url.split('/').pop() : '') }))).observe({ type: 'largest-contentful-paint', buffered: true })
  } catch { /* unsupported */ }
  try {
    new PerformanceObserver((l) => l.getEntries().forEach((e) => { if (!e.hadRecentInput) q.shifts.push({ t: Math.round(e.startTime), v: e.value }) })).observe({ type: 'layout-shift', buffered: true })
  } catch { /* unsupported */ }
  const loop = () => {
    const t = now()
    const o = document.querySelector('.mm-welcome')
    if (o && q.overlayStart === null) q.overlayStart = t
    if (o && q.closingAt === null && o.classList.contains('is-closing')) q.closingAt = t
    if (!o && q.overlayStart !== null && q.overlayEnd === null) q.overlayEnd = t
    if (o && q.heartFrame === null) {
      const art = o.querySelector('.mm-welcome__heart-art')
      const wrap = o.querySelector('.mm-welcome__heart')
      if (art && wrap && art.complete && art.naturalWidth > 0) {
        const op = Math.min(Number(getComputedStyle(wrap).opacity), Number(getComputedStyle(art).opacity))
        if (op >= 0.95) q.heartFrame = t
      }
    }
    if (q.heroReady === null) {
      const hero = document.querySelector('.home-hero__image img')
      if (hero && hero.complete && hero.naturalWidth > 0) q.heroReady = t
    }
    if (q.portalReady === null && /^\/portal/.test(location.pathname) && document.querySelector('main h1')) q.portalReady = t
    requestAnimationFrame(loop)
  }
  requestAnimationFrame(loop)
}

async function newPage(browser, profile) {
  const p = PROFILES[profile]
  const context = await browser.newContext({ viewport: p.viewport, deviceScaleFactor: p.deviceScaleFactor, isMobile: p.isMobile, hasTouch: p.hasTouch, reducedMotion: 'no-preference' })
  await context.addInitScript(INIT)
  const page = await context.newPage()
  const cdp = await context.newCDPSession(page)
  await cdp.send('Network.enable')
  if (p.net) await cdp.send('Network.emulateNetworkConditions', { offline: false, ...p.net })
  if (p.cpu > 1) await cdp.send('Emulation.setCPUThrottlingRate', { rate: p.cpu })
  const log = { reqs: new Map() }
  cdp.on('Network.requestWillBeSent', (e) => log.reqs.set(e.requestId, { url: e.request.url, type: e.type, bytes: 0, t: e.timestamp }))
  cdp.on('Network.responseReceived', (e) => { const r = log.reqs.get(e.requestId); if (r) r.type = e.type })
  cdp.on('Network.loadingFinished', (e) => { const r = log.reqs.get(e.requestId); if (r) r.bytes = e.encodedDataLength })
  return { context, page, log }
}

const scriptCache = new Map()
async function hasFirebaseCode(url) {
  if (!scriptCache.has(url)) {
    scriptCache.set(url, fetch(url).then((r) => r.text()).then((t) => /FirebaseError|@firebase\/app|firebase-heartbeat/.test(t)).catch(() => null))
  }
  return scriptCache.get(url)
}

async function routeSummary(page, log, since = 0) {
  const reqs = [...log.reqs.values()].slice(since)
  const scripts = reqs.filter((r) => r.type === 'Script' && r.url.startsWith(base))
  const fbCode = (await Promise.all(scripts.map((s) => hasFirebaseCode(s.url)))).some(Boolean)
  const dbs = await page.evaluate(() => window.__perf.idbOpened)
  return {
    requests: reqs.length,
    transferKB: Math.round(reqs.reduce((a, r) => a + r.bytes, 0) / 1024),
    scriptKB: Math.round(scripts.reduce((a, r) => a + r.bytes, 0) / 1024),
    scripts: scripts.map((s) => s.url.split('/').pop()),
    firebaseCodeLoaded: fbCode,
    firebaseInitialised: dbs.some((n) => /firebase/i.test(n || '')),
    firebaseRequests: reqs.filter((r) => FIREBASE_HOSTS.test(new URL(r.url).host)).map((r) => new URL(r.url).host),
  }
}

const perf = (page) => page.evaluate(() => window.__perf)
const lastLcp = (q, until = Infinity) => { const c = q.lcp.filter((e) => e.t <= until); return c.length ? c[c.length - 1] : null }

async function oneRun(browser, profile) {
  const out = { profile }
  const { context, page, log } = await newPage(browser, profile)
  try {
    // 1. Fresh session, home, full welcome.
    await page.goto(base + '/', { waitUntil: 'commit' })
    await page.waitForSelector('.mm-welcome', { timeout: 30000 })
    await page.waitForSelector('.mm-welcome', { state: 'detached', timeout: 30000 })
    await page.waitForTimeout(2500)
    let q = await perf(page)
    const shiftsAfter = q.shifts.filter((s) => s.t > q.overlayEnd)
    const lastShift = shiftsAfter.length ? shiftsAfter[shiftsAfter.length - 1].t : q.overlayEnd
    out.fresh = {
      overlayStart: q.overlayStart,
      heartFrame: q.heartFrame,
      overlayLcp: lastLcp(q, q.closingAt ?? q.overlayEnd),
      overlayEnd: q.overlayEnd,
      overlayDuration: q.overlayEnd - q.overlayStart,
      dismissToStableHero: Math.max(q.heroReady ?? q.overlayEnd, lastShift, q.overlayEnd) - q.overlayEnd,
      clsAfterDismissal: +shiftsAfter.reduce((a, s) => a + s.v, 0).toFixed(4),
      clsTotal: +q.shifts.reduce((a, s) => a + s.v, 0).toFixed(4),
      ...(await routeSummary(page, log)),
    }

    // 2. Repeat session, home: no full welcome.
    const visit = async (path, waitMs = 4000) => {
      const since = log.reqs.size
      await page.goto(base + path, { waitUntil: 'load', timeout: 60000 })
      await page.waitForTimeout(waitMs)
      const r = await perf(page)
      return { q: r, summary: await routeSummary(page, log, since) }
    }
    let v = await visit('/')
    out.repeatHome = { lcp: lastLcp(v.q), cls: +v.q.shifts.reduce((a, s) => a + s.v, 0).toFixed(4), welcomeShown: v.q.overlayStart !== null, ...v.summary }

    // 3. Deep links in the same session.
    for (const path of ['/her-story', '/about']) {
      v = await visit(path)
      out[`deep:${path}`] = { lcp: lastLcp(v.q), cls: +v.q.shifts.reduce((a, s) => a + s.v, 0).toFixed(4), ...v.summary }
    }

    // 4. Donate: before and after a meaningful interaction.
    v = await visit('/donate', 2500)
    out.donateBefore = v.summary
    const since = log.reqs.size
    const field = page.locator('form input:not([type=hidden]), form textarea').first()
    if (await field.count()) {
      await field.click()
      await field.type('a', { delay: 30 })
      await page.waitForTimeout(3000)
    }
    out.donateAfterInteraction = await routeSummary(page, log, since)

    // 5. Portal route.
    const pSince = log.reqs.size
    await page.goto(base + '/portal/login', { waitUntil: 'load', timeout: 60000 })
    await page.waitForFunction(() => window.__perf.portalReady !== null, null, { timeout: 30000 }).catch(() => {})
    q = await perf(page)
    const portalReqs = [...log.reqs.values()].slice(pSince)
    const navStart = portalReqs[0]?.t
    const entryUrl = portalReqs.find((r) => r.type === 'Script')?.url
    const lazy = portalReqs.filter((r) => r.type === 'Script' && r.url !== entryUrl && r.url.startsWith(base))
    out.portal = {
      portalReady: q.portalReady,
      portalChunkToReady: lazy.length && navStart ? q.portalReady - Math.round((lazy[0].t - navStart) * 1000) : null,
      ...(await routeSummary(page, log, pSince)),
    }
  } finally {
    await context.close()
  }
  return out
}

const median = (xs) => { const s = xs.filter((x) => typeof x === 'number').sort((a, b) => a - b); return s.length ? s[Math.floor((s.length - 1) / 2)] : null }

const browser = await chromium.launch()
const results = { base, runs: RUNS, date: new Date().toISOString(), profiles: {} }
try {
  for (const profile of PROFILE === 'both' ? ['mobile', 'desktop'] : [PROFILE]) {
    const runs = []
    for (let i = 0; i < RUNS; i++) runs.push(await oneRun(browser, profile))
    const pick = (path) => median(runs.map((r) => path.split('.').reduce((o, k) => o?.[k], r)))
    results.profiles[profile] = {
      runs,
      median: {
        overlayStart: pick('fresh.overlayStart'),
        heartFrame: pick('fresh.heartFrame'),
        overlayLcp: pick('fresh.overlayLcp.t'),
        overlayEnd: pick('fresh.overlayEnd'),
        overlayDuration: pick('fresh.overlayDuration'),
        dismissToStableHero: pick('fresh.dismissToStableHero'),
        clsAfterDismissal: pick('fresh.clsAfterDismissal'),
        freshTransferKB: pick('fresh.transferKB'),
        freshScriptKB: pick('fresh.scriptKB'),
        repeatHomeLcp: pick('repeatHome.lcp.t'),
        deepLinkStoryLcp: pick('deep:/her-story.lcp.t'),
        deepLinkAboutLcp: pick('deep:/about.lcp.t'),
        portalReady: pick('portal.portalReady'),
        portalChunkToReady: pick('portal.portalChunkToReady'),
      },
      firebase: {
        freshHome: runs.map((r) => ({ code: r.fresh.firebaseCodeLoaded, init: r.fresh.firebaseInitialised, net: r.fresh.firebaseRequests.length })),
        repeatHome: runs.map((r) => ({ code: r.repeatHome.firebaseCodeLoaded, init: r.repeatHome.firebaseInitialised })),
        donateBefore: runs.map((r) => ({ code: r.donateBefore.firebaseCodeLoaded, init: r.donateBefore.firebaseInitialised })),
        donateAfter: runs.map((r) => ({ code: r.donateAfterInteraction.firebaseCodeLoaded, init: r.donateAfterInteraction.firebaseInitialised, scripts: r.donateAfterInteraction.scripts })),
        portal: runs.map((r) => ({ code: r.portal.firebaseCodeLoaded, init: r.portal.firebaseInitialised })),
      },
    }
    console.log(profile, JSON.stringify(results.profiles[profile].median))
    console.log(profile, 'firebase', JSON.stringify(results.profiles[profile].firebase))
  }
} finally {
  await browser.close()
}
if (OUT) writeFileSync(OUT, JSON.stringify(results, null, 2))
