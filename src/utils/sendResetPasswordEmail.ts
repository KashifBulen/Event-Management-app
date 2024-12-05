import { Worker } from "worker_threads";
import path from "path";

const workerScriptPath = path.join(
  __dirname,
  "../",
  "workers",
  "sendEmail.worker.ts"
);

export const sendResetPasswordLink = async (email: string , link:string) => {
  const worker = new Worker(workerScriptPath);
  try {

    const workerData = {
      processName: "SEND-EMAIL",
      data: {
        to: `${email}`,
        subject: "Reset Password Email",
        html: `Hello!
                <b>Your Reset Password Link is: ${link}</b>
                <p>The aim of this email is to inform you that you are now part of Mttrs community. </p>`,
      },
    };

    worker.postMessage(workerData);
  } catch (error: any) {
    console.log("error", error);
  }
};
