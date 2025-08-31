/* ==========================================================================
   Muhurto - A Moment of Calm
   JavaScript Logic
   ========================================================================== */

// AGENTS.MD Directives:
// Section 2, Law 1: Purity - Vanilla JS only.
// Section 1, Law 3: The Gentle Guide - Clear, simple, intuitive.
// Section 2, Law 2: The Law of the Single Space - Show/hide views.
// Section 2, Law 4: The Law of Respectful Memory - Use localStorage.

// --- DOM ELEMENT REFERENCES ---
// Caching all DOM elements we'll need to interact with for performance and clarity.
const startButton = document.getElementById('start-button');
const settingsButton = document.getElementById('settings-button');
const aiHelpButton = document.getElementById('ai-help-button');
const breathingCircle = document.getElementById('breathing-circle');
const instructionText = document.getElementById('instruction-text');
const cycleCounter = document.getElementById('cycle-counter');

const settingsScreen = document.getElementById('settings-screen');
const closeSettingsButton = document.getElementById('close-settings-button');

const aiChatScreen = document.getElementById('ai-chat-screen');
const closeAiButton = document.getElementById('close-ai-button');
const sendToAiButton = document.getElementById('send-to-ai-button');
const aiPromptInput = document.getElementById('ai-prompt-input');
const aiResponseArea = document.getElementById('ai-response-area');

const inhaleValue = document.getElementById('inhale-value');
const holdValue = document.getElementById('hold-value');
const exhaleValue = document.getElementById('exhale-value');
const restValue = document.getElementById('rest-value');
const cyclesValue = document.getElementById('cycles-value');

const lightThemeButton = document.getElementById('light-theme-button');
const darkThemeButton = document.getElementById('dark-theme-button');

const hapticToggle = document.getElementById('haptic-toggle');
const voiceToggle = document.getElementById('voice-toggle');

// --- APPLICATION STATE & SETTINGS ---
// Default settings, which can be overridden by user's saved preferences.
let settings = {
    inhale: 4,
    hold: 4,
    exhale: 4,
    rest: 4,
    totalCycles: 10,
    theme: 'dark',
    hapticsEnabled: true,
    voiceEnabled: false
};

// State variables to manage the breathing cycle.
let currentCycle = 0;
let isRunning = false;
let timerId = null; // To hold the ID of our setTimeout loop.

// --- CORE FUNCTIONS ---

/**
 * The main engine of the breathing animation. This function is recursive,
 * using a chain of `setTimeout` calls to create the different phases of the
 * breathing cycle (Inhale, Hold, Exhale, Rest).
 *
 * Why `setTimeout`?
 * This approach is chosen over `setInterval` for its flexibility. Each phase
 * of the breath can have a different duration, which `setInterval` doesn't
 * easily allow for. A `setTimeout` chain lets us schedule the *next* step
 * precisely after the current one finishes, creating a smooth, controllable,
 * and adaptable rhythm. It's a state machine implemented with time.
 */
