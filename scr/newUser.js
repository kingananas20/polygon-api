const { createHash, randomBytes } = require("crypto");
const fs = require("fs");

const keys = JSON.parse(fs.readFileSync("data/keys.json"));

function hash(input) {
  return createHash("sha256").update(input).digest("hex");
}

function newUser() {
  key = randomBytes(16).toString("hex");
  console.log(key);

  json = {
    key: hash(key),
    limit: 1000,
  };

  keys.push(json);
  fs.writeFileSync("data/keys.json", JSON.stringify(keys, null, 2));
}

newUser();
