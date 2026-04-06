const express = require("express");
const { login } = require("../controllers/authController");
const validate = require("../middleware/validate");

const router = express.Router();

const loginSchema = {
  email: { required: true, isEmail: true },
  password: { required: true },
};

router.post("/login", validate(loginSchema), login);

module.exports = router;
