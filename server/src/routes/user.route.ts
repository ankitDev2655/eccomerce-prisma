import { Router } from 'express';
import * as authMiddleware from '../middlewares/authorization.middleware';

import { errorHandler } from '../exceptions/error-handler';
import * as userController from '../controllers/user.controller';

const userRouter: Router = Router();

// User Profile Routes
userRouter.put('/', [authMiddleware.isAuthenticated], errorHandler(userController.updateUserProfile));
userRouter.get('/list', [authMiddleware.isAuthenticated , authMiddleware.isAdmin], errorHandler(userController.listUsers));
userRouter.get('/:id', [authMiddleware.isAuthenticated , authMiddleware.isAdmin], errorHandler(userController.getUserById));
userRouter.put('/:id', [authMiddleware.isAuthenticated , authMiddleware.isAdmin], errorHandler(userController.changeUserRole));


// Address Routes
userRouter.post('/address', [authMiddleware.isAuthenticated], errorHandler(userController.addAddress));
userRouter.get('/addresses', [authMiddleware.isAuthenticated], errorHandler(userController.listAddresses));
userRouter.delete('/address/:id', [authMiddleware.isAuthenticated], errorHandler(userController.deleteAddress));

export default userRouter;