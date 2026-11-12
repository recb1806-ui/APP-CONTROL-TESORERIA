// =========================================================================================
// ETAPA 4 (ACTUALIZADA): MÓDULO DE CÁLCULO Y SOLICITUD DE VIÁTICOS POR COMISIÓN E INDIVIDUAL
// Directiva GFIN/DIR-01 Versión 10 + Resolución N° 000038-2025-MP-FN-GG-OGFIN
// Incluye Privacidad por Usuario (DNI), Inclusión de Comisionados de Otras Sedes y
// Habilitación / Bloqueo de Rendición exclusivo por Jefatura o Administrador
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
  modoVista: "LISTA_COMISIONES", // 'LISTA_COMISIONES' o 'EDITOR_COMISION'
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

        // Por defecto false hasta que Jefatura o Administrador lo autorice
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
            etiquetaEscala: sol.tipo_comision === "SIN_VIATICOS_MISMO_DIA" ? "Anexo 07 (Sin Viáticos)" : "Directiva Viáticos V.10",
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

window.iniciarNuevaComisionViaticos = function() {
  window.VIATICOS_STATE.modoVista = "EDITOR_COMISION";
  window.VIATICOS_STATE.comisionados = [];
  renderizarModuloViaticos();
};

window.volverAListaComisionesViaticos = function() {
  window.VIATICOS_STATE.modoVista = "LISTA_COMISIONES";
  renderizarModuloViaticos();
};

