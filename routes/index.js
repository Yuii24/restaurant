const express = require("express");
const router = express.Router();


const passport = require("passport")


const db = require("../models");
const User = db.users;




const restaurants = require("./restaurants");

const authHandler = require("../middlewares/auth-handler")
router.use("/restaurants", authHandler, restaurants);

router.get("/", (req, res) => {
  res.redirect("/restaurants");
})


router.get("/login", (req, res) => {
  res.render("login")
})

router.post("/login", passport.authenticate("local", {
  successRedirect: "/restaurants",
  failureRedirect: "/login",
  failureFlash: true
}))

router.get("/login/facebook",
  passport.authenticate("facebook", { scope: ["email"] }

  ))

router.get("/oauth2/redirect/facebook", passport.authenticate("facebook", {
  successRedirect: "/restaurants",
  failureRedirect: "/login",
  failureFlash: true
}))

router.get("/register", (req, res) => {
  res.render("register")
})

router.post("/register", async (req, res, next) => {
  const { name, email, password, passwordCheck } = req.body

  console.log(name)
  console.log(email)
  console.log(password)
  console.log(passwordCheck)

  const matchName = await User.count({
    where: { name: name }
  });
  const matchEmail = await User.count({
    where: { email: email }
  });


  if (!name || !email || !password) {
    req.flash("error", "請輸入完整");
    res.redirect("back");
  } else if (password !== passwordCheck) {
    req.flash("error", "兩次密碼不相同")
    return res.redirect("back")
  }

  if (matchName > 0) {
    req.flash("error", "此用戶名已經存在")
    return res.redirect("back")
  } else if (matchEmail > 0) {
    req.flash("error", "此信箱已經存在")
    return res.redirect("back")
  }

  // 新增註冊資料
  return bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({
        name: name,
        email: email,
        password: hash
      })
    })
    .then(() => {
      req.flash("success", "註冊成功")
      res.redirect("/register")
    })
    .catch((error) => {
      error.errorMessage = "註冊失敗"
      next(error)
    })
})

router.post("/logout", (req, res) => {
  req.logout((error) => {
    if (error) {
      next(error)
    }

    return res.redirect("/login")
  })
})

module.exports = router;