import bcrypt from 'bcryptjs'
import { SignJWT, jwtVerify } from 'jose'

export const COOKIE = 'as_admin'
const MAX_AGE = 7 * 24 * 3600 // 7 days

const secret = () => new TextEncoder().encode(process.env.JWT_SECRET || 'dev-only-insecure-secret')

export async function createToken(payload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secret())
}

export async function verifyToken(token) {
  try {
    const { payload } = await jwtVerify(token, secret())
    return payload
  } catch {
    return null
  }
}

export function parseCookies(req) {
  const header = req.headers.cookie || ''
  const out = {}
  header.split(';').forEach((part) => {
    const idx = part.indexOf('=')
    if (idx > -1) out[part.slice(0, idx).trim()] = decodeURIComponent(part.slice(idx + 1).trim())
  })
  return out
}

export function setAuthCookie(res, token) {
  res.setHeader('Set-Cookie', `${COOKIE}=${token}; Path=/; HttpOnly; SameSite=Lax; Secure; Max-Age=${MAX_AGE}`)
}

export function clearAuthCookie(res) {
  res.setHeader('Set-Cookie', `${COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Secure; Max-Age=0`)
}

// Returns the admin payload if the request carries a valid session, else null.
export async function requireAdmin(req) {
  const token = parseCookies(req)[COOKIE]
  if (!token) return null
  return await verifyToken(token)
}

export { bcrypt }
