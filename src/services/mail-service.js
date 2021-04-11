const { smtp } = require("../../configuration/config");
const nodemailer = require("nodemailer");
const Email = require("email-templates");
const path = require("path");
class MailService {
  constructor() {
    const root = path.join(
      __dirname,
      "../../",
      "configuration",
      "templates",
      "email"
    );
    const preview = true;
    const send = true;
    this.email = new Email({
      message: {},
      preview,
      send,
      transport: nodemailer.createTransport(smtp),
      views: {
        options: {
          extension: "ejs",
          root,
        },
        root,
      },
    });
  }
  /**
   * Triggered when a user clicks on link in email
   */
  async sendResetLink(data, resetLink) {
    console.log("resetLink", resetLink);
    console.log("data", data);
    console.log("message", this.message({ from: smtp.auth.user }, data));
    this.email
      .send({
        message: this.message({ from: smtp.auth.user }, data),
        template: "reset-password",
        locals: { resetLink: resetLink },
      })
      .then((success) => {
        console.log("success", success);
      })
      .catch((error) => {
        console.log("error", error);
        throw error;
      });
  }

  message(options, user) {
    return {
      from: options.from,
      to: `${user.email}`,
    };
  }
}

module.exports = {
  mailService: new MailService(),
};
