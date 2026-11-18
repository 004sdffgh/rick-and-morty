const URL_API = "https://rickandmortyapi.com/api/character/";

const mensaje = document.getElementById("mensaje");
const contenedor = document.getElementById("resultados");
const inputBusqueda = document.getElementById("busqueda");
const selectEstado = document.getElementById("estado");
const btnBuscar = document.getElementById("btnBuscar");
const paginacion = document.getElementById("paginacion");
const btnAnterior = document.getElementById("btnAnterior");
const btnSiguiente = document.getElementById("btnSiguiente");
const infoPagina = document.getElementById("infoPagina");

let paginaActual = 1;
let totalPaginas = 1;

const traducirEstado = { Alive: "Vivo", Dead: "Muerto", unknown: "Desconocido" };

async function cargarPersonajes() {
  mensaje.className = "";
  mensaje.textContent = "Cargando personajes...";
  contenedor.innerHTML = "";
  paginacion.style.display = "none";

  const nombre = encodeURIComponent(inputBusqueda.value.trim());
  const url = URL_API + "?page=" + paginaActual + "&name=" + nombre + "&status=" + selectEstado.value;

  try {
    const respuesta = await fetch(url);

    if (respuesta.status === 404) {
      mensaje.textContent = "No se encontraron personajes con esa búsqueda.";
      return;
    }
    if (!respuesta.ok) {
      throw new Error("Error " + respuesta.status);
    }

    const datos = await respuesta.json();
    totalPaginas = datos.info.pages;
    mostrarPersonajes(datos.results, datos.info.count);
  } catch (error) {
    mensaje.className = "error";
    mensaje.textContent = "No se pudo cargar la información (" + error.message + "). Revisa tu internet e intenta de nuevo.";
  }
}

function mostrarPersonajes(personajes, total) {
  mensaje.textContent = total + " personajes encontrados";

  personajes.forEach(p => {
    const tarjeta = document.createElement("div");
    tarjeta.className = "tarjeta";

    const imagen = document.createElement("img");
    imagen.src = p.image;
    imagen.alt = "Foto de " + p.name;

    const nombre = document.createElement("h3");
    nombre.textContent = p.name;

    const estado = document.createElement("p");
    estado.textContent = "Estado: " + (traducirEstado[p.status] || p.status);

    const especie = document.createElement("p");
    especie.textContent = "Especie: " + p.species;

    tarjeta.append(imagen, nombre, estado, especie);
    contenedor.appendChild(tarjeta);
  });

  infoPagina.textContent = "Página " + paginaActual + " de " + totalPaginas;
  btnAnterior.disabled = paginaActual === 1;
  btnSiguiente.disabled = paginaActual === totalPaginas;
  paginacion.style.display = "block";
}

btnBuscar.addEventListener("click", () => { paginaActual = 1; cargarPersonajes(); });
inputBusqueda.addEventListener("keydown", e => { if (e.key === "Enter") { paginaActual = 1; cargarPersonajes(); } });
selectEstado.addEventListener("change", () => { paginaActual = 1; cargarPersonajes(); });
btnAnterior.addEventListener("click", () => { paginaActual--; cargarPersonajes(); });
btnSiguiente.addEventListener("click", () => { paginaActual++; cargarPersonajes(); });

cargarPersonajes();
