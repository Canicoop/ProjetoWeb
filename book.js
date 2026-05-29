const API_KEY = "t3ZaWUnLbSMvKlwPHfsd4HAXraekBZq4KPersGwaTioFHC94";

// Verificar se está autenticado
protegerPagina(user => {

  mostrarUtilizador(user);
  fetchBook();

});

// Buscar livro
async function fetchBook() {

  try {

    // Ler ISBN do URL (ex: book.html?isbn=9781668061923)
    const params = new URLSearchParams(window.location.search);
    const isbn = params.get("isbn");

    const response = await fetch(
      `https://api.nytimes.com/svc/books/v3/lists/overview.json?api-key=${API_KEY}`
    );

    const data = await response.json();

    const lists = data.results.lists;

    let foundBook = null;
    let genres = [];

    // Procurar o livro pelo ISBN e juntar todos os géneros
    lists.forEach(list => {

      list.books.forEach(book => {

        if (book.primary_isbn13 === isbn) {

          foundBook = book;
          genres.push(list.list_name);

        }

      });

    });

    // Mostrar livro
    displayBook(foundBook, genres);

  } catch (error) {

    console.log("Error fetching book:", error);

  }

}

// Mostrar livro
function displayBook(book, genres) {

  if (!book) {

    document.querySelector(".book-detail").innerHTML = `
      <p class="no-results">Livro não encontrado.</p>
      <a href="index.html" class="back-link">← Voltar</a>
    `;

    return;
  }

  document.querySelector("#bookImage").src = book.book_image;
  document.querySelector("#bookImage").alt = book.title;
  document.querySelector("#bookTitle").textContent = book.title;
  document.querySelector("#bookAuthor").textContent = "by " + book.author;
  document.querySelector("#bookDescription").textContent = book.description || "Sem descrição disponível.";
  document.querySelector("#bookPublisher").textContent = book.publisher;
  document.querySelector("#bookIsbn").textContent = book.primary_isbn13;

  const buyLinksContainer = document.querySelector("#buyLinks");

    book.buy_links.forEach(link => {

    const a = document.createElement("a");
    a.classList.add("buy-button");
    a.href = link.url;
    a.target = "_blank";
    a.textContent = link.name;

    buyLinksContainer.appendChild(a);

    });

  // Géneros em balões
  const genresContainer = document.querySelector("#bookGenres");

  genres.forEach(g => {

    const span = document.createElement("span");
    span.classList.add("genre");
    span.textContent = g;
    genresContainer.appendChild(span);

  });

}
