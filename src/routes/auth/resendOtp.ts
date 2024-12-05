import { Handler } from "../../utils/make-api";
import { Boom } from "@hapi/boom";
import User from "../../model/user";
import { NOT_FOUND, BAD_REQUEST } from "http-status";
import { sendEmail } from "../../utils/sendVerifyEmail";

const handler: Handler<"resendOtp"> = async (request) => {
  let { email } = request;

  if (!email) {
    throw new Boom("Missing data", { statusCode: BAD_REQUEST });
  }
  const user = await User.findOne({ email });
  if (user) {
    await sendEmail(user._id, user.email, 'login');
    return {
      success: true,
    };
  } else {
    throw new Boom("Internal Server Errorr", { statusCode: NOT_FOUND });
  }
};

export default handler;
