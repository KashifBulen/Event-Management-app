import { Handler } from "../../utils/make-api";
import User from "../../model/user";
import { Boom } from "@hapi/boom";
import { BAD_REQUEST } from "http-status";
import JWT from 'jsonwebtoken'


const handler: Handler<"getAuthToken"> = async (request) => {
    const { userId, idToken } = request;

    const user = await User.findOne({ _id: userId });
    if (!user) {
        throw new Boom("User Does not exist", { statusCode: BAD_REQUEST });
    }

    user.save();
    const payload = {
        idToken,
        userId,
        signInType: "user",
        companyId: "",
        deviceToken: user.deviceToken
    };

    const token = JWT.sign(payload, process.env.TOKEN_SECRET as string, { expiresIn: "30d" });
    return {
        token,
        email: user.email,
        userName: user.userName,
    };
};

export default handler;
