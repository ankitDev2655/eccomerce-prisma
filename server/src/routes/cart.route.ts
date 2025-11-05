import { Router } from 'express'
import * as authMiddleware from '../middlewares/authorization.middleware';
import * as cartItemController from '../controllers/cartItem.controller';
import { errorHandler } from '../exceptions/error-handler';

const cartItemRouter: Router = Router();

cartItemRouter.post('/', [authMiddleware.isAuthenticated], errorHandler(cartItemController.addItemToCart));
cartItemRouter.get('/', [authMiddleware.isAuthenticated], errorHandler(cartItemController.getCartItems));
cartItemRouter.route('/:id')
    .delete([authMiddleware.isAuthenticated], errorHandler(cartItemController.deleteItemFromCart))
    .patch([authMiddleware.isAuthenticated], errorHandler(cartItemController.changeItemQuantity));

export default cartItemRouter;