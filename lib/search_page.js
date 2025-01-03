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
    if (this.listingElement.querySelector('.ignore-button')) return;

    this.hideOrShowListing();
    this.addIgnoreButton();
    this.addShowButton();
  }

  hideOrShowListing() {
    if (IgnoredListings.includes(this.listingId)) {
      this.listingElement.classList.add('ignored-listing');
    }
  }

  addIgnoreButton() {
    const button = document.createElement('button');
    button.textContent = 'Ignore';
    button.classList.add('ignore-button');

    button.addEventListener('click', () => {
      this.ignoreListing();
    });

    this.listingElement.appendChild(button);
  }

  addShowButton() {
    const button = document.createElement('button');
    button.textContent = 'Show';
    button.classList.add('show-button');

    button.addEventListener('click', () => {
      this.showListing();
    });

    this.listingElement.appendChild(button);
  }

  ignoreListing() {
    this.listingElement.classList.add('ignored-listing');
    IgnoredListings.add(this.listingId);
  }

  showListing() {
    this.listingElement.classList.remove('ignored-listing');
    IgnoredListings.remove(this.listingId);
  }

  getListingId() {
    const urlElement = this.listingElement.querySelector('[itemprop="url"]');
    // the URL is like "www.airbnb.com/rooms/846234228646563727?adults..."
    const url = urlElement.getAttribute('content');
    return url.match(/\/rooms\/(\d+)/)?.[1];
  }
}
