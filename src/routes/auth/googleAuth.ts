import { Handler } from "../../utils/make-api";
import { Boom } from "@hapi/boom";
import User from "../../model/user";
import { BAD_REQUEST } from "http-status";
import firebaseAdmin from "firebase-admin";
import JWT from 'jsonwebtoken'

const handler: Handler<"googleAuth"> = async (request) => {
  let { idToken, deviceToken } = request;
  let response
  try {
    const decodedToken = await firebaseAdmin.auth().verifyIdToken(idToken as string);
    if (!decodedToken) {
      throw new Boom("Invalid Id token", { statusCode: BAD_REQUEST });
    }

    const userRecord = await User.findOne({ _id: decodedToken.uid });
    if (userRecord?.signInType === 'email') {
      throw new Boom('This user is logged in using Sign in with Email. Please select a new email', { statusCode: BAD_REQUEST })
    }

    if (userRecord) {
      const payload = {
        idToken,
        userId: decodedToken.uid,
        isExsisting: true,
        signInType: "user",
        deviceToken
      };

      const token = JWT.sign(payload, process.env.TOKEN_SECRET as string, { expiresIn: "30d" });
       await User.findByIdAndUpdate({_id : decodedToken.uid} , {deviceToken})
     
      response = {
        token,
        userId: decodedToken.uid,
        isExsisting: true
      };

    } else {
      const user = await User.create({
        _id: decodedToken.uid,
        firstName: decodedToken?.name || "",
        lastName: "",
        email: decodedToken.email,
        phone: decodedToken.phone_number || "",
        createdAt: Date.now(),
        updatedAt: Date.now(),
        userName: "",
        companyId: null,
        dateOfBirth: "",
        xp: 0,
        verified: decodedToken.email_verified,
        photoUrl: decodedToken.picture || "",
        signInType: 'google',
        deviceToken
      });

      user.save()

      const payload = {
        idToken,
        userId: decodedToken.uid,
        signInType: "user",
        deviceToken
      };

      const token = JWT.sign(payload, process.env.TOKEN_SECRET as string, { expiresIn: "30d" });
      response = {
        token,
        userId: decodedToken.uid,
        isExsisting: false
      }

    }


  } catch (e: any) {
    console.log('errror', e)
    throw new Boom(e, { statusCode: BAD_REQUEST });
  }

  return response
};

export default handler;
