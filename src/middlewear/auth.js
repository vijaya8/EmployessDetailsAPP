const { authService } = require("../services/jwt-token-service");

module.exports = async (req, res, next) => {
  try {
    const verified = await authService.verifyToken(req);
    if (verified && verified.email) {
      next();
    } else {
      throw { name: "Jwt Error", message: "Please provide valid token" };
    }
  } catch (error) {
    console.log("err", error);
    res.status(401).json({
      message: error,
    });
  }
};
