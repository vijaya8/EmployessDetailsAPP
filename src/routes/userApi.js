const express = require("express");
const router = express.Router();
const {
  checkLoginValidator,
  checkCreateUserValidator,
  validate,
} = require("../validators/userValidator");
const User = require("../models/users");
const bcrypt = require("bcrypt-nodejs");
const { authService } = require("../services/jwt-token-service");
const ObjectId = require("mongodb").ObjectID;
const { mailService } = require("../services/mail-service.js");
const { smtpOptions } = require("../../configuration/config");
const {
  BAD_REQUEST,
  OK,
  SERVER_ERROR,
  NOT_FOUND,
  DUPLICATE_RESOURCE,
  FORBIDDEN,
} = require("../services/http-status");

router.post(
  "/register",
  checkCreateUserValidator(),
  validate,
  async (request, response, next) => {
    const { email, password, firstname, lastname } = request.body;
    const user = new User();
    try {
      let data = {
        email: request.body.email,
      };
      let userDetails = await User.findOne(data);
      if (userDetails) {
        throw {
          name: "DUPLICATE_RESOURCE",
          message: "User already registered",
        };
      }
      const pwHash = bcrypt.hashSync(password);
      console.log(pwHash, "pwHash");
      user.email = email;
      user.password = pwHash;
      user.firstName = firstname;
      user.lastName = lastname;
      const userCreated = await user.save();
      if (userCreated) {
        response.status(200).send(user);
      }
    } catch (err) {
      console.log("err in login", err);
      let errObj;
      switch (true) {
        case err.name == "DUPLICATE_RESOURCE":
          errObj = {
            status: DUPLICATE_RESOURCE,
            message: err.message,
          };
          break;
        case err.name == "BAD_REQUEST":
          errObj = {
            status: BAD_REQUEST,
            message: err.message,
          };
          break;
        default:
          errObj = {
            status: SERVER_ERROR,
            message: err.message,
          };
      }
      response.send(errObj);
    }
  }
);

router.post(
  "/login",
  checkLoginValidator(),
  validate,
  async (request, response, next) => {
    try {
      let data = {
        email: request.body.email,
      };
      let userDetails = await User.findOne(data);
      console.log("userDetails", userDetails);
      if (
        userDetails &&
        bcrypt.compareSync(request.body.password, userDetails.password)
      ) {
        let token = await authService.generateJwt({
          userId: userDetails._id,
          email: userDetails.email,
        });
        response.status(200).send({ token: { userToken: token } });
      } else {
        throw {
          name: "BAD_REQUEST",
          message: "Un Authorized Details",
        };
      }
    } catch (err) {
      console.log("err in login", err);
      let errObj;
      switch (true) {
        case err.name == "BAD_REQUEST":
          errObj = {
            status: BAD_REQUEST,
            message: err.message,
          };
          break;
        default:
          errObj = {
            status: SERVER_ERROR,
            message: err.message,
          };
      }
      response.send(errObj);
    }
  }
);

router.post("/sendResetPasswordLink", async (request, response, next) => {
  const { email } = request.body;
  try {
    let data = {
      email: email,
    };
    let userDetails = await User.findOne(data);
    if (userDetails) {
      tokenData = {
        userId: userDetails._id,
        email: userDetails.email,
      };
      var token = await authService.generateJwt(tokenData);
      let resetTokenUrl = `${smtpOptions.forgotPasswordTokenUrl}?token=${token}`;
      await mailService.sendResetLink({ email: email }, resetTokenUrl);
      response.status(OK).send({ message: "Mail sent" });
    } else {
      throw {
        name: "NOT_FOUND",
        message: "User not found",
      };
    }
  } catch (err) {
    let errObj;
    switch (true) {
      case err.name == "NOT_FOUND":
        errObj = {
          status: NOT_FOUND,
          message: err.message,
        };
        break;
      default:
        errObj = {
          status: SERVER_ERROR,
          message: err.message,
        };
    }
    response.send(errObj);
  }
});

router.post("/updatePassword/:token", async (request, response, next) => {
  const { password } = request.body;
  try {
    var pwd = await bcrypt.hashSync(password);
    let token = request.params.token || null;
    console.log("token", token);
    if (token) {
      const tokenParts = token.split(".");
      if (tokenParts && tokenParts.length !== 3) {
        throw 403;
      }
      const { userId } = await authService.verifyToken(request);
      const user = await User.findOne({
        _id: ObjectId(userId),
      });
      if (!user) {
        throw 403;
      }
      await User.findOneAndUpdate({ _id: ObjectId(userId) }, { password: pwd });
      response.status(OK).send({ message: "password updated successfully" });
    }
  } catch (err) {
    console.log("err", err);
    switch (true) {
      case err === 403:
        response.send({ message: "User don't have access" }).status(FORBIDDEN);
        break;
      case err.name == "JWT_Expired":
        response.send({ message: err.message }).status(BAD_REQUEST);
        break;
      default:
        response.send({ message: "Bad request" }).status(BAD_REQUEST);
    }
  }
});

module.exports = router;
