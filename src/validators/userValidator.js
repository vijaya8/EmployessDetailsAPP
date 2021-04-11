const { body, validationResult } = require("express-validator");
const checkLoginValidator = () => {
  return [
    body("email").isEmail(),
    body("password").notEmpty().isLength({ min: 1 }),
  ];
};

const checkCreateUserValidator = () => {
  return [
    body("email").isEmail(),
    body("password")
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide minimum 1 character"),
    body("firstname")
      .exists()
      .withMessage("Please provide first name")
      .isString()
      .withMessage("Please provide valid data"),
    body("lastname")
      .exists()
      .withMessage("Please provide last name")
      .isString()
      .withMessage("Please provide valid data"),
  ];
};

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const extractedErrors = [];
  errors.array().map((err) => extractedErrors.push({ [err.param]: err.msg }));
  return res.status(400).json({
    status: "failure",
    message: extractedErrors,
  });
};

module.exports = {
  checkLoginValidator,
  checkCreateUserValidator,
  validate,
};
