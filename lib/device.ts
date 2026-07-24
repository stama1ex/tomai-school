/** Best-effort, dependency-free parsing of a User-Agent string into a short
 * human-readable label like "Chrome, Windows". Good enough for an internal
 * admin session list — not meant to be exhaustive. */
export function describeUserAgent(userAgent: string | null | undefined): string {
  if (!userAgent) return 'Неизвестное устройство';

  const ua = userAgent;

  let browser = 'Браузер';
  if (/edg\//i.test(ua)) browser = 'Edge';
  else if (/opr\/|opera/i.test(ua)) browser = 'Opera';
  else if (/chrome|crios/i.test(ua)) browser = 'Chrome';
  else if (/firefox|fxios/i.test(ua)) browser = 'Firefox';
  else if (/safari/i.test(ua)) browser = 'Safari';

  let os = '';
  if (/windows/i.test(ua)) os = 'Windows';
  else if (/iphone|ipad|ios/i.test(ua)) os = 'iOS';
  else if (/mac os x|macintosh/i.test(ua)) os = 'macOS';
  else if (/android/i.test(ua)) os = 'Android';
  else if (/linux/i.test(ua)) os = 'Linux';

  return os ? `${browser}, ${os}` : browser;
}
