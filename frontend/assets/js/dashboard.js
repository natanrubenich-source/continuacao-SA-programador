// Variáveis globais
const API_BASE = 'http://localhost:3000/api';

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    inicializarNavegacao();
    carregarDados();
    // Definir usuário padrão para simplificar
    document.getElementById('userName').textContent = 'Usuário SENAI';
    document.getElementById('userEmail').textContent = 'usuario@senai.sc';
});

// Navegação entre seções
function inicializarNavegacao() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.content-section');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Remove active class from all nav items and sections
            document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
            sections.forEach(section => section.classList.remove('active'));
            
            // Add active class to clicked nav item
            link.parentElement.classList.add('active');
            
            // Show corresponding section
            const sectionId = link.dataset.section + '-section';
            document.getElementById(sectionId).classList.add('active');
            
            // Carregar dados específicos da seção
            carregarDadosSecao(link.dataset.section);
        });
    });
}

// Carregar dados iniciais
async function carregarDados() {
    try {
        await Promise.all([
            carregarEstatisticas(),
            carregarProximasViagens()
        ]);
    } catch (error) {
        console.error('Erro ao carregar dados:', error);
    }
}

// Carregar dados específicos de cada seção
async function carregarDadosSecao(secao) {
    switch (secao) {
        case 'viagens':
            await carregarViagens();
            break;
        case 'veiculos':
            await carregarVeiculos();
            break;
        case 'usuarios':
            await carregarUsuarios();
            break;
    }
}

// Carregar estatísticas do dashboard
async function carregarEstatisticas() {
    try {
        const [viagens, veiculos, usuarios] = await Promise.all([
            fetch(`${API_BASE}/viagens`).then(r => r.json()),
            fetch(`${API_BASE}/veiculos`).then(r => r.json()),
            fetch(`${API_BASE}/users`).then(r => r.json())
        ]);
        
        document.getElementById('totalViagens').textContent = viagens.length;
        document.getElementById('totalVeiculos').textContent = veiculos.filter(v => v.disponivel).length;
        document.getElementById('totalUsuarios').textContent = usuarios.length;
        
        // Viagens hoje
        const hoje = new Date().toISOString().split('T')[0];
        const viagensHoje = viagens.filter(v => v.data_viagem === hoje);
        document.getElementById('viagensHoje').textContent = viagensHoje.length;
        
    } catch (error) {
        console.error('Erro ao carregar estatísticas:', error);
    }
}

// Carregar próximas viagens
async function carregarProximasViagens() {
    try {
        const response = await fetch(`${API_BASE}/viagens`);
        const viagens = await response.json();
        
        // Filtrar próximas viagens (futuras ou de hoje)
        const hoje = new Date();
        const proximasViagens = viagens
            .filter(v => new Date(v.data_viagem) >= hoje)
            .sort((a, b) => new Date(a.data_viagem) - new Date(b.data_viagem))
            .slice(0, 5);
        
        const container = document.getElementById('proximasViagens');
        
        if (proximasViagens.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: #666;">Nenhuma viagem agendada</p>';
            return;
        }
        
        container.innerHTML = proximasViagens.map(viagem => `
            <div class="trip-item">
                <div class="trip-header">
                    <span class="trip-destination">${viagem.destino}</span>
                    <span class="trip-date">${formatarData(viagem.data_viagem)}</span>
                </div>
                <div class="trip-details">
                    <span><i class="fas fa-clock"></i> ${viagem.hora_saida}</span>
                    <span><i class="fas fa-car"></i> ${viagem.modelo || 'Veículo não definido'}</span>
                    <span><i class="fas fa-users"></i> ${viagem.vagas_disponiveis} vagas</span>
                </div>
            </div>
        `).join('');
        
    } catch (error) {
        console.error('Erro ao carregar próximas viagens:', error);
    }
}

