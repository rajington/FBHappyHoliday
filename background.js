chrome.browserAction.onClicked.addListener(() => chrome.tabs.create({
  // launch the URL (from the manifest to avoid duplication)
  url: chrome.runtime.getManifest().content_scripts[0].matches[0],
}));

let cache = null;

chrome.runtime.onMessage.addListener((request, sender) => {
  // trigger sending context menu clicks to this tab as well
  chrome.contextMenus.onClicked.addListener(({ menuItemId }) => {
    chrome.tabs.sendMessage(sender.tab.id, menuItemId);
  });

  // format today's date for API
  const date = new Date();
  const monthDay = `${date.getMonth() + 1}/${date.getDate()}`;

  // if we haven't gotten data yet or for today
  if (cache == null || cache !== monthDay) {
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

        // we don't need to update
        cache = monthDay;
      });

    // return true to signify async
    return true;
  }

  return false;
});
