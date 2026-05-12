const API_KEY = "t3ZaWUnLbSMvKlwPHfsd4HAXraekBZq4KPersGwaTioFHC94";

const booksContainer = document.querySelector(".books");

async function fetchBooks() {
  let response = await fetch(`https://api.nytimes.com/svc/books/v3/lists/overview.json?api-key=${API_KEY}`);
  try {
    const data = await response.json();
    const books = data.results.lists[0].books;

    books.forEach(book => {
        createBook(book);
    });

  } catch (error) {
    console.log("Error fetching books:", error);
  }
}

function createBook(book) {
    const bookElement = document.createElement("div");
    bookElement.classList.add("book");
    bookElement.innerHTML = `
        <img src="${book.book_image}" alt="${book.title}">
        <div class="book-info">
            <h3>${book.title}</h3>
            <p class="author">by ${book.author}</p>
            <span class="genre">${book.list_name}</span>
        </div>
    `;
    booksContainer.appendChild(bookElement);
}

fetchBooks();