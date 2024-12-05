import { Handler } from "../../utils/make-api";
import { Boom } from "@hapi/boom";
import { BAD_REQUEST, NOT_FOUND } from "http-status";
import Friend from "../../model/friend";
import Status from "../../helpers/constant";
import User from '../../model/user'
import { sendPushNotifications } from '../../utils/pushNotifications'
import Notification from "../../model/notification";
const handler: Handler<"friendAcceptReject"> = async (request, { user }) => {
  const { id, status, notificationId } = request;
  const friend = await Friend.findById({ _id: id });
  if (!friend) throw new Boom("Friend does not exist", { statusCode: NOT_FOUND });
  else if (friend.status === Status.FRIEND_REQUEST_PENDING) {
    const updateFriendReq = await Friend.findByIdAndUpdate(
      { _id: id },
      {
        status,
        updatedAt: Date.now(),
      });
    const requesterUser = await User.findOne({ _id: friend.userId }, "photoUrl firstName lastName deviceToken")
    const acceptedUser = await User.findOne({ _id: user.userId }, "photoUrl firstName lastName deviceToken")
    let notificationText = '';
    if(status=== Status.FRIEND_REQUEST_ACCEPT) notificationText = `You and ${acceptedUser?.firstName || ''} are friends`;
    else notificationText=`Your friend request was rejected by ${acceptedUser?.firstName}`;
    await Notification.findOneAndUpdate(
      {
        'extraInfo.friendRequestId': id,
      },
      {
        $set: {
          notificationType: Status.NOTIFICATION_TYPE_NOTE,
          notificationText
        }
      },
      { new: true }
    ).exec();
    await Notification.create({
      userId: friend.userId,
      notificationType: Status.NOTIFICATION_TYPE_NOTE,
      notificationText,
      extraInfo: {
        friendRequestId: id,
        friendRequestorPhotoUrl: acceptedUser?.photoUrl || '',
        friendRequestorName: `${acceptedUser?.firstName || ''}  ${acceptedUser?.lastName || ''}`
      }
    });

    const payload = {
      notification: {
        title: notificationText,
        body: notificationText,
        image: acceptedUser?.photoUrl
      },
      data: {
        screen: "notifications",
        type: "notification",
      },
    };

    await sendPushNotifications(payload, requesterUser?.deviceToken, 'friend-request')


    if (!updateFriendReq) throw new Boom("Failed to update friend response", { statusCode: BAD_REQUEST });

    return { message: `Friend  ${status} successfully` };
  } else throw new Boom("Friend request not found", { statusCode: NOT_FOUND });
};

export default handler;
