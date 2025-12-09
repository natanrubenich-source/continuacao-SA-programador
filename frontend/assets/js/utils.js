export function formatarData(data) {
  if (!data) return "N/A";
  return new Date(data).toLocaleDateString("pt-BR");
}

export function formatarStatus(status) {
  const statusMap = {
    agendada: "Agendada",
    em_andamento: "Em Andamento",
    concluida: "Concluída",
    cancelada: "Cancelada",
  };
  return statusMap[status] || status;
}

export function mostrarErro(secao, erro) {
  console.error(`Erro ao carregar ${secao}:`, erro);
  const container =
    document.getElementById(`${secao}Table`) ||
    document.getElementById(`${secao}Grid`) ||
    document.getElementById(`${secao}`);
  if (container) {
    container.innerHTML = `<p style="color:red; text-align:center;">Erro ao conectar com o servidor!</p>`;
  }
}
