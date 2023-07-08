const fs = require("fs");
const { createHash } = require("crypto");
const express = require("express");
const { get } = require("http");
require("dotenv").config();

const weapons = JSON.parse(fs.readFileSync("data/weapons.json"));
const modules = JSON.parse(fs.readFileSync("data/modules.json"));
const cosmetics = JSON.parse(fs.readFileSync("data/cosmetics.json"));
const keys = JSON.parse(fs.readFileSync("data/keys.json"));

const app = express();

/**
 * Json examples:
 *
 * err = {
 * "data": [],
 * "message": <err message>,
 * "success": 0
 * }
 *
 * success = {
 * "data": <data>,
 * "message": "Successful.",
 * "success": 1
 * }
 */

function hash(input) {
  return createHash("sha256").update(input).digest("hex");
}

function getPermission(key, res, payload, message, status) {
  const permissionGranted = keys.find((c) => c.key === hash(key));
  if (!permissionGranted) {
    res
      .send({
        data: [],
        message: "Apikey invalid or incorrect.",
        success: 0,
      })
      .status(401);
    return;
  } else if (permissionGranted.limit === 0) {
    res
      .send({
        data: [],
        message: "Max calls reached.",
        success: 0,
      })
      .status(401);
    return;
  } else {
    permissionGranted.limit = permissionGranted.limit - 1;
    fs.writeFileSync("data/keys.json", JSON.stringify(keys, null, 2));
    res
      .send({
        data: payload,
        message: message,
        success: 1,
      })
      .status(status || 200);
    return;
  }
}

app.get("/api/v1/:key", (req, res) => {
  getPermission(req.params.key, res, [], "Apikey correct.");
});

app.get("/api/v1/:key/weapons/", (req, res) => {
  getPermission(req.params.key, res, weapons, "Succesful.");
});

app.get("/api/v1/:key/weapons/:code", (req, res) => {
  const query = req.params.code.toUpperCase();
  const weapon = weapons.data.find((c) => c.code === query);

  if (!weapon) {
    getPermission(req.params.key, res, [], "Weapon does not exist.", 404);
    return;
  }

  getPermission(req.params.key, res, weapons, "Successful.");
});

app.get("/api/v1/:key/modules", (req, res) => {
  getPermission(req.params.key, res, modules, "Successful.");
});

app.get("/api/v1/:key/modules/:type", (req, res) => {
  if (req.params.type === "optics") {
    getPermission(req.params.key, res, modules.data.optic, "Successful.");
    return;
  } else if (req.params.type === "barrels") {
    getPermission(req.params.key, res, modules.data.barrel, "Successful.");
    return;
  } else if (req.params.type === "underbarrels") {
    getPermission(req.params.key, res, modules.data.underbarrel, "Successful.");
    return;
  } else if (req.params.type === "accessory") {
    getPermission(req.params.key, res, modules.data.accessory, "Successful.");
    return;
  } else {
    getPermission(
      req.params.key,
      res,
      [],
      "Type of modules does not exist.",
      404
    );
    return;
  }
});

app.get("/api/v1/:key/modules/:type/:code", (req, res) => {
  if (req.params.type === "optics") {
    const module = modules.data.optic.find(
      (c) => c.code === req.params.code.toUpperCase()
    );
    if (!module) {
      getPermission(req.params.key, res, [], "Module does not exist.", 404);
      return;
    }
    getPermission(req.params.key, res, module, "Successful.");
    return;
  } else if (req.params.type === "barrels") {
    const module = modules.data.barrel.find((c) => c.code === req.params.code);
    if (!module) {
      getPermission(req.params.key, res, [], "Module does not exist.", 404);
      return;
    }
    getPermission(req.params.key, res, modules.data.barrel, "Successful.");
    return;
  } else if (req.params.type === "underbarrels") {
    const module = modules.data.underbarrel.find(
      (c) => c.code === req.params.code
    );
    if (!module) {
      getPermission(req.params.key, res, [], "Module does not exist.", 404);
      return;
    }
    getPermission(req.params.key, res, module, "Successful.");
    return;
  } else if (req.params.type === "accessory") {
    const module = modules.data.accessory.find(
      (c) => c.code === req.params.code.toUpperCase()
    );
    if (!module) {
      getPermission(req.params.key, res, [], "Module does not exist.");
    }
    getPermission(req.params.key, res, module, "Successful.");
    return;
  } else {
    getPermission(
      req.params.key,
      res,
      [],
      "Type of module does not exist.",
      404
    );
    return;
  }
});

app.get("/api/v1/:key/cosmetics", (req, res) => {
  getPermission(req.params.key, res, cosmetics, "Successful.");
  return;
});

app.get("/api/v1/:key/cosmetics/:type", (req, res) => {
  if (req.params.type === "skins") {
    getPermission(req.params.key, res, cosmetics.data.skins, "Successful.");
    return;
  } else if (req.params.type === "straps") {
    getPermission(req.params.key, res, cosmetics.data.straps, "Successful.");
    return;
  } else {
    getPermission(
      req.params.key,
      res,
      [],
      "Type of cosmetics does not exist.",
      404
    );
    return;
  }
});

app.get("/api/v1/:key/cosmetics/:type/:code", (req, res) => {
  if (req.params.type === "skins") {
    const cosmetic = cosmetics.data.skins.find(
      (c) => c.code === req.params.code
    );
    if (!cosmetic) {
      getPermission(req.params.key, res, [], "Cosmetic does not exist.", 404);
    }
    getPermission(req.params.key, res, cosmetic);
    return;
  } else if (req.params.type === "straps") {
    const cosmetic = cosmetics.data.straps.find(
      (c) => c.code === req.params.code
    );
    getPermission(req.params.key, res, cosmetic);
    return;
  } else {
    getPermission(
      req.params.key,
      res,
      "Incorrect type of cosmetics {skins | straps}.",
      404
    );
    return;
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`API server is running on port ${port}...`));
