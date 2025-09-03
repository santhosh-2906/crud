import React, { useEffect, useState } from "react";

const API_URL = "https://backend-1-0b18.onrender.com";

const App = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");

  
  useEffect(() => {
    fetch(`${API_URL}/todos`)
      .then((res) => res.json())
      .then((data) => setTodos(data))
      .catch((err) => console.log("Error fetching todos:", err));
  }, []);

  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    fetch(`${API_URL}/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTodo, completed: false }),
    })
      .then((res) => res.json())
      .then((data) => {
        setTodos([...todos, data]);
        setNewTodo("");
      })
      .catch((err) => console.log("Error adding todo:", err));
  };

 
  const handleDelete = (id) => {
    fetch(`${API_URL}/delete/${id}`, { method: "DELETE" })
      .then((res) => res.json())
      .then(() => {
        setTodos(todos.filter((todo) => todo.id !== id));
      })
      .catch((err) => console.log("Error deleting todo:", err));
  };

  
  const handleToggle = (id, currentStatus) => {
    fetch(`${API_URL}/update/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !currentStatus }),
    })
      .then((res) => res.json())
      .then((updatedTodo) => {
        setTodos(todos.map((t) => (t.id === id ? updatedTodo : t)));
      })
      .catch((err) => console.log("Error toggling todo:", err));
  };

  
  const startEditing = (id, title) => {
    setEditingId(id);
    setEditingText(title);
  };

  const saveEdit = (id) => {
    fetch(`${API_URL}/update/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: editingText }),
    })
      .then((res) => res.json())
      .then((updatedTodo) => {
        setTodos(todos.map((t) => (t.id === id ? updatedTodo : t)));
        setEditingId(null);
        setEditingText("");
      })
      .catch((err) => console.log("Error editing todo:", err));
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingText("");
  };

  
  const handleEditClick = (id, title) => startEditing(id, title);
  const handleDeleteClick = (id) => handleDelete(id);
  const handleSaveClick = (id) => saveEdit(id);
  const handleCancelClick = () => cancelEdit();
  const handleToggleClick = (id, completed) => handleToggle(id, completed);

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Todo List</h1>

      
      <form onSubmit={handleSubmit} className="d-flex mb-3">
        <input
          type="text"
          className="form-control me-2"
          placeholder="Enter new todo"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
        />
        <button type="submit" className="btn btn-primary">
          Add Task
        </button>
      </form>

      
      <ul className="list-group">
        {todos.map((todo) => (
          <li
            key={todo.id}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            {editingId === todo.id ? (
              <div className="d-flex w-100">
                <input
                  type="text"
                  className="form-control me-2"
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                />
                <button
                  className="btn btn-success me-2"
                  onClick={() => handleSaveClick(todo.id)}
                >
                  Save
                </button>
                <button className="btn btn-secondary" onClick={handleCancelClick}>
                  Cancel
                </button>
              </div>
            ) : (
              <>
                <span
                  style={{
                    textDecoration: todo.completed ? "line-through" : "none",
                    cursor: "pointer",
                  }}
                  onClick={() => handleToggleClick(todo.id, todo.completed)}
                >
                  {todo.title}
                </span>
                <div>
                  <button
                    className="btn btn-sm btn-warning me-2"
                    onClick={() => handleEditClick(todo.id, todo.title)}
                  >
                    ✏️
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDeleteClick(todo.id)}
                  >
                    ❌
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
