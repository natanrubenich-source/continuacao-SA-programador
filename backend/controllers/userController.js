import { 
  criarUsuario, 
  buscarUsuarioPorEmail, 
  buscarUsuarioPorId, 
  buscarTodosUsuarios
} from "../models/userModel.js";

// ===== FUNÇÃO DE CADASTRO SIMPLES COM VALIDAÇÃO =====
export async function registrarUsuario(req, res) {
  try {
    const { nome, email, senha, setor, telefone } = req.body;

    // Validação básica - verifica campos obrigatórios
    if (!nome || !email || !senha) {
      return res.status(400).json({ erro: "Preencha todos os campos obrigatórios." });
    }

    // Verifica se email já existe (validação simples)
    const usuarioExistente = await buscarUsuarioPorEmail(email);
    if (usuarioExistente) {
      return res.status(400).json({ erro: "Este email já está cadastrado." });
    }

    // Cria novo usuário no banco de dados
    const novoUsuario = await criarUsuario(nome, email, senha, setor, telefone);
    res.status(201).json({
      mensagem: "Usuário cadastrado com sucesso!",
      usuario: novoUsuario,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao cadastrar usuário." });
  }
}

// ===== FUNÇÃO DE LOGIN SIMPLES COM VALIDAÇÃO =====
export async function loginUsuario(req, res) {
  try {
    const { email, senha } = req.body;

    // Validação básica - verifica se campos foram enviados
    if (!email || !senha) {
      return res.status(400).json({ erro: "Preencha email e senha." });
    }

    // Busca usuário no banco de dados pelo email
    const usuario = await buscarUsuarioPorEmail(email);
    if (!usuario) {
      return res.status(401).json({ erro: "Email ou senha inválidos." });
    }

    // Verifica senha (comparação simples - sem criptografia para fins didáticos)
    if (usuario.senha !== senha) {
      return res.status(401).json({ erro: "Email ou senha inválidos." });
    }

    // Login bem-sucedido - remove senha do retorno
    const { senha: _, ...usuarioSemSenha } = usuario;

    res.json({
      mensagem: "Login realizado com sucesso!",
      usuario: usuarioSemSenha,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao fazer login." });
  }
}

export async function listarUsuarios(req, res) {
  try {
    const usuarios = await buscarTodosUsuarios();
    res.json(usuarios);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao buscar usuários." });
  }
}

export async function obterUsuario(req, res) {
  try {
    const { id } = req.params;
    const usuario = await buscarUsuarioPorId(id);
    
    if (!usuario) {
      return res.status(404).json({ erro: "Usuário não encontrado." });
    }
    
    res.json(usuario);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao buscar usuário." });
  }
}
