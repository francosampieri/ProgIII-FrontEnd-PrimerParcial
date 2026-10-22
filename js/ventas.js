(function () {
  "use strict";

  window.ElTintero = window.ElTintero || {};

  const TEXTO_VENTA_OK = "Venta registrada correctamente.";
  const TEXTO_RENGLONES_VACIO = "Todavía no agregaste renglones.";

  const MENSAJES_VENTA = {
    VN_01: "Seleccioná un cliente.",
    VN_02: "El cliente seleccionado no existe.",
    VN_03: "Agregá al menos un renglón.",
    VN_04: "Seleccioná un libro.",
    VN_05: "El libro seleccionado no existe.",
    VN_06: "Ingresá una cantidad válida.",
    VN_07: "La cantidad debe ser un número entero.",
    VN_08: "La cantidad debe ser mayor que cero.",
    VN_09: "Ese libro ya está en la venta."
  };

  let renglones = [];

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

  function recortarTexto(valor) {
    if (valor === undefined || valor === null) {
      return "";
    }
    return String(valor).trim();
  }

  function redondear2(valor) {
    return Math.round(valor * 100) / 100;
  }

  function mostrarMensaje(tipo, texto) {
    const mensajeOk = document.getElementById("ventas-mensaje-ok");
    const mensajeError = document.getElementById("ventas-mensaje-error");
    if (!mensajeOk || !mensajeError) {
      return;
    }

    if (tipo === "ok") {
      mensajeOk.textContent = texto;
      mensajeOk.hidden = false;
      mensajeError.textContent = "";
      mensajeError.hidden = true;
    } else {
      mensajeError.textContent = texto;
      mensajeError.hidden = false;
      mensajeOk.textContent = "";
      mensajeOk.hidden = true;
    }
  }

  function limpiarMensajes() {
    const mensajeOk = document.getElementById("ventas-mensaje-ok");
    const mensajeError = document.getElementById("ventas-mensaje-error");
    if (mensajeOk) {
      mensajeOk.textContent = "";
      mensajeOk.hidden = true;
    }
    if (mensajeError) {
      mensajeError.textContent = "";
      mensajeError.hidden = true;
    }
  }

  function poblarSelectorCliente() {
    const selector = document.getElementById("ventas-cliente");
    vaciarElemento(selector);
    selector.appendChild(crearOpcion("", "Seleccionar cliente"));
    ElTintero.consultas.obtenerClientes().forEach(function (cliente) {
      selector.appendChild(crearOpcion(String(cliente.id), cliente.nombre));
    });
    selector.value = "";
  }

  function poblarSelectorLibro() {
    const selector = document.getElementById("ventas-libro");
    vaciarElemento(selector);
    selector.appendChild(crearOpcion("", "Seleccionar libro"));
    ElTintero.consultas.obtenerLibros().forEach(function (libro) {
      selector.appendChild(crearOpcion(String(libro.id), libro.titulo));
    });
    selector.value = "";
  }

  function indiceDeRenglon(libroId) {
    return renglones.findIndex(function (renglon) {
      return renglon.libroId === libroId;
    });
  }

  function crearFilaRenglon(renglon) {
    const libro = ElTintero.consultas.buscarLibroPorId(renglon.libroId);
    const titulo = libro ? libro.titulo : "";
    const precioUnitario = libro ? libro.precio : 0;
    const subtotal = redondear2(renglon.cantidad * precioUnitario);

    const fila = document.createElement("tr");
    fila.setAttribute("data-libro-id", String(renglon.libroId));
    fila.setAttribute("data-cantidad", String(renglon.cantidad));

    fila.appendChild(crearCelda(titulo));

    const celdaCantidad = document.createElement("td");
    const campoCantidad = document.createElement("input");
    campoCantidad.type = "number";
    campoCantidad.min = "1";
    campoCantidad.step = "1";
    campoCantidad.value = String(renglon.cantidad);
    campoCantidad.setAttribute("aria-label", "Cantidad de «" + titulo + "»");
    celdaCantidad.appendChild(campoCantidad);
    fila.appendChild(celdaCantidad);

    fila.appendChild(crearCelda(ElTintero.consultas.formatearImporte(precioUnitario)));
    fila.appendChild(crearCelda(ElTintero.consultas.formatearImporte(subtotal)));

    const celdaAcciones = document.createElement("td");
    const botonQuitar = document.createElement("button");
    botonQuitar.type = "button";
    botonQuitar.className = "btn btn--peligro";
    botonQuitar.setAttribute("data-accion", "quitar");
    botonQuitar.setAttribute("aria-label", "Quitar «" + titulo + "» de la venta");
    botonQuitar.textContent = "Quitar";
    celdaAcciones.appendChild(botonQuitar);
    fila.appendChild(celdaAcciones);

    return fila;
  }

  function renderizarRenglones() {
    const tbody = document.querySelector("#venta-renglones tbody");
    if (!tbody) {
      return;
    }

    vaciarElemento(tbody);
    renglones.forEach(function (renglon) {
      tbody.appendChild(crearFilaRenglon(renglon));
    });
  }

  function recalcular() {
    let total = 0;
    renglones.forEach(function (renglon) {
      const libro = ElTintero.consultas.buscarLibroPorId(renglon.libroId);
      if (libro) {
        total += redondear2(renglon.cantidad * libro.precio);
      }
    });

    const etiquetaTotal = document.getElementById("ventas-total");
    if (etiquetaTotal) {
      etiquetaTotal.textContent = ElTintero.consultas.formatearImporte(redondear2(total));
    }

    alternarVacio("ventas-renglones-vacio", renglones.length === 0, TEXTO_RENGLONES_VACIO);
  }

  function enfocarCantidad(libroId) {
    const campo = document.querySelector('#venta-renglones tr[data-libro-id="' + libroId + '"] input');
    if (campo) {
      campo.focus();
    }
  }

  function validarCantidad(textoCantidad) {
    if (textoCantidad === "") {
      return { mensaje: MENSAJES_VENTA.VN_06, cantidad: null };
    }

    const cantidad = Number(textoCantidad);
    if (!Number.isFinite(cantidad)) {
      return { mensaje: MENSAJES_VENTA.VN_06, cantidad: null };
    }
    if (!Number.isInteger(cantidad)) {
      return { mensaje: MENSAJES_VENTA.VN_07, cantidad: null };
    }
    if (cantidad <= 0) {
      return { mensaje: MENSAJES_VENTA.VN_08, cantidad: null };
    }
    return { mensaje: "", cantidad: cantidad };
  }

  function agregarRenglon() {
    const selectorLibro = document.getElementById("ventas-libro");
    const campoCantidad = document.getElementById("ventas-cantidad");
    const errores = [];

    const textoLibro = recortarTexto(selectorLibro.value);
    let libroId = null;
    if (textoLibro === "") {
      errores.push(MENSAJES_VENTA.VN_04);
    } else {
      libroId = Number(textoLibro);
      if (!Number.isFinite(libroId) || ElTintero.consultas.buscarLibroPorId(libroId) === undefined) {
        errores.push(MENSAJES_VENTA.VN_05);
        libroId = null;
      }
    }

    const revisionCantidad = validarCantidad(recortarTexto(campoCantidad.value));
    if (revisionCantidad.mensaje !== "") {
      errores.push(revisionCantidad.mensaje);
    }

    if (libroId !== null && indiceDeRenglon(libroId) !== -1) {
      errores.push(MENSAJES_VENTA.VN_09);
    }

    if (errores.length > 0) {
      mostrarMensaje("error", errores.join(" "));
      return;
    }

    renglones.push({ libroId: libroId, cantidad: revisionCantidad.cantidad });
    limpiarMensajes();
    renderizarRenglones();
    recalcular();
  }

  function quitarRenglon(libroId) {
    const indice = indiceDeRenglon(libroId);
    if (indice === -1) {
      return;
    }

    renglones.splice(indice, 1);
    limpiarMensajes();
    renderizarRenglones();
    recalcular();
  }

  function manejarCambioCantidad(evento) {
    const objetivo = evento.target;
    if (!objetivo || objetivo.tagName !== "INPUT") {
      return;
    }

    const fila = objetivo.closest("tr");
    if (!fila) {
      return;
    }

    const libroId = Number(fila.getAttribute("data-libro-id"));
    const indice = indiceDeRenglon(libroId);
    if (indice === -1) {
      return;
    }

    const revisionCantidad = validarCantidad(recortarTexto(objetivo.value));
    if (revisionCantidad.mensaje !== "") {
      mostrarMensaje("error", revisionCantidad.mensaje);
      renderizarRenglones();
      enfocarCantidad(libroId);
      return;
    }

    renglones[indice].cantidad = revisionCantidad.cantidad;
    limpiarMensajes();
    renderizarRenglones();
    recalcular();
    enfocarCantidad(libroId);
  }

  function manejarClicRenglones(evento) {
    const objetivo = evento.target;
    if (!objetivo || typeof objetivo.closest !== "function") {
      return;
    }

    const boton = objetivo.closest('[data-accion="quitar"]');
    if (!boton) {
      return;
    }

    const fila = boton.closest("tr");
    if (!fila) {
      return;
    }

    quitarRenglon(Number(fila.getAttribute("data-libro-id")));
  }

  function confirmarVenta() {
    const selectorCliente = document.getElementById("ventas-cliente");
    const errores = [];

    const textoCliente = recortarTexto(selectorCliente.value);
    let clienteId = null;
    if (textoCliente === "") {
      errores.push(MENSAJES_VENTA.VN_01);
    } else {
      clienteId = Number(textoCliente);
      if (!Number.isFinite(clienteId)) {
        errores.push(MENSAJES_VENTA.VN_01);
      } else if (ElTintero.consultas.buscarClientePorId(clienteId) === undefined) {
        errores.push(MENSAJES_VENTA.VN_02);
      }
    }

    if (renglones.length === 0) {
      errores.push(MENSAJES_VENTA.VN_03);
    }

    if (errores.length > 0) {
      mostrarMensaje("error", errores.join(" "));
      return;
    }

    const resultado = ElTintero.registros.registrarVenta({
      clienteId: clienteId,
      renglones: renglones
    });

    if (!resultado.exito) {
      mostrarMensaje("error", resultado.errores.map(function (error) {
        return error.mensaje;
      }).join(" "));
      return;
    }

    selectorCliente.value = "";
    document.getElementById("ventas-libro").value = "";
    document.getElementById("ventas-cantidad").value = "1";
    renglones = [];
    renderizarRenglones();
    recalcular();
    mostrarMensaje("ok", TEXTO_VENTA_OK);
  }

  function iniciar() {
    const tabla = document.getElementById("venta-renglones");
    if (!tabla) {
      return;
    }

    poblarSelectorCliente();
    poblarSelectorLibro();

    const botonAgregar = document.getElementById("ventas-agregar");
    if (botonAgregar) {
      botonAgregar.addEventListener("click", agregarRenglon);
    }

    const botonConfirmar = document.getElementById("ventas-confirmar");
    if (botonConfirmar) {
      botonConfirmar.addEventListener("click", confirmarVenta);
    }

    const tbody = tabla.querySelector("tbody");
    if (tbody) {
      tbody.addEventListener("change", manejarCambioCantidad);
      tbody.addEventListener("click", manejarClicRenglones);
    }

    renderizarRenglones();
    recalcular();
  }

  ElTintero.ventas = {
    iniciar: iniciar
  };

  iniciar();
}());
