import jwt from "jsonwebtoken";

function generateToken(res, userId) {
  const token = jwt.sign({ userId: userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  console.log("Generated Token:", token);

  res.cookie("token", token, {
    httpOnly: true,
    // secure: false,
    secure: true,
    // sameSite: "lax",
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

export default generateToken;
