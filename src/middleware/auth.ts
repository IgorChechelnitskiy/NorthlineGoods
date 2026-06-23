import { NextFunction, Request, Response } from 'express';
import { HttpError } from '../errors/httpError';
import { AuthUser, getUserByToken } from '../services/auth.service';
import { UserRole } from '../models/User';

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
      authToken?: string;
    }
  }
}

export async function authenticate(
  request: Request,
  _response: Response,
  next: NextFunction,
) {
  try {
    const token = getBearerToken(request);

    if (!token) {
      next();
      return;
    }

    const user = await getUserByToken(token);

    if (user) {
      request.user = user;
      request.authToken = token;
    }

    next();
  } catch (error) {
    next(error);
  }
}

export function requireAuth(
  request: Request,
  _response: Response,
  next: NextFunction,
) {
  if (!request.user) {
    next(new HttpError(401, 'Authentication required'));
    return;
  }

  next();
}

export function requireRole(roles: UserRole[]) {
  return (request: Request, _response: Response, next: NextFunction) => {
    if (!request.user) {
      next(new HttpError(401, 'Authentication required'));
      return;
    }

    if (!roles.includes(request.user.role)) {
      next(new HttpError(403, 'Forbidden'));
      return;
    }

    next();
  };
}

function getBearerToken(request: Request) {
  const authorization = request.header('authorization');

  if (!authorization?.startsWith('Bearer ')) {
    return null;
  }

  return authorization.slice('Bearer '.length).trim();
}
