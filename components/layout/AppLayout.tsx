"use client";

import { useAuth } from "@/context/Auth";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { Mail } from "lucide-react";

const AUTH_PAGES = ["/login", "/signup", "/forgot-password", "/setup-account"];

const PUBLIC_ROUTES = [
  "/",
  ...AUTH_PAGES,
  "/oauth/google/success",
  "/oauth/google/error",
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const setMou = () => {
      setMounted(true);
    };
    setMou();
  }, []);

  const isAuthPage = AUTH_PAGES.includes(pathname);
  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

  useEffect(() => {
    if (loading || !mounted) return;

    // Redirect unauthenticated users away from protected pages
    if (!user && !isPublicRoute) {
      router.replace("/login");
      return;
    }

    // Redirect authenticated users away from auth pages
    if (user && isAuthPage) {
      router.replace("/dashboard");
    }
  }, [user, loading, mounted, isAuthPage, isPublicRoute, router]);

  // Prevent hydration mismatch
  if (!mounted) {
    return <LoadingScreen />;
  }

  // Wait until auth restoration completes
  if (loading) {
    return <LoadingScreen />;
  }

  // While redirecting from protected pages
  if (!user && !isPublicRoute) {
    return <LoadingScreen />;
  }

  // While redirecting authenticated users away from auth pages
  if (user && isAuthPage) {
    return <LoadingScreen />;
  }

  // Public pages (Landing, Login, Signup, Forgot Password, Setup Account, OAuth pages)
  if (isPublicRoute) {
    return (
      <main className="flex min-h-screen flex-col bg-zinc-950 text-zinc-100">
        {children}
      </main>
    );
  }

  // Protected application layout
  return (
    <div className="relative flex min-h-screen flex-col bg-zinc-950 text-zinc-100">
      <Header />

      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 py-8">
        {children}
      </main>

      <Footer />
    </div>
  );
}

const LoadingScreen = () => (
  <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 text-white">
    <div className="relative flex flex-col items-center">
      <div className="absolute -inset-4 rounded-full bg-violet-600/10 blur-xl animate-pulse" />

      <div className="relative flex h-16 w-16 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900 shadow-[0_0_30px_rgba(139,92,246,0.15)] animate-bounce">
        <Mail className="h-8 w-8 animate-pulse text-violet-400" />
      </div>

      <h2 className="mt-6 text-sm font-semibold uppercase tracking-widest text-zinc-400 animate-pulse">
        Loading Bulkmail
      </h2>
    </div>
  </div>
);
