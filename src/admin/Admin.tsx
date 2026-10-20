// Hidden content editor at /admin. Loaded lazily, so none of this (or Firebase
// Auth) ships to regular visitors. The UID check here is only for the UI;
// firestore.rules is what actually blocks writes from anyone else.
import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { GoogleAuthProvider, getAuth, onAuthStateChanged, signInWithPopup, signOut, type User } from "firebase/auth";
import { collection, deleteDoc, doc, setDoc, writeBatch } from "firebase/firestore/lite";
import { CONTENT_CACHE_KEY } from "../content/useContent.ts";
import { COLLECTIONS, type CollectionName, type JobLink } from "../content/types.ts";
import { app, db, fetchCollection } from "../lib/firebase.ts";
import { ADMIN_UID } from "../lib/firebaseConfig.ts";
import { GLASS } from "../styles.ts";
import { CONFIGS, fromDraft, toDraft, type CollectionConfig, type Draft, type Field, type Raw } from "./fields.ts";

const auth = getAuth(app);

const BTN_PRIMARY =
  "rounded-full bg-ink px-5 py-2 text-sm font-medium text-paper shadow-soft transition hover:opacity-90 disabled:opacity-50";
const BTN_SECONDARY =
  "rounded-full border border-ink/25 px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-ink/10 disabled:opacity-40";
const BTN_ICON =
  "grid h-8 w-8 shrink-0 place-items-center rounded-full border border-ink/20 font-mono text-sm text-ink transition-colors hover:bg-ink/10 disabled:opacity-30 disabled:hover:bg-transparent";
const INPUT =
  "w-full rounded-xl border border-ink/20 bg-white/70 px-3 py-2 text-sm text-ink placeholder:text-ink-muted/70 dark:bg-white/5";
const LABEL = "font-mono text-[11px] font-medium uppercase tracking-widest text-ink-muted";

interface Item {
  id: string;
  data: Raw;
}

const orderOf = (d: Raw) => (typeof d.order === "number" ? d.order : Number.MAX_SAFE_INTEGER);

function clearPublicCache() {
  try {
    localStorage.removeItem(CONTENT_CACHE_KEY);
  } catch {
    /* ignore */
  }
}

function useSiteTheme() {
  useEffect(() => {
    let dark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    try {
      const saved = localStorage.getItem("theme");
      if (saved === "light" || saved === "dark") dark = saved === "dark";
    } catch {
      /* storage unavailable */
    }
    document.documentElement.classList.toggle("dark", dark);

    document.title = "Admin · Elika Farokhi";
    const robots = document.createElement("meta");
    robots.name = "robots";
    robots.content = "noindex, nofollow";
    document.head.appendChild(robots);
    return () => robots.remove();
  }, []);
}

function Shell({ children, user }: { children: ReactNode; user?: User | null }) {
  return (
    <div className="min-h-screen bg-paper bg-grid bg-[length:32px_32px] px-4 pb-20 pt-8 text-ink-soft sm:px-8">
      <div className="mx-auto max-w-4xl">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-ink font-mono text-sm font-medium text-paper">EF</span>
            <h1 className="font-mono text-xl font-medium tracking-wide text-ink">Content admin</h1>
          </div>
          <div className="flex items-center gap-2">
            <a href="/" className={BTN_SECONDARY}>
              View site
            </a>
            {user && (
              <button type="button" onClick={() => signOut(auth)} className={BTN_SECONDARY}>
                Sign out
              </button>
            )}
          </div>
        </header>
        <div className="mt-8">{children}</div>
      </div>
    </div>
  );
}

