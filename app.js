// Membuat Server Dengan Express
const express = require("express");
const app = express();
const port = 9001;
// Menggunakan ejs

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.static("stylesheet"));

// Menghubungkan Mysql Dengan Server
// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// connrct mysql
const mysql = require("mysql");
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "warung_makan",
});

connection.connect();

// read
app.get("/index", (req, res) => {
  const read = "SELECT foods.id,foods.stok,foods.name,foods.image, categories.name as category_name FROM foods INNER JOIN categories ON foods.category_id = categories.id ORDER BY foods.id ASC";
  connection.query(read, (err, results, fields) => {
    if (err) {
      console.log("err", err);
    }

    console.log("results", results);
    res.render("index", { result: results });
  });
});

// insert

app.get("/add-category", (req, res) => {
  res.render("addCategory");
});

app.post("/process-add-category", (req, res) => {
  // InsertVers1
  let data = {
    name: req.body.category_name,
  };
  const sql = "INSERT INTO categories SET ?";
  connection.query(sql, data, function (err, rows) {
    if (err) throw err;
    res.redirect("index");
  });
});

// page add food
app.get("/add-food", (req, res) => {
  const sql = "SELECT * FROM categories ORDER BY id ASC";
  connection.query(sql, function (err, rows, fields) {
    if (err) throw err;
    res.render("addFood", { result: rows });
  });
});

// prosess add food
app.post("/process-add-food", (req, res) => {
  // InsertVers1
  let data = {
    name: req.body.name,
    stok: req.body.stok,
    image: req.body.image,
    description: req.body.description,
    category_id: req.body.categori_id,
  };

  console.log(data);
  const sql = "INSERT INTO foods SET ?";
  connection.query(sql, data, function (err, rows) {
    if (err) throw err;
    res.redirect("/index");
  });
});

//delet

app.get("/process-delete-food/:id", (req, res) => {
  let idParams = req.params.id;
  // res.send("this is route delete food, id : " + idParams);
  const sql = "DELETE FROM foods WHERE id = '" + idParams + "'";
  connection.query(sql, function (err, rows) {
    if (err) throw err;
    res.redirect("/index");
  });
});

// edit

app.get("/edit-food/:id", (req, res) => {
  let idParams = req.params.id;
  // res.send("this is route delete food, id : " + idParams);
  console.log("Id Params : ", idParams);
  const sql = "SELECT * FROM foods WHERE id = '" + idParams + "'";
  connection.query(sql, function (err, rows, fields) {
    if (err) throw err;
    res.render("edit", { result: rows });
  });
});

app.post("/process-edit-food/:id", (req, res) => {
  // InsertVers1
  let idParams = req.params.id;
  let data = {
    name: req.body.name,
    stok: req.body.stok,
    image: req.body.image,
    description: req.body.description,
  };
  console.log("idParams : ", idParams);
  // res.send("This is route Edit food ");
  const sql = "UPDATE foods SET ? WHERE id = '" + idParams + "'";
  connection.query(sql, data, function (err, rows) {
    if (err) throw err;
    res.redirect("/index");
  });
});

app.use(function (req, res, next) {
  res.status(404);
  res.send("404");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
