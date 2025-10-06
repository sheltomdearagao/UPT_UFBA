Vercel deploy
-------------

This project uses Vite + React. The build command is:

```
npm run build
```

Output directory (for Vercel): `dist`

To configure Vercel:
- Connect your GitHub repo to Vercel
- Set Build Command to `npm run build`
- Set Output Directory to `dist`

Checking build logs on Vercel:
- Open your project in the Vercel dashboard
- Go to the Deployments tab and click the latest deployment
- Expand the "Build" log to see build steps and errors

If the build succeeds, the produced files will be under `dist/` (index.html + assets).

(Deployment)

Deploy to Vercel
---------------

This repository is a Vite + React application. To deploy to Vercel:

1. Go to https://vercel.com and import a project from GitHub. Select the repository `sheltomdearagao/UPT_UFBA`.
2. Set the Build Command to:

	npm run build

3. Set the Output Directory to:

	dist

4. Add any required Environment Variables (for example VITE_ prefixed keys or SUPABASE_URL / SUPABASE_ANON_KEY) in the Vercel Project Settings -> Environment Variables.

5. Deploy. Vercel will run the build command and publish the `dist/` output.

Notes
- Do not commit secrets (DATABASE_URL, service keys) to the repository. Use Vercel environment variables instead.
- Preview deployments are created automatically for Pull Requests when you connect GitHub.

