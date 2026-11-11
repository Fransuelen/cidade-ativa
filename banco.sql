
CREATE TABLE tipos (
  id   INTEGER PRIMARY KEY,
  nome VARCHAR(50) NOT NULL
);

-- Tabela das ocorrências registradas pelos moradores
CREATE TABLE ocorrencias (
  id        INTEGER PRIMARY KEY,
  tipo_id   INTEGER NOT NULL,
  bairro    VARCHAR(100) NOT NULL,
  rua       VARCHAR(100) NOT NULL,
  descricao TEXT NOT NULL,
  situacao  VARCHAR(20) NOT NULL DEFAULT 'Aberta',
  apoios    INTEGER NOT NULL DEFAULT 0,
  criada_em DATE NOT NULL,
  FOREIGN KEY (tipo_id) REFERENCES tipos(id)
);

-- Tipos cadastrados
INSERT INTO tipos (id, nome) VALUES (1, 'Falta de água');
INSERT INTO tipos (id, nome) VALUES (2, 'Falta de saneamento');
INSERT INTO tipos (id, nome) VALUES (3, 'Esgoto exposto');
INSERT INTO tipos (id, nome) VALUES (4, 'Saneamento básico');

-- Ocorrências de exemplo
INSERT INTO ocorrencias (id, tipo_id, bairro, rua, descricao, situacao, apoios, criada_em)
VALUES (1, 1, 'Nova Matão', 'Quadra central', 'Sem abastecimento desde a madrugada.', 'Aberta', 33, '2026-11-10');

INSERT INTO ocorrencias (id, tipo_id, bairro, rua, descricao, situacao, apoios, criada_em)
VALUES (2, 1, 'Centro', 'Rua Rui Barbosa', 'Desde ontem à noite a rua está sem água.', 'Aberta', 28, '2026-11-10');

INSERT INTO ocorrencias (id, tipo_id, bairro, rua, descricao, situacao, apoios, criada_em)
VALUES (3, 3, 'Jardim Paraíso', 'Rua das Flores', 'Esgoto a céu aberto perto da calçada.', 'Em andamento', 15, '2026-11-09');


-- ===== Consultas de exemplo =====

-- Listar todas as ocorrências com o nome do tipo
SELECT ocorrencias.id, tipos.nome AS tipo, ocorrencias.bairro, ocorrencias.rua, ocorrencias.situacao, ocorrencias.apoios
FROM ocorrencias
JOIN tipos ON tipos.id = ocorrencias.tipo_id
ORDER BY ocorrencias.id DESC;

-- Listar só as ocorrências de falta de água
SELECT * FROM ocorrencias WHERE tipo_id = 1;

-- Quantas ocorrências tem de cada tipo
SELECT tipos.nome, COUNT(ocorrencias.id) AS quantidade
FROM tipos
LEFT JOIN ocorrencias ON ocorrencias.tipo_id = tipos.id
GROUP BY tipos.nome;

-- Apoiar uma ocorrência
UPDATE ocorrencias SET apoios = apoios + 1 WHERE id = 1;

-- Mudar a situação de uma ocorrência
UPDATE ocorrencias SET situacao = 'Resolvida' WHERE id = 3;

-- Apagar uma ocorrência
DELETE FROM ocorrencias WHERE id = 2;
