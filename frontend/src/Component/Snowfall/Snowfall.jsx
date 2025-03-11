import React, { useEffect } from 'react';
import './Snowfall.css';

const Snowfall = () => {
  useEffect(() => {
    // Optional: Additional JavaScript logic if you want to control snowfall behavior
  }, []);

  return (
    <div className="snowflakes">
      {Array.from({ length: 50 }).map((_, index) => (
        <div key={index} className="snowflake"></div>
      ))}
    </div>
  );
};

export default Snowfall;
