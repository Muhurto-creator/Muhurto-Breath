/* ==========================================================================
   Netlify Serverless Function: ask-ai
   - Acts as a secure proxy to the Google Gemini API.
   - Protects the API key by keeping it on the server-side.
   ========================================================================== */

// This is a Node.js function; it uses the 'require' syntax if needed,
// but for this simple fetch, no external libraries are necessary.
// `node-fetch` is automatically available in the Netlify environment.

exports.handler = async (event) => {
    // --- 1. Define Standardized Error Response ---
    // A single, consistent error message for the frontend.
    const standardErrorResponse = {
        statusCode: 500,
        body: JSON.stringify({ error: "The AI guide is currently unavailable. Please try again later." })
    };

    try {
        // --- 2. Security and Input Validation ---
        if (event.httpMethod !== 'POST') {
            return {
                statusCode: 405,
                body: JSON.stringify({ error: 'Method Not Allowed. Please use POST.' }),
                headers: { 'Allow': 'POST' }
            };
        }

        const { query } = JSON.parse(event.body);
        if (!query) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Bad Request. "query" is required.' }),
            };
        }

        // --- 3. Securely Access the API Key ---
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            console.error('FATAL: GEMINI_API_KEY is not set in environment variables.');
            return standardErrorResponse;
        }

        // --- 4. The Unbreakable System Prompt ---
        // This new prompt is extremely rigid to prevent deviation.
        const systemPrompt = `
        You are a specialized API endpoint. Your only function is to analyze a user's feeling and return a JSON object containing a breathing exercise. You must adhere to the following rules with absolute precision:

        **Rule 1: Your ONLY output MUST be a single, valid JSON object.**
        **Rule 2: The JSON object MUST have this exact structure: { "recommendationText": "string", "settings": { "inhale": number, "hold": number, "exhale": number, "rest": number, "totalCycles": number } }.**
        **Rule 3: The "recommendationText" should be a short, empathetic message (max 25 words) and based on the user's query: ${query}.**
        **Rule 4: The "settings" values must be in whole seconds.**

        Here is an example of a perfect interaction:
        User Input: "I can't sleep"
        Your Output:
        {
          "recommendationText": "To calm your mind for sleep, let's try the 4-7-8 breath. It is deeply relaxing.",
          "settings": {
            "inhale": 4,
            "hold": 7,
            "exhale": 8,
            "rest": 0,
            "totalCycles": 10
          }
        }

        Under no circumstances should you ever write any text, explanation, or markdown formatting outside of this JSON object. Your entire response is this JSON object and nothing else.
        `;

        // --- 5. Prepare the Request to the Gemini API ---
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

        const requestBody = {
            contents: [{ parts: [{ text: systemPrompt }] }],
            generationConfig: {
                "response_mime_type": "application/json",
                // This schema enforces the exact output structure at the API level.
                "responseSchema": {
                    "type": "OBJECT",
                    "properties": {
                        "recommendationText": { "type": "STRING" },
                        "settings": {
                            "type": "OBJECT",
                            "properties": {
                                "inhale": { "type": "NUMBER" },
                                "hold": { "type": "NUMBER" },
                                "exhale": { "type": "NUMBER" },
                                "rest": { "type": "NUMBER" },
                                "totalCycles": { "type": "NUMBER" }
                            },
                            "required": ["inhale", "hold", "exhale", "rest", "totalCycles"]
                        }
                    },
                    "required": ["recommendationText", "settings"]
                }
            }
        };

        // --- 6. Execute the API Call ---
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
            const errorBody = await response.text();
            console.error('Gemini API request failed:', response.status, errorBody);
            return standardErrorResponse;
        }

        const data = await response.json();

        // --- 7. Validate and Return the Response ---
        // Even with all the guards, we do a final check.
        const aiResponseText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!aiResponseText) {
             console.error('Invalid AI response structure:', JSON.stringify(data, null, 2));
             return standardErrorResponse;
        }

        // The response text *should* be a perfect JSON string.
        // We'll parse it here to be 100% sure before sending to the client.
        JSON.parse(aiResponseText);

        return {
            statusCode: 200,
            body: aiResponseText,
            headers: { 'Content-Type': 'application/json' }
        };

    } catch (error) {
        // --- 8. Generic Error Handling ---
        console.error('An unexpected error occurred in the ask-ai function:', error);
        return standardErrorResponse;
    }
};
