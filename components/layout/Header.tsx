"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, Mail, LogOut, LayoutDashboard } from "lucide-react";
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

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, logout } = useAuth();
  const pathname = usePathname();

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
    return () => window.removeEventListener("scroll", handleScroll);
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
      <div className="flex h-16 items-center justify-between px-6 max-w-7xl mx-auto w-full">
        {/* Brand/Logo */}
        <div className="flex items-center space-x-6">
          <Link href="/dashboard" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-600 text-white group-hover:bg-violet-500 transition-colors shadow-[0_0_15px_rgba(139,92,246,0.3)]">
              <Mail className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white group-hover:text-zinc-200 transition-colors">
              Bulkmail
            </span>
          </Link>
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-4">
          <button
            type="button"
            className="relative rounded-full p-2 text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100 transition-colors focus:outline-none cursor-pointer"
          >
            <Bell className="size-5" />
            <span className="absolute right-1.5 top-1.5 flex h-2 w-2 rounded-full bg-destructive"></span>
            <span className="sr-only">Notifications</span>
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger className="rounded-full overflow-hidden hover:bg-zinc-900 p-0.5 outline-none cursor-pointer border border-zinc-800">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-zinc-800 text-zinc-100 font-semibold text-xs">
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
            <DropdownMenuContent align="end" className="w-56 mt-2 bg-zinc-900 border border-zinc-800 text-zinc-100">
              <div className="flex flex-col space-y-1 p-2">
                <p className="text-sm font-medium leading-none text-zinc-200">{user?.name}</p>
                <p className="text-xs leading-none text-zinc-500">
                  {user?.email}
                </p>
              </div>
              <DropdownMenuSeparator className="bg-zinc-800" />
              <DropdownMenuGroup>
                <DropdownMenuItem className="p-0 hover:bg-zinc-800 focus:bg-zinc-800">
                  <Link
                    href="/dashboard"
                    className="flex w-full items-center px-2 py-1.5 cursor-pointer text-zinc-300 hover:text-white"
                  >
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator className="bg-zinc-800" />
              <DropdownMenuItem
                className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer hover:bg-destructive/10"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
