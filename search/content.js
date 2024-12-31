// Listens for new search results and processes new listings
const observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    const addedElements = Array.from(mutation.addedNodes);

    addedElements.forEach(element => {
      if (element.getAttribute && element.getAttribute('itemprop') === 'itemListElement') {
        processListing(element);
      }
    });
  }
 });

 observer.observe(document.body, {
  childList: true,
  subtree: true
 });

function processListing(listing) {
  addHideButton(listing);
}

function addHideButton(listing) {
  const hideButton = document.createElement('button');
  hideButton.textContent = 'Hide';

  listing.appendChild(hideButton);
}
