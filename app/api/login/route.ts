import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { login, password } = await req.json();

  if (
    login === process.env.ADMIN_LOGIN &&
    password === process.env.ADMIN_PASS
  ) {
    const res = NextResponse.json({ success: true });
    res.cookies.set('isAdmin', 'true', {
      httpOnly: true, // <-- защищённая кука
      sameSite: 'strict',
      path: '/',
    });
    return res;
  }

  return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
}
