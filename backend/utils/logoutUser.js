export default function logoutUser(req, res) {
  res.cookie("token", "", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    expires: new Date(0),
  });

  res.status(200).json({ message: "Logged out successfully" });
}
