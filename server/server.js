const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const nodemailer = require("nodemailer");
const twilio = require("twilio");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// --- Twilio Setup ---
const accountSid = "YOUR_TWILIO_SID";
const authToken = "YOUR_TWILIO_AUTH_TOKEN";
const twilioClient = twilio(accountSid, authToken);
const twilioNumber = "YOUR_TWILIO_PHONE_NUMBER";

// --- Nodemailer Setup ---
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "m.krishnanath0716@gmail.com",
    pass: "YOUR_EMAIL_APP_PASSWORD", // Use App password if 2FA enabled
  },
});

// --- SMS Route ---
app.post("/api/send-sms", async (req, res) => {
  const { number, message } = req.body;
  try {
    await twilioClient.messages.create({
      body: message,
      from: twilioNumber,
      to: number,
    });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// --- Email Route ---
app.post("/api/send-email", async (req, res) => {
  const { email, subject, message } = req.body;
  try {
    await transporter.sendMail({
      from: "m.krishnanath0716@gmail.com",
      to: email,
      subject,
      text: message,
    });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// --- Start server ---
app.listen(5000, () => console.log("Server running on port 5000"));