// Carregar viagens
async function carregarViagens() {
    try {
        const response = await fetch(`${API_BASE}/viagens`);
        const viagens = await response.json();
        
        const tbody = document.querySelector('#viagensTable tbody');
        tbody.innerHTML = viagens.map(viagem => `
            <tr>
                <td>${viagem.destino}</td>
                <td>${formatarData(viagem.data_viagem)}</td>
                <td>${viagem.hora_saida}</td>
                <td>${viagem.modelo ? `${viagem.marca} ${viagem.modelo}` : 'N/A'}</td>
                <td>${viagem.vagas_disponiveis}</td>
                <td><span class="status-badge status-${viagem.status}">${formatarStatus(viagem.status)}</span></td>
                <td>
                    <button class="action-btn btn-edit" onclick="editarViagem(${viagem.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn btn-delete" onclick="excluirViagem(${viagem.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
        
    } catch (error) {
        console.error('Erro ao carregar viagens:', error);
    }
}

// Carregar veículos
async function carregarVeiculos() {
    try {
        const response = await fetch(`${API_BASE}/veiculos`);
        const veiculos = await response.json();
        
        const container = document.getElementById('veiculosGrid');
        container.innerHTML = veiculos.map(veiculo => `
            <div class="vehicle-card">
                <div class="vehicle-header">
                    <span class="vehicle-title">${veiculo.marca} ${veiculo.modelo}</span>
                    <span class="vehicle-status ${veiculo.disponivel ? 'disponivel' : 'indisponivel'}">
                        ${veiculo.disponivel ? 'Disponível' : 'Indisponível'}
                    </span>
                </div>
                <div class="vehicle-info">
                    <div class="vehicle-info-item">
                        <i class="fas fa-id-card"></i>
                        <span>${veiculo.placa}</span>
                    </div>
                    <div class="vehicle-info-item">
                        <i class="fas fa-calendar"></i>
                        <span>${veiculo.ano || 'N/A'}</span>
                    </div>
                    <div class="vehicle-info-item">
                        <i class="fas fa-users"></i>
                        <span>${veiculo.capacidade} lugares</span>
                    </div>
                    <div class="vehicle-info-item">
                        <i class="fas fa-car"></i>
                        <span>${veiculo.tipo}</span>
                    </div>
                </div>
                ${veiculo.observacoes ? `<p style="margin-top: 10px; font-size: 0.9rem; color: #666;">${veiculo.observacoes}</p>` : ''}
                <div style="margin-top: 15px;">
                    <button class="action-btn btn-edit" onclick="editarVeiculo(${veiculo.id})">
                        <i class="fas fa-edit"></i> Editar
                    </button>
                    <button class="action-btn btn-delete" onclick="excluirVeiculo(${veiculo.id})">
                        <i class="fas fa-trash"></i> Excluir
                    </button>
                </div>
            </div>
        `).join('');
        
    } catch (error) {
        console.error('Erro ao carregar veículos:', error);
    }
}

// Carregar usuários
async function carregarUsuarios() {
    try {
        const response = await fetch(`${API_BASE}/users`);
        const usuarios = await response.json();
        
        const tbody = document.querySelector('#usuariosTable tbody');
        tbody.innerHTML = usuarios.map(usuario => `
            <tr>
                <td>${usuario.nome}</td>
                <td>${usuario.email}</td>
                <td>${usuario.setor || 'N/A'}</td>
                <td>${usuario.telefone || 'N/A'}</td>
                <td>${formatarData(usuario.data_criacao)}</td>
            </tr>
        `).join('');
        
    } catch (error) {
        console.error('Erro ao carregar usuários:', error);
    }
}

// Modais
function abrirModalViagem() {
    carregarVeiculosSelect();
    document.getElementById('modalViagem').style.display = 'block';
}

function abrirModalVeiculo() {
    document.getElementById('modalVeiculo').style.display = 'block';
}

function fecharModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Carregar veículos no select
async function carregarVeiculosSelect() {
    try {
        const response = await fetch(`${API_BASE}/veiculos/disponiveis`);
        const veiculos = await response.json();
        
        const select = document.getElementById('veiculoId');
        select.innerHTML = '<option value="">Selecione um veículo</option>' +
            veiculos.map(v => `<option value="${v.id}">${v.marca} ${v.modelo} - ${v.placa}</option>`).join('');
            
    } catch (error) {
        console.error('Erro ao carregar veículos:', error);
    }
}

// Formulários
document.getElementById('formViagem').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
        destino: document.getElementById('destino').value,
        dataViagem: document.getElementById('dataViagem').value,
        horaSaida: document.getElementById('horaSaida').value,
        horaRetorno: document.getElementById('horaRetorno').value,
        veiculoId: document.getElementById('veiculoId').value,
        vagasDisponiveis: document.getElementById('vagasDisponiveis').value,
        observacoes: document.getElementById('observacoes').value
    };
    
    try {
        const response = await fetch(`${API_BASE}/viagens`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });
        
        if (response.ok) {
            fecharModal('modalViagem');
            document.getElementById('formViagem').reset();
            carregarViagens();
            carregarEstatisticas();
            alert('Viagem agendada com sucesso!');
        } else {
            const error = await response.json();
            alert('Erro: ' + error.erro);
        }
    } catch (error) {
        console.error('Erro ao agendar viagem:', error);
        alert('Erro ao conectar com o servidor');
    }
});

document.getElementById('formVeiculo').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
        marca: document.getElementById('marca').value,
        modelo: document.getElementById('modelo').value,
        placa: document.getElementById('placa').value,
        ano: document.getElementById('ano').value,
        capacidade: document.getElementById('capacidade').value,
        tipo: document.getElementById('tipo').value,
        observacoes: document.getElementById('observacoesVeiculo').value
    };
    
    try {
        const response = await fetch(`${API_BASE}/veiculos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });
        
        if (response.ok) {
            fecharModal('modalVeiculo');
            document.getElementById('formVeiculo').reset();
            carregarVeiculos();
            carregarEstatisticas();
            alert('Veículo cadastrado com sucesso!');
        } else {
            const error = await response.json();
            alert('Erro: ' + error.erro);
        }
    } catch (error) {
        console.error('Erro ao cadastrar veículo:', error);
        alert('Erro ao conectar com o servidor');
    }
});

// Funções auxiliares
function formatarData(data) {
    return new Date(data + 'T00:00:00').toLocaleDateString('pt-BR');
}

function formatarStatus(status) {
    const statusMap = {
        'agendada': 'Agendada',
        'em_andamento': 'Em Andamento',
        'concluida': 'Concluída',
        'cancelada': 'Cancelada'
    };
    return statusMap[status] || status;
}

// Funções de ação (placeholder - implementar conforme necessário)
function editarViagem(id) {
    alert('Função de editar viagem será implementada');
}

function excluirViagem(id) {
    if (confirm('Tem certeza que deseja excluir esta viagem?')) {
        // Implementar exclusão
        alert('Função de excluir viagem será implementada');
    }
}

function editarVeiculo(id) {
    alert('Função de editar veículo será implementada');
}

function excluirVeiculo(id) {
    if (confirm('Tem certeza que deseja excluir este veículo?')) {
        // Implementar exclusão
        alert('Função de excluir veículo será implementada');
    }
}

// Logout simplificado
function logout() {
    if (confirm('Tem certeza que deseja sair?')) {
        window.location.href = 'index.html';
    }
}

// Fechar modal ao clicar fora
window.onclick = function(event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}
