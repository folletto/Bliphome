import {goo} from './goo.js';
import {Bookmark} from './goo.bookmark.js';

const BOOKMARKS_FOLDER_NAME = 'New tab'; // case insensitive

export class Root {
  constructor() {
    this.bookmarkFolderNewTab = null;
    this.countTest = 0;
  }

  render() {
    return `
      <div>${this.renderBookmarks()}</div>
    `;
  }

  renderBookmarks() {
    let out = '';

    if (this.bookmarkFolderNewTab == null) {
      this.getBookmarks();
    } else {
      for (let bookmark of this.bookmarkFolderNewTab.children) {
        //out += '<div>' + bookmark.url + '</div>';
        out += goo.out(Bookmark, bookmark);
      }
    }

    return out;
  }

  getBookmarks() {
    var self = this;

    chrome.bookmarks.getTree(function(bookmarks) {
      let bookmarkFolderNewTab = self.searchBookmarksFolder(BOOKMARKS_FOLDER_NAME, bookmarks);
      if (bookmarkFolderNewTab) {
        if (bookmarkFolderNewTab.children) {
          if (bookmarkFolderNewTab.children.length > 0) {
            self.bookmarkFolderNewTab = bookmarkFolderNewTab;
            goo.refresh(self);
          } else {
            console.log('templates.emptyFolder()');
          }
        }
      } else {
        console.log('templates.noFolder()');
      }
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
