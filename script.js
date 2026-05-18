const API_KEY = "t3ZaWUnLbSMvKlwPHfsd4HAXraekBZq4KPersGwaTioFHC94";

const booksContainer = document.querySelector(".books");

async function fetchBooks() {
  let response = await fetch(`https://api.nytimes.com/svc/books/v3/lists/overview.json?api-key=${API_KEY}`);

  try {
    const data = await response.json();
    const listBooks = data.results.lists;

    for (const list of listBooks) {
      const books = list.books;
  
      books.forEach(book => {
          createBook(book);
      });
      
    }

    populateGenres(data.results.lists); // <-- preenche o dropdown
    renderBooks();


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

function populateGenres(lists) {
  lists.forEach(list => {
    const option = document.createElement("option");
    option.value = list.list_name_encoded;
    option.textContent = list.list_name;
    genreFilter.appendChild(option);
  });
}

fetchBooks();