import { Handler } from "../../utils/make-api";
import { Boom } from "@hapi/boom";
import User from "../../model/user";
import { NOT_FOUND, BAD_REQUEST } from "http-status";
import { sendEmail } from "../../utils/sendVerifyEmail";
import firebase from "firebase-admin";
import JWT from 'jsonwebtoken'

const handler: Handler<"signup"> = async (request) => {
  let { email, password, deviceToken, idToken } = request;

  if (!email || !password) {
    throw new Boom("Missing data", { statusCode: BAD_REQUEST });
  }
  const userExist = await User.findOne({ email });
  if (userExist?.signInType === 'google') {
    throw new Boom("This User is logged in using Sign In With Google", { statusCode: BAD_REQUEST });
  }
  if (userExist?.signInType === 'email') {
    throw new Boom("User already exist", { statusCode: BAD_REQUEST });
  }
  // const userNameExist = await User.findOne({ userName });
  // if (userNameExist) {
  //   throw new Boom("User Name already exist please select a unique", { statusCode: BAD_REQUEST, });
  // }

  const userRecord = await firebase.auth().createUser({
    email,
    password,
  });

  const user = await User.create({
    _id: userRecord.uid,
    firstName: "",
    lastName: "",
    email,
    phone: "",
    createdAt: Date.now(),
    updatedAt: Date.now(),
    userName: '',
    companyId: null,
    dateOfBirth: "",
    xp: 0,
    photoUrl: '',
    signInType: 'email',
    deviceToken,
    hasCompleteProfile: false
  });

  await user.save();
  if (userRecord) {
    await sendEmail(user._id, user.email, 'signUp');
    const payload = {
      idToken,
      userId: user._id,
      signInType: "user",
      companyId: "",
      deviceToken
    };

    const token = JWT.sign(payload, process.env.TOKEN_SECRET as string, { expiresIn: "30d" });
    return {
      token,
      userId: user._id as unknown as string,
      email: user.email
    };
  } else {
    throw new Boom("Internal Server Errorr", { statusCode: NOT_FOUND });
  }
};

export default handler;
