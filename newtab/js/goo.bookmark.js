import {goo} from './goo.js';

export class Bookmark {
  constructor(bookmark) {
    this.bookmark = bookmark;
  }

  render() {
    let extra = '';
    let url = new URL(this.bookmark.url);
    if (url.protocol === 'chrome:') {
      extra = goo.onClick(this.onClickChrome.bind(this));
    }

    return `
      <a href="${this.bookmark.url}" ${extra}>
        <span class="bookmark__img"><img src="chrome://favicon/size/16@2x/${this.bookmark.url}" /></span>
        <span class="bookmark__label">${this.bookmark.title}</span>
      </a>
    `;
  }

  onClickChrome() {
    alert('\nDue to Chrome security limitations, chrome:// urls are currently unsupported.\n\nSorry!');
  }
}
