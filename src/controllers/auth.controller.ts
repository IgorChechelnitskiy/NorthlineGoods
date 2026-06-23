import { NextFunction, Request, Response } from 'express';
import { HttpError } from '../errors/httpError';
import { login, logout, updateProfile } from '../services/auth.service';

export async function loginUser(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const { email, password } = request.body;

    if (typeof email !== 'string' || typeof password !== 'string') {
      throw new HttpError(400, 'Email and password are required');
    }

    const result = await login(email, password);
    response.json(result);
  } catch (error) {
    next(error);
  }
}

export async function logoutUser(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    if (request.authToken) {
      await logout(request.authToken);
    }

    response.status(204).send();
  } catch (error) {
    next(error);
  }
}

export function getCurrentUser(request: Request, response: Response) {
  response.json({ user: request.user ?? null });
}

export async function updateCurrentUser(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    if (!request.user) {
      response.status(401).json({ message: 'Authentication required' });
      return;
    }

    const user = await updateProfile(request.user.id, request.body);

    if (!user) {
      response.status(404).json({ message: 'User not found' });
      return;
    }

    response.json({ user });
  } catch (error) {
    next(error);
  }
}
