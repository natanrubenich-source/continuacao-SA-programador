import { API_BASE } from "./config.js";
import { formatarData, formatarStatus, mostrarErro } from "./utils.js";

let modoViagem = "cadastrar";
let viagemEditId = null;

/* ============================================================
   CARREGAR VIAGENS (listagem principal)
============================================================ */
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
            <td>
  <span class="status-badge status-${
    v.status?.toLowerCase().replace(/ /g, "_") || "agendada"
  }">
  ${formatarStatus(v.status)}
</span>

</td>

            <td>
              <div class="td-action-btn">
                <button class="btn-edit action-btn" onclick="editarViagem(${
                  v.id
                })">
                  <i class="fas fa-edit"></i> Editar
                </button>
                <button class="btn-delete action-btn" onclick="cancelarViagem(${
                  v.id
                })">
                  <i class="fas fa-trash"></i> Excluir
                </button>
              </div>
            </td>
        </tr>
      `
      )
      .join("");
  } catch (error) {
    mostrarErro("viagens", error);
  }
}

/* ============================================================
   CARREGAR PRÓXIMAS VIAGENS (dashboard)
============================================================ */
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
            <div>
              ${v.hora_saida} |
              ${v.veiculo?.modelo || "Veículo não definido"} |
              ${v.vagas_disponiveis} vagas
            </div>
        </div>
      `
      )
      .join("");
  } catch (error) {
    mostrarErro("viagens", error);
  }
}

/* ============================================================
   MODAL: ABRIR / FECHAR
============================================================ */
export function abrirModalViagem() {
  document.getElementById("modalViagem").style.display = "block";
}

export function fecharModalViagem() {
  document.getElementById("modalViagem").style.display = "none";
}

function formatarParaInputDate(dataStr) {
  if (!dataStr) return "";
  const date = new Date(dataStr);
  if (isNaN(date)) return "";

  const ano = date.getFullYear();
  const mes = String(date.getMonth() + 1).padStart(2, "0");
  const dia = String(date.getDate()).padStart(2, "0");

  return `${ano}-${mes}-${dia}`;
}

/* ============================================================
   EDITAR VIAGEM
============================================================ */
export async function editarViagem(id) {
  try {
    const res = await fetch(`${API_BASE}/viagens/${id}`);
    const v = await res.json();

    await carregarVeiculosSelect();

    document.getElementById("destino").value = v.destino;
    document.getElementById("dataViagem").value = formatarParaInputDate(
      v.data_viagem
    );
    document.getElementById("horaSaida").value = v.hora_saida;
    document.getElementById("horaRetorno").value = v.hora_retorno || "";
    document.getElementById("veiculoId").value = v.veiculo?.id || "";
    document.getElementById("vagasDisponiveis").value = v.vagas_disponiveis;
    document.getElementById("observacoes").value = v.observacoes || "";
    document.getElementById("statusViagem").value = v.status || "Agendada";

    abrirModalViagem();
    modoViagem = "editar";
    viagemEditId = id;
  } catch (error) {
    mostrarErro("viagens", error);
  }
}

/* ============================================================
   CANCELAR / EXCLUIR VIAGEM
============================================================ */
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

export async function carregarVeiculosSelect() {
  try {
    const res = await fetch(`${API_BASE}/veiculos`);
    const veiculos = await res.json();
    const select = document.getElementById("veiculoId");

    select.innerHTML =
      `<option value="">Escolha um veículo</option>` +
      veiculos
        .map(
          (v) =>
            `<option value="${v.id}">${v.marca} ${v.modelo} - ${v.placa}</option>`
        )
        .join("");
  } catch (error) {
    mostrarErro("veiculosSelect", error);
  }
}

/* ============================================================
   FORMULÁRIO DE CADASTRO / EDIÇÃO
============================================================ */
document.getElementById("formViagem").onsubmit = async (e) => {
  e.preventDefault();

  const veiculoIdValue = document.getElementById("veiculoId").value;

  const formData = {
    destino: document.getElementById("destino").value,
    dataViagem: document.getElementById("dataViagem").value,
    horaSaida: document.getElementById("horaSaida").value,
    horaRetorno: document.getElementById("horaRetorno").value,
    veiculoId: veiculoIdValue ? parseInt(veiculoIdValue) : null,
    vagasDisponiveis: parseInt(
      document.getElementById("vagasDisponiveis").value
    ),
    observacoes: document.getElementById("observacoes").value,
    status: document.getElementById("statusViagem").value || "Agendada",
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

/* ============================================================
   EXPORTAÇÃO PARA O HTML (botões inline)
============================================================ */
window.editarViagem = editarViagem;
window.cancelarViagem = cancelarViagem;
window.abrirModalViagem = abrirModalViagem;
window.fecharModalViagem = fecharModalViagem;

document
  .getElementById("closeModalViagem")
  .addEventListener("click", fecharModalViagem);

document.getElementById("btnNovaViagem").addEventListener("click", async () => {
  try {
    modoViagem = "cadastrar";
    viagemEditId = null;
    document.getElementById("formViagem").reset();
    document.getElementById("modalViagem").style.display = "block";
    await carregarVeiculosSelect(); // safe
  } catch (error) {
    mostrarErro("viagens", error);
  }
});
