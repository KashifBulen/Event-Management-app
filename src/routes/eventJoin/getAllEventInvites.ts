import { Handler } from "../../utils/make-api";
import Event from "../../model/event";
import EventJoinInvite from "../../model/eventJoinInvite";
import { Boom } from "@hapi/boom";
import { NOT_FOUND } from "http-status";
import mongoose from 'mongoose';
import Const from "../../helpers/constant";

//@ts-ignore
const handler: Handler<"getAllEventInvites"> = async (request, { user }) => {

  const userId = user.userId;
  const { currentPage } = request;
  const match = { isDraft: false }

  try {
    const eventId = new mongoose.Types.ObjectId(request?.eventId);

    const totalInvites = await EventJoinInvite.countDocuments({
        eventId,
        senderId:userId,
      status:{$in:[Const.FRIEND_REQUEST_PENDING, Const.FRIEND_REQUEST_ACCEPT]}
    });

    const invites = await EventJoinInvite.find({
      eventId,
      senderId:userId,
      status:{$in:[Const.FRIEND_REQUEST_PENDING, Const.FRIEND_REQUEST_ACCEPT]}
    })
        .skip((currentPage as number - 1) * Const.RECORDS_PER_PAGE)
        .limit(Const.RECORDS_PER_PAGE)
        const hasNextPage = (currentPage as number) * Const.RECORDS_PER_PAGE < totalInvites;
    return {
      invites,
      hasNextPage
    };
  } catch (error) {
    console.log("error", error);
    throw new Boom("No record found", { statusCode: NOT_FOUND });
  }
};

export default handler;
