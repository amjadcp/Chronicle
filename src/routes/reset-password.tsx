import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Lock,
  CheckCircle2,
  Loader2,
  AlertCircle,
  ArrowLeft,
  Sparkles,
  Eye,
  EyeOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { verifyResetCode, confirmResetPassword, isFirebaseConfigured, getFriendlyAuthErrorMessage } from "@/lib/firebase";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Reset Password — HistoryTimeline" },
      {
        name: "description",
        content: "Set a new password for your HistoryTimeline contributor account.",
      },
    ],
  }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const [oobCode, setOobCode] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Form input states
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Parse query params in client side
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("oobCode");
      
      if (!code) {
        // In Demo/Simulation mode, if no code is present, we can mock one for testing
        if (!isFirebaseConfigured) {
          setOobCode("demo-reset-code");
          setEmail("demo@example.com");
          setLoading(false);
        } else {
          setError("No password reset code found in the link. Please request a new link.");
          setLoading(false);
        }
        return;
      }

      setOobCode(code);
      
      // Verify reset code and retrieve email
      verifyResetCode(code)
        .then((emailAddress) => {
          setEmail(emailAddress);
          setLoading(false);
        })
        .catch((err: any) => {
          console.error(err);
          setError(getFriendlyAuthErrorMessage(err));
          setLoading(false);
        });
    }
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (!oobCode) {
      toast.error("Missing reset code.");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      setSubmitting(true);
      await confirmResetPassword(oobCode, newPassword);
      setSuccess(true);
      toast.success("Password reset successfully!");
    } catch (err: any) {
      console.error(err);
      toast.error(getFriendlyAuthErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-20 flex flex-col justify-center min-h-[70vh]">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-1.5 bg-blue-50 dark:bg-blue-950 px-3 py-1 rounded-full text-xs font-semibold text-blue-600 dark:text-blue-400 mb-3">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Security Portal</span>
        </div>
        <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
          Create New Password
        </h1>
      </div>

      {loading ? (
        <Card className="p-8 border-border bg-card shadow-sm flex flex-col items-center text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
          <h2 className="text-lg font-bold text-foreground">Verifying Code</h2>
          <p className="text-sm text-muted-foreground mt-2">
            Checking the validity of your password reset link...
          </p>
        </Card>
      ) : error ? (
        <Card className="p-8 border-border bg-card shadow-md flex flex-col items-center text-center">
          <div className="h-12 w-12 rounded-full bg-red-50 dark:bg-red-950/30 flex items-center justify-center text-red-600 dark:text-red-400 mb-4">
            <AlertCircle className="h-6 w-6" />
          </div>
          <h2 className="text-lg font-bold text-foreground">Reset Link Invalid</h2>
          <p className="text-sm text-muted-foreground mt-2 mb-6">
            {error}
          </p>
          <Button asChild className="w-full">
            <Link to="/contributor">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Sign In
            </Link>
          </Button>
        </Card>
      ) : success ? (
        <Card className="p-8 border-border bg-card shadow-md flex flex-col items-center text-center">
          <div className="h-12 w-12 rounded-full bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-4">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-bold text-foreground">Password Updated</h2>
          <p className="text-sm text-muted-foreground mt-2 mb-6">
            Your password has been successfully updated. You can now sign in to your contributor account.
          </p>
          <Button asChild className="w-full">
            <Link to="/contributor">
              Go to Sign In
            </Link>
          </Button>
        </Card>
      ) : (
        <Card className="p-8 border-border bg-card shadow-md">
          <div className="flex flex-col items-center">
            <div className="h-12 w-12 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4">
              <Lock className="h-5 w-5" />
            </div>
            
            {email && (
              <div className="text-center mb-6">
                <span className="text-xs text-muted-foreground">Resetting password for</span>
                <p className="text-sm font-semibold text-foreground mt-0.5">{email}</p>
              </div>
            )}

            {!isFirebaseConfigured && (
              <Alert className="mb-6 border-amber-200 bg-amber-50/50 dark:border-amber-900/30 dark:bg-amber-950/20 text-left">
                <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                <AlertTitle className="text-amber-800 dark:text-amber-400 font-semibold">Demo Mode Active</AlertTitle>
                <AlertDescription className="text-amber-700 dark:text-amber-500 text-xs">
                  Vite Firebase variables are not set. Submitting this form will simulate a successful password update.
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="w-full space-y-4 text-left">
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <div className="relative">
                  <Input
                    id="new-password"
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="At least 6 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input
                  id="confirm-password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              <Button type="submit" disabled={submitting} className="w-full py-5 mt-2">
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating Password...
                  </>
                ) : (
                  "Save New Password"
                )}
              </Button>
            </form>
          </div>
        </Card>
      )}
    </div>
  );
}
