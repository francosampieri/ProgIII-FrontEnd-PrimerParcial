(function () {
  "use strict";

  window.ElTintero = window.ElTintero || {};

  /*
   * Modelo de datos de ejemplo, en memoria y sin persistencia.
   * Los ISBN de los libros 4-6 son placeholders no verificados
   * (bloque 978-84-0000-...) y los precios son valores de ejemplo.
   */
  ElTintero.datos = {
    editoriales: [
      { id: 1, nombre: "Sudamericana" },
      { id: 2, nombre: "Losada" },
      { id: 3, nombre: "Emecé" }
    ],
    generos: [
      { id: 1, nombre: "Novela" },
      { id: 2, nombre: "Antología" },
      { id: 3, nombre: "Cuento" }
    ],
    autores: [
      { id: 1, nombre: "Gabriel García Márquez" },
      { id: 2, nombre: "Jorge Luis Borges" },
      { id: 3, nombre: "Adolfo Bioy Casares" },
      { id: 4, nombre: "Silvina Ocampo" },
      { id: 5, nombre: "Julio Cortázar" }
    ],
    libros: [
      {
        id: 1,
        titulo: "Cien años de soledad",
        isbn: "978-84-376-0494-7",
        precio: 18500,
        editorialId: 1,
        generoId: 1,
        autoresIds: [1]
      },
      {
        id: 2,
        titulo: "Antología de la literatura fantástica",
        isbn: "978-84-206-3313-2",
        precio: 21400,
        editorialId: 2,
        generoId: 2,
        autoresIds: [2, 3, 4]
      },
      {
        id: 3,
        titulo: "El Aleph",
        isbn: "978-84-206-3314-9",
        precio: 15900,
        editorialId: 3,
        generoId: null,
        autoresIds: [2]
      },
      {
        id: 4,
        titulo: "Rayuela",
        isbn: "978-84-0000-0007-3",
        precio: 24500,
        editorialId: 1,
        generoId: 1,
        autoresIds: [5]
      },
      {
        id: 5,
        titulo: "La invención de Morel",
        isbn: "978-84-0000-0008-0",
        precio: 14300,
        editorialId: 2,
        generoId: 1,
        autoresIds: [3]
      },
      {
        id: 6,
        titulo: "El informe de Brodie",
        isbn: "978-84-0000-0009-7",
        precio: 19900,
        editorialId: 3,
        generoId: 3,
        autoresIds: [2]
      }
    ],
    clientes: [
      { id: 1, nombre: "Ana Pérez", email: "ana.perez@example.com" },
      { id: 2, nombre: "Bruno Díaz", email: "bruno.diaz@example.com" },
      { id: 3, nombre: "Carla Gómez", email: "carla.gomez@example.com" }
    ]
  };

  function obtenerLibros() {
    return ElTintero.datos.libros;
  }

  function obtenerClientes() {
    return ElTintero.datos.clientes;
  }

  function buscarEditorialPorId(id) {
    return ElTintero.datos.editoriales.find(function (editorial) {
      return editorial.id === id;
    });
  }

  function buscarGeneroPorId(id) {
    return ElTintero.datos.generos.find(function (genero) {
      return genero.id === id;
    });
  }

  function buscarAutoresPorIds(ids) {
    return ids.map(function (id) {
      return ElTintero.datos.autores.find(function (autor) {
        return autor.id === id;
      });
    }).filter(function (autor) {
      return autor !== undefined;
    });
  }

  const formateadorPrecio = new Intl.NumberFormat("es-AR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });

  function formatearPrecio(precio) {
    return "$" + formateadorPrecio.format(precio);
  }

  function tieneIdsDuplicados(coleccion) {
    const ids = new Set();
    return coleccion.some(function (registro) {
      if (ids.has(registro.id)) {
        return true;
      }
      ids.add(registro.id);
      return false;
    });
  }

  function verificarIntegridad() {
    const errores = [];

    function reportar(mensaje) {
      errores.push(mensaje);
      console.error(mensaje);
    }

    ["editoriales", "generos", "autores", "libros", "clientes"].forEach(function (nombreColeccion) {
      if (tieneIdsDuplicados(ElTintero.datos[nombreColeccion])) {
        reportar("Integridad: hay ids duplicados en " + nombreColeccion + ".");
      }
    });

    ElTintero.datos.libros.forEach(function (libro) {
      if (buscarEditorialPorId(libro.editorialId) === undefined) {
        reportar("Integridad: el libro " + libro.id + " referencia una editorial inexistente (" + libro.editorialId + ").");
      }

      if (libro.generoId !== null && buscarGeneroPorId(libro.generoId) === undefined) {
        reportar("Integridad: el libro " + libro.id + " referencia un género inexistente (" + libro.generoId + ").");
      }

      if (!Array.isArray(libro.autoresIds) || libro.autoresIds.length === 0) {
        reportar("Integridad: el libro " + libro.id + " no tiene autores.");
      } else {
        libro.autoresIds.forEach(function (autorId) {
          const autor = ElTintero.datos.autores.find(function (registro) {
            return registro.id === autorId;
          });
          if (autor === undefined) {
            reportar("Integridad: el libro " + libro.id + " referencia un autor inexistente (" + autorId + ").");
          }
        });
      }

      if (typeof libro.precio !== "number" || !Number.isFinite(libro.precio)) {
        reportar("Integridad: el libro " + libro.id + " tiene un precio no finito.");
      }
    });

    return errores;
  }

  ElTintero.consultas = {
    obtenerLibros: obtenerLibros,
    obtenerClientes: obtenerClientes,
    buscarEditorialPorId: buscarEditorialPorId,
    buscarGeneroPorId: buscarGeneroPorId,
    buscarAutoresPorIds: buscarAutoresPorIds,
    formatearPrecio: formatearPrecio,
    verificarIntegridad: verificarIntegridad
  };

  verificarIntegridad();
}());
