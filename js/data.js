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

  function buscarLibroPorId(id) {
    return ElTintero.datos.libros.find(function (libro) {
      return libro.id === id;
    });
  }

  function buscarClientePorId(id) {
    return ElTintero.datos.clientes.find(function (cliente) {
      return cliente.id === id;
    });
  }

  function buscarAutorPorId(id) {
    return ElTintero.datos.autores.find(function (autor) {
      return autor.id === id;
    });
  }

  const formateadorPrecio = new Intl.NumberFormat("es-AR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });

  function formatearPrecio(precio) {
    return "$" + formateadorPrecio.format(precio);
  }

  function recortarTexto(valor) {
    if (valor === undefined || valor === null) {
      return "";
    }
    return String(valor).trim();
  }

  function normalizarIsbn(isbn) {
    return recortarTexto(isbn).replace(/[\s-]/g, "");
  }

  function normalizarEmail(email) {
    return recortarTexto(email).toLowerCase();
  }

  const PATRON_EMAIL = /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/;

  function esEmailValido(email) {
    return PATRON_EMAIL.test(email);
  }

  function existeLibroConIsbn(isbn) {
    const normalizado = normalizarIsbn(isbn);
    return ElTintero.datos.libros.some(function (libro) {
      return normalizarIsbn(libro.isbn) === normalizado;
    });
  }

  function existeClienteConEmail(email) {
    const normalizado = normalizarEmail(email);
    return ElTintero.datos.clientes.some(function (cliente) {
      return normalizarEmail(cliente.email) === normalizado;
    });
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

  const MENSAJES_ALTA = {
    LN_01: "Ingresá el título del libro.",
    LN_02: "Ingresá el ISBN del libro.",
    LN_03: "El ISBN no puede contener solo espacios o guiones.",
    LN_04: "Ya existe un libro con ese ISBN.",
    LN_05: "Ingresá el precio del libro.",
    LN_06: "El precio debe ser un número.",
    LN_07: "El precio debe ser mayor que cero.",
    LN_08: "Seleccioná una editorial.",
    LN_09: "La editorial seleccionada no existe.",
    LN_10: "El género seleccionado no existe.",
    LN_11: "Seleccioná al menos un autor.",
    LN_12: "Uno de los autores seleccionados no existe.",
    CN_01: "Ingresá el nombre completo del cliente.",
    CN_02: "Ingresá el email del cliente.",
    CN_03: "El email no tiene un formato válido.",
    CN_04: "Ya existe un cliente con ese email."
  };

  function generarIdSiguiente(coleccion) {
    const maximo = coleccion.reduce(function (idMaximo, registro) {
      return registro.id > idMaximo ? registro.id : idMaximo;
    }, 0);
    return maximo + 1;
  }

  function generarIdLibro() {
    return generarIdSiguiente(ElTintero.datos.libros);
  }

  function generarIdCliente() {
    return generarIdSiguiente(ElTintero.datos.clientes);
  }

  function registrarLibro(datosLibro) {
    const datos = datosLibro || {};
    const errores = [];

    const titulo = recortarTexto(datos.titulo);
    if (titulo === "") {
      errores.push({ campo: "titulo", mensaje: MENSAJES_ALTA.LN_01 });
    }

    const isbn = recortarTexto(datos.isbn);
    if (isbn === "") {
      errores.push({ campo: "isbn", mensaje: MENSAJES_ALTA.LN_02 });
    } else if (normalizarIsbn(isbn) === "") {
      errores.push({ campo: "isbn", mensaje: MENSAJES_ALTA.LN_03 });
    } else if (existeLibroConIsbn(isbn)) {
      errores.push({ campo: "isbn", mensaje: MENSAJES_ALTA.LN_04 });
    }

    const textoPrecio = recortarTexto(datos.precio);
    const precio = Number(textoPrecio);
    if (textoPrecio === "") {
      errores.push({ campo: "precio", mensaje: MENSAJES_ALTA.LN_05 });
    } else if (!Number.isFinite(precio)) {
      errores.push({ campo: "precio", mensaje: MENSAJES_ALTA.LN_06 });
    } else if (precio <= 0) {
      errores.push({ campo: "precio", mensaje: MENSAJES_ALTA.LN_07 });
    }

    const textoEditorial = recortarTexto(datos.editorialId);
    let editorialId = null;
    if (textoEditorial === "") {
      errores.push({ campo: "editorialId", mensaje: MENSAJES_ALTA.LN_08 });
    } else {
      editorialId = Number(textoEditorial);
      if (!Number.isFinite(editorialId) || buscarEditorialPorId(editorialId) === undefined) {
        errores.push({ campo: "editorialId", mensaje: MENSAJES_ALTA.LN_09 });
      }
    }

    const textoGenero = recortarTexto(datos.generoId);
    let generoId = null;
    if (textoGenero !== "") {
      const genero = Number(textoGenero);
      if (!Number.isFinite(genero) || buscarGeneroPorId(genero) === undefined) {
        errores.push({ campo: "generoId", mensaje: MENSAJES_ALTA.LN_10 });
      } else {
        generoId = genero;
      }
    }

    const autoresCrudos = Array.isArray(datos.autoresIds) ? datos.autoresIds : [];
    const autoresIds = [];
    if (autoresCrudos.length === 0) {
      errores.push({ campo: "autoresIds", mensaje: MENSAJES_ALTA.LN_11 });
    } else {
      let hayAutorInexistente = false;
      autoresCrudos.forEach(function (autorCrudo) {
        const autorId = Number(recortarTexto(autorCrudo));
        if (!Number.isFinite(autorId) || buscarAutorPorId(autorId) === undefined) {
          hayAutorInexistente = true;
          return;
        }
        if (autoresIds.indexOf(autorId) === -1) {
          autoresIds.push(autorId);
        }
      });
      if (hayAutorInexistente) {
        errores.push({ campo: "autoresIds", mensaje: MENSAJES_ALTA.LN_12 });
      }
    }

    if (errores.length > 0) {
      return { exito: false, errores: errores };
    }

    const libro = {
      id: generarIdLibro(),
      titulo: titulo,
      isbn: isbn,
      precio: precio,
      editorialId: editorialId,
      generoId: generoId,
      autoresIds: autoresIds
    };
    ElTintero.datos.libros.push(libro);
    return { exito: true, libro: libro };
  }

  function registrarCliente(datosCliente) {
    const datos = datosCliente || {};
    const errores = [];

    const nombre = recortarTexto(datos.nombre);
    if (nombre === "") {
      errores.push({ campo: "nombre", mensaje: MENSAJES_ALTA.CN_01 });
    }

    const email = recortarTexto(datos.email);
    if (email === "") {
      errores.push({ campo: "email", mensaje: MENSAJES_ALTA.CN_02 });
    } else if (!esEmailValido(email)) {
      errores.push({ campo: "email", mensaje: MENSAJES_ALTA.CN_03 });
    } else if (existeClienteConEmail(email)) {
      errores.push({ campo: "email", mensaje: MENSAJES_ALTA.CN_04 });
    }

    if (errores.length > 0) {
      return { exito: false, errores: errores };
    }

    const cliente = {
      id: generarIdCliente(),
      nombre: nombre,
      email: email
    };
    ElTintero.datos.clientes.push(cliente);
    return { exito: true, cliente: cliente };
  }

  ElTintero.consultas = {
    obtenerLibros: obtenerLibros,
    obtenerClientes: obtenerClientes,
    buscarEditorialPorId: buscarEditorialPorId,
    buscarGeneroPorId: buscarGeneroPorId,
    buscarAutoresPorIds: buscarAutoresPorIds,
    buscarLibroPorId: buscarLibroPorId,
    buscarClientePorId: buscarClientePorId,
    normalizarIsbn: normalizarIsbn,
    normalizarEmail: normalizarEmail,
    existeLibroConIsbn: existeLibroConIsbn,
    existeClienteConEmail: existeClienteConEmail,
    formatearPrecio: formatearPrecio,
    verificarIntegridad: verificarIntegridad
  };

  ElTintero.registros = {
    generarIdLibro: generarIdLibro,
    generarIdCliente: generarIdCliente,
    registrarLibro: registrarLibro,
    registrarCliente: registrarCliente
  };

  verificarIntegridad();
}());
