/**
 * Browser journeys for the arrival animation (SiteWelcome), session rules,
 * redirects, trustee profiles and a page smoke test.
 *
 * Run against a production build, not the dev server (StrictMode double
 * effects and unminified timing differ):
 *
 *   npm run build && npx vite preview --port 4180
 *   node test/ui/site-journeys.mjs http://localhost:4180
 *
 * Also safe against a Vercel Preview URL. Takes ~2.5 minutes (it waits out
 * real 8.25s animations). Uses Playwright's Chromium; WebKit/Firefox are not
 * covered here.
 */
/* global document, window, innerWidth -- referenced inside page.evaluate callbacks, which run in the browser */
import { chromium } from 'playwright'

const VIEWPORTS = { '1280x800': { width: 1280, height: 800 }, '390x844': { width: 390, height: 844 } }
const base = process.argv[2] || 'http://localhost:4180'
const res = []
const rec = (name, pass, detail = '') => { res.push({ name, pass, detail }); console.log((pass ? 'PASS ' : 'FAIL ') + name + (detail ? ' :: ' + detail : '')) }
const overlay = (p) => p.locator('.mm-welcome')
const mode = async (p) => p.evaluate(() => { const o = document.querySelector('.mm-welcome'); return o ? o.className : null })
async function ctx(browser, o = {}) { const c = await browser.newContext({ viewport: VIEWPORTS['1280x800'], reducedMotion: 'no-preference', ...o }); return { c } }
async function openFresh(c, path) { const p = await c.newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message)); p.on('console', (m) => { if (m.type() === 'error' && !/Firebase config/.test(m.text())) errs.push(m.text()) }); await p.goto(base + path, { waitUntil: 'domcontentloaded' }); p._errs = errs; return p }
const gone = (p, t = 12000) => p.waitForSelector('.mm-welcome', { state: 'detached', timeout: t }).then(() => true).catch(() => false)

