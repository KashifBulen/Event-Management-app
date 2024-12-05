import moment from "moment-timezone";
import { Boom } from "@hapi/boom";
import User from "../../model/user";
import Event from "../../model/event";
import EventJoinInvite from "../../model/eventJoinInvite";
import EventJoin from "../../model/eventJoin";
import Milestone from "../../model/milestone";
import { BAD_REQUEST, OK } from "http-status";
import { Handler } from "../../utils/make-api";
import mongoose from "mongoose";
import Status from "../../helpers/constant";
import Notification from "../../model/notification";
import { sendPushNotifications } from "../../utils/pushNotifications";

const handler: Handler<"inviteFriendEventJoin"> = async (request, { user }) => {
  //   const userId = user.userId;
  const eventId = new mongoose.Types.ObjectId(request?.eventId);
  const { senderId, receiverId, milestoneId } = request;

  if (!eventId) {
    throw new Boom("Please choose an event to join!", {
      statusCode: BAD_REQUEST,
    });
  } else if (!senderId) {
    throw new Boom("Please add sender id!", { statusCode: BAD_REQUEST });
  } else if (!receiverId) {
    throw new Boom("Please add receiver id!", { statusCode: BAD_REQUEST });
  }

  const alreadyInvited = await EventJoinInvite.findOne({
    eventId,
    senderId,
    receiverId,
  });
  if (alreadyInvited) {
    throw new Boom("You have already invited this friend!", {
      statusCode: BAD_REQUEST,
    });
  } else {
    const eventJoined = await EventJoinInvite.create({
      eventId,
      senderId,
      receiverId,
    });
    if (!eventJoined) {
      throw new Boom("Error during inviting to an event", {
        statusCode: BAD_REQUEST,
      });
    } else {
      const userDetail = await User.findOne({ _id: receiverId });

      const eventInfo = await Event.findById(eventId).populate("eventTypeId");
      const requesterUser = await User.findOne(
        { _id: senderId },
        "photoUrl firstName lastName deviceToken"
      );

      // Check if milestone needs to be complete as per defined completion criteria
      const eventInvitationCount = await EventJoinInvite.countDocuments({
        eventId,
        senderId,
      });
      const eventMilestons = eventInfo?.eventMilestoneList; //![0]?.milestoneCompletionCriteria?.[Status.MILESTONE_INVITE_FRIEND];
      //@ts-ignore
      const eventType = eventInfo?.eventTypeId?.eventTypeName;

      console.log("Event", eventInfo, eventMilestons);

      let completeInviteFriendMilestone = false;
      if (eventMilestons) {
        for (const milestone of eventMilestons) {
          if (milestone.milestoneIdentifier === Status.MILESTONE_INVITE_FRIEND) {
            console.log('compare', milestone, eventInvitationCount, milestone.milestoneCompletionCriteria?.[Status.MILESTONE_INVITE_FRIEND])
            if (eventInvitationCount >= milestone.milestoneCompletionCriteria?.[Status.MILESTONE_INVITE_FRIEND]) completeInviteFriendMilestone = true;
          }
        }
      }//*/

      if (userDetail) {
        let notificationText = "You have invitation to join event";

        if (eventType === "live") {
          //@ts-ignore
          for (const milestone of eventMilestons) {
            if (milestone.milestoneIdentifier === Status.MILESTONE_DATE_TIME) {
              const liveEventDateTime = milestone.milestoneData[0];
              if (liveEventDateTime.ruleType === "days") {
                notificationText = `${notificationText} happening at `;
                for (const unixTimestamp of liveEventDateTime.selectedDates) {
                  const humanReadableDate = moment
                    .unix(unixTimestamp / 1000)
                    .format("YYYY-MM-DD");
                  notificationText += `${humanReadableDate} `;
                }
              } else if (liveEventDateTime.ruleType === "range") {
                const startDate = liveEventDateTime.startDate; // Replace this with your actual start date in milliseconds
                const endDate = liveEventDateTime.endDate; // Replace this with your actual end date in milliseconds

                // Create moment objects from the start and end dates
                const currentDate = moment(startDate);
                const finalDate = moment(endDate);
                notificationText = `${notificationText} happening from ${currentDate.format(
                  "YYYY-MM-DD"
                )} to ${finalDate.format("YYYY-MM-DD")}`;
                // Loop through the dates
                /*while (currentDate.isSameOrBefore(finalDate)) {
                // Do something with the current date
                console.log(currentDate.format('YYYY-MM-DD'));
                notificationText += `${currentDate.format('YYYY-MM-DD')} `;
                // Move to the next date
                currentDate.add(1, 'days'); // You can change 'days' to 'weeks', 'months', or other units as needed
              }//*/
              }

              break;
            }
          }
        }
        await Notification.create({
          userId: userDetail?._id,
          eventId,
          notificationType: Status.NOTIFICATION_TYPE_EVENT_JOIN_INVITE,
          notificationText,
          extraInfo: {
            // friendRequestId: id,
            eventId,
            inviteId: eventJoined?._id,
            invitationStatus: Status.FRIEND_REQUEST_PENDING,
            friendRequestorPhotoUrl: requesterUser?.photoUrl || "",
            friendRequestorName: `${requesterUser?.firstName || ""}  ${requesterUser?.lastName || ""
              }`,
            eventPhoto: eventInfo?.eventPhoto || "",
          },
        });

        const payload = {
          notification: {
            title: notificationText,
            body: notificationText,
            // image: eventInfo?.eventPhoto || ''
          },
          data: {
            screen: "eventPreview",
            screenId: eventId.toString(),
            type: "event-join",
          },
        };

        if (userDetail?.deviceToken)
          await sendPushNotifications(
            payload,
            userDetail?.deviceToken,
            Status.NOTIFICATION_TYPE_EVENT_JOIN_INVITE
          );
      }

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
      //When friend invite sent, we must complete this mileston as per MAURIT

      return {
        completeInviteFriendMilestone,
        message: "Invite sent successfully"
      };
    }
  }
};

export default handler;
