import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { requireAdmin, unauthorized } from '@/lib/auth';

// Загрузка идёт через сервер (не напрямую в Blob с клиента): прямой клиентский
// апload упирается в CORS блоб-хранилища на localhost при локальной разработке.
// Изображение сжимается на клиенте перед отправкой, поэтому лимит тела запроса
// (~4.5МБ на Vercel) на практике не мешает даже фото с телефона.
const MAX_SIZE_BYTES = 4.5 * 1024 * 1024;

export async function POST(req: NextRequest) {
  const session = await requireAdmin(req);
  if (!session) return unauthorized();

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      {
        error:
          'Загрузка изображений не настроена: отсутствует BLOB_READ_WRITE_TOKEN. Подключите Vercel Blob Storage к проекту.',
      },
      { status: 500 }
    );
  }

  const formData = await req.formData().catch(() => null);
  const file = formData?.get('file');

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: 'Файл не передан' }, { status: 400 });
  }

  if (!file.type.startsWith('image/')) {
    return NextResponse.json(
      { error: 'Допускаются только изображения' },
      { status: 400 }
    );
  }

  if (file.size > MAX_SIZE_BYTES) {
    return NextResponse.json(
      { error: 'Файл слишком большой (максимум 4.5 МБ)' },
      { status: 400 }
    );
  }

  try {
    const blob = await put(`announcements/${file.name}`, file, {
      access: 'public',
      addRandomSuffix: true,
    });
    return NextResponse.json({ url: blob.url });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: 'Не удалось загрузить изображение' },
      { status: 500 }
    );
  }
}
