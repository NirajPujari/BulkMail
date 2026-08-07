"use client";

import { useState, useEffect, FormEvent } from "react";
import { useAuth } from "@/context/Auth";
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
  Lock,
  Mail,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Unlink,
  RefreshCw,
  Zap,
  Save,
} from "lucide-react";
import { toast } from "sonner";

export default function SettingsPage() {
  const { user, refreshUser } = useAuth();

  // Profile Form State
  const [name, setName] = useState("");
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  // Password Form State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  // Google Account Disconnect State
  const [isDisconnectingGoogle, setIsDisconnectingGoogle] = useState(false);

  // Sync initial user state
  useEffect(() => {
    if (user) {
      const setNameAsync = () => {
        setName(user.name || "");
      };
      setNameAsync();
    }
  }, [user]);

  // Handle Display Name Update
  const handleUpdateProfile = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Display name cannot be empty.");
      return;
    }

    setIsUpdatingProfile(true);
    try {
      const res = await fetchRequest("/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: name.trim() }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to update profile name.");
      }

      toast.success("Display name updated successfully!");
      await refreshUser();
    } catch (error) {
      console.error(error);
      toast.error((error as Error).message || "Could not update profile name.");
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  // Handle Password Change
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill in all password fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New password and confirm password do not match.");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters long.");
      return;
    }

    setIsUpdatingPassword(true);
    try {
      const res = await fetchRequest("/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to change password.");
      }

      toast.success("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error(error);
      toast.error((error as Error).message || "Could not change password.");
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  // Handle Google OAuth Connection / Reconnection
  const handleConnectGoogle = () => {
    const token = localStorage.getItem("jwt_token");
    if (!token) {
      toast.error("Authentication session missing. Please log in again.");
      return;
    }
    window.location.href = `/api/oauth/google/login?token=${encodeURIComponent(token)}`;
  };

  // Handle Google OAuth Disconnection
  const handleDisconnectGoogle = async () => {
    if (
      !confirm(
        "Are you sure you want to disconnect your Google account? You will not be able to dispatch bulk emails until reconnected.",
      )
    ) {
      return;
    }

    setIsDisconnectingGoogle(true);
    try {
      const res = await fetchRequest("/oauth/google/disconnect", {
        method: "POST",
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to disconnect Google account.");
      }

      toast.success("Google account disconnected successfully!");
      await refreshUser();
    } catch (error) {
      console.error(error);
      toast.error(
        (error as Error).message || "Could not disconnect Google account.",
      );
    } finally {
      setIsDisconnectingGoogle(false);
    }
  };

  return (
    <div className="space-y-8 pb-12 relative max-w-5xl mx-auto w-full">
      {/* Decorative ambient background glows */}
      <div className="absolute -top-20 left-1/4 w-80 h-80 rounded-full bg-violet-600/10 blur-[130px] pointer-events-none" />
      <div className="absolute top-60 right-10 w-72 h-72 rounded-full bg-indigo-600/5 blur-[110px] pointer-events-none" />

      {/* Header Banner */}
      <div className="border-b border-zinc-800/80 pb-5">
        <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
          <div className="p-2 rounded-xl bg-violet-600/10 text-violet-400 border border-violet-500/20 shadow-[0_0_15px_rgba(139,92,246,0.15)]">
            <UserIcon className="h-6 w-6" />
          </div>
          Account Settings
        </h1>
        <p className="text-sm text-zinc-400 mt-1">
          Manage your personal profile, security credentials, and Google Gmail
          API connections.
        </p>
      </div>

      <div className="grid gap-8">
        {/* Section 1: Profile Information */}
        <Card className="bg-zinc-900/30 backdrop-blur-md border-zinc-800/80 shadow-2xl">
          <CardHeader className="border-b border-zinc-850 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 bg-violet-500/10 text-violet-400 rounded-lg">
                <UserIcon className="h-4 w-4" />
              </div>
              <CardTitle className="text-lg font-bold text-white">
                Personal Profile
              </CardTitle>
            </div>
            <CardDescription className="text-zinc-400 text-sm">
              View account identity and update your public display name.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleUpdateProfile} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Account Email (Read-Only) */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5 text-zinc-500" />
                    Account Email
                  </label>
                  <Input
                    type="email"
                    value={user?.email || ""}
                    disabled
                    className="bg-zinc-950/80 border-zinc-800/80 text-zinc-400 cursor-not-allowed h-10 font-mono text-sm"
                  />
                  <p className="text-[11px] text-zinc-500">
                    Primary email address associated with your login session.
                  </p>
                </div>

                {/* Role Badge & Quota Summary */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                    <ShieldCheck className="h-3.5 w-3.5 text-zinc-500" />
                    Access Privilege Role
                  </label>
                  <div className="h-10 px-3.5 rounded-md border border-zinc-800/80 bg-zinc-950/80 flex items-center justify-between">
                    <span className="text-sm font-semibold capitalize text-violet-400">
                      {user?.role || "user"}
                    </span>
                    <span className="text-xs font-mono text-zinc-500 flex items-center gap-1">
                      <Zap className="h-3 w-3 text-emerald-400" />
                      {user?.remainingQuota ?? 500} /{" "}
                      {user?.dailyQuotaLimit ?? 500} emails remaining today
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-500">
                    Role enforced via JWT middleware proxy.
                  </p>
                </div>
              </div>

              {/* Display Name Input */}
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Display Name
                </label>
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter display name"
                  className="bg-zinc-950/60 border-zinc-800 text-zinc-100 focus-visible:ring-1 focus-visible:ring-violet-500/50 h-10 transition-colors"
                  required
                />
              </div>

              <div className="flex justify-end pt-2">
                <Button
                  type="submit"
                  disabled={isUpdatingProfile || name.trim() === user?.name}
                  className="bg-violet-600 hover:bg-violet-500 text-white font-semibold cursor-pointer shadow-lg shadow-violet-600/20 gap-2 h-10 px-5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUpdatingProfile ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Save Profile Changes
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Section 2: Security & Password */}
        <Card className="bg-zinc-900/30 backdrop-blur-md border-zinc-800/80 shadow-2xl">
          <CardHeader className="border-b border-zinc-850 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 bg-cyan-500/10 text-cyan-400 rounded-lg">
                <Lock className="h-4 w-4" />
              </div>
              <CardTitle className="text-lg font-bold text-white">
                Security & Password
              </CardTitle>
            </div>
            <CardDescription className="text-zinc-400 text-sm">
              Change your password using PBKDF2 salted hash encryption.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleChangePassword} className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Current Password
                </label>
                <Input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="bg-zinc-950/60 border-zinc-800 text-zinc-100 focus-visible:ring-1 focus-visible:ring-violet-500/50 h-10 transition-colors"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    New Password
                  </label>
                  <Input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="bg-zinc-950/60 border-zinc-800 text-zinc-100 focus-visible:ring-1 focus-visible:ring-violet-500/50 h-10 transition-colors"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    Confirm New Password
                  </label>
                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password"
                    className="bg-zinc-950/60 border-zinc-800 text-zinc-100 focus-visible:ring-1 focus-visible:ring-violet-500/50 h-10 transition-colors"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <Button
                  type="submit"
                  disabled={isUpdatingPassword}
                  className="bg-zinc-800 hover:bg-zinc-700 text-white font-semibold cursor-pointer border border-zinc-700/60 gap-2 h-10 px-5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUpdatingPassword ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Updating Password...
                    </>
                  ) : (
                    <>
                      <Lock className="h-4 w-4" />
                      Update Password
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Section 3: Google Gmail API Integration */}
        <Card className="bg-zinc-900/30 backdrop-blur-md border-zinc-800/80 shadow-2xl">
          <CardHeader className="border-b border-zinc-850 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 bg-emerald-500/10 text-emerald-400 rounded-lg">
                <Mail className="h-4 w-4" />
              </div>
              <CardTitle className="text-lg font-bold text-white">
                Google Gmail API Authorization
              </CardTitle>
            </div>
            <CardDescription className="text-zinc-400 text-sm">
              Manage your connected Google account used for bulk email campaign
              dispatches.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            {user?.googleConnected && user?.googleEmail ? (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/25 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
                      <CheckCircle2 className="h-5 w-5 shrink-0" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-bold text-white">
                          Connected Google Account
                        </h4>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[11px] font-semibold">
                          Active Sender
                        </span>
                      </div>
                      <p className="text-sm font-mono text-emerald-300 mt-0.5">
                        {user.googleEmail}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleConnectGoogle}
                      size="sm"
                      className="border-emerald-500/30 bg-emerald-950/40 text-emerald-300 hover:bg-emerald-900/50 hover:text-white cursor-pointer text-xs h-9 px-3 gap-1.5"
                    >
                      <RefreshCw className="h-3.5 w-3.5" />
                      Reconnect
                    </Button>

                    <Button
                      type="button"
                      variant="destructive"
                      onClick={handleDisconnectGoogle}
                      disabled={isDisconnectingGoogle}
                      size="sm"
                      className="bg-red-600/20 hover:bg-red-600 text-red-300 hover:text-white border border-red-500/30 font-semibold cursor-pointer text-xs h-9 px-3 gap-1.5 transition-all"
                    >
                      {isDisconnectingGoogle ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Unlink className="h-3.5 w-3.5" />
                      )}
                      Disconnect Account
                    </Button>
                  </div>
                </div>

                <div className="text-xs text-zinc-400 border-t border-emerald-500/20 pt-3">
                  OAuth 2.0 refresh tokens are stored using AES-256 encryption.
                  Access tokens are generated on demand during dispatches.
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/25 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
                      <AlertTriangle className="h-5 w-5 shrink-0" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-white">
                        No Google Account Connected
                      </h4>
                      <p className="text-xs text-zinc-400 mt-0.5">
                        Authorize your Gmail account to enable high-volume bulk
                        email campaign delivery.
                      </p>
                    </div>
                  </div>

                  <Button
                    type="button"
                    onClick={handleConnectGoogle}
                    className="bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold px-4 py-2 h-10 text-sm cursor-pointer shadow-md shadow-amber-500/20 shrink-0"
                  >
                    Connect Google Account
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
