const router = require("express").Router();
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const { userModel, validateUpdateUser } = require("../models/Users");
const {
  verifyTokenForAuth,
  verifyTokenForAdmin,
} = require("../middleware/sort");

/**
 * @desc update user
 * @route /api/users/:id
 * @method PUT
 * @access private
 */

router.put(
  "/:id",
  verifyTokenForAuth,
  asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    const { error } = validateUpdateUser(req.body);
    if (error) return res.status(404).json(error.details[0].message);

    const user = await userModel.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    let updateData = { username, email };

    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }
    const updateUser = await userModel
      .findByIdAndUpdate(req.params.id, { $set: updateData }, { new: true })
      .select("-password");

    res.status(200).json(updateUser);
  })
);

/**
 * @desc get users
 * @route /api/users
 * @method GET
 * @access private (Only Admin)
 */

router.get(
  "/",
  verifyTokenForAdmin,
  asyncHandler(async (req, res) => {
    const users = await userModel.find().select("-password");
    res.status(200).json(users);
  })
);

/**
 * @desc get user
 * @route /api/users/:id
 * @method GET
 * @access private (Only Admin, and user)
 */

router.get(
  "/:id",
  verifyTokenForAuth,
  asyncHandler(async (req, res) => {
    const user = await userModel.findById(req.params.id).select("-password");
    user
      ? res.status(200).json(user)
      : res.status(404).json({ message: "User Not Found - Error Code (404)" });
  })
);

/**
 * @desc DELETE user
 * @route /api/users/:id
 * @method DELETE
 * @access private (Only Admin, and user)
 */

router.delete(
  "/:id",
  verifyTokenForAuth,
  asyncHandler(async (req, res) => {
    const user = await userModel.findById(req.params.id);
    if (!user)
      return res
        .status(404)
        .json({ message: "User Not Found - Error Code (404)" });

    await userModel.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "User Has Been Deleted" });
  })
);

module.exports = router;
