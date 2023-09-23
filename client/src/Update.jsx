///////////////////////////////////////////////////////////////
//Imports
//////////////////////////////////////////////////////////////
import "./App.css";

import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Update() {
  const navigate = useNavigate();
  const location = useLocation();

  /////////////////////////////////////////////////////////////
  //Get only one car from the database by id.
  /////////////////////////////////////////////////////////////
  const id = location.pathname.split("/")[2];
  const [selectedCar, setSelectedCar] = useState([]);
  const [file, setFile] = useState();
  const [updatedCar, setUpdatedCar] = useState({
    name: selectedCar.name,
    model: selectedCar.model,
    evjarat: selectedCar.evjarat,
  });

  //Get one car by id from the backend.
  useEffect(() => {
    const fecthOneCar = async () => {
      try {
        const res = await axios.get("http://localhost:8800/cars/" + id);
        setSelectedCar(res.data[0]);
        setUpdatedCar({
          name: res.data[0].name,
          model: res.data[0].model,
          evjarat: res.data[0].evjarat,
          image: res.data[0].image,
        });
      } catch (error) {
        console.log(error);
      }
    };
    fecthOneCar();
  }, [id]);

  ////////////////////////////////////////////////////////////////
  //Update the car
  ////////////////////////////////////////////////////////////////
  const handleFile = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setUpdatedCar((prev) => ({
      ...prev,
      image: URL.createObjectURL(selectedFile),
    }));
  };
  const handleChange = (e) => {
    setUpdatedCar({ ...updatedCar, [e.target.name]: e.target.value });
  };

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      if (
        updatedCar.name === "" ||
        updatedCar.model === "" ||
        updatedCar.evjarat === ""
      ) {
        alert("Please fill all fields");
      } else {
        const formData = new FormData();
        formData.append("name", updatedCar.name);
        formData.append("model", updatedCar.model);
        formData.append("evjarat", updatedCar.evjarat);
        formData.append("image", file);
        await axios.put("http://localhost:8800/cars/" + id, formData);
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    }
  };

  ////////////////////////////////////////////////////////////////
  //Render
  ////////////////////////////////////////////////////////////////
  return (
    <div className="Add">
      <h1>Update The Car</h1>
      <div className="form" key={selectedCar.id}>
        <input
          type="text"
          placeholder="Brand Name"
          name="name"
          defaultValue={selectedCar.name}
          onChange={handleChange}
        />
        <input
          type="text"
          placeholder="Model"
          name="model"
          defaultValue={selectedCar.model}
          onChange={handleChange}
        />
        <input
          type="text"
          placeholder="Year"
          name="evjarat"
          defaultValue={selectedCar.evjarat}
          onChange={handleChange}
        />
      </div>
      <img
        width={100}
        src={`http://localhost:8800/${selectedCar.image}`}
        alt="Car-Image"
      />
      <br />
      <input
        type="file"
        id="profile_pic"
        name="profile_pic"
        accept=".jpg, .jpeg, .png"
        onChange={handleFile}
      />
      <br /> <br />
      <button onClick={handleClick}>Update</button>
    </div>
  );
}