function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-2xl p-5 sm:p-6 ${GLASS} ${className}`}>{children}</div>;
}

export default function Admin() {
  useSiteTheme();
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => onAuthStateChanged(auth, setUser), []);

  const signIn = async () => {
    setAuthError(null);
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
    } catch (err) {
      const code = (err as { code?: string }).code ?? "";
      if (code === "auth/popup-closed-by-user" || code === "auth/cancelled-popup-request") return;
      setAuthError(
        code === "auth/unauthorized-domain"
          ? `This domain isn't authorized for sign-in. Add "${window.location.hostname}" under Authentication → Settings → Authorized domains in the Firebase console.`
          : `Sign-in failed (${code || "unknown error"}).`
      );
    }
  };

  if (user === undefined) {
    return (
      <Shell>
        <p className="font-mono text-sm text-ink-muted">Loading…</p>
      </Shell>
    );
  }

  if (!user) {
    return (
      <Shell>
        <Card className="max-w-md">
          <p className="text-ink">Sign in to edit the site's content.</p>
          <button type="button" onClick={signIn} className={`mt-5 ${BTN_PRIMARY}`}>
            Sign in with Google
          </button>
          {authError && <p className="mt-4 text-sm text-red-700 dark:text-red-300">{authError}</p>}
        </Card>
      </Shell>
    );
  }

  if (!ADMIN_UID || user.uid !== ADMIN_UID) {
    return (
      <Shell user={user}>
        <Card className="max-w-xl">
          <p className="text-ink">
            {ADMIN_UID ? "This account isn't allowed to edit the site." : "No admin account is configured yet."}
          </p>
          <p className="mt-3 text-sm">
            Signed in as {user.email}. If this is your account, set <code className="font-mono">VITE_FIREBASE_ADMIN_UID</code>{" "}
            and the UID in <code className="font-mono">firestore.rules</code> to:
          </p>
          <p className="mt-3 select-all break-all rounded-xl border border-ink/20 bg-white/70 px-3 py-2 font-mono text-sm text-ink dark:bg-white/5">
            {user.uid}
          </p>
        </Card>
      </Shell>
    );
  }

  return (
    <Shell user={user}>
      <Editor />
    </Shell>
  );
}

function Editor() {
  const [tab, setTab] = useState<CollectionName>("experience");
  const config = CONFIGS[tab];

  return (
    <>
      <nav aria-label="Collections" className={`inline-flex flex-wrap gap-1 rounded-full p-1.5 ${GLASS}`}>
        {COLLECTIONS.map((name) => (
          <button
            key={name}
            type="button"
            aria-current={tab === name ? "true" : undefined}
            onClick={() => setTab(name)}
            className={`rounded-full px-3.5 py-2 font-mono text-[13px] font-medium tracking-wide transition-colors ${
              tab === name ? "bg-ink text-paper" : "text-ink hover:bg-ink/10"
            }`}
          >
            {CONFIGS[name].label}
          </button>
        ))}
      </nav>
      <CollectionEditor key={tab} config={config} />
    </>
  );
}

