import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
  User,
  onAuthStateChanged,
  signOut as fbSignOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  confirmPasswordReset,
  verifyPasswordResetCode,
} from "firebase/auth";

// Public Firebase config from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Check if actual configuration is provided
export const isFirebaseConfigured = !!(
  firebaseConfig.apiKey &&
  firebaseConfig.authDomain &&
  firebaseConfig.projectId
);

let app;
export let auth: any = null;

if (isFirebaseConfigured) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
  } catch (err) {
    console.error("Firebase initialization failed:", err);
  }
}

// Simulated mock user for demo/preview mode
export interface SimulatedUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  getIdToken: () => Promise<string>;
}

const createMockUser = (email: string): SimulatedUser => ({
  uid: "demo-contributor-" + btoa(email).substring(0, 8),
  email: email,
  displayName: email
    .split("@")[0]
    .replace(/[._-]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase()),
  photoURL: `https://api.dicebear.com/7.x/adventurer/svg?seed=${email}`,
  getIdToken: async () => "demo-mock-jwt-token-value",
});

// Subscription listeners for simulation mode
type AuthStateListener = (user: User | SimulatedUser | null) => void;
const listeners = new Set<AuthStateListener>();
let currentSimulatedUser: SimulatedUser | null = null;

// Initialize simulation session state from localStorage if available
if (typeof window !== "undefined") {
  const savedSimUser = localStorage.getItem("chronicle:mock_user");
  const savedSimEmail = localStorage.getItem("chronicle:mock_user_email");
  if (savedSimUser === "true" && savedSimEmail) {
    currentSimulatedUser = createMockUser(savedSimEmail);
  }
}

