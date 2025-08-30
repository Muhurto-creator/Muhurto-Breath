// AGENTS.MD Directives:
// Section 2, Law 1: Purity - Vanilla JS only.
// Section 1, Law 3: The Gentle Guide - Clear, simple, intuitive.
// Section 2, Law 2: The Law of the Single Space - Show/hide views.
// Section 2, Law 4: The Law of Respectful Memory - Use localStorage.

// --- DOM ELEMENT REFERENCES ---
// Main screen elements
const startButton = document.getElementById('start-button');
const settingsButton = document.getElementById('settings-button');
const aiHelpButton = document.getElementById('ai-help-button');
const breathingCircle = document.getElementById('breathing-circle');
const instructionText = document.getElementById('instruction-text');
const cycleCounter = document.getElementById('cycle-counter');

// Settings screen elements
const settingsScreen = document.getElementById('settings-screen');
const closeSettingsButton = document.getElementById('close-settings-button');

// AI chat screen elements
const aiChatScreen = document.getElementById('ai-chat-screen');
const closeAiButton = document.getElementById('close-ai-button');
const sendToAiButton = document.getElementById('send-to-ai-button');
const aiPromptInput = document.getElementById('ai-prompt-input');
const aiResponseArea = document.getElementById('ai-response-area');

// Setting value displays
const inhaleValue = document.getElementById('inhale-value');
const holdValue = document.getElementById('hold-value');
const exhaleValue = document.getElementById('exhale-value');
const restValue = document.getElementById('rest-value');
const cyclesValue = document.getElementById('cycles-value');

// Theme buttons
const lightThemeButton = document.getElementById('light-theme-button');
const darkThemeButton = document.getElementById('dark-theme-button');

// --- SETTINGS & STATE ---
let settings = {
    inhale: 4,
    hold: 4,
    exhale: 4,
    rest: 4,
    totalCycles: 10,
    theme: 'dark'
};

let currentCycle = 0;
let isRunning = false;
let timerId = null;

// --- CORE FUNCTIONS ---

/**
 * Updates the UI display in the settings panel with the current values from the settings object.
 */
function updateSettingsUI() {
    inhaleValue.textContent = `${settings.inhale}s`;
    holdValue.textContent = `${settings.hold}s`;
    exhaleValue.textContent = `${settings.exhale}s`;
    restValue.textContent = `${settings.rest}s`;
    cyclesValue.textContent = settings.totalCycles;
}

/**
 * Updates the UI display (spans) with the current values from the settings object.
 */
function updateUIDisplays() {
    updateSettingsUI();
    cycleCounter.textContent = `${currentCycle} / ${settings.totalCycles}`;
}

/**
 * The main breathing animation loop.
 */
function startBreathingCycle() {
    if (currentCycle >= settings.totalCycles) {
        resetApp();
        return;
    }

    currentCycle++;
    updateUIDisplays();

    // 1. Inhale
    instructionText.textContent = 'Inhale';
    breathingCircle.style.transition = `transform ${settings.inhale}s ease-in-out`;
    breathingCircle.classList.add('growing');
    if ('vibrate' in navigator) navigator.vibrate(50);

    // 2. Hold
    setTimeout(() => {
        instructionText.textContent = 'Hold';
        if ('vibrate' in navigator) navigator.vibrate(50);
    }, settings.inhale * 1000);

    // 3. Exhale
    setTimeout(() => {
        instructionText.textContent = 'Exhale';
        breathingCircle.classList.remove('growing');
        breathingCircle.style.transition = `transform ${settings.exhale}s ease-in-out`;
        if ('vibrate' in navigator) navigator.vibrate(50);
    }, (settings.inhale + settings.hold) * 1000);

    // 4. Rest
    setTimeout(() => {
        instructionText.textContent = 'Rest';
        if ('vibrate' in navigator) navigator.vibrate(50);
    }, (settings.inhale + settings.hold + settings.exhale) * 1000);

    // 5. Schedule next cycle
    const totalCycleTime = (settings.inhale + settings.hold + settings.exhale + settings.rest) * 1000;
    timerId = setTimeout(startBreathingCycle, totalCycleTime);
}

