import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import UserContext from "../context/UserContext";
import BaseUrl from "./BaseUrl";

export default function CreateParth() {
  const { token } = useContext(UserContext);
  const [form, setForm] = useState({ name: "", image: null });
  const [form1, setForm1] = useState({ name: "" });
  const [form2, setForm2] = useState({ name: "" });

  const [category, setCategory] = useState([]);
  const [city, setCity] = useState([]);
  const [company, setCompany] = useState([]);
  const [msg, setMsg] = useState("");

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setForm({ ...form, [name]: type === "file" ? files[0] : value });
  };
  const handleChange1 = (e) => setForm1({ ...form1, [e.target.name]: e.target.value });
  const handleChange2 = (e) => setForm2({ ...form2, [e.target.name]: e.target.value });

  const onSend1 = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${BaseUrl}/category`, form1, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMsg("✅ Category created successfully!");
      setCategory((prev) => [...prev, res.data]);
      setForm1({ name: "" });
    } catch (err) {
      console.error(err);
      setMsg("❌ Failed to create category");
    }
  };

  const onSend2 = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${BaseUrl}/city`, form2, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMsg("✅ City created successfully!");
      setCity((prev) => [...prev, res.data]);
      setForm2({ name: "" });
    } catch (err) {
      console.error(err);
      setMsg("❌ Failed to create city");
    }
  };

  const onSend = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    for (const key in form) formData.append(key, form[key]);
    try {
      const res = await axios.post(`${BaseUrl}/company`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      setMsg("✅ Company created successfully!");
      setCompany((prev) => [...prev, res.data]);
      setForm({ name: "", image: null });
    } catch (err) {
      console.error(err);
      setMsg("❌ Failed to create company");
    }
  };

  const fetchData = () => {
    axios
      .get(`${BaseUrl}/city`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setCity(res.data))
      .catch(console.log);

    axios
      .get(`${BaseUrl}/category`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setCategory(res.data))
      .catch(console.log);

    axios
      .get(`${BaseUrl}/company`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setCompany(res.data))
      .catch(console.log);
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  // Delete handlers
  const deleteCategory = async (id) => {
    try {
      await axios.delete(`${BaseUrl}/category/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategory((prev) => prev.filter((c) => c.id !== id));
      setMsg("✅ Category deleted successfully!");
    } catch (err) {
      console.error(err);
      setMsg("❌ Failed to delete category");
    }
  };

  const deleteCity = async (id) => {
    try {
      await axios.delete(`${BaseUrl}/city/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCity((prev) => prev.filter((c) => c.id !== id));
      setMsg("✅ City deleted successfully!");
    } catch (err) {
      console.error(err);
      setMsg("❌ Failed to delete city");
    }
  };

  const deleteCompany = async (id) => {
    try {
      await axios.delete(`${BaseUrl}/company/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCompany((prev) => prev.filter((c) => c.id !== id));
      setMsg("✅ Company deleted successfully!");
    } catch (err) {
      console.error(err);
      setMsg("❌ Failed to delete company");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8 mt-5">
      {msg && <p className="text-center text-lg font-medium text-green-600">{msg}</p>}

      {/* --- Forms Row --- */}
      <div className="row justify-content-center gap-4 ">
        {/* Category Form */}
        <div className="col-12 col-md-3 mb-4 d-flex justify-content-center ">
          <div className="bg-white shadow-md rounded-lg p-6 h-full">
            <h2 className="text-2xl font-semibold mb-4">Create Category</h2>
            <form
              onSubmit={onSend1}
              className="flex flex-col gap-4 items-center sm:items-stretch"
            >
              <input
                type="text"
                name="name"
                value={form1.name}
                onChange={handleChange1}
                placeholder="Category name"
                required
                className="border p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-green-400"
              />
              <button
                type="submit"
                className="btn btn-success text-white px-6 py-3 rounded-lg hover:bg-green-600 transition w-full"
              >
                Add Category
              </button>
            </form>
          </div>
        </div>

        {/* City Form */}
        <div className="col-12 col-md-3 mb-4  d-flex justify-content-center ">
          <div className="bg-white shadow-md rounded-lg p-6 h-full">
            <h2 className="text-2xl font-semibold mb-4">Create City</h2>
            <form
              onSubmit={onSend2}
              className="flex flex-col gap-4 items-center sm:items-stretch"
            >
              <input
                type="text"
                name="name"
                value={form2.name}
                onChange={handleChange2}
                placeholder="City name"
                required
                className="border p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-green-400"
              />
              <button
                type="submit"
                className="btn btn-success text-white px-6 py-3 rounded-lg hover:bg-green-600 transition w-full"
              >
                Add City
              </button>
            </form>
          </div>
        </div>

        {/* Company Form */}
        <div className="col-12 col-md-3 mb-4  d-flex justify-content-center  align-items-center">
          <div className="bg-white shadow-md rounded-lg p-6 h-full">
            <h2 className="text-2xl font-semibold mb-4">Create Company</h2>
            <form
              onSubmit={onSend}
              className="flex flex-col gap-4 items-center sm:items-stretch"
            >
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Company name"
                required
                className="border p-3 mb-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <input
                type="file"
                name="image"
                onChange={handleChange}
                required
                className="border p-3 mb-2 rounded-lg w-full"
              />
              <button
                type="submit"
                className="btn btn-success text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition w-full"
              >
                Add Company
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* --- Tables --- */}
      <div className="row justify-content-center gap-2">
        {/* Categories */}
        <div className="col-12 col-md-3 mb-4  d-flex justify-content-center  align-items-center">
          <div className=" rounded-lg p-4 overflow-x-auto  h-full">
            <h3 className="text-xl font-semibold mb-3">All Categories</h3>
            <table className="w-full border-collapse">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border p-2 text-left">#</th>
                  <th className="border p-2 text-left">Name</th>
                  <th className="border p-2 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {category.map((c, i) => (
                  <tr key={c.id || i} className="hover:bg-gray-50">
                    <td className="border p-2">{i + 1}</td>
                    <td className="border p-2">{c.name}</td>
                    <td className="border p-2">
                      <button
                        className="btn btn-danger text-white px-3 py-1 rounded hover:bg-red-600 transition"
                        onClick={() => deleteCategory(c.id)}
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

        {/* Cities */}
        <div className="col-12 col-md-3 mb-4  d-flex justify-content-center  align-items-center">
          <div className=" rounded-lg p-4 overflow-x-auto h-full">
            <h3 className="text-xl font-semibold mb-3">All Cities</h3>
            <table className="w-full border-collapse">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border p-2 text-left">#</th>
                  <th className="border p-2 text-left">Name</th>
                  <th className="border p-2 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {city.map((c, i) => (
                  <tr key={c.id || i} className="hover:bg-gray-50">
                    <td className="border p-2">{i + 1}</td>
                    <td className="border p-2">{c.name}</td>
                    <td className="border p-2">
                      <button
                        className="btn btn-danger text-white px-3 py-1 rounded hover:bg-red-600 transition"
                        onClick={() => deleteCity(c.id)}
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

        {/* Companies */}
        <div className="col-12 col-md-3 mb-4  d-flex justify-content-center  align-items-center">
          <div className="rounded-lg p-4 overflow-x-auto  h-full">
            <h3 className="text-xl font-semibold mb-3">All Companies</h3>
            <table className="w-full border-collapse">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border p-2 text-left">#</th>
                  <th className="border p-2 text-left">Name</th>
                  <th className="border p-2 text-left">Image</th>
                  <th className="border p-2 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {company.map((c, i) => (
                  <tr key={c.id || i} className="hover:bg-gray-50">
                    <td className="border p-2">{i + 1}</td>
                    <td className="border p-2">{c.name}</td>
                    <td className="border p-2">
                      {c.image ? (
                        <img
                          width={"120px"}
                          src={`${BaseUrl}/uploads/companyImg/${c.image}`}
                          alt={c.name}
                          className="object-cover rounded-lg"
                        />
                      ) : (
                        "No Image"
                      )}
                    </td>
                    <td className="border p-2">
                      <button
                        className="btn btn-danger text-white px-3 py-1 rounded hover:bg-red-600 transition"
                        onClick={() => deleteCompany(c.id)}
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
      </div>
    </div>
  );
}
