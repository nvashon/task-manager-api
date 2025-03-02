import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

function App() {
  const [tasks, setTasks] = useState([]);
  const [taskText, setTaskText] = useState('');
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(!!token);

  useEffect(() => {
    if (token) {
      fetchTasks();
    }
  }, [token]);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`${API_URL}/tasks`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const addTask = async () => {
    if (!taskText) return;
    try {
      const response = await axios.post(
        `${API_URL}/tasks`,
        { title: taskText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTasks([...tasks, response.data]);
      setTaskText('');
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API_URL}/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(tasks.filter(task => task._id !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const login = async () => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, { email, password });
      const userToken = response.data.token;
      localStorage.setItem('token', userToken);
      setToken(userToken);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken('');
    setIsAuthenticated(false);
    setTasks([]);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        {!isAuthenticated ? (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Login</h2>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded"
            />
            <button onClick={login} className="w-full p-2 bg-blue-500 text-white rounded">
              Login
            </button>
          </div>
        ) : (
          <div>
            <h2 className="text-xl font-bold">Task Manager</h2>
            <button onClick={logout} className="p-2 bg-red-500 text-white rounded mb-4">
              Logout
            </button>
            <div className="flex mb-4">
              <input
                type="text"
                value={taskText}
                onChange={(e) => setTaskText(e.target.value)}
                placeholder="Enter a task"
                className="border p-2 flex-grow rounded-l"
              />
              <button onClick={addTask} className="bg-blue-500 text-white px-4 py-2 rounded-r">Add</button>
            </div>
            <ul>
              {tasks.map((task) => (
                <li key={task._id} className="flex justify-between items-center bg-gray-200 p-2 rounded mb-2">
                  <span>{task.title}</span>
                  <button onClick={() => deleteTask(task._id)} className="bg-red-500 text-white px-3 py-1 rounded">Delete</button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
