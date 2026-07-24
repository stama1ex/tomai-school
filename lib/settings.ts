import { cache } from 'react';
import { sql } from '@vercel/postgres';

export interface SocialLink {
  label: string;
  url: string;
}

export interface SiteSettings {
  fullName: string;
  shortName: string;
  address: string;
  phone: string;
  email: string;
  workHours: string;
  directorName: string;
  directorPosition: string;
  directorOfficeHours: string;
  directorEmail: string;
  language: string;
  socialLinks: SocialLink[];
  studentsTotal: number;
  studentsPrimary: number;
  studentsSecondary: number;
  teachersTotal: number;
  teachersFirstDegree: number;
  teachersSecondDegree: number;
  staffTechnical: number;
  staffLibrarian: number;
  staffNurse: number;
  classroomsTotal: number;
  classesTotal: number;
  computersItRoom: number;
  gagauzPercent: number;
  appealsNote: string;
  concernNote: string;
}

export const DEFAULT_SETTINGS: SiteSettings = {
  fullName: 'Публичное Учреждение «Гимназия села Томай»',
  shortName: 'ПУ «Гимназия с. Томай»',
  address: 'с. Томай, ул. Школьная, 103/А',
  phone: '',
  email: '',
  workHours: '',
  directorName: '',
  directorPosition: '',
  directorOfficeHours: '',
  directorEmail: '',
  language: 'русский',
  socialLinks: [],
  studentsTotal: 0,
  studentsPrimary: 0,
  studentsSecondary: 0,
  teachersTotal: 0,
  teachersFirstDegree: 0,
  teachersSecondDegree: 0,
  staffTechnical: 0,
  staffLibrarian: 0,
  staffNurse: 0,
  classroomsTotal: 0,
  classesTotal: 0,
  computersItRoom: 0,
  gagauzPercent: 0,
  appealsNote: '',
  concernNote: '',
};

/* eslint-disable @typescript-eslint/no-explicit-any */
function mapRow(row: any): SiteSettings {
  return {
    fullName: row.full_name ?? '',
    shortName: row.short_name ?? '',
    address: row.address ?? '',
    phone: row.phone ?? '',
    email: row.email ?? '',
    workHours: row.work_hours ?? '',
    directorName: row.director_name ?? '',
    directorPosition: row.director_position ?? '',
    directorOfficeHours: row.director_office_hours ?? '',
    directorEmail: row.director_email ?? '',
    language: row.language ?? '',
    socialLinks: Array.isArray(row.social_links) ? row.social_links : [],
    studentsTotal: row.students_total ?? 0,
    studentsPrimary: row.students_primary ?? 0,
    studentsSecondary: row.students_secondary ?? 0,
    teachersTotal: row.teachers_total ?? 0,
    teachersFirstDegree: row.teachers_first_degree ?? 0,
    teachersSecondDegree: row.teachers_second_degree ?? 0,
    staffTechnical: row.staff_technical ?? 0,
    staffLibrarian: row.staff_librarian ?? 0,
    staffNurse: row.staff_nurse ?? 0,
    classroomsTotal: row.classrooms_total ?? 0,
    classesTotal: row.classes_total ?? 0,
    computersItRoom: row.computers_it_room ?? 0,
    gagauzPercent: row.gagauz_percent ?? 0,
    appealsNote: row.appeals_note ?? '',
    concernNote: row.concern_note ?? '',
  };
}
/* eslint-enable @typescript-eslint/no-explicit-any */

export const getSiteSettings = cache(async (): Promise<SiteSettings> => {
  try {
    const result = await sql`SELECT * FROM site_settings WHERE id = 1`;
    const row = result.rows[0];
    return row ? mapRow(row) : DEFAULT_SETTINGS;
  } catch (e) {
    console.error('Failed to load site settings:', e);
    return DEFAULT_SETTINGS;
  }
});

export async function updateSiteSettings(
  patch: Partial<SiteSettings>
): Promise<SiteSettings> {
  const current = await sql`SELECT * FROM site_settings WHERE id = 1`;
  const existing = current.rows[0] ? mapRow(current.rows[0]) : DEFAULT_SETTINGS;
  const merged = { ...existing, ...patch };

  await sql`
    UPDATE site_settings SET
      full_name = ${merged.fullName},
      short_name = ${merged.shortName},
      address = ${merged.address},
      phone = ${merged.phone},
      email = ${merged.email},
      work_hours = ${merged.workHours},
      director_name = ${merged.directorName},
      director_position = ${merged.directorPosition},
      director_office_hours = ${merged.directorOfficeHours},
      director_email = ${merged.directorEmail},
      language = ${merged.language},
      social_links = ${JSON.stringify(merged.socialLinks)}::jsonb,
      students_total = ${merged.studentsTotal},
      students_primary = ${merged.studentsPrimary},
      students_secondary = ${merged.studentsSecondary},
      teachers_total = ${merged.teachersTotal},
      teachers_first_degree = ${merged.teachersFirstDegree},
      teachers_second_degree = ${merged.teachersSecondDegree},
      staff_technical = ${merged.staffTechnical},
      staff_librarian = ${merged.staffLibrarian},
      staff_nurse = ${merged.staffNurse},
      classrooms_total = ${merged.classroomsTotal},
      classes_total = ${merged.classesTotal},
      computers_it_room = ${merged.computersItRoom},
      gagauz_percent = ${merged.gagauzPercent},
      appeals_note = ${merged.appealsNote},
      concern_note = ${merged.concernNote},
      updated_at = NOW()
    WHERE id = 1
  `;

  return merged;
}

export function toTelHref(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (!digits) return '';
  if (digits.startsWith('373')) return `+${digits}`;
  const national = digits.startsWith('0') ? digits.slice(1) : digits;
  return `+373${national}`;
}
