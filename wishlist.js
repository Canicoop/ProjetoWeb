const API_KEY = "t3ZaWUnLbSMvKlwPHfsd4HAXraekBZq4KPersGwaTioFHC94";

const booksContainer = document.querySelector(".books");

let currentUser = null;
let userWishlist = [];

// Verificar se está autenticado antes de carregar a wishlist
protegerPagina(async (user) => {

  currentUser = user;
  mostrarUtilizador(user);

  // Buscar wishlist do utilizador no Firestore
  const userDoc = await db.collection("users").doc(user.uid).get();

  if (userDoc.exists) {
    userWishlist = userDoc.data().wishlist || [];
  }

  // Se a wishlist estiver vazia, mostrar mensagem
  if (userWishlist.length === 0) {

    booksContainer.innerHTML = `
      <p class="no-results">Ainda não tens livros na wishlist.</p>
    `;

    return;
  }

  // Buscar todos os livros e filtrar só os da wishlist
  fetchWishlistBooks();

});

// Buscar livros e mostrar só os da wishlist
async function fetchWishlistBooks() {

  try {

    const response = await fetch(
      `https://api.nytimes.com/svc/books/v3/lists/overview.json?api-key=${API_KEY}`
    );

    const data = await response.json();

    const lists = data.results.lists;

    let wishlistBooks = [];

    // Procurar os livros que estão na wishlist
    lists.forEach(list => {

      list.books.forEach(book => {

        if (userWishlist.includes(book.primary_isbn13)) {

          // Ver se o livro já foi adicionado (pelo título)
          const existing = wishlistBooks.find(b => b.title === book.title);

          if (existing) {

            // Já existe → juntar o novo género
            existing.genreName += "|" + list.list_name;

          } else {

            wishlistBooks.push({
              ...book,
              genreName: list.list_name
            });

          }

        }

      });

    });

    displayBooks(wishlistBooks);

  } catch (error) {

    console.log("Error fetching wishlist:", error);

  }

}

// Mostrar livros
function displayBooks(books) {

  booksContainer.innerHTML = "";

  books.forEach(book => {

    const bookElement = document.createElement("div");

    bookElement.classList.add("book");

    bookElement.innerHTML = `
      <button class="wishlist-btn active" data-isbn="${book.primary_isbn13}">♥</button>
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

    // Botão para remover da wishlist
    const wishBtn = bookElement.querySelector(".wishlist-btn");

    wishBtn.addEventListener("click", async (e) => {

      e.preventDefault();

      const isbn = wishBtn.dataset.isbn;

      // Remover da wishlist
      userWishlist = userWishlist.filter(i => i !== isbn);

      // Guardar no Firestore
      await db.collection("users").doc(currentUser.uid).set({
        wishlist: userWishlist
      }, { merge: true });

      // Tirar o livro do ecrã
      bookElement.remove();

      // Se ficou vazio, mostrar mensagem
      if (userWishlist.length === 0) {
        booksContainer.innerHTML = `
          <p class="no-results">Ainda não tens livros na wishlist.</p>
        `;
      }

    });

    booksContainer.appendChild(bookElement);

  });

}
