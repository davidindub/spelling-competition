const express = require('express')
const app = express();
const path = require('path');

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}


app.use(express.static('public'))

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`)
});

app.get("/get-game-data", function(req, res) {

  

  let todaysGameData = {
    innerLetter: "o",
    outerLetters: ["c", "m", "l", "k", "h", "e"],
    possibleWords: ["cello", "chemo", "chock", "choke", "cloche", "clock", "cock", "cockle", "coho", "coke", "come", "cook", "cool", "echo", "hellhole", "hello", "hemlock", "hock", "hoke", "hole", "home", "hooch", "hook", "kohl", "kook", "loch", "lock", "loco", "loll", "look", "loom", "memo", "mock", "mohel", "mole", "moll", "mooch", "oleo"],
    pangram: "hemlock"
    };

  res.json(todaysGameData);
})