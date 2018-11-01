const BOOKMARKS_FOLDER_NAME = 'New tab'; // case insensitive
const BOOKMARKS_DOM_NODE_ID = '#shelf';

function renderBookmarks(node) {
  chrome.bookmarks.getTree(function(bookmarks) {
    let bookmarkFolderNewTab = searchBookmarksFolder(BOOKMARKS_FOLDER_NAME, bookmarks);
    if (bookmarkFolderNewTab) {
      if (bookmarkFolderNewTab.children) {
        if (bookmarkFolderNewTab.children.length > 0) {
          node.innerHTML = '';
          for (let bookmark of bookmarkFolderNewTab.children) {
            node.innerHTML += templates.bookmark(bookmark);
          }
        } else {
          node.innerHTML = templates.emptyFolder();
        }
      }
    } else {
      node.innerHTML = templates.noFolder();
    }

  });
}

function searchBookmarksFolder(name, root) {
  var out;
  for (let item of root) {
    if (item.title.toLowerCase() == name.toLowerCase()) {
      out = item;
      break;
    } else if (item.children && item.children.length > 0) {
      out = searchBookmarksFolder(name, item.children);
      if (out) break;
    }
  }
  return out;
}

const templates = {
  noFolder: (data) => `
    <li>
      Unable to find bookmark folder named "${BOOKMARKS_FOLDER_NAME}".<br/>
      Please add it anywhere in your Chrome Bookmarks.<br/>
      <!--<a class="button" href="chrome://bookmarks/">Open Bookmarks</a>-->
    </li>
  `,

  emptyFolder: (data) => `
    <li>
      The bookmark folder "${BOOKMARKS_FOLDER_NAME}" contains no bookmarks.<br/>
      Please add the bookmarks you want to show up in the new tab there.<br/>
      <!--<a class="button" href="chrome://bookmarks/">Open Bookmarks</a>-->
    </li>
  `,

  bookmark: (data) => `
    <li>
      <a href="${data.url}">
        <img src="chrome://favicon/size/16@2x/${data.url}" />
        ${data.title}
      </a>
    </li>
  `
}

window.onload = function() {
  let node = document.querySelector(BOOKMARKS_DOM_NODE_ID);
  renderBookmarks(node);
}
