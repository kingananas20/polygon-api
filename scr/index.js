const fs = require("fs");
const express = require("express");
require("dotenv").config();

const weapons = JSON.parse(fs.readFileSync("data/weapons.json"));

const app = express();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/api/weapons", (req, res) => {
  res.send(weapons);
});

app.get("/api/weapons/:code", (req, res) => {
  const query = req.params.code.toUpperCase();
  const weapon = weapons.data.find((c) => c.code === query);
  if (!weapon) {
    res.status(404).send("That weapon does not exist!");
  }
  res.send(weapon);
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`API server is running on port ${port}...`));
