/**
 * @file        password.ts
 * @description Password hashing and verification using Node crypto
 * @version     1.0.0
 * @created     2026-01-08 01:07:00 CET
 * @updated     2026-01-08 01:07:00 CET
 * @author      Akki Scholze
 *
 * @changelog
 *   1.0.0 - 2026-01-08 - Initial password infra with scrypt + salt
 */

import { scryptSync, randomBytes, timingSafeEqual } from 'crypto';

const SALT_LENGTH = 16;
const KEY_LENGTH = 32;

/**
 * Hash password with random salt
 */
export function hashPassword(plainPassword: string): { hash: string; salt: string } {
  const salt = randomBytes(SALT_LENGTH);
  const hash = scryptSync(plainPassword, salt, KEY_LENGTH);

  return {
    hash: hash.toString('hex'),
    salt: salt.toString('hex')
  };
}

/**
 * Verify password against stored hash and salt
 */
export function verifyPassword(plainPassword: string, storedHash: string, storedSalt: string): boolean {
  try {
    const salt = Buffer.from(storedSalt, 'hex');
    const hash = Buffer.from(storedHash, 'hex');
    const derived = scryptSync(plainPassword, salt, KEY_LENGTH);

    return timingSafeEqual(hash, derived);
  } catch (error) {
    // Invalid hex or comparison failed
    return false;
  }
}
