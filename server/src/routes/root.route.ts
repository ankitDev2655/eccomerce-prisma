import { Router } from "express";
import authRouter from "./auth.route";
import productRouter from "./product.route";
import userRouter from "./user.route";
import cartItemRouter from "./cart.route";

const rootRouter: Router = Router();

rootRouter.use('/auth', authRouter);
rootRouter.use('/products', productRouter);
rootRouter.use('/users', userRouter);
rootRouter.use('/cart-items', cartItemRouter);

export default rootRouter;