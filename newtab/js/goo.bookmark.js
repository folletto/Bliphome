import {goo} from './goo.js';

export class Bookmark {
  constructor(bookmark) {
    this.bookmark = bookmark;
  }

  render() {
    return `
      <a href="${this.bookmark.url}">
        <span class="bookmark__img"><img src="chrome://favicon/size/16@2x/${this.bookmark.url}" /></span>
        <span class="bookmark__label">${this.bookmark.title}</span>
      </a>
    `;
  }
}
