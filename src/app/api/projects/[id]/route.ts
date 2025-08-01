import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { z } from 'zod';

type Params = {
  params: {
    id: string;
  };
};

const projectUpdateSchema = z.object({
    title: z.string().min(1, 'Title is required').optional(),
    description: z.string().min(1, 'Description is required').optional(),
    category: z.string().min(1, 'Category is required').optional(),
    longDescription: z.string().min(1, 'Long description is required').optional(),
    tags: z.array(z.string()).optional(),
    livePreview: z.string().optional(),
    image: z.string().optional(),
});


// GET satu proyek berdasarkan ID
export async function GET(request: Request, { params }: Params) {
  const { id } = params;
  try {
    const project = await db.project.findUnique({
      where: { id },
    });

    if (!project) {
      return NextResponse.json({ message: 'Project not found', data: null, status: 'error' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Project retrieved successfully', data: project, status: 'success' });
  } catch (error: any) {
    return NextResponse.json({ message: error.message, data: null, status: 'error' }, { status: 500 });
  }
}

// PUT (update) proyek berdasarkan ID
export async function PUT(request: Request, { params }: Params) {
    const { id } = params;

    try {
        const body = await request.json();
        const parsed = projectUpdateSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json({ message: 'Invalid input', data: null, status: 'error', issues: parsed.error.issues }, { status: 400 });
        }

        const updateData: any = { ...parsed.data };
        
        if (updateData.livePreview === '') {
            updateData.livePreview = '#';
        }
        if (updateData.image === '') {
            updateData.image = 'https://placehold.co/600x400.png';
        }

        if (parsed.data.title) {
            updateData.slug = parsed.data.title.toLowerCase().replace(/\s+/g, '-').slice(0, 50);
        }

        const updatedProject = await db.project.update({
            where: { id },
            data: updateData,
        });

        return NextResponse.json({ message: 'Project updated successfully', data: updatedProject, status: 'success' });

    } catch (error: any) {
        if (error.code === 'P2025') { // Kode Prisma untuk "record to update not found"
            return NextResponse.json({ message: 'Project not found', data: null, status: 'error' }, { status: 404 });
        }
        return NextResponse.json({ message: error.message || 'Failed to update project', data: null, status: 'error' }, { status: 500 });
    }
}

// DELETE proyek berdasarkan ID
export async function DELETE(request: Request, { params }: Params) {
    const { id } = params;

    try {
        const deletedProject = await db.project.delete({
            where: { id },
        });

        return NextResponse.json({ message: 'Project deleted successfully', data: deletedProject, status: 'success' });
    } catch (error: any) {
        if (error.code === 'P2025') { // Kode Prisma untuk "record to delete not found"
            return NextResponse.json({ message: 'Project not found', data: null, status: 'error' }, { status: 404 });
        }
        return NextResponse.json({ message: error.message || 'Failed to delete project', data: null, status: 'error' }, { status: 500 });
    }
}
