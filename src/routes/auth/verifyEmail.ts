import { Handler } from "../../utils/make-api";
import User from "../../model/user";
import { Boom } from "@hapi/boom";
import { BAD_REQUEST } from "http-status";
import firebase from "firebase-admin";
import JWT from 'jsonwebtoken'


const handler: Handler<"verifyEmail"> = async (request) => {
  const { otp, userId } = request;


  const user = await User.findOne({ _id: userId });

  if (!user) {
    throw new Boom("User Does not exsist", { statusCode: BAD_REQUEST });
  }
  
  const currentTime = new Date();
  if (
    !user.otp?.code ||
    user.otp?.code !== otp ||
    !user.otp?.expireTime ||
    currentTime > user?.otp?.expireTime
  ) {
    throw new Boom("Invalid OTP", { statusCode: BAD_REQUEST });
  }

  user.verified = true;
  user.otp = undefined;
  user.save();

  return {
    email: user.email,
    userName: user.userName,
  };
};

export default handler;
