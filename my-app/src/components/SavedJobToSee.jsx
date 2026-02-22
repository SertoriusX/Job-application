import React, { useContext, useEffect, useState } from 'react';
import UserContext from '../context/UserContext';
import axios from 'axios';
import BaseUrl from './BaseUrl';
import { useNavigate } from 'react-router-dom';

export default function SavedJobToSee() {
  const { token } = useContext(UserContext);
  const [data, setData] = useState([]); 
  const navigate = useNavigate();

  // Fetch saved jobs
  useEffect(() => {
    axios
      .get(`${BaseUrl}/liked/myList`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setData(res.data))
      .catch((err) => console.error(err));
  }, [token]);

  // Remove a job from liked
  const handleDelete = async (e, jobId) => {
    e.stopPropagation(); // prevent card navigation
    try {
      await axios.delete(`${BaseUrl}/liked/${jobId}`, { headers: { Authorization: `Bearer ${token}` } });
      // Remove from local state
      setData(data.filter((job) => job.id !== jobId));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container py-5">
      <h1 className="text-center mb-5">Saved Jobs</h1>

      {data.length === 0 ? (
        <p className="text-center">You have no saved jobs.</p>
      ) : (
        <div className="row g-4">
          {data.map((job) => (
            <div key={job.id} className="col-12 col-md-6 col-lg-4" onClick={() => navigate(`/job/${job.id}`)}>
              <div className="card h-100 shadow-sm border-0">
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title text-primary">{job.title}</h5>
                  <p className="card-text text-truncate" style={{ maxHeight: '4.5em', overflow: 'hidden' }}>
                    {job.description || "No description provided."}
                  </p>
                  <ul className="list-unstyled text-muted mb-3">
                    <li><strong>Company:</strong> {job.company}</li>
                    <li><strong>City:</strong> {job.city}</li>
                    <li><strong>Category:</strong> {job.category}</li>
                    <li><strong>Time of Work:</strong> {job.time_of_work}</li>
                  </ul>
                  <div className="mt-auto d-flex justify-content-between align-items-center">
                    <span className="badge bg-primary">
                      {job.min_price && job.max_price
                        ? `$${job.min_price} - $${job.max_price}`
                        : 'Salary not specified'}
                    </span>
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={(e) => handleDelete(e, job.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
