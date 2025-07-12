"use client";

import * as React from "react";
import Autoplay from "embla-carousel-autoplay";
import { Card, CardContent, CardHeader } from "./ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Quote } from "lucide-react";

const testimonialData = [
  {
    name: "Ilham",
    text: "Bekerja dengan Zelo adalah perubahan besar. Mereka memberikan website berkualitas tinggi yang melampaui ekspektasi kami, dan perhatian mereka terhadap detail sangat sempurna.",
  },
  {
    name: "Hafidh Dwi",
    text: "Tim Zelo sangat berbakat dan profesional. Mereka mengubah visi kami menjadi aplikasi web yang menakjubkan dan fungsional. Sangat direkomendasikan!",
  },
  {
    name: "Naufal Maulana",
    text: "Saya terkesan dengan dedikasi dan keahlian mereka. Zelo memberikan pengalaman yang mulus dari awal hingga akhir, dan produk akhirnya sangat penting bagi kesuksesan kami.",
  },
  {
    name: "Diaz",
    text: "Solusi digital kreatif Zelo membantu kami meningkatkan merek dan menjangkau audiens yang lebih luas. Sangat menyenangkan bekerja dengan tim mereka.",
  },
  {
    name: "Ahmad Muhtadin",
    text: "Produk akhirnya tidak hanya indah tetapi juga sangat fungsional. Komitmen Zelo terhadap kualitas terlihat jelas dalam pekerjaan mereka.",
  },
];

export function Testimonials() {
  const plugin = React.useRef(
    Autoplay({ delay: 4000, stopOnInteraction: false, stopOnMouseEnter: true })
  );

  return (
    <section id="testimonials" className="w-full bg-background py-16 sm:py-24">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="font-headline text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
           Apa Kata mereka?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Kami dipercaya oleh bisnis dan individu untuk memberikan solusi digital yang luar biasa.
          </p>
        </div>
        <div className="mt-16">
          <Carousel
            plugins={[plugin.current]}
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full max-w-5xl mx-auto"
          >
            <CarouselContent>
              {testimonialData.map((testimonial, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                  <div className="p-2">
                    <Card className="flex h-full flex-col justify-between rounded-xl bg-card p-6 text-center shadow-sm transition-all hover:shadow-lg">
                      <div>
                        <Quote className="mx-auto h-8 w-8 text-muted-foreground/20" />
                        <CardContent className="p-0 pt-4">
                          <p className="italic text-muted-foreground">
                            "{testimonial.text}"
                          </p>
                        </CardContent>
                      </div>
                      <CardHeader className="p-0 pt-6">
                        <p className="font-headline font-semibold text-foreground">
                          {testimonial.name}
                        </p>
                      </CardHeader>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden sm:flex" />
            <CarouselNext className="hidden sm:flex" />
          </Carousel>
        </div>
      </div>
    </section>
  );
}
