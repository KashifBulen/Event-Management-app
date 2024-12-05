import { Handler } from "../../utils/make-api";
import { Boom } from "@hapi/boom";
import Company from "../../model/company";
import { BAD_REQUEST } from "http-status";
import JWT from "jsonwebtoken";

const handler: Handler<"switchAccount"> = async (request, { user }) => {
  const id = request.id;
  let compId:any=null;
  // const isCompanyExist = await Company.findOne({ userId: user.userId });
  // if (!isCompanyExist) {
  //   // console.log( "You don't have a company! Register a company first to switch into professional account")
  //   throw new Boom(
  //     "You don't have a company! Register first",
  //     { statusCode: BAD_REQUEST }
  //   );
   
  // }else{
    try {
  
      // let signInTypeUpdated;
      // if (user.signInType === "professional") {
      //   signInTypeUpdated = "user";
      // } else if (user.signInType === "user") {
      //   signInTypeUpdated = "professional";
      // } else {
      //   signInTypeUpdated = "super-admin";
      //   console.log("super-admin");
      // }

      let signInTypeUpdated;

      switch (user.signInType) {
        case "professional":
          signInTypeUpdated = "user";
          break;
        case "user":
          if(id){
           const isCompanyExist = await Company.findOne({ _id:id,userId: user.userId });
              if (!isCompanyExist) {
                throw new Boom(
                  "You don't have a company! Register first",
                  { statusCode: BAD_REQUEST }
                );
              }
              signInTypeUpdated = "professional";
              compId = id;
          }else throw new Boom("Choose company to switch account", { statusCode: BAD_REQUEST })
          break;
        default:
          console.log("Invalid signInType");
          throw new Boom("Invalid signInType", { statusCode: BAD_REQUEST });
      }
      // const compId:any = isCompanyExist?._id;
      const payload = {
        userId: user.userId,
        signInType: signInTypeUpdated,
        companyId: compId,
      };
  
      const token = JWT.sign(payload, process.env.TOKEN_SECRET as string, {
        expiresIn: "30d",
      });
  
      return {
        token,
        ...payload,
      };
    } catch (error) {
      throw new Boom("something went wrong", { statusCode: BAD_REQUEST });
    }
  // }
  
};

export default handler;

// import { Handler } from "../../utils/make-api";
// import { Boom } from "@hapi/boom";
// import Company from "../../model/company";
// import { BAD_REQUEST } from "http-status";
// import JWT from 'jsonwebtoken'

// const handler: Handler<"switchAccount"> = async (request, { user }) => {
//   try {

//     const isCompanyExist = await Company.findOne({userId:user.userId})

//     console.log("isCompanyExisttttttttttttttttttt", isCompanyExist)
//     if(!isCompanyExist){
//       let signInTypeUpdated;
//       if (user.signInType === "professional") {
//         signInTypeUpdated = "user";
//       } else if (user.signInType === "user") {
//         signInTypeUpdated = "professional";
//       } else {
//         signInTypeUpdated = "super-admin"
//         console.log("super-admin");
//       }

//       const payload = {
//         userId: user.userId,
//         signInType: signInTypeUpdated,
//         companyId: user.companyId
//       };

//       const token = JWT.sign(payload, process.env.TOKEN_SECRET as string, { expiresIn: "30d" });

//       return {
//         token,
//         ...payload,
//       };

//     }else{
//       throw new Boom("You dont have a company! Register company first to switch professional account", { statusCode: BAD_REQUEST });

//     }

//   } catch (error) {
//     throw new Boom("Something went wrong", { statusCode: BAD_REQUEST });
//   }
// };

// export default handler;
