# School Connect website

The marketing site, pricing page and sign-up/checkout flow. It's built with Next.js and exported as static files for GitHub Pages.

- Content, plans, prices, bank details and emails: [`src/config/site.ts`](src/config/site.ts)
- Payment methods and order handling: [`src/lib/payments.ts`](src/lib/payments.ts)

```bash
npm install
npm run dev        # http://localhost:3000
npm run lint
npm run typecheck
npm run build      # static export in out/ (set BASE_PATH=/ReactNativeSchool for GitHub Pages)
```
