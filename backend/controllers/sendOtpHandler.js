import client from "../config/twilio.js";

export default async function sendOtpHandler(req, res) {
  // console.log(req.body);

  const formattedPhone = `+91${req.body.phone}`;

  const verification = await client.verify.v2
    .services(process.env.TWILIO_SERVICE_SID)
    .verifications.create({
      channel: "sms",
      to: formattedPhone,
    });
  if (verification.status === "pending") {
    console.log("Waiting for OTP");
    return res.status(200).json({
      message: "OTP sent",
    });
  }
}
