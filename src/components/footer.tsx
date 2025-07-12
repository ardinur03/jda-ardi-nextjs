"use client";

import Link from "next/link";
import { ArrowUp } from "lucide-react";
import { Button } from "./ui/button";
import { Logo } from "./logo";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-border bg-background text-foreground">
      <div className="container mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center gap-8 text-center md:flex-row md:justify-between md:text-left">
          <div className="flex flex-col items-center gap-4 md:items-start">
            <Logo />
            <p className="max-w-sm text-muted-foreground">
              Membantu Anda membangun solusi digital yang kreatif dan inovatif untuk bisnis Anda.
            </p>
          </div>
        </div>

        <div className="mt-12 flex flex-col-reverse items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; {currentYear} Build With Zelo. All rights reserved.
          </p>
          <Button variant="ghost" asChild>
            <Link href="#home" aria-label="Back to top">
              <ArrowUp className="mr-2 h-4 w-4" /> Kembali ke atas
            </Link>
          </Button>
        </div>
      </div>
    </footer>
  );
}
