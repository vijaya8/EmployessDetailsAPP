module.exports = {
  env: "local",
  smtp: {
    auth: {
      pass: "v!jJu@123$",
      user: "vijaya@olivetech.net",
    },
    host: "smtp.gmail.com",
    port: "465",
    tls: {
      ciphers: "SSLv3",
    },
    secure: true,
  },
  jwt: {
    expiresIn: "1h",
    issuer: "test-server",
    subject: "some@user.com",
    audience: "http://mysoftcorp.in",
    algorithm: "RS256",
  },
  dbconfig: {
    MONGO_DB_ADDRESS: "localhost",
    MONGO_DB_PORT: "27017",
    MONGO_DB_NAME: "rhema-new-db",
  },
  smtpOptions: {
    dateFormat: process.env.SMTP_DATE_FORMAT || "MMMM D, YYYY h:mm A (UTC: ZZ)",
    from: process.env.SMTP_FROM || "itsupport@gmail.com",
    forgotPasswordTokenUrl: "http://localhost:3000/forgot-password",
    templates: "./templates/email",
    preview: true,
    send: true,
  },
};
