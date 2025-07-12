"use client";

import Image from "next/image";

export function About() {
  return (
    <section id="tentang" className="w-full bg-secondary py-16 sm:py-24">
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
            Tentsng
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            We are a passionate and results-driven team of developers with a
            keen eye for design and a commitment to writing clean, efficient,
            and maintainable code. With experience in both frontend and
            backend technologies, we enjoy bringing ideas to life from
            concept to deployment.
          </p>
          <p className="mt-4 text-muted-foreground">
            Our journey into web development started with a fascination for
            how websites work, which quickly grew into a full-fledged passion.
            We are constantly learning and exploring new technologies to stay
            at the forefront of the ever-evolving web landscape. We are
            dedicated to delivering exceptional digital solutions.
          </p>
        </div>
      </div>
    </section>
  );
}
