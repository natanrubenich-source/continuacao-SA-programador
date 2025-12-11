import { API_BASE } from "./config.js";
import { mostrarErro } from "./utils.js";

let modoVeiculo = "cadastrar";
let veiculoEditId = null;

export async function carregarVeiculos() {
  try {
    const response = await fetch(`${API_BASE}/veiculos`);
    const veiculos = await response.json();
    const container = document.getElementById("veiculosGrid");

    container.innerHTML = veiculos
      .map(
        (v) => `
            <div class="vehicle-card">
              <!-- Cabeçalho com título e status -->
              <div class="vehicle-header">
                <h3 class="vehicle-title">${v.marca} ${v.modelo}</h3>
                <span class="vehicle-status ${
                  v.disponivel ? "disponivel" : "indisponivel"
                }">
                  ${v.disponivel ? "Disponível" : "Indisponível"}
                </span>
              </div>
  
              <!-- Informações do veículo -->
              <div class="vehicle-info">
<<<<<<< HEAD
                <div class="vehicle-info-item"><i class="fa-solid fa-address-card"></i> Placa: ${
=======
                <div class="vehicle-info-item"><i class="fas fa-car"></i> Placa: ${
>>>>>>> 0f329350c59b763237751f0e22312ac904e79fa1
                  v.placa
                }</div>
                <div class="vehicle-info-item"><i class="fas fa-calendar"></i> Ano: ${
                  v.ano || "N/A"
                }</div>
                <div class="vehicle-info-item"><i class="fas fa-users"></i> Capacidade: ${
                  v.capacidade
                }</div>
<<<<<<< HEAD
                <div class="vehicle-info-item"><i class="fas fa-car"></i> Tipo: ${
=======
                <div class="vehicle-info-item"><i class="fas fa-truck"></i> Tipo: ${
>>>>>>> 0f329350c59b763237751f0e22312ac904e79fa1
                  v.tipo
                }</div>
                ${
                  v.observacoes
                    ? `<div class="vehicle-info-item"><i class="fas fa-sticky-note"></i> ${v.observacoes}</div>`
                    : ""
                }
              </div>
  
              <!-- Botões de ação -->
              <div class="card-actions" style="display:flex; gap:10px; margin-top:10px;">
                <button class="btn-edit action-btn" onclick="editarVeiculo(${
                  v.id
                })">
                  <i class="fas fa-edit"></i> Editar
                </button>
                <button class="btn-delete action-btn" onclick="excluirVeiculo(${
                  v.id
                })">
                  <i class="fas fa-trash"></i> Excluir
                </button>
              </div>
            </div>
          `
      )
      .join("");
  } catch (error) {
    mostrarErro("veiculos", error);
  }
}

export function abrirModalVeiculo() {
  document.getElementById("modalVeiculo").style.display = "block";
}

export function fecharModalVeiculo() {
  document.getElementById("modalVeiculo").style.display = "none";
}

export async function editarVeiculo(id) {
  const response = await fetch(`${API_BASE}/veiculos/${id}`);
  const v = await response.json();

  document.getElementById("marca").value = v.marca;
  document.getElementById("modelo").value = v.modelo;
  document.getElementById("placa").value = v.placa;
  document.getElementById("ano").value = v.ano;
  document.getElementById("capacidade").value = v.capacidade;
  document.getElementById("tipo").value = v.tipo;
  document.getElementById("observacoesVeiculo").value = v.observacoes;

  abrirModalVeiculo();
  modoVeiculo = "editar";
  veiculoEditId = id;
}

export async function excluirVeiculo(id) {
  if (!confirm("Deseja excluir este veículo?")) return;
  try {
    const res = await fetch(`${API_BASE}/veiculos/${id}`, { method: "DELETE" });
    if (res.ok) {
      alert("Veículo excluído!");
      carregarVeiculos();
    }
  } catch (error) {
    mostrarErro("veiculos", error);
  }
}

// Envio do formulário
document.getElementById("formVeiculo").onsubmit = async (e) => {
  e.preventDefault();
  const formData = {
    marca: document.getElementById("marca").value,
    modelo: document.getElementById("modelo").value,
    placa: document.getElementById("placa").value,
    ano: document.getElementById("ano").value,
    capacidade: document.getElementById("capacidade").value,
    tipo: document.getElementById("tipo").value,
    observacoes: document.getElementById("observacoesVeiculo").value,
    disponivel: document.getElementById("disponivel")?.checked ?? true,
  };

  let url = `${API_BASE}/veiculos`;
  let method = "POST";
  if (modoVeiculo === "editar") {
    url += `/${veiculoEditId}`;
    method = "PUT";
  }

  try {
    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    if (response.ok) {
      fecharModalVeiculo();
      document.getElementById("formVeiculo").reset();
      modoVeiculo = "cadastrar";
      veiculoEditId = null;
      carregarVeiculos();
      alert("Veículo salvo com sucesso!");
    }
  } catch (error) {
    mostrarErro("veiculos", error);
  }
};

window.editarVeiculo = editarVeiculo;
window.excluirVeiculo = excluirVeiculo;
window.abrirModalVeiculo = abrirModalVeiculo;
window.fecharModalVeiculo = fecharModalVeiculo;

// Botão fechar modal
document.getElementById("closeModalVeiculo").addEventListener("click", () => {
  fecharModalVeiculo();
});

// Botão cancelar do form
document.getElementById("btnCancelarVeiculo").addEventListener("click", () => {
  fecharModalVeiculo();
});
