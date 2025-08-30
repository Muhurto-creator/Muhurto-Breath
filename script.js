// Get DOM Elements
const startButton = document.getElementById('start-button');
const breathingCircle = document.getElementById('breathing-circle');
const instructionText = document.getElementById('instruction-text');

// Define the Rhythm
const BOX_BREATHING = {
  inhale: 4000,
  hold: 4000,
  exhale: 4000,
  rest: 4000,
};

// Create the Animation Function
function startBreathingCycle() {
  // Inhale
  instructionText.textContent = 'Inhale';
  breathingCircle.classList.add('growing');

  // Hold
  setTimeout(() => {
    instructionText.textContent = 'Hold';
  }, BOX_BREATHING.inhale);

  // Exhale
  setTimeout(() => {
    instructionText.textContent = 'Exhale';
    breathingCircle.classList.remove('growing');
  }, BOX_BREATHING.inhale + BOX_BREATHING.hold);

  // Rest
  setTimeout(() => {
    instructionText.textContent = 'Rest';
  }, BOX_BREATHING.inhale + BOX_BREATHING.hold + BOX_BREATHING.exhale);
}

// Add Event Listener
startButton.addEventListener('click', startBreathingCycle);
