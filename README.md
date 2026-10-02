# Digi Shrestha portfolio (React + Vite)
Only runtime dependency: React. No animation/icon libraries; effects are CSS, SVG and canvas.

## Run
`npm install` then `npm run dev` (http://localhost:5173). Production: `npm run build` -> `dist/`.

## Edit content
Everything personal is in `src/data/portfolio.js` (no phone number is stored or displayed anywhere on purpose).
Replace the CV by overwriting `public/Digi_Shrestha_CV.pdf` (note: the current PDF itself contains a phone number).

## Contact form (needs setup before it can deliver)
`api/contact.js` is a Vercel serverless function using Resend. Copy `.env.example` into Vercel Project Settings > Environment Variables:
RESEND_API_KEY, CONTACT_TO_EMAIL, CONTACT_FROM_EMAIL. Deploy to Vercel (framework Vite, output `dist`). Until these are set the form shows an error with a mailto fallback; it never shows success unless Resend accepts the message. `npm run dev` does not run `/api`; use `vercel dev` to test.

## Notes
- Network lab diagram is an illustrative design, not a live homelab. Packet traffic is simulated locally.
- Secret: console hint, then terminal command `flag <value>`.
