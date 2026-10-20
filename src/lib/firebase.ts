// Firebase app + Firestore. Only ever loaded via dynamic import() so the SDK
// stays out of the initial page bundle. Uses Firestore Lite (REST, no realtime
// listeners or offline cache), which is all a read-mostly portfolio needs.
import { getApp, getApps, initializeApp } from "firebase/app";
import { collection, getDocs, getFirestore } from "firebase/firestore/lite";
import type { CollectionName } from "../content/types.ts";
import { firebaseConfig } from "./firebaseConfig.ts";

export const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const db = getFirestore(app);

export async function fetchCollection(name: CollectionName) {
  const snap = await getDocs(collection(db, name));
  return snap.docs.map((d) => ({ id: d.id, data: d.data() as unknown }));
}
