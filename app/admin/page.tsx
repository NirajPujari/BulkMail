"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/Auth";
import { fetchRequest } from "@/lib/api";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Users,
  Mail,
  Send,
  Activity,
  Shield,
  Search,
  Trash2,
  RefreshCw,
  UserCheck,
  UserX,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { AdminStats, AdminUser } from "@/types/admin";

export default function AdminDashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [stats, setStats] = useState<AdminStats | null>(null);
  const [usersList, setUsersList] = useState<AdminUser[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Redirect non-admin users
  useEffect(() => {
    if (!authLoading) {
      if (!user || user.role !== "admin") {
        toast.error("Access denied: Admin privileges required");
        router.push("/dashboard");
      }
    }
  }, [user, authLoading, router]);

  const fetchData = async () => {
    try {
      const [statsRes, usersRes] = await Promise.all([
        fetchRequest("/admin/stats"),
        fetchRequest("/admin/users"),
      ]);

      if (!statsRes.ok || !usersRes.ok) {
        throw new Error("Failed to load admin data");
      }

      const statsData = await statsRes.json();
      const usersData = await usersRes.json();

      setStats(statsData);
      setUsersList(usersData);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load admin dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshData = async () => {
    setLoading(true);
    await fetchData();
  };

  useEffect(() => {
    if (user && user.role === "admin") {
      const setAdmin = () => {
        fetchData();
      };
      setAdmin();
    }
  }, [user]);

  const handleToggleRole = async (targetUser: AdminUser) => {
    if (targetUser.id === user?.userId) {
      toast.error("You cannot change your own admin role");
      return;
    }

    const newRole = targetUser.role === "admin" ? "user" : "admin";
    setUpdatingId(targetUser.id);

    try {
      const res = await fetchRequest("/admin/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: targetUser.id, role: newRole }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to update role");
      }

      toast.success(`Updated ${targetUser.name}'s role to ${newRole}`);
      setUsersList((prev) =>
        prev.map((u) => (u.id === targetUser.id ? { ...u, role: newRole } : u)),
      );
    } catch (error) {
      console.log(error);
      toast.error("Could not update user role");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteUser = async (targetUser: AdminUser) => {
    if (targetUser.id === user?.userId) {
      toast.error("You cannot delete your own admin account");
      return;
    }

    if (
      !confirm(
        `Are you sure you want to delete user "${targetUser.name}" (${targetUser.email})? This action is permanent.`,
      )
    ) {
      return;
    }

    setDeletingId(targetUser.id);

    try {
      const res = await fetchRequest(`/admin/users?id=${targetUser.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to delete user");
      }

      toast.success(`User ${targetUser.name} deleted successfully`);
      setUsersList((prev) => prev.filter((u) => u.id !== targetUser.id));
      fetchData();
    } catch (error) {
      console.log(error);
      toast.error("Could not delete user");
    } finally {
      setDeletingId(null);
    }
  };

  const filteredUsers = usersList.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  if (authLoading || !user || user.role !== "admin") {
    return (
      <AppLayout>
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-8 max-w-7xl mx-auto py-6 px-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-violet-500" />
              <h1 className="text-2xl font-bold tracking-tight text-white">
                Admin Control Center
              </h1>
            </div>
            <p className="text-sm text-zinc-400 mt-1">
              Manage platform users, permissions, and monitor bulk mail
              operations.
            </p>
          </div>

          <Button
            onClick={handleRefreshData}
            variant="outline"
            disabled={loading}
            className="border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 cursor-pointer self-start sm:self-auto"
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`}
            />
            Refresh Telemetry
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-zinc-900/90 border-zinc-800 text-zinc-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-zinc-400">
                Total Users
              </CardTitle>
              <Users className="h-4 w-4 text-violet-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {stats?.totalUsers ?? "-"}
              </div>
              <p className="text-sm text-zinc-500 mt-1">
                Registered platform accounts
              </p>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900/90 border-zinc-800 text-zinc-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-zinc-400">
                Total Campaigns
              </CardTitle>
              <Mail className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {stats?.totalCampaigns ?? "-"}
              </div>
              <p className="text-sm text-zinc-500 mt-1">
                Created email dispatch jobs
              </p>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900/90 border-zinc-800 text-zinc-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-zinc-400">
                Total Delivered
              </CardTitle>
              <Send className="h-4 w-4 text-emerald-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {stats?.totalEmailsSent ?? "-"}
              </div>
              <p className="text-sm text-zinc-500 mt-1">
                Transmitted email messages
              </p>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900/90 border-zinc-800 text-zinc-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-zinc-400">
                Active Jobs
              </CardTitle>
              <Activity className="h-4 w-4 text-amber-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {stats?.activeCampaigns ?? "-"}
              </div>
              <p className="text-sm text-zinc-500 mt-1">
                Currently running in background
              </p>
            </CardContent>
          </Card>
        </div>

        {/* User Management Section */}
        <Card className="bg-zinc-900/90 border-zinc-800 text-zinc-100">
          <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="text-lg font-semibold text-white">
                User Management
              </CardTitle>
              <p className="text-sm text-zinc-400 mt-1">
                View user profiles, assign administrative roles, or revoke
                access.
              </p>
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
              <Input
                placeholder="Search user by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-zinc-950 border-zinc-800 text-zinc-500 text-sm"
              />
            </div>
          </CardHeader>

          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-zinc-800 text-zinc-400 font-medium">
                    <th className="py-3 px-4">User</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Campaigns</th>
                    <th className="py-3 px-4">Joined</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60">
                  {loading ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="py-8 text-center text-zinc-500"
                      >
                        <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2 text-violet-500" />
                        Fetching user records...
                      </td>
                    </tr>
                  ) : filteredUsers.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="py-8 text-center text-zinc-500"
                      >
                        No users found matching &quot;{searchQuery}&quot;
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((u) => (
                      <tr
                        key={u.id}
                        className="hover:bg-zinc-800/30 transition-colors"
                      >
                        <td className="py-3.5 px-4">
                          <div className="font-medium text-white">{u.name}</div>
                          <div className="text-sm text-zinc-400">{u.email}</div>
                        </td>
                        <td className="py-3.5 px-4">
                          {u.role === "admin" ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-violet-500/10 border border-violet-500/30 px-2.5 py-0.5 text-sm font-medium text-violet-400">
                              <Shield className="h-3 w-3" />
                              Admin
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full bg-zinc-800 px-2.5 py-0.5 text-sm font-medium text-zinc-300">
                              User
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-zinc-300 font-medium">
                          {u.campaignCount}
                        </td>
                        <td className="py-3.5 px-4 text-zinc-400 text-sm">
                          {new Date(u.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-3.5 px-4 text-right space-x-2">
                          {/* Role Toggle Button */}
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={
                              updatingId === u.id || u.id === user.userId
                            }
                            onClick={() => handleToggleRole(u)}
                            className="border-zinc-800 bg-zinc-950 hover:bg-zinc-800 text-sm text-zinc-300 cursor-pointer"
                          >
                            {updatingId === u.id ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : u.role === "admin" ? (
                              <>
                                <UserX className="mr-1 h-3.5 w-3.5 text-amber-400" />
                                Demote to User
                              </>
                            ) : (
                              <>
                                <UserCheck className="mr-1 h-3.5 w-3.5 text-violet-400" />
                                Make Admin
                              </>
                            )}
                          </Button>

                          {/* Delete Button */}
                          <Button
                            size="sm"
                            variant="destructive"
                            disabled={
                              deletingId === u.id || u.id === user.userId
                            }
                            onClick={() => handleDeleteUser(u)}
                            className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-sm cursor-pointer"
                          >
                            {deletingId === u.id ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <Trash2 className="h-3.5 w-3.5" />
                            )}
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
