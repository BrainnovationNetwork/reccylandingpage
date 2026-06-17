# BN x Reccy Recruiting Landing Page

A standalone static page that lives at `/recruiting` on the Brainnovation Network site and drives outbound, UTM-tracked traffic to Reccy Neuro.

## Design

Hero matches the brainnovationnetwork.com house template: blue announcement bar, full-bleed photo background with a dark overlay, white logo, hamburger-only nav, an underlined uppercase eyebrow, and a large white Title Case Fraunces headline lower-left.

Below the hero is a light editorial body, navy-led, Fraunces (display, upright) + Inter (UI), with restrained color. Each section sits on its own background band (white / paper / cool tint / navy) so they read as distinct panels. Highlights: a prominent centered partnership lockup; a "Where neurotech hires" logo-wall marquee (monochrome, auto-scroll, static-wrap fallback for reduced motion); a "See the reasoning" section with a live applicant-intelligence panel; feature tiles that each carry a small product visual; a proof section that charts real results as applicant unit-charts (one dot per applicant, teal = relevant); and a "How it works" section that shows all four steps as a static row on desktop and a one-at-a-time carousel (arrows + dots) on mobile. Subtle reveal-on-scroll throughout. Built to read as human-designed, not templated.

**reccy neuro brand styling:** the name is always lowercase, and "neuro" renders in their purple (`--reccy-purple #8456F4`, lightened to `#A78BFA` on dark backgrounds) via the `.rn-neuro` span. Purple is used in prose only; inside CTA buttons and inline links the label stays one color (purple-on-gold/navy clashed). The uppercase section kickers don't carry the brand name for the same reason.

The previous version is preserved in `_original_backup/`. Early direction studies are in `_mockups/` (safe to delete).

## Files

- `index.html`: the page
- `styles.css`: all styles, scoped under `.bn-reccy`
- `main.js`: UTM URL builder, CTA href injection, hamburger menu toggle, smooth scroll, footer year, the proof applicant unit-charts, reveal-on-scroll (with a failsafe that reveals everything if `IntersectionObserver` never fires)
- `nav-snippet.html`: the `<li>` to splice into the existing BN site nav
- `assets/header-image.jpg`: original hero photo (full-res, 6016px). `assets/header-web.jpg`: web-optimized version (2400px, ~540KB) that the hero actually loads. To swap the hero, replace `header-web.jpg` (or re-point `--hero-photo` in `.hero`)
- `assets/bn-logo-white.png`: white BN wordmark (with colored spark) for dark backgrounds (hero nav, footer)
- `assets/bn-logo-color.png`: full-color BN logo (charcoal wordmark + colored spark) used in the light partnership lockup
- `assets/bn-logo-dark.png`: gray wordmark variant (kept for reference, not used on the page)
- `assets/reccy-wordmark-white.png`, `assets/reccy-wordmark-dark.png`: Reccy wordmark (purple), white / dark variants
- `assets/*-trim.png`: the same logos auto-cropped to remove transparent padding. The page uses `reccy-wordmark-dark-trim.png` (hero lockup) and `reccy-wordmark-white-trim.png` (footer) so the marks sit at correct, equal visual weight
- `logos/`: original company logos (provided with permission, mixed backgrounds). `assets/logos/*-mono.png`: the same logos normalized to monochrome navy on transparent for the logo-wall marquee. To add/replace a company, drop the source in `logos/`, re-run the normalize script, and add an `<li>` to **both** sets in `.logo-track`

## Confirm before launch

- [x] **Hero photo.** In place: `header-web.jpg` (web-optimized from `header-image.jpg`). The navy overlay darkens the lower-left so the white headline stays legible while the faces on the right stay visible. To change it, replace `assets/header-web.jpg` (keep it wide, ~2400px) or re-point `--hero-photo` in `.hero`.
- [ ] **Announcement bar.** Links to `/join` as a placeholder. Point it at the real BN join URL, or remove the bar if the parent template already renders one.
- [ ] **Slug.** This page assumes `/recruiting`. Confirm the exact slug with the BN site owner, then update any internal references (`nav-snippet.html`, the `aria-current="page"` link in `index.html`).
- [x] **Reccy destination paths (confirmed by Reccy).** Two destinations, set per Reccy's request:
  - `https://app.reccy.dev/sign-up` — all account-creation CTAs (primary)
  - `https://neuro.reccy.dev/` — all "explore reccy neuro" CTAs (secondary)

  Defined once in `main.js` (`RECCY_BASE`). The earlier `/discover` and `/jobsletter` paths were dropped — per Reccy, this first version targets founders/product innovators, not job seekers, so "browse talent" and "jobsletter" framing was removed.
- [ ] **Reccy logo.** The lockup and footer use trimmed copies of `reccy-wordmark-dark.png` / `reccy-wordmark-white.png` (a derived purple wordmark). HTML placeholder comments mark both spots. Swap in the canonical Reccy brand asset before launch.
- [ ] **Logo wall framing + names.** The "Where neurotech hires" marquee shows 12 company logos (provided with permission). Confirm with the Reccy side that each name is cleared to display and that "Where neurotech hires" matches their framing (customer vs. profiled). Swap or remove any that aren't cleared.
- [ ] **"Free" microcopy.** The hero and final CTA say "Free to start" (verified: Reccy signup/browse is free). I deliberately avoided unverified claims like "no credit card." If Reccy confirms terms for hiring teams, you can strengthen the line.
- [ ] **Parent nav placeholders.** The nav links in `index.html` (`/`, `/experts`, `/events`) are placeholders so the standalone page renders. Either splice this page into the parent site directly, or replace those hrefs with the parent site's real anchors.

## UTM scheme (do not change without telling the Reccy side)

All outbound links share:

- `utm_source=brainnovation`
- `utm_medium=partner_referral`
- `utm_campaign=reccy_pilot_2026`

Each placement has a unique `utm_content` so referral volume is attributable at the 90-day pilot review:

| Placement | utm_content | Destination |
| --- | --- | --- |
| Nav button ("Join reccy neuro") | `nav_button` | sign-up |
| Hero primary ("Create a free reccy neuro account") | `hero_primary` | sign-up |
| Hero secondary ("Explore reccy neuro") | `hero_secondary` | explore |
| Reasoning section link ("See how scoring works") | `reasoning_cta` | explore |
| Feature card link ("Explore reccy neuro") | `feature_explore` | explore |
| How it works (step 4 inline link) | `how_it_works` | sign-up |
| Final CTA band ("Create a free reccy neuro account") | `final_band` | sign-up |

URLs are built in `main.js` from `RECCY_BASE` and `UTM_BASE`. If a path or UTM key changes, change it there once.

## Local preview

This is a static page with no build step:

```bash
cd "/Users/balraj/Desktop/Reccy landing page"
python3 -m http.server 8000
# then open http://localhost:8000
```

## Responsive breakpoints

Mobile-first. Verified at 375, 768, 1280.

## Accessibility

WCAG AA. Gold (`#F1B434`) is used only as a button fill with navy text on top, since gold-on-white as body text fails AA. Visible `:focus-visible` outlines on every interactive element. Semantic landmarks throughout.
