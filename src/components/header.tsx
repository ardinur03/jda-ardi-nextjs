"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";

const baseNavLinks = [
  { href: "/#home", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/service", label: "Service" },
  { href: "/#project", label: "Project" },
  { href: "/faq", label: "FAQ" },
  { href: "/#kontak", label: "Kontak" },
  { href: "/admin/projects", label: "Admin" },
];

export function Header() {

  const pathname = usePathname();

  const navLinks = baseNavLinks.map(link => {
    if (pathname !== '/' && link.href.includes('/#')) {
      return { ...link, href: `/${link.href.slice(1)}` };
    }
    if (pathname === '/' && link.href.includes('/#')) {
      return { ...link, href: link.href.replace('/#', '#') };
    }
    return link;
  });

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur-lg"
      )}
    >
      <div className="container mx-auto flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo />

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-6 md:flex">
          <nav className="flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-1">
            <ThemeToggle />
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent>
              <div className="flex h-full flex-col">
                <div className="border-b p-4">
                  <Logo />
                </div>
                <nav className="flex flex-1 flex-col gap-4 p-4">
                  {navLinks.map((link) => (
                    <SheetClose asChild key={link.href}>
                      <Link
                        href={link.href}
                        className="rounded-md p-2 text-lg font-medium text-foreground/80 transition-colors hover:bg-muted hover:text-foreground"
                      >
                        {link.label}
                      </Link>
                    </SheetClose>
                  ))}
                </nav>
                <div className="mt-auto flex items-center justify-start gap-2 border-t p-4">
                  <ThemeToggle />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
