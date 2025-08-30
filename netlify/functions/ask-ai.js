exports.handler = async (event) => {
  // 1. The Law of the Sanctuary's Gate: Only POST requests are allowed.
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed. Please use POST.' }),
      headers: { 'Allow': 'POST' }
    };
  }

  try {
    // 2. Parse the user's feeling from the incoming request.
    const { query } = JSON.parse(event.body);
    if (!query) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Bad Request. "query" is required.' }),
      };
    }

    // 3. Securely access the Gemini API key from environment variables.
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      // This is a server-side error, not a client one.
      console.error('GEMINI_API_KEY is not set in environment variables.');
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Internal Server Error: AI configuration is missing.' }),
      };
    }

    // 4. Define the Gemini API endpoint for the specified model.
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    // 5. Construct the request body with the specific system prompt and JSON enforcement.
    const requestBody = {
      contents: [{
        parts: [{
          // The Prime Directive: A calm, empathetic breathing coach.
          // The response MUST be a specific JSON object.
          text: `You are a calm, empathetic breathing coach. A user feels: "${query}". Analyze this feeling and provide a breathing exercise. Your response MUST be ONLY a JSON object with this exact structure: { "recommendationText": "A short, calming message for the user.", "settings": { "inhale": 4, "hold": 7, "exhale": 8, "rest": 0, "totalCycles": 12 } }. Do not include any other text or markdown formatting.`
        }]
      }],
      generationConfig: {
        "response_mime_type": "application/json",
      }
    };

    // 6. Make the API call to the Gemini service.
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
        const errorBody = await response.text();
        console.error('Gemini API request failed:', response.status, errorBody);
        return {
          statusCode: response.status,
          body: JSON.stringify({ error: `Failed to communicate with the AI. ${errorBody}` }),
        };
    }

    const data = await response.json();

    // 7. Extract the pure JSON text from the response.
    // The Gemini API wraps the JSON response within a text field, so we need to parse it again.
    const aiResponseText = data.candidates[0].content.parts[0].text;

    // 8. Return the successful response to the client.
    return {
      statusCode: 200,
      body: aiResponseText, // This is already a JSON string
      headers: {
          'Content-Type': 'application/json',
      }
    };

  } catch (error) {
    // 9. Robust error handling for any other failures.
    console.error('An unexpected error occurred:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: `An internal server error occurred: ${error.message}` }),
    };
  }
};
