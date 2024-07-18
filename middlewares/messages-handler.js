module.exports = (req, res, next) => {
  res.locals.sus_mes = req.flash("success");
  res.locals.del_mes = req.flash("del_mes");
  res.locals.error_mes = req.flash("error");
  res.locals.edit_mes = req.flash("edit_mes")

  next()
}