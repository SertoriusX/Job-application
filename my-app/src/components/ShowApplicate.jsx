import React, { useContext, useEffect, useState } from 'react';
import UserContext from '../context/UserContext';
import axios from 'axios';
import BaseUrl from './BaseUrl';

export default function ShowApplicate() {
  const { token } = useContext(UserContext);
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    axios
      .get(`${BaseUrl}/jobApplication/user`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setApplications(res.data))
      .catch((err) => console.error(err));
  }, [token]);

  return (
    <div className="container my-5">
      <h1 className="mb-4">My Applications</h1>

      {applications.length === 0 ? (
        <p>No applications found.</p>
      ) : (
        <table className="table table-bordered table-hover">
          <thead className="table-light">
            <tr>
              <th>#</th>
              <th>Job Title</th>
              <th>Status</th>
              <th>Applied At</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app, index) => (
              <tr key={app.id || index}>
                <td>{index + 1}</td>
                <td>{app.job_title}</td>
                <td>{app.status}</td>
                <td>{app.applied_at}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
