// =========================================================================================
// ETAPA 5 / PASO C (RENOVADO): MÓDULO "RENDIR MIS VIÁTICOS" EN 3 PANTALLAS JERÁRQUICAS
// Diseño Cálido y Lenguaje Claro para Magistrados, Fiscales y Servidores de la ANC-MP
// Directiva GFIN/DIR-01 Versión 10 + Resolución N° 000038-2025-MP-FN-GG-OGFIN
// - PANTALLA 1: Lista de Comisiones Registradas (ruta, fechas, contómetro y avance "X de Y")
// - PANTALLA 2: Comisión Abierta y Lista de sus Comisionados (⏳ PENDIENTE / ✓ RENDIDO)
// - PANTALLA 3: Registro de Comprobantes (Manual + Cámara 1 a 1 + Lote Masivo QR SUNAT/OCR),
//               DJ (30% Nac. / 20% Ext.), Cuadre, Anexos 04, 02/03, 05 y 06 en PDF/Excel,
//               y Autoguardado en tiempo real en Supabase (anc_viaticos_comisionados)
// =========================================================================================

window.RENDICION_VIATICOS_STATE = {
  pantallaActual: "PANTALLA_1_COMISIONES", // 'PANTALLA_1_COMISIONES', 'PANTALLA_2_COMISIONADOS', 'PANTALLA_3_REGISTRO'
  idxSolSeleccionada: 0,
  idxComSeleccionado: 0,
  planillaActiva: {
    id_solicitud_db: null,
    id_comisionado_db: null,
    codigo_planilla: "PV-2026-001",
    tipo_comision: "NACIONAL_FUERA_DF",
    documento_autorizacion: "Res. Jefatural ANC-MP",
    motivo_comision: "Comisión oficial de control funcional",
    origen_comision: "LIMA - Sede Central ANC-MP",
    dni_comisionado: "45000001",
    nombres_comisionado: "Fiscal / Especialista de Control ANC-MP",
    cargo_comisionado: "Fiscal Provincial de Control / Especialista",
    dependencia: "Oficina de Administración y Finanzas",
    ciudad_destino: "Arequipa",
    fecha_inicio: new Date().toISOString().slice(0, 10),
    fecha_fin: new Date().toISOString().slice(0, 10),
    fecha_hora_salida: `${new Date().toISOString().slice(0, 10)}T08:00`,
    fecha_hora_retorno: `${new Date().toISOString().slice(0, 10)}T18:00`,
    dias_comision: 2,
    rendicion_habilitada: true,
    estado_rendicion: "PENDIENTE",
    fecha_presentacion_rendicion: null,
    otorgado_viaticos_neto: 640.00,
    otorgado_pasajes_terrestres: 0.00,
    otorgado_tua_corpac: 0.00,
    otorgado_pasajes_aereos: 0.00,
    otorgado_combustible: 0.00,
    otorgado_peaje: 0.00,
    otorgado_otros: 0.00,
    monto_total_otorgado: 640.00,
    porcentaje_max_dj: 30.0,
    tope_max_dj_soles: 192.00
  },
  comprobantes: [],
  bandejaMasiva: [],
  idComprobanteEditando: null,
  ultimoRucEscaneado: "",
  djConceptos: {
    alojamiento: 0.00,
    alimentacion: 0.00,
    movilidad_local: 40.00,
    movilidad_embarque: 120.00
  },
  nroReciboCajaDevolucion: "RC-001-2026",
  nroMemoDevolucion: "MEMO-001-2026-ANC"
};

let _timerAutoguardadoDJ = null;

document.addEventListener("DOMContentLoaded", () => {
  inicializarModuloRendicionViaticos();
});

window.inicializarModuloRendicionViaticos = async function() {
  if (typeof window.sincronizarComisionesViaticos === "function") {
    await window.sincronizarComisionesViaticos();
  }
  verificarNavegacionDirectaRendicion();
  renderizarModuloRendicionViaticos();
};

// =========================================================================================
// NAVEGACIÓN ENTRE LAS 3 PANTALLAS JERÁRQUICAS CONECTADA AL BOTÓN RETROCEDER DEL CELULAR
// =========================================================================================
function verificarNavegacionDirectaRendicion() {
  try {
    const selStr = localStorage.getItem("anc_rendicion_seleccionada_v1");
    if (selStr) {
      const sel = JSON.parse(selStr);
      if (sel && sel.abrirPantalla) {
        const destinoPantalla = sel.abrirPantalla;
        delete sel.abrirPantalla;
        localStorage.setItem("anc_rendicion_seleccionada_v1", JSON.stringify(sel));

        const listaVisibles = obtenerComisionesVisiblesParaRendicion();
        const encontrada = listaVisibles.find(
          x => x.sol.codigo_planilla === sel.codigo_planilla || Number(x.idxSol) === Number(sel.idxSol)
        );

        if (encontrada) {
          window.RENDICION_VIATICOS_STATE.idxSolSeleccionada = encontrada.idxSol;
          if (destinoPantalla === "PANTALLA_3_REGISTRO" && sel.idxCom !== null && sel.idxCom !== undefined) {
            window.RENDICION_VIATICOS_STATE.idxComSeleccionado = Number(sel.idxCom);
            cargarDatosComisionadoEnPantalla3(encontrada.idxSol, Number(sel.idxCom));
            window.RENDICION_VIATICOS_STATE.pantallaActual = "PANTALLA_3_REGISTRO";
            return;
          }
          window.RENDICION_VIATICOS_STATE.pantallaActual = "PANTALLA_2_COMISIONADOS";
          return;
        }
      }
    }
  } catch (e) {
    console.warn("Aviso leyendo selección previa de rendición:", e);
  }
  window.RENDICION_VIATICOS_STATE.pantallaActual = "PANTALLA_1_COMISIONES";
}

window.irAPantalla1ListaComisionesRendicion = function(desdePopState = false) {
  window.RENDICION_VIATICOS_STATE.pantallaActual = "PANTALLA_1_COMISIONES";
  window.RENDICION_VIATICOS_STATE.idComprobanteEditando = null;
  window.RENDICION_VIATICOS_STATE.bandejaMasiva = [];
  renderizarModuloRendicionViaticos();
  window.scrollTo({ top: 0, behavior: "smooth" });
  if (!desdePopState && typeof window.registrarEstadoHistorialANC === "function") {
    window.registrarEstadoHistorialANC({ subvistaRendicion: "PANTALLA_1_COMISIONES" });
  }
};

window.abrirPantalla2ComisionadosDeComision = function(idxSol, desdePopState = false) {
  window.RENDICION_VIATICOS_STATE.idxSolSeleccionada = Number(idxSol);
  window.RENDICION_VIATICOS_STATE.pantallaActual = "PANTALLA_2_COMISIONADOS";
  window.RENDICION_VIATICOS_STATE.idComprobanteEditando = null;
  window.RENDICION_VIATICOS_STATE.bandejaMasiva = [];
  renderizarModuloRendicionViaticos();
  window.scrollTo({ top: 0, behavior: "smooth" });
  if (!desdePopState && typeof window.registrarEstadoHistorialANC === "function") {
    window.registrarEstadoHistorialANC({ subvistaRendicion: "PANTALLA_2_COMISIONADOS", idxSol });
  }
};

window.volverAPantalla2Comisionados = function(desdePopState = false) {
  window.RENDICION_VIATICOS_STATE.pantallaActual = "PANTALLA_2_COMISIONADOS";
  window.RENDICION_VIATICOS_STATE.idComprobanteEditando = null;
  window.RENDICION_VIATICOS_STATE.bandejaMasiva = [];
  renderizarModuloRendicionViaticos();
  window.scrollTo({ top: 0, behavior: "smooth" });
  if (!desdePopState && typeof window.registrarEstadoHistorialANC === "function") {
    window.registrarEstadoHistorialANC({
      subvistaRendicion: "PANTALLA_2_COMISIONADOS",
      idxSol: window.RENDICION_VIATICOS_STATE.idxSolSeleccionada
    });
  }
};

window.abrirPantalla3RegistroComisionado = function(idxSol, idxCom, desdePopState = false) {
  window.RENDICION_VIATICOS_STATE.idxSolSeleccionada = Number(idxSol);
  window.RENDICION_VIATICOS_STATE.idxComSeleccionado = Number(idxCom);
  window.RENDICION_VIATICOS_STATE.idComprobanteEditando = null;
  window.RENDICION_VIATICOS_STATE.bandejaMasiva = [];
  cargarDatosComisionadoEnPantalla3(Number(idxSol), Number(idxCom));
  window.RENDICION_VIATICOS_STATE.pantallaActual = "PANTALLA_3_REGISTRO";
  renderizarModuloRendicionViaticos();
  window.scrollTo({ top: 0, behavior: "smooth" });
  if (!desdePopState && typeof window.registrarEstadoHistorialANC === "function") {
    window.registrarEstadoHistorialANC({
      subvistaRendicion: "PANTALLA_3_REGISTRO",
      idxSol,
      idxCom
    });
  }
};

// =========================================================================================
// MOTOR DEL CONTÓMETRO REGRESIVO CON SEMÁFORO LEGAL (DIRECTIVA VIÁTICOS V.10)
// - Comisión Nacional: 10 días hábiles desde fecha_hora_retorno (Numeral 5.2.9.2)
// - Comisión Internacional: 15 días calendario desde fecha_hora_retorno (Numeral 5.2.9.8)
// =========================================================================================
window.calcularContometroPlazoRendicion = function(fechaHoraRetornoStr, tipoComision = "NACIONAL_FUERA_DF") {
  const ahora = new Date();
  let strBase = String(fechaHoraRetornoStr || "").trim();
  if (!strBase) {
    strBase = `${ahora.toISOString().slice(0, 10)}T18:00`;
  } else if (strBase.length === 10) {
    strBase = `${strBase}T18:00`;
  }

  const fechaRetorno = new Date(strBase);
  const retornoValido = !isNaN(fechaRetorno.getTime()) ? fechaRetorno : new Date();

  const esInternacional = tipoComision === "INTERNACIONAL_USD";
  const fechaLimite = new Date(retornoValido.getTime());

  if (esInternacional) {
    fechaLimite.setDate(fechaLimite.getDate() + 15);
  } else {
    let diasHabilesSumados = 0;
    while (diasHabilesSumados < 10) {
      fechaLimite.setDate(fechaLimite.getDate() + 1);
      const diaSemana = fechaLimite.getDay();
      if (diaSemana !== 0 && diaSemana !== 6) {
        diasHabilesSumados++;
      }
    }
  }

  const fmtFechaHora = (d) => {
    const f = d.toLocaleDateString("es-PE", { day: "2-digit", month: "2-digit", year: "numeric" });
    const h = d.toTimeString().slice(0, 5);
    return `${f} (${h} h)`;
  };

  const baseNormativa = esInternacional
    ? "15 días calendario contados desde el retorno (Directiva V.10 - Numeral 5.2.9.8)"
    : "10 días hábiles (lunes a viernes) contados desde el retorno (Directiva V.10 - Numeral 5.2.9.2)";

  if (ahora.getTime() < retornoValido.getTime()) {
    const diffParaRetorno = retornoValido.getTime() - ahora.getTime();
    const dRet = Math.floor(diffParaRetorno / (1000 * 3600 * 24));
    const hRet = Math.floor((diffParaRetorno % (1000 * 3600 * 24)) / (1000 * 3600));
    return {
      estado: "EN_COMISION",
      colorClaseBox: "contometro-azul",
      colorClaseBadge: "badge-azul",
      icono: "🔵",
      tituloSemaf: `🔵 Viaje en curso (Retorno programado en ${dRet} día(s) y ${hRet}h)`,
      resumenCorto: `🔵 En viaje (Vence: ${fechaLimite.toLocaleDateString("es-PE")})`,
      fechaRetornoTexto: fmtFechaHora(retornoValido),
      fechaLimiteTexto: fmtFechaHora(fechaLimite),
      baseNormativa,
      vencido: false
    };
  }

  const diffRestante = fechaLimite.getTime() - ahora.getTime();

  if (diffRestante < 0) {
    const diffExcedido = Math.abs(diffRestante);
    const diasExcedidos = Math.max(1, Math.floor(diffExcedido / (1000 * 3600 * 24)));
    const horasExcedidas = Math.floor((diffExcedido % (1000 * 3600 * 24)) / (1000 * 3600));
    return {
      estado: "VENCIDO",
      colorClaseBox: "contometro-rojo",
      colorClaseBadge: "badge-rojo",
      icono: "🔴",
      tituloSemaf: `🔴 Plazo vencido hace ${diasExcedidos} día(s) (${horasExcedidas}h) — Regulariza tu rendición`,
      resumenCorto: `🔴 Vencido (+${diasExcedidos}d)`,
      fechaRetornoTexto: fmtFechaHora(retornoValido),
      fechaLimiteTexto: fmtFechaHora(fechaLimite),
      baseNormativa,
      vencido: true
    };
  }

  const diasRestantes = Math.floor(diffRestante / (1000 * 3600 * 24));
  const horasRestantes = Math.floor((diffRestante % (1000 * 3600 * 24)) / (1000 * 3600));
  const tresDiasMs = 3 * 24 * 3600 * 1000;

  if (diffRestante <= tresDiasMs) {
    return {
      estado: "POR_VENCER",
      colorClaseBox: "contometro-amarillo",
      colorClaseBadge: "badge-amarillo",
      icono: "🟡",
      tituloSemaf: `🟡 Próximo a vencer: quedan ${diasRestantes} día(s) y ${horasRestantes} horas para rendir`,
      resumenCorto: `🟡 Por vencer (${diasRestantes}d ${horasRestantes}h)`,
      fechaRetornoTexto: fmtFechaHora(retornoValido),
      fechaLimiteTexto: fmtFechaHora(fechaLimite),
      baseNormativa,
      vencido: false
    };
  }

  return {
    estado: "EN_PLAZO",
    colorClaseBox: "contometro-verde",
    colorClaseBadge: "badge-verde",
    icono: "🟢",
    tituloSemaf: `🟢 Dentro del plazo: cuentas con ${diasRestantes} día(s) y ${horasRestantes} horas disponibles`,
    resumenCorto: `🟢 En plazo (${diasRestantes}d ${horasRestantes}h)`,
    fechaRetornoTexto: fmtFechaHora(retornoValido),
    fechaLimiteTexto: fmtFechaHora(fechaLimite),
    baseNormativa,
    vencido: false
  };
};

function renderizarCajaContometroHTML(infoContometro, codigoPlanilla) {
  return `
    <div class="contometro-box ${infoContometro.colorClaseBox}">
      <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:6px; margin-bottom:8px;">
        <div style="font-size:0.83rem; font-weight:800; line-height:1.35;">
          ⏱️ PLAZO LEGAL DE RENDICIÓN: ${infoContometro.tituloSemaf}
        </div>
        <span class="badge-semaforo ${infoContometro.colorClaseBadge}" style="font-size:0.68rem;">
          Planilla ${codigoPlanilla}
        </span>
      </div>
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; font-size:0.75rem; background:rgba(255,255,255,0.75); padding:8px 10px; border-radius:12px; border:1px solid rgba(15,23,42,0.08);">
        <div>
          <strong>🛬 Fecha y hora de retorno:</strong><br/>
          <span>${infoContometro.fechaRetornoTexto}</span>
        </div>
        <div>
          <strong>📅 Fecha límite de entrega:</strong><br/>
          <strong style="text-decoration:underline;">${infoContometro.fechaLimiteTexto}</strong>
        </div>
      </div>
      <div style="font-size:0.7rem; margin-top:6px; font-weight:700; opacity:0.9;">
        ⚖️ Cómputo de plazo: ${infoContometro.baseNormativa}
      </div>
    </div>
  `;
}

// Obtiene todas las comisiones registradas (desde VIATICOS_STATE o localStorage) aplicando privacidad por DNI
function obtenerFuenteComisionesRegistradas() {
  if (window.VIATICOS_STATE && Array.isArray(window.VIATICOS_STATE.comisionesCreadas) && window.VIATICOS_STATE.comisionesCreadas.length > 0) {
    return window.VIATICOS_STATE.comisionesCreadas;
  }
  try {
    const local = JSON.parse(localStorage.getItem("anc_viaticos_local_v1") || "[]");
    if (window.VIATICOS_STATE) window.VIATICOS_STATE.comisionesCreadas = local;
    return local;
  } catch (e) {
    return [];
  }
}

function obtenerComisionesVisiblesParaRendicion() {
  const todas = obtenerFuenteComisionesRegistradas();
  const mapaHab = JSON.parse(localStorage.getItem("anc_viaticos_hab_v1") || "{}");
  const mapaRend = JSON.parse(localStorage.getItem("anc_viaticos_rendidos_v1") || "{}");

  return todas
    .map((sol, idxSol) => {
      // Sincronizar estado de cada integrante con el caché local de rendiciones
      const comisionadosSync = (sol.comisionados || []).map((it) => {
        const clave = `${sol.codigo_planilla}_${String(it?.com?.dni || "").trim()}`;
        const rCache = mapaRend[clave] || {};
        const hab = (clave in mapaHab) ? mapaHab[clave] : Boolean(it?.com?.rendicion_habilitada ?? true);
        const estRend = (it?.com?.estado_rendicion === "RENDIDO" || rCache.estado_rendicion === "RENDIDO")
          ? "RENDIDO"
          : "PENDIENTE";

        return {
          ...it,
          com: {
            ...it.com,
            rendicion_habilitada: hab,
            estado_rendicion: estRend,
            monto_rendido_documentado: Number(it?.com?.monto_rendido_documentado ?? rCache.monto_rendido_documentado ?? 0),
            monto_rendido_dj: Number(it?.com?.monto_rendido_dj ?? rCache.monto_rendido_dj ?? 0),
            monto_devolucion_efectivo: Number(it?.com?.monto_devolucion_efectivo ?? rCache.monto_devolucion_efectivo ?? 0),
            detalle_comprobantes_json: rCache.detalle_comprobantes_json || it?.com?.detalle_comprobantes_json || [],
            fecha_presentacion_rendicion: it?.com?.fecha_presentacion_rendicion || rCache.fecha_presentacion_rendicion || null
          }
        };
      });

      sol.comisionados = comisionadosSync;
      return { sol, idxSol };
    })
    .filter(({ sol }) => {
      if (typeof window.esRegistroDelUsuarioActivo === "function") {
        return window.esRegistroDelUsuarioActivo(sol);
      }
      return true;
    });
}

