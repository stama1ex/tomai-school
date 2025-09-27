/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const filePath = path.join(process.cwd(), 'data', 'class-teachers.json');

async function readTeachers() {
  const data = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(data);
}

async function writeTeachers(teachers: any) {
  await fs.writeFile(filePath, JSON.stringify(teachers, null, 2));
}

export async function GET() {
  const teachers = await readTeachers();
  return NextResponse.json(teachers);
}

export async function POST(req: Request) {
  const body = await req.json();
  const teachers = await readTeachers();
  const newItem = { ...body, id: uuidv4() }; // Add unique ID
  teachers.push(newItem);
  await writeTeachers(teachers);
  return NextResponse.json(newItem); // Return the new item with ID
}

export async function PUT(req: Request) {
  const { id, newData } = await req.json();
  const teachers = await readTeachers();
  const index = teachers.findIndex((item: any) => item.id === id);
  if (index === -1) {
    return NextResponse.json({ error: 'Teacher not found' }, { status: 404 });
  }
  teachers[index] = { ...newData, id }; // Preserve the ID
  await writeTeachers(teachers);
  return NextResponse.json({ success: true });
}

export async function DELETE(req: Request) {
  const { id } = await req.json();
  const teachers = await readTeachers();
  const updatedData = teachers.filter((item: any) => item.id !== id);
  await writeTeachers(updatedData);
  return NextResponse.json({ success: true });
}
