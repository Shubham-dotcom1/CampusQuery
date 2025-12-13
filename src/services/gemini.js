import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY?.trim();

// Debug log to verify key loading
console.log("CampusQuery AI Service Initialized");
console.log("API Key Status:", API_KEY ? "Present" : "Missing");

let genAI = null;

if (API_KEY) {
    genAI = new GoogleGenerativeAI(API_KEY);
}

// List of models to try (Prioritizing Pro as requested)
const MODELS_TO_TRY = [
    "gemini-2.5-pro",    // Latest & most capable
    "gemini-2.5-flash"   // Faster fallback
];

export const generateResponse = async (prompt, context = "") => {
    console.log("Generating response for:", prompt);

    if (!genAI) {
        console.error("Gemini AI instance not initialized. Key missing?");
        return {
            answer: "I am unable to connect to the AI service right now. Please check if the API Key is configured correctly in the .env file.",
            actions: [{ label: "Check Settings", type: "error" }]
        };
    }

    const fullPrompt = `
    Role: You are the helpful, intelligent "CampusQuery" AI assistant for a smart university campus.
    Goal: Answer the student's question accurately based on general knowledge or the provided context.
    
    Context: ${context || "General campus query about student life, academics, or events."}
    User Question: ${prompt}
    
    Instructions:
    1. Be friendly, concise, and helpful.
    2. Suggest 1-3 concrete actions the user can take (e.g., "View Map", "Add to Calendar", "Read Notice").
    3. YOUR OUTPUT MUST BE VALID JSON ONLY. Do not use Markdown code blocks (\`\`\`json). Just the raw JSON object.
    
    JSON Schema:
    {
      "answer": "String (The main response text, can use simple inline markdown like **bold**)",
      "actions": [
        { 
            "label": "String (Short button label)", 
            "type": "link | map | calendar | info", 
            "value": "String (URL, location name, or detail)" 
        }
      ]
    }
    `;

    // Try models sequentially
    let lastError = null;
    for (const modelName of MODELS_TO_TRY) {
        try {
            console.log(`Attempting to generate with model: ${modelName}`);
            const model = genAI.getGenerativeModel({ model: modelName });

            const result = await model.generateContent(fullPrompt);
            const response = await result.response;
            let text = response.text();

            console.log(`Success with ${modelName}. Response:`, text);

            // Cleanup JSON
            text = text.replace(/```json/g, '').replace(/```/g, '').trim();

            let jsonResponse;
            try {
                const firstOpen = text.indexOf('{');
                const lastClose = text.lastIndexOf('}');
                if (firstOpen !== -1 && lastClose !== -1) {
                    const potentialJson = text.substring(firstOpen, lastClose + 1);
                    jsonResponse = JSON.parse(potentialJson);
                } else {
                    throw new Error("No JSON structure found");
                }
            } catch (parseError) {
                console.warn(`AI returned non-JSON text (${modelName}). Fallback to plain text.`);
                jsonResponse = {
                    answer: text,
                    actions: []
                };
            }

            return jsonResponse;

        } catch (error) {
            console.warn(`Failed with model ${modelName}:`, error.message);
            lastError = error;
            // Continue to next model
        }
    }

    // If all models fail
    console.error("All Gemini models failed. Last error:", lastError);

    // Extract more specific error info if available
    let errorMessage = lastError?.message || "Unknown error";
    if (errorMessage.includes("404")) errorMessage += " (Model not found or API Key restriction)";
    if (errorMessage.includes("403")) errorMessage += " (Quota exceeded or API not enabled)";
    if (errorMessage.includes("400")) errorMessage += " (Invalid API Key or Request)";

    return {
        answer: `**Connection Failed** 🛑\n\nI tried 4 different AI models, but they all failed.\n\n**Error Details:**\n\`${errorMessage}\`\n\n**Potential Fixes:**\n1. Check if your API Key is valid in \`.env\`.\n2. Ensure "Google Generative AI API" is enabled in your Google Cloud Console.\n3. Verify your billing/quota status.`,
        actions: [{ label: "Retry", type: "retry" }, { label: "Check Console", type: "info" }]
    };
};
