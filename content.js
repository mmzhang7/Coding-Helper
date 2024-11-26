document.addEventListener("mouseup", () => {
  let selectedText = window.getSelection().toString();
  if (selectedText) {
    chrome.runtime.sendMessage({ action: 'show_popup', selectedText: selectedText });
  }
});
