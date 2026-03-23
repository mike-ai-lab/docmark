// Listen for hot reload requests from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'hotReload') {
    performHotReload(sender.tab.id, sender.tab.url, request.mode)
      .then(() => sendResponse({ success: true }))
      .catch((err) => sendResponse({ success: false, error: err.message }));
    return true; // Keep message channel open for async response
  }
});

// Perform hot reload function with different modes
async function performHotReload(tabId, tabUrl, mode = 'soft') {
  try {
    const url = new URL(tabUrl);
    const origins = [url.origin];

    if (mode === 'soft') {
      // Quick refresh: Just reload the page
      // Preserves: API keys, embeddings, models, chats, everything
      await chrome.tabs.reload(tabId, { bypassCache: false });
    } else if (mode === 'medium') {
      // Fresh assets: Clear HTTP cache to get fresh HTML/CSS/JS
      // Preserves: API keys, embeddings, models, chats (localStorage + IndexedDB)
      await chrome.browsingData.removeCache({
        origins: origins
      });
      await chrome.tabs.reload(tabId, { bypassCache: true });
    } else if (mode === 'hard') {
      // Deep clean: Clear cache + service workers
      // Preserves: API keys, embeddings, models, chats (localStorage + IndexedDB)
      await chrome.browsingData.removeCache({
        origins: origins
      });
      await chrome.browsingData.remove({
        origins: origins
      }, {
        cacheStorage: true,
        serviceWorkers: true
        // NOTE: localStorage and indexedDB are NOT included here
        // This preserves API keys, embeddings, and all user data
      });
      await chrome.tabs.reload(tabId, { bypassCache: true });
    }

    return true;
  } catch (err) {
    console.error('Hot reload failed:', err);
    throw err;
  }
}
