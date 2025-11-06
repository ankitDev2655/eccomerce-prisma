import { Router } from "express";
import authRouter from "./auth.route";
import productRouter from "./product.route";
import userRouter from "./user.route";
import cartItemRouter from "./cart.route";
import orderRouter from "./orders.route";

const rootRouter: Router = Router();

rootRouter.use('/auth', authRouter);
rootRouter.use('/products', productRouter);
rootRouter.use('/users', userRouter);
rootRouter.use('/cart-items', cartItemRouter);
rootRouter.use('/order', orderRouter);

export default rootRouter;