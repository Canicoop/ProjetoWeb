const form = document.querySelector("#registerForm");
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

  const name = document.querySelector("#name").value.trim();
  const email = document.querySelector("#email").value;
  const password = document.querySelector("#password").value;
  const confirmPassword = document.querySelector("#confirmPassword").value;

  // Verificar se as passwords coincidem
  if (password !== confirmPassword) {
    errorBox.textContent = "As passwords não coincidem.";
    return;
  }

  try {

    // Criar conta
    const userCredential = await auth.createUserWithEmailAndPassword(email, password);
    const user = userCredential.user;

    // Guardar nome no perfil
    await user.updateProfile({ displayName: name });

    // Criar documento do utilizador no Firestore (com wishlist vazia)
    await db.collection("users").doc(user.uid).set({
      name: name,
      email: email,
      wishlist: []
    });

    window.location.href = "index.html";

  } catch (error) {

    if (error.code === "auth/email-already-in-use") {
      errorBox.textContent = "Este email já está registado.";
    } else if (error.code === "auth/invalid-email") {
      errorBox.textContent = "Email inválido.";
    } else if (error.code === "auth/weak-password") {
      errorBox.textContent = "Password fraca (mínimo 6 caracteres).";
    } else {
      errorBox.textContent = "Erro ao criar conta.";
    }

  }

});
