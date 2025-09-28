//variables for character data and second for triggering proper results only after data loaded equals true
let characterData = {};
let dataLoaded = false;

// DOM elements
const questionSection = document.getElementById('questionSection');
const resultSection = document.getElementById('resultSection');
const characterImg = document.getElementById('characterImg');
const quote = document.getElementById('quote');
const characterName = document.getElementById('characterName');
const restartBtn = document.getElementById('restartBtn');
const crystalButtons = document.querySelectorAll('.crystal-btn');
const bgMusic = document.getElementById('bgMusic');
const muteBtn = document.getElementById('muteBtn');
const selectSound = new Audio('select_01.mp3');

// Fetch JSON
fetch('https://raw.githubusercontent.com/one-q-84/ffvii-json/refs/heads/main/ffvii-characters.json')
    .then(res => res.json())
    .then(data => {
        characterData = data;
        dataLoaded = true;
        console.log("JSON loaded:", characterData);
    })
    .catch(err => console.error('Error fetching JSON:', err));

// treat crystals like clickable buttons
crystalButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        const mood = e.target.dataset.mood;
        showResult(mood);
    });
});

// Restart button to send us back to 'homepage'
restartBtn.addEventListener('click', showQuestion);

// Show result section, if statement to deal with instances of event occuring before data loaded
function showResult(mood) {
    if (!dataLoaded) {
        alert("Character data is still loading. Please wait.");
        return;
    }

    const character = characterData.characters.find(c => c.mood === mood);
    if (!character) {
        console.error(`No character found for mood "${mood}"`);
        return;
    }

    // Update DOM -- here is where action of click translates to finding mapped materials in JSON
    characterImg.src = `/ch-assets/${character.img_sprite}`;
    characterImg.alt = character.name;
    quote.textContent = character.quote;
    characterName.textContent = `- ${character.name}`;

    // after click, fade out question section and show result 
    questionSection.classList.add('fade-out');
    setTimeout(() => {
        resultSection.classList.add('show');
    }, 300);
}

// Show question section again
function showQuestion() {
    resultSection.classList.remove('show');
    questionSection.classList.remove('fade-out');
}

//music volume
bgMusic.volume = 0.1;
selectSound.volume = 0.4;

// Try to play music on page load
window.addEventListener('load', () => {
    bgMusic.play().catch(() => {
        console.log("Autoplay blocked. User interaction required to play music.");
    });
});

// Mute toggle
muteBtn.addEventListener('click', () => {
    bgMusic.muted = !bgMusic.muted;
    muteBtn.textContent = bgMusic.muted ? '🔇' : '🔊';
});

//sound effect on click
crystalButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        selectSound.currentTime = 0;
        selectSound.play();
        const mood = e.target.dataset.mood;
        showResult(mood);
    });

});
