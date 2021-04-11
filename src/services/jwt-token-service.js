const jwtLib = require("jsonwebtoken");
const { jwt } = require("../../configuration/config");
const fs = require("fs");
const path = require("path");

class JwtTokenService {
  constructor() {
    this.privateKEY = fs.readFileSync(
      path.join(__dirname, "../../", "configuration", "keys", "private.key"),
      "utf8"
    );
    this.publicKEY = fs.readFileSync(
      path.join(__dirname, "../../", "configuration", "keys", "public.key"),
      "utf8"
    );

    this.signOptions = {
      algorithm: jwt.algorithm,
      expiresIn: jwt.expiresIn,
      issuer: jwt.issuer,
      subject: jwt.subject,
      audience: jwt.audience,
    };
  }

  async verifyToken(request) {
    try {
      console.log(request.headers, "headers");
      const token = request.params.token || request.headers.token;
      console.log(token, "token");
      const verified = await jwtLib.verify(
        token,
        this.publicKEY,
        this.signOptions
      );
      console.log(verified, "verified");
      return verified;
    } catch (err) {
      console.log("err", err);
      switch (true) {
        case err instanceof jwtLib.TokenExpiredError:
          throw { name: "JWT_Expired", message: err.message };
        case err instanceof jwtLib.JsonWebTokenError:
          throw { name: "JsonWebTokenError", message: err.message };
        case err instanceof TypeError:
          throw { name: "INVALID_PARAMETER", message: err.message };
        default:
          throw { name: "JWT_Expired", message: err.message };
      }
    }
  }

  async generateJwt(payload) {
    try {
      const token = await jwtLib.sign(
        payload,
        this.privateKEY,
        this.signOptions
      );
      return token;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = {
  authService: new JwtTokenService(),
};
