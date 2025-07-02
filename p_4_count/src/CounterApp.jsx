// src/CounterApp.jsx
import React, { useState } from 'react';
import './CounterApp.css';

const CounterApp = () => {
  const [count, setCount] = useState(0);
  const [firstName, setFirstName] = useState('');
  const [surname, setSurname] = useState('');

  const increment = () => setCount(prev => prev + 1);
  const decrement = () => setCount(prev => prev - 1);
  const reset = () => setCount(0);
  const incrementFive = () => setCount(prev => prev + 5);

  return (
    <div className="container">
      <h1 className="heading">Counter App</h1>

      <div className="section">
        <h2>Count: {count}</h2>
        <div className="button-group">
          <button onClick={increment}>Increment</button>
          <button onClick={decrement}>Decrement</button>
          <button onClick={reset}>Reset</button>
          <button onClick={incrementFive}>Increment 5</button>
        </div>
      </div>

      <div className="section">
        <input
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Last Name"
          value={surname}
          onChange={(e) => setSurname(e.target.value)}
        />
      </div>

      <h3>{firstName} {surname}</h3>
    </div>
  );
};

export default CounterApp;
