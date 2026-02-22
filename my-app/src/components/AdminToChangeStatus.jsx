import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import UserContext from "../context/UserContext";
import BaseUrl from "./BaseUrl";

export default function AdminToChangeStatus() {
  const { token } = useContext(UserContext);
  const [data, setData] = useState([]);
  const [msg, setMsg] = useState("");

  // 🔹 Fetch job applications once token is ready
  useEffect(() => {
    if (!token) return;

    axios
      .get(`${BaseUrl}/jobApplication/admin`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setData(res.data))
      .catch((err) => {
        console.error(err);
        setMsg("Failed to load job applications ❌");
      });
  }, [token]);

  // 🔹 Function to update status
  const updateStatus = (id, status) => {
    axios
      .put(
        `${BaseUrl}/jobApplication/${id}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => {
        setData((prevData) =>
          prevData.map((app) =>
            app.id === id ? { ...app, status: res.data.status } : app
          )
        );
        setMsg(`Status updated to "${status}" ✅`);
      })
      .catch((err) => {
        console.error(err);
        setMsg("❌ Failed to update status");
      });
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Job Applications</h2>
      {msg && <p style={{ color: "blue" }}>{msg}</p>}

      <table border="1" cellPadding="8" cellSpacing="0" style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead style={{ background: "#f4f4f4" }}>
          <tr>
            <th>#</th>
            <th>Job Name</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Status</th>
            <th>CV</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan="6" style={{ textAlign: "center", padding: "10px" }}>
                No job applications found.
              </td>
            </tr>
          ) : (
            data.map((j, i) => (
              <tr key={j.id || i}>
                <td>{i + 1}</td>
                <td>{j.job_title || "—"}</td>
                <td>{j.profile?.first_name || "No profile"}</td>
                <td>{j.profile?.last_name || "No profile"}</td>

                <td style={{ textTransform: "capitalize" }}>{j.status}</td>
                <td><a href={`${BaseUrl}/uploads/cv/${j.profile?.cv}`} target="_blank" rel="noopener noreferrer">View CV</a></td>

                <td>
                  {j.status === "pending" ? (
                    <>
                      <button
                        onClick={() => updateStatus(j.id, "accepted")}
                        style={{
                          marginRight: "5px",
                          background: "green",
                          color: "white",
                          border: "none",
                          padding: "4px 8px",
                          cursor: "pointer",
                        }}
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => updateStatus(j.id, "rejected")}
                        style={{
                          background: "red",
                          color: "white",
                          border: "none",
                          padding: "4px 8px",
                          cursor: "pointer",
                        }}
                      >
                        Reject
                      </button>
                    </>
                  ) : j.status === "accepted" ? (
                    <span style={{ color: "green" }}>✅ Accepted</span>
                  ) : (
                    <span style={{ color: "red" }}>❌ Rejected</span>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
