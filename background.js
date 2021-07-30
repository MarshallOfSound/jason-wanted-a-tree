chrome.tabs.onUpdated.addListener((tabId, changeInfo, ...args) => {
  if (changeInfo.status === 'complete') {
    chrome.tabs.sendMessage(tabId, 'ping');
  }
});