function startBreathingCycle() {
    // Base case: If we've completed all cycles, stop and reset.
    if (currentCycle >= settings.totalCycles) {
        resetApp();
        return;
    }

    currentCycle++;
    updateUIDisplays();

    // --- The Breathing Phases ---

    // 1. INHALE
    // The cycle begins. Update text, trigger audio/haptic feedback, and start animation.
    instructionText.textContent = 'Inhale';
    speak('Inhale');
    // The CSS transition needs to know the duration of this specific phase.
    breathingCircle.style.transition = `transform ${settings.inhale}s ease-in-out`;
    breathingCircle.classList.add('growing');
    if (settings.hapticsEnabled && 'vibrate' in navigator) navigator.vibrate(50);

    // 2. HOLD
    // Scheduled to run *after* the inhale phase is complete.
    setTimeout(() => {
        instructionText.textContent = 'Hold';
        speak('Hold');
        if (settings.hapticsEnabled && 'vibrate' in navigator) navigator.vibrate(50);
    }, settings.inhale * 1000);

    // 3. EXHALE
    // Scheduled to run *after* inhale and hold phases are complete.
    setTimeout(() => {
        instructionText.textContent = 'Exhale';
        speak('Exhale');
        // The circle shrinks back to its original size.
        breathingCircle.classList.remove('growing');
        breathingCircle.style.transition = `transform ${settings.exhale}s ease-in-out`;
        if (settings.hapticsEnabled && 'vibrate' in navigator) navigator.vibrate(50);
    }, (settings.inhale + settings.hold) * 1000);

    // 4. REST
    // Scheduled to run *after* inhale, hold, and exhale are complete.
    setTimeout(() => {
        instructionText.textContent = 'Rest';
        speak('Rest');
        if (settings.hapticsEnabled && 'vibrate' in navigator) navigator.vibrate(50);
    }, (settings.inhale + settings.hold + settings.exhale) * 1000);

    // 5. RECURSION
    // Calculate the total time for one full cycle and schedule the next call
    // to this function, creating the loop.
    const totalCycleTime = (settings.inhale + settings.hold + settings.exhale + settings.rest) * 1000;
    timerId = setTimeout(startBreathingCycle, totalCycleTime);
}

/**
 * Resets the application to its initial, pre-start state.
 * Clears any running timers and resets all visual and state elements.
 */
function resetApp() {
    isRunning = false;
    currentCycle = 0;
    // Crucially, clear the scheduled next cycle to stop the loop.
    clearTimeout(timerId);
    timerId = null;
    instructionText.textContent = 'Breathe naturally.';
    startButton.textContent = 'Start';
    breathingCircle.classList.remove('growing');
    updateUIDisplays();
}

// --- UI & DISPLAY FUNCTIONS ---

/**
 * Updates all visible text elements (like '4s') in the settings panel.
 */
function updateSettingsUI() {
    inhaleValue.textContent = `${settings.inhale}s`;
    holdValue.textContent = `${settings.hold}s`;
    exhaleValue.textContent = `${settings.exhale}s`;
    restValue.textContent = `${settings.rest}s`;
    cyclesValue.textContent = settings.totalCycles;
}

/**
 * A central function to refresh all dynamic UI parts at once.
 */
function updateUIDisplays() {
    updateSettingsUI();
    cycleCounter.textContent = `${currentCycle} / ${settings.totalCycles}`;
}

/**
 * Speaks the given text using the browser's Speech Synthesis API.
 * Includes checks for browser support and user preference.
 * @param {string} text - The text to be spoken.
 */
async function speak(text) {
    if (!settings.voiceEnabled || !('speechSynthesis' in window)) {
        return;
    }
    // If the user clicks rapidly, cancel the previous utterance to prevent overlap.
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.pitch = 0.9; // A calmer, slightly lower pitch.
    utterance.rate = 0.9; // A slower, more deliberate pace.
    window.speechSynthesis.speak(utterance);
}

// --- EVENT LISTENERS ---

// Main screen controls
startButton.addEventListener('click', () => {
    if (isRunning) {
        resetApp();
    } else {
        isRunning = true;
        startButton.textContent = 'Stop';
        startBreathingCycle();
    }
});

settingsButton.addEventListener('click', () => {
    settingsScreen.classList.remove('hidden');
});

closeSettingsButton.addEventListener('click', () => {
    settingsScreen.classList.add('hidden');
});

// AI screen controls
aiHelpButton.addEventListener('click', () => {
    // Set the initial, welcoming message when the modal is opened.
    aiResponseArea.innerHTML = `<p>Tell me how you're feeling, and I'll suggest a breathing rhythm to help.</p>`;
    aiPromptInput.value = ''; // Clear previous input
    sendToAiButton.disabled = false; // Ensure button is enabled
    aiChatScreen.classList.remove('hidden');
});

closeAiButton.addEventListener('click', () => {
    aiChatScreen.classList.add('hidden');
});

/**
 * A generic handler for the '+' and '-' buttons in the settings panel.
 * This keeps the code DRY by reusing the same logic for all settings.
 * @param {string} key - The key in the `settings` object to modify (e.g., 'inhale').
 * @param {number} amount - The amount to add (can be negative).
 * @param {number} min - The minimum allowed value.
 * @param {number} max - The maximum allowed value.
 */
