const { parentPort } = require("worker_threads");
const { sendEmail } = require("../utils/mailer");


//@ts-ignore
parentPort?.on("message", async (workerData) => {
  try {
    if (workerData.processName === "SEND-EMAIL") {
      const info = await sendEmail(
        workerData.data.to,
        workerData.data.subject,
        workerData.data.html
      );
      parentPort?.postMessage({ status: "success", info });
    }
  } catch (error) {
    parentPort?.postMessage({ status: "error", error });
  }
});
