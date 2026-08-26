// Placeholder URL for frontend showcase
const EDGE_FUNCTION_URL = "https://your-project.supabase.co/functions/v1/process-voice";

chrome.commands.onCommand.addListener((command) => {
    if (command === "toggle-recording") {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs[0]) {
                chrome.tabs.sendMessage(tabs[0].id, { action: "toggle-recording" });
            }
        });
    }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'process-audio') {
        const { audio, tone } = request;

        // Check if user is authenticated (mocked here, should check Supabase session token)
        chrome.storage.sync.get(['supabaseToken'], (data) => {
            const token = data.supabaseToken;

            if (!token) {
                // Return a clear error if no token is found
                sendResponse({
                    success: false,
                    error: "No authentication token found. Please log in to Utterly."
                });
                return;
            }

            // Convert base64 back to Blob and send to Supabase Edge Function
            // In a real implementation, we would send the base64 or form data.
            fetch(EDGE_FUNCTION_URL, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    audio: audio, // base64 payload
                    tone: tone
                })
            })
                .then(res => {
                    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                    return res.json();
                })
                .then(data => {
                    sendResponse({
                        success: true,
                        rawTranscript: data.raw_transcript,
                        polishedText: data.polished_text,
                        clarityScore: data.clarity_score
                    });
                })
                .catch(error => {
                    console.error("Processing Error:", error);
                    sendResponse({
                        success: false,
                        error: error.message
                    });
                });
        });

        // To make the background script wait for the async fetch to complete before replying
        return true;
    }
});
