
import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { z } from 'zod';

// Skema validasi untuk proyek baru
const projectSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  category: z.string().min(1, 'Category is required'),
  longDescription: z.string().min(1, 'Long description is required'),
  tags: z.array(z.string()).optional(),
  livePreview: z.string().optional(),
  image: z.string().optional(),
});

// GET semua proyek
export async function GET() {
  try {
    const projects = await db.project.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    return NextResponse.json({ message: 'Projects retrieved successfully', data: projects, status: 'success' });
  } catch (error: any) {
    return NextResponse.json({ message: error.message, data: null, status: 'error' }, { status: 500 });
  }
}

// POST proyek baru
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = projectSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: 'Invalid input', data: null, status: 'error', issues: parsed.error.issues }, 
        { status: 400 }
      );
    }
    
    const { title, description, category, longDescription, tags, livePreview, image } = parsed.data;

    const slug = title.toLowerCase().replace(/\s+/g, '-').slice(0, 50);

    const newProject = await db.project.create({
      data: {
        title, 
        description, 
        category, 
        longDescription, 
        tags: tags || [],
        slug,
        livePreview: livePreview || '#',
        image: image || "https://placehold.co/600x400.png",
      }
    });

    return NextResponse.json({ message: 'Project created successfully', data: newProject, status: 'success' }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Failed to create project', data: null, status: 'error' }, { status: 500 });
  }
}
