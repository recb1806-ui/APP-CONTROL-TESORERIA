// =========================================================================================
// ETAPA 4 (RENOVADA): MÓDULO DE CÁLCULO Y SOLICITUD DE VIÁTICOS POR COMISIÓN E INDIVIDUAL
// Diseño Cálido y Lenguaje Claro para Magistrados y Fiscales del Ministerio Público
// Directiva GFIN/DIR-01 Versión 10 + Resolución N° 000038-2025-MP-FN-GG-OGFIN
// Incluye Privacidad por Usuario (DNI), Inclusión de Comisionados de Otras Sedes,
// Portada de 2 Tarjetas, Lista Compacta con Estado, Envío por WhatsApp y
// Habilitación / Bloqueo de Rendición exclusivo por Jefatura o Administración
// =========================================================================================

window.VIATICOS_CATALOGO = {
  rutasAereasAnexo08: [
    { item: 1, destino: "AMAZONAS - Chachapoyas", nota: "Vía Chiclayo, Tarapoto o Jaén (+2h ida / +2h retorno)" },
    { item: 2, destino: "ÁNCASH - Huaraz", nota: "Vuelo directo Anta / Huaraz (+2h ida / +2h retorno)" },
    { item: 3, destino: "APURÍMAC - Abancay", nota: "Vía Cusco o Andahuaylas (+2h ida / +2h retorno)" },
    { item: 4, destino: "AREQUIPA - Arequipa", nota: "Vuelo directo (+2h ida / +2h retorno)" },
    { item: 5, destino: "AYACUCHO - Ayacucho", nota: "Vuelo directo (+2h ida / +2h retorno)" },
    { item: 6, destino: "CAJAMARCA - Cajamarca", nota: "Vuelo directo (+2h ida / +2h retorno)" },
    { item: 7, destino: "CUSCO - Cusco", nota: "Vuelo directo (+2h ida / +2h retorno)" },
    { item: 8, destino: "HUANCAVELICA - Huancavelica", nota: "Vía Jauja (+2h ida / +2h retorno)" },
    { item: 9, destino: "HUÁNUCO - Huánuco", nota: "Vuelo directo (+2h ida / +2h retorno)" },
    { item: 10, destino: "MADRE DE DIOS - Puerto Maldonado", nota: "Vuelo directo (+2h ida / +2h retorno)" },
    { item: 11, destino: "JUNÍN - Huancayo", nota: "Vía Jauja (+2h ida / +2h retorno)" },
    { item: 12, destino: "MOQUEGUA - Moquegua", nota: "Vía Tacna (+2h ida / +2h retorno)" },
    { item: 13, destino: "LA LIBERTAD - Trujillo", nota: "Vuelo directo (+2h ida / +2h retorno)" },
    { item: 14, destino: "LAMBAYEQUE - Chiclayo", nota: "Vuelo directo (+2h ida / +2h retorno)" },
    { item: 15, destino: "LORETO - Iquitos", nota: "Vuelo directo (+2h ida / +2h retorno)" },
    { item: 16, destino: "PASCO - Cerro de Pasco", nota: "Vía Huánuco (+2h ida / +2h retorno)" },
    { item: 17, destino: "PIURA - Piura", nota: "Vuelo directo (+2h ida / +2h retorno)" },
    { item: 18, destino: "PUNO - Puno", nota: "Vía Juliaca (+2h ida / +2h retorno)" },
    { item: 19, destino: "SAN MARTÍN - Moyobamba", nota: "Vía Tarapoto (+2h ida / +2h retorno)" },
    { item: 20, destino: "SELVA CENTRAL - La Merced", nota: "Vía Jauja (+2h ida / +2h retorno)" },
    { item: 21, destino: "SULLANA - Sullana", nota: "Vía Piura (+2h ida / +2h retorno)" },
    { item: 22, destino: "TACNA - Tacna", nota: "Vuelo directo (+2h ida / +2h retorno)" },
    { item: 23, destino: "UCAYALI - Pucallpa", nota: "Vuelo directo (+2h ida / +2h retorno)" },
    { item: 24, destino: "TUMBES - Tumbes", nota: "Vuelo directo (+2h ida / +2h retorno)" }
  ],
  sedesADC: [
    "LIMA - Sede Central ANC-MP",
    "ADC CALLAO - Callao",
    "ADC CAÑETE - San Vicente de Cañete",
    "ADC HUAURA - Huacho",
    "ADC ICA - Ica",
    "ADC LIMA ESTE - San Juan de Lurigancho",
    "ADC LIMA NORTE - Independencia",
    "ADC LIMA NOROESTE - Ventanilla",
    "ADC LIMA SUR - Villa El Salvador",
    "ADC SANTA - Chimbote"
  ],
  zonasInternacionales: [
    { codigo: "AMS", nombre: "América del Sur", c4_usd: 370, c5_usd: 333, dias_inst: 1 },
    { codigo: "AMC", nombre: "América Central", c4_usd: 315, c5_usd: 283, dias_inst: 1 },
    { codigo: "AMN", nombre: "América del Norte", c4_usd: 440, c5_usd: 396, dias_inst: 1 },
    { codigo: "CAR", nombre: "Caribe", c4_usd: 430, c5_usd: 387, dias_inst: 1 },
    { codigo: "EUR", nombre: "Europa", c4_usd: 540, c5_usd: 486, dias_inst: 2 },
    { codigo: "ASI", nombre: "Asia", c4_usd: 500, c5_usd: 450, dias_inst: 2 },
    { codigo: "MOR", nombre: "Medio Oriente", c4_usd: 510, c5_usd: 459, dias_inst: 2 },
    { codigo: "AFR", nombre: "África", c4_usd: 480, c5_usd: 432, dias_inst: 2 },
    { codigo: "OCE", nombre: "Oceanía", c4_usd: 385, c5_usd: 346, dias_inst: 2 }
  ]
};

window.VIATICOS_STATE = {
  modoVista: "PORTADA_VIATICOS", // 'PORTADA_VIATICOS', 'LISTA_COMISIONES', 'DETALLE_COMISION', 'EDITOR_COMISION'
  idxComisionSeleccionada: 0,
  comisionesCreadas: [],
  comisionEnEdicion: null,
  comisionados: [],
  ultimoCalculoTiempo: {
    horasEfectivasViaje: 0,
    horasTrasladoTerminal: 4,
    totalHorasComputadas: 0,
    diasReconocidos: 1,
    horasFraccion: 0,
    excedeTopeDias: false,
    topeMaximoDiasNorma: 5
  }
};

document.addEventListener("DOMContentLoaded", () => {
  inicializarModuloViaticosPasoB();
});

window.cargarDatosModuloViaticos = async function() {
  await sincronizarComisionesViaticos();
  renderizarModuloViaticos();
};

async function inicializarModuloViaticosPasoB() {
  crearModalComisionadoDOM();
  await sincronizarComisionesViaticos();
  renderizarModuloViaticos();
}

// Mapa local de estados de habilitación de rendición por planilla y DNI
function obtenerMapaHabilitacionesLocal() {
  try {
    return JSON.parse(localStorage.getItem("anc_viaticos_hab_v1") || "{}");
  } catch (e) {
    return {};
  }
}

function guardarEstadoHabilitacionLocal(codigoPlanilla, dniComisionado, habilitado) {
  const mapa = obtenerMapaHabilitacionesLocal();
  const clave = `${codigoPlanilla}_${String(dniComisionado || "").trim()}`;
  mapa[clave] = Boolean(habilitado);
  localStorage.setItem("anc_viaticos_hab_v1", JSON.stringify(mapa));
}

async function sincronizarComisionesViaticos() {
  const guardadasLocal = JSON.parse(localStorage.getItem("anc_viaticos_local_v1") || "[]");
  const mapaHab = obtenerMapaHabilitacionesLocal();

  const resSol = await window.SupabaseANC.request("anc_viaticos_solicitudes", "GET", "order=id.desc&limit=80");
  const resCom = await window.SupabaseANC.request("anc_viaticos_comisionados", "GET", "order=id.asc&limit=400");

  if (resSol.data && resSol.data.length > 0) {
    const todosCom = resCom.data || [];
    window.VIATICOS_STATE.comisionesCreadas = resSol.data.map(sol => {
      const matchLocal = guardadasLocal.find(l => l.codigo_planilla === sol.codigo_planilla);

      const comsDeSol = todosCom.filter(c => Number(c.solicitud_id) === Number(sol.id)).map((c, idx) => {
        const claveHab = `${sol.codigo_planilla}_${String(c.dni_comisionado || "").trim()}`;
        const localComMatch = matchLocal?.comisionados?.find(lc => String(lc?.com?.dni) === String(c.dni_comisionado));

        // Por defecto false hasta que Jefatura o Administración lo autorice
        const habEstado = (claveHab in mapaHab)
          ? mapaHab[claveHab]
          : (typeof c.rendicion_habilitada === "boolean"
            ? c.rendicion_habilitada
            : Boolean(localComMatch?.com?.rendicion_habilitada || false));

        return {
          com: {
            id_db: c.id,
            id_temp: c.id || idx + 1,
            dni: c.dni_comisionado,
            nombres: c.apellidos_nombres,
            cargo: c.cargo_comisionado,
            regimen: c.regimen_vinculo,
            sede_comisionado: localComMatch?.com?.sede_comisionado || sol.nombre_dependencia || "Sede ANC-MP",
            rendicion_habilitada: habEstado,
            nivel_escala: Number(c.subtotal_viaticos_dias) >= 266 ? "NIVEL_1" : "NIVEL_2",
            sustenta_alojamiento: Boolean(c.sustenta_alojamiento),
            es_escolta_seguridad: Boolean(c.es_personal_seguridad_escolta),
            pasajes_terrestres: Number(c.pasajes_terrestres_fluviales || 0),
            combustible: Number(c.combustible_asignado || 0),
            peajes: Number(c.peajes_asignados || 0),
            otros_vehiculo: Number(c.otros_gastos_vehiculo || 0)
          },
          calc: {
            etiquetaEscala: sol.tipo_comision === "SIN_VIATICOS_MISMO_DIA" ? "Comisión en el día (Anexo 07)" : "Escala Oficial de Viáticos",
            subtotalViaticoDias: Number(c.subtotal_viaticos_dias || 0),
            subtotalViaticoHoras: Number(c.subtotal_viaticos_horas || 0),
            descuentoNoAloj: Number(c.descuento_no_alojamiento || 0),
            descuentoEscolta: Number(c.descuento_alimentos_escolta || 0),
            movLocalTotal: Number(c.movilidad_local_total || 0),
            movEmbarqueTotal: Number(c.movilidad_embarque_total || 0),
            netoViatico: Number((Number(c.subtotal_viaticos_dias || 0) + Number(c.subtotal_viaticos_horas || 0) + Number(c.movilidad_local_total || 0) + Number(c.movilidad_embarque_total || 0) - Number(c.descuento_no_alojamiento || 0) - Number(c.descuento_alimentos_escolta || 0)).toFixed(2)),
            otrasAsignaciones: Number((Number(c.pasajes_terrestres_fluviales || 0) + Number(c.combustible_asignado || 0) + Number(c.peajes_asignados || 0) + Number(c.otros_gastos_vehiculo || 0)).toFixed(2)),
            totalRecibir: Number(c.total_recibir_comisionado || 0),
            pctMaxDJ: sol.tipo_comision === "INTERNACIONAL_USD" ? 20 : 30,
            topeMaxDJ: Number(c.tope_maximo_dj_soles || 0)
          }
        };
      });

      return {
        ...sol,
        usuario_creador: sol.usuario_creador || matchLocal?.usuario_creador || "",
        usuario_creador_dni: sol.usuario_creador_dni || matchLocal?.usuario_creador_dni || "",
        codigo_dependencia: sol.codigo_dependencia || matchLocal?.codigo_dependencia || "",
        nombre_dependencia: sol.nombre_dependencia || matchLocal?.nombre_dependencia || "Sede ANC-MP",
        comisionados: comsDeSol.length > 0 ? comsDeSol : (matchLocal ? matchLocal.comisionados : [])
      };
    });
    localStorage.setItem("anc_viaticos_local_v1", JSON.stringify(window.VIATICOS_STATE.comisionesCreadas));
  } else {
    window.VIATICOS_STATE.comisionesCreadas = guardadasLocal.map(sol => ({
      ...sol,
      comisionados: (sol.comisionados || []).map(it => {
        const claveHab = `${sol.codigo_planilla}_${String(it?.com?.dni || "").trim()}`;
        return {
          ...it,
          com: {
            ...it.com,
            rendicion_habilitada: (claveHab in mapaHab) ? mapaHab[claveHab] : Boolean(it?.com?.rendicion_habilitada)
          }
        };
      })
    }));
  }
}

function obtenerFechasPorDefectoViaticos() {
  const ahora = new Date();
  const manana = new Date(ahora.getTime() + 24 * 3600 * 1000);
  const pasado = new Date(ahora.getTime() + 48 * 3600 * 1000);
  const fmt = (d, h) => `${d.toISOString().slice(0, 10)}T${h}`;
  return { salida: fmt(manana, "08:00"), retorno: fmt(pasado, "18:00") };
}

// =========================================================================
// NAVEGACIÓN DE SUBVISTAS DE VIÁTICOS INTEGRADA CON BOTÓN "ATRÁS" DEL CELULAR
// =========================================================================
window.irAPortadaViaticos = function(desdePopState = false) {
  window.VIATICOS_STATE.modoVista = "PORTADA_VIATICOS";
  renderizarModuloViaticos();
  window.scrollTo({ top: 0, behavior: "smooth" });
  if (!desdePopState && typeof window.registrarEstadoHistorialANC === "function") {
    window.registrarEstadoHistorialANC({ subvistaViaticos: "PORTADA_VIATICOS" });
  }
};

window.iniciarNuevaComisionViaticos = function(desdePopState = false) {
  window.VIATICOS_STATE.modoVista = "EDITOR_COMISION";
  window.VIATICOS_STATE.comisionados = [];
  renderizarModuloViaticos();
  window.scrollTo({ top: 0, behavior: "smooth" });
  if (!desdePopState && typeof window.registrarEstadoHistorialANC === "function") {
    window.registrarEstadoHistorialANC({ subvistaViaticos: "EDITOR_COMISION" });
  }
};

window.abrirListaComisionesViaticos = function(desdePopState = false) {
  window.VIATICOS_STATE.modoVista = "LISTA_COMISIONES";
  renderizarModuloViaticos();
  window.scrollTo({ top: 0, behavior: "smooth" });
  if (!desdePopState && typeof window.registrarEstadoHistorialANC === "function") {
    window.registrarEstadoHistorialANC({ subvistaViaticos: "LISTA_COMISIONES" });
  }
};

