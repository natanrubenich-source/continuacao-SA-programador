import { 
  buscarVeiculos, 
  buscarVeiculosDisponiveis, 
  buscarVeiculoPorId, 
  criarVeiculo, 
  atualizarVeiculo, 
  deletarVeiculo 
} from "../models/veiculoModel.js";

// Listar todos os veículos
export async function listarVeiculos(req, res) {
  try {
    const veiculos = await buscarVeiculos();
    res.json(veiculos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao buscar veículos." });
  }
}

// Listar veículos disponíveis
export async function listarVeiculosDisponiveis(req, res) {
  try {
    const veiculos = await buscarVeiculosDisponiveis();
    res.json(veiculos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao buscar veículos disponíveis." });
  }
}

// Buscar veículo por ID
export async function obterVeiculo(req, res) {
  try {
    const { id } = req.params;
    const veiculo = await buscarVeiculoPorId(id);
    
    if (!veiculo) {
      return res.status(404).json({ erro: "Veículo não encontrado." });
    }
    
    res.json(veiculo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao buscar veículo." });
  }
}

// Criar novo veículo
export async function cadastrarVeiculo(req, res) {
  try {
    const { modelo, marca, placa, ano, capacidade, tipo, observacoes } = req.body;

    if (!modelo || !marca || !placa || !capacidade || !tipo) {
      return res.status(400).json({ erro: "Preencha todos os campos obrigatórios." });
    }

    const novoVeiculo = await criarVeiculo(modelo, marca, placa, ano, capacidade, tipo, observacoes);
    res.status(201).json({
      mensagem: "Veículo cadastrado com sucesso!",
      veiculo: novoVeiculo,
    });
  } catch (error) {
    console.error(error);
    if (error.code === '23505') { // Violação de chave única (placa)
      return res.status(400).json({ erro: "Placa já cadastrada." });
    }
    res.status(500).json({ erro: "Erro ao cadastrar veículo." });
  }
}

// Atualizar veículo
export async function editarVeiculo(req, res) {
  try {
    const { id } = req.params;
    const { modelo, marca, placa, ano, capacidade, tipo, disponivel, observacoes } = req.body;

    if (!modelo || !marca || !placa || !capacidade || !tipo) {
      return res.status(400).json({ erro: "Preencha todos os campos obrigatórios." });
    }

    const veiculoAtualizado = await atualizarVeiculo(id, modelo, marca, placa, ano, capacidade, tipo, disponivel, observacoes);
    
    if (!veiculoAtualizado) {
      return res.status(404).json({ erro: "Veículo não encontrado." });
    }

    res.json({
      mensagem: "Veículo atualizado com sucesso!",
      veiculo: veiculoAtualizado,
    });
  } catch (error) {
    console.error(error);
    if (error.code === '23505') {
      return res.status(400).json({ erro: "Placa já cadastrada." });
    }
    res.status(500).json({ erro: "Erro ao atualizar veículo." });
  }
}

// Deletar veículo
export async function removerVeiculo(req, res) {
  try {
    const { id } = req.params;
    const veiculoRemovido = await deletarVeiculo(id);
    
    if (!veiculoRemovido) {
      return res.status(404).json({ erro: "Veículo não encontrado." });
    }

    res.json({ mensagem: "Veículo removido com sucesso!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao remover veículo." });
  }
}
