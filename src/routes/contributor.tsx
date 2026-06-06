import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Linkedin,
  Mail,
  CloudUpload,
  CheckCircle2,
  Check,
  RefreshCw,
  Info,
  Lock,
  LogOut,
  Calendar as CalIcon,
  Github,
  Loader2,
  Sparkles,
  Send,
  MailCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  subscribeAuth,
  signOutUser,
  isFirebaseConfigured,
  SimulatedUser,
  signInWithEmail,
  sendPasswordReset,
  getFriendlyAuthErrorMessage,
} from "@/lib/firebase";
import { storage } from "@/lib/chronicle/storage";
import { Timeline } from "@/lib/chronicle/types";
import { submitTimeline } from "@/lib/api/contributor.functions";
import { syncState } from "@/lib/chronicle/syncState";
import { User } from "firebase/auth";

export const Route = createFileRoute("/contributor")({
  head: () => ({
    meta: [
      { title: "Contribute to HistoryTimeline — Submit Historical Timelines" },
      {
        name: "description",
        content:
          "Become a HistoryTimeline contributor and submit historical timelines to the public community library.",
      },
      { property: "og:title", content: "Contribute to HistoryTimeline" },
      { property: "og:description", content: "Submit historical timelines to the HistoryTimeline community library." },
      { property: "og:url", content: "/contributor" },
    ],
    links: [{ rel: "canonical", href: "/contributor" }],
  }),
  component: ContributorPage,
});

