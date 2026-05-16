import User from "../models/auth.schema.js";

async function saveAddressHandler(req, res) {
  try {
    const userId = req.user._id;
    const {
      firstName,
      lastName,
      address,
      apartment,
      city,
      state,
      pinCode,
      country,
      saveInfo,
    } = req.body;

    if (saveInfo) {
      const user = await User.findByIdAndUpdate(
        userId,
        {
          $push: {
            addresses: {
              firstName,
              lastName,
              address,
              apartment,
              city,
              state,
              pinCode,
              country,
            },
          },
        },
        { new: true },
      );
    }

    res.json(user.addresses);
  } catch (error) {
    res.status(500).json({ message: "Failed to save address" });
  }
}

export default saveAddressHandler;
