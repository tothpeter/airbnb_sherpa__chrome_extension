(() => {
  chrome.runtime.onMessage.addListener((obj, sender, response) => {
    console.log('------ URL CHANGED ------');
  });
})();
