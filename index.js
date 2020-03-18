//declare a variable express require the module express
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const server = express();

const PORT = 1000;
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true
};

//Define the task schema
let taskSchema = mongoose.Schema({
  taskname: String,
  taskdescription: String,
  taskduedate: Date,
  taskauthor: String,
  isComplete: Boolean
});

//Defining the task model
let Task = mongoose.model("Task", taskSchema);

server.set("view engine", "pug");
server.set("views", __dirname + "/views");

server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: false }));

server.get("/", (req, res) => {
  res.render("addlist");
});

server.post("/addlist", async (req, res) => {
  try {
    let task = new Task(req.body);
    await task.save();
    res.redirect("/tasklist");
  } catch (error) {
    console.log("Could not create a new task");
  }
});

server.get("/tasklist", async (req, res) => {
  try {
    let items = await Task.find();
    res.render("tasklist", { tasks: items });
  } catch (error) {
    console.log("Could not fetch tasks from the database");
  }
});

server.get("/deletetask", async (req, res) => {
  try {
    if (req.query.taskname) {
      await Task.deleteOne({ taskname: req.query.taskname });
      res.redirect("/tasklist");
    }
    res.redirect("/tasklist");
  } catch (error) {
    console.log("Failed to delete task");
  }
});

server.get("/updatetask", (req, res) => {
  if (req.query.taskname) {
    res.render("updateform", { taskname: req.query.taskname });
  }
  res.redirect("/tasklist");
});

server.post("/updatetask", async (req, res) => {
  try {
    let { taskname } = req.body;
    let updates = await Task.updateOne({ taskname }, req.body);
    console.log(updates);
    res.redirect("/tasklist");
  } catch (error) {
    console.log("Could not update the task");
    res.redirect("/tasklist");
  }
});

mongoose.connect("mongodb://localhost:27017/todo_db", options, error => {
  if (error) throw error;
  console.log("Connected to the database");
});

server.listen(PORT, error => {
  if (error) throw error;
  console.log("listening on PORT " + PORT);
});
