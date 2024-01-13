// Load words from an external file using Fetch API
async function loadWords() {
    try {
        const response = await fetch('words.txt');
        const data = await response.text();
        const allWords = data.split('\n').filter(word => word.trim() !== '');

        // Filter for 5-letter words
        const fiveLetterWords = allWords.filter(word => word.length === 5);

        return fiveLetterWords;
    } catch (error) {
        console.error('Error loading words:', error);
        return [];
    }
}

let words;
let targetWord;
let guessedWord;
let incorrectGuesses = 0;

async function startGame() {
    words = await loadWords();
    if (words.length === 0) {
        alert("Error loading words. Please check the file.");
        return;
    }

    targetWord = getRandomWord();
    guessedWord = Array(targetWord.length).fill('-');
    incorrectGuesses = 0;
    updateDisplay();
}

function getRandomWord() {
    return words[Math.floor(Math.random() * words.length)];
}

function updateDisplay() {
    const wordGrid = document.getElementById("word-grid");

    const rowDiv = document.createElement('div');
    rowDiv.className = "word-row";

    guessedWord.forEach(letter => {
        const cellDiv = document.createElement('div');
        cellDiv.className = "word-cell";
        cellDiv.textContent = letter;
        rowDiv.appendChild(cellDiv);
    });

    wordGrid.appendChild(rowDiv);

    // Clear the input field after each attempt
    document.getElementById("guess-input").value = '';

    // Log incorrect guesses to the console
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
    guessedWord = guess.split('');
}

function handleKeyPress(event) {
    // Check if the Enter key is pressed
    if (event.key === 'Enter') {
        checkGuess();
    }
}

window.onload = startGame;
