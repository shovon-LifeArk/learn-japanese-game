// Function to play sound
function playSound(soundFile) {
    const audio = new Audio(soundFile);
    audio.play();
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
