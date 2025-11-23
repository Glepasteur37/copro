import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { prisma } from './db';
import { Role } from '@prisma/client';

const TOKEN_NAME = 'copro_session';

export async function hashPassword(password: string) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export function signSession(payload: { userId: string; role: Role; coproId?: string }) {
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new Error('AUTH_SECRET missing');
  return jwt.sign(payload, secret, { expiresIn: '7d' });
}

export function setSessionCookie(token: string) {
  cookies().set({
    name: TOKEN_NAME,
    value: token,
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 7
  });
}

export function clearSessionCookie() {
  cookies().set({
    name: TOKEN_NAME,
    value: '',
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0
  });
}

export async function getCurrentUser() {
  const cookie = cookies().get(TOKEN_NAME);
  if (!cookie) return null;
  try {
    const secret = process.env.AUTH_SECRET;
    if (!secret) return null;
    const decoded = jwt.verify(cookie.value, secret) as { userId: string; role: Role };
    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
    return user;
  } catch (e) {
    return null;
  }
}
