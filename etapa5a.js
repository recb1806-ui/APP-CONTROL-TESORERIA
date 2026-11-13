// =========================================================================================
// ETAPA 5A (RENOVADA): MÓDULO DE GASTOS URGENTES DE DESPACHO (CAJA CHICA), TARIFARIO ANEXO 09,
// PRIVACIDAD ESTRICTA POR USUARIO (DNI) Y GENERADOR DE FORMATOS OFICIALES
// Diseño Cálido y Lenguaje Claro para Magistrados y Fiscales del Ministerio Público
// Directiva Manejo de la Caja Chica V.08 (OGFIN/DIR-01) - UE 012: ANC-MP
// =========================================================================================

window.CAJA_CATALOGOS = {
  // Anexo 09: Formato de Tarifa Única - Sede Central (44 destinos de Lima/Callao + Reglas Especiales)
  tarifarioAnexo09: [
    { item: 1, distrito: "Ancón", dia: 30.00, noche: 32.00 },
    { item: 2, distrito: "Ate - Vitarte", dia: 26.00, noche: 28.00 },
    { item: 3, distrito: "Barranco", dia: 20.00, noche: 22.00 },
    { item: 4, distrito: "Breña", dia: 16.00, noche: 18.00 },
    { item: 5, distrito: "El Callao (Bellavista, La Perla, La Punta, Carmen de la Legua)", dia: 25.00, noche: 27.00 },
    { item: 6, distrito: "Carabayllo", dia: 28.00, noche: 30.00 },
    { item: 7, distrito: "Cercado de Lima", dia: 14.00, noche: 16.00 },
    { item: 8, distrito: "Chaclacayo", dia: 38.00, noche: 40.00 },
    { item: 9, distrito: "Chorrillos", dia: 24.00, noche: 26.00 },
    { item: 10, distrito: "Chosica (Lurigancho)", dia: 44.00, noche: 46.00 },
    { item: 11, distrito: "Cieneguilla", dia: 33.00, noche: 35.00 },
    { item: 12, distrito: "Comas", dia: 28.00, noche: 30.00 },
    { item: 13, distrito: "El Agustino", dia: 16.00, noche: 18.00 },
    { item: 14, distrito: "Huachipa (Centro Poblado)", dia: 26.00, noche: 28.00 },
    { item: 15, distrito: "Independencia", dia: 22.00, noche: 24.00 },
    { item: 16, distrito: "Jesús María", dia: 16.00, noche: 18.00 },
    { item: 17, distrito: "La Molina", dia: 25.00, noche: 27.00 },
    { item: 18, distrito: "La Victoria", dia: 16.00, noche: 18.00 },
    { item: 19, distrito: "Lince", dia: 16.00, noche: 18.00 },
    { item: 20, distrito: "Los Olivos", dia: 22.00, noche: 24.00 },
    { item: 21, distrito: "Lurín", dia: 34.00, noche: 36.00 },
    { item: 22, distrito: "Magdalena del Mar", dia: 18.00, noche: 20.00 },
    { item: 23, distrito: "Miraflores", dia: 20.00, noche: 22.00 },
    { item: 24, distrito: "Pachacámac", dia: 34.00, noche: 36.00 },
    { item: 25, distrito: "Pucusana", dia: 38.00, noche: 40.00 },
    { item: 26, distrito: "Pueblo Libre", dia: 16.00, noche: 18.00 },
    { item: 27, distrito: "Puente Piedra", dia: 28.00, noche: 30.00 },
    { item: 28, distrito: "Punta Negra", dia: 38.00, noche: 40.00 },
    { item: 29, distrito: "Rímac", dia: 16.00, noche: 18.00 },
    { item: 30, distrito: "San Bartolo", dia: 38.00, noche: 40.00 },
    { item: 31, distrito: "San Borja", dia: 20.00, noche: 22.00 },
    { item: 32, distrito: "San Isidro", dia: 19.00, noche: 21.00 },
    { item: 33, distrito: "San Juan de Lurigancho", dia: 22.00, noche: 24.00 },
    { item: 34, distrito: "San Juan de Miraflores", dia: 25.00, noche: 27.00 },
    { item: 35, distrito: "San Luis", dia: 20.00, noche: 22.00 },
    { item: 36, distrito: "San Martín de Porres", dia: 20.00, noche: 22.00 },
    { item: 37, distrito: "San Miguel", dia: 20.00, noche: 22.00 },
    { item: 38, distrito: "Santa Anita", dia: 24.00, noche: 26.00 },
    { item: 39, distrito: "Santiago de Surco", dia: 24.00, noche: 26.00 },
    { item: 40, distrito: "Surquillo", dia: 20.00, noche: 22.00 },
    { item: 41, distrito: "Ventanilla", dia: 36.00, noche: 38.00 },
    { item: 42, distrito: "Villa El Salvador", dia: 30.00, noche: 32.00 },
    { item: 43, distrito: "Villa María del Triunfo", dia: 30.00, noche: 32.00 },
    { item: 44, distrito: "Aeropuerto Internacional Jorge Chávez", dia: 38.00, noche: 38.00 },
    { item: 45, distrito: "Desde Callao, Lima Este, Norte o Sur al resto de Lima (Nota 4)", dia: 28.00, noche: 30.00 },
    { item: 46, distrito: "Edecanes, Jefe de Escolta y Seguridad (Tarifa promedio por tramo)", dia: 25.00, noche: 25.00 }
  ],

  categoriasGasto: [
    {
      id: "Alimentos",
      icono: "🍽️",
      color: "#10B981",
      tipoBienServicio: "BIEN",
      subrubros: [
        { codigo: "CC-ALI-01", nombre: "Refrigerio por labores fuera de horario (+4 horas adicionales • Máx. S/ 24.00 para personal administrativo)", especifica: "2.3.1.1.1.1", topeFijo: 24.00, bloqGastosOp: true, detrac: null },
        { codigo: "CC-ALI-02", nombre: "Atención de reuniones oficiales de trabajo (Indicar motivo de la reunión • Tope 10% UIT mensual)", especifica: "2.3.1.1.1.1", pctUit: 10.0, bloqGastosOp: false, detrac: null },
        { codigo: "CC-ALI-03", nombre: "Compra de bidones de agua de mesa para el despacho (Cuando no haya contrato vigente)", especifica: "2.3.1.1.1.1", pctUit: 20.0, bloqGastosOp: false, detrac: null },
        { codigo: "CC-ENS-01", nombre: "Utensilios menores de cafetería o cocina para el despacho (Máx. S/ 700.00 al mes)", especifica: "2.3.1.99.1.99", topeFijo: 700.00, bloqGastosOp: false, detrac: null }
      ]
    },
    {
      id: "Movilidad",
      icono: "🚕",
      color: "#0EA5E9",
      tipoBienServicio: "SERVICIO",
      subrubros: [
        { codigo: "CC-MOV-01", nombre: "Movilidad local para diligencias o notificaciones (Según tarifario por distrito • Genera DJ Anexo 08)", especifica: "2.3.2.1.2.99", esTarifario: true, bloqGastosOp: true, detrac: null },
        { codigo: "CC-MOV-02", nombre: "Pasaje aéreo urgente por comisión inopinada o reservada (Con autorización de Administración)", especifica: "2.3.2.1.2.1", pctUit: 20.0, bloqGastosOp: false, detrac: null }
      ]
    },
    {
      id: "Combustible",
      icono: "⛽",
      color: "#F59E0B",
      tipoBienServicio: "BIEN",
      subrubros: [
        { codigo: "CC-COM-01", nombre: "Combustible o lubricantes para vehículo oficial (Requiere indicar placa y kilometraje)", especifica: "2.3.1.3.1.1", pctUit: 20.0, exigePlaca: true, detrac: null },
        { codigo: "CC-REP-01", nombre: "Repuestos urgentes, llantas o batería para vehículo oficial (Sin stock en almacén)", especifica: "2.3.1.6.1.1", pctUit: 20.0, exigePlaca: true, detrac: null }
      ]
    },
    {
      id: "Materiales",
      icono: "📎",
      color: "#8B5CF6",
      tipoBienServicio: "BIEN",
      subrubros: [
        { codigo: "CC-MAT-01", nombre: "Útiles de oficina urgentes (Requiere constancia PECOSA de que no hay stock en almacén)", especifica: "2.3.1.5.1.2", pctUit: 20.0, exigePecosa: true, detrac: null },
        { codigo: "CC-MAT-02", nombre: "Tóner o tintas para impresora del despacho (Requiere constancia PECOSA sin stock en almacén)", especifica: "2.3.1.5.1.2", pctUit: 20.0, exigePecosa: true, detrac: null },
        { codigo: "CC-MAT-03", nombre: "Artículos de limpieza y desinfección urgentes (Cuando no los cubra el servicio de limpieza)", especifica: "2.3.1.5.3.1", pctUit: 20.0, exigePecosa: false, detrac: null },
        { codigo: "CC-MAT-04", nombre: "Focos, enchufes, cables o memorias USB / discos externos (Con visto bueno de soporte técnico)", especifica: "2.3.1.5.4.1", pctUit: 20.0, exigePecosa: false, detrac: null },
        { codigo: "CC-MAT-05", nombre: "Candados, cerraduras, llaves, ferretería menor o implementos de protección", especifica: "2.3.1.5.99.99", pctUit: 20.0, exigePecosa: false, detrac: null },
        { codigo: "CC-MED-01", nombre: "Alcohol, algodón, gasas e insumos básicos para el botiquín del despacho", especifica: "2.3.1.8.1.2", pctUit: 20.0, exigePecosa: false, detrac: null },
        { codigo: "CC-OTB-01", nombre: "Ejemplar del Diario Oficial El Peruano, banderas o distintivos institucionales", especifica: "2.3.1.99.1.3", pctUit: 20.0, exigePecosa: false, detrac: null }
      ]
    },
    {
      id: "Mantenimiento",
      icono: "🛠️",
      color: "#F43F5E",
      tipoBienServicio: "SERVICIO",
      subrubros: [
        { codigo: "CC-MAN-01", nombre: "Reparación urgente de baños, aire acondicionado, cerraduras, muebles o equipos del despacho", especifica: "2.3.2.4.7.1", pctUit: 20.0, detrac: { cod: "020", tasa: 10.0, desc: "Mantenimiento y reparación de bienes muebles (10%)" } },
        { codigo: "CC-MAN-02", nombre: "Mantenimiento de vehículo oficial, lavado, SOAT o revisión técnica (Indicar placa)", especifica: "2.3.2.4.5.1", pctUit: 20.0, exigePlaca: true, detrac: { cod: "020", tasa: 10.0, desc: "Mantenimiento y reparación de bienes muebles (10%)" } }
      ]
    },
    {
      id: "Servicios",
      icono: "📑",
      color: "#0284C7",
      tipoBienServicio: "SERVICIO",
      subrubros: [
        { codigo: "CC-MEN-01", nombre: "Envío urgente de expedientes o notificaciones por courier / mensajería", especifica: "2.3.2.2.3.1", pctUit: 20.0, detrac: null },
        { codigo: "CC-OTS-01", nombre: "Servicio de traslado o flete de bienes, mobiliario o expedientes", especifica: "2.3.2.7.11.2", pctUit: 20.0, detrac: { cod: "027", tasa: 4.0, desc: "Transporte de bienes por vía terrestre (4%)" } },
        { codigo: "CC-OTS-02", nombre: "Trámites notariales, tasas SUNARP, peajes sueltos, estiba o recarga de extintores", especifica: "2.3.2.7.11.99", pctUit: 20.0, detrac: { cod: "021", tasa: 10.0, desc: "Movimiento de carga / Otros servicios (10%)" } },
        { codigo: "CC-OTS-03", nombre: "Arreglos florales por protocolo institucional o condolencias oficiales", especifica: "2.3.1.99.1.99", pctUit: 20.0, detrac: null },
        { codigo: "CC-OTS-04", nombre: "Lavado de cortinas, banderas o banderolas del despacho", especifica: "2.3.2.7.11.99", pctUit: 20.0, detrac: { cod: "037", tasa: 12.0, desc: "Demás servicios gravados con IGV (12%)" } },
        { codigo: "CC-OTS-05", nombre: "Fotocopiado urgente de carpetas o expedientes (Cuando no haya fotocopiadora operativa)", especifica: "2.3.2.2.4.4", pctUit: 20.0, detrac: { cod: "022", tasa: 12.0, desc: "Otros servicios empresariales (12%)" } },
        { codigo: "CC-OTS-06", nombre: "Empastado de libros/expedientes, impresión de banners o carátulas oficiales", especifica: "2.3.2.2.4.4", pctUit: 20.0, detrac: { cod: "022", tasa: 12.0, desc: "Otros servicios empresariales (12%)" } },
        { codigo: "CC-OTS-07", nombre: "Servicio de traducción o intérprete oficial para diligencias", especifica: "2.3.2.7.11.99", pctUit: 20.0, detrac: { cod: "022", tasa: 12.0, desc: "Otros servicios empresariales (12%)" } },
        { codigo: "CC-OTS-08", nombre: "Emisión o renovación de Certificado Digital RENIEC (Coordinado con Sistemas/OTI)", especifica: "2.3.2.7.2.99", pctUit: 20.0, detrac: null }
      ]
    }
  ]
};

