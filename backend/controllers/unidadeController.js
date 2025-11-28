import { 
  buscarUnidades, 
  buscarUnidadePorId, 
  criarUnidade, 
  atualizarUnidade, 
  desativarUnidade 
} from "../models/unidadeModel.js";

// Listar todas as unidades
export async function listarUnidades(req, res) {
  try {
    const unidades = await buscarUnidades();
    res.json(unidades);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao buscar unidades." });
  }
}

// Buscar unidade por ID
export async function obterUnidade(req, res) {
  try {
    const { id } = req.params;
    const unidade = await buscarUnidadePorId(id);
    
    if (!unidade) {
      return res.status(404).json({ erro: "Unidade não encontrada." });
    }
    
    res.json(unidade);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao buscar unidade." });
  }
}

// Criar nova unidade
export async function cadastrarUnidade(req, res) {
  try {
    const { nome, endereco, cidade, estado } = req.body;

    if (!nome || !endereco || !cidade) {
      return res.status(400).json({ erro: "Preencha todos os campos obrigatórios." });
    }

    const novaUnidade = await criarUnidade(nome, endereco, cidade, estado);
    res.status(201).json({
      mensagem: "Unidade cadastrada com sucesso!",
      unidade: novaUnidade,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao cadastrar unidade." });
  }
}

// Atualizar unidade
export async function editarUnidade(req, res) {
  try {
    const { id } = req.params;
    const { nome, endereco, cidade, estado, ativo } = req.body;

    if (!nome || !endereco || !cidade) {
      return res.status(400).json({ erro: "Preencha todos os campos obrigatórios." });
    }

    const unidadeAtualizada = await atualizarUnidade(id, nome, endereco, cidade, estado, ativo);
    
    if (!unidadeAtualizada) {
      return res.status(404).json({ erro: "Unidade não encontrada." });
    }

    res.json({
      mensagem: "Unidade atualizada com sucesso!",
      unidade: unidadeAtualizada,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao atualizar unidade." });
  }
}

// Desativar unidade
export async function removerUnidade(req, res) {
  try {
    const { id } = req.params;
    const unidadeDesativada = await desativarUnidade(id);
    
    if (!unidadeDesativada) {
      return res.status(404).json({ erro: "Unidade não encontrada." });
    }

    res.json({ mensagem: "Unidade desativada com sucesso!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao desativar unidade." });
  }
}
