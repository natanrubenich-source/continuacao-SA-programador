import { API_BASE } from "./config.js";
import { formatarData, formatarStatus, mostrarErro } from "./utils.js";

let modoViagem = "cadastrar";
let viagemEditId = null;

// Carrega todas as viagens na tabela
export async function carregarViagens() {
  try {
    const res = await fetch(`${API_BASE}/viagens`);
    const viagens = await res.json();
    const tbody = document.querySelector("#viagensTable tbody");

    tbody.innerHTML = viagens
      .map(
        (v) => `
        <tr>
            <td>${v.destino}</td>
            <td>${formatarData(v.data_viagem)}</td>
            <td>${v.hora_saida}</td>
            <td>${v.veiculo ? v.veiculo.modelo : "N/A"}</td>
            <td>${v.vagas_disponiveis}</td>
            <td><span class="status-badge status-${v.status}">${formatarStatus(
          v.status
        )}</span></td>
            <td>
                <button onclick="editarViagem(${v.id})">Editar</button>
                <button onclick="cancelarViagem(${v.id})">Cancelar</button>
            </td>
        </tr>
      `
      )
      .join("");
  } catch (error) {
    mostrarErro("viagens", error);
  }
}

// Carrega as próximas 5 viagens para o dashboard
export async function carregarProximasViagens() {
  try {
    const res = await fetch(`${API_BASE}/viagens`);
    const viagens = await res.json();
    const container = document.getElementById("proximasViagens");
    const hoje = new Date();

    const proximas = viagens
      .filter((v) => new Date(v.data_viagem) >= hoje)
      .sort((a, b) => new Date(a.data_viagem) - new Date(b.data_viagem))
      .slice(0, 5);

    if (proximas.length === 0) {
      container.innerHTML = "<p>Nenhuma viagem agendada</p>";
      return;
    }

    container.innerHTML = proximas
      .map(
        (v) => `
        <div class="trip-item">
            <div><strong>${v.destino}</strong> - ${formatarData(
          v.data_viagem
        )}</div>
            <div>${v.hora_saida} | ${
          v.veiculo?.modelo || "Veículo não definido"
        } | ${v.vagas_disponiveis} vagas</div>
        </div>
      `
      )
      .join("");
  } catch (error) {
    mostrarErro("viagens", error);
  }
}

// Abrir modal de viagem
export function abrirModalViagem() {
  document.getElementById("modalViagem").style.display = "block";
}

// Fechar modal de viagem
export function fecharModalViagem() {
  document.getElementById("modalViagem").style.display = "none";
}

// Editar viagem
export async function editarViagem(id) {
  try {
    const res = await fetch(`${API_BASE}/viagens/${id}`);
    const v = await res.json();

    document.getElementById("destino").value = v.destino;
    document.getElementById("dataViagem").value = v.data_viagem;
    document.getElementById("horaSaida").value = v.hora_saida;
    document.getElementById("horaRetorno").value = v.hora_retorno || "";
    document.getElementById("veiculoId").value = v.veiculo?.id || "";
    document.getElementById("vagasDisponiveis").value = v.vagas_disponiveis;
    document.getElementById("observacoes").value = v.observacoes || "";

    abrirModalViagem();
    modoViagem = "editar";
    viagemEditId = id;
  } catch (error) {
    mostrarErro("viagens", error);
  }
}

// Cancelar viagem
export async function cancelarViagem(id) {
  if (!confirm("Deseja cancelar esta viagem?")) return;
  try {
    const res = await fetch(`${API_BASE}/viagens/${id}`, { method: "DELETE" });
    if (res.ok) {
      alert("Viagem cancelada!");
      carregarViagens();
      carregarProximasViagens();
    }
  } catch (error) {
    mostrarErro("viagens", error);
  }
}

// Envio do formulário de viagem
document.getElementById("formViagem").onsubmit = async (e) => {
  e.preventDefault();

  const formData = {
    destino: document.getElementById("destino").value,
    data_viagem: document.getElementById("dataViagem").value,
    hora_saida: document.getElementById("horaSaida").value,
    hora_retorno: document.getElementById("horaRetorno").value,
    veiculo_id: document.getElementById("veiculoId").value,
    vagas_disponiveis: document.getElementById("vagasDisponiveis").value,
    observacoes: document.getElementById("observacoes").value,
  };

  let url = `${API_BASE}/viagens`;
  let method = "POST";
  if (modoViagem === "editar") {
    url += `/${viagemEditId}`;
    method = "PUT";
  }

  try {
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      fecharModalViagem();
      document.getElementById("formViagem").reset();
      modoViagem = "cadastrar";
      viagemEditId = null;
      carregarViagens();
      carregarProximasViagens();
      alert("Viagem salva com sucesso!");
    }
  } catch (error) {
    mostrarErro("viagens", error);
  }
};
