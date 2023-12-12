import "./App.css";

import React from "react";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Add = () => {
  const navigate = useNavigate();
  const [car, setCars] = useState({
    name: "",
    model: "",
    evjarat: "",
    image: "",
  });

  const [file, setFile] = useState();
  const handleFile = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setCars((prev) => ({
      ...prev,
      image: URL.createObjectURL(selectedFile),
    }));
  };

  const handleChange = (e) => {
    setCars((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const handleClick = async (e) => {
    e.preventDefault();
    try {
      if (car.name === "" || car.model === "" || car.evjarat === "") {
        alert("Please fill all fields");
      } else {
        const formData = new FormData();
        formData.append("name", car.name);
        formData.append("model", car.model);
        formData.append("evjarat", car.evjarat);
        formData.append("image", file);
        await axios.post("http://localhost:8800/cars", formData);
        //navigate("/");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="Add">
      <h1>Add New Car</h1>
      <form className="form">
        <input
          type="text"
          placeholder="Brand Name"
          name="name"
          onChange={handleChange}
        />
        <input
          type="text"
          placeholder="Model"
          name="model"
          onChange={handleChange}
        />
        <input
          type="text"
          placeholder="Year"
          name="evjarat"
          onChange={handleChange}
        />
      </form>
      <input
        type="file"
        id="profile_pic"
        name="profile_pic"
        accept=".jpg, .jpeg, .png"
        onChange={handleFile}
      />
      <button onClick={handleClick}>Add</button>
    </div>
  );
};

export default Add;
