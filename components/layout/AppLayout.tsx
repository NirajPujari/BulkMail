"use client";

import { useAuth } from "@/context/Auth";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { Mail } from "lucide-react";

const AUTH_PAGES = [
  "/login",
  "/signup",
  "/forgot-password",
  "/setup-account",
  "/reset-password",
];

const PUBLIC_ROUTES = [
  "/",
  "/about",
  "/contact",
  "/privacy",
  "/terms",

  ...AUTH_PAGES,

  "/oauth/google/success",
  "/oauth/google/error",
];

function isPublicRoute(pathname: string) {
  // Exact public routes
  if (PUBLIC_ROUTES.includes(pathname)) {
    return true;
  }

  // Public OAuth routes
  if (pathname.startsWith("/oauth/google/")) {
    return true;
  }

  return false;
}

function isAuthPage(pathname: string) {
  return AUTH_PAGES.includes(pathname);
}

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const publicRoute = isPublicRoute(pathname);
  const authPage = isAuthPage(pathname);

  useEffect(() => {
    if (!mounted || loading) return;

    // --------------------------------------------------
    // 1. PROTECTED ROUTE
    // --------------------------------------------------
    // User is not logged in and is trying to access
    // anything that is not explicitly public.
    //
    // Example:
    // /dashboard
    // /settings
    // /admin
    //
    // -> redirect to login
    // --------------------------------------------------

    if (!user && !publicRoute) {
      router.replace("/login");
      return;
    }

    // --------------------------------------------------
    // 2. AUTH PAGE
    // --------------------------------------------------
    // User is already logged in but tries to access:
    // /login
    // /signup
    // etc.
    //
    // -> redirect to dashboard
    // --------------------------------------------------

    if (user && authPage) {
      router.replace("/dashboard");
    }
  }, [user, loading, mounted, publicRoute, authPage, router]);

  // --------------------------------------------------
  // Prevent hydration mismatch
  // --------------------------------------------------

  if (!mounted) {
    return <LoadingScreen />;
  }

  // --------------------------------------------------
  // Wait for authentication state to restore
  // --------------------------------------------------

  if (loading) {
    return <LoadingScreen />;
  }

  // --------------------------------------------------
  // Unauthenticated user trying to access a protected
  // route. Redirect is happening in the effect above.
  // --------------------------------------------------

  if (!user && !publicRoute) {
    return <LoadingScreen />;
  }

  // --------------------------------------------------
  // Authenticated user trying to access an auth page.
  // Redirect is happening in the effect above.
  // --------------------------------------------------

  if (user && authPage) {
    return <LoadingScreen />;
  }

  // --------------------------------------------------
  // PUBLIC ROUTES
  // --------------------------------------------------
  //
  // These pages are accessible directly without login.
  //
  // /
  // /about
  // /contact
  // /privacy
  // /terms
  // /login
  // /signup
  // /forgot-password
  // /setup-account
  // /oauth/google/*
  //
  // They don't get the protected application layout.
  // --------------------------------------------------

  if (publicRoute && authPage) {
    return <>{children}</>;
  }

  if (publicRoute) {
    return (
      <>
        <Header />
        <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 py-8">
          {children}
        </main>
        <Footer />
      </>
    );
  }

  // --------------------------------------------------
  // PROTECTED ROUTES
  // --------------------------------------------------
  //
  // At this point:
  //
  // user === authenticated
  // publicRoute === false
  //
  // Therefore the page is protected.
  // --------------------------------------------------

  return (
    <div className="min-h-screen flex flex-col bg-zinc-950 text-zinc-100">
      <Header />

      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 py-8">
        {children}
      </main>
    </div>
  );
}

const LoadingScreen = () => (
  <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center justify-center">
    <div className="relative flex h-16 w-16 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900 shadow-[0_0_30px_rgba(139,92,246,0.15)] animate-bounce">
      <Mail className="h-8 w-8 animate-pulse text-violet-400" />
    </div>

    <h2 className="mt-6 text-sm font-semibold uppercase tracking-widest text-zinc-400 animate-pulse">
      Loading Dootx
    </h2>
  </div>
);
