const fs = require("fs");
const express = require("express");
require("dotenv").config();

const weapons = JSON.parse(fs.readFileSync("data/weapons.json"));
const modules = JSON.parse(fs.readFileSync("data/modules.json"));
const cosmetics = JSON.parse(fs.readFileSync("data/cosmetics.json"));
const keys = JSON.parse(fs.readFileSync("data/keys.json"));

const app = express();

function getPermission(key, res, payload) {
  const permissionGranted = keys.find((c) => c.key === key);
  if (!permissionGranted) {
    res.send("incorrect");
    return;
  } else if (permissionGranted.limit === 0) {
    res.send("Max calls reached for today");
    return;
  } else {
    permissionGranted.limit = permissionGranted.limit - 1;
    fs.writeFileSync("data/keys.json", JSON.stringify(keys, null, 2));
    res.send(payload);
    return;
  }
}

app.get("/api/v1/:key", (req, res) => {
  getPermission(req.params.key, res, "correct");
});

app.get("/api/v1/:key/weapons/", (req, res) => {
  getPermission(req.params.key, res, weapons);
});

app.get("/api/v1/:key/weapons/:code", (req, res) => {
  const query = req.params.code.toUpperCase();
  const weapon = weapons.data.find((c) => c.code === query);

  if (!weapon) {
    res.status(404).send("That weapon does not exist!");
    return;
  }

  getPermission(req.params.key, res, weapon);
});

app.get("/api/v1/:key/modules", (req, res) => {
  getPermission(req.params.key, res, modules);
});

app.get("/api/v1/:key/modules/:type", (req, res) => {
  if (req.params.type === "optics") {
    getPermission(req.params.key, res, modules.data.optic);
    return;
  } else if (req.params.type === "barrels") {
    getPermission(req.params.key, res, modules.data.barrel);
    return;
  } else if (req.params.type === "underbarrels") {
    getPermission(req.params.key, res, modules.data.underbarrel);
    return;
  } else if (req.params.type === "accessory") {
    getPermission(req.params.key, res, modules.data.accessory);
    return;
  } else {
    res.send("Type of modules does not exist.");
    return;
  }
});

app.get("/api/v1/:key/modules/:type/:code", (req, res) => {
  if (req.params.type === "optics") {
    const module = modules.data.optic.find(
      (c) => c.code === req.params.code.toUpperCase()
    );
    if (!module) {
      res.send("That module does not exist.");
      return;
    }
    getPermission(req.params.key, res, module);
    return;
  } else if (req.params.type === "barrels") {
    getPermission(req.params.key, res, modules.data.barrel);
    return;
  } else if (req.params.type === "underbarrels") {
    getPermission(req.params.key, res, modules.data.underbarrel);
    return;
  } else if (req.params.type === "accessory") {
    const module = modules.data.accessory.find(
      (c) => c.code === req.params.code.toUpperCase()
    );
    if (!module) {
      res.send("That module does not exist.");
    }
    getPermission(req.params.key, res, module);
    return;
  } else {
    res.send("Type of module does not exist");
    return;
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`API server is running on port ${port}...`));
