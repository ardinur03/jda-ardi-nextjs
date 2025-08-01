
import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import db from '@/lib/db';
import { z } from 'zod';
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const updateUserSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  email: z.string().email("Invalid email").optional(),
});


export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = updateUserSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ message: 'Invalid input', issues: parsed.error.issues }, { status: 400 });
    }
    
    const { name, email } = parsed.data;
    
    // Non-admin users can only update their name
    if (session.user.role !== 'ADMIN' && email) {
        return NextResponse.json({ message: 'Forbidden. You can only update your name.' }, { status: 403 });
    }

    const updateData: { name?: string; email?: string } = {};
    if (name) updateData.name = name;
    if (email && session.user.role === 'ADMIN') updateData.email = email;

    if (Object.keys(updateData).length === 0) {
        return NextResponse.json({ message: 'No fields to update' }, { status: 400 });
    }
    
    // If email is being changed, check if it's already in use
    if (email && email !== session.user.email) {
        const existingUser = await db.user.findUnique({ where: { email } });
        if (existingUser && existingUser.id !== session.user.id) {
            return NextResponse.json({ message: 'Email already in use' }, { status: 409 });
        }
    }
    
    const updatedUser = await db.user.update({
      where: { id: session.user.id },
      data: updateData,
    });
    
    const { password, ...userWithoutPassword } = updatedUser;

    return NextResponse.json({
      message: 'Profile updated successfully',
      user: userWithoutPassword,
      status: 'success'
    });

  } catch (error: any) {
    return NextResponse.json({ message: 'An unexpected error occurred', error: error.message, status: 'error' }, { status: 500 });
  }
}
