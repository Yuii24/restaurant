if (process.env.NODE_ENV === "development") {
  require("dotenv").config();
}
const express = require("express");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("./config/passport")
const { engine } = require("express-handlebars");
const methodOverride = require("method-override");
const mesHandler = require("./middlewares/messages-handler")
const app = express();
const router = require("./routes");
const port = 3000;

const db = require("./models");
const errorHandler = require("./middlewares/error-handler");
const restlist = db.restaurants;

console.log(process.env.SESSION_SECRET);
app.engine(".hbs", engine({ extname: ".hbs" }));
app.set("view engine", ".hbs");
app.set("views", "./views");
app.use(express.static("public"));


app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"))

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))

app.use(flash())


app.use(passport.initialize())
app.use(passport.session())



app.use(mesHandler);

app.use(router);

app.use(errorHandler)


app.listen(port, () => {
  console.log(`server run on http://localhost:${port}`);
})