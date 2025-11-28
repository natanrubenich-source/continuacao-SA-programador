import { 
  buscarViagens, 
  buscarViagemPorId, 
  criarViagem, 
  atualizarViagem, 
  deletarViagem,
  buscarParticipantesViagem,
  inscreverUsuarioViagem,
  removerUsuarioViagem
} from "../models/viagemModel.js";

// Listar todas as viagens
export async function listarViagens(req, res) {
  try {
    const viagens = await buscarViagens();
    res.json(viagens);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao buscar viagens." });
  }
}

// Buscar viagem por ID
export async function obterViagem(req, res) {
  try {
    const { id } = req.params;
    const viagem = await buscarViagemPorId(id);
    
    if (!viagem) {
      return res.status(404).json({ erro: "Viagem não encontrada." });
    }
    
    const participantes = await buscarParticipantesViagem(id);
    viagem.participantes = participantes;
    
    res.json(viagem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao buscar viagem." });
  }
}

// Criar nova viagem
export async function agendarViagem(req, res) {
  try {
    const { destino, dataViagem, horaSaida, horaRetorno, motoristaId, veiculoId, vagasDisponiveis, observacoes } = req.body;

    if (!destino || !dataViagem || !horaSaida || !veiculoId || !vagasDisponiveis) {
      return res.status(400).json({ erro: "Preencha todos os campos obrigatórios." });
    }

    const novaViagem = await criarViagem(destino, dataViagem, horaSaida, horaRetorno, motoristaId, veiculoId, vagasDisponiveis, observacoes);
    res.status(201).json({
      mensagem: "Viagem agendada com sucesso!",
      viagem: novaViagem,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao agendar viagem." });
  }
}

// Atualizar viagem
export async function editarViagem(req, res) {
  try {
    const { id } = req.params;
    const { destino, dataViagem, horaSaida, horaRetorno, motoristaId, veiculoId, vagasDisponiveis, status, observacoes } = req.body;

    if (!destino || !dataViagem || !horaSaida || !veiculoId || !vagasDisponiveis) {
      return res.status(400).json({ erro: "Preencha todos os campos obrigatórios." });
    }

    const viagemAtualizada = await atualizarViagem(id, destino, dataViagem, horaSaida, horaRetorno, motoristaId, veiculoId, vagasDisponiveis, status, observacoes);
    
    if (!viagemAtualizada) {
      return res.status(404).json({ erro: "Viagem não encontrada." });
    }

    res.json({
      mensagem: "Viagem atualizada com sucesso!",
      viagem: viagemAtualizada,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao atualizar viagem." });
  }
}

// Deletar viagem
export async function cancelarViagem(req, res) {
  try {
    const { id } = req.params;
    const viagemRemovida = await deletarViagem(id);
    
    if (!viagemRemovida) {
      return res.status(404).json({ erro: "Viagem não encontrada." });
    }

    res.json({ mensagem: "Viagem cancelada com sucesso!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao cancelar viagem." });
  }
}

// Inscrever usuário em viagem
export async function participarViagem(req, res) {
  try {
    const { viagemId, usuarioId } = req.body;

    if (!viagemId || !usuarioId) {
      return res.status(400).json({ erro: "Dados incompletos." });
    }

    const participante = await inscreverUsuarioViagem(viagemId, usuarioId);
    res.status(201).json({
      mensagem: "Inscrição realizada com sucesso!",
      participante,
    });
  } catch (error) {
    console.error(error);
    if (error.code === '23505') { // Violação de chave única
      return res.status(400).json({ erro: "Usuário já inscrito nesta viagem." });
    }
    res.status(500).json({ erro: "Erro ao inscrever na viagem." });
  }
}

// Remover usuário de viagem
export async function sairViagem(req, res) {
  try {
    const { viagemId, usuarioId } = req.body;

    if (!viagemId || !usuarioId) {
      return res.status(400).json({ erro: "Dados incompletos." });
    }

    const participanteRemovido = await removerUsuarioViagem(viagemId, usuarioId);
    
    if (!participanteRemovido) {
      return res.status(404).json({ erro: "Inscrição não encontrada." });
    }

    res.json({ mensagem: "Inscrição removida com sucesso!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao remover inscrição." });
  }
}
