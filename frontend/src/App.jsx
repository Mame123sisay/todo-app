import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";

function App() {
  const [task, setTask] = useState("");
  const [todos, setTodos] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTodo, setCurrentTodo] = useState(null);
  const [editTask, setEditTask] = useState("");
  const API = import.meta.env.VITE_API_URL;
  // Add new todo
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API}/api/todo/`, { task });
      setTodos((prevTodos) => [...prevTodos, res.data]);
      setTask(""); // clear input
    } catch (error) {
      console.error("error saving task:", error);
    }
  };

  // Delete todo
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/api/todo/${id}`);
      setTodos((prevTodos) => prevTodos.filter((todo) => todo._id !== id));
    } catch (error) {
      console.error("error deleting todos:", error);
    }
  };

  // Toggle status
  const handleToggleStatus = async (todo) => {
    try {
      const newStatus = todo.status === "pending" ? "completed" : "pending";
      const res = await axios.put(`${API}/api/todo/${todo._id}`, {
        status: newStatus,
        task: todo.task,
      });
      setTodos((prev) =>
        prev.map((t) =>
          t._id === todo._id ? { ...t, status: res.data.status } : t
        )
      );
    } catch (error) {
      console.error("error updating status:", error);
    }
  };

  // Fetch todos
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${API}/api/todo`);
        setTodos(res.data);
      } catch (error) {
        console.error("error fetching todos:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          📝 To-Do App
        </h1>

        {/* Task Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="task"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Enter your task
            </label>
            <input
              id="task"
              type="text"
              value={task}
              onChange={(e) => setTask(e.target.value)}
              placeholder="Task name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                         focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                         outline-none transition"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg 
                       hover:bg-blue-700 transition duration-200 shadow-md cursor-pointer"
          >
            Add Task
          </button>
        </form>

        {/* Task Table */}
        <div className="mt-6 overflow-x-auto">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Tasks</h2>

          <table className="min-w-full border border-gray-300 rounded-lg shadow-sm">
            <thead>
              <tr className="bg-blue-50">
                <th className="border px-4 py-2 text-left">Task</th>
                <th className="border px-4 py-2 text-left">Status</th>
                <th className="border px-4 py-2 text-center">Toggle</th>
                <th className="border px-4 py-2 text-left">Created At</th>
                <th className="border px-4 py-2 text-left">Updated At</th>
                <th className="border px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {todos.map((todo) => (
                <tr key={todo._id} className="hover:bg-gray-50 transition">
                  {/* Task */}
                  <td className="border px-4 py-2">
                    {todo.status === "completed" ? (
                      <span className="line-through text-gray-500">
                        {todo.task}
                      </span>
                    ) : (
                      todo.task
                    )}
                  </td>

                  {/* Status */}
                  <td className="border px-4 py-2">
                    {todo.status === "completed" ? "✅ Completed" : "⏳ Pending"}
                  </td>

                  {/* Toggle Button */}
                  <td className="border px-4 py-2 text-center">
                    <button
                      onClick={() => handleToggleStatus(todo)}
                      className="bg-yellow-500 cursor-pointer text-white px-3 py-2 rounded-lg hover:bg-yellow-600"
                    >
                      {todo.status === "pending"
                        ? "Mark Completed"
                        : "Mark Pending"}
                    </button>
                  </td>

                  {/* Created At */}
                  <td className="border px-4 py-2">
                    {new Date(todo.createdAt).toLocaleString()}
                  </td>

                  {/* Updated At */}
                  <td className="border px-4 py-2">
                    {new Date(todo.updatedAt).toLocaleString()}
                  </td>

                  {/* Actions */}
                  <td className="border px-4 py-2 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => {
                          setIsEditing(true);
                          setCurrentTodo(todo);
                          setEditTask(todo.task);
                        }}
                        className="bg-green-600 text-white px-3 py-2  rounded-lg hover:bg-green-700 font-bold  cursor-pointer shadow-md"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(todo._id)}
                        className="bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 font-bold cursor-pointer transition duration-200 shadow-md"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Edit Modal */}
        {isEditing && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-96">
              <h2 className="text-lg font-semibold mb-4">Edit Task</h2>
              <input
                type="text"
                value={editTask}
                onChange={(e) => setEditTask(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-4"
              />
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    try {
                      const res = await axios.put(
                        `${API}/api/todo/${currentTodo._id}`,
                        { task: editTask }
                      );
                      setTodos((prev) =>
                        prev.map((t) =>
                          t._id === currentTodo._id
                            ? { ...t, task: res.data.task }
                            : t
                        )
                      );
                      setIsEditing(false);
                    } catch (error) {
                      console.error("error updating todo:", error);
                    }
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