// Carga los datos del comisionado elegido en el estado de la Pantalla 3 (incluyendo sus boletas guardadas)
function cargarDatosComisionadoEnPantalla3(idxSol, idxCom) {
  const todas = obtenerFuenteComisionesRegistradas();
  const sol = todas[idxSol];
  if (!sol || !sol.comisionados || !sol.comisionados[idxCom]) return;

  const item = sol.comisionados[idxCom];
  const com = item.com || {};
  const calc = item.calc || {};

  const pctDJ = sol.tipo_comision === "INTERNACIONAL_USD" ? 20.0 : (sol.tipo_comision === "SIN_VIATICOS_MISMO_DIA" ? 100.0 : 30.0);
  const viatNeto = Number(calc.netoViatico || 640.00);
  const fSalRaw = sol.fecha_hora_salida || `${new Date().toISOString().slice(0, 10)}T08:00`;
  const fRetRaw = sol.fecha_hora_retorno || `${new Date().toISOString().slice(0, 10)}T18:00`;

  window.RENDICION_VIATICOS_STATE.planillaActiva = {
    id_solicitud_db: sol.id || null,
    id_comisionado_db: com.id_db || null,
    codigo_planilla: sol.codigo_planilla || "PV-2026-001",
    tipo_comision: sol.tipo_comision || "NACIONAL_FUERA_DF",
    documento_autorizacion: sol.documento_autorizacion || "Res. Jefatural ANC-MP",
    motivo_comision: sol.motivo_comision || "Comisión oficial de servicio",
    origen_comision: sol.origen_comision || "LIMA - Sede Central ANC-MP",
    dni_comisionado: com.dni || "45000001",
    nombres_comisionado: com.nombres || "Comisionado ANC-MP",
    cargo_comisionado: com.cargo || "Fiscal / Especialista ANC-MP",
    dependencia: com.sede_comisionado || sol.nombre_dependencia || "Sede Central ANC-MP",
    ciudad_destino: sol.destino_comision || "Arequipa",
    fecha_inicio: fSalRaw.slice(0, 10),
    fecha_fin: fRetRaw.slice(0, 10),
    fecha_hora_salida: fSalRaw,
    fecha_hora_retorno: fRetRaw,
    dias_comision: Number(sol.dias_viatico_reconocidos || 1),
    rendicion_habilitada: Boolean(com.rendicion_habilitada ?? true),
    estado_rendicion: com.estado_rendicion || "PENDIENTE",
    fecha_presentacion_rendicion: com.fecha_presentacion_rendicion || null,
    otorgado_viaticos_neto: viatNeto,
    otorgado_pasajes_terrestres: Number(com.pasajes_terrestres || 0),
    otorgado_tua_corpac: 0.00,
    otorgado_pasajes_aereos: 0.00,
    otorgado_combustible: Number(com.combustible || 0),
    otorgado_peaje: Number(com.peajes || 0),
    otorgado_otros: Number(com.otros_vehiculo || 0),
    monto_total_otorgado: Number(calc.totalRecibir || viatNeto),
    porcentaje_max_dj: pctDJ,
    tope_max_dj_soles: Number(((viatNeto * pctDJ) / 100).toFixed(2))
  };

  // Restaurar comprobantes y DJ desde el caché local o desde la comisión sincronizada
  const claveUnica = `${window.RENDICION_VIATICOS_STATE.planillaActiva.codigo_planilla}_${String(com.dni || "").trim()}`;
  const mapaRend = JSON.parse(localStorage.getItem("anc_viaticos_rendidos_v1") || "{}");
  const cacheIndividual = mapaRend[claveUnica] || {};

  let detalleGuardado = cacheIndividual.detalle_comprobantes_json || com.detalle_comprobantes_json;
  if (typeof detalleGuardado === "string") {
    try { detalleGuardado = JSON.parse(detalleGuardado); } catch (e) { detalleGuardado = null; }
  }

  if (detalleGuardado && !Array.isArray(detalleGuardado) && typeof detalleGuardado === "object") {
    window.RENDICION_VIATICOS_STATE.comprobantes = Array.isArray(detalleGuardado.comprobantes) ? detalleGuardado.comprobantes : [];
    window.RENDICION_VIATICOS_STATE.djConceptos = {
      alojamiento: Number(detalleGuardado.djConceptos?.alojamiento || 0),
      alimentacion: Number(detalleGuardado.djConceptos?.alimentacion || 0),
      movilidad_local: Number(detalleGuardado.djConceptos?.movilidad_local ?? calc.movLocalTotal ?? 0),
      movilidad_embarque: Number(detalleGuardado.djConceptos?.movilidad_embarque ?? calc.movEmbarqueTotal ?? 0)
    };
    if (detalleGuardado.nroReciboCajaDevolucion) {
      window.RENDICION_VIATICOS_STATE.nroReciboCajaDevolucion = detalleGuardado.nroReciboCajaDevolucion;
    }
  } else if (Array.isArray(detalleGuardado) && detalleGuardado.length > 0) {
    window.RENDICION_VIATICOS_STATE.comprobantes = detalleGuardado;
    window.RENDICION_VIATICOS_STATE.djConceptos = {
      alojamiento: 0.00,
      alimentacion: 0.00,
      movilidad_local: Number(calc.movLocalTotal || 0),
      movilidad_embarque: Number(calc.movEmbarqueTotal || 0)
    };
  } else {
    window.RENDICION_VIATICOS_STATE.comprobantes = [];
    window.RENDICION_VIATICOS_STATE.djConceptos = {
      alojamiento: 0.00,
      alimentacion: 0.00,
      movilidad_local: Number(calc.movLocalTotal || 0),
      movilidad_embarque: Number(calc.movEmbarqueTotal || 0)
    };
  }
}

function renderizarBarraPasosJerarquica(pasoActivo) {
  return `
    <div class="rendicion-stepper-bar">
      <div class="rendicion-step-pill ${pasoActivo === 1 ? 'active' : 'completed'}" onclick="irAPantalla1ListaComisionesRendicion()" style="cursor:pointer;">
        1. Comisiones Registradas
      </div>
      <div class="rendicion-step-pill ${pasoActivo === 2 ? 'active' : (pasoActivo > 2 ? 'completed' : '')}">
        2. Integrantes de Comisión
      </div>
      <div class="rendicion-step-pill ${pasoActivo === 3 ? 'active' : ''}">
        3. Rendición y Anexos
      </div>
    </div>
  `;
}

