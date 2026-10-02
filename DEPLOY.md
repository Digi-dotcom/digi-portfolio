# Deploying

## 0. Before you push
- `public/Digi_Shrestha_CV.pdf` contains a phone number. A public repo exposes it. Swap in a redacted PDF (same filename) if you want it private.
- Never commit a real `.env`. It is already in `.gitignore`.

## 1. Push to GitHub
Create an empty repo on github.com (no README), then in this folder:
```
git init
git add .
git commit -m "Portfolio"
git branch -M main
git remote add origin https://github.com/YOUR_USER/YOUR_REPO.git
git push -u origin main
```

## Option A: Vercel (recommended: contact form works)
1. vercel.com > Add New > Project > import the repo. Framework: Vite. Deploy.
2. Create a free Resend account (resend.com) and make an API key.
3. Vercel > Project > Settings > Environment Variables, add: RESEND_API_KEY, CONTACT_TO_EMAIL (your inbox), CONTACT_FROM_EMAIL (`Portfolio <onboarding@resend.dev>`).
4. Redeploy, then send a test message from the live site.
Note: with onboarding@resend.dev, Resend only delivers to the email you signed up with. Verify your own domain in Resend to change that.

## Option B: GitHub Pages (free, but the contact form cannot send)
1. Repo > Settings > Pages > Source: **GitHub Actions**.
2. Push to `main`. The workflow in `.github/workflows/pages.yml` builds and publishes.
3. Your site: https://YOUR_USER.github.io/YOUR_REPO/
The form will show its error and your email as fallback. To make it work, deploy the project to Vercel too and set `VITE_CONTACT_URL` to that function's URL (the function would also need a CORS header added).
