// register.js — cadastro simples sem token
document
  .getElementById("formCadastro")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const nome = document.getElementById("nome").value.trim();
    const email = document.getElementById("email").value.trim();
    const setor = document.getElementById("setor").value.trim();
    const telefone = document.getElementById("telefone").value.trim();
    const senha = document.getElementById("senha").value.trim();
    const mensagem = document.getElementById("mensagem");

    mensagem.textContent = "";

    // Valida campos obrigatórios
    if (!nome || !email || !setor || !telefone || !senha) {
      mensagem.className = "message error";
      mensagem.textContent = "Preencha todos os campos.";
      return;
    }

    // Validação simples de senha
    const senhaRegex = /^(?=.*[A-Z])(?=.*[\W_]).{6,}$/;
    if (!senhaRegex.test(senha)) {
      mensagem.className = "message error";
      mensagem.textContent =
        "Senha inválida. Deve ter pelo menos 6 caracteres, uma letra maiúscula e um caractere especial.";
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, email, setor, telefone, senha }),
      });

      const data = await response.json();
      console.log("Resposta do cadastro:", data, "status:", response.status);

      if (response.ok) {
        mensagem.className = "message success";
        mensagem.textContent =
          "Cadastro realizado com sucesso! Redirecionando...";

        // Redireciona para login após pequena pausa
        setTimeout(() => {
          window.location.href = "index.html";
        }, 1000);
      } else {
        mensagem.className = "message error";
        mensagem.textContent =
          data.erro || data.message || "Erro ao cadastrar.";
        console.warn("Cadastro falhou:", data);
      }
    } catch (error) {
      mensagem.className = "message error";
      mensagem.textContent =
        "Erro ao conectar com o servidor. Verifique se está rodando.";
      console.error("Erro no cadastro:", error);
    }
  });
