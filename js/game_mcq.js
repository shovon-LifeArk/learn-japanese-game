
// total questions in a game
const totalQuestions = 10;

// default game type
let gameType = 'mcq'

// Store data for game (in suitable format)
/*
Format:
{
    0: {"question": {"text": "text ...", "imageUrl": "image link ...", "soundUrl": "audio link ...", "caption": "..."}, "answer": "answer here ..."},
    1: {"question": {"text": "text ...", "imageUrl": "image link ...", "soundUrl": "audio link ...", "caption": "..."}, "answer": "answer here ...",},
    2: {"question": {"text": "text ...", "imageUrl": "image link ...", "soundUrl": "audio link ...", "caption": "..."}, "answer": "answer here ...",}
}
*/
let gameData = {};

// for log purpose
let gameLessonType = null;

// questions should be chosen from this number in gameData
let gameFromIndex = null;

// questions should be chosen upto this number in gameData
let gameToIndex = null;

// store category values for differnt types (ramge type will be checkboxes)
let gameRangeCheckedCategories = null;

// used when submitting report
let gameRangeText = 'All';

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

// game start time and end time (store milliseconds)
let gameStartTime, gameEndTime;

function gameTimer(action) {
    if (action === 'start') {
        gameStartTime = Date.now(); // Record the start time
        gameEndTime = null;
    } else if (action === 'stop') {
        if (!gameStartTime) {
            console.log("Timer hasn't started yet.");
            return;
        }
        gameEndTime = Date.now(); // Record the stop time
    } else {
        console.log("Invalid action. Use 'start' or 'stop'.");
    }
}

function showQuestionHolder() {
    const questionHolder = document.getElementById('question-holder');
    // hide all question holders
    Array.from(questionHolder.children).forEach(child => {
        child.style.display = 'none';
    });
    // display specific page
    document.getElementById(`${gameType}-question`).style.display = 'flex';
}

function resetGameQuestionItemIDs() {
    let gameItemIDs = [];

    // select game item indexes in Range
    if (gameFromIndex !== null && gameToIndex !== null) {
        // filter all question ids within range
        Object.keys(gameData).forEach(index => {
            if (parseInt(index) >= gameFromIndex && parseInt(index) <= gameToIndex) {
                gameItemIDs.push(index);
            }
        });
    }
    else if (gameRangeCheckedCategories !== null) {
        // filter all question ids by categories
        Object.keys(gameData).forEach(index => {
            if (gameRangeCheckedCategories.includes(gameData[index].category)) {
                gameItemIDs.push(index);
            }
        });
    }

    // Shuffle array
    const shuffled = gameItemIDs.sort(() => 0.5 - Math.random());
    // choose first n elemets
    gameQuestionItemIDs = shuffled.slice(0, totalQuestions);
}

// for MCQ
function resetGameQuestionOptions() {
    gameQuestionOptions = {};

    // create a number array of all game item ids
    const numbers = Object.keys(gameData);

    gameQuestionItemIDs.forEach(gameItemId => {
        if ("options" in gameData[gameItemId]) {
            // shuffle the options values and store by question item id
            gameQuestionOptions[gameItemId] = gameData[gameItemId].options.sort(() => Math.random() - 0.5);
        } else {
            let options = new Set();

            // Add the current answer to options
            options.add(gameData[gameItemId].answer);

            // choose random game item ids
            while (options.size < 4) {
                const randomNum = numbers[Math.floor(Math.random() * numbers.length)];
                options.add(gameData[randomNum].answer);
            }

            // Convert Set to Array and shuffle it
            let optionsShuffled = Array.from(options).sort(() => Math.random() - 0.5);
            // store the options values by question item id
            gameQuestionOptions[gameItemId] = optionsShuffled;
        }
    });
}

// for rearrange: START

// for rearrange: End

