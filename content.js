let clickedEl;

document.addEventListener('mousedown', ({ button, target }) => {
  // right click
  if (button === 2) {
    clickedEl = target;
  }
}, true);

chrome.runtime.sendMessage(true, () => {
  chrome.runtime.onMessage.addListener(holiday => {
    const ancestor = clickedEl.parentNode.parentNode.parentNode.parentNode
      .parentNode.parentNode.parentNode.parentNode;
    const nameNode = ancestor.querySelector('a');
    const firstName = nameNode.text.split(' ')[0];
    clickedEl.value = `Happy ${holiday} ${firstName}!`;
  });
});
