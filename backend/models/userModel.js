import pool from "./db.js";

export async function criarUsuario(nome, email, senha, setor, telefone) {
  const query = `
    INSERT INTO usuarios (nome, email, senha, setor, telefone)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, nome, email, setor, telefone, data_criacao;
  `;
  const values = [nome, email, senha, setor, telefone];
  const result = await pool.query(query, values);

  const usuario = result.rows[0];
  usuario.data_criacao = usuario.data_criacao
    ? usuario.data_criacao.toISOString()
    : null;

  return usuario;
}

export async function buscarUsuarioPorEmail(email) {
  const result = await pool.query("SELECT * FROM usuarios WHERE email = $1", [
    email,
  ]);
  return result.rows[0]; // se quiser, também pode converter aqui
}

export async function buscarUsuarioPorId(id) {
  const result = await pool.query(
    "SELECT id, nome, email, setor, telefone, data_criacao FROM usuarios WHERE id = $1",
    [id]
  );

  const usuario = result.rows[0];
  if (usuario && usuario.data_criacao) {
    usuario.data_criacao = usuario.data_criacao.toISOString();
  }

  return usuario;
}

export async function buscarTodosUsuarios() {
  const result = await pool.query(
    "SELECT id, nome, email, setor, telefone, data_criacao FROM usuarios ORDER BY nome"
  );

  return result.rows.map((u) => ({
    ...u,
    data_criacao: u.data_criacao ? u.data_criacao.toISOString() : null,
  }));
}
