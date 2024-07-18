module.exports = (error, req, res, next) => {
  console.error(error)
  req.flash("error", error.errorMessage || "操作失敗")
  res.redirect("back")

  next(error)
}