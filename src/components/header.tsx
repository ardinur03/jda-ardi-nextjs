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

const navLinksRaw = [
  { href: "/#home", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/service", label: "Services" },
  { href: "/#projects", label: "Projects" },
  { href: "/faq", label: "FAQ" },
  { 
    label: "Admin", 
    subLinks: [
        { href: "/admin/projects", label: "Manage Projects" },
        { href: "/admin/testimonials", label: "Manage Testimonials" },
    ]
  },
  { href: "/#contact", label: "Contact" },
];


export function Header() {
  const pathname = usePathname();

  const mobileNavLinks = navLinksRaw.map(link => {
    const processHref = (href: string) => {
        if (pathname !== '/' && href.includes('/#')) {
            return `/${href.slice(1)}`;
        }
        if (pathname === '/' && href.includes('/#')) {
            return href.replace('/#', '#');
        }
        return href;
    };
    if (link.subLinks) {
        return {...link, subLinks: link.subLinks.map(sl => ({...sl, href: processHref(sl.href)}))};
    }
    return {...link, href: processHref(link.href!)};
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
            {navLinksRaw.map((link) => (
              link.subLinks ? (
                <div key={link.label} className="relative group">
                  <span className="cursor-pointer text-sm font-medium text-foreground/80 transition-colors hover:text-foreground">
                    {link.label}
                  </span>
                  <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-popover text-popover-foreground opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                    <div className="py-1">
                      {link.subLinks.map(subLink => (
                        <Link
                          key={subLink.href}
                          href={subLink.href}
                          className="block px-4 py-2 text-sm text-foreground/80 hover:bg-muted hover:text-foreground"
                        >
                          {subLink.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  key={link.href}
                  href={link.href!}
                  className="text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
                >
                  {link.label}
                </Link>
              )
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
                  {mobileNavLinks.map((link) => (
                    link.subLinks ? (
                        <div key={link.label}>
                            <p className="p-2 text-lg font-medium text-foreground/60">{link.label}</p>
                            <div className="flex flex-col pl-4">
                                {link.subLinks.map(subLink => (
                                    <SheetClose asChild key={subLink.href}>
                                        <Link
                                            href={subLink.href}
                                            className="rounded-md p-2 text-lg font-medium text-foreground/80 transition-colors hover:bg-muted hover:text-foreground"
                                        >
                                            {subLink.label}
                                        </Link>
                                    </SheetClose>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <SheetClose asChild key={link.href}>
                            <Link
                                href={link.href!}
                                className="rounded-md p-2 text-lg font-medium text-foreground/80 transition-colors hover:bg-muted hover:text-foreground"
                            >
                                {link.label}
                            </Link>
                        </SheetClose>
                    )
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
