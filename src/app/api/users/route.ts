
// src/app/api/users/route.ts
import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import * as bcrypt from 'bcryptjs';
import { z } from 'zod';
import { Role } from '../../../../prisma/generated';

const userCreateSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.nativeEnum(Role),
});

export async function GET() {
  const session = await getServerSession(authOptions);

  if (session?.user?.role !== 'ADMIN') {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  try {
    const users = await db.user.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      }
    });
    return NextResponse.json({ message: 'Users retrieved successfully', data: users, status: 'success' });
  } catch (error: any) {
    return NextResponse.json({ message: error.message, data: null, status: 'error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);

    if (session?.user?.role !== 'ADMIN') {
        return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }
    
    try {
        const body = await request.json();
        const parsed = userCreateSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json({ message: 'Invalid input', data: null, status: 'error', issues: parsed.error.issues }, { status: 400 });
        }
        
        const { name, email, password, role } = parsed.data;

        const existingUser = await db.user.findUnique({ where: { email } });
        if (existingUser) {
            return NextResponse.json({ message: 'Email already in use.', data: null, status: 'error' }, { status: 409 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await db.user.create({
            data: { name, email, password: hashedPassword, role },
            select: { id: true, name: true, email: true, role: true }
        });

        return NextResponse.json({ message: 'User created successfully', data: newUser, status: 'success' }, { status: 201 });

    } catch (error: any) {
         if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
             return NextResponse.json({ message: 'Email already in use.', data: null, status: 'error' }, { status: 409 });
        }
        return NextResponse.json({ message: error.message || 'Failed to create user', data: null, status: 'error' }, { status: 500 });
    }
}
