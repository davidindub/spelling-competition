// Game Data
const alphabet = [ ...'abcdefghijklmnopqrstuvwxyz' ];

//Page Elements
const elGuessBox = document.getElementById('guessBox');
const elInnerLetter = document.getElementById('innerLetter');
const elOuterLetters = document.getElementById('outerLetters');
const elErrorMessage = document.getElementById('submitFeedback');
const elWordsFound = document.getElementById('wordsFound');

let innerLetter;
let outerLetters;
let allLetters;
let possibleWords;
let wordsFound = [];

document.getElementById('form').onsubmit = function() {
	checkWord();
};

function populateLetters(innerLetter, outerLetters) {
	elInnerLetter.innerHTML = innerLetter;
	elOuterLetters.innerHTML = ',' + outerLetters;
}

// Checks the guess is 4 letters or longer
function checkWordLength() {
	if (elGuessBox.value.length < 4) {
	return false;
    } else return true;
}

// Checks if a guess contains every possible letter
function checkIsPangram(word) {
	for (let char of outerLetters) {
		if (word.indexOf(char) === -1) {
			return false;
		}
	}
	return true;
}

// Checks if the guess contains the inner letter
function checkContainsInnerLetter(word) {
	if (word.includes(innerLetter)) {
		return true;
	} else return false;
}

// Checks there is no invalid letters
function checkForInvalidLetters(word) {
	for (let char of word) {
		if (allLetters.indexOf(char) === -1) {
			return false;
		}
	}
	return true;
}

// WORK ON THIS NEXT *******************
// // Checks the Guess against rules
// function checkGuess(word) {
//     if (checkWordLength(word)) {
//     console.log("Word too Short");
//     }
//     else console.log("Word is over 4 chars");
// }

let gameDataURL = '/gameData.json';
let request = new XMLHttpRequest();
request.open('GET', gameDataURL);
request.responseType = 'json';
request.send();

request.onload = function() {
	const gameData = request.response;
	console.log(gameData[0]);

	innerLetter = gameData[0].innerLetter;
	outerLetters = gameData[0].outerLetters;
	possibleWords = gameData[0].possibleWords;
    allLetters = [...innerLetter, ...outerLetters];

	populateLetters(innerLetter, outerLetters);
};
