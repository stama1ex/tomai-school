import { NextRequest, NextResponse } from 'next/server';
import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { requireAdmin } from '@/lib/auth';

const MAX_SIZE_BYTES = 8 * 1024 * 1024; // 8MB — фото с телефона легко превышают лимит тела serverless-запроса (~4.5МБ), поэтому файл идёт напрямую в Blob, минуя сервер.

export async function POST(req: NextRequest) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      {
        error:
          'Загрузка изображений не настроена: отсутствует BLOB_READ_WRITE_TOKEN. Подключите Vercel Blob Storage к проекту.',
      },
      { status: 500 }
    );
  }

  const body = (await req.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request: req,
      onBeforeGenerateToken: async () => {
        const session = await requireAdmin(req);
        if (!session) {
          throw new Error('Unauthorized');
        }

        return {
          allowedContentTypes: [
            'image/jpeg',
            'image/png',
            'image/webp',
            'image/gif',
          ],
          maximumSizeInBytes: MAX_SIZE_BYTES,
          addRandomSuffix: true,
        };
      },
      onUploadCompleted: async () => {
        // Ничего не требуется: URL блоба возвращается клиенту напрямую из upload().
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Не удалось загрузить изображение' },
      { status: 400 }
    );
  }
}
