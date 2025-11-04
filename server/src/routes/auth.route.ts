import { Router } from 'express';
import authController from '../controllers/auth.controller';
import { errorHandler } from '../exceptions/error-handler';
import * as authMiddleware from '../middlewares/authorization.middleware';

const authRouter: Router = Router();

authRouter.get('/login', errorHandler(authController.login));
authRouter.get('/logout', errorHandler(authController.logout));

authRouter.post('/signup', errorHandler(authController.signup));
authRouter.get('/current-user', [authMiddleware.isAuthenticated], errorHandler(authController.getCurrentUser));

export default authRouter;
