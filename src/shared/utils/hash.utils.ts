import { createHash } from 'node:crypto';

export function createChecksum(payload: string): string {
  if (!payload) throw new Error('payload required');
  const result = createHash('sha256').update(payload).digest('hex');
  return result;
}
