// src/app/api/projects/route.ts
import { NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { projectData } from '@/lib/data';

// This is a simplified example. In a real app, you'd import this from a shared module or database.
export type Project = {
    id: string;
    title: string;
    description: string;
    category: string;
    // Add other fields as necessary from projectData
    image?: string;
    slug?: string;
    livePreview?: string;
    longDescription?: string;
    tags?: string[];
};
  
// Use the imported projectData as the single source of truth.
// A let binding is used to allow modification for POST, PUT, DELETE operations.
export let projects: Project[] = [...projectData];

// GET all projects
export async function GET() {
  return NextResponse.json({ message: 'Projects retrieved successfully', data: projects, status: 'success' });
}

// POST a new project
export async function POST(request: Request) {
  try {
    const { title, description, category } = await request.json();

    if (!title || !description || !category) {
      return NextResponse.json({ message: 'Title, description, and category are required', data: null, status: 'error' }, { status: 400 });
    }

    const newProject: Project = {
      id: randomUUID(),
      title,
      description,
      category,
      slug: title.toLowerCase().replace(/ /g, '-'),
      image: "https://placehold.co/600x400.png",
      longDescription: "Default long description",
      tags: ["New"],
    };

    projects.push(newProject);

    return NextResponse.json({ message: 'Project created successfully', data: newProject, status: 'success' }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Invalid request body', data: null, status: 'error' }, { status: 400 });
  }
}
