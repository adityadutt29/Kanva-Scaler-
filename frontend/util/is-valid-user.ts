import * as cookie from 'cookie';
import { verify } from 'jsonwebtoken';
import checkEnvironment from '@/util/check-environment';

const KEY = process.env.JWT_SECRET_KEY;

type UserValidProps = {
  isValid: boolean;
  id?: string;
};

const isValidUser = (ctx): UserValidProps => {
  let isAuthenticated;

  // Is code running on the server
  if (typeof window === 'undefined') {
    // Check if cookie is present
    if (ctx.req && ctx.req.headers && ctx.req.headers.cookie) {
      const cookies = cookie.parse(ctx.req.headers.cookie);
      const token = cookies.token;

      if (!token) {
        return { isValid: false };
      }

      try {
        isAuthenticated = verify(token, KEY);
      } catch (e) {
        // Token is invalid or expired - this is expected for logged-out users
        return { isValid: false };
      }

      // If it is a valid token then let them in else redirect to the login page
      if (isAuthenticated?.user) {
        return { id: isAuthenticated?.user.id, isValid: true };
      } else {
        return { isValid: false };
      }
    } else {
      return { isValid: false };
    }
  } else {
    // Client-side: check localStorage for token
    // Don't verify JWT in browser (jsonwebtoken is Node.js only)
    // Just check if token exists - backend will verify on API calls
    const token = localStorage.getItem('authToken');
    const userId = localStorage.getItem('userId');
    
    if (token && userId) {
      return { id: userId, isValid: true };
    }
    
    return { isValid: false };
  }
};

export default isValidUser;
