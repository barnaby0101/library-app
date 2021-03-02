"use strict";

const express = require("express");
const hbs = require("hbs");
const path = require("path");
const admin = require("./routers/admin");
const book = require("./routers/book");
const user = require("./routers/user");

// express server

const app = express();
app.use(admin, book, user);

const port = process.env.PORT || 3000;

const publicDirectoryPath = path.join(__dirname, "../public");
const htmlPath = path.join(__dirname, "../public/html");
const viewsPath = path.join(__dirname, "../public/templates/views");
const partialsPath = path.join(__dirname, "../public/templates/partials");

// Handlebars engine and views
app.set("view engine", "hbs");  // handlebars node plugin
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);

app.use(express.static(publicDirectoryPath));
app.use(express.urlencoded({ extended: true }));

app.get("", (req, res) => {
  res.render("index.hbs"); 
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
    res.sendFile(path.join(htmlPath +'/404.html'));
})

app.listen(port, () => {
    console.log("Server started on port " + port + ".");
})