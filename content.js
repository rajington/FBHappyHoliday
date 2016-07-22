// create the context menu by sending a wakeup
chrome.runtime.sendMessage(true);
// console.log('waking up background');
// chrome.runtime.sendMessage(true, response => {
//   console.log(`background responded: ${response}`);
// });

// get the first name starting from the text area using vanilla js
function getFirstName(textarea) {
  const ancestor = textarea.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode
    .parentNode.parentNode;
  const nameNode = ancestor.querySelector('a');
  const firstName = nameNode.text.split(' ')[0];
  return firstName;
}

// listen for contextual menu selections
chrome.runtime.onMessage.addListener(holiday => {
  if (location.pathname !== '/events/birthdays') {
    location.pathname = '/events/birthdays';
  } else {
    const firstName = getFirstName(document.activeElement);
    // console.log(`updating ${document.activeElement.id} with ${holiday} and ${firstName}`);
    // set the text on the visible text area and fire the event
    const hashtagHoliday = holiday.replace(/[^a-zA-z]/g, '');
    document.activeElement.value = `Happy #${hashtagHoliday} ${firstName}!`;
    document.activeElement.dispatchEvent(new Event('change'));
  }
});
