import { Handler } from "../../utils/make-api";
import User from "../../model/user";
import { Boom } from "@hapi/boom";
import { BAD_REQUEST, NOT_FOUND } from "http-status";
import firebaseAdmin from "firebase-admin";
import { sendResetPasswordLink } from '../../utils/sendResetPasswordEmail'


//disable this api for now
const handler: Handler<"resetPassword"> = async (request) => {
  const { email } = request;

  // const user = await User.findOne({ email });

  // if (!user) {
  //   throw new Boom("User Not Found", { statusCode: NOT_FOUND });
  // }

  // const currentTime = new Date();
  // if (
  //   !user.otp?.code ||
  //   user.otp?.code !== otp ||
  //   !user.otp?.expireTime ||
  //   currentTime > user?.otp?.expireTime
  // ) {
  //   throw new Boom("Invalid OTP", { statusCode: BAD_REQUEST });
  // }

  // await firebaseAdmin.auth().updateUser(user._id, { password });

  // user.otp = undefined;
  // user.save();

  // const actionCodeSettings = {
  //   url: 'https://example.com/reset-password',
  //   handleCodeInApp: true,
  // };

  // const res = await firebaseAdmin.auth().generatePasswordResetLink(email as string)

  // sendResetPasswordLink(email as string, res)


  // console.log('res', res)

  return {
    success: true,
  };
};

export default handler;
