"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowLeft, RefreshCw, Loader2 } from "lucide-react";

function GoogleOAuthErrorContent() {
  const searchParams = useSearchParams();
  const rawMessage = searchParams.get("message");
  const errorMessage = rawMessage
    ? decodeURIComponent(rawMessage)
    : "An unexpected error occurred while authorizing your Google account.";

  return (
    <Card className="max-w-md w-full bg-zinc-900/90 border-zinc-800 text-center shadow-2xl">
      <CardContent className="pt-8 pb-8 space-y-6">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 border border-red-500/30 text-red-400">
          <AlertCircle className="h-9 w-9" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Connection Failed
          </h1>
          <p className="text-red-400/90 leading-relaxed max-w-sm mx-auto bg-red-500/5 p-3 rounded-lg border border-red-500/20 font-mono text-sm">
            {errorMessage}
          </p>
        </div>

        <div className="pt-2 flex flex-col gap-3">
          <Link href="/dashboard">
            <Button className="w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold py-3 text-sm cursor-pointer">
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again from Dashboard
            </Button>
          </Link>

          <Link href="/dashboard">
            <Button
              variant="ghost"
              className="w-full text-zinc-400 hover:text-white text-sm cursor-pointer"
            >
              <ArrowLeft className="mr-2 h-3.5 w-3.5" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export default function GoogleOAuthErrorPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center p-4">
      <Suspense
        fallback={
          <div className="flex justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
          </div>
        }
      >
        <GoogleOAuthErrorContent />
      </Suspense>
    </div>
  );
}
