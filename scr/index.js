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

function code(code) {
  if (code === 200) {
    return 1;
  } else {
    return 0;
  }
}

function getPermission(key, res, payload, message, status = 200) {
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
      .status(420);
    return;
  } else {
    permissionGranted.limit = permissionGranted.limit - 1;
    fs.writeFileSync("data/keys.json", JSON.stringify(keys, null, 2));

    res
      .send({
        data: payload,
        message: message,
        success: code(status),
      })
      .status(status);
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
  const weapon = weapons.find((c) => c.code === req.params.code.toUpperCase());

  if (!weapon) {
    getPermission(req.params.key, res, [], "Weapon does not exist.", 404);
    return;
  }

  getPermission(req.params.key, res, weapon, "Successful.");
});

app.get("/api/v1/:key/modules", (req, res) => {
  getPermission(req.params.key, res, modules, "Successful.");
});

app.get("/api/v1/:key/modules/:type", (req, res) => {
  if (req.params.type === "optics") {
    getPermission(req.params.key, res, modules.optic, "Successful.");
    return;
  } else if (req.params.type === "barrels") {
    getPermission(req.params.key, res, modules.barrel, "Successful.");
    return;
  } else if (req.params.type === "underbarrels") {
    getPermission(req.params.key, res, modules.underbarrel, "Successful.");
    return;
  } else if (req.params.type === "accessory") {
    getPermission(req.params.key, res, modules.accessory, "Successful.");
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
    const module = modules.optic.find(
      (c) => c.code === req.params.code.toUpperCase()
    );

    if (!module) {
      getPermission(req.params.key, res, [], "Module does not exist.", 404);
      return;
    }

    getPermission(req.params.key, res, module, "Successful.");
    return;
  } else if (req.params.type === "barrels") {
    const module = modules.barrel.find((c) => c.code === req.params.code);

    if (!module) {
      getPermission(req.params.key, res, [], "Module does not exist.", 404);
      return;
    }

    getPermission(req.params.key, res, module, "Successful.");
    return;
  } else if (req.params.type === "underbarrels") {
    const module = modules.underbarrel.find((c) => c.code === req.params.code);

    if (!module) {
      getPermission(req.params.key, res, [], "Module does not exist.", 404);
      return;
    }

    getPermission(req.params.key, res, module, "Successful.");
    return;
  } else if (req.params.type === "accessory") {
    const module = modules.accessory.find(
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
    getPermission(req.params.key, res, cosmetics.skins, "Successful.");
    return;
  } else if (req.params.type === "straps") {
    getPermission(req.params.key, res, cosmetics.straps, "Successful.");
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
    const cosmetic = cosmetics.skins.find((c) => c.code === req.params.code);

    if (!cosmetic) {
      getPermission(req.params.key, res, [], "Cosmetic does not exist.", 404);
    }

    getPermission(req.params.key, res, cosmetic, "Successful.");
    return;
  } else if (req.params.type === "straps") {
    const cosmetic = cosmetics.straps.find((c) => c.code === req.params.code);

    if (!cosmetic) {
      getPermission(req.params.key, res, [], "Cosmetic does not exist.", 404);
    }

    getPermission(req.params.key, res, cosmetic, "Successful.");
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

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`API server is running on port ${port}...`));
