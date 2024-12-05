import { Handler } from "../../utils/make-api";
import User from "../../model/user";
import { Boom } from "@hapi/boom";
import { BAD_REQUEST } from "http-status";

const handler: Handler<"updateUser"> = async (request, { user }) => {
  const { userName, photoUrl, firstName,
    lastName, dateOfBirth, gender,
    phone, xp, about, profession, address, pushAlerts, allowPeopleToConnect, tags, hasCompleteProfile } = request;

  const updateFields = Object.assign(
    {},
    userName !== undefined && { userName },
    photoUrl !== undefined && { photoUrl },
    firstName !== undefined && { firstName },
    lastName !== undefined && { lastName },
    dateOfBirth !== undefined && { dateOfBirth },
    xp !== undefined && { xp },
    about !== undefined && { about },
    gender !== undefined && { gender },
    profession !== undefined && { profession },
    address !== undefined && { address },
    pushAlerts !== undefined && { pushAlerts },
    allowPeopleToConnect !== undefined && { allowPeopleToConnect },
    tags !== undefined && { tags },
    hasCompleteProfile !== undefined && { hasCompleteProfile },
  );


  if (!!userName || !!phone) {
    const existingUser = await User.findOne({ $or: [{ userName }, { phone }] });
    if (existingUser) {
      if (existingUser.userName === userName && existingUser.id !== user.userId) {
        throw new Boom('User Name Already Exists, Please select a unique one', { statusCode: BAD_REQUEST });
      }
      if (existingUser.phone === phone) {
        throw new Boom('Phone Number Already Exists, Please select a unique one', { statusCode: BAD_REQUEST });
      }
    }
  }

  const updatedUser = await User.findOneAndUpdate(
    //@ts-ignore
    { _id: user.userId },
    {
      ...updateFields,
      updatedAt: Date.now(),
    }, { new: true }
  );

  if (!updatedUser) {
    throw new Boom("Invalid Data", { statusCode: BAD_REQUEST });
  }
  return {
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
    tags: updatedUser.tags as unknown as string[],
    hasCompleteProfile: updatedUser.hasCompleteProfile as boolean
  };
};

export default handler;
