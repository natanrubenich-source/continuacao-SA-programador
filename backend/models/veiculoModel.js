import pool from "./db.js";

// Buscar todos os veículos
export async function buscarVeiculos() {
  const result = await pool.query(
    "SELECT * FROM veiculos ORDER BY marca, modelo"
  );
  return result.rows;
}

// Buscar veículos disponíveis
export async function buscarVeiculosDisponiveis() {
  const result = await pool.query(
    "SELECT * FROM veiculos WHERE disponivel = true ORDER BY marca, modelo"
  );
  return result.rows;
}

// Buscar veículo por ID
export async function buscarVeiculoPorId(id) {
  const result = await pool.query("SELECT * FROM veiculos WHERE id = $1", [id]);
  return result.rows[0];
}

// Criar novo veículo
export async function criarVeiculo(modelo, marca, placa, ano, capacidade, tipo, observacoes) {
  const query = `
    INSERT INTO veiculos (modelo, marca, placa, ano, capacidade, tipo, observacoes)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *;
  `;
  const values = [modelo, marca, placa, ano, capacidade, tipo, observacoes];
  const result = await pool.query(query, values);
  return result.rows[0];
}

// Atualizar veículo
export async function atualizarVeiculo(id, modelo, marca, placa, ano, capacidade, tipo, disponivel, observacoes) {
  const query = `
    UPDATE veiculos 
    SET modelo = $2, marca = $3, placa = $4, ano = $5, capacidade = $6, 
        tipo = $7, disponivel = $8, observacoes = $9
    WHERE id = $1
    RETURNING *;
  `;
  const values = [id, modelo, marca, placa, ano, capacidade, tipo, disponivel, observacoes];
  const result = await pool.query(query, values);
  return result.rows[0];
}

// Deletar veículo
export async function deletarVeiculo(id) {
  const result = await pool.query("DELETE FROM veiculos WHERE id = $1 RETURNING *", [id]);
  return result.rows[0];
}
