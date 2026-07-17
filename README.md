# INAPROC Checkout — Usability Test Prototype

Clickable Next.js prototype of the "Atur Pengiriman" flow, for usability testing.

Flow: `/step1` (set delivery, date, quantities) → confirm modal → `/step3` (multi-location summary).

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Deploy to Vercel (free, gives you a shareable link)

**Easiest path — no GitHub needed:**

1. Install the Vercel CLI once: `npm i -g vercel`
2. From this folder, run: `vercel`
3. Follow the prompts (log in / sign up with email or GitHub — it's free)
4. It builds and gives you a live URL like `inaproc-checkout-prototype.vercel.app` — send that link to anyone for testing, no login required on their end.
5. Every time you make changes, run `vercel --prod` again to update the same URL.

**Alternative — via GitHub (good if you'll keep iterating):**

1. Push this folder to a new GitHub repo
2. Go to https://vercel.com/new, sign in, "Import Project", pick the repo
3. Leave all settings default (Vercel auto-detects Next.js) → Deploy
4. You get a live URL, and every future `git push` auto-deploys

## Notes for testers

- This is a front-end-only prototype — no real backend. Quantities and dates are kept in the browser (localStorage) just long enough to carry data from step 1 to step 3.
- Refreshing step 3 directly (without going through step 1) shows placeholder data — fine for a moderated test where you always start participants at `/step1`.
