import React, { useContext, useEffect, useState } from 'react';
import BaseUrl from './BaseUrl';
import axios from 'axios';
import UserContext from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import WishListContext from '../context/WishListContext';

export default function Home() {
  const { token } = useContext(UserContext);
  const { addFavorite, removeFavorite, favorites, setFavorites } = useContext(WishListContext);

  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectCategory, setSelectCategory] = useState("");
  const [selectCity, setSelectCity] = useState("");

  const navigate = useNavigate();

  // Fetch categories
  useEffect(() => {
    axios.get(`${BaseUrl}/category`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setCategories(res.data))
      .catch(err => console.error(err));
  }, [token]);

  // Fetch cities
  useEffect(() => {
    axios.get(`${BaseUrl}/city`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setCities(res.data))
      .catch(err => console.error(err));
  }, [token]);

  // Fetch jobs
  useEffect(() => {
  axios.get(`${BaseUrl}/job`, { headers: { Authorization: `Bearer ${token}` } })
  .then(res => {
    const visibleJobs = res.data.filter(j => j.is_showed);
    setJobs(visibleJobs);        // store in jobs
    setFilteredJobs(visibleJobs); // initialize filtered
  })
  .catch(err => console.error(err));
  }, [token]);

  // Fetch favorites
  useEffect(() => {
    if (!token) return;

    const fetchFavorites = async () => {
      try {
        const res = await axios.get(`${BaseUrl}/liked`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFavorites(new Set(res.data.map(String)));
      } catch (err) {
        console.error("Error fetching favorites:", err);
      }
    };

    fetchFavorites();
  }, [token, setFavorites]);

  // Filter jobs whenever filters or jobs change
 useEffect(() => {
  let filtered = [...jobs];

  if (selectCategory) {
    filtered = filtered.filter(j => j.category?.id === selectCategory);
  }
  if (selectCity) {
    filtered = filtered.filter(j => j.city?.id === selectCity);
  }

  setFilteredJobs(filtered);
}, [jobs, selectCategory, selectCity]);
  return (
    <div className="container py-5">
      <div className="row mb-4 g-3">
        <div className="col-md-6">
          <select
            className="form-select"
            value={selectCategory}
            onChange={(e) => setSelectCategory(e.target.value)}
          >
            <option value="">Select Category</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
        <div className="col-md-6">
          <select
            className="form-select"
            value={selectCity}
            onChange={(e) => setSelectCity(e.target.value)}
          >
            <option value="">Select City</option>
            {cities.map(city => (
              <option key={city.id} value={city.id}>{city.name}</option>
            ))}
          </select>
        </div>
      </div>

      <h1 className="text-center mb-5">Available Jobs</h1>
      <div className="row g-4">
        {filteredJobs.map((job, i) => {
          const isFavorite = favorites.has(String(job.id));
          return (
            <div key={i} className="col-12 col-sm-6 col-lg-4">
              <div
                className="card h-100 shadow-sm border-0"
                style={{ cursor: 'pointer' }}
                onClick={() => navigate(`/job/${job.id}`)}
              >
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title text-primary">{job.title}</h5>
                  <p
                    className="card-text text-truncate"
                    style={{ maxHeight: '4.5em', overflow: 'hidden' }}
                  >
                    {job.description}
                  </p>
                  <ul className="list-unstyled text-muted mb-3">
                    <li><strong>City:</strong> {job.city?.name || '-'}</li>
                    <li><strong>Category:</strong> {job.category?.name || '-'}</li>
                    <li><strong>Company:</strong> {job.company?.name || '-'}</li>
                    <li><strong>Time of Work:</strong> {job.time_of_work?.name || '-'}</li>
                  </ul>
                  <div className="mt-auto d-flex justify-content-between align-items-center">
                    <span className="badge bg-primary">
                      {job.min_price && job.max_price
                        ? `$${job.min_price} - $${job.max_price}`
                        : 'Salary not specified'}
                    </span>
                    <button
                      className="btn btn-outline-dark btn-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        isFavorite ? removeFavorite(job.id) : addFavorite(job.id);
                      }}
                    >
                      <i className={`bi ${isFavorite ? 'bi-heart-fill text-danger' : 'bi-heart'}`}></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        {filteredJobs.length === 0 && (
          <p className="text-center text-muted">No jobs found with selected filters.</p>
        )}
      </div>
    </div>
  );
}
