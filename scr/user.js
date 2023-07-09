const { createHash, randomBytes } = require("crypto");
const fs = require("fs");
require("dotenv").config();

const keys = JSON.parse(fs.readFileSync("data/keys.json"));

function hash(input) {
  return createHash("sha256").update(input).digest("hex");
}

function newUser(user) {
  if (!user) {
    return "User required.";
  }
  const key = randomBytes(16).toString("hex");

  json = {
    username: user,
    key: hash(key),
    limit: 1000,
  };

  keys.push(json);
  fs.writeFileSync("data/keys.json", JSON.stringify(keys, null, 2));
  return key;
}

function changeKey(user) {
  if (!user) {
    return 0;
  }

  const savedUser = keys.find((c) => c.username === user);

  if (!savedUser) {
    newUser(user);
    return;
  }

  const key = randomBytes(16).toString("hex");
  savedUser.key = hash(key);
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

function resetLimit(user) {
  if (!user) {
    return 0;
  }

  const savedUser = keys.find((c) => c.username === user);

  if (!savedUser) {
    return 404;
  }

  savedUser.limit = 1000;
  fs.writeFileSync("data/keys.json", JSON.stringify(keys, null, 2));
  return 1;
}

console.log(newUser("jonas"));
setTimeout(() => {
  console.log(newUser("nella"));
}, 5000);
setTimeout(() => {
  console.log(changeKey("nella"));
}, 10000);
setTimeout(() => {
  console.log(resetLimit("jonas"));
}, 15000);
setTimeout(() => {
  console.log(removeUser("jonas"));
}, 20000);
setTimeout(() => {
  console.log(removeUser("nella"));
}, 25000);
