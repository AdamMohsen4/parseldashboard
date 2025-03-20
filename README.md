
## Deploy to GitHub Pages

To deploy your E-Parsel application to GitHub Pages:

1. Make sure your repository name is set correctly in `vite.config.ts`:
```js
export default defineConfig({
  base: "/e-parcel/", // Replace with your repo name if different
  // other config...
})
```

2. Create a new GitHub workflow file in `.github/workflows/deploy.yml` with the following content:
```yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  workflow_dispatch:

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 18

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Deploy to GitHub Pages
        uses: JamesIves/github-pages-deploy-action@v4
        with:
          folder: dist
          branch: gh-pages
```

3. Commit and push these changes to your main branch.
4. Go to your repository settings > Pages and ensure the source is set to GitHub Actions.

Your app will be available at `https://<YOUR_USERNAME>.github.io/e-parsel/`

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- React Router
- Clerk for authentication
- i18next for internationalization
