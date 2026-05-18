const API_KEY = "t3ZaWUnLbSMvKlwPHfsd4HAXraekBZq4KPersGwaTioFHC94";

const booksContainer = document.querySelector(".books");

async function fetchBooks() {
  try {
    const response = await fetch(`https://api.nytimes.com/svc/books/v3/lists/overview.json?api-key=${API_KEY}`);
    const data = await response.json();
    const listBooks = data.results.lists;

    for (const list of listBooks) {
      list.books.forEach(book => {
        createBook(book, list.list_name_encoded, list.list_name);
      });
    }

    populateGenres(listBooks); // <-- preenche o dropdown

  } catch (error) {
    console.log("Error fetching books:", error);
  }
}

function createBook(book, slug, genreName) {
    const bookElement = document.createElement("div");
    bookElement.classList.add("book");
    bookElement.dataset.genre = slug;
    bookElement.innerHTML = `
        <img src="${book.book_image}" alt="${book.title}">
        <div class="book-info">
            <h3>${book.title}</h3>
            <p class="author">by ${book.author}</p>
            <span class="genre">${genreName}</span>
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

genreFilter.addEventListener("change", () => {
  const selected = genreFilter.value;
  const books = document.querySelectorAll(".book");

  books.forEach(book => {
    if (selected === "all" || book.dataset.genre === selected) {
      book.style.display = "";
    } else {
      book.style.display = "none";
    }
  });
});

fetchBooks();