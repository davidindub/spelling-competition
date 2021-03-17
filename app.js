const express = require('express')
const app = express();
const port = 3000;
const path = require('path');
const fs = require('fs');

app.use(express.static('public'))

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`)
});




let gameData = fs.readFileSync("gameData.json");
let todaysGameData = JSON.parse(gameData);


app.get("/get-game-data", function(req, res) {

  const randomNumber = Math.floor(Math.random() * todaysGameData.length);

  res.json(todaysGameData[randomNumber]);
})