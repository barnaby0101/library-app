"use strict";

const express = require("express");
const hbs = require("hbs");
const path = require("path");

const account = require("./routers/account");
const admin = require("./routers/admin");
const book = require("./routers/book");

const app = express();
app.use(account, admin, book);

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
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("index.hbs", { user: req.user }); 
})

app.get("/library", (req, res) => {
  res.render("library"); 
})

app.get("/add", (req, res) => {
  res.render("add"); 
})

app.get("/create_account", (req, res) => {
  res.render("create_account"); 
})

app.get("/admin", (req, res) => {
  res.render("admin"); 
})

app.get("*", (req, res) => { 
  res.render("404"); 
})

app.listen(port, () => {
    console.log("Server started on port " + port + ".");
})