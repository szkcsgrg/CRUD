import "./App.css";

import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

// import { Image } from "../../api/uploads/";

function App() {
  //Get all the rows from the database.

  const [cars, setCars] = useState([]);

  useEffect(() => {
    //Async fucntion is needed to communicate with the backend.
    const fecthAllCars = async () => {
      try {
        const res = await axios.get("http://localhost:8800/cars");
        setCars(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    //Call the function.
    fecthAllCars();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8800/cars/` + id);
      window.location.reload();
      //setCars(cars.filter((car) => car.idcars !== id));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="App">
      <h1>List Of Cars</h1>
      <button>
        <Link to={"/add"}>Add New Car</Link>
      </button>
      <table className="cars">
        <thead>
          <tr className="head">
            <th>Brand</th>
            <th>Model</th>
            <th>Year</th>
            <th>Image</th>
            <th>Functions</th>
          </tr>
        </thead>
        <tbody>
          {/* Show all the elements from the response. */}
          {cars.map((car) => (
            <tr className="car" key={car.id}>
              <td>{car.name}</td>
              <td>{car.model}</td>
              <td>{car.evjarat}</td>
              <td>
                <img
                  width={30}
                  src={`http://localhost:8800/${car.image}`}
                  alt="Car-Image"
                />
              </td>
              <td id="functions">
                <button className="m">
                  <Link to={`/update/${car.id}`}>Update</Link>
                </button>
                <button className="m" onClick={() => handleDelete(car.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
