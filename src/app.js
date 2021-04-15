"use strict";

const path = require("path");
const express = require("express");
const hbs = require("hbs");

const user = require("./routers/user");
const book = require("./routers/book");

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const ensureLogin = require("connect-ensure-login");

const { getBooksForUser } = require("../src/db/book_db");
const { verifyPassword, getUser } = require("../src/db/user_db");
const { sanitizeString } = require("../src/utils/utils");
const { checkDbExists, initializeDb } = require("./db/admin_db");

const sessionSecret = process.env.SESSION_SECRET;
const accessRestricted = process.env.ACCOUNT_CREATE_ACCESS_RESTRICTED === "true";

// verifyPassword() is expected to return a user object or null
passport.use(new LocalStrategy(
  (username, password, done) => {
    username = sanitizeString(username);
    password = sanitizeString(password);
    verifyPassword(username, password, (err, user) => {
        if (err) { return done(err) };
        if (!user) { return done(null, false); };
        return done(null, user);
    });
}));

// session handling setup
passport.serializeUser((user, cb) => {
  cb(null, user.id);
});

passport.deserializeUser((id, cb) => {
  getUser(id, null, (err, user) => {
      if (err) {
        console.log("Error deserializing user for session: ", err);
        return cb(null, err);
      }
      cb(null, user);
  });
});

const app = express();
app.use(user, book);

const port = process.env.PORT || 3000;

const publicDirectoryPath = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../public/templates/views");
const partialsPath = path.join(__dirname, "../public/templates/partials");

// Handlebars engine and views
app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);

// Express setup
app.use(express.static(publicDirectoryPath));

app.use(require("express-session")({
  secret: sessionSecret,
  resave: false,
  saveUninitialized: false
}))

app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());

// routes

app.get("/", (req, res) => {
  checkDbExists((err, exists) => {
    if (err) {
      console.log(`Error checking database: ${err}`);
      res.status(500).send();
    }
    if (exists) {
      res.render("index", { accessRestricted });
    }
    else {
      // if no DB found, attempt to create one
      initializeDb((err, success) => {
        if (err) {
          console.log(`Error initializing database: ${err}`);
          res.status(500).send();
        }
        if (success) {
          console.log("Database initialized, loading index");
          res.render("index", { accessRestricted });
        }
      });
    }
  })
})

app.post("/library", 
  passport.authenticate("local", { failureRedirect: 'login_warning' }),
    (req, res) => { 
      getBooksForUser(req.user, (err, userBooks) => {
        if (err) console.log(err);
        res.render("library", { 
          reqUser: req.user,
          userBooks,
        });
      });
})

app.get("/admin", 
  ensureLogin.ensureLoggedIn("/login_warning"),
  (req, res) => {
    // must be admin to access
    if (req.user.role !== "admin") res.render("404");
    else res.render("admin"); 
})

// delete and recreate database
app.post("/initializeDb", 
  ensureLogin.ensureLoggedIn("/login_warning"),
  (req, res) => {
    if (req.user.role !== "admin") res.status(401).send();
    initializeDb((err, success) => {
        if (err) console.log("Error wiping database: ", err);
        res.redirect(303, "/logout");
    }); 
})

// does library exist
app.get("/does_db_exist", (req, res) => {
  checkDbExists((err, exists) => {
      if (err) {
        console.log(`Error verifying database: ${err}`);
        res.status(500).send();
      }
      res.send(exists);
  });
})

app.get("/login_warning", (req, res) => {
  res.render("login_warning"); 
})

app.get('/logout', (req, res) => {
  req.logout();
  res.redirect(303, "/");
})

app.get("*", (req, res) => { 
  res.render("404"); 
})

app.listen(port, () => {
    console.log("Server started on port " + port + ".");
})