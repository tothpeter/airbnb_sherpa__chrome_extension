class ListingPage {
  static boot() {
    // Skip if we are not on a listing show page
    if (!window.location.href.includes('/rooms/')) return;

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        mutation.addedNodes.forEach((element) => {
          // Ignore inserting the ignore container
          if (element.nodeName !== 'SECTION') {
            return;
          }

          ListingPage.decorate();
        });
      }
    });

    observer.observe(
      document.querySelector('[data-section-id="TITLE_DEFAULT"]'),
      {
        childList: true,
        subtree: true,
      }
    );
  }

  static decorate() {
    new ListingPage().decorate();
  }

  constructor() {
    this.listingId = window.location.href.match(/\/rooms\/(\d+)/)?.[1];
    this.shareButton = document.querySelector(
      '[data-section-id="TITLE_DEFAULT"] section button'
    );
    this.shareButtonContainer = this.shareButton.parentNode;

    this.container = null;
  }

  decorate() {
    this.createContainer();
    this.addIgnoreButton();
    this.addShowButton();

    this.shareButtonContainer.before(this.container);
  }

  createContainer() {
    this.container = document.createElement('div');
    this.container.setAttribute(
      'class',
      this.shareButtonContainer.getAttribute('class')
    );

    if (IgnoredListings.includes(this.listingId)) {
      this.container.classList.add('ignored-listing');
    }
  }

  addIgnoreButton() {
    const button = document.createElement('button');
    button.textContent = 'Ignore';
    button.setAttribute('class', this.shareButton.getAttribute('class'));
    button.classList.add('ignore-button');

    button.addEventListener('click', () => {
      this.ignoreListing();
    });

    this.container.appendChild(button);
  }

  addShowButton() {
    const button = this.shareButton.cloneNode(true);
    button.classList.add('show-button');

    // Replace the share icon with the eye icon
    const svg = button.querySelector('svg');
    svg.innerHTML =
      '<path d="M22 12C22 12 19 18 12 18C5 18 2 12 2 12C2 12 5 6 12 6C19 6 22 12 22 12Z"/> <circle cx="12" cy="12" r="3"/> <path d="M3 21L20 4"/>';
    svg.setAttribute('viewBox', '0 0 24 24');

    button.querySelector('div').lastChild.textContent = 'Ignored';

    button.addEventListener('click', () => {
      this.showListing();
    });

    this.container.appendChild(button);
  }

  ignoreListing() {
    this.container.classList.add('ignored-listing');
    IgnoredListings.add(this.listingId);
  }

  showListing() {
    this.container.classList.remove('ignored-listing');
    IgnoredListings.remove(this.listingId);
  }
}