window.volverAListaComisionesViaticos = function(desdePopState = false) {
  window.VIATICOS_STATE.modoVista = "LISTA_COMISIONES";
  renderizarModuloViaticos();
  window.scrollTo({ top: 0, behavior: "smooth" });
  if (!desdePopState && typeof window.registrarEstadoHistorialANC === "function") {
    window.registrarEstadoHistorialANC({ subvistaViaticos: "LISTA_COMISIONES" });
  }
};

window.abrirDetalleComisionViaticos = function(idxReal, desdePopState = false) {
  window.VIATICOS_STATE.idxComisionSeleccionada = idxReal;
  window.VIATICOS_STATE.modoVista = "DETALLE_COMISION";
  renderizarModuloViaticos();
  window.scrollTo({ top: 0, behavior: "smooth" });
  if (!desdePopState && typeof window.registrarEstadoHistorialANC === "function") {
    window.registrarEstadoHistorialANC({ subvistaViaticos: "DETALLE_COMISION", idxReal });
  }
};

// Determina el estado automático de una comisión según su fecha/hora de retorno frente a la fecha/hora actual
function evaluarEstadoTemporalComision(sol) {
  const ahora = new Date();
  const fRetStr = sol.fecha_hora_retorno || "";
  const dRet = fRetStr ? new Date(fRetStr) : null;

  if (!dRet || isNaN(dRet.getTime()) || ahora.getTime() <= dRet.getTime()) {
    return {
      enCurso: true,
      etiqueta: "🟡 EN CURSO / PROGRAMADA",
      claseBadge: "badge-amarillo"
    };
  }
  return {
    enCurso: false,
    etiqueta: "🟢 VIAJE CULMINADO",
    claseBadge: "badge-verde"
  };
}

// Construye las opciones compartidas para Origen y Destino (Lima Sede Central + 24 Rutas Anexo 08 + Sedes ADC)
function construirOpcionesCiudadesSedesHTML(seleccionadoPorDefecto = "", esOrigen = false) {
  const listaSedes = window.VIATICOS_CATALOGO.sedesADC || [];
  const listaRutas = window.VIATICOS_CATALOGO.rutasAereasAnexo08 || [];

  const opcionesSedes = listaSedes.map(s => {
    const sel = (seleccionadoPorDefecto && s.toLowerCase().includes(seleccionadoPorDefecto.toLowerCase())) ? "selected" : "";
    return `<option value="${s}" ${sel}>${s}</option>`;
  }).join("");

  const opcionesAnexo08 = listaRutas.map(r => {
    const sel = (seleccionadoPorDefecto === r.destino) ? "selected" : "";
    return `<option value="${r.destino}" ${sel}>${r.destino}</option>`;
  }).join("");

  const valorOtro = esOrigen ? "OTRO_ORIGEN" : "OTRO_DESTINO";
  const textoOtro = esOrigen
    ? "-- Otra ciudad o sede de salida (Escribir manualmente) --"
    : "-- Otra ciudad o provincia de destino (Escribir manualmente) --";

  return `
    <optgroup label="Sede Central y Sedes Desconcentradas (ADC)">
      ${opcionesSedes}
    </optgroup>
    <optgroup label="Ciudades y Capitales a Nivel Nacional">
      ${opcionesAnexo08}
    </optgroup>
    <option value="${valorOtro}">${textoOtro}</option>
  `;
}

// =========================================================================
// HABILITACIÓN / BLOQUEO DE RENDICIÓN POR JEFATURA O ADMINISTRADOR
// =========================================================================
window.toggleHabilitarRendicionComisionado = async function(idxSol, idxCom) {
  if (!window.validarPinJefaturaOAdmin("autorizar o bloquear la rendición de gastos de viaje del comisionado")) {
    return;
  }

  const sol = window.VIATICOS_STATE.comisionesCreadas[idxSol];
  if (!sol || !sol.comisionados || !sol.comisionados[idxCom]) return;

  const item = sol.comisionados[idxCom];
  const nuevoEstado = !Boolean(item.com.rendicion_habilitada);
  item.com.rendicion_habilitada = nuevoEstado;

  // Persistir en mapa local y arreglo de comisiones
  guardarEstadoHabilitacionLocal(sol.codigo_planilla, item.com.dni, nuevoEstado);
  localStorage.setItem("anc_viaticos_local_v1", JSON.stringify(window.VIATICOS_STATE.comisionesCreadas));

  // Si la planilla está seleccionada actualmente para rendir, sincronizar su estado
  try {
    const selActual = JSON.parse(localStorage.getItem("anc_rendicion_seleccionada_v1") || "null");
    if (selActual && selActual.codigo_planilla === sol.codigo_planilla && String(selActual?.comisionadoItem?.com?.dni) === String(item.com.dni)) {
      selActual.comisionadoItem.com.rendicion_habilitada = nuevoEstado;
      localStorage.setItem("anc_rendicion_seleccionada_v1", JSON.stringify(selActual));
    }
  } catch (e) {
    console.warn("Aviso actualizando selección activa:", e);
  }

  renderizarModuloViaticos();

  alert(
    nuevoEstado
      ? `🔓 RENDICIÓN HABILITADA:\nEl comisionado ${item.com.nombres} (DNI: ${item.com.dni}) ya puede registrar sus boletas y presentar su rendición en "Rendir mis Gastos de Viaje".`
      : `🔒 RENDICIÓN EN ESPERA:\nSe ha restringido temporalmente el envío de la rendición para ${item.com.nombres} (DNI: ${item.com.dni}).`
  );
};

// =========================================================================
// ENVÍO DE RESUMEN FORMATEADO DE COMISIÓN POR WHATSAPP
// =========================================================================
function construirTextoResumenWhatsAppComision(sol, listaComisionados) {
  const fSal = (sol.fecha_hora_salida || "").replace("T", " ");
  const fRet = (sol.fecha_hora_retorno || "").replace("T", " ");
  const duracionTxt = `${sol.dias_viatico_reconocidos || 1} día(s) y ${sol.horas_fraccion_reconocidas || 0} hora(s) (${sol.total_horas_computadas || 0}h totales)`;

  let totalGeneral = 0;
  const lineasPersonas = (listaComisionados || []).map((item, idx) => {
    const com = item.com || item;
    const calc = item.calc || calcularMontosIndividualComisionado(com);
    const monto = Number(calc.totalRecibir || 0);
    totalGeneral += monto;
    return `   ${idx + 1}. *${com.nombres}* (DNI: ${com.dni}) — ${window.fmtSoles(monto)}`;
  }).join("\n");

  const montoFinal = sol.monto_total_solicitud !== undefined ? Number(sol.monto_total_solicitud) : totalGeneral;

  return (
    `✈️ *COMISIÓN OFICIAL DE SERVICIOS — ANC-MP*\n` +
    `━━━━━━━━━━━━━━━━━━━━\n` +
    `📋 *Planilla N°:* ${sol.codigo_planilla}\n` +
    `📄 *Documento que autoriza:* ${sol.documento_autorizacion}\n` +
    `🎯 *Motivo de la comisión:* ${sol.motivo_comision}\n` +
    `🚌 *Medio de transporte:* ${sol.medio_transporte}\n` +
    `📍 *Lugar de salida:* ${sol.origen_comision}\n` +
    `🏁 *Ciudad de destino:* ${sol.destino_comision}\n` +
    `🛫 *Fecha y hora de salida:* ${fSal}\n` +
    `🛬 *Fecha y hora de retorno:* ${fRet}\n` +
    `⏱️ *Tiempo reconocido:* ${duracionTxt}\n` +
    `━━━━━━━━━━━━━━━━━━━━\n` +
    `👥 *INTEGRANTES DE LA COMISIÓN (${(listaComisionados || []).length}):*\n` +
    `${lineasPersonas || "   (Sin comisionados registrados)"}\n` +
    `━━━━━━━━━━━━━━━━━━━━\n` +
    `💰 *ASIGNACIÓN TOTAL:* *${window.fmtSoles(montoFinal)}*`
  );
}

window.enviarComisionGuardadaWhatsApp = function(idxSol) {
  const sol = window.VIATICOS_STATE.comisionesCreadas[idxSol];
  if (!sol) return;
  const texto = construirTextoResumenWhatsAppComision(sol, sol.comisionados || []);
  window.open(`https://wa.me/?text=${encodeURIComponent(texto)}`, "_blank");
};

window.enviarComisionActivaWhatsApp = function() {
  if (window.VIATICOS_STATE.comisionados.length === 0) {
    alert("⚠️ Por favor, añade al menos un integrante a la comisión para compartir el resumen por WhatsApp.");
    return;
  }
  const datosSol = recolectarDatosFormularioComisionActiva();
  const items = window.VIATICOS_STATE.comisionados.map(c => ({
    com: c,
    calc: calcularMontosIndividualComisionado(c)
  }));
  const texto = construirTextoResumenWhatsAppComision(datosSol, items);
  window.open(`https://wa.me/?text=${encodeURIComponent(texto)}`, "_blank");
};

function obtenerComisionesVisiblesDelUsuario() {
  return window.VIATICOS_STATE.comisionesCreadas
    .map((c, idxReal) => ({ comision: c, idxReal }))
    .filter(({ comision }) => {
      if (typeof window.esRegistroDelUsuarioActivo === "function") {
        return window.esRegistroDelUsuarioActivo(comision);
      }
      return true;
    });
}

