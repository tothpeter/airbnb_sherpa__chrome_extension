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
  addButtons(listing);
}

function addButtons(listing) {
  const hideButton = document.createElement('button');
  hideButton.textContent = 'Hide';
  hideButton.classList.add('hide-button');

  hideButton.addEventListener('click', () => {
    hideListing(listing);
  });

  listing.appendChild(hideButton);

  const showButton = document.createElement('button');
  showButton.textContent = 'Show';
  showButton.classList.add('show-button');

  showButton.addEventListener('click', () => {
    showListing(listing);
  });

  listing.appendChild(showButton);
}

function hideListing(listing) {
  listing.classList.add('hidden-listing');
}

function showListing(listing) {
  listing.classList.remove('hidden-listing');
}
