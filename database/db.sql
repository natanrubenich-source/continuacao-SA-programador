CREATE DATABASE gestao_frota_senai;

\c gestao_frota_senai;

-- Tabela de usuários (funcionários do SENAI)
CREATE TABLE usuarios (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  senha VARCHAR(255) NOT NULL,
  setor VARCHAR(100),
  telefone VARCHAR(20),
  data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de veículos da frota
CREATE TABLE veiculos (
  id SERIAL PRIMARY KEY,
  modelo VARCHAR(100) NOT NULL,
  marca VARCHAR(50) NOT NULL,
  placa VARCHAR(10) NOT NULL UNIQUE,
  ano INT,
  capacidade INT NOT NULL,
  tipo VARCHAR(50), -- carro, van, ônibus, etc.
  disponivel BOOLEAN DEFAULT TRUE,
  observacoes TEXT
);

-- Tabela de viagens
CREATE TABLE viagens (
  id SERIAL PRIMARY KEY,
  destino VARCHAR(200) NOT NULL,
  data_viagem DATE NOT NULL,
  hora_saida TIME NOT NULL,
  hora_retorno TIME,
  motorista_id INT REFERENCES usuarios(id),
  veiculo_id INT REFERENCES veiculos(id),
  vagas_disponiveis INT NOT NULL,
  observacoes TEXT,
  status VARCHAR(20) DEFAULT 'agendada', -- agendada, em_andamento, concluida, cancelada
  data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de participantes das viagens
CREATE TABLE viagem_participantes (
  id SERIAL PRIMARY KEY,
  viagem_id INT REFERENCES viagens(id) ON DELETE CASCADE,
  usuario_id INT REFERENCES usuarios(id),
  data_inscricao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(viagem_id, usuario_id)
);

-- Tabela de unidades do SENAI-SC
CREATE TABLE unidades (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(200) NOT NULL,
  endereco TEXT NOT NULL,
  cidade VARCHAR(100) NOT NULL,
  estado VARCHAR(2) DEFAULT 'SC',
  ativo BOOLEAN DEFAULT TRUE,
  data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inserir unidades do SENAI-SC
INSERT INTO unidades (nome, endereco, cidade) VALUES 
('SENAI Florianópolis', 'Rodovia SC 401, 3730, Bairro Saco Grande', 'Florianópolis'),
('Instituto SENAI de Inovação em Sistemas Embarcados', 'Rua Luiz Boiteux Piazza, Canasvieiras', 'Florianópolis'),
('SENAI São José', 'Rua dos Eletros, 424, Bairro Kobrasol', 'São José'),
('SENAI/SC - SÃO JOSÉ - EXTENSÃO BIGUAÇU', 'Rua Patrício Antônio Teixeira n.º 317, Rio Caveiras', 'Biguaçu'),
('SENAI/SC - PALHOÇA', 'Rua Juacir dos Passos n.º 18, Jardim Eldorado', 'Palhoça'),
('SENAI/SC - EXTENSÃO GAROPABA', 'Rua Professor Antônio José Botelho n.º 43, Centro', 'Garopaba');

-- Inserir alguns dados de exemplo (senhas simples para fins didáticos)
INSERT INTO usuarios (nome, email, senha, setor, telefone) VALUES 
('Admin Sistema', 'admin@senai.sc', '123456', 'TI', '(48) 99999-9999'),
('João Silva', 'joao.silva@senai.sc', '123456', 'Administração', '(48) 98765-4321'),
('Maria Santos', 'maria.santos@senai.sc', '123456', 'Educação', '(48) 91234-5678'),
('Pedro Costa', 'pedro.costa@senai.sc', '123456', 'Manutenção', '(48) 95555-1234');

INSERT INTO veiculos (modelo, marca, placa, ano, capacidade, tipo, observacoes) VALUES 
('Corolla', 'Toyota', 'ABC-1234', 2020, 5, 'Carro', 'Veículo para viagens administrativas'),
('Sprinter', 'Mercedes', 'DEF-5678', 2019, 15, 'Van', 'Transporte de grupos de estudantes'),
('Ônibus Escolar', 'Volkswagen', 'GHI-9012', 2018, 40, 'Ônibus', 'Transporte para eventos e visitas técnicas'),
('Hilux', 'Toyota', 'JKL-3456', 2021, 5, 'Caminhonete', 'Transporte de equipamentos'),
('Civic', 'Honda', 'MNO-7890', 2019, 5, 'Carro', 'Veículo para deslocamentos rápidos'),
('Master', 'Renault', 'PQR-2468', 2020, 16, 'Van', 'Transporte de grupos médios');

-- Inserir algumas viagens de exemplo
INSERT INTO viagens (destino, data_viagem, hora_saida, hora_retorno, motorista_id, veiculo_id, vagas_disponiveis, observacoes, status) VALUES 
('SENAI São José', CURRENT_DATE + INTERVAL '1 day', '08:00', '17:00', 2, 1, 4, 'Reunião administrativa', 'agendada'),
('Instituto SENAI de Inovação', CURRENT_DATE + INTERVAL '2 days', '09:00', '16:00', 3, 2, 12, 'Visita técnica com alunos', 'agendada'),
('SENAI Palhoça', CURRENT_DATE + INTERVAL '3 days', '07:30', '18:00', 4, 3, 35, 'Evento de integração', 'agendada'),
('SENAI Biguaçu', CURRENT_DATE + INTERVAL '1 week', '08:30', '17:30', 2, 4, 4, 'Entrega de equipamentos', 'agendada');

-- Inserir alguns participantes nas viagens
INSERT INTO viagem_participantes (viagem_id, usuario_id) VALUES 
(1, 1), (1, 3),
(2, 2), (2, 4),
(3, 1), (3, 2), (3, 3);