import { Boom } from "@hapi/boom";
import User from "../../model/user";
import Event from "../../model/event";
import EventJoin from "../../model/eventJoin";
import EventJoinInvite from "../../model/eventJoinInvite";
import { BAD_REQUEST, OK } from "http-status";
import { Handler } from "../../utils/make-api";
import mongoose from 'mongoose';
import Status from "../../helpers/constant";
import Notification from "../../model/notification";
import { sendPushNotifications } from "../../utils/pushNotifications";

const handler: Handler<"completeMilestoneInviteFriend"> = async (request, { user }) => {
  //   const userId = user.userId;
  const eventId = new mongoose.Types.ObjectId(request?.eventId);
  const milestoneId = request.milestoneId;
  if (!eventId) {
    throw new Boom(
      "Please choose an event!",
      { statusCode: BAD_REQUEST }
    );
  }
  else if (!milestoneId) {
    throw new Boom(
      "Please choose milestone to complete!",
      { statusCode: BAD_REQUEST }
    );
  } else {
    const userId = user.userId;

    const eventInfo = await Event.findById(eventId).populate("eventTypeId");


    // Check if milestone needs to be complete as per defined completion criteria
    const eventInvitationCount = await EventJoinInvite.countDocuments({ eventId, senderId: userId });
    const eventMilestons = eventInfo?.eventMilestoneList;//![0]?.milestoneCompletionCriteria?.[Status.MILESTONE_INVITE_FRIEND];
    //@ts-ignore
    const eventType = eventInfo?.eventTypeId?.eventTypeName;


    console.log('Event', eventInfo, eventMilestons);

    if (eventMilestons) {
      for (const milestone of eventMilestons) {
        if (milestone.milestoneIdentifier === Status.MILESTONE_INVITE_FRIEND) {
          if (eventInvitationCount >= milestone.milestoneCompletionCriteria?.[Status.MILESTONE_INVITE_FRIEND]) {
            let eventMilestoneInfo = await EventJoin.findOne({
              userId,
              eventId
            }).sort({ createdAt: 1 });
            if (eventMilestoneInfo) {
              // const milestoneInfo = await Milestone.findOne({ _id: milestoneId });

              const milestoneExists = eventMilestoneInfo.milestonesCompleted.some(
                (milestoneCompleted) => milestoneCompleted.milestoneId === milestoneId
              );
              if (!milestoneExists) {
                // Push a new object into the milestonesCompleted array
                eventMilestoneInfo.milestonesCompleted.push({
                  milestoneId,
                  xp: milestone?.xp || 0
                });
                await eventMilestoneInfo.save();
              }
            }
          }
        }
      }
    }
    return { message: "Milestone completed successfully" };
  }
};

export default handler;
