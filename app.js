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

app.listen(port, () => {
  console.log(`server run on http://localhost:${port}`);
})