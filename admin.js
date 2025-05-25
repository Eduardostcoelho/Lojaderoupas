// Abrir menu
document.getElementById("abrir-menu").addEventListener("click", () => {
  document.getElementById("menu-lateral").classList.add("menu-aberto");
  document.getElementById("menu-lateral").classList.remove("menu-fechado");
});

// Fechar menu
document.getElementById("fechar-menu").addEventListener("click", () => {
  document.getElementById("menu-lateral").classList.remove("menu-aberto");
  document.getElementById("menu-lateral").classList.add("menu-fechado");
});

// Simular login
function simularLogin(event) {
  event.preventDefault();
  const usuario = document.getElementById("usuario").value;
  const senha = document.getElementById("senha").value;

  if (usuario && senha) {
    localStorage.setItem("usuarioAtual", usuario);
    document.getElementById("mensagem-login").textContent = `Bem-vindo, ${usuario}!`;
  } else {
    alert("Preencha usuário e senha!");
  }
  return false;
}
