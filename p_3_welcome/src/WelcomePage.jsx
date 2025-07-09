// WelcomePage.jsx

import React, { useState, useEffect } from 'react';

const WelcomePage = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div style={styles.container}>
      <h1>Welcome to CHARUSAT!</h1>
      <p>Current Date and Time:</p>
      <h2>{currentTime.toLocaleString()}</h2>
    </div>
  );
};

const styles = {
  container: {
    fontFamily: 'Times New Roman, serif',
    textAlign: 'center',
    marginTop: '100px',
    color: 'indigo',
  }
};

export default WelcomePage;
