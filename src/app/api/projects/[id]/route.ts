// src/app/api/projects/[id]/route.ts
import { NextResponse } from 'next/server';
// Import projects from the main route file to ensure it's the same instance.
import { projects } from '../route';

type Params = {
  params: {
    id: string;
  };
};

// GET a single project by ID
export async function GET(request: Request, { params }: Params) {
  const project = projects.find((p) => p.id === params.id);

  if (!project) {
    return NextResponse.json({ message: 'Project not found', data: null, status: 'error' }, { status: 404 });
  }

  return NextResponse.json({ message: 'Project retrieved successfully', data: project, status: 'success' });
}

// PUT (update) a project by ID
export async function PUT(request: Request, { params }: Params) {
    const projectIndex = projects.findIndex((p) => p.id === params.id);

    if (projectIndex === -1) {
        return NextResponse.json({ message: 'Project not found', data: null, status: 'error' }, { status: 404 });
    }

    try {
        const { title, description, category } = await request.json();

        if (title === undefined && description === undefined && category === undefined) {
            return NextResponse.json({ message: 'At least one field (title, description, category) must be provided', data: null, status: 'error' }, { status: 400 });
        }
        
        // Directly modify the project in the imported array
        const projectToUpdate = projects[projectIndex];

        if (title !== undefined) {
            projectToUpdate.title = title;
        }

        if (description !== undefined) {
            projectToUpdate.description = description;
        }

        if (category !== undefined) {
          projectToUpdate.category = category;
        }

        return NextResponse.json({ message: 'Project updated successfully', data: projectToUpdate, status: 'success' });

    } catch (error) {
        return NextResponse.json({ message: 'Invalid request body', data: null, status: 'error' }, { status: 400 });
    }
}

// DELETE a project by ID
export async function DELETE(request: Request, { params }: Params) {
    const projectIndex = projects.findIndex((p) => p.id === params.id);

    if (projectIndex === -1) {
        return NextResponse.json({ message: 'Project not found', data: null, status: 'error' }, { status: 404 });
    }

    const deletedProject = projects.splice(projectIndex, 1);

    return NextResponse.json({ message: 'Project deleted successfully', data: deletedProject[0], status: 'success' });
}
