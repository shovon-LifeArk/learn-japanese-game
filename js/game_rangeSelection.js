function setGameRangeSelection() {
    const rangeFromEl = document.getElementById("range-from");
    const rangeToEl = document.getElementById("range-to");

    rangeFromEl.min = 1;
    rangeFromEl.max = itemCounter - totalQuestions + 1;

    rangeFromEl.min = totalQuestions;
    rangeFromEl.max = itemCounter;
}

function isValidRange_number() {
    const rangeFrom = parseInt(document.getElementById("range-from").value);
    const rangeTo = parseInt(document.getElementById("range-to").value);

    let min = 1;
    let max = itemCounter;

    let alertMsg = "";
    if (!rangeFrom || rangeFrom < min) {
        alertMsg += "・Enter valid 'from' value<br>";
    } else if (rangeFrom > max-totalQuestions+1) {
        alertMsg += `・Maximum 'from' value is ${max-totalQuestions+1}<br>`;
    }
    if (!rangeTo || rangeTo < totalQuestions) {
        alertMsg += "・Enter valid 'to' value<br>";
    } else if (rangeTo > max) {
        alertMsg += `・Maximum 'to' value is ${max}<br>`;
    }

    if (rangeFrom && rangeTo && rangeTo - rangeFrom < totalQuestions-1) {
        alertMsg += "・'to' value should be at least 9 bigger than 'from' value<br>";
    }

    if (alertMsg) {
        document.getElementById("range-alert").innerHTML = alertMsg;
        return false;
    }

    // set game data
    gameFromIndex = rangeFrom - 1;
    gameToIndex = rangeTo - 1;

    return true;
}

function startGame(params) {
    const {rangeType, rangeMapping} = params;
    if (rangeType === 'number' && isValidRange_number()) {
        replayGame();
        // clear range input alert
        document.getElementById("range-alert").innerHTML = "";
    }

    // for Kanji game where item number and actual game item numbers are different
    if (rangeType === 'mapped_number' && isValidRange_number()) {
        gameFromIndex = rangeMapping.from[gameFromIndex];
        gameToIndex = rangeMapping.to[gameToIndex];

        replayGame();
        // clear range input alert
        document.getElementById("range-alert").innerHTML = "";
    }
}