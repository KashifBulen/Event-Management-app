import { Worker } from "worker_threads";
import path from "path";
import Event from "../model/event";

const workerScriptPath = path.join(
  __dirname,
  "../",
  "workers",
  "sendEmail.worker.ts"
);

export const sendEventInvitation = async (eventId: any, email: string) => {
  const worker = new Worker(workerScriptPath);
  try {
    const getEventLink = await Event.findOne({ _id: eventId });
    if(getEventLink){
    const  html = `Hello! <br> You are being invited to join a event.
      <b>Click this link to join event: ${getEventLink.eventLink}</b>`
    const  subject = 'Event invitation'

    const workerData = {
      processName: "SEND-EMAIL",
      data: {
        to: `${email}`,
        subject,
        html,
      },
    };
    console.log("invitation",workerData);
    worker.postMessage(workerData);
    }

  } catch (error: any) {
    console.log("error", error);
  }
};
