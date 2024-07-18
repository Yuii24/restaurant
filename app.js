const express = require("express");
const flash = require("connect-flash");
const session = require("express-session");
const { engine } = require("express-handlebars");
const methodOverride = require("method-override");
const mesHandler = require("./middlewares/messages-handler")
const app = express();
const router = require("./routes");
const port = 3000;


const db = require("./models");
const errorHandler = require("./middlewares/error-handler");
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

app.use(mesHandler);

app.use(router);

app.use(errorHandler)


app.listen(port, () => {
  console.log(`server run on http://localhost:${port}`);
})