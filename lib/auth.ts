import { randomBytes, createHash } from 'crypto';
import { cookies } from 'next/headers';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import { sql } from '@vercel/postgres';
import { NextRequest, NextResponse } from 'next/server';

export const SESSION_COOKIE = 'admin_session';

const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_MINUTES = 15;
const BCRYPT_COST = 12;

export interface AdminRow {
  id: string;
  username: string;
  password_hash: string;
  failed_attempts: number;
  locked_until: string | null;
}

export interface SessionAdmin {
  adminId: string;
  username: string;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, BCRYPT_COST);
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function findAdminByUsername(
  username: string
): Promise<AdminRow | null> {
  const result = await sql<AdminRow>`
    SELECT id, username, password_hash, failed_attempts, locked_until
    FROM admins
    WHERE username = ${username}
  `;
  return result.rows[0] ?? null;
}

export function isLockedOut(admin: AdminRow): boolean {
  return !!admin.locked_until && new Date(admin.locked_until) > new Date();
}

export async function recordFailedAttempt(admin: AdminRow): Promise<void> {
  const nextAttempts = admin.failed_attempts + 1;
  const shouldLock = nextAttempts >= MAX_FAILED_ATTEMPTS;

  if (shouldLock) {
    await sql`
      UPDATE admins
      SET failed_attempts = 0,
          locked_until = NOW() + (${LOCKOUT_MINUTES}::int * INTERVAL '1 minute')
      WHERE id = ${admin.id}
    `;
  } else {
    await sql`
      UPDATE admins
      SET failed_attempts = ${nextAttempts}
      WHERE id = ${admin.id}
    `;
  }
}

export async function resetFailedAttempts(adminId: string): Promise<void> {
  await sql`
    UPDATE admins
    SET failed_attempts = 0, locked_until = NULL
    WHERE id = ${adminId}
  `;
}

function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

export async function createSession(adminId: string): Promise<string> {
  const token = randomBytes(32).toString('hex');
  const tokenHash = hashToken(token);
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);

  await sql`
    INSERT INTO admin_sessions (id, admin_id, token_hash, expires_at)
    VALUES (${uuidv4()}, ${adminId}, ${tokenHash}, ${expiresAt.toISOString()})
  `;

  return token;
}

export async function validateSession(
  token: string | undefined
): Promise<SessionAdmin | null> {
  if (!token) return null;

  const tokenHash = hashToken(token);
  const result = await sql<{ admin_id: string; username: string }>`
    SELECT admin_sessions.admin_id AS admin_id, admins.username AS username
    FROM admin_sessions
    JOIN admins ON admins.id = admin_sessions.admin_id
    WHERE admin_sessions.token_hash = ${tokenHash}
      AND admin_sessions.expires_at > NOW()
  `;

  const row = result.rows[0];
  if (!row) return null;

  return { adminId: row.admin_id, username: row.username };
}

export async function destroySession(token: string | undefined): Promise<void> {
  if (!token) return;
  const tokenHash = hashToken(token);
  await sql`DELETE FROM admin_sessions WHERE token_hash = ${tokenHash}`;
}

export function sessionCookieOptions(maxAge = SESSION_DURATION_MS / 1000) {
  return {
    httpOnly: true as const,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    path: '/',
    maxAge,
  };
}

export async function requireAdmin(
  req: NextRequest
): Promise<SessionAdmin | null> {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  return validateSession(token);
}

/** For use in Server Components / pages (not Route Handlers). */
export async function getSessionFromCookies(): Promise<SessionAdmin | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  return validateSession(token);
}

export function unauthorized(): NextResponse {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
