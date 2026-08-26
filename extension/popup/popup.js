document.addEventListener('DOMContentLoaded', () => {
  const toneSelect = document.getElementById('toneSelect');
  const activeToggle = document.getElementById('activeToggle');

  // Load saved settings
  chrome.storage.sync.get(['utterlyTone', 'utterlyActive'], (data) => {
    if (data.utterlyTone) {
      toneSelect.value = data.utterlyTone;
    }
    if (data.utterlyActive !== undefined) {
      activeToggle.checked = data.utterlyActive;
    }
  });

  // Save settings when changed
  toneSelect.addEventListener('change', (e) => {
    chrome.storage.sync.set({ utterlyTone: e.target.value });
  });

  activeToggle.addEventListener('change', (e) => {
    chrome.storage.sync.set({ utterlyActive: e.target.checked });
  });

  // Handle shortcut customize
  document.getElementById('customizeBtn').addEventListener('click', () => {
    chrome.tabs.create({ url: 'chrome://extensions/shortcuts' });
  });

  // Handle options link
  document.getElementById('settingsLink').addEventListener('click', (e) => {
    e.preventDefault();
    if (chrome.runtime.openOptionsPage) {
      chrome.runtime.openOptionsPage();
    } else {
      window.open(chrome.runtime.getURL('options.html'));
    }
  });

  // Listen for messages from background/content scripts to update status
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'UPDATE_STATUS') {
      updateStatus(request.status, request.text);
    }
  });

  function updateStatus(status, text) {
    const indicator = document.getElementById('statusIndicator');
    const statusText = document.getElementById('statusText');
    
    indicator.className = `indicator ${status}`;
    statusText.textContent = text || 'Ready to capture';
  }
});
