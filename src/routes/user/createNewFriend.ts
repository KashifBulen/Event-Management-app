import { Handler } from "../../utils/make-api";
import { Boom } from "@hapi/boom";
import { BAD_REQUEST, INTERNAL_SERVER_ERROR, NOT_FOUND } from "http-status";
import Friend from "../../model/friend";
import Status from "../../helpers/constant";
import Notification from "../../model/notification";
import User from '../../model/user'
import { sendPushNotifications } from "../../utils/pushNotifications";
const handler: Handler<"createNewFriend"> = async (request, { user }) => {
    let { friendId } = request;
    try {
        const contact = await Friend.findOne({
            userId: user.userId,
            friendId,
            status:Status.FRIEND_REQUEST_ACCEPT
        });
        if (!contact) {
            const friendRequest = await Friend.create({
                userId: user.userId,
                friendId
            });

            const requesterUser = await User.findOne({ _id: user.userId }, "photoUrl firstName lastName deviceToken")
            const requestGetterUser = await User.findOne({ _id: friendId }, "photoUrl firstName lastName deviceToken")
            const notificationText = `You have new friend request from ${requesterUser?.firstName || ''}`;
            await Notification.create({
                userId: friendId,
                notificationType: Status.NOTIFICATION_TYPE_FRIEND_REQUEST,
                notificationText,
                extraInfo: {
                    friendRequestId: friendRequest.id,
                    friendRequestorId: user.userId,
                    friendRequestorPhotoUrl: requesterUser?.photoUrl || '',
                    friendRequestorName: `${requesterUser?.firstName || ''}  ${requesterUser?.lastName || ''}`
                }
            });

            const payload = {
                notification: {
                    title: notificationText,
                    body: notificationText,
                    image: requesterUser?.photoUrl
                },
                data: {
                    screen: "notifications",
                    type: "notification",
                  },
            };

            console.log('payload:', payload, "Token:", requestGetterUser?.deviceToken)

            const res = await sendPushNotifications(payload, requestGetterUser?.deviceToken , 'friend-request')

            // console.log('ress', res)

            return {
                message: "Friend added successfully"
            }
        } else {
            throw new Boom("Already in friend list", { statusCode: BAD_REQUEST });
        }
    } catch (error) {
        if (error instanceof Error) {
            throw new Boom(error.message, { statusCode: BAD_REQUEST });
        } else {
            throw new Boom("An unexpected error occurred", { statusCode: INTERNAL_SERVER_ERROR });
        }
    }
};

export default handler;
