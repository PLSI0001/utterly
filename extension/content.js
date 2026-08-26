let isRecording = false;
let mediaRecorder = null;
let audioChunks = [];
let targetInputElement = null;
let recordingTimer = null;
let recordingStartTime = 0;
const MAX_RECORDING_MS = 240000; // 240 seconds

// Inject DOM flag for website to detect extension
const metaTag = document.createElement('meta');
metaTag.name = 'utterly-installed';
metaTag.content = 'true';
document.head.appendChild(metaTag);
document.documentElement.setAttribute('data-utterly-installed', 'true');

// Create visual indicator UI
const indicatorUI = document.createElement('div');
indicatorUI.id = 'utterly-indicator';
indicatorUI.style.display = 'none';
indicatorUI.innerHTML = `
  <div class="utterly-pulse"></div>
  <span class="utterly-time">0:00</span>
  <span class="utterly-text">Recording...</span>
`;
document.body.appendChild(indicatorUI);

// Create Undo UI
const undoUI = document.createElement('div');
undoUI.id = 'utterly-undo';
undoUI.style.display = 'none';
undoUI.innerHTML = `
  <span>Text inserted. </span>
  <button id="utterly-undo-btn">Undo</button>
`;
document.body.appendChild(undoUI);

let lastRawTranscript = '';
let lastSelectionStart = 0;
let lastSelectionEnd = 0;
let lastTargetElement = null;

document.getElementById('utterly-undo-btn').addEventListener('click', () => {
    if (lastTargetElement && lastRawTranscript) {
        lastTargetElement.value = lastTargetElement.value.substring(0, lastSelectionStart)
            + lastRawTranscript
            + lastTargetElement.value.substring(lastSelectionEnd);
        undoUI.style.display = 'none';
    }
});

// Focus tracking
document.addEventListener('focusin', (e) => {
    const el = e.target;
    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable) {
        targetInputElement = el;
    }
});

// Listen for messages from background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'toggle-recording') {
        if (isRecording) {
            stopRecording();
        } else {
            startRecording();
        }
    }
});

async function startRecording() {
    if (!targetInputElement) {
        alert("Utterly: Please click inside a text field first.");
        return;
    }

    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder = new MediaRecorder(stream);
        audioChunks = [];

        mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                audioChunks.push(event.data);
            }
        };

        mediaRecorder.onstop = async () => {
            stream.getTracks().forEach(track => track.stop());
            const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
            processAudio(audioBlob);
        };

        mediaRecorder.start();
        isRecording = true;
        recordingStartTime = Date.now();
        showIndicator(true);

        recordingTimer = setInterval(() => {
            const elapsed = Date.now() - recordingStartTime;
            updateIndicatorTime(elapsed);
            if (elapsed >= MAX_RECORDING_MS) {
                stopRecording();
                alert("Utterly: Maximum recording time (240s) reached.");
            }
        }, 1000);

        chrome.runtime.sendMessage({ type: 'UPDATE_STATUS', status: 'recording', text: 'Recording...' });

    } catch (err) {
        console.error('Microphone access denied or error:', err);
        alert('Utterly: Microphone access denied. Please enable it in site settings.');
    }
}

function stopRecording() {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        mediaRecorder.stop();
        isRecording = false;
        clearInterval(recordingTimer);
        showIndicator(false);
        showProcessing();
        chrome.runtime.sendMessage({ type: 'UPDATE_STATUS', status: 'processing', text: 'Processing...' });
    }
}

function showIndicator(show) {
    if (show) {
        indicatorUI.style.display = 'flex';
        indicatorUI.className = 'recording';
        indicatorUI.querySelector('.utterly-text').textContent = 'Recording...';
    } else {
        indicatorUI.style.display = 'none';
    }
}

function updateIndicatorTime(ms) {
    const seconds = Math.floor(ms / 1000);
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    indicatorUI.querySelector('.utterly-time').textContent = `${m}:${s.toString().padStart(2, '0')}`;
}

function showProcessing() {
    indicatorUI.style.display = 'flex';
    indicatorUI.className = 'processing';
    indicatorUI.querySelector('.utterly-text').textContent = 'Processing...';
    indicatorUI.querySelector('.utterly-time').textContent = '';
}

async function processAudio(blob) {
    chrome.storage.sync.get(['utterlyTone'], async (data) => {
        const tone = data.utterlyTone || 'Professional';

        // Convert Blob to Base64 to send to background script
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
            const base64Audio = reader.result;
            chrome.runtime.sendMessage({
                action: 'process-audio',
                audio: base64Audio,
                tone: tone
            }, (response) => {
                indicatorUI.style.display = 'none';
                chrome.runtime.sendMessage({ type: 'UPDATE_STATUS', status: 'idle', text: 'Ready' });

                if (response && response.success) {
                    insertText(response.polishedText, response.rawTranscript);
                } else {
                    alert('Utterly Error: ' + (response?.error || 'Failed to process audio'));
                }
            });
        };
    });
}

function insertText(text, raw) {
    if (!targetInputElement) return;

    lastRawTranscript = raw;
    lastTargetElement = targetInputElement;

    if (targetInputElement.isContentEditable) {
        // Handle content editable
        const selection = window.getSelection();
        const range = selection.getRangeAt(0);
        range.deleteContents();
        range.insertNode(document.createTextNode(text));
    } else {
        // Handle input/textarea
        const startPos = targetInputElement.selectionStart;
        const endPos = targetInputElement.selectionEnd;
        lastSelectionStart = startPos;
        lastSelectionEnd = startPos + text.length;

        targetInputElement.value = targetInputElement.value.substring(0, startPos)
            + text
            + targetInputElement.value.substring(endPos, targetInputElement.value.length);

        targetInputElement.selectionStart = lastSelectionEnd;
        targetInputElement.selectionEnd = lastSelectionEnd;
    }

    // Trigger input event to notify frameworks (React, etc)
    targetInputElement.dispatchEvent(new Event('input', { bubbles: true }));

    showUndo();
}

function showUndo() {
    undoUI.style.display = 'flex';
    setTimeout(() => {
        undoUI.style.display = 'none';
    }, 5000);
}
