import { Handler } from "../../utils/make-api";
import User from "../../model/user";
import { Boom } from "@hapi/boom";
import { BAD_REQUEST } from "http-status";

const handler: Handler<"getUserDetails"> = async (request, { user }) => {
  let {} = request;

  const updatedUser = await User.findOne({ _id: user.userId });

  if (!updatedUser) {
    throw new Boom("User not found", { statusCode: BAD_REQUEST });
  }
  return {
    id: user.userId,
    firstName: updatedUser.firstName,
    lastName: updatedUser.lastName,
    email: updatedUser.email,
    updatedAt: updatedUser.updatedAt as unknown as string,
    userName: updatedUser.userName,
    gender: updatedUser.gender,
    dateOfBirth: updatedUser.dateOfBirth,
    xp: updatedUser.xp,
    about: updatedUser.about,
    phone: updatedUser.phone,
    photoUrl: updatedUser.photoUrl,
    createdAt: updatedUser.createdAt as unknown as string,
    profession: updatedUser.profession,
    address: updatedUser.address,
    pushAlerts: updatedUser.pushAlerts,
    allowPeopleToConnect: updatedUser.allowPeopleToConnect,
    tags: updatedUser.tags as unknown as string[]
  };
};

export default handler;
