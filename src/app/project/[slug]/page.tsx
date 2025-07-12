import { notFound } from "next/navigation";
import { projectData } from "@/lib/data";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, ShoppingCart } from "lucide-react";
import { Breadcrumb } from "@/components/breadcrumb";

export default function ProjectDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;
  const project = projectData.find((p) => p.slug === slug);

  if (!project) {
    notFound();
  }

  const breadcrumbItems = [
    { href: "/", label: "Home" },
    { href: "/#project", label: "Projects" },
    { href: `/project/${slug}`, label: project.title, isCurrent: true },
  ];

  return (
    <main className="w-full bg-background py-16 sm:py-24">
      <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <Breadcrumb items={breadcrumbItems} className="mb-8" />
        <div className="text-center mb-12">
          <h1 className="font-headline text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            {project.title}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            {project.category}
          </p>
        </div>

        <div className="relative mb-12 h-64 w-full overflow-hidden rounded-xl sm:h-96">
          <Image
            src={project.image}
            alt={project.title}
            layout="fill"
            className="object-cover"
          />
        </div>

        <div className="prose prose-lg dark:prose-invert mx-auto max-w-3xl text-muted-foreground">
          <div dangerouslySetInnerHTML={{ __html: project.longDescription }} />
        </div>

        <div className="my-12 flex flex-wrap justify-center gap-2">
          {project.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="text-sm">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Button variant="outline" asChild size="lg">
            <a href={project.livePreview} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-2 h-4 w-4" />
              Live Preview
            </a>
          </Button>
          {/* <Button asChild size="lg">
            <a href="#contact">
              <ShoppingCart className="mr-2 h-4 w-4" />
              Order Now
            </a>
          </Button> */}
        </div>
      </div>
    </main>
  );
}

// Generate static paths for all projects
export async function generateStaticParams() {
  return projectData.map((project) => ({
    slug: project.slug,
  }));
}
