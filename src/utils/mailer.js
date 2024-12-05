const sendgridMail = require("@sendgrid/mail");

sendgridMail.setApiKey(process.env.SENDGRID_API_KEY);

function sendEmail(to, subject, html) {
  console.log("sending email");
  const msg = {
    from: "info@mttrs.nl",
    to,
    subject,
    html,
  };

  return sendgridMail
    .send(msg)
    .then((e) => {
      console.log("Email sent");
    })
    .catch((error) => {
      console.log("Error sending email:", error);
      throw error;
    });
}

module.exports = {
  sendEmail,
};
