# The Unchanging Principles of Muhurto
_This is the core creed for the AI agent building this application. Read this before any task. Let these principles guide your logic, your structure, and your output. You are not merely writing code; you are crafting a sanctuary._

---

### **PRIME DIRECTIVE: SERVE THE BREATH**

The user is here for one reason: to connect with their breath. Every single element, every animation, every line of code must serve this singular purpose. If it does not make the experience of breathing calmer, clearer, or more focused, it does not belong.

Your goal is to create a space of **effortless tranquility**. The user should feel guided, not managed. The technology must become invisible, leaving only the user and their breath.

---

### **SECTION 1: THE LAWS OF SENSATION (The Vibe)**

These laws govern the feeling of the application. They are not negotiable.

**1. The Law of the Quiet Canvas:**
The visual space is a sanctuary. The default background must be a deep, near-black (`#0D0D0D`), like a quiet room at midnight. Interactive elements and text should glow with a soft, vital energy. Use a calming, focused teal (`#00F6F6`) as the primary accent. For text, avoid pure white; use a gentle off-white (`#EAEAEA`) to eliminate eye strain.

**2. The Law of Organic Motion:**
All movement must mimic the rhythm of life. Animations, especially the core breathing circle, must be fluid and gentle. Use `ease-in-out` timing functions exclusively. There must be no sudden starts, no jarring stops, no sharp transitions. The expansion and contraction of the circle should feel like a lung filling with air—natural, soft, and alive.

**3. The Law of the Gentle Guide:**
The UI must be a whisper, not a shout.
-   **Clarity Above All:** Instructions should be simple, direct, and use minimal words. "Inhale," "Hold," "Exhale."
-   **Spaciousness:** Give every element room to breathe. Use generous padding and margins. The interface must never feel crowded.
-   **Intuitive Touch:** All buttons and controls must have large tap targets. The user should never have to aim.
-   **Subtle Feedback:** Haptic feedback on mobile is an echo of the breath. It should be a single, soft pulse (`navigator.vibrate(50)`) at the start of each phase—a nudge, not a jolt.

---

### **SECTION 2: THE LAWS OF FORM (The Architecture)**

These laws govern the structure of the code. They are the foundation upon which the feeling is built.

**1. The Law of Purity:**
This sanctuary is built from the earth of the web itself. You must use **vanilla HTML, CSS, and JavaScript**. Do not introduce any frameworks, libraries, or dependencies unless explicitly instructed for a specific, vital function. This purity ensures speed, simplicity, and longevity.

**2. The Law of the Single Space:**
The user's journey must be seamless. The application will be a **Single Page Application (SPA)**. The Main Screen and Settings Screen are different views within the same `index.html`. Use CSS classes and JavaScript to show and hide these views. There must never be a full page reload after the initial load. The user must always feel like they are in one, unbroken space.

**3. The Law of the Sanctuary's Gate (Security):**
The connection to the Gemini AI is sacred and must be protected. The Gemini API key is a secret that must **NEVER** be exposed in the client-side JavaScript. All communication with the Gemini API must be proxied through a **Netlify Function**. The frontend will call the Netlify Function; the function will securely hold the API key and call the Gemini API. This is a critical, non-negotiable security boundary.

**4. The Law of Respectful Memory:**
The app should remember the user's preferences. Use the browser's `localStorage` to save the user's chosen rhythm, cycle count, and theme. When they return, the sanctuary should be just as they left it. This is an act of respect for the user's time and intention.

---

### **SECTION 3: THE ETERNAL PROHIBITIONS (What Thou Shalt Not Do)**

To protect the vibe, you must actively avoid the following:

-   **Thou Shalt Not Jar:** No page reloads. No sharp, linear animations. No sudden pop-ups or alerts.
-   **Thou Shalt Not Distract:** No badges, no notifications, no unnecessary text or icons. If it doesn't guide the breath, remove it.
-   **Thou Shalt Not Shout:** No loud colors. The palette is fixed. No sounds unless specifically added as a feature.
-   **Thou Shalt Not Clutter:** Keep the DOM clean and the CSS specific. Avoid overly complex selectors. Keep JavaScript functions small and focused on a single task.
-   **Thou Shalt Not Surveil:** Do not use cookies or any tracking scripts. The only data stored is the user's settings in their own browser's `localStorage`.

---

_Let every function you write, every element you style, and every file you create be a quiet, intentional breath. This is the way of Muhurto._
