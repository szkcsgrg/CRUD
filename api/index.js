//////////////////////////////////////////////////////////////////////////////
//Server Imports & Configuration
//////////////////////////////////////////////////////////////////////////////
//Imports
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require('fs');

//Server configuration
const app = express();
app.use('/public/images', express.static('public/images'));
const storage = multer.diskStorage({
  destination: (reg, file, cb) => {
    cb(null, "public/images");
  },
  filename: (reg, file, cb) => {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
});

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root1234",
  database: "cars",
});

//Needed to solve error messages.
app.use(express.json());
app.use(cors());

//The default route.
app.get("/", (req, res) => {
  res.json("This is the backend Server");
});

////////////////////////////////////////////////////////////////
//Select from the database.
////////////////////////////////////////////////////////////////

//Select all records.
app.get("/cars",  (req, res) => {
  db.query("SELECT * FROM cars", (err, result) => {
    if (err) return res.json(err);
    return res.json(result);
  });
});

//Select only one record.
app.get("/cars/:id", (req, res) => {
  const id = req.params.id;
  db.query("SELECT * FROM cars WHERE `id` = ?", [id], (err, result) => {
    if (err) return res.json(err);
    return res.json(result);
  });
});

////////////////////////////////////////////////////////////////
//Insert into the database.
////////////////////////////////////////////////////////////////

app.post("/cars", 
upload.single('image'),
 (req, res)  => {
  console.log(req.body)
  console.log(req.file)
  const q = `INSERT INTO cars.cars (name, model, evjarat, image) VALUES (?)`;
  const values = [req.body.name, req.body.model, req.body.evjarat, req.file.path];
  console.log(values);
  // db.query(q, [values], (err, result) => {
  //   if (err) return res.json(err);
  //   return res.json("Car has been created successfully.");
  // });
});

////////////////////////////////////////////////////////////////
//Upadte in the database.
////////////////////////////////////////////////////////////////

app.put("/cars/:id", upload.single('image'), (req, res) => {
  const id = req.params.id;
  const q_1 = `SELECT image FROM cars WHERE id = ?`;
  db.query(q_1, [id], (err, result) => {
    if (err) return res.json(err);
    //Get the name of the Image
    const imagePath = result[0].image;
    //Remove it from the server.
    if (imagePath) {
      fs.unlink(imagePath, (unlinkErr) => {
        if (unlinkErr) console.log('Error deleting image file:', unlinkErr);
        else console.log('Image file deleted successfully:', imagePath);
      });
    }
  });

  const q_2 =
    "UPDATE cars SET `name` = ?, `model` =?, `evjarat` =?, `image` =? WHERE `id` =?";
  const values = [req.body.name, req.body.model, req.body.evjarat, req.file.path, id];

  db.query(q_2, [...values, id], (err, result) => {
    if (err) return res.json(err);
    return res.json("Car has been updated successfully.");
  });
});

////////////////////////////////////////////////////////////////
//Delete from the database.
////////////////////////////////////////////////////////////////
app.delete("/cars/:id", (req, res) => {
  //Get the car by id 
  const id = req.params.id;
  const q_1 = `SELECT image FROM cars WHERE id = ?`; 
  db.query(q_1, [id], (err, result) => {
    if (err) return res.json(err);
    //Get the name of the Image
    const imagePath = result[0].image;
    //Remove it from the server.
    if (imagePath) {
      fs.unlink(imagePath, (unlinkErr) => {
        if (unlinkErr) console.log('Error deleting image file:', unlinkErr);
        else console.log('Image file deleted successfully:', imagePath);
      });
    }
    //Delete the records from the database.
    const q_2 = `DELETE FROM cars WHERE id = ?`;
    db.query(q_2, [id], (err, result) => {
      if (err) return res.json(err);
      return res.json("Car has been deleted successfully.");
    });
  });
});

////////////////////////////////////////////////////////////////
//Server listening.
////////////////////////////////////////////////////////////////

app.listen(8800, () => {
  console.log("Server running on port 8800");
});
