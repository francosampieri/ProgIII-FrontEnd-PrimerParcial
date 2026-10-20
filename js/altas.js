(function () {
  "use strict";

  window.ElTintero = window.ElTintero || {};

  const TEXTO_LIBRO_OK = "Libro registrado correctamente.";
  const TEXTO_CLIENTE_OK = "Cliente registrado correctamente.";
  const TEXTO_LIBROS_VACIO = "No hay libros registrados.";
  const TEXTO_CLIENTES_VACIO = "No hay clientes registrados.";

  const CONTROL_POR_CAMPO_LIBRO = {
    titulo: "libros-titulo",
    isbn: "libros-isbn",
    precio: "libros-precio",
    editorialId: "libros-editorial",
    generoId: "libros-genero"
  };

  const CONTROL_POR_CAMPO_CLIENTE = {
    nombre: "clientes-nombre",
    email: "clientes-email"
  };

  function crearCelda(texto) {
    const celda = document.createElement("td");
    celda.textContent = texto;
    return celda;
  }

  function crearOpcion(valor, texto) {
    const opcion = document.createElement("option");
    opcion.value = valor;
    opcion.textContent = texto;
    return opcion;
  }

  function vaciarElemento(elemento) {
    while (elemento.firstChild) {
      elemento.removeChild(elemento.firstChild);
    }
  }

  function alternarVacio(id, estaVacio, texto) {
    const contenedor = document.getElementById(id);
    if (!contenedor) {
      return;
    }
    contenedor.textContent = estaVacio ? texto : "";
    contenedor.hidden = !estaVacio;
  }

  function obtenerControles(formulario) {
    return Array.prototype.slice.call(formulario.querySelectorAll("input, select"));
  }

  function quitarAtributosError(formulario) {
    obtenerControles(formulario).forEach(function (control) {
      control.removeAttribute("aria-invalid");
      control.removeAttribute("aria-describedby");
    });
  }

  function obtenerCheckboxesAutores() {
    const checkboxes = document.querySelectorAll('#libros-form input[name="autores"]');
    return Array.prototype.slice.call(checkboxes);
  }

  function poblarSelectorEditorial() {
    const selector = document.getElementById("libros-editorial");
    vaciarElemento(selector);
    selector.appendChild(crearOpcion("", "Seleccionar editorial"));
    ElTintero.datos.editoriales.forEach(function (editorial) {
      selector.appendChild(crearOpcion(String(editorial.id), editorial.nombre));
    });
    selector.value = "";
  }

  function poblarSelectorGenero() {
    const selector = document.getElementById("libros-genero");
    vaciarElemento(selector);
    ElTintero.datos.generos.forEach(function (genero) {
      selector.appendChild(crearOpcion(String(genero.id), genero.nombre));
    });
    selector.appendChild(crearOpcion("", "Sin clasificar"));
    selector.value = "";
  }

  function crearCheckboxAutor(autor) {
    const contenedor = document.createElement("p");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = "libros-autor-" + autor.id;
    checkbox.name = "autores";
    checkbox.value = String(autor.id);

    const etiqueta = document.createElement("label");
    etiqueta.setAttribute("for", checkbox.id);
    etiqueta.textContent = autor.nombre;

    contenedor.appendChild(checkbox);
    contenedor.appendChild(etiqueta);
    return contenedor;
  }

  function poblarAutores() {
    const fieldset = document.querySelector("#libros-form fieldset");
    if (!fieldset) {
      return;
    }

    const leyenda = fieldset.querySelector("legend");
    if (leyenda) {
      while (leyenda.nextSibling) {
        fieldset.removeChild(leyenda.nextSibling);
      }
    }

    ElTintero.datos.autores.forEach(function (autor) {
      fieldset.appendChild(crearCheckboxAutor(autor));
    });
  }

  function leerAutoresSeleccionados() {
    return obtenerCheckboxesAutores()
      .filter(function (checkbox) {
        return checkbox.checked;
      })
      .map(function (checkbox) {
        return checkbox.value;
      });
  }

  function leerDatosLibro() {
    return {
      titulo: document.getElementById("libros-titulo").value,
      isbn: document.getElementById("libros-isbn").value,
      precio: document.getElementById("libros-precio").value,
      editorialId: document.getElementById("libros-editorial").value,
      generoId: document.getElementById("libros-genero").value,
      autoresIds: leerAutoresSeleccionados()
    };
  }

  function crearFilaLibro(libro) {
    const fila = document.createElement("tr");
    fila.appendChild(crearCelda(libro.titulo));
    fila.appendChild(crearCelda(libro.isbn));

    const editorial = ElTintero.consultas.buscarEditorialPorId(libro.editorialId);
    fila.appendChild(crearCelda(editorial ? editorial.nombre : "Editorial no disponible"));

    const genero = libro.generoId === null || libro.generoId === undefined
      ? undefined
      : ElTintero.consultas.buscarGeneroPorId(libro.generoId);
    fila.appendChild(crearCelda(genero ? genero.nombre : "Sin clasificar"));

    const autores = ElTintero.consultas.buscarAutoresPorIds(libro.autoresIds);
    fila.appendChild(crearCelda(autores.map(function (autor) {
      return autor.nombre;
    }).join(", ")));

    fila.appendChild(crearCelda(ElTintero.consultas.formatearPrecio(libro.precio)));
    return fila;
  }

  function renderizarLibros() {
    const tbody = document.querySelector("#libros-tabla tbody");
    if (!tbody) {
      return;
    }

    vaciarElemento(tbody);
    ElTintero.datos.libros.forEach(function (libro) {
      tbody.appendChild(crearFilaLibro(libro));
    });

    alternarVacio("libros-vacio", ElTintero.datos.libros.length === 0, TEXTO_LIBROS_VACIO);
  }

  function obtenerIdsControlesLibro(errores) {
    const ids = [];
    errores.forEach(function (error) {
      if (error.campo === "autoresIds") {
        obtenerCheckboxesAutores().forEach(function (checkbox) {
          ids.push(checkbox.id);
        });
        return;
      }
      if (CONTROL_POR_CAMPO_LIBRO[error.campo]) {
        ids.push(CONTROL_POR_CAMPO_LIBRO[error.campo]);
      }
    });
    return ids;
  }

  function mostrarErroresLibros(errores) {
    const formulario = document.getElementById("libros-form");
    const mensajeError = document.getElementById("libros-mensaje-error");
    const mensajeOk = document.getElementById("libros-mensaje-ok");

    quitarAtributosError(formulario);

    mensajeError.textContent = errores.map(function (error) {
      return error.mensaje;
    }).join(" ");
    mensajeError.hidden = false;

    mensajeOk.textContent = "";
    mensajeOk.hidden = true;

    obtenerIdsControlesLibro(errores).forEach(function (id) {
      const control = document.getElementById(id);
      if (!control) {
        return;
      }
      control.setAttribute("aria-invalid", "true");
      control.setAttribute("aria-describedby", "libros-mensaje-error");
    });
  }

  function mostrarExitoLibro() {
    const mensajeOk = document.getElementById("libros-mensaje-ok");
    const mensajeError = document.getElementById("libros-mensaje-error");

    mensajeOk.textContent = TEXTO_LIBRO_OK;
    mensajeOk.hidden = false;

    mensajeError.textContent = "";
    mensajeError.hidden = true;
  }

  function limpiarFormularioLibros() {
    document.getElementById("libros-titulo").value = "";
    document.getElementById("libros-isbn").value = "";
    document.getElementById("libros-precio").value = "";
    document.getElementById("libros-editorial").value = "";
    document.getElementById("libros-genero").value = "";

    obtenerCheckboxesAutores().forEach(function (checkbox) {
      checkbox.checked = false;
    });
  }

  function manejarAltaLibro(evento) {
    evento.preventDefault();

    const resultado = ElTintero.registros.registrarLibro(leerDatosLibro());

    if (!resultado.exito) {
      mostrarErroresLibros(resultado.errores);
      return;
    }

    limpiarFormularioLibros();
    quitarAtributosError(document.getElementById("libros-form"));
    mostrarExitoLibro();
    renderizarLibros();
  }

  function crearFilaCliente(cliente) {
    const fila = document.createElement("tr");
    fila.appendChild(crearCelda(cliente.nombre));
    fila.appendChild(crearCelda(cliente.email));
    return fila;
  }

  function renderizarClientes() {
    const tbody = document.querySelector("#clientes-tabla tbody");
    if (!tbody) {
      return;
    }

    vaciarElemento(tbody);
    ElTintero.datos.clientes.forEach(function (cliente) {
      tbody.appendChild(crearFilaCliente(cliente));
    });

    alternarVacio("clientes-vacio", ElTintero.datos.clientes.length === 0, TEXTO_CLIENTES_VACIO);
  }

  function leerDatosCliente() {
    return {
      nombre: document.getElementById("clientes-nombre").value,
      email: document.getElementById("clientes-email").value
    };
  }

  function mostrarErroresClientes(errores) {
    const formulario = document.getElementById("clientes-form");
    const mensajeError = document.getElementById("clientes-mensaje-error");
    const mensajeOk = document.getElementById("clientes-mensaje-ok");

    quitarAtributosError(formulario);

    mensajeError.textContent = errores.map(function (error) {
      return error.mensaje;
    }).join(" ");
    mensajeError.hidden = false;

    mensajeOk.textContent = "";
    mensajeOk.hidden = true;

    errores.forEach(function (error) {
      const id = CONTROL_POR_CAMPO_CLIENTE[error.campo];
      const control = id ? document.getElementById(id) : undefined;
      if (!control) {
        return;
      }
      control.setAttribute("aria-invalid", "true");
      control.setAttribute("aria-describedby", "clientes-mensaje-error");
    });
  }

  function mostrarExitoCliente() {
    const mensajeOk = document.getElementById("clientes-mensaje-ok");
    const mensajeError = document.getElementById("clientes-mensaje-error");

    mensajeOk.textContent = TEXTO_CLIENTE_OK;
    mensajeOk.hidden = false;

    mensajeError.textContent = "";
    mensajeError.hidden = true;
  }

  function limpiarFormularioClientes() {
    document.getElementById("clientes-nombre").value = "";
    document.getElementById("clientes-email").value = "";
  }

  function manejarAltaCliente(evento) {
    evento.preventDefault();

    const resultado = ElTintero.registros.registrarCliente(leerDatosCliente());

    if (!resultado.exito) {
      mostrarErroresClientes(resultado.errores);
      return;
    }

    limpiarFormularioClientes();
    quitarAtributosError(document.getElementById("clientes-form"));
    mostrarExitoCliente();
    renderizarClientes();
  }

  function iniciar() {
    const formularioLibros = document.getElementById("libros-form");
    if (formularioLibros) {
      poblarSelectorEditorial();
      poblarSelectorGenero();
      poblarAutores();
      renderizarLibros();
      formularioLibros.addEventListener("submit", manejarAltaLibro);
    }

    const formularioClientes = document.getElementById("clientes-form");
    if (formularioClientes) {
      renderizarClientes();
      formularioClientes.addEventListener("submit", manejarAltaCliente);
    }
  }

  ElTintero.altas = {
    iniciar: iniciar,
    renderizarLibros: renderizarLibros,
    renderizarClientes: renderizarClientes
  };

  iniciar();
}());
