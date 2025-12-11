import { API_BASE } from "./config.js";
import { formatarData, mostrarErro } from "./utils.js";

export async function carregarUsuarios() {
  try {
    const res = await fetch(`${API_BASE}/users`);
    const users = await res.json();
    const tbody = document.querySelector("#usuariosTable tbody");

    tbody.innerHTML = users
      .map(
        (u) => `
            <tr>
                <td>${u.nome}</td>
                <td>${u.email}</td>
                <td>${u.setor || "N/A"}</td>
                <td>${u.telefone || "N/A"}</td>
                <td>${formatarData(u.data_criacao)}</td>
            </tr>
        `
      )
      .join("");
  } catch (error) {
    mostrarErro("usuarios", error);
  }
}
