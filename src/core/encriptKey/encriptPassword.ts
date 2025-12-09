import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

export const _salt = randomBytes(8).toString('hex');
export const _hash = async (password: string, salt: string) =>
  (await scrypt(password, salt, 32)) as Buffer;
