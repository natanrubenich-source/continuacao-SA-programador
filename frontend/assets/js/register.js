// ===== FUNÇÃO DE CADASTRO SIMPLES COM BANCO =====
document.getElementById("formCadastro").addEventListener("submit", async (e) => {
    e.preventDefault(); // Impede envio padrão do formulário

    // Pega os valores dos campos
    const nome = document.getElementById("nome").value.trim();
    const email = document.getElementById("email").value.trim();
    const setor = document.getElementById("setor").value.trim();
    const telefone = document.getElementById("telefone").value.trim();
    const senha = document.getElementById("senha").value.trim();
    const mensagem = document.getElementById("mensagem");

    // Limpa mensagem anterior
    mensagem.textContent = "";

    // Validação básica - verifica campos obrigatórios
    if (!nome || !email || !senha) {
        mensagem.className = "message error";
        mensagem.textContent = "Preencha todos os campos obrigatórios.";
        return;
    }

    try {
        // Faz requisição para o servidor (API)
        const response = await fetch("http://localhost:3000/api/users/register", {
            method: "POST", // Método POST para enviar dados
            headers: { "Content-Type": "application/json" }, // Tipo de conteúdo
            body: JSON.stringify({ nome, email, senha, setor, telefone }), // Converte dados para JSON
        });

        const data = await response.json(); // Converte resposta para JSON

        if (response.ok) {
            // Cadastro deu certo
            mensagem.className = "message success";
            mensagem.textContent = "Usuário cadastrado com sucesso!";
            document.getElementById("formCadastro").reset(); // Limpa o formulário
            
            // Redireciona para login após 2 segundos
            // setTimeout(() => {
            //     window.location.href = "./login.html";
            // }, 2000);
        } else {
            // Cadastro deu erro
            mensagem.className = "message error";
            mensagem.textContent = data.erro || "Erro no cadastro.";
        }
    } catch (error) {
        // Erro de conexão
        mensagem.className = "message error";
        mensagem.textContent = "Erro ao conectar com o servidor. Verifique se está rodando.";
        console.error("Erro:", error);
    }
});
