const express = require("express");
const router = express.Router();
const { Op } = require("sequelize");

const db = require("../models");
const restlist = db.restaurants;


router.get("/", (req, res, next) => {
  try {
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
        res.render("restaurants", {
          rest,
          keyword,
        })
      })
      .catch((error) => {
        next(error)
      })
  }
  catch (error) {
    next(error)
  }

})

router.get("/new", (req, res) => {
  return res.render("new");
})

router.post("/", (req, res, next) => {
  // throw new Error("This is a test error.")
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
    // name:null, //This is a error test
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
    .catch((error) => {
      error.errorMessage = "新增失敗"
      next(error)
    })
})

router.get("/:id", (req, res) => {
  const id = req.params.id

  return restlist.findByPk(id, {
    raw: true
  })
    .then((rest) => res.render("restaurant", {
      rest,
    }))
    .catch((err) => console.log(err))
})

router.get("/:id/edit", (req, res) => {
  const id = req.params.id

  return restlist.findByPk(id, {
    raw: true
  })
    .then((rest) => res.render("edit", { rest }))
    .catch((err) => console.log(err))
})

router.put("/:id", (req, res) => {
  try {
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
      .then(() => {
        req.flash("edit_mes", "修改成功")
        res.redirect(`/restaurants/${id}`)
      })
      .catch((error) => {
        console.error(error)
        req.flash("error", "操作失敗")
        return res.redirect(`/restaurants/${id}`)
      })
  } catch (error) {
    console.error(error)
    req.flash("error", "操作失敗")
    return res.redirect(`/restaurants/${id}`)
  }
})

router.delete("/:id", (req, res) => {
  const id = req.params.id

  return restlist.destroy({ where: { id } })
    .then(() => {
      req.flash("del_mes", "刪除成功")
      res.redirect("/restaurants")
    })
})

module.exports = router;