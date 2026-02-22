import React, { useContext, useEffect, useState } from "react";
import UserContext from "../context/UserContext";
import JobContext from "../context/JobContext";
import BaseUrl from "./BaseUrl";
import useFetch from "./UseEffectFetch";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function CreateJob() {
  const { token } = useContext(UserContext);
  const { form, setForm, handleChange } = useContext(JobContext);
  const navigate = useNavigate();

  const [city] = useFetch(`${BaseUrl}/city`);
  const [category] = useFetch(`${BaseUrl}/category`);
  const [timeOfWork] = useFetch(`${BaseUrl}/time_of_work`);
  const [company] = useFetch(`${BaseUrl}/company`);
  const [msg, setMsg] = useState("");
  const [data, setData] = useState([]);
  const [isOpen,setIsOpen]=useState(null)

  // Fetch all jobs
  useEffect(() => {
    axios
      .get(`${BaseUrl}/job`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setData(res.data))
      .catch((err) => console.error(err));
  }, [token]);

  const onSend = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${BaseUrl}/job`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setForm({
        title: "",
        description: "",
        requirement: "",
        min_price: "",
        max_price: "",
        is_showed: false,
        category_id: "",
        city_id: "",
        company_id: "",
        time_of_work_id: "",
      });

      setData((prev) => [...prev, res.data]);
      setMsg("✅ Job created successfully!");
    } catch (err) {
      console.error(err);
      setMsg("❌ Failed to create job.");
    }
  };

  return (
    <div className="container py-5">
      <h1 className="text-center mb-4">Create Job</h1>

      {msg && (
        <div
          className={`alert ${
            msg.includes("✅") ? "alert-success" : "alert-danger"
          } text-center`}
        >
          {msg}
        </div>
      )}
      <div className="d-flex justify-content-center ">      <button className="btn btn-primary mt-5 mb-5" onClick={()=>setIsOpen(!isOpen)}>Add Job</button>
</div>
      {isOpen&&(  <div className="card shadow-sm mb-5">
        <div className="card-body">
          <form onSubmit={onSend}>
            <div className="mb-3">
              <label className="form-label">Job Title</label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                className="form-control"
                placeholder="Job Title"
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Job Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                className="form-control"
                rows="3"
                placeholder="Job Description"
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Requirements</label>
              <textarea
                name="requirement"
                value={form.requirement}
                onChange={handleChange}
                className="form-control"
                rows="3"
                placeholder="Requirements"
                required
              />
            </div>

            <div className="row mb-3">
              <div className="col-md-6 mb-3 mb-md-0">
                <label className="form-label">Min Salary</label>
                <input
                  type="number"
                  name="min_price"
                  value={form.min_price}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Min Salary"
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Max Salary</label>
                <input
                  type="number"
                  name="max_price"
                  value={form.max_price}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Max Salary"
                />
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-6 mb-3 mb-md-0">
                <label className="form-label">Category</label>
                <select
                  name="category_id"
                  value={form.category_id}
                  onChange={handleChange}
                  className="form-select"
                  required
                >
                  <option value="">Select Category</option>
                  {category?.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label">City</label>
                <select
                  name="city_id"
                  value={form.city_id}
                  onChange={handleChange}
                  className="form-select"
                  required
                >
                  <option value="">Select City</option>
                  {city?.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-6 mb-3 mb-md-0">
                <label className="form-label">Company</label>
                <select
                  name="company_id"
                  value={form.company_id}
                  onChange={handleChange}
                  className="form-select"
                  required
                >
                  <option value="">Select Company</option>
                  {company?.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label">Time of Work</label>
                <select
                  name="time_of_work_id"
                  value={form.time_of_work_id}
                  onChange={handleChange}
                  className="form-select"
                  required
                >
                  <option value="">Select Time of Work</option>
                  {timeOfWork?.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-check mb-4">
              <input
                type="checkbox"
                name="is_showed"
                checked={form.is_showed}
                onChange={(e) =>
                  setForm({ ...form, is_showed: e.target.checked })
                }
                className="form-check-input"
                id="showJob"
              />
              <label className="form-check-label" htmlFor="showJob">
                Show this job publicly
              </label>
            </div>

            <button type="submit" className="btn btn-primary w-100">
              Create Job
            </button>
          </form>
        </div>
      </div>
)}
    
      {/* Jobs Table */}
      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Title</th>
              <th>Description</th>
              <th>City</th>
              <th>Category</th>
              <th>Company</th>
              <th>Time of Work</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {data.map((j, i) => (
              <tr key={i}>
                <td>{i + 1}</td>
                <td>{j.title}</td>
                <td>{j.description}</td>
                <td>{j.city?.name}</td>
                <td>{j.category?.name}</td>
                <td>{j.company?.name}</td>
                <td>{j.time_of_work?.name}</td>
                <td>
                  <button
                    className="btn btn-sm btn-warning"
                    onClick={() => navigate(`/editJob/${j.id}`)}
                  >
                    Edit
                  </button>
                </td>
                <td>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={async () => {
                      if (window.confirm("Are you sure to delete this job?")) {
                        await axios.delete(`${BaseUrl}/job/${j.id}`, {
                          headers: { Authorization: `Bearer ${token}` },
                        });
                        setData((prev) =>
                          prev.filter((job) => job.id !== j.id)
                        );
                      }
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