function renderizarModuloViaticos() {
  const cont = document.getElementById("contenedor-modulo-viaticos");
  if (!cont) return;

  const p = window.ANC_STATE ? window.ANC_STATE.perfilActivo : {
    unidad_id: 13,
    codigo_dependencia: "AP-UAB",
    nombre_dependencia: "Unidad de Abastecimiento",
    sede_ubicacion: "Lima",
    usuario_nombre: "Usuario Operador ANC",
    usuario_dni: "45000001",
    rol_sistema: "OPERADOR"
  };

  const comisionesConIndiceReal = obtenerComisionesVisiblesDelUsuario();
  const esJefaturaOAdmin = typeof window.puedeHabilitarRendicion === "function" && window.puedeHabilitarRendicion();

  let cantEnProceso = 0;
  let cantProcesadas = 0;
  comisionesConIndiceReal.forEach(({ comision }) => {
    const est = evaluarEstadoTemporalComision(comision);
    if (est.enCurso) cantEnProceso++;
    else cantProcesadas++;
  });

  // =========================================================================
  // MODO 1: PORTADA INICIAL DE VIÁTICOS -> DOS (2) TARJETAS CÁLIDAS Y CLARAS
  // =========================================================================
  if (window.VIATICOS_STATE.modoVista === "PORTADA_VIATICOS") {
    cont.innerHTML = `
      <div style="text-align:center; margin-bottom:14px;">
        <h2 style="font-size:1.22rem; font-weight:800; color:#0F172A;">✈️ Solicitar Viáticos de Comisión</h2>
        <p style="font-size:0.82rem; color:#475569; font-weight:600; margin-top:3px;">
          Programa un nuevo viaje oficial o consulta tus planillas registradas
        </p>
      </div>

      <!-- Aviso amable de Privacidad por DNI -->
      <div style="background:#FFFDF5; border:1.5px solid #FDE68A; border-radius:16px; padding:10px 12px; margin-bottom:14px; font-size:0.77rem; color:#0F172A; line-height:1.4;">
        ${window.esAdministradorActivo && window.esAdministradorActivo()
          ? `🛡️ <strong>Vista General de Administración:</strong> Visualizando todas las comisiones de servicio a nivel nacional.`
          : (esJefaturaOAdmin
            ? `🏛️ <strong>Perfil Jefatura (${p.usuario_nombre}):</strong> Puedes programar comisiones y habilitar la rendición de gastos de los comisionados.`
            : `🔒 <strong>Tu información es privada (${p.usuario_nombre} • DNI: ${p.usuario_dni}):</strong> Solo tú puedes ver las comisiones que programes o en las que estés incluido.`)}
      </div>

      <!-- DOS BOTONES / TARJETAS GRANDES Y CÁLIDAS -->
      <div class="viaticos-portada-grid">
        <!-- Tarjeta Grande 1: (+) Programar Nueva Comisión de Viaje -->
        <button type="button" class="viaticos-big-card card-nueva-comision" onclick="iniciarNuevaComisionViaticos()">
          <div class="btn-circle-plus" style="margin-bottom:12px; pointer-events:none;">+</div>
          <div style="font-size:1.12rem; font-weight:800; color:#0F172A; margin-bottom:5px;">
            (+) Programar Nueva Comisión de Viaje
          </div>
          <div style="font-size:0.83rem; font-weight:600; color:#475569; line-height:1.4; max-width:360px;">
            Indica tu ciudad de destino, fechas de viaje e integrantes para calcular automáticamente tu asignación y generar tu planilla
          </div>
        </button>

        <!-- Tarjeta Grande 2: 📋 Mis Comisiones y Planillas -->
        <button type="button" class="viaticos-big-card card-mis-comisiones" onclick="abrirListaComisionesViaticos()">
          <div style="width:68px; height:68px; border-radius:20px; background:#0EA5E9; color:#FFFFFF; border:2.5px solid #FFFFFF; display:flex; align-items:center; justify-content:center; font-size:1.9rem; margin-bottom:12px; box-shadow:0 6px 14px rgba(14,165,233,0.25);">
            📋
          </div>
          <div style="font-size:1.12rem; font-weight:800; color:#0F172A; margin-bottom:5px;">
            📋 Mis Comisiones y Planillas
          </div>
          <div style="font-size:0.83rem; font-weight:600; color:#475569; line-height:1.4; max-width:360px; margin-bottom:10px;">
            Revisa tus viajes programados o culminados, descarga tu planilla lista para firmar o comparte los datos por WhatsApp
          </div>
          <div style="display:flex; gap:8px; flex-wrap:wrap; justify-content:center;">
            <span class="badge-semaforo badge-amarillo" style="font-size:0.72rem;">🟡 En curso: ${cantEnProceso}</span>
            <span class="badge-semaforo badge-verde" style="font-size:0.72rem;">🟢 Culminadas: ${cantProcesadas}</span>
          </div>
        </button>
      </div>
    `;
    return;
  }

  // =========================================================================
  // MODO 2: LISTA COMPACTA DE COMISIONES ("LISTA_COMISIONES")
  // =========================================================================
  if (window.VIATICOS_STATE.modoVista === "LISTA_COMISIONES") {
    cont.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; margin-bottom:14px; padding-bottom:10px; border-bottom:1.5px solid #E2E8F0;">
        <button type="button" onclick="irAPortadaViaticos()" style="background:#FFFDF5; color:#0F172A; border:1.5px solid #F59E0B; border-radius:12px; padding:8px 13px; font-size:0.78rem; font-weight:800; cursor:pointer;">
          ← Volver
        </button>
        <div style="display:flex; gap:6px; flex-wrap:wrap;">
          <button type="button" onclick="iniciarNuevaComisionViaticos()" style="background:linear-gradient(135deg, #FBBF24 0%, #F59E0B 100%); color:#0F172A; border:1px solid #D97706; border-radius:12px; padding:8px 12px; font-size:0.76rem; font-weight:800; cursor:pointer;">
            + Nueva Comisión
          </button>
          <button type="button" onclick="navegarVista('rendicion-viaticos')" style="background:#10B981; color:#FFFFFF; border:none; border-radius:12px; padding:8px 12px; font-size:0.76rem; font-weight:800; cursor:pointer;">
            📑 Ir a Rendir Gastos →
          </button>
        </div>
      </div>

      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:6px; margin-bottom:10px;">
        <h3 style="font-size:0.98rem; font-weight:800; color:#0F172A;">
          📋 Mis Comisiones Registradas (${comisionesConIndiceReal.length})
        </h3>
        <span style="font-size:0.74rem; color:#475569; font-weight:700;">
          Toca una comisión para ver su planilla y opciones
        </span>
      </div>

      <div id="lista-compacta-comisiones" style="display:flex; flex-direction:column; gap:10px;">
        ${comisionesConIndiceReal.length === 0 ? `
          <div style="text-align:center; padding:26px 14px; background:#FFFDF5; border:1.5px dashed #FDE68A; border-radius:18px; color:#475569; font-size:0.84rem; line-height:1.45;">
            Aún no tienes comisiones de viaje registradas con tu DNI (<strong>${p.usuario_dni}</strong>).<br/>
            <button type="button" onclick="iniciarNuevaComisionViaticos()" style="margin-top:12px; background:linear-gradient(135deg, #FBBF24 0%, #F59E0B 100%); color:#0F172A; border:1.5px solid #D97706; border-radius:12px; padding:9px 16px; font-size:0.8rem; font-weight:800; cursor:pointer;">
              + Programar mi Primera Comisión
            </button>
          </div>
        ` : comisionesConIndiceReal.map(({ comision, idxReal }) => renderizarFilaCompactaComision(comision, idxReal)).join("")}
      </div>
    `;
    return;
  }

  // =========================================================================
  // MODO 3: DETALLE DE UNA COMISIÓN SELECCIONADA ("DETALLE_COMISION")
  // =========================================================================
  if (window.VIATICOS_STATE.modoVista === "DETALLE_COMISION") {
    const idxSel = Number(window.VIATICOS_STATE.idxComisionSeleccionada || 0);
    const sol = window.VIATICOS_STATE.comisionesCreadas[idxSel];

    if (!sol) {
      window.VIATICOS_STATE.modoVista = "LISTA_COMISIONES";
      renderizarModuloViaticos();
      return;
    }

    cont.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; margin-bottom:14px; padding-bottom:10px; border-bottom:1.5px solid #E2E8F0;">
        <button type="button" onclick="volverAListaComisionesViaticos()" style="background:#FFFDF5; color:#0F172A; border:1.5px solid #F59E0B; border-radius:12px; padding:8px 13px; font-size:0.78rem; font-weight:800; cursor:pointer;">
          ← Volver a Mis Comisiones
        </button>
        <button type="button" onclick="navegarVista('rendicion-viaticos')" style="background:#10B981; color:#FFFFFF; border:none; border-radius:12px; padding:8px 13px; font-size:0.76rem; font-weight:800; cursor:pointer;">
          📑 Rendir mis Gastos de Viaje →
        </button>
      </div>

      ${renderizarTarjetaComisionCreada(sol, idxSel)}
    `;
    return;
  }

  // =========================================================================
  // MODO 4: EDITOR DE NUEVA COMISIÓN ("EDITOR_COMISION")
  // =========================================================================
  const fechas = obtenerFechasPorDefectoViaticos();
  const sedeDefault = p.sede_ubicacion || "LIMA - Sede Central ANC-MP";

  cont.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; margin-bottom:12px; padding-bottom:10px; border-bottom:1.5px solid #E2E8F0;">
      <button type="button" onclick="irAPortadaViaticos()" style="background:#FFFDF5; color:#0F172A; border:1.5px solid #F59E0B; border-radius:12px; padding:8px 13px; font-size:0.78rem; font-weight:800; cursor:pointer;">
        ← Volver
      </button>
      <span class="badge-semaforo badge-amarillo">✈️ NUEVA COMISIÓN DE VIAJE</span>
    </div>

    <!-- Recordatorio amable sobre propinas -->
    <div style="background:#FFF5F6; border:1.5px solid #FECDD3; border-radius:16px; padding:10px 12px; margin-bottom:14px; font-size:0.76rem; color:#9F1239; line-height:1.4;">
      💡 <strong>Recordatorio útil para tu viaje:</strong> Al solicitar tus facturas o boletas de hotel, alimentación o movilidad a nombre del Ministerio Público (RUC <strong>${window.ANC_STATE?.config?.ruc_institucional || '20131370301'}</strong>), verifica que no incluyan recargos por propinas <span style="font-size:0.68rem; opacity:0.85;">(Res. N° 000038-2025-MP-FN-GG-OGFIN)</span>.
    </div>

    <!-- PASO 1 DE LA COMISIÓN: DESTINO, FECHAS Y TRANSPORTE -->
    <div style="background:#FFFDF5; border:1.5px solid #FDE68A; border-radius:20px; padding:14px; margin-bottom:16px; width:100%; max-width:100%; box-sizing:border-box; overflow:hidden;">
      <h3 style="font-size:0.95rem; font-weight:800; color:#0F172A; margin-bottom:10px;">
        📍 1. ¿A dónde y cuándo se realizará la comisión?
      </h3>

      <div style="margin-bottom:10px; width:100%; max-width:100%; min-width:0;">
        <label style="display:block; font-size:0.73rem; font-weight:800; color:#334155; margin-bottom:3px;">TIPO DE VIAJE O COMISIÓN OFICIAL:</label>
        <select id="viat-tipo-comision" onchange="alCambiarModalidadViatico()" style="width:100% !important; max-width:100% !important; min-width:0 !important; box-sizing:border-box !important; padding:10px; border-radius:12px; border:1.5px solid #F59E0B; font-weight:800; font-size:0.82rem; background:#FFFFFF; color:#0F172A;">
          <option value="NACIONAL_FUERA_DF">1. Viaje Nacional a otra región / Distrito Fiscal (Hasta 5 días • Escala Nacional)</option>
          <option value="INTERNO_ADC_DF">2. Viaje dentro de tu mismo Distrito Fiscal / Sede ADC mayor a 24 horas (Hasta 10 días)</option>
          <option value="SIN_VIATICOS_MISMO_DIA">3. Diligencia del Mismo Día sin pernocte (De 4 a 8 horas: S/ 40 • Más de 8 horas: S/ 80)</option>
          <option value="INTERNACIONAL_USD">4. Viaje Oficial al Exterior del País en Dólares USD (Incluye días de instalación)</option>
        </select>
      </div>

      <div class="grid-mobile-1col" style="display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-bottom:10px; width:100%; max-width:100%; min-width:0;">
        <div style="min-width:0; max-width:100%;">
          <label style="display:block; font-size:0.73rem; font-weight:800; color:#334155; margin-bottom:3px;">RESOLUCIÓN, OFICIO O DISPOSICIÓN QUE AUTORIZA:</label>
          <input type="text" id="viat-doc-autoriza" value="Res. Jefatural N° 015-2026-ANC-MP" style="width:100% !important; max-width:100% !important; min-width:0 !important; box-sizing:border-box !important; padding:9px 10px; border-radius:12px; border:1.5px solid #CBD5E1; font-weight:700; font-size:0.82rem; background:#FFFFFF;" />
        </div>
        <div style="min-width:0; max-width:100%;">
          <label style="display:block; font-size:0.73rem; font-weight:800; color:#334155; margin-bottom:3px;">MEDIO DE TRANSPORTE PRINCIPAL:</label>
          <select id="viat-medio-transporte" onchange="recalcularTiempoYComisionados()" style="width:100% !important; max-width:100% !important; min-width:0 !important; box-sizing:border-box !important; padding:9px 10px; border-radius:12px; border:1.5px solid #0F172A; font-weight:800; font-size:0.82rem; background:#FFFFFF;">
            <option value="AEREO">✈️ Avión (+2h antes y +2h después por aeropuerto)</option>
            <option value="TERRESTRE">🚌 Bus Interprovincial (+1h antes y +1h después)</option>
            <option value="FLUVIAL">🚤 Vía Fluvial (+1h antes y +1h después)</option>
            <option value="VEHICULO_OFICIAL">🚓 Vehículo Oficial de la Institución</option>
          </select>
        </div>
      </div>

      <!-- CIUDAD DE ORIGEN Y DESTINO CON SELECTORES DESPLEGABLES Y OPCIÓN MANUAL -->
      <div id="bloque-destino-nacional" class="grid-mobile-1col" style="display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-bottom:10px; width:100%; max-width:100%; min-width:0;">
        <div style="min-width:0; max-width:100%;">
          <label style="display:block; font-size:0.73rem; font-weight:800; color:#334155; margin-bottom:3px;">LUGAR DE SALIDA (ORIGEN):</label>
          <select id="viat-origen-select" onchange="alSeleccionarOrigenViatico()" style="width:100% !important; max-width:100% !important; min-width:0 !important; box-sizing:border-box !important; padding:9px 10px; border-radius:12px; border:1.5px solid #CBD5E1; font-weight:700; font-size:0.82rem; background:#FFFFFF;">
            ${construirOpcionesCiudadesSedesHTML(sedeDefault, true)}
          </select>
          <input type="text" id="viat-origen-manual" placeholder="Escribe la ciudad o sede de salida..." oninput="recalcularTiempoYComisionados()" style="display:none; margin-top:6px; width:100% !important; max-width:100% !important; min-width:0 !important; box-sizing:border-box !important; padding:9px 10px; border-radius:12px; border:1.5px solid #F59E0B; font-weight:700; font-size:0.82rem; background:#FFFFFF;" />
        </div>
        <div style="min-width:0; max-width:100%;">
          <label style="display:block; font-size:0.73rem; font-weight:800; color:#334155; margin-bottom:3px;">CIUDAD O SEDE DE DESTINO:</label>
          <select id="viat-destino-select" onchange="alSeleccionarRutaAnexo08()" style="width:100% !important; max-width:100% !important; min-width:0 !important; box-sizing:border-box !important; padding:9px 10px; border-radius:12px; border:1.5px solid #CBD5E1; font-weight:700; font-size:0.82rem; background:#FFFFFF;">
            ${construirOpcionesCiudadesSedesHTML("AREQUIPA - Arequipa", false)}
          </select>
          <input type="text" id="viat-destino-manual" placeholder="Escribe la ciudad o provincia de destino..." oninput="recalcularTiempoYComisionados()" style="display:none; margin-top:6px; width:100% !important; max-width:100% !important; min-width:0 !important; box-sizing:border-box !important; padding:9px 10px; border-radius:12px; border:1.5px solid #F59E0B; font-weight:700; font-size:0.82rem; background:#FFFFFF;" />
        </div>
      </div>

      <div id="bloque-zona-internacional" class="grid-mobile-1col" style="display:none; grid-template-columns:1fr 1fr; gap:8px; margin-bottom:10px; width:100%; max-width:100%; min-width:0;">
        <div style="min-width:0; max-width:100%;">
          <label style="display:block; font-size:0.73rem; font-weight:800; color:#78350F; margin-bottom:3px;">CONTINENTE / ZONA INTERNACIONAL:</label>
          <select id="viat-zona-ext" onchange="recalcularTiempoYComisionados()" style="width:100% !important; max-width:100% !important; min-width:0 !important; box-sizing:border-box !important; padding:9px 10px; border-radius:12px; border:1.5px solid #D97706; font-weight:800; background:#FFFFFF;">
            ${window.VIATICOS_CATALOGO.zonasInternacionales.map(z => `<option value="${z.codigo}">${z.nombre} (+${z.dias_inst}d instalación | $${z.c4_usd}/$${z.c5_usd})</option>`).join("")}
          </select>
        </div>
        <div style="min-width:0; max-width:100%;">
          <label style="display:block; font-size:0.73rem; font-weight:800; color:#78350F; margin-bottom:3px;">CIUDAD Y PAÍS DE DESTINO:</label>
          <input type="text" id="viat-ciudad-ext" value="Bogotá, Colombia" style="width:100% !important; max-width:100% !important; min-width:0 !important; box-sizing:border-box !important; padding:9px 10px; border-radius:12px; border:1.5px solid #D97706; font-weight:700; background:#FFFFFF;" />
        </div>
      </div>

      <div id="bloque-vehiculo-oficial" style="display:none; background:#F0F8FF; border:1.5px solid #BAE6FD; border-radius:14px; padding:10px; margin-bottom:10px; width:100%; max-width:100%; box-sizing:border-box;">
        <div style="font-size:0.73rem; font-weight:800; color:#0284C7; margin-bottom:6px;">
          🚓 Datos del Vehículo Oficial Asignado:
        </div>
        <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:8px; width:100%; max-width:100%; min-width:0;">
          <input type="text" id="viat-placa-oficial" placeholder="Placa (Ej: EGW-123)" style="width:100% !important; max-width:100% !important; min-width:0 !important; box-sizing:border-box !important; padding:8px; border-radius:10px; border:1px solid #7DD3FC; font-weight:700; font-size:0.78rem; background:#FFFFFF;" />
          <input type="text" id="viat-conductor-oficial" placeholder="Nombre del conductor" style="width:100% !important; max-width:100% !important; min-width:0 !important; box-sizing:border-box !important; padding:8px; border-radius:10px; border:1px solid #7DD3FC; font-weight:700; font-size:0.78rem; background:#FFFFFF;" />
          <input type="text" id="viat-km-estimado" placeholder="Km estimado ida/vuelta" style="width:100% !important; max-width:100% !important; min-width:0 !important; box-sizing:border-box !important; padding:8px; border-radius:10px; border:1px solid #7DD3FC; font-weight:700; font-size:0.78rem; background:#FFFFFF;" />
        </div>
      </div>

      <!-- FECHA Y HORA DE SALIDA Y RETORNO EN 1 SOLA COLUMNA PARA CERO DESBORDE MÓVIL -->
      <div class="grid-fechas-comision" style="display:grid; grid-template-columns:1fr !important; gap:9px; margin-bottom:10px; width:100% !important; max-width:100% !important; min-width:0 !important; box-sizing:border-box !important;">
        <div style="width:100% !important; max-width:100% !important; min-width:0 !important; overflow:hidden;">
          <label style="display:block; font-size:0.73rem; font-weight:800; color:#334155; margin-bottom:3px;">🛫 FECHA Y HORA DE SALIDA (según pasaje o itinerario):</label>
          <input type="datetime-local" id="viat-fecha-salida" value="${fechas.salida}" onchange="recalcularTiempoYComisionados()" style="width:100% !important; max-width:100% !important; min-width:0 !important; box-sizing:border-box !important; padding:9px 10px; border-radius:12px; border:1.5px solid #0F172A; font-weight:700; font-size:0.82rem; background:#FFFFFF;" />
        </div>
        <div style="width:100% !important; max-width:100% !important; min-width:0 !important; overflow:hidden;">
          <label style="display:block; font-size:0.73rem; font-weight:800; color:#334155; margin-bottom:3px;">🛬 FECHA Y HORA DE RETORNO:</label>
          <input type="datetime-local" id="viat-fecha-retorno" value="${fechas.retorno}" onchange="recalcularTiempoYComisionados()" style="width:100% !important; max-width:100% !important; min-width:0 !important; box-sizing:border-box !important; padding:9px 10px; border-radius:12px; border:1.5px solid #0F172A; font-weight:700; font-size:0.82rem; background:#FFFFFF;" />
        </div>
      </div>

      <div style="margin-bottom:10px; width:100%; max-width:100%; min-width:0;">
        <label style="display:block; font-size:0.73rem; font-weight:800; color:#334155; margin-bottom:3px;">MOTIVO DE LA DILIGENCIA O COMISIÓN DE CONTROL:</label>
        <input type="text" id="viat-motivo" value="Visita de control funcional e investigación preliminar" style="width:100% !important; max-width:100% !important; min-width:0 !important; box-sizing:border-box !important; padding:9px 10px; border-radius:12px; border:1.5px solid #CBD5E1; font-weight:700; font-size:0.82rem; background:#FFFFFF;" />
      </div>

      <div id="panel-resumen-tiempo-viaticos" style="background:linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%); color:#0F172A; border:1.5px solid #F59E0B; border-radius:14px; padding:10px 12px; font-size:0.78rem; line-height:1.4;"></div>
    </div>

    <!-- PASO 2 DE LA COMISIÓN: AGREGAR COMISIONADOS Y GENERAR PLANILLAS -->
    <div style="background:#FFFFFF; border:1.5px solid #E2E8F0; border-radius:20px; padding:14px;">
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; margin-bottom:10px;">
        <h3 style="font-size:0.95rem; font-weight:800; color:#0F172A;">
          👥 2. Integrantes de la Comisión (<span id="lbl-cant-comisionados">0</span>)
        </h3>
        <div style="display:flex; gap:6px; flex-wrap:wrap;">
          <button type="button" onclick="agregarmeComoComisionadoActivo()" style="background:#F0F8FF; color:#0284C7; border:1.5px solid #BAE6FD; border-radius:12px; padding:8px 11px; font-size:0.75rem; font-weight:800; cursor:pointer;">
            👤 + Incluirme (${p.usuario_dni})
          </button>
          <button type="button" onclick="abrirModalAgregarComisionado()" style="background:linear-gradient(135deg, #FBBF24 0%, #F59E0B 100%); color:#0F172A; border:1.5px solid #D97706; border-radius:12px; padding:8px 12px; font-size:0.76rem; font-weight:800; cursor:pointer;">
            + Añadir otro Integrante
          </button>
        </div>
      </div>

      <table class="anc-list-table">
        <thead>
          <tr>
            <th style="width:42%;">INTEGRANTE / DESPACHO</th>
            <th style="width:33%;">ASIGNACIÓN CALCULADA</th>
            <th style="width:25%;">PLANILLA</th>
          </tr>
        </thead>
        <tbody id="tbody-comisionados-viaticos"></tbody>
      </table>

      <div id="panel-totales-planilla-viaticos" style="margin-top:12px;"></div>

      <!-- Botones de Guardado y Descarga de Planillas -->
      <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:8px; margin-top:12px;">
        <button type="button" onclick="procesarYGuardarPlanillaViaticos()" style="background:#10B981; color:#FFFFFF; border:none; border-radius:12px; padding:11px 8px; font-size:0.78rem; font-weight:800; cursor:pointer; box-shadow:0 3px 10px rgba(16,185,129,0.2);">
          💾 Guardar Comisión
        </button>
        <button type="button" onclick="imprimirReporteComisionActivaPDF()" style="background:linear-gradient(135deg, #FBBF24 0%, #F59E0B 100%); color:#0F172A; border:1.5px solid #D97706; border-radius:12px; padding:11px 8px; font-size:0.78rem; font-weight:800; cursor:pointer;">
          🖨️ Descargar Planillas (PDF)
        </button>
        <button type="button" onclick="exportarComisionActivaExcel()" style="background:#0EA5E9; color:#FFFFFF; border:none; border-radius:12px; padding:11px 8px; font-size:0.78rem; font-weight:800; cursor:pointer;">
          📥 Exportar a Excel
        </button>
      </div>

      <!-- Botón WhatsApp disponible directamente al armar la comisión -->
      <div style="margin-top:10px;">
        <button type="button" class="btn-whatsapp-comision" onclick="enviarComisionActivaWhatsApp()">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="18" height="18" fill="#FFFFFF" style="flex-shrink:0;">
            <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
          </svg>
          <span>Compartir Resumen de la Comisión por WhatsApp</span>
        </button>
      </div>
    </div>
  `;

  recalcularTiempoYComisionados();
}

// Renderiza cada fila de la lista compacta ("LISTA_COMISIONES")
function renderizarFilaCompactaComision(sol, idxReal) {
  const coms = sol.comisionados || [];
  const estadoTemp = evaluarEstadoTemporalComision(sol);
  const fSal = (sol.fecha_hora_salida || "").replace("T", " ");
  const fRet = (sol.fecha_hora_retorno || "").replace("T", " ");

  return `
    <div class="comision-compact-item" onclick="abrirDetalleComisionViaticos(${idxReal})">
      <div style="min-width:0; flex:1;">
        <div style="display:flex; align-items:center; gap:6px; flex-wrap:wrap; margin-bottom:4px;">
          <span style="background:#FEF3C7; color:#92400E; border:1px solid #F59E0B; font-size:0.7rem; font-weight:800; padding:2px 8px; border-radius:8px;">
            ${sol.codigo_planilla}
          </span>
          <strong style="font-size:0.88rem; color:#0F172A;">
            ${sol.origen_comision} → ${sol.destino_comision}
          </strong>
        </div>
        <div style="font-size:0.74rem; color:#475569; line-height:1.38;">
          📅 <strong>Salida:</strong> ${fSal || "-"} • <strong>Retorno:</strong> ${fRet || "-"}
        </div>
        <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap; margin-top:6px;">
          <span class="badge-semaforo ${estadoTemp.claseBadge}" style="font-size:0.66rem; padding:2px 8px;">
            ${estadoTemp.etiqueta}
          </span>
          <span style="font-size:0.72rem; color:#334155; font-weight:700;">
            👥 ${coms.length} integrante(s)
          </span>
        </div>
      </div>

      <div style="text-align:right; flex-shrink:0;">
        <div style="font-size:0.64rem; font-weight:800; color:#64748B;">ASIGNACIÓN</div>
        <div style="font-size:0.98rem; font-weight:800; color:#0F172A;">
          ${window.fmtSoles(sol.monto_total_solicitud)}
        </div>
        <div style="margin-top:4px; font-size:0.72rem; font-weight:800; color:#D97706;">
          Abrir planilla →
        </div>
      </div>
    </div>
  `;
}

// Renderiza la vista de detalle completo de una comisión ("DETALLE_COMISION")
function renderizarTarjetaComisionCreada(sol, idxSol) {
  const coms = sol.comisionados || [];
  const esSinViaticos = sol.tipo_comision === "SIN_VIATICOS_MISMO_DIA";
  const nombreAnexo = esSinViaticos ? "Planilla Anexo 07" : "Planilla Anexo 01";
  const p = window.ANC_STATE?.perfilActivo || {};
  const miDni = String(p.usuario_dni || "").trim();
  const puedeHabilitar = typeof window.puedeHabilitarRendicion === "function" && window.puedeHabilitarRendicion();
  const estadoTemp = evaluarEstadoTemporalComision(sol);
  const fSal = (sol.fecha_hora_salida || "").replace("T", " ");
  const fRet = (sol.fecha_hora_retorno || "").replace("T", " ");

  return `
    <div style="background:#FFFFFF; border:1.5px solid #E2E8F0; border-radius:20px; padding:14px; box-shadow:0 4px 14px rgba(15,23,42,0.04);">
      <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:8px; border-bottom:1px solid #E2E8F0; padding-bottom:12px; margin-bottom:12px;">
        <div style="min-width:0; flex:1;">
          <div style="display:flex; align-items:center; gap:6px; flex-wrap:wrap; margin-bottom:5px;">
            <span style="background:#FEF3C7; color:#92400E; border:1px solid #F59E0B; font-size:0.74rem; font-weight:800; padding:3px 10px; border-radius:8px;">
              Planilla ${sol.codigo_planilla}
            </span>
            <span class="badge-semaforo ${estadoTemp.claseBadge}" style="font-size:0.68rem;">
              ${estadoTemp.etiqueta}
            </span>
          </div>
          <div style="font-size:0.98rem; font-weight:800; color:#0F172A;">
            ${sol.origen_comision} → ${sol.destino_comision}
          </div>
          <div style="font-size:0.75rem; color:#475569; margin-top:4px;">
            <strong>Autorización:</strong> ${sol.documento_autorizacion} • <strong>Transporte:</strong> ${sol.medio_transporte}
          </div>
          <div style="font-size:0.75rem; color:#475569; margin-top:2px;">
            <strong>Salida:</strong> ${fSal} • <strong>Retorno:</strong> ${fRet} (${sol.dias_viatico_reconocidos} día(s) y ${sol.horas_fraccion_reconocidas}h)
          </div>
          <div style="font-size:0.75rem; color:#334155; margin-top:2px;">
            <strong>Motivo:</strong> ${sol.motivo_comision}
          </div>
        </div>
        <div style="text-align:right;">
          <div style="font-size:0.68rem; font-weight:800; color:#64748B;">ASIGNACIÓN TOTAL</div>
          <div style="font-size:1.12rem; font-weight:800; color:#0F172A;">${window.fmtSoles(sol.monto_total_solicitud)}</div>
          <div style="display:flex; gap:6px; margin-top:8px; justify-content:flex-end; flex-wrap:wrap;">
            <button type="button" onclick="imprimirReporteComisionGuardadaPDF(${idxSol})" style="background:linear-gradient(135deg, #FBBF24 0%, #F59E0B 100%); color:#0F172A; border:1px solid #D97706; border-radius:10px; padding:6px 10px; font-size:0.73rem; font-weight:800; cursor:pointer;">
              🖨️ Planillas PDF (${coms.length})
            </button>
            <button type="button" onclick="exportarComisionGuardadaExcel(${idxSol})" style="background:#0EA5E9; color:#FFF; border:none; border-radius:10px; padding:6px 10px; font-size:0.73rem; font-weight:800; cursor:pointer;">
              📥 Excel
            </button>
          </div>
        </div>
      </div>

      <!-- BOTÓN OFICIAL DE WHATSAPP PARA COMPARTIR EL RESUMEN DE LA COMISIÓN -->
      <div style="margin-bottom:14px;">
        <button type="button" class="btn-whatsapp-comision" onclick="enviarComisionGuardadaWhatsApp(${idxSol})">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="18" height="18" fill="#FFFFFF" style="flex-shrink:0;">
            <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
          </svg>
          <span>Compartir Resumen de Comisión por WhatsApp</span>
        </button>
      </div>

      <div style="font-size:0.74rem; font-weight:800; color:#475569; margin-bottom:8px;">
        INTEGRANTES DE LA COMISIÓN (${puedeHabilitar ? 'Jefatura/Admin: Puedes autorizar o bloquear la rendición de cada integrante' : 'Descarga tu planilla individual lista para firmar o pasa a rendir tus gastos'}):
      </div>

      <div style="display:flex; flex-direction:column; gap:8px;">
        ${coms.map((item, idxC) => {
          const hab = Boolean(item.com.rendicion_habilitada);
          const esMiDni = String(item.com.dni || "").trim() === miDni;

          return `
            <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; background:${esMiDni ? '#FFFDF5' : '#F8FAFC'}; padding:10px 12px; border-radius:14px; border:1.5px solid ${esMiDni ? '#FDE68A' : '#E2E8F0'};">
              <div style="font-size:0.78rem; min-width:0; flex:1;">
                <div style="display:flex; align-items:center; gap:6px; flex-wrap:wrap;">
                  <strong style="color:#0F172A;">#${idxC + 1} ${item.com.nombres}</strong>
                  <span style="color:#475569;">(DNI: ${item.com.dni})</span>
                  ${item.com.sede_comisionado ? `<span style="font-size:0.68rem; background:#F1F5F9; color:#0F172A; padding:2px 7px; border-radius:6px; font-weight:700;">${item.com.sede_comisionado}</span>` : ""}
                </div>
                <div style="color:#475569; margin-top:3px;">
                  ${item.com.cargo} • Asignación a recibir: <strong style="color:#0F172A;">${window.fmtSoles(item.calc.totalRecibir)}</strong>
                </div>
                <div style="margin-top:4px;">
                  ${hab
                    ? `<span class="badge-semaforo badge-verde" style="font-size:0.66rem; padding:2px 8px;">🔓 Rendición Autorizada por Jefatura</span>`
                    : `<span class="badge-semaforo badge-amarillo" style="font-size:0.66rem; padding:2px 8px;">🔒 Rendición en espera de autorización de Jefatura</span>`}
                </div>
              </div>

              <div style="display:flex; gap:6px; flex-wrap:wrap; justify-content:flex-end;">
                ${puedeHabilitar ? `
                  <button type="button" onclick="toggleHabilitarRendicionComisionado(${idxSol}, ${idxC})" style="background:${hab ? '#FFF5F6' : '#F2FBF7'}; color:${hab ? '#9F1239' : '#065F46'}; border:1.5px solid ${hab ? '#FECDD3' : '#A7F3D0'}; border-radius:10px; padding:6px 10px; font-size:0.72rem; font-weight:800; cursor:pointer;">
                    ${hab ? '🔒 Bloquear Rendición' : '🔓 Autorizar Rendición'}
                  </button>
                ` : ""}

                <button type="button" onclick="imprimirPlanillaIndividualGuardadaPDF(${idxSol}, ${idxC})" style="background:linear-gradient(135deg, #FBBF24 0%, #F59E0B 100%); color:#0F172A; border:1px solid #D97706; border-radius:10px; padding:6px 10px; font-size:0.72rem; font-weight:800; cursor:pointer;">
                  🖨️ ${nombreAnexo}
                </button>

                <button type="button" onclick="irARendirComisionado(${idxSol}, ${idxC})" style="background:${hab ? '#10B981' : '#94A3B8'}; color:#FFFFFF; border:none; border-radius:10px; padding:6px 10px; font-size:0.72rem; font-weight:800; cursor:pointer;">
                  ${hab ? '📑 Rendir Gastos' : '🔒 Rendir (En espera)'}
                </button>
              </div>
            </div>
          `;
        }).join("")}
      </div>
    </div>
  `;
}

// =========================================================================
// GENERACIÓN EXACTA DEL ANEXO 01 Y ANEXO 07 DE LA DIRECTIVA DE VIÁTICOS V.10
// =========================================================================
function construirHTMLExactoAnexo01o07(datosSol, itemCom, correlativoNum) {
  const cfg = window.ANC_STATE ? window.ANC_STATE.config : { anio_fiscal: 2026, ruc_institucional: "20131370301" };
  const p = window.ANC_STATE ? window.ANC_STATE.perfilActivo : { codigo_dependencia: "ANC", nombre_dependencia: "Sede Central ANC-MP" };
  const com = itemCom.com;
  const calc = itemCom.calc;

  const fSalParts = (datosSol.fecha_hora_salida || "").split("T");
  const fechaSal = fSalParts[0] || "";
  const horaSal = fSalParts[1] || "08:00";

  const fRetParts = (datosSol.fecha_hora_retorno || "").split("T");
  const fechaRet = fRetParts[0] || "";
  const horaRet = fRetParts[1] || "18:00";

  // 1. FORMATO EXACTO ANEXO 07: PLANILLA DE COMISIÓN DE SERVICIOS QUE NO IMPLICA VIÁTICOS (Página 41 Directiva V.10)
  if (datosSol.tipo_comision === "SIN_VIATICOS_MISMO_DIA") {
    return `
      <div class="hoja-oficial">
        ${window.MotorAnexosANC.cabeceraDirectivaHTML("GFIN/DIR-01", "NORMAS PARA LA ENTREGA DE FONDOS POR VIÁTICOS Y ASIGNACIONES PARA LA REALIZACIÓN DE COMISIONES DE SERVICIOS", "10")}
        <div class="titulo-anexo-num">ANEXO 07</div>
        <div class="titulo-anexo-nombre">PLANILLA DE COMISIÓN DE SERVICIOS QUE NO IMPLICA VIÁTICOS</div>
        <div style="text-align:right; font-weight:bold; margin-bottom:6px;">N° ${datosSol.codigo_planilla}-${correlativoNum}</div>

        <table class="tabla-directiva" style="margin-bottom:12px;">
          <tr>
            <td style="width:55%;"><strong>APELLIDOS Y NOMBRES:</strong> ${com.nombres}</td>
            <td style="width:45%;"><strong>CARGO:</strong> ${com.cargo}</td>
          </tr>
          <tr>
            <td><strong>UNIDAD DE ORGANIZACIÓN:</strong> ${com.sede_comisionado || datosSol.nombre_dependencia || p.nombre_dependencia}</td>
            <td><strong>RÉGIMEN / VÍNCULO:</strong> ${com.regimen}</td>
          </tr>
          <tr>
            <td><strong>MNEMÓNICO:</strong> ${datosSol.codigo_dependencia || p.codigo_dependencia}</td>
            <td><strong>LUGAR DE COMISIÓN:</strong> ${datosSol.origen_comision} - ${datosSol.destino_comision}</td>
          </tr>
          <tr>
            <td><strong>DOC. DE AUTORIZACIÓN:</strong> ${datosSol.documento_autorizacion}</td>
            <td>
              <strong>FECHA SALIDA:</strong> ${fechaSal} (${horaSal}) | <strong>FECHA RETORNO:</strong> ${fechaRet} (${horaRet})<br/>
              <strong>TOTAL HORAS:</strong> ${datosSol.total_horas_computadas} h
            </td>
          </tr>
          <tr>
            <td colspan="2"><strong>MOTIVO DE LA COMISIÓN:</strong> ${datosSol.motivo_comision}</td>
          </tr>
        </table>

        <table class="tabla-directiva">
          <thead>
            <tr>
              <th style="width:70%;">CONCEPTO</th>
              <th style="width:30%; text-align:right;">TOTAL (S/)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>ALIMENTOS Y MOVILIDAD LOCAL (Numeral 5.2.1.2 Directiva V.10)</td>
              <td style="text-align:right;">${window.fmtSoles(calc.netoViatico)}</td>
            </tr>
            <tr>
              <td>PEAJES</td>
              <td style="text-align:right;">${window.fmtSoles(com.peajes)}</td>
            </tr>
            <tr>
              <td>COMBUSTIBLE</td>
              <td style="text-align:right;">${window.fmtSoles(com.combustible)}</td>
            </tr>
            <tr>
              <td>PASAJE TERRESTRE / FLUVIAL</td>
              <td style="text-align:right;">${window.fmtSoles(com.pasajes_terrestres)}</td>
            </tr>
            <tr>
              <td>VARIOS</td>
              <td style="text-align:right;">${window.fmtSoles(com.otros_vehiculo)}</td>
            </tr>
            <tr class="fila-total-general">
              <td style="text-align:right;">TOTAL (S/)</td>
              <td style="text-align:right;">${window.fmtSoles(calc.totalRecibir)}</td>
            </tr>
          </tbody>
        </table>

        <div class="bloque-firmas" style="margin-top:65px;">
          <div class="linea-firma">
            <strong>FIRMA DEL COMISIONADO</strong><br/>
            ${com.nombres}<br/>DNI N° ${com.dni}
          </div>
          <div class="linea-firma">
            <strong>ENCARGADO ÚNICO DEL MANEJO DE LA CAJA CHICA / TESORERÍA</strong><br/>
            ${datosSol.nombre_dependencia || p.nombre_dependencia}
          </div>
        </div>
      </div>
    `;
  }

  // 2. FORMATO EXACTO ANEXO 01: PLANILLA DE VIÁTICOS Y ASIGNACIONES POR COMISIÓN DE SERVICIOS (Página 35 Directiva V.10)
  const dias = Math.max(1, Number(datosSol.dias_viatico_reconocidos || 1));
  const hospAlimTotal = Number((calc.subtotalViaticoDias + calc.subtotalViaticoHoras - calc.descuentoNoAloj - calc.descuentoEscolta).toFixed(2));
  const hospAlimPorDia = dias > 0 ? Number((hospAlimTotal / dias).toFixed(2)) : hospAlimTotal;
  const movLocalPorDia = dias > 0 ? Number((calc.movLocalTotal / dias).toFixed(2)) : calc.movLocalTotal;

  const celdaDia = (dIndex, valorPorDia, esUnicoDia1 = false) => {
    if (dIndex > dias) return `<td style="text-align:right; color:#94A3B8;">-</td>`;
    if (esUnicoDia1) {
      if (dIndex === 1) return `<td style="text-align:right;">${ (valorPorDia / (dias > 1 ? 2 : 1)).toFixed(2) }</td>`;
      if (dIndex === dias && dias > 1) return `<td style="text-align:right;">${ (valorPorDia / 2).toFixed(2) }</td>`;
      return `<td style="text-align:right;">0.00</td>`;
    }
    return `<td style="text-align:right;">${valorPorDia.toFixed(2)}</td>`;
  };

  return `
    <div class="hoja-oficial">
      ${window.MotorAnexosANC.cabeceraDirectivaHTML("GFIN/DIR-01", "NORMAS PARA LA ENTREGA DE FONDOS POR VIÁTICOS Y ASIGNACIONES PARA LA REALIZACIÓN DE COMISIONES DE SERVICIOS", "10")}
      <div class="titulo-anexo-num">ANEXO 01</div>
      <div class="titulo-anexo-nombre">PLANILLA DE VIÁTICOS Y ASIGNACIONES POR COMISIÓN DE SERVICIOS</div>
      <div style="text-align:right; font-weight:bold; margin-bottom:6px;">PLANILLA N° ${datosSol.codigo_planilla}-${correlativoNum}</div>

      <table class="tabla-directiva" style="margin-bottom:10px;">
        <tr>
          <td style="width:52%;"><strong>Apellidos y Nombres:</strong> ${com.nombres}</td>
          <td style="width:24%;"><strong>D.N.I.:</strong> ${com.dni}</td>
          <td style="width:24%;"><strong>Régimen:</strong> ${com.regimen}</td>
        </tr>
        <tr>
          <td><strong>Unidad de organización:</strong> ${com.sede_comisionado || datosSol.nombre_dependencia || p.nombre_dependencia}</td>
          <td><strong>Cargo:</strong> ${com.cargo}</td>
          <td><strong>Mnemónico:</strong> ${datosSol.codigo_dependencia || p.codigo_dependencia}</td>
        </tr>
        <tr>
          <td><strong>Lugar de la comisión:</strong> ${datosSol.origen_comision} → ${datosSol.destino_comision} (${datosSol.medio_transporte})</td>
          <td colspan="2"><strong>Documento que autoriza:</strong> ${datosSol.documento_autorizacion}</td>
        </tr>
        <tr>
          <td><strong>Motivo de la comisión:</strong> ${datosSol.motivo_comision}</td>
          <td><strong>Fecha/Hora Salida:</strong> ${fechaSal} ${horaSal}</td>
          <td><strong>Fecha/Hora Retorno:</strong> ${fechaRet} ${horaRet} (${datosSol.total_horas_computadas}h)</td>
        </tr>
      </table>

      <table class="tabla-directiva">
        <thead>
          <tr>
            <th rowspan="2" style="width:16%;">GRUPO</th>
            <th rowspan="2" style="width:28%;">CONCEPTO</th>
            <th colspan="6" style="text-align:center;">DÍAS DE COMISIÓN</th>
            <th rowspan="2" style="width:14%; text-align:right;">TOTAL (S/)</th>
          </tr>
          <tr>
            <th style="text-align:center; width:7%;">1</th>
            <th style="text-align:center; width:7%;">2</th>
            <th style="text-align:center; width:7%;">3</th>
            <th style="text-align:center; width:7%;">4</th>
            <th style="text-align:center; width:7%;">5</th>
            <th style="text-align:center; width:7%;">6+</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td rowspan="4"><strong>Viáticos</strong><br/><small>${calc.etiquetaEscala}</small></td>
            <td>Hospedaje y Alimentación</td>
            ${celdaDia(1, hospAlimPorDia)}
            ${celdaDia(2, hospAlimPorDia)}
            ${celdaDia(3, hospAlimPorDia)}
            ${celdaDia(4, hospAlimPorDia)}
            ${celdaDia(5, hospAlimPorDia)}
            ${celdaDia(6, hospAlimPorDia)}
            <td style="text-align:right; font-weight:bold;">${hospAlimTotal.toFixed(2)}</td>
          </tr>
          <tr>
            <td>Movilidad Local</td>
            ${celdaDia(1, movLocalPorDia)}
            ${celdaDia(2, movLocalPorDia)}
            ${celdaDia(3, movLocalPorDia)}
            ${celdaDia(4, movLocalPorDia)}
            ${celdaDia(5, movLocalPorDia)}
            ${celdaDia(6, movLocalPorDia)}
            <td style="text-align:right; font-weight:bold;">${calc.movLocalTotal.toFixed(2)}</td>
          </tr>
          <tr>
            <td>Movilidad / Embarque (Aeropuerto / Terrapuerto)</td>
            ${celdaDia(1, calc.movEmbarqueTotal, true)}
            ${celdaDia(2, calc.movEmbarqueTotal, true)}
            ${celdaDia(3, calc.movEmbarqueTotal, true)}
            ${celdaDia(4, calc.movEmbarqueTotal, true)}
            ${celdaDia(5, calc.movEmbarqueTotal, true)}
            ${celdaDia(6, calc.movEmbarqueTotal, true)}
            <td style="text-align:right; font-weight:bold;">${calc.movEmbarqueTotal.toFixed(2)}</td>
          </tr>
          <tr class="fila-subtotal">
            <td>SUB TOTAL VIÁTICOS</td>
            <td colspan="6" style="text-align:right; font-size:9.5px;">Tope Máx. Declaración Jurada (${calc.pctMaxDJ}%): ${window.fmtSoles(calc.topeMaxDJ)}</td>
            <td style="text-align:right;">${calc.netoViatico.toFixed(2)}</td>
          </tr>
          <tr>
            <td rowspan="4"><strong>Otras Asignaciones</strong></td>
            <td>Pasajes (Terrestres / Fluviales)</td>
            <td colspan="6" style="text-align:center; color:#64748B;">Según itinerario autorizado</td>
            <td style="text-align:right;">${Number(com.pasajes_terrestres || 0).toFixed(2)}</td>
          </tr>
          <tr>
            <td>Combustible</td>
            <td colspan="6" style="text-align:center; color:#64748B;">${datosSol.placa_vehiculo_oficial ? 'Vehículo Oficial Placa: ' + datosSol.placa_vehiculo_oficial : '-'}</td>
            <td style="text-align:right;">${Number(com.combustible || 0).toFixed(2)}</td>
          </tr>
          <tr>
            <td>Peajes</td>
            <td colspan="6" style="text-align:center; color:#64748B;">-</td>
            <td style="text-align:right;">${Number(com.peajes || 0).toFixed(2)}</td>
          </tr>
          <tr>
            <td>Otros</td>
            <td colspan="6" style="text-align:center; color:#64748B;">-</td>
            <td style="text-align:right;">${Number(com.otros_vehiculo || 0).toFixed(2)}</td>
          </tr>
          <tr class="fila-total-general">
            <td colspan="8" style="text-align:right;">TOTAL GENERAL DE LA PLANILLA (S/)</td>
            <td style="text-align:right;">${window.fmtSoles(calc.totalRecibir)}</td>
          </tr>
        </tbody>
      </table>

      <div class="notas-pie">
        <strong>NOTA (Anexo 01 Directiva V.10 + Resolución N° 000038-2025-MP-FN-GG-OGFIN):</strong><br/>
        a) La Rendición de Cuentas deberá ser presentada dentro de los 10 días hábiles después de culminada la comisión (15 días calendario en el exterior). En caso de incumplimiento autorizo se me establezca responsabilidad económica y descuento.<br/>
        b) De existir saldo, el comisionado debe devolver el dinero dentro de los cinco (05) días calendario contados desde la culminación de la comisión, recibiendo el "Recibo de Caja" (Anexo 05).<br/>
        c) La Declaración Jurada solo será aplicable hasta el ${calc.pctMaxDJ}% (${window.fmtSoles(calc.topeMaxDJ)}) utilizando el Anexo 02 / Anexo 03.<br/>
        d) Los gastos de alojamiento y alimentación deberán ser sustentados con comprobantes reconocidos por SUNAT emitidos a nombre de la Entidad (RUC ${cfg.ruc_institucional}) utilizando el Anexo 04.<br/>
        e) <strong>Res. N° 000038-2025-MP-FN-GG-OGFIN:</strong> No se reconocerán gastos por el otorgamiento de propinas en comprobantes de consumo, alojamiento o movilidad.<br/>
        f) El gasto en alojamiento es obligatorio; caso contrario procederá a devolver S/ 80.00 o S/ 40.00 por día no sustentado, según corresponda.
      </div>

      <div class="bloque-firmas">
        <div class="linea-firma">
          <strong>Firma del Comisionado</strong><br/>
          ${com.nombres}<br/>D.N.I. N° ${com.dni}
        </div>
        <div class="linea-firma">
          <strong>Sello de Pagado Caja Chica / Tesorería</strong><br/>
          ${datosSol.nombre_dependencia || p.nombre_dependencia}
        </div>
        <div class="linea-firma">
          <strong>Autorizado (Jefatura / OCA / Administración)</strong><br/>
          UE 012: ANC-MP
        </div>
      </div>
    </div>
  `;
}

// Funciones de impresión individual y grupal
window.imprimirPlanillaIndividualEnCursoPDF = function(idxCom) {
  const com = window.VIATICOS_STATE.comisionados[idxCom];
  if (!com) return;
  const calc = calcularMontosIndividualComisionado(com);
  const datosSol = recolectarDatosFormularioComisionActiva();
  const html = construirHTMLExactoAnexo01o07(datosSol, { com, calc }, `0${idxCom + 1}`);
  window.MotorAnexosANC.imprimirDocumentoOficial(`Planilla_Individual_${com.dni}`, html, "portrait");
};

window.imprimirReporteComisionActivaPDF = function() {
  if (window.VIATICOS_STATE.comisionados.length === 0) {
    alert("⚠️ Añade al menos un integrante a la comisión para descargar las planillas en PDF.");
    return;
  }
  const datosSol = recolectarDatosFormularioComisionActiva();
  const hojas = window.VIATICOS_STATE.comisionados.map((com, idx) => {
    const calc = calcularMontosIndividualComisionado(com);
    return construirHTMLExactoAnexo01o07(datosSol, { com, calc }, `0${idx + 1}`);
  }).join("");
  window.MotorAnexosANC.imprimirDocumentoOficial(`Comision_${datosSol.codigo_planilla}`, hojas, "portrait");
};

window.imprimirPlanillaIndividualGuardadaPDF = function(idxSol, idxCom) {
  const sol = window.VIATICOS_STATE.comisionesCreadas[idxSol];
  if (!sol || !sol.comisionados || !sol.comisionados[idxCom]) return;
  const html = construirHTMLExactoAnexo01o07(sol, sol.comisionados[idxCom], `0${idxCom + 1}`);
  window.MotorAnexosANC.imprimirDocumentoOficial(`Planilla_${sol.codigo_planilla}_${sol.comisionados[idxCom].com.dni}`, html, "portrait");
};

window.imprimirReporteComisionGuardadaPDF = function(idxSol) {
  const sol = window.VIATICOS_STATE.comisionesCreadas[idxSol];
  if (!sol || !sol.comisionados) return;
  const hojas = sol.comisionados.map((item, idx) => construirHTMLExactoAnexo01o07(sol, item, `0${idx + 1}`)).join("");
  window.MotorAnexosANC.imprimirDocumentoOficial(`Comision_Completa_${sol.codigo_planilla}`, hojas, "portrait");
};

window.exportarComisionActivaExcel = function() {
  if (window.VIATICOS_STATE.comisionados.length === 0) {
    alert("⚠️ No hay integrantes registrados en la comisión actual.");
    return;
  }
  const sol = recolectarDatosFormularioComisionActiva();
  const items = window.VIATICOS_STATE.comisionados.map(c => ({ com: c, calc: calcularMontosIndividualComisionado(c) }));
  generarArchivoExcelComision(sol, items);
};

window.exportarComisionGuardadaExcel = function(idxSol) {
  const sol = window.VIATICOS_STATE.comisionesCreadas[idxSol];
  if (!sol) return;
  generarArchivoExcelComision(sol, sol.comisionados || []);
};

function generarArchivoExcelComision(sol, items) {
  const cabeceras = ["CODIGO_PLANILLA", "DEPENDENCIA", "DOC_AUTORIZACION", "ORIGEN", "DESTINO", "TRANSPORTE", "SALIDA", "RETORNO", "DIAS", "HORAS_FRACCION", "DNI_COMISIONADO", "APELLIDOS_NOMBRES", "CARGO", "SEDE_COMISIONADO", "RENDICION_HABILITADA", "VIATICO_NETO_SOLES", "MOV_LOCAL", "MOV_EMBARQUE", "OTRAS_ASIGNACIONES", "TOTAL_RECIBIR_SOLES", "TOPE_MAX_DJ_SOLES"];
  const filas = items.map(it => [
    sol.codigo_planilla,
    sol.nombre_dependencia,
    sol.documento_autorizacion,
    sol.origen_comision,
    sol.destino_comision,
    sol.medio_transporte,
    sol.fecha_hora_salida,
    sol.fecha_hora_retorno,
    sol.dias_viatico_reconocidos,
    sol.horas_fraccion_reconocidas,
    it.com.dni,
    it.com.nombres,
    it.com.cargo,
    it.com.sede_comisionado || sol.nombre_dependencia,
    it.com.rendicion_habilitada ? "HABILITADA" : "PENDIENTE",
    it.calc.netoViatico,
    it.calc.movLocalTotal,
    it.calc.movEmbarqueTotal,
    it.calc.otrasAsignaciones,
    it.calc.totalRecibir,
    it.calc.topeMaxDJ
  ]);
  window.MotorAnexosANC.exportarExcelCSV(`Planilla_Comision_${sol.codigo_planilla}.csv`, cabeceras, filas);
}

window.irARendirComisionado = function(idxSol, idxCom) {
  const sol = window.VIATICOS_STATE.comisionesCreadas[idxSol];
  if (!sol || !sol.comisionados || !sol.comisionados[idxCom]) return;
  const item = sol.comisionados[idxCom];

  localStorage.setItem("anc_rendicion_seleccionada_v1", JSON.stringify({
    idxSol,
    idxCom,
    codigo_planilla: sol.codigo_planilla,
    solicitud: sol,
    comisionadoItem: item
  }));

  if (!item.com.rendicion_habilitada) {
    alert(`🔒 RENDICIÓN EN ESPERA DE AUTORIZACIÓN:\nEl integrante ${item.com.nombres} (DNI: ${item.com.dni}) aún no cuenta con la habilitación de Jefatura para enviar su rendición.\n\nEn la siguiente pantalla podrás consultar el plazo disponible en el contómetro, y una vez que Jefatura lo autorice podrás registrar tus comprobantes.`);
  }

  navegarVista("rendicion-viaticos");
};

function obtenerValorOrigenFormulario() {
  const p = window.ANC_STATE?.perfilActivo || {};
  const selOrigen = document.getElementById("viat-origen-select");
  const inpManual = document.getElementById("viat-origen-manual");
  if (selOrigen) {
    if (selOrigen.value === "OTRO_ORIGEN") {
      return (inpManual && inpManual.value.trim()) ? inpManual.value.trim() : "Otro Origen";
    }
    return selOrigen.value;
  }
  return document.getElementById("viat-origen")?.value || p.sede_ubicacion || "Lima";
}

function obtenerValorDestinoFormulario(tipo) {
  if (tipo === "INTERNACIONAL_USD") {
    return `${document.getElementById("viat-zona-ext")?.value} - ${document.getElementById("viat-ciudad-ext")?.value}`;
  }
  const selDest = document.getElementById("viat-destino-select");
  const inpManual = document.getElementById("viat-destino-manual");
  if (selDest) {
    if (selDest.value === "OTRO_DESTINO") {
      return (inpManual && inpManual.value.trim()) ? inpManual.value.trim() : "Otro Destino";
    }
    return selDest.value;
  }
  return "Arequipa";
}

function recolectarDatosFormularioComisionActiva() {
  const p = window.ANC_STATE.perfilActivo;
  const cfg = window.ANC_STATE.config;
  const t = window.VIATICOS_STATE.ultimoCalculoTiempo;
  const tipo = document.getElementById("viat-tipo-comision")?.value || "NACIONAL_FUERA_DF";
  const origen = obtenerValorOrigenFormulario();
  const destino = obtenerValorDestinoFormulario(tipo);

  return {
    codigo_planilla: `PV-${cfg.anio_fiscal}-${String(window.VIATICOS_STATE.comisionesCreadas.length + 1).padStart(3, "0")}`,
    anio_fiscal: cfg.anio_fiscal,
    unidad_organica_id: p.unidad_id,
    codigo_dependencia: p.codigo_dependencia,
    nombre_dependencia: p.nombre_dependencia,
    usuario_creador: p.usuario_nombre,
    usuario_creador_dni: p.usuario_dni,
    tipo_comision: tipo,
    documento_autorizacion: document.getElementById("viat-doc-autoriza")?.value || "S/D",
    motivo_comision: document.getElementById("viat-motivo")?.value || "Comisión oficial",
    origen_comision: origen,
    destino_comision: destino,
    medio_transporte: document.getElementById("viat-medio-transporte")?.value || "AEREO",
    placa_vehiculo_oficial: document.getElementById("viat-placa-oficial")?.value || null,
    conductor_vehiculo_oficial: document.getElementById("viat-conductor-oficial")?.value || null,
    fecha_hora_salida: document.getElementById("viat-fecha-salida")?.value || "",
    fecha_hora_retorno: document.getElementById("viat-fecha-retorno")?.value || "",
    horas_traslado_terminal: t.horasTrasladoTerminal,
    total_horas_computadas: t.totalHorasComputadas,
    dias_viatico_reconocidos: t.diasReconocidos,
    horas_fraccion_reconocidas: t.horasFraccion
  };
}

// =========================================================================
// MODAL CÁLIDO DE COMISIONADOS (PERMITE INCLUIR FISCALES O SERVIDORES DE OTRAS SEDES)
// =========================================================================
function crearModalComisionadoDOM() {
  if (document.getElementById("modal-agregar-comisionado")) return;

  const modalDiv = document.createElement("div");
  modalDiv.className = "modal-overlay";
  modalDiv.id = "modal-agregar-comisionado";
  modalDiv.innerHTML = `
    <div class="modal-card-wrapper">
      <div class="modal-top-bar">
        <button type="button" class="btn-modal-back" onclick="cerrarModalAgregarComisionado()">←</button>
        <span class="modal-title">Añadir Integrante a la Comisión</span>
        <span class="modal-correlativo-pill" id="pill-num-comisionado">#01</span>
      </div>

      <div class="modal-body-content">
        <div style="margin-bottom:10px;">
          <label style="display:block; font-size:0.73rem; font-weight:800; color:#0F172A; margin-bottom:4px;">CARGO O NIVEL PARA CÁLCULO DE TARIFA DIARIA:</label>
          <select id="com-nivel-escala" style="width:100% !important; max-width:100% !important; min-width:0 !important; box-sizing:border-box !important; padding:10px; border-radius:12px; border:1.5px solid #F59E0B; font-weight:800; font-size:0.81rem; background:#FFFDF5; color:#0F172A;">
            <option value="NIVEL_2">Escala Estándar: Fiscal Adjunto Superior, Fiscal Provincial, Adjunto Provincial, Especialistas y Administrativos (S/ 320 por día Nacional | S/ 130 interior sede)</option>
            <option value="NIVEL_1">Escala Alta Dirección / Superior: Jefe Nacional ANC, Fiscal Supremo, Adjunto Supremo, Fiscal Superior y Jefe OCA (S/ 380 por día Nacional | S/ 150 interior sede)</option>
          </select>
        </div>

        <div style="display:grid; grid-template-columns:2fr 1fr; gap:8px; margin-bottom:10px;">
          <div>
            <label style="display:block; font-size:0.73rem; font-weight:800; color:#334155; margin-bottom:3px;">APELLIDOS Y NOMBRES:</label>
            <input type="text" id="com-nombres" placeholder="Ej: Dra. María Gómez" style="width:100% !important; max-width:100% !important; min-width:0 !important; box-sizing:border-box !important; padding:9px; border-radius:12px; border:1.5px solid #CBD5E1; font-weight:700; font-size:0.83rem; background:#FFFFFF;" />
          </div>
          <div>
            <label style="display:block; font-size:0.73rem; font-weight:800; color:#334155; margin-bottom:3px;">N° DE DNI:</label>
            <input type="text" id="com-dni" maxlength="12" placeholder="8 dígitos" style="width:100% !important; max-width:100% !important; min-width:0 !important; box-sizing:border-box !important; padding:9px; border-radius:12px; border:1.5px solid #0F172A; font-weight:800; font-size:0.83rem; background:#FFFFFF;" />
          </div>
        </div>

        <div style="margin-bottom:10px;">
          <label style="display:block; font-size:0.73rem; font-weight:800; color:#334155; margin-bottom:3px;">DESPACHO, DIRECCIÓN O SEDE ADC DE ORIGEN:</label>
          <input type="text" id="com-sede-origen" placeholder="Ej: Lima - Sede Central / ADC Arequipa" style="width:100% !important; max-width:100% !important; min-width:0 !important; box-sizing:border-box !important; padding:9px; border-radius:12px; border:1.5px solid #CBD5E1; font-weight:700; font-size:0.82rem; background:#FFFFFF;" />
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-bottom:10px;">
          <div>
            <label style="display:block; font-size:0.73rem; font-weight:800; color:#334155; margin-bottom:3px;">CARGO FUNCIONAL:</label>
            <input type="text" id="com-cargo" value="Fiscal de Control / Especialista" style="width:100% !important; max-width:100% !important; min-width:0 !important; box-sizing:border-box !important; padding:9px; border-radius:12px; border:1.5px solid #CBD5E1; font-weight:700; font-size:0.82rem; background:#FFFFFF;" />
          </div>
          <div>
            <label style="display:block; font-size:0.73rem; font-weight:800; color:#334155; margin-bottom:3px;">RÉGIMEN LABORAL:</label>
            <select id="com-regimen" style="width:100% !important; max-width:100% !important; min-width:0 !important; box-sizing:border-box !important; padding:9px; border-radius:12px; border:1.5px solid #CBD5E1; font-weight:700; font-size:0.82rem; background:#FFFFFF;">
              <option value="Carrera Fiscal">Carrera Fiscal (Magistrado)</option>
              <option value="D.L. 728">D.L. N° 728</option>
              <option value="D.L. 276">D.L. N° 276</option>
              <option value="D.L. 1057 (CAS)">D.L. N° 1057 (CAS)</option>
              <option value="Locador / Proveedor de Servicios (Con TDR)">Locador / Tercero</option>
              <option value="Escolta / Seguridad">Escolta / Seguridad</option>
            </select>
          </div>
        </div>

        <div style="background:#FFFDF5; border:1.5px solid #FDE68A; border-radius:14px; padding:10px 12px; margin-bottom:12px; font-size:0.76rem; line-height:1.38;">
          <label style="display:flex; align-items:flex-start; gap:8px; font-weight:800; color:#0F172A; margin-bottom:6px; cursor:pointer;">
            <input type="checkbox" id="com-sustenta-alojamiento" checked style="width:16px !important; height:16px !important; margin-top:2px; flex-shrink:0;" />
            <span>Presentará boleta o factura de Hotel / Hospedaje <span style="font-weight:600; color:#475569;">(Si no requiere hotel, se descuenta S/ 80 por día nacional o S/ 40 en viaje interno)</span></span>
          </label>
          <label style="display:flex; align-items:flex-start; gap:8px; font-weight:700; color:#78350F; cursor:pointer;">
            <input type="checkbox" id="com-es-escolta" style="width:16px !important; height:16px !important; margin-top:2px; flex-shrink:0;" />
            <span>¿Es personal policial de Escolta / Seguridad? <span style="font-weight:600;">(Deduce S/ 50.00/día por rancho policial según D.S. 013-2013-EF)</span></span>
          </label>
        </div>

        <div class="dark-calc-panel" style="margin-bottom:12px; padding:12px;">
          <div class="calc-label-top" style="margin-bottom:8px;">CONCEPTOS ADICIONALES DE TRANSPORTE (OPCIONAL EN S/)</div>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px;">
            <div>
              <label style="display:block; font-size:0.68rem; color:#FDE68A; font-weight:800; margin-bottom:2px;">PASAJE TERRESTRE / FLUVIAL:</label>
              <input type="number" id="com-pasajes" value="0" min="0" step="5" style="width:100% !important; max-width:100% !important; min-width:0 !important; box-sizing:border-box !important; padding:8px; border-radius:10px; border:1px solid #FBBF24; background:#0F172A; color:#FFF; font-weight:800;" />
            </div>
            <div>
              <label style="display:block; font-size:0.68rem; color:#FDE68A; font-weight:800; margin-bottom:2px;">COMBUSTIBLE VEH. OFICIAL:</label>
              <input type="number" id="com-combustible" value="0" min="0" step="10" style="width:100% !important; max-width:100% !important; min-width:0 !important; box-sizing:border-box !important; padding:8px; border-radius:10px; border:1px solid #FBBF24; background:#0F172A; color:#FFF; font-weight:800;" />
            </div>
            <div>
              <label style="display:block; font-size:0.68rem; color:#FDE68A; font-weight:800; margin-bottom:2px;">PEAJES ESTIMADOS:</label>
              <input type="number" id="com-peajes" value="0" min="0" step="5" style="width:100% !important; max-width:100% !important; min-width:0 !important; box-sizing:border-box !important; padding:8px; border-radius:10px; border:1px solid #FBBF24; background:#0F172A; color:#FFF; font-weight:800;" />
            </div>
            <div>
              <label style="display:block; font-size:0.68rem; color:#FDE68A; font-weight:800; margin-bottom:2px;">COCHERA / OTROS:</label>
              <input type="number" id="com-otros" value="0" min="0" step="5" style="width:100% !important; max-width:100% !important; min-width:0 !important; box-sizing:border-box !important; padding:8px; border-radius:10px; border:1px solid #FBBF24; background:#0F172A; color:#FFF; font-weight:800;" />
            </div>
          </div>
        </div>

        <button type="button" onclick="confirmarAgregarComisionado()" style="width:100%; background:linear-gradient(135deg, #FBBF24 0%, #F59E0B 100%); color:#0F172A; border:1.5px solid #D97706; border-radius:14px; padding:12px; font-size:0.9rem; font-weight:800; cursor:pointer; box-shadow:0 4px 12px rgba(245,158,11,0.25);">
          ✓ Añadir Integrante a la Comisión
        </button>
      </div>
    </div>
  `;
  document.body.appendChild(modalDiv);
}

window.abrirModalAgregarComisionado = function() {
  crearModalComisionadoDOM();
  const p = window.ANC_STATE?.perfilActivo || {};
  const num = window.VIATICOS_STATE.comisionados.length + 1;
  document.getElementById("pill-num-comisionado").textContent = `#0${num}`;
  document.getElementById("com-nombres").value = "";
  document.getElementById("com-dni").value = "";
  document.getElementById("com-sede-origen").value = p.nombre_dependencia || "Lima - Sede Central";
  document.getElementById("com-pasajes").value = "0";
  document.getElementById("com-combustible").value = "0";
  document.getElementById("com-peajes").value = "0";
  document.getElementById("com-otros").value = "0";
  document.getElementById("modal-agregar-comisionado").classList.add("open");
  if (typeof window.registrarEstadoHistorialANC === "function") {
    window.registrarEstadoHistorialANC({ modal: "agregar-comisionado" });
  }
};

