const toggleBtn = document.getElementById("toggle-toolbar");
const alwaysOnCb = document.getElementById("always-on");
const autoCopyCb = document.getElementById("auto-copy");
const restrictedMsg = document.getElementById("restricted");

let currentTab = null;
let toolbarVisible = false;

function isRestricted(url) {
  return !url || /^(chrome|chrome-extension|edge|about|devtools|view-source):/.test(url);
}

function updateToggleBtn() {
  toggleBtn.textContent = toolbarVisible ? "Hide Toolbar" : "Show Toolbar";
  toggleBtn.classList.toggle("off", !toolbarVisible);
}

async function init() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  currentTab = tab;

  // Load settings
  const settings = await chrome.storage.local.get(["alwaysOn", "autoCopy"]);
  alwaysOnCb.checked = !!settings.alwaysOn;
  autoCopyCb.checked = !!settings.autoCopy;

  if (isRestricted(tab?.url)) {
    toggleBtn.style.display = "none";
    restrictedMsg.style.display = "block";
    return;
  }

  // Get toolbar state from content script
  try {
    const resp = await chrome.tabs.sendMessage(tab.id, { type: "GET_STATE" });
    toolbarVisible = !!resp?.toolbarVisible;
  } catch {
    toolbarVisible = false;
  }
  updateToggleBtn();
}

toggleBtn.addEventListener("click", async () => {
  if (!currentTab || isRestricted(currentTab.url)) return;

  // Ensure content script is loaded
  try {
    await chrome.tabs.sendMessage(currentTab.id, { type: "PING" });
  } catch {
    await chrome.scripting.executeScript({
      target: { tabId: currentTab.id },
      files: ["content.js"],
    });
    await new Promise((r) => setTimeout(r, 150));
  }

  await chrome.tabs.sendMessage(currentTab.id, { type: "TOGGLE_TOOLBAR" });
  toolbarVisible = !toolbarVisible;
  updateToggleBtn();
});

alwaysOnCb.addEventListener("change", () => {
  chrome.storage.local.set({ alwaysOn: alwaysOnCb.checked });
});

autoCopyCb.addEventListener("change", () => {
  chrome.storage.local.set({ autoCopy: autoCopyCb.checked });
});

init();
