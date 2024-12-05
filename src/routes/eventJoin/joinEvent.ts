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
import EventJoinInvite from "../../model/eventJoinInvite";

const handler: Handler<"joinEvent"> = async (request, { user }) => {
//   const userId = user.userId;
  const eventId = new mongoose.Types.ObjectId(request?.eventId);
const userId=request.userId;
  if (!eventId) {
    throw new Boom(
      "Please choose an event to join!",
      { statusCode: BAD_REQUEST }
    );
  }
  else if (!userId) {
    throw new Boom(
      "Please choose user who will join event!",
      { statusCode: BAD_REQUEST }
    );
  }

  const alreadyJoined = await EventJoin.findOne({ userId, eventId, isCompleted:"n" });
  if (alreadyJoined) {
    throw new Boom(
        "You have already join this event!",
        { statusCode: BAD_REQUEST }
      );
  } else {
    const eventJoined = await EventJoin.create({
      userId,
      eventId,
      milestonesCompleted:[]
    });
    if (!eventJoined) {
      throw new Boom("Error during joining event", {
        statusCode: BAD_REQUEST,
      });
    } else {

      await EventJoinInvite.findOneAndUpdate(
        {
          eventId,
          receiverId: userId,
          status: Status.FRIEND_REQUEST_PENDING,
        },
        {
          $set: { status: Status.FRIEND_REQUEST_ACCEPT },
        },        
      );

      // Check if event was liked by this user previously (if yes then do not send push notification)
      /*const likeHistory = await Notification.findOne({ userId, eventId, notificationType: Status.NOTIFICATION_TYPE_EVENT_LIKE });
      if (!likeHistory) {
        // Get event owner
        const eventDetail = await Event.findById({ _id: eventId });
        console.log('eventDetail',eventDetail);
        if (eventDetail) {
          const eventOwnerId = eventDetail.userId;
          const userDetail = await User.findById(eventOwnerId);
          const notificationText = "You have new like on your event";
          await Notification.create({
            userId: eventDetail.userId,
            notificationType: Status.NOTIFICATION_TYPE_EVENT_LIKE,
            notificationText
          });

          const payload = {
            notification: {
              title: notificationText,
              body: notificationText,
              image: userDetail?.photoUrl
            }
          };

          if (userDetail?.deviceToken) await sendPushNotifications(payload, userDetail?.deviceToken, 'event-like')
        }
      }//*/
      return { message: "Event joined successfully" };
    }
  }
};

export default handler;