window.cerrarModalAgregarComisionado = function() {
  const m = document.getElementById("modal-agregar-comisionado");
  if (m) m.classList.remove("open");
};

// Botón rápido para incluirse a sí mismo con su DNI activo
window.agregarmeComoComisionadoActivo = function() {
  const p = window.ANC_STATE?.perfilActivo || {};
  const yaExiste = window.VIATICOS_STATE.comisionados.some(c => String(c.dni) === String(p.usuario_dni));
  if (yaExiste) {
    alert(`ℹ️ Ya te encuentras incluido en esta comisión (${p.usuario_nombre} • DNI: ${p.usuario_dni}).`);
    return;
  }

  window.VIATICOS_STATE.comisionados.push({
    id_temp: Date.now(),
    dni: p.usuario_dni || "45000001",
    nombres: p.usuario_nombre || "Usuario Operador ANC",
    cargo: "Fiscal de Control / Especialista ANC-MP",
    regimen: p.regimen_vinculo || "Carrera Fiscal",
    sede_comisionado: p.nombre_dependencia || "Lima - Sede Central",
    rendicion_habilitada: false, // Por defecto false hasta que Jefatura lo autorice
    nivel_escala: "NIVEL_2",
    sustenta_alojamiento: true,
    es_escolta_seguridad: false,
    pasajes_terrestres: 0,
    combustible: 0,
    peajes: 0,
    otros_vehiculo: 0
  });

  recalcularTiempoYComisionados();
};

