//Import the required packages
const schedule = require("node-schedule");
const fs = require("fs");
require("dotenv").config();

//Get the keys.json file
const keys = JSON.parse(fs.readFileSync("data/keys.json"));

//Function that resets the daily limit for every user/key
function resetLimit() {
  for (i = 0; i < keys.length; i++) {
    keys[i].limit = 1000;
  }
  fs.writeFileSync("data/keys.json", JSON.stringify(keys, null, 2));
}

//Call the funtion resetLimit() at specified interval or time
//Always at 12pm => 0 12 * * *
//Every 10 seconds => */10 * * * * * (For test usage)
schedule.scheduleJob("0 12 * * *", function () {
  resetLimit();
});
