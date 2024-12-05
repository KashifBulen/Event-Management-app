import { Boom } from "@hapi/boom";
import User from "../../model/user";
import Event from "../../model/event";
import EventJoin from "../../model/eventJoin";
import { BAD_REQUEST, OK } from "http-status";
import { Handler } from "../../utils/make-api";
import mongoose from 'mongoose';
import Status from "../../helpers/constant";
import Notification from "../../model/notification";
import { sendPushNotifications } from "../../utils/pushNotifications";

const handler: Handler<"checkEventJoined"> = async (request, { user }) => {
//   const userId = user.userId;
  const eventId = new mongoose.Types.ObjectId(request?.eventId);
const userId=request.userId;
  if (!eventId) {
    throw new Boom(
      "Please choose an event!",
      { statusCode: BAD_REQUEST }
    );
  }
  else if (!userId) {
    throw new Boom(
      "Please choose user!",
      { statusCode: BAD_REQUEST }
    );
  }

  const alreadyJoined = await EventJoin.findOne({ userId, eventId,isCompleted:"n" });
  if (alreadyJoined) return { joined: "yes" };
  else return { joined: "no" };
};

export default handler;
