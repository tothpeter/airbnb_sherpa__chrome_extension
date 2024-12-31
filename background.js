chrome.tabs.onUpdated.addListener((tabId, tab) => {
  if (tab.url && tab.url.includes("airbnb.com/s/")) {
    chrome.tabs.sendMessage(tabId, null);
  }
});
