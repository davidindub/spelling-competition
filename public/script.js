// Game Data
const alphabet = [ ...'abcdefghijklmnopqrstuvwxyz' ];

const date = new Date();
const currentYear = date.getFullYear();

//Page Elements
const elGuessBox = document.getElementById('guessBox');
const elErrorMessage = document.getElementById('submitFeedback');
const elSubmitButton = document.getElementById('submitButton');
const elResetButton = document.getElementById('resetButton');
const elScorebar = document.getElementById('scoreBar');
const elScorebarLabel = document.getElementById('scoreBarLabel');
const elWordsFound = document.getElementById('wordsFound');
const elPangramsFound = document.getElementById('pangramsFound');
const elWordsFoundPlaceholder = document.getElementById('wordsFoundPlaceholder');

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
let firstWordAdded = false;
let maxGameScore = 0;

let gameDataURL = '/get-game-data';
let request = new XMLHttpRequest();
request.open('GET', gameDataURL);
request.responseType = 'json';
request.send();

request.onload = function() {
	const gameData = request.response;

	innerLetter = gameData.innerLetter;
	outerLetters = gameData.outerLetters;
	possibleWords = gameData.possibleWords;
    allLetters = [...innerLetter, ...outerLetters];

	prepareInteractionListeners();

	populateLetters(allLetters);
	calculateMaxScore();
};

/* View/Interaction setup */

function prepareInteractionListeners() {
	elSubmitButton.addEventListener("click", function(event) {
		event.preventDefault();
		checkWord();
	})
	elResetButton.addEventListener("click", function(event) {
		event.preventDefault();
		clearErrorMessage();
		elGuessBox.value = "";
	})
	elGuessBox.addEventListener("input" , function(event) {
		event.preventDefault();
		clearErrorMessage();
	})

}

function populateLetters(allLetters) {
	allLetters.forEach(element => createLetterShape(element))
}

function createLetterShape(letter) {
	let div = document.createElement("div");
	div.classList.add("col");
	div.classList.add("letterBox");
	div.addEventListener("click", event => {
		clearErrorMessage();
		elGuessBox.value += letter.toUpperCase();
	})
	div.innerHTML = letter;
	document.getElementById("letterList").appendChild(div);
}

/* Game Interaction and View Logic */

function checkWord() {
	let word = elGuessBox.value.toLowerCase();
	let isGuessValid = checkGuessValid(word);
	
	if(!isGuessValid) {
		return;
	}
	
	console.log("adding word: " + word);
	wordsFound.push(word);
	
	runningScore += calculateValidWordScore(word);
	updateScore();
	
	updateWordsFound(word);
	
	elGuessBox.value = '';

}
exports.checkWordLength = checkWordLength;

function displayErrorMessage(error) {
	elErrorMessage.innerHTML = error;
}

function clearErrorMessage() {
	elErrorMessage.innerHTML = "";
}

function updateScore() {
	let scoreAsPercentageOfTotal = Math.round((runningScore/maxGameScore) * 100);

	elScorebar.style = "width: " + scoreAsPercentageOfTotal +"%";
	elScorebar.setAttribute("aria-valuenow",  scoreAsPercentageOfTotal);
	elScorebarLabel.innerHTML=runningScore + " / " + maxGameScore;

}

function updateWordsFound(word) {

	if(!firstWordAdded) {
		wordsFoundPlaceholder.className = "d-none";	
		firstWordAdded = true;
	}

	if(checkIsPangram(word)){
		elPangramsFound.innerHTML += ` ${word}`;
	}

	else {
		elWordsFound.innerHTML = word + " " + elWordsFound.innerHTML;
	}
}


/* Game Rules Logic */

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
    	displayErrorMessage("Word is too short");
		return false;
    }
	if (!checkContainsInnerLetter(word)) {
		displayErrorMessage("Missing required letter");
		return false;
	}
	if (!checkOnlyValidLetters) {
		displayErrorMessage("Invalid letter included");
		return false;
	}
	if (possibleWords.indexOf(word) === -1) {
		displayErrorMessage("Word not in list");
		return false;
	}
	if (wordsFound.indexOf(word) >= 0) {
		displayErrorMessage("Word Already Found");
		return false;
	}
	displayErrorMessage("");
	return true;
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


function calculateMaxScore() {
	for(let word of possibleWords) {
		maxGameScore += calculateValidWordScore(word);
	}
	console.log("calculated max score as " + maxGameScore);
}