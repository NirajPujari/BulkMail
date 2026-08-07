import Link from "next/link";
import { Mail, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-zinc-950 border-zinc-900 py-8">
      <div className="flex flex-col items-center justify-between gap-4 md:flex-row px-8 max-w-7xl mx-auto w-full text-sm text-zinc-500">
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center sm:text-left">
          <p>&copy; {new Date().getFullYear()} Dootx. All rights reserved.</p>
          <span className="hidden sm:inline text-zinc-800">•</span>
          <p className="flex items-center gap-1.5 text-zinc-400">
            <span>Developed by</span>
            <span className="font-semibold text-white">Niraj Pujari</span>
          </p>
        </div>

        {/* Contact & Navigation Links */}
        <div className="flex flex-wrap items-center justify-center gap-6">
          <a
            href="mailto:nirajrokx99@gmail.com"
            className="flex items-center gap-1.5 text-violet-400 hover:text-violet-300 font-medium transition-colors"
          >
            <Mail className="h-3.5 w-3.5" />
            <span>nirajrokx99@gmail.com</span>
          </a>
          <Link href="/about" className="hover:text-zinc-300 transition-colors">
            About
          </Link>
          <Link href="/contact" className="hover:text-zinc-300 transition-colors">
            Contact
          </Link>
          <Link href="/terms" className="hover:text-zinc-300 transition-colors">
            Terms
          </Link>
          <Link href="/privacy" className="hover:text-zinc-300 transition-colors">
            Privacy
          </Link>
        </div>
      </div>
    </footer>
  );
}
