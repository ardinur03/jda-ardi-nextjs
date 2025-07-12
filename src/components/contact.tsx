"use client";

import { Mail, Linkedin, Github } from "lucide-react";
import Link from "next/link";
import { Card } from "./ui/card";

const icons = {
  Email: Mail,
  GitHub: Github,
  LinkedIn: Linkedin,
};

const contactMethods = [
  {
    icon: icons.Email,
    title: "Email",
    value: "codewithardi@gmail.com",
    href: "mailto:codewithardi@gmail.com",
  },
  {
    icon: icons.GitHub,
    title: "GitHub",
    value: "www.github.com/ardinur03",
    href: "https://github.com/ardinur03",
  },
  {
    icon: icons.LinkedIn,
    title: "LinkedIn",
    value: "www.linkedin.com/in/ardinur",
    href: "https://www.linkedin.com/in/ardinur/",
  },
];

export function Contact() {
  return (
    <section id="kontak" className="w-full bg-background py-16 sm:py-24">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="font-headline text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Hubungi Kami
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Punya proyek yang sedang direncanakan atau hanya ingin menyapa? Jangan ragu untuk menghubungi saya. Saya selalu terbuka untuk membahas peluang baru.
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-3">
          {contactMethods.map((method) => (
            <Card
              key={method.title}
              className="group relative overflow-hidden rounded-xl border bg-card transition-colors duration-300 hover:border-accent"
            >
              <Link
                href={method.href}
                className="flex h-full flex-col items-center justify-center p-8 text-center"
              >
                <div className="mb-4 rounded-full border-2 border-transparent bg-secondary p-5 text-muted-foreground transition-colors group-hover:bg-accent/10 group-hover:text-accent">
                  <method.icon className="h-10 w-10" />
                </div>
                <h3 className="relative font-headline text-xl font-semibold text-card-foreground">
                  {method.title}
                </h3>
                <p className="relative mt-2 text-sm text-muted-foreground break-all">
                  {method.value}
                </p>
              </Link>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
