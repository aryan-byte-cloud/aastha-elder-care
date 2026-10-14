# Aastha — Community-Powered Elder Care

Aastha is a prototype for coordinating senior care in India. It helps care homes and NGOs manage residents and care updates, lets family members follow a loved one's welfare, and enables vetted volunteers to respond to community-care needs.

> **Prototype notice:** this repository is intended for a hackathon demonstration. It is not a medical device or an emergency-response service. Do not use it to make clinical decisions or replace local emergency services.

## What it demonstrates

- Role-aware experiences for care-home administrators, families, volunteers, and platform administrators.
- Resident welfare records, care logs, medication-related updates, and emergency alerts.
- Volunteer onboarding and verification status.
- Firebase Authentication and Firestore-based, role-aware client flows.
- Firestore security rules with automated authorization test cases.
- Prisma and SQLite sample data for the server-side prototype data model.

## Technology

| Area | Tools |
| --- | --- |
| Web app | Next.js 16, React 19, TypeScript |
| Styling | Tailwind CSS 4 |
| Client authentication and real-time data | Firebase Authentication and Cloud Firestore |
| Server-side prototype data | Prisma ORM and SQLite |
| Security-rule tests | Firebase Local Emulator Suite and Node's test runner |

## Quick start

### Prerequisites

- Node.js 20 or newer
- npm 10 or newer
- A Firebase project with **Email/Password** authentication enabled and a Firestore database created
- Java 11 or newer, only for the Firestore Emulator Suite used by `npm run test:rules`

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

Copy the example file and replace the Firebase placeholders with the values from your Firebase project's web-app configuration. Never commit `.env.local`.

```bash
cp .env.example .env.local
```

Required variables:

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | Prisma SQLite database location. The default is `file:./dev.db`. |
| `AUTH_SECRET` | Random server secret reserved for the NextAuth credentials prototype. |
| `NEXTAUTH_URL` | Local app URL, normally `http://localhost:3000`. |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase web-app API key. |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase Authentication domain. |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase project ID. |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Firebase Storage bucket name. |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Firebase web-app sender ID. |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Firebase web-app ID. |
| `NEXT_PUBLIC_DEMO_PASSWORD` | Optional password for the three Firebase demo accounts; omit to use the local demonstration default. |

Firebase `NEXT_PUBLIC_*` values are intentionally exposed to the browser by Firebase's web SDK. Access control must be enforced by Firebase Authentication and the checked-in Firestore rules, never by hiding these values.

### 3. Create local sample data

Generate the Prisma client, synchronize the local SQLite schema, then seed the demonstrator records:

```bash
npx prisma generate
npx prisma db push
npm run seed
```

The seed creates a care-home administrator, a family member, a verified volunteer, one resident, care logs, and an active medium-severity alert. See [Sample Data & Tests](docs/SAMPLE_DATA_AND_TESTS.md) for the non-secret example identities and scenarios.

### 4. Run the prototype

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Use the demo controls on the login page only after creating matching Firebase Authentication users and Firestore profiles in your Firebase project.

### 5. Deploy Firestore rules

Review `firestore.rules` before deploying; rules are part of the application's access-control boundary.

```bash
npx firebase login
npx firebase use --add
npx firebase deploy --only firestore:rules
```

## Quality checks

```bash
npm run lint
npm run build
npm run test:rules
```

`test:rules` starts a local Firestore emulator when one is not already configured. It checks authorization behavior such as whether unrelated families, unverified volunteers, or non-admins can access protected records.

## Project structure

```text
src/app/              Application routes and role-specific pages
src/components/       Shared UI and access-control components
src/context/          Firebase authentication and profile context
src/actions/          Server actions for the Prisma-backed prototype flows
src/lib/              Firebase and Prisma clients
prisma/               SQLite schema and deterministic sample-data seed
test/                 Firestore security-rule test suite
firestore.rules       Firestore authorization policy
docs/                 Technical design and test/sample-data documentation
```

## Documentation

- [Technical Design Document](docs/TECHNICAL_DESIGN.md) — architecture, data boundaries, roles, and security design.
- [Sample Data & Test Cases](docs/SAMPLE_DATA_AND_TESTS.md) — seed contents and test scenarios.

## Privacy and safety

- The included people, contact details, records, and credentials are demonstrator data only.
- Do not upload real health, identification, or emergency-contact information to a public demo project.
- Use separate Firebase projects and databases for development, testing, and production. Add consent, audit logging, retention controls, encryption practices, and professional security review before any real-world deployment.

## License

This project is licensed under the [MIT License](LICENSE).
