import { randomBytes, randomInt, createHash } from 'crypto';
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
const OTP_TTL_MS = 10 * 60 * 1000; // 10 минут
const OTP_MAX_ATTEMPTS = 5;
const OTP_RESEND_COOLDOWN_MS = 60 * 1000; // 60 секунд между повторными отправками

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

export async function updateAdminCredentials(
  adminId: string,
  patch: { username?: string; passwordHash?: string }
): Promise<void> {
  if (patch.username !== undefined && patch.passwordHash !== undefined) {
    await sql`
      UPDATE admins
      SET username = ${patch.username}, password_hash = ${patch.passwordHash}
      WHERE id = ${adminId}
    `;
  } else if (patch.username !== undefined) {
    await sql`UPDATE admins SET username = ${patch.username} WHERE id = ${adminId}`;
  } else if (patch.passwordHash !== undefined) {
    await sql`
      UPDATE admins SET password_hash = ${patch.passwordHash} WHERE id = ${adminId}
    `;
  }
}

function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

export async function createSession(
  adminId: string,
  info: { displayName?: string; userAgent?: string } = {}
): Promise<string> {
  const token = randomBytes(32).toString('hex');
  const tokenHash = hashToken(token);
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);

  await sql`
    INSERT INTO admin_sessions (
      id, admin_id, token_hash, expires_at, display_name, user_agent, last_active_at
    )
    VALUES (
      ${uuidv4()}, ${adminId}, ${tokenHash}, ${expiresAt.toISOString()},
      ${info.displayName ?? null}, ${info.userAgent ?? null}, NOW()
    )
  `;

  return token;
}

export async function validateSession(
  token: string | undefined
): Promise<SessionAdmin | null> {
  if (!token) return null;

  const tokenHash = hashToken(token);
  const result = await sql<{ admin_id: string; username: string }>`
    UPDATE admin_sessions
    SET last_active_at = NOW()
    FROM admins
    WHERE admin_sessions.token_hash = ${tokenHash}
      AND admin_sessions.expires_at > NOW()
      AND admins.id = admin_sessions.admin_id
    RETURNING admin_sessions.admin_id AS admin_id, admins.username AS username
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

export async function getSessionDisplayName(
  token: string | undefined
): Promise<string | null> {
  if (!token) return null;
  const tokenHash = hashToken(token);
  const result = await sql<{ display_name: string | null }>`
    SELECT display_name FROM admin_sessions WHERE token_hash = ${tokenHash}
  `;
  return result.rows[0]?.display_name ?? null;
}

export interface SessionListItem {
  id: string;
  displayName: string | null;
  userAgent: string | null;
  createdAt: string;
  lastActiveAt: string;
  isCurrent: boolean;
}

export async function listSessions(
  currentToken: string | undefined
): Promise<SessionListItem[]> {
  const currentHash = currentToken ? hashToken(currentToken) : null;

  const result = await sql<{
    id: string;
    display_name: string | null;
    user_agent: string | null;
    created_at: string;
    last_active_at: string;
    token_hash: string;
  }>`
    SELECT id, display_name, user_agent, created_at, last_active_at, token_hash
    FROM admin_sessions
    WHERE expires_at > NOW()
    ORDER BY last_active_at DESC
  `;

  return result.rows.map((r) => ({
    id: r.id,
    displayName: r.display_name,
    userAgent: r.user_agent,
    createdAt: r.created_at,
    lastActiveAt: r.last_active_at,
    isCurrent: currentHash !== null && r.token_hash === currentHash,
  }));
}

export async function deleteSessionById(id: string): Promise<void> {
  await sql`DELETE FROM admin_sessions WHERE id = ${id}`;
}

export async function deleteOtherSessions(
  currentToken: string | undefined
): Promise<void> {
  if (!currentToken) {
    await sql`DELETE FROM admin_sessions`;
    return;
  }
  const currentHash = hashToken(currentToken);
  await sql`DELETE FROM admin_sessions WHERE token_hash != ${currentHash}`;
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

// ─── Email OTP verification (login + credential changes) ──────────────────

export type VerificationPurpose = 'login' | 'credentials';

export class VerificationCooldownError extends Error {
  constructor(public retryAfterMs: number) {
    super('Код уже был отправлен недавно, подождите перед повторной отправкой.');
    this.name = 'VerificationCooldownError';
  }
}

export interface VerificationRecord {
  id: string;
  admin_id: string;
  purpose: VerificationPurpose;
  display_name: string | null;
  user_agent: string | null;
  pending_username: string | null;
  pending_password_hash: string | null;
}

function hashCode(code: string): string {
  return createHash('sha256').update(code).digest('hex');
}

function generateOtpCode(): string {
  return String(randomInt(0, 1_000_000)).padStart(6, '0');
}

export async function createVerification(params: {
  adminId: string;
  purpose: VerificationPurpose;
  displayName?: string;
  userAgent?: string;
  pendingUsername?: string;
  pendingPasswordHash?: string;
}): Promise<{ id: string; code: string }> {
  const recent = await sql<{ created_at: string }>`
    SELECT created_at FROM login_verifications
    WHERE admin_id = ${params.adminId}
      AND purpose = ${params.purpose}
      AND consumed_at IS NULL
      AND expires_at > NOW()
    ORDER BY created_at DESC
    LIMIT 1
  `;

  const recentRow = recent.rows[0];
  if (recentRow) {
    const elapsed = Date.now() - new Date(recentRow.created_at).getTime();
    if (elapsed < OTP_RESEND_COOLDOWN_MS) {
      throw new VerificationCooldownError(OTP_RESEND_COOLDOWN_MS - elapsed);
    }
  }

  const code = generateOtpCode();
  const id = uuidv4();
  const codeHash = hashCode(code);
  const expiresAt = new Date(Date.now() + OTP_TTL_MS);

  await sql`
    INSERT INTO login_verifications (
      id, admin_id, purpose, code_hash, display_name, user_agent,
      pending_username, pending_password_hash, expires_at
    )
    VALUES (
      ${id}, ${params.adminId}, ${params.purpose}, ${codeHash},
      ${params.displayName ?? null}, ${params.userAgent ?? null},
      ${params.pendingUsername ?? null}, ${params.pendingPasswordHash ?? null},
      ${expiresAt.toISOString()}
    )
  `;

  return { id, code };
}

export async function consumeVerification(
  id: string,
  code: string,
  purpose: VerificationPurpose
): Promise<VerificationRecord | null> {
  const result = await sql<
    VerificationRecord & {
      code_hash: string;
      attempts: number;
      expires_at: string;
      consumed_at: string | null;
    }
  >`
    SELECT * FROM login_verifications WHERE id = ${id} AND purpose = ${purpose}
  `;

  const row = result.rows[0];
  if (!row) return null;
  if (row.consumed_at) return null;
  if (new Date(row.expires_at) < new Date()) return null;
  if (row.attempts >= OTP_MAX_ATTEMPTS) return null;

  if (hashCode(code) !== row.code_hash) {
    await sql`
      UPDATE login_verifications SET attempts = attempts + 1 WHERE id = ${id}
    `;
    return null;
  }

  await sql`UPDATE login_verifications SET consumed_at = NOW() WHERE id = ${id}`;

  return {
    id: row.id,
    admin_id: row.admin_id,
    purpose: row.purpose,
    display_name: row.display_name,
    user_agent: row.user_agent,
    pending_username: row.pending_username,
    pending_password_hash: row.pending_password_hash,
  };
}
