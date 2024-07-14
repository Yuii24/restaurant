const express = require("express");
const flash = require("connect-flash");
const session = require("express-session");
const { engine } = require("express-handlebars");
const { Op } = require("sequelize");
const methodOverride = require("method-override");
const app = express();
const port = 3000;

const db = require("./models");
const restlist = db.restaurants;


app.engine(".hbs", engine({ extname: ".hbs" }));
app.set("view engine", ".hbs");
app.set("views", "./views");
app.use(express.static("public"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"))

app.use(session({
  secret: "ThisIsSecret",
  resave: false,
  saveUninitialized: false
}))

app.use(flash())


app.get("/", (req, res) => {
  res.redirect("restaurants");
})

app.get("/restaurants", (req, res) => {
  const keyword = req.query.keyword?.trim();

  const catches = keyword ? {
    [Op.or]: [
      { name: { [Op.like]: `%${keyword}%` } },
      { category: { [Op.like]: `%${keyword}%` } }
    ]
  } : {}

  return restlist.findAll({
    raw: true,
    where: catches
  })
    .then((rest) => {
      res.render("restaurants", { rest, keyword, message: req.flash("success") })
    })

  // let matches = {};

  // if (keyword) {
  //   matches = {
  //     [Op.or]: [
  //       { name: { [Op.like]: `%${keyword}%` } },
  //       { category: { [Op.like]: `%${keyword}%` } }
  //     ]
  //   }
  //   console.log("matches", matches);

  //   return restlist.findAll({ raw: true, where: matches })
  //     .then((rest) => {
  //       res.render("restaurants", { rest, keyword })
  //     })
  // } else {
  //   return restlist.findAll({
  //     raw: true
  //   })
  //     .then((rest) => {
  //       res.render("restaurants", { rest })
  //     })
  // }
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
  const rating = req.body.rating;

  return restlist.create({
    name: name,
    name_en: name_en,
    category: category,
    image: image,
    location: location,
    phone: phone,
    google_map: google_map,
    description: description,
    rating: rating
  })
    .then(() => {
      req.flash("success", "新增成功")
      res.redirect("/restaurants")
    })
    .catch((err) => console.log(err))
})

app.get("/restaurants/:id", (req, res) => {
  const id = req.params.id

  return restlist.findByPk(id, {
    raw: true
  })
    .then((rest) => res.render("restaurant", { rest }))
    .catch((err) => console.log(err))
})

app.get("/restaurants/:id/edit", (req, res) => {
  const id = req.params.id

  return restlist.findByPk(id, {
    raw: true
  })
    .then((rest) => res.render("edit", { rest }))
    .catch((err) => console.log(err))
})

app.put("/restaurants/:id", (req, res) => {
  const id = req.params.id
  const body = req.body

  return restlist.update({
    name: body.name,
    name_en: body.name_en,
    category: body.category,
    image: body.image,
    phone: body.phone,
    google_map: body.google_map,
    description: body.description,
    rating: body.rating
  }, { where: { id } })
    .then(() => res.redirect(`/restaurants/${id}`))
    .catch((err) => console.log(err))
})

app.delete("/restaurants/:id", (req, res) => {
  const id = req.params.id

  return restlist.destroy({ where: { id } })
    .then(() => res.redirect("/restaurants"))
})

app.listen(port, () => {
  console.log(`server run on http://localhost:${port}`);
})