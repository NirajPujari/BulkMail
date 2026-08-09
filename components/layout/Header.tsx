"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Bell,
  Mail,
  LogOut,
  LayoutDashboard,
  Shield,
  Settings,
  BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/Auth";
import { usePathname } from "next/navigation";

const PUBLIC_ROUTES = [
  "/",
  "/about",
  "/contact",
  "/privacy",
  "/terms",
  "/login",
  "/signup",
  "/forgot-password",
  "/setup-account",
  "/oauth/google/success",
  "/oauth/google/error",
];

function isPublicRoute(pathname: string) {
  if (PUBLIC_ROUTES.includes(pathname)) {
    return true;
  }

  // Keep all Google OAuth callback pages public
  if (pathname.startsWith("/oauth/google/")) {
    return true;
  }

  return false;
}

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const publicPage = isPublicRoute(pathname);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300 border-b",
        isScrolled
          ? "bg-zinc-950/80 backdrop-blur-md text-zinc-100 border-zinc-800/80 shadow-lg"
          : "bg-zinc-950 text-zinc-100 border-zinc-900",
      )}
    >
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-6">
        {/* =========================================================
            PUBLIC HEADER
            Visible on:
            /
            /about
            /contact
            /privacy
            /terms
            /login
            /signup
            etc.
        ========================================================= */}

        {publicPage ? (
          <>
            {/* Brand + Public Navigation */}
            <div className="flex items-center gap-8">
              <Link
                href="/"
                className="flex items-center gap-2.5 font-bold text-white tracking-tight text-lg"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600 text-white">
                  <Mail className="h-4 w-4" />
                </div>

                <span>DootX</span>
              </Link>

              <nav className="hidden md:flex items-center space-x-6 text-sm font-medium text-zinc-400">
                <Link
                  href="/about"
                  className="hover:text-white transition-colors"
                >
                  About
                </Link>

                <Link
                  href="/contact"
                  className="hover:text-white transition-colors"
                >
                  Contact
                </Link>

                <Link
                  href="/privacy"
                  className="hover:text-white transition-colors"
                >
                  Privacy
                </Link>

                <Link
                  href="/terms"
                  className="hover:text-white transition-colors"
                >
                  Terms
                </Link>
              </nav>
            </div>

            {/* Public Header Right Side */}
            <div className="flex items-center gap-3">
              {!user && (
                <>
                  <Link
                    href="/login"
                    className="hidden sm:inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium text-zinc-300 hover:bg-zinc-900 hover:text-white transition-colors"
                  >
                    Sign In
                  </Link>

                  <Link
                    href="/signup"
                    className="inline-flex items-center justify-center rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-500 transition-colors"
                  >
                    Get Started
                  </Link>
                </>
              )}

              {user && (
                <Link
                  href="/dashboard"
                  className="inline-flex items-center justify-center rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-500 transition-colors"
                >
                  Dashboard
                </Link>
              )}
            </div>
          </>
        ) : (
          /* =========================================================
             PROTECTED HEADER
             Only DootX + user controls
          ========================================================= */
          <>
            {/* DootX Home Button + Protected Navigation */}
            <div className="flex items-center gap-8">
              <Link
                href="/"
                className="group flex items-center gap-2.5 font-bold text-white tracking-tight text-lg"
                title="Back to DootX home"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600 text-white transition-colors group-hover:bg-violet-500">
                  <Mail className="h-4 w-4" />
                </div>

                <span className="group-hover:text-violet-300 transition-colors">
                  DootX
                </span>
              </Link>

              <nav className="hidden md:flex items-center space-x-6 text-sm font-medium text-zinc-400">
                <Link
                  href="/dashboard"
                  className={cn(
                    "flex items-center gap-1.5 transition-colors hover:text-white",
                    pathname === "/dashboard"
                      ? "text-violet-400 font-semibold"
                      : "",
                  )}
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Link>

                <Link
                  href="/analytics"
                  className={cn(
                    "flex items-center gap-1.5 transition-colors hover:text-white",
                    pathname.startsWith("/analytics") ||
                      pathname.includes("/campaigns/")
                      ? "text-violet-400 font-semibold"
                      : "",
                  )}
                >
                  <BarChart3 className="h-4 w-4" />
                  Analytics
                </Link>

                <Link
                  href="/settings"
                  className={cn(
                    "flex items-center gap-1.5 transition-colors hover:text-white",
                    pathname === "/settings"
                      ? "text-violet-400 font-semibold"
                      : "",
                  )}
                >
                  <Settings className="h-4 w-4" />
                  Settings
                </Link>
              </nav>
            </div>

            {/* Protected Page Right Actions */}
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <button
                type="button"
                className="relative rounded-full p-2 text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100 transition-colors focus:outline-none cursor-pointer"
              >
                <Bell className="size-5" />

                <span className="absolute right-1.5 top-1.5 flex h-2 w-2 rounded-full bg-destructive" />

                <span className="sr-only">Notifications</span>
              </button>

              {/* User Menu */}
              {user && (
                <DropdownMenu>
                  <DropdownMenuTrigger className="rounded-full overflow-hidden hover:bg-zinc-900 p-0.5 outline-none cursor-pointer border border-zinc-800">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-zinc-800 text-zinc-100 font-semibold text-sm">
                        {user?.name
                          ? user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()
                          : "US"}
                      </AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent
                    align="end"
                    className="w-56 mt-2 bg-zinc-900 border border-zinc-800 text-zinc-100"
                  >
                    {/* User Information */}
                    <div className="flex flex-col space-y-1 p-2">
                      <p className="text-sm font-medium leading-none text-zinc-200">
                        {user?.name}
                      </p>

                      <p className="text-sm leading-none text-zinc-500">
                        {user?.email}
                      </p>
                    </div>

                    <DropdownMenuSeparator className="bg-zinc-800" />

                    <DropdownMenuGroup>
                      {/* Dashboard */}
                      <DropdownMenuItem className="p-0 hover:bg-zinc-800 focus:bg-zinc-800">
                        <Link
                          href="/dashboard"
                          className="flex w-full items-center px-2 py-1.5 cursor-pointer text-zinc-300 hover:text-white"
                        >
                          <LayoutDashboard className="mr-2 h-4 w-4" />
                          Dashboard
                        </Link>
                      </DropdownMenuItem>

                      {/* Settings */}
                      <DropdownMenuItem className="p-0 hover:bg-zinc-800 focus:bg-zinc-800">
                        <Link
                          href="/settings"
                          className="flex w-full items-center px-2 py-1.5 cursor-pointer text-zinc-300 hover:text-white"
                        >
                          <Settings className="mr-2 h-4 w-4" />
                          Account Settings
                        </Link>
                      </DropdownMenuItem>

                      {/* Admin */}
                      {user?.role === "admin" && (
                        <DropdownMenuItem className="p-0 hover:bg-zinc-800 focus:bg-zinc-800">
                          <Link
                            href="/admin"
                            className="flex w-full items-center px-2 py-1.5 cursor-pointer text-violet-400 hover:text-violet-300 font-medium"
                          >
                            <Shield className="mr-2 h-4 w-4 text-violet-400" />
                            Admin Control Center
                          </Link>
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuGroup>

                    <DropdownMenuSeparator className="bg-zinc-800" />

                    {/* Logout */}
                    <DropdownMenuItem
                      className="text-destructive focus:bg-destructive/10 cursor-pointer hover:bg-destructive/10"
                      onClick={handleLogout}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </>
        )}
      </div>
    </header>
  );
}
