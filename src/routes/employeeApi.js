const express = require("express");
const router = express.Router();
const Employee = require("../models/employees");
const ObjectId = require("mongodb").ObjectID;
const {
  BAD_REQUEST,
  OK,
  SERVER_ERROR,
  NOT_FOUND,
} = require("../services/http-status");

router.get("/allEmployeesList", async (request, response, next) => {
  const { offSet, limit } = request.query;
  try {
    let query = Employee.find({}).skip(parseInt(offSet)).limit(parseInt(limit));
    query.exec(function (err, data) {
      let employeeList = data;
      if (data) {
        response.status(OK).send(employeeList);
      } else {
        throw {
          name: "NOT_FOUND",
          message: "Employees are not found",
        };
      }
    });
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

router.post("/create", async (request, response, next) => {
  const {
    fullName,
    jobTitle,
    department,
    location,
    age,
    salary,
  } = request.body;
  const employee = new Employee();
  try {
    employee.fullName = fullName;
    employee.jobTitle = jobTitle;
    employee.department = department;
    employee.location = location;
    employee.age = age;
    employee.salary = salary;
    const employeeCreated = await employee.save();
    if (employeeCreated) {
      response.status(OK).send(employeeCreated);
    }
  } catch (err) {
    response
      .status(BAD_REQUEST)
      .send({ message: "Error while creating the employee" });
  }
});

router.post("/update/:id", async (request, response, next) => {
  const {
    fullName,
    jobTitle,
    department,
    location,
    age,
    salary,
  } = request.body;
  try {
    let data = {
      _id: request.params.id,
    };
    let employeeDetails = await Employee.findOne(data);
    if (employeeDetails) {
      let updateEmployeeData = {
        fullName: fullName,
        jobTitle: jobTitle,
        department: department,
        location: location,
        age: age,
        salary: salary,
      };
      let updatedEmployeeDetails = await Employee.findOneAndUpdate(
        { _id: ObjectId(request.params.id) },
        updateEmployeeData
      );
      response.status(OK).send({ employeeData: updatedEmployeeDetails });
    } else {
      throw {
        name: "NOT_FOUND",
        message: "Employee not found",
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

router.post("/delete/:id", async (request, response, next) => {
  try {
    let data = {
      _id: request.params.id,
    };
    let employeeDetails = await Employee.findOne(data);
    if (employeeDetails) {
      await Employee.remove({
        _id: ObjectId(request.params.id),
      });
      response.status(OK).send({ message: "Employee deleted successfully" });
    } else {
      throw {
        name: "NOT_FOUND",
        message: "Employee not found",
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

module.exports = router;