// =========================================================================
// HABILITACIÓN / BLOQUEO DE RENDICIÓN POR JEFATURA O ADMINISTRADOR
// =========================================================================
window.toggleHabilitarRendicionComisionado = async function(idxSol, idxCom) {
  if (!window.validarPinJefaturaOAdmin("habilitar o bloquear la rendición de viáticos del comisionado")) {
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
      ? `🔓 RENDICIÓN HABILITADA:\nEl comisionado ${item.com.nombres} (DNI: ${item.com.dni}) ya puede registrar y emitir su rendición de viáticos en el módulo "Rendir mis Viáticos".`
      : `🔒 RENDICIÓN BLOQUEADA:\nSe ha restringido la emisión de la rendición para ${item.com.nombres} (DNI: ${item.com.dni}).`
  );
};

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

  // =========================================================================
  // MODO 1: PANTALLA INICIAL -> BOTÓN "(+) NUEVA COMISIÓN" + MIS COMISIONES
  // =========================================================================
  if (window.VIATICOS_STATE.modoVista === "LISTA_COMISIONES") {
    // PRIVACIDAD ESTRICTA: Cada usuario solo ve las comisiones que creó o donde está incluido por su DNI
    // Solo ADMINISTRADOR ve todas las comisiones de todas las unidades/ADC
    const comisionesConIndiceReal = window.VIATICOS_STATE.comisionesCreadas
      .map((c, idxReal) => ({ comision: c, idxReal }))
      .filter(({ comision }) => {
        if (typeof window.esRegistroDelUsuarioActivo === "function") {
          return window.esRegistroDelUsuarioActivo(comision);
        }
        return true;
      });

    const esJefaturaOAdmin = typeof window.puedeHabilitarRendicion === "function" && window.puedeHabilitarRendicion();

    cont.innerHTML = `
      <!-- Botón Circular Central (+) NUEVA COMISIÓN -->
      <div class="add-circle-container" style="margin-bottom:16px;">
        <button type="button" class="btn-circle-plus" onclick="iniciarNuevaComisionViaticos()" title="Crear Nueva Comisión de Servicios">+</button>
        <div style="margin-top:8px; font-size:1.08rem; font-weight:900; color:#0B2545;">Nueva Comisión de Servicios</div>
        <p class="add-circle-caption" style="margin-top:3px;">
          Toca el círculo (+) para crear una comisión e incluir comisionados de tu sede u otras sedes
        </p>
      </div>

      <!-- Aviso de Privacidad y Rol Activo -->
      <div style="background:#F2F6FC; border:1px solid #C2D6F0; border-radius:12px; padding:9px 11px; margin-bottom:10px; font-size:0.75rem; color:#0B2545;">
        ${window.esAdministradorActivo && window.esAdministradorActivo()
          ? `🛡️ <strong>Vista Administrador General:</strong> Visualizando todas las comisiones nacionales y control de habilitación de rendiciones.`
          : (esJefaturaOAdmin
            ? `🏛️ <strong>Perfil Jefatura (${p.usuario_nombre}):</strong> Puedes habilitar o bloquear la rendición de cada comisionado incluido.`
            : `🔒 <strong>Privacidad por Usuario (${p.usuario_nombre} • DNI: ${p.usuario_dni}):</strong> Solo visualizas las comisiones registradas por ti o en las que estás incluido por tu DNI.`)}
      </div>

      <!-- Alerta Normativa de Prohibición de Propinas (Res. N° 000038-2025-MP-FN-GG-OGFIN) -->
      <div style="background:#FEF2F2; border:1px solid #FCA5A5; border-radius:12px; padding:9px 11px; margin-bottom:14px; font-size:0.76rem; color:#991B1B;">
        🚫 <strong>Res. N° 000038-2025-MP-FN-GG-OGFIN:</strong> No se reconocen gastos por propinas en comprobantes de consumo, alojamiento o movilidad.
      </div>

      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; margin-bottom:10px;">
        <h3 style="font-size:0.96rem; font-weight:900; color:#0B2545;">
          📋 Mis Comisiones de Servicio (${comisionesConIndiceReal.length})
        </h3>
        <button type="button" onclick="navegarVista('rendicion-viaticos')" style="background:#BE185D; color:#FFFFFF; border:none; border-radius:9px; padding:7px 11px; font-size:0.74rem; font-weight:800; cursor:pointer;">
          📑 Ir a Rendir mis Viáticos →
        </button>
      </div>

      <div id="lista-tarjetas-comisiones-creadas" style="display:flex; flex-direction:column; gap:12px;">
        ${comisionesConIndiceReal.length === 0 ? `
          <div style="text-align:center; padding:22px 12px; background:#F8FAFC; border:1.5px dashed #CBD5E1; border-radius:14px; color:#64748B; font-size:0.82rem;">
            No tienes comisiones registradas ni asignadas a tu DNI (<strong>${p.usuario_dni}</strong>).<br/>
            <strong>Toca el botón circular (+) arriba para crear una comisión.</strong>
          </div>
        ` : comisionesConIndiceReal.map(({ comision, idxReal }) => renderizarTarjetaComisionCreada(comision, idxReal)).join("")}
      </div>
    `;
    return;
  }

  // =========================================================================
  // MODO 2: EDITOR DE NUEVA COMISIÓN (ITINERARIO + COMISIONADOS + REPORTES)
  // =========================================================================
  const fechas = obtenerFechasPorDefectoViaticos();

  cont.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; margin-bottom:12px; padding-bottom:10px; border-bottom:1.5px solid #DCE3EC;">
      <button type="button" onclick="volverAListaComisionesViaticos()" style="background:#0B2545; color:#D4AF37; border:1px solid #D4AF37; border-radius:9px; padding:7px 12px; font-size:0.78rem; font-weight:800; cursor:pointer;">
        ← Volver a Mis Comisiones
      </button>
      <span class="badge-semaforo badge-amarillo">NUEVA COMISIÓN EN CURSO</span>
    </div>

    <!-- PASO 1 DE LA COMISIÓN: PARÁMETROS E ITINERARIO -->
    <div style="background:#F8FAFC; border:1.5px solid #DCE3EC; border-radius:16px; padding:12px; margin-bottom:14px;">
      <h3 style="font-size:0.92rem; font-weight:900; color:#0B2545; margin-bottom:10px;">
        ✈️ 1. Datos de la Comisión de Servicios e Itinerario
      </h3>

      <div style="margin-bottom:10px;">
        <label style="display:block; font-size:0.72rem; font-weight:800; color:#334155; margin-bottom:3px;">MODALIDAD / ESCALA (DIRECTIVA VIÁTICOS V.10):</label>
        <select id="viat-tipo-comision" onchange="alCambiarModalidadViatico()" style="width:100%; padding:9px; border-radius:9px; border:1.5px solid #0B2545; font-weight:800; font-size:0.82rem; background:#FAF6EE; color:#0B2545;">
          <option value="NACIONAL_FUERA_DF">1. Nacional fuera del Distrito Fiscal (Cuadros N° 01 y 02 • Máx. 5 días)</option>
          <option value="INTERNO_ADC_DF">2. Interior del propio Distrito Fiscal / ADC > 24h (Cuadro N° 03 • Máx. 10 días)</option>
          <option value="SIN_VIATICOS_MISMO_DIA">3. Comisión sin Viáticos / Mismo Día / Radio Urbano (Anexo 07: S/ 40 o S/ 80)</option>
          <option value="INTERNACIONAL_USD">4. Comisión Internacional al Exterior en USD (Cuadros N° 04 y 05 + Instalación)</option>
        </select>
      </div>

      <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-bottom:10px;">
        <div>
          <label style="display:block; font-size:0.72rem; font-weight:800; color:#334155; margin-bottom:3px;">DOCUMENTO QUE AUTORIZA:</label>
          <input type="text" id="viat-doc-autoriza" value="Res. Jefatural N° 015-2026-ANC-MP" style="width:100%; padding:8px; border-radius:8px; border:1px solid #94A3B8; font-weight:700; font-size:0.82rem;" />
        </div>
        <div>
          <label style="display:block; font-size:0.72rem; font-weight:800; color:#334155; margin-bottom:3px;">MEDIO DE TRANSPORTE:</label>
          <select id="viat-medio-transporte" onchange="recalcularTiempoYComisionados()" style="width:100%; padding:8px; border-radius:8px; border:1.5px solid #0B2545; font-weight:800; font-size:0.82rem; background:#FFF;">
            <option value="AEREO">✈️ Vía Aérea (+2h ida / +2h retorno)</option>
            <option value="TERRESTRE">🚌 Vía Terrestre (+1h ida / +1h retorno)</option>
            <option value="FLUVIAL">🚤 Vía Fluvial (+1h ida / +1h retorno)</option>
            <option value="VEHICULO_OFICIAL">🚓 Vehículo Oficial ANC-MP</option>
          </select>
        </div>
      </div>

      <div id="bloque-destino-nacional" style="display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-bottom:10px;">
        <div>
          <label style="display:block; font-size:0.72rem; font-weight:800; color:#334155; margin-bottom:3px;">ORIGEN:</label>
          <input type="text" id="viat-origen" value="${p.sede_ubicacion || 'Lima'}" style="width:100%; padding:8px; border-radius:8px; border:1px solid #94A3B8; font-weight:700; font-size:0.82rem;" />
        </div>
        <div>
          <label style="display:block; font-size:0.72rem; font-weight:800; color:#334155; margin-bottom:3px;">DESTINO (Anexo 08 o Provincia):</label>
          <select id="viat-destino-select" onchange="alSeleccionarRutaAnexo08()" style="width:100%; padding:8px; border-radius:8px; border:1px solid #94A3B8; font-weight:700; font-size:0.82rem;">
            ${window.VIATICOS_CATALOGO.rutasAereasAnexo08.map(r => `<option value="${r.destino}">${r.destino}</option>`).join("")}
            <option value="OTRO_DESTINO">-- Otro Destino / Provincia ADC --</option>
          </select>
        </div>
      </div>

      <div id="bloque-zona-internacional" style="display:none; grid-template-columns:1fr 1fr; gap:8px; margin-bottom:10px;">
        <div>
          <label style="display:block; font-size:0.72rem; font-weight:800; color:#78350F; margin-bottom:3px;">ZONA GEOGRÁFICA (CUADROS 04/05):</label>
          <select id="viat-zona-ext" onchange="recalcularTiempoYComisionados()" style="width:100%; padding:8px; border-radius:8px; border:1.5px solid #D97706; font-weight:800; background:#FFFBEB;">
            ${window.VIATICOS_CATALOGO.zonasInternacionales.map(z => `<option value="${z.codigo}">${z.nombre} (+${z.dias_inst}d inst. | $${z.c4_usd}/$${z.c5_usd})</option>`).join("")}
          </select>
        </div>
        <div>
          <label style="display:block; font-size:0.72rem; font-weight:800; color:#78350F; margin-bottom:3px;">CIUDAD / PAÍS DESTINO:</label>
          <input type="text" id="viat-ciudad-ext" value="Bogotá, Colombia" style="width:100%; padding:8px; border-radius:8px; border:1px solid #D97706; font-weight:700;" />
        </div>
      </div>

      <div id="bloque-vehiculo-oficial" style="display:none; background:#F2F6FC; border:1px solid #C2D6F0; border-radius:10px; padding:10px; margin-bottom:10px;">
        <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:8px;">
          <input type="text" id="viat-placa-oficial" placeholder="Placa (Ej: EGW-123)" style="padding:8px; border-radius:7px; border:1px solid #93C5FD; font-weight:700; font-size:0.78rem;" />
          <input type="text" id="viat-conductor-oficial" placeholder="Conductor asignado" style="padding:8px; border-radius:7px; border:1px solid #93C5FD; font-weight:700; font-size:0.78rem;" />
          <input type="text" id="viat-km-estimado" placeholder="Km ida/vuelta" style="padding:8px; border-radius:7px; border:1px solid #93C5FD; font-weight:700; font-size:0.78rem;" />
        </div>
      </div>

      <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-bottom:10px;">
        <div>
          <label style="display:block; font-size:0.72rem; font-weight:800; color:#334155; margin-bottom:3px;">FECHA Y HORA DE SALIDA:</label>
          <input type="datetime-local" id="viat-fecha-salida" value="${fechas.salida}" onchange="recalcularTiempoYComisionados()" style="width:100%; padding:8px; border-radius:8px; border:1px solid #94A3B8; font-weight:700; font-size:0.8rem;" />
        </div>
        <div>
          <label style="display:block; font-size:0.72rem; font-weight:800; color:#334155; margin-bottom:3px;">FECHA Y HORA DE RETORNO:</label>
          <input type="datetime-local" id="viat-fecha-retorno" value="${fechas.retorno}" onchange="recalcularTiempoYComisionados()" style="width:100%; padding:8px; border-radius:8px; border:1px solid #94A3B8; font-weight:700; font-size:0.8rem;" />
        </div>
      </div>

      <div style="margin-bottom:10px;">
        <label style="display:block; font-size:0.72rem; font-weight:800; color:#334155; margin-bottom:3px;">MOTIVO DE LA COMISIÓN:</label>
        <input type="text" id="viat-motivo" value="Visita de control funcional e investigación preliminar" style="width:100%; padding:8px; border-radius:8px; border:1px solid #94A3B8; font-weight:700; font-size:0.82rem;" />
      </div>

      <div id="panel-resumen-tiempo-viaticos" style="background:#0B2545; color:#F8FAFC; border-radius:10px; padding:9px 11px; font-size:0.76rem;"></div>
    </div>

    <!-- PASO 2 DE LA COMISIÓN: AGREGAR COMISIONADOS Y GENERAR FORMATOS INDIVIDUALES / GRUPAL -->
    <div style="background:#FFFFFF; border:1.5px solid #D4AF37; border-radius:16px; padding:12px;">
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; margin-bottom:10px;">
        <h3 style="font-size:0.92rem; font-weight:900; color:#0B2545;">
          👥 2. Comisionados Integrantes (<span id="lbl-cant-comisionados">0</span>)
        </h3>
        <div style="display:flex; gap:6px; flex-wrap:wrap;">
          <button type="button" onclick="agregarmeComoComisionadoActivo()" style="background:#F2F6FC; color:#0B2545; border:1px solid #134074; border-radius:8px; padding:7px 10px; font-size:0.74rem; font-weight:800; cursor:pointer;">
            👤 + Incluirme (${p.usuario_dni})
          </button>
          <button type="button" onclick="abrirModalAgregarComisionado()" style="background:#0B2545; color:#D4AF37; border:1px solid #D4AF37; border-radius:8px; padding:7px 11px; font-size:0.76rem; font-weight:800; cursor:pointer;">
            + Agregar Comisionado
          </button>
        </div>
      </div>

      <table class="anc-list-table">
        <thead>
          <tr>
            <th style="width:42%;">COMISIONADO / SEDE</th>
            <th style="width:33%;">DESGLOSE Y TOTAL</th>
            <th style="width:25%;">ACCIONES</th>
          </tr>
        </thead>
        <tbody id="tbody-comisionados-viaticos"></tbody>
      </table>

      <div id="panel-totales-planilla-viaticos" style="margin-top:10px;"></div>

      <!-- Botones de Guardado y Reportes de toda la Comisión -->
      <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:8px; margin-top:12px;">
        <button type="button" onclick="procesarYGuardarPlanillaViaticos()" style="background:#10B981; color:#FFFFFF; border:none; border-radius:10px; padding:11px 8px; font-size:0.78rem; font-weight:800; cursor:pointer;">
          💾 Guardar Comisión
        </button>
        <button type="button" onclick="imprimirReporteComisionActivaPDF()" style="background:#0B2545; color:#D4AF37; border:1px solid #D4AF37; border-radius:10px; padding:11px 8px; font-size:0.78rem; font-weight:800; cursor:pointer;">
          🖨️ PDF Comisión
        </button>
        <button type="button" onclick="exportarComisionActivaExcel()" style="background:#134074; color:#FFFFFF; border:none; border-radius:10px; padding:11px 8px; font-size:0.78rem; font-weight:800; cursor:pointer;">
          📥 Excel Comisión
        </button>
      </div>
    </div>
  `;

  recalcularTiempoYComisionados();
}

function renderizarTarjetaComisionCreada(sol, idxSol) {
  const coms = sol.comisionados || [];
  const esSinViaticos = sol.tipo_comision === "SIN_VIATICOS_MISMO_DIA";
  const nombreAnexo = esSinViaticos ? "Anexo 07" : "Anexo 01";
  const p = window.ANC_STATE?.perfilActivo || {};
  const miDni = String(p.usuario_dni || "").trim();
  const puedeHabilitar = typeof window.puedeHabilitarRendicion === "function" && window.puedeHabilitarRendicion();

  return `
    <div style="background:#FFFFFF; border:1.5px solid #DCE3EC; border-radius:16px; padding:12px; box-shadow:0 2px 8px rgba(11,37,69,0.05);">
      <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:8px; border-bottom:1px solid #E2E8F0; padding-bottom:8px; margin-bottom:10px;">
        <div style="min-width:0; flex:1;">
          <div style="display:flex; align-items:center; gap:6px; flex-wrap:wrap;">
            <span class="badge-semaforo badge-verde">${sol.codigo_planilla}</span>
            <strong style="font-size:0.9rem; color:#0B2545;">${sol.origen_comision} → ${sol.destino_comision}</strong>
          </div>
          <div style="font-size:0.74rem; color:#475569; margin-top:3px;">
            <strong>Doc.:</strong> ${sol.documento_autorizacion} • <strong>Transp.:</strong> ${sol.medio_transporte} • <strong>Duración:</strong> ${sol.dias_viatico_reconocidos}d y ${sol.horas_fraccion_reconocidas}h
          </div>
          <div style="font-size:0.74rem; color:#334155;"><strong>Motivo:</strong> ${sol.motivo_comision}</div>
        </div>
        <div style="text-align:right;">
          <div style="font-size:0.68rem; font-weight:800; color:#64748B;">TOTAL COMISIÓN</div>
          <div style="font-size:1.05rem; font-weight:900; color:#0B2545;">${window.fmtSoles(sol.monto_total_solicitud)}</div>
          <div style="display:flex; gap:5px; margin-top:4px; justify-content:flex-end; flex-wrap:wrap;">
            <button type="button" onclick="imprimirReporteComisionGuardadaPDF(${idxSol})" style="background:#0B2545; color:#D4AF37; border:none; border-radius:7px; padding:5px 8px; font-size:0.7rem; font-weight:800; cursor:pointer;">
              🖨️ PDF (${coms.length})
            </button>
            <button type="button" onclick="exportarComisionGuardadaExcel(${idxSol})" style="background:#10B981; color:#FFF; border:none; border-radius:7px; padding:5px 8px; font-size:0.7rem; font-weight:800; cursor:pointer;">
              📥 Excel
            </button>
          </div>
        </div>
      </div>

      <div style="font-size:0.72rem; font-weight:800; color:#475569; margin-bottom:6px;">
        COMISIONADOS INTEGRANTES (${puedeHabilitar ? 'Jefatura/Admin: Habilita o bloquea la rendición por comisionado' : 'Imprime tu planilla o rinde tus viáticos una vez habilitado por Jefatura'}):
      </div>

      <div style="display:flex; flex-direction:column; gap:6px;">
        ${coms.map((item, idxC) => {
          const hab = Boolean(item.com.rendicion_habilitada);
          const esMiDni = String(item.com.dni || "").trim() === miDni;

          return `
            <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; background:${esMiDni ? '#FAF6EE' : '#F8FAFC'}; padding:8px 10px; border-radius:10px; border:1px solid ${esMiDni ? '#D4AF37' : '#E2E8F0'};">
              <div style="font-size:0.76rem; min-width:0; flex:1;">
                <div style="display:flex; align-items:center; gap:5px; flex-wrap:wrap;">
                  <strong>#${idxC + 1} ${item.com.nombres}</strong>
                  <span style="color:#475569;">(DNI: ${item.com.dni})</span>
                  ${item.com.sede_comisionado ? `<span style="font-size:0.68rem; background:#E2E8F0; color:#0B2545; padding:2px 6px; border-radius:6px; font-weight:700;">${item.com.sede_comisionado}</span>` : ""}
                </div>
                <div style="color:#475569; margin-top:2px;">
                  ${item.com.cargo} • Asignado: <strong style="color:#0B2545;">${window.fmtSoles(item.calc.totalRecibir)}</strong>
                </div>
                <div style="margin-top:3px;">
                  ${hab
                    ? `<span class="badge-semaforo badge-verde" style="font-size:0.65rem; padding:2px 7px;">🔓 Rendición Habilitada por Jefatura</span>`
                    : `<span class="badge-semaforo badge-amarillo" style="font-size:0.65rem; padding:2px 7px;">🔒 Rendición Pendiente de Habilitación por Jefatura</span>`}
                </div>
              </div>

              <div style="display:flex; gap:5px; flex-wrap:wrap; justify-content:flex-end;">
                ${puedeHabilitar ? `
                  <button type="button" onclick="toggleHabilitarRendicionComisionado(${idxSol}, ${idxC})" style="background:${hab ? '#FEF2F2' : '#ECFDF5'}; color:${hab ? '#991B1B' : '#065F46'}; border:1.5px solid ${hab ? '#EF4444' : '#10B981'}; border-radius:7px; padding:5px 8px; font-size:0.7rem; font-weight:800; cursor:pointer;">
                    ${hab ? '🔒 Bloquear Rendición' : '🔓 Habilitar Rendición'}
                  </button>
                ` : ""}

                <button type="button" onclick="imprimirPlanillaIndividualGuardadaPDF(${idxSol}, ${idxC})" style="background:#0B2545; color:#D4AF37; border:1px solid #D4AF37; border-radius:7px; padding:5px 8px; font-size:0.7rem; font-weight:800; cursor:pointer;">
                  🖨️ ${nombreAnexo} PDF
                </button>

                <button type="button" onclick="irARendirComisionado(${idxSol}, ${idxC})" style="background:${hab ? '#BE185D' : '#94A3B8'}; color:#FFFFFF; border:none; border-radius:7px; padding:5px 8px; font-size:0.7rem; font-weight:800; cursor:pointer;">
                  ${hab ? '📑 Rendir Viáticos' : '🔒 Rendir (Bloqueado)'}
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
    alert("⚠️ Agregue al menos un comisionado para generar el reporte de la comisión.");
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
    alert("⚠️ No hay comisionados en la comisión actual.");
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
    alert(`🔒 RENDICIÓN PENDIENTE DE HABILITACIÓN:\nEl comisionado ${item.com.nombres} (DNI: ${item.com.dni}) aún no tiene habilitada la opción de rendición por parte de Jefatura.\n\nEn la siguiente pantalla podrás visualizar el estado de la planilla, pero el registro y emisión estarán bloqueados hasta que Jefatura lo habilite.`);
  }

  navegarVista("rendicion-viaticos");
};

function recolectarDatosFormularioComisionActiva() {
  const p = window.ANC_STATE.perfilActivo;
  const cfg = window.ANC_STATE.config;
  const t = window.VIATICOS_STATE.ultimoCalculoTiempo;
  const tipo = document.getElementById("viat-tipo-comision")?.value || "NACIONAL_FUERA_DF";
  const destino = tipo === "INTERNACIONAL_USD"
    ? `${document.getElementById("viat-zona-ext")?.value} - ${document.getElementById("viat-ciudad-ext")?.value}`
    : (document.getElementById("viat-destino-select")?.value || "Arequipa");

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
    origen_comision: document.getElementById("viat-origen")?.value || p.sede_ubicacion,
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
// MODAL DE COMISIONADOS (PERMITE INCLUIR USUARIOS DE OTRAS SEDES / ADC)
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
        <span class="modal-title">Añadir Comisionado a la Comisión</span>
        <span class="modal-correlativo-pill" id="pill-num-comisionado">#01</span>
      </div>

      <div class="modal-body-content">
        <div style="margin-bottom:10px;">
          <label style="display:block; font-size:0.72rem; font-weight:800; color:#0B2545; margin-bottom:4px;">ESCALA / NIVEL JERÁRQUICO:</label>
          <select id="com-nivel-escala" style="width:100%; padding:9px; border-radius:9px; border:1.5px solid #0B2545; font-weight:800; font-size:0.81rem; background:#FAF6EE;">
            <option value="NIVEL_2">Nivel 2 / Nivel B / Cuadro 05: Fiscal Adj. Sup., Fiscal Prov., Adj. Prov., Administrativos y Locadores (S/ 320 Nac. | S/ 130 ADC)</option>
            <option value="NIVEL_1">Nivel 1 / Nivel A / Cuadro 04: Jefe Nacional ANC, Supremo, Adj. Supremo, Fiscal Superior, Jefe OCA (S/ 380 Nac. | S/ 150 ADC)</option>
          </select>
        </div>

        <div style="display:grid; grid-template-columns:2fr 1fr; gap:8px; margin-bottom:10px;">
          <div>
            <label style="display:block; font-size:0.72rem; font-weight:800; color:#334155; margin-bottom:3px;">APELLIDOS Y NOMBRES:</label>
            <input type="text" id="com-nombres" placeholder="Ej: Dra. María Gómez" style="width:100%; padding:8px; border-radius:8px; border:1px solid #94A3B8; font-weight:700; font-size:0.83rem;" />
          </div>
          <div>
            <label style="display:block; font-size:0.72rem; font-weight:800; color:#334155; margin-bottom:3px;">DNI N°:</label>
            <input type="text" id="com-dni" maxlength="12" placeholder="8 dígitos" style="width:100%; padding:8px; border-radius:8px; border:1.5px solid #0B2545; font-weight:800; font-size:0.83rem;" />
          </div>
        </div>

        <div style="margin-bottom:10px;">
          <label style="display:block; font-size:0.72rem; font-weight:800; color:#334155; margin-bottom:3px;">SEDE / UNIDAD ORGÁNICA O ADC DEL COMISIONADO:</label>
          <input type="text" id="com-sede-origen" placeholder="Ej: Lima - Sede Central / ADC Arequipa" style="width:100%; padding:8px; border-radius:8px; border:1px solid #94A3B8; font-weight:700; font-size:0.82rem;" />
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-bottom:10px;">
          <div>
            <label style="display:block; font-size:0.72rem; font-weight:800; color:#334155; margin-bottom:3px;">CARGO:</label>
            <input type="text" id="com-cargo" value="Fiscal de Control / Especialista" style="width:100%; padding:8px; border-radius:8px; border:1px solid #94A3B8; font-weight:700; font-size:0.82rem;" />
          </div>
          <div>
            <label style="display:block; font-size:0.72rem; font-weight:800; color:#334155; margin-bottom:3px;">RÉGIMEN / VÍNCULO:</label>
            <select id="com-regimen" style="width:100%; padding:8px; border-radius:8px; border:1px solid #94A3B8; font-weight:700; font-size:0.82rem;">
              <option value="Carrera Fiscal">Carrera Fiscal</option>
              <option value="D.L. 728">D.L. N° 728</option>
              <option value="D.L. 276">D.L. N° 276</option>
              <option value="D.L. 1057 (CAS)">D.L. N° 1057 (CAS)</option>
              <option value="Locador / Proveedor de Servicios (Con TDR)">Locador / Proveedor</option>
              <option value="Escolta / Seguridad">Escolta / Seguridad</option>
            </select>
          </div>
        </div>

        <div style="background:#FAF6EE; border:1px solid #E6D5B8; border-radius:10px; padding:8px 10px; margin-bottom:10px; font-size:0.76rem;">
          <label style="display:flex; align-items:center; gap:8px; font-weight:800; color:#0B2545; margin-bottom:5px; cursor:pointer;">
            <input type="checkbox" id="com-sustenta-alojamiento" checked style="width:16px; height:16px; flex-shrink:0;" />
            <span>Sustentará Alojamiento (Si NO sustenta, descuenta S/ 80/día Nac. o S/ 40/día ADC)</span>
          </label>
          <label style="display:flex; align-items:center; gap:8px; font-weight:700; color:#78350F; cursor:pointer;">
            <input type="checkbox" id="com-es-escolta" style="width:16px; height:16px; flex-shrink:0;" />
            <span>¿Es Jefe de Escolta / Seguridad? (Deduce S/ 50.00/día alimentos D.S. 013-2013-EF)</span>
          </label>
        </div>

        <div class="dark-calc-panel" style="margin-bottom:12px; padding:10px;">
          <div class="calc-label-top" style="margin-bottom:6px;">OTRAS ASIGNACIONES ADICIONALES (S/ PEN)</div>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px;">
            <div>
              <label style="display:block; font-size:0.66rem; color:#CBD5E1; font-weight:800;">PASAJE TERRESTRE/FLUVIAL:</label>
              <input type="number" id="com-pasajes" value="0" min="0" step="5" style="width:100%; padding:7px; border-radius:7px; border:1px solid #D4AF37; background:#081C36; color:#FFF; font-weight:800;" />
            </div>
            <div>
              <label style="display:block; font-size:0.66rem; color:#CBD5E1; font-weight:800;">COMBUSTIBLE VEH. OFICIAL:</label>
              <input type="number" id="com-combustible" value="0" min="0" step="10" style="width:100%; padding:7px; border-radius:7px; border:1px solid #D4AF37; background:#081C36; color:#FFF; font-weight:800;" />
            </div>
            <div>
              <label style="display:block; font-size:0.66rem; color:#CBD5E1; font-weight:800;">PEAJES:</label>
              <input type="number" id="com-peajes" value="0" min="0" step="5" style="width:100%; padding:7px; border-radius:7px; border:1px solid #D4AF37; background:#081C36; color:#FFF; font-weight:800;" />
            </div>
            <div>
              <label style="display:block; font-size:0.66rem; color:#CBD5E1; font-weight:800;">OTROS (COCHERA):</label>
              <input type="number" id="com-otros" value="0" min="0" step="5" style="width:100%; padding:7px; border-radius:7px; border:1px solid #D4AF37; background:#081C36; color:#FFF; font-weight:800;" />
            </div>
          </div>
        </div>

        <button type="button" onclick="confirmarAgregarComisionado()" style="width:100%; background:#0B2545; color:#D4AF37; border:1.5px solid #D4AF37; border-radius:10px; padding:12px; font-size:0.88rem; font-weight:900; cursor:pointer;">
          ✓ Agregar Comisionado (Rendición inicialmente bloqueada 🔒)
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
    alert(`ℹ️ El usuario activo ${p.usuario_nombre} (DNI: ${p.usuario_dni}) ya está incluido en esta comisión.`);
    return;
  }

  window.VIATICOS_STATE.comisionados.push({
    id_temp: Date.now(),
    dni: p.usuario_dni || "45000001",
    nombres: p.usuario_nombre || "Usuario Operador ANC",
    cargo: "Especialista / Servidor ANC-MP",
    regimen: p.regimen_vinculo || "D.L. 728",
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
  const cargo = document.getElementById("com-cargo").value.trim() || "Especialista ANC-MP";
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

window.alSeleccionarRutaAnexo08 = function() {
  const sel = document.getElementById("viat-destino-select");
  if (sel && sel.value === "OTRO_DESTINO") {
    const nuevo = prompt("Ingrese la ciudad / provincia de destino:", "Huacho - Huaura");
    if (nuevo) {
      const opt = document.createElement("option");
      opt.value = nuevo;
      opt.textContent = nuevo;
      opt.selected = true;
      sel.insertBefore(opt, sel.lastElementChild);
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
    panelTiempo.innerHTML = `⏱️ Cómputo Normativo: <strong>${diffHoras.toFixed(1)}h</strong> viaje + <strong>${horasTerminal}h</strong> terminal = <strong>${totalHoras.toFixed(1)}h totales</strong> → Reconoce: <strong style="color:#D4AF37;">${diasViatico} día(s)</strong> y <strong>${horasFraccion} hora(s) fracción</strong>`;
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
    etiquetaEscala = esNiv1 ? "Nivel 1 (S/ 380/d)" : "Nivel 2 (S/ 320/d)";
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
    etiquetaEscala = esNivA ? "Nivel A ADC (S/ 150/d)" : "Nivel B ADC (S/ 130/d)";
    if (t.diasReconocidos >= 1) {
      movEmbarqueTotal = 20.00;
      movLocalTotal = 15.00 * t.diasReconocidos;
      subtotalViaticoDias = (tarifaDia * t.diasReconocidos) - movEmbarqueTotal - movLocalTotal;
    }
    subtotalViaticoHoras = Number((tarifaHora * t.horasFraccion).toFixed(2));
    if (!com.sustenta_alojamiento && t.diasReconocidos > 0) descuentoNoAloj = 40.00 * t.diasReconocidos;
  } else if (tipo === "SIN_VIATICOS_MISMO_DIA") {
    subtotalViaticoDias = t.totalHorasComputadas >= 8 ? 80.00 : (t.totalHorasComputadas >= 4 ? 40.00 : 0.00);
    etiquetaEscala = t.totalHorasComputadas >= 8 ? "Anexo 07 (>8h: S/ 80)" : "Anexo 07 (4-8h: S/ 40)";
    pctMaxDJ = 100;
  } else if (tipo === "INTERNACIONAL_USD") {
    const codZ = document.getElementById("viat-zona-ext")?.value || "AMS";
    const zObj = window.VIATICOS_CATALOGO.zonasInternacionales.find(z => z.codigo === codZ) || window.VIATICOS_CATALOGO.zonasInternacionales[0];
    const esAltaDir = com.nivel_escala === "NIVEL_1";
    const usdDia = esAltaDir ? zObj.c4_usd : zObj.c5_usd;
    const diasTotalesExt = Math.max(1, t.diasReconocidos) + zObj.dias_inst;
    subtotalViaticoDias = Number((usdDia * diasTotalesExt * tc).toFixed(2));
    etiquetaEscala = `${esAltaDir ? 'Cuadro 04' : 'Cuadro 05'} ($${usdDia} x ${diasTotalesExt}d)`;
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
    tbody.innerHTML = `<tr><td colspan="3" style="text-align:center; color:#64748B; padding:14px;">Toca <strong>"+ Incluirme"</strong> o <strong>"+ Agregar Comisionado"</strong> arriba para añadir integrantes.</td></tr>`;
  } else {
    tbody.innerHTML = lista.map((com, idx) => {
      const calc = calcularMontosIndividualComisionado(com);
      sumaGeneral += calc.totalRecibir;
      return `
        <tr>
          <td>
            <strong>#${idx + 1} ${com.nombres}</strong><br/>
            <small>DNI: ${com.dni} • ${com.cargo}</small><br/>
            <small style="color:#134074; font-weight:700;">📍 ${com.sede_comisionado || 'Sede ANC-MP'}</small><br/>
            <span class="badge-semaforo badge-verde" style="font-size:0.65rem; margin-top:2px;">${calc.etiquetaEscala}</span>
          </td>
          <td>
            <div style="font-size:0.74rem;">
              Viático: <strong>${window.fmtSoles(calc.netoViatico)}</strong><br/>
              Otras: <strong>${window.fmtSoles(calc.otrasAsignaciones)}</strong><br/>
              <strong style="font-size:0.86rem; color:#0B2545;">Total: ${window.fmtSoles(calc.totalRecibir)}</strong>
            </div>
          </td>
          <td>
            <div style="display:flex; flex-direction:column; gap:4px;">
              <button type="button" onclick="imprimirPlanillaIndividualEnCursoPDF(${idx})" style="background:#0B2545; color:#D4AF37; border:none; border-radius:6px; padding:5px 7px; font-size:0.7rem; font-weight:800; cursor:pointer;">
                🖨️ ${esAnexo07 ? 'Anexo 07' : 'Anexo 01'}
              </button>
              <button type="button" onclick="eliminarComisionadoViatico(${com.id_temp})" style="background:#FEE2E2; color:#991B1B; border:none; border-radius:6px; padding:4px 7px; font-size:0.68rem; font-weight:800; cursor:pointer;">
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
    <div style="background:${supera ? '#FEF2F2' : '#F2F9F6'}; border:1.5px solid ${supera ? '#EF4444' : '#10B981'}; border-radius:12px; padding:10px 12px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
      <div>
        <span style="font-size:0.74rem; font-weight:800; color:#334155;">TOTAL ACUMULADO DE LA COMISIÓN:</span>
        <strong style="font-size:1.12rem; color:#0B2545; margin-left:6px;">${window.fmtSoles(sumaGeneral)}</strong>
      </div>
      <span class="badge-semaforo ${supera ? 'badge-rojo' : 'badge-verde'}">
        ${supera ? `⚠️ > S/ 2,000 (Atención por Giro Tesorería)` : `✓ <= S/ 2,000 (Atendible por Caja Chica)`}
      </span>
    </div>
  `;
}

window.procesarYGuardarPlanillaViaticos = async function() {
  if (window.VIATICOS_STATE.comisionados.length === 0) {
    alert("⚠️ Debe agregar al menos un comisionado antes de guardar la comisión.");
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
    codigo_dependencia: p.codigo_dependencia,
    usuario_creador: p.usuario_nombre,
    usuario_creador_dni: p.usuario_dni,
    comisionados: comisionadosCalculados
  };

  window.VIATICOS_STATE.comisionesCreadas.unshift(registroCompleto);
  localStorage.setItem("anc_viaticos_local_v1", JSON.stringify(window.VIATICOS_STATE.comisionesCreadas));

  if (typeof window.actualizarCabeceraYMenu === "function") window.actualizarCabeceraYMenu();

  alert(`✅ Comisión ${payloadSolicitud.codigo_planilla} guardada con ${comisionadosCalculados.length} comisionado(s).\n\n📌 Nota: Cada comisionado inicia con su rendición bloqueada (🔒) hasta que Jefatura o el Administrador presione "🔓 Habilitar Rendición" en la tarjeta de la comisión.`);
  volverAListaComisionesViaticos();
};