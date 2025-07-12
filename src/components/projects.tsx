"use client";

import Image from "next/image";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { ExternalLink, ShoppingCart } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

const projectData = [
  {
    title: "Platform E-commerce",
    category: "Tech",
    description:
      "Situs e-commerce lengkap dengan daftar produk, keranjang belanja, dan proses checkout yang aman.",
    longDescription:
      "Proyek ini melibatkan pembangunan platform e-commerce yang kuat dari awal menggunakan Next.js untuk frontend dan Firebase untuk layanan backend. Fitur utama mencakup autentikasi pengguna, manajemen inventaris real-time, dan integrasi dengan gateway pembayaran. UI-nya sepenuhnya responsif dan dirancang untuk pengalaman pengguna yang optimal.",
    tags: ["Next.js", "React", "Firebase", "Tailwind CSS", "Stripe"],
    aiHint: "toko online",
  },
  {
    title: "Aplikasi Manajemen Tugas",
    category: "Tech",
    description:
      "Alat kolaboratif manajemen tugas untuk membantu tim tetap terorganisir dan produktif.",
    longDescription:
      "Aplikasi manajemen tugas bergaya Kanban yang memungkinkan pengguna membuat papan, daftar, dan kartu. Fiturnya mencakup fungsi drag-and-drop, pembaruan real-time untuk kolaborasi, dan sistem notifikasi. Dibangun dengan React dan Node.js, ini adalah alat yang powerful untuk tim agile.",
    tags: ["React", "Node.js", "MongoDB", "Socket.IO"],
    aiHint: "papan kanban",
  },
  {
    title: "Website Portfolio",
    category: "Education",
    description:
      "Portfolio pribadi saya untuk menampilkan keterampilan dan proyek kepada calon pemberi kerja dan klien.",
    longDescription:
      "Website yang sedang Anda lihat sekarang ini. Dibangun dengan Next.js App Router, menggunakan Tailwind CSS dan shadcn/ui untuk styling, dan menampilkan desain profesional yang bersih dengan mode gelap yang canggih. Berfungsi sebagai pusat untuk karya dan identitas profesional saya.",
    tags: ["Next.js", "TypeScript", "Tailwind CSS", "shadcn/ui"],
    aiHint: "desain portfolio",
  },
];

const filters = {
  all: "All",
  education: "Education",
  tech: "Tech",
};

type Project = (typeof projectData)[0];

export function Projects() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeFilter, setActiveFilter] = useState("all");

  const filteredProjects = projectData.filter((project) =>
    activeFilter === "all"
      ? true
      : project.category.toLowerCase() === activeFilter
  );

  return (
    <section id="project" className="w-full bg-secondary py-16 sm:py-24">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="font-headline text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Proyek Kami
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Telusuri pilihan karya terbaru kami, yang menunjukkan keahlian kami dalam menciptakan beragam solusi digital.
          </p>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          {Object.entries(filters).map(([key, value]) => (
            <Button
              key={key}
              variant={activeFilter === key ? "default" : "outline"}
              onClick={() => setActiveFilter(key)}
              className="capitalize"
            >
              {value}
            </Button>
          ))}
        </div>

        <TooltipProvider>
          <Dialog>
            <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {filteredProjects.map((project) => (
                <Tooltip key={project.title}>
                  <TooltipTrigger asChild>
                    <DialogTrigger
                      asChild
                      onClick={() => setSelectedProject(project)}
                    >
                      <Card className="group flex cursor-pointer flex-col overflow-hidden rounded-xl border-2 border-transparent bg-card shadow-lg transition-all duration-300 hover:border-accent hover:shadow-2xl">
                        <div className="relative h-48 w-full overflow-hidden">
                          <Image
                            src="https://placehold.co/600x400.png"
                            alt={project.title}
                            width={600}
                            height={400}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                            data-ai-hint={project.aiHint}
                          />
                        </div>
                        <CardHeader>
                          <CardTitle className="font-headline text-xl">
                            {project.title}
                          </CardTitle>
                          <CardDescription>{project.category}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-grow">
                          <p className="text-sm text-muted-foreground line-clamp-3">
                            {project.description}
                          </p>
                        </CardContent>
                        <CardFooter className="flex-wrap gap-2">
                          {project.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="secondary">
                              {tag}
                            </Badge>
                          ))}
                        </CardFooter>
                      </Card>
                    </DialogTrigger>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">{project.description}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>

            {selectedProject && (
              <DialogContent className="max-w-[90vw] sm:max-w-xl lg:max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="font-headline text-2xl">
                    {selectedProject.title}
                  </DialogTitle>
                  <DialogDescription>
                    {selectedProject.category}
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="relative h-48 w-full overflow-hidden rounded-md sm:h-64">
                    <Image
                      src="https://placehold.co/600x400.png"
                      alt={selectedProject.title}
                      width={600}
                      height={400}
                      className="h-full w-full object-cover"
                      data-ai-hint={selectedProject.aiHint}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {selectedProject.longDescription}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.tags.map((tag) => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col-reverse gap-4 sm:flex-row sm:justify-end">
                  <Button variant="outline" asChild>
                    <a href="#" target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Live Preview
                    </a>
                  </Button>
                  <Button asChild>
                    <a href="#contact">
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Order Now
                    </a>
                  </Button>
                </div>
              </DialogContent>
            )}
          </Dialog>
        </TooltipProvider>
      </div>
    </section>
  );
}
