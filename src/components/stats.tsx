"use client";

import { Users, LayoutTemplate } from "lucide-react";
import React, { useEffect, useMemo, useRef, useState } from "react";

export function Stats() {
  const statsRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  const statsData = useMemo(
    () => [
      {
        icon: LayoutTemplate,
        value: "50+",
        label: "Templates Created",
        target: 50,
      },
      {
        icon: Users,
        value: "100+",
        label: "Happy Clients",
        target: 100,
      },
    ],
    []
  );

  const [counts, setCounts] = useState(() => statsData.map(() => 0));

  useEffect(() => {
    const node = statsRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.unobserve(node);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(node);

    return () => observer.unobserve(node);
  }, []);

  useEffect(() => {
    if (isVisible) {
      const duration = 2000;
      statsData.forEach((stat, index) => {
        let start = 0;
        const end = stat.target;
        if (start === end) return;

        let startTime: number | null = null;

        const animate = (timestamp: number) => {
          if (!startTime) startTime = timestamp;
          const progress = Math.min((timestamp - startTime) / duration, 1);
          const newCount = Math.floor(progress * end);

          setCounts((prevCounts) => {
            const newCounts = [...prevCounts];
            newCounts[index] = newCount;
            return newCounts;
          });

          if (progress < 1) {
            requestAnimationFrame(animate);
          }
        };

        requestAnimationFrame(animate);
      });
    }
  }, [isVisible, statsData]);

  return (
    <section
      id="stats"
      ref={statsRef}
      className="w-full bg-secondary py-16 sm:py-24"
    >
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="font-headline text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Prestasi Kami dalam Angka
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Kami bangga dengan angka-angka yang mencerminkan komitmen dan keberhasilan kami.
          </p>
        </div>
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 md:grid-cols-2">
          {statsData.map((stat, index) => (
            <div
              key={stat.label}
              className="flex flex-col items-center justify-center rounded-xl border bg-card p-8 text-center shadow-sm"
            >
              <div className="mb-4 rounded-full bg-primary/10 p-5 text-primary">
                <stat.icon className="h-10 w-10" />
              </div>
              <p className="font-headline text-4xl font-bold text-foreground">
                {counts[index]}
                {stat.value.replace(stat.target.toString(), "")}
              </p>
              <p className="mt-2 text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
