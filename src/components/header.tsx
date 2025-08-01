
"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, LogIn, LogOut } from "lucide-react";
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
import { signIn, signOut, useSession } from "next-auth/react";

const navLinksRaw = [
  { href: "/#home", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/#projects", label: "Projects" },
  { href: "/faq", label: "FAQ" },
  { 
    label: "Admin",
    auth: true, 
    role: "ADMIN",
    href: "/admin/dashboard",
  },
   { 
    label: "Dashboard",
    auth: true, 
    role: "MEMBER",
    href: "/dashboard",
  },
  { href: "/#contact", label: "Contact" },
];


export function Header() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const getNavLinks = (isMobile: boolean) => {
    return navLinksRaw
      .filter(link => {
        if (pathname.startsWith('/admin') || pathname.startsWith('/dashboard')) return false;
        if (!link.auth) return true;
        if (!session) return false;
        if (link.role) return session.user.role === link.role;
        return true;
      })
      .map(link => {
          const processHref = (href: string) => {
              if (isMobile) {
                if (pathname !== '/' && href.includes('/#')) {
                    return `/${href.slice(1)}`;
                }
                if (pathname === '/' && href.includes('/#')) {
                    return href.replace('/#', '#');
                }
              }
              return href;
          };
          
          if (link.href) {
            return {...link, href: processHref(link.href)};
          }
          return link;
    });
  };

  const desktopNavLinks = getNavLinks(false);
  const mobileNavLinks = getNavLinks(true);


  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur-lg",
         (pathname.startsWith('/admin') || pathname.startsWith('/dashboard')) && "hidden"
      )}
    >
      <div className="container mx-auto flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo />

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-6 md:flex">
          <nav className="flex items-center gap-6">
            {desktopNavLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href!}
                  className="text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
                >
                  {link.label}
                </Link>
            ))}
          </nav>
          <div className="flex items-center gap-1">
            {session ? (
                <Button variant="ghost" size="icon" onClick={() => signOut()}>
                    <LogOut />
                </Button>
            ) : (
                <Button variant="ghost" size="icon" onClick={() => signIn()}>
                    <LogIn />
                </Button>
            )}
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
                  {mobileNavLinks.map((link) => (
                    <SheetClose asChild key={link.href}>
                        <Link
                            href={link.href!}
                            className="rounded-md p-2 text-lg font-medium text-foreground/80 transition-colors hover:bg-muted hover:text-foreground"
                        >
                            {link.label}
                        </Link>
                    </SheetClose>
                  ))}
                </nav>
                <div className="mt-auto flex items-center justify-start gap-2 border-t p-4">
                    {session ? (
                        <Button onClick={() => signOut()} className="w-full">Logout</Button>
                    ) : (
                         <Button onClick={() => signIn()} className="w-full">Login</Button>
                    )}
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
