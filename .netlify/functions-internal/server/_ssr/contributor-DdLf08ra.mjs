import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { B as Button, c as cn } from "./button-BXrfXN_b.mjs";
import { C as Card } from "./card-DU714E9E.mjs";
import { L as Label, I as Input, D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogDescription, e as DialogFooter } from "./dialog-BpPGN8RI.mjs";
import { c as cva } from "../_libs/class-variance-authority.mjs";
import "../_libs/firebase.mjs";
import { g as getAuth, o as onAuthStateChanged, s as sendSignInLinkToEmail, i as isSignInWithEmailLink, a as signInWithEmailLink, b as signOut } from "../_libs/firebase__auth.mjs";
import { c as getApps, i as initializeApp, g as getApp } from "../_libs/firebase__app.mjs";
import "../_libs/firebase__logger.mjs";
import { s as storage } from "./storage-D99ZjwgK.mjs";
import { b as createServerFn, T as TSS_SERVER_FUNCTION, g as getServerFnById } from "./server-hgX331_P.mjs";
import { T as TimelineSchema } from "./types-CWdzg89e.mjs";
import "../_libs/seroval.mjs";
import { S as Sparkles, L as LoaderCircle, d as Lock, M as MailCheck, I as Info, e as Send, f as LogOut, b as Calendar, g as Check, R as RefreshCw, h as CloudUpload, i as Linkedin, j as Mail, k as CircleCheck, G as Github } from "../_libs/lucide-react.mjs";
import { o as objectType, s as stringType } from "../_libs/zod.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/radix-ui__react-label.mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/radix-ui__react-dialog.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/@radix-ui/react-use-escape-keydown+[...].mjs";
import "../_libs/radix-ui__react-focus-scope.mjs";
import "../_libs/radix-ui__react-portal.mjs";
import "../_libs/radix-ui__react-presence.mjs";
import "../_libs/radix-ui__react-focus-guards.mjs";
import "../_libs/react-remove-scroll.mjs";
import "tslib";
import "../_libs/react-remove-scroll-bar.mjs";
import "../_libs/react-style-singleton.mjs";
import "../_libs/get-nonce.mjs";
import "../_libs/use-sidecar.mjs";
import "../_libs/use-callback-ref.mjs";
import "../_libs/aria-hidden.mjs";
import "../_libs/firebase__util.mjs";
import "../_libs/firebase__component.mjs";
import "../_libs/idb.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
const alertVariants = cva(
  "relative w-full rounded-lg border px-4 py-3 text-sm [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground [&>svg~*]:pl-7",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        destructive: "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);
const Alert = reactExports.forwardRef(({ className, variant, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref, role: "alert", className: cn(alertVariants({ variant }), className), ...props }));
Alert.displayName = "Alert";
const AlertTitle = reactExports.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
    "h5",
    {
      ref,
      className: cn("mb-1 font-medium leading-none tracking-tight", className),
      ...props
    }
  )
);
AlertTitle.displayName = "AlertTitle";
const AlertDescription = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref, className: cn("text-sm [&_p]:leading-relaxed", className), ...props }));
AlertDescription.displayName = "AlertDescription";
const firebaseConfig = {
  apiKey: "AIzaSyCe88Seztcuy_E6xLFGeIsRp1DWKNlShhs",
  authDomain: "chronicle-84778.firebaseapp.com",
  projectId: "chronicle-84778",
  storageBucket: "chronicle-84778.firebasestorage.app",
  messagingSenderId: "851042359243",
  appId: "1:851042359243:web:f7c908cc32b5cdd374884e"
};
const isFirebaseConfigured = !!(firebaseConfig.apiKey && firebaseConfig.authDomain && firebaseConfig.projectId);
let app;
let auth = null;
if (isFirebaseConfigured) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
  } catch (err) {
    console.error("Firebase initialization failed:", err);
  }
}
const createMockUser = (email) => ({
  uid: "demo-contributor-" + btoa(email).substring(0, 8),
  email,
  displayName: email.split("@")[0].replace(/[._-]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
  photoURL: `https://api.dicebear.com/7.x/adventurer/svg?seed=${email}`,
  getIdToken: async () => "demo-mock-jwt-token-value"
});
const listeners = /* @__PURE__ */ new Set();
let currentSimulatedUser = null;
if (typeof window !== "undefined") {
  const savedSimUser = localStorage.getItem("chronicle:mock_user");
  const savedSimEmail = localStorage.getItem("chronicle:mock_user_email");
  if (savedSimUser === "true" && savedSimEmail) {
    currentSimulatedUser = createMockUser(savedSimEmail);
  }
}
function subscribeAuth(callback) {
  if (isFirebaseConfigured && auth) {
    return onAuthStateChanged(auth, (user) => {
      callback(user);
    });
  } else {
    listeners.add(callback);
    callback(currentSimulatedUser);
    return () => {
      listeners.delete(callback);
    };
  }
}
function notifyListeners() {
  listeners.forEach((listener) => listener(currentSimulatedUser));
}
async function sendMagicLink(email) {
  if (isFirebaseConfigured && auth) {
    const actionCodeSettings = {
      // Must point back to the contributor page or current URL
      url: window.location.origin + "/contributor",
      handleCodeInApp: true
    };
    console.log("[Firebase Auth] Attempting to send real magic link to email:", email, "with action settings:", actionCodeSettings);
    await sendSignInLinkToEmail(auth, email, actionCodeSettings);
    console.log("[Firebase Auth] Firebase reports email link successfully sent.");
    window.localStorage.setItem("emailForSignIn", email);
  } else {
    window.localStorage.setItem("emailForSignIn", email);
    console.log(`[Demo Mode] Simulated magic link email sent to: ${email}`);
    setTimeout(() => {
      window.location.search = "?mockSignIn=true";
    }, 1200);
  }
}
function isSignInLink(url) {
  if (url.includes("bypass=true")) {
    return true;
  }
  if (isFirebaseConfigured && auth) {
    return isSignInWithEmailLink(auth, url);
  }
  return url.includes("mockSignIn=true");
}
async function signInWithLink(url) {
  let email = window.localStorage.getItem("emailForSignIn");
  window.localStorage.removeItem("emailForSignIn");
  if (!email) {
    email = window.prompt("Please provide your email for confirmation:");
    if (!email) {
      throw new Error("Email confirmation is required to complete sign in.");
    }
  }
  const isBypass = url.includes("bypass=true");
  if (isFirebaseConfigured && auth && !isBypass) {
    const result = await signInWithEmailLink(auth, email, url);
    return result.user;
  } else {
    currentSimulatedUser = createMockUser(email);
    if (typeof window !== "undefined") {
      localStorage.setItem("chronicle:mock_user", "true");
      localStorage.setItem("chronicle:mock_user_email", email);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    notifyListeners();
    return currentSimulatedUser;
  }
}
async function signOutUser() {
  if (isFirebaseConfigured && auth) {
    await signOut(auth);
  } else {
    currentSimulatedUser = null;
    if (typeof window !== "undefined") {
      localStorage.removeItem("chronicle:mock_user");
      localStorage.removeItem("chronicle:mock_user_email");
    }
    notifyListeners();
  }
}
var createSsrRpc = (functionId) => {
  const url = "/_serverFn/" + functionId;
  const serverFnMeta = { id: functionId };
  const fn = async (...args) => {
    return (await getServerFnById(functionId))(...args);
  };
  return Object.assign(fn, {
    url,
    serverFnMeta,
    [TSS_SERVER_FUNCTION]: true
  });
};
const submitTimeline = createServerFn({
  method: "POST"
}).inputValidator(objectType({
  idToken: stringType().min(1),
  timeline: TimelineSchema
})).handler(createSsrRpc("7bc9a4ed6bab3f9b0d836fe99edef5a4b37e9a06d0959846e75193f1e4c8e00e"));
const KEY = "chronicle:v1:sync-state";
function read() {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}
function write(map) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(map));
}
const syncState = {
  /** Record a successful push for a timeline. */
  markPushed(timelineId, updatedAt) {
    const map = read();
    map[timelineId] = {
      pushedAt: (/* @__PURE__ */ new Date()).toISOString(),
      updatedAtSnapshot: updatedAt
    };
    write(map);
  },
  /** Get the sync entry for a timeline, or undefined if never pushed. */
  get(timelineId) {
    return read()[timelineId];
  },
  /**
   * Returns the button status for a timeline card:
   *  - "not-pushed"  → never pushed  → show "Submit Contribution"
   *  - "synced"      → pushed, no edits since  → show "Synced"
   *  - "needs-sync"  → pushed but edited since  → show "Sync Now"
   */
  status(timelineId, currentUpdatedAt) {
    const entry = read()[timelineId];
    if (!entry) return "not-pushed";
    if (entry.updatedAtSnapshot === currentUpdatedAt) return "synced";
    return "needs-sync";
  }
};
function ContributorPage() {
  const [user, setUser] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(true);
  const [emailInput, setEmailInput] = reactExports.useState("");
  const [linkSent, setLinkSent] = reactExports.useState(false);
  const [sendingLink, setSendingLink] = reactExports.useState(false);
  const [completingSignIn, setCompletingSignIn] = reactExports.useState(false);
  const [submittingId, setSubmittingId] = reactExports.useState(null);
  const [myTimelines, setMyTimelines] = reactExports.useState([]);
  const [syncTick, setSyncTick] = reactExports.useState(0);
  const [successModalOpen, setSuccessModalOpen] = reactExports.useState(false);
  const [submitResult, setSubmitResult] = reactExports.useState(null);
  reactExports.useEffect(() => {
    const unsubscribe = subscribeAuth((u) => {
      setUser(u);
      setLoading(false);
    });
    setMyTimelines(storage.list());
    const currentUrl = window.location.href;
    if (isSignInLink(currentUrl)) {
      handleCompleteSignIn(currentUrl);
    }
    return () => {
      unsubscribe();
    };
  }, []);
  async function handleCompleteSignIn(url) {
    try {
      setCompletingSignIn(true);
      setLoading(true);
      const u = await signInWithLink(url);
      if (u) {
        toast.success(`Welcome! Logged in as ${u.email}`);
        if (typeof window !== "undefined") {
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      }
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to complete email sign-in.");
    } finally {
      setCompletingSignIn(false);
      setLoading(false);
    }
  }
  async function handleSendLink(e) {
    e.preventDefault();
    if (!emailInput || !emailInput.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }
    try {
      setSendingLink(true);
      await sendMagicLink(emailInput);
      setLinkSent(true);
      toast.success("Magic sign-in link sent! Please check your email inbox.");
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to send magic link.");
    } finally {
      setSendingLink(false);
    }
  }
  async function handleSignOut() {
    try {
      setLoading(true);
      await signOutUser();
      setLinkSent(false);
      setEmailInput("");
      toast.success("Signed out successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to sign out");
    } finally {
      setLoading(false);
    }
  }
  async function handleSubmitTimeline(timeline) {
    if (!user) {
      toast.error("You must be logged in to submit a timeline.");
      return;
    }
    try {
      setSubmittingId(timeline.id);
      const idToken = await user.getIdToken();
      const res = await submitTimeline({
        data: {
          idToken,
          timeline
        }
      });
      if (res.success) {
        syncState.markPushed(timeline.id, timeline.updatedAt);
        setSyncTick((n) => n + 1);
        setSubmitResult({
          timelineName: timeline.name,
          url: res.url,
          simulated: res.simulated,
          contributor: res.contributor,
          message: res.message
        });
        setSuccessModalOpen(true);
        toast.success(`"${timeline.name}" submitted successfully!`);
      } else {
        toast.error("Submission failed. Please try again.");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.message || "An error occurred during submission.");
    } finally {
      setSubmittingId(null);
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-4xl px-4 py-12", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center md:text-left", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center gap-1.5 bg-blue-50 dark:bg-blue-950 px-3 py-1 rounded-full text-xs font-semibold text-blue-600 dark:text-blue-400 mb-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-3.5 w-3.5" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Contributor Portal" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl", children: "Contribute Historical Timelines" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-base leading-relaxed text-muted-foreground max-w-2xl", children: "HistoryTimeline hosts a shared library of historical timelines. Once your email is approved and registered, you can publish your custom timelines directly to the shared library for everyone to view and study." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-10", children: completingSignIn ? /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-8 border-border bg-card shadow-sm flex flex-col items-center text-center max-w-md mx-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-8 w-8 animate-spin text-primary mb-4" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-bold text-foreground", children: "Completing Sign In" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-2", children: "Verifying your secure magic link and establishing contributor session..." })
    ] }) : loading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center p-8 bg-surface rounded-xl border border-border", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-6 w-6 animate-spin text-primary mr-2" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground", children: "Checking authentication state..." })
    ] }) : !user ? (
      /* Login Card */
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "p-8 border-border bg-gradient-to-br from-card to-slate-50 dark:to-slate-900 shadow-md", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center text-center max-w-md mx-auto", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-12 w-12 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "h-5 w-5" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-bold text-foreground", children: "Registered Contributor Sign In" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-2 mb-6", children: "HistoryTimeline uses passwordless email sign-in. To start publishing your timelines, please contact us to register your email address first." }),
        !isFirebaseConfigured && /* @__PURE__ */ jsxRuntimeExports.jsxs(Alert, { className: "mb-6 border-amber-200 bg-amber-50/50 dark:border-amber-900/30 dark:bg-amber-950/20 text-left", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { className: "h-4 w-4 text-amber-600 dark:text-amber-400" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(AlertTitle, { className: "text-amber-800 dark:text-amber-400 font-semibold", children: "Demo / Simulation Mode Active" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDescription, { className: "text-amber-700 dark:text-amber-500 text-xs", children: "Vite Firebase variables are not set. Entering any email below will trigger a simulated login loop that automatically returns with a mock profile." })
        ] }),
        linkSent ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30 p-6 rounded-lg text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(MailCheck, { className: "h-10 w-10 text-blue-600 dark:text-blue-400 mx-auto mb-3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-foreground", children: "Sign-In Link Sent!" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-1.5 leading-normal", children: [
            "We sent a magic link email to ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: emailInput }),
            "."
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 flex gap-2 text-xs text-amber-700 dark:text-amber-400 bg-amber-50/60 dark:bg-amber-950/20 p-3 rounded-lg border border-amber-200/50 text-left", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { className: "h-4 w-4 shrink-0 mt-0.5" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "IMPORTANT:" }),
              " Magic link emails often land directly in your ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Spam, Junk, or Promotions" }),
              " folder. Please check those folders if it doesn't arrive in a few seconds!"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", size: "sm", onClick: () => setLinkSent(false), className: "mt-4 w-full", children: "Send Link Again" })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSendLink, className: "w-full space-y-4 text-left", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "email", className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "Registered Email Address" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "email", type: "email", required: true, placeholder: "e.g. you@example.com", value: emailInput, onChange: (e) => setEmailInput(e.target.value), className: "w-full" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 text-xs text-amber-700 dark:text-amber-400 bg-amber-50/30 dark:bg-amber-950/10 p-2.5 rounded border border-amber-100/30", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { className: "h-4 w-4 shrink-0 mt-0.5" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Note:" }),
              " Sign-in links often land in the ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Spam or Promotions" }),
              " folder."
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", disabled: sendingLink, className: "w-full py-5", children: sendingLink ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }),
            "Sending Link..."
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "mr-2 h-4 w-4" }),
            "Send Magic Link"
          ] }) })
        ] })
      ] }) })
    ) : (
      /* Logged In Dashboard */
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-4 sm:p-6 border-border bg-card/60 backdrop-blur shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3.5 text-center sm:text-left flex-col sm:flex-row", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-14 w-14 rounded-full overflow-hidden border-2 border-primary/20 bg-muted shrink-0", children: user.photoURL ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: user.photoURL, alt: user.displayName || "Avatar", className: "h-full w-full object-cover" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full w-full flex items-center justify-center font-bold text-lg text-primary bg-primary/10", children: (user.displayName || user.email || "C")[0].toUpperCase() }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-bold text-foreground text-lg leading-tight", children: user.displayName || "Whitelisted Contributor" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: user.email }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center gap-1 mt-1.5 text-[10px] bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 font-semibold px-2 py-0.5 rounded", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-emerald-500" }),
                "Approved Contributor"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: handleSignOut, variant: "outline", size: "sm", className: "w-full sm:w-auto", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "mr-2 h-4 w-4" }),
            "Sign Out"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-bold text-foreground", children: "Your Local Timelines" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
              myTimelines.length,
              " total"
            ] })
          ] }),
          myTimelines.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-10 border-dashed border-border bg-surface/30 text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-foreground", children: "No timelines found" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1 mb-4", children: "Create a timeline first in the main listing to submit it here." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/timelines", children: "Go to Timelines" }) })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-3", children: myTimelines.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-4 border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:shadow-md transition-shadow", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/timeline/$id", params: {
                id: t.id
              }, className: "font-bold text-base hover:underline text-foreground block truncate", children: t.name }),
              t.description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5 line-clamp-1", children: t.description }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 flex items-center gap-3 text-xs text-muted-foreground", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-3.5 w-3.5" }),
                  t.events.length,
                  " events"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                  "Updated ",
                  new Date(t.updatedAt).toLocaleDateString()
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "shrink-0 flex items-center gap-2", children: (() => {
              const status = syncState.status(t.id, t.updatedAt);
              if (submittingId === t.id) {
                return /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { disabled: true, className: "w-full sm:w-auto", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }),
                  "Submitting..."
                ] });
              }
              if (status === "synced") {
                return /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", disabled: true, className: "w-full sm:w-auto cursor-default text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/20", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "mr-2 h-4 w-4" }),
                  "Synced"
                ] });
              }
              if (status === "needs-sync") {
                return /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => handleSubmitTimeline(t), disabled: submittingId !== null, variant: "outline", className: "w-full sm:w-auto border-amber-400 dark:border-amber-700 text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "mr-2 h-4 w-4" }),
                  "Sync Now"
                ] });
              }
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => handleSubmitTimeline(t), disabled: submittingId !== null, className: "w-full sm:w-auto", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CloudUpload, { className: "mr-2 h-4 w-4" }),
                "Submit Contribution"
              ] });
            })() })
          ] }, t.id)) })
        ] })
      ] })
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-12 border-t border-border pt-10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-muted/30 p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-bold text-foreground", children: "How to become a contributor" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground leading-relaxed", children: "If you want to contribute timelines to the public library, let's get in touch first. Send us your email address, and we will register it in our database so you can sign in using your magic link." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex flex-wrap gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, variant: "outline", size: "sm", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: "https://www.linkedin.com/", target: "_blank", rel: "noreferrer", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Linkedin, { className: "mr-2 h-4 w-4" }),
          "Contact via LinkedIn"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, variant: "outline", size: "sm", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: "mailto:hello@chronicle.app", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "mr-2 h-4 w-4" }),
          "Contact via Email"
        ] }) })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: successModalOpen, onOpenChange: setSuccessModalOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-md", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto h-12 w-12 rounded-full bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-6 w-6" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "text-center text-xl font-bold", children: "Contribution Submitted!" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogDescription, { className: "text-center mt-1", children: [
          'Your timeline "',
          submitResult?.timelineName,
          '" has been submitted for review.'
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "my-4 bg-muted/40 p-4 rounded-lg text-sm space-y-2.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Contributor:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground", children: submitResult?.contributor })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Status:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded bg-green-100 dark:bg-green-950 text-green-800 dark:text-green-400", children: "Published" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground leading-normal border-t border-border/60 pt-2.5 mt-2.5", children: submitResult?.message })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "flex flex-col sm:flex-row gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, className: "w-full sm:flex-1", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: submitResult?.url || "#", target: "_blank", rel: "noreferrer", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Github, { className: "mr-2 h-4 w-4" }),
          submitResult?.simulated ? "View Mock Submission" : "View Submission on GitHub"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => setSuccessModalOpen(false), className: "w-full sm:w-auto", children: "Close" })
      ] })
    ] }) })
  ] });
}
export {
  ContributorPage as component
};
