// create the context menu by sending a wakeup
chrome.runtime.sendMessage(true);

// we must remember which text area the context menu was triggered
let clickedTextArea;

// mouse event listener that persists the element triggered
function rememberRightClickedElement({ button, target }) {
  // check if right click, meaning context menu triggered
  if (button === 2) {
    // console.log(`remembering ${target}`);
    clickedTextArea = target;
  }
}

// gets the available birthday message boxes
const nodes = document.querySelectorAll('#events_birthday_view textarea');

// adds presisting listeners to them
for (const textarea of Array.from(nodes)) {
  textarea.addEventListener('mousedown', rememberRightClickedElement);
}
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
  const firstName = getFirstName(clickedTextArea);
  // console.log(`updating ${clickedTextArea.id} with ${holiday} and ${firstName}`);
  // set the text on the visible text area and fire the event
  clickedTextArea.value = `Happy ${holiday} ${firstName}!`;
  clickedTextArea.dispatchEvent(new Event('change'));
});
