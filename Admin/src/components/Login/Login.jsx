import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "./Login.css"

const Login = ({ setUser }) => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const users = [
    {
      userId: import.meta.env.VITE_ADMIN_USER,
      password: import.meta.env.VITE_ADMIN_PASSWORD,
      role: import.meta.env.VITE_ADMIN_ROLE,
    },
    {
      userId: import.meta.env.VITE_STAFF_USER,
      password: import.meta.env.VITE_STAFF_PASSWORD,
      role: import.meta.env.VITE_STAFF_ROLE,
    }
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
