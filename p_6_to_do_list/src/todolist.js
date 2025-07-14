import React, { useState } from 'react';
import './App.css'; 

function TodoList() {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);

  const handleAddOrSave = () => {
    if (task.trim() === '') return;

    if (editingIndex !== null) {
      setTasks(
        tasks.map((t, i) => (i === editingIndex ? { ...t, text: task } : t))
      );
      setEditingIndex(null);
      setTask('');
      return;
    }

    setTasks([...tasks, { text: task, completed: false }]);
    setTask('');
  };

  const handleDeleteTask = (index) => {
    setTasks(tasks.filter((_, i) => i !== index));

    if (index === editingIndex) {
      setEditingIndex(null);
      setTask('');
    }
  };

  const toggleComplete = (index) => {
    setTasks(
      tasks.map((t, i) =>
        i === index ? { ...t, completed: !t.completed } : t
      )
    );
  };

  const startEditing = (index) => {
    setEditingIndex(index);
    setTask(tasks[index].text);
  };

  const cancelEditing = () => {
    setEditingIndex(null);
    setTask('');
  };

  return (
    <div className="app">
      <h1>📝 To‑Do List</h1>

      <div className="input-section">
        <input
          type="text"
          placeholder="Enter a task..."
          value={task}
          onChange={(e) => setTask(e.target.value)}
        />
        <button onClick={handleAddOrSave}>
          {editingIndex !== null ? 'Save' : 'Add'}
        </button>
        {editingIndex !== null && (
          <button onClick={cancelEditing} style={{ marginLeft: '6px' }}>
            Cancel
          </button>
        )}
      </div>

      <ul className="task-list">
        {tasks.map((t, index) => (
          <li
            key={index}
            className={t.completed ? 'completed' : ''}
          >
            <span onClick={() => toggleComplete(index)}>
              {t.text}
            </span>

            <button onClick={() => startEditing(index)} title="Edit">
              ✏️
            </button>

            <button onClick={() => handleDeleteTask(index)} title="Delete">
              🗑️
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TodoList;
