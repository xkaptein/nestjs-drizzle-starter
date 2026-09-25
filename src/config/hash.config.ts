import { HashOptions, argon2id } from 'argon2';
import 'dotenv/config';

export const argonHashConfig: HashOptions = {
  memoryCost: 65536,
  parallelism: 4,
  timeCost: 8,
  type: argon2id,
};
