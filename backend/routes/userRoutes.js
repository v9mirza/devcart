const express = require("express");
const router = express.Router();

const { createUser, getMe } = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");
const validate = require("../middleware/validate");

const registerSchema = {
  name: { required: true },
  email: { required: true, isEmail: true },
  password: { required: true, minLength: 6 },
};

router.post("/", validate(registerSchema), createUser);
router.get("/me", protect, getMe);

module.exports = router;
