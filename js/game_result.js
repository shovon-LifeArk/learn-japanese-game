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
    const examRange = `${gameFromIndex+1} - ${gameToIndex+1}`;
    const examMarks = `${score}/${totalQuestions}`;
    const examTime = msToTime(gameEndTime - gameStartTime);

    const data = {
        userId,
        lessonType,
        examRange,
        examMarks,
        examTime,
    };

    console.log("data", JSON.stringify(data));

    fetch('https://script.google.com/macros/s/AKfycbwhB5orSG7OnzBSvEvgWlkL5qfBwoeQmjC64-OhFgeS0tcaCDWA4Z_qS9aL7VDK7idQ/exec', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(result => {
        if (result.status === 200) {
            const scoreSubmitButton = document.getElementById('score-submit-button');
            scoreSubmitButton.disabled = true;
        }
        showResponseMsg(result.message);
    })
    .catch(error => {
        showResponseMsg(error.message);
    });

    


}