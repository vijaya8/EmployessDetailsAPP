const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const employeeSchema = new Schema({
  fullName: { type: String, required: true },
  jobTitle: { type: String },
  department: { type: String },
  location: { type: String },
  age: { type: Number },
  salary: { type: Number },
});

module.exports = mongoose.model("employees", employeeSchema);
