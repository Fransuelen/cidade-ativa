

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

// Ícone de cada tipo de problema
let icones = {
  1: "💧",
  2: "⚠️",
  3: "🚧",
  4: "🚰"
};

// Classe da pílula colorida de acordo com a situação
function classeSituacao(situacao) {
  if (situacao == "Em andamento") return "situacao-andamento";
  if (situacao == "Resolvida") return "situacao-resolvida";
  return "situacao-aberta";
}

// Mostra as 3 ocorrências mais novas na página inicial
function mostrarRecentes() {
  let recentes = document.getElementById("recentes");
  recentes.innerHTML = "";

  for (let i = ocorrencias.length - 1; i >= 0 && i >= ocorrencias.length - 3; i--) {
    let o = ocorrencias[i];
    let li = document.createElement("li");

    li.innerHTML =
      "<span class='icone'>" + icones[o.tipo_id] + "</span>" +
      "<div class='info'><strong>" + tipos[o.tipo_id] + "</strong><span>" + o.bairro + "</span></div>" +
      "<div class='lado'><span class='situacao " + classeSituacao(o.situacao) + "'>" + o.situacao + "</span>" +
      "<span class='data'>" + o.criada_em + "</span></div>";

    recentes.appendChild(li);
  }

  if (ocorrencias.length == 0) {
    recentes.innerHTML = "<li>Nenhuma ocorrência registrada ainda.</li>";
  }
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
  mostrarRecentes();

  formulario.reset();
  alert("Ocorrência salva! Veja na página Ocorrências.");
}

// Começa aqui
carregar();

// Página inicial: tem o formulário e o resumo
if (formulario != null) {
  formulario.addEventListener("submit", enviar);
  atualizarResumo();
  mostrarRecentes();
}

// Página de ocorrências: tem a lista e o filtro
if (lista != null) {
  selectFiltro.addEventListener("change", mostrar);
  mostrar();
}
