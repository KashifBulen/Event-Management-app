import { Boom } from "@hapi/boom";
import { BAD_REQUEST, NOT_FOUND } from "http-status";
import User from "../model/user";
import firebaseAdmin from "firebase-admin";
import { sendEmail } from "./sendVerifyEmail";
import JWT from 'jsonwebtoken'

const signIn = async (email: string, idToken: string, deviceToken: string) => {
  if (!idToken || !email) {
    throw new Boom("Credentials Missing", { statusCode: BAD_REQUEST });
  }

  try {
    // Authenticate user using Firebase
    const verifiedUser = await firebaseAdmin.auth().verifyIdToken(idToken);

    if (!verifiedUser) {
      throw new Boom("Invalid Credentials", { statusCode: BAD_REQUEST });
    }
    const user = await User.findOne({ email });

    if (!user) {
      throw new Boom("User Does Not Exist", { statusCode: NOT_FOUND });
    }

    if (!user.verified) {
      sendEmail(user._id, email, 'login');
      return {
        unVerified: true,
        hasCompleteProfile: user?.hasCompleteProfile,
      };
    }

    const payload = {
      idToken,
      userId: user._id,
      signInType: "user",
      companyId: user.companyId,
      deviceToken,
      hasCompleteProfile:user?.hasCompleteProfile
    };

    const token = JWT.sign(payload, process.env.TOKEN_SECRET as string, { expiresIn: "30d" });
    await User.findByIdAndUpdate({ _id: user._id }, { deviceToken })
    return {
      token,
      ...payload,
    };
  } catch (error: any) {
    throw new Boom("Invalid Credentials", { statusCode: BAD_REQUEST });
  }
};

export default signIn;
