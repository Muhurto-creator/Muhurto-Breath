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

/**
 * Orchestrates a single breathing cycle based on the BOX_BREATHING rhythm.
 */
function startBreathingCycle() {
    // Phase 1: Inhale
    instructionText.textContent = 'Inhale';
    breathingCircle.classList.add('growing');

    // Phase 2: Hold
    setTimeout(() => {
        instructionText.textContent = 'Hold';
    }, BOX_BREATHING.inhale);

    // Phase 3: Exhale
    setTimeout(() => {
        instructionText.textContent = 'Exhale';
        breathingCircle.classList.remove('growing');
    }, BOX_BREATHING.inhale + BOX_BREATHING.hold);

    // Phase 4: Rest
    setTimeout(() => {
        instructionText.textContent = 'Rest';
    }, BOX_BREATHING.inhale + BOX_BREATHING.hold + BOX_BREATHING.exhale);

    // Note: The cycle completes visually after the final rest period.
    // We will add looping logic in a future step.
}

// Add Event Listener to the start button
startButton.addEventListener('click', startBreathingCycle);
