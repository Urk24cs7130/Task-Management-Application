import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {

  const [isLogin, setIsLogin] = useState(true);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [token, setToken] = useState("");

  const [tasks, setTasks] = useState([]);

  const [title, setTitle] = useState("");

  // REGISTER
  const register = async () => {

    await axios.post("http://localhost:5000/register", {
      username,
      password
    });

    alert("Registration Successful");
  };

  // LOGIN
  const login = async () => {

    const res = await axios.post("http://localhost:5000/login", {
      username,
      password
    });

    setToken(res.data.token);

    fetchTasks(res.data.token);
  };

  // FETCH TASKS
  const fetchTasks = async (userToken) => {

    const res = await axios.get(
      "http://localhost:5000/tasks",
      {
        headers:{
          authorization:userToken
        }
      }
    );

    setTasks(res.data);
  };

  // ADD TASK
  const addTask = async () => {

    if(title === "") return;

    await axios.post(
      "http://localhost:5000/tasks",
      { title },
      {
        headers:{
          authorization:token
        }
      }
    );

    setTitle("");

    fetchTasks(token);
  };

  // DELETE TASK
  const deleteTask = async (id) => {

    await axios.delete(
      `http://localhost:5000/tasks/${id}`,
      {
        headers:{
          authorization:token
        }
      }
    );

    fetchTasks(token);
  };

  // UPDATE TASK
  const updateTask = async (id) => {

    await axios.put(
      `http://localhost:5000/tasks/${id}`,
      {},
      {
        headers:{
          authorization:token
        }
      }
    );

    fetchTasks(token);
  };

  // LOGIN PAGE
  if(!token){

    return (

      <div className="auth-container">

        <div className="auth-box">

          <h1>Task Manager</h1>

          <p className="subtitle">
            Manage your daily work easily
          </p>

          <input
            type="text"
            placeholder="Username"
            onChange={(e)=>setUsername(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            onChange={(e)=>setPassword(e.target.value)}
          />

          {
            isLogin
            ?
            <button onClick={login}>
              Login
            </button>
            :
            <button onClick={register}>
              Register
            </button>
          }

          <p
            className="switch"
            onClick={()=>setIsLogin(!isLogin)}
          >
            {
              isLogin
              ? "Create New Account"
              : "Already Have Account?"
            }
          </p>

        </div>

      </div>
    );
  }

  // TASK PAGE
  return (

    <div className="dashboard">

      <div className="navbar">

        <h2>Task Manager</h2>

      </div>

      <div className="task-container">

        <div className="task-input">

          <input
            type="text"
            placeholder="Enter new task..."
            value={title}
            onChange={(e)=>setTitle(e.target.value)}
          />

          <button onClick={addTask}>
            Add Task
          </button>

        </div>

        <div className="task-list">

          {
            tasks.map(task => (

              <div className="task-card" key={task.id}>

                <div>

                  <h3 className={task.completed ? "completed" : ""}>
                    {task.title}
                  </h3>

                  <p>
                    Status :
                    {
                      task.completed
                      ? " Completed"
                      : " Pending"
                    }
                  </p>

                </div>

                <div className="buttons">

                  <button
                    className="complete-btn"
                    onClick={()=>updateTask(task.id)}
                  >
                    Done
                  </button>

                  <button
                    className="delete-btn"
                    onClick={()=>deleteTask(task.id)}
                  >
                    Delete
                  </button>

                </div>

              </div>

            ))
          }

        </div>

      </div>

    </div>
  );
}

export default App;