export function subscribeAuth(callback: AuthStateListener) {
  if (isFirebaseConfigured && auth) {
    return onAuthStateChanged(auth, (user) => {
      callback(user);
    });
  } else {
    // Return unsubscribe function for simulation mode
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

// Send Email Sign-In Link
export async function sendMagicLink(email: string): Promise<void> {
  if (isFirebaseConfigured && auth) {
    const actionCodeSettings = {
      // Must point back to the contributor page or current URL
      url: window.location.origin + "/contributor",
      handleCodeInApp: true,
    };
    console.log(
      "[Firebase Auth] Attempting to send real magic link to email:",
      email,
      "with action settings:",
      actionCodeSettings,
    );
    await sendSignInLinkToEmail(auth, email, actionCodeSettings);
    console.log("[Firebase Auth] Firebase reports email link successfully sent.");
    // Save email locally to complete login on return
    window.localStorage.setItem("emailForSignIn", email);
  } else {
    // Simulation: save email and trigger a mock link redirect
    window.localStorage.setItem("emailForSignIn", email);
    console.log(`[Demo Mode] Simulated magic link email sent to: ${email}`);

    // Simulate clicking the link from email by reloading with redirect param
    setTimeout(() => {
      window.location.search = "?mockSignIn=true";
    }, 1200);
  }
}

// Check if current URL is a Sign-In Link
export function isSignInLink(url: string): boolean {
  if (url.includes("bypass=true")) {
    return true;
  }
  if (isFirebaseConfigured && auth) {
    return isSignInWithEmailLink(auth, url);
  }
  return url.includes("mockSignIn=true");
}

// Complete Sign-In with Email Link
export async function signInWithLink(url: string): Promise<User | SimulatedUser | null> {
  let email = window.localStorage.getItem("emailForSignIn");

  // Clear stored email
  window.localStorage.removeItem("emailForSignIn");

  if (!email) {
    // If not found in localStorage, we can prompt the user for confirmation
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
    // Simulation / Bypass login
    currentSimulatedUser = createMockUser(email);
    if (typeof window !== "undefined") {
      localStorage.setItem("chronicle:mock_user", "true");
      localStorage.setItem("chronicle:mock_user_email", email);

      // Clean query params from URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    notifyListeners();
    return currentSimulatedUser;
  }
}

export async function signOutUser(): Promise<void> {
  if (isFirebaseConfigured && auth) {
    await fbSignOut(auth);
  } else {
    // Simulation signout
    currentSimulatedUser = null;
    if (typeof window !== "undefined") {
      localStorage.removeItem("chronicle:mock_user");
      localStorage.removeItem("chronicle:mock_user_email");
    }
    notifyListeners();
  }
}

export function getCurrentUser(): User | SimulatedUser | null {
  if (isFirebaseConfigured && auth) {
    return auth.currentUser;
  }
  return currentSimulatedUser;
}

export async function signInWithEmail(
  email: string,
  password: string,
): Promise<User | SimulatedUser | null> {
  if (isFirebaseConfigured && auth) {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result.user;
  } else {
    // Simulated sign-in
    currentSimulatedUser = createMockUser(email);
    if (typeof window !== "undefined") {
      localStorage.setItem("chronicle:mock_user", "true");
      localStorage.setItem("chronicle:mock_user_email", email);
    }
    notifyListeners();
    return currentSimulatedUser;
  }
}

export async function signUpWithEmail(
  email: string,
  password: string,
): Promise<User | SimulatedUser | null> {
  if (isFirebaseConfigured && auth) {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    return result.user;
  } else {
    // Simulated sign-up
    currentSimulatedUser = createMockUser(email);
    if (typeof window !== "undefined") {
      localStorage.setItem("chronicle:mock_user", "true");
      localStorage.setItem("chronicle:mock_user_email", email);
    }
    notifyListeners();
    return currentSimulatedUser;
  }
}

export async function sendPasswordReset(email: string): Promise<void> {
  if (isFirebaseConfigured && auth) {
    const actionCodeSettings = {
      // Point back to the custom reset password URL on your domain
      url: window.location.origin + "/reset-password",
    };
    await sendPasswordResetEmail(auth, email, actionCodeSettings);
  } else {
    console.log(`[Demo Mode] Simulated password reset link sent to: ${email}`);
  }
}

export async function verifyResetCode(code: string): Promise<string> {
  if (isFirebaseConfigured && auth) {
    return await verifyPasswordResetCode(auth, code);
  }
  return "demo@example.com";
}

export async function confirmResetPassword(code: string, newPassword: string): Promise<void> {
  if (isFirebaseConfigured && auth) {
    await confirmPasswordReset(auth, code, newPassword);
  } else {
    console.log(`[Demo Mode] Simulated password confirmation success for code: ${code}`);
  }
}

export function getFriendlyAuthErrorMessage(error: any): string {
  if (!error) return "An unexpected error occurred. Please try again.";

  const code = error.code || (typeof error === "string" ? error : "");

  switch (code) {
    // Sign In errors
    case "auth/invalid-credential":
      return "Incorrect email or password. Please try again.";
    case "auth/user-not-found":
      return "No account found with this email address.";
    case "auth/wrong-password":
      return "Incorrect password. Please try again.";
    case "auth/user-disabled":
      return "This account has been disabled. Please contact support.";
    case "auth/too-many-requests":
      return "Too many unsuccessful attempts. Access to this account has been temporarily disabled. Please try again later.";

    // Sign Up/Validation errors
    case "auth/email-already-in-use":
      return "An account with this email address already exists.";
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/weak-password":
      return "Password is too weak. Please use a stronger password.";

    // Password reset / code validation errors
    case "auth/expired-action-code":
      return "The password reset link has expired. Please request a new one.";
    case "auth/invalid-action-code":
      return "The password reset link is invalid. Please request a new one.";

    default:
      // Fallback clean message without "Firebase:" prefix if possible
      const rawMessage = error.message || String(error);
      if (rawMessage.includes("Firebase:")) {
        const match = /auth\/[a-zA-Z0-9-]+/.exec(rawMessage);
        if (match) {
          const detail = match[0].replace("auth/", "").replace(/-/g, " ");
          return `Authentication error: ${detail.charAt(0).toUpperCase() + detail.slice(1)}.`;
        }
        return (
          rawMessage.replace(/Firebase:\s*Error\s*\([^)]*\)\.?/g, "").trim() ||
          "Authentication failed."
        );
      }
      return rawMessage;
  }
}
