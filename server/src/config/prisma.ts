import { PrismaClient } from "../generated/prisma";
import { signUpSchema } from "../schema/user";

export const prismaClient = new PrismaClient({
  log: ["query", "info", "warn", "error"],
})
// .$extends({
//   query:{
//     user: {
//       create({args, query}){
//         args.data = signUpSchema.parse(args.data);
//         return query(args);
//       }
//     }
//   }
// })