const TaskSchema = require("../models/taskmodel");
const User = require("../models/userSchemaModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.createUser = async (req, res) => {
  const { name, email, password } = req.body;
  console.log("request", req.body);
  if (!name || !email || !password) {
    return res.status(400).json({
      message: "enter the details",
    });
  }

  try {
    const preUser = await User.findOne({ email: email });
    if (preUser) {
      throw new error("User already exist");
    } else {
      const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
      });

      return res.status(200).json({
        status: "success",
        message: "user created successfullly",
        newUser,
      });
    }
  } catch (error) {
    return res.status(404).json({
      status: "fail",
      message: error.message,
    });
  }
};

exports.createTask = async (req, res) => {
  const { technology, task } = req.body;
  if (!technology || !task) {
    return res.status(400).json({
      message: "Provide details",
    });
  }

  try {
    const newTask = await TaskSchema.create({
      technology,
      task,
    });

    return res.status(200).json({
      status: "success",
      message: "task successfully created",
      newTask,
    });
  } catch (error) {
    return res.status(404).json({
      status: "fail",
      message: error.message,
    });
  }
};

//to check authentication while login and will generate a token
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("request from frontend>>>>>>>>>>>>>>>>>>>", email, password);
    // Check if email and password are provided
    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password" });
    }

    // Find user by email
    const user = await User.findOne({ email });

    // If user not found
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, "your_secret_key", { expiresIn: "24h" });

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.authorize = async (req, res, next) => {
  try {
    // Get token from request header
    const token = req.header("Authorization");
    console.log("headers>>>>>>>>>>>>>>>>>>>>>>>>>", header);
    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    // Verify token
    const decoded = jwt.verify(token, "your_secret_key");

    // Add user ID from token to request object
    req.userId = decoded.userId;

    // Check if user is authorized to create the task
    const task = await TaskSchema.findById(req.body.taskId); // Assuming taskId is included in the request body

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (task.userId !== req.userId) {
      return res.status(403).json({ message: "Forbidden: You do not have permission to create this task" });
    }

    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await TaskSchema.find();
    return res.status(200).json({ status: "success", tasks });
  } catch (error) {
    return res.status(500).json({ status: "fail", message: error.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const id = req.query.id;
    const deletedTask = await TaskSchema.findByIdAndDelete({ _id: id });
    if (!deletedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    return res.status(200).json({ status: "success", message: "Task deleted successfully" });
  } catch (error) {
    return res.status(500).json({ status: "fail", message: error.message });
  }
};

exports.updateTask = async (req, res) => {
  console.log("sanjfajsfhjdfhdj", req.query);

  try {
    const { id } = req.query;
    console.log("snajnajnjnajnajnjnajnjnjjnjnjnjnjnj", id);
    const { task } = req.body;

    if (!task) {
      return res.status(400).json({ message: "Technology and task fields are required for update" });
    }

    const updatedTask = await TaskSchema.findByIdAndUpdate({ _id: id }, { task }, { new: true });

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    return res.status(200).json({ status: "success", message: "Task updated successfully", updatedTask });
  } catch (error) {
    return res.status(500).json({ status: "fail", message: error.message });
  }
};
