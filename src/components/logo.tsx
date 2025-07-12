"use client";

import Link from "next/link";
import Image from "next/image";

export function Logo() {
  const logoSrc = "/images/logo.png";

  return (
    <Link href="/" className="flex items-center gap-2">
      <div className="relative h-8 w-8">
        <Image
          src={logoSrc}
          alt="Zelo Logo"
          width={32}
          height={32}
          className="object-contain"
          key={logoSrc}
        />
      </div>
      <span className="hidden font-headline text-lg font-bold text-foreground sm:inline-block">
        Build With Zelo
      </span>
    </Link>
  );
}
