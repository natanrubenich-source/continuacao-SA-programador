// login.js — versão sem token, para apresentação
document.getElementById("formLogin").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const senha = document.getElementById("senha").value.trim();
  const mensagem = document.getElementById("mensagem");

  mensagem.textContent = "";

  if (!email || !senha) {
    mensagem.className = "message error";
    mensagem.textContent = "Preencha todos os campos.";
    return;
  }

  try {
    const response = await fetch("http://localhost:3000/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, senha }),
    });

    const data = await response.json();
    console.log("Resposta do login:", data, "status:", response.status);

    if (response.ok) {
      mensagem.className = "message success";
      mensagem.textContent = "Login realizado com sucesso!";

      // Extrai o usuário retornado pelo backend
      const usuario = data.usuario || data.user || data;

      // Remove senha antes de salvar
      const { senha: _, ...usuarioSemSenha } = usuario;

      // Salva no localStorage
      localStorage.setItem("user", JSON.stringify(usuarioSemSenha));
      console.log("Usuário salvo no localStorage:", usuarioSemSenha);

      // Redireciona para dashboard
      setTimeout(() => (window.location.href = "dashboard.html"), 300);
    } else {
      mensagem.className = "message error";
      mensagem.textContent = data.erro || data.message || "Erro no login.";
      console.warn("Login falhou:", data);
    }
  } catch (error) {
    mensagem.className = "message error";
    mensagem.textContent =
      "Erro ao conectar com o servidor. Verifique se está rodando.";
    console.error("Erro ao efetuar login:", error);
  }
});