function CollectionEditor({ config }: { config: CollectionConfig }) {
  const [items, setItems] = useState<Item[] | null>(null);
  const [editing, setEditing] = useState<{ id: string | null; draft: Draft } | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ kind: "error" | "ok"; text: string } | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const reload = () => setReloadKey((k) => k + 1);

  useEffect(() => {
    let cancelled = false;
    fetchCollection(config.name)
      .then((docs) => {
        if (cancelled) return;
        setItems(
          docs
            .map((d) => ({ id: d.id, data: (d.data ?? {}) as Raw }))
            .sort((a, b) => orderOf(a.data) - orderOf(b.data))
        );
      })
      .catch((err: Error) => {
        if (cancelled) return;
        setItems([]);
        setMessage({ kind: "error", text: `Couldn't load ${config.label.toLowerCase()}: ${err.message}` });
      });
    return () => {
      cancelled = true;
    };
  }, [config, reloadKey]);

  const run = async (action: () => Promise<void>, ok: string) => {
    setBusy(true);
    setMessage(null);
    try {
      await action();
      clearPublicCache();
      setMessage({ kind: "ok", text: ok });
    } catch (err) {
      setMessage({ kind: "error", text: (err as Error).message });
    } finally {
      setBusy(false);
      reload();
    }
  };

  const save = () => {
    if (!editing || !items) return;
    const { data, missing } = fromDraft(config, editing.draft);
    if (missing.length) {
      setMessage({ kind: "error", text: `Please fill in: ${missing.join(", ")}.` });
      return;
    }
    const existing = items.find((i) => i.id === editing.id);
    const order = existing ? orderOf(existing.data) : items.reduce((max, i) => Math.max(max, orderOf(i.data) + 1), 0);
    const ref = editing.id ? doc(db, config.name, editing.id) : doc(collection(db, config.name));
    const full = { ...data, order };
    if (!config.validate(ref.id, full)) {
      setMessage({ kind: "error", text: "Some fields aren't valid." });
      return;
    }
    return run(async () => {
      await setDoc(ref, full);
      setEditing(null);
    }, "Saved.");
  };

  const move = (index: number, delta: -1 | 1) => {
    if (!items) return;
    const next = [...items];
    [next[index], next[index + delta]] = [next[index + delta], next[index]];
    setItems(next);
    return run(async () => {
      const batch = writeBatch(db);
      next.forEach((item, i) => {
        if (item.data.order !== i) batch.update(doc(db, config.name, item.id), { order: i });
      });
      await batch.commit();
    }, "Order saved.");
  };

  const remove = (item: Item) => {
    const name = config.title(item.data) || "this entry";
    if (!window.confirm(`Delete "${name}"? This can't be undone.`)) return;
    return run(() => deleteDoc(doc(db, config.name, item.id)), "Deleted.");
  };

  return (
    <section className="mt-6 space-y-4" aria-label={config.label}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-ink-muted">
          {items ? `${items.length} ${items.length === 1 ? "entry" : "entries"}, in the order shown on the site.` : "Loading…"}
        </p>
        <button
          type="button"
          disabled={busy || !items || editing?.id === null}
          onClick={() => {
            setMessage(null);
            setEditing({ id: null, draft: toDraft(config, {}) });
          }}
          className={BTN_PRIMARY}
        >
          Add {config.singular}
        </button>
      </div>

      {message && (
        <p
          role={message.kind === "error" ? "alert" : "status"}
          className={`rounded-xl px-4 py-2.5 text-sm ${
            message.kind === "error"
              ? "border border-red-300 bg-red-50 text-red-800 dark:border-red-400/40 dark:bg-red-400/10 dark:text-red-200"
              : "border border-featured-edge bg-featured text-ink"
          }`}
        >
          {message.text}
        </p>
      )}

      {editing?.id === null && (
        <EntryForm
          config={config}
          heading={`New ${config.singular}`}
          draft={editing.draft}
          busy={busy}
          onChange={(draft) => setEditing({ id: null, draft })}
          onSave={save}
          onCancel={() => setEditing(null)}
        />
      )}

      {items?.length === 0 && (
        <Card>
          <p className="text-sm">
            This collection is empty, so the site is showing its built-in content. Run <code className="font-mono">npm run seed</code> to
            upload it, or add entries here.
          </p>
        </Card>
      )}

      <ol className="space-y-3">
        {items?.map((item, i) =>
          editing?.id === item.id ? (
            <li key={item.id}>
              <EntryForm
                config={config}
                heading={`Edit ${config.singular}`}
                draft={editing.draft}
                busy={busy}
                onChange={(draft) => setEditing({ id: item.id, draft })}
                onSave={save}
                onCancel={() => setEditing(null)}
              />
            </li>
          ) : (
            <li key={item.id} className={`flex items-center gap-3 rounded-2xl px-4 py-3 ${GLASS}`}>
              <span className="w-6 shrink-0 font-mono text-[11px] text-ink-muted">{String(i + 1).padStart(2, "0")}</span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-display font-semibold text-ink">{config.title(item.data) || "(untitled)"}</p>
                <p className="truncate text-sm text-ink-muted">{config.subtitle(item.data)}</p>
              </div>
              <div className="flex shrink-0 items-center gap-1.5">
                <button type="button" aria-label="Move up" disabled={busy || i === 0} onClick={() => move(i, -1)} className={BTN_ICON}>
                  ↑
                </button>
                <button
                  type="button"
                  aria-label="Move down"
                  disabled={busy || i === items.length - 1}
                  onClick={() => move(i, 1)}
                  className={BTN_ICON}
                >
                  ↓
                </button>
                <button
                  type="button"
                  disabled={busy || editing !== null}
                  onClick={() => {
                    setMessage(null);
                    setEditing({ id: item.id, draft: toDraft(config, item.data) });
                  }}
                  className={BTN_SECONDARY}
                >
                  Edit
                </button>
                <button
                  type="button"
                  disabled={busy || editing !== null}
                  onClick={() => remove(item)}
                  className={`${BTN_SECONDARY} hover:border-red-400 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-400/10 dark:hover:text-red-200`}
                >
                  Delete
                </button>
              </div>
            </li>
          )
        )}
      </ol>
    </section>
  );
}

