import {goo} from './goo.js';

export class Bookmark {
  constructor(bookmark) {
    this.bookmark = bookmark;
  }

  render() {
    return `
      <div class="bookmark">
        <a href="${this.bookmark.url}">
          <img src="chrome://favicon/size/16@2x/${this.bookmark.url}" />
          ${this.bookmark.title}
        </a>
      </div>
    `;
  }
}
