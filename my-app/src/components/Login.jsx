import React, { useState, useContext } from "react";
import axios from "axios";
import BaseUrl from "./BaseUrl";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import UserContext from "../context/UserContext";

export default function Login() {
  const { saveToken } = useContext(UserContext);
  const [form, setForm] = useState({ username: "", password: "" });
  const [msg, setMsg] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const onSend = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${BaseUrl}/login`, form);
      saveToken(res.data.access_token, res.data.role);
      setMsg(res.data.msg || "Successfully logged in ✅");
      setSuccess(true);
      navigate(res.data.role === "admin" ? "/createJob" : "/home");
      setForm({ username: "", password: "" });
    } catch (err) {
      setMsg(err.response?.data?.msg || "Invalid username or password ❌");
      setSuccess(false);
    }
  };

  const handleGoogleLogin = async (credentialResponse) => {
    if (!credentialResponse?.credential) {
      setMsg("Google login failed ❌");
      setSuccess(false);
      return;
    }

    try {
      const res = await axios.post(`${BaseUrl}/auth/google`, {
        token: credentialResponse.credential,
      });
      saveToken(res.data.access_token, res.data.role);
      setMsg(res.data.msg || "Google login successful ✅");
      setSuccess(true);
      navigate(res.data.role === "admin" ? "/createJob" : "/home");
    } catch (err) {
      console.error("Google login error:", err.response?.data || err);
      setMsg(err.response?.data?.msg || "Google login failed ❌");
      setSuccess(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100">
      <div className="card shadow p-4" style={{ maxWidth: "400px", width: "100%" }}>
        <h2 className="text-center mb-4">Login</h2>

        {msg && (
          <div className={`alert ${success ? "alert-success" : "alert-danger"} text-center`}>
            {msg}
          </div>
        )}

        <form onSubmit={onSend}>
          <input
            name="username"
            value={form.username}
            onChange={handleChange}
            placeholder="Username"
            className="form-control mb-2"
            required
          />
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            className="form-control mb-3"
            required
          />
          <button type="submit" className="btn btn-primary w-100 mb-3">
            Login
          </button>
        </form>

        <GoogleLogin
          onSuccess={handleGoogleLogin}
          onError={() => {
            setMsg("Google login failed ❌");
            setSuccess(false);
          }}
          useOneTap
        />
      </div>
    </div>
  );
}
