import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import UserContext from "../context/UserContext";
import BaseUrl from "./BaseUrl";
import useFetch from "./UseEffectFetch";

export default function EditProfile({ item, onClose, onSave }) {
  const { token } = useContext(UserContext);
  const [city] = useFetch(`${BaseUrl}/city`);
  const [gender] = useFetch(`${BaseUrl}/gender`);

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    img: null,
    bio: "",
    cv: null,
    document_for_indicated: "",
    city_id: "",
    gender_id: "",
  });

  const [previewImg, setPreviewImg] = useState(null);
  const [previewCV, setPreviewCV] = useState(null);

  useEffect(() => {
    if (item) {
      setForm({
        first_name: item.first_name || "",
        last_name: item.last_name || "",
        img: null,
        bio: item.bio || "",
        cv: null,
        document_for_indicated: item.document_for_indicated || "",
        city_id: item.city_id   || "",
        gender_id: item.gender_id || "",
      });
      setPreviewImg(item.img ? `${BaseUrl}/uploads/images/${item.img}` : null);
      setPreviewCV(item.cv ? `${BaseUrl}/uploads/cv/${item.cv}` : null);
    }
  }, [item]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setForm({ ...form, [name]: files[0] });
      if (name === "img") setPreviewImg(URL.createObjectURL(files[0]));
      if (name === "cv") setPreviewCV(files[0].name);
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const onSend = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(form).forEach((key) => formData.append(key, form[key]));

    try {
      const res = await axios.put(`${BaseUrl}/profile/${item.id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onSave(res.data);
      onClose();
    } catch (err) {
      console.error("Failed to update profile:", err);
    }
  };

  return (
<div
  className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
  style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1050 }}
>
  <div
    className="bg-white rounded shadow p-3"
    style={{ maxWidth: "500px", width: "90%" }}
  >
    <h3 className="text-center mb-3">Edit Profile</h3>
    <form onSubmit={onSend}>
      <div className="row g-2">
        <div className="col-md-6">
          <label className="form-label">First Name</label>
          <input
            type="text"
            name="first_name"
            value={form.first_name}
            onChange={handleChange}
            className="form-control form-control-sm"
            required
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">Last Name</label>
          <input
            type="text"
            name="last_name"
            value={form.last_name}
            onChange={handleChange}
            className="form-control form-control-sm"
            required
          />
        </div>
      </div>

      <div className="row g-2 mt-2">
        <div className="col-md-6">
          <label className="form-label">City</label>
          <select
            name="city_id"
            value={form.city_id}
            onChange={handleChange}
            className="form-select form-select-sm"
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
        <div className="col-md-6">
          <label className="form-label">Gender</label>
          <select
            name="gender_id"
            value={form.gender_id}
            onChange={handleChange}
            className="form-select form-select-sm"
            required
          >
            <option value="">Select Gender</option>
            {gender?.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="row g-2 mt-2">
        <div className="col-md-6">
          <label className="form-label">Image</label>
          <input type="file" name="img" onChange={handleChange} className="form-control form-control-sm" />
          {previewImg && (
            <img src={previewImg} alt="Preview" className="img-thumbnail mt-1" style={{ width: "80px" }} />
          )}
        </div>
        <div className="col-md-6">
          <label className="form-label">CV</label>
          <input type="file" name="cv" onChange={handleChange} className="form-control form-control-sm" />
          {previewCV && <small className="text-muted d-block mt-1">{previewCV}</small>}
        </div>
      </div>

      <div className="mb-2 mt-2">
        <label className="form-label">Bio</label>
        <textarea
          name="bio"
          value={form.bio}
          onChange={handleChange}
          className="form-control form-control-sm"
          rows="2"
        />
      </div>

      <div className="mb-2">
        <label className="form-label">Document</label>
        <input
          type="text"
          name="document_for_indicated"
          value={form.document_for_indicated}
          onChange={handleChange}
          className="form-control form-control-sm"
        />
      </div>

      <div className="d-flex justify-content-end mt-2">
        <button type="button" className="btn btn-secondary btn-sm me-2" onClick={onClose}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary btn-sm">
          Save
        </button>
      </div>
    </form>
  </div>
</div>


  );
}
