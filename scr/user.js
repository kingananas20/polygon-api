const { createHash, randomBytes } = require("crypto");
const fs = require("fs");
require("dotenv").config();

const keys = JSON.parse(fs.readFileSync("data/keys.json"));

function hash(input) {
  return createHash("sha256").update(input).digest("hex");
}

function newUser(user, key) {
  if (!user) {
    return "User required.";
  }

  if (key) {
    json = {
      username: user,
      key: hash(key),
      limit: 1000,
    };
  } else {
    const randomKey = randomBytes(16).toString("hex");

    json = {
      username: user,
      key: hash(randomKey),
      limit: 1000,
    };
  }

  keys.push(json);
  fs.writeFileSync("data/keys.json", JSON.stringify(keys, null, 2));
  return key;
}

function changeKey(user, key) {
  if (!user) {
    return 0;
  }

  const savedUser = keys.find((c) => c.username === user);

  if (!savedUser) {
    newUser(user);
    return;
  }

  if (key) {
    savedUser.key = hash(key);
  } else {
    const randomKey = randomBytes(16).toString("hex");
    savedUser.key = hash(randomKey);
  }
  fs.writeFileSync("data/keys.json", JSON.stringify(keys, null, 2));
  return key;
}

function removeUser(user) {
  if (!user) {
    return 0;
  }

  const savedUser = keys.find((c) => c.username === user);

  if (!savedUser) {
    return 404;
  }

  keys.splice(savedUser, 1);
  fs.writeFileSync("data/keys.json", JSON.stringify(keys, null, 2));
  return 1;
}

function resetLimit(user, limit = 1000) {
  if (!user) {
    return 0;
  }

  const savedUser = keys.find((c) => c.username === user);

  if (!savedUser) {
    return 404;
  }

  savedUser.limit = limit;
  fs.writeFileSync("data/keys.json", JSON.stringify(keys, null, 2));
  return 1;
}
