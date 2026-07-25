import { cache } from 'react';
import { sql } from '@vercel/postgres';

export interface CustomPage {
  id: string;
  slug: string;
  title: string;
  order: number;
}

const TRANSLIT: Record<string, string> = {
  а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'e', ж: 'zh', з: 'z',
  и: 'i', й: 'y', к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', п: 'p', р: 'r',
  с: 's', т: 't', у: 'u', ф: 'f', х: 'h', ц: 'ts', ч: 'ch', ш: 'sh',
  щ: 'sch', ъ: '', ы: 'y', ь: '', э: 'e', ю: 'yu', я: 'ya',
};

export function slugify(title: string): string {
  const transliterated = title
    .toLowerCase()
    .split('')
    .map((ch) => TRANSLIT[ch] ?? ch)
    .join('');

  return transliterated
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function mapRow(row: any): CustomPage {
  return { id: row.id, slug: row.slug, title: row.title, order: row.order };
}
/* eslint-enable @typescript-eslint/no-explicit-any */

export const getCustomPages = cache(async (): Promise<CustomPage[]> => {
  const result = await sql`SELECT * FROM custom_pages ORDER BY "order" ASC`;
  return result.rows.map(mapRow);
});

export const getCustomPageBySlug = cache(
  async (slug: string): Promise<CustomPage | null> => {
    const result = await sql`SELECT * FROM custom_pages WHERE slug = ${slug}`;
    const row = result.rows[0];
    return row ? mapRow(row) : null;
  }
);
