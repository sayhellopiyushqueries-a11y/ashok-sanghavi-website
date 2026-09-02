import { sql } from '../_lib/db.js'
import { bcrypt, createToken, setAuthCookie } from '../_lib/auth.js'

// Single-admin login. Credentials live in env vars (ADMIN_EMAIL +
// ADMIN_PASSWORD_HASH) so no plaintext password is ever stored or handled here.
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { email, password } = req.body || {}
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' })

  const adminEmail = process.env.ADMIN_EMAIL
  const adminHash = process.env.ADMIN_PASSWORD_HASH
  if (!adminEmail || !adminHash) return res.status(500).json({ error: 'Admin login not configured' })

  const emailOk = String(email).trim().toLowerCase() === adminEmail.trim().toLowerCase()
  const passOk = emailOk ? await bcrypt.compare(String(password), adminHash) : false
  if (!emailOk || !passOk) return res.status(401).json({ error: 'Invalid email or password' })

  const token = await createToken({ email: adminEmail, role: 'admin' })
  setAuthCookie(res, token)
  // touch: keep a lightweight record that the client exists (optional, ignored on error)
  try {
    await sql`INSERT INTO admin_users (email, password_hash, name)
      VALUES (${adminEmail}, ${'env'}, ${'Admin'})
      ON CONFLICT (email) DO NOTHING`
  } catch { /* non-fatal */ }
  res.status(200).json({ ok: true, email: adminEmail })
}
