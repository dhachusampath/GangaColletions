import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AuthPage.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useStore } from "../Context/Store";

const AuthPage = ({ setShowLogin }) => {
  const { setAuthToken, setUserId, API_BASE_URL } = useStore();
  const [authMode, setAuthMode] = useState("login");
  const [emailForReset, setEmailForReset] = useState("");

  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [forgotData, setForgotData] = useState({ email: "" });
  const [otpData, setOtpData] = useState({ otp: "" });
  const [resetData, setResetData] = useState({
    newPassword: "",
    confirmPassword: "",
    resetToken: "",
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE_URL}/auth/login`, loginData);
      const { token, userId } = res.data;
      setAuthToken(token);
      setUserId(userId);
      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId);
      toast.success("Login successful!", {
        autoClose: 1500,
        onClose: () => setShowLogin(false),
      });
    } catch (err) {
      toast.error(err.response?.data?.error || "Login failed", {
        autoClose: 4000,
      });
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/auth/register`, registerData);
      toast.success("Registration successful!");
      setAuthMode("login");
    } catch (err) {
      toast.error(err.response?.data?.error || "Registration failed");
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/auth/request-reset`, {
        email: forgotData.email,
      });
      toast.success("OTP sent to your email if account exists");
      setEmailForReset(forgotData.email);
      setAuthMode("verify-otp");
    } catch (err) {
      toast.error(err.response?.data?.message || "Error sending OTP");
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE_URL}/auth/verify-otp`, {
        email: emailForReset,
        otp: otpData.otp,
      });
      toast.success("OTP verified successfully", { autoClose: 2000 });
      setResetData({ ...resetData, resetToken: res.data.resetToken });
      setAuthMode("reset");
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid OTP", {
        autoClose: 4000,
      });
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (resetData.newPassword !== resetData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      await axios.post(`${API_BASE_URL}/auth/reset-password`, {
        resetToken: resetData.resetToken,
        newPassword: resetData.newPassword,
        confirmPassword: resetData.confirmPassword,
      });
      toast.success("Password reset successfully!", { autoClose: 1500 });
      setAuthMode("login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Error resetting password");
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
      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId);
      window.location.href = "/";
    }
  }, []);

  return (
    <div className="auth-overlay">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div className="auth-container">
        <button className="close-button" onClick={() => setShowLogin(false)}>
          X
        </button>
        <h2 className="auth-header">
          {authMode === "login" && "Login"}
          {authMode === "register" && "Register"}
          {authMode === "forgot" && "Reset Password"}
          {authMode === "verify-otp" && "Verify OTP"}
          {authMode === "reset" && "Set New Password"}
        </h2>

        {/* === All Forms === */}
        {authMode === "login" && (
          <>
            <form className="auth-form" onSubmit={handleLogin}>
              <input
                type="email"
                placeholder="Email"
                className="auth-input"
                value={loginData.email}
                onChange={(e) =>
                  setLoginData({ ...loginData, email: e.target.value })
                }
                required
              />
              <input
                type="password"
                placeholder="Password"
                className="auth-input"
                value={loginData.password}
                onChange={(e) =>
                  setLoginData({ ...loginData, password: e.target.value })
                }
                required
              />
              <button type="submit" className="auth-button">
                Login
              </button>
            </form>
            <button className="google-button" onClick={handleGoogleLogin}>
              <img
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                alt="Google"
                className="google-logo"
              />
              Login with Google
            </button>
            <p className="auth-toggle-text">
              Don't have an account?{" "}
              <span
                className="auth-link"
                onClick={() => setAuthMode("register")}
              >
                Register here
              </span>
            </p>
            <p className="for" onClick={() => setAuthMode("forgot")}>
              Forgot Password?
            </p>
          </>
        )}

        {authMode === "register" && (
          <form className="auth-form" onSubmit={handleRegister}>
            <input
              type="text"
              placeholder="Name"
              className="auth-input"
              value={registerData.name}
              onChange={(e) =>
                setRegisterData({ ...registerData, name: e.target.value })
              }
              required
            />
            <input
              type="email"
              placeholder="Email"
              className="auth-input"
              value={registerData.email}
              onChange={(e) =>
                setRegisterData({ ...registerData, email: e.target.value })
              }
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="auth-input"
              value={registerData.password}
              onChange={(e) =>
                setRegisterData({ ...registerData, password: e.target.value })
              }
              required
            />
            <button type="submit" className="auth-button">
              Register
            </button>
            <p className="auth-toggle-text">
              Already have an account?{" "}
              <span className="auth-link" onClick={() => setAuthMode("login")}>
                Login here
              </span>
            </p>
          </form>
        )}

        {authMode === "forgot" && (
          <form className="auth-form" onSubmit={handleForgotPassword}>
            <input
              type="email"
              placeholder="Email"
              className="auth-input"
              value={forgotData.email}
              onChange={(e) => setForgotData({ email: e.target.value })}
              required
            />
            <button type="submit" className="auth-button">
              Send OTP
            </button>
            <p className="auth-toggle-text">
              Go back to{" "}
              <span className="auth-link" onClick={() => setAuthMode("login")}>
                Login
              </span>
            </p>
          </form>
        )}

        {authMode === "verify-otp" && (
          <form className="auth-form" onSubmit={handleVerifyOtp}>
            <p className="auth-toggle-text">
              Enter the OTP sent to {emailForReset}
            </p>
            <input
              type="text"
              placeholder="OTP"
              className="auth-input"
              value={otpData.otp}
              onChange={(e) => setOtpData({ otp: e.target.value })}
              required
            />
            <button type="submit" className="auth-button">
              Verify OTP
            </button>
            <p className="auth-toggle-text">
              Didn't receive OTP?{" "}
              <span className="auth-link" onClick={() => setAuthMode("forgot")}>
                Resend
              </span>
            </p>
          </form>
        )}

        {authMode === "reset" && (
          <form className="auth-form" onSubmit={handleResetPassword}>
            <input
              type="password"
              placeholder="New Password"
              className="auth-input"
              value={resetData.newPassword}
              onChange={(e) =>
                setResetData({ ...resetData, newPassword: e.target.value })
              }
              required
            />
            <input
              type="password"
              placeholder="Confirm Password"
              className="auth-input"
              value={resetData.confirmPassword}
              onChange={(e) =>
                setResetData({ ...resetData, confirmPassword: e.target.value })
              }
              required
            />
            <button type="submit" className="auth-button">
              Reset Password
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AuthPage;
