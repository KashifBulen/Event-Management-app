import { Handler } from "../../utils/make-api";
import Event from "../../model/event";
import EventJoin from "../../model/eventJoin";
import { Boom } from "@hapi/boom";
import { NOT_FOUND } from "http-status";
import mongoose from 'mongoose';
import Const from "../../helpers/constant";

//@ts-ignore
const handler: Handler<"getEventMilestonesCompleted"> = async (request, { user }) => {

  const userId = user.userId;
  const match = { isDraft: false }

  try {
    const eventId = new mongoose.Types.ObjectId(request?.eventId);

    const completedMilestones = await EventJoin.find({
      eventId,
      userId,
      isCompleted:"n"
    })
    if(!completedMilestones){
     return await EventJoin.create({userId,eventId})
    }
    return completedMilestones;
  } catch (error) {
    console.log("error", error);
    throw new Boom("No record found", { statusCode: NOT_FOUND });
  }
};

export default handler;