function nextQuestion() {
    if (currentQuestionNum === 0) {
        gameTimer('start');
    }
    if (currentQuestionNum === totalQuestions) {
        gameTimer('stop');
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

    // Update question text, image, sound and caption
    if (gameType === 'mcq') {
        if (question.text) {
            questionTextEl.innerHTML = question.text;
        }
        if (question.imageUrl) {
            questionImgEl.innerHTML = `<img src="${question.imageUrl}" alt="?" >`;
        }
        if (question.soundUrl) {
            const soundButton = document.createElement("button");
            soundButton.classList.add('sound-button');
            soundButton.textContent = "🔊";
            soundButton.addEventListener('click', () => {
                const soundFile = question.soundUrl;
                playSound(soundFile);
            });
            questionSoundEl.innerHTML = '';
            questionSoundEl.appendChild(soundButton);
    
            setTimeout(() => {
                soundButton.click();
            }, 600);
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
    }
    else if (gameType === 'rearrange') {
        rearrangeQuestionEl.innerHTML = "";

        const shuffledWords = shuffle(question.words.slice());
        shuffledWords.forEach((word, index) => {
            const wordElement = document.createElement("div");
            wordElement.className = "rearrange-word";
            
            const textElement = document.createElement("span");
            textElement.className = "text";
            textElement.textContent = word;

            const selectElement = document.createElement('select');
            selectElement.className = "select-box";
            for (let i = 0; i <= shuffledWords.length; i++) {
                const option = document.createElement('option');
                option.value = i;    // Set option value
                option.text = `${i === 0 ? '' : i}`; // Set the display text
                
                selectElement.appendChild(option);
              }

            wordElement.appendChild(textElement);
            wordElement.appendChild(selectElement);
            rearrangeQuestionEl.appendChild(wordElement);
        });

        rearrangeAnswerEl.innerText = "";
        rearrangeSubmitBtn.disabled = false;
    }

    // Disable the Next button
    nextBtn.disabled = true;

    currentQuestionNum++;
}

// mcq
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

// rearrange
function checkRearrangeAnswer() {
    const correctAnswer = currentGameItem.answer.split(" ").reduce((acc, word, i) => {
        acc[i+1] = word;
        return acc;
    }, {});
    console.log("correctAnswer", correctAnswer);

    let isCorrect = true;

    const wordsEl = document.querySelectorAll('.rearrange-word');
    wordsEl.forEach(wordEl => {
        const word = wordEl.querySelector('.text').textContent;
        const selectBox = wordEl.querySelector('.select-box');
        const order = selectBox.value;

        if (correctAnswer[order] === word) {
            wordEl.classList.add('correct-rearrange');
        } else {
            wordEl.classList.add('wrong-rearrange');
            isCorrect = false;
        }

        selectBox.disabled = true;
    });

    if (isCorrect) {
        score++;
    }
    rearrangeAnswerEl.textContent = currentGameItem.answer;

    // Disable the rearrange submit button
    rearrangeSubmitBtn.disabled = true;
    // Enable the Next button
    nextBtn.disabled = false;
}

function resetScoreSubmitForm() {
    // enable score submit button
    const scoreSubmitButton = document.getElementById('score-submit-button');
    scoreSubmitButton.disabled = false;
    // hide score submission message (if shown)
    const scoreSubmitResponseEl = document.getElementById('score-submit-response');
    scoreSubmitResponseEl.style.display = 'none';
    scoreSubmitResponseEl.innerHTML = "";
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
    resetScoreSubmitForm();

    showPage('question');
    showQuestionHolder();

    // Start the game
    nextQuestion();
}


// Initialize the game elements
// mcq question elements
const questionTextEl = document.getElementById('question-text');
const questionImgEl = document.getElementById('question-img');
const questionSoundEl = document.getElementById('question-sound');
const questionCaptionEl = document.getElementById('question-caption');
const optionsEl = document.querySelectorAll('.option');

// rearrange type question elements
const rearrangeQuestionEl = document.getElementById('rearrange-sentence');
const rearrangeAnswerEl = document.getElementById('rearrange-answer');
const rearrangeSubmitBtn = document.getElementById('rearrange-submit-btn');

const nextBtn = document.getElementById('next-button');