window.confirmarAgregarComisionado = function() {
  const p = window.ANC_STATE?.perfilActivo || {};
  const nombres = document.getElementById("com-nombres").value.trim() || `Comisionado ANC #${window.VIATICOS_STATE.comisionados.length + 1}`;
  const dni = document.getElementById("com-dni").value.trim() || "45000001";
  const sedeOrigen = document.getElementById("com-sede-origen").value.trim() || p.nombre_dependencia || "Sede ANC-MP";
  const cargo = document.getElementById("com-cargo").value.trim() || "Fiscal de Control / Especialista";
  const regimen = document.getElementById("com-regimen").value;
  const nivel = document.getElementById("com-nivel-escala").value;
  const sustentaAloj = document.getElementById("com-sustenta-alojamiento").checked;
  const esEscolta = document.getElementById("com-es-escolta").checked || regimen === "Escolta / Seguridad";

  window.VIATICOS_STATE.comisionados.push({
    id_temp: Date.now(),
    dni,
    nombres,
    cargo,
    regimen,
    sede_comisionado: sedeOrigen,
    rendicion_habilitada: false, // Por defecto false hasta que Jefatura lo autorice
    nivel_escala: nivel,
    sustenta_alojamiento: sustentaAloj,
    es_escolta_seguridad: esEscolta,
    pasajes_terrestres: Number(document.getElementById("com-pasajes").value) || 0,
    combustible: Number(document.getElementById("com-combustible").value) || 0,
    peajes: Number(document.getElementById("com-peajes").value) || 0,
    otros_vehiculo: Number(document.getElementById("com-otros").value) || 0
  });

  cerrarModalAgregarComisionado();
  recalcularTiempoYComisionados();
};

