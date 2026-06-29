const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();

app.use(cors());
app.use(express.json());

const SECRET_KEY = "taskapp";

let users = [];
let tasks = [];

// REGISTER
app.post("/register", async (req, res) => {

    const { username, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = {
        id: Date.now(),
        username,
        password: hashedPassword
    };

    users.push(user);

    res.json({ message: "User Registered" });
});

// LOGIN
app.post("/login", async (req, res) => {

    const { username, password } = req.body;

    const user = users.find(u => u.username === username);

    if(!user){
        return res.status(400).json({ message: "User Not Found" });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if(!validPassword){
        return res.status(400).json({ message: "Invalid Password" });
    }

    const token = jwt.sign(
        { username: user.username },
        SECRET_KEY
    );

    res.json({ token });
});

// AUTH MIDDLEWARE
function verifyToken(req, res, next){

    const token = req.headers.authorization;

    if(!token){
        return res.status(401).json({ message: "Access Denied" });
    }

    try{
        jwt.verify(token, SECRET_KEY);
        next();
    }
    catch{
        res.status(400).json({ message: "Invalid Token" });
    }
}

// GET TASKS
app.get("/tasks", verifyToken, (req, res) => {
    res.json(tasks);
});

// ADD TASK
app.post("/tasks", verifyToken, (req, res) => {

    const task = {
        id: Date.now(),
        title: req.body.title,
        completed: false
    };

    tasks.push(task);

    res.json(task);
});

// UPDATE TASK
app.put("/tasks/:id", verifyToken, (req, res) => {

    tasks = tasks.map(task => {

        if(task.id == req.params.id){
            return {
                ...task,
                completed: !task.completed
            };
        }

        return task;
    });

    res.json({ message: "Task Updated" });
});

// DELETE TASK
app.delete("/tasks/:id", verifyToken, (req, res) => {

    tasks = tasks.filter(task => task.id != req.params.id);

    res.json({ message: "Task Deleted" });
});

app.listen(5000, () => {
    console.log("Server running on port 5000");
});
