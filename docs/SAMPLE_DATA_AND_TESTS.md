# Sample Data and Test Cases

## Sample data

Run the local seed after preparing the SQLite database:

```bash
npx prisma generate
npx prisma db push
npm run seed
```

The `prisma/seed.js` script creates fictional demo records:

| Entity | Demo value |
| --- | --- |
| Care-home administrator | `admin@saathi.in` |
| Family member | `family@saathi.in` |
| Volunteer | `volunteer@saathi.in` |
| Seed password | `password123` |
| Resident | Kamla Deshmukh, 78, Room 204 |
| Care logs | Morning vitals, morning medication, veranda walk |
| Alert | Active medium-severity physiotherapy check |

These are development-only credentials and fictional profiles. Do not reuse the password or these records in a public deployment.

The browser demo uses Firebase Authentication, which is separate from the SQLite seed. To use the one-click browser demo controls, create the matching Firebase users and Firestore profile documents in a Firebase project, or sign up through the prototype UI where permitted.

## Automated Firestore security-rule tests

Run:

```bash
npm run test:rules
```

The command starts a local Firestore Emulator Suite instance when necessary and runs the policy tests in `test/rules.test.mjs`.

| Scenario | Expected result |
| --- | --- |
| Unauthenticated visitor reads a user record | Denied |
| Unauthenticated visitor reads an approved organization | Allowed |
| User changes their own role, organization, or verification flag | Denied |
| Organization admin reads a resident in their approved organization | Allowed |
| Organization admin reads a resident in another organization | Denied |
| Verified volunteer reads an alert for their own approved organization | Allowed |
| Unverified volunteer reads an alert | Denied |
| Linked family member reads their resident | Allowed |
| Unlinked family member reads that resident | Denied |
| Volunteer escalates an open alert before 60 seconds | Denied |
| Volunteer escalates an eligible open alert after 60 seconds | Allowed |
| Volunteer modifies an alert outside permitted state transitions | Denied |

The suite contains additional checks around alert acceptance, arrival, resolution, declines, organization status, and cross-organization access.

## Manual acceptance checks

Use a non-production Firebase project and fictional data.

1. Start the app with `npm run dev` and open `http://localhost:3000`.
2. Sign in as a family user linked to one resident; confirm the family page does not expose an unrelated resident.
3. Sign in as an organization administrator for an approved organization; confirm resident and alert tools are visible for that organization only.
4. Sign in as an unverified volunteer; confirm protected alert/resident content cannot be read.
5. Verify a volunteer through the authorized organization-admin flow; confirm the user can then take the allowed alert actions.
6. Create a pending organization; confirm it remains restricted until a platform administrator approves it.
7. Attempt to alter a role from browser developer tools or a direct Firestore write; confirm the Firestore rules deny it.
