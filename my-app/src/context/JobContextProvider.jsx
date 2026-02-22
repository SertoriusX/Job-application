import React, { useState } from "react";
import JobContext from "./JobContext";

export default function JobContextProvider({ children }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    requirement: "",
    min_price: "",
    max_price: "",
    is_showed: false,
    category_id: "",
    city_id: "",
    company_id: "",
    time_of_work: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <JobContext.Provider value={{ form, setForm, handleChange }}>
      {children}
    </JobContext.Provider>
  );
}
