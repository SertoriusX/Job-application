import React, { useContext, useEffect } from 'react';
import UserContext from '../context/UserContext';
import BaseUrl from './BaseUrl';
import { useNavigate, useParams } from 'react-router-dom';
import useFetch from './UseEffectFetch';
import JobContext from '../context/JobContext';
import axios from 'axios';

export default function EditJob() {
  const { token } = useContext(UserContext);
  const { form, setForm, handleChange } = useContext(JobContext);
  const navigate = useNavigate();
  const { id } = useParams();

  const [city] = useFetch(`${BaseUrl}/city`);
  const [category] = useFetch(`${BaseUrl}/category`);
  const [timeOfWork] = useFetch(`${BaseUrl}/time_of_work`);
  const [company] = useFetch(`${BaseUrl}/company`);

  // Fetch job data on load
  useEffect(() => {
    axios.get(`${BaseUrl}/job/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then((res) => {
      const job = res.data;
      setForm({
        ...job,
        city_id: job.city?.id || '',
        category_id: job.category?.id || '',
        company_id: job.company?.id || '',
        time_of_work_id: job.time_of_work?.id || ''
      });
    })
    .catch(err => console.error(err));
  }, [id, token, setForm]);

  // Handle form submit
  const onSend = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${BaseUrl}/job/${id}`, form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('✅ Job updated successfully!');
      navigate('/createJob');
    } catch (err) {
      console.error(err);
      alert('❌ Failed to update job');
    }
  };

  return (
    <div className="container py-5">
      <h1 className="mb-4 text-center">Edit Job</h1>
      <form onSubmit={onSend} className="row g-3">
        {/* Title */}
        <div className="col-md-6">
          <label htmlFor="title" className="form-label">Job Title</label>
          <input
            id="title"
            type="text"
            name="title"
            value={form.title || ''}
            onChange={handleChange}
            className="form-control"
            placeholder="Job Title"
            required
          />
        </div>

        {/* Description */}
        <div className="col-12">
          <label htmlFor="description" className="form-label">Description</label>
          <textarea
            id="description"
            name="description"
            value={form.description || ''}
            onChange={handleChange}
            className="form-control"
            placeholder="Job Description"
            rows="3"
            required
          />
        </div>

        {/* Requirement */}
        <div className="col-12">
          <label htmlFor="requirement" className="form-label">Requirement</label>
          <textarea
            id="requirement"
            name="requirement"
            value={form.requirement || ''}
            onChange={handleChange}
            className="form-control"
            placeholder="Job Requirements"
            rows="2"
          />
        </div>

        {/* Min Price */}
        <div className="col-md-6">
          <label htmlFor="min_price" className="form-label">Minimum Salary</label>
          <input
            id="min_price"
            type="number"
            name="min_price"
            value={form.min_price || ''}
            onChange={handleChange}
            className="form-control"
            placeholder="Minimum Salary"
          />
        </div>

        {/* Max Price */}
        <div className="col-md-6">
          <label htmlFor="max_price" className="form-label">Maximum Salary</label>
          <input
            id="max_price"
            type="number"
            name="max_price"
            value={form.max_price || ''}
            onChange={handleChange}
            className="form-control"
            placeholder="Maximum Salary"
          />
        </div>

        {/* Show Job */}
        <div className="col-12 form-check mb-3">
          <input
            type="checkbox"
            name="is_showed"
            checked={form.is_showed || false}
            onChange={(e) => setForm({ ...form, is_showed: e.target.checked })}
            className="form-check-input"
            id="is_showed"
          />
          <label htmlFor="is_showed" className="form-check-label">Show Job</label>
        </div>

        {/* City */}
        <div className="col-md-6">
          <label className="form-label">City</label>
          <select
            name="city_id"
            value={String(form.city_id || '')}
            onChange={handleChange}
            className="form-select"
          >
            <option value="">Select City</option>
            {city?.map(c => (
              <option key={c.id} value={String(c.id)}>{c.name}</option>
            ))}
          </select>
        </div>

        {/* Category */}
        <div className="col-md-6">
          <label className="form-label">Category</label>
          <select
            name="category_id"
            value={String(form.category_id || '')}
            onChange={handleChange}
            className="form-select"
          >
            <option value="">Select Category</option>
            {category?.map(c => (
              <option key={c.id} value={String(c.id)}>{c.name}</option>
            ))}
          </select>
        </div>

        {/* Time of Work */}
        <div className="col-md-6">
          <label className="form-label">Time of Work</label>
          <select
            name="time_of_work_id"
            value={String(form.time_of_work_id || '')}
            onChange={handleChange}
            className="form-select"
          >
            <option value="">Select Time of Work</option>
            {timeOfWork?.map(t => (
              <option key={t.id} value={String(t.id)}>{t.name}</option>
            ))}
          </select>
        </div>

        {/* Company */}
        <div className="col-md-6">
          <label className="form-label">Company</label>
          <select
            name="company_id"
            value={String(form.company_id || '')}
            onChange={handleChange}
            className="form-select"
          >
            <option value="">Select Company</option>
            {company?.map(c => (
              <option key={c.id} value={String(c.id)}>{c.name}</option>
            ))}
          </select>
        </div>

        {/* Submit Button */}
        <div className="col-12 mt-3">
          <button type="submit" className="btn btn-primary w-100">Save Changes</button>
        </div>
      </form>
    </div>
  );
}
