import { Router } from 'express';
import * as authMiddleware from '../middlewares/authorization.middleware';
import * as orderController from '../controllers/orders.controller';
import { errorHandler } from '../exceptions/error-handler';

const orderRouter: Router = Router();

orderRouter.post('/', [authMiddleware.isAuthenticated], errorHandler(orderController.createOrder));
orderRouter.get('/', [authMiddleware.isAuthenticated], errorHandler(orderController.listOrders));
orderRouter.get('/:id', [authMiddleware.isAuthenticated], errorHandler(orderController.getOrderById));
orderRouter.patch('/:id/cancel', [authMiddleware.isAuthenticated], errorHandler(orderController.cancelOrder));


export default orderRouter;