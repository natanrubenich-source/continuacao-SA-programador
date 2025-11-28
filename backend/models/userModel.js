import pool from "./db.js";

export async function criarUsuario(nome, email, senha, setor, telefone) {
  // Senha simples sem criptografia para fins didáticos
  const query = `
    INSERT INTO usuarios (nome, email, senha, setor, telefone)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, nome, email, setor, telefone, data_criacao;
  `;
  const values = [nome, email, senha, setor, telefone];
  const result = await pool.query(query, values);
  return result.rows[0];
}

export async function buscarUsuarioPorEmail(email) {
  const result = await pool.query("SELECT * FROM usuarios WHERE email = $1", [
    email,
  ]);
  return result.rows[0];
}

export async function buscarUsuarioPorId(id) {
  const result = await pool.query("SELECT id, nome, email, setor, telefone, data_criacao FROM usuarios WHERE id = $1", [
    id,
  ]);
  return result.rows[0];
}

export async function buscarTodosUsuarios() {
  const result = await pool.query("SELECT id, nome, email, setor, telefone, data_criacao FROM usuarios ORDER BY nome");
  return result.rows;
}
