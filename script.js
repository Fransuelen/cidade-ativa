// JavaScript do projeto Cidade Ativa
// Esse arquivo é usado nas duas páginas (index.html e ocorrencias.html).
// Os dados ficam salvos no localStorage do navegador.
// As tabelas do banco estão modeladas no arquivo banco.sql

// Tabela "tipos"
let tipos = {
  1: "Falta de água",
  2: "Falta de saneamento",
  3: "Esgoto exposto",
  4: "Saneamento básico"
};

// Tabela "ocorrencias"
let ocorrencias = [];

// Pegando os elementos do HTML
// (se o elemento não existir na página, fica null)
let formulario = document.getElementById("formulario");
let selectFiltro = document.getElementById("filtro");
let lista = document.getElementById("lista");

// Carrega as ocorrências salvas
function carregar() {
  let salvas = localStorage.getItem("ocorrencias");

  if (salvas) {
    ocorrencias = JSON.parse(salvas);
  } else {
    // Se não tiver nada salvo, coloca os exemplos
    ocorrencias = [
      { id: 1, tipo_id: 1, bairro: "Nova Matão", rua: "Quadra central", descricao: "Sem abastecimento desde a madrugada.", situacao: "Aberta", apoios: 33, criada_em: "10/11/2026" },
      { id: 2, tipo_id: 1, bairro: "Centro", rua: "Rua Rui Barbosa", descricao: "Desde ontem à noite a rua está sem água.", situacao: "Aberta", apoios: 28, criada_em: "10/11/2026" },
      { id: 3, tipo_id: 3, bairro: "Jardim Paraíso", rua: "Rua das Flores", descricao: "Esgoto a céu aberto perto da calçada.", situacao: "Em andamento", apoios: 15, criada_em: "09/11/2026" }
    ];
    salvar();
  }
}

// Salva as ocorrências no navegador
function salvar() {
  localStorage.setItem("ocorrencias", JSON.stringify(ocorrencias));
}

// Mostra as ocorrências na tela
function mostrar() {
  lista.innerHTML = "";
  let quantidade = 0;

  // de trás pra frente para mostrar as mais novas primeiro
  for (let i = ocorrencias.length - 1; i >= 0; i--) {
    let o = ocorrencias[i];

    // filtro por tipo
    if (selectFiltro.value != "" && o.tipo_id != selectFiltro.value) {
      continue;
    }

    let div = document.createElement("div");
    div.className = "caixa ocorrencia tipo-" + o.tipo_id;

    div.innerHTML =
      "<span class='etiqueta'>" + tipos[o.tipo_id] + "</span> " +
      "<span class='etiqueta'>" + o.situacao + "</span>" +
      "<p class='local'>" + o.rua + ", " + o.bairro + " - " + o.criada_em + "</p>" +
      "<p>" + o.descricao + "</p>" +
      "<button class='botao-apoiar' onclick='apoiar(" + o.id + ")'>Apoiar (" + o.apoios + ")</button> " +
      "<button class='botao-apagar' onclick='apagar(" + o.id + ")'>Apagar</button>";

    lista.appendChild(div);
    quantidade++;
  }

  if (quantidade == 0) {
    lista.innerHTML = "<p>Nenhuma ocorrência encontrada.</p>";
  }
}

// Calcula os números do resumo
function atualizarResumo() {
  let abertas = 0;
  let apoios = 0;

  for (let i = 0; i < ocorrencias.length; i++) {
    if (ocorrencias[i].situacao == "Aberta") {
      abertas++;
    }
    apoios = apoios + ocorrencias[i].apoios;
  }

  document.getElementById("total").textContent = ocorrencias.length;
  document.getElementById("abertas").textContent = abertas;
  document.getElementById("apoios").textContent = apoios;
}

// Botão de apoiar
function apoiar(id) {
  for (let i = 0; i < ocorrencias.length; i++) {
    if (ocorrencias[i].id == id) {
      ocorrencias[i].apoios++;
    }
  }
  salvar();
  mostrar();
}

// Botão de apagar
function apagar(id) {
  if (confirm("Tem certeza que quer apagar essa ocorrência?")) {
    let novaLista = [];
    for (let i = 0; i < ocorrencias.length; i++) {
      if (ocorrencias[i].id != id) {
        novaLista.push(ocorrencias[i]);
      }
    }
    ocorrencias = novaLista;
    salvar();
    mostrar();
  }
}

// Envia o formulário (só na página inicial)
function enviar(evento) {
  evento.preventDefault(); // não deixa a página recarregar

  let tipo = document.getElementById("tipo").value;
  let bairro = document.getElementById("bairro").value;
  let rua = document.getElementById("rua").value;
  let descricao = document.getElementById("descricao").value;

  if (bairro == "" || rua == "" || descricao == "") {
    alert("Preencha todos os campos!");
    return;
  }

  // novo id = maior id + 1
  let novoId = 1;
  for (let i = 0; i < ocorrencias.length; i++) {
    if (ocorrencias[i].id >= novoId) {
      novoId = ocorrencias[i].id + 1;
    }
  }

  let nova = {
    id: novoId,
    tipo_id: Number(tipo),
    bairro: bairro,
    rua: rua,
    descricao: descricao,
    situacao: "Aberta",
    apoios: 0,
    criada_em: new Date().toLocaleDateString("pt-BR")
  };

  ocorrencias.push(nova);
  salvar();
  atualizarResumo();

  formulario.reset();
  alert("Ocorrência salva! Veja na página Ocorrências.");
}

// Começa aqui
carregar();

// Página inicial: tem o formulário e o resumo
if (formulario != null) {
  formulario.addEventListener("submit", enviar);
  atualizarResumo();
}

// Página de ocorrências: tem a lista e o filtro
if (lista != null) {
  selectFiltro.addEventListener("change", mostrar);
  mostrar();
}