const browser = await chromium.launch()
try {
  for (const [path, marker] of [['/', 'h1'], ['/her-story', 'h1'], ['/about', '#board-of-trustees']]) {
    const { c } = await ctx(browser); const p = await openFresh(c, path)
    const shown = await overlay(p).waitFor({ timeout: 8000 }).then(() => true).catch(() => false)
    const m = await mode(p)
    const behind = await p.locator(marker).first().count()
    const url = new URL(p.url()).pathname
    rec(`J${path === '/' ? 1 : path === '/her-story' ? 2 : 3} fresh arrival ${path}`, shown && /arrival/.test(m) && url === path && behind > 0, `mode=${m} url=${url} contentBehind=${behind}`)
    await p.reload({ waitUntil: 'domcontentloaded' }); await p.waitForTimeout(1200)
    rec(`J4 refresh same session (${path}) no overlay`, (await mode(p)) === null)
    if (path === '/') {
      await p.locator('header a', { hasText: /about/i }).first().click(); await p.waitForTimeout(1500)
      rec('J5 internal nav to About: no overlay', (await mode(p)) === null && new URL(p.url()).pathname === '/about')
      await p.locator('header a').first().click(); await p.waitForTimeout(250)
      const m6 = await mode(p); const t = Date.now(); const g = await gone(p, 3000)
      rec('J6 return home plays short pulse then ends', /pulse/.test(m6 || '') && g, `mode=${m6} dur~${Date.now() - t + 250}ms`)
      await p.locator('header a', { hasText: /about/i }).first().click(); await p.waitForTimeout(500)
      await p.locator('header a', { hasText: /story/i }).first().click(); await p.waitForTimeout(1200)
      rec('J5b nav About->Story no overlay', (await mode(p)) === null)
    }
    await c.close()
  }
  { const { c } = await ctx(browser); const p = await openFresh(c, '/'); await overlay(p).waitFor({ timeout: 8000 }); const p2 = await c.newPage(); await p2.goto(base + '/'); const same = await mode(p2); await c.close()
    const { c: c2 } = await ctx(browser); const p3 = await openFresh(c2, '/'); const m = await overlay(p3).waitFor({ timeout: 8000 }).then(() => true).catch(() => false)
    rec('J7 new browser session replays', m, `new tab in same context mode=${same}`); await c2.close() }
  for (const how of ['click', 'Enter', 'Space', 'Escape']) {
    const { c } = await ctx(browser); const p = await openFresh(c, '/'); await overlay(p).waitFor({ timeout: 8000 }); await p.waitForTimeout(600)
    const focusSkip = await p.evaluate(() => document.activeElement?.className)
    const t = Date.now()
    if (how === 'click') await p.locator('.mm-welcome__skip').click(); else await p.keyboard.press(how)
    const g = await gone(p, 3000); const el = Date.now() - t
    const usable = await p.evaluate(() => { const e = document.elementFromPoint(innerWidth / 2, 20); return !e?.closest('.mm-welcome') })
    rec(`J${how === 'click' ? 8 : how === 'Escape' ? 10 : 9} skip via ${how}`, g && usable, `focusOnSkip=${/skip/.test(focusSkip)} closed in ${el}ms`); await c.close()
  }
  { const { c } = await ctx(browser, { hasTouch: true, viewport: VIEWPORTS['390x844'] }); const p = await openFresh(c, '/'); await overlay(p).waitFor({ timeout: 8000 }); await p.waitForTimeout(500); await p.locator('.mm-welcome__skip').tap(); rec('J8b skip via touch tap', await gone(p, 3000)); await c.close() }
  { const { c } = await ctx(browser); await c.addInitScript(() => { Object.defineProperty(window, 'sessionStorage', { get() { throw new DOMException('x', 'SecurityError') } }) })
    const p = await openFresh(c, '/her-story'); const shown = await overlay(p).waitFor({ timeout: 8000 }).then(() => true).catch(() => false); const g = await gone(p, 12000)
    rec('J11 storage throwing: welcome plays, ends, no page errors', shown && g && p._errs.length === 0, `errs=${p._errs.join('|').slice(0, 150)}`)
    await p.reload({ waitUntil: 'domcontentloaded' }); const again = await overlay(p).waitFor({ timeout: 6000 }).then(() => true).catch(() => false)
    rec('J11b storage throwing: refresh replays (documented behaviour, skippable)', again === true); await c.close() }
  { const { c } = await ctx(browser); const p = await openFresh(c, '/'); await overlay(p).waitFor({ timeout: 8000 }); const t0 = Date.now(); const other = await c.newPage(); await other.goto('about:blank'); await other.bringToFront(); await other.waitForTimeout(6000); await p.bringToFront()
    const g = await gone(p, 12000); const el = Date.now() - t0; const usable = await p.evaluate(() => !document.querySelector('.mm-welcome') && document.querySelector('header') !== null)
    rec('J13 backgrounded 6s then restored: overlay ends, page usable', g && usable, `total ${el}ms`); await c.close() }
  { const { c } = await ctx(browser); await c.addInitScript(() => { const st = window.setTimeout; window.setTimeout = (f, d, ...a) => (d === 7550 ? 0 : st(f, d, ...a)) })
    const p = await openFresh(c, '/'); const t0 = Date.now(); await overlay(p).waitFor({ timeout: 8000 }); const g = await gone(p, 14000); const el = Date.now() - t0
    rec('J14 watchdog closes overlay when hold timer never fires (~10s)', g && el > 9000 && el < 11500, `closed after ${el}ms`); await c.close() }
  { const { c } = await ctx(browser); await c.route(/mpho-madi-(heart|logo-horizontal)\.png/, (r) => r.abort()); const p = await openFresh(c, '/'); await overlay(p).waitFor({ timeout: 8000 }); await p.waitForTimeout(500); const t = Date.now(); await p.locator('.mm-welcome__skip').click(); const g = await gone(p, 3000)
    rec('J12b Skip works when heart/logo assets fail', g, `${Date.now() - t}ms`); await c.close() }
  { const { c } = await ctx(browser); await c.route(/mpho-madi-(heart|logo-horizontal)\.png/, (r) => r.abort()); const p = await openFresh(c, '/'); const t = Date.now(); await overlay(p).waitFor({ timeout: 8000 }); const g = await gone(p, 12000); rec('J12c assets failing: overlay still self-closes', g, `${Date.now() - t}ms`); await c.close() }
  for (const path of ['/portal/login', '/portal', '/admin']) { const { c } = await ctx(browser); const p = await openFresh(c, path); await p.waitForTimeout(1500); const final = new URL(p.url()).pathname; const internal = /^\/(portal|admin)/.test(final)
    // Unauthenticated staff routes may redirect to a public page; the welcome may then play there, never over a staff route.
    rec(`J15 no welcome over ${path}`, internal ? (await mode(p)) === null : true, `final=${final}${internal ? '' : ' (redirected to a public page)'}`); await c.close() }
  { const { c } = await ctx(browser); const p = await openFresh(c, '/portal/login'); await p.waitForTimeout(800); await p.goto(base + '/', { waitUntil: 'domcontentloaded' }); const m = await overlay(p).waitFor({ timeout: 6000 }).then(() => true).catch(() => false); rec('J15b portal first, then public page: welcome still earned', m); await c.close() }
  for (const path of ['/apply', '/preview', '/nonexistent-route']) { const { c } = await ctx(browser); const p = await openFresh(c, path); await p.waitForTimeout(1200); rec(`J16 ${path} redirects to /`, new URL(p.url()).pathname === '/', `final=${new URL(p.url()).pathname} mode=${await mode(p)}`); await c.close() }
  { const { c } = await ctx(browser, { reducedMotion: 'reduce' }); const p = await openFresh(c, '/'); const shown = await overlay(p).waitFor({ timeout: 8000 }).then(() => true).catch(() => false); const m = await mode(p); const t = Date.now(); const g = await gone(p, 5000)
    rec('J-RM reduced motion: static logo welcome ends ~1.75s', shown && /reduced/.test(m) && g, `mode=${m} +${Date.now() - t}ms`)
    await p.locator('header a', { hasText: /about/i }).first().click(); await p.locator('header a').first().click(); await p.waitForTimeout(300); rec('J-RM no pulse on home return', (await mode(p)) === null); await c.close() }
  { const { c } = await ctx(browser, { reducedMotion: 'reduce', viewport: { width: 1000, height: 700 } }); const p = await openFresh(c, '/about'); await p.waitForTimeout(500); await p.locator('.mm-welcome__skip').click({ timeout: 2000 }).catch(() => {}); await gone(p, 3000)
    const btns = p.locator('#board-of-trustees ~ ul button'); const n = await btns.count(); let ok = n === 4; const det = []
    for (let i = 0; i < n; i++) { await btns.nth(i).scrollIntoViewIfNeeded(); await btns.nth(i).click(); await p.waitForSelector('dialog[open]'); const name = await p.locator('dialog h3').textContent(); const paras = await p.locator('dialog h3 ~ div p').count()
      const nav = await p.locator('.scroll-nav-button').count(); await p.keyboard.press('Escape'); await p.waitForSelector('dialog', { state: 'detached', timeout: 3000 }); const foc = await p.evaluate((i) => document.activeElement === document.querySelectorAll('#board-of-trustees ~ ul button')[i], i); det.push(`${name}:${paras}p nav=${nav} focusBack=${foc}`); ok = ok && foc }
    rec('J17 trustees: 4 cards open/close with Escape and focus return', ok, det.join(' | ')); await c.close() }
  { const { c } = await ctx(browser, { reducedMotion: 'reduce' }); const p = await openFresh(c, '/'); await gone(p, 4000)
    for (const [label, path, sel] of [['Donate', '/donate', 'form, h1'], ['Contact', '/contact', 'form, h1'], ['About', '/about', 'h1'], ['Story', '/her-story', 'h1']]) { await p.goto(base + path, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(700); const ok = (await p.locator(sel).count()) > 0; rec(`J18 ${label} page renders`, ok && p._errs.length === 0, `errs=${p._errs.join('|').slice(0, 120)}`) }
    await c.close() }
} finally { await browser.close() }
const f = res.filter((r) => !r.pass); console.log(`\nSUMMARY ${res.length - f.length}/${res.length} passed`); f.forEach((r) => console.log('FAILED:', r.name, r.detail))
