
// src/app/api/users/[id]/route.ts
import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { z } from 'zod';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import * as bcrypt from 'bcryptjs';
import { Role } from '../../../../../prisma/generated';

type Params = {
  params: {
    id: string;
  };
};

const userUpdateSchema = z.object({
    name: z.string().min(1, "Name is required").optional(),
    email: z.string().email("Invalid email").optional(),
    password: z.string().min(6, "Password must be at least 6 characters").optional().or(z.literal('')),
    role: z.nativeEnum(Role).optional(),
});

// PUT (update) user by ID
export async function PUT(request: Request, { params }: Params) {
    const session = await getServerSession(authOptions);

    if (session?.user?.role !== 'ADMIN') {
        return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const { id } = params;
    
    try {
        const body = await request.json();
        const parsed = userUpdateSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json({ message: 'Invalid input', data: null, status: 'error', issues: parsed.error.issues }, { status: 400 });
        }
        
        const { name, email, password, role } = parsed.data;
        const updateData: { name?: string, email?: string, password?: string, role?: Role } = {};

        if (name) updateData.name = name;
        if (email) updateData.email = email;
        if (password) updateData.password = await bcrypt.hash(password, 10);
        if (role) {
            if (session.user.id === id) {
                 return NextResponse.json({ message: "Cannot change your own role.", data: null, status: 'error'}, { status: 400 });
            }
            updateData.role = role;
        }

        const updatedUser = await db.user.update({
            where: { id },
            data: updateData,
            select: { id: true, name: true, email: true, role: true }
        });

        return NextResponse.json({ message: 'User updated successfully', data: updatedUser, status: 'success' });

    } catch (error: any) {
        if (error.code === 'P2025') { 
            return NextResponse.json({ message: 'User not found', data: null, status: 'error' }, { status: 404 });
        }
        if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
             return NextResponse.json({ message: 'Email already in use.', data: null, status: 'error' }, { status: 409 });
        }
        return NextResponse.json({ message: error.message || 'Failed to update user', data: null, status: 'error' }, { status: 500 });
    }
}

// DELETE user by ID
export async function DELETE(request: Request, { params }: Params) {
    const session = await getServerSession(authOptions);

    if (session?.user?.role !== 'ADMIN') {
        return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }
    
    const { id } = params;

    // Admin cannot delete their own account
    if (session.user.id === id) {
        return NextResponse.json({ message: "You cannot delete your own account.", data: null, status: 'error'}, { status: 400 });
    }

    try {
        await db.user.delete({
            where: { id },
        });

        return NextResponse.json({ message: 'User deleted successfully', status: 'success' });
    } catch (error: any) {
        if (error.code === 'P2025') {
            return NextResponse.json({ message: 'User not found', data: null, status: 'error' }, { status: 404 });
        }
        return NextResponse.json({ message: error.message || 'Failed to delete user', data: null, status: 'error' }, { status: 500 });
    }
}
