import { NextRequest, NextResponse } from 'next/server';
import { SESSION_COOKIE, destroySession } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  await destroySession(token);

  const res = NextResponse.json({ success: true });
  res.cookies.delete(SESSION_COOKIE);
  return res;
}
