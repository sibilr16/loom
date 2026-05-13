import Razorpay from "razorpay";
import dotenv from "dotenv";

dotenv.config();

export const instance = new Razorpay({
  key_id: process.env.RZP_KEY_ID,
  key_secret: process.env.RZP_KEY_SECRET,
});