window.eliminarComisionadoViatico = function(idTemp) {
  window.VIATICOS_STATE.comisionados = window.VIATICOS_STATE.comisionados.filter(c => c.id_temp !== idTemp);
  recalcularTiempoYComisionados();
};

window.alCambiarModalidadViatico = function() {
  const tipo = document.getElementById("viat-tipo-comision").value;
  const bNac = document.getElementById("bloque-destino-nacional");
  const bInt = document.getElementById("bloque-zona-internacional");
  if (bNac && bInt) {
    bNac.style.display = tipo === "INTERNACIONAL_USD" ? "none" : "grid";
    bInt.style.display = tipo === "INTERNACIONAL_USD" ? "grid" : "none";
  }
  recalcularTiempoYComisionados();
};

window.alSeleccionarOrigenViatico = function() {
  const sel = document.getElementById("viat-origen-select");
  const inpManual = document.getElementById("viat-origen-manual");
  if (sel && inpManual) {
    if (sel.value === "OTRO_ORIGEN") {
      inpManual.style.display = "block";
      inpManual.focus();
    } else {
      inpManual.style.display = "none";
    }
  }
  recalcularTiempoYComisionados();
};

window.alSeleccionarRutaAnexo08 = function() {
  const sel = document.getElementById("viat-destino-select");
  const inpManual = document.getElementById("viat-destino-manual");
  if (sel && inpManual) {
    if (sel.value === "OTRO_DESTINO") {
      inpManual.style.display = "block";
      inpManual.focus();
    } else {
      inpManual.style.display = "none";
    }
  }
  recalcularTiempoYComisionados();
};

