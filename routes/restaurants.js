const express = require("express");
const router = express.Router();
const { Op } = require("sequelize");

const db = require("../models");
const restlist = db.restaurants;



router.get("/", (req, res, next) => {
  try {
    const keyword = req.query.keyword?.trim();
    const sort = req.query.sort || "name_asc"
    const page = parseInt(req.query.page) || 1
    const limit = 6;
    const userId = req.user.id;
    console.log(userId)

    let sortAz = 0
    let sortZa = 0
    let sortCa = 0
    let sortLo = 0

    if (sort === 'name_asc') {
      sortAz = 1
    } else if (sort === 'name_desc') {
      sortZa = 1
    } else if (sort === 'category') {
      sortCa = 1
    } else if (sort === 'location') {
      sortLo = 1
    }

    const sortOptions = {
      name_asc: [['name', 'ASC']],
      name_desc: [['name', 'DESC']],
      category: [['category', 'ASC']],
      location: [['location', 'ASC']]
    }

    const catches = keyword ? {
      [Op.or]: [
        { name: { [Op.like]: `%${keyword}%` } },
        { category: { [Op.like]: `%${keyword}%` } }
      ]
    } : {}

    return restlist.findAll({
      where: { ...catches, userId },
      offset: (page - 1) * limit,
      limit,
      raw: true,
      order: sortOptions[sort]
    })
      .then((rest) => {
        res.render("restaurants", {
          rest,
          prev: page > 1 ? page - 1 : page,
          next: page + 1,
          page,
          keyword,
          sortAz,
          sortZa,
          sortCa,
          sortLo
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
  const userId = req.user.id

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
    rating: rating,
    userId: userId
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

router.get("/:id", (req, res, next) => {
  const id = req.params.id
  const userId = req.user.id

  return restlist.findByPk(id, {
    raw: true
  })
    .then((rest) => {
      if (!rest) {
        req.flash("error", "資料不存在")
        return res.redirect("/restaurants")
      }
      if (rest.userId !== userId) {
        req.flash("error", "權限不足")
        return res.redirect("/restaurants")
      }
      res.render("restaurant", { rest })
    })
    .catch((error) => {
      error.errorMessage = "資料不存在"
      next(error)
    })
})

router.get("/:id/edit", (req, res, next) => {
  const id = req.params.id
  const userId = req.user.id

  return restlist.findByPk(id, {
    raw: true
  })
    .then((rest) => {
      if (!rest) {
        req.flash("error", "資料不存在")
        return res.redirect("/restaurants")
      }
      if (rest.userId !== userId) {
        req.flash("error", "權限不足")
        return res.redirect("/restaurants")
      }
      res.render("edit", { rest })
    })
    .catch((error) => {
      error.errorMessage = "資料不存在"
      next(error)
    })
})

router.put("/:id", (req, res, next) => {
  try {
    const id = req.params.id
    const body = req.body
    const userId = req.user.id

    return restlist.findByPk(id, {
    })
      .then((rest) => {
        if (!rest) {
          req.flash("error", "資料不存在")
          return res.redirect("/restaurants")
        }
        if (rest.userId !== userId) {
          req.flash("error", "權限不足")
          return res.redirect("/restaurants")
        }
        return rest.update({
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
            req.flash("error", "資料更新失敗")
            return res.redirect(`/restaurants/${id}`)
          })
      })
  }
  catch (error) {
    error.errorMessage = "資料更新失敗"
    next(error)
  }
})

router.delete("/:id", (req, res, next) => {
  const id = req.params.id
  const userId = req.user.id


  return restlist.findByPk(id, {
  })
    .then((rest) => {
      if (!rest) {
        req.flash("error", "資料不存在")
        return res.redirect("/restaurants")
      }
      if (rest.userId !== userId) {
        req.flash("error", "權限不足")
        return res.redirect("/restaurants")
      }
      return restlist.destroy({ where: { id } })
        .then(() => {
          req.flash("del_mes", "刪除成功")
          res.redirect("/restaurants")
        })
    })
    .catch((error) => {
      console.error(error)
      req.flash("error", "資料更新失敗")
      return res.redirect(`/restaurants/${id}`)
    })
})

module.exports = router;