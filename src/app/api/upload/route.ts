'use server';

import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import fs from 'fs';

const ensureDirectoryExistence = (filePath: string) => {
  if (fs.existsSync(filePath)) {
    return true;
  }
  fs.mkdirSync(filePath, { recursive: true });
};

export async function POST(request: NextRequest) {
  const data = await request.formData();
  const file: File | null = data.get('file') as unknown as File;

  if (!file) {
    return NextResponse.json({ success: false, message: 'No file uploaded.' }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const uploadDir = join(process.cwd(), 'public/uploads');

  ensureDirectoryExistence(uploadDir);
  
  const filename = `${Date.now()}-${file.name.replace(/\s/g, '_')}`;
  const path = join(uploadDir, filename);

  try {
    await writeFile(path, buffer);
    console.log(`File uploaded to: ${path}`);
    
    const publicPath = `/uploads/${filename}`;
    return NextResponse.json({ success: true, path: publicPath });
  } catch (error) {
    console.error('Error saving file:', error);
    return NextResponse.json({ success: false, message: 'Error saving file.' }, { status: 500 });
  }
}
