import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t bg-zinc-950 border-zinc-900 py-6">
      <div className="flex flex-col items-center justify-between gap-4 md:h-12 md:flex-row px-8 max-w-7xl mx-auto w-full">
        <p className="text-center text-sm text-zinc-500 md:text-left">
          &copy; {new Date().getFullYear()} Dootx. All rights reserved.
        </p>
        <div className="flex items-center gap-4 text-sm text-zinc-500">
          <Link href="/terms" className="hover:underline hover:text-zinc-300 underline-offset-4">
            Terms
          </Link>
          <Link href="/privacy" className="hover:underline hover:text-zinc-300 underline-offset-4">
            Privacy
          </Link>
        </div>
      </div>
    </footer>
  );
}
