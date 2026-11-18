// Mapa (mesmo visual do projeto ReportAgua: Leaflet + OpenStreetMap)

// Centro de Matão - SP
let CENTRO_MATAO = [-21.6033, -48.3658];

// Limite para o mapa não sair muito de Matão
let LIMITES_MATAO = [[-21.75, -48.55], [-21.48, -48.22]];

// Posição aproximada dos bairros de Matão
let bairros = {
  "centro": [-21.60333, -48.36583],
  "jardim buscardi": [-21.60863, -48.35696],
  "jardim do bosque": [-21.59617, -48.3507],
  "parque das laranjeiras": [-21.60037, -48.40029],
  "nova matão": [-21.61241, -48.36197],
  "vila santa cruz": [-21.60328, -48.35956],
  "jardim popular": [-21.59191, -48.34563],
  "cidade jardim": [-21.60568, -48.39747],
  "jardim alvorada": [-21.58922, -48.36728],
  "iv centenário": [-21.60521, -48.35422],
  "jardim santa rosa": [-21.59969, -48.38641],
  "jardim brasil": [-21.58474, -48.37738],
  "jardim paraíso": [-21.6295, -48.3395]
};

// Desenho de dentro do pino, um para cada tipo
let desenhos = {
  1: '<path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/>',
  2: '<circle cx="12" cy="12" r="9"/><path d="m5.5 5.5 13 13"/>',
  3: '<path d="M2 7c.6.5 1.2 1 2.5 1C7 8 7 6 9.5 6c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 17c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/>',
  4: '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>'
};

let FORMATO_PINO = "M20 44.5C20 44.5 5.2 28.2 5.2 17.2C5.2 9 11.8 2.6 20 2.6C28.2 2.6 34.8 9 34.8 17.2C34.8 28.2 20 44.5 20 44.5Z";

// Cria o ícone do pino
function iconePino(tipoId) {
  let svg =
    '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="48" viewBox="0 0 40 48" class="pino-svg" aria-hidden="true">' +
    '<path d="' + FORMATO_PINO + '" fill="#0c4a6e"/>' +
    '<circle cx="20" cy="17.1" r="7.15" fill="#ffffff"/>' +
    '<g transform="translate(13.15 10.25) scale(0.57)" fill="none" stroke="#0c4a6e" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">' +
    desenhos[tipoId] +
    "</g></svg>";

  return L.divIcon({
    className: "pino-icone",
    html: svg,
    iconSize: [40, 48],
    iconAnchor: [20, 44],
    tooltipAnchor: [0, -36]
  });
}

// Onde a ocorrência fica no mapa (pelo bairro)
function posicaoDa(o) {
  let base = bairros[o.bairro.trim().toLowerCase()] || CENTRO_MATAO;

  // pequeno deslocamento pelo id, para pinos do mesmo bairro não ficarem um em cima do outro
  let desvio = ((o.id * 37) % 11 - 5) * 0.0006;
  return [base[0] + desvio, base[1] - desvio];
}

// Cria o mapa
let mapa = L.map("mapa", {
  center: CENTRO_MATAO,
  zoom: 13,
  minZoom: 12,
  maxZoom: 18,
  maxBounds: LIMITES_MATAO,
  maxBoundsViscosity: 0.85,
  zoomControl: false,
  attributionControl: false
});

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(mapa);

L.control.attribution({ position: "bottomleft", prefix: false }).addTo(mapa);
L.control.zoom({ position: "topright", zoomInTitle: "Aproximar", zoomOutTitle: "Afastar" }).addTo(mapa);

// Pinos que estão no mapa agora
let pinos = L.layerGroup().addTo(mapa);

// Coloca um pino para cada ocorrência (respeitando o filtro)
function desenharPinos() {
  pinos.clearLayers();

  for (let i = 0; i < ocorrencias.length; i++) {
    let o = ocorrencias[i];

    if (selectFiltro.value != "" && o.tipo_id != selectFiltro.value) {
      continue;
    }

    L.marker(posicaoDa(o), {
      icon: iconePino(o.tipo_id),
      title: tipos[o.tipo_id] + " em " + o.bairro,
      alt: tipos[o.tipo_id] + " em " + o.bairro + ". " + o.apoios + " apoios."
    })
      .bindTooltip(tipos[o.tipo_id], { direction: "top", opacity: 1, className: "dica-mapa" })
      .addTo(pinos);
  }
}

desenharPinos();