window.recalcularTiempoYComisionados = function() {
  const tipoComision = document.getElementById("viat-tipo-comision")?.value || "NACIONAL_FUERA_DF";
  const medio = document.getElementById("viat-medio-transporte")?.value || "AEREO";
  const fSalidaStr = document.getElementById("viat-fecha-salida")?.value;
  const fRetornoStr = document.getElementById("viat-fecha-retorno")?.value;

  const bVeh = document.getElementById("bloque-vehiculo-oficial");
  if (bVeh) bVeh.style.display = medio === "VEHICULO_OFICIAL" ? "block" : "none";

  const dSalida = fSalidaStr ? new Date(fSalidaStr) : new Date();
  const dRetorno = fRetornoStr ? new Date(fRetornoStr) : new Date(dSalida.getTime() + 36 * 3600 * 1000);

  let diffHoras = Math.max(0, (dRetorno.getTime() - dSalida.getTime()) / (1000 * 3600));
  let horasTerminal = 0;
  if (tipoComision === "NACIONAL_FUERA_DF" || tipoComision === "INTERNO_ADC_DF") {
    if (medio === "AEREO") horasTerminal = 4;
    else if (medio === "TERRESTRE" || medio === "FLUVIAL") horasTerminal = 2;
  }

  const totalHoras = diffHoras + horasTerminal;
  let diasViatico = 0;
  let horasFraccion = 0;

  if (tipoComision === "SIN_VIATICOS_MISMO_DIA") {
    diasViatico = 1;
  } else {
    const bloques24 = Math.floor(totalHoras / 24);
    const restoHoras = totalHoras - (bloques24 * 24);
    if (bloques24 === 0) {
      if (totalHoras >= 4) diasViatico = 1;
      else horasFraccion = Math.min(3, Math.ceil(totalHoras));
    } else {
      diasViatico = bloques24;
      if (restoHoras >= 4) diasViatico += 1;
      else if (restoHoras >= 1) horasFraccion = Math.min(3, Math.floor(restoHoras));
    }
  }

  const topeDiasNorma = tipoComision === "NACIONAL_FUERA_DF" ? 5 : (tipoComision === "INTERNO_ADC_DF" ? 10 : 15);
  window.VIATICOS_STATE.ultimoCalculoTiempo = {
    horasEfectivasViaje: Number(diffHoras.toFixed(1)),
    horasTrasladoTerminal: horasTerminal,
    totalHorasComputadas: Number(totalHoras.toFixed(1)),
    diasReconocidos: diasViatico,
    horasFraccion: horasFraccion,
    excedeTopeDias: diasViatico > topeDiasNorma,
    topeMaximoDiasNorma: topeDiasNorma
  };

  const panelTiempo = document.getElementById("panel-resumen-tiempo-viaticos");
  if (panelTiempo) {
    panelTiempo.innerHTML = `⏱️ <strong>Cálculo automático de tu comisión:</strong> ${diffHoras.toFixed(1)}h de viaje + ${horasTerminal}h de traslado al terminal/aeropuerto = <strong>${totalHoras.toFixed(1)} horas en total</strong> → Se reconoce: <strong style="color:#92400E;">${diasViatico} día(s) completo(s)</strong> y <strong>${horasFraccion} hora(s) adicional(es)</strong>`;
  }

  renderizarTablaYDesgloseComisionados();
};