window.CAJA_STATE = {
  categoriaActiva: "Alimentos",
  subrubroActivo: "CC-ALI-01",
  tipoComprobante: "Factura Electrónica",
  cantidad: 1,
  horarioMovilidad: "DIA",
  gastosRegistrados: []
};

document.addEventListener("DOMContentLoaded", () => {
  inicializarVistaYModalCajaChica();
  cargarDatosModuloCaja();
});

window.cargarDatosModuloCaja = async function() {
  await sincronizarGastosCajaSupabase();
  renderizarListadoGastosCajaChica();
};

// =========================================================================================
// FILTRO ESTRICTO DE PRIVACIDAD: CADA USUARIO SOLO VE LO QUE ÉL REGISTRÓ (POR SU DNI)
// SOLO EL ADMINISTRADOR (CON CLAVE) PUEDE VER Y AUDITAR TODOS LOS REGISTROS
// =========================================================================================
window.obtenerGastosCajaVisiblesUsuario = function() {
  const todos = window.CAJA_STATE.gastosRegistrados || [];
  if (typeof window.esAdministradorActivo === "function" && window.esAdministradorActivo()) {
    return todos;
  }

  return todos.filter(g => {
    if (typeof window.esRegistroDelUsuarioActivo === "function") {
      return window.esRegistroDelUsuarioActivo(g);
    }
    const p = window.ANC_STATE?.perfilActivo || {};
    const miDni = String(p.usuario_dni || "").trim().toLowerCase();
    const miNombre = String(p.usuario_nombre || "").trim().toLowerCase();
    const regUsu = String(g.usuario_registro || "").trim().toLowerCase();
    const regDni = String(g.usuario_dni_registro || g.ruc_dni_proveedor || "").trim().toLowerCase();
    return (miDni && (regDni === miDni || regUsu.includes(miDni))) || (miNombre && regUsu === miNombre);
  });
};

