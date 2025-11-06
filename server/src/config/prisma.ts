import { PrismaClient } from "../generated/prisma";

export const prismaClient = new PrismaClient({
  log: ["query", "info", "warn", "error"]
})
.$extends({
  result:{
    address:{
      formattedAddress:{
        needs:{
          lineOne: true,
          lineTwo: true,
          city: true,
          state: true,
          country: true,
          zipCode: true
        },
        compute: (address)=>{
          return `${address.lineOne}, ${address.lineTwo}, ${address.city}, ${address.state}, ${address.country} - ${address.zipCode}`
        }
      }
    }
  }
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