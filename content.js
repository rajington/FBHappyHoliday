// we must remember the last element we clicked so we know where to insert the message
let clickedTextArea;

// mouse event listener that persists the element clicked
function rememberRightClickedElement({ button, target }) {
  // right click
  if (button === 2) {
    clickedTextArea = target;
  }
}

// gets the available birthday message boxes
const nodes = document.querySelectorAll('#events_birthday_view textarea');

// adds presisting listeners to them
for (const textarea of Array.from(nodes)) {
  textarea.addEventListener('mousedown', rememberRightClickedElement);
}

// get the first name from the text area using vanilla js
function getFirstName() {
  const ancestor = clickedTextArea.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode
    .parentNode.parentNode;
  const nameNode = ancestor.querySelector('a');
  const firstName = nameNode.text.split(' ')[0];
  return firstName;
}

// sets the text on the visible text area and on the hidden input text field
function setText(text) {
  // the visible text area
  clickedTextArea.value = text;

  // the hidden input
  clickedTextArea.parentNode.parentNode.parentNode.parentNode.children[2].value = text;
}

// create the contextual menu by sending a default message
chrome.runtime.sendMessage(true, () => {
  // listen for contextual menu selections
  chrome.runtime.onMessage.addListener(holiday => {
    const firstName = getFirstName();
    setText(`Happy ${holiday} ${firstName}!`);
  });
});
