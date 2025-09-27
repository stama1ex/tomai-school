/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const filePath = path.join(process.cwd(), 'data', 'staffing.json');

async function readData() {
  const data = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(data);
}

async function writeData(data: any) {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}

export async function GET() {
  const data = await readData();
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const body = await req.json();
  const data = await readData();
  const newItem = { ...body, id: uuidv4() };
  data.push(newItem);
  await writeData(data);
  return NextResponse.json(newItem);
}

export async function PUT(req: Request) {
  const { id, newData } = await req.json();
  const data = await readData();
  const index = data.findIndex((item: any) => item.id === id);
  if (index === -1) {
    return NextResponse.json(
      { error: 'Staff member not found' },
      { status: 404 }
    );
  }
  data[index] = { ...newData, id };
  await writeData(data);
  return NextResponse.json({ success: true });
}

export async function DELETE(req: Request) {
  const { id } = await req.json();
  const data = await readData();
  const updatedData = data.filter((item: any) => item.id !== id);
  await writeData(updatedData);
  return NextResponse.json({ success: true });
}
