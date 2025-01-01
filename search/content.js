// =================================== Functions ===============================
function processListing(listing) {
  // Skip if the listing was already processed
  if (listing.querySelector('.hide-button')) return;

  hideOrShowListing(listing);
  addButtons(listing);
}

function hideOrShowListing(listing) {
  const listingId = getListingIdFrom(listing);

  if (hiddenListingIds[listingId]) {
    listing.classList.add('hidden-listing');
  }
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

  const listingId = getListingIdFrom(listing);

  storeHiddenListingId(listingId);
}

function showListing(listing) {
  listing.classList.remove('hidden-listing');

  const listingId = getListingIdFrom(listing);

  removeHiddenListingId(listingId);
}

function getListingIdFrom(listing) {
  const urlElement = listing.querySelector('[itemprop="url"]');
  // the URL is like "www.airbnb.com/rooms/846234228646563727?adults..."
  const url = urlElement.getAttribute('content');
  return url.match(/\/rooms\/(\d+)/)?.[1];
}

function storeHiddenListingId(listingId) {
  hiddenListingIds[listingId] = true;
  chrome.storage.local.set({ hiddenListingIds });
}

function removeHiddenListingId(listingId) {
  delete hiddenListingIds[listingId];
  chrome.storage.local.set({ hiddenListingIds });
}

function boot() {
  document
    .querySelectorAll('[itemprop="itemListElement"]')
    .forEach(processListing);

  // Listen for new search results and processes new listings
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      mutation.addedNodes.forEach((element) => {
        if (
          element.getAttribute &&
          element.getAttribute('itemprop') === 'itemListElement'
        ) {
          processListing(element);
        }
      });
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

// =================================== Boot ====================================

let hiddenListingIds;

chrome.storage.local.get(['hiddenListingIds'], (result) => {
  hiddenListingIds = result.hiddenListingIds || {};
  boot();
});
