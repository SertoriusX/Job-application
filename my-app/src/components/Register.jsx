import React, { useState } from "react";
import axios from "axios";
import BaseUrl from "./BaseUrl";

export default function Register() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [msg, setMsg] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const onSend = async (e) => {
    e.preventDefault();

    if (form.confirmPassword !== form.password) {
      setMsg("Your passwords do not match ❌");
      setSuccess(false);
      return;
    }

    try {
      const res = await axios.post(`${BaseUrl}/register`, {
        username: form.username,
        email: form.email,
        password: form.password,
      });

      setForm({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

      setMsg(res.data.msg || "Registration successful ✅");
      setSuccess(true);
    } catch (err) {
      if (err.response?.data?.msg) {
        setMsg(err.response.data.msg);
      } else {
        setMsg("Server error ❌");
      }
      setSuccess(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 ">
      <div className="card shadow p-4" style={{ maxWidth: "450px", width: "100%" }}>
        <h2 className="card-title text-center mb-4">Register</h2>

        {/* Dynamic Alert */}
        {msg && (
          <div
            className={`alert ${success ? "alert-success" : "alert-danger"} text-center`}
            role="alert"
          >
            {msg}
          </div>
        )}

        <form onSubmit={onSend}>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">
              Username
            </label>
            <input
              type="text"
              name="username"
              id="username"
              value={form.username}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter username"
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={form.email}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter email"
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              value={form.password}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter password"
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="confirmPassword" className="form-label">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              className="form-control"
              placeholder="Confirm password"
              required
            />
          </div>

          <button type="submit" className="btn btn-success w-100">
            Register
          </button>
        </form>

        <div className="text-center mt-3">
          <small className="text-muted">© {new Date().getFullYear()} Your Company</small>
        </div>
      </div>
    </div>
  );
}
