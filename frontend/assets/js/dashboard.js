// import {
//   carregarViagens as carregarTabelaViagens,
//   abrirModalViagem,
//   fecharModal as fecharModalViagem,
// } from "./viagens.js";
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
import { carregarUsuarios as carregarTabelaUsuarios } from "./usuarios.js";

const API_BASE = "http://localhost:3000"; // ajuste se seu backend estiver em outra URL

// Botões de abrir/fechar modais
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

// Inicialização
document.addEventListener("DOMContentLoaded", () => {
  inicializarNavegacao();
  inicializarDashboard();

  // Usuário fixo (pode integrar login depois)
  document.getElementById("userName").textContent = "Usuário SENAI";
  document.getElementById("userEmail").textContent = "usuario@senai.sc";
});

async function inicializarDashboard() {
  await carregarEstatisticas();
  await carregarProximasViagens();

  // Carregar conteúdo das seções
  await carregarViagens();
  await carregarGridVeiculos();
  await carregarTabelaUsuarios();
}

// Atualiza os cards do dashboard
async function carregarEstatisticas() {
  try {
    const veiculos = await fetch(`${API_BASE}/veiculos`).then((res) =>
      res.json()
    );
    const viagens = await fetch(`${API_BASE}/viagens`).then((res) =>
      res.json()
    );
    const usuarios = await fetch(`${API_BASE}/usuarios`).then((res) =>
      res.json()
    );

    document.getElementById("totalVeiculos").textContent = veiculos.length;
    document.getElementById("totalUsuarios").textContent = usuarios.length;
    document.getElementById("totalViagens").textContent = viagens.length;

    const hoje = new Date().toDateString();
    const viagensHoje = viagens.filter(
      (v) => new Date(v.data).toDateString() === hoje
    ).length;
    document.getElementById("viagensHoje").textContent = viagensHoje;
  } catch (error) {
    console.error("Erro ao carregar estatísticas:", error);
  }
}

// Carrega as próximas 5 viagens
async function carregarProximasViagens() {
  try {
    const viagens = await fetch(`${API_BASE}/viagens`).then((res) =>
      res.json()
    );
    const container = document.getElementById("proximasViagens");

    container.innerHTML = viagens
      .sort((a, b) => new Date(a.data) - new Date(b.data))
      .slice(0, 5)
      .map(
        (v) => `
          <div class="trip-card">
            <strong>${v.destino}</strong> - ${new Date(
          v.data
        ).toLocaleDateString()} 
            <span>${v.horaSaida || ""} - ${v.horaRetorno || ""}</span>
          </div>
        `
      )
      .join("");
  } catch (error) {
    console.error("Erro ao carregar próximas viagens:", error);
  }
}

// Inicializa navegação lateral
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
        case "viagens":
          await carregarViagens();
          break;
        case "veiculos":
          await carregarGridVeiculos();
          break;
        case "usuarios":
          await carregarTabelaUsuarios();
          break;
      }
    });
  });
}
