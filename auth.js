// Verifica se o utilizador está autenticado.
// Se não estiver, manda para a página de login.
function protegerPagina(callback) {

  auth.onAuthStateChanged(user => {

    if (!user) {
      window.location.href = "login.html";
      return;
    }

    callback(user);

  });

}

// Logout
function logout() {
  auth.signOut();
  window.location.href = "login.html";
}

// Adiciona "Olá, nome" e botão Sair no header
function mostrarUtilizador(user) {

  const wishlistEl = document.querySelector(".wishlist");

  const userBox = document.createElement("div");
  userBox.classList.add("user-box");
  userBox.innerHTML = `
    <a href="wishlist.html" class="wishlist-link">♥ Wishlist</a>
    <span class="user-name">Olá, ${user.displayName || user.email}</span>
    <button class="logout-btn" id="logoutBtn">Sair</button>
  `;

  if (wishlistEl) {
    wishlistEl.replaceWith(userBox);
  } else {
    document.querySelector("header").appendChild(userBox);
  }

  document.querySelector("#logoutBtn").addEventListener("click", logout);

}
