// Game Data
const alphabet = [..."abcdefghijklmnopqrstuvwxyz"];




//Page Elements
const guessBox = document.getElementById("guessBox");
const elInnerLetter = document.getElementById("innerLetter");
const elOuterLetters = document.getElementById("outerLetters");
const elErrorMessage = document.getElementById("submitFeedback");
const testOutput = document.getElementById("testOutput");

let innerLetter;
let outerLetters;
let possibleWords;

document.getElementById("form").onsubmit = function() {checkWord()};


function populateLetters(innerLetter, outerLetters) {
    elInnerLetter.innerHTML = innerLetter;
    elOuterLetters.innerHTML = "," + outerLetters;
}

function checkWord() {
    if (guessBox.value.length < 4) {
        elErrorMessage.innerHTML = "Too Short";
    }
}    


let gameDataURL = "/gameData.json";
let request = new XMLHttpRequest();
request.open("GET", gameDataURL);
request.responseType = 'json';
request.send();



request.onload = function() {
    const gameData = request.response;
    console.log(gameData[0]);

    innerLetter = gameData[0].innerLetter;
    outerLetters = gameData[0].outerLetters;
    possibleWords = gameData[0].possibleWords;


    populateLetters(innerLetter, outerLetters);


  }