function ContributorPage() {
  const [user, setUser] = useState<User | SimulatedUser | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Auth Form State
  const [authMode, setAuthMode] = useState<"login" | "forgot">("login");
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [signingIn, setSigningIn] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);

  const [submittingId, setSubmittingId] = useState<string | null>(null);
  const [myTimelines, setMyTimelines] = useState<Timeline[]>([]);
  // Bump this counter to force sync-status badges to re-render after a push
  const [syncTick, setSyncTick] = useState(0);
  
  // PR Success Modal state
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [submitResult, setSubmitResult] = useState<{
    timelineName: string;
    url: string;
    simulated: boolean;
    contributor: string;
    message: string;
  } | null>(null);

  useEffect(() => {
    // 1. Subscribe to Firebase auth state
    const unsubscribe = subscribeAuth((u) => {
      setUser(u);
      setLoading(false);
    });

    // 2. Load my timelines
    setMyTimelines(storage.list());

    return () => {
      unsubscribe();
    };
  }, []);

  async function handleAuthSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!emailInput || !emailInput.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }

    if (authMode !== "forgot" && (!passwordInput || passwordInput.length < 6)) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    try {
      setSigningIn(true);
      if (authMode === "login") {
        const u = await signInWithEmail(emailInput, passwordInput);
        if (u) {
          toast.success(`Welcome! Logged in as ${u.email}`);
          setPasswordInput("");
        }
      } else if (authMode === "forgot") {
        await sendPasswordReset(emailInput);
        setForgotSent(true);
        toast.success("Password reset email sent! Check your inbox.");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(getFriendlyAuthErrorMessage(err));
    } finally {
      setSigningIn(false);
    }
  }

  async function handleSignOut() {
    try {
      setLoading(true);
      await signOutUser();
      setEmailInput("");
      setPasswordInput("");
      setForgotSent(false);
      setAuthMode("login");
      toast.success("Signed out successfully");
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to sign out");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmitTimeline(timeline: Timeline) {
    if (!user) {
      toast.error("You must be logged in to submit a timeline.");
      return;
    }

    try {
      setSubmittingId(timeline.id);
      
      // Get Firebase IdToken (needed for server function auth verification)
      const idToken = await user.getIdToken();

      // Call the server action to submit
      const res = await submitTimeline({
        data: {
          idToken,
          timeline,
        }
      });

      if (res.success) {
        // Mark the timeline as synced in local state
        syncState.markPushed(timeline.id, timeline.updatedAt);
        setSyncTick((n) => n + 1);

        setSubmitResult({
          timelineName: timeline.name,
          url: res.url,
          simulated: res.simulated,
          contributor: res.contributor,
          message: res.message,
        });
        setSuccessModalOpen(true);
        toast.success(`"${timeline.name}" submitted successfully!`);
      } else {
        toast.error("Submission failed. Please try again.");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "An error occurred during submission.");
    } finally {
      setSubmittingId(null);
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      {/* Portal Header */}
      <div className="text-center md:text-left">
        <div className="inline-flex items-center gap-1.5 bg-blue-50 dark:bg-blue-950 px-3 py-1 rounded-full text-xs font-semibold text-blue-600 dark:text-blue-400 mb-3">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Contributor Portal</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          Contribute Historical Timelines
        </h1>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground max-w-2xl">
          HistoryTimeline hosts a shared library of historical timelines. 
          Once your email is approved and registered, you can publish your custom timelines directly to the shared library 
          for everyone to view and study.
        </p>
      </div>

      {/* Auth Panel */}
      <div className="mt-10">
        {loading ? (
          <div className="flex items-center justify-center p-8 bg-card rounded-xl border border-border shadow-sm">
            <Loader2 className="h-6 w-6 animate-spin text-primary mr-2" />
            <span className="text-sm text-muted-foreground">Checking authentication state...</span>
          </div>
        ) : !user ? (
          /* Authentication Card */
          <Card className="p-8 border-border bg-gradient-to-br from-card to-slate-50 dark:to-slate-900 shadow-md max-w-md mx-auto">
            <div className="flex flex-col items-center">
              <div className="h-12 w-12 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4">
                <Lock className="h-5 w-5" />
              </div>
              
              {authMode === "login" && (
                <>
                  <h2 className="text-xl font-bold text-foreground">Contributor Sign In</h2>
                  <p className="text-sm text-muted-foreground mt-2 mb-6 text-center">
                    Enter your email and password to log into your contributor account.
                  </p>
                </>
              )}

              {authMode === "forgot" && (
                <>
                  <h2 className="text-xl font-bold text-foreground">Reset Password</h2>
                  <p className="text-sm text-muted-foreground mt-2 mb-6 text-center">
                    Enter your email address to receive a secure password reset link.
                  </p>
                </>
              )}

              {!isFirebaseConfigured && (
                <Alert className="mb-6 border-amber-200 bg-amber-50/50 dark:border-amber-900/30 dark:bg-amber-950/20 text-left">
                  <Info className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  <AlertTitle className="text-amber-800 dark:text-amber-400 font-semibold">Demo / Simulation Mode Active</AlertTitle>
                  <AlertDescription className="text-amber-700 dark:text-amber-500 text-xs">
                    Vite Firebase variables are not set. Signing in will generate a simulated session with a mock profile.
                  </AlertDescription>
                </Alert>
              )}

              {authMode === "forgot" && forgotSent ? (
                <div className="w-full bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30 p-6 rounded-lg text-center">
                  <MailCheck className="h-10 w-10 text-blue-600 dark:text-blue-400 mx-auto mb-3" />
                  <h3 className="font-semibold text-foreground">Reset Email Sent!</h3>
                  <p className="text-xs text-muted-foreground mt-1.5 leading-normal">
                    We sent a password reset email to <strong>{emailInput}</strong>.
                  </p>

                  <div className="mt-4 flex gap-2 text-xs text-amber-700 dark:text-amber-400 bg-amber-50/60 dark:bg-amber-950/20 p-3 rounded-lg border border-amber-200/50 text-left leading-normal">
                    <Info className="h-4 w-4 shrink-0 mt-0.5" />
                    <span>If you don't see the email within a few minutes, please check your <strong>Spam, Junk, or Promotions</strong> folders as it may have been routed there.</span>
                  </div>

                  <Button variant="outline" size="sm" onClick={() => { setForgotSent(false); setAuthMode("login"); }} className="mt-4 w-full">
                    Back to Sign In
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleAuthSubmit} className="w-full space-y-4 text-left">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      placeholder="e.g. you@example.com"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      className="w-full"
                    />
                  </div>

                  {authMode === "login" && (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label htmlFor="password" className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                          Password
                        </Label>
                        {authMode === "login" && (
                          <button
                            type="button"
                            onClick={() => setAuthMode("forgot")}
                            className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                          >
                            Forgot Password?
                          </button>
                        )}
                      </div>
                      <Input
                        id="password"
                        type="password"
                        required
                        placeholder="••••••••"
                        value={passwordInput}
                        onChange={(e) => setPasswordInput(e.target.value)}
                        className="w-full"
                      />
                    </div>
                  )}

                  <Button type="submit" disabled={signingIn} className="w-full py-5 mt-2">
                    {signingIn ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : authMode === "login" ? (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Sign In
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Send Reset Link
                      </>
                    )}
                  </Button>

                  {authMode === "forgot" && (
                    <div className="text-center mt-3">
                      <button
                        type="button"
                        onClick={() => { setAuthMode("login"); setForgotSent(false); }}
                        className="text-xs text-muted-foreground hover:text-foreground hover:underline"
                      >
                        Back to Sign In
                      </button>
                    </div>
                  )}
                </form>
              )}
            </div>
          </Card>
        ) : (
          /* Logged In Dashboard */
          <div className="space-y-6">
            {/* Contributor Profile Card */}
            <Card className="p-4 sm:p-6 border-border bg-card/60 backdrop-blur shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3.5 text-center sm:text-left flex-col sm:flex-row">
                <div className="h-14 w-14 rounded-full overflow-hidden border-2 border-primary/20 bg-muted shrink-0">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt={user.displayName || "Avatar"} className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center font-bold text-lg text-primary bg-primary/10">
                      {(user.displayName || user.email || "C")[0].toUpperCase()}
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-foreground text-lg leading-tight">
                    {user.displayName || "Whitelisted Contributor"}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{user.email}</p>
                  <div className="inline-flex items-center gap-1 mt-1.5 text-[10px] bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 font-semibold px-2 py-0.5 rounded">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                    Approved Contributor
                  </div>
                </div>
              </div>
              <Button onClick={handleSignOut} variant="outline" size="sm" className="w-full sm:w-auto">
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </Card>

            {/* Timelines Submission List */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-foreground">Your Local Timelines</h2>
                <span className="text-xs text-muted-foreground">{myTimelines.length} total</span>
              </div>

              {myTimelines.length === 0 ? (
                <Card className="p-10 border-dashed border-border bg-surface/30 text-center">
                  <h3 className="font-semibold text-foreground">No timelines found</h3>
                  <p className="text-sm text-muted-foreground mt-1 mb-4">
                    Create a timeline first in the main listing to submit it here.
                  </p>
                  <Button asChild>
                    <Link to="/timelines">Go to Timelines</Link>
                  </Button>
                </Card>
              ) : (
                <div className="grid gap-3">
                  {myTimelines.map((t) => (
                    <Card key={t.id} className="p-4 border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:shadow-md transition-shadow">
                      <div className="min-w-0">
                        <Link to="/timeline/$id" params={{ id: t.id }} className="font-bold text-base hover:underline text-foreground block truncate">
                          {t.name}
                        </Link>
                        {t.description && (
                          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{t.description}</p>
                        )}
                        <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="inline-flex items-center gap-1">
                            <CalIcon className="h-3.5 w-3.5" />
                            {t.events.length} events
                          </span>
                          <span>Updated {new Date(t.updatedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      
                      <div className="shrink-0 flex items-center gap-2">
                        {(() => {
                          // syncTick is read so re-renders happen after push
                          void syncTick;
                          const status = syncState.status(t.id, t.updatedAt);

                          if (submittingId === t.id) {
                            return (
                              <Button disabled className="w-full sm:w-auto">
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Submitting...
                              </Button>
                            );
                          }

                          if (status === "synced") {
                            return (
                              <Button
                                variant="outline"
                                disabled
                                className="w-full sm:w-auto cursor-default text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/20"
                              >
                                <Check className="mr-2 h-4 w-4" />
                                Synced
                              </Button>
                            );
                          }

                          if (status === "needs-sync") {
                            return (
                              <Button
                                onClick={() => handleSubmitTimeline(t)}
                                disabled={submittingId !== null}
                                variant="outline"
                                className="w-full sm:w-auto border-amber-400 dark:border-amber-700 text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30"
                              >
                                <RefreshCw className="mr-2 h-4 w-4" />
                                Sync Now
                              </Button>
                            );
                          }

                          // status === "not-pushed"
                          return (
                            <Button
                              onClick={() => handleSubmitTimeline(t)}
                              disabled={submittingId !== null}
                              className="w-full sm:w-auto"
                            >
                              <CloudUpload className="mr-2 h-4 w-4" />
                              Submit Contribution
                            </Button>
                          );
                        })()}
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Manual Request Panel */}
      <div className="mt-12 border-t border-border pt-10">
        <div className="rounded-xl border border-border bg-muted/30 p-6">
          <h2 className="text-lg font-bold text-foreground">How to become a contributor</h2>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            If you want to contribute timelines to the public library, let's get in touch first. 
            Send us your email address, and we will register it in our database so you can sign in using email and password.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild variant="outline" size="sm">
              <a href="https://www.linkedin.com/in/amjadcp/" target="_blank" rel="noreferrer">
                <Linkedin className="mr-2 h-4 w-4" />
                Contact via LinkedIn
              </a>
            </Button>
            <Button asChild variant="outline" size="sm">
              <a href="mailto:amjadcp03@gmail.com">
                <Mail className="mr-2 h-4 w-4" />
                Contact via Email
              </a>
            </Button>
          </div>
        </div>
      </div>

      {/* Success Dialog */}
      <Dialog open={successModalOpen} onOpenChange={setSuccessModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="mx-auto h-12 w-12 rounded-full bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-2">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <DialogTitle className="text-center text-xl font-bold">Contribution Submitted!</DialogTitle>
            <DialogDescription className="text-center mt-1">
              Your timeline "{submitResult?.timelineName}" has been submitted for review.
            </DialogDescription>
          </DialogHeader>
          
          <div className="my-4 bg-muted/40 p-4 rounded-lg text-sm space-y-2.5">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Contributor:</span>
              <span className="font-semibold text-foreground">{submitResult?.contributor}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Status:</span>
              <span className="inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded bg-green-100 dark:bg-green-950 text-green-800 dark:text-green-400">
                Published
              </span>
            </div>
            <div className="text-xs text-muted-foreground leading-normal border-t border-border/60 pt-2.5 mt-2.5">
              {submitResult?.message}
            </div>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button asChild className="w-full sm:flex-1">
              <a href={submitResult?.url || "#"} target="_blank" rel="noreferrer">
                <Github className="mr-2 h-4 w-4" />
                {submitResult?.simulated ? "View Mock Submission" : "View Submission on GitHub"}
              </a>
            </Button>
            <Button variant="outline" onClick={() => setSuccessModalOpen(false)} className="w-full sm:w-auto">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
