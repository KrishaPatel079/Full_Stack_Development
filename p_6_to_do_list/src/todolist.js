import React, { useState } from 'react';
import './App.css';

function TodoList() {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all'); 

  const handleAddOrSave = () => {
    if (task.trim() === '') return;

    if (editingIndex !== null) {
      setTasks(tasks.map((t, i) => (i === editingIndex ? { ...t, text: task } : t)));
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
    setTasks(tasks.map((t, i) => (i === index ? { ...t, completed: !t.completed } : t)));
  };

  const startEditing = (index) => {
    setEditingIndex(index);
    setTask(tasks[index].text);
  };

  const cancelEditing = () => {
    setEditingIndex(null);
    setTask('');
  };

  const filteredTasks = tasks.filter((t) => {
  const matchesSearch = t.text.toLowerCase().includes(searchQuery.toLowerCase());

  if (searchQuery.trim() !== '') {
    return matchesSearch;
  }

  if (filter === 'completed') return t.completed;
  if (filter === 'incomplete') return !t.completed;
  return true;
});


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

      <div className="filter-section">
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">All</option>
          <option value="completed">Completed</option>
          <option value="incomplete">Incomplete</option>
        </select>
      </div>

      <ul className="task-list">
        {filteredTasks.map((t, index) => (
          <li key={index} className={t.completed ? 'completed' : ''}>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={t.completed}
                onChange={() => toggleComplete(tasks.indexOf(t))}
              />
              <span>{t.text}</span>
            </label>
            <div>
              <button onClick={() => startEditing(tasks.indexOf(t))} title="Edit">✏️</button>
              <button onClick={() => handleDeleteTask(tasks.indexOf(t))} title="Delete">🗑️</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TodoList;
