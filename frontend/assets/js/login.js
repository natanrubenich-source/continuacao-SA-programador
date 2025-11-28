// ===== FUNÇÃO DE LOGIN SIMPLES COM BANCO =====
document.getElementById("formLogin").addEventListener("submit", async (e) => {
    e.preventDefault(); // Impede envio padrão do formulário

    // Pega os valores dos campos
    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value.trim();
    const mensagem = document.getElementById("mensagem");

    // Limpa mensagem anterior
    mensagem.textContent = "";

    // Validação básica - verifica se campos estão preenchidos
    if (!email || !senha) {
        mensagem.className = "message error";
        mensagem.textContent = "Preencha todos os campos.";
        return;
    }

    try {
        // Faz requisição para o servidor (API)
        const response = await fetch("http://localhost:3000/api/users/login", {
            method: "POST", // Método POST para enviar dados
            headers: { "Content-Type": "application/json" }, // Tipo de conteúdo
            body: JSON.stringify({ email, senha }), // Converte dados para JSON
        });

        const data = await response.json(); // Converte resposta para JSON

        if (response.ok) {
            // Login deu certo
            mensagem.className = "message success";
            mensagem.textContent = "Login realizado com sucesso!";
            
            // Redireciona para o dashboard após 1 segundo
            setTimeout(() => {
                window.location.href = "dashboard.html";
            }, 1000);
        } else {
            // Login deu erro
            mensagem.className = "message error";
            mensagem.textContent = data.erro || "Erro no login.";
        }
    } catch (error) {
        // Erro de conexão
        mensagem.className = "message error";
        mensagem.textContent = "Erro ao conectar com o servidor. Verifique se está rodando.";
        console.error("Erro:", error);
    }
});
