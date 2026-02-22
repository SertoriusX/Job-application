import React, { useContext, useEffect, useState } from "react";
import UserContext from "../context/UserContext";
import axios from "axios";
import BaseUrl from "./BaseUrl";
import { useNavigate, useParams } from "react-router-dom";

export default function SeeDetailJob() {
  const { token } = useContext(UserContext);
  const navigate = useNavigate();
  const { id } = useParams();
  const [jobData, setJobData] = useState(null);
  const [userApplications, setUserApplications] = useState(null); // null = loading
  const [loadingApply, setLoadingApply] = useState(false);

  // Fetch job details
  useEffect(() => {
    axios
      .get(`${BaseUrl}/job/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setJobData(res.data))
      .catch((err) => console.error(err));
  }, [id, token]);

  useEffect(() => {
    axios
      .get(`${BaseUrl}/jobApplication`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setUserApplications(res.data))
      .catch((err) => {
        console.error(err);
        setUserApplications([]); 
      });
  }, [token]);

  // Apply for the job
  const applyForJob = async () => {
    if (!jobData) return;
    setLoadingApply(true);

    try {
      await axios.post(`${BaseUrl}/jobApplication/${jobData.id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setUserApplications((prev) => [...prev, jobData.id]);
    } catch (err) {
      console.error(err.response?.data || err);
      alert(err.response?.data?.msg || "Failed to apply for job");
    } finally {
      setLoadingApply(false);
    }
  };

  const hasApplied = userApplications?.includes(jobData?.id);

  // Loading state
  if (!jobData || userApplications === null) {
    return (
      <div className="d-flex justify-content-center align-items-center mt-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <button className="btn btn-secondary mb-3" onClick={() => navigate(-1)}>
        &larr; Back
      </button>

      <div className="card shadow-sm">
        <div className="card-body">
          <h2 className="card-title text-primary mb-3">{jobData.title}</h2>
          <p className="card-text">{jobData.description}</p>

          <div className="mb-2">
            <strong>Requirements:</strong>
            <p>{jobData.requirement || "No requirements specified"}</p>
          </div>

          <div className="mb-2 row">
            <div className="col-md-6"><strong>City:</strong> {jobData.city?.name || "-"}</div>
            <div className="col-md-6"><strong>Category:</strong> {jobData.category?.name || "-"}</div>
          </div>

          <div className="mb-2 row">
            <div className="col-md-6"><strong>Company:</strong> {jobData.company?.name || "-"}</div>
            <div className="col-md-6"><strong>Time of Work:</strong> {jobData.time_of_work?.name || "-"}</div>
          </div>

          <div className="mb-2 row">
            <div className="col-md-6">
              <strong>Salary:</strong>{" "}
              {jobData.min_price && jobData.max_price
                ? `$${jobData.min_price} - $${jobData.max_price}`
                : "Not specified"}
            </div>
          </div>

          <div className="mt-3 text-muted">
            <small>Created at: {new Date(jobData.created_at).toLocaleString()}</small>
          </div>
        </div>
      </div>

      {hasApplied ? (
        <span className="text-success fw-bold mt-3 d-block">Already Applied</span>
      ) : (
        <button
          className="btn btn-primary mt-3"
          onClick={applyForJob}
          disabled={loadingApply}
        >
          {loadingApply ? "Applying..." : "Apply for this Job"}
        </button>
      )}
    </div>
  );
}