// =========================================================================================
// RENDERIZADOR PRINCIPAL DE LAS 3 PANTALLAS JERÁRQUICAS DE "RENDIR MIS VIÁTICOS"
// =========================================================================================
function renderizarModuloRendicionViaticos() {
  const cont = document.getElementById("contenedor-modulo-rendicion-viaticos");
  if (!cont) return;

  const p = window.ANC_STATE?.perfilActivo || {
    usuario_nombre: "Usuario Operador ANC",
    usuario_dni: "45000001",
    nombre_dependencia: "Unidad de Abastecimiento"
  };

  const comisionesVisibles = obtenerComisionesVisiblesParaRendicion();
  const pantalla = window.RENDICION_VIATICOS_STATE.pantallaActual;

  // =======================================================================================
  // PANTALLA 1: LISTA LIMPIA DE COMISIONES REGISTRADAS
  // =======================================================================================
  if (pantalla === "PANTALLA_1_COMISIONES") {
    cont.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:8px; margin-bottom:10px;">
        <div>
          <h2 style="font-size:1.2rem; font-weight:800; color:#0F172A;">📑 Rendir mis Viáticos</h2>
          <p style="font-size:0.8rem; color:#475569; font-weight:600; margin-top:2px;">
            Selecciona una comisión registrada para ver a sus integrantes y registrar su rendición
          </p>
        </div>
        <button type="button" onclick="navegarVista('viaticos')" style="background:#FFFDF5; color:#0F172A; border:1.5px solid #F59E0B; border-radius:12px; padding:7px 12px; font-size:0.75rem; font-weight:800; cursor:pointer;">
          ✈️ Ir a Comisiones
        </button>
      </div>

      ${renderizarBarraPasosJerarquica(1)}

      <div style="background:#FFFDF5; border:1.5px solid #FDE68A; border-radius:16px; padding:10px 12px; margin-bottom:14px; font-size:0.76rem; color:#0F172A; line-height:1.4;">
        👤 <strong>Usuario activo:</strong> ${p.usuario_nombre} (DNI: <strong>${p.usuario_dni}</strong>) • Toca cualquiera de las comisiones de abajo para abrir la lista de sus comisionados.
      </div>

      <div style="display:flex; flex-direction:column; gap:12px;">
        ${comisionesVisibles.length === 0 ? `
          <div style="text-align:center; padding:28px 16px; background:#FFFDF5; border:1.5px dashed #FDE68A; border-radius:20px; color:#475569; font-size:0.84rem; line-height:1.5;">
            Aún no hay comisiones de servicio registradas para tu DNI (<strong>${p.usuario_dni}</strong>).<br/>
            Programa primero tu viaje en <strong>"Solicitar Viáticos de Comisión"</strong> para que aparezca aquí automáticamente.<br/>
            <button type="button" onclick="navegarVista('viaticos'); if(window.iniciarNuevaComisionViaticos) iniciarNuevaComisionViaticos();" style="margin-top:12px; background:linear-gradient(135deg, #FBBF24 0%, #F59E0B 100%); color:#0F172A; border:1.5px solid #D97706; border-radius:12px; padding:10px 16px; font-size:0.8rem; font-weight:800; cursor:pointer;">
              + Programar Nueva Comisión de Viaje
            </button>
          </div>
        ` : comisionesVisibles.map(({ sol, idxSol }) => {
          const coms = sol.comisionados || [];
          const totalIntegrantes = coms.length;
          const totalRendidos = coms.filter(c => c?.com?.estado_rendicion === "RENDIDO").length;
          const todosRindieron = totalIntegrantes > 0 && totalRendidos === totalIntegrantes;
          const fSal = (sol.fecha_hora_salida || "").replace("T", " ");
          const fRet = (sol.fecha_hora_retorno || "").replace("T", " ");
          const infoPlazo = window.calcularContometroPlazoRendicion(sol.fecha_hora_retorno, sol.tipo_comision);

          return `
            <div class="comision-compact-item" onclick="abrirPantalla2ComisionadosDeComision(${idxSol})" style="flex-direction:column; align-items:stretch; gap:8px; padding:14px;">
              <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:8px;">
                <div style="min-width:0; flex:1;">
                  <div style="display:flex; align-items:center; gap:6px; flex-wrap:wrap; margin-bottom:4px;">
                    <span style="background:#FEF3C7; color:#92400E; border:1px solid #F59E0B; font-size:0.73rem; font-weight:800; padding:2px 9px; border-radius:8px;">
                      ${sol.codigo_planilla}
                    </span>
                    <strong style="font-size:0.94rem; color:#0F172A;">
                      ${sol.origen_comision} → ${sol.destino_comision}
                    </strong>
                  </div>
                  <div style="font-size:0.75rem; color:#475569; line-height:1.4;">
                    📅 <strong>Salida:</strong> ${fSal || "-"} • <strong>Retorno:</strong> ${fRet || "-"} (${sol.dias_viatico_reconocidos || 1}d)
                  </div>
                  <div style="font-size:0.74rem; color:#334155; margin-top:2px;">
                    📄 ${sol.documento_autorizacion} — ${sol.motivo_comision}
                  </div>
                </div>
                <div style="text-align:right; flex-shrink:0;">
                  <div style="font-size:0.65rem; font-weight:800; color:#64748B;">ASIGNACIÓN TOTAL</div>
                  <div style="font-size:1rem; font-weight:800; color:#0F172A;">${window.fmtSoles(sol.monto_total_solicitud)}</div>
                </div>
              </div>

              <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; padding-top:8px; border-top:1px dashed #E2E8F0;">
                <div style="display:flex; align-items:center; gap:6px; flex-wrap:wrap;">
                  <span class="badge-semaforo ${infoPlazo.colorClaseBadge}" style="font-size:0.68rem;">
                    ${infoPlazo.resumenCorto}
                  </span>
                  <span class="badge-semaforo ${todosRindieron ? 'badge-verde' : 'badge-amarillo'}" style="font-size:0.69rem;">
                    ${todosRindieron
                      ? `✓ ${totalRendidos} de ${totalIntegrantes} comisionados rindieron`
                      : `⏳ ${totalRendidos} de ${totalIntegrantes} comisionados rindieron`}
                  </span>
                </div>
                <span style="font-size:0.76rem; font-weight:800; color:#D97706;">
                  Ver comisionados →
                </span>
              </div>
            </div>
          `;
        }).join("")}
      </div>
    `;
    return;
  }

  // =======================================================================================
  // PANTALLA 2: COMISIÓN ABIERTA Y LISTA DE SUS COMISIONADOS INTEGRANTES
  // =======================================================================================
  if (pantalla === "PANTALLA_2_COMISIONADOS") {
    const todas = obtenerFuenteComisionesRegistradas();
    const idxSol = Number(window.RENDICION_VIATICOS_STATE.idxSolSeleccionada || 0);
    const sol = todas[idxSol];

    if (!sol) {
      window.irAPantalla1ListaComisionesRendicion(true);
      return;
    }

    const coms = sol.comisionados || [];
    const totalRendidos = coms.filter(c => c?.com?.estado_rendicion === "RENDIDO").length;
    const infoContometro = window.calcularContometroPlazoRendicion(sol.fecha_hora_retorno, sol.tipo_comision);
    const fSal = (sol.fecha_hora_salida || "").replace("T", " ");
    const fRet = (sol.fecha_hora_retorno || "").replace("T", " ");
    const miDni = String(p.usuario_dni || "").trim();
    const puedeAutorizar = typeof window.puedeHabilitarRendicion === "function" && window.puedeHabilitarRendicion();

    cont.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; margin-bottom:10px; padding-bottom:10px; border-bottom:1.5px solid #E2E8F0;">
        <button type="button" onclick="irAPantalla1ListaComisionesRendicion()" style="background:#FFFDF5; color:#0F172A; border:1.5px solid #F59E0B; border-radius:12px; padding:8px 13px; font-size:0.78rem; font-weight:800; cursor:pointer;">
          ← Volver a Comisiones
        </button>
        <span class="badge-semaforo ${totalRendidos === coms.length && coms.length > 0 ? 'badge-verde' : 'badge-amarillo'}">
          📊 Avance: ${totalRendidos} de ${coms.length} comisionados rindieron
        </span>
      </div>

      ${renderizarBarraPasosJerarquica(2)}

      <!-- RESUMEN DE LA COMISIÓN ABIERTA -->
      <div style="background:#FFFDF5; border:1.5px solid #FDE68A; border-radius:18px; padding:12px 14px; margin-bottom:12px;">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:8px;">
          <div>
            <div style="font-size:0.74rem; font-weight:800; color:#92400E;">
              COMISIÓN ${sol.codigo_planilla} • ${sol.documento_autorizacion}
            </div>
            <div style="font-size:1rem; font-weight:800; color:#0F172A; margin-top:2px;">
              📍 ${sol.origen_comision} → ${sol.destino_comision} (${sol.medio_transporte})
            </div>
            <div style="font-size:0.75rem; color:#475569; margin-top:3px;">
              🛫 <strong>Salida:</strong> ${fSal} • 🛬 <strong>Retorno:</strong> ${fRet} • <strong>Duración:</strong> ${sol.dias_viatico_reconocidos || 1} día(s)
            </div>
            <div style="font-size:0.75rem; color:#334155; margin-top:2px;">
              🎯 <strong>Motivo:</strong> ${sol.motivo_comision}
            </div>
          </div>
        </div>
      </div>

      <!-- CONTÓMETRO REGRESIVO DE LA COMISIÓN -->
      ${renderizarCajaContometroHTML(infoContometro, sol.codigo_planilla)}

      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:6px; margin-bottom:10px;">
        <h3 style="font-size:0.95rem; font-weight:800; color:#0F172A;">
          👥 Comisionados Integrantes (${coms.length})
        </h3>
        <span style="font-size:0.73rem; color:#475569; font-weight:700;">
          Toca un comisionado para abrir su registro de rendición
        </span>
      </div>

      <div style="display:flex; flex-direction:column; gap:10px;">
        ${coms.map((item, idxC) => {
          const com = item.com || {};
          const calc = item.calc || {};
          const yaRindio = com.estado_rendicion === "RENDIDO";
          const hab = Boolean(com.rendicion_habilitada ?? true);
          const esMiDni = String(com.dni || "").trim() === miDni;
          const montoDoc = Number(com.monto_rendido_documentado || 0);
          const montoDj = Number(com.monto_rendido_dj || 0);
          const montoDev = Number(com.monto_devolucion_efectivo || 0);
          const montoRendidoTotal = Number((montoDoc + montoDj).toFixed(2));
          const tieneAvance = montoRendidoTotal > 0;
          const fechaRendStr = com.fecha_presentacion_rendicion
            ? new Date(com.fecha_presentacion_rendicion).toLocaleDateString("es-PE")
            : null;

          return `
            <div style="background:${yaRindio ? '#F2FBF7' : (esMiDni ? '#FFFDF5' : '#FFFFFF')}; border:2px solid ${yaRindio ? '#10B981' : (esMiDni ? '#F59E0B' : '#E2E8F0')}; border-radius:18px; padding:13px; box-shadow:0 3px 10px rgba(15,23,42,0.04);">
              <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:8px;">
                <div style="min-width:0; flex:1;">
                  <div style="display:flex; align-items:center; gap:6px; flex-wrap:wrap; margin-bottom:4px;">
                    <strong style="font-size:0.9rem; color:#0F172A;">#${idxC + 1} ${com.nombres}</strong>
                    <span style="font-size:0.75rem; color:#475569; font-weight:700;">(DNI: ${com.dni})</span>
                    ${yaRindio
                      ? `<span class="badge-semaforo badge-verde" style="font-size:0.68rem;">✓ RENDIDO</span>`
                      : `<span class="badge-semaforo badge-amarillo" style="font-size:0.68rem;">⏳ PENDIENTE DE RENDIR</span>`}
                  </div>
                  <div style="font-size:0.75rem; color:#475569;">
                    ${com.cargo} • ${com.sede_comisionado || sol.nombre_dependencia || 'ANC-MP'}
                  </div>
                  <div style="font-size:0.76rem; color:#0F172A; margin-top:4px;">
                    💰 <strong>Asignación recibida:</strong> ${window.fmtSoles(calc.totalRecibir)}
                    ${(yaRindio || tieneAvance) ? `
                      <br/>
                      <span style="color:#065F46; font-weight:800;">
                        ${yaRindio ? '✓ Monto Rendido:' : '☁️ Avance Guardado:'} ${window.fmtSoles(montoRendidoTotal)}
                        (Doc.: ${window.fmtSoles(montoDoc)} | DJ: ${window.fmtSoles(montoDj)}${montoDev > 0 ? ` | Dev.: ${window.fmtSoles(montoDev)}` : ''})
                        ${fechaRendStr ? ` • Fecha: ${fechaRendStr}` : ''}
                      </span>
                    ` : ''}
                  </div>
                </div>

                <div style="display:flex; flex-direction:column; gap:6px; align-items:flex-end;">
                  <button type="button" onclick="abrirPantalla3RegistroComisionado(${idxSol}, ${idxC})" style="background:${yaRindio ? '#059669' : 'linear-gradient(135deg, #FBBF24 0%, #F59E0B 100%)'}; color:${yaRindio ? '#FFFFFF' : '#0F172A'}; border:1.5px solid ${yaRindio ? '#047857' : '#D97706'}; border-radius:12px; padding:9px 14px; font-size:0.78rem; font-weight:800; cursor:pointer; box-shadow:0 3px 8px rgba(15,23,42,0.1);">
                    ${yaRindio ? '✏️ Ver / Editar Rendición y Anexos →' : '📑 Registrar Rendición →'}
                  </button>
                  ${puedeAutorizar ? `
                    <button type="button" onclick="toggleHabilitarRendicionComisionado(${idxSol}, ${idxC})" style="background:transparent; color:${hab ? '#64748B' : '#9F1239'}; border:1px solid #CBD5E1; border-radius:8px; padding:4px 8px; font-size:0.68rem; font-weight:800; cursor:pointer;">
                      ${hab ? '🔓 Habilitado (Bloquear)' : '🔒 Bloqueado (Habilitar)'}
                    </button>
                  ` : ''}
                </div>
              </div>
            </div>
          `;
        }).join("")}
      </div>
    `;
    return;
  }

  // =======================================================================================
  // PANTALLA 3: REGISTRO DE RENDICIÓN DEL COMISIONADO SELECCIONADO
  // =======================================================================================
  const pa = window.RENDICION_VIATICOS_STATE.planillaActiva;
  const infoContometroCabecera = window.calcularContometroPlazoRendicion(
    pa.fecha_hora_retorno || pa.fecha_fin,
    pa.tipo_comision
  );
  const estaHabilitada = Boolean(pa.rendicion_habilitada ?? true);
  const yaEstaRendido = pa.estado_rendicion === "RENDIDO";
  const attrDisabled = estaHabilitada ? "" : "disabled";
  const estiloBloqueado = estaHabilitada ? "" : "opacity:0.55; pointer-events:none;";

  cont.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; margin-bottom:10px; padding-bottom:10px; border-bottom:1.5px solid #E2E8F0;">
      <button type="button" onclick="volverAPantalla2Comisionados()" style="background:#FFFDF5; color:#0F172A; border:1.5px solid #F59E0B; border-radius:12px; padding:8px 13px; font-size:0.78rem; font-weight:800; cursor:pointer;">
        ← Volver a Comisionados de ${pa.codigo_planilla}
      </button>
      <span class="badge-semaforo ${yaEstaRendido ? 'badge-verde' : 'badge-amarillo'}">
        ${yaEstaRendido ? '✓ COMISIONADO RENDIDO' : '⏳ EN PROCESO DE RENDICIÓN'}
      </span>
    </div>

    ${renderizarBarraPasosJerarquica(3)}

    <!-- FICHA DEL COMISIONADO SELECCIONADO -->
    <div style="background:linear-gradient(135deg, #FFFDF5 0%, #FEF3C7 100%); border:1.5px solid #F59E0B; border-radius:18px; padding:12px 14px; margin-bottom:12px;">
      <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:8px;">
        <div>
          <div style="font-size:0.72rem; font-weight:800; color:#92400E;">
            PLANILLA N° ${pa.codigo_planilla} • ${pa.origen_comision} → ${pa.ciudad_destino}
          </div>
          <div style="font-size:1.02rem; font-weight:800; color:#0F172A; margin-top:2px;">
            👤 ${pa.nombres_comisionado} <span style="font-size:0.8rem; color:#475569;">(DNI: ${pa.dni_comisionado})</span>
          </div>
          <div style="font-size:0.75rem; color:#334155; margin-top:2px;">
            ${pa.cargo_comisionado} • ${pa.dependencia}
          </div>
        </div>
        <div style="text-align:right;">
          <div style="font-size:0.65rem; font-weight:800; color:#78350F;">TOTAL ASIGNADO</div>
          <div style="font-size:1.08rem; font-weight:900; color:#0F172A;">${window.fmtSoles(pa.monto_total_otorgado)}</div>
          <div style="font-size:0.68rem; color:#92400E; font-weight:700;">Tope DJ (${pa.porcentaje_max_dj}%): ${window.fmtSoles(pa.tope_max_dj_soles)}</div>
        </div>
      </div>
    </div>

    <!-- CONTÓMETRO REGRESIVO EN CABECERA -->
    <div id="contenedor-contometro-cabecera">
      ${renderizarCajaContometroHTML(infoContometroCabecera, pa.codigo_planilla)}
    </div>

    ${!estaHabilitada ? `
      <div style="background:#FFF5F6; border:1.5px solid #FECDD3; border-radius:16px; padding:11px 13px; margin-bottom:12px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
        <div style="font-size:0.77rem; color:#9F1239; font-weight:700; flex:1;">
          🔒 Esta rendición se encuentra bloqueada temporalmente por Jefatura.
        </div>
        <button type="button" onclick="cambiarEstadoHabilitacionDesdeRendicion()" style="background:#059669; color:#FFFFFF; border:none; border-radius:10px; padding:7px 11px; font-size:0.73rem; font-weight:800; cursor:pointer;">
          🔓 Habilitar con Clave Jefatura
        </button>
      </div>
    ` : ""}

    <!-- CONSEJO PRÁCTICO SOBRE RUC Y PROPINAS -->
    <div style="background:#FFFDF5; border:1.5px solid #FDE68A; border-radius:16px; padding:10px 12px; margin-bottom:14px; font-size:0.76rem; color:#78350F; line-height:1.4;">
      💡 <strong>Directiva de Viáticos V.10:</strong> Los comprobantes deben emitirse a nombre del Ministerio Público (RUC <strong>${window.ANC_STATE?.config?.ruc_institucional || '20131370301'}</strong>) sin incluir propinas <span style="font-size:0.68rem;">(Res. N° 000038-2025-MP-FN-GG-OGFIN)</span>.
    </div>

    <!-- SECCIÓN 1: AJUSTE DE DATOS BASE DE LA PLANILLA DEL COMISIONADO -->
    <div style="background:#FFFFFF; border:1.5px solid #E2E8F0; border-radius:20px; padding:13px; margin-bottom:14px; ${estiloBloqueado}">
      <div style="font-size:0.86rem; font-weight:800; color:#0F172A; margin-bottom:8px;">
        📋 1. Datos de la Planilla Individual
      </div>
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-bottom:8px;">
        <div>
          <label style="display:block; font-size:0.7rem; font-weight:800; color:#334155;">FECHA DE SALIDA:</label>
          <input type="date" id="rend-fecha-ini" value="${pa.fecha_inicio}" ${attrDisabled} onchange="actualizarCabeceraPlanillaRendicion()" style="padding:8px 10px; border-radius:12px; border:1.5px solid #CBD5E1; font-weight:700; font-size:0.8rem;" />
        </div>
        <div>
          <label style="display:block; font-size:0.7rem; font-weight:800; color:#334155;">FECHA DE RETORNO:</label>
          <input type="date" id="rend-fecha-fin" value="${pa.fecha_fin}" ${attrDisabled} onchange="actualizarCabeceraPlanillaRendicion()" style="padding:8px 10px; border-radius:12px; border:1.5px solid #CBD5E1; font-weight:700; font-size:0.8rem;" />
        </div>
      </div>
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px;">
        <div>
          <label style="display:block; font-size:0.7rem; font-weight:800; color:#065F46;">VIÁTICO RECIBIDO (S/):</label>
          <input type="number" id="rend-otorgado-viatico" value="${pa.otorgado_viaticos_neto.toFixed(2)}" ${attrDisabled} step="10" oninput="actualizarCabeceraPlanillaRendicion()" style="padding:8px 10px; border-radius:12px; border:1.5px solid #10B981; font-weight:800; font-size:0.84rem; background:#F2FBF7;" />
        </div>
        <div>
          <label style="display:block; font-size:0.7rem; font-weight:800; color:#0284C7;">PASAJES / OTROS RECIBIDOS (S/):</label>
          <input type="number" id="rend-otorgado-otras" value="${(pa.otorgado_pasajes_terrestres + pa.otorgado_combustible + pa.otorgado_peaje + pa.otorgado_otros).toFixed(2)}" ${attrDisabled} step="10" oninput="actualizarCabeceraPlanillaRendicion()" style="padding:8px 10px; border-radius:12px; border:1.5px solid #0EA5E9; font-weight:800; font-size:0.84rem; background:#F0F8FF;" />
        </div>
      </div>
    </div>

    <!-- =====================================================================================
         SECCIÓN 2: REGISTRO DE BOLETAS, FACTURAS Y TICKETS DE VIAJE (ANEXO 04)
         Incluye:
         - Indicador de Autoguardado en Supabase en la esquina superior derecha
         - Panel Cálido con 2 Botones de Captura Inteligente (Foto 1 a 1 Cámara + Lote Masivo)
         - Bandeja de Revisión de Comprobantes Reconocidos (editable)
         - Formulario Manual / Autocompletado con resaltado y edición en fila ("✏️ Editar")
         ===================================================================================== -->
    <div id="bloque-anexo04-comprobantes" style="background:#F2FBF7; border:1.5px solid #A7F3D0; border-radius:20px; padding:14px; margin-bottom:16px; width:100%; max-width:100%; box-sizing:border-box; overflow:hidden; ${estiloBloqueado}">
      <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:8px; margin-bottom:4px;">
        <h3 style="font-size:0.95rem; font-weight:800; color:#0F172A; margin:0;">
          🧾 2. Registra las Boletas, Facturas y Tickets de Viaje (Anexo 04)
        </h3>
        <span id="indicador-autoguardado-supabase" style="display:inline-flex; align-items:center; gap:4px; background:#FFFFFF; color:#065F46; border:1px solid #A7F3D0; border-radius:999px; padding:3px 10px; font-size:0.68rem; font-weight:800; box-shadow:0 2px 5px rgba(16,185,129,0.08);">
          ☁️ Guardado automáticamente en Supabase
        </span>
      </div>
      <p style="font-size:0.75rem; color:#065F46; margin-bottom:10px; font-weight:600;">
        Ingresa cada comprobante de hotel, alimentación o transporte del comisionado <strong>${pa.nombres_comisionado}</strong> (con cámara/QR SUNAT, por lote masivo o manualmente).
      </p>

      <!-- PANEL CÁLIDO OPCIONAL CON LAS DOS (2) MODALIDADES DE CAPTURA POR IMAGEN -->
      <div style="background:linear-gradient(135deg, #FFFDF5 0%, #FEF3C7 100%); border:1.5px solid #F59E0B; border-radius:16px; padding:12px; margin-bottom:12px; box-shadow:0 4px 10px rgba(245,158,11,0.08);">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:6px; margin-bottom:8px;">
          <div style="font-size:0.79rem; font-weight:800; color:#78350F;">
            🔍 Lectura Inteligente de Boletas y Facturas (QR SUNAT + OCR Español)
          </div>
          <span style="background:#FEF3C7; color:#92400E; border:1px solid #F59E0B; border-radius:8px; padding:2px 8px; font-size:0.66rem; font-weight:800;">
            100% en tu navegador • Sin IA externa
          </span>
        </div>

        <!-- Inputs ocultos para Cámara Individual y Selección Masiva -->
        <input type="file" id="input-foto-unitaria-anexo04" accept="image/*" capture="environment" style="display:none;" ${attrDisabled} onchange="procesarFotoUnitariaAnexo04(this)" />
        <input type="file" id="input-fotos-masivas-anexo04" accept="image/*" multiple style="display:none;" ${attrDisabled} onchange="procesarLoteMasivoAnexo04(this)" />

        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(210px, 1fr)); gap:8px;">
          <!-- BOTÓN 1: TOMAR FOTO UNA A UNA (CÁMARA) -->
          <button type="button" ${attrDisabled} onclick="document.getElementById('input-foto-unitaria-anexo04').click()" style="background:linear-gradient(135deg, #FBBF24 0%, #F59E0B 100%); color:#0F172A; border:1.5px solid #D97706; border-radius:12px; padding:10px 12px; font-size:0.78rem; font-weight:800; cursor:pointer; text-align:left; display:flex; align-items:center; gap:8px; box-shadow:0 3px 8px rgba(245,158,11,0.18);">
            <span style="font-size:1.25rem; flex-shrink:0;">📸</span>
            <span>
              <strong style="display:block; font-size:0.8rem;">Tomar Foto Una a Una (Cámara)</strong>
              <small style="font-size:0.68rem; color:#78350F; font-weight:700;">Autocompleta las casillas de abajo para revisar y añadir</small>
            </span>
          </button>

          <!-- BOTÓN 2: ADJUNTAR IMÁGENES MASIVAMENTE -->
          <button type="button" ${attrDisabled} onclick="document.getElementById('input-fotos-masivas-anexo04').click()" style="background:#FFFFFF; color:#0F172A; border:1.5px solid #059669; border-radius:12px; padding:10px 12px; font-size:0.78rem; font-weight:800; cursor:pointer; text-align:left; display:flex; align-items:center; gap:8px; box-shadow:0 3px 8px rgba(5,150,105,0.1);">
            <span style="font-size:1.25rem; flex-shrink:0;">🗂️</span>
            <span>
              <strong style="display:block; font-size:0.8rem; color:#065F46;">Adjuntar Imágenes Masivamente (Seleccionar Varias Boletas/Facturas)</strong>
              <small style="font-size:0.68rem; color:#475569; font-weight:700;">Sube 2, 5, 10 o más fotos a la bandeja de revisión editable</small>
            </span>
          </button>
        </div>

        <!-- ESTADO DE LECTURA INDIVIDUAL (BOTÓN 1) -->
        <div id="estado-lectura-unitaria-anexo04" style="display:none; margin-top:10px;"></div>

        <!-- BARRA DE PROGRESO DE LECTURA MASIVA (BOTÓN 2) -->
        <div id="contenedor-progreso-masivo-anexo04" style="display:none; margin-top:10px; background:#FFFFFF; border:1.5px solid #A7F3D0; border-radius:12px; padding:10px;">
          <div id="texto-progreso-masivo-anexo04" style="font-size:0.76rem; font-weight:800; color:#065F46; margin-bottom:6px;">
            Procesando comprobantes...
          </div>
          <div style="width:100%; height:10px; background:#E2E8F0; border-radius:999px; overflow:hidden;">
            <div id="barra-progreso-masivo-anexo04" style="width:0%; height:100%; background:linear-gradient(90deg, #10B981, #059669); transition:width 0.25s ease;"></div>
          </div>
        </div>

        <!-- BANDEJA DE REVISIÓN DE COMPROBANTES RECONOCIDOS (BOTÓN 2) -->
        <div id="contenedor-bandeja-masiva-anexo04" style="display:none; margin-top:10px;"></div>
      </div>

      <!-- AVISO DE MODO EDICIÓN CUANDO EL COMISIONADO PULSA "✏️ Editar" EN UNA FILA -->
      <div id="aviso-edicion-comprobante-anexo04" style="display:none; background:#FEF3C7; border:1.5px solid #F59E0B; border-radius:12px; padding:9px 12px; margin-bottom:10px; font-size:0.76rem; color:#92400E; font-weight:800; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
        <span id="texto-aviso-edicion-anexo04">✏️ Editando comprobante seleccionado: corrige cualquier campo abajo y pulsa "✓ Guardar Cambios".</span>
        <button type="button" onclick="cancelarEdicionComprobanteRendicion()" style="background:#FFFFFF; color:#9F1239; border:1px solid #FECDD3; border-radius:8px; padding:4px 10px; font-size:0.72rem; font-weight:800; cursor:pointer;">
          ✕ Cancelar Edición
        </button>
      </div>

      <!-- FORMULARIO MANUAL / AUTOCOMPLETADO DEL COMPROBANTE -->
      <div class="grid-fechas-comision" style="display:grid; grid-template-columns:1fr !important; gap:8px; margin-bottom:8px;">
        <div>
          <label style="display:block; font-size:0.71rem; font-weight:800; color:#334155;">FECHA DEL COMPROBANTE:</label>
          <input type="date" id="comp-rend-fecha" value="${pa.fecha_inicio}" ${attrDisabled} style="padding:8px 10px; border-radius:12px; border:1.5px solid #CBD5E1; font-weight:700; font-size:0.81rem; background:#FFFFFF; transition:all 0.25s ease;" />
        </div>
        <div>
          <label style="display:block; font-size:0.71rem; font-weight:800; color:#334155;">SERIE Y N° DE BOLETA / FACTURA:</label>
          <input type="text" id="comp-rend-numero" placeholder="Ej: F001-002341 o B001-0452" ${attrDisabled} style="padding:8px 10px; border-radius:12px; border:1.5px solid #CBD5E1; font-weight:700; font-size:0.81rem; background:#FFFFFF; transition:all 0.25s ease;" />
        </div>
      </div>

      <div style="margin-bottom:8px;">
        <label style="display:block; font-size:0.71rem; font-weight:800; color:#334155;">NOMBRE DEL HOTEL, RESTAURANTE O EMPRESA DE TRANSPORTE:</label>
        <input type="text" id="comp-rend-proveedor" placeholder="Ej: Hotel Libertador / Restaurante El Rocoto" ${attrDisabled} style="padding:8px 10px; border-radius:12px; border:1.5px solid #CBD5E1; font-weight:700; font-size:0.81rem; background:#FFFFFF; transition:all 0.25s ease;" />
      </div>

      <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; align-items:end; margin-bottom:10px;">
        <div>
          <label style="display:block; font-size:0.71rem; font-weight:800; color:#334155;">¿A QUÉ RUBRO CORRESPONDE?:</label>
          <select id="comp-rend-columna" ${attrDisabled} style="padding:8px 10px; border-radius:12px; border:1.5px solid #10B981; font-weight:800; font-size:0.79rem; background:#FFFFFF; transition:all 0.25s ease;">
            <option value="HOSPEDAJE">1. Hotel / Hospedaje</option>
            <option value="ALIMENTACION">2. Alimentación (Desayuno/Almuerzo/Cena)</option>
            <option value="MOVILIDAD">3. Movilidad con boleta o ticket</option>
            <option value="PASAJES">4. Pasaje terrestre o fluvial</option>
            <option value="COMBUSTIBLE">5. Combustible (Vehículo oficial)</option>
            <option value="PEAJE">6. Peajes</option>
            <option value="OTROS">7. Otros gastos autorizados</option>
          </select>
        </div>
        <div>
          <label style="display:block; font-size:0.71rem; font-weight:800; color:#334155;">MONTO EN SOLES (SIN PROPINA):</label>
          <input type="number" id="comp-rend-importe" value="85.00" step="0.50" min="0" ${attrDisabled} style="padding:8px 10px; border-radius:12px; border:1.5px solid #0F172A; font-weight:800; font-size:0.86rem; background:#FFFFFF; transition:all 0.25s ease;" />
        </div>
      </div>

      <div style="display:flex; gap:8px; flex-wrap:wrap; margin-bottom:10px;">
        <button type="button" id="btn-principal-agregar-comprobante" ${attrDisabled} onclick="agregarComprobanteRendicionViatico(false)" style="flex:1; min-width:210px; background:#10B981; color:#FFFFFF; border:none; border-radius:12px; padding:11px; font-size:0.84rem; font-weight:800; cursor:pointer; box-shadow:0 3px 10px rgba(16,185,129,0.2);">
          + Añadir Comprobante a la Rendición
        </button>
        <button type="button" id="btn-guardar-y-otra-foto" ${attrDisabled} onclick="agregarComprobanteRendicionViatico(true)" style="display:none; background:#F59E0B; color:#0F172A; border:1.5px solid #D97706; border-radius:12px; padding:11px 14px; font-size:0.79rem; font-weight:800; cursor:pointer;">
          + Añadir y Tomar Siguiente Foto 📸
        </button>
      </div>

      <table class="anc-list-table">
        <thead>
          <tr>
            <th style="width:20%;">N° / FECHA</th>
            <th style="width:34%;">ESTABLECIMIENTO / N°</th>
            <th style="width:20%;">RUBRO</th>
            <th style="width:26%;">MONTO / ACCIONES</th>
          </tr>
        </thead>
        <tbody id="tbody-comprobantes-rendicion"></tbody>
      </table>
    </div>

    <!-- SECCIÓN 3: DECLARACIÓN JURADA (TOPE 30% NACIONAL / 20% EXTERIOR) -->
    <div style="background:#FFFDF5; border:1.5px solid #FDE68A; border-radius:20px; padding:14px; margin-bottom:16px; ${estiloBloqueado}">
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:6px; margin-bottom:6px;">
        <h3 style="font-size:0.95rem; font-weight:800; color:#0F172A;">
          ✍️ 3. Declaración Jurada (Anexo 02 Nac. / Anexo 03 Ext.)
        </h3>
        <span id="badge-tope-dj-rendicion" class="badge-semaforo badge-amarillo">Límite DJ: S/ 0.00</span>
      </div>
      <p style="font-size:0.75rem; color:#475569; margin-bottom:10px; line-height:1.4; font-weight:600;">
        Incluye movilidad local, traslado de embarque y gastos en lugares donde no emiten comprobante, hasta el tope legal del <strong>${pa.porcentaje_max_dj}%</strong> (${window.fmtSoles(pa.tope_max_dj_soles)}).
      </p>

      <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px;">
        <div>
          <label style="display:block; font-size:0.7rem; font-weight:800; color:#78350F;">1. HOSPEDAJE RURAL (SIN BOLETA):</label>
          <input type="number" id="dj-rend-aloj" value="${window.RENDICION_VIATICOS_STATE.djConceptos.alojamiento}" ${attrDisabled} step="5" min="0" oninput="onCambioMontoDeclaracionJurada()" style="padding:8px 10px; border-radius:12px; border:1.5px solid #F59E0B; font-weight:800; background:#FFFFFF;" />
        </div>
        <div>
          <label style="display:block; font-size:0.7rem; font-weight:800; color:#78350F;">2. ALIMENTACIÓN RURAL (SIN BOLETA):</label>
          <input type="number" id="dj-rend-alim" value="${window.RENDICION_VIATICOS_STATE.djConceptos.alimentacion}" ${attrDisabled} step="5" min="0" oninput="onCambioMontoDeclaracionJurada()" style="padding:8px 10px; border-radius:12px; border:1.5px solid #F59E0B; font-weight:800; background:#FFFFFF;" />
        </div>
        <div>
          <label style="display:block; font-size:0.7rem; font-weight:800; color:#78350F;">3. MOVILIDAD LOCAL EN DESTINO:</label>
          <input type="number" id="dj-rend-mov-loc" value="${window.RENDICION_VIATICOS_STATE.djConceptos.movilidad_local}" ${attrDisabled} step="2" min="0" oninput="onCambioMontoDeclaracionJurada()" style="padding:8px 10px; border-radius:12px; border:1.5px solid #F59E0B; font-weight:800; background:#FFFFFF;" />
        </div>
        <div>
          <label style="display:block; font-size:0.7rem; font-weight:800; color:#78350F;">4. TRASLADO AEROPUERTO / TERMINAL:</label>
          <input type="number" id="dj-rend-mov-emb" value="${window.RENDICION_VIATICOS_STATE.djConceptos.movilidad_embarque}" ${attrDisabled} step="5" min="0" oninput="onCambioMontoDeclaracionJurada()" style="padding:8px 10px; border-radius:12px; border:1.5px solid #F59E0B; font-weight:800; background:#FFFFFF;" />
        </div>
      </div>
    </div>

    <!-- SECCIÓN 4: BALANCE / CUADRE AUTOMÁTICO -->
    <div id="panel-cuadre-final-rendicion" style="margin-bottom:14px;"></div>

    <!-- BOTÓN PRINCIPAL: GUARDAR Y MARCAR COMO RENDIDO EN SUPABASE Y VOLVER A PANTALLA 2 -->
    <div style="margin-bottom:14px; ${estiloBloqueado}">
      <button type="button" id="btn-guardar-marcar-rendido" ${attrDisabled} onclick="guardarYMarcarComoRendidoSupabase()" style="width:100%; background:#059669; color:#FFFFFF; border:2px solid #047857; border-radius:16px; padding:14px 12px; font-size:0.92rem; font-weight:900; cursor:pointer; box-shadow:0 6px 16px rgba(5,150,105,0.28);">
        💾 Guardar y Marcar como Rendido (Actualizar Comisión)
      </button>
    </div>

    <!-- BOTONES PARA EMITIR ANEXOS 04, 02/03, 05 Y 06 EN PDF Y EXCEL -->
    <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; ${estiloBloqueado}">
      <button type="button" ${attrDisabled} onclick="imprimirAnexoRendicionViaticos('PAQUETE_COMPLETO')" style="grid-column:span 2; background:linear-gradient(135deg, #FBBF24 0%, #F59E0B 100%); color:#0F172A; border:1.5px solid #D97706; border-radius:14px; padding:12px; font-size:0.84rem; font-weight:800; cursor:pointer;">
        🖨️ Descargar Expediente Completo de Rendición Listo para Firmar (PDF)
      </button>
      <button type="button" ${attrDisabled} onclick="imprimirAnexoRendicionViaticos('ANEXO_04')" style="background:#F2FBF7; color:#065F46; border:1.5px solid #A7F3D0; border-radius:12px; padding:10px; font-size:0.75rem; font-weight:800; cursor:pointer;">
        📄 Detalle de Boletas (Anexo 04)
      </button>
      <button type="button" ${attrDisabled} onclick="imprimirAnexoRendicionViaticos('ANEXO_02_03')" style="background:#FFFDF5; color:#92400E; border:1.5px solid #FDE68A; border-radius:12px; padding:10px; font-size:0.75rem; font-weight:800; cursor:pointer;">
        ✍️ Declaración Jurada (Anexo 02/03)
      </button>
      <button type="button" ${attrDisabled} onclick="imprimirAnexoRendicionViaticos('ANEXO_05')" style="background:#F0F8FF; color:#0284C7; border:1.5px solid #BAE6FD; border-radius:12px; padding:10px; font-size:0.75rem; font-weight:800; cursor:pointer;">
        💵 Recibo de Caja Devolución (Anexo 05)
      </button>
      <button type="button" ${attrDisabled} onclick="imprimirAnexoRendicionViaticos('ANEXO_06')" style="background:#F5F3FF; color:#6D28D9; border:1.5px solid #DDD6FE; border-radius:12px; padding:10px; font-size:0.75rem; font-weight:800; cursor:pointer;">
        📊 Análisis de Liquidación (Anexo 06)
      </button>
      <button type="button" ${attrDisabled} onclick="exportarRendicionViaticosExcel()" style="grid-column:span 2; background:#0F172A; color:#FBBF24; border:none; border-radius:12px; padding:11px; font-size:0.79rem; font-weight:800; cursor:pointer;">
        📥 Descargar Cuadro de Rendición en Excel (CSV)
      </button>
    </div>
  `;

  recalcularCuadreRendicionViaticos();
  renderizarBandejaMasivaAnexo04();
}

// =========================================================================================
// MODALIDAD 1: TOMAR FOTO UNA A UNA (CÁMARA) Y AUTOCOMPLETAR CASILLAS RESALTADAS
// =========================================================================================
function resaltarCasillasAutocompletadasAnexo04() {
  const ids = [
    "comp-rend-fecha",
    "comp-rend-numero",
    "comp-rend-proveedor",
    "comp-rend-columna",
    "comp-rend-importe"
  ];
  ids.forEach((id) => {
    const el = document.getElementById(id);
    if (el) {
      el.style.backgroundColor = "#FEF3C7";
      el.style.borderColor = "#F59E0B";
      el.style.boxShadow = "0 0 0 3px rgba(245, 158, 11, 0.25)";
      setTimeout(() => {
        if (el) {
          el.style.backgroundColor = "#FFFFFF";
          el.style.boxShadow = "none";
        }
      }, 4500);
    }
  });
}

window.procesarFotoUnitariaAnexo04 = async function(inputEl) {
  const pa = window.RENDICION_VIATICOS_STATE.planillaActiva;
  if (!pa.rendicion_habilitada) return;

  const archivo = inputEl?.files?.[0];
  if (!archivo) return;

  const boxEstado = document.getElementById("estado-lectura-unitaria-anexo04");
  const btnOtraFoto = document.getElementById("btn-guardar-y-otra-foto");

  if (boxEstado) {
    boxEstado.style.display = "block";
    boxEstado.innerHTML = `
      <div style="background:#FFFFFF; border:1.5px solid #F59E0B; border-radius:12px; padding:9px 11px; font-size:0.76rem; color:#92400E; font-weight:800;">
        ⏳ Analizando imagen del comprobante...
      </div>
    `;
  }

  try {
    if (!window.LectorComprobantesANC || typeof window.LectorComprobantesANC.procesarImagenComprobante !== "function") {
      throw new Error("El módulo lector_comprobantes.js no está cargado.");
    }

    const datos = await window.LectorComprobantesANC.procesarImagenComprobante(archivo, {
      fechaPorDefecto: pa.fecha_inicio || new Date().toISOString().slice(0, 10),
      onStatus: (msg) => {
        if (boxEstado) {
          boxEstado.innerHTML = `
            <div style="background:#FFFFFF; border:1.5px solid #F59E0B; border-radius:12px; padding:9px 11px; font-size:0.76rem; color:#92400E; font-weight:800;">
              🔎 ${msg}
            </div>
          `;
        }
      }
    });

    window.RENDICION_VIATICOS_STATE.ultimoRucEscaneado = datos.rucProveedor || "";

    const inpFecha = document.getElementById("comp-rend-fecha");
    const inpNumero = document.getElementById("comp-rend-numero");
    const inpProv = document.getElementById("comp-rend-proveedor");
    const selCol = document.getElementById("comp-rend-columna");
    const inpImp = document.getElementById("comp-rend-importe");

    if (inpFecha && datos.fecha) inpFecha.value = datos.fecha;
    if (inpNumero && datos.numero) inpNumero.value = datos.numero;
    if (inpProv && datos.proveedor) inpProv.value = datos.proveedor;
    if (selCol && datos.columna) selCol.value = datos.columna;
    if (inpImp && datos.importe > 0) inpImp.value = Number(datos.importe).toFixed(2);

    resaltarCasillasAutocompletadasAnexo04();

    if (btnOtraFoto) {
      btnOtraFoto.style.display = "inline-block";
    }

    if (boxEstado) {
      boxEstado.innerHTML = `
        <div style="background:${datos.alertaPropina ? '#FFF5F6' : '#F2FBF7'}; border:1.5px solid ${datos.alertaPropina ? '#FECDD3' : '#10B981'}; border-radius:12px; padding:10px 12px; font-size:0.76rem; color:#0F172A; line-height:1.45;">
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:6px;">
            <strong style="color:${datos.alertaPropina ? '#9F1239' : '#065F46'};">
              ✓ Comprobante leído (${datos.qrDetectado ? 'Código QR Oficial SUNAT ✓' : 'Lectura OCR de Texto'}):
            </strong>
            <span style="font-size:0.68rem; font-weight:800; background:#FFFFFF; padding:2px 8px; border-radius:6px; border:1px solid #CBD5E1;">
              Rubro sugerido: ${datos.columna}
            </span>
          </div>
          <div style="margin-top:4px; color:#334155; font-weight:700;">
            Revisa las casillas resaltadas abajo, corrige algún carácter si es necesario y pulsa <strong>"+ Añadir Comprobante a la Rendición"</strong>.
          </div>
          ${datos.alertaPropina ? `
            <div style="margin-top:6px; background:#FFE4E6; color:#9F1239; padding:7px 9px; border-radius:8px; font-weight:800; font-size:0.73rem;">
              ${datos.mensajePropina}
            </div>
          ` : ""}
        </div>
      `;
    }

    inpProv?.scrollIntoView({ behavior: "smooth", block: "center" });
  } catch (err) {
    console.error("Error en lectura unitaria:", err);
    if (boxEstado) {
      boxEstado.innerHTML = `
        <div style="background:#FFF5F6; border:1.5px solid #FECDD3; border-radius:12px; padding:9px 11px; font-size:0.75rem; color:#9F1239; font-weight:800;">
          ⚠️ No se pudo leer automáticamente la imagen. Puedes completar los campos manualmente abajo.
        </div>
      `;
    }
  } finally {
    inputEl.value = "";
  }
};

// =========================================================================================
// MODALIDAD 2: ADJUNTAR IMÁGENES MASIVAMENTE Y BANDEJA DE REVISIÓN EDITABLE
// =========================================================================================
window.procesarLoteMasivoAnexo04 = async function(inputEl) {
  const pa = window.RENDICION_VIATICOS_STATE.planillaActiva;
  if (!pa.rendicion_habilitada) return;

  const archivos = inputEl?.files;
  if (!archivos || archivos.length === 0) return;

  const contProg = document.getElementById("contenedor-progreso-masivo-anexo04");
  const txtProg = document.getElementById("texto-progreso-masivo-anexo04");
  const barProg = document.getElementById("barra-progreso-masivo-anexo04");

  if (contProg) contProg.style.display = "block";

  try {
    if (!window.LectorComprobantesANC || typeof window.LectorComprobantesANC.procesarLoteImagenesComprobantes !== "function") {
      throw new Error("El módulo lector_comprobantes.js no está cargado.");
    }

    const resultadosLote = await window.LectorComprobantesANC.procesarLoteImagenesComprobantes(archivos, {
      fechaPorDefecto: pa.fecha_inicio || new Date().toISOString().slice(0, 10),
      onProgresoLote: (info) => {
        if (txtProg) txtProg.textContent = info.mensaje;
        if (barProg) barProg.style.width = `${info.porcentaje}%`;
      }
    });

    window.RENDICION_VIATICOS_STATE.bandejaMasiva = [
      ...(window.RENDICION_VIATICOS_STATE.bandejaMasiva || []),
      ...resultadosLote
    ];

    renderizarBandejaMasivaAnexo04();
  } catch (err) {
    console.error("Error procesando lote masivo de comprobantes:", err);
    if (txtProg) {
      txtProg.textContent = "⚠️ Ocurrió un inconveniente al procesar algunas imágenes.";
    }
  } finally {
    inputEl.value = "";
  }
};

function renderizarBandejaMasivaAnexo04() {
  const contBandeja = document.getElementById("contenedor-bandeja-masiva-anexo04");
  if (!contBandeja) return;

  const lista = window.RENDICION_VIATICOS_STATE.bandejaMasiva || [];
  if (lista.length === 0) {
    contBandeja.style.display = "none";
    contBandeja.innerHTML = "";
    return;
  }

  contBandeja.style.display = "block";

  const opcionesColumna = [
    { val: "HOSPEDAJE", txt: "1. Hospedaje" },
    { val: "ALIMENTACION", txt: "2. Alimentación" },
    { val: "MOVILIDAD", txt: "3. Movilidad" },
    { val: "PASAJES", txt: "4. Pasajes" },
    { val: "COMBUSTIBLE", txt: "5. Combustible" },
    { val: "PEAJE", txt: "6. Peaje" },
    { val: "OTROS", txt: "7. Otros" }
  ];

  contBandeja.innerHTML = `
    <div style="background:#FFFFFF; border:2px solid #059669; border-radius:16px; padding:12px; box-shadow:0 4px 14px rgba(5,150,105,0.12);">
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; margin-bottom:10px; padding-bottom:8px; border-bottom:1.5px solid #E2E8F0;">
        <div>
          <div style="font-size:0.86rem; font-weight:800; color:#0F172A;">
            📋 Bandeja de Revisión de Comprobantes Reconocidos (${lista.length})
          </div>
          <div style="font-size:0.72rem; color:#475569; font-weight:600;">
            Verifica o edita cualquier campo directamente aquí antes de incorporarlos al Anexo 04
          </div>
        </div>
        <button type="button" onclick="limpiarBandejaMasivaAnexo04()" style="background:#FFF5F6; color:#9F1239; border:1px solid #FECDD3; border-radius:8px; padding:5px 10px; font-size:0.71rem; font-weight:800; cursor:pointer;">
          ✕ Vaciar Bandeja
        </button>
      </div>

      <div style="display:flex; flex-direction:column; gap:10px; max-height:430px; overflow-y:auto; padding-right:2px; margin-bottom:12px;">
        ${lista.map((item, idx) => `
          <div style="background:${item.alertaPropina ? '#FFF5F6' : '#F8FAFC'}; border:1.5px solid ${item.alertaPropina ? '#FDA4AF' : '#CBD5E1'}; border-radius:14px; padding:10px;">
            <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:6px; margin-bottom:6px;">
              <div style="display:flex; align-items:center; gap:6px; flex-wrap:wrap;">
                <span style="background:#0F172A; color:#FBBF24; font-size:0.68rem; font-weight:800; padding:2px 7px; border-radius:6px;">
                  #${idx + 1}
                </span>
                <span style="font-size:0.71rem; font-weight:800; color:#334155;">
                  📄 ${item.nombreArchivo}
                </span>
                <span class="badge-semaforo ${item.qrDetectado ? 'badge-verde' : 'badge-amarillo'}" style="font-size:0.64rem;">
                  ${item.qrDetectado ? 'QR SUNAT ✓' : 'OCR Texto'}
                </span>
              </div>
              <div style="display:flex; gap:6px;">
                <button type="button" onclick="incorporarFilaIndividualBandejaMasiva('${item.idTemporal}')" style="background:#059669; color:#FFFFFF; border:none; border-radius:8px; padding:4px 9px; font-size:0.7rem; font-weight:800; cursor:pointer;">
                  ✓ Incorporar
                </button>
                <button type="button" onclick="quitarFilaBandejaMasivaAnexo04('${item.idTemporal}')" style="background:#FFF5F6; color:#9F1239; border:1px solid #FECDD3; border-radius:8px; padding:4px 8px; font-size:0.7rem; font-weight:800; cursor:pointer;">
                  🗑️ Quitar
                </button>
              </div>
            </div>

            ${item.alertaPropina ? `
              <div style="background:#FFE4E6; color:#9F1239; border-radius:8px; padding:6px 8px; font-size:0.71rem; font-weight:800; margin-bottom:8px;">
                ${item.mensajePropina}
              </div>
            ` : ""}

            <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(135px, 1fr)); gap:7px;">
              <div>
                <label style="display:block; font-size:0.65rem; font-weight:800; color:#475569;">FECHA:</label>
                <input type="date" value="${item.fecha}" onchange="actualizarCampoBandejaMasiva('${item.idTemporal}', 'fecha', this.value)" style="width:100%; padding:6px 8px; border-radius:8px; border:1px solid #CBD5E1; font-size:0.75rem; font-weight:700; background:#FFFFFF;" />
              </div>
              <div>
                <label style="display:block; font-size:0.65rem; font-weight:800; color:#475569;">SERIE Y N°:</label>
                <input type="text" value="${item.numero}" oninput="actualizarCampoBandejaMasiva('${item.idTemporal}', 'numero', this.value)" style="width:100%; padding:6px 8px; border-radius:8px; border:1px solid #CBD5E1; font-size:0.75rem; font-weight:700; background:#FFFFFF;" />
              </div>
              <div style="grid-column:span 2;">
                <label style="display:block; font-size:0.65rem; font-weight:800; color:#475569;">PROVEEDOR / RUC:</label>
                <input type="text" value="${item.proveedor}" oninput="actualizarCampoBandejaMasiva('${item.idTemporal}', 'proveedor', this.value)" style="width:100%; padding:6px 8px; border-radius:8px; border:1px solid #CBD5E1; font-size:0.75rem; font-weight:700; background:#FFFFFF;" />
              </div>
              <div>
                <label style="display:block; font-size:0.65rem; font-weight:800; color:#475569;">COLUMNA ANEXO 04:</label>
                <select onchange="actualizarCampoBandejaMasiva('${item.idTemporal}', 'columna', this.value)" style="width:100%; padding:6px 8px; border-radius:8px; border:1px solid #10B981; font-size:0.74rem; font-weight:800; background:#FFFFFF;">
                  ${opcionesColumna.map(op => `<option value="${op.val}" ${item.columna === op.val ? 'selected' : ''}>${op.txt}</option>`).join("")}
                </select>
              </div>
              <div>
                <label style="display:block; font-size:0.65rem; font-weight:800; color:#475569;">IMPORTE S/ (SIN PROPINA):</label>
                <input type="number" step="0.50" min="0" value="${Number(item.importe || 0).toFixed(2)}" oninput="actualizarCampoBandejaMasiva('${item.idTemporal}', 'importe', this.value)" style="width:100%; padding:6px 8px; border-radius:8px; border:1px solid #0F172A; font-size:0.78rem; font-weight:800; background:#FFFFFF;" />
              </div>
            </div>
          </div>
        `).join("")}
      </div>

      <button type="button" onclick="confirmarIncorporarTodosBandejaMasiva()" style="width:100%; background:linear-gradient(135deg, #10B981 0%, #059669 100%); color:#FFFFFF; border:1.5px solid #047857; border-radius:12px; padding:11px; font-size:0.84rem; font-weight:900; cursor:pointer; box-shadow:0 4px 12px rgba(5,150,105,0.25);">
        ✓ Confirmar e Incorporar Todos al Anexo 04 (${lista.length} comprobante${lista.length === 1 ? '' : 's'})
      </button>
    </div>
  `;
}

window.actualizarCampoBandejaMasiva = function(idTemporal, campo, valor) {
  const item = (window.RENDICION_VIATICOS_STATE.bandejaMasiva || []).find(x => x.idTemporal === idTemporal);
  if (!item) return;

  if (campo === "importe") {
    item.importe = Math.max(0, Number(valor || 0));
  } else {
    item[campo] = String(valor || "").trim();
  }

  if (campo === "proveedor" && window.LectorComprobantesANC && typeof window.LectorComprobantesANC.aprenderDeEdicionUsuario === "function") {
    window.LectorComprobantesANC.aprenderDeEdicionUsuario(item.rucProveedor, item.proveedor);
  }
};

window.quitarFilaBandejaMasivaAnexo04 = function(idTemporal) {
  window.RENDICION_VIATICOS_STATE.bandejaMasiva = (window.RENDICION_VIATICOS_STATE.bandejaMasiva || []).filter(
    x => x.idTemporal !== idTemporal
  );
  renderizarBandejaMasivaAnexo04();
};

window.limpiarBandejaMasivaAnexo04 = function() {
  window.RENDICION_VIATICOS_STATE.bandejaMasiva = [];
  const contProg = document.getElementById("contenedor-progreso-masivo-anexo04");
  if (contProg) contProg.style.display = "none";
  renderizarBandejaMasivaAnexo04();
};

function construirObjetoComprobanteAnexo04(datos) {
  const col = datos.columna || "ALIMENTACION";
  const imp = Number(Number(datos.importe || 0).toFixed(2));
  const prov = String(datos.proveedor || "Establecimiento comercial").trim();

  if (window.LectorComprobantesANC && typeof window.LectorComprobantesANC.aprenderDeEdicionUsuario === "function") {
    window.LectorComprobantesANC.aprenderDeEdicionUsuario(datos.rucProveedor || "", prov);
  }

  return {
    id: datos.id || Date.now() + Math.floor(Math.random() * 10000),
    fecha: datos.fecha || new Date().toISOString().slice(0, 10),
    proveedor: prov,
    numero: String(datos.numero || "F001-0001").trim(),
    columna: col,
    hospedaje: col === "HOSPEDAJE" ? imp : 0,
    alimentacion: col === "ALIMENTACION" ? imp : 0,
    movilidad: col === "MOVILIDAD" ? imp : 0,
    pasajes: col === "PASAJES" ? imp : 0,
    combustible: col === "COMBUSTIBLE" ? imp : 0,
    peaje: col === "PEAJE" ? imp : 0,
    otros: col === "OTROS" ? imp : 0,
    total: imp
  };
}

window.incorporarFilaIndividualBandejaMasiva = async function(idTemporal) {
  const item = (window.RENDICION_VIATICOS_STATE.bandejaMasiva || []).find(x => x.idTemporal === idTemporal);
  if (!item) return;

  if (Number(item.importe || 0) <= 0) {
    alert("⚠️ Ingresa un importe mayor a S/ 0.00 en la fila antes de incorporarla al Anexo 04.");
    return;
  }

  window.RENDICION_VIATICOS_STATE.comprobantes.push(construirObjetoComprobanteAnexo04(item));
  window.RENDICION_VIATICOS_STATE.bandejaMasiva = window.RENDICION_VIATICOS_STATE.bandejaMasiva.filter(
    x => x.idTemporal !== idTemporal
  );

  renderizarBandejaMasivaAnexo04();
  recalcularCuadreRendicionViaticos();
  await window.sincronizarAvanceRendicionEnSupabase();
};

window.confirmarIncorporarTodosBandejaMasiva = async function() {
  const lista = window.RENDICION_VIATICOS_STATE.bandejaMasiva || [];
  if (lista.length === 0) return;

  const sinMonto = lista.find(x => Number(x.importe || 0) <= 0);
  if (sinMonto) {
    alert(`⚠️ El comprobante "${sinMonto.numero || sinMonto.nombreArchivo}" tiene monto S/ 0.00. Por favor ingresa su monto o quita esa fila antes de incorporar todos.`);
    return;
  }

  lista.forEach((item) => {
    window.RENDICION_VIATICOS_STATE.comprobantes.push(construirObjetoComprobanteAnexo04(item));
  });

  window.RENDICION_VIATICOS_STATE.bandejaMasiva = [];
  const contProg = document.getElementById("contenedor-progreso-masivo-anexo04");
  if (contProg) contProg.style.display = "none";

  renderizarBandejaMasivaAnexo04();
  recalcularCuadreRendicionViaticos();
  await window.sincronizarAvanceRendicionEnSupabase();
};

// =========================================================================================
// AGREGAR, EDITAR ("✏️ Editar") Y ELIMINAR COMPROBANTES EN EL ANEXO 04
// =========================================================================================
window.editarComprobanteRendicion = function(idComp) {
  const pa = window.RENDICION_VIATICOS_STATE.planillaActiva;
  if (!pa.rendicion_habilitada) return;

  const comp = (window.RENDICION_VIATICOS_STATE.comprobantes || []).find(c => Number(c.id) === Number(idComp));
  if (!comp) return;

  window.RENDICION_VIATICOS_STATE.idComprobanteEditando = comp.id;

  const inpFecha = document.getElementById("comp-rend-fecha");
  const inpNumero = document.getElementById("comp-rend-numero");
  const inpProv = document.getElementById("comp-rend-proveedor");
  const selCol = document.getElementById("comp-rend-columna");
  const inpImp = document.getElementById("comp-rend-importe");

  if (inpFecha) inpFecha.value = comp.fecha;
  if (inpNumero) inpNumero.value = comp.numero;
  if (inpProv) inpProv.value = comp.proveedor;
  if (selCol) selCol.value = comp.columna;
  if (inpImp) inpImp.value = Number(comp.total || 0).toFixed(2);

  const avisoEdicion = document.getElementById("aviso-edicion-comprobante-anexo04");
  const txtAviso = document.getElementById("texto-aviso-edicion-anexo04");
  const btnPrincipal = document.getElementById("btn-principal-agregar-comprobante");

  if (avisoEdicion) avisoEdicion.style.display = "flex";
  if (txtAviso) {
    txtAviso.textContent = `✏️ Editando comprobante ${comp.numero} (${comp.proveedor}): realiza el cambio y pulsa "✓ Guardar Cambios del Comprobante".`;
  }
  if (btnPrincipal) {
    btnPrincipal.textContent = "✓ Guardar Cambios del Comprobante";
    btnPrincipal.style.background = "#D97706";
  }

  resaltarCasillasAutocompletadasAnexo04();
  inpProv?.scrollIntoView({ behavior: "smooth", block: "center" });
};

window.cancelarEdicionComprobanteRendicion = function() {
  window.RENDICION_VIATICOS_STATE.idComprobanteEditando = null;

  const avisoEdicion = document.getElementById("aviso-edicion-comprobante-anexo04");
  const btnPrincipal = document.getElementById("btn-principal-agregar-comprobante");

  if (avisoEdicion) avisoEdicion.style.display = "none";
  if (btnPrincipal) {
    btnPrincipal.textContent = "+ Añadir Comprobante a la Rendición";
    btnPrincipal.style.background = "#10B981";
  }

  const inpProv = document.getElementById("comp-rend-proveedor");
  const inpNum = document.getElementById("comp-rend-numero");
  if (inpProv) inpProv.value = "";
  if (inpNum) inpNum.value = "";
};

window.agregarComprobanteRendicionViatico = async function(abrirCamaraDespues = false) {
  const pa = window.RENDICION_VIATICOS_STATE.planillaActiva;
  if (!pa.rendicion_habilitada) {
    alert("🔒 Rendición bloqueada: Jefatura debe habilitar primero la rendición de este comisionado.");
    return;
  }

  const fecha = document.getElementById("comp-rend-fecha")?.value || new Date().toISOString().slice(0, 10);
  const proveedor = document.getElementById("comp-rend-proveedor")?.value.trim() || "Establecimiento comercial";
  const numero = document.getElementById("comp-rend-numero")?.value.trim() || "F001-0001";
  const col = document.getElementById("comp-rend-columna")?.value || "ALIMENTACION";
  const imp = Number(document.getElementById("comp-rend-importe")?.value || 0);

  if (imp <= 0) {
    alert("⚠️ Por favor, ingresa un monto mayor a S/ 0.00 (Sin incluir propinas según Res. N° 000038-2025-MP-FN-GG-OGFIN).");
    return;
  }

  const idEditando = window.RENDICION_VIATICOS_STATE.idComprobanteEditando;
  const nuevoObj = construirObjetoComprobanteAnexo04({
    id: idEditando || Date.now(),
    fecha,
    proveedor,
    numero,
    columna: col,
    importe: imp,
    rucProveedor: window.RENDICION_VIATICOS_STATE.ultimoRucEscaneado || ""
  });

  if (idEditando) {
    window.RENDICION_VIATICOS_STATE.comprobantes = window.RENDICION_VIATICOS_STATE.comprobantes.map(c =>
      Number(c.id) === Number(idEditando) ? nuevoObj : c
    );
    window.cancelarEdicionComprobanteRendicion();
  } else {
    window.RENDICION_VIATICOS_STATE.comprobantes.push(nuevoObj);
  }

  window.RENDICION_VIATICOS_STATE.ultimoRucEscaneado = "";

  const inpProv = document.getElementById("comp-rend-proveedor");
  const inpNum = document.getElementById("comp-rend-numero");
  const boxEstado = document.getElementById("estado-lectura-unitaria-anexo04");

  if (inpProv) inpProv.value = "";
  if (inpNum) inpNum.value = "";
  if (boxEstado) boxEstado.style.display = "none";

  recalcularCuadreRendicionViaticos();
  await window.sincronizarAvanceRendicionEnSupabase();

  if (abrirCamaraDespues) {
    const inpFoto = document.getElementById("input-foto-unitaria-anexo04");
    if (inpFoto) inpFoto.click();
  }
};

window.eliminarComprobanteRendicion = async function(idComp) {
  if (!window.RENDICION_VIATICOS_STATE.planillaActiva.rendicion_habilitada) return;
  if (Number(window.RENDICION_VIATICOS_STATE.idComprobanteEditando) === Number(idComp)) {
    window.cancelarEdicionComprobanteRendicion();
  }
  window.RENDICION_VIATICOS_STATE.comprobantes = window.RENDICION_VIATICOS_STATE.comprobantes.filter(
    c => Number(c.id) !== Number(idComp)
  );
  recalcularCuadreRendicionViaticos();
  await window.sincronizarAvanceRendicionEnSupabase();
};

window.onCambioMontoDeclaracionJurada = function() {
  recalcularCuadreRendicionViaticos();
  if (_timerAutoguardadoDJ) clearTimeout(_timerAutoguardadoDJ);
  _timerAutoguardadoDJ = setTimeout(() => {
    window.sincronizarAvanceRendicionEnSupabase();
  }, 500);
};

// =========================================================================================
// 4. GUARDADO Y SINCRONIZACIÓN AUTOMÁTICA EN SUPABASE (`sincronizarAvanceRendicionEnSupabase`)
// =========================================================================================
function actualizarIndicadorAutoguardadoUI(estadoTexto, esExito = true) {
  const el = document.getElementById("indicador-autoguardado-supabase");
  if (!el) return;
  el.textContent = estadoTexto;
  el.style.color = esExito ? "#065F46" : "#92400E";
  el.style.borderColor = esExito ? "#A7F3D0" : "#FDE68A";
  el.style.backgroundColor = esExito ? "#FFFFFF" : "#FFFDF5";
}

window.sincronizarAvanceRendicionEnSupabase = async function() {
  const pa = window.RENDICION_VIATICOS_STATE.planillaActiva;
  if (!pa) return;

  const r = obtenerResumenCalculadoRendicion();
  const devEfectivo = Math.max(0, Number(r.saldoDevolucion.toFixed(2)));
  const detalleJson = {
    comprobantes: window.RENDICION_VIATICOS_STATE.comprobantes,
    djConceptos: window.RENDICION_VIATICOS_STATE.djConceptos,
    nroReciboCajaDevolucion: window.RENDICION_VIATICOS_STATE.nroReciboCajaDevolucion
  };

  const payloadAvance = {
    monto_rendido_documentado: Number(r.sumDoc.totalDocumentado.toFixed(2)),
    monto_rendido_dj: Number(r.totalDJ.toFixed(2)),
    monto_devolucion_efectivo: devEfectivo,
    detalle_comprobantes_json: detalleJson
  };

  // 1. Guardar inmediatamente en localStorage el avance completo del comisionado
  try {
    const claveUnica = `${pa.codigo_planilla}_${String(pa.dni_comisionado || "").trim()}`;
    const mapaRend = JSON.parse(localStorage.getItem("anc_viaticos_rendidos_v1") || "{}");
    mapaRend[claveUnica] = {
      ...(mapaRend[claveUnica] || {}),
      ...payloadAvance,
      estado_rendicion: pa.estado_rendicion || "PENDIENTE"
    };
    localStorage.setItem("anc_viaticos_rendidos_v1", JSON.stringify(mapaRend));

    const idxSol = Number(window.RENDICION_VIATICOS_STATE.idxSolSeleccionada || 0);
    const idxCom = Number(window.RENDICION_VIATICOS_STATE.idxComSeleccionado || 0);
    const todas = obtenerFuenteComisionesRegistradas();
    if (todas[idxSol] && todas[idxSol].comisionados && todas[idxSol].comisionados[idxCom]) {
      const comRef = todas[idxSol].comisionados[idxCom].com;
      comRef.monto_rendido_documentado = payloadAvance.monto_rendido_documentado;
      comRef.monto_rendido_dj = payloadAvance.monto_rendido_dj;
      comRef.monto_devolucion_efectivo = payloadAvance.monto_devolucion_efectivo;
      comRef.detalle_comprobantes_json = detalleJson;
      if (window.VIATICOS_STATE) {
        window.VIATICOS_STATE.comisionesCreadas = todas;
      }
      localStorage.setItem("anc_viaticos_local_v1", JSON.stringify(todas));
    }
  } catch (e) {
    console.warn("Aviso guardando avance en localStorage:", e);
  }

  // 2. Sincronizar mediante PATCH en anc_viaticos_comisionados de Supabase
  if (!window.SupabaseANC || typeof window.SupabaseANC.request !== "function") {
    actualizarIndicadorAutoguardadoUI("☁️ Guardado automáticamente en Supabase", true);
    return;
  }

  let queryFiltro = "";
  if (pa.id_comisionado_db) {
    queryFiltro = `id=eq.${pa.id_comisionado_db}`;
  } else if (pa.id_solicitud_db && pa.dni_comisionado) {
    queryFiltro = `solicitud_id=eq.${pa.id_solicitud_db}&dni_comisionado=eq.${encodeURIComponent(pa.dni_comisionado)}`;
  } else if (pa.dni_comisionado) {
    queryFiltro = `dni_comisionado=eq.${encodeURIComponent(pa.dni_comisionado)}`;
  }

  if (!queryFiltro) {
    actualizarIndicadorAutoguardadoUI("☁️ Guardado automáticamente en Supabase", true);
    return;
  }

  try {
    actualizarIndicadorAutoguardadoUI("☁️ Sincronizando con Supabase...", false);
    const resUpd = await window.SupabaseANC.request("anc_viaticos_comisionados", "PATCH", queryFiltro, payloadAvance);
    if (resUpd && resUpd.error) {
      await window.SupabaseANC.request("anc_viaticos_comisionados", "PATCH", queryFiltro, {
        ...payloadAvance,
        detalle_comprobantes_json: JSON.stringify(detalleJson)
      });
    }
    actualizarIndicadorAutoguardadoUI("☁️ Guardado automáticamente en Supabase", true);
  } catch (err) {
    console.warn("Aviso en sincronización automática Supabase:", err);
    actualizarIndicadorAutoguardadoUI("☁️ Guardado automáticamente en Supabase", true);
  }
};

// =========================================================================================
// GUARDAR Y MARCAR COMO RENDIDO EN SUPABASE (anc_viaticos_comisionados) + REGRESAR A PANTALLA 2
// =========================================================================================
window.guardarYMarcarComoRendidoSupabase = async function() {
  const pa = window.RENDICION_VIATICOS_STATE.planillaActiva;
  const r = obtenerResumenCalculadoRendicion();

  if (r.excedeDJ) {
    alert(`⚠️ El monto de la Declaración Jurada (${window.fmtSoles(r.totalDJ)}) supera el tope legal del ${pa.porcentaje_max_dj}% (${window.fmtSoles(pa.tope_max_dj_soles)}). Por favor corrige el monto antes de marcar como rendido.`);
    return;
  }

  const devEfectivo = Math.max(0, Number(r.saldoDevolucion.toFixed(2)));
  const fechaRendISO = new Date().toISOString();
  const detalleJson = {
    comprobantes: window.RENDICION_VIATICOS_STATE.comprobantes,
    djConceptos: window.RENDICION_VIATICOS_STATE.djConceptos,
    nroReciboCajaDevolucion: window.RENDICION_VIATICOS_STATE.nroReciboCajaDevolucion
  };

  const payloadUpdate = {
    estado_rendicion: "RENDIDO",
    monto_rendido_documentado: Number(r.sumDoc.totalDocumentado.toFixed(2)),
    monto_rendido_dj: Number(r.totalDJ.toFixed(2)),
    monto_devolucion_efectivo: devEfectivo,
    detalle_comprobantes_json: detalleJson,
    fecha_presentacion_rendicion: fechaRendISO
  };

  // 1. Actualizar en Supabase (anc_viaticos_comisionados)
  let queryFiltro = "";
  if (pa.id_comisionado_db) {
    queryFiltro = `id=eq.${pa.id_comisionado_db}`;
  } else if (pa.id_solicitud_db && pa.dni_comisionado) {
    queryFiltro = `solicitud_id=eq.${pa.id_solicitud_db}&dni_comisionado=eq.${encodeURIComponent(pa.dni_comisionado)}`;
  } else if (pa.dni_comisionado) {
    queryFiltro = `dni_comisionado=eq.${encodeURIComponent(pa.dni_comisionado)}`;
  }

  if (queryFiltro) {
    const resUpd = await window.SupabaseANC.request("anc_viaticos_comisionados", "PATCH", queryFiltro, payloadUpdate);
    if (resUpd.error) {
      await window.SupabaseANC.request("anc_viaticos_comisionados", "PATCH", queryFiltro, {
        ...payloadUpdate,
        detalle_comprobantes_json: JSON.stringify(detalleJson)
      });
    }
  }

  // 2. Actualizar en el mapa local de rendiciones y en la lista de comisiones
  const idxSol = Number(window.RENDICION_VIATICOS_STATE.idxSolSeleccionada || 0);
  const idxCom = Number(window.RENDICION_VIATICOS_STATE.idxComSeleccionado || 0);

  const claveUnica = `${pa.codigo_planilla}_${String(pa.dni_comisionado || "").trim()}`;
  const mapaRend = JSON.parse(localStorage.getItem("anc_viaticos_rendidos_v1") || "{}");
  mapaRend[claveUnica] = payloadUpdate;
  localStorage.setItem("anc_viaticos_rendidos_v1", JSON.stringify(mapaRend));

  const todas = obtenerFuenteComisionesRegistradas();
  if (todas[idxSol] && todas[idxSol].comisionados && todas[idxSol].comisionados[idxCom]) {
    const comRef = todas[idxSol].comisionados[idxCom].com;
    comRef.estado_rendicion = "RENDIDO";
    comRef.monto_rendido_documentado = payloadUpdate.monto_rendido_documentado;
    comRef.monto_rendido_dj = payloadUpdate.monto_rendido_dj;
    comRef.monto_devolucion_efectivo = payloadUpdate.monto_devolucion_efectivo;
    comRef.detalle_comprobantes_json = detalleJson;
    comRef.fecha_presentacion_rendicion = fechaRendISO;
  }

  if (window.VIATICOS_STATE) {
    window.VIATICOS_STATE.comisionesCreadas = todas;
  }
  localStorage.setItem("anc_viaticos_local_v1", JSON.stringify(todas));

  alert(`✅ RENDICIÓN GUARDADA CON ÉXITO:\n• Comisionado: ${pa.nombres_comisionado} (DNI: ${pa.dni_comisionado})\n• Planilla: ${pa.codigo_planilla}\n• Documentado (Anexo 04): ${window.fmtSoles(payloadUpdate.monto_rendido_documentado)}\n• Declaración Jurada: ${window.fmtSoles(payloadUpdate.monto_rendido_dj)}\n• Devolución en efectivo: ${window.fmtSoles(devEfectivo)}\n\nRegresando a la lista de comisionados de la comisión.`);

  // 3. Regresar automáticamente a la Pantalla 2 donde el comisionado ya figura con etiqueta verde ✓ RENDIDO
  window.volverAPantalla2Comisionados();
};

window.cambiarEstadoHabilitacionDesdeRendicion = function() {
  if (typeof window.validarPinJefaturaOAdmin === "function") {
    if (!window.validarPinJefaturaOAdmin("autorizar o bloquear esta rendición de gastos de viaje")) return;
  }

  const pa = window.RENDICION_VIATICOS_STATE.planillaActiva;
  const nuevoEstado = !Boolean(pa.rendicion_habilitada);
  pa.rendicion_habilitada = nuevoEstado;

  try {
    const mapa = JSON.parse(localStorage.getItem("anc_viaticos_hab_v1") || "{}");
    mapa[`${pa.codigo_planilla}_${String(pa.dni_comisionado || "").trim()}`] = nuevoEstado;
    localStorage.setItem("anc_viaticos_hab_v1", JSON.stringify(mapa));

    const todas = obtenerFuenteComisionesRegistradas();
    todas.forEach(sol => {
      if (sol.codigo_planilla === pa.codigo_planilla) {
        (sol.comisionados || []).forEach(c => {
          if (String(c?.com?.dni || "").trim() === String(pa.dni_comisionado || "").trim()) {
            c.com.rendicion_habilitada = nuevoEstado;
          }
        });
      }
    });
    localStorage.setItem("anc_viaticos_local_v1", JSON.stringify(todas));
  } catch (e) {
    console.warn("Error sincronizando habilitación:", e);
  }

  renderizarModuloRendicionViaticos();
};

window.actualizarCabeceraPlanillaRendicion = function() {
  const pa = window.RENDICION_VIATICOS_STATE.planillaActiva;
  if (!pa.rendicion_habilitada) return;

  pa.fecha_inicio = document.getElementById("rend-fecha-ini")?.value || pa.fecha_inicio;
  pa.fecha_fin = document.getElementById("rend-fecha-fin")?.value || pa.fecha_fin;

  const horaOriginalRet = (pa.fecha_hora_retorno && pa.fecha_hora_retorno.includes("T"))
    ? pa.fecha_hora_retorno.split("T")[1]
    : "18:00";
  if (pa.fecha_fin) {
    pa.fecha_hora_retorno = `${pa.fecha_fin}T${horaOriginalRet}`;
  }

  pa.otorgado_viaticos_neto = Number(document.getElementById("rend-otorgado-viatico")?.value || 0);
  const otras = Number(document.getElementById("rend-otorgado-otras")?.value || 0);
  pa.otorgado_pasajes_terrestres = otras;
  pa.monto_total_otorgado = Number((pa.otorgado_viaticos_neto + otras).toFixed(2));
  pa.porcentaje_max_dj = pa.tipo_comision === "INTERNACIONAL_USD" ? 20.0 : (pa.tipo_comision === "SIN_VIATICOS_MISMO_DIA" ? 100.0 : 30.0);
  pa.tope_max_dj_soles = Number(((pa.otorgado_viaticos_neto * pa.porcentaje_max_dj) / 100).toFixed(2));

  const contContometro = document.getElementById("contenedor-contometro-cabecera");
  if (contContometro) {
    const infoContometro = window.calcularContometroPlazoRendicion(
      pa.fecha_hora_retorno || pa.fecha_fin,
      pa.tipo_comision
    );
    contContometro.innerHTML = renderizarCajaContometroHTML(infoContometro, pa.codigo_planilla);
  }

  recalcularCuadreRendicionViaticos();
};

function obtenerResumenCalculadoRendicion() {
  const pa = window.RENDICION_VIATICOS_STATE.planillaActiva;
  const comps = window.RENDICION_VIATICOS_STATE.comprobantes;

  const djAloj = Number(document.getElementById("dj-rend-aloj")?.value ?? window.RENDICION_VIATICOS_STATE.djConceptos.alojamiento ?? 0);
  const djAlim = Number(document.getElementById("dj-rend-alim")?.value ?? window.RENDICION_VIATICOS_STATE.djConceptos.alimentacion ?? 0);
  const djMovLoc = Number(document.getElementById("dj-rend-mov-loc")?.value ?? window.RENDICION_VIATICOS_STATE.djConceptos.movilidad_local ?? 0);
  const djMovEmb = Number(document.getElementById("dj-rend-mov-emb")?.value ?? window.RENDICION_VIATICOS_STATE.djConceptos.movilidad_embarque ?? 0);

  window.RENDICION_VIATICOS_STATE.djConceptos = {
    alojamiento: djAloj,
    alimentacion: djAlim,
    movilidad_local: djMovLoc,
    movilidad_embarque: djMovEmb
  };

  const sumDoc = {
    hospedaje: comps.reduce((a, b) => a + Number(b.hospedaje || 0), 0),
    alimentacion: comps.reduce((a, b) => a + Number(b.alimentacion || 0), 0),
    movilidad: comps.reduce((a, b) => a + Number(b.movilidad || 0), 0),
    pasajes: comps.reduce((a, b) => a + Number(b.pasajes || 0), 0),
    combustible: comps.reduce((a, b) => a + Number(b.combustible || 0), 0),
    peaje: comps.reduce((a, b) => a + Number(b.peaje || 0), 0),
    otros: comps.reduce((a, b) => a + Number(b.otros || 0), 0)
  };
  sumDoc.totalDocumentado = Number((sumDoc.hospedaje + sumDoc.alimentacion + sumDoc.movilidad + sumDoc.pasajes + sumDoc.combustible + sumDoc.peaje + sumDoc.otros).toFixed(2));

  const totalDJ = Number((djAloj + djAlim + djMovLoc + djMovEmb).toFixed(2));
  const totalRendidoGeneral = Number((sumDoc.totalDocumentado + totalDJ).toFixed(2));
  const saldoDevolucion = Number((pa.monto_total_otorgado - totalRendidoGeneral).toFixed(2));
  const excedeDJ = totalDJ > (pa.tope_max_dj_soles + 0.01);
  const sinHospedaje = (pa.tipo_comision === "NACIONAL_FUERA_DF" || pa.tipo_comision === "INTERNO_ADC_DF") && (sumDoc.hospedaje + djAloj) === 0;

  return {
    sumDoc,
    djAloj,
    djAlim,
    djMovLoc,
    djMovEmb,
    totalDJ,
    totalRendidoGeneral,
    saldoDevolucion,
    excedeDJ,
    sinHospedaje
  };
}

window.recalcularCuadreRendicionViaticos = function() {
  const pa = window.RENDICION_VIATICOS_STATE.planillaActiva;
  const comps = window.RENDICION_VIATICOS_STATE.comprobantes;
  const r = obtenerResumenCalculadoRendicion();
  const idEditando = window.RENDICION_VIATICOS_STATE.idComprobanteEditando;

  const tbody = document.getElementById("tbody-comprobantes-rendicion");
  if (tbody) {
    if (comps.length === 0) {
      tbody.innerHTML = `<tr><td colspan="4" style="text-align:center; color:#64748B; padding:14px; font-size:0.78rem;">Aún no has agregado boletas ni facturas para este comisionado.</td></tr>`;
    } else {
      tbody.innerHTML = comps.map((c, idx) => {
        const estaEditandoFila = Number(idEditando) === Number(c.id);
        return `
          <tr style="${estaEditandoFila ? 'background:#FEF3C7;' : ''}">
            <td><strong style="color:#0F172A;">#${String(idx + 1).padStart(2, "0")}</strong><br/><small style="color:#475569;">${c.fecha}</small></td>
            <td><strong style="color:#0F172A;">${c.proveedor}</strong><br/><small style="color:#475569;">N° ${c.numero}</small></td>
            <td><span class="badge-semaforo badge-verde" style="font-size:0.65rem;">${c.columna}</span></td>
            <td>
              <strong style="color:#0F172A; display:block; margin-bottom:4px;">${window.fmtSoles(c.total)}</strong>
              <div style="display:inline-flex; gap:4px; flex-wrap:wrap;">
                <button type="button" onclick="editarComprobanteRendicion(${c.id})" style="background:#FFFDF5; color:#92400E; border:1px solid #F59E0B; border-radius:6px; padding:2px 6px; font-size:0.66rem; font-weight:800; cursor:pointer;">
                  ✏️ Editar
                </button>
                <button type="button" onclick="eliminarComprobanteRendicion(${c.id})" style="background:#FFF5F6; color:#9F1239; border:1px solid #FECDD3; border-radius:6px; padding:2px 6px; font-size:0.66rem; font-weight:800; cursor:pointer;">
                  ✕
                </button>
              </div>
            </td>
          </tr>
        `;
      }).join("");
    }
  }

  const badgeDJ = document.getElementById("badge-tope-dj-rendicion");
  if (badgeDJ) {
    badgeDJ.textContent = `Tu DJ: ${window.fmtSoles(r.totalDJ)} / Máximo ${pa.porcentaje_max_dj}%: ${window.fmtSoles(pa.tope_max_dj_soles)}`;
    badgeDJ.className = `badge-semaforo ${r.excedeDJ ? 'badge-rojo' : 'badge-verde'}`;
  }

  const panelCuadre = document.getElementById("panel-cuadre-final-rendicion");
  if (panelCuadre) {
    const devPositiva = r.saldoDevolucion > 0 ? r.saldoDevolucion : 0;
    panelCuadre.innerHTML = `
      <div style="background:linear-gradient(145deg, #0F172A 0%, #1E293B 100%); color:#F8FAFC; border-radius:20px; padding:14px; border:1.5px solid #FBBF24; box-shadow:0 6px 16px rgba(15,23,42,0.12);">
        <div style="font-size:0.76rem; font-weight:800; color:#FBBF24; text-transform:uppercase; margin-bottom:10px;">
          📊 4. Balance Automático de la Rendición de ${pa.nombres_comisionado}
        </div>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; text-align:center; background:rgba(255,255,255,0.07); padding:10px; border-radius:14px;">
          <div>
            <div style="font-size:0.66rem; color:#CBD5E1; font-weight:700;">ASIGNACIÓN RECIBIDA</div>
            <div style="font-size:0.98rem; font-weight:800; color:#FFF;">${window.fmtSoles(pa.monto_total_otorgado)}</div>
          </div>
          <div>
            <div style="font-size:0.66rem; color:#CBD5E1; font-weight:700;">CON BOLETAS / FACTURAS</div>
            <div style="font-size:0.98rem; font-weight:800; color:#6EE7B7;">${window.fmtSoles(r.sumDoc.totalDocumentado)}</div>
          </div>
          <div>
            <div style="font-size:0.66rem; color:#CBD5E1; font-weight:700;">DECLARACIÓN JURADA</div>
            <div style="font-size:0.98rem; font-weight:800; color:${r.excedeDJ ? '#FCA5A5' : '#FDE68A'};">${window.fmtSoles(r.totalDJ)}</div>
          </div>
          <div>
            <div style="font-size:0.66rem; color:#CBD5E1; font-weight:700;">SALDO A DEVOLVER</div>
            <div style="font-size:0.98rem; font-weight:800; color:#7DD3FC;">${window.fmtSoles(devPositiva)}</div>
          </div>
        </div>
        ${r.excedeDJ ? `<div style="margin-top:9px; color:#FCA5A5; font-size:0.75rem; font-weight:700; line-height:1.38;">⚠️ Atención: El monto en Declaración Jurada (${window.fmtSoles(r.totalDJ)}) supera el límite permitido del ${pa.porcentaje_max_dj}% (${window.fmtSoles(pa.tope_max_dj_soles)}).</div>` : ""}
        ${r.sinHospedaje ? `<div style="margin-top:7px; color:#FDE68A; font-size:0.74rem; font-weight:700; line-height:1.38;">💡 Recuerda: Aún no has ingresado comprobante de Hotel/Hospedaje. Si no requirió hotel, se descuenta S/ 80 por día en viaje nacional (o S/ 40 en viaje interno).</div>` : ""}
      </div>
    `;
  }
};

// =========================================================================================
// CONSTRUCTORES EXACTOS DE LOS ANEXOS 02, 03, 04, 05 Y 06 (DIRECTIVA VIÁTICOS V.10)
// =========================================================================================

function construirHTMLAnexo04Exacto() {
  const pa = window.RENDICION_VIATICOS_STATE.planillaActiva;
  const comps = window.RENDICION_VIATICOS_STATE.comprobantes;
  const r = obtenerResumenCalculadoRendicion();
  const devEfectivo = Math.max(0, r.saldoDevolucion);

  const filasComprobantes = [];
  const totalFilas = Math.max(12, comps.length);
  for (let i = 0; i < totalFilas; i++) {
    const c = comps[i];
    filasComprobantes.push(`
      <tr>
        <td style="text-align:center;">${String(i + 1).padStart(2, "0")}</td>
        <td style="text-align:center;">${c ? c.fecha : "&nbsp;"}</td>
        <td>${c ? c.proveedor : "&nbsp;"}</td>
        <td style="text-align:center;">${c ? c.numero : "&nbsp;"}</td>
        <td style="text-align:right;">${c && c.hospedaje ? Number(c.hospedaje).toFixed(2) : ""}</td>
        <td style="text-align:right;">${c && c.alimentacion ? Number(c.alimentacion).toFixed(2) : ""}</td>
        <td style="text-align:right;">${c && c.movilidad ? Number(c.movilidad).toFixed(2) : ""}</td>
        <td style="text-align:right;">${c && c.pasajes ? Number(c.pasajes).toFixed(2) : ""}</td>
        <td style="text-align:right;">${c && c.combustible ? Number(c.combustible).toFixed(2) : ""}</td>
        <td style="text-align:right;">${c && c.peaje ? Number(c.peaje).toFixed(2) : ""}</td>
        <td style="text-align:right;">${c && c.otros ? Number(c.otros).toFixed(2) : ""}</td>
        <td style="text-align:right; font-weight:bold;">${c ? Number(c.total).toFixed(2) : ""}</td>
      </tr>
    `);
  }

  return `
    <div class="hoja-oficial">
      ${window.MotorAnexosANC.cabeceraDirectivaHTML("GFIN/DIR-01", "NORMAS PARA LA ENTREGA DE FONDOS POR VIÁTICOS Y ASIGNACIONES PARA LA REALIZACIÓN DE COMISIONES DE SERVICIOS", "10")}
      <div class="titulo-anexo-num">ANEXO 04</div>
      <div class="titulo-anexo-nombre">RENDICIÓN DOCUMENTARIA DE VIÁTICOS Y ASIGNACIONES POR COMISIÓN DE SERVICIOS</div>

      <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:12px; margin-bottom:10px;">
        <div style="flex:1; font-size:10.5px; line-height:1.5;">
          Yo, <strong>${pa.nombres_comisionado}</strong>, identificado(a) con DNI N° <strong>${pa.dni_comisionado}</strong>, en el cargo de <strong>${pa.cargo_comisionado}</strong> (${pa.dependencia}), manifiesto haber efectuado los gastos en la comisión de servicios llevada a cabo en la ciudad de <strong>${pa.ciudad_destino}</strong> del <strong>${pa.fecha_inicio}</strong> al <strong>${pa.fecha_fin}</strong>, según <strong>PLANILLA DE VIÁTICO N° ${pa.codigo_planilla}</strong>, que a continuación se detallan y sustentan con la documentación que se adjunta al presente:
        </div>
        <table class="tabla-directiva" style="width:230px; margin-bottom:0;">
          <tr><td><strong>Monto Otorgado:</strong></td><td style="text-align:right;">${window.fmtSoles(pa.monto_total_otorgado)}</td></tr>
          <tr><td><strong>Monto Rendido:</strong></td><td style="text-align:right;">${window.fmtSoles(r.totalRendidoGeneral)}</td></tr>
          <tr><td><strong>Devolución:</strong></td><td style="text-align:right;">${window.fmtSoles(devEfectivo)}</td></tr>
          <tr class="fila-subtotal"><td><strong>Saldo:</strong></td><td style="text-align:right;">S/ 0.00</td></tr>
        </table>
      </div>

      <table class="tabla-directiva">
        <thead>
          <tr>
            <th rowspan="2" style="width:4%;">N°</th>
            <th rowspan="2" style="width:9%;">Fecha</th>
            <th rowspan="2" style="width:20%;">Proveedor</th>
            <th rowspan="2" style="width:11%;">N° de Comprobante de pago</th>
            <th colspan="3" style="text-align:center;">Viáticos</th>
            <th colspan="4" style="text-align:center;">Otras Asignaciones</th>
            <th rowspan="2" style="width:9%; text-align:right;">Total (S/)</th>
          </tr>
          <tr>
            <th style="width:7%;">Hospedaje</th>
            <th style="width:7%;">Alimentación</th>
            <th style="width:7%;">Movilidad</th>
            <th style="width:7%;">Pasajes Terrestres</th>
            <th style="width:7%;">Combustible</th>
            <th style="width:6%;">Peaje</th>
            <th style="width:6%;">Seguro / Otros</th>
          </tr>
        </thead>
        <tbody>
          ${filasComprobantes.join("")}
          <tr class="fila-subtotal">
            <td colspan="4" style="text-align:right;">DECLARACIÓN JURADA (Anexo 02 / Anexo 03)</td>
            <td style="text-align:right;">${r.djAloj.toFixed(2)}</td>
            <td style="text-align:right;">${r.djAlim.toFixed(2)}</td>
            <td style="text-align:right;">${(r.djMovLoc + r.djMovEmb).toFixed(2)}</td>
            <td style="text-align:right;">0.00</td>
            <td style="text-align:right;">0.00</td>
            <td style="text-align:right;">0.00</td>
            <td style="text-align:right;">0.00</td>
            <td style="text-align:right;">${r.totalDJ.toFixed(2)}</td>
          </tr>
          <tr class="fila-subtotal">
            <td colspan="4" style="text-align:right;">SUB TOTAL RENDICIÓN DE GASTOS (S/)</td>
            <td style="text-align:right;">${(r.sumDoc.hospedaje + r.djAloj).toFixed(2)}</td>
            <td style="text-align:right;">${(r.sumDoc.alimentacion + r.djAlim).toFixed(2)}</td>
            <td style="text-align:right;">${(r.sumDoc.movilidad + r.djMovLoc + r.djMovEmb).toFixed(2)}</td>
            <td style="text-align:right;">${r.sumDoc.pasajes.toFixed(2)}</td>
            <td style="text-align:right;">${r.sumDoc.combustible.toFixed(2)}</td>
            <td style="text-align:right;">${r.sumDoc.peaje.toFixed(2)}</td>
            <td style="text-align:right;">${r.sumDoc.otros.toFixed(2)}</td>
            <td style="text-align:right;">${r.totalRendidoGeneral.toFixed(2)}</td>
          </tr>
          <tr>
            <td colspan="4" style="text-align:right;"><strong>MONTO ASIGNADO (S/)</strong></td>
            <td colspan="3" style="text-align:center;">Viáticos: ${window.fmtSoles(pa.otorgado_viaticos_neto)}</td>
            <td colspan="4" style="text-align:center;">Otras Asignaciones: ${window.fmtSoles(pa.monto_total_otorgado - pa.otorgado_viaticos_neto)}</td>
            <td style="text-align:right; font-weight:bold;">${pa.monto_total_otorgado.toFixed(2)}</td>
          </tr>
          <tr class="fila-total-general">
            <td colspan="11" style="text-align:right;">SALDO / DEVOLUCIÓN EN EFECTIVO (S/)</td>
            <td style="text-align:right;">${devEfectivo.toFixed(2)}</td>
          </tr>
        </tbody>
      </table>

      <div style="display:flex; justify-content:space-between; align-items:flex-end; margin-top:24px;">
        <table class="tabla-directiva" style="width:260px; margin-bottom:0;">
          <thead><tr><th colspan="2">TOTAL RENDICIÓN DE GASTOS</th></tr></thead>
          <tbody>
            <tr><td>Monto Recibido</td><td style="text-align:right;">${window.fmtSoles(pa.monto_total_otorgado)}</td></tr>
            <tr><td>Monto Rendido</td><td style="text-align:right;">${window.fmtSoles(r.totalRendidoGeneral)}</td></tr>
            <tr><td>Devolución</td><td style="text-align:right;">${window.fmtSoles(devEfectivo)}</td></tr>
            <tr class="fila-total-general"><td>Total Cuadrado</td><td style="text-align:right;">${window.fmtSoles(r.totalRendidoGeneral + devEfectivo)}</td></tr>
          </tbody>
        </table>

        <div style="text-align:center; width:42%; border-top:1.5px solid #000; padding-top:6px;">
          <strong>Firma del Comisionado (Digital o Manual)</strong><br/>
          Nombre: ${pa.nombres_comisionado}<br/>
          DNI N°: ${pa.dni_comisionado} • Fecha: ${new Date().toLocaleDateString("es-PE")}
        </div>
      </div>
    </div>
  `;
}

function construirHTMLAnexo02o03Exacto() {
  const pa = window.RENDICION_VIATICOS_STATE.planillaActiva;
  const r = obtenerResumenCalculadoRendicion();
  const esExterior = pa.tipo_comision === "INTERNACIONAL_USD";

  return `
    <div class="hoja-oficial">
      ${window.MotorAnexosANC.cabeceraDirectivaHTML("GFIN/DIR-01", "NORMAS PARA LA ENTREGA DE FONDOS POR VIÁTICOS Y ASIGNACIONES PARA LA REALIZACIÓN DE COMISIONES DE SERVICIOS", "10")}
      <div class="titulo-anexo-num">${esExterior ? "ANEXO 03" : "ANEXO 02"}</div>
      <div class="titulo-anexo-nombre">
        ${esExterior
          ? "DECLARACIÓN JURADA DE VIÁTICOS Y ASIGNACIONES POR COMISIÓN DE SERVICIOS EN EL EXTERIOR DEL PAÍS"
          : "DECLARACIÓN JURADA DE VIÁTICOS / NO VIÁTICOS Y ASIGNACIONES POR COMISIÓN DE SERVICIOS EN EL TERRITORIO NACIONAL"}
      </div>

      <p style="font-size:11.5px; line-height:1.65; text-align:justify; margin:16px 0;">
        Yo, <strong>${pa.nombres_comisionado}</strong>, identificado(a) con DNI n.° <strong>${pa.dni_comisionado}</strong>, en el cargo de <strong>${pa.cargo_comisionado}</strong> de la Unidad Ejecutora 012: Autoridad Nacional de Control del Ministerio Público (${pa.dependencia}), <strong>DECLARO BAJO JURAMENTO</strong> haber efectuado la Comisión de Servicios a la ciudad de <strong>${pa.ciudad_destino}</strong> los días del <strong>${pa.fecha_inicio}</strong> al <strong>${pa.fecha_fin}</strong>, en cumplimiento del numeral 71.3 del artículo 71° de la Directiva n.° 001-2007-EF/77.15, modificada por Resolución Directoral n.° 017-2007-EF/77.15, por los siguientes conceptos e importes en los cuales no ha sido posible obtener comprobantes de pago reconocidos por la SUNAT:
      </p>

      <table class="tabla-directiva" style="margin:18px 0;">
        <thead>
          <tr>
            <th style="width:12%; text-align:center;">N° DE ORDEN</th>
            <th style="width:20%; text-align:center;">FECHA</th>
            <th style="width:48%;">DETALLE / CONCEPTO SUSTENTADO</th>
            <th style="width:20%; text-align:right;">IMPORTE (S/)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="text-align:center;">1</td>
            <td style="text-align:center;">${pa.fecha_inicio} al ${pa.fecha_fin}</td>
            <td>Alojamiento (Zonas sin emisión de comprobantes)</td>
            <td style="text-align:right;">${r.djAloj.toFixed(2)}</td>
          </tr>
          <tr>
            <td style="text-align:center;">2</td>
            <td style="text-align:center;">${pa.fecha_inicio} al ${pa.fecha_fin}</td>
            <td>Alimentación (Zonas rurales / sin emisión de comprobantes)</td>
            <td style="text-align:right;">${r.djAlim.toFixed(2)}</td>
          </tr>
          <tr>
            <td style="text-align:center;">3</td>
            <td style="text-align:center;">${pa.fecha_inicio} al ${pa.fecha_fin}</td>
            <td>Movilidad Local (Desplazamientos internos durante la comisión)</td>
            <td style="text-align:right;">${r.djMovLoc.toFixed(2)}</td>
          </tr>
          <tr>
            <td style="text-align:center;">4</td>
            <td style="text-align:center;">${pa.fecha_inicio} / ${pa.fecha_fin}</td>
            <td>Movilidad de Embarque (Traslado hacia y desde el Aeropuerto / Terrapuerto)</td>
            <td style="text-align:right;">${r.djMovEmb.toFixed(2)}</td>
          </tr>
          <tr class="fila-total-general">
            <td colspan="3" style="text-align:right;">TOTAL DECLARACIÓN JURADA S/</td>
            <td style="text-align:right;">${window.fmtSoles(r.totalDJ)}</td>
          </tr>
        </tbody>
      </table>

      <p style="font-size:11px; margin-top:14px;">
        EN FE DE LO CUAL FIRMO LA PRESENTE DECLARACIÓN EN LA CIUDAD DE LIMA, EL ${new Date().toLocaleDateString("es-PE")}.
      </p>

      <div class="bloque-firmas" style="margin-top:65px;">
        <div class="linea-firma" style="width:45%;">
          <strong>Firma del Comisionado (Digital o Manual)</strong><br/>
          Nombre: ${pa.nombres_comisionado}<br/>
          DNI n.°: ${pa.dni_comisionado}
        </div>
      </div>

      <div class="notas-pie" style="margin-top:34px;">
        <strong>Nota (Anexo 02 / Anexo 03 Directiva V.10):</strong> El documento que se suscribe para sustentar los gastos solo es usado cuando no es posible obtener comprobantes de pago reconocidos y emitidos de conformidad con lo dispuesto por la SUNAT, en el lugar de la comisión de servicio donde no existen restaurantes, hoteles o empresas de transportes formales que otorguen los citados comprobantes, así como para la movilidad local y de embarque. Dicha Declaración Jurada será presentada sólo hasta el ${pa.porcentaje_max_dj}% del monto asignado por concepto de viáticos (${window.fmtSoles(pa.tope_max_dj_soles)}), según Decreto Supremo n.° 007-2013-EF.
      </div>
    </div>
  `;
}

function construirHTMLAnexo05Exacto() {
  const pa = window.RENDICION_VIATICOS_STATE.planillaActiva;
  const r = obtenerResumenCalculadoRendicion();
  const devEfectivo = Math.max(0, r.saldoDevolucion);

  return `
    <div class="hoja-oficial">
      ${window.MotorAnexosANC.cabeceraDirectivaHTML("GFIN/DIR-01", "NORMAS PARA LA ENTREGA DE FONDOS POR VIÁTICOS Y ASIGNACIONES PARA LA REALIZACIÓN DE COMISIONES DE SERVICIOS", "10")}
      <div class="titulo-anexo-num">ANEXO 05</div>
      <div class="titulo-anexo-nombre">RECIBO DE CAJA</div>

      <div style="border:2px solid #000; padding:22px; margin-top:16px;">
        <div style="display:flex; justify-content:space-between; font-size:12px; font-weight:bold; margin-bottom:18px;">
          <span>RECIBO DE CAJA N° ${window.RENDICION_VIATICOS_STATE.nroReciboCajaDevolucion}</span>
          <span>IMPORTE DEVUELTO: ${window.fmtSoles(devEfectivo)}</span>
        </div>

        <table class="tabla-directiva" style="margin-bottom:18px;">
          <tr>
            <td style="width:30%;"><strong>Se recibió del comisionado:</strong></td>
            <td>${pa.nombres_comisionado}</td>
          </tr>
          <tr>
            <td><strong>Cargo / Dependencia:</strong></td>
            <td>${pa.cargo_comisionado} (${pa.dependencia})</td>
          </tr>
          <tr>
            <td><strong>D.N.I. N°:</strong></td>
            <td>${pa.dni_comisionado}</td>
          </tr>
          <tr>
            <td><strong>La cantidad de:</strong></td>
            <td><strong>${window.fmtSoles(devEfectivo)}</strong></td>
          </tr>
          <tr>
            <td><strong>Por concepto de:</strong></td>
            <td>Devolución en efectivo de menor gasto / saldo no utilizado de la Planilla de Viáticos N° ${pa.codigo_planilla} (Comisión a ${pa.ciudad_destino} del ${pa.fecha_inicio} al ${pa.fecha_fin}).</td>
          </tr>
        </table>

        <div style="text-align:right; margin-top:14px; font-size:11px;">
          Fecha de recepción: ${new Date().toLocaleDateString("es-PE")}
        </div>

        <div class="bloque-firmas" style="margin-top:65px;">
          <div class="linea-firma" style="width:42%;">
            <strong>ENTREGUÉ CONFORME (COMISIONADO)</strong><br/>
            ${pa.nombres_comisionado} • DNI: ${pa.dni_comisionado}
          </div>
          <div class="linea-firma" style="width:42%;">
            <strong>RECIBÍ CONFORME (FIRMA Y SELLO ENCARGADO DE CAJA CHICA / TESORERÍA)</strong><br/>
            UE 012: ANC-MP
          </div>
        </div>
      </div>
    </div>
  `;
}

function construirHTMLAnexo06Exacto() {
  const pa = window.RENDICION_VIATICOS_STATE.planillaActiva;
  const r = obtenerResumenCalculadoRendicion();
  const devEfectivo = Math.max(0, r.saldoDevolucion);
  const recViat = Number((r.sumDoc.hospedaje + r.sumDoc.alimentacion + r.sumDoc.movilidad + r.totalDJ).toFixed(2));

  return `
    <div class="hoja-oficial">
      ${window.MotorAnexosANC.cabeceraDirectivaHTML("GFIN/DIR-01", "NORMAS PARA LA ENTREGA DE FONDOS POR VIÁTICOS Y ASIGNACIONES PARA LA REALIZACIÓN DE COMISIONES DE SERVICIOS", "10")}
      <div class="titulo-anexo-num">ANEXO 06</div>
      <div class="titulo-anexo-nombre">ANÁLISIS DE RENDICIÓN DE VIÁTICOS Y ASIGNACIONES POR COMISIÓN DE SERVICIOS</div>

      <table class="tabla-directiva" style="margin-bottom:12px;">
        <tr>
          <td style="width:55%;"><strong>APELLIDOS Y NOMBRES:</strong> ${pa.nombres_comisionado}</td>
          <td style="width:45%;"><strong>PLANILLA N°:</strong> ${pa.codigo_planilla}</td>
        </tr>
        <tr>
          <td><strong>DEPENDENCIA:</strong> ${pa.dependencia}</td>
          <td><strong>CARGO:</strong> ${pa.cargo_comisionado}</td>
        </tr>
        <tr>
          <td><strong>LUGAR DE COMISIÓN:</strong> ${pa.ciudad_destino}</td>
          <td><strong>PERIODO:</strong> DESDE ${pa.fecha_inicio} HASTA ${pa.fecha_fin}</td>
        </tr>
      </table>

      <table class="tabla-directiva">
        <thead>
          <tr>
            <th style="width:56%;">1) OTORGAMIENTO DE VIÁTICOS Y ASIGNACIONES</th>
            <th style="width:22%; text-align:right;">OTORGADOS (S/)</th>
            <th style="width:22%; text-align:right;">RECONOCIDOS (S/)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>a) ALOJAMIENTO, ALIMENTACIÓN Y MOVILIDAD LOCAL / EMBARQUE</td>
            <td style="text-align:right;">${pa.otorgado_viaticos_neto.toFixed(2)}</td>
            <td style="text-align:right;">${recViat.toFixed(2)}</td>
          </tr>
          <tr>
            <td>b) PASAJES TERRESTRES / FLUVIAL / ACÉMILA</td>
            <td style="text-align:right;">${pa.otorgado_pasajes_terrestres.toFixed(2)}</td>
            <td style="text-align:right;">${r.sumDoc.pasajes.toFixed(2)}</td>
          </tr>
          <tr>
            <td>c) TUA CORPAC</td>
            <td style="text-align:right;">0.00</td>
            <td style="text-align:right;">0.00</td>
          </tr>
          <tr>
            <td>d) PASAJES AÉREOS</td>
            <td style="text-align:right;">0.00</td>
            <td style="text-align:right;">0.00</td>
          </tr>
          <tr>
            <td>e) COMBUSTIBLE</td>
            <td style="text-align:right;">${pa.otorgado_combustible.toFixed(2)}</td>
            <td style="text-align:right;">${r.sumDoc.combustible.toFixed(2)}</td>
          </tr>
          <tr>
            <td>f) PEAJE</td>
            <td style="text-align:right;">${pa.otorgado_peaje.toFixed(2)}</td>
            <td style="text-align:right;">${r.sumDoc.peaje.toFixed(2)}</td>
          </tr>
          <tr>
            <td>g) OTROS</td>
            <td style="text-align:right;">${pa.otorgado_otros.toFixed(2)}</td>
            <td style="text-align:right;">${r.sumDoc.otros.toFixed(2)}</td>
          </tr>
          <tr class="fila-subtotal">
            <td>TOTAL OTORGADO VS. RECONOCIDO (S/)</td>
            <td style="text-align:right;">${pa.monto_total_otorgado.toFixed(2)}</td>
            <td style="text-align:right;">${r.totalRendidoGeneral.toFixed(2)}</td>
          </tr>
        </tbody>
      </table>

      <table class="tabla-directiva">
        <thead>
          <tr><th colspan="2">2) RENDICIÓN DE GASTOS POR COMISIÓN DE SERVICIOS</th></tr>
        </thead>
        <tbody>
          <tr>
            <td style="width:75%;">a) RENDICIÓN DOCUMENTADA DE GASTOS (Anexo 04)</td>
            <td style="width:25%; text-align:right;">${window.fmtSoles(r.sumDoc.totalDocumentado)}</td>
          </tr>
          <tr>
            <td>b) DECLARACIÓN JURADA DE GASTOS (Anexo 02 / Anexo 03)</td>
            <td style="text-align:right;">${window.fmtSoles(r.totalDJ)}</td>
          </tr>
          <tr class="fila-subtotal">
            <td>TOTAL RENDIDO (a + b)</td>
            <td style="text-align:right;">${window.fmtSoles(r.totalRendidoGeneral)}</td>
          </tr>
        </tbody>
      </table>

      <table class="tabla-directiva">
        <thead>
          <tr><th colspan="2">3) RESUMEN Y 4) DEVOLUCIÓN</th></tr>
        </thead>
        <tbody>
          <tr>
            <td style="width:75%;">a) VIÁTICOS Y ASIGNACIONES OTORGADOS</td>
            <td style="width:25%; text-align:right;">${window.fmtSoles(pa.monto_total_otorgado)}</td>
          </tr>
          <tr>
            <td>b) VIÁTICOS Y ASIGNACIONES RECONOCIDOS</td>
            <td style="text-align:right;">${window.fmtSoles(r.totalRendidoGeneral)}</td>
          </tr>
          <tr class="fila-total-general">
            <td>DEVOLUCIÓN EN EFECTIVO SEGÚN RECIBO DE CAJA N° ${window.RENDICION_VIATICOS_STATE.nroReciboCajaDevolucion}</td>
            <td style="text-align:right;">${window.fmtSoles(devEfectivo)}</td>
          </tr>
        </tbody>
      </table>

      <div class="bloque-firmas" style="margin-top:55px;">
        <div class="linea-firma" style="width:40%;">
          <strong>ENCARGADO DE REVISIÓN (CAJA CHICA / ADMINISTRACIÓN)</strong><br/>
          ${pa.dependencia}
        </div>
        <div class="linea-firma" style="width:40%;">
          <strong>V°B° UNIDAD DE CONTABILIDAD / TESORERÍA</strong><br/>
          UE 012: ANC-MP
        </div>
      </div>
    </div>
  `;
}

window.imprimirAnexoRendicionViaticos = function(tipoFormato) {
  const pa = window.RENDICION_VIATICOS_STATE.planillaActiva;
  if (!pa.rendicion_habilitada) {
    alert("🔒 Rendición bloqueada: Jefatura debe autorizar primero la rendición de este comisionado para descargar los formatos oficiales.");
    return;
  }

  let html = "";
  let orientacion = "portrait";

  if (tipoFormato === "ANEXO_04") {
    html = construirHTMLAnexo04Exacto();
    orientacion = "landscape";
  } else if (tipoFormato === "ANEXO_02_03") {
    html = construirHTMLAnexo02o03Exacto();
  } else if (tipoFormato === "ANEXO_05") {
    html = construirHTMLAnexo05Exacto();
  } else if (tipoFormato === "ANEXO_06") {
    html = construirHTMLAnexo06Exacto();
  } else {
    html = construirHTMLAnexo04Exacto() + construirHTMLAnexo02o03Exacto() + construirHTMLAnexo05Exacto() + construirHTMLAnexo06Exacto();
  }

  window.MotorAnexosANC.imprimirDocumentoOficial(`Rendicion_${pa.codigo_planilla}_${pa.dni_comisionado}`, html, orientacion);
};

window.exportarRendicionViaticosExcel = function() {
  const pa = window.RENDICION_VIATICOS_STATE.planillaActiva;
  if (!pa.rendicion_habilitada) {
    alert("🔒 Rendición bloqueada: Jefatura debe autorizar primero la rendición de este comisionado para exportar a Excel.");
    return;
  }

  const comps = window.RENDICION_VIATICOS_STATE.comprobantes;
  const r = obtenerResumenCalculadoRendicion();

  const cabeceras = ["NRO_ORDEN", "PLANILLA", "COMISIONADO", "DNI", "FECHA_DOC", "PROVEEDOR", "NRO_COMPROBANTE", "HOSPEDAJE", "ALIMENTACION", "MOVILIDAD", "PASAJES", "COMBUSTIBLE", "PEAJE", "OTROS", "TOTAL_SOLES"];
  const filas = comps.map((c, idx) => [
    idx + 1,
    pa.codigo_planilla,
    pa.nombres_comisionado,
    pa.dni_comisionado,
    c.fecha,
    c.proveedor,
    c.numero,
    Number(c.hospedaje || 0).toFixed(2),
    Number(c.alimentacion || 0).toFixed(2),
    Number(c.movilidad || 0).toFixed(2),
    Number(c.pasajes || 0).toFixed(2),
    Number(c.combustible || 0).toFixed(2),
    Number(c.peaje || 0).toFixed(2),
    Number(c.otros || 0).toFixed(2),
    Number(c.total || 0).toFixed(2)
  ]);

  filas.push([
    "DJ", pa.codigo_planilla, pa.nombres_comisionado, pa.dni_comisionado, pa.fecha_fin,
    "DECLARACIÓN JURADA (ANEXO 02 / 03)", "DJ",
    r.djAloj.toFixed(2), r.djAlim.toFixed(2), (r.djMovLoc + r.djMovEmb).toFixed(2),
    "0.00", "0.00", "0.00", "0.00", r.totalDJ.toFixed(2)
  ]);

  filas.push([
    "TOTAL", pa.codigo_planilla, pa.nombres_comisionado, pa.dni_comisionado, "",
    "SUB TOTAL RENDICIÓN DE GASTOS", "",
    (r.sumDoc.hospedaje + r.djAloj).toFixed(2),
    (r.sumDoc.alimentacion + r.djAlim).toFixed(2),
    (r.sumDoc.movilidad + r.djMovLoc + r.djMovEmb).toFixed(2),
    r.sumDoc.pasajes.toFixed(2),
    r.sumDoc.combustible.toFixed(2),
    r.sumDoc.peaje.toFixed(2),
    r.sumDoc.otros.toFixed(2),
    r.totalRendidoGeneral.toFixed(2)
  ]);

  window.MotorAnexosANC.exportarExcelCSV(`Rendicion_Viaticos_${pa.codigo_planilla}_${pa.dni_comisionado}.csv`, cabeceras, filas);
};