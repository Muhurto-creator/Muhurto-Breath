// Section 2, Law 1: Purity - Vanilla JS only.
// Section 1, Law 3: The Gentle Guide - Clear, simple, intuitive.

// Get DOM Elements
const startButton = document.getElementById('start-button');
const breathingCircle = document.getElementById('breathing-circle');
const instructionText = document.getElementById('instruction-text');
const cycleCounter = document.getElementById('cycle-counter');

// Session State Management
const sessionState = {
  totalCycles: 10,
  currentCycle: 0,
  isActive: false,
};

// Define the Rhythm
const boxBreathing = {
  inhale: 4000,
  hold: 4000,
  exhale: 4000,
  rest: 4000,
};

// Create the Animation Function
function startBreathingCycle() {
  if (!sessionState.isActive) return;

  // Check for session end
  if (sessionState.currentCycle >= sessionState.totalCycles) {
    endSession();
    return;
  }

  // Increment cycle and update counter
  sessionState.currentCycle++;
  cycleCounter.textContent = `${sessionState.currentCycle} / ${sessionState.totalCycles}`;

  // 1. Inhale
  if (navigator.vibrate) { navigator.vibrate(50); }
  instructionText.textContent = 'Inhale';
  breathingCircle.classList.add('growing');

  // 2. Hold
  setTimeout(() => {
    if (!sessionState.isActive) return;
    if (navigator.vibrate) { navigator.vibrate(50); }
    instructionText.textContent = 'Hold';
  }, boxBreathing.inhale);

  // 3. Exhale
  setTimeout(() => {
    if (!sessionState.isActive) return;
    if (navigator.vibrate) { navigator.vibrate(50); }
    instructionText.textContent = 'Exhale';
    breathingCircle.classList.remove('growing');
  }, boxBreathing.inhale + boxBreathing.hold);

  // 4. Rest and loop
  setTimeout(() => {
    if (!sessionState.isActive) return;
    if (navigator.vibrate) { navigator.vibrate(50); }
    instructionText.textContent = 'Rest';
    // Start the next cycle after the rest period
    setTimeout(startBreathingCycle, boxBreathing.rest);
  }, boxBreathing.inhale + boxBreathing.hold + boxBreathing.exhale);
}

function endSession() {
  sessionState.isActive = false;
  instructionText.textContent = "Session complete. Well done.";
  startButton.disabled = false;
  cycleCounter.textContent = "0 / 10";
}

// Add Event Listener
startButton.addEventListener('click', () => {
  if (!sessionState.isActive) {
    sessionState.isActive = true;
    sessionState.currentCycle = 0;
    startButton.disabled = true;
    startBreathingCycle();
  }
});
