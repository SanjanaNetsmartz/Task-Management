const express = require("express");
const mainController = require("../controllers/taskSchemaController");

const router = express.Router();
console.log(router.delete, ">>>>>>>>>>>>>>>>>");

//post
router.post("/createUser", mainController.createUser);
// router.post("/createTask", mainController.authorize, mainController.createTask);
router.post("/createTask", mainController.createTask);
router.post("/login", mainController.login);

//delete
router.delete("/deleteTask", mainController.deleteTask);

//get
router.get("/tasks", mainController.getAllTasks);

//update
router.put("/updateTask", mainController.updateTask);

module.exports = router;
