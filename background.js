chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
chrome.browserAction.onClicked.addListener(() => chrome.tabs.create({
  // launch the URL (from the manifest to avoid duplication)
  url: chrome.runtime.getManifest().content_scripts[0].matches[0],
}));
  // format today's date for API
  const date = new Date();
  const monthDay = `${date.getMonth() + 1}/${date.getDate()}`;

  fetch(`https://www.checkiday.com/api.php?d=${monthDay}`)
    .then(resp => resp.json())
    .then(holidays => {
      chrome.contextMenus.removeAll();

      for (const holiday of holidays) {
        chrome.contextMenus.create({
          id: holiday,
          title: holiday,
          contexts: ['editable'],
          documentUrlPatterns: [sender.url],
        });
      }

      chrome.contextMenus.onClicked.addListener(({ menuItemId }) => {
        chrome.tabs.sendMessage(sender.tab.id, menuItemId);
      });

      return holidays.length;
    })
    .then(length => sendResponse(length));

  // return true to signify async
  return true;
});