function calcularMontosIndividualComisionado(com) {
  const tipo = document.getElementById("viat-tipo-comision")?.value || "NACIONAL_FUERA_DF";
  const t = window.VIATICOS_STATE.ultimoCalculoTiempo;
  const tc = Number(window.ANC_STATE?.config?.tipo_cambio_usd || 3.75);

  let tarifaDia = 0, tarifaHora = 0, subtotalViaticoDias = 0, subtotalViaticoHoras = 0;
  let movLocalTotal = 0, movEmbarqueTotal = 0, descuentoNoAloj = 0, descuentoEscolta = 0;
  let pctMaxDJ = 30, etiquetaEscala = "";

  if (tipo === "NACIONAL_FUERA_DF") {
    const esNiv1 = com.nivel_escala === "NIVEL_1" && !com.es_escolta_seguridad;
    tarifaDia = esNiv1 ? 380.00 : 320.00;
    tarifaHora = esNiv1 ? 15.80 : 13.30;
    etiquetaEscala = esNiv1 ? "Escala S/ 380/día" : "Escala S/ 320/día";
    if (t.diasReconocidos === 1) {
      movEmbarqueTotal = esNiv1 ? 100.00 : 80.00;
      movLocalTotal = 14.00;
      subtotalViaticoDias = tarifaDia - movEmbarqueTotal - movLocalTotal;
    } else if (t.diasReconocidos > 1) {
      movEmbarqueTotal = 120.00;
      movLocalTotal = 20.00 * t.diasReconocidos;
      subtotalViaticoDias = (tarifaDia * t.diasReconocidos) - movEmbarqueTotal - movLocalTotal;
    }
    subtotalViaticoHoras = Number((tarifaHora * t.horasFraccion).toFixed(2));
    if (!com.sustenta_alojamiento && t.diasReconocidos > 0) descuentoNoAloj = 80.00 * t.diasReconocidos;
    if (com.es_escolta_seguridad && t.diasReconocidos > 0) descuentoEscolta = 50.00 * t.diasReconocidos;
  } else if (tipo === "INTERNO_ADC_DF") {
    const esNivA = com.nivel_escala === "NIVEL_1";
    tarifaDia = esNivA ? 150.00 : 130.00;
    tarifaHora = esNivA ? 6.30 : 5.40;
    etiquetaEscala = esNivA ? "Interior Sede (S/ 150/d)" : "Interior Sede (S/ 130/d)";
    if (t.diasReconocidos >= 1) {
      movEmbarqueTotal = 20.00;
      movLocalTotal = 15.00 * t.diasReconocidos;
      subtotalViaticoDias = (tarifaDia * t.diasReconocidos) - movEmbarqueTotal - movLocalTotal;
    }
    subtotalViaticoHoras = Number((tarifaHora * t.horasFraccion).toFixed(2));
    if (!com.sustenta_alojamiento && t.diasReconocidos > 0) descuentoNoAloj = 40.00 * t.diasReconocidos;
  } else if (tipo === "SIN_VIATICOS_MISMO_DIA") {
    subtotalViaticoDias = t.totalHorasComputadas >= 8 ? 80.00 : (t.totalHorasComputadas >= 4 ? 40.00 : 0.00);
    etiquetaEscala = t.totalHorasComputadas >= 8 ? "Comisión >8h (S/ 80)" : "Comisión 4-8h (S/ 40)";
    pctMaxDJ = 100;
  } else if (tipo === "INTERNACIONAL_USD") {
    const codZ = document.getElementById("viat-zona-ext")?.value || "AMS";
    const zObj = window.VIATICOS_CATALOGO.zonasInternacionales.find(z => z.codigo === codZ) || window.VIATICOS_CATALOGO.zonasInternacionales[0];
    const esAltaDir = com.nivel_escala === "NIVEL_1";
    const usdDia = esAltaDir ? zObj.c4_usd : zObj.c5_usd;
    const diasTotalesExt = Math.max(1, t.diasReconocidos) + zObj.dias_inst;
    subtotalViaticoDias = Number((usdDia * diasTotalesExt * tc).toFixed(2));
    etiquetaEscala = `Exterior ($${usdDia} x ${diasTotalesExt}d)`;
    pctMaxDJ = 20;
  }

  const netoViatico = Math.max(0, subtotalViaticoDias + subtotalViaticoHoras + movLocalTotal + movEmbarqueTotal - descuentoNoAloj - descuentoEscolta);
  const otrasAsignaciones = (Number(com.pasajes_terrestres) || 0) + (Number(com.combustible) || 0) + (Number(com.peajes) || 0) + (Number(com.otros_vehiculo) || 0);
  const totalRecibir = Number((netoViatico + otrasAsignaciones).toFixed(2));
  const topeMaxDJ = Number(((netoViatico * pctMaxDJ) / 100).toFixed(2));

  return {
    etiquetaEscala,
    subtotalViaticoDias: Number(subtotalViaticoDias.toFixed(2)),
    subtotalViaticoHoras: Number(subtotalViaticoHoras.toFixed(2)),
    movLocalTotal: Number(movLocalTotal.toFixed(2)),
    movEmbarqueTotal: Number(movEmbarqueTotal.toFixed(2)),
    descuentoNoAloj: Number(descuentoNoAloj.toFixed(2)),
    descuentoEscolta: Number(descuentoEscolta.toFixed(2)),
    netoViatico: Number(netoViatico.toFixed(2)),
    otrasAsignaciones: Number(otrasAsignaciones.toFixed(2)),
    totalRecibir,
    pctMaxDJ,
    topeMaxDJ
  };
}

function renderizarTablaYDesgloseComisionados() {
  const tbody = document.getElementById("tbody-comisionados-viaticos");
  const lblCant = document.getElementById("lbl-cant-comisionados");
  const panelTot = document.getElementById("panel-totales-planilla-viaticos");
  if (!tbody || !panelTot) return;

  const lista = window.VIATICOS_STATE.comisionados;
  if (lblCant) lblCant.textContent = lista.length;

  let sumaGeneral = 0;
  const esAnexo07 = document.getElementById("viat-tipo-comision")?.value === "SIN_VIATICOS_MISMO_DIA";

  if (lista.length === 0) {
    tbody.innerHTML = `<tr><td colspan="3" style="text-align:center; color:#64748B; padding:16px; font-size:0.8rem;">Toca el botón <strong>"👤 + Incluirme"</strong> o <strong>"+ Añadir otro Integrante"</strong> arriba para calcular tu planilla.</td></tr>`;
  } else {
    tbody.innerHTML = lista.map((com, idx) => {
      const calc = calcularMontosIndividualComisionado(com);
      sumaGeneral += calc.totalRecibir;
      return `
        <tr>
          <td>
            <strong style="color:#0F172A;">#${idx + 1} ${com.nombres}</strong><br/>
            <small style="color:#475569;">DNI: ${com.dni} • ${com.cargo}</small><br/>
            <small style="color:#0284C7; font-weight:700;">📍 ${com.sede_comisionado || 'Sede ANC-MP'}</small><br/>
            <span class="badge-semaforo badge-verde" style="font-size:0.65rem; margin-top:3px;">${calc.etiquetaEscala}</span>
          </td>
          <td>
            <div style="font-size:0.75rem; line-height:1.38;">
              Viático: <strong>${window.fmtSoles(calc.netoViatico)}</strong><br/>
              Pasajes/Otros: <strong>${window.fmtSoles(calc.otrasAsignaciones)}</strong><br/>
              <strong style="font-size:0.86rem; color:#0F172A;">Total: ${window.fmtSoles(calc.totalRecibir)}</strong>
            </div>
          </td>
          <td>
            <div style="display:flex; flex-direction:column; gap:5px;">
              <button type="button" onclick="imprimirPlanillaIndividualEnCursoPDF(${idx})" style="background:linear-gradient(135deg, #FBBF24 0%, #F59E0B 100%); color:#0F172A; border:1px solid #D97706; border-radius:8px; padding:6px 8px; font-size:0.7rem; font-weight:800; cursor:pointer;">
                🖨️ ${esAnexo07 ? 'Planilla 07' : 'Planilla 01'}
              </button>
              <button type="button" onclick="eliminarComisionadoViatico(${com.id_temp})" style="background:#FFF5F6; color:#9F1239; border:1px solid #FECDD3; border-radius:8px; padding:4px 8px; font-size:0.68rem; font-weight:800; cursor:pointer;">
                ✕ Quitar
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join("");
  }

  const topeCaja = Number(window.ANC_STATE?.config?.tope_viaticos_caja_chica || 2000);
  const supera = sumaGeneral > topeCaja;
  panelTot.innerHTML = `
    <div style="background:${supera ? '#FFFDF5' : '#F2FBF7'}; border:1.5px solid ${supera ? '#FDE68A' : '#A7F3D0'}; border-radius:16px; padding:11px 14px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
      <div>
        <span style="font-size:0.75rem; font-weight:800; color:#334155;">ASIGNACIÓN TOTAL DE LA COMISIÓN:</span>
        <strong style="font-size:1.14rem; color:#0F172A; margin-left:6px;">${window.fmtSoles(sumaGeneral)}</strong>
      </div>
      <span class="badge-semaforo ${supera ? 'badge-amarillo' : 'badge-verde'}">
        ${supera ? `🏦 Mayor a S/ 2,000 (Desembolso por Tesorería)` : `✓ Hasta S/ 2,000 (Atención rápida por Caja Chica)`}
      </span>
    </div>
  `;
}

window.procesarYGuardarPlanillaViaticos = async function() {
  if (window.VIATICOS_STATE.comisionados.length === 0) {
    alert("⚠️ Por favor, añade al menos un integrante antes de guardar la comisión.");
    return;
  }

  const p = window.ANC_STATE.perfilActivo;
  const cfg = window.ANC_STATE.config;
  const baseSol = recolectarDatosFormularioComisionActiva();

  let montoTotalSolicitud = 0;
  const comisionadosCalculados = window.VIATICOS_STATE.comisionados.map(c => {
    const calc = calcularMontosIndividualComisionado(c);
    montoTotalSolicitud += calc.totalRecibir;
    // Asegurar que rendicion_habilitada inicie en false hasta que Jefatura lo habilite
    const comObj = { ...c, rendicion_habilitada: false };
    guardarEstadoHabilitacionLocal(baseSol.codigo_planilla, comObj.dni, false);
    return { com: comObj, calc };
  });

  const payloadSolicitud = {
    codigo_planilla: baseSol.codigo_planilla,
    anio_fiscal: cfg.anio_fiscal,
    unidad_organica_id: p.unidad_id,
    tipo_comision: baseSol.tipo_comision,
    documento_autorizacion: baseSol.documento_autorizacion,
    motivo_comision: baseSol.motivo_comision,
    origen_comision: baseSol.origen_comision,
    destino_comision: baseSol.destino_comision,
    medio_transporte: baseSol.medio_transporte,
    placa_vehiculo_oficial: baseSol.placa_vehiculo_oficial,
    conductor_vehiculo_oficial: baseSol.conductor_vehiculo_oficial,
    fecha_hora_salida: baseSol.fecha_hora_salida,
    fecha_hora_retorno: baseSol.fecha_hora_retorno,
    horas_traslado_terminal: baseSol.horas_traslado_terminal,
    total_horas_computadas: baseSol.total_horas_computadas,
    dias_viatico_reconocidos: baseSol.dias_viatico_reconocidos,
    horas_fraccion_reconocidas: baseSol.horas_fraccion_reconocidas,
    monto_total_solicitud: Number(montoTotalSolicitud.toFixed(2)),
    supera_tope_caja_2000: montoTotalSolicitud > cfg.tope_viaticos_caja_chica,
    estado_solicitud: "APROBADO"
  };

  const resSol = await window.SupabaseANC.request("anc_viaticos_solicitudes", "POST", "", payloadSolicitud);
  let solicitudId = Date.now();
  if (resSol.data && resSol.data.length > 0) {
    solicitudId = resSol.data[0].id;
    for (const item of comisionadosCalculados) {
      await window.SupabaseANC.request("anc_viaticos_comisionados", "POST", "", {
        solicitud_id: solicitudId,
        dni_comisionado: item.com.dni,
        apellidos_nombres: item.com.nombres,
        cargo_comisionado: item.com.cargo,
        regimen_vinculo: item.com.regimen,
        sustenta_alojamiento: item.com.sustenta_alojamiento,
        es_personal_seguridad_escolta: item.com.es_escolta_seguridad,
        subtotal_viaticos_dias: item.calc.subtotalViaticoDias,
        subtotal_viaticos_horas: item.calc.subtotalViaticoHoras,
        descuento_no_alojamiento: item.calc.descuentoNoAloj,
        descuento_alimentos_escolta: item.calc.descuentoEscolta,
        movilidad_local_total: item.calc.movLocalTotal,
        movilidad_embarque_total: item.calc.movEmbarqueTotal,
        pasajes_terrestres_fluviales: item.com.pasajes_terrestres,
        combustible_asignado: item.com.combustible,
        peajes_asignados: item.com.peajes,
        otros_gastos_vehiculo: item.com.otros_vehiculo,
        total_recibir_comisionado: item.calc.totalRecibir,
        tope_maximo_dj_soles: item.calc.topeMaxDJ
      });
    }
  }

  p.saldo_viaticos = Math.max(0, Number((p.saldo_viaticos - montoTotalSolicitud).toFixed(2)));
  await window.SupabaseANC.request(
    "anc_unidades_organicas",
    "PATCH",
    `codigo=eq.${encodeURIComponent(p.codigo_dependencia)}`,
    { saldo_viaticos_actual: p.saldo_viaticos }
  );

  const registroCompleto = {
    ...payloadSolicitud,
    id: solicitudId,
    nombre_dependencia: p.nombre_dependencia,
    codigo_dependencia: p.nombre_dependencia ? p.codigo_dependencia : "ANC",
    usuario_creador: p.usuario_nombre,
    usuario_creador_dni: p.usuario_dni,
    comisionados: comisionadosCalculados
  };

  window.VIATICOS_STATE.comisionesCreadas.unshift(registroCompleto);
  localStorage.setItem("anc_viaticos_local_v1", JSON.stringify(window.VIATICOS_STATE.comisionesCreadas));

  if (typeof window.actualizarCabeceraYMenu === "function") window.actualizarCabeceraYMenu();

  alert(`✅ Tu comisión ${payloadSolicitud.codigo_planilla} ha sido guardada con ${comisionadosCalculados.length} integrante(s).\n\n📌 Ahora puedes descargar tu planilla lista para firmar o compartir el resumen por WhatsApp.`);
  abrirDetalleComisionViaticos(0);
};