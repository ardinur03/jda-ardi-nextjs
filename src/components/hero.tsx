"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";

const textsToType = [
  "🚀 Creative Digital Solutions",
  "👨‍💻 Full-Stack Development",
  "🎨 UI/UX Design",
  "📱 Apps • Web • Installation",
];

export function Hero() {
  const [typedText, setTypedText] = useState("");
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const typingSpeed = 100;
  const deletingSpeed = 50;
  const delayBetweenTexts = 2000;

  useEffect(() => {
    const handleTyping = () => {
      const currentText = textsToType[textIndex];
      if (isDeleting) {
        if (charIndex > 0) {
          setTypedText(currentText.substring(0, charIndex - 1));
          setCharIndex((prev) => prev - 1);
        } else {
          setIsDeleting(false);
          setTextIndex((prev) => (prev + 1) % textsToType.length);
        }
      } else {
        if (charIndex < currentText.length) {
          setTypedText(currentText.substring(0, charIndex + 1));
          setCharIndex((prev) => prev + 1);
        } else {
          setTimeout(() => setIsDeleting(true), delayBetweenTexts);
        }
      }
    };

    const timer = setTimeout(
      handleTyping,
      isDeleting ? deletingSpeed : typingSpeed
    );

    return () => clearTimeout(timer);
  }, [charIndex, isDeleting, textIndex, deletingSpeed, typingSpeed]);

  return (
    <section id="beranda" className="w-full bg-background">
      <div className="container mx-auto grid min-h-[calc(100vh-5rem)] max-w-7xl grid-cols-1 items-center gap-8 px-4 py-12 text-center md:grid-cols-2 md:gap-16 md:py-0 md:text-left lg:px-8">
        <div className="order-2 flex -mt-40 flex-col items-center md:order-1 md:items-start">
          <h1 className="font-headline text-5xl font-extrabold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            Zelo - Creative Digital Solutions
          </h1>
          <div className="mt-6 min-h-[56px] max-w-2xl text-lg text-muted-foreground">
            <p className="min-h-[28px]">
              {typedText}
              <span className="animate-blink border-l-2 border-foreground align-middle"></span>
            </p>
          </div>
          <Button
            size="lg"
            className="mt-8 shadow-lg transition-shadow hover:shadow-xl"
            asChild
          >
            <Link href="#contact">🤝 Build with us</Link>
          </Button>
        </div>
        <div className="relative order-1 flex items-center justify-center md:order-2">
          <div className="absolute -inset-2 rounded-full bg-gradient-to-br from-primary to-accent opacity-10 blur-3xl"></div>
          <div className="relative h-80 w-80 animate-float md:h-96 md:w-96">
            <Image
              src="/images/hero.svg"
              alt="Profile Photo"
              width={400}
              height={400}
              className="object-cover"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
