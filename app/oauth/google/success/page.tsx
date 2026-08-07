"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowRight, Loader2 } from "lucide-react";

function GoogleOAuthSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const jwt = searchParams.get("jwt");

  useEffect(() => {
    if (jwt) {
      localStorage.setItem("jwt_token", jwt);
    }
    const timer = setTimeout(() => {
      if (jwt) {
        window.location.href = "/dashboard";
      } else {
        router.push("/dashboard");
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [jwt, router]);

  return (
    <Card className="max-w-md w-full bg-zinc-900/90 border-zinc-800 text-center shadow-2xl">
      <CardContent className="pt-8 pb-8 space-y-6">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
          <CheckCircle2 className="h-9 w-9" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-white">
            {jwt ? "Successfully Authenticated" : "Google Account Connected"}
          </h1>
          <p className="text-zinc-400 text-sm leading-relaxed">
            {jwt
              ? "You have successfully signed in with Google. Redirecting to your dashboard..."
              : "Google account connected successfully. You can now send bulk email campaigns directly using your Gmail address."}
          </p>
        </div>

        <div className="pt-2">
          <p className="text-xs text-zinc-500 mb-4 animate-pulse">
            Redirecting to dashboard in a moment...
          </p>

          <Link href="/dashboard">
            <Button className="w-full bg-violet-600 hover:bg-violet-500 text-white font-bold py-3 text-sm cursor-pointer shadow-lg shadow-violet-600/20">
              Return to Dashboard Now
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export default function GoogleOAuthSuccessPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center p-4">
      <Suspense
        fallback={
          <div className="flex justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
          </div>
        }
      >
        <GoogleOAuthSuccessContent />
      </Suspense>
    </div>
  );
}
