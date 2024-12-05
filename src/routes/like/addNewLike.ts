import { Boom } from "@hapi/boom";
import User from "../../model/user";
import Event from "../../model/event";
import Like from "../../model/like";
import { BAD_REQUEST, OK } from "http-status";
import { Handler } from "../../utils/make-api";
import mongoose from 'mongoose';
import Status from "../../helpers/constant";
import Notification from "../../model/notification";
import { sendPushNotifications } from "../../utils/pushNotifications";

const handler: Handler<"addNewLike"> = async (request, { user }) => {
  const userId = user.userId;
  const eventId = new mongoose.Types.ObjectId(request?.eventId);

  if (!eventId) {
    throw new Boom(
      "Please choose an event to like!",
      { statusCode: BAD_REQUEST }
    );
  }

  const existingLike = await Like.findOne({ userId, eventId });
  // console.log('Data',userId,eventId,existingLike);
  if (existingLike) {
    await Like.findOneAndDelete({ _id: existingLike._id });
    return { message: "Event unliked successfully", statusCode: OK };
  } else {
    const newLike = await Like.create({
      userId,
      eventId
    });
    if (!newLike) {
      throw new Boom("Error in adding new like", {
        statusCode: BAD_REQUEST,
      });
    } else {
      // Check if event was liked by this user previously (if yes then do not send push notification)
      const likeHistory = await Notification.findOne({ userId, eventId, notificationType: Status.NOTIFICATION_TYPE_EVENT_LIKE });
      // console.log('likeHistory',likeHistory);
      if (!likeHistory) {
        // Get event owner
        const eventDetail = await Event.findById({ _id: eventId });
        console.log('eventDetail',eventDetail);
        if (eventDetail) {

          //Get detail of loggedin user
          let userInfo = null;
          try{
            userInfo=await User.findOne({_id:new mongoose.Types.ObjectId(userId)});
          }catch{
            userInfo=await User.findOne({_id:userId});
          }
          console.log('UserInfo',userInfo);

          const eventOwnerId = eventDetail.userId;
          const userDetail = await User.findById(eventOwnerId);
          const notificationText = "You have new like on your event";
          await Notification.create({
            userId: eventDetail.userId,
            notificationType: Status.NOTIFICATION_TYPE_EVENT_LIKE,
            notificationText,
            extraInfo: {
              likedByUserId:userId,
              likedByUserPhoto: userInfo?.photoUrl || '',
              likedByUserTitle: `${userInfo?.firstName || ''}  ${userInfo?.lastName || ''}`
          }
          });

          const payload = {
            notification: {
              title: notificationText,
              body: notificationText,
              image: userDetail?.photoUrl
            },
            data: {
              screen: "eventPreview",
              screenId: eventId.toString(),
              type: "event-like",
            },
          };

          if (userDetail?.deviceToken) await sendPushNotifications(payload, userDetail?.deviceToken, 'event-like')
        }
      }
      return newLike;
    }
  }
};

export default handler;
