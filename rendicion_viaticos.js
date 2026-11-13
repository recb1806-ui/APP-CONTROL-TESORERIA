// =========================================================================================
// PASO C (RENOVADO): MÓDULO INDEPENDIENTE "RENDIR MIS GASTOS DE VIAJE" (rendicion_viaticos.js)
// Diseño Cálido y Lenguaje Claro para Magistrados y Fiscales del Ministerio Público
// Directiva GFIN/DIR-01 Versión 10 + Resolución N° 000038-2025-MP-FN-GG-OGFIN
// Incluye Privacidad por Usuario (DNI), Bloqueo/Habilitación expresa por Jefatura,
// Contómetro Regresivo con Semáforo Legal (10 días hábiles Nac. / 15 días cal. Ext.),
// cuadre exacto de devolución e impresión limpia de los Anexos 02, 03, 04, 05 y 06.
// =========================================================================================

window.RENDICION_VIATICOS_STATE = {
  planillaActiva: {
    codigo_planilla: "PV-2026-001",
    tipo_comision: "NACIONAL_FUERA_DF", // 'NACIONAL_FUERA_DF', 'INTERNO_ADC_DF', 'SIN_VIATICOS_MISMO_DIA', 'INTERNACIONAL_USD'
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
    rendicion_habilitada: false, // Por defecto false hasta que Jefatura lo habilite
    // Montos otorgados según Planilla Anexo 01 / 07
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
  djConceptos: {
    alojamiento: 0.00,
    alimentacion: 0.00,
    movilidad_local: 40.00,
    movilidad_embarque: 120.00
  },
  nroReciboCajaDevolucion: "RC-001-2026",
  nroMemoDevolucion: "MEMO-001-2026-ANC"
};

document.addEventListener("DOMContentLoaded", () => {
  inicializarModuloRendicionViaticos();
});

window.inicializarModuloRendicionViaticos = function() {
  cargarPlanillaSeleccionadaParaRendir();
  renderizarModuloRendicionViaticos();
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
    // Numeral 5.2.9.8: 15 días calendario desde el retorno
    fechaLimite.setDate(fechaLimite.getDate() + 15);
  } else {
    // Numeral 5.2.9.2: 10 días hábiles (Lunes a Viernes) contados desde el retorno
    let diasHabilesSumados = 0;
    while (diasHabilesSumados < 10) {
      fechaLimite.setDate(fechaLimite.getDate() + 1);
      const diaSemana = fechaLimite.getDay(); // 0 = Domingo, 6 = Sábado
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
    ? "15 días calendario contados desde tu regreso (Directiva V.10 - Numeral 5.2.9.8)"
    : "10 días hábiles (lunes a viernes) contados desde tu regreso (Directiva V.10 - Numeral 5.2.9.2)";

  // 1° AZUL: Si la fecha/hora de retorno aún no ha llegado
  if (ahora.getTime() < retornoValido.getTime()) {
    const diffParaRetorno = retornoValido.getTime() - ahora.getTime();
    const dRet = Math.floor(diffParaRetorno / (1000 * 3600 * 24));
    const hRet = Math.floor((diffParaRetorno % (1000 * 3600 * 24)) / (1000 * 3600));
    return {
      estado: "EN_COMISION",
      colorClaseBox: "contometro-azul",
      colorClaseBadge: "badge-azul",
      icono: "🔵",
      tituloSemaf: `🔵 Viaje en curso (Tu retorno está programado en ${dRet} día(s) y ${hRet}h)`,
      resumenCorto: `🔵 En viaje (Vence: ${fechaLimite.toLocaleDateString("es-PE")})`,
      fechaRetornoTexto: fmtFechaHora(retornoValido),
      fechaLimiteTexto: fmtFechaHora(fechaLimite),
      baseNormativa,
      vencido: false
    };
  }

  // Diferencia entre la Fecha Límite y la hora actual
  const diffRestante = fechaLimite.getTime() - ahora.getTime();

  // 4° ROJO: Cuando ya superó la fecha límite sin rendir
  if (diffRestante < 0) {
    const diffExcedido = Math.abs(diffRestante);
    const diasExcedidos = Math.max(1, Math.floor(diffExcedido / (1000 * 3600 * 24)));
    const horasExcedidas = Math.floor((diffExcedido % (1000 * 3600 * 24)) / (1000 * 3600));
    return {
      estado: "VENCIDO",
      colorClaseBox: "contometro-rojo",
      colorClaseBadge: "badge-rojo",
      icono: "🔴",
      tituloSemaf: `🔴 Plazo vencido hace ${diasExcedidos} día(s) (${horasExcedidas}h) — Regulariza tu rendición para habilitar futuros viajes`,
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

  // 3° AMARILLO: Cuando faltan 3 días o menos para vencer
  if (diffRestante <= tresDiasMs) {
    return {
      estado: "POR_VENCER",
      colorClaseBox: "contometro-amarillo",
      colorClaseBadge: "badge-amarillo",
      icono: "🟡",
      tituloSemaf: `🟡 Próximo a vencer: te quedan ${diasRestantes} día(s) y ${horasRestantes} horas para presentar tu rendición`,
      resumenCorto: `🟡 Por vencer (${diasRestantes}d ${horasRestantes}h)`,
      fechaRetornoTexto: fmtFechaHora(retornoValido),
      fechaLimiteTexto: fmtFechaHora(fechaLimite),
      baseNormativa,
      vencido: false
    };
  }

  // 2° VERDE: Cuando faltan más de 3 días para la fecha límite
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

function renderizarCajaContometroHTML(infoContometro, pa) {
  return `
    <div class="contometro-box ${infoContometro.colorClaseBox}">
      <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:6px; margin-bottom:8px;">
        <div style="font-size:0.84rem; font-weight:800; line-height:1.35;">
          ⏱️ PLAZO PARA PRESENTAR TU RENDICIÓN: ${infoContometro.tituloSemaf}
        </div>
        <span class="badge-semaforo ${infoContometro.colorClaseBadge}" style="font-size:0.68rem;">
          Planilla ${pa.codigo_planilla}
        </span>
      </div>
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; font-size:0.75rem; background:rgba(255,255,255,0.75); padding:8px 10px; border-radius:12px; border:1px solid rgba(15,23,42,0.08);">
        <div>
          <strong>🛬 Fecha y hora de regreso:</strong><br/>
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

function consultarEstadoHabilitacionPlanilla(codigoPlanilla, dniComisionado, valorPorDefecto = false) {
  try {
    const mapa = JSON.parse(localStorage.getItem("anc_viaticos_hab_v1") || "{}");
    const clave = `${codigoPlanilla}_${String(dniComisionado || "").trim()}`;
    if (clave in mapa) return Boolean(mapa[clave]);
  } catch (e) {
    console.warn("Error leyendo mapa de habilitaciones:", e);
  }
  return Boolean(valorPorDefecto);
}

// Filtra las asignaciones de comisiones que el usuario activo tiene permiso de ver por su DNI
function obtenerAsignacionesVisiblesUsuario() {
  const comisionesGuardadas = JSON.parse(localStorage.getItem("anc_viaticos_local_v1") || "[]");
  const p = window.ANC_STATE?.perfilActivo || {};
  const miDni = String(p.usuario_dni || "").trim().toLowerCase();
  const miNombre = String(p.usuario_nombre || "").trim().toLowerCase();
  const esAdminOJefatura = (typeof window.esAdministradorActivo === "function" && window.esAdministradorActivo()) ||
                           (typeof window.puedeHabilitarRendicion === "function" && window.puedeHabilitarRendicion());

  const lista = [];
  comisionesGuardadas.forEach((sol, idxS) => {
    (sol.comisionados || []).forEach((it, idxC) => {
      const cDni = String(it?.com?.dni || "").trim().toLowerCase();
      const cNom = String(it?.com?.nombres || "").trim().toLowerCase();
      const creadorDni = String(sol.usuario_creador_dni || "").trim().toLowerCase();

      // Privacidad: El usuario operador solo ve las planillas donde figura su DNI o que él registró
      if (esAdminOJefatura || (miDni && (cDni === miDni || creadorDni === miDni)) || (miNombre && cNom === miNombre)) {
        const hab = consultarEstadoHabilitacionPlanilla(
          sol.codigo_planilla,
          it?.com?.dni,
          it?.com?.rendicion_habilitada
        );
        it.com.rendicion_habilitada = hab;
        lista.push({ idxS, idxC, sol, it, hab });
      }
    });
  });

  return lista;
}

function aplicarAsignacionAEstadoRendicion(sol, item) {
  const com = item.com || {};
  const calc = item.calc || {};
  const pctDJ = sol.tipo_comision === "INTERNACIONAL_USD" ? 20.0 : (sol.tipo_comision === "SIN_VIATICOS_MISMO_DIA" ? 100.0 : 30.0);
  const viatNeto = Number(calc.netoViatico || 640.00);
  const hab = consultarEstadoHabilitacionPlanilla(
    sol.codigo_planilla || "PV-2026-001",
    com.dni || "45000001",
    com.rendicion_habilitada
  );

  const fSalRaw = sol.fecha_hora_salida || `${new Date().toISOString().slice(0, 10)}T08:00`;
  const fRetRaw = sol.fecha_hora_retorno || `${new Date().toISOString().slice(0, 10)}T18:00`;

  window.RENDICION_VIATICOS_STATE.planillaActiva = {
    codigo_planilla: sol.codigo_planilla || "PV-2026-001",
    tipo_comision: sol.tipo_comision || "NACIONAL_FUERA_DF",
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
    rendicion_habilitada: hab,
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

  window.RENDICION_VIATICOS_STATE.djConceptos.movilidad_local = Number(calc.movLocalTotal || 0);
  window.RENDICION_VIATICOS_STATE.djConceptos.movilidad_embarque = Number(calc.movEmbarqueTotal || 0);
}

function cargarPlanillaSeleccionadaParaRendir() {
  try {
    const p = window.ANC_STATE?.perfilActivo || {};
    const miDni = String(p.usuario_dni || "").trim();
    const esAdminOJefatura = (typeof window.esAdministradorActivo === "function" && window.esAdministradorActivo()) ||
                             (typeof window.puedeHabilitarRendicion === "function" && window.puedeHabilitarRendicion());

    const selStr = localStorage.getItem("anc_rendicion_seleccionada_v1");
    if (selStr) {
      const sel = JSON.parse(selStr);
      const sol = sel.solicitud || {};
      const item = sel.comisionadoItem || {};
      const dniSel = String(item?.com?.dni || "").trim();

      // Verificar privacidad: solo cargar si pertenece al DNI activo o si es Jefatura/Admin
      if (esAdminOJefatura || !miDni || dniSel === miDni || String(sol.usuario_creador_dni || "").trim() === miDni) {
        aplicarAsignacionAEstadoRendicion(sol, item);
        return;
      }
    }

    // Si no hay selección válida, buscar automáticamente la primera comisión del usuario activo
    const misAsignaciones = obtenerAsignacionesVisiblesUsuario();
    if (misAsignaciones.length > 0) {
      const primera = misAsignaciones[0];
      aplicarAsignacionAEstadoRendicion(primera.sol, primera.it);
    } else {
      // Sincronizar con los datos del usuario activo y mantener rendición bloqueada por defecto
      window.RENDICION_VIATICOS_STATE.planillaActiva.dni_comisionado = p.usuario_dni || "45000001";
      window.RENDICION_VIATICOS_STATE.planillaActiva.nombres_comisionado = p.usuario_nombre || "Usuario Operador ANC";
      window.RENDICION_VIATICOS_STATE.planillaActiva.dependencia = p.nombre_dependencia || "Sede Central ANC-MP";
      window.RENDICION_VIATICOS_STATE.planillaActiva.rendicion_habilitada = consultarEstadoHabilitacionPlanilla(
        window.RENDICION_VIATICOS_STATE.planillaActiva.codigo_planilla,
        p.usuario_dni,
        false
      );
    }
  } catch (e) {
    console.warn("Aviso cargando planilla para rendición:", e);
  }
}

// Permite a Jefatura o Administración habilitar/bloquear la rendición directamente desde esta vista
window.cambiarEstadoHabilitacionDesdeRendicion = function() {
  if (typeof window.validarPinJefaturaOAdmin === "function") {
    if (!window.validarPinJefaturaOAdmin("autorizar o bloquear esta rendición de gastos de viaje")) return;
  }

  const pa = window.RENDICION_VIATICOS_STATE.planillaActiva;
  const nuevoEstado = !Boolean(pa.rendicion_habilitada);
  pa.rendicion_habilitada = nuevoEstado;

  // Guardar en el mapa local de habilitaciones
  try {
    const mapa = JSON.parse(localStorage.getItem("anc_viaticos_hab_v1") || "{}");
    mapa[`${pa.codigo_planilla}_${String(pa.dni_comisionado || "").trim()}`] = nuevoEstado;
    localStorage.setItem("anc_viaticos_hab_v1", JSON.stringify(mapa));

    // Sincronizar en el listado local de comisiones
    const comisiones = JSON.parse(localStorage.getItem("anc_viaticos_local_v1") || "[]");
    comisiones.forEach(sol => {
      if (sol.codigo_planilla === pa.codigo_planilla) {
        (sol.comisionados || []).forEach(c => {
          if (String(c?.com?.dni || "").trim() === String(pa.dni_comisionado || "").trim()) {
            c.com.rendicion_habilitada = nuevoEstado;
          }
        });
      }
    });
    localStorage.setItem("anc_viaticos_local_v1", JSON.stringify(comisiones));
    if (window.VIATICOS_STATE) window.VIATICOS_STATE.comisionesCreadas = comisiones;
  } catch (e) {
    console.warn("Error sincronizando habilitación:", e);
  }

  renderizarModuloRendicionViaticos();
  alert(
    nuevoEstado
      ? `🔓 RENDICIÓN AUTORIZADA para ${pa.nombres_comisionado} (Planilla ${pa.codigo_planilla}). Ya puedes ingresar tus boletas y descargar tus formatos.`
      : `🔒 RENDICIÓN EN ESPERA para ${pa.nombres_comisionado} (Planilla ${pa.codigo_planilla}).`
  );
};

window.seleccionarTarjetaComisionadoRendicion = function(clave) {
  const sel = document.getElementById("rend-select-planilla-previa");
  if (sel) {
    sel.value = clave;
    window.alElegirPlanillaPreviaRendicion();
  }
};

function renderizarModuloRendicionViaticos() {
  const cont = document.getElementById("contenedor-modulo-rendicion-viaticos");
  if (!cont) return;

  const pa = window.RENDICION_VIATICOS_STATE.planillaActiva;
  const p = window.ANC_STATE?.perfilActivo || {};
  const misAsignaciones = obtenerAsignacionesVisiblesUsuario();
  const puedeAutorizar = typeof window.puedeHabilitarRendicion === "function" && window.puedeHabilitarRendicion();

  const infoContometroCabecera = window.calcularContometroPlazoRendicion(
    pa.fecha_hora_retorno || pa.fecha_fin,
    pa.tipo_comision
  );

  const opcionesHTML = misAsignaciones.map(({ idxS, idxC, sol, it, hab }) => {
    const clave = `${idxS}_${idxC}`;
    const seleccionado = (sol.codigo_planilla === pa.codigo_planilla && String(it.com.dni) === String(pa.dni_comisionado)) ? "selected" : "";
    const iconoHab = hab ? "🔓 Habilitada" : "🔒 En espera";
    const cInfo = window.calcularContometroPlazoRendicion(sol.fecha_hora_retorno, sol.tipo_comision);
    return `<option value="${clave}" ${seleccionado}>[${sol.codigo_planilla}] ${it.com.nombres} (${sol.destino_comision} • ${cInfo.resumenCorto} • ${iconoHab})</option>`;
  });

  // Tarjetas compactas de cada comisionado/asignación con su propio contómetro regresivo y semáforo
  const tarjetasAsignacionesHTML = misAsignaciones.map(({ idxS, idxC, sol, it, hab }) => {
    const clave = `${idxS}_${idxC}`;
    const esActiva = (sol.codigo_planilla === pa.codigo_planilla && String(it.com.dni) === String(pa.dni_comisionado));
    const cInfo = window.calcularContometroPlazoRendicion(sol.fecha_hora_retorno, sol.tipo_comision);
    return `
      <div onclick="seleccionarTarjetaComisionadoRendicion('${clave}')" style="cursor:pointer; background:${esActiva ? '#FFFDF5' : '#FFFFFF'}; border:${esActiva ? '2px solid #F59E0B' : '1.5px solid #E2E8F0'}; border-radius:14px; padding:9px 11px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:6px; box-shadow:0 2px 6px rgba(15,23,42,0.03);">
        <div style="min-width:0; flex:1;">
          <div style="font-size:0.78rem; font-weight:800; color:#0F172A;">
            [${sol.codigo_planilla}] ${it.com.nombres} <span style="font-weight:600; color:#475569;">(DNI: ${it.com.dni})</span>
          </div>
          <div style="font-size:0.72rem; color:#334155; margin-top:2px;">
            📍 ${sol.destino_comision} • Vence: <strong>${cInfo.fechaLimiteTexto}</strong>
          </div>
        </div>
        <div style="display:flex; flex-direction:column; align-items:flex-end; gap:3px;">
          <span class="badge-semaforo ${cInfo.colorClaseBadge}" style="font-size:0.65rem; padding:2px 8px;">
            ${cInfo.resumenCorto}
          </span>
          <span style="font-size:0.65rem; font-weight:800; color:${hab ? '#065F46' : '#92400E'};">
            ${hab ? '🔓 Habilitada para rendir' : '🔒 En espera de Jefatura'}
          </span>
        </div>
      </div>
    `;
  }).join("");

  const estaHabilitada = Boolean(pa.rendicion_habilitada);
  const attrDisabled = estaHabilitada ? "" : "disabled";
  const estiloBloqueado = estaHabilitada ? "" : "opacity:0.55; pointer-events:none;";

  cont.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:8px; margin-bottom:12px;">
      <div>
        <h2 style="font-size:1.2rem; font-weight:800; color:#0F172A;">📑 Rendir mis Gastos de Viaje</h2>
        <p style="font-size:0.8rem; color:#475569; font-weight:600; margin-top:2px;">
          Registra tus boletas de hotel, alimentación y movilidad con cálculo automático de tu declaración jurada
        </p>
      </div>
      <span class="badge-semaforo badge-verde">Paso a paso</span>
    </div>

    <!-- CONTÓMETRO REGRESIVO CON SEMÁFORO LEGAL EN CABECERA DE LA COMISIÓN SELECCIONADA -->
    <div id="contenedor-contometro-cabecera">
      ${renderizarCajaContometroHTML(infoContometroCabecera, pa)}
    </div>

    <!-- BANNER DE ESTADO DE HABILITACIÓN POR JEFATURA (OBLIGATORIO PARA PODER RENDIR) -->
    <div style="background:${estaHabilitada ? '#F2FBF7' : '#FFF5F6'}; border:1.5px solid ${estaHabilitada ? '#A7F3D0' : '#FECDD3'}; border-radius:18px; padding:12px 14px; margin-bottom:14px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
      <div style="min-width:0; flex:1;">
        <div style="font-size:0.82rem; font-weight:800; color:${estaHabilitada ? '#065F46' : '#9F1239'};">
          ${estaHabilitada
            ? `🔓 RENDICIÓN HABILITADA POR JEFATURA — Planilla ${pa.codigo_planilla}`
            : `🔒 RENDICIÓN EN ESPERA DE AUTORIZACIÓN DE JEFATURA`}
        </div>
        <div style="font-size:0.75rem; color:${estaHabilitada ? '#047857' : '#881337'}; margin-top:3px; line-height:1.38;">
          ${estaHabilitada
            ? `Integrante: <strong>${pa.nombres_comisionado}</strong> (DNI: ${pa.dni_comisionado}). Ya puedes ingresar tus comprobantes y descargar tus formatos listos para firmar.`
            : `Para que <strong>${pa.nombres_comisionado}</strong> (DNI: ${pa.dni_comisionado}) pueda registrar sus boletas y emitir su rendición, <strong>Jefatura</strong> debe autorizar primero esta comisión.`}
        </div>
      </div>
      ${puedeAutorizar ? `
        <button type="button" onclick="cambiarEstadoHabilitacionDesdeRendicion()" style="background:${estaHabilitada ? '#9F1239' : '#059669'}; color:#FFFFFF; border:none; border-radius:12px; padding:9px 13px; font-size:0.75rem; font-weight:800; cursor:pointer; flex-shrink:0;">
          ${estaHabilitada ? '🔒 Poner en Espera' : '🔓 Autorizar Rendición Ahora'}
        </button>
      ` : `
        <button type="button" onclick="cambiarEstadoHabilitacionDesdeRendicion()" style="background:linear-gradient(135deg, #FBBF24 0%, #F59E0B 100%); color:#0F172A; border:1px solid #D97706; border-radius:12px; padding:8px 12px; font-size:0.73rem; font-weight:800; cursor:pointer; flex-shrink:0;">
          🔐 Habilitar con Clave Jefatura
        </button>
      `}
    </div>

    <!-- CONSEJO PRÁCTICO SOBRE RUC Y PROPINAS -->
    <div style="background:#FFFDF5; border:1.5px solid #FDE68A; border-radius:16px; padding:10px 12px; margin-bottom:14px; font-size:0.76rem; color:#78350F; line-height:1.4;">
      💡 <strong>Ten en cuenta al registrar tus boletas o facturas:</strong> Deben estar emitidas a nombre del Ministerio Público (RUC <strong>${window.ANC_STATE?.config?.ruc_institucional || '20131370301'}</strong>) y no deben incluir montos por <strong>propinas</strong> <span style="font-size:0.68rem; opacity:0.85;">(Res. N° 000038-2025-MP-FN-GG-OGFIN)</span>.
    </div>

    <!-- PASO 1: SELECCIONAR PLANILLA ASIGNADA AL USUARIO ACTIVO -->
    <div style="background:#FFFDF5; border:1.5px solid #FDE68A; border-radius:20px; padding:14px; margin-bottom:16px; width:100%; max-width:100%; box-sizing:border-box; overflow:hidden;">
      <h3 style="font-size:0.95rem; font-weight:800; color:#0F172A; margin-bottom:8px;">
        👤 Paso 1. Mi Comisión de Viaje (${p.usuario_nombre} • DNI: ${p.usuario_dni})
      </h3>

      ${opcionesHTML.length > 0 ? `
        <div style="margin-bottom:10px; width:100%; max-width:100%; min-width:0;">
          <label style="display:block; font-size:0.73rem; font-weight:800; color:#0F172A; margin-bottom:3px;">ELIGE LA COMISIÓN QUE DESEAS RENDIR:</label>
          <select id="rend-select-planilla-previa" onchange="alElegirPlanillaPreviaRendicion()" style="width:100% !important; max-width:100% !important; min-width:0 !important; box-sizing:border-box !important; padding:10px; border-radius:12px; border:1.5px solid #F59E0B; font-weight:800; font-size:0.82rem; background:#FFFFFF; color:#0F172A;">
            ${opcionesHTML.join("")}
          </select>
        </div>
        <div style="display:flex; flex-direction:column; gap:7px; margin-bottom:12px;">
          ${tarjetasAsignacionesHTML}
        </div>
      ` : `
        <div style="background:#FFFFFF; border:1.5px dashed #CBD5E1; border-radius:14px; padding:10px 12px; margin-bottom:10px; font-size:0.76rem; color:#475569; line-height:1.4;">
          ℹ️ Aún no tienes comisiones registradas con tu DNI (<strong>${p.usuario_dni}</strong>) en este equipo. Cuando programas un viaje en "Solicitar Viáticos de Comisión" o Jefatura te incluye, aparecerá automáticamente aquí.
        </div>
      `}

      <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-bottom:8px; ${estiloBloqueado}">
        <div style="min-width:0; max-width:100%;">
          <label style="display:block; font-size:0.71rem; font-weight:800; color:#334155;">N° DE PLANILLA:</label>
          <input type="text" id="rend-codigo-planilla" value="${pa.codigo_planilla}" ${attrDisabled} oninput="actualizarCabeceraPlanillaRendicion()" style="width:100% !important; max-width:100% !important; min-width:0 !important; box-sizing:border-box !important; padding:8px 10px; border-radius:12px; border:1.5px solid #CBD5E1; font-weight:800; font-size:0.81rem; background:#FFFFFF;" />
        </div>
        <div style="min-width:0; max-width:100%;">
          <label style="display:block; font-size:0.71rem; font-weight:800; color:#334155;">N° DE DNI:</label>
          <input type="text" id="rend-dni" value="${pa.dni_comisionado}" ${attrDisabled} oninput="actualizarCabeceraPlanillaRendicion()" style="width:100% !important; max-width:100% !important; min-width:0 !important; box-sizing:border-box !important; padding:8px 10px; border-radius:12px; border:1.5px solid #CBD5E1; font-weight:700; font-size:0.81rem; background:#FFFFFF;" />
        </div>
      </div>

      <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-bottom:8px; ${estiloBloqueado}">
        <div style="min-width:0; max-width:100%;">
          <label style="display:block; font-size:0.71rem; font-weight:800; color:#334155;">APELLIDOS Y NOMBRES:</label>
          <input type="text" id="rend-nombres" value="${pa.nombres_comisionado}" ${attrDisabled} oninput="actualizarCabeceraPlanillaRendicion()" style="width:100% !important; max-width:100% !important; min-width:0 !important; box-sizing:border-box !important; padding:8px 10px; border-radius:12px; border:1.5px solid #CBD5E1; font-weight:700; font-size:0.81rem; background:#FFFFFF;" />
        </div>
        <div style="min-width:0; max-width:100%;">
          <label style="display:block; font-size:0.71rem; font-weight:800; color:#334155;">CARGO:</label>
          <input type="text" id="rend-cargo" value="${pa.cargo_comisionado}" ${attrDisabled} oninput="actualizarCabeceraPlanillaRendicion()" style="width:100% !important; max-width:100% !important; min-width:0 !important; box-sizing:border-box !important; padding:8px 10px; border-radius:12px; border:1.5px solid #CBD5E1; font-weight:700; font-size:0.81rem; background:#FFFFFF;" />
        </div>
      </div>

      <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-bottom:8px; ${estiloBloqueado}">
        <div style="min-width:0; max-width:100%;">
          <label style="display:block; font-size:0.71rem; font-weight:800; color:#334155;">TIPO DE VIAJE:</label>
          <select id="rend-tipo-comision" ${attrDisabled} onchange="actualizarCabeceraPlanillaRendicion()" style="width:100% !important; max-width:100% !important; min-width:0 !important; box-sizing:border-box !important; padding:8px 10px; border-radius:12px; border:1.5px solid #CBD5E1; font-weight:800; font-size:0.79rem; background:#FFFFFF;">
            <option value="NACIONAL_FUERA_DF" ${pa.tipo_comision === 'NACIONAL_FUERA_DF' ? 'selected' : ''}>Viaje Nacional (Declaración Jurada máx. 30%)</option>
            <option value="INTERNO_ADC_DF" ${pa.tipo_comision === 'INTERNO_ADC_DF' ? 'selected' : ''}>Viaje Interno Sede ADC (Declaración Jurada máx. 30%)</option>
            <option value="SIN_VIATICOS_MISMO_DIA" ${pa.tipo_comision === 'SIN_VIATICOS_MISMO_DIA' ? 'selected' : ''}>Diligencia del mismo día (Planilla Anexo 07)</option>
            <option value="INTERNACIONAL_USD" ${pa.tipo_comision === 'INTERNACIONAL_USD' ? 'selected' : ''}>Viaje al Exterior (Declaración Jurada máx. 20%)</option>
          </select>
        </div>
        <div style="min-width:0; max-width:100%;">
          <label style="display:block; font-size:0.71rem; font-weight:800; color:#334155;">CIUDAD DE DESTINO:</label>
          <input type="text" id="rend-ciudad" value="${pa.ciudad_destino}" ${attrDisabled} oninput="actualizarCabeceraPlanillaRendicion()" style="width:100% !important; max-width:100% !important; min-width:0 !important; box-sizing:border-box !important; padding:8px 10px; border-radius:12px; border:1.5px solid #CBD5E1; font-weight:700; font-size:0.81rem; background:#FFFFFF;" />
        </div>
      </div>

      <!-- FECHAS APILADAS EN 1 COLUMNA EN MÓVIL PARA CERO DESBORDE -->
      <div class="grid-fechas-comision" style="display:grid; grid-template-columns:1fr !important; gap:8px; margin-bottom:8px; ${estiloBloqueado}">
        <div style="width:100% !important; max-width:100% !important; min-width:0 !important;">
          <label style="display:block; font-size:0.7rem; font-weight:800; color:#334155;">FECHA DE SALIDA (INICIO):</label>
          <input type="date" id="rend-fecha-ini" value="${pa.fecha_inicio}" ${attrDisabled} onchange="actualizarCabeceraPlanillaRendicion()" style="width:100% !important; max-width:100% !important; min-width:0 !important; box-sizing:border-box !important; padding:8px 10px; border-radius:12px; border:1.5px solid #CBD5E1; font-weight:700; font-size:0.81rem; background:#FFFFFF;" />
        </div>
        <div style="width:100% !important; max-width:100% !important; min-width:0 !important;">
          <label style="display:block; font-size:0.7rem; font-weight:800; color:#334155;">FECHA DE RETORNO (FIN):</label>
          <input type="date" id="rend-fecha-fin" value="${pa.fecha_fin}" ${attrDisabled} onchange="actualizarCabeceraPlanillaRendicion()" style="width:100% !important; max-width:100% !important; min-width:0 !important; box-sizing:border-box !important; padding:8px 10px; border-radius:12px; border:1.5px solid #CBD5E1; font-weight:700; font-size:0.81rem; background:#FFFFFF;" />
        </div>
      </div>

      <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; ${estiloBloqueado}">
        <div style="min-width:0; max-width:100%;">
          <label style="display:block; font-size:0.7rem; font-weight:800; color:#065F46;">VIÁTICO RECIBIDO (S/):</label>
          <input type="number" id="rend-otorgado-viatico" value="${pa.otorgado_viaticos_neto.toFixed(2)}" ${attrDisabled} step="10" oninput="actualizarCabeceraPlanillaRendicion()" style="width:100% !important; max-width:100% !important; min-width:0 !important; box-sizing:border-box !important; padding:8px 10px; border-radius:12px; border:1.5px solid #10B981; font-weight:800; font-size:0.84rem; background:#F2FBF7;" />
        </div>
        <div style="min-width:0; max-width:100%;">
          <label style="display:block; font-size:0.7rem; font-weight:800; color:#0284C7;">PASAJES / OTROS RECIBIDOS (S/):</label>
          <input type="number" id="rend-otorgado-otras" value="${(pa.otorgado_pasajes_terrestres + pa.otorgado_combustible + pa.otorgado_peaje + pa.otorgado_otros).toFixed(2)}" ${attrDisabled} step="10" oninput="actualizarCabeceraPlanillaRendicion()" style="width:100% !important; max-width:100% !important; min-width:0 !important; box-sizing:border-box !important; padding:8px 10px; border-radius:12px; border:1.5px solid #0EA5E9; font-weight:800; font-size:0.84rem; background:#F0F8FF;" />
        </div>
      </div>
    </div>

    <!-- PASO 2: AGREGAR COMPROBANTES DE PAGO (ACTIVO SOLO SI JEFATURA HABILITÓ LA RENDICIÓN) -->
    <div style="background:#F2FBF7; border:1.5px solid #A7F3D0; border-radius:20px; padding:14px; margin-bottom:16px; width:100%; max-width:100%; box-sizing:border-box; overflow:hidden; ${estiloBloqueado}">
      <h3 style="font-size:0.95rem; font-weight:800; color:#0F172A; margin-bottom:4px;">
        🧾 Paso 2. Registra tus Boletas, Facturas y Tickets de Viaje
      </h3>
      <p style="font-size:0.75rem; color:#065F46; margin-bottom:10px; font-weight:600;">
        Ingresa cada comprobante de hotel, restaurante o pasaje que sustentará tu Formato de Rendición (Anexo 04).
      </p>

      <div class="grid-fechas-comision" style="display:grid; grid-template-columns:1fr !important; gap:8px; margin-bottom:8px;">
        <div style="width:100% !important; max-width:100% !important; min-width:0 !important;">
          <label style="display:block; font-size:0.71rem; font-weight:800; color:#334155;">FECHA DEL COMPROBANTE:</label>
          <input type="date" id="comp-rend-fecha" value="${pa.fecha_inicio}" ${attrDisabled} style="width:100% !important; max-width:100% !important; min-width:0 !important; box-sizing:border-box !important; padding:8px 10px; border-radius:12px; border:1.5px solid #CBD5E1; font-weight:700; font-size:0.81rem; background:#FFFFFF;" />
        </div>
        <div style="width:100% !important; max-width:100% !important; min-width:0 !important;">
          <label style="display:block; font-size:0.71rem; font-weight:800; color:#334155;">SERIE Y N° DE BOLETA / FACTURA:</label>
          <input type="text" id="comp-rend-numero" placeholder="Ej: F001-002341 o B001-0452" ${attrDisabled} style="width:100% !important; max-width:100% !important; min-width:0 !important; box-sizing:border-box !important; padding:8px 10px; border-radius:12px; border:1.5px solid #CBD5E1; font-weight:700; font-size:0.81rem; background:#FFFFFF;" />
        </div>
      </div>

      <div style="margin-bottom:8px; width:100%; max-width:100%; min-width:0;">
        <label style="display:block; font-size:0.71rem; font-weight:800; color:#334155;">NOMBRE DEL HOTEL, RESTAURANTE O EMPRESA DE TRANSPORTE:</label>
        <input type="text" id="comp-rend-proveedor" placeholder="Ej: Hotel Libertador / Restaurante El Rocoto" ${attrDisabled} style="width:100% !important; max-width:100% !important; min-width:0 !important; box-sizing:border-box !important; padding:8px 10px; border-radius:12px; border:1.5px solid #CBD5E1; font-weight:700; font-size:0.81rem; background:#FFFFFF;" />
      </div>

      <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; align-items:end; margin-bottom:10px;">
        <div style="min-width:0; max-width:100%;">
          <label style="display:block; font-size:0.71rem; font-weight:800; color:#334155;">¿A QUÉ RUBRO CORRESPONDE?:</label>
          <select id="comp-rend-columna" ${attrDisabled} style="width:100% !important; max-width:100% !important; min-width:0 !important; box-sizing:border-box !important; padding:8px 10px; border-radius:12px; border:1.5px solid #10B981; font-weight:800; font-size:0.79rem; background:#FFFFFF;">
            <option value="HOSPEDAJE">1. Hotel / Hospedaje</option>
            <option value="ALIMENTACION">2. Alimentación (Desayuno/Almuerzo/Cena)</option>
            <option value="MOVILIDAD">3. Movilidad con boleta o ticket</option>
            <option value="PASAJES">4. Pasaje terrestre o fluvial</option>
            <option value="COMBUSTIBLE">5. Combustible (Vehículo oficial)</option>
            <option value="PEAJE">6. Peajes</option>
            <option value="OTROS">7. Otros gastos autorizados</option>
          </select>
        </div>
        <div style="min-width:0; max-width:100%;">
          <label style="display:block; font-size:0.71rem; font-weight:800; color:#334155;">MONTO EN SOLES (SIN PROPINA):</label>
          <input type="number" id="comp-rend-importe" value="85.00" step="0.50" min="0" ${attrDisabled} style="width:100% !important; max-width:100% !important; min-width:0 !important; box-sizing:border-box !important; padding:8px 10px; border-radius:12px; border:1.5px solid #0F172A; font-weight:800; font-size:0.86rem; background:#FFFFFF;" />
        </div>
      </div>

      <button type="button" ${attrDisabled} onclick="agregarComprobanteRendicionViatico()" style="width:100%; background:#10B981; color:#FFFFFF; border:none; border-radius:12px; padding:11px; font-size:0.84rem; font-weight:800; cursor:pointer; margin-bottom:10px; box-shadow:0 3px 10px rgba(16,185,129,0.2);">
        + Agregar Boleta o Factura a mi Lista
      </button>

      <table class="anc-list-table">
        <thead>
          <tr>
            <th style="width:22%;">N° / FECHA</th>
            <th style="width:36%;">ESTABLECIMIENTO / N°</th>
            <th style="width:22%;">RUBRO</th>
            <th style="width:20%;">MONTO</th>
          </tr>
        </thead>
        <tbody id="tbody-comprobantes-rendicion"></tbody>
      </table>
    </div>

    <!-- PASO 3: DECLARACIÓN JURADA (ANEXO 02 NACIONAL / ANEXO 03 EXTERIOR) -->
    <div style="background:#FFFDF5; border:1.5px solid #FDE68A; border-radius:20px; padding:14px; margin-bottom:16px; ${estiloBloqueado}">
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:6px; margin-bottom:6px;">
        <h3 style="font-size:0.95rem; font-weight:800; color:#0F172A;">
          ✍️ Paso 3. Declaración Jurada (Gastos sin Comprobante)
        </h3>
        <span id="badge-tope-dj-rendicion" class="badge-semaforo badge-amarillo">Límite DJ: S/ 0.00</span>
      </div>
      <p style="font-size:0.75rem; color:#475569; margin-bottom:10px; line-height:1.4; font-weight:600;">
        Aquí se incluyen automáticamente tu <strong>movilidad local</strong>, tu <strong>traslado al aeropuerto o terrapuerto</strong> y gastos en lugares donde no emiten boleta, hasta el límite legal del <strong>30% en viajes nacionales</strong> (20% en el exterior).
      </p>

      <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px;">
        <div style="min-width:0; max-width:100%;">
          <label style="display:block; font-size:0.7rem; font-weight:800; color:#78350F;">1. HOSPEDAJE RURAL (SIN BOLETA):</label>
          <input type="number" id="dj-rend-aloj" value="${window.RENDICION_VIATICOS_STATE.djConceptos.alojamiento}" ${attrDisabled} step="5" min="0" oninput="recalcularCuadreRendicionViaticos()" style="width:100% !important; max-width:100% !important; min-width:0 !important; box-sizing:border-box !important; padding:8px 10px; border-radius:12px; border:1.5px solid #F59E0B; font-weight:800; background:#FFFFFF;" />
        </div>
        <div style="min-width:0; max-width:100%;">
          <label style="display:block; font-size:0.7rem; font-weight:800; color:#78350F;">2. ALIMENTACIÓN RURAL (SIN BOLETA):</label>
          <input type="number" id="dj-rend-alim" value="${window.RENDICION_VIATICOS_STATE.djConceptos.alimentacion}" ${attrDisabled} step="5" min="0" oninput="recalcularCuadreRendicionViaticos()" style="width:100% !important; max-width:100% !important; min-width:0 !important; box-sizing:border-box !important; padding:8px 10px; border-radius:12px; border:1.5px solid #F59E0B; font-weight:800; background:#FFFFFF;" />
        </div>
        <div style="min-width:0; max-width:100%;">
          <label style="display:block; font-size:0.7rem; font-weight:800; color:#78350F;">3. MOVILIDAD LOCAL EN DESTINO:</label>
          <input type="number" id="dj-rend-mov-loc" value="${window.RENDICION_VIATICOS_STATE.djConceptos.movilidad_local}" ${attrDisabled} step="2" min="0" oninput="recalcularCuadreRendicionViaticos()" style="width:100% !important; max-width:100% !important; min-width:0 !important; box-sizing:border-box !important; padding:8px 10px; border-radius:12px; border:1.5px solid #F59E0B; font-weight:800; background:#FFFFFF;" />
        </div>
        <div style="min-width:0; max-width:100%;">
          <label style="display:block; font-size:0.7rem; font-weight:800; color:#78350F;">4. TRASLADO AEROPUERTO / TERMINAL:</label>
          <input type="number" id="dj-rend-mov-emb" value="${window.RENDICION_VIATICOS_STATE.djConceptos.movilidad_embarque}" ${attrDisabled} step="5" min="0" oninput="recalcularCuadreRendicionViaticos()" style="width:100% !important; max-width:100% !important; min-width:0 !important; box-sizing:border-box !important; padding:8px 10px; border-radius:12px; border:1.5px solid #F59E0B; font-weight:800; background:#FFFFFF;" />
        </div>
      </div>
    </div>

    <!-- PASO 4: CUADRE AUTOMÁTICO Y EMISIÓN DE ANEXOS OFICIALES -->
    <div id="panel-cuadre-final-rendicion" style="margin-bottom:14px;"></div>

    <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; ${estiloBloqueado}">
      <button type="button" ${attrDisabled} onclick="imprimirAnexoRendicionViaticos('PAQUETE_COMPLETO')" style="grid-column:span 2; background:linear-gradient(135deg, #FBBF24 0%, #F59E0B 100%); color:#0F172A; border:1.5px solid #D97706; border-radius:14px; padding:13px; font-size:0.86rem; font-weight:800; cursor:pointer; box-shadow:0 4px 12px rgba(245,158,11,0.22);">
        🖨️ Descargar Expediente Completo de Rendición Listo para Firmar (PDF)
      </button>
      <button type="button" ${attrDisabled} onclick="imprimirAnexoRendicionViaticos('ANEXO_04')" style="background:#F2FBF7; color:#065F46; border:1.5px solid #A7F3D0; border-radius:12px; padding:10px; font-size:0.75rem; font-weight:800; cursor:pointer;">
        📄 Detalle de Boletas (Anexo 04)
      </button>
      <button type="button" ${attrDisabled} onclick="imprimirAnexoRendicionViaticos('ANEXO_02_03')" style="background:#FFFDF5; color:#92400E; border:1.5px solid #FDE68A; border-radius:12px; padding:10px; font-size:0.75rem; font-weight:800; cursor:pointer;">
        ✍️ Declaración Jurada (Anexo 02/03)
      </button>
      <button type="button" ${attrDisabled} onclick="imprimirAnexoRendicionViaticos('ANEXO_05')" style="background:#F0F8FF; color:#0284C7; border:1.5px solid #BAE6FD; border-radius:12px; padding:10px; font-size:0.75rem; font-weight:800; cursor:pointer;">
        💵 Constancia Devolución (Anexo 05)
      </button>
      <button type="button" ${attrDisabled} onclick="imprimirAnexoRendicionViaticos('ANEXO_06')" style="background:#F5F3FF; color:#6D28D9; border:1.5px solid #DDD6FE; border-radius:12px; padding:10px; font-size:0.75rem; font-weight:800; cursor:pointer;">
        📊 Resumen de Liquidación (Anexo 06)
      </button>
      <button type="button" ${attrDisabled} onclick="exportarRendicionViaticosExcel()" style="grid-column:span 2; background:#0F172A; color:#FBBF24; border:none; border-radius:12px; padding:11px; font-size:0.79rem; font-weight:800; cursor:pointer;">
        📥 Descargar Cuadro de Rendición en Excel (CSV)
      </button>
    </div>
  `;

  recalcularCuadreRendicionViaticos();
}

window.alElegirPlanillaPreviaRendicion = function() {
  const val = document.getElementById("rend-select-planilla-previa")?.value;
  if (!val) return;
  const [idxS, idxC] = val.split("_").map(Number);
  const comisiones = JSON.parse(localStorage.getItem("anc_viaticos_local_v1") || "[]");
  const sol = comisiones[idxS];
  if (sol && sol.comisionados && sol.comisionados[idxC]) {
    const item = sol.comisionados[idxC];
    item.com.rendicion_habilitada = consultarEstadoHabilitacionPlanilla(
      sol.codigo_planilla,
      item.com.dni,
      item.com.rendicion_habilitada
    );

    localStorage.setItem("anc_rendicion_seleccionada_v1", JSON.stringify({
      idxSol: idxS,
      idxCom: idxC,
      codigo_planilla: sol.codigo_planilla,
      solicitud: sol,
      comisionadoItem: item
    }));
    window.RENDICION_VIATICOS_STATE.comprobantes = [];
    cargarPlanillaSeleccionadaParaRendir();
    renderizarModuloRendicionViaticos();
  }
};

window.actualizarCabeceraPlanillaRendicion = function() {
  const pa = window.RENDICION_VIATICOS_STATE.planillaActiva;
  if (!pa.rendicion_habilitada) return;

  pa.codigo_planilla = document.getElementById("rend-codigo-planilla")?.value || "PV-2026-001";
  pa.dni_comisionado = document.getElementById("rend-dni")?.value || "";
  pa.tipo_comision = document.getElementById("rend-tipo-comision")?.value || "NACIONAL_FUERA_DF";
  pa.nombres_comisionado = document.getElementById("rend-nombres")?.value || "";
  pa.cargo_comisionado = document.getElementById("rend-cargo")?.value || "";
  pa.ciudad_destino = document.getElementById("rend-ciudad")?.value || "";
  pa.fecha_inicio = document.getElementById("rend-fecha-ini")?.value || "";
  pa.fecha_fin = document.getElementById("rend-fecha-fin")?.value || "";

  // Actualizar fecha_hora_retorno conservando la hora original si el usuario ajusta la fecha fin
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

  // Actualizar en vivo el contómetro regresivo de cabecera
  const contContometro = document.getElementById("contenedor-contometro-cabecera");
  if (contContometro) {
    const infoContometro = window.calcularContometroPlazoRendicion(
      pa.fecha_hora_retorno || pa.fecha_fin,
      pa.tipo_comision
    );
    contContometro.innerHTML = renderizarCajaContometroHTML(infoContometro, pa);
  }

  recalcularCuadreRendicionViaticos();
};

window.agregarComprobanteRendicionViatico = function() {
  const pa = window.RENDICION_VIATICOS_STATE.planillaActiva;
  if (!pa.rendicion_habilitada) {
    alert("🔒 Rendición en espera: Jefatura debe autorizar primero la rendición de esta comisión antes de registrar comprobantes.");
    return;
  }

  const fecha = document.getElementById("comp-rend-fecha")?.value || new Date().toISOString().slice(0, 10);
  const proveedor = document.getElementById("comp-rend-proveedor")?.value.trim() || "Establecimiento comercial";
  const numero = document.getElementById("comp-rend-numero")?.value.trim() || "F001-0001";
  const col = document.getElementById("comp-rend-columna")?.value || "ALIMENTACION";
  const imp = Number(document.getElementById("comp-rend-importe")?.value || 0);

  if (imp <= 0) {
    alert("⚠️ Por favor, ingresa un monto mayor a S/ 0.00 (Recuerda no incluir propinas según Res. N° 000038-2025-MP-FN-GG-OGFIN).");
    return;
  }

  window.RENDICION_VIATICOS_STATE.comprobantes.push({
    id: Date.now(),
    fecha,
    proveedor,
    numero,
    columna: col,
    hospedaje: col === "HOSPEDAJE" ? imp : 0,
    alimentacion: col === "ALIMENTACION" ? imp : 0,
    movilidad: col === "MOVILIDAD" ? imp : 0,
    pasajes: col === "PASAJES" ? imp : 0,
    combustible: col === "COMBUSTIBLE" ? imp : 0,
    peaje: col === "PEAJE" ? imp : 0,
    otros: col === "OTROS" ? imp : 0,
    total: imp
  });

  document.getElementById("comp-rend-proveedor").value = "";
  document.getElementById("comp-rend-numero").value = "";
  recalcularCuadreRendicionViaticos();
};

window.eliminarComprobanteRendicion = function(idComp) {
  if (!window.RENDICION_VIATICOS_STATE.planillaActiva.rendicion_habilitada) return;
  window.RENDICION_VIATICOS_STATE.comprobantes = window.RENDICION_VIATICOS_STATE.comprobantes.filter(c => c.id !== idComp);
  recalcularCuadreRendicionViaticos();
};

function obtenerResumenCalculadoRendicion() {
  const pa = window.RENDICION_VIATICOS_STATE.planillaActiva;
  const comps = window.RENDICION_VIATICOS_STATE.comprobantes;

  const djAloj = Number(document.getElementById("dj-rend-aloj")?.value || 0);
  const djAlim = Number(document.getElementById("dj-rend-alim")?.value || 0);
  const djMovLoc = Number(document.getElementById("dj-rend-mov-loc")?.value || 0);
  const djMovEmb = Number(document.getElementById("dj-rend-mov-emb")?.value || 0);

  window.RENDICION_VIATICOS_STATE.djConceptos = {
    alojamiento: djAloj,
    alimentacion: djAlim,
    movilidad_local: djMovLoc,
    movilidad_embarque: djMovEmb
  };

  const sumDoc = {
    hospedaje: comps.reduce((a, b) => a + b.hospedaje, 0),
    alimentacion: comps.reduce((a, b) => a + b.alimentacion, 0),
    movilidad: comps.reduce((a, b) => a + b.movilidad, 0),
    pasajes: comps.reduce((a, b) => a + b.pasajes, 0),
    combustible: comps.reduce((a, b) => a + b.combustible, 0),
    peaje: comps.reduce((a, b) => a + b.peaje, 0),
    otros: comps.reduce((a, b) => a + b.otros, 0)
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

  const tbody = document.getElementById("tbody-comprobantes-rendicion");
  if (tbody) {
    if (comps.length === 0) {
      tbody.innerHTML = `<tr><td colspan="4" style="text-align:center; color:#64748B; padding:14px; font-size:0.78rem;">Aún no has agregado boletas ni facturas para esta comisión.</td></tr>`;
    } else {
      tbody.innerHTML = comps.map((c, idx) => `
        <tr>
          <td><strong style="color:#0F172A;">#${String(idx + 1).padStart(2, "0")}</strong><br/><small style="color:#475569;">${c.fecha}</small></td>
          <td><strong style="color:#0F172A;">${c.proveedor}</strong><br/><small style="color:#475569;">N° ${c.numero}</small></td>
          <td><span class="badge-semaforo badge-verde" style="font-size:0.65rem;">${c.columna}</span></td>
          <td>
            <strong style="color:#0F172A;">${window.fmtSoles(c.total)}</strong>
            <button type="button" onclick="eliminarComprobanteRendicion(${c.id})" style="margin-left:4px; background:#FFF5F6; color:#9F1239; border:1px solid #FECDD3; border-radius:6px; padding:2px 6px; font-size:0.68rem; font-weight:800; cursor:pointer;">✕</button>
          </td>
        </tr>
      `).join("");
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
          📊 Paso 4. Balance Automático de tu Rendición
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
        ${r.excedeDJ ? `<div style="margin-top:9px; color:#FCA5A5; font-size:0.75rem; font-weight:700; line-height:1.38;">⚠️ Atención: El monto en Declaración Jurada (${window.fmtSoles(r.totalDJ)}) supera el límite permitido del ${pa.porcentaje_max_dj}% (${window.fmtSoles(pa.tope_max_dj_soles)}). Ajusta los importes o agrega tus boletas en el Paso 2.</div>` : ""}
        ${r.sinHospedaje ? `<div style="margin-top:7px; color:#FDE68A; font-size:0.74rem; font-weight:700; line-height:1.38;">💡 Recuerda: Aún no has ingresado boleta o factura de Hotel/Hospedaje. Si no requirió pernocte en hotel, recuerda que se descuenta S/ 80 por día en viaje nacional (o S/ 40 en viaje interno).</div>` : ""}
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
        <td style="text-align:right;">${c && c.hospedaje ? c.hospedaje.toFixed(2) : ""}</td>
        <td style="text-align:right;">${c && c.alimentacion ? c.alimentacion.toFixed(2) : ""}</td>
        <td style="text-align:right;">${c && c.movilidad ? c.movilidad.toFixed(2) : ""}</td>
        <td style="text-align:right;">${c && c.pasajes ? c.pasajes.toFixed(2) : ""}</td>
        <td style="text-align:right;">${c && c.combustible ? c.combustible.toFixed(2) : ""}</td>
        <td style="text-align:right;">${c && c.peaje ? c.peaje.toFixed(2) : ""}</td>
        <td style="text-align:right;">${c && c.otros ? c.otros.toFixed(2) : ""}</td>
        <td style="text-align:right; font-weight:bold;">${c ? c.total.toFixed(2) : ""}</td>
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
    alert("🔒 Rendición en espera: Jefatura debe autorizar primero la rendición de esta comisión para poder descargar los formatos oficiales.");
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
    alert("🔒 Rendición en espera: Jefatura debe autorizar primero la rendición de esta comisión para exportar a Excel.");
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
    c.hospedaje.toFixed(2),
    c.alimentacion.toFixed(2),
    c.movilidad.toFixed(2),
    c.pasajes.toFixed(2),
    c.combustible.toFixed(2),
    c.peaje.toFixed(2),
    c.otros.toFixed(2),
    c.total.toFixed(2)
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