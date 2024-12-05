import { Handler } from "../../utils/make-api";
import User from "../../model/user";
import { Boom } from "@hapi/boom";
import { BAD_REQUEST, NOT_FOUND } from "http-status";

const handler: Handler<"logout"> = async (request,{user}) => {
  try {
    await User.findByIdAndUpdate({_id:user.userId},{
        deviceToken:null,
        updatedAt:new Date()
    });
    return {
        msg:"Logout successfully"
    }
  } catch (e: any) {
    throw new Boom("Unexpected error. Please Try again", { statusCode: BAD_REQUEST });
  }

  return {
    success: true,
  };
};

export default handler;
