function msToTime(duration) {
    // Calculate hours, minutes, and seconds
    let seconds = Math.floor((duration / 1000) % 60);
    let minutes = Math.floor((duration / (1000 * 60)) % 60);
    let hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

    // Add leading zeros to single digits if necessary
    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;

    return hours + ":" + minutes + ":" + seconds;
}

function showResponseMsg(message) {
    const resEl = document.getElementById('score-submit-response');
    resEl.innerHTML = message;
    resEl.style.display = 'block';
}

function submitScore() {
    const userId = document.getElementById('player_userID').value;
    const lessonType = gameLessonType;
    const examRange = gameRangeText;
    const examMarks = `${score}/${totalQuestions}`;
    const examTime = msToTime(gameEndTime - gameStartTime);

    const data = {
        userId,
        lessonType,
        examRange,
        examMarks,
        examTime,
    };

    const scoreSubmitButton = document.getElementById('score-submit-button');
    scoreSubmitButton.disabled = true;

    fetch('https://script.google.com/macros/s/AKfycbwhHlkdqB82c_1GqakpnMNHNT6j4gwshC8rX3_HmV14jeyTN2KFOmKYJYIsGq1kg6RtNA/exec', {
        method: 'POST',
        headers: {
            'Content-Type': 'text/plain',
        },
        body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(result => {
        if (result.status !== 200) {
            scoreSubmitButton.disabled = false;
        }
        showResponseMsg(result.message);
    })
    .catch(error => {
        scoreSubmitButton.disabled = false;
        showResponseMsg(error.message);
    });

}