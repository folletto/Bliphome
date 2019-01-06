import {goo} from './goo.js';
import {Bookmark} from './goo.bookmark.js';
import {Motivational} from './goo.motivational.js';

const BOOKMARKS_FOLDER_NAME = 'New tab'; // case insensitive
const ERROR_FOLDER_MISSING = Symbol('Folder missing');
const ERROR_FOLDER_EMPTY = Symbol('Folder empty');

export class Root {
  constructor() {
    this.bookmarkFolderNewTab = null;
    this.latestError = null;
    this.countTest = 0;
  }

  render() {
    return `
      <div class="shelf">${this.renderBookmarks()}</div>
      ${goo.render(Motivational)}
    `;
  }

  renderBookmarks() {
    let out = '';

    if (this.bookmarkFolderNewTab == null) {
      if (this.latestError == ERROR_FOLDER_MISSING) out = this.renderFolderIsMissing();
      else if (this.latestError == ERROR_FOLDER_EMPTY) out = this.renderFolderIsEmpty();
      else this.getBookmarks();
    } else {
      for (let bookmark of this.bookmarkFolderNewTab.children) {
        if (!bookmark.children) {
          //out += '<div>' + bookmark.url + '</div>';
          out += goo.render(Bookmark, bookmark);
        }
      }
    }

    return out;
  }

  getBookmarks() {
    var self = this;
    this.latestError = null;

    chrome.bookmarks.getTree(function(bookmarks) {
      let bookmarkFolderNewTab = self.searchBookmarksFolder(BOOKMARKS_FOLDER_NAME, bookmarks);
      if (bookmarkFolderNewTab) {
        if (bookmarkFolderNewTab.children) {
          if (bookmarkFolderNewTab.children.length > 0) {
            self.bookmarkFolderNewTab = bookmarkFolderNewTab;
          } else {
            self.latestError = ERROR_FOLDER_EMPTY;
          }
        }
      } else {
        self.latestError = ERROR_FOLDER_MISSING;

        // Create bookmark folder then!
        chrome.bookmarks.create(
          { title: BOOKMARKS_FOLDER_NAME },
          () => {
            self.latestError = ERROR_FOLDER_EMPTY;
            goo.refresh(self);
          }
        );
      }

      goo.refresh(self);
    });
  }

  renderFolderIsMissing() {
    return `
      <div class="root__error">
        <p>
          No bookmark folder name '${BOOKMARKS_FOLDER_NAME}' found.<br/>
          Open the Bookmarks Manager and create one.
        </p>
        <button class="mdc-button" ${goo.onClick(this.onClickBookmarksManager.bind(this))}>Open bookmarks manager</button>
      </div>
    `;
  }

  renderFolderIsEmpty() {
    console.log(this.bookmarkFolderNewTab)
    return `
      <div class="root__error">
        <p>
          The bookmark folder '${BOOKMARKS_FOLDER_NAME}' is empty.<br/>
          Open the Bookmarks Manager and add new bookmarks inside '${BOOKMARKS_FOLDER_NAME}'.
        </p>
        <button class="mdc-button" ${goo.onClick(this.onClickBookmarksManager.bind(this))}>Open bookmarks manager</button>
      </div>
    `;
  }

  onClickBookmarksManager(event) {
    // Necessary workaround due to Chrome security locks on `chrome:` urls
    chrome.tabs.getCurrent(function(tab) {
      chrome.tabs.update(tab.id, {url: 'chrome://bookmarks'});
    });
  }

  searchBookmarksFolder(name, root) {
    var out;
    for (let item of root) {
      if (item.title.toLowerCase() == name.toLowerCase()) {
        out = item;
        break;
      } else if (item.children && item.children.length > 0) {
        out = this.searchBookmarksFolder(name, item.children);
        if (out) break;
      }
    }
    return out;
  }
}
