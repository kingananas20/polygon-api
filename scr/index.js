const fs = require("fs");
const express = require("express");
require("dotenv").config();

const weapons = JSON.parse(fs.readFileSync("data/weapons.json"));
const modules = JSON.parse(fs.readFileSync("data/modules.json"));
const cosmetics = JSON.parse(fs.readFileSync("data/cosmetics.json"));
const keys = JSON.parse(fs.readFileSync("data/keys.json"));

const app = express();

function getPermission(key, res, payload) {
  const permissionGranted = keys.keys.find((c) => c.key === key);
  if (!permissionGranted) {
    res.send("incorrect");
  } else if (permissionGranted.limit === 0) {
    res.send("Max calls for today reached");
  } else {
    res.send(payload);
    permissionGranted.limit = permissionGranted.limit - 1;
    fs.writeFileSync(
      "data/keys.json",
      JSON.stringify(permissionGranted, null, 2)
    );
  }
}

app.get("/api/v1/:key", (req, res) => {
  getPermission(req.params.key, res, "correct");
});

app.get("/api/v1/weapons/", (req, res) => {
  res.send(weapons);
});

app.get("/api/:apikey/v1/weapons/:code", (req, res) => {
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
    res.status(404).send({
      data: [],
      message: "Query does not exist.",
      success: 0,
    });
  }

  res.send(module);
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`API server is running on port ${port}...`));
