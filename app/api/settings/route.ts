import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin, unauthorized } from '@/lib/auth';
import { updateSiteSettings, type SiteSettings } from '@/lib/settings';

export async function PUT(req: NextRequest) {
  const session = await requireAdmin(req);
  if (!session) return unauthorized();

  const body = (await req.json().catch(() => null)) as Partial<SiteSettings> | null;
  if (!body) {
    return NextResponse.json({ error: 'Некорректный запрос' }, { status: 400 });
  }

  try {
    const updated = await updateSiteSettings(body);
    return NextResponse.json(updated);
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: 'Не удалось сохранить настройки' },
      { status: 500 }
    );
  }
}
