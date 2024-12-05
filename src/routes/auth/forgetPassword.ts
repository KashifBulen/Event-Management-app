import { Handler } from "../../utils/make-api";
import User from "../../model/user";
import { Boom } from "@hapi/boom";
import { BAD_REQUEST, NOT_FOUND } from "http-status";
import firebaseAdmin from "firebase-admin";
import { sendResetPasswordLink } from '../../utils/sendResetPasswordEmail'

const handler: Handler<"forgetPassword"> = async (request) => {
  const { email } = request;
  const user = await User.findOne({ email });
  if (!user) {
    throw new Boom("User Not Found", { statusCode: NOT_FOUND });
  }

  try {
    const resetPasswordLink = await firebaseAdmin.auth().generatePasswordResetLink(email as string)
    sendResetPasswordLink(email as string, resetPasswordLink)
  } catch (e: any) {
    throw new Boom("There is issue sending email Please Try again", { statusCode: BAD_REQUEST });
  }

  return {
    success: true,
  };
};

export default handler;
