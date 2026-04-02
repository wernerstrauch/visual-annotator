/**
 * Visual Annotator — Background Service Worker
 *
 * Handles:
 * - Extension icon click → toggle toolbar in active tab
 * - Keyboard shortcut → toggle toolbar
 * - Screenshot capture requests from content script
 */

function isRestrictedUrl(url) {
  if (!url) return true;
  return /^(chrome|chrome-extension|edge|about|devtools|view-source):/.test(url);
}

async function toggleToolbar(tab) {
  if (!tab?.id || isRestrictedUrl(tab.url)) {
    return;
  }

  // Ensure content script is injected
  try {
    await chrome.tabs.sendMessage(tab.id, { type: "PING" });
  } catch {
    try {
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["content.js"],
      });
      await new Promise((r) => setTimeout(r, 150));
    } catch (err) {
      console.error("[visual-annotator] Injection failed:", err.message);
      return;
    }
  }

  chrome.tabs.sendMessage(tab.id, { type: "TOGGLE_TOOLBAR" });
}

// Keyboard shortcut
chrome.commands.onCommand.addListener(async (command) => {
  if (command === "toggle-toolbar") {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab) toggleToolbar(tab);
  }
});

// Messages from content script
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === "SAVE_SCREENSHOT") {
    chrome.downloads.download({
      url: msg.dataUrl,
      filename: msg.filename,
      conflictAction: "uniquify",
      saveAs: false,
    }, (downloadId) => {
      if (chrome.runtime.lastError || !downloadId) {
        sendResponse({ error: chrome.runtime.lastError?.message || "Download failed" });
        return;
      }
      // Data-URL downloads complete near-instantly; fetch resolved absolute path
      chrome.downloads.search({ id: downloadId }, (results) => {
        const item = results?.[0];
        if (item?.state === "complete") {
          sendResponse({ path: item.filename });
        } else {
          // Rare: still in progress — poll once
          const onChanged = (delta) => {
            if (delta.id !== downloadId || !delta.state) return;
            chrome.downloads.onChanged.removeListener(onChanged);
            chrome.downloads.search({ id: downloadId }, (r) => {
              sendResponse({ path: r[0]?.filename || msg.filename });
            });
          };
          chrome.downloads.onChanged.addListener(onChanged);
        }
      });
    });
    return true;
  }

  if (msg.type === "CAPTURE_SCREENSHOT") {
    if (!sender.tab?.windowId) {
      sendResponse({ error: "No window ID" });
      return true;
    }
    chrome.tabs.captureVisibleTab(sender.tab.windowId, { format: "png" }, (dataUrl) => {
      if (chrome.runtime.lastError) {
        sendResponse({ error: chrome.runtime.lastError.message });
      } else {
        sendResponse({ dataUrl });
      }
    });
    return true;
  }
});

