"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";

export function About() {
  return (
    <section id="about" className="w-full bg-secondary py-16 sm:py-24">
      <div className="container mx-auto grid max-w-7xl grid-cols-1 gap-12 px-4 md:grid-cols-2 md:gap-24 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-center">
          <div className="relative">
            <Image
              src="/images/about-zelo.svg"
              alt="About me image"
              width={600}
              height={600}
              className="object-cover"
              data-ai-hint="developer workspace"
            />
            <div className="absolute -bottom-4 -right-4 h-full w-full rounded-xl border-2 border-border -z-10"></div>
          </div>
        </div>
        <div className="flex flex-col justify-center">
          <h2 className="font-headline text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            About Build With Zelo
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Kami adalah tim pengembang yang bersemangat dan berorientasi pada hasil, dengan kejelian dalam desain dan komitmen untuk menulis kode yang bersih, efisien, dan mudah maintain.
          </p>
           <Button
            size="lg"
            className="mt-8 w-fit shadow-lg transition-shadow hover:shadow-xl"
            asChild
          >
            <Link href="/about">Lihat lebih lanjut</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
