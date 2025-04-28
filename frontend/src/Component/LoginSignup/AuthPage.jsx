import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AuthPage.css"
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useStore } from "../Context/Store";



const AuthPage = ({ setShowLogin }) => {
  const { setAuthToken, setUserId ,API_BASE_URL } = useStore();
  const [isRegistering, setIsRegistering] = useState(false); // Toggle between login and register
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const toggleAuthMode = () => {
    setIsRegistering(!isRegistering);
    setFormData({ name: "", email: "", password: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isRegistering) {
        // Registration
        await axios.post(`${API_BASE_URL}/auth/register`, {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        });
        toast.success("Registration successful!");
        toggleAuthMode();
      } else {
        // Login
        const res = await axios.post(`${API_BASE_URL}/auth/login`, {
          email: formData.email,
          password: formData.password,
        });

        const { token, userId } = res.data;

        // Set the token and userId in the store
        setAuthToken(token);
        setUserId(userId);

        // Persist token to localStorage for session management
        localStorage.setItem("token", token);
        localStorage.setItem("userId", userId);

        toast.success("Login successful!"); // Show success message

        // Close the auth page on successful login after a delay
        setTimeout(() => {
          setShowLogin(false);
        }, 1500);
      }
    } catch (err) {
      toast.error(err.response?.data?.error || "Something went wrong.");
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${API_BASE_URL}/auth/google`;
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    const userId = urlParams.get("userId");
  
    if (token && userId) {
      // Store token and userId in local storage
      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId);
      window.location.href = "/"; // Example redirection

    }
  }, []);

  return (
<div className="auth-overlay">
  <ToastContainer />
  <div className="auth-container">
    <button className="close-button" onClick={() => setShowLogin(false)}>
      X
    </button>
    <h2 className="auth-header">{isRegistering ? "Register" : "Login"}</h2>
    <form className="auth-form" onSubmit={handleSubmit}>
      {isRegistering && (
        <input
          type="text"
          placeholder="Name"
          className="auth-input"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      )}
      <input
        type="email"
        placeholder="Email"
        className="auth-input"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        required
      />
      <input
        type="password"
        placeholder="Password"
        className="auth-input"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        required
      />
      <button type="submit" className="auth-button">
        {isRegistering ? "Register" : "Login"}
      </button>
    </form>
    <button className="google-button google-login-btn" onClick={handleGoogleLogin}>
    <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHg9IjBweCIgeT0iMHB4IiB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCI+CjxwYXRoIGZpbGw9IiNGRkMxMDciIGQ9Ik00My42MTEsMjAuMDgzSDQyVjIwSDI0djhoMTEuMzAzYy0xLjY0OSw0LjY1Ny02LjA4LDgtMTEuMzAzLDhjLTYuNjI3LDAtMTItNS4zNzMtMTItMTJjMC02LjYyNyw1LjM3My0xMiwxMi0xMmMzLjA1OSwwLDUuODQyLDEuMTU0LDcuOTYxLDMuMDM5bDUuNjU3LTUuNjU3QzM0LjA0Niw2LjA1MywyOS4yNjgsNCwyNCw0QzEyLjk1NSw0LDQsMTIuOTU1LDQsMjRjMCwxMS4wNDUsOC45NTUsMjAsMjAsMjBjMTEuMDQ1LDAsMjAtOC45NTUsMjAtMjBDNDQsMjIuNjU5LDQzLjg2MiwyMS4zNSw0My42MTEsMjAuMDgzeiI+PC9wYXRoPjxwYXRoIGZpbGw9IiNGRjNEMDAiIGQ9Ik02LjMwNiwxNC42OTFsNi41NzEsNC44MTlDMTQuNjU1LDE1LjEwOCwxOC45NjEsMTIsMjQsMTJjMy4wNTksMCw1Ljg0MiwxLjE1NCw3Ljk2MSwzLjAzOWw1LjY1Ny01LjY1N0MzNC4wNDYsNi4wNTMsMjkuMjY4LDQsMjQsNEMxNi4zMTgsNCw5LjY1Niw4LjMzNyw2LjMwNiwxNC42OTF6Ij48L3BhdGg+PHBhdGggZmlsbD0iIzRDQUY1MCIgZD0iTTI0LDQ0YzUuMTY2LDAsOS44Ni0xLjk3NywxMy40MDktNS4xOTJsLTYuMTktNS4yMzhDMjkuMjExLDM1LjA5MSwyNi43MTUsMzYsMjQsMzZjLTUuMjAyLDAtOS42MTktMy4zMTctMTEuMjgzLTcuOTQ2bC02LjUyMiw1LjAyNUM5LjUwNSwzOS41NTYsMTYuMjI3LDQ0LDI0LDQ0eiI+PC9wYXRoPjxwYXRoIGZpbGw9IiMxOTc2RDIiIGQ9Ik00My42MTEsMjAuMDgzSDQyVjIwSDI0djhoMTEuMzAzYy0wLjc5MiwyLjIzNy0yLjIzMSw0LjE2Ni00LjA4Nyw1LjU3MWMwLjAwMS0wLjAwMSwwLjAwMi0wLjAwMSwwLjAwMy0wLjAwMmw2LjE5LDUuMjM4QzM2Ljk3MSwzOS4yMDUsNDQsMzQsNDQsMjRDNDQsMjIuNjU5LDQzLjg2MiwyMS4zNSw0My42MTEsMjAuMDgzeiI+PC9wYXRoPgo8L3N2Zz4=" alt="Google logo" className="google-logo" />
    Login Google
    </button>
    <p className="auth-toggle-text">
      {isRegistering ? "Already have an account?" : "Don't have an account?"}{" "}
      <span className="auth-link" onClick={toggleAuthMode}>
        {isRegistering ? "Login here" : "Register here"}
      </span>
    </p>
  </div>
</div>

  );
};

export default AuthPage;
