// Section 2, Law 1: Purity - Vanilla JS only.
// Section 1, Law 3: The Gentle Guide - Clear, simple, intuitive.

// Get DOM Elements
const startButton = document.getElementById('start-button');
const breathingCircle = document.getElementById('breathing-circle');
const instructionText = document.getElementById('instruction-text');

// Define the Rhythm
const boxBreathing = {
  inhale: 4000,
  hold: 4000,
  exhale: 4000,
  rest: 4000,
};

// Create the Animation Function
function startBreathingCycle() {
  // 1. Inhale
  instructionText.textContent = 'Inhale';
  breathingCircle.classList.add('growing');

  // 2. Hold
  setTimeout(() => {
    instructionText.textContent = 'Hold';
  }, boxBreathing.inhale);

  // 3. Exhale
  setTimeout(() => {
    instructionText.textContent = 'Exhale';
    breathingCircle.classList.remove('growing');
  }, boxBreathing.inhale + boxBreathing.hold);

  // 4. Rest
  setTimeout(() => {
    instructionText.textContent = 'Rest';
  }, boxBreathing.inhale + boxBreathing.hold + boxBreathing.exhale);
}

// Add Event Listener
startButton.addEventListener('click', startBreathingCycle);
