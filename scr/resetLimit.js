const schedule = require("node-schedule");
const fs = require("fs");
require("dotenv").config();

const keys = JSON.parse(fs.readFileSync("data/keys.json"));

function resetLimit() {
  for (i = 0; i < keys.length; i++) {
    const limitNumber = process.env.LIMIT || 1000;
    const limit = keys[i];
    limit.limit = limitNumber;
    fs.writeFileSync("data/keys.json", JSON.stringify(keys, null, 2));
  }
}

schedule.scheduleJob("0 12 * * *", function () {
  resetLimit();
});
