import { createHmac, timingSafeEqual } from 'node:crypto';

export function signTicketCode(code: string, secret: string): string {
  const sig = createHmac('sha256', secret).update(code).digest('hex');
  return `nexus:${code}:${sig}`;
}

export function verifyQrPayload(
  payload: string,
  code: string,
  secret: string,
): boolean {
  const expected = signTicketCode(code, secret);
  const a = Buffer.from(payload);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}