function handleSettingChange(key, amount, min, max) {
    const newValue = settings[key] + amount;
    if (newValue >= min && newValue <= max) {
        settings[key] = newValue;
        updateUIDisplays();
        saveSettings();
    }
}

// Attach listeners to all '+' and '-' buttons.
document.getElementById('inhale-minus').addEventListener('click', () => handleSettingChange('inhale', -1, 1, 20));
document.getElementById('inhale-plus').addEventListener('click', () => handleSettingChange('inhale', 1, 1, 20));
document.getElementById('hold-minus').addEventListener('click', () => handleSettingChange('hold', -1, 0, 20));
document.getElementById('hold-plus').addEventListener('click', () => handleSettingChange('hold', 1, 0, 20));
document.getElementById('exhale-minus').addEventListener('click', () => handleSettingChange('exhale', -1, 1, 20));
document.getElementById('exhale-plus').addEventListener('click', () => handleSettingChange('exhale', 1, 1, 20));
document.getElementById('rest-minus').addEventListener('click', () => handleSettingChange('rest', -1, 0, 20));
document.getElementById('rest-plus').addEventListener('click', () => handleSettingChange('rest', 1, 0, 20));
document.getElementById('cycles-minus').addEventListener('click', () => handleSettingChange('totalCycles', -1, 1, 100));
document.getElementById('cycles-plus').addEventListener('click', () => handleSettingChange('totalCycles', 1, 1, 100));

// Theme switcher listeners
lightThemeButton.addEventListener('click', () => {
    document.body.classList.add('light-theme');
    settings.theme = 'light';
    saveSettings();
});

darkThemeButton.addEventListener('click', () => {
    document.body.classList.remove('light-theme');
    settings.theme = 'dark';
    saveSettings();
});

// Sensory Toggle listeners
hapticToggle.addEventListener('click', () => {
    settings.hapticsEnabled = !settings.hapticsEnabled;
    hapticToggle.classList.toggle('active');
    hapticToggle.textContent = settings.hapticsEnabled ? 'On' : 'Off';
    saveSettings();
});

voiceToggle.addEventListener('click', () => {
    settings.voiceEnabled = !settings.voiceEnabled;
    voiceToggle.classList.toggle('active');
    voiceToggle.textContent = settings.voiceEnabled ? 'On' : 'Off';
    saveSettings();
    // Provide immediate feedback that voice is on.
    if (settings.voiceEnabled) {
        speak('Voice guidance enabled.');
    }
});

// --- PERSISTENCE (localStorage) ---

/**
 * Saves the current `settings` object to the browser's localStorage.
 * This ensures user preferences are remembered for their next visit.
 * (AGENTS.MD, Section 2, Law 4: The Law of Respectful Memory)
 */
function saveSettings() {
    try {
        localStorage.setItem('muhurtoSettings', JSON.stringify(settings));
    } catch (e) {
        console.error("Could not save settings to localStorage.", e);
    }
}

/**
 * Loads settings from localStorage on startup. If no saved settings are
 * found, the default values are used.
 */
function loadSettings() {
    try {
        const savedSettings = localStorage.getItem('muhurtoSettings');
        if (savedSettings) {
            const parsedSettings = JSON.parse(savedSettings);
            // Merge loaded settings with defaults. This prevents errors if we add
            // new settings in the future that old clients don't have saved.
            settings = { ...settings, ...parsedSettings };
        }
    } catch (e) {
        console.error("Could not load settings from localStorage.", e);
    }

    // Apply the loaded (or default) theme.
    if (settings.theme === 'light') {
        document.body.classList.add('light-theme');
    } else {
        document.body.classList.remove('light-theme');
    }

    // Apply the loaded (or default) sensory feedback settings to the UI toggles.
    hapticToggle.textContent = settings.hapticsEnabled ? 'On' : 'Off';
    hapticToggle.classList.toggle('active', settings.hapticsEnabled);

    voiceToggle.textContent = settings.voiceEnabled ? 'On' : 'Off';
    voiceToggle.classList.toggle('active', settings.voiceEnabled);

    updateUIDisplays();
}


