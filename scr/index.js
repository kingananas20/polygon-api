const fs = require("fs");
const express = require("express");
require("dotenv").config();

const weapons = JSON.parse(fs.readFileSync("data/weapons.json"));
const modules = JSON.parse(fs.readFileSync("data/modules.json"));
const cosmetics = JSON.parse(fs.readFileSync("data/cosmetics.json"));

const app = express();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/api/weapons", (req, res) => {
  res.send(weapons);
});

app.get("/api/v1/weapons/:code", (req, res) => {
  const query = req.params.code.toUpperCase();
  const weapon = weapons.data.find((c) => c.code === query);

  if (!weapon) {
    res.status(404).send("That weapon does not exist!");
  }

  res.send(weapon);
});

app.get("/api/v1/modules/optics/:code", (req, res) => {
  const query = req.params.code.toUpperCase();
  const module = modules.data.optic.find((c) => c.code === query);

  if (!module) {
    res.status(404).send("That weapon does not exist!");
  }

  res.send(module);
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`API server is running on port ${port}...`));
