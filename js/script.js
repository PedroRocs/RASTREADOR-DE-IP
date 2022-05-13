const ipBody = document.querySelector("#ip span");
const apiKey = "at_SM7nf8Ww601CicFfwIsuIwIqzobxE";
const submit = document.querySelector("#search button");
const input = document.querySelector("#search input");
const localizacao = document.querySelector("#location span");
const timeZone = document.querySelector("#timezone span");
const empresa = document.querySelector("#empresa span");
const btnIp = document.querySelector(".scroll#ip");
let map = "";
let mark = "";

// EVENTO PARA PEGAR VALOR DO INPUT
submit.addEventListener("click", () => {
  geoIP(input.value);
});

// EVENTO PARA APARECER DIV INFO-IP NA LARGURA ABAIXO DE 600PX
btnIp.addEventListener("click", () => {
  let infoIp = document.querySelector("#info-ip")
  if ( infoIp.style.zIndex == "-1") {
    infoIp.style.zIndex = "9999";
    infoIp.style.opacity = "100%";
  } else {
    infoIp.style.zIndex = "-1";
    infoIp.style.opacity = "0";

  }
})


// EVENTO PARA BOTÃO DE VOLTAR PARA O TOPO DA TELA
window.addEventListener("scroll", () => {
  let button = document.createElement("button");
  button.classList.add("scroll")
  button.innerHTML = `<a href="#cabecalho" onclick="click(${button})"><svg xmlns="http://www.w3.org/2000/svg"><path fill="none" stroke="#FFF" stroke-width="3" d="M2 1l6 6-6 6"/></svg></a>`;

  if (scrollY > 300 && document.querySelector(".scroll") == null) {
    document.querySelector("body").appendChild(button);
  } else if (scrollY < 300 && document.querySelector(".scroll") != null) {
    document.querySelector(".scroll").remove();
  }
});


window.addEventListener("resize", () => {
  document.querySelector("#info-ip").style.zIndex = "-1";
});


// FUNCTION QUE DETECTA IP LOCAL
function getIP(json) {
  geoIP(json.ip);
}

// FUNCTION QUE PEGA OS DADOS DA API E RENDERIZA NA TELA
function geoIP(valor) {

  let url = `https://geo.ipify.org/api/v2/country,city?apiKey=${apiKey}&ipAddress=${valor}`;
  fetch(url)
    .then((resp) => resp.json())
    .then(function (data) {
      mapa(data.location.lat, data.location.lng);
      let cidade = data.location.region.split("");
      let sigla = "";
      for (const i in cidade) {
        if (cidade[i - 1] === " " || i == 0) {
          sigla += cidade[i];
        }
      }
      localizacao.textContent =
        data.location.city + "," + sigla + "," + data.location.country;
      timeZone.textContent = data.location.timezone;
      empresa.textContent = data.isp;
      ipBody.innerHTML = data.ip;
      document.querySelector("#search input").placeholder =
        "INSIRA O IP DO DOMINIO";
    })
    .catch(function (error) {
      document.querySelector("#search input").placeholder = "IP NÃO ENCONTRADO";

      document.querySelector("#search input").value = "";
    });
}

// FUNCTION QUE RENDERIZA MAPA COM AS COORDENADAS
function mapa(lat, lng) {

  if (map == "") {
    map = L.map("map").setView([lat, lng], 10);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {}).addTo(map);
  } else {
    map.removeLayer(mark);
    map.setView([lat, lng], 10);
  }

  mark = L.marker([lat, lng]);
  map.scrollWheelZoom.disable();
  mark.addTo(map).bindPopup("Esse IP esta localizado aqui").openPopup();

}