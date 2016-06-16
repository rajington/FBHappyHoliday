chrome.browserAction.onClicked.addListener(() => chrome.tabs.create({
  url: 'https://www.facebook.com/events/birthdays',
}));

// trigger sending context menu clicks to the tab that sent it
chrome.contextMenus.onClicked.addListener(({ menuItemId }, tab) => {
  chrome.tabs.sendMessage(tab.id, menuItemId);
});

let cache = null;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // console.log(`received message, cache is: ${cache}`);

  // format today's date for API
  const date = new Date();
  const monthDay = `${date.getMonth() + 1}/${date.getDate()}`;

  // console.log(`cache is: ${cache}, monthDay is ${monthDay}`);
  // if we haven't gotten data yet or for today
  if (cache == null || cache !== monthDay) {
    fetch(`https://www.checkiday.com/api.php?d=${monthDay}`)
      .then(resp => resp.json())
      .then(holidays => {
        // console.log(`clearing contextMenu, adding ${holidays.length} holidays`);
        chrome.contextMenus.removeAll();

        for (const holiday of holidays) {
          chrome.contextMenus.create({
            id: holiday,
            title: holiday,
            contexts: ['editable'],
            documentUrlPatterns: chrome.runtime.getManifest().content_scripts[0].matches,
          });
        }

        // we don't need to update
        cache = monthDay;
        sendResponse(`updated: ${monthDay}`);
      });

    // return true to signify async
    return true;
  }

  sendResponse(`cached: ${monthDay}`);
  return false;
});
