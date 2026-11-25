// Mapa das ocorrências (Leaflet + OpenStreetMap)

// Posição aproximada de cada bairro de Matão - SP
let bairros = {
  "centro": [-21.6033, -48.3658],
  "jardim buscardi": [-21.6086, -48.3570],
  "jardim do bosque": [-21.5962, -48.3507],
  "parque das laranjeiras": [-21.6004, -48.4003],
  "nova matão": [-21.6124, -48.3620],
  "vila santa cruz": [-21.6033, -48.3596],
  "jardim popular": [-21.5919, -48.3456],
  "cidade jardim": [-21.6057, -48.3975],
  "jardim alvorada": [-21.5892, -48.3673],
  "iv centenário": [-21.6052, -48.3542],
  "jardim santa rosa": [-21.5997, -48.3864],
  "jardim brasil": [-21.5847, -48.3774],
  "jardim paraíso": [-21.6295, -48.3395]
};

// Cria o mapa centralizado em Matão
let mapa = L.map("mapa").setView(bairros["centro"], 13);

// Imagens do mapa (OpenStreetMap)
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "&copy; OpenStreetMap"
}).addTo(mapa);

// Grupo onde ficam os pinos
let pinos = L.layerGroup().addTo(mapa);

// Coloca um pino para cada ocorrência (respeitando o filtro)
function desenharPinos() {
  pinos.clearLayers();

  for (let i = 0; i < ocorrencias.length; i++) {
    let o = ocorrencias[i];

    if (selectFiltro.value != "" && o.tipo_id != selectFiltro.value) {
      continue;
    }

    // acha o bairro; se não achar, usa o centro
    let posicao = bairros[o.bairro.trim().toLowerCase()] || bairros["centro"];

    // afasta um pouquinho para pinos do mesmo bairro não ficarem um em cima do outro
    let lat = posicao[0] + (o.id % 5) * 0.0008;
    let lng = posicao[1] + (o.id % 3) * 0.0008;

    // o pino é o emoji do tipo (lista "icones" do script.js)
    let icone = L.divIcon({ html: icones[o.tipo_id], className: "pino", iconSize: [30, 30] });

    L.marker([lat, lng], { icon: icone })
      .bindPopup("<strong>" + tipos[o.tipo_id] + "</strong><br>" + o.rua + ", " + o.bairro + "<br>" + o.apoios + " apoios")
      .addTo(pinos);
  }
}

desenharPinos();
