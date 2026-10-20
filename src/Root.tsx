import { Suspense, lazy } from "react";
import App from "./App.tsx";
import { isFirebaseConfigured } from "./lib/firebaseConfig.ts";

// /admin is a hidden, lazily loaded route so its code and Firebase Auth never
// reach regular visitors.
const Admin = lazy(() => import("./admin/Admin.tsx"));

export default function Root() {
  if (!/^\/admin\/?$/.test(window.location.pathname)) return <App />;
  if (!isFirebaseConfigured) {
    return (
      <p className="p-8 font-mono text-sm text-ink">
        Firebase isn't configured. Add the VITE_FIREBASE_* variables (see .env.example) and restart.
      </p>
    );
  }
  return (
    <Suspense fallback={null}>
      <Admin />
    </Suspense>
  );
}
