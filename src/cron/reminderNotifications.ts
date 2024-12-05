import Event from "../model/event";
import moment from "moment-timezone";
import { sendPushNotifications } from "../utils/pushNotifications";
import Notification from "../model/notification";
import Status from "../helpers/constant";
import genericNotification from "../model/genericNotification";
import notification from "../model/notification";

const DEFAULT_TIME_ZONE = 'Asia/Karachi'
const DATE_TIME_MILESTONE = 'DATE_TIME'
export const handleSendReminderNotification = async () => {
  try {

    const currentTime = moment().utc();
    const oneMinBefore = moment(currentTime).subtract(1, 'minutes');
    const oneMinAfter = moment(currentTime).add(1, 'minutes');
    console.log("currentTime:",currentTime)
    const events = await genericNotification
    .find({
      notificationTime: {
        $elemMatch: {
          $gte: oneMinBefore.toDate(),
          $lte: oneMinAfter.toDate(),
        },
      },
      isDeleted: "n",
    })
    .populate({
      path: 'userId',
      select: 'deviceToken',
    })
    .exec();
  
    const filteredEvents = events.map(event => {
      const matchingTimes = event.notificationTime.filter(time =>
        moment(time).isBetween(oneMinBefore, oneMinAfter)
      );
      return { ...event.toObject(), notificationTime: matchingTimes };
    });

    events.map(async (event) => {

      if (!event?.notificationTime[0]) {
        return
      }
      const payload = {
        notification: {
          title: event.title,
          body: event.body,
        },
        data: {
          screen: event.Screen,
          screenId: event.ScreenId,
          type: Status.MILESTONE_CHECK_IN,
        },
      };
      //@ts-ignore
      sendPushNotifications(payload, event.userId?.deviceToken, Status.MILESTONE_CHECK_IN);
      console.log("sent push notifications")
      await genericNotification.deleteOne({ _id: event._id });
      await notification.deleteOne({ _id: event.notificationId })
    })

   // const notificationData = await genericNotification.find({ notificationPushed: "n" });

  } catch (e) {
    console.log("error", e);
  }
};