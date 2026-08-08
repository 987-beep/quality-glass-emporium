import jwt from 'jsonwebtoken';

const JWT_SECRET = 'quality-glass-emporium-super-secret-jwt-key-2026';

export function generateToken(user) {
  return jwt.sign(
    { id: user.id, username: user.username, email: user.email, name: user.name, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
}

export function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized access token missing' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired session token' });
  }
}

export function adminOnlyMiddleware(req, res, next) {
  if (!req.user || !['admin', 'owner', 'developer'].includes(req.user.role)) {
    return res.status(403).json({ error: 'Forbidden: Security authorization required. Only Owner or Developer account can edit store configuration.' });
  }
  next();
}
