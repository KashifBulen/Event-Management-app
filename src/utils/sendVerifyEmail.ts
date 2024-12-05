import { randomCode } from "./common";
import { Worker } from "worker_threads";
import User from "../model/user";
import path from "path";

const workerScriptPath = path.join(
  __dirname,
  "../",
  "workers",
  "sendEmail.worker.ts"
);

export const sendEmail = async (id: any, email: string, sendEmailType: 'signUp' | 'login') => {
  const worker = new Worker(workerScriptPath);
  try {
    const otp = randomCode(4);
    // Add 5 minutes to the current time
    const twentyFourHoursLater = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
    await User.findByIdAndUpdate(
      { _id: id },
      {
        otp: { code: otp, expireTime: twentyFourHoursLater },
        updatedAt: Date.now(),
      }
    );

    let html
    let subject

    if (sendEmailType === 'signUp') {
      html = `Hello! <br> Thank you for your registration with Mttrss.
      <b>Your OTP is: ${otp}</b>
      <p>The aim of this email is to inform you that you are now part of Mttrs community. </p>`
      subject = 'Signup Confirmation Email'
    } else if (sendEmailType === 'login') {
      html = `Hello! <br> Thank you for verifiying your email.
        <b>Your OTP is: ${otp}</b>
        <p>The aim of this email is to inform you that you are now part of Mttrs community. </p>`
      subject = 'Verify  Email'
    }

    const workerData = {
      processName: "SEND-EMAIL",
      data: {
        to: `${email}`,
        subject,
        html,
      },
    };

    worker.postMessage(workerData);
  } catch (error: any) {
    console.log("error", error);
  }
};
