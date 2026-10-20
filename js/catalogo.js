(function () {
  "use strict";

  window.ElTintero = window.ElTintero || {};

  const TEXTO_CATALOGO_VACIO = "No hay libros registrados.";

  function crearParrafo(texto) {
    const parrafo = document.createElement("p");
    parrafo.textContent = texto;
    return parrafo;
  }

  function crearTarjetaLibro(libro) {
    const tarjeta = document.createElement("article");
    tarjeta.className = "card libro-tarjeta";
    tarjeta.dataset.libroId = String(libro.id);

    const titulo = document.createElement("h3");
    titulo.textContent = libro.titulo;
    tarjeta.appendChild(titulo);

    tarjeta.appendChild(crearParrafo("ISBN: " + libro.isbn));

    const editorial = ElTintero.consultas.buscarEditorialPorId(libro.editorialId);
    tarjeta.appendChild(crearParrafo(
      "Editorial: " + (editorial ? editorial.nombre : "Editorial no disponible")
    ));

    const genero = libro.generoId === null || libro.generoId === undefined
      ? undefined
      : ElTintero.consultas.buscarGeneroPorId(libro.generoId);
    tarjeta.appendChild(crearParrafo(
      "Género: " + (genero ? genero.nombre : "Sin clasificar")
    ));

    const autoresIds = Array.isArray(libro.autoresIds) ? libro.autoresIds : [];
    const autores = ElTintero.consultas.buscarAutoresPorIds(autoresIds);
    const autoresResueltosIds = new Set(autores.map(function (autor) {
      return autor.id;
    }));

    if (autoresIds.length === 0) {
      console.error("Catálogo: el libro " + libro.id + " no tiene autores.");
    } else {
      autoresIds.forEach(function (autorId) {
        if (!autoresResueltosIds.has(autorId)) {
          console.error("Catálogo: el libro " + libro.id + " referencia un autor inexistente (" + autorId + ").");
        }
      });
    }

    tarjeta.appendChild(crearParrafo("Autores:"));

    const listaAutores = document.createElement("ul");
    autores.forEach(function (autor) {
      const item = document.createElement("li");
      item.textContent = autor.nombre;
      listaAutores.appendChild(item);
    });
    tarjeta.appendChild(listaAutores);

    tarjeta.appendChild(crearParrafo(
      "Precio: " + ElTintero.consultas.formatearPrecio(libro.precio)
    ));

    return tarjeta;
  }

  function ocultarMensajes() {
    document.getElementById("catalogo-vacio").hidden = true;
    document.getElementById("catalogo-sin-resultados").hidden = true;
  }

  function mostrarCatalogoVacio() {
    const mensajeVacio = document.getElementById("catalogo-vacio");
    mensajeVacio.textContent = TEXTO_CATALOGO_VACIO;
    mensajeVacio.hidden = false;
    document.getElementById("catalogo-sin-resultados").hidden = true;
  }

  function mostrarSinResultados(termino) {
    const mensajeSinResultados = document.getElementById("catalogo-sin-resultados");
    mensajeSinResultados.textContent = "No se encontraron libros para «" + termino + "».";
    mensajeSinResultados.hidden = false;
    document.getElementById("catalogo-vacio").hidden = true;
  }

  function renderizarCatalogo(libros) {
    const lista = document.getElementById("catalogo-lista");

    while (lista.firstChild) {
      lista.removeChild(lista.firstChild);
    }

    libros.forEach(function (libro) {
      lista.appendChild(crearTarjetaLibro(libro));
    });

    ocultarMensajes();

    if (ElTintero.datos.libros.length === 0) {
      mostrarCatalogoVacio();
    }
  }

  function filtrarLibrosPorTitulo(libros, termino) {
    const terminoNormalizado = termino.trim().toLowerCase();

    if (terminoNormalizado === "") {
      return libros.slice();
    }

    return libros.filter(function (libro) {
      return libro.titulo.toLowerCase().includes(terminoNormalizado);
    });
  }

  function iniciarCatalogo() {
    const formulario = document.getElementById("catalogo-buscador");
    const campoBusqueda = document.getElementById("catalogo-titulo");

    renderizarCatalogo(ElTintero.datos.libros);

    formulario.addEventListener("submit", function (evento) {
      evento.preventDefault();

      const termino = campoBusqueda.value;
      const filtrados = filtrarLibrosPorTitulo(ElTintero.datos.libros, termino);

      renderizarCatalogo(filtrados);

      if (ElTintero.datos.libros.length === 0) {
        return;
      }

      if (filtrados.length === 0) {
        mostrarSinResultados(termino.trim());
      }
    });

    formulario.addEventListener("reset", function () {
      renderizarCatalogo(ElTintero.datos.libros);
    });
  }

  ElTintero.catalogo = {
    filtrarLibrosPorTitulo: filtrarLibrosPorTitulo,
    renderizarCatalogo: renderizarCatalogo,
    iniciarCatalogo: iniciarCatalogo
  };

  iniciarCatalogo();
}());
