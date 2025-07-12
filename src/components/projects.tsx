"use client";

import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { projectData } from "@/lib/data";


const filters = {
  all: "All",
  education: "Education",
  portfolio: "Portfolio",
  tech: "Tech",
};

export function Projects() {
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
            Project Kami
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
          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project) => (
              <Tooltip key={project.title}>
                <TooltipTrigger asChild>
                  <Link href={`/project/${project.slug}`} className="group">
                    <Card className="flex h-full cursor-pointer flex-col overflow-hidden rounded-xl border-2 border-transparent bg-card shadow-lg transition-all duration-300 hover:border-accent hover:shadow-2xl">
                      <div className="relative h-48 w-full overflow-hidden">
                        <Image
                          src={project.image}
                          alt={project.title}
                          width={600}
                          height={400}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
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
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">Klik untuk melihat detail</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </TooltipProvider>
      </div>
    </section>
  );
}
