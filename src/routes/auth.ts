import { Router } from 'express';
import {
  getCurrentUser,
  loginUser,
  logoutUser,
  updateCurrentUser,
} from '../controllers/auth.controller';
import { requireAuth } from '../middleware/auth';

export const authRouter = Router();

authRouter.post('/login', loginUser);
authRouter.post('/logout', requireAuth, logoutUser);
authRouter.get('/me', getCurrentUser);
authRouter.patch('/me', requireAuth, updateCurrentUser);
