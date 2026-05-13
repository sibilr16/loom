import User from "../models/auth.schema.js";

async function completeProfileHandler(req, res) {
  try {
    const userId = req.user._id;

    const user = await User.findByIdAndUpdate(
      userId,
      {
        username: req.body.username,
        email: req.body.email,
        isProfileCompleted: true,
      },
      { new: true },
    );

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}

export default completeProfileHandler;