function EntryForm({
  config,
  heading,
  draft,
  busy,
  onChange,
  onSave,
  onCancel,
}: {
  config: CollectionConfig;
  heading: string;
  draft: Draft;
  busy: boolean;
  onChange: (draft: Draft) => void;
  onSave: () => void;
  onCancel: () => void;
}) {
  return (
    <Card>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSave();
        }}
      >
        <h2 className="font-display text-lg font-semibold text-ink">{heading}</h2>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          {config.fields.map((f) => (
            <FieldInput key={f.key} field={f} value={draft[f.key]} onChange={(v) => onChange({ ...draft, [f.key]: v })} />
          ))}
        </div>
        <div className="mt-6 flex gap-2">
          <button type="submit" disabled={busy} className={BTN_PRIMARY}>
            {busy ? "Saving…" : "Save"}
          </button>
          <button type="button" disabled={busy} onClick={onCancel} className={BTN_SECONDARY}>
            Cancel
          </button>
        </div>
      </form>
    </Card>
  );
}

function FieldInput({ field, value, onChange }: { field: Field; value: Draft[string]; onChange: (v: Draft[string]) => void }) {
  const id = `field-${field.key}`;
  const wide = field.kind === "textarea" || field.kind === "list" || field.kind === "links";
  const label = (
    <span className={LABEL}>
      {field.label}
      {field.required && <span aria-hidden="true"> *</span>}
    </span>
  );
  const hint = field.hint && <span className="mt-1 block text-xs text-ink-muted">{field.hint}</span>;

  if (field.kind === "checkbox") {
    return (
      <label className="flex items-center gap-2.5 self-end pb-2 sm:col-span-2">
        <input type="checkbox" checked={value === true} onChange={(e) => onChange(e.target.checked)} className="h-4 w-4 accent-[rgb(var(--ink))]" />
        <span className="text-sm text-ink">{field.label}</span>
      </label>
    );
  }

  if (field.kind === "links") {
    return (
      <fieldset className="sm:col-span-2">
        <legend>{label}</legend>
        {hint}
        <LinksInput links={Array.isArray(value) ? value : []} onChange={onChange} />
      </fieldset>
    );
  }

  const str = typeof value === "string" ? value : "";
  return (
    <label htmlFor={id} className={`block ${wide ? "sm:col-span-2" : ""}`}>
      {label}
      <span className="mt-1.5 block">
        {field.kind === "select" ? (
          <select id={id} value={str} onChange={(e) => onChange(e.target.value)} className={INPUT}>
            {field.options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        ) : field.kind === "text" ? (
          <input id={id} type="text" value={str} required={field.required} onChange={(e) => onChange(e.target.value)} className={INPUT} />
        ) : (
          <textarea
            id={id}
            value={str}
            required={field.required}
            rows={field.kind === "list" ? 4 : 5}
            onChange={(e) => onChange(e.target.value)}
            className={`${INPUT} resize-y leading-relaxed`}
          />
        )}
      </span>
      {hint}
    </label>
  );
}

function LinksInput({ links, onChange }: { links: JobLink[]; onChange: (links: JobLink[]) => void }) {
  const update = (i: number, patch: Partial<JobLink>) => onChange(links.map((l, j) => (j === i ? { ...l, ...patch } : l)));
  return (
    <div className="mt-2 space-y-3">
      {links.map((l, i) => (
        <div key={i} className="grid gap-2 rounded-xl border border-ink/15 p-3 sm:grid-cols-[1fr_1.4fr_auto]">
          <input aria-label="Link label" placeholder="Label, e.g. Read the paper" value={l.label} onChange={(e) => update(i, { label: e.target.value })} className={INPUT} />
          <input aria-label="Link URL" placeholder="https://…" value={l.href} onChange={(e) => update(i, { href: e.target.value })} className={INPUT} />
          <button type="button" aria-label="Remove link" onClick={() => onChange(links.filter((_, j) => j !== i))} className={`${BTN_ICON} self-center`}>
            ×
          </button>
          <input
            aria-label="Screen reader label"
            placeholder="Screen reader label (optional)"
            value={l.ariaLabel}
            onChange={(e) => update(i, { ariaLabel: e.target.value })}
            className={`${INPUT} sm:col-span-2`}
          />
        </div>
      ))}
      <button type="button" onClick={() => onChange([...links, { label: "", href: "", ariaLabel: "" }])} className={BTN_SECONDARY}>
        Add link
      </button>
    </div>
  );
}
