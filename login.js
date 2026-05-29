const form = document.querySelector("#loginForm");
const errorBox = document.querySelector("#authError");

// Se já está autenticado, vai para a homepage
auth.onAuthStateChanged(user => {
  if (user) {
    window.location.href = "index.html";
  }
});

// Quando submete o formulário
form.addEventListener("submit", async (e) => {

  e.preventDefault();
  errorBox.textContent = "";

  const email = document.querySelector("#email").value;
  const password = document.querySelector("#password").value;

  try {

    await auth.signInWithEmailAndPassword(email, password);
    window.location.href = "index.html";

  } catch (error) {

    // Mensagens de erro
    if (error.code === "auth/wrong-password" || error.code === "auth/invalid-credential") {
      errorBox.textContent = "Email ou password incorretos.";
    } else if (error.code === "auth/user-not-found") {
      errorBox.textContent = "Conta não existe.";
    } else if (error.code === "auth/invalid-email") {
      errorBox.textContent = "Email inválido.";
    } else {
      errorBox.textContent = "Erro ao entrar.";
    }

  }

});
