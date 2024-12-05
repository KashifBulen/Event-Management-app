import { makeServer } from "./server";
import DB from "./database";
import "../src/firebase";
import { makeCronRunner } from "./utils/cron-runner";
import { cacheFactory } from "./cache";
import { handleSendReminderNotification } from "./cron/reminderNotifications";
export const start = async () => {
  const server = makeServer();

  const [closeCron, closeServer] = await Promise.all([
    makeCronRunner(CRONS),
    server.start()
  ])

  DB.connectDB();
  cacheFactory.startMemoryCheck()

  return async () => {
    await closeCron()
    await closeServer()
    cacheFactory.close()
  }
};

const CRONS = [
  { id: 'send-reminder-notification', cron: '*/60 * * * * *', execute: handleSendReminderNotification },
]
