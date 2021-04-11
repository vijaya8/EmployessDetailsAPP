const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const db = require("./db");
const usersRouter = require("./src/routes/userApi");
const employeesRouter = require("./src/routes/employeeApi");
const indexRouter = require("./src/routes/index");
const port = 3000;
const auth = require("./src/middlewear/auth");
const env = process.env.NODE_ENV;
const corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200,
};

app.use(cors("*"));
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Set 'views' directory for any views
// being rendered res.render()
app.set("views", path.join(__dirname, "./configuration/templates"));

// Set view engine as EJS
app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");

process.on("unhandledRejection", (err) => {
  console.log(err, "err for migration");
  process.exit(0);
});

app.use("/", indexRouter);
app.use("/api/user", usersRouter);
app.use("/api/employee", auth, employeesRouter);

app.listen(port, () => console.log(`new server ${port}!`));
