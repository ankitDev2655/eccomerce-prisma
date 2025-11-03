import { Router } from 'express';
import authController from '../controllers/auth.controller';
import { errorHandler } from '../exceptions/error-handler';
import { authMiddleware } from '../middlewares/auth.middleware';

const authRouter: Router = Router();

authRouter.get('/login', errorHandler(authController.login));
authRouter.get('/logout', errorHandler(authController.logout));

authRouter.post('/signup', errorHandler(authController.signup));
authRouter.get('/current-user', [authMiddleware], errorHandler(authController.getCurrentUser));

export default authRouter;
