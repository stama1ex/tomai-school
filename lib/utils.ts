import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Google Drive's "Share" button copies a /view link, which Drive refuses to
// render inside an iframe ("нет доступа"). Only /preview embeds correctly.
export function normalizeDriveUrl(url: string): string {
  return url.replace(
    /^(https?:\/\/drive\.google\.com\/file\/d\/[^/]+)\/view(?=\/|\?|$)/,
    '$1/preview'
  );
}
