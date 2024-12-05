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
import genericNotification from "../../model/genericNotification";
import moment from "moment";


interface Times {
  date: string;
  startTime: string;
  endTime: string;
}
const handler: Handler<"completeMilestoneDateTime"> = async (request, { user }) => {
  const eventId = new mongoose.Types.ObjectId(request?.eventId);
  const milestoneId = new mongoose.Types.ObjectId(request?.milestoneId);

  const { notificationTime } = request;

  let validateTimeAndDate: boolean = true;
  const currentTime = moment();
  let notificationTimes;

  if (!notificationTime || !notificationTime.type || !notificationTime.times) {
    throw new Boom("Invalid notificationTime format", { statusCode: BAD_REQUEST });
  }


  if (notificationTime?.type === "single") {
    if (!notificationTime?.times) {
      throw new Boom("No date and time found ", { statusCode: BAD_REQUEST });
    }

    const { date, startTime } = notificationTime?.times;
    console.log("notificationTime.times", notificationTime.times);

    const startDateTime = moment(`${date} ${startTime}`);
    const notificationTimeBefore = startDateTime.subtract(5, 'minutes').utc();

    validateTimeAndDate = currentTime.isBefore(startDateTime);

    notificationTimes = notificationTimeBefore.toDate();
    console.log("notificationTimes:", notificationTimes)

  } else {
    if (!notificationTime?.times || !notificationTime.times.length) {
      throw new Boom("No date and time found ", { statusCode: BAD_REQUEST });
    }

    notificationTimes = notificationTime.times.map((time: Times) => {
      const { date, startTime } = time;
      const dateTimeString = `${date} ${startTime}`;
      const startDateTime = moment(dateTimeString, 'YYYY-MM-DD HH:mm:ss', true); // Specify the format

      if (!startDateTime.isValid()) {
        throw new Boom(`Invalid date and time format: ${dateTimeString}`, { statusCode: BAD_REQUEST });
      }

      return startDateTime.subtract(5, 'minutes').utc().format();
    });

    validateTimeAndDate = notificationTimes.some((stringTime: string) => {
      return currentTime.isBefore(moment(stringTime));
    });
  }

  if (!eventId) {
    throw new Boom(
      "Please choose an event!",
      { statusCode: BAD_REQUEST }
    );
  } else if (!milestoneId) {
    throw new Boom("Please choose a milestone to complete!", { statusCode: BAD_REQUEST });
  } else {
    if (!validateTimeAndDate) {
      throw new Boom("Invalid date!", { statusCode: BAD_REQUEST });
    }
    const userId = user.userId;
    const eventInfo = await Event.findById(eventId).populate("eventTypeId");
    const eventMilestones = eventInfo?.eventMilestoneList;

    if (eventMilestones) {
      for (const milestone of eventMilestones) {
        if (milestone.milestoneIdentifier === Status.MILESTONE_DATE_TIME) {
          let eventMilestoneInfo = await EventJoin.findOne({
            userId,
            eventId
          }).sort({ createdAt: 1 });

          if (eventMilestoneInfo) {
            const milestoneExists = eventMilestoneInfo.milestonesCompleted.some(
              (milestoneCompleted) => milestoneCompleted.milestoneId === milestoneId
            );

            if (!milestoneExists) {
              await EventJoin.updateOne(
                { userId, eventId },
                {
                  $set: {
                    'extraInfo.milestone_set_datetime_data': {
                      milestone: Status.MILESTONE_DATE_TIME,
                      notificationTime: notificationTime,
                      completedDate: new Date()
                    }
                  }
                });


              const existingNotification = await Notification.findOne({ userId, eventId });


              if (existingNotification) {

                const updatedResult = await genericNotification.findOneAndUpdate(
                  { notificationId: existingNotification._id },
                  {
                    notificationTime: notificationTimes,
                  },
                  { new: true }
                );
              }
              else {

                const notificationText = "Don't forget to check-in, just 5 minutes remaining to event";
                const notification = await Notification.create({
                  userId,
                  eventId,
                  notificationType: Status.MILESTONE_CHECK_IN,
                  notificationText: notificationText
                })


                const result = await genericNotification.create({
                  userId: userId,
                  notificationId: notification._id,
                  notificationTime: notificationTimes,
                  notificationStatus: Status.MILESTONE_CHECK_IN,
                  title: 'Live Event Reminder',
                  body: notificationText,
                  Screen: "event-check-in",
                  ScreenId: eventId,
                })
                await eventMilestoneInfo.save();
              }
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

    return { message: "Milestone completed successfully" };

  }

};

export default handler;
