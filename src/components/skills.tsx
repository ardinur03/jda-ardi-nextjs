"use client";

import { Smartphone, Globe, HardDrive, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

const services = [
  {
    title: "Aplikasi",
    description:
      "Pengembangan aplikasi web dan mobile custom yang intuitif, berkinerja tinggi, dan skalabel untuk memberikan pengalaman pengguna yang luar biasa.",
    icon: Smartphone,
  },
  {
    title: "Web",
    description:
      "Menyediakan template web berkualitas tinggi dengan harga terjangkau, dirancang untuk pengalaman pengguna yang mengagumkan dan performa optimal.",
    icon: Globe,
  },
  {
    title: "Instalasi",
    description:
      "Layanan instalasi dan konfigurasi profesional untuk perangkat lunak dan perangkat keras secara on-call di area Bandung, memastikan pengaturan yang lancar dan efisien.",
    icon: HardDrive,
  },
];

export function Skills() {
  return (
    <section id="service" className="w-full bg-background py-16 sm:py-24">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="font-headline text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Layanan yang Kami Tawarkan
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Kami menyediakan solusi digital komprehensif untuk memenuhi kebutuhan bisnis Anda, dari aplikasi seluler hingga instalasi yang rumit.
          </p>
        </div>
        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
          {services.map((feature) => {
            const Icon = feature.icon || Sparkles;
            return (
              <Card
                key={feature.title}
                className="group flex flex-col items-center rounded-xl border bg-card p-8 text-center transition-colors duration-300 hover:border-accent"
              >
                <div className="mb-4 rounded-full border-2 border-transparent bg-secondary p-5 text-muted-foreground transition-colors group-hover:bg-accent/10 group-hover:text-accent">
                  <Icon className="h-10 w-10" />
                </div>
                <CardHeader className="p-0">
                  <CardTitle className="font-headline text-xl font-semibold text-card-foreground">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="mt-2 p-0">
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
