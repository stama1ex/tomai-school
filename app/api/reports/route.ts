/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const filePath = path.join(process.cwd(), 'data', 'reports.json');

async function readReports() {
  const data = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(data);
}

async function writeReports(reports: any) {
  await fs.writeFile(filePath, JSON.stringify(reports, null, 2));
}

export async function GET() {
  const reports = await readReports();
  return NextResponse.json(reports);
}

export async function POST(req: Request) {
  const body = await req.json();
  const reports = await readReports();
  reports.push(body);
  await writeReports(reports);
  return NextResponse.json({ success: true });
}

export async function PUT(req: Request) {
  const { index, data } = await req.json();
  const reports = await readReports();
  reports[index] = data;
  await writeReports(reports);
  return NextResponse.json({ success: true });
}

export async function DELETE(req: Request) {
  const { index } = await req.json();
  const reports = await readReports();
  reports.splice(index, 1);
  await writeReports(reports);
  return NextResponse.json({ success: true });
}
