import admin from "firebase-admin";

type NotificationPayload = {
  notification: {
    title: string;
    body: string;
  };
  data?: { [key: string]: string };
};

export const sendPushNotifications = async (
  payload: NotificationPayload,
  deviceToken?: string,
  collapseKey?: string
) => {
  try {
    const options = {
      priority: "high",
      collapseKey: collapseKey || "notifications",
      timeToLive: 60 * 60 * 24, // 1 day
    };

    const res = deviceToken
      ? await admin
          .messaging()
          .sendToDevice(deviceToken as string, payload, options)
      : null;

   // console.log("Notification::", res);
    return !!res;
  } catch (e) {
    console.error("notification error", e);
  }
};
