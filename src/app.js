"use strict";

const path = require("path");
const express = require("express");
const hbs = require("hbs");

const user = require("./routers/user");
const admin = require("./routers/admin");
const book = require("./routers/book");

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const ensureLogin = require("connect-ensure-login");

const { verifyPassword, getUser } = require("../src/db/user_db");

// verifyPassword() is expected to return a user object or null
passport.use(new LocalStrategy(
  (username, password, done) => {
      verifyPassword(username, password, (err, user) => {
          if (err) { return done(err) };
          if (!user) { return done(null, false); };
          return done(null, user);
      });
}));

// // session handling setup
passport.serializeUser((user, cb) => {
  // console.log("user.id from serializeUser()", user.id);
  cb(null, user.id);
});

passport.deserializeUser((id, cb) => {
  getUser(id, null, (err, user) => {
      // console.log("user object from deserializeUser(): ", user);  
      if (err) return cb("err with deserializeUser(): ", err);
      cb(null, user);
  });
});

const app = express();
app.use(user, admin, book);

const port = process.env.PORT || 3000;

const publicDirectoryPath = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../public/templates/views");
const partialsPath = path.join(__dirname, "../public/templates/partials");

// Handlebars engine and views
app.set("view engine", "hbs");  // handlebars node plugin
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);

// Express setup
app.use(express.static(publicDirectoryPath));

app.use(require("express-session")({
  secret: "my secret", 
  resave: false,
  saveUninitialized: false
}))

app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());



// routes

app.get("/", (req, res) => {
  res.render("index"); 
})

app.get("/library", 
    ensureLogin.ensureLoggedIn("/login-warning"),
    (req, res) => { 
        res.render("library", { username: req.user.username }
    );
})

app.get("/add", (req, res) => {
  res.render("add"); 
})

app.get("/admin", (req, res) => {
  res.render("admin"); 
})

app.get("/login-warning", (req, res) => {
  res.render("login-warning"); 
})

app.get("*", (req, res) => { 
  res.render("404"); 
})

app.listen(port, () => {
    console.log("Server started on port " + port + ".");
})