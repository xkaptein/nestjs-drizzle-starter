import vine from '@vinejs/vine';
import { Infer } from '@vinejs/vine/types';

export const authSchema = vine.object({
  email: vine.string().email().normalizeEmail({ all_lowercase: true }),
  password: vine.string().minLength(8),
});

export type TAuthSchema = Infer<typeof authSchema>;
