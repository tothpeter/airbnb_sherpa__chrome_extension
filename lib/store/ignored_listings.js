class IgnoredListings {
  static hiddenListingIds = {};

  static load(callback) {
    chrome.storage.local.get(['hiddenListingIds'], (result) => {
      this.hiddenListingIds = result.hiddenListingIds || {};
      callback();
    });
  }

  static add(listingId) {
    this.hiddenListingIds[listingId] = true;
    chrome.storage.local.set({ hiddenListingIds: this.hiddenListingIds });
  }

  static remove(listingId) {
    delete this.hiddenListingIds[listingId];
    chrome.storage.local.set({ hiddenListingIds: this.hiddenListingIds });
  }

  static includes(listingId) {
    return this.hiddenListingIds[listingId];
  }
}
