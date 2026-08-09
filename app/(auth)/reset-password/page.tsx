"use client";

import Link from "next/link";
import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
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
  Lock,
  Loader2,
  CheckCircle2,
  ArrowLeft,
  AlertCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import { toast } from "sonner";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!token) {
      setError("Reset token is missing or invalid. Please request a new link.");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetchRequest("/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          newPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to reset password");
      }

      setIsSuccess(true);
      toast.success("Password reset successfully!");
    } catch (err) {
      setError("Something went wrong while resetting your password");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!token) {
    return (
      <Card className="hover:shadow-md transition-shadow bg-card border-border border text-center">
        <CardContent className="pt-8 pb-8 space-y-4">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 border border-destructive/20 text-destructive">
            <AlertCircle className="h-6 w-6" />
          </div>
          <CardTitle className="text-lg font-bold text-zinc-200">
            Invalid Reset Link
          </CardTitle>
          <p className="text-sm text-zinc-500 max-w-xs mx-auto">
            This password reset link is missing a valid security token. Please
            request a new reset email.
          </p>
          <Link
            href="/forgot-password"
            className="inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 font-bold px-4 py-2 text-sm uppercase tracking-wider"
          >
            Request New Link
          </Link>
        </CardContent>
      </Card>
    );
  }

  if (isSuccess) {
    return (
      <Card className="hover:shadow-md transition-shadow bg-card border-border border text-center">
        <CardContent className="pt-8 pb-8 space-y-6">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/30">
            <CheckCircle2 className="h-7 w-7 text-emerald-600" />
          </div>

          <div className="space-y-2">
            <CardTitle className="text-xl font-bold tracking-tight text-zinc-200">
              Password Reset Complete
            </CardTitle>
            <p className="text-zinc-500 text-sm leading-relaxed max-w-sm mx-auto">
              Your password has been successfully updated. You can now log in
              using your new credentials.
            </p>
          </div>

          <div className="pt-2">
            <Link
              href="/login"
              className="w-full flex items-center justify-center rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 font-bold transition-all py-3 text-sm uppercase tracking-widest cursor-pointer shadow-lg shadow-primary/20"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Proceed to Log In
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover:shadow-md transition-shadow bg-card border-border border">
      <CardHeader className="space-y-1">
        <CardTitle className="text-xl font-bold tracking-tight text-zinc-200">
          Set New Password
        </CardTitle>
        <CardDescription className="text-zinc-500 text-sm">
          Please enter and confirm your new password below
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* New Password */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold uppercase tracking-wider text-zinc-200 flex items-center gap-1.5">
              <Lock className="h-3.5 w-3.5" />
              New Password
            </label>
            <div className="relative group">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={isSubmitting}
                className="border-0 rounded-md px-2 pr-10 text-zinc-200 focus-visible:ring-0 focus-visible:ring-offset-0"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-2 text-zinc-400 hover:text-zinc-700"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold uppercase tracking-wider text-zinc-200 flex items-center gap-1.5">
              <Lock className="h-3.5 w-3.5" />
              Confirm New Password
            </label>
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isSubmitting}
              className="border-0 rounded-md px-2 text-zinc-200 focus-visible:ring-0 focus-visible:ring-offset-0"
              required
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 font-bold transition-all py-6 text-sm uppercase tracking-widest shadow-lg shadow-primary/20 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Updating Password...
              </>
            ) : (
              "Update Password"
            )}
          </Button>
        </form>

        <div className="text-center text-sm mt-6">
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-zinc-500 hover:text-zinc-200 transition-colors text-sm uppercase tracking-wider font-semibold"
          >
            <ArrowLeft className="h-3 w-3" />
            Back to Log In
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
