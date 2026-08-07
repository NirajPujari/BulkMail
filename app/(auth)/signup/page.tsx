"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/Auth";
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
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";

export default function SignupPage() {
  const { signup } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Password Validation criteria
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
  const passwordsMatch = password === confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    if (!passwordsMatch) {
      setError("Passwords do not match");
      return;
    }

    setIsSubmitting(true);
    try {
      await signup(name, email, password);
      toast.success("Account created! Welcome to Bulkmail.");
    } catch (err) {
      setError("Failed to create account. Please try again.");
      console.log(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignup = () => {
    window.location.href = "/api/oauth/google/login?mode=auth";
  };

  return (
    <Card className="hover:shadow-md transition-shadow bg-card border-border border">
      <CardHeader className="space-y-1">
        <CardTitle className="text-xl font-bold tracking-tight text-zinc-200 normal-case">
          Create Account
        </CardTitle>
        <CardDescription className="text-zinc-500 text-sm">
          Join Bulkmail to start sending bulk email campaigns.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Google Sign-up Button */}
        <Button
          type="button"
          onClick={handleGoogleSignup}
          variant="outline"
          className="w-full flex items-center justify-center gap-3 py-5 border-zinc-800 bg-zinc-900/90 hover:bg-zinc-800 text-zinc-200 cursor-pointer text-sm font-semibold transition-all"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24">
            <path
              fill="#EA4335"
              d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z"
            />
            <path
              fill="#4285F4"
              d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
            />
            <path
              fill="#FBBC05"
              d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 10.8 0 12s.7 2.3 1.9 4.7l3.7-2.9z"
            />
            <path
              fill="#34A853"
              d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z"
            />
          </svg>
          Sign up with Google
        </Button>

        {/* Divider */}
        <div className="relative flex items-center justify-center">
          <div className="w-full border-t border-zinc-800" />
          <span className="absolute bg-card px-2 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
            or register with email
          </span>
        </div>

        {error && (
          <div className="flex items-center gap-2 rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive animate-in fade-in slide-in-from-top-1 duration-200">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Field */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold uppercase tracking-wider text-zinc-200 flex items-center gap-1.5">
              <User className="h-3.5 w-3.5" />
              Full Name
            </label>
            <div className="relative group">
              <Input
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isSubmitting}
                className="border-0 rounded-md px-2 text-zinc-400 focus-visible:ring-0 focus-visible:ring-offset-0"
                required
              />
              <span className="pointer-events-none absolute bottom-0 left-0 h-0.5 w-full origin-left bg-primary transition-transform duration-300 ease-in-out" />
            </div>
          </div>

          {/* Email Field */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold uppercase tracking-wider text-zinc-200 flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5" />
              Email Address
            </label>
            <div className="relative group">
              <Input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
                className="border-0 rounded-md px-2 text-zinc-400 focus-visible:ring-0 focus-visible:ring-offset-0"
                required
              />
              <span className="pointer-events-none absolute bottom-0 left-0 h-0.5 w-full origin-left bg-primary transition-transform duration-300 ease-in-out" />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold uppercase tracking-wider text-zinc-200 flex items-center gap-1.5">
              <Lock className="h-3.5 w-3.5" />
              Password
            </label>
            <div className="relative group">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isSubmitting}
                className="border-0 rounded-md px-2 pr-10 text-zinc-400 focus-visible:ring-0 focus-visible:ring-offset-0"
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 z-10 -translate-y-1/2 text-zinc-200 hover:text-zinc-500 transition-all duration-400"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>

              <span className="pointer-events-none absolute bottom-0 left-0 h-0.5 w-full origin-left bg-primary transition-transform duration-300 ease-in-out" />
            </div>

            {/* Password Strength Indicator */}
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
                <div className="h-1 w-full bg-zinc-100 rounded-full overflow-hidden flex gap-0.5">
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
            <div className="relative group">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isSubmitting}
                className="border-0 rounded-md px-2 text-zinc-400 focus-visible:ring-0 focus-visible:ring-offset-0"
                required
              />
              <span className="pointer-events-none absolute bottom-0 left-0 h-0.5 w-full origin-left bg-primary transition-transform duration-300 ease-in-out" />
            </div>
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
                "Create Account"
              )}
            </Button>
          </div>
        </form>

        {/* Login Footer Link */}
        <div className="text-center text-sm text-zinc-500 pt-2">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-primary hover:text-primary/80 font-bold transition-colors underline underline-offset-4"
          >
            Log in
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
