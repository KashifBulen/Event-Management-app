import cron from "node-cron";
import express from "express";
import DB from "./src/database";
import dotenv from "dotenv";
import "./src/firebase";
import { handleSendReminderNotification } from "./src/cron/reminderNotifications";
const app = express();

dotenv.config();

startCronAndConnectDatabase();

cron.schedule("*/60 * * * * *", function () {
  console.log("Calling at 60th sec")
  handleSendReminderNotification();
  // DB.disconnectDB();
});


async function startCronAndConnectDatabase() {
  await DB.connectDB();
  app.listen(2000, () => {
    console.log("cron listening.....");
  });
}
