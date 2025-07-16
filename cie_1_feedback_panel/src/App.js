// App.js

import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [firstName, setFirstName] = useState("");
  const [surname, setSurname] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [time, setTime] = useState(new Date());

  const [feedback, setFeedback] = useState({
    Excellent: 0,
    Good: 0,
    Average: 0,
    Poor: 0,
  });

  const [userCount, setUserCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const options = ["Excellent", "Good", "Average", "Poor"];
      const random = options[Math.floor(Math.random() * options.length)];
      setFeedback((prev) => ({
        ...prev,
        [random]: prev[random] + 1,
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleVote = (type) => {
    setFeedback((prev) => ({
      ...prev,
      [type]: prev[type] + 1,
    }));
    setUserCount((prev) => prev + 1);
  };

  const resetCounter = () => setUserCount(0);
  const incrementBy5 = () => setUserCount((prev) => prev + 5);
  const increment = () => setUserCount((prev) => prev + 1);
  const decrement = () => setUserCount((prev) => (prev > 0 ? prev - 1 : 0));

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="container">
      {!submitted ? (
        <form onSubmit={handleFormSubmit} className="form">
          <h2>Enter Your Name</h2>
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Surname"
            value={surname}
            onChange={(e) => setSurname(e.target.value)}
            required
          />
          <button className='btn' type="submit">Submit</button>
        </form>
      ) : (
        <>
          <h1 className="greeting">Live Event Feedback Panel</h1>
          <h2 className="greeting">Welcome, {firstName} {surname}!</h2>
          <h2 className="clock">{time.toLocaleString()}</h2>

          <div className="panel">
            <h3>Give Your Feedback</h3>
            <div className="buttons">
              {["Excellent", "Good", "Average", "Poor"].map((type) => (
                <button key={type} onClick={() => handleVote(type)}>
                  {type}
                </button>
              ))}
            </div>
            <div className="results">
              {Object.entries(feedback).map(([type, count]) => (
                <p key={type}>
                  {type}: <strong>{count}</strong>
                </p>
              ))}
            </div>
          </div>

          <div className="counter">
            <h3>Feedback Submission Counter: {userCount}</h3>
            <button onClick={increment}>Increment</button>
            <button onClick={decrement}>Decrement</button>
            <button onClick={resetCounter}>Reset</button>
            <button onClick={incrementBy5}>Increment by 5</button>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
