# School Connect — parent app

A cross-platform (Android, iOS, web) React Native app a school publishes for parents. Parents can:

- **See each child's progress**: overall score, attendance, subject-wise scores with trends and teacher remarks, upcoming tests
- **Read report cards**: marks, grades, class position, teacher and principal remarks
- **Give feedback on a report card**: star rating and a comment for the class teacher
- **Raise complaints, make suggestions or send appreciation**: pick a category and a child, and optionally submit anonymously
- **Follow each conversation**: status (Submitted → In review → Resolved) and the school's replies, with follow-up messages
- **Read school announcements**: events, exams, holidays

Built with **Expo SDK 57**, React Native 0.86, Expo Router and TypeScript.

## Try it

### On any phone or browser (no install)

- **Website** (product, pricing, sign-up): **https://shoaibmehmood21.github.io/ReactNativeSchool/**
- **Parent app demo:** **https://shoaibmehmood21.github.io/ReactNativeSchool/app/**

Both are republished automatically on every push by [`.github/workflows/deploy-web.yml`](.github/workflows/deploy-web.yml).

### On your computer

```bash
npm install
npm start          # scan the QR code with a development build, or press w for web
```

The app runs in **demo mode** with sample data until you connect a backend. Demo login: `parent@demo.school` / `demo123`.

## Getting installable builds

### Android APK (automatic)

Every push runs [`.github/workflows/build-android.yml`](.github/workflows/build-android.yml), which builds a release APK.

1. Open the repo's **Actions** tab → **Build Android APK** → the latest run.
2. Download the **school-connect-android-apk** artifact, unzip it, and copy `school-connect.apk` to the phone.
3. Open it and allow "Install from unknown sources".

Push a tag (for example `git tag v1.0.0 && git push --tags`) and the APK is also attached to a GitHub Release, which gives parents a download link.

> The CI APK is signed with the default debug key. That's fine for side-loading and testing. For the **Google Play Store**, build with EAS (below) or add your own upload keystore.

### iPhone builds

Apple only lets signed apps onto a real iPhone, and signing needs an **Apple Developer Program membership** (US$99/year). So there are two paths:

| Goal | How |
| --- | --- |
| Run in the iOS Simulator (Mac) | Every push runs [`.github/workflows/build-ios.yml`](.github/workflows/build-ios.yml). Download the **school-connect-ios-simulator** artifact, unzip it, and drag the `.app` onto a running Simulator. |
| Install on real iPhones (TestFlight / App Store / ad-hoc) | Use EAS Build with your Apple account: `npx eas-cli build --platform ios --profile production`, then `npx eas-cli submit --platform ios`. EAS handles certificates and provisioning profiles. |

### EAS Build (both platforms, cloud)

[`eas.json`](eas.json) defines three profiles:

```bash
npx eas-cli login
npx eas-cli build --platform android --profile preview      # shareable APK
npx eas-cli build --platform ios --profile preview          # ad-hoc build for registered iPhones
npx eas-cli build --platform all --profile production       # store builds (AAB + IPA)
```

## Connecting the school's backend

All data access goes through [`src/api/client.ts`](src/api/client.ts). Set `EXPO_PUBLIC_API_URL` (for example in `.env`) and the app switches from mock data to HTTP calls:

```bash
EXPO_PUBLIC_API_URL=https://api.yourschool.edu/parent-app
```

[`docs/API.md`](docs/API.md) describes the REST endpoints the backend needs to implement.

## Marketing website and sign-up

[`website/`](website) is a separate Next.js project: home page, pricing (Free / Basic / Enterprise, monthly or yearly), and a sign-up and checkout flow.

**Edit [`website/src/config/site.ts`](website/src/config/site.ts) to change:**
- plan names, prices, student limits and features, plus the comparison table and FAQ
- the sales, billing and support email addresses (they're `example.com` placeholders now)
- **bank transfer details** (sample values for now; set `isSample: false` once they're real)
- currency (`USD` by default)

**How payment works today:** the customer picks a plan and fills in their school details. They then get an order reference like `SC-260924-AB12`, your bank details, and an "Email payment slip" button that opens their email app with the order already filled in. You verify the transfer and set up the school.

**To collect orders automatically:** set `NEXT_PUBLIC_ORDER_WEBHOOK_URL` to an endpoint that accepts the order as JSON, such as a Google Apps Script, a Zapier/Make webhook or your own API. Until then, nothing is stored on a server: you receive an order only when the customer sends the email.

**Adding card payments later:** add the provider's checkout in [`website/src/lib/payments.ts`](website/src/lib/payments.ts) and mark the `card` method `available: true`.

```bash
cd website
npm install
npm run dev      # http://localhost:3000
```

## Project layout

```
src/
  app/                  screens (Expo Router: each file is a route)
    sign-in.tsx
    (tabs)/             Home, Progress, Reports, Feedback, Account
    report/[id].tsx     report card + feedback on the report
    feedback/new.tsx    complaint / suggestion / appreciation form
    feedback/[id].tsx   conversation with the school
  api/                  types, API client, demo data
  components/           shared UI
  context/              auth session and selected child
  hooks/ utils/ constants/
```

## Development

```bash
npm run lint
npm run typecheck
```

CI runs both on every push, and also bundles the JavaScript for Android and iOS.
