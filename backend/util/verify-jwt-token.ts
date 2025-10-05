import jwt from 'jsonwebtoken';

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

export async function verifyTokenAndGetUserId(token: string): Promise<string | null> {
  if (!token) {
    return null;
  }

  try {
    // Remove 'Bearer ' prefix if present
    const cleanToken = token.startsWith('Bearer ') ? token.substring(7) : token;

    const decoded: any = jwt.verify(cleanToken, JWT_SECRET_KEY);
    return decoded.user?.id || null;
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
}