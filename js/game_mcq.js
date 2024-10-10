
// total questions in a game
const totalQuestions = 10;  

// Store data for game (in suitable format)
/*
Format:
{
    0: {"question": {"text": "text ...", "imageUrl": "image link ...", "caption": "..."}, "answer": "answer here ..."},
    1: {"question": {"text": "text ...", "imageUrl": "image link ...", "caption": "..."}, "answer": "answer here ...",},
    2: {"question": {"text": "text ...", "imageUrl": "image link ...", "caption": "..."}, "answer": "answer here ...",}
}
*/
let gameData = {};

// questions should be chosen from this number in gameData
let gameFromIndex = null;

// questions should be chosen upto this number in gameData
let gameToIndex = null;

// hold index of gameData (chosen randomly from gameItemIDs)
let gameQuestionItemIDs = null;

// store possible answers for game questions
let gameQuestionOptions = null;

// item for current question in game
let currentGameItem = {};

// current question changes from 0 to 9
let currentQuestionNum = 0;

// number of correct answers
let score = 0;


function resetGameQuestionItemIDs() {
    let gameItemIDs = [];

    // select game item indexes in Range
    Object.keys(gameData).forEach(key => {
        if (parseInt(key) >= gameFromIndex && parseInt(key) <= gameToIndex) {
            gameItemIDs.push(key);
        }
    });

    // Shuffle array
    const shuffled = gameItemIDs.sort(() => 0.5 - Math.random());
    // choose first n elemets
    gameQuestionItemIDs = shuffled.slice(0, totalQuestions);
}


function resetGameQuestionOptions() {
    gameQuestionOptions = {};

    // create a number array of all game item ids
    const numbers = Object.keys(gameData);

    gameQuestionItemIDs.forEach(gameItemId => {
        let options = new Set();

        // Add the current question number to options
        options.add(gameItemId);

        // choose random game item ids
        while (options.size < 4) {
            const randomNum = numbers[Math.floor(Math.random() * numbers.length)];
            options.add(randomNum);
        }

        // Convert Set to Array and shuffle it
        const optionsShuffled = Array.from(options).sort(() => Math.random() - 0.5);

        // store the options vsalues by question item id
        gameQuestionOptions[gameItemId] = optionsShuffled.map(optionItemId => gameData[optionItemId].answer);
    });

}


function nextQuestion() {
    if (currentQuestionNum === totalQuestions) {
        endGame();
        return;
    }

    // Display question number
    document.getElementById('question-number').textContent = `${currentQuestionNum + 1}/${totalQuestions}`;

    // Load current question and options
    const currentQuestionItemID = gameQuestionItemIDs[currentQuestionNum];
    currentGameItem = gameData[currentQuestionItemID];

    // get current question data object
    const question = currentGameItem.question;

    // Update question image and caption
    if (question.text) {
        questionTextEl.textContent = question.text;
    }
    if (question.imageUrl) {
        questionImgEl.innerHTML = `<img src="${question.imageUrl}" alt="?" >`;
    }
    if (question.caption) {
        questionCaptionEl.textContent = question.caption;
    }

    // Get random options
    const options = gameQuestionOptions[currentQuestionItemID];

    // Update options in the DOM
    options.forEach((optionText, index) => {
        optionsEl[index].textContent = optionText;
        optionsEl[index].classList.remove('correct', 'wrong'); // Reset styles
        optionsEl[index].style.pointerEvents = 'auto'; // Enable click
    });

    // Disable the Next button
    nextBtn.disabled = true;

    currentQuestionNum++;
}


function checkAnswer(selectedIndex) {
    // Disable all options after selection
    for (let i = 0; i < optionsEl.length; i++) {
        optionsEl[i].style.pointerEvents = 'none'; // Disable further clicks
    }

    let selectedOption = optionsEl[selectedIndex];
    let selectedAnswer = selectedOption.textContent;

    if (selectedAnswer === currentGameItem.answer) {
        // Correct answer
        selectedOption.classList.add('correct');
        score++;
    } else {
        // Wrong answer
        selectedOption.classList.add('wrong');

        // Find and highlight the correct option
        for (let i = 0; i < optionsEl.length; i++) {
            if (optionsEl[i].textContent === currentGameItem.answer) {
                optionsEl[i].classList.add('correct');
                break;
            }
        }
    }

    // Enable the Next button
    nextBtn.disabled = false;
}


// after answering last question, display the result
function endGame() {
    // Display the score
    const scoreEl = document.getElementById('score');
    scoreEl.textContent = `Your score: ${score}/${totalQuestions}`;

    showPage('result');
}


// after answering last question, start the game again within same range
function replayGame() {
    // Reset game state
    currentQuestionNum = 0;
    score = 0;
    resetGameQuestionItemIDs();
    resetGameQuestionOptions();

    showPage('question');

    // Start the game
    nextQuestion();
}


// Initialize the game elements
const questionTextEl = document.getElementById('question-text');
const questionImgEl = document.getElementById('question-img');
const questionCaptionEl = document.getElementById('question-caption');
const optionsEl = document.querySelectorAll('.option');
const nextBtn = document.getElementById('next-button');
