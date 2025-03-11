import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "./Login.css"

const Login = ({ setUser }) => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const users = [
    { userId: 'admin', password: 'admin123', role: 'Admin' },
    { userId: 'staff', password: 'staff123', role: 'Staff' },
  ];

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUser(user); // Set user if already logged in
      navigate('/dashboard'); // Redirect to dashboard if already logged in
    }
  }, [setUser, navigate]);

  const handleLogin = () => {
    const user = users.find(u => u.userId === userId && u.password === password);
    if (user) {
      setUser(user);
      localStorage.setItem('user', JSON.stringify(user)); // Save user info to localStorage
      navigate('/dashboard'); // Redirect to dashboard
    } else {
      alert('Invalid credentials');
    }
  };

  return (
    <div className="login-form">
      <input
        type="text"
        placeholder="User ID"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default Login;
