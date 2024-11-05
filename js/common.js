let global_currentAudio = null;

// Function to play sound
function playSound(soundFile) {
    // Stop the current audio if it's playing
    if (global_currentAudio) {
        global_currentAudio.pause();
        global_currentAudio.currentTime = 0;  // Reset to start
    }

    // Create a new Audio object and play the new sound
    global_currentAudio = new Audio(soundFile);
    global_currentAudio.play();
}

// get random item from array
function getRandomItem(array) {
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
  }

// shuffle array
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function removeRubyTag(text) {
    return text.replace(/<rt>.*?<\/rt>/g, '').replace(/<\/?ruby>/g, '');
}
