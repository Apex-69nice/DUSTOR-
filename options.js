document.addEventListener('DOMContentLoaded', () => {
  const blockAds = document.getElementById('block-ads');
  const blockTrackers = document.getElementById('block-trackers');
  const customDomains = document.getElementById('custom-domains');
  const status = document.getElementById('status');

  // Load settings
  chrome.storage.sync.get(['blockAds', 'blockTrackers', 'customDomains'], (data) => {
    blockAds.checked = data.blockAds !== false;
    blockTrackers.checked = data.blockTrackers !== false;
    customDomains.value = (data.customDomains || []).join(', ');
  });

  // Save settings
  document.getElementById('settings-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const domains = customDomains.value.split(',').map(d => d.trim()).filter(Boolean);
    chrome.storage.sync.set({
      blockAds: blockAds.checked,
      blockTrackers: blockTrackers.checked,
      customDomains: domains
    }, () => {
      status.textContent = 'Settings saved!';
      setTimeout(() => status.textContent = '', 1500);
      chrome.runtime.sendMessage({ type: 'settings-updated' });
    });
  });
}); 