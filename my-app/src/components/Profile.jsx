import React, { useContext, useEffect, useState } from "react";
import useFetch from "./UseEffectFetch";
import BaseUrl from "./BaseUrl";
import UserContext from "../context/UserContext";
import axios from "axios";
import "./Profile.css"; // We'll add styles here
import EditProfile from "./EditProfile";

export default function Profile() {
  const { token } = useContext(UserContext);
  const [city] = useFetch(`${BaseUrl}/city`);
  const [gender] = useFetch(`${BaseUrl}/gender`);
  const [profile, setProfile] = useState(null);
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
  const [selected,setSelected]=useState(null)

  useEffect(() => {
    if (!token) return;
    axios
      .get(`${BaseUrl}/profile`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setProfile(res.data))
      .catch(() => console.log("No profile yet"));
  }, [token]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setForm({ ...form, [name]: type === "file" ? files[0] : value });
  };

const onSend = async (e) => {
  e.preventDefault();
  const formData = new FormData();
  Object.keys(form).forEach((key) => {
    if (form[key] !== "" && form[key] !== null) formData.append(key, form[key]);
  });

  try {
    const res = await axios.post(`${BaseUrl}/profile`, formData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setProfile(res.data);
  } catch (err) {
    console.error(err);
    alert(err.response?.data?.msg || "Failed to create profile");
  }
};
  if (profile) {
    return (
      <div className="profile-container">
        <div className="profile-card">
          <img
            src={profile.img ? `${BaseUrl}/uploads/images/${profile.img}` : "/placeholder.png"}
            alt={profile.first_name}
            className="profile-img"
          />
          <h2>{profile.first_name} {profile.last_name}</h2>
          <p><strong>Bio:</strong> {profile.bio || "-"}</p>
          <p><strong>Document:</strong> {profile.document_for_indicated || "-"}</p>
          <p><strong>City:</strong> {profile.city || "-"}</p>
          <p><strong>Gender:</strong> {profile.gender || "-"}</p>
          {profile.cv && (
            <p><a href={`${BaseUrl}/uploads/cv/${profile.cv}`} target="_blank" rel="noopener noreferrer">View CV</a></p>
          )}

              <div className="text-center">
            <button className="btn btn-warning" onClick={() => setSelected(profile)}>Edit Profile</button>
            {selected&&(
                <EditProfile
                    item={selected}
                    onClose={()=>setSelected(null)}
                    onSave={(updateItem)=>{
                        setProfile(updateItem)
                        setSelected(null)
                    }}
                />
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2>Create Profile</h2>
        <form className="profile-form" onSubmit={onSend}>
          <input type="text" name="first_name" value={form.first_name} onChange={handleChange} placeholder="First Name" required />
          <input type="text" name="last_name" value={form.last_name} onChange={handleChange} placeholder="Last Name" required />
          img:<input type="file" name="img" onChange={handleChange}  />
          <textarea name="bio" value={form.bio} onChange={handleChange} placeholder="Bio" />
          cv:<input type="file" name="cv" onChange={handleChange} />
          <input type="text" name="document_for_indicated" value={form.document_for_indicated} onChange={handleChange} placeholder="Document" />
          <select name="city_id" value={form.city_id} onChange={handleChange} required>
            <option value="">Select City</option>
            {city?.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <select name="gender_id" value={form.gender_id} onChange={handleChange} required>
            <option value="">Select Gender</option>
            {gender?.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
          </select>
          <button type="submit">Create Profile</button>
        </form>
      </div>
    </div>
  );
}
