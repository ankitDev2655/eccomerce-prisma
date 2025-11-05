import { Router } from "express";
import authRouter from "./auth.route";
import productRouter from "./product.route";
import userRouter from "./user.route";

const rootRouter: Router = Router();

rootRouter.use('/auth', authRouter);
rootRouter.use('/products', productRouter);
rootRouter.use('/users', userRouter);

export default rootRouter;