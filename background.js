function getHolidays(text) {
  const parser = new DOMParser();
  // server sometimes returns escaped HTML instead of XML entities...
  const xmlDoc = parser.parseFromString(text, 'text/html');

  const nodes = xmlDoc.querySelectorAll('item title');

  return Array.from(nodes).map(node => node.text);
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  fetch('https://www.checkiday.com/rss.php')
    .then(response => response.text())
    .then(getHolidays)
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
