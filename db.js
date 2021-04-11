const mongoose = require("mongoose");
const url = "mongodb://localhost:27017/testDB";

let connection = mongoose
  .connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "testDB",
    useFindAndModify: false,
  })
  .then(
    (data) => {
      /** ready to use. The `mongoose.connect()` promise resolves to mongoose instance. */
      console.log("DB connected succesfully");
    },
    (err) => {
      /** handle initial connection error */
      console.log("error while connecting to db", err);
    }
  );
exports.mongoose = connection;
