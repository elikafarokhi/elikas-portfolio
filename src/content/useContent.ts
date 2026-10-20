import { useEffect, useState } from "react";
import { isFirebaseConfigured } from "../lib/firebaseConfig.ts";
import { DEFAULT_CONTENT } from "./defaults.ts";
import { parseCachedContent, parseCollection } from "./parse.ts";
import { COLLECTIONS, type SiteContent } from "./types.ts";

// Bump the version if the content shape changes, so old caches are ignored.
export const CONTENT_CACHE_KEY = "site-content-v1";
const FETCH_TIMEOUT_MS = 8000;

function readCache(): SiteContent | null {
  try {
    const raw = localStorage.getItem(CONTENT_CACHE_KEY);
    return raw ? parseCachedContent(JSON.parse(raw)) : null;
  } catch {
    return null;
  }
}

function writeCache(content: SiteContent) {
  try {
    localStorage.setItem(CONTENT_CACHE_KEY, JSON.stringify(content));
  } catch {
    /* storage unavailable or full */
  }
}

async function fetchContent(): Promise<SiteContent> {
  const { fetchCollection } = await import("../lib/firebase.ts");
  const entries = await Promise.all(
    COLLECTIONS.map(async (name) => {
      const parsed = parseCollection(name, await fetchCollection(name));
      // An empty collection most likely means it hasn't been seeded yet,
      // so keep the built-in content rather than blanking the section.
      return [name, parsed.length ? parsed : DEFAULT_CONTENT[name]] as const;
    })
  );
  return Object.fromEntries(entries) as unknown as SiteContent;
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = window.setTimeout(() => reject(new Error("timed out")), ms);
    promise.then(
      (v) => {
        window.clearTimeout(timer);
        resolve(v);
      },
      (e) => {
        window.clearTimeout(timer);
        reject(e);
      }
    );
  });
}

/**
 * Stale-while-revalidate content: renders the cached (or built-in) content
 * immediately, then swaps in fresh Firestore data when it arrives. Any failure
 * leaves whatever is already on screen.
 */
export function useContent(): SiteContent {
  const [content, setContent] = useState<SiteContent>(() => readCache() ?? DEFAULT_CONTENT);

  useEffect(() => {
    if (!isFirebaseConfigured) return;
    let cancelled = false;
    withTimeout(fetchContent(), FETCH_TIMEOUT_MS)
      .then((fresh) => {
        if (cancelled) return;
        setContent(fresh);
        writeCache(fresh);
      })
      .catch((err) => {
        if (import.meta.env.DEV) console.warn("Using fallback content:", err);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return content;
}