// --- AI INTEGRATION ---

/**
 * Sends a user's query to our serverless Netlify function.
 * This function acts as a secure proxy to the actual Gemini AI service.
 *
 * Why a Netlify Function?
 * (AGENTS.MD, Section 2, Law 3: The Sanctuary's Gate)
 * The API key for the AI service is a secret and must **never** be exposed
 * in the frontend code. By sending the user's query to our own serverless
 * function, we can keep the key securely stored in an environment variable
 * on the server. The serverless function then makes the actual call to the
 * AI. This is a critical security measure.
 */
async function handleSendToAI() {
    console.log("handleSendToAI called"); // Debugging line
    const userQuery = aiPromptInput.value.trim();
    if (!userQuery) {
        // The welcome message already handles this, but as a fallback.
        aiResponseArea.innerHTML = '<p>Please tell me how you are feeling first.</p>';
        return;
    }

    // 1. Implement the "Thinking" state.
    aiResponseArea.innerHTML = '<p class="thinking">Thinking...</p>';
    sendToAiButton.disabled = true;
    aiPromptInput.disabled = true;

    try {
        const response = await fetch('/.netlify/functions/ask-ai', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: userQuery }),
        });

        const data = await response.json();

        // 2. Handle Success and Failure based on the standardized response.
        if (data.error) {
            // The backend sent our standardized error message.
            displayAIError(data.error);
        } else {
            // Success! Display the AI's recommendation.
            displayAIResponse(data);
        }

    } catch (error) {
        // This catches network errors or if the server is completely down.
        console.error('Error fetching AI response:', error);
        displayAIError("The AI guide is currently unavailable. Please try again later.");
    } finally {
        // 3. Re-enable the input fields for the next query.
        sendToAiButton.disabled = false;
        aiPromptInput.disabled = false;
        aiPromptInput.value = ''; // Clear input after sending.
    }
}

/**
 * Renders the AI's response in the UI, creating new HTML elements.
 * @param {object} data - The parsed JSON object from the AI.
 *                        Expected format: { recommendationText: "...", settings: { ... } }
 */
function displayAIResponse(data) {
    aiResponseArea.innerHTML = ''; // Clear "Thinking..." message.

    const recommendation = document.createElement('p');
    recommendation.className = 'ai-recommendation-text';
    recommendation.textContent = data.recommendationText;
    aiResponseArea.appendChild(recommendation);

    const applyButton = document.createElement('button');
    applyButton.className = 'apply-rhythm-button';
    applyButton.textContent = 'Apply this rhythm';

    // When the user clicks the new button, apply the suggested settings.
    applyButton.addEventListener('click', () => {
        // Overwrite the current settings with the ones from the AI.
        settings.inhale = data.settings.inhale;
        settings.hold = data.settings.hold;
        settings.exhale = data.settings.exhale;
        settings.rest = data.settings.rest;
        settings.totalCycles = data.settings.totalCycles;

        saveSettings();
        resetApp(); // Reset the app to reflect the new settings.
        aiChatScreen.classList.add('hidden'); // Close the panel.
    });

    aiResponseArea.appendChild(applyButton);
}

/**
 * Renders a standardized error message in the AI response area.
 * @param {string} message - The error message to display.
 */
function displayAIError(message) {
    aiResponseArea.innerHTML = ''; // Clear "Thinking..." message.
    const errorP = document.createElement('p');
    errorP.className = 'ai-error-text';
    errorP.textContent = message;
    aiResponseArea.appendChild(errorP);
}

// Attach listeners for the AI input field (both button click and 'Enter' key).
sendToAiButton.addEventListener('click', handleSendToAI);
aiPromptInput.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        handleSendToAI();
    }
});


// --- INITIALIZATION ---
// This code runs once when the script is first loaded.
loadSettings(); // Load any saved user preferences.
updateUIDisplays(); // Ensure the UI reflects the correct initial state.
