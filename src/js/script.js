'use strict';

class BooksList {
  constructor() {
    this.select = {
      templateOfBook: '#template-book',
      booksList: '.books-list',
      filters: '.filters',
    };

    this.templates = {
      book: Handlebars.compile(document.querySelector(this.select.templateOfBook).innerHTML),
    };

    this.favoriteBooks = [];
    this.filters = [];

    this.getElements();
    this.initData();
    this.render();
    this.initActions();
  }

  getElements() {
    this.booksListContainer = document.querySelector(this.select.booksList);
    this.filtersForm = document.querySelector(this.select.filters);
  }

  initData() {
    this.data = dataSource.books;
  }

  render() {
    for (let book of this.data) {
      const ratingBgc = this.determineRatingBgc(book.rating);
      const ratingWidth = Math.floor(book.rating * 10) + '%';

      const bookData = {
        id: book.id,
        name: book.name,
        price: book.price,
        image: book.image,
        rating: book.rating,
        ratingBgc,
        ratingWidth,
      };

      const generatedHTML = this.templates.book(bookData);
      const generatedDOM = utils.createDOMFromHTML(generatedHTML);
      this.booksListContainer.appendChild(generatedDOM);
    }
  }

  initActions() {
    this.booksListContainer.addEventListener('dblclick', (event) => {
      if (event.target.offsetParent.classList.contains('book__image')) {
        event.preventDefault();
        const bookImage = event.target.offsetParent;
        const bookId = bookImage.dataset.id;

        if (this.favoriteBooks.includes(bookId)) {
          bookImage.classList.remove('favorite');
          this.favoriteBooks.splice(this.favoriteBooks.indexOf(bookId), 1);
        } else {
          bookImage.classList.add('favorite');
          this.favoriteBooks.push(bookId);
        }
      }
    });

    this.filtersForm.addEventListener('click', (event) => {
      if (event.target.tagName === 'INPUT' && event.target.type === 'checkbox' && event.target.name === 'filter') {
        const filterValue = event.target.value;

        if (event.target.checked) {
          this.filters.push(filterValue);
        } else {
          this.filters.splice(this.filters.indexOf(filterValue), 1);
        }

        this.filterBooks();
      }
    });
  }

  filterBooks() {
    for (let book of this.data) {
      let shouldBeHidden = false;

      for (const filter of this.filters) {
        if (!book.details[filter]) {
          shouldBeHidden = true;
          break;
        }
      }

      const bookImage = document.querySelector(`.book__image[data-id="${book.id}"]`);

      if (shouldBeHidden) {
        bookImage.classList.add('hidden');
      } else {
        bookImage.classList.remove('hidden');
      }
    }
  }

  determineRatingBgc(rating) {
    if (rating < 6) {
      return 'linear-gradient(to bottom, #fefcea 0%, #f1da36 100%)';
    } else if (rating <= 8) {
      return 'linear-gradient(to bottom, #b4df5b 0%, #b4df5b 100%)';
    } else if (rating <= 9) {
      return 'linear-gradient(to bottom, #299a0b 0%, #299a0b 100%)';
    } else {
      return 'linear-gradient(to bottom, #ff0084 0%, #ff0084 100%)';
    }
  }
}

new BooksList();