// Game Data
const alphabet = [ ...'abcdefghijklmnopqrstuvwxyz' ];

//Page Elements
const elGuessBox = document.getElementById('guessBox');
const elInnerLetter = document.getElementById('innerLetter');
const elOuterLetters = document.getElementById('outerLetters');
const elErrorMessage = document.getElementById('submitFeedback');
const elWordsFound = document.getElementById('wordsFound');

//Game Constants
const MIN_WORD_LENGTH = 4;
const POINTS_FOR_MIN_WORD = 1;
const POINTS_FOR_PANGRAM = 7;

//Game state
let innerLetter;
let outerLetters;
let allLetters;
let possibleWords;
let wordsFound = [];
let runningScore = 0;


document.getElementById('form').onsubmit = function() {
	checkWord();
};

function populateLetters(innerLetter, outerLetters) {
	elInnerLetter.innerHTML = innerLetter;
	elOuterLetters.innerHTML = ',' + outerLetters;
}

/*Calculates and returns word score based on following rules
	Assumes Word is Valid
	Word is 4 letters: 1 point
	Word is greater than 4 letters: 1 point per letter 
	Word is a pangram: extra 7 points.

*/
function calculateValidWordScore(word) {
	if(word.length == MIN_WORD_LENGTH) {
		return POINTS_FOR_MIN_WORD;
	}
	let score = word.length; 
	if(checkIsPangram(word)) {
		score += POINTS_FOR_PANGRAM;
	}
	return score;
}

function updateWordsFound(word) {
	elWordsFound.innerHTML = wordsFound;
}

// Checks 4 letters or longer
function checkWordLength(word) {
	if (word.length >= MIN_WORD_LENGTH) {
	return true;
    } else return false;
}

// Checks if the guess contains the inner letter
function checkContainsInnerLetter(word) {
	if (word.includes(innerLetter)) {
		return true;
	} else return false;
}

// Checks there is no invalid letters
function checkOnlyValidLetters(word) {
	for (let char of word) {
		if (allLetters.indexOf(char) === -1) {
			return false;
		}
	}
	return true;
}

// Checks if word is a pangram
function checkIsPangram(word) {
	for (let char of allLetters) {
		if (word.indexOf(char) === -1) {
			return false;
		}
	}
	return true;
}

// Checks the Guess against rules
function checkGuessValid(word) {
    if (!checkWordLength(word)) {
    	console.log("Word is too short");
		return false;
    }
	if (!checkContainsInnerLetter(word)) {
		console.log("Missing center letter");
		return false;
	}
	if (!checkOnlyValidLetters) {
		console.log("Invalid letter included");
		return false;
	}
	if (possibleWords.indexOf(word) === -1) {
		console.log("Word not in list");
		return false;
	}
	if (wordsFound.indexOf(word) >= 0) {
		console.log("Word Already Found");
		return false;
	}
	return true;
}

function checkGuess(word) {
	if (checkGuessValid(word)) {
		wordsFound.push(word);
		console.log("Word added to array");
		updateWordsFound(word)
	}
}

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
