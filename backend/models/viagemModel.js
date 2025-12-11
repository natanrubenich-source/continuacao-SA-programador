import pool from "./db.js";

// Buscar todas as viagens
export async function buscarViagens() {
  const query = `
    SELECT v.*, u.nome as motorista_nome, ve.id AS veiculo_id, ve.modelo, ve.marca, ve.placa,
           (SELECT COUNT(*) FROM viagem_participantes vp WHERE vp.viagem_id = v.id) as participantes_count
    FROM viagens v
    LEFT JOIN usuarios u ON v.motorista_id = u.id
    LEFT JOIN veiculos ve ON v.veiculo_id = ve.id
    ORDER BY v.data_viagem DESC, v.hora_saida DESC;
  `;
  const result = await pool.query(query);

  // Mapeando o veiculo para um objeto
  return result.rows.map((row) => ({
    ...row,
    veiculo: {
      id: row.veiculo_id || null,
      modelo: row.modelo || "N/A",
      marca: row.marca || "N/A",
      placa: row.placa || "N/A",
    },
  }));
}

// Buscar viagem por ID
export async function buscarViagemPorId(id) {
  const query = `
    SELECT v.*, u.nome as motorista_nome, ve.id AS veiculo_id, ve.modelo, ve.marca, ve.placa
    FROM viagens v
    LEFT JOIN usuarios u ON v.motorista_id = u.id
    LEFT JOIN veiculos ve ON v.veiculo_id = ve.id
    WHERE v.id = $1;
  `;
  const result = await pool.query(query, [id]);
  const row = result.rows[0];

  if (!row) return null;

  return {
    ...row,
    veiculo: {
      id: row.veiculo_id || null,
      modelo: row.modelo || "N/A",
      marca: row.marca || "N/A",
      placa: row.placa || "N/A",
    },
  };
}

// Criar nova viagem
export async function criarViagem(
  destino,
  dataViagem,
  horaSaida,
  horaRetorno,
  motoristaId,
  veiculoId,
  vagasDisponiveis,
  observacoes
) {
  const query = `
    INSERT INTO viagens (destino, data_viagem, hora_saida, hora_retorno, motorista_id, veiculo_id, vagas_disponiveis, observacoes)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *;
  `;
  const values = [
    destino,
    dataViagem,
    horaSaida,
    horaRetorno,
    motoristaId,
    veiculoId,
    vagasDisponiveis,
    observacoes,
  ];
  const result = await pool.query(query, values);
  return result.rows[0];
}

// Atualizar viagem
export async function atualizarViagem(
  id,
  destino,
  dataViagem,
  horaSaida,
  horaRetorno,
  motoristaId,
  veiculoId,
  vagasDisponiveis,
  status,
  observacoes
) {
  const query = `
    UPDATE viagens 
    SET destino = $2, data_viagem = $3, hora_saida = $4, hora_retorno = $5, 
        motorista_id = $6, veiculo_id = $7, vagas_disponiveis = $8, status = $9, observacoes = $10
    WHERE id = $1
    RETURNING *;
  `;
  const values = [
    id,
    destino,
    dataViagem,
    horaSaida,
    horaRetorno,
    motoristaId,
    veiculoId,
    vagasDisponiveis,
    status,
    observacoes,
  ];
  const result = await pool.query(query, values);
  return result.rows[0];
}

// Deletar viagem
export async function deletarViagem(id) {
  const result = await pool.query(
    "DELETE FROM viagens WHERE id = $1 RETURNING *",
    [id]
  );
  return result.rows[0];
}

// Buscar participantes de uma viagem
export async function buscarParticipantesViagem(viagemId) {
  const query = `
    SELECT vp.*, u.nome, u.email, u.setor
    FROM viagem_participantes vp
    JOIN usuarios u ON vp.usuario_id = u.id
    WHERE vp.viagem_id = $1
    ORDER BY vp.data_inscricao;
  `;
  const result = await pool.query(query, [viagemId]);
  return result.rows;
}

// Inscrever usuário em viagem
export async function inscreverUsuarioViagem(viagemId, usuarioId) {
  const query = `
    INSERT INTO viagem_participantes (viagem_id, usuario_id)
    VALUES ($1, $2)
    RETURNING *;
  `;
  const result = await pool.query(query, [viagemId, usuarioId]);
  return result.rows[0];
}

// Remover usuário de viagem
export async function removerUsuarioViagem(viagemId, usuarioId) {
  const result = await pool.query(
    "DELETE FROM viagem_participantes WHERE viagem_id = $1 AND usuario_id = $2 RETURNING *",
    [viagemId, usuarioId]
  );
  return result.rows[0];
}
