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
let guessedWord = [];
let incorrectGuesses = 0;

async function startGame() {
    words = await loadWords();
    if (words.length === 0) {
        alert("Error loading words. Please check the file.");
        return;
    }

    targetWord = getRandomWord();
    guessedWord = Array.from({ length: 5 }, () => '-');
    incorrectGuesses = 0;
    updateDisplay();
}

function getRandomWord() {
    return words[Math.floor(Math.random() * words.length)];
}

function updateDisplay() {
    const wordGrid = document.getElementById("word-grid");
    wordGrid.innerHTML = '';

    guessedWord.forEach(letter => {
        const letterDiv = document.createElement('div');
        letterDiv.textContent = letter;
        wordGrid.appendChild(letterDiv);
    });

    document.getElementById("feedback").textContent = `Incorrect guesses: ${incorrectGuesses}`;
}

function checkGuess() {
    const guessInput = document.getElementById("guess-input").value.toLowerCase();
    if (guessInput.length === 5 && /^[a-z]+$/.test(guessInput)) {
        if (guessInput === targetWord) {
            alert("Congratulations! You guessed the word!");
            startGame();
        } else {
            incorrectGuesses++;
            guessedWord = guessInput.split('');
            updateDisplay();
            if (incorrectGuesses >= 6) {
                alert(`Sorry, you've run out of attempts. The correct word was ${targetWord}.`);
                startGame();
            }
        }
    } else {
        alert("Please enter a valid 5-letter word.");
    }
}

window.onload = startGame;
