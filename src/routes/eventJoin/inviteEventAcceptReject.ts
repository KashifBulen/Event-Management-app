import { Handler } from "../../utils/make-api";
import { Boom } from "@hapi/boom";
import { BAD_REQUEST, NOT_FOUND } from "http-status";
import EventJoinInvite from "../../model/eventJoinInvite";
import Status from "../../helpers/constant";
import User from '../../model/user'
import { sendPushNotifications } from '../../utils/pushNotifications'
import Notification from "../../model/notification";
const handler: Handler<"inviteEventAcceptReject"> = async (request, { user }) => {
    const { eventId, inviteId, status } = request;
    const invite = await EventJoinInvite.findById({ _id: inviteId });
    if (!invite) throw new Boom("Invitation does not exist", { statusCode: NOT_FOUND });
    else if (invite.status === Status.FRIEND_REQUEST_PENDING) {
        const updateFriendReq = await EventJoinInvite.findByIdAndUpdate(
            { _id: inviteId },
            {
                status,
                updatedAt: Date.now(),
            });
        const acceptedUser = await User.findOne({ _id: user.userId }, "photoUrl firstName lastName deviceToken")
        const inviteRequestor = await User.findOne({ _id: invite.senderId }, "photoUrl firstName lastName deviceToken")
        let notificationText = '';
        if (status === Status.FRIEND_REQUEST_ACCEPT) notificationText = `${acceptedUser?.firstName || ''} has accepted your invitation`;
        else notificationText = `${acceptedUser?.firstName || ''} has rejected your invitation`;
        await Notification.findOneAndUpdate(
            {
                'extraInfo.invitationId': inviteId,
            },
            {
                $set: {
                    notificationType: Status.NOTIFICATION_TYPE_EVENT_JOIN_INVITE,
                    notificationText
                }
            },
            { new: true }
        ).exec();

        
        await Notification.findOneAndUpdate({
            userId:user.userId,
            eventId,
            notificationType: Status.NOTIFICATION_TYPE_EVENT_JOIN_INVITE
        },
        {
            $set: {
                notificationType:Status.NOTIFICATION_TYPE_NOTE,
                'extraInfo.processed': 'yes'
            }
        }
        );

        await Notification.create({
            userId: invite.senderId,
            notificationType: Status.NOTIFICATION_TYPE_EVENT_JOIN_INVITE,
            notificationText,
            extraInfo: {
                inviteId,
                friendRequestorPhotoUrl: acceptedUser?.photoUrl || '',
                friendRequestorName: `${acceptedUser?.firstName || ''}  ${acceptedUser?.lastName || ''}`
            }
        });

        const payload = {
            notification: {
                title: notificationText,
                body: notificationText,
                image: acceptedUser?.photoUrl
            }
        };

        await sendPushNotifications(payload, inviteRequestor?.deviceToken, Status.NOTIFICATION_TYPE_EVENT_JOIN_INVITE)


        if (!updateFriendReq) throw new Boom("Failed to update invitation response", { statusCode: BAD_REQUEST });

        return { message: `Invite  ${status} successfully` };
    } else throw new Boom("Invitation request not found", { statusCode: NOT_FOUND });
};

export default handler;
