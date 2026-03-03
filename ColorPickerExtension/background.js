// Listen for hot reload requests from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'hotReload') {
    performHotReload(sender.tab.id, sender.tab.url)
      .then(() => sendResponse({ success: true }))
      .catch((err) => sendResponse({ success: false, error: err.message }));
    return true; // Keep message channel open for async response
  }
});

// Perform hot reload function
async function performHotReload(tabId, tabUrl) {
  try {
    const url = new URL(tabUrl);
    const origins = [url.origin];

    // Clear cache for the tab's origin
    await chrome.browsingData.removeCache({
      origins: origins
    });

    // Clear other storage types
    await chrome.browsingData.remove({
      origins: origins
    }, {
      cacheStorage: true,
      serviceWorkers: true
    });

    // Hard reload the page (bypass cache)
    await chrome.tabs.reload(tabId, { bypassCache: true });

    return true;
  } catch (err) {
    console.error('Hot reload failed:', err);
    throw err;
  }
}
