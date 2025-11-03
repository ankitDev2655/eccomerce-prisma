import express, { Express, Request, Response } from "express";
import morgan from "morgan";
import { PORT } from "./config/secret";
import rootRouter from "./routes/root.route";
import { prismaClient } from "./config/prisma";
import { errorMiddleware } from "./middlewares/error.middleware";

const app: Express = express();

app.use(express.json());
app.use(morgan("dev"));


app.get("/", (_: Request, res: Response) => {
  res.send("Hello World!");
});
app.use("/api", rootRouter);

app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
