(function () {
  "use strict";

  window.ElTintero = window.ElTintero || {};

  const TEXTO_HISTORIAL_VACIO = "Todavía no hay ventas registradas.";
  const PATRON_FECHA = /^(\d{4})-(\d{2})-(\d{2})$/;

  const formateadorFecha = new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "UTC"
  });

  function crearCelda(texto) {
    const celda = document.createElement("td");
    celda.textContent = texto;
    return celda;
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

  function formatearFecha(fecha) {
    const texto = fecha === undefined || fecha === null ? "" : String(fecha);
    const partes = PATRON_FECHA.exec(texto);
    if (!partes) {
      return texto;
    }

    const anio = Number(partes[1]);
    const mes = Number(partes[2]);
    const dia = Number(partes[3]);
    if (mes < 1 || mes > 12 || dia < 1 || dia > 31) {
      return texto;
    }

    return formateadorFecha.format(new Date(Date.UTC(anio, mes - 1, dia)));
  }

  function crearFilaVenta(venta) {
    const fila = document.createElement("tr");
    fila.setAttribute("data-venta-id", String(venta.id));

    fila.appendChild(crearCelda(String(venta.id)));
    fila.appendChild(crearCelda(formatearFecha(venta.fecha)));
    fila.appendChild(crearCelda(venta.clienteNombre));
    fila.appendChild(crearCelda(ElTintero.consultas.formatearImporte(venta.total)));

    const celdaDetalle = document.createElement("td");
    const enlaceDetalle = document.createElement("a");
    enlaceDetalle.href = "#historial-detalle-" + venta.id;
    enlaceDetalle.textContent = "Ver detalle";
    celdaDetalle.appendChild(enlaceDetalle);
    fila.appendChild(celdaDetalle);

    return fila;
  }

  function crearDetalleVenta(venta) {
    const seccion = document.createElement("section");
    seccion.id = "historial-detalle-" + venta.id;

    const encabezado = document.createElement("h3");
    encabezado.textContent = "Detalle de la venta " + venta.id;
    seccion.appendChild(encabezado);

    const contenedorTabla = document.createElement("div");
    contenedorTabla.className = "tabla-contenedor";

    const tabla = document.createElement("table");
    tabla.className = "tabla";

    const thead = document.createElement("thead");
    const filaEncabezado = document.createElement("tr");
    ["Libro", "Cantidad", "Precio unitario", "Subtotal"].forEach(function (texto) {
      const celdaEncabezado = document.createElement("th");
      celdaEncabezado.setAttribute("scope", "col");
      celdaEncabezado.textContent = texto;
      filaEncabezado.appendChild(celdaEncabezado);
    });
    thead.appendChild(filaEncabezado);
    tabla.appendChild(thead);

    const tbody = document.createElement("tbody");
    const renglones = Array.isArray(venta.renglones) ? venta.renglones : [];
    renglones.forEach(function (renglon) {
      const fila = document.createElement("tr");
      fila.appendChild(crearCelda(renglon.tituloLibro));
      fila.appendChild(crearCelda(String(renglon.cantidad)));
      fila.appendChild(crearCelda(ElTintero.consultas.formatearImporte(renglon.precioUnitario)));
      fila.appendChild(crearCelda(ElTintero.consultas.formatearImporte(renglon.subtotal)));
      tbody.appendChild(fila);
    });
    tabla.appendChild(tbody);

    contenedorTabla.appendChild(tabla);
    seccion.appendChild(contenedorTabla);

    const parrafoVolver = document.createElement("p");
    const enlaceVolver = document.createElement("a");
    enlaceVolver.href = "#historial-tabla";
    enlaceVolver.textContent = "Volver al listado";
    parrafoVolver.appendChild(enlaceVolver);
    seccion.appendChild(parrafoVolver);

    return seccion;
  }

  function eliminarDetallesPrevios() {
    const detalles = document.querySelectorAll('section[id^="historial-detalle-"]');
    Array.prototype.slice.call(detalles).forEach(function (detalle) {
      detalle.parentNode.removeChild(detalle);
    });
  }

  function renderizar() {
    const tabla = document.getElementById("historial-tabla");
    if (!tabla) {
      return;
    }

    const tbody = tabla.querySelector("tbody");
    if (!tbody) {
      return;
    }

    eliminarDetallesPrevios();
    vaciarElemento(tbody);

    const ventas = ElTintero.datos.ventas;
    ventas.forEach(function (venta) {
      tbody.appendChild(crearFilaVenta(venta));
    });

    alternarVacio("historial-vacio", ventas.length === 0, TEXTO_HISTORIAL_VACIO);

    const contenedorPrincipal = document.querySelector("main.contenedor");
    if (contenedorPrincipal) {
      ventas.forEach(function (venta) {
        contenedorPrincipal.appendChild(crearDetalleVenta(venta));
      });
    }
  }

  function iniciar() {
    if (!document.getElementById("historial-tabla")) {
      return;
    }
    renderizar();
  }

  ElTintero.historial = {
    renderizar: renderizar
  };

  iniciar();
}());
