const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  firstName: { type: String },
  lastName: { type: String },
  password: { type: String, required: true },
});

module.exports = mongoose.model("Users", userSchema);
