"use client";

import { useState, useEffect } from 'react';
import { notFound, useParams } from 'next/navigation';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, ShoppingCart, Loader2 } from 'lucide-react';
import { Breadcrumb } from '@/components/breadcrumb';
import type { Project } from '@/app/api/projects/route';

export default function ProjectDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    async function fetchProject() {
      try {
        setLoading(true);
        const response = await fetch(`/api/projects/${id}`);
        const result = await response.json();
        
        if (!response.ok || result.status !== 'success') {
          throw new Error(result.message || 'Project not found');
        }
        
        setProject(result.data);
      } catch (err: any) {
        setError(err.message);
        // This will trigger Next.js's not-found UI
        notFound();
      } finally {
        setLoading(false);
      }
    }

    fetchProject();
  }, [id]);

  if (loading) {
    return (
      <main className="flex min-h-[calc(100vh-10rem)] w-full items-center justify-center bg-background py-16 sm:py-24">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </main>
    );
  }

  if (!project) {
    // notFound() is called in the effect, but as a fallback:
    return notFound();
  }

  const breadcrumbItems = [
    { href: '/', label: 'Home' },
    { href: '/#projects', label: 'Projects' },
    { href: `/project/${project.id}`, label: project.title, isCurrent: true },
  ];

  return (
    <main className="w-full bg-background py-16 sm:py-24">
      <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <Breadcrumb items={breadcrumbItems} className="mb-8" />
        <div className="text-center mb-12">
          <h1 className="font-headline text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            {project.title}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">{project.category}</p>
        </div>

        <div className="relative mb-12 h-64 w-full overflow-hidden rounded-xl sm:h-96">
          <Image
            src={project.image || "https://placehold.co/1200x600.png"}
            alt={project.title}
            fill
            className="object-cover"
          />
        </div>

        <div 
            className="prose prose-lg dark:prose-invert mx-auto max-w-3xl text-muted-foreground"
            dangerouslySetInnerHTML={{ __html: project.longDescription || '' }}
        />

        <div className="my-12 flex flex-wrap justify-center gap-2">
          {project.tags?.map((tag) => (
            <Badge key={tag} variant="outline" className="text-sm">
              {tag}
            </Badge>
          ))}
        </div>
        
        <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button variant="outline" asChild size="lg">
                <a href={project.livePreview || '#'} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" />
                Live Preview
                </a>
            </Button>
            <Button asChild size="lg">
                <a href="#contact">
                <ShoppingCart className="mr-2 h-4 w-4" />
                Order Now
                </a>
            </Button>
        </div>
      </div>
    </main>
  );
}
