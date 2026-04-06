const mongoose = require("mongoose");

/**
 * Validation rules available in schemas:
 *   required        — must exist and not be empty string
 *   isEmail         — basic email format
 *   minLength: n    — string must be at least n chars
 *   isNumber        — must be a finite number
 *   isPositive      — must be > 0
 *   isMongoId       — must be a valid MongoDB ObjectId
 */

const validators = {
  required: (val, _opt, field) => {
    if (val === undefined || val === null || val === "") {
      return `${field} is required`;
    }
  },
  isEmail: (val, _opt, field) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (val && !re.test(val)) return `${field} must be a valid email`;
  },
  minLength: (val, opt, field) => {
    if (val && String(val).length < opt) {
      return `${field} must be at least ${opt} characters`;
    }
  },
  isNumber: (val, _opt, field) => {
    if (val !== undefined && (typeof val !== "number" || !isFinite(val))) {
      return `${field} must be a number`;
    }
  },
  isPositive: (val, _opt, field) => {
    if (val !== undefined && Number(val) <= 0) {
      return `${field} must be greater than 0`;
    }
  },
  isMongoId: (val, _opt, field) => {
    if (val && !mongoose.Types.ObjectId.isValid(val)) {
      return `${field} must be a valid ID`;
    }
  },
};

/**
 * validate(schema) — returns an Express middleware.
 *
 * schema example:
 * {
 *   email:    { required: true, isEmail: true },
 *   password: { required: true, minLength: 6 },
 *   price:    { required: true, isNumber: true, isPositive: true },
 * }
 */
const validate = (schema) => (req, res, next) => {
  const errors = [];

  for (const [field, rules] of Object.entries(schema)) {
    const val = req.body[field];

    for (const [rule, option] of Object.entries(rules)) {
      if (!validators[rule]) continue;
      const error = validators[rule](val, option, field);
      if (error) {
        errors.push(error);
        break; // one error per field is enough
      }
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
};

module.exports = validate;
