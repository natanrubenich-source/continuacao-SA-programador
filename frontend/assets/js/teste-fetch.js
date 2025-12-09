const API_BASE = "http://localhost:3000"; // ajuste se necessário

async function testarFetch() {
  try {
    const veiculos = await fetch(`${API_BASE}/veiculos`).then((res) =>
      res.json()
    );
    console.log("Veículos:", veiculos);

    const viagens = await fetch(`${API_BASE}/viagens`).then((res) =>
      res.json()
    );
    console.log("Viagens:", viagens);

    const usuarios = await fetch(`${API_BASE}/usuarios`).then((res) =>
      res.json()
    );
    console.log("Usuários:", usuarios);
  } catch (error) {
    console.error("Erro ao buscar dados do backend:", error);
  }
}

testarFetch();
