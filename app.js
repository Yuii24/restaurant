const express = require("express");
const { engine } = require("express-handlebars");
const app = express();
const port = 3000;

const db = require("./models");
const restaurants = require("./models/restaurants");
const restlist = db.restaurants;


app.engine(".hbs", engine({ extname: ".hbs" }));
app.set("view engine", ".hbs");
app.set("views", "./views");

app.use(express.urlencoded({ extended: true }));


app.get("/", (req, res) => {
  res.render("index");
})

app.get("/restaurants", (req, res) => {
  return restlist.findAll({
    raw: true
  })
    .then((rest) => {
      res.render("restaurants", { rest })
    })
})

app.get("/restaurants/new", (req, res) => {
  return res.render("new");
})

app.post("/restaurants", (req, res) => {
  const name = req.body.name;
  const name_en = req.body.name_en;
  const category = req.body.category;
  const image = req.body.image;
  const location = req.body.location;
  const phone = req.body.phone;
  const google_map = req.body.google_map;
  const description = req.body.description;

  return restlist.create({
    name: name,
    name_en: name_en,
    category: category,
    image: image,
    location: location,
    phone: phone,
    google_map: google_map,
    description: description
  })
    .then(() => res.redirect("/restaurants"))
})

app.listen(port, () => {
  console.log(`server run on http://localhost:${port}`);
})