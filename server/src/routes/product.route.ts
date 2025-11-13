import { Router } from 'express';
import * as productControllers from '../controllers/product.controller';
import { errorHandler } from '../exceptions/error-handler';
import * as authMiddleware from '../middlewares/authorization.middleware';

const productRouter: Router = Router();

productRouter.route('/')
    .get([authMiddleware.isAuthenticated, authMiddleware.isAdmin], errorHandler(productControllers.getProducts))
    .post([authMiddleware.isAuthenticated, authMiddleware.isAdmin], errorHandler(productControllers.createProduct));

productRouter.route('/list')
    .get([authMiddleware.isAuthenticated], errorHandler(productControllers.listProducts));

// /search?q="ABC"
productRouter.route("/search").get([authMiddleware.isAuthenticated], errorHandler(productControllers.searchProducts))

productRouter.route('/:id')
    .get([authMiddleware.isAuthenticated], errorHandler(productControllers.getProductById))
    .put([authMiddleware.isAuthenticated, authMiddleware.isAdmin], errorHandler(productControllers.updateProductById))
    .delete([authMiddleware.isAuthenticated, authMiddleware.isAdmin], errorHandler(productControllers.deleteProductById));



export default productRouter;