/**
 * Resets the application to its initial state.
 */
function resetApp() {
    isRunning = false;
    currentCycle = 0;
    clearTimeout(timerId);
    timerId = null;
    instructionText.textContent = 'Breathe naturally.';
    startButton.textContent = 'Start';
    breathingCircle.classList.remove('growing');
    updateUIDisplays();
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

// Settings screen controls
closeSettingsButton.addEventListener('click', () => {
    settingsScreen.classList.add('hidden');
});

/**
 * Generic handler for + and - buttons on the settings screen.
 * @param {string} key - The key in the settings object to modify.
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

// AI screen controls
aiHelpButton.addEventListener('click', () => {
    aiChatScreen.classList.remove('hidden');
});

closeAiButton.addEventListener('click', () => {
    aiChatScreen.classList.add('hidden');
});

// Attach listeners to all control buttons
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

// Theme switcher
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

// --- PERSISTENCE (localStorage) ---

/**
 * Saves the current settings object to localStorage.
 */
function saveSettings() {
    try {
        localStorage.setItem('muhurtoSettings', JSON.stringify(settings));
    } catch (e) {
        console.error("Could not save settings to localStorage.", e);
    }
}

/**
 * Loads settings from localStorage and applies them.
 */
function loadSettings() {
    try {
        const savedSettings = localStorage.getItem('muhurtoSettings');
        if (savedSettings) {
            const parsedSettings = JSON.parse(savedSettings);
            // Merge loaded settings with defaults to avoid errors if new settings are added later
            settings = { ...settings, ...parsedSettings };
        }
    } catch (e) {
        console.error("Could not load settings from localStorage.", e);
    }

    // Apply the loaded (or default) theme
    if (settings.theme === 'light') {
        document.body.classList.add('light-theme');
    } else {
        document.body.classList.remove('light-theme');
    }

    updateUIDisplays();
}


// --- AI INTEGRATION ---

/**
 * Displays the AI's response and provides an action button.
 * @param {object} data - The parsed JSON object from the AI.
 */
function displayAIResponse(data) {
    aiResponseArea.innerHTML = `
        <p class="ai-recommendation-text">${data.recommendationText}</p>
        <button id="apply-rhythm-button" class="apply-rhythm-button">Apply this rhythm</button>
    `;

    // Attach the event listener to the new button.
    // This is done after setting innerHTML to ensure the element exists in the DOM.
    document.getElementById('apply-rhythm-button').addEventListener('click', () => {
        const newSettings = data.settings;

        // Apply the new settings from the AI.
        // The application's timing functions expect settings to be in seconds.
        settings.inhale = newSettings.inhale;
        settings.hold = newSettings.hold;
        settings.exhale = newSettings.exhale;
        settings.rest = newSettings.rest;
        settings.totalCycles = newSettings.totalCycles;

        saveSettings();
        resetApp(); // Resets app state and updates all UI displays with new settings.

        // Close the AI chat modal.
        aiChatScreen.classList.add('hidden');
    });
}

/**
 * Handles the logic for sending a query to the AI function.
 */
async function handleSendToAI() {
    const userQuery = aiPromptInput.value.trim();
    if (!userQuery) {
        aiResponseArea.innerHTML = '<p>Please tell me how you are feeling.</p>';
        return;
    }

    // Provide immediate feedback
    aiResponseArea.innerHTML = '<p>Thinking...</p>';
    sendToAiButton.disabled = true;

    try {
        const response = await fetch('/.netlify/functions/ask-ai', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query: userQuery }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        displayAIResponse(data);

    } catch (error) {
        console.error('Error fetching AI response:', error);
        aiResponseArea.innerHTML = `<p>Sorry, I couldn't connect to the guide. Please check your connection and try again. <br><small>${error.message}</small></p>`;
    } finally {
        sendToAiButton.disabled = false;
        aiPromptInput.value = ''; // Clear the input
    }
}

sendToAiButton.addEventListener('click', handleSendToAI);
aiPromptInput.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        handleSendToAI();
    }
});


// --- INITIALIZATION ---
loadSettings(); // Load user preferences on startup
updateUIDisplays(); // Set initial values on load
