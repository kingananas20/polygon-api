const schedule = require("node-schedule");
const fs = require("fs");

const keys = JSON.parse(fs.writeFileSync("data/keys.json"));

function resetLimit() {
  for (i = 0; i < keys.length; i++) {
    keys[i].limit = 1000;
    fs.writeFileSync("data/keys.json", JSON.stringify(keys, null, 2));
  }
}

schedule.scheduleJob("*/5 * * * * *", function () {
  resetLimit();
});
