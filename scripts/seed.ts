// One-time upload of the built-in content (src/content/defaults.ts) to Firestore.
//
//   GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json npm run seed
//
// Uses the Admin SDK, which bypasses security rules, so it needs a service
// account key (Firebase console → Project settings → Service accounts).
// Refuses to run if any collection already has documents; pass --force to
// overwrite documents with matching ids (other documents are left alone).
import { applicationDefault, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { DEFAULT_CONTENT } from "../src/content/defaults.ts";
import { COLLECTIONS } from "../src/content/types.ts";

const projectId = process.env.VITE_FIREBASE_PROJECT_ID;
if (!projectId) {
  console.error("Missing VITE_FIREBASE_PROJECT_ID. Add it to .env (see .env.example).");
  process.exit(1);
}
if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  console.error("Missing GOOGLE_APPLICATION_CREDENTIALS. Point it at your service account key JSON file.");
  process.exit(1);
}

const force = process.argv.includes("--force");
const db = getFirestore(initializeApp({ credential: applicationDefault(), projectId }));

const nonEmpty: string[] = [];
for (const name of COLLECTIONS) {
  const snap = await db.collection(name).limit(1).get();
  if (!snap.empty) nonEmpty.push(name);
}
if (nonEmpty.length && !force) {
  console.error(`Already has content: ${nonEmpty.join(", ")}. Nothing written. Re-run with --force to overwrite.`);
  process.exit(1);
}

const batch = db.batch();
let count = 0;
for (const name of COLLECTIONS) {
  for (const { id, ...data } of DEFAULT_CONTENT[name]) {
    // Firestore rejects `undefined`, so drop unset optional fields.
    const clean = Object.fromEntries(Object.entries(data).filter(([, v]) => v !== undefined));
    batch.set(db.collection(name).doc(id), clean);
    count++;
  }
}
await batch.commit();
console.log(`Seeded ${count} documents into ${projectId}: ${COLLECTIONS.join(", ")}.`);
