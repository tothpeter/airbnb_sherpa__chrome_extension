const SearchPage = {
  boot() {
    document
      .querySelectorAll('[itemprop="itemListElement"]')
      .forEach(SearchPageListing.decorate);

    // Listen for new search results and decorate new listings
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        mutation.addedNodes.forEach((element) => {
          if (
            element.getAttribute &&
            element.getAttribute('itemprop') === 'itemListElement'
          ) {
            SearchPageListing.decorate(element);
          }
        });
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  },
};

class SearchPageListing {
  static decorate(listingElement) {
    new SearchPageListing(listingElement).decorate();
  }

  constructor(listingElement) {
    this.listingElement = listingElement;
    this.listingId = this.getListingId();
  }

  decorate() {
    // Skip if the listing was already decorated
    if (this.listingElement.querySelector('.hide-button')) return;

    this.hideOrShowListing();
    this.addButtons();
  }

  hideOrShowListing() {
    if (IgnoredListings.includes(this.listingId)) {
      this.listingElement.classList.add('hidden-listing');
    }
  }

  addButtons() {
    const hideButton = document.createElement('button');
    hideButton.textContent = 'Hide';
    hideButton.classList.add('hide-button');

    hideButton.addEventListener('click', () => {
      this.hideListing();
    });

    this.listingElement.appendChild(hideButton);

    const showButton = document.createElement('button');
    showButton.textContent = 'Show';
    showButton.classList.add('show-button');

    showButton.addEventListener('click', () => {
      this.showListing();
    });

    this.listingElement.appendChild(showButton);
  }

  hideListing() {
    this.listingElement.classList.add('hidden-listing');
    IgnoredListings.add(this.listingId);
  }

  showListing() {
    this.listingElement.classList.remove('hidden-listing');
    IgnoredListings.remove(this.listingId);
  }

  getListingId() {
    const urlElement = this.listingElement.querySelector('[itemprop="url"]');
    // the URL is like "www.airbnb.com/rooms/846234228646563727?adults..."
    const url = urlElement.getAttribute('content');
    return url.match(/\/rooms\/(\d+)/)?.[1];
  }
}
