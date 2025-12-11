import {
  carregarViagens,
  abrirModalViagem,
  fecharModalViagem,
} from "./viagens.js";
import {
  carregarVeiculos as carregarGridVeiculos,
  abrirModalVeiculo,
  fecharModalVeiculo,
} from "./veiculos.js";
import { carregarUsuarios as carregarUsuarios } from "./usuarios.js";

const API_BASE = "http://localhost:3000/api";

// Função utilitária para garantir que a data seja válida
function parseDate(dataStr) {
  if (!dataStr) return null;
  const date = new Date(dataStr);
  if (!isNaN(date)) return date;
  const dateAlt = new Date(dataStr + "T00:00:00");
  return isNaN(dateAlt) ? null : dateAlt;
}

// Eventos de abrir/fechar modais
document
  .getElementById("btnNovaViagem")
  ?.addEventListener("click", abrirModalViagem);
document
  .getElementById("btnNovoVeiculo")
  ?.addEventListener("click", abrirModalVeiculo);
document
  .getElementById("btnCancelarViagem")
  ?.addEventListener("click", fecharModalViagem);
document
  .getElementById("btnCancelarVeiculo")
  ?.addEventListener("click", fecharModalVeiculo);

// Inicialização do dashboard
document.addEventListener("DOMContentLoaded", async () => {
  // Verifica se usuário está logado
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) {
    window.location.href = "index.html"; // redireciona se não logado
    return;
  }

  // Preenche dados do usuário no sidebar
  document.getElementById("userName").textContent = user.nome || "Usuário";
  document.getElementById("userEmail").textContent = user.email || "";

  // Inicializa navegação e dashboard
  inicializarNavegacao();
  await inicializarDashboard();
});

async function inicializarDashboard() {
  try {
    // Pega todos os dados
    const [veiculos, viagens, usuarios] = await Promise.all([
      fetch(`${API_BASE}/veiculos`).then((res) => res.json()),
      fetch(`${API_BASE}/viagens`).then((res) => res.json()),
      fetch(`${API_BASE}/users`).then((res) => res.json()),
    ]);

    // Atualiza cards
    document.getElementById("totalVeiculos").textContent = veiculos.length;
    document.getElementById("totalUsuarios").textContent = usuarios.length;
    document.getElementById("totalViagens").textContent = viagens.length;

    const hojeStr = new Date().toDateString();
    const viagensHoje = viagens.filter((v) => {
      const data = parseDate(v.data_viagem);
      return data && data.toDateString() === hojeStr;
    }).length;
    document.getElementById("viagensHoje").textContent = viagensHoje;

    // Próximas 5 viagens
    carregarProximasViagens(viagens);

    // Carrega seções
    await carregarViagens();
    await carregarGridVeiculos();
    await carregarUsuarios();
  } catch (error) {
    console.error("Erro ao inicializar dashboard:", error);
  }
}

// Carrega próximas 5 viagens
function carregarProximasViagens(viagens) {
  const container = document.getElementById("proximasViagens");
  const proximas = viagens
    .map((v) => ({
      ...v,
      dataObj: parseDate(v.data_viagem),
      horaSaida: v.hora_saida,
      horaRetorno: v.hora_retorno,
    }))
    .filter((v) => v.dataObj)
    .sort((a, b) => a.dataObj - b.dataObj)
    .slice(0, 5);

  if (proximas.length === 0) {
    container.innerHTML = "<p>Nenhuma viagem agendada</p>";
    return;
  }

  container.innerHTML = proximas
    .map(
      (v) => `
      <div class="trip-item">
        <div class="trip-header">
          <span class="trip-destination">${v.destino}</span>
          <span class="trip-date">${v.dataObj.toLocaleDateString()}</span>
        </div>
        <div class="trip-details">
          <span><i class="fas fa-clock"></i> ${v.horaSaida || ""}</span>
          <span><i class="fas fa-car"></i> ${
            v.veiculo?.modelo || "Veículo não definido"
          }</span>
          <span><i class="fas fa-users"></i> ${v.vagas_disponiveis} vagas</span>
        </div>
      </div>
    `
    )
    .join("");
}

// Navegação lateral
function inicializarNavegacao() {
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll(".content-section");

  navLinks.forEach((link) => {
    link.addEventListener("click", async (e) => {
      e.preventDefault();
      document
        .querySelectorAll(".nav-item")
        .forEach((item) => item.classList.remove("active"));
      sections.forEach((section) => section.classList.remove("active"));

      link.parentElement.classList.add("active");
      const sectionId = link.dataset.section + "-section";
      document.getElementById(sectionId).classList.add("active");

      // Carrega dados da seção clicada
      switch (link.dataset.section) {
        case "dashboard":
          await inicializarDashboard();
          break;
        case "viagens":
          await carregarViagens();
          break;
        case "veiculos":
          await carregarGridVeiculos();
          break;
        case "usuarios":
          await carregarUsuarios();
          break;
      }
    });
  });
}

// Botão Sair
document.getElementById("btnSair")?.addEventListener("click", () => {
  const confirmar = confirm("Deseja realmente sair do sistema?");
  if (confirmar) {
    localStorage.removeItem("user"); // remove dados de login
    window.location.href = "index.html"; // volta para tela inicial
  }
});
