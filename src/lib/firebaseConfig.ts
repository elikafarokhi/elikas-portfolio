// Reads Firebase settings from Vite env vars. Kept free of Firebase imports so
// the public bundle can check `isFirebaseConfigured` without loading the SDK.

const env = import.meta.env;

export const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  appId: env.VITE_FIREBASE_APP_ID,
};

/** UID of the only account allowed into /admin. Must match the UID in firestore.rules. */
export const ADMIN_UID: string | undefined = env.VITE_FIREBASE_ADMIN_UID || undefined;

export const isFirebaseConfigured = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId);
