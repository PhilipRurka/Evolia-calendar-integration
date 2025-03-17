chrome.runtime.onMessage.addListener((request, sender) => {
  if (request.action === "injectScript" && sender.tab) {
    console.log("Injecting script for tab:", sender.tab.id);

    chrome.scripting.executeScript({
      target: { tabId: sender.tab.id },
      func: (scriptContent) => {
        const scriptTag = document.createElement("script");
        scriptTag.textContent = scriptContent;
        document.documentElement.appendChild(scriptTag);
        scriptTag.remove();
      },
      args: [request.script],
      world: "MAIN",
    });
  }

  if (request.action === "getGoogleAuthToken") {
    chrome.identity.getAuthToken({ interactive: true }, (token) => {
      if (chrome.runtime.lastError) {
        console.error("❌ Google Authentication Failed:", chrome.runtime.lastError);
        sendResponse({ error: chrome.runtime.lastError.message });
      } else {
        console.log("✅ Google OAuth Token:", token);
        sendResponse({ token });
      }
    });
    return true; // Keep `sendResponse` alive for async
  }
});
