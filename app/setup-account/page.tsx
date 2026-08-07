"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { fetchRequest } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  User as UserIcon,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";

function SetupAccountForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loadingInfo, setLoadingInfo] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Password criteria
  const [pwdCriteria, setPwdCriteria] = useState({
    length: false,
    number: false,
    special: false,
  });

  useEffect(() => {
    const setPwd = () => {
      setPwdCriteria({
        length: password.length >= 8,
        number: /\d/.test(password),
        special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      });
    };
    setPwd();
  }, [password]);

  const getPasswordStrength = () => {
    const passed = Object.values(pwdCriteria).filter(Boolean).length;
    if (password.length === 0)
      return { score: 0, text: "", color: "bg-zinc-100" };
    if (passed === 0) return { score: 0, text: "", color: "bg-zinc-100" };
    if (passed === 1) return { score: 1, text: "Weak", color: "bg-rose-500" };
    if (passed === 2)
      return { score: 2, text: "Medium", color: "bg-amber-500" };
    return { score: 3, text: "Strong", color: "bg-emerald-500" };
  };

  const strength = getPasswordStrength();

  // Load Google account details from setupToken
  useEffect(() => {
    if (!token) {
      const setErr = () => {
        setError(
          "Setup token is missing or invalid. Please sign in with Google again.",
        );
        setLoadingInfo(false);
      };
      setErr();
      return;
    }

    fetchRequest(`oauth/google/setup-info?token=${encodeURIComponent(token)}`)
      .then(async (res) => {
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.message || "Invalid or expired setup token");
        }
        const data = await res.json();
        setEmail(data.email || "");
        setName(data.name || "");
      })
      .catch((err) => {
        console.error(err);
        setError(
          (err as Error).message +
            "Session expired. Please try signing in with Google again.",
        );
      })
      .finally(() => setLoadingInfo(false));
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!token) {
      setError("Setup token missing");
      return;
    }

    if (!password || !confirmPassword) {
      setError("Please fill in all password fields");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetchRequest("oauth/google/complete-setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          setupToken: token,
          name: name.trim(),
          password,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to complete setup");
      }

      localStorage.setItem("jwt_token", data.token);
      toast.success("Account setup complete! Welcome to Bulkmail.");
      window.location.href = "/dashboard";
    } catch (err) {
      console.error(err);
      setError(
        (err as Error).message ||
          "An error occurred while creating your account",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingInfo) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-zinc-400 gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
        <span className="text-sm">Verifying Google Account...</span>
      </div>
    );
  }

  if (error && !email) {
    return (
      <Card className="hover:shadow-md transition-shadow bg-card border-border border text-center max-w-md w-full mx-auto">
        <CardContent className="pt-8 pb-8 space-y-4">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 border border-destructive/20 text-destructive">
            <AlertCircle className="h-6 w-6" />
          </div>
          <CardTitle className="text-lg font-bold text-zinc-200">
            Session Expired
          </CardTitle>
          <p className="text-xs text-zinc-400 max-w-xs mx-auto">{error}</p>
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 font-bold px-4 py-2 text-xs uppercase tracking-wider"
          >
            Return to Log In
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover:shadow-md transition-shadow bg-card border-border border max-w-md w-full mx-auto">
      <CardHeader className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-400 text-xs font-semibold w-fit">
          <Sparkles className="h-3.5 w-3.5" />
          First-Time Google Signup
        </div>
        <CardTitle className="text-xl font-bold tracking-tight text-zinc-200 normal-case">
          Complete Your Account
        </CardTitle>
        <CardDescription className="text-zinc-400 text-sm">
          Set up a password for your Bulkmail account to finish registration.
        </CardDescription>
      </CardHeader>

      <CardContent>
        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive animate-in fade-in slide-in-from-top-1 duration-200">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold uppercase tracking-wider text-zinc-200 flex items-center gap-1.5">
              <UserIcon className="h-3.5 w-3.5" />
              Full Name
            </label>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isSubmitting}
              className="border-0 rounded-md px-2 text-zinc-200 bg-zinc-900 border-zinc-800"
              required
            />
          </div>

          {/* Email Address (Read-only from Google) */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold uppercase tracking-wider text-zinc-200 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5" />
                Connected Email
              </span>
              <span className="text-[10px] text-emerald-400 font-normal flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" /> Google Verified
              </span>
            </label>
            <Input
              type="email"
              value={email}
              disabled
              className="border-0 rounded-md px-2 text-zinc-400 bg-zinc-900/50 border-zinc-800/80 cursor-not-allowed opacity-75"
            />
          </div>

          {/* Password Field */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold uppercase tracking-wider text-zinc-200 flex items-center gap-1.5">
              <Lock className="h-3.5 w-3.5" />
              Create Password
            </label>
            <div className="relative group">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isSubmitting}
                className="border-0 rounded-md px-2 pr-10 text-zinc-200 bg-zinc-900 border-zinc-800"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>

            {/* Password Strength */}
            {password.length > 0 && (
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-zinc-400 uppercase tracking-wider font-semibold">
                    Strength
                  </span>
                  <span className="font-bold text-zinc-400 uppercase tracking-wider">
                    {strength.text}
                  </span>
                </div>
                <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden flex gap-0.5">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${strength.color}`}
                    style={{ width: `${(strength.score / 3) * 100}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password Field */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold uppercase tracking-wider text-zinc-200 flex items-center gap-1.5">
              <Lock className="h-3.5 w-3.5" />
              Confirm Password
            </label>
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isSubmitting}
              className="border-0 rounded-md px-2 text-zinc-200 bg-zinc-900 border-zinc-800"
              required
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 font-bold transition-all py-6 text-sm uppercase tracking-widest shadow-lg shadow-primary/20 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                "Complete Account Setup"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export default function SetupAccountPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center p-4">
      <Suspense
        fallback={
          <div className="flex justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
          </div>
        }
      >
        <SetupAccountForm />
      </Suspense>
    </div>
  );
}
