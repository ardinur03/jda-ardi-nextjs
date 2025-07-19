import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { z } from 'zod';

const projectSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  category: z.string().min(1, 'Category is required'),
  longDescription: z.string().min(1, 'Long description is required'),
  tags: z.array(z.string()).optional(),
  livePreview: z.string().optional(), // Dibuat opsional
  image: z.string().optional(), // Dibuat opsional
});

// GET semua proyek
export async function GET() {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ message: error.message, data: null, status: 'error' }, { status: 500 });
  }

  return NextResponse.json({ message: 'Projects retrieved successfully', data, status: 'success' });
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

    const { data: newProject, error } = await supabase
      .from('projects')
      .insert([
        { 
          title, 
          description, 
          category, 
          longDescription, 
          tags,
          slug,
          livePreview: livePreview || '#',
          image: image || "https://placehold.co/600x400.png",
        }
      ])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ message: 'Project created successfully', data: newProject, status: 'success' }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Failed to create project', data: null, status: 'error' }, { status: 500 });
  }
}
