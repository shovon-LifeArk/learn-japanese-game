// control range if the range does not start from 1
let global_rangeOffset = 0;

function setGameRangeSelection() {
    const rangeFromEl = document.getElementById("range-from");
    const rangeToEl = document.getElementById("range-to");

    rangeFromEl.min = global_rangeOffset + 1;
    rangeFromEl.max = global_rangeOffset + itemCounter - totalQuestions + 1;

    rangeToEl.min = global_rangeOffset + totalQuestions;
    rangeToEl.max = global_rangeOffset + itemCounter;
}

function isValidRange_number() {
    const rangeFrom = parseInt(document.getElementById("range-from").value);
    const rangeTo = parseInt(document.getElementById("range-to").value);

    let min = global_rangeOffset + 1;
    let max = global_rangeOffset + itemCounter;

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
        alertMsg += `・'to' value should be at least ${totalQuestions-1} bigger than 'from' value<br>`;
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
        // set report submission data
        gameRangeText = `${gameFromIndex+1} - ${gameToIndex+1}`;

        replayGame();
        // clear range input alert
        document.getElementById("range-alert").innerHTML = "";
    }

    // for Kanji game where item number and actual game item numbers are different
    else if (rangeType === 'mapped_number' && isValidRange_number()) {
        // set report submission data
        gameRangeText = `${gameFromIndex+1} - ${gameToIndex+1}`;

        // map index from itemData to gameData
        gameFromIndex = rangeMapping.from[gameFromIndex];
        gameToIndex = rangeMapping.to[gameToIndex];

        replayGame();
        // clear range input alert
        document.getElementById("range-alert").innerHTML = "";
    }

    // for radio button
    else if (rangeType === 'radiobutton') {
        const rangeFrom = 1;
        const rangeTo = parseInt(document.querySelector('input[name="game_range"]:checked').value);

        // set report submission data
        gameRangeText = `${rangeFrom} - ${rangeTo}`;

        // set game data
        gameFromIndex = rangeFrom - 1;
        gameToIndex = rangeTo - 1;

        replayGame();
    }

    // when range is selected by categories only
    else if (rangeType === 'checkbox') {
        const individualCheckboxes = document.querySelectorAll('input[name="game_range"]');
        gameRangeCheckedCategories = [...individualCheckboxes]
            .filter(checkbox => checkbox.checked)
            .map(checkbox => checkbox.value);

        // prepare reporting data
        const allCheckboxButton = document.getElementById('range_all');
        if (allCheckboxButton.checked) {
            gameRangeText = 'All'
        } else {
            gameRangeText = gameRangeCheckedCategories.toString();
        }
        
        replayGame();
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const rangeSelectionCheckbox = document.getElementById('range_selection-checkbox');

    if (rangeSelectionCheckbox) {
        // game range selection functionality
        const allCheckboxButton = document.getElementById('range_all');
        const individualCheckboxes = document.querySelectorAll('input[name="game_range"]');
        const rangeConfirmButton = document.getElementById('range_confirm-button');

        function updateRangeConfirmButtonState() {
            let hasChecked = false;
            individualCheckboxes.forEach(checkbox => {
                if (!hasChecked & checkbox.checked) hasChecked = true;
            });

            if (hasChecked) {
                rangeConfirmButton.classList.remove('disabled');
                rangeConfirmButton.disabled = false;
            } else {
                rangeConfirmButton.classList.add('disabled');
                rangeConfirmButton.disabled = true;
            }
        }

        allCheckboxButton.addEventListener('change', function() {
            individualCheckboxes.forEach(checkbox => {
                checkbox.checked = this.checked;
            });
            updateRangeConfirmButtonState();
        });

        individualCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                const allChecked = [...individualCheckboxes].every(checkbox => checkbox.checked);
                allCheckboxButton.checked = allChecked;

                updateRangeConfirmButtonState();
            });
        });
    }
});