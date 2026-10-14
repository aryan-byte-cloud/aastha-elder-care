import { initializeTestEnvironment, assertFails, assertSucceeds } from '@firebase/rules-unit-testing';
import { doc, getDoc, updateDoc, setDoc, Timestamp } from 'firebase/firestore';
import fs from 'node:fs';
import path from 'node:path';
import test, { describe, before, after, beforeEach } from 'node:test';

const PROJECT_ID = 'elder-care-security-test';
let testEnv;

describe('Elder Care Firestore Security Rules Test Suite (30 Cases)', () => {
  before(async () => {
    const rulesPath = path.resolve(process.cwd(), 'firestore.rules');
    const rules = fs.readFileSync(rulesPath, 'utf8');

    const host = process.env.FIRESTORE_EMULATOR_HOST?.split(':')[0] || '127.0.0.1';
    const port = parseInt(process.env.FIRESTORE_EMULATOR_HOST?.split(':')[1] || '8080', 10);

    testEnv = await initializeTestEnvironment({
      projectId: PROJECT_ID,
      firestore: {
        rules,
        host,
        port,
      },
    });
  });

  after(async () => {
    if (testEnv) {
      await testEnv.cleanup();
    }
  });

  beforeEach(async () => {
    if (testEnv) {
      await testEnv.clearFirestore();

      // Seed common baseline data via admin context
      await testEnv.withSecurityRulesDisabled(async (context) => {
        const adminDb = context.firestore();

        // 1. Approved Organization
        await setDoc(doc(adminDb, 'organizations', 'approved_org'), {
          name: 'Sukoon Home',
          status: 'approved',
          submittedBy: 'admin_uid',
          phone: '+91 90000 00000',
        });

        // 2. Pending Organization
        await setDoc(doc(adminDb, 'organizations', 'pending_org'), {
          name: 'Pending Home',
          status: 'pending',
          submittedBy: 'pending_admin_uid',
          phone: '+91 90000 00000',
        });

        // 3. Foreign Organization
        await setDoc(doc(adminDb, 'organizations', 'other_org'), {
          name: 'Other Home',
          status: 'approved',
          submittedBy: 'other_admin_uid',
          phone: '+91 90000 00000',
        });

        // 4. Users
        await setDoc(doc(adminDb, 'users', 'admin_uid'), {
          role: 'admin',
          orgId: 'approved_org',
          name: 'Approved Admin',
        });

        await setDoc(doc(adminDb, 'users', 'pending_admin_uid'), {
          role: 'admin',
          orgId: 'pending_org',
          name: 'Pending Admin',
        });

        await setDoc(doc(adminDb, 'users', 'volunteer_verified_uid'), {
          role: 'volunteer',
          orgId: 'approved_org',
          verified: true,
          name: 'Volunteer A',
        });

        await setDoc(doc(adminDb, 'users', 'volunteer_unverified_uid'), {
          role: 'volunteer',
          orgId: 'approved_org',
          verified: false,
          name: 'Unverified Volunteer',
        });

        await setDoc(doc(adminDb, 'users', 'other_volunteer_uid'), {
          role: 'volunteer',
          orgId: 'approved_org',
          verified: true,
          name: 'Volunteer B',
        });

        await setDoc(doc(adminDb, 'users', 'family_linked_uid'), {
          role: 'family',
          name: 'Linked Family',
        });

        await setDoc(doc(adminDb, 'users', 'family_unlinked_uid'), {
          role: 'family',
          name: 'Unlinked Family',
        });

        // 5. Residents
        await setDoc(doc(adminDb, 'residents', 'res_1'), {
          name: 'Kamla Deshmukh',
          orgId: 'approved_org',
          familyUserIds: ['family_linked_uid'],
          status: 'stable',
        });

        await setDoc(doc(adminDb, 'residents', 'res_other'), {
          name: 'Foreign Resident',
          orgId: 'other_org',
          familyUserIds: [],
          status: 'stable',
        });

        // 6. Alert baseline for approved_org
        await setDoc(doc(adminDb, 'alerts', 'baseline_alert'), {
          orgId: 'approved_org',
          residentId: 'res_1',
          type: 'sos',
          status: 'open',
          timeline: [{ step: 'SOS raised', by: 'Admin', at: '10:00 AM' }],
          createdAt: Timestamp.now(),
        });
      });
    }
  });

  // ==========================================
  // PART 1: 8 BASELINE RULES TEST CASES
  // ==========================================

  test('Case 1: Unauthenticated read/write to users -> DENIED, approved orgs -> ALLOWED', async () => {
    const unauthDb = testEnv.unauthenticatedContext().firestore();
    await assertFails(getDoc(doc(unauthDb, 'users', 'admin_uid')));
    await assertSucceeds(getDoc(doc(unauthDb, 'organizations', 'approved_org')));
    await assertFails(getDoc(doc(unauthDb, 'organizations', 'pending_org')));
  });

  test('Case 2: User cannot alter their own role, orgId, or verified field -> DENIED', async () => {
    const volDb = testEnv.authenticatedContext('volunteer_verified_uid').firestore();
    await assertFails(updateDoc(doc(volDb, 'users', 'volunteer_verified_uid'), { role: 'admin' }));
    await assertFails(updateDoc(doc(volDb, 'users', 'volunteer_verified_uid'), { orgId: 'other_org' }));
    await assertFails(updateDoc(doc(volDb, 'users', 'volunteer_unverified_uid'), { verified: true }));
    // Updating name or phone without touching role/orgId/verified is ALLOWED
    await assertSucceeds(updateDoc(doc(volDb, 'users', 'volunteer_verified_uid'), { phone: '+91 90000 11111' }));
  });

  test('Case 3: Org admin reads residents in own approved org -> ALLOWED', async () => {
    const adminDb = testEnv.authenticatedContext('admin_uid').firestore();
    await assertSucceeds(getDoc(doc(adminDb, 'residents', 'res_1')));
    await assertSucceeds(getDoc(doc(adminDb, 'alerts', 'baseline_alert')));
  });

  test('Case 4: Org admin reads residents in another org -> DENIED', async () => {
    const adminDb = testEnv.authenticatedContext('admin_uid').firestore();
    await assertFails(getDoc(doc(adminDb, 'residents', 'res_other')));
  });

  test('Case 5: Verified volunteer reads alerts in own approved org -> ALLOWED', async () => {
    const volDb = testEnv.authenticatedContext('volunteer_verified_uid').firestore();
    await assertSucceeds(getDoc(doc(volDb, 'alerts', 'baseline_alert')));
  });

  test('Case 6: Unverified volunteer reads alerts -> DENIED', async () => {
    const volDb = testEnv.authenticatedContext('volunteer_unverified_uid').firestore();
    await assertFails(getDoc(doc(volDb, 'alerts', 'baseline_alert')));
  });

  test('Case 7: Linked family reads resident data -> ALLOWED', async () => {
    const famDb = testEnv.authenticatedContext('family_linked_uid').firestore();
    await assertSucceeds(getDoc(doc(famDb, 'residents', 'res_1')));
  });

  test('Case 8: Non-linked family reads resident data -> DENIED', async () => {
    const famDb = testEnv.authenticatedContext('family_unlinked_uid').firestore();
    await assertFails(getDoc(doc(famDb, 'residents', 'res_1')));
  });

  // ==========================================
  // PART 2: 5 PREVIOUS ESCALATION TEST CASES
  // ==========================================

  test('Case 9 (a): Volunteer escalates at 30s -> DENIED', async () => {
    await testEnv.withSecurityRulesDisabled(async (context) => {
      const db = context.firestore();
      await setDoc(doc(db, 'alerts', 'alert_at_30s'), {
        orgId: 'approved_org',
        residentId: 'res_1',
        type: 'sos',
        status: 'open',
        timeline: [{ step: 'SOS raised', by: 'Staff', at: '10:00 AM' }],
        createdAt: Timestamp.fromMillis(Date.now() - 30000), // 30s old (< 60s)
      });
    });

    const volDb = testEnv.authenticatedContext('volunteer_verified_uid').firestore();
    await assertFails(
      updateDoc(doc(volDb, 'alerts', 'alert_at_30s'), {
        status: 'escalated',
        timeline: [
          { step: 'SOS raised', by: 'Staff', at: '10:00 AM' },
          { step: 'Escalated (108 call required)', by: 'Automated Escalation System', at: '10:00:30 AM' },
        ],
      })
    );
  });

  test('Case 10 (b): Volunteer escalates at 61s -> ALLOWED', async () => {
    await testEnv.withSecurityRulesDisabled(async (context) => {
      const db = context.firestore();
      await setDoc(doc(db, 'alerts', 'alert_at_65s'), {
        orgId: 'approved_org',
        residentId: 'res_1',
        type: 'sos',
        status: 'open',
        timeline: [{ step: 'SOS raised', by: 'Staff', at: '10:00 AM' }],
        createdAt: Timestamp.fromMillis(Date.now() - 65000), // 65s old (> 60s)
      });
    });

    const volDb = testEnv.authenticatedContext('volunteer_verified_uid').firestore();
    await assertSucceeds(
      updateDoc(doc(volDb, 'alerts', 'alert_at_65s'), {
        status: 'escalated',
        timeline: [
          { step: 'SOS raised', by: 'Staff', at: '10:00 AM' },
          { step: 'Escalated (108 call required)', by: 'Automated Escalation System', at: '10:01:05 AM' },
        ],
      })
    );
  });

  test('Case 11 (c): Volunteer escalates an accepted alert -> DENIED', async () => {
    await testEnv.withSecurityRulesDisabled(async (context) => {
      const db = context.firestore();
      await setDoc(doc(db, 'alerts', 'alert_accepted'), {
        orgId: 'approved_org',
        residentId: 'res_1',
        type: 'sos',
        status: 'accepted',
        acceptedBy: { uid: 'other_volunteer_uid', name: 'Volunteer B' },
        timeline: [
          { step: 'SOS raised', by: 'Staff', at: '10:00 AM' },
          { step: 'Accepted', by: 'Volunteer B', at: '10:00:30 AM' },
        ],
        createdAt: Timestamp.fromMillis(Date.now() - 70000),
      });
    });

    const volDb = testEnv.authenticatedContext('volunteer_verified_uid').firestore();
    await assertFails(
      updateDoc(doc(volDb, 'alerts', 'alert_accepted'), {
        status: 'escalated',
        timeline: [
          { step: 'SOS raised', by: 'Staff', at: '10:00 AM' },
          { step: 'Accepted', by: 'Volunteer B', at: '10:00:30 AM' },
          { step: 'Escalated (108 call required)', by: 'Automated Escalation System', at: '10:01:10 AM' },
        ],
      })
    );
  });

  test("Case 12 (d): Volunteer decline removing another volunteer's UID -> DENIED", async () => {
    await testEnv.withSecurityRulesDisabled(async (context) => {
      const db = context.firestore();
      await setDoc(doc(db, 'alerts', 'alert_declined'), {
        orgId: 'approved_org',
        residentId: 'res_1',
        type: 'sos',
        status: 'open',
        declinedBy: ['other_volunteer_uid'],
        timeline: [{ step: 'SOS raised', by: 'Staff', at: '10:00 AM' }],
        createdAt: Timestamp.now(),
      });
    });

    const volDb = testEnv.authenticatedContext('volunteer_verified_uid').firestore();
    // Replacing array and dropping other_volunteer_uid -> DENIED
    await assertFails(
      updateDoc(doc(volDb, 'alerts', 'alert_declined'), {
        declinedBy: ['volunteer_verified_uid'],
      })
    );

    // Appending own UID keeping existing UID -> ALLOWED
    await assertSucceeds(
      updateDoc(doc(volDb, 'alerts', 'alert_declined'), {
        declinedBy: ['other_volunteer_uid', 'volunteer_verified_uid'],
      })
    );
  });

  test('Case 13 (e): Pending-org admin reads own org doc -> ALLOWED', async () => {
    const pendingAdminDb = testEnv.authenticatedContext('pending_admin_uid').firestore();
    await assertSucceeds(getDoc(doc(pendingAdminDb, 'organizations', 'pending_org')));
    await assertFails(getDoc(doc(pendingAdminDb, 'organizations', 'other_org_unapproved_secret')));
  });

  // ==========================================
  // PART 3: 9 NEW CASES (CASES 14 TO 22)
  // ==========================================

  test('Case 14 (1): Pending-org admin creates a resident -> DENIED', async () => {
    const pendingAdminDb = testEnv.authenticatedContext('pending_admin_uid').firestore();
    await assertFails(
      setDoc(doc(pendingAdminDb, 'residents', 'res_pending_new'), {
        name: 'New Senior Resident',
        orgId: 'pending_org',
        status: 'stable',
        familyUserIds: [],
      })
    );
  });

  test('Case 15 (2): Approved-org admin creates a resident -> ALLOWED', async () => {
    const adminDb = testEnv.authenticatedContext('admin_uid').firestore();
    await assertSucceeds(
      setDoc(doc(adminDb, 'residents', 'res_approved_new'), {
        name: 'Approved Senior Resident',
        orgId: 'approved_org',
        status: 'stable',
        familyUserIds: [],
      })
    );
  });

  test('Case 16 (3): Volunteer B resolves an alert accepted by volunteer A -> DENIED', async () => {
    await testEnv.withSecurityRulesDisabled(async (context) => {
      const db = context.firestore();
      await setDoc(doc(db, 'alerts', 'alert_accepted_by_a'), {
        orgId: 'approved_org',
        residentId: 'res_1',
        type: 'sos',
        status: 'arrived',
        acceptedBy: { uid: 'volunteer_verified_uid', name: 'Volunteer A' },
        timeline: [
          { step: 'SOS raised', by: 'Staff', at: '10:00 AM' },
          { step: 'Accepted', by: 'Volunteer A', at: '10:01 AM' },
          { step: 'Arrived', by: 'Volunteer A', at: '10:05 AM' },
        ],
        createdAt: Timestamp.now(),
      });
    });

    const volBDb = testEnv.authenticatedContext('other_volunteer_uid').firestore();
    await assertFails(
      updateDoc(doc(volBDb, 'alerts', 'alert_accepted_by_a'), {
        status: 'resolved',
        timeline: [
          { step: 'SOS raised', by: 'Staff', at: '10:00 AM' },
          { step: 'Accepted', by: 'Volunteer A', at: '10:01 AM' },
          { step: 'Arrived', by: 'Volunteer A', at: '10:05 AM' },
          { step: 'Resolved', by: 'Volunteer B', at: '10:10 AM' },
        ],
      })
    );
  });

  test('Case 17 (4): Volunteer overwrites acceptedBy of an accepted alert -> DENIED', async () => {
    await testEnv.withSecurityRulesDisabled(async (context) => {
      const db = context.firestore();
      await setDoc(doc(db, 'alerts', 'alert_to_overwrite_accepted'), {
        orgId: 'approved_org',
        residentId: 'res_1',
        type: 'sos',
        status: 'accepted',
        acceptedBy: { uid: 'volunteer_verified_uid', name: 'Volunteer A' },
        timeline: [
          { step: 'SOS raised', by: 'Staff', at: '10:00 AM' },
          { step: 'Accepted', by: 'Volunteer A', at: '10:01 AM' },
        ],
        createdAt: Timestamp.now(),
      });
    });

    const volBDb = testEnv.authenticatedContext('other_volunteer_uid').firestore();
    await assertFails(
      updateDoc(doc(volBDb, 'alerts', 'alert_to_overwrite_accepted'), {
        acceptedBy: { uid: 'other_volunteer_uid', name: 'Volunteer B' },
      })
    );
  });

  test('Case 18 (5): Volunteer shortens the timeline -> DENIED', async () => {
    await testEnv.withSecurityRulesDisabled(async (context) => {
      const db = context.firestore();
      await setDoc(doc(db, 'alerts', 'alert_shorten_timeline'), {
        orgId: 'approved_org',
        residentId: 'res_1',
        type: 'sos',
        status: 'accepted',
        acceptedBy: { uid: 'volunteer_verified_uid', name: 'Volunteer A' },
        timeline: [
          { step: 'SOS raised', by: 'Staff', at: '10:00 AM' },
          { step: 'Accepted', by: 'Volunteer A', at: '10:01 AM' },
        ],
        createdAt: Timestamp.now(),
      });
    });

    const volADb = testEnv.authenticatedContext('volunteer_verified_uid').firestore();
    // Trying to shorten timeline to 1 element
    await assertFails(
      updateDoc(doc(volADb, 'alerts', 'alert_shorten_timeline'), {
        status: 'arrived',
        timeline: [{ step: 'Arrived', by: 'Volunteer A', at: '10:05 AM' }],
      })
    );
  });

  test('Case 19 (6): Volunteer accepts an open alert as themselves -> ALLOWED', async () => {
    const volADb = testEnv.authenticatedContext('volunteer_verified_uid').firestore();
    await assertSucceeds(
      updateDoc(doc(volADb, 'alerts', 'baseline_alert'), {
        status: 'accepted',
        acceptedBy: { uid: 'volunteer_verified_uid', name: 'Volunteer A' },
        timeline: [
          { step: 'SOS raised', by: 'Admin', at: '10:00 AM' },
          { step: 'Accepted', by: 'Volunteer A', at: '10:02 AM' },
        ],
      })
    );
  });

  test('Case 20 (7): Accepting volunteer marks arrived, then resolved -> ALLOWED', async () => {
    await testEnv.withSecurityRulesDisabled(async (context) => {
      const db = context.firestore();
      await setDoc(doc(db, 'alerts', 'alert_full_flow'), {
        orgId: 'approved_org',
        residentId: 'res_1',
        type: 'sos',
        status: 'accepted',
        acceptedBy: { uid: 'volunteer_verified_uid', name: 'Volunteer A' },
        timeline: [
          { step: 'SOS raised', by: 'Admin', at: '10:00 AM' },
          { step: 'Accepted', by: 'Volunteer A', at: '10:02 AM' },
        ],
        createdAt: Timestamp.now(),
      });
    });

    const volADb = testEnv.authenticatedContext('volunteer_verified_uid').firestore();

    // 1. Mark Arrived -> ALLOWED
    await assertSucceeds(
      updateDoc(doc(volADb, 'alerts', 'alert_full_flow'), {
        status: 'arrived',
        timeline: [
          { step: 'SOS raised', by: 'Admin', at: '10:00 AM' },
          { step: 'Accepted', by: 'Volunteer A', at: '10:02 AM' },
          { step: 'Arrived on scene', by: 'Volunteer A', at: '10:07 AM' },
        ],
      })
    );

    // 2. Mark Resolved -> ALLOWED
    await assertSucceeds(
      updateDoc(doc(volADb, 'alerts', 'alert_full_flow'), {
        status: 'resolved',
        timeline: [
          { step: 'SOS raised', by: 'Admin', at: '10:00 AM' },
          { step: 'Accepted', by: 'Volunteer A', at: '10:02 AM' },
          { step: 'Arrived on scene', by: 'Volunteer A', at: '10:07 AM' },
          { step: 'Resolved – Senior safe and resting comfortably.', by: 'Volunteer A', at: '10:15 AM' },
        ],
      })
    );
  });

  test("Case 21 (8): Volunteer sets status 'resolved' directly from 'open' -> DENIED", async () => {
    const volADb = testEnv.authenticatedContext('volunteer_verified_uid').firestore();
    await assertFails(
      updateDoc(doc(volADb, 'alerts', 'baseline_alert'), {
        status: 'resolved',
        acceptedBy: { uid: 'volunteer_verified_uid', name: 'Volunteer A' },
        timeline: [
          { step: 'SOS raised', by: 'Admin', at: '10:00 AM' },
          { step: 'Resolved directly', by: 'Volunteer A', at: '10:02 AM' },
        ],
      })
    );
  });

  test('Case 22 (9): Volunteer escalates at 61s with a timeline that grows by 2 entries -> DENIED', async () => {
    await testEnv.withSecurityRulesDisabled(async (context) => {
      const db = context.firestore();
      await setDoc(doc(db, 'alerts', 'alert_two_entry_escalate'), {
        orgId: 'approved_org',
        residentId: 'res_1',
        type: 'sos',
        status: 'open',
        timeline: [{ step: 'SOS raised', by: 'Staff', at: '10:00 AM' }],
        createdAt: Timestamp.fromMillis(Date.now() - 65000), // 65s old (> 60s)
      });
    });

    const volDb = testEnv.authenticatedContext('volunteer_verified_uid').firestore();
    // Growing timeline by 2 entries instead of exactly 1 entry
    await assertFails(
      updateDoc(doc(volDb, 'alerts', 'alert_two_entry_escalate'), {
        status: 'escalated',
        timeline: [
          { step: 'SOS raised', by: 'Staff', at: '10:00 AM' },
          { step: 'Intermediate step', by: 'Staff', at: '10:01:00 AM' },
          { step: 'Escalated (108 call required)', by: 'Automated Escalation System', at: '10:01:05 AM' },
        ],
      })
    );
  });

  test('Case 23: Family creates profile without orgId -> ALLOWED', async () => {
    const familyDb = testEnv.authenticatedContext('new_family_uid').firestore();
    await assertSucceeds(
      setDoc(doc(familyDb, 'users', 'new_family_uid'), {
        name: 'New Family Member',
        role: 'family',
        email: 'newfamily@example.com',
      })
    );
  });

  test("Case 24: Family creates profile with orgId 'sukoon-home' -> DENIED", async () => {
    const familyDb = testEnv.authenticatedContext('new_family_uid_2').firestore();
    await assertFails(
      setDoc(doc(familyDb, 'users', 'new_family_uid_2'), {
        name: 'New Family Member With Org',
        role: 'family',
        orgId: 'sukoon-home',
        email: 'newfamily2@example.com',
      })
    );
  });

  test('Case 25: Org admin reads family user doc without orgId -> DENIED', async () => {
    await testEnv.withSecurityRulesDisabled(async (context) => {
      const db = context.firestore();
      await setDoc(doc(db, 'users', 'family_no_org_uid'), {
        name: 'Family Member Without Org',
        role: 'family',
        email: 'familynoorg@example.com',
      });
    });

    const adminDb = testEnv.authenticatedContext('admin_uid').firestore();
    await assertFails(
      getDoc(doc(adminDb, 'users', 'family_no_org_uid'))
    );
  });

  test('Case 26: Family creates profile with orgId null -> ALLOWED', async () => {
    const familyDb = testEnv.authenticatedContext('new_family_uid_3').firestore();
    await assertSucceeds(
      setDoc(doc(familyDb, 'users', 'new_family_uid_3'), {
        name: 'New Family Member With Null Org',
        role: 'family',
        orgId: null,
        email: 'newfamily3@example.com',
      })
    );
  });

  test('Case 27 (Control): Org admin reads volunteer user doc in their own approved org -> ALLOWED', async () => {
    const adminDb = testEnv.authenticatedContext('admin_uid').firestore();
    await assertSucceeds(
      getDoc(doc(adminDb, 'users', 'volunteer_verified_uid'))
    );
  });

  test('Case 28: Org admin rejects a volunteer in own org -> ALLOWED', async () => {
    const adminDb = testEnv.authenticatedContext('admin_uid').firestore();
    await assertSucceeds(
      updateDoc(doc(adminDb, 'users', 'volunteer_unverified_uid'), {
        verified: false,
        verificationStatus: 'rejected',
      })
    );
  });

  test('Case 29: Volunteer sets their own verificationStatus -> DENIED', async () => {
    const volDb = testEnv.authenticatedContext('volunteer_unverified_uid').firestore();
    await assertFails(
      updateDoc(doc(volDb, 'users', 'volunteer_unverified_uid'), {
        verificationStatus: 'verified',
      })
    );
  });

  test('Case 30: Admin of another org rejects this volunteer -> DENIED', async () => {
    const otherAdminDb = testEnv.authenticatedContext('other_admin_uid').firestore();
    await assertFails(
      updateDoc(doc(otherAdminDb, 'users', 'volunteer_unverified_uid'), {
        verified: false,
        verificationStatus: 'rejected',
      })
    );
  });
});
