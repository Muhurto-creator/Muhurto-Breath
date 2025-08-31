/* ==========================================================================
   Netlify Serverless Function: ask-ai
   - Acts as a secure proxy to the Google Gemini API.
   - Protects the API key by keeping it on the server-side.
   ========================================================================== */

// This is a Node.js function; it uses the 'require' syntax if needed,
// but for this simple fetch, no external libraries are necessary.
// `node-fetch` is automatically available in the Netlify environment.

exports.handler = async (event) => {
    // --- 1. Security First: Validate Request Method ---
    // (AGENTS.MD, Section 2, Law 3: The Sanctuary's Gate)
    // We only accept POST requests to this endpoint. This is a standard
    // security practice for endpoints that receive data.
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405, // 405 Method Not Allowed
            body: JSON.stringify({ error: 'Method Not Allowed. Please use POST.' }),
            headers: { 'Allow': 'POST' } // Let the client know which method is expected.
        };
    }

    try {
        // --- 2. Input Validation: Parse and Check the User's Query ---
        const { query } = JSON.parse(event.body);
        if (!query) {
            return {
                statusCode: 400, // 400 Bad Request
                body: JSON.stringify({ error: 'Bad Request. "query" is required.' }),
            };
        }

        // --- 3. Securely Access the API Key ---
        // The API key is stored as an environment variable in the Netlify UI,
        // NEVER in the code itself.
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            // This is a server-side configuration error, not the client's fault.
            console.error('FATAL: GEMINI_API_KEY is not set in environment variables.');
            return {
                statusCode: 500, // 500 Internal Server Error
                body: JSON.stringify({ error: 'Internal Server Error: The AI guide is not configured correctly.' }),
            };
        }

        // --- 4. Prepare the Request to the Gemini API ---
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

        // This is the "prompt engineering" part. We give the AI a very specific
        // role and a strict output format. This ensures we always get back
        // a predictable JSON object that our frontend can parse.
        const systemPrompt = `
            You are a calm, empathetic breathing coach. A user feels: "${query}".
            Analyze this feeling and provide a suitable breathing exercise.
            Your response MUST be ONLY a JSON object with this exact structure:
            {
                "recommendationText": "A short, calming message for the user.",
                "settings": {
                    "inhale": 4,
                    "hold": 7,
                    "exhale": 8,
                    "rest": 0,
                    "totalCycles": 12
                }
            }
            Do not include any other text, markdown formatting, or code fences.
        `;

        const requestBody = {
            contents: [{
                parts: [{ text: systemPrompt }]
            }],
            // This tells Gemini to ensure its output is valid JSON.
            generationConfig: {
                "response_mime_type": "application/json",
            }
        };

        // --- 5. Execute the API Call ---
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody),
        });

        // Handle errors from the Gemini API itself.
        if (!response.ok) {
            const errorBody = await response.text();
            console.error('Gemini API request failed:', response.status, errorBody);
            return {
                statusCode: response.status,
                body: JSON.stringify({ error: `The AI guide is currently unavailable. ${errorBody}` }),
            };
        }

        const data = await response.json();

        // --- 6. Process and Return the Response ---
        // The Gemini API, even in JSON mode, wraps its response. We need to extract
        // the actual text content, which is our desired JSON string.
        const aiResponseText = data.candidates[0].content.parts[0].text;

        // Return the clean JSON string directly to our frontend client.
        return {
            statusCode: 200,
            body: aiResponseText, // This is already a JSON string, no need to stringify again.
            headers: { 'Content-Type': 'application/json' }
        };

    } catch (error) {
        // --- 7. Generic Error Handling ---
        // Catches any other errors, like JSON parsing failures or network issues.
        console.error('An unexpected error occurred in the ask-ai function:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: `An internal server error occurred: ${error.message}` }),
        };
    }
};
