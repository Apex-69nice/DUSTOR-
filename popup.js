// popup.js

function loadStats() {
  chrome.storage.local.get(['blockedStats'], (result) => {
    const stats = result.blockedStats || { ads: 0, trackers: 0 };
    document.getElementById('ads-blocked').textContent = stats.ads;
    document.getElementById('trackers-blocked').textContent = stats.trackers;
  });
}

document.addEventListener('DOMContentLoaded', () => {
  loadStats();
  document.getElementById('refresh-btn').addEventListener('click', loadStats);
}); 