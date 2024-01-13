// Load words from an external file using Fetch API
async function loadWords() {
    try {
        const response = await fetch('words2.txt');
        const data = await response.text();
        const allWords = data.split('\n').filter(word => word.trim().length === 5);

        return allWords;
    } catch (error) {
        console.error('Error loading words:', error);
        return [];
    }
}


let words;
let targetWord;
let guessedWords = [];
let incorrectGuesses = 0;
let rows;

async function startGame() {
    words = await loadWords();
    if (words.length === 0) {
        alert("Error loading words. Please check the file.");
        return;
    }

    targetWord = getRandomWord();
    guessedWords = Array.from({ length: 6 }, () => Array(targetWord.length).fill('-'));
    incorrectGuesses = 0;

    // Create all rows at the beginning
    rows = Array.from({ length: 6 }, createRow);

    updateDisplay();
}

function createRow() {
    const rowDiv = document.createElement('div');
    rowDiv.className = "word-row";

    for (let i = 0; i < targetWord.length; i++) {
        const cellDiv = document.createElement('div');
        cellDiv.className = "word-cell";
        rowDiv.appendChild(cellDiv);
    }

    return rowDiv;
}

function getRandomWord() {
    const fiveLetterWords = words.filter(word => word.length === 5);

    if (fiveLetterWords.length === 0) {
        console.error('No 5-letter words found in the word list.');
        return ''; // Return an empty string or handle the error as needed
    }

    return fiveLetterWords[Math.floor(Math.random() * fiveLetterWords.length)];
}

function updateDisplay() {
    const wordGrid = document.getElementById("word-grid");

    // Clear the content of the wordGrid element
    wordGrid.innerHTML = '';

    // Append all rows to the wordGrid
    rows.forEach(row => wordGrid.appendChild(row));

    // Update the rows with guessed words
    guessedWords.forEach((guessedWord, index) => {
        const row = rows[index];
        const wordCells = row.querySelectorAll('.word-cell');
        guessedWord.forEach((letter, cellIndex) => {
            wordCells[cellIndex].textContent = letter;
        });
        row.classList.remove('initial'); // Remove the "initial" class
    });

    // Clear the input field after each attempt
    document.getElementById("guess-input").value = '';

    // Log correct word and incorrect guesses to the console
    console.log(`Correct word: ${targetWord}`);
    console.log(`Incorrect guesses: ${incorrectGuesses}`);
}

function showToast(message) {
    // Create a toast element
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);

    // Trigger a reflow to enable the transition
    toast.offsetHeight;

    // Add the "show" class to display the toast
    toast.classList.add('show');

    // Remove the toast after 3 seconds
    setTimeout(() => {
        // Remove the "show" class to hide the toast
        toast.classList.remove('show');

        // Remove the toast after the transition completes
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 3000);
}

function checkGuess() {
    const guessInput = document.getElementById("guess-input").value.toLowerCase();
    if (guessInput.length === 5 && /^[a-z]+$/.test(guessInput)) {
        if (incorrectGuesses < 6) {
            if (guessInput === targetWord) {
                showToast("Congratulations! You guessed the word!");
                startGame();
            } else {
                incorrectGuesses++;
                updateGuessedWord(guessInput);
                updateDisplay();
                if (incorrectGuesses >= 6) {
                    showToast(`Sorry, you've run out of attempts. The correct word was ${targetWord}.`);
                    startGame();
                }
            }
        }
    } else {
        alert("Please enter a valid 5-letter word.");
    }
}

function updateGuessedWord(guess) {
    const guessedWord = guess.split('');
    const rowIndex = guessedWords.length;

    if (rowIndex < rows.length) {
        // Update the existing row
        guessedWords[rowIndex] = guessedWord;
    } else {
        // If all rows are filled, remove the first row and add the new one
        guessedWords.shift();
        guessedWords.push(guessedWord);
    }
}

function handleKeyPress(event) {
    // Check if the Enter key is pressed
    if (event.key === 'Enter') {
        checkGuess();
    }
}

window.onload = startGame;