function inicializarVistaYModalCajaChica() {
  const secCaja = document.getElementById("view-caja-chica");
  if (secCaja) {
    secCaja.innerHTML = `
      <div class="content-surface-card">
        <div style="text-align:center; margin-bottom:10px;">
          <h2 style="font-size:1.2rem; font-weight:800; color:#0F172A;">🧾 Gastos Urgentes de Despacho (Caja Chica)</h2>
          <p style="font-size:0.8rem; color:#475569; font-weight:600; margin-top:2px;">
            Registra compras menores urgentes, movilidad local para diligencias o solicita un vale provisional
          </p>
        </div>

        <!-- Botón Circular Central (+) en Ámbar Dorado Cálido -->
        <div class="add-circle-container">
          <button type="button" class="btn-circle-plus" onclick="abrirModalGastoRapido()">+</button>
          <p class="add-circle-caption">
            Toca el botón circular (+) para registrar una boleta, factura, movilidad de diligencia o vale provisional
          </p>
        </div>

        <!-- Barra de Resumen Cálida y Estado de Privacidad por Usuario -->
        <div id="resumen-financiero-caja-activa" style="background:#FFFDF5; color:#0F172A; border:1.5px solid #FDE68A; border-radius:18px; padding:12px 14px; margin-bottom:14px; font-size:0.78rem; box-shadow:0 4px 12px rgba(245,158,11,0.06);"></div>

        <!-- Botones de Reportes y Formatos Listos para Firmar (2 columnas en móvil) -->
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-bottom:14px;">
          <button type="button" onclick="imprimirRendicionAnexo13CajaPDF()" style="background:linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%); color:#0F172A; border:1.5px solid #F59E0B; border-radius:12px; padding:10px 8px; font-size:0.75rem; font-weight:800; cursor:pointer;">
            🖨️ Formato de Rendición (Anexo 13)
          </button>
          <button type="button" onclick="imprimirLibroCajaAnexo17PDF()" style="background:#F8FAFC; color:#0F172A; border:1.5px solid #CBD5E1; border-radius:12px; padding:10px 8px; font-size:0.75rem; font-weight:800; cursor:pointer;">
            📘 Libro de Movimientos (Anexo 17)
          </button>
          <button type="button" onclick="imprimirConsolidadoDJMovilidadAnexo08PDF()" style="background:#F0F8FF; color:#0284C7; border:1.5px solid #BAE6FD; border-radius:12px; padding:10px 8px; font-size:0.75rem; font-weight:800; cursor:pointer;">
            🚕 Planilla de Movilidad (Anexo 08)
          </button>
          <button type="button" onclick="exportarRendicionCajaDependenciaExcel()" style="background:#F2FBF7; color:#059669; border:1.5px solid #A7F3D0; border-radius:12px; padding:10px 8px; font-size:0.75rem; font-weight:800; cursor:pointer;">
            📥 Descargar Cuadro en Excel
          </button>
        </div>

        <!-- Tabla de Gastos Registrados con Botones de Formato Individual por cada Gasto -->
        <table class="anc-list-table">
          <thead>
            <tr>
              <th style="width:24%;">N° / FECHA</th>
              <th style="width:44%;">ESTABLECIMIENTO Y MOTIVO</th>
              <th style="width:32%;">MONTO Y FORMATOS</th>
            </tr>
          </thead>
          <tbody id="tabla-gastos-preview"></tbody>
        </table>
      </div>
    `;
  }

  const modalBody = document.querySelector("#modal-gasto-rapido .modal-body-content");
  if (modalBody) {
    modalBody.innerHTML = `
      <!-- Panel Cálido de Calculadora Rápida -->
      <div class="dark-calc-panel">
        <div class="calc-label-top">MONTO DEL COMPROBANTE O TARIFA (S/)</div>
        <div class="calc-amount-row">
          <input type="number" id="input-calc-monto" class="calc-amount-input" value="24.00" step="0.50" min="0" oninput="recalcularModalCajaEnVivo()" />
          <div class="calc-currency-tag">SOLES<br />(S/)</div>
        </div>

        <div class="calc-subbox">
          <div class="calc-subbox-title">¿QUÉ DOCUMENTO PRESENTAS?</div>
          <div class="chips-row" id="chips-comprobante">
            <button type="button" class="chip-option active" onclick="seleccionarChipComprobante('Factura Electrónica')">Factura</button>
            <button type="button" class="chip-option" onclick="seleccionarChipComprobante('Boleta de Venta')">Boleta</button>
            <button type="button" class="chip-option" onclick="seleccionarChipComprobante('Ticket')">Ticket</button>
            <button type="button" class="chip-option" onclick="seleccionarChipComprobante('DJ Movilidad Local (Anexo 08)')">Movilidad (DJ)</button>
            <button type="button" class="chip-option" onclick="seleccionarChipComprobante('Recibo por Honorarios (Locador)')">Recibo Honorarios</button>
            <button type="button" class="chip-option" onclick="seleccionarChipComprobante('Vale Provisional (Anexo 01)')">Vale Provisional (48h)</button>
          </div>
        </div>

        <div class="calc-grid-2col">
          <div class="calc-subbox" style="margin-bottom:0;">
            <div class="calc-subbox-title">CANTIDAD / TRAMOS</div>
            <div class="qty-stepper">
              <button type="button" class="btn-step" onclick="cambiarCantidadModalCaja(-1)">−</button>
              <strong style="font-size:1.15rem;" id="lbl-cantidad-modal">1</strong>
              <button type="button" class="btn-step" onclick="cambiarCantidadModalCaja(1)">+</button>
            </div>
          </div>
          <div class="calc-subbox" style="margin-bottom:0; border-color: rgba(251,191,36,0.45);">
            <div class="calc-subbox-title" style="color:#FBBF24;" id="lbl-titulo-tope-modal">LÍMITE PERMITIDO (S/)</div>
            <div style="font-size:1.15rem; font-weight:800; color:#6EE7B7; margin-top:2px;" id="lbl-tope-modal">1,070.00</div>
            <div style="font-size:0.7rem; color:#E2E8F0; margin-top:2px;">Total: <strong id="lbl-total-calculado-modal" style="color:#FBBF24;">S/ 24.00</strong></div>
          </div>
        </div>
      </div>

      <div style="display:flex; justify-content:space-between; font-size:0.75rem; font-weight:800; color:#475569;">
        <span>ELIGE EL TIPO DE GASTO</span>
        <span style="color:#D97706;" id="lbl-cat-activa-nombre">ALIMENTOS</span>
      </div>

      <div class="category-circles-grid" id="grid-iconos-categorias-caja" style="grid-template-columns:repeat(3, 1fr);"></div>

      <div style="margin-bottom:10px;">
        <label style="display:block; font-size:0.73rem; font-weight:800; color:#0F172A; margin-bottom:4px;">
          ¿QUÉ BIEN O SERVICIO NECESITAS CUBRIR?:
        </label>
        <select id="caja-select-subrubro" onchange="alCambiarSubrubroModalCaja()" style="width:100%; padding:10px; border-radius:12px; border:1.5px solid #F59E0B; font-weight:800; font-size:0.8rem; background:#FFFDF5; color:#0F172A;"></select>
      </div>

      <!-- BLOQUE ESPECIAL 1: TARIFARIO ÚNICO ANEXO 09 (44 Distritos Día / Noche) -->
      <div id="bloque-tarifario-anexo09" style="display:none; background:#F0F8FF; border:1.5px solid #BAE6FD; border-radius:14px; padding:11px; margin-bottom:10px;">
        <div style="font-size:0.75rem; font-weight:800; color:#0284C7; margin-bottom:6px;">
          🚕 Tarifario Oficial de Movilidad Local por Distrito (Lima y Callao - Anexo 09):
        </div>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px;">
          <div>
            <label style="display:block; font-size:0.69rem; font-weight:800; color:#0F172A; margin-bottom:3px;">DISTRITO DE LA DILIGENCIA:</label>
            <select id="caja-select-distrito-anexo09" onchange="aplicarTarifaAnexo09()" style="width:100%; padding:8px; border-radius:10px; border:1px solid #7DD3FC; font-weight:800; font-size:0.78rem; background:#FFFFFF;">
              ${window.CAJA_CATALOGOS.tarifarioAnexo09.map(d => `<option value="${d.item}">#${d.item} ${d.distrito} (Día: S/${d.dia} | Noche: S/${d.noche})</option>`).join("")}
            </select>
          </div>
          <div>
            <label style="display:block; font-size:0.69rem; font-weight:800; color:#0F172A; margin-bottom:3px;">HORARIO DEL TRASLADO:</label>
            <select id="caja-select-horario-mov" onchange="aplicarTarifaAnexo09()" style="width:100%; padding:8px; border-radius:10px; border:1px solid #7DD3FC; font-weight:800; font-size:0.78rem; background:#FFFFFF;">
              <option value="DIA">☀️ Horario Diurno (Antes de 7:00 pm)</option>
              <option value="NOCHE">🌙 Horario Nocturno (Desde 7:00 pm)</option>
            </select>
          </div>
        </div>
      </div>

      <!-- BLOQUE ESPECIAL 2: REQUISITOS PREVIOS EXPLICADOS DE FORMA SENCILLA -->
      <div id="bloque-requisito-pecosa" style="display:none; background:#FFFDF5; border:1.5px solid #FDE68A; border-radius:14px; padding:11px; margin-bottom:10px;">
        <label style="display:block; font-size:0.73rem; font-weight:800; color:#92400E; margin-bottom:4px;">
          📦 CONSTANCIA DE QUE NO HAY STOCK EN ALMACÉN (N° de PECOSA):
        </label>
        <p style="font-size:0.7rem; color:#78350F; margin-bottom:6px; font-weight:600;">
          Para comprar útiles o tóner por Caja Chica, Abastecimiento/Almacén debe sellar antes tu pedido indicando que no cuenta con stock disponible.
        </p>
        <input type="text" id="caja-input-pecosa" placeholder="Ej: Pedido / PECOSA N° 0045-2026 (Sin stock)" style="width:100%; padding:8px 10px; border-radius:10px; border:1.5px solid #F59E0B; font-weight:700; font-size:0.8rem; background:#FFFFFF;" />
      </div>

      <div id="bloque-requisito-vehiculo" style="display:none; background:#FFFDF5; border:1.5px solid #FDE68A; border-radius:14px; padding:11px; margin-bottom:10px;">
        <div style="font-size:0.73rem; font-weight:800; color:#92400E; margin-bottom:6px;">
          🚓 Datos del Vehículo Oficial (Anótalos también en la factura):
        </div>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px;">
          <input type="text" id="caja-input-placa" placeholder="Placa (Ej: EGW-451)" style="padding:8px 10px; border-radius:10px; border:1.5px solid #F59E0B; font-weight:700; font-size:0.8rem; background:#FFFFFF;" />
          <input type="text" id="caja-input-km" placeholder="Kilometraje (Ej: 42,150 km)" style="padding:8px 10px; border-radius:10px; border:1.5px solid #F59E0B; font-weight:700; font-size:0.8rem; background:#FFFFFF;" />
        </div>
      </div>

      <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-bottom:8px;">
        <div>
          <label style="display:block; font-size:0.71rem; font-weight:800; color:#334155; margin-bottom:3px;">SERIE Y N° DEL COMPROBANTE:</label>
          <input type="text" id="caja-serie-num" value="F001-000452" style="width:100%; padding:8px 10px; border-radius:12px; border:1.5px solid #CBD5E1; font-weight:700; font-size:0.8rem; background:#FFFFFF;" />
        </div>
        <div>
          <label style="display:block; font-size:0.71rem; font-weight:800; color:#334155; margin-bottom:3px;">RUC DEL PROVEEDOR O DNI:</label>
          <input type="text" id="caja-ruc-prov" value="20501234567" maxlength="11" style="width:100%; padding:8px 10px; border-radius:12px; border:1.5px solid #CBD5E1; font-weight:700; font-size:0.8rem; background:#FFFFFF;" />
        </div>
      </div>

      <div style="margin-bottom:8px;">
        <label style="display:block; font-size:0.71rem; font-weight:800; color:#334155; margin-bottom:3px;" id="lbl-razon-social-prov">
          NOMBRE DEL ESTABLECIMIENTO, PROVEEDOR O COMISIONADO:
        </label>
        <input type="text" id="caja-razon-social" value="Importaciones y Suministros S.A.C." style="width:100%; padding:8px 10px; border-radius:12px; border:1.5px solid #CBD5E1; font-weight:700; font-size:0.8rem; background:#FFFFFF;" />
      </div>

      <div style="margin-bottom:10px;">
        <label style="display:block; font-size:0.71rem; font-weight:800; color:#334155; margin-bottom:3px;">
          MOTIVO DE LA COMPRA O DILIGENCIA REALIZADA:
        </label>
        <input type="text" id="caja-concepto-detalle" value="Atención urgente para continuidad de las labores del despacho" style="width:100%; padding:8px 10px; border-radius:12px; border:1.5px solid #CBD5E1; font-weight:700; font-size:0.8rem; background:#FFFFFF;" />
      </div>

      <div id="panel-alertas-tributarias-caja" style="margin-bottom:12px;"></div>

      <button type="button" id="btn-guardar-gasto-caja" onclick="guardarGastoCajaChica()" style="width:100%; background:linear-gradient(135deg, #FBBF24 0%, #F59E0B 100%); color:#0F172A; border:1.5px solid #D97706; border-radius:14px; padding:13px; font-size:0.9rem; font-weight:800; cursor:pointer; box-shadow:0 4px 12px rgba(245,158,11,0.25);">
        ✓ Guardar mi Gasto de Despacho
      </button>
    `;

    renderizarIconosCategoriasCaja();
    poblarSubrubrosCategoriaActiva();
  }
}

function renderizarIconosCategoriasCaja() {
  const grid = document.getElementById("grid-iconos-categorias-caja");
  if (!grid) return;

  grid.innerHTML = window.CAJA_CATALOGOS.categoriasGasto.map(cat => {
    const activo = cat.id === window.CAJA_STATE.categoriaActiva ? "active" : "";
    return `
      <div class="cat-circle-item ${activo}" onclick="seleccionarCategoriaCaja('${cat.id}')">
        <div class="cat-circle-icon" style="background:${cat.color}; color:#FFF;">${cat.icono}</div>
        <span class="cat-circle-label">${cat.id}</span>
      </div>
    `;
  }).join("");
}

window.seleccionarCategoriaCaja = function(catId) {
  window.CAJA_STATE.categoriaActiva = catId;
  const lbl = document.getElementById("lbl-cat-activa-nombre");
  if (lbl) lbl.textContent = catId.toUpperCase();
  renderizarIconosCategoriasCaja();
  poblarSubrubrosCategoriaActiva();
};

function poblarSubrubrosCategoriaActiva() {
  const sel = document.getElementById("caja-select-subrubro");
  if (!sel) return;
  const catObj = window.CAJA_CATALOGOS.categoriasGasto.find(c => c.id === window.CAJA_STATE.categoriaActiva) || window.CAJA_CATALOGOS.categoriasGasto[0];
  sel.innerHTML = catObj.subrubros.map(s => `<option value="${s.codigo}">${s.nombre} (Partida: ${s.especifica})</option>`).join("");
  window.CAJA_STATE.subrubroActivo = catObj.subrubros[0].codigo;
  alCambiarSubrubroModalCaja();
}

window.alCambiarSubrubroModalCaja = function() {
  const cod = document.getElementById("caja-select-subrubro")?.value;
  window.CAJA_STATE.subrubroActivo = cod;

  const sub = obtenerObjetoSubrubroActual();
  const bTarifario = document.getElementById("bloque-tarifario-anexo09");
  const bPecosa = document.getElementById("bloque-requisito-pecosa");
  const bVehiculo = document.getElementById("bloque-requisito-vehiculo");

  if (bTarifario) bTarifario.style.display = sub?.esTarifario ? "block" : "none";
  if (bPecosa) bPecosa.style.display = sub?.exigePecosa ? "block" : "none";
  if (bVehiculo) bVehiculo.style.display = sub?.exigePlaca ? "block" : "none";

  if (sub?.esTarifario) {
    seleccionarChipComprobante("DJ Movilidad Local (Anexo 08)");
    aplicarTarifaAnexo09();
  } else if (sub?.codigo === "CC-ALI-01") {
    document.getElementById("input-calc-monto").value = "24.00";
  }

  recalcularModalCajaEnVivo();
};

function obtenerObjetoSubrubroActual() {
  for (const cat of window.CAJA_CATALOGOS.categoriasGasto) {
    const enc = cat.subrubros.find(s => s.codigo === window.CAJA_STATE.subrubroActivo);
    if (enc) return { ...enc, tipoBienServicio: cat.tipoBienServicio };
  }
  return { ...window.CAJA_CATALOGOS.categoriasGasto[0].subrubros[0], tipoBienServicio: "BIEN" };
}

window.aplicarTarifaAnexo09 = function() {
  const itemNum = Number(document.getElementById("caja-select-distrito-anexo09")?.value || 7);
  const horario = document.getElementById("caja-select-horario-mov")?.value || "DIA";
  window.CAJA_STATE.horarioMovilidad = horario;

  const destObj = window.CAJA_CATALOGOS.tarifarioAnexo09.find(d => d.item === itemNum) || window.CAJA_CATALOGOS.tarifarioAnexo09[6];
  const montoTarifa = horario === "NOCHE" ? destObj.noche : destObj.dia;

  const inputMonto = document.getElementById("input-calc-monto");
  if (inputMonto) inputMonto.value = montoTarifa.toFixed(2);

  const misGastos = window.obtenerGastosCajaVisiblesUsuario();
  document.getElementById("caja-serie-num").value = `DJ-MOV-00${misGastos.length + 1}`;
  document.getElementById("caja-ruc-prov").value = window.ANC_STATE?.perfilActivo?.usuario_dni || "45000001";
  document.getElementById("caja-razon-social").value = window.ANC_STATE?.perfilActivo?.usuario_nombre || "Comisionado ANC-MP";
  document.getElementById("caja-concepto-detalle").value = `Diligencia oficial hacia el distrito de ${destObj.distrito}`;

  recalcularModalCajaEnVivo();
};

window.seleccionarChipComprobante = function(tipo) {
  window.CAJA_STATE.tipoComprobante = tipo;
  document.querySelectorAll("#chips-comprobante .chip-option").forEach(btn => {
    const txt = btn.textContent;
    const coincide = (tipo.includes("Factura") && txt === "Factura") ||
                     (tipo.includes("Boleta") && txt === "Boleta") ||
                     (tipo.includes("Ticket") && txt === "Ticket") ||
                     (tipo.includes("DJ") && txt.includes("Movilidad")) ||
                     (tipo.includes("Honorarios") && txt.includes("Honorarios")) ||
                     (tipo.includes("Vale") && txt.includes("Vale"));
    btn.classList.toggle("active", coincide);
  });

  const lblProv = document.getElementById("lbl-razon-social-prov");
  if (lblProv) {
    lblProv.textContent = tipo.includes("Honorarios")
      ? "APELLIDOS Y NOMBRES DEL PRESTADOR DEL SERVICIO:"
      : "NOMBRE DEL ESTABLECIMIENTO, PROVEEDOR O COMISIONADO:";
  }
  recalcularModalCajaEnVivo();
};

window.cambiarCantidadModalCaja = function(delta) {
  window.CAJA_STATE.cantidad = Math.max(1, window.CAJA_STATE.cantidad + delta);
  const lbl = document.getElementById("lbl-cantidad-modal");
  if (lbl) lbl.textContent = window.CAJA_STATE.cantidad;
  recalcularModalCajaEnVivo();
};

window.recalcularModalCajaEnVivo = function() {
  const cfg = window.ANC_STATE ? window.ANC_STATE.config : { valor_uit: 5350, porcentaje_tope_caja_chica: 20 };
  const p = window.ANC_STATE ? window.ANC_STATE.perfilActivo : { percibe_gastos_operativos: false };
  const sub = obtenerObjetoSubrubroActual();

  const precioUnit = Number(document.getElementById("input-calc-monto")?.value || 0);
  const cant = window.CAJA_STATE.cantidad;
  const totalSoles = Number((precioUnit * cant).toFixed(2));

  let topePermitido = Number((cfg.valor_uit * (cfg.porcentaje_tope_caja_chica / 100)).toFixed(2));
  let etiquetaTope = "LÍMITE 20% UIT (S/)";

  if (sub?.topeFijo) {
    topePermitido = sub.codigo === "CC-ALI-01" ? (24.00 * cant) : sub.topeFijo;
    etiquetaTope = sub.codigo === "CC-ALI-01" ? `LÍMITE S/24 x ${cant}` : "LÍMITE MENSUAL (S/)";
  } else if (sub?.pctUit && sub.pctUit !== 20.0) {
    topePermitido = Number((cfg.valor_uit * (sub.pctUit / 100)).toFixed(2));
    etiquetaTope = `LÍMITE ${sub.pctUit}% UIT (S/)`;
  }

  const lblTitTope = document.getElementById("lbl-titulo-tope-modal");
  const lblValTope = document.getElementById("lbl-tope-modal");
  const lblTotCalc = document.getElementById("lbl-total-calculado-modal");

  if (lblTitTope) lblTitTope.textContent = etiquetaTope;
  if (lblValTope) lblValTope.textContent = topePermitido.toLocaleString("es-PE", { minimumFractionDigits: 2 });
  if (lblTotCalc) lblTotCalc.textContent = window.fmtSoles(totalSoles);

  const panelAlertas = document.getElementById("panel-alertas-tributarias-caja");
  const btnGuardar = document.getElementById("btn-guardar-gasto-caja");
  if (!panelAlertas || !btnGuardar) return;

  const mensajes = [];
  let bloqueado = false;

  if (p.percibe_gastos_operativos && sub?.bloqGastosOp) {
    bloqueado = true;
    mensajes.push(`🚫 <strong>Aviso para Magistrados con Gastos Operativos:</strong> Quienes perciben asignación mensual por Gastos Operativos no pueden solicitar refrigerio por sobretiempo ni movilidad local de Caja Chica <small>(R.F.N. N° 190-2022-MP-FN)</small>.`);
  }

  if (totalSoles > topePermitido) {
    bloqueado = true;
    mensajes.push(`🚫 <strong>Supera el monto máximo permitido (${window.fmtSoles(topePermitido)}):</strong> Por norma de Caja Chica, un comprobante en este rubro no puede exceder dicho límite.`);
  }

  const tipoComp = window.CAJA_STATE.tipoComprobante;
  let montoRetIgv = 0, montoRet4ta = 0, montoDetrac = 0;

  if (tipoComp.includes("Factura") && totalSoles > 700.00) {
    montoRetIgv = Number((totalSoles * 0.03).toFixed(2));
    mensajes.push(`ℹ️ <strong>Nota para Administración (Retención IGV 3%):</strong> Al ser una factura mayor a S/ 700.00, Tesorería aplicará la retención de <strong>${window.fmtSoles(montoRetIgv)}</strong>.`);
  }

  if (tipoComp.includes("Factura") && totalSoles > 700.00 && sub?.detrac) {
    montoDetrac = Number((totalSoles * (sub.detrac.tasa / 100)).toFixed(2));
    mensajes.push(`🏦 <strong>Nota para Administración (Detracción SUNAT ${sub.detrac.tasa}%):</strong> Aplica depósito de detracción en el Banco de la Nación por <strong>${window.fmtSoles(montoDetrac)}</strong> <small>(Cód. ${sub.detrac.cod})</small>.`);
  }

  if (tipoComp.includes("Honorarios") && totalSoles > 1500.00) {
    montoRet4ta = Number((totalSoles * 0.08).toFixed(2));
    mensajes.push(`ℹ️ <strong>Recibo por Honorarios mayor a S/ 1,500.00:</strong> Aplica retención del 8% de Impuesto a la Renta (<strong>${window.fmtSoles(montoRet4ta)}</strong>), salvo que el prestador adjunte su Constancia de Suspensión de 4ta Categoría.`);
  }

  if (totalSoles > 100.00 && !sub?.esTarifario) {
    mensajes.push(`📋 <strong>Formatos listos para firmar (> S/ 100.00):</strong> Al guardar este gasto podrás descargar en un toque su formato de Solicitud y Conformidad (Anexos 04/05 o 06/07).`);
  }

  const netoPagar = Math.max(0, Number((totalSoles - Math.max(montoRetIgv, montoDetrac) - montoRet4ta).toFixed(2)));

  panelAlertas.innerHTML = `
    <div style="background:${bloqueado ? '#FFF5F6' : '#FFFDF5'}; border:1.5px solid ${bloqueado ? '#FECDD3' : '#FDE68A'}; border-radius:14px; padding:10px 12px; font-size:0.76rem; color:#0F172A; line-height:1.4;">
      ${mensajes.map(m => `<div style="margin-bottom:5px;">${m}</div>`).join("")}
      <div style="margin-top:6px; padding-top:6px; border-top:1px dashed #CBD5E1; font-weight:800; color:#0F172A; display:flex; justify-content:space-between; align-items:center;">
        <span>MONTO LÍQUIDO A RECONOCER / PAGAR:</span>
        <span style="color:#059669; font-size:0.9rem;">${window.fmtSoles(netoPagar)}</span>
      </div>
    </div>
  `;

  btnGuardar.disabled = bloqueado;
  btnGuardar.style.opacity = bloqueado ? "0.45" : "1";
  btnGuardar.textContent = bloqueado ? "🚫 Supera el Límite Permitido" : `✓ Guardar mi Gasto (${window.fmtSoles(totalSoles)})`;
};

window.guardarGastoCajaChica = async function() {
  const cfg = window.ANC_STATE.config;
  const p = window.ANC_STATE.perfilActivo;
  const sub = obtenerObjetoSubrubroActual();

  const precioUnit = Number(document.getElementById("input-calc-monto").value || 0);
  const cant = window.CAJA_STATE.cantidad;
  const totalSoles = Number((precioUnit * cant).toFixed(2));

  if (totalSoles <= 0) {
    alert("⚠️ Por favor, ingresa un monto mayor a S/ 0.00.");
    return;
  }

  if (sub?.exigePecosa && !document.getElementById("caja-input-pecosa").value.trim()) {
    alert("⚠️ Requisito necesario: Para comprar útiles o tóner por Caja Chica, debes indicar el N° de pedido/PECOSA donde Almacén certifica que no cuenta con stock disponible.");
    return;
  }

  if (sub?.exigePlaca && (!document.getElementById("caja-input-placa").value.trim() || !document.getElementById("caja-input-km").value.trim())) {
    alert("⚠️ Requisito necesario: Para gastos de vehículos oficiales, por favor ingresa el N° de Placa y el Kilometraje.");
    return;
  }

  const tipoComp = window.CAJA_STATE.tipoComprobante;
  const aplicaRetIgv = tipoComp.includes("Factura") && totalSoles > 700.00 && !sub?.detrac;
  const montoRetIgv = aplicaRetIgv ? Number((totalSoles * 0.03).toFixed(2)) : 0;

  const aplicaDetrac = tipoComp.includes("Factura") && totalSoles > 700.00 && Boolean(sub?.detrac);
  const pctDetrac = aplicaDetrac ? sub.detrac.tasa : 0;
  const montoDetrac = aplicaDetrac ? Number((totalSoles * (pctDetrac / 100)).toFixed(2)) : 0;

  const aplicaRet4ta = tipoComp.includes("Honorarios") && totalSoles > 1500.00;
  const montoRet4ta = aplicaRet4ta ? Number((totalSoles * 0.08).toFixed(2)) : 0;

  const netoPagar = Number((totalSoles - montoRetIgv - montoDetrac - montoRet4ta).toFixed(2));

  const itemDist = Number(document.getElementById("caja-select-distrito-anexo09")?.value || 7);
  const destObj = window.CAJA_CATALOGOS.tarifarioAnexo09.find(d => d.item === itemDist);

  // Incluir nombre y DNI del usuario activo en usuario_registro para garantizar privacidad exacta en Supabase y local
  const firmaUsuarioConDni = `${p.usuario_nombre} (DNI: ${p.usuario_dni})`;

  const nuevoGasto = {
    anio_fiscal: cfg.anio_fiscal,
    mes_ejecucion: `Año ${cfg.anio_fiscal}`,
    unidad_organica_id: p.unidad_id,
    modalidad_fondo: tipoComp.includes("Vale") ? "VALE_PROVISIONAL" : "CAJA_CHICA",
    tipo_comprobante: tipoComp,
    serie_numero_comprobante: document.getElementById("caja-serie-num").value.trim() || "S/N",
    fecha_emision: new Date().toISOString().slice(0, 10),
    ruc_dni_proveedor: document.getElementById("caja-ruc-prov").value.trim() || "00000000",
    razon_social_proveedor: document.getElementById("caja-razon-social").value.trim() || "Proveedor / Establecimiento",
    concepto_detalle: `[${sub.codigo}] ${document.getElementById("caja-concepto-detalle").value.trim()}`,
    especifica_gasto: sub.especifica,
    categoria_presupuestal: p.es_adc ? "0086. Mejora de los Servicios del Sistema de Justicia Penal" : "9001. Acciones Centrales",
    moneda: "PEN",
    precio_unitario: precioUnit,
    cantidad: cant,
    monto_total_soles: totalSoles,
    aplica_retencion_igv_3pct: aplicaRetIgv,
    monto_retencion_igv: montoRetIgv,
    aplica_retencion_4ta_8pct: aplicaRet4ta,
    monto_retencion_4ta: montoRet4ta,
    aplica_detraccion: aplicaDetrac,
    porcentaje_detraccion: pctDetrac,
    monto_detraccion: montoDetrac,
    neto_pagar_proveedor: netoPagar,
    nro_pecosa_sin_stock: sub?.exigePecosa ? document.getElementById("caja-input-pecosa").value.trim() : null,
    placa_vehiculo: sub?.exigePlaca ? document.getElementById("caja-input-placa").value.trim() : null,
    kilometraje_vehiculo: sub?.exigePlaca ? document.getElementById("caja-input-km").value.trim() : null,
    distrito_movilidad_anexo09: sub?.esTarifario && destObj ? destObj.distrito : null,
    horario_movilidad: sub?.esTarifario ? window.CAJA_STATE.horarioMovilidad : null,
    usuario_registro: firmaUsuarioConDni,
    estado_auditoria: "APROBADO"
  };

  const res = await window.SupabaseANC.request("anc_gastos_caja_encargos", "POST", "", nuevoGasto);
  const idGenerado = (res.data && res.data.length > 0) ? res.data[0].id : Date.now();

  p.saldo_caja_chica = Math.max(0, Number((p.saldo_caja_chica - totalSoles).toFixed(2)));
  await window.SupabaseANC.request(
    "anc_unidades_organicas",
    "PATCH",
    `codigo=eq.${encodeURIComponent(p.codigo_dependencia)}`,
    { saldo_caja_chica_actual: p.saldo_caja_chica }
  );

  const regConMeta = {
    ...nuevoGasto,
    id: idGenerado,
    usuario_dni_registro: p.usuario_dni,
    codigo_dependencia: p.codigo_dependencia,
    nombre_dependencia: p.nombre_dependencia,
    categoria_icono: window.CAJA_STATE.categoriaActiva,
    codigo_rubro: sub.codigo,
    tipoBienServicio: sub.tipoBienServicio
  };

  window.CAJA_STATE.gastosRegistrados.unshift(regConMeta);
  const localGuardados = JSON.parse(localStorage.getItem("anc_gastos_caja_local_v1") || "[]");
  localGuardados.unshift(regConMeta);
  localStorage.setItem("anc_gastos_caja_local_v1", JSON.stringify(localGuardados));

  if (typeof window.actualizarCabeceraYMenu === "function") window.actualizarCabeceraYMenu();
  cerrarModalGastoRapido();
  renderizarListadoGastosCajaChica();
  navegarVista("caja-chica");
};

async function sincronizarGastosCajaSupabase() {
  const localGuardados = JSON.parse(localStorage.getItem("anc_gastos_caja_local_v1") || "[]");
  const res = await window.SupabaseANC.request("anc_gastos_caja_encargos", "GET", "order=id.desc&limit=120");
  if (res.data && res.data.length > 0) {
    window.CAJA_STATE.gastosRegistrados = res.data.map(row => {
      const matchLocal = localGuardados.find(l => Number(l.id) === Number(row.id) || (l.serie_numero_comprobante === row.serie_numero_comprobante && l.ruc_dni_proveedor === row.ruc_dni_proveedor));
      return {
        ...row,
        usuario_dni_registro: row.usuario_dni_registro || matchLocal?.usuario_dni_registro || ""
      };
    });
  } else {
    window.CAJA_STATE.gastosRegistrados = localGuardados;
  }
}

function renderizarListadoGastosCajaChica() {
  const tbody = document.getElementById("tabla-gastos-preview");
  const panelRes = document.getElementById("resumen-financiero-caja-activa");
  if (!tbody) return;

  const p = window.ANC_STATE ? window.ANC_STATE.perfilActivo : {
    unidad_id: 13,
    nombre_dependencia: "Unidad de Abastecimiento",
    usuario_nombre: "Usuario Operador ANC",
    usuario_dni: "45000001",
    presupuesto_caja_chica: 12000,
    saldo_caja_chica: 12000,
    rol_sistema: "OPERADOR"
  };

  // PRIVACIDAD ESTRICTA: Obtener solo los gastos del usuario activo (o todos si es ADMINISTRADOR)
  const misGastos = window.obtenerGastosCajaVisiblesUsuario();
  const totalEjecutado = misGastos.reduce((acc, item) => acc + Number(item.monto_total_soles || 0), 0);
  const esAdmin = typeof window.esAdministradorActivo === "function" && window.esAdministradorActivo();

  if (panelRes) {
    panelRes.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
        <div style="min-width:0; flex:1;">
          <div style="color:#0F172A; font-weight:800; font-size:0.84rem;">
            ${esAdmin ? '🛡️ CONSOLIDADO NACIONAL DE CAJA CHICA (VISTA ADMINISTRACIÓN)' : `🔒 MIS GASTOS DE DESPACHO (${p.usuario_nombre} • DNI: ${p.usuario_dni})`}
          </div>
          <div style="margin-top:3px; color:#475569; font-size:0.75rem; font-weight:600;">
            Despacho: <strong>${p.nombre_dependencia}</strong> • Comprobantes registrados: <strong>${misGastos.length}</strong> • Mi total: <strong>${window.fmtSoles(totalEjecutado)}</strong>
          </div>
        </div>
        <div style="text-align:right; flex-shrink:0; background:#F2FBF7; border:1px solid #A7F3D0; padding:6px 10px; border-radius:12px;">
          <span style="font-size:0.65rem; font-weight:800; color:#065F46;">DISPONIBLE EN SEDE:</span><br/>
          <strong style="font-size:1.02rem; font-weight:800; color:#059669;">${window.fmtSoles(p.saldo_caja_chica)}</strong>
        </div>
      </div>
    `;
  }

  const pillCorr = document.getElementById("pill-correlativo");
  if (pillCorr) pillCorr.textContent = `#0${misGastos.length + 1}`;

  if (misGastos.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="3" style="text-align:center; color:#64748B; padding:20px 12px; font-size:0.82rem; line-height:1.45;">
          Aún no tienes gastos urgentes ni movilidad local registrados con tu DNI (<strong>${p.usuario_dni}</strong>) en este equipo.<br/>
          Toca el botón circular <strong>(+)</strong> de arriba para registrar tu primer comprobante.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = misGastos.map((g, index) => {
    const esMov = g.tipo_comprobante?.includes("DJ") || Boolean(g.distrito_movilidad_anexo09);
    const esVale = g.modalidad_fondo === "VALE_PROVISIONAL" || g.tipo_comprobante?.includes("Vale");
    const esBien = (g.especifica_gasto || "").startsWith("2.3.1");

    return `
      <tr>
        <td>
          <span class="badge-semaforo badge-verde">✓ #${misGastos.length - index}</span>
          <div style="font-size:0.74rem; font-weight:700; color:#334155; margin-top:4px;">${g.fecha_emision || ''}</div>
          <small style="font-size:0.66rem; color:#64748B; font-weight:600;">Partida: ${g.especifica_gasto}</small>
        </td>
        <td>
          <strong style="color:#0F172A;">${g.razon_social_proveedor}</strong><br/>
          <small style="color:#64748B;">RUC/DNI: ${g.ruc_dni_proveedor}</small><br/>
          <small style="color:#0284C7; font-weight:800;">${g.tipo_comprobante} N° ${g.serie_numero_comprobante}</small><br/>
          <small style="color:#334155;">${g.concepto_detalle}</small>
          ${g.nro_pecosa_sin_stock ? `<br/><small style="color:#92400E; font-weight:700;">📦 Sin stock: ${g.nro_pecosa_sin_stock}</small>` : ""}
          ${g.placa_vehiculo ? `<br/><small style="color:#0284C7; font-weight:700;">🚓 Placa: ${g.placa_vehiculo} (${g.kilometraje_vehiculo})</small>` : ""}
          ${esAdmin && g.usuario_registro ? `<br/><small style="color:#065F46; font-weight:700;">👤 Reg.: ${g.usuario_registro}</small>` : ""}
        </td>
        <td>
          <div style="font-size:0.94rem; font-weight:800; color:#0F172A; margin-bottom:6px;">
            ${window.fmtSoles(g.monto_total_soles)}
          </div>
          <!-- Botones de Formato Individual Listos para Firmar por cada Comprobante -->
          <div style="display:flex; flex-direction:column; gap:5px;">
            ${esMov ? `
              <button type="button" onclick="imprimirFormatoIndividualGastoCaja(${index}, 'ANEXO_08')" style="background:#F0F8FF; color:#0284C7; border:1px solid #BAE6FD; border-radius:8px; padding:5px 7px; font-size:0.69rem; font-weight:800; cursor:pointer;">
                🖨️ DJ Movilidad (Anexo 08)
              </button>
            ` : ""}
            ${esVale ? `
              <button type="button" onclick="imprimirFormatoIndividualGastoCaja(${index}, 'ANEXO_01')" style="background:#FFFDF5; color:#92400E; border:1px solid #FDE68A; border-radius:8px; padding:5px 7px; font-size:0.69rem; font-weight:800; cursor:pointer;">
                🖨️ Vale Prov. (Anexo 01)
              </button>
            ` : ""}
            ${esBien ? `
              <button type="button" onclick="imprimirFormatoIndividualGastoCaja(${index}, 'ANEXO_04_05')" style="background:linear-gradient(135deg, #FBBF24 0%, #F59E0B 100%); color:#0F172A; border:1px solid #D97706; border-radius:8px; padding:5px 7px; font-size:0.69rem; font-weight:800; cursor:pointer;">
                🖨️ Solicitud/Recep. (04/05)
              </button>
            ` : `
              <button type="button" onclick="imprimirFormatoIndividualGastoCaja(${index}, 'ANEXO_06_07')" style="background:#F2FBF7; color:#065F46; border:1px solid #A7F3D0; border-radius:8px; padding:5px 7px; font-size:0.69rem; font-weight:800; cursor:pointer;">
                🖨️ Solicitud/Conf. (06/07)
              </button>
            `}
          </div>
        </td>
      </tr>
    `;
  }).join("");
}

// =========================================================================================
// GENERADORES EXACTOS DE LOS ANEXOS INDIVIDUALES Y GRUPALES DE CAJA CHICA (DIRECTIVA V.08)
// =========================================================================================

window.imprimirFormatoIndividualGastoCaja = function(idxEnLista, tipoAnexo) {
  const p = window.ANC_STATE.perfilActivo;
  const misGastos = window.obtenerGastosCajaVisiblesUsuario();
  const g = misGastos[idxEnLista];
  if (!g) return;

  const cab = window.MotorAnexosANC.cabeceraDirectivaHTML("OGFIN/DIR-01", "MANEJO DE LA CAJA CHICA DEL MINISTERIO PÚBLICO", "08");
  let html = "";

  if (tipoAnexo === "ANEXO_01") {
    // ANEXO 01 EXACTO: FORMATO VALE PROVISIONAL (Página 38 Directiva V.08)
    html = `
      <div class="hoja-oficial">
        ${cab}
        <div class="titulo-anexo-num">ANEXO 01</div>
        <div class="titulo-anexo-nombre">FORMATO VALE PROVISIONAL</div>
        <div style="border:2px solid #000; padding:20px; margin-top:12px;">
          <div style="display:flex; justify-content:space-between; font-size:12px; font-weight:bold; margin-bottom:16px;">
            <span>VALE PROVISIONAL N° ${g.serie_numero_comprobante}</span>
            <span>S/ ${Number(g.monto_total_soles).toFixed(2)}</span>
          </div>
          <p style="font-size:11.5px; line-height:1.7; margin-bottom:16px;">
            Recibí del encargado del manejo de la Caja Chica de <strong>${p.nombre_dependencia}</strong> la cantidad de <strong>${window.fmtSoles(g.monto_total_soles)}</strong>.<br/>
            <strong>Por concepto de:</strong> ${g.concepto_detalle}
          </p>
          <table class="tabla-directiva" style="margin-bottom:18px;">
            <tr>
              <td><strong>Nombre del Usuario:</strong> ${g.razon_social_proveedor || p.usuario_nombre}</td>
              <td><strong>Cargo / Unidad:</strong> ${p.nombre_dependencia}</td>
              <td><strong>D.N.I.:</strong> ${g.ruc_dni_proveedor || p.usuario_dni}</td>
            </tr>
          </table>
          <div style="text-align:right; margin-bottom:35px;">Fecha: ${g.fecha_emision}</div>
          <div class="bloque-firmas">
            <div class="linea-firma"><strong>USUARIO</strong><br/>FIRMA</div>
            <div class="linea-firma"><strong>OTES / OGFIN / ADMINISTRACIÓN</strong><br/>(o el que haga sus veces) Autorizado</div>
            <div class="linea-firma"><strong>ENCARGADO ÚNICO</strong><br/>FIRMA</div>
          </div>
          <div class="notas-pie" style="margin-top:26px;">
            <strong>Nota (Anexo 01 Directiva V.08):</strong> Los gastos efectuados deben justificarse documentadamente dentro de las 48 horas, computados en días hábiles, de la entrega correspondiente. Artículo 9, numeral 9.1 de la Directiva N° 003-2024-EF/52.06, aprobada con Resolución Directoral N° 008-2024-EF/52.01. En caso de incumplimiento se me establezca responsabilidad económica y se descuente de mis remuneraciones.
          </div>
        </div>
      </div>
    `;
  } else if (tipoAnexo === "ANEXO_08") {
    // ANEXO 08 EXACTO: FORMATO DE DECLARACIÓN JURADA DE MOVILIDAD LOCAL (Página 45 Directiva V.08)
    html = construirHTMLAnexo08Movilidad([g]);
  } else if (tipoAnexo === "ANEXO_04_05") {
    // ANEXOS 04 Y 05 EXACTOS: SOLICITUD DE BIENES Y RECEPCIÓN SATISFACTORIA DE BIENES (Páginas 41 y 42 Directiva V.08)
    html = `
      <div class="hoja-oficial">
        ${cab}
        <div class="titulo-anexo-num">ANEXO 04</div>
        <div class="titulo-anexo-nombre">FORMATO DE SOLICITUD DE BIENES</div>
        <div style="border:1.5px solid #000; padding:14px; margin-bottom:22px;">
          <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
            <span><strong>Sr. Administrador / Oficina de Administración y Finanzas UE 012: ANC-MP</strong></span>
            <span><strong>Fecha:</strong> ${g.fecha_emision}</span>
          </div>
          <div style="margin-bottom:10px;"><strong>Área Usuaria Solicitante:</strong> [${p.codigo_dependencia}] ${p.nombre_dependencia}</div>
          <p style="margin-bottom:8px;">Por medio de la presente se solicita atender con los siguiente(s) bienes:</p>
          <table class="tabla-directiva">
            <thead>
              <tr>
                <th style="width:16%; text-align:center;">CANTIDAD</th>
                <th style="width:64%;">DESCRIPCIÓN DEL BIEN</th>
                <th style="width:20%; text-align:right;">IMPORTE (S/)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="text-align:center;">${g.cantidad || 1}</td>
                <td>${g.concepto_detalle} (${g.tipo_comprobante} ${g.serie_numero_comprobante} - ${g.razon_social_proveedor})</td>
                <td style="text-align:right;">${window.fmtSoles(g.monto_total_soles)}</td>
              </tr>
            </tbody>
          </table>
          <div style="margin-top:8px;"><strong>MOTIVO DE LA SOLICITUD:</strong> Atención urgente y no programable para operatividad funcional (${g.nro_pecosa_sin_stock || 'Conforme a Directiva V.08'}).</div>
          <div class="bloque-firmas" style="margin-top:42px;">
            <div class="linea-firma" style="width:42%;"><strong>AUTORIZADO: ADMINISTRADOR / OAF</strong><br/>(FIRMA Y SELLO)</div>
            <div class="linea-firma" style="width:42%;"><strong>Firma del Responsable del Área Usuaria</strong><br/>${p.usuario_nombre} (DNI: ${p.usuario_dni})</div>
          </div>
        </div>

        <div class="titulo-anexo-num">ANEXO 05</div>
        <div class="titulo-anexo-nombre">FORMATO DE RECEPCIÓN SATISFACTORIA DE BIENES</div>
        <div style="border:1.5px solid #000; padding:14px;">
          <div style="text-align:right; margin-bottom:8px;"><strong>Fecha:</strong> ${g.fecha_emision}</div>
          <p style="margin-bottom:8px;">Por medio de la presente se da <strong>CONFORMIDAD</strong> por la recepción satisfactoria de lo(s) siguientes bienes:</p>
          <table class="tabla-directiva">
            <thead>
              <tr>
                <th style="width:16%; text-align:center;">CANTIDAD</th>
                <th style="width:84%;">DESCRIPCIÓN</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="text-align:center;">${g.cantidad || 1}</td>
                <td>${g.concepto_detalle} — Comprobante: ${g.tipo_comprobante} ${g.serie_numero_comprobante} (${window.fmtSoles(g.monto_total_soles)})</td>
              </tr>
            </tbody>
          </table>
          <div class="bloque-firmas" style="margin-top:42px;">
            <div class="linea-firma" style="width:50%;"><strong>Firma y Sello del Responsable del Área Usuaria</strong><br/>${p.usuario_nombre} — ${p.nombre_dependencia}</div>
          </div>
        </div>
      </div>
    `;
  } else {
    // ANEXOS 06 Y 07 EXACTOS: SOLICITUD DE SERVICIOS Y CONFORMIDAD DE SERVICIOS (Páginas 43 y 44 Directiva V.08)
    html = `
      <div class="hoja-oficial">
        ${cab}
        <div class="titulo-anexo-num">ANEXO 06</div>
        <div class="titulo-anexo-nombre">FORMATO DE SOLICITUD DE SERVICIOS</div>
        <div style="border:1.5px solid #000; padding:14px; margin-bottom:22px;">
          <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
            <span><strong>Sr. Administrador / Oficina de Administración y Finanzas UE 012: ANC-MP</strong></span>
            <span><strong>Fecha:</strong> ${g.fecha_emision}</span>
          </div>
          <div style="margin-bottom:10px;"><strong>Área Usuaria Solicitante:</strong> [${p.codigo_dependencia}] ${p.nombre_dependencia}</div>
          <p style="margin-bottom:8px;">Por medio de la presente solicitamos se sirvan brindarnos el servicio de:</p>
          <div style="border:1px solid #000; padding:10px; margin-bottom:10px; min-height:48px;">
            ${g.concepto_detalle} — Proveedor/Locador: <strong>${g.razon_social_proveedor}</strong> (RUC/DNI: ${g.ruc_dni_proveedor}) por el importe de <strong>${window.fmtSoles(g.monto_total_soles)}</strong>.
          </div>
          <div><strong>MOTIVO DE LA SOLICITUD:</strong> Requerimiento urgente de inmediata atención conforme a la Directiva de Caja Chica V.08.</div>
          <div class="bloque-firmas" style="margin-top:42px;">
            <div class="linea-firma" style="width:42%;"><strong>AUTORIZADO POR: ADMINISTRADOR / OAF</strong><br/>(FIRMA Y SELLO)</div>
            <div class="linea-firma" style="width:42%;"><strong>Firma y Sello del Responsable del Área Usuaria</strong><br/>${p.usuario_nombre} (DNI: ${p.usuario_dni})</div>
          </div>
        </div>

        <div class="titulo-anexo-num">ANEXO 07</div>
        <div class="titulo-anexo-nombre">FORMATO DE CONFORMIDAD DE SERVICIOS</div>
        <div style="border:1.5px solid #000; padding:14px;">
          <div style="text-align:right; margin-bottom:8px;"><strong>Fecha:</strong> ${g.fecha_emision}</div>
          <p style="margin-bottom:8px;">Por medio del presente, se otorga la <strong>CONFORMIDAD DEL SERVICIO</strong>, por los trabajos recibidos a satisfacción, que a continuación se detalla:</p>
          <div style="border:1px solid #000; padding:10px; min-height:52px;">
            Servicio ejecutado a conformidad: ${g.concepto_detalle} — Sustentado con ${g.tipo_comprobante} N° ${g.serie_numero_comprobante} por ${window.fmtSoles(g.monto_total_soles)}.
          </div>
          <div class="bloque-firmas" style="margin-top:42px;">
            <div class="linea-firma" style="width:50%;"><strong>Firma y Sello del Responsable del Área Usuaria</strong><br/>${p.usuario_nombre} — ${p.nombre_dependencia}</div>
          </div>
        </div>
      </div>
    `;
  }

  window.MotorAnexosANC.imprimirDocumentoOficial(`${tipoAnexo}_${g.serie_numero_comprobante}`, html, "portrait");
};

function construirHTMLAnexo08Movilidad(listaMovs) {
  const p = window.ANC_STATE.perfilActivo;
  const cab = window.MotorAnexosANC.cabeceraDirectivaHTML("OGFIN/DIR-01", "MANEJO DE LA CAJA CHICA DEL MINISTERIO PÚBLICO", "08");
  const totalMov = listaMovs.reduce((a, b) => a + Number(b.monto_total_soles || 0), 0);

  return `
    <div class="hoja-oficial">
      ${cab}
      <div class="titulo-anexo-num">ANEXO 08</div>
      <div class="titulo-anexo-nombre">FORMATO DE DECLARACIÓN JURADA DE MOVILIDAD LOCAL (Caja Chica)</div>

      <p style="font-size:11px; line-height:1.5; margin-bottom:10px;">
        Recibí de la Unidad Ejecutora 012: Autoridad Nacional de Control del Ministerio Público la cantidad de <strong>${window.fmtSoles(totalMov)}</strong> para efectuar la comisión de servicio / diligencia administrativa autorizada por el Jefe de la Unidad Orgánica y/o Administrador según detalle:
      </p>

      <table class="tabla-directiva">
        <thead>
          <tr>
            <th rowspan="2" style="width:10%; text-align:center;">FECHA</th>
            <th colspan="3" style="text-align:center;">DE (ORIGEN)</th>
            <th rowspan="2" style="width:6%; text-align:center;">D / N (*)</th>
            <th colspan="3" style="text-align:center;">A (DESTINO)</th>
            <th rowspan="2" style="width:12%; text-align:right;">IMPORTE (S/)</th>
          </tr>
          <tr>
            <th style="width:12%;">ORIGEN</th>
            <th style="width:14%;">DIRECCIÓN / MOTIVO</th>
            <th style="width:12%;">DISTRITO</th>
            <th style="width:12%;">DESTINO</th>
            <th style="width:12%;">DIRECCIÓN</th>
            <th style="width:10%;">DISTRITO (ANEXO 09)</th>
          </tr>
        </thead>
        <tbody>
          ${listaMovs.map(m => `
            <tr>
              <td style="text-align:center;">${m.fecha_emision}</td>
              <td>Sede ANC-MP</td>
              <td>${m.concepto_detalle}</td>
              <td>${p.sede_ubicacion}</td>
              <td style="text-align:center; font-weight:bold;">${m.horario_movilidad === 'NOCHE' ? 'N' : 'D'}</td>
              <td>Diligencia Oficial</td>
              <td>Jurisdicción Destino</td>
              <td>${m.distrito_movilidad_anexo09 || 'Cercado de Lima'}</td>
              <td style="text-align:right; font-weight:bold;">${Number(m.monto_total_soles).toFixed(2)}</td>
            </tr>
          `).join("")}
          <tr class="fila-total-general">
            <td colspan="8" style="text-align:right;">TOTAL S/</td>
            <td style="text-align:right;">${window.fmtSoles(totalMov)}</td>
          </tr>
        </tbody>
      </table>

      <div style="margin-top:14px; font-size:10.5px;">
        <strong>Datos del Servidor Comisionado:</strong> Nombre: <strong>${p.usuario_nombre}</strong> • Cargo / Dependencia: <strong>${p.nombre_dependencia}</strong> • DNI N°: <strong>${p.usuario_dni}</strong>
      </div>

      <div class="bloque-firmas" style="margin-top:55px;">
        <div class="linea-firma"><strong>Firma del Servidor Comisionado</strong><br/>DNI N° ${p.usuario_dni}</div>
        <div class="linea-firma"><strong>Responsable del Área Usuaria / Jefe Inmediato Superior</strong><br/>${p.nombre_dependencia}</div>
        <div class="linea-firma"><strong>V°B° Administración / Encargado Único Caja Chica</strong><br/>UE 012: ANC-MP</div>
      </div>

      <div class="notas-pie" style="margin-top:22px;">
        <strong>Nota (Anexo 08 Directiva V.08):</strong> (*) D = Día, N = Noche. Se considera horario nocturno a partir de las 19:00 horas. Cada línea corresponde a un trayecto de la Comisión de Servicios conforme al Tarifario Único (Anexo 09).
      </div>
    </div>
  `;
}

window.imprimirConsolidadoDJMovilidadAnexo08PDF = function() {
  const p = window.ANC_STATE.perfilActivo;
  const misGastos = window.obtenerGastosCajaVisiblesUsuario();
  const movs = misGastos.filter(g => g.tipo_comprobante?.includes("DJ") || Boolean(g.distrito_movilidad_anexo09));
  const lista = movs.length > 0 ? movs : misGastos.slice(0, 1);
  if (lista.length === 0) {
    alert("⚠️ Registra primero al menos una movilidad o gasto para descargar la Declaración Jurada de Movilidad (Anexo 08).");
    return;
  }
  const html = construirHTMLAnexo08Movilidad(lista);
  window.MotorAnexosANC.imprimirDocumentoOficial(`Anexo08_DJ_Movilidad_${p.usuario_dni}`, html, "landscape");
};

// ANEXO 13 EXACTO: FORMATO DE RENDICIÓN DE LA CAJA CHICA (Página 50 Directiva V.08)
window.imprimirRendicionAnexo13CajaPDF = function() {
  const p = window.ANC_STATE.perfilActivo;
  const misGastos = window.obtenerGastosCajaVisiblesUsuario();
  const totalRend = misGastos.reduce((a, b) => a + Number(b.monto_total_soles || 0), 0);
  const saldoActual = Number(p.saldo_caja_chica || 0);
  const saldoAnterior = Number((saldoActual + totalRend).toFixed(2));

  const cab = window.MotorAnexosANC.cabeceraDirectivaHTML("OGFIN/DIR-01", "MANEJO DE LA CAJA CHICA DEL MINISTERIO PÚBLICO", "08");

  const html = `
    <div class="hoja-oficial">
      ${cab}
      <div class="titulo-anexo-num">ANEXO 13</div>
      <div class="titulo-anexo-nombre">FORMATO DE RENDICIÓN DE LA CAJA CHICA (${p.nombre_dependencia.toUpperCase()})</div>

      <table class="tabla-directiva">
        <thead>
          <tr>
            <th rowspan="2" style="width:4%;">N°</th>
            <th colspan="3" style="text-align:center;">DOCUMENTO</th>
            <th rowspan="2" style="width:18%;">PROVEEDOR / LOCADOR</th>
            <th rowspan="2" style="width:9%;">RUC / DNI</th>
            <th rowspan="2" style="width:22%;">DETALLE DEL GASTO</th>
            <th rowspan="2" style="width:8%;">Específica de Gasto</th>
            <th style="width:8%; text-align:center;">Acciones Centrales (9001)</th>
            <th style="width:8%; text-align:center;">Justicia Penal / ADC (0086)</th>
            <th rowspan="2" style="width:9%; text-align:right;">Total por específicas (S/)</th>
          </tr>
          <tr>
            <th style="width:7%;">Fecha</th>
            <th style="width:7%;">Clase</th>
            <th style="width:8%;">N°</th>
            <th style="text-align:center;">Gestión Adm.</th>
            <th style="text-align:center;">Control ADC</th>
          </tr>
        </thead>
        <tbody>
          ${misGastos.map((g, i) => `
            <tr>
              <td style="text-align:center;">${i + 1}</td>
              <td style="text-align:center;">${g.fecha_emision}</td>
              <td style="text-align:center;">${(g.tipo_comprobante || "").slice(0, 10)}</td>
              <td style="text-align:center;">${g.serie_numero_comprobante}</td>
              <td>${g.razon_social_proveedor}</td>
              <td style="text-align:center;">${g.ruc_dni_proveedor}</td>
              <td>${g.concepto_detalle}</td>
              <td style="text-align:center; font-weight:bold;">${g.especifica_gasto}</td>
              <td style="text-align:right;">${!p.es_adc ? Number(g.monto_total_soles).toFixed(2) : "0.00"}</td>
              <td style="text-align:right;">${p.es_adc ? Number(g.monto_total_soles).toFixed(2) : "0.00"}</td>
              <td style="text-align:right; font-weight:bold;">${Number(g.monto_total_soles).toFixed(2)}</td>
            </tr>
          `).join("")}
          <tr class="fila-total-general">
            <td colspan="8" style="text-align:right;">Total General S/</td>
            <td style="text-align:right;">${!p.es_adc ? totalRend.toFixed(2) : "0.00"}</td>
            <td style="text-align:right;">${p.es_adc ? totalRend.toFixed(2) : "0.00"}</td>
            <td style="text-align:right;">${window.fmtSoles(totalRend)}</td>
          </tr>
        </tbody>
      </table>

      <div style="display:flex; justify-content:space-between; align-items:flex-end; margin-top:18px;">
        <table class="tabla-directiva" style="width:320px; margin-bottom:0;">
          <thead><tr><th colspan="2">MOVIMIENTO DEL DINERO EN EFECTIVO</th></tr></thead>
          <tbody>
            <tr><td>Saldo Anterior / Apertura S/</td><td style="text-align:right;">${window.fmtSoles(saldoAnterior)}</td></tr>
            <tr><td>Importe de la presente Rendición S/</td><td style="text-align:right;">- ${window.fmtSoles(totalRend)}</td></tr>
            <tr class="fila-total-general"><td>SALDO ACTUAL EN EFECTIVO S/</td><td style="text-align:right;">${window.fmtSoles(saldoActual)}</td></tr>
          </tbody>
        </table>

        <div class="bloque-firmas" style="width:60%; margin-top:0;">
          <div class="linea-firma" style="width:45%;"><strong>Oficina de Tesorería / Administrador / Responsable Unidad</strong><br/>${p.nombre_dependencia}</div>
          <div class="linea-firma" style="width:45%;"><strong>Encargado / Servidor Responsable</strong><br/>${p.usuario_nombre} (DNI: ${p.usuario_dni})</div>
        </div>
      </div>
    </div>
  `;

  window.MotorAnexosANC.imprimirDocumentoOficial(`Anexo13_Rendicion_Caja_${p.codigo_dependencia}`, html, "landscape");
};

// ANEXO 17 EXACTO: FORMATO DE LIBRO CAJA (Página 54 Directiva V.08)
window.imprimirLibroCajaAnexo17PDF = function() {
  const p = window.ANC_STATE.perfilActivo;
  const misGastos = [...window.obtenerGastosCajaVisiblesUsuario()].reverse();

  const totalEgresos = misGastos.reduce((a, b) => a + Number(b.monto_total_soles || 0), 0);
  const montoApertura = Number((Number(p.saldo_caja_chica || 0) + totalEgresos).toFixed(2));
  let saldoAcumulado = montoApertura;

  const cab = window.MotorAnexosANC.cabeceraDirectivaHTML("OGFIN/DIR-01", "MANEJO DE LA CAJA CHICA DEL MINISTERIO PÚBLICO", "08");

  const html = `
    <div class="hoja-oficial">
      ${cab}
      <div class="titulo-anexo-num">ANEXO 17</div>
      <div class="titulo-anexo-nombre">FORMATO DE LIBRO CAJA (${p.nombre_dependencia.toUpperCase()})</div>

      <table class="tabla-directiva">
        <thead>
          <tr>
            <th colspan="3" style="text-align:center;">INGRESOS (b)</th>
            <th colspan="3" style="text-align:center;">EGRESOS (c)</th>
            <th rowspan="2" style="width:14%; text-align:right;">SALDO EN EFECTIVO (d)<br/>S/</th>
          </tr>
          <tr>
            <th style="width:10%;">FECHA (a)</th>
            <th style="width:22%;">CONCEPTO</th>
            <th style="width:11%; text-align:right;">IMPORTE S/</th>
            <th style="width:10%;">FECHA</th>
            <th style="width:22%;">CONCEPTO / COMPROBANTE</th>
            <th style="width:11%; text-align:right;">IMPORTE S/</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="text-align:center;">02/01/${window.ANC_STATE.config.anio_fiscal}</td>
            <td><strong>Apertura / Reposición de la Caja Chica</strong></td>
            <td style="text-align:right; font-weight:bold;">${montoApertura.toFixed(2)}</td>
            <td style="text-align:center;">-</td>
            <td>Saldo inicial habilitado</td>
            <td style="text-align:right;">0.00</td>
            <td style="text-align:right; font-weight:bold;">${montoApertura.toFixed(2)}</td>
          </tr>
          ${misGastos.map(g => {
            saldoAcumulado = Number((saldoAcumulado - Number(g.monto_total_soles || 0)).toFixed(2));
            return `
              <tr>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td style="text-align:center;">${g.fecha_emision}</td>
                <td>Por ${g.concepto_detalle} según ${g.tipo_comprobante} N° ${g.serie_numero_comprobante}</td>
                <td style="text-align:right;">${Number(g.monto_total_soles).toFixed(2)}</td>
                <td style="text-align:right; font-weight:bold;">${saldoAcumulado.toFixed(2)}</td>
              </tr>
            `;
          }).join("")}
          <tr class="fila-total-general">
            <td colspan="2" style="text-align:right;">TOTAL INGRESOS S/</td>
            <td style="text-align:right;">${montoApertura.toFixed(2)}</td>
            <td colspan="2" style="text-align:right;">TOTAL EGRESOS S/</td>
            <td style="text-align:right;">${totalEgresos.toFixed(2)}</td>
            <td style="text-align:right;">${window.fmtSoles(saldoAcumulado)}</td>
          </tr>
        </tbody>
      </table>

      <div class="bloque-firmas">
        <div class="linea-firma" style="width:42%;"><strong>Oficina de Tesorería / Administrador</strong><br/>${p.nombre_dependencia}</div>
        <div class="linea-firma" style="width:42%;"><strong>Encargado / Servidor Responsable</strong><br/>${p.usuario_nombre} (DNI: ${p.usuario_dni})</div>
      </div>
    </div>
  `;

  window.MotorAnexosANC.imprimirDocumentoOficial(`Anexo17_Libro_Caja_${p.codigo_dependencia}`, html, "landscape");
};

window.exportarRendicionCajaDependenciaExcel = function() {
  const p = window.ANC_STATE.perfilActivo;
  const misGastos = window.obtenerGastosCajaVisiblesUsuario();
  const cab = ["NRO", "DEPENDENCIA", "USUARIO_REGISTRO", "FECHA", "TIPO_COMPROBANTE", "SERIE_NUMERO", "RUC_DNI", "PROVEEDOR_O_LOCADOR", "ESPECIFICA", "DETALLE_GASTO", "IMPORTE_TOTAL_SOLES", "RETENCION_IGV", "DETRACCION", "RETENCION_4TA", "NETO_PAGADO"];
  const filas = misGastos.map((g, i) => [
    i + 1,
    g.nombre_dependencia || p.nombre_dependencia,
    g.usuario_registro || `${p.usuario_nombre} (${p.usuario_dni})`,
    g.fecha_emision,
    g.tipo_comprobante,
    g.serie_numero_comprobante,
    g.ruc_dni_proveedor,
    g.razon_social_proveedor,
    g.especifica_gasto,
    g.concepto_detalle,
    Number(g.monto_total_soles || 0).toFixed(2),
    Number(g.monto_retencion_igv || 0).toFixed(2),
    Number(g.monto_detraccion || 0).toFixed(2),
    Number(g.monto_retencion_4ta || 0).toFixed(2),
    Number(g.neto_pagar_proveedor || 0).toFixed(2)
  ]);
  window.MotorAnexosANC.exportarExcelCSV(`Rendicion_Caja_Chica_${p.codigo_dependencia}_${p.usuario_dni}.csv`, cab, filas);
};