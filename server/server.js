const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
// const twilio = require("twilio"); // Uncomment if using Twilio

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ✅ --- EMAIL API ---
app.post("/api/send-email", async (req, res) => {
  const { email, subject, message } = req.body;

  if (!email || !subject || !message) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // Configure your SMTP mail server
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: "m.krishnanath0716@gmail.com", // 🔹 Replace with your email
        pass: "nkqz lyjb bdre ngsg", // 🔹 Use an App Password (not your real Gmail password)
      },
    });

    const mailOptions = {
      from: '"Mosque Fund" <m.krishnanath0716@gmail.com>',
      to: email,
      subject,
      text: message,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: "Email sent successfully!" });
  } catch (err) {
    console.error("Email send error:", err);
    res.status(500).json({ error: "Failed to send email" });
  }
});

// ✅ --- SMS API (optional) ---
app.post("/api/send-sms", async (req, res) => {
  const { number, message } = req.body;

  if (!number || !message) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // Example using Twilio (if enabled)
    const twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);
    await client.messages.create({
      body: message,
      from: "+12173029049", // your Twilio number
      to: number,
    });

    console.log(`Simulated SMS to ${number}: ${message}`);
    res.status(200).json({ success: true, message: "SMS sent successfully!" });
  } catch (err) {
    console.error("SMS send error:", err);
    res.status(500).json({ error: "Failed to send SMS" });
  }
});

// ✅ Default route
app.get("/", (req, res) => {
  res.send("Mosque Fund API running...");
});

// ✅ Start server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
