// DUSTOR background.js
let blockedStats = { ads: 0, trackers: 0 };
let settings = {
  blockAds: true,
  blockTrackers: true,
  customDomains: []
};

const adDomains = [
  'doubleclick.net', 'adservice.google.com', 'googlesyndication.com', 'adnxs.com',
  'ads.yahoo.com', 'adform.net', 'adroll.com', 'taboola.com', 'outbrain.com',
  // Add more ad domains as needed
];
const trackerDomains = [
  'google-analytics.com', 'facebook.com/tr', 'scorecardresearch.com', 'quantserve.com',
  'hotjar.com', 'mixpanel.com', 'segment.com', 'newrelic.com',
  // Add more tracker domains as needed
];

function isAd(url) {
  return adDomains.some(domain => url.includes(domain));
}
function isTracker(url) {
  return trackerDomains.some(domain => url.includes(domain));
}
function isCustom(url) {
  return settings.customDomains.some(domain => url.includes(domain));
}

function updateSettings() {
  chrome.storage.sync.get(['blockAds', 'blockTrackers', 'customDomains'], (data) => {
    settings.blockAds = data.blockAds !== false;
    settings.blockTrackers = data.blockTrackers !== false;
    settings.customDomains = data.customDomains || [];
  });
}

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ blockedStats: { ads: 0, trackers: 0 } });
  updateSettings();
});

chrome.runtime.onStartup.addListener(updateSettings);
chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === 'settings-updated') updateSettings();
});

chrome.declarativeNetRequest.onRuleMatchedDebug.addListener((info) => {
  const url = info.request.url;
  let updated = false;
  if (settings.blockAds && isAd(url)) {
    blockedStats.ads++;
    updated = true;
  }
  if (settings.blockTrackers && isTracker(url)) {
    blockedStats.trackers++;
    updated = true;
  }
  if (isCustom(url)) {
    blockedStats.ads++;
    updated = true;
  }
  if (updated) {
    chrome.storage.local.set({ blockedStats });
  }
}); 