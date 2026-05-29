const API_KEY = "t3ZaWUnLbSMvKlwPHfsd4HAXraekBZq4KPersGwaTioFHC94";

const booksContainer = document.querySelector(".books");
const genreFilter = document.querySelector("#genreFilter");
const searchInput = document.querySelector(".search input");

let allBooks = [];
let debounceTimer;

let currentUser = null;
let userWishlist = [];

// Verificar se está autenticado antes de fazer tudo
protegerPagina(async (user) => {

  currentUser = user;
  mostrarUtilizador(user);

  // Buscar wishlist do utilizador no Firestore
  const userDoc = await db.collection("users").doc(user.uid).get();

  if (userDoc.exists) {
    userWishlist = userDoc.data().wishlist || [];
  }

  // Buscar livros
  fetchBooks();

});

// Buscar livros
async function fetchBooks() {

  try {

    const response = await fetch(
      `https://api.nytimes.com/svc/books/v3/lists/overview.json?api-key=${API_KEY}`
    );

    const data = await response.json();

    const lists = data.results.lists;

    // Guardar livros num array
    lists.forEach(list => {

      list.books.forEach(book => {

        // Ver se o livro já existe no array (pelo título)
        const existing = allBooks.find(b => b.title === book.title);

        if (existing) {

          // Já existe → só juntar o novo género ao texto
          existing.genreName += "|" + list.list_name;
          existing.genreSlug += "," + list.list_name_encoded;

        } else {

          // Não existe → adicionar normalmente
          allBooks.push({
            ...book,
            genreSlug: list.list_name_encoded,
            genreName: list.list_name
          });

        }

      });

    });

    // Criar dropdown géneros
    populateGenres(lists);

    // Mostrar todos os livros
    displayBooks(allBooks);

  } catch (error) {

    console.log("Error fetching books:", error);

  }

}

// Mostrar livros
function displayBooks(books) {

  booksContainer.innerHTML = "";

  if (books.length === 0) {

    booksContainer.innerHTML = `
      <p class="no-results">Nenhum livro encontrado.</p>
    `;

    return;
  }

  books.forEach(book => {

    const bookElement = document.createElement("div");

    bookElement.classList.add("book");

    const naWishlist = userWishlist.includes(book.primary_isbn13);

    bookElement.innerHTML = `
      <button class="wishlist-btn ${naWishlist ? "active" : ""}" data-isbn="${book.primary_isbn13}">
        ${naWishlist ? "♥" : "♡"}
      </button>
      <a href="book.html?isbn=${book.primary_isbn13}">
        <img src="${book.book_image}" alt="${book.title}">

        <div class="book-info">
            <h3>${book.title}</h3>
            <p class="author">by ${book.author}</p>
            <div class="genres">
              ${book.genreName.split("|").map(g => `<span class="genre">${g}</span>`).join("")}
            </div>
        </div>
      </a>
    `;

    // Botão da wishlist
    const wishBtn = bookElement.querySelector(".wishlist-btn");

    wishBtn.addEventListener("click", async (e) => {

      e.preventDefault();

      const isbn = wishBtn.dataset.isbn;

      if (userWishlist.includes(isbn)) {

        // Remover da wishlist
        userWishlist = userWishlist.filter(i => i !== isbn);
        wishBtn.classList.remove("active");
        wishBtn.textContent = "♡";

      } else {

        // Adicionar à wishlist
        userWishlist.push(isbn);
        wishBtn.classList.add("active");
        wishBtn.textContent = "♥";

      }

      // Guardar no Firestore (set com merge → cria se não existir)
      await db.collection("users").doc(currentUser.uid).set({
        wishlist: userWishlist
      }, { merge: true });

    });

    booksContainer.appendChild(bookElement);

  });

}

// Preencher géneros
function populateGenres(lists) {

  lists.forEach(list => {

    const option = document.createElement("option");

    option.value = list.list_name_encoded;
    option.textContent = list.list_name;

    genreFilter.appendChild(option);

  });

}

// Função principal de filtro
function filterBooks() {

  const selectedGenre = genreFilter.value;
  const searchTerm = searchInput.value.toLowerCase().trim();

  const filteredBooks = allBooks.filter(book => {

    const matchesGenre =
      selectedGenre === "all" ||
      book.genreSlug.includes(selectedGenre);

    const matchesSearch =
      book.title.toLowerCase().includes(searchTerm) ||
      book.author.toLowerCase().includes(searchTerm);

    return matchesGenre && matchesSearch;

  });

  displayBooks(filteredBooks);

}

// Filtro género
genreFilter.addEventListener("change", filterBooks);

// Pesquisa autocomplete
searchInput.addEventListener("input", () => {

  clearTimeout(debounceTimer);

  debounceTimer = setTimeout(() => {

    filterBooks();

  }, 300);

});
