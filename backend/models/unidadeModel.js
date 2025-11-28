import pool from "./db.js";

// Buscar todas as unidades
export async function buscarUnidades() {
  const result = await pool.query(
    "SELECT * FROM unidades WHERE ativo = true ORDER BY nome"
  );
  return result.rows;
}

// Buscar unidade por ID
export async function buscarUnidadePorId(id) {
  const result = await pool.query("SELECT * FROM unidades WHERE id = $1", [id]);
  return result.rows[0];
}

// Criar nova unidade
export async function criarUnidade(nome, endereco, cidade, estado = 'SC') {
  const query = `
    INSERT INTO unidades (nome, endereco, cidade, estado)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;
  const values = [nome, endereco, cidade, estado];
  const result = await pool.query(query, values);
  return result.rows[0];
}

// Atualizar unidade
export async function atualizarUnidade(id, nome, endereco, cidade, estado, ativo) {
  const query = `
    UPDATE unidades 
    SET nome = $2, endereco = $3, cidade = $4, estado = $5, ativo = $6
    WHERE id = $1
    RETURNING *;
  `;
  const values = [id, nome, endereco, cidade, estado, ativo];
  const result = await pool.query(query, values);
  return result.rows[0];
}

// Desativar unidade (soft delete)
export async function desativarUnidade(id) {
  const result = await pool.query(
    "UPDATE unidades SET ativo = false WHERE id = $1 RETURNING *", 
    [id]
  );
  return result.rows[0];
}
