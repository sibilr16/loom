import client from "../config/twilio.js";
import User from "../models/auth.schema.js";
import generateToken from "../utils/generateToken.js";

export default async function verifyOtpHandler(req, res) {
  console.log(req.body);

  try {
    const formattedPhone = `+91${req.body.phoneNumber}`;
    const verificationCheck = await client.verify.v2
      .services(process.env.TWILIO_SERVICE_SID)
      .verificationChecks.create({
        code: req.body.phoneOtp,
        to: formattedPhone,
      });

    if (verificationCheck.status !== "approved") {
      return res.status(400).json({ message: "Invalid OTP" });
    }
    console.log("OTP approved");
    // console.log(formattedPhone);
    let user = await User.findOne({ phoneNumber: formattedPhone });

    if (!user) {
      user = new User({
        phoneNumber: formattedPhone,
      });
      const data = await user.save();
      const userId = data._id;
      generateToken(res, userId);
      return res.status(200).json(data);
    }

    if (!user?.isProfileCompleted) {
      const userId = user._id;
      generateToken(res, userId);
      return res.status(200).json(user);
    }

    const userId = user._id;
    generateToken(res, userId);
    return res.status(200).json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
}
