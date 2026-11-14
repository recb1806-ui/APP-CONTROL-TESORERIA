// =========================================================================================
// ETAPA 3 (RENOVADA): GESTOR DE ESTADO, INTERFAZ CÁLIDA MÓVIL, PRIVACIDAD POR DNI, ROF,
// AUTOCOMPLETADO DE SERVIDORES Y CONTROL INTEGRAL DE APERTURA Y REPOSICIONES DE CAJA CHICA
// UE 012: AUTORIDAD NACIONAL DE CONTROL DEL MINISTERIO PÚBLICO (ANC-MP)
// =========================================================================================

window.ANC_STATE = {
  config: {
    id: 1,
    anio_fiscal: 2026,
    valor_uit: 5350.00,
    porcentaje_tope_caja_chica: 20.00,
    tope_viaticos_caja_chica: 2000.00,
    tipo_cambio_usd: 3.750,
    ruc_institucional: "20131370301",
    pin_administrador: "2026"
  },
  unidades: [],
  perfilActivo: {
    unidad_id: 13,
    codigo_dependencia: "AP-UAB",
    categoria_rof: "B.2 Órganos de Apoyo",
    nombre_dependencia: "Unidad de Abastecimiento",
    es_adc: false,
    sede_ubicacion: "Lima - Sede Central",
    presupuesto_caja_chica: 12000.00,
    saldo_caja_chica: 12000.00,
    presupuesto_viaticos: 8000.00,
    saldo_viaticos: 8000.00,
    usuario_nombre: "Usuario Operador ANC",
    usuario_dni: "45000001",
    usuario_cargo: "Especialista Administrativo",
    regimen_vinculo: "D.L. 728",
    percibe_gastos_operativos: false,
    rol_sistema: "OPERADOR" // 'OPERADOR', 'JEFATURA', 'ADMINISTRADOR'
  },
  fondoCajaUnica: {
    aperturada: false,
    apertura: null,
    reposiciones: [],
    movimientos: [],
    montoFijoApertura: 0.00,
    montoAperturaBienesServicios: 0.00,
    montoAperturaViaticos: 0.00,
    totalReposiciones: 0.00
  }
};

// Catálogo ROF de respaldo inmediato (R.J. N° 0413-2025-ANC-MP-J)
const ROF_FALLBACK = [
  { id: 1, codigo: "AD-JEF", categoria_rof: "A. Órganos de Alta Dirección", nombre_dependencia: "Jefatura Nacional de la ANC-MP", es_adc: false, sede_ubicacion: "Lima - Sede Central", presupuesto_caja_chica_mensual: 10000, saldo_caja_chica_actual: 10000, presupuesto_viaticos_mensual: 25000, saldo_viaticos_actual: 25000 },
  { id: 2, codigo: "AD-OCA", categoria_rof: "A. Órganos de Alta Dirección", nombre_dependencia: "Oficina Central Administrativa (OCA)", es_adc: false, sede_ubicacion: "Lima - Sede Central", presupuesto_caja_chica_mensual: 8000, saldo_caja_chica_actual: 8000, presupuesto_viaticos_mensual: 15000, saldo_viaticos_actual: 15000 },
  { id: 3, codigo: "AD-UCT", categoria_rof: "A. Órganos de Alta Dirección", nombre_dependencia: "Unidad de Cooperación Técnica", es_adc: false, sede_ubicacion: "Lima - Sede Central", presupuesto_caja_chica_mensual: 2500, saldo_caja_chica_actual: 2500, presupuesto_viaticos_mensual: 5000, saldo_viaticos_actual: 5000 },
  { id: 4, codigo: "AS-OAJ", categoria_rof: "B.1 Órganos de Asesoramiento", nombre_dependencia: "Oficina de Asesoría Jurídica", es_adc: false, sede_ubicacion: "Lima - Sede Central", presupuesto_caja_chica_mensual: 3000, saldo_caja_chica_actual: 3000, presupuesto_viaticos_mensual: 4000, saldo_viaticos_actual: 4000 },
  { id: 5, codigo: "AS-OPP", categoria_rof: "B.1 Órganos de Asesoramiento", nombre_dependencia: "Oficina de Planeamiento y Presupuesto", es_adc: false, sede_ubicacion: "Lima - Sede Central", presupuesto_caja_chica_mensual: 3500, saldo_caja_chica_actual: 3500, presupuesto_viaticos_mensual: 5000, saldo_viaticos_actual: 5000 },
  { id: 6, codigo: "AS-UPM", categoria_rof: "B.1 Órganos de Asesoramiento", nombre_dependencia: "Unidad de Planeamiento y Modernización", es_adc: false, sede_ubicacion: "Lima - Sede Central", presupuesto_caja_chica_mensual: 2000, saldo_caja_chica_actual: 2000, presupuesto_viaticos_mensual: 3000, saldo_viaticos_actual: 3000 },
  { id: 7, codigo: "AS-UPR", categoria_rof: "B.1 Órganos de Asesoramiento", nombre_dependencia: "Unidad de Presupuesto", es_adc: false, sede_ubicacion: "Lima - Sede Central", presupuesto_caja_chica_mensual: 2000, saldo_caja_chica_actual: 2000, presupuesto_viaticos_mensual: 3000, saldo_viaticos_actual: 3000 },
  { id: 8, codigo: "AP-OGRH", categoria_rof: "B.2 Órganos de Apoyo", nombre_dependencia: "Oficina de Gestión de Recursos Humanos", es_adc: false, sede_ubicacion: "Lima - Sede Central", presupuesto_caja_chica_mensual: 4000, saldo_caja_chica_actual: 4000, presupuesto_viaticos_mensual: 4000, saldo_viaticos_actual: 4000 },
  { id: 9, codigo: "AP-UARH", categoria_rof: "B.2 Órganos de Apoyo", nombre_dependencia: "Unidad de Administración de Recursos Humanos", es_adc: false, sede_ubicacion: "Lima - Sede Central", presupuesto_caja_chica_mensual: 2500, saldo_caja_chica_actual: 2500, presupuesto_viaticos_mensual: 2500, saldo_viaticos_actual: 2500 },
  { id: 10, codigo: "AP-URPB", categoria_rof: "B.2 Órganos de Apoyo", nombre_dependencia: "Unidad de Remuneraciones, Pensiones y Beneficios", es_adc: false, sede_ubicacion: "Lima - Sede Central", presupuesto_caja_chica_mensual: 2000, saldo_caja_chica_actual: 2000, presupuesto_viaticos_mensual: 2000, saldo_viaticos_actual: 2000 },
  { id: 11, codigo: "AP-UBDH", categoria_rof: "B.2 Órganos de Apoyo", nombre_dependencia: "Unidad de Bienestar y Desarrollo Humano", es_adc: false, sede_ubicacion: "Lima - Sede Central", presupuesto_caja_chica_mensual: 3000, saldo_caja_chica_actual: 3000, presupuesto_viaticos_mensual: 2500, saldo_viaticos_actual: 2500 },
  { id: 12, codigo: "AP-OAF", categoria_rof: "B.2 Órganos de Apoyo", nombre_dependencia: "Oficina de Administración y Finanzas", es_adc: false, sede_ubicacion: "Lima - Sede Central", presupuesto_caja_chica_mensual: 15000, saldo_caja_chica_actual: 15000, presupuesto_viaticos_mensual: 12000, saldo_viaticos_actual: 12000 },
  { id: 13, codigo: "AP-UAB", categoria_rof: "B.2 Órganos de Apoyo", nombre_dependencia: "Unidad de Abastecimiento", es_adc: false, sede_ubicacion: "Lima - Sede Central", presupuesto_caja_chica_mensual: 12000, saldo_caja_chica_actual: 12000, presupuesto_viaticos_mensual: 8000, saldo_viaticos_actual: 8000 },
  { id: 14, codigo: "AP-UCO", categoria_rof: "B.2 Órganos de Apoyo", nombre_dependencia: "Unidad de Contabilidad", es_adc: false, sede_ubicacion: "Lima - Sede Central", presupuesto_caja_chica_mensual: 4000, saldo_caja_chica_actual: 4000, presupuesto_viaticos_mensual: 4000, saldo_viaticos_actual: 4000 },
  { id: 15, codigo: "AP-UTE", categoria_rof: "B.2 Órganos de Apoyo", nombre_dependencia: "Unidad de Tesorería (Custodia Caja Chica Sede Central)", es_adc: false, sede_ubicacion: "Lima - Sede Central", presupuesto_caja_chica_mensual: 25000, saldo_caja_chica_actual: 25000, presupuesto_viaticos_mensual: 30000, saldo_viaticos_actual: 30000 },
  { id: 16, codigo: "AP-OTI", categoria_rof: "B.2 Órganos de Apoyo", nombre_dependencia: "Oficina de Tecnologías de la Información", es_adc: false, sede_ubicacion: "Lima - Sede Central", presupuesto_caja_chica_mensual: 6000, saldo_caja_chica_actual: 6000, presupuesto_viaticos_mensual: 8000, saldo_viaticos_actual: 8000 },
  { id: 17, codigo: "AP-USIS", categoria_rof: "B.2 Órganos de Apoyo", nombre_dependencia: "Unidad de Sistemas", es_adc: false, sede_ubicacion: "Lima - Sede Central", presupuesto_caja_chica_mensual: 3000, saldo_caja_chica_actual: 3000, presupuesto_viaticos_mensual: 4000, saldo_viaticos_actual: 4000 },
  { id: 18, codigo: "AP-USRE", categoria_rof: "B.2 Órganos de Apoyo", nombre_dependencia: "Unidad de Soporte y Redes", es_adc: false, sede_ubicacion: "Lima - Sede Central", presupuesto_caja_chica_mensual: 4500, saldo_caja_chica_actual: 4500, presupuesto_viaticos_mensual: 6000, saldo_viaticos_actual: 6000 },
  { id: 19, codigo: "AP-OGDAC", categoria_rof: "B.2 Órganos de Apoyo", nombre_dependencia: "Oficina de Gestión Documental y Atención al Ciudadano", es_adc: false, sede_ubicacion: "Lima - Sede Central", presupuesto_caja_chica_mensual: 4000, saldo_caja_chica_actual: 4000, presupuesto_viaticos_mensual: 3500, saldo_viaticos_actual: 3500 },
  { id: 20, codigo: "AP-UMP", categoria_rof: "B.2 Órganos de Apoyo", nombre_dependencia: "Unidad de Mesa de Partes", es_adc: false, sede_ubicacion: "Lima - Sede Central", presupuesto_caja_chica_mensual: 2000, saldo_caja_chica_actual: 2000, presupuesto_viaticos_mensual: 1500, saldo_viaticos_actual: 1500 },
  { id: 21, codigo: "AP-UAC", categoria_rof: "B.2 Órganos de Apoyo", nombre_dependencia: "Unidad de Atención al Ciudadano", es_adc: false, sede_ubicacion: "Lima - Sede Central", presupuesto_caja_chica_mensual: 2000, saldo_caja_chica_actual: 2000, presupuesto_viaticos_mensual: 1500, saldo_viaticos_actual: 1500 },
  { id: 22, codigo: "AP-UNOT", categoria_rof: "B.2 Órganos de Apoyo", nombre_dependencia: "Unidad de Notificaciones", es_adc: false, sede_ubicacion: "Lima - Sede Central", presupuesto_caja_chica_mensual: 4500, saldo_caja_chica_actual: 4500, presupuesto_viaticos_mensual: 3000, saldo_viaticos_actual: 3000 },
  { id: 23, codigo: "AP-UARC", categoria_rof: "B.2 Órganos de Apoyo", nombre_dependencia: "Unidad de Archivo Central", es_adc: false, sede_ubicacion: "Lima - Sede Central", presupuesto_caja_chica_mensual: 2500, saldo_caja_chica_actual: 2500, presupuesto_viaticos_mensual: 2000, saldo_viaticos_actual: 2000 },
  { id: 24, codigo: "AP-OCSII", categoria_rof: "B.2 Órganos de Apoyo", nombre_dependencia: "Oficina de Comunicación Social e Imagen Institucional", es_adc: false, sede_ubicacion: "Lima - Sede Central", presupuesto_caja_chica_mensual: 5000, saldo_caja_chica_actual: 5000, presupuesto_viaticos_mensual: 6000, saldo_viaticos_actual: 6000 },
  { id: 25, codigo: "AP-UACD", categoria_rof: "B.2 Órganos de Apoyo", nombre_dependencia: "Unidad de Audiovisuales y Comunicación Digital", es_adc: false, sede_ubicacion: "Lima - Sede Central", presupuesto_caja_chica_mensual: 3000, saldo_caja_chica_actual: 3000, presupuesto_viaticos_mensual: 4000, saldo_viaticos_actual: 4000 },
  { id: 26, codigo: "AP-UPRP", categoria_rof: "B.2 Órganos de Apoyo", nombre_dependencia: "Unidad de Prensa, Protocolo y Relaciones Públicas", es_adc: false, sede_ubicacion: "Lima - Sede Central", presupuesto_caja_chica_mensual: 3000, saldo_caja_chica_actual: 3000, presupuesto_viaticos_mensual: 4000, saldo_viaticos_actual: 4000 },
  { id: 27, codigo: "LI-DGGF", categoria_rof: "C. Órganos de Línea", nombre_dependencia: "Dirección General de Gestión Funcional", es_adc: false, sede_ubicacion: "Lima - Sede Central", presupuesto_caja_chica_mensual: 6000, saldo_caja_chica_actual: 6000, presupuesto_viaticos_mensual: 18000, saldo_viaticos_actual: 18000 },
  { id: 28, codigo: "LI-DPRE", categoria_rof: "C. Órganos de Línea", nombre_dependencia: "Dirección de Prevención", es_adc: false, sede_ubicacion: "Lima - Sede Central", presupuesto_caja_chica_mensual: 4500, saldo_caja_chica_actual: 4500, presupuesto_viaticos_mensual: 15000, saldo_viaticos_actual: 15000 },
  { id: 29, codigo: "LI-DFCA", categoria_rof: "C. Órganos de Línea", nombre_dependencia: "Dirección de Fortalecimiento de Capacidades", es_adc: false, sede_ubicacion: "Lima - Sede Central", presupuesto_caja_chica_mensual: 4000, saldo_caja_chica_actual: 4000, presupuesto_viaticos_mensual: 10000, saldo_viaticos_actual: 10000 },
  { id: 30, codigo: "LI-DSCIA", categoria_rof: "C. Órganos de Línea", nombre_dependencia: "Dirección de Supervisión de Concursos e Investigación y Análisis", es_adc: false, sede_ubicacion: "Lima - Sede Central", presupuesto_caja_chica_mensual: 4000, saldo_caja_chica_actual: 4000, presupuesto_viaticos_mensual: 10000, saldo_viaticos_actual: 10000 },
  { id: 31, codigo: "LI-DGPAD", categoria_rof: "C. Órganos de Línea", nombre_dependencia: "Dirección General de Procedimiento Administrativo Disciplinario", es_adc: false, sede_ubicacion: "Lima - Sede Central", presupuesto_caja_chica_mensual: 6000, saldo_caja_chica_actual: 6000, presupuesto_viaticos_mensual: 20000, saldo_viaticos_actual: 20000 },
  { id: 32, codigo: "LI-DIPR", categoria_rof: "C. Órganos de Línea", nombre_dependencia: "Dirección de Investigación Preliminar", es_adc: false, sede_ubicacion: "Lima - Sede Central", presupuesto_caja_chica_mensual: 5000, saldo_caja_chica_actual: 5000, presupuesto_viaticos_mensual: 18000, saldo_viaticos_actual: 18000 },
  { id: 33, codigo: "LI-DPDI", categoria_rof: "C. Órganos de Línea", nombre_dependencia: "Dirección de Procedimiento Disciplinario", es_adc: false, sede_ubicacion: "Lima - Sede Central", presupuesto_caja_chica_mensual: 4500, saldo_caja_chica_actual: 4500, presupuesto_viaticos_mensual: 12000, saldo_viaticos_actual: 12000 },
  { id: 34, codigo: "LI-DSAN", categoria_rof: "C. Órganos de Línea", nombre_dependencia: "Dirección de Sanción", es_adc: false, sede_ubicacion: "Lima - Sede Central", presupuesto_caja_chica_mensual: 4000, saldo_caja_chica_actual: 4000, presupuesto_viaticos_mensual: 8000, saldo_viaticos_actual: 8000 },
  { id: 35, codigo: "LI-DGAP", categoria_rof: "C. Órganos de Línea", nombre_dependencia: "Dirección General de Apelaciones", es_adc: false, sede_ubicacion: "Lima - Sede Central", presupuesto_caja_chica_mensual: 4500, saldo_caja_chica_actual: 4500, presupuesto_viaticos_mensual: 8000, saldo_viaticos_actual: 8000 },
  { id: 36, codigo: "ADC-AREQ", categoria_rof: "D. Órganos Desconcentrados (ADC)", nombre_dependencia: "ADC Arequipa (Jefatura y Unidades de Control)", es_adc: true, sede_ubicacion: "Arequipa", presupuesto_caja_chica_mensual: 6500, saldo_caja_chica_actual: 6500, presupuesto_viaticos_mensual: 12000, saldo_viaticos_actual: 12000 },
  { id: 37, codigo: "ADC-CUSC", categoria_rof: "D. Órganos Desconcentrados (ADC)", nombre_dependencia: "ADC Cusco (Jefatura y Unidades de Control)", es_adc: true, sede_ubicacion: "Cusco", presupuesto_caja_chica_mensual: 6000, saldo_caja_chica_actual: 6000, presupuesto_viaticos_mensual: 11000, saldo_viaticos_actual: 11000 },
  { id: 38, codigo: "ADC-LALI", categoria_rof: "D. Órganos Desconcentrados (ADC)", nombre_dependencia: "ADC La Libertad (Jefatura y Unidades de Control)", es_adc: true, sede_ubicacion: "Trujillo", presupuesto_caja_chica_mensual: 6500, saldo_caja_chica_actual: 6500, presupuesto_viaticos_mensual: 11500, saldo_viaticos_actual: 11500 },
  { id: 39, codigo: "ADC-LAMB", categoria_rof: "D. Órganos Desconcentrados (ADC)", nombre_dependencia: "ADC Lambayeque (Jefatura y Unidades de Control)", es_adc: true, sede_ubicacion: "Chiclayo", presupuesto_caja_chica_mensual: 6000, saldo_caja_chica_actual: 6000, presupuesto_viaticos_mensual: 11000, saldo_viaticos_actual: 11000 },
  { id: 40, codigo: "ADC-LIMC", categoria_rof: "D. Órganos Desconcentrados (ADC)", nombre_dependencia: "ADC Lima Centro (Jefatura y Unidades de Control)", es_adc: true, sede_ubicacion: "Lima Centro", presupuesto_caja_chica_mensual: 8000, saldo_caja_chica_actual: 8000, presupuesto_viaticos_mensual: 8000, saldo_viaticos_actual: 8000 }
];

// Formateador de moneda PEN
window.fmtSoles = function(monto) {
  return "S/ " + Number(monto || 0).toLocaleString("es-PE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

// =========================================================================================
// GARANTÍA DE CARGA DE servidores_anc.js Y CONECTOR SEGURO DE AUTOCOMPLETADO PREDICTIVO
// =========================================================================================
window.asegurarCargaServidoresANC = function(callback) {
  if (typeof window.vincularAutocompletadoServidor === "function") {
    if (typeof callback === "function") callback();
    return;
  }
  let scriptExistente = document.querySelector('script[src*="servidores_anc.js"]');
  if (!scriptExistente) {
    scriptExistente = document.createElement("script");
    scriptExistente.src = "./servidores_anc.js";
    scriptExistente.onload = () => {
      if (typeof callback === "function") callback();
    };
    document.head.appendChild(scriptExistente);
  } else {
    setTimeout(() => {
      if (typeof window.vincularAutocompletadoServidor === "function" && typeof callback === "function") {
        callback();
      }
    }, 250);
  }
};

window.conectarAutocompletadoServidorSeguro = function(inputId, callbackSeleccion) {
  window.asegurarCargaServidoresANC(() => {
    const el = document.getElementById(inputId);
    if (el && typeof window.vincularAutocompletadoServidor === "function") {
      window.vincularAutocompletadoServidor(inputId, callbackSeleccion);
    }
  });
};

// =========================================================================================
// FUNCIONES DE SEGURIDAD, PRIVACIDAD POR USUARIO (DNI) Y ROLES (JEFATURA / ADMINISTRADOR)
// =========================================================================================

window.esAdministradorActivo = function() {
  return window.ANC_STATE?.perfilActivo?.rol_sistema === "ADMINISTRADOR";
};

window.puedeHabilitarRendicion = function() {
  const rol = window.ANC_STATE?.perfilActivo?.rol_sistema || "OPERADOR";
  const cod = window.ANC_STATE?.perfilActivo?.codigo_dependencia || "";
  return rol === "ADMINISTRADOR" || rol === "JEFATURA" || cod === "AD-JEF" || cod === "AD-OCA";
};

window.validarPinJefaturaOAdmin = function(accionDesc = "autorizar esta gestión") {
  if (window.puedeHabilitarRendicion()) return true;
  const pin = prompt(`🔐 Se requiere autorización de JEFATURA o ADMINISTRACIÓN para ${accionDesc}.\nPor favor, ingresa la clave institucional:`, "");
  if (pin !== null && String(pin).trim() === String(window.ANC_STATE?.config?.pin_administrador || "2026")) {
    return true;
  }
  alert("❌ Clave incorrecta o acción cancelada.");
  return false;
};

window.validarPinExclusivoAdministrador = function(accionDesc = "registrar esta operación de Tesorería / Caja Chica") {
  if (window.esAdministradorActivo()) return true;
  const pin = prompt(`🔐 Acción exclusiva del ADMINISTRADOR para ${accionDesc}.\nIngresa la clave de Administración:`, "");
  if (pin !== null && String(pin).trim() === String(window.ANC_STATE?.config?.pin_administrador || "2026")) {
    return true;
  }
  alert("❌ Clave de Administrador incorrecta o acción cancelada.");
  return false;
};

window.esRegistroDelUsuarioActivo = function(item) {
  if (!item) return false;
  if (window.esAdministradorActivo()) return true;

  const p = window.ANC_STATE?.perfilActivo || {};
  const miDni = String(p.usuario_dni || "").trim().toLowerCase();
  const miNombre = String(p.usuario_nombre || "").trim().toLowerCase();

  const regDniUsuario = String(item.usuario_dni_registro || item.dni_beneficiario || "").trim().toLowerCase();
  const regUsuario = String(item.usuario_registro || item.nombre_beneficiario || "").trim().toLowerCase();
  const regDniRuc = String(item.ruc_dni_proveedor || "").trim().toLowerCase();

  if (miDni && (regDniUsuario === miDni || regDniRuc === miDni || regUsuario.includes(miDni))) {
    return true;
  }
  if (miNombre && regUsuario && regUsuario === miNombre) {
    return true;
  }

  const creadorDni = String(item.usuario_creador_dni || "").trim().toLowerCase();
  const creadorNom = String(item.usuario_creador || "").trim().toLowerCase();

  if (miDni && creadorDni === miDni) return true;
  if (miNombre && creadorNom && creadorNom === miNombre) return true;

  if (p.rol_sistema === "JEFATURA" && (Number(item.unidad_organica_id) === Number(p.unidad_id) || item.codigo_dependencia === p.codigo_dependencia)) {
    return true;
  }

  if (Array.isArray(item.comisionados)) {
    const estaIncluido = item.comisionados.some(c => {
      const cDni = String(c?.com?.dni || c?.dni_comisionado || "").trim().toLowerCase();
      const cNom = String(c?.com?.nombres || c?.apellidos_nombres || "").trim().toLowerCase();
      return (miDni && cDni === miDni) || (miNombre && cNom === miNombre);
    });
    if (estaIncluido) return true;
  }

  return false;
};

// =========================================================================================
// INYECCIÓN AUTOMÁTICA DE ESTILOS CÁLIDOS, SCROLL DEL DRAWER Y ENCUADRE MÓVIL
// =========================================================================================
function aplicarParcheVisualInstitucionalANC() {
  if (document.getElementById("anc-style-patch-v3-warm")) return;

  const styleEl = document.createElement("style");
  styleEl.id = "anc-style-patch-v3-warm";
  styleEl.textContent = `
    :root {
      --anc-navy: #0F172A;
      --anc-blue-soft: #1E293B;
      --anc-gold: #F59E0B;
      --anc-gold-warm: #FBBF24;
      --anc-bg-warm: #FAF8F5;
      --anc-card-border: #E2E8F0;
    }
    html, body {
      max-width: 100vw !important;
      overflow-x: hidden !important;
      background-color: var(--anc-bg-warm) !important;
      color: #0F172A !important;
      font-family: 'Nunito', 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif !important;
    }
    body.drawer-open {
      overflow: hidden !important;
      height: 100vh !important;
      touch-action: none !important;
    }
    .app-drawer {
      position: fixed !important;
      top: 0 !important;
      left: 0 !important;
      height: 100vh !important;
      height: 100dvh !important;
      max-height: 100dvh !important;
      overflow-y: auto !important;
      overflow-x: hidden !important;
      -webkit-overflow-scrolling: touch !important;
      overscroll-behavior: contain !important;
      touch-action: pan-y !important;
      z-index: 999 !important;
    }
    .drawer-header, .drawer-accordion {
      flex-shrink: 0 !important;
    }
    h1, h2, h3, h4, .card-title, .welcome-heading, .header-view-title, .modal-title, .drawer-panel-title {
      font-family: 'Plus Jakarta Sans', 'Nunito', sans-serif !important;
      letter-spacing: -0.015em !important;
    }
    input, select, textarea, button {
      font-family: 'Nunito', 'Plus Jakarta Sans', sans-serif !important;
      max-width: 100% !important;
      min-width: 0 !important;
      box-sizing: border-box !important;
    }
    .app-header {
      background: linear-gradient(135deg, #FBBF24 0%, #F59E0B 100%) !important;
      color: #0F172A !important;
      padding: 10px 14px !important;
      min-height: 66px !important;
      max-height: none !important;
      border-bottom: 2px solid #D97706 !important;
      box-shadow: 0 4px 16px rgba(245, 158, 11, 0.20) !important;
    }
    .header-view-title {
      color: #0F172A !important;
      font-weight: 800 !important;
    }
    .header-subtitle {
      color: #1E293B !important;
      font-weight: 700 !important;
    }
    .btn-header-square {
      border-radius: 12px !important;
      border: 1.5px solid rgba(15, 23, 42, 0.18) !important;
      background-color: rgba(255, 255, 255, 0.48) !important;
      color: #0F172A !important;
    }
    .btn-header-square.active-home {
      background-color: #0F172A !important;
      color: #FBBF24 !important;
      border-color: #0F172A !important;
    }
    .main-container {
      width: 100% !important;
      max-width: 540px !important;
      margin: 0 auto !important;
      padding: 16px 12px 44px 12px !important;
      overflow-x: hidden !important;
    }
    .content-surface-card {
      padding: 16px 14px !important;
      border-radius: 24px !important;
      border: 1.5px solid var(--anc-card-border) !important;
      box-shadow: 0 6px 18px rgba(15, 23, 42, 0.05) !important;
      overflow-x: hidden !important;
      max-width: 100% !important;
    }
  `;
  document.head.appendChild(styleEl);
}

// =========================================================================================
// CONTROL DEL FONDO ÚNICO DE CAJA CHICA SEDE CENTRAL: APERTURA INICIAL Y REPOSICIONES
// Enlazado a la tabla anc_caja_movimientos_fondo de Supabase
// =========================================================================================

window.sincronizarMovimientosFondoCaja = async function() {
  let movsLocal = [];
  try {
    movsLocal = JSON.parse(localStorage.getItem("anc_caja_movimientos_fondo_v1") || "[]");
  } catch (e) {
    movsLocal = [];
  }

  const res = await window.SupabaseANC.request("anc_caja_movimientos_fondo", "GET", "order=id.asc&limit=200");
  let listaMovs = [];

  if (res.data && Array.isArray(res.data) && res.data.length > 0) {
    listaMovs = res.data.map(m => {
      const matchL = movsLocal.find(l => Number(l.id) === Number(m.id) || (l.tipo_movimiento === m.tipo_movimiento && l.nro_resolucion_apertura === m.nro_resolucion_apertura && l.nro_rendicion_anexo13 === m.nro_rendicion_anexo13));
      return {
        ...matchL,
        ...m,
        monto_movimiento: Number(m.monto_movimiento || m.monto_total || m.monto_apertura || m.monto || matchL?.monto_movimiento || 0),
        monto_bienes_servicios: Number(m.monto_bienes_servicios || matchL?.monto_bienes_servicios || 0),
        monto_viaticos: Number(m.monto_viaticos || matchL?.monto_viaticos || 0),
        fecha_movimiento: m.fecha_movimiento || m.fecha || matchL?.fecha_movimiento || new Date().toISOString().slice(0, 10),
        nro_resolucion_apertura: m.nro_resolucion_apertura || m.nro_documento || matchL?.nro_resolucion_apertura || "",
        nro_rendicion_anexo13: m.nro_rendicion_anexo13 || matchL?.nro_rendicion_anexo13 || "",
        nro_cp_siaf_ope: m.nro_cp_siaf_ope || m.nro_comprobante_pago || matchL?.nro_cp_siaf_ope || "",
        responsable_dni: m.responsable_dni || m.dni_responsable || matchL?.responsable_dni || "",
        responsable_nombre: m.responsable_nombre || m.nombre_responsable || matchL?.responsable_nombre || "",
        responsable_cargo: m.responsable_cargo || m.cargo_responsable || matchL?.responsable_cargo || ""
      };
    });
    localStorage.setItem("anc_caja_movimientos_fondo_v1", JSON.stringify(listaMovs));
  } else {
    listaMovs = movsLocal;
  }

  procesarEstadoFondoCajaUnica(listaMovs);
};

function procesarEstadoFondoCajaUnica(listaMovs) {
  const aperturas = (listaMovs || []).filter(m => m.tipo_movimiento === "APERTURA_INICIAL");
  const ultimaApertura = aperturas.length > 0 ? aperturas[aperturas.length - 1] : null;
  const reposiciones = (listaMovs || []).filter(m => m.tipo_movimiento === "REPOSICION");

  const montoFijo = ultimaApertura ? Number(ultimaApertura.monto_movimiento || 0) : 0;
  const montoBS = ultimaApertura ? Number(ultimaApertura.monto_bienes_servicios || 0) : 0;
  const montoViat = ultimaApertura ? Number(ultimaApertura.monto_viaticos || 0) : 0;
  const totalRep = reposiciones.reduce((acc, r) => acc + Number(r.monto_movimiento || 0), 0);

  window.ANC_STATE.fondoCajaUnica = {
    aperturada: Boolean(ultimaApertura && montoFijo > 0),
    apertura: ultimaApertura,
    reposiciones: reposiciones,
    movimientos: listaMovs || [],
    montoFijoApertura: Number(montoFijo.toFixed(2)),
    montoAperturaBienesServicios: Number(montoBS.toFixed(2)),
    montoAperturaViaticos: Number(montoViat.toFixed(2)),
    totalReposiciones: Number(totalRep.toFixed(2))
  };

  if (window.ANC_STATE.fondoCajaUnica.aperturada) {
    const resumen = window.obtenerResumenCicloCajaUnica();
    window.ANC_STATE.perfilActivo.presupuesto_caja_chica = resumen.montoFijoApertura;
    window.ANC_STATE.perfilActivo.saldo_caja_chica = resumen.efectivoDisponibleActual;
  }
}

window.estaCajaChicaAperturada = function() {
  return Boolean(window.ANC_STATE?.fondoCajaUnica?.aperturada && Number(window.ANC_STATE?.fondoCajaUnica?.montoFijoApertura || 0) > 0);
};

// Calcula la ecuación exacta del ciclo actual de la Caja Chica Única de Sede Central
window.obtenerResumenCicloCajaUnica = function() {
  const f = window.ANC_STATE?.fondoCajaUnica || {};
  const montoFijoApertura = Number(f.montoFijoApertura || 0);

  let gastos = [];
  if (window.CAJA_STATE && Array.isArray(window.CAJA_STATE.gastosRegistrados) && window.CAJA_STATE.gastosRegistrados.length > 0) {
    gastos = window.CAJA_STATE.gastosRegistrados;
  } else {
    try {
      gastos = JSON.parse(localStorage.getItem("anc_gastos_caja_local_v1") || "[]");
    } catch (e) {
      gastos = [];
    }
  }

  let valesArqueo = [];
  try {
    valesArqueo = JSON.parse(localStorage.getItem("anc_arqueo_vales_prov_v1") || "[]");
  } catch (e) {
    valesArqueo = [];
  }

  // Filtrar los comprobantes que pertenecen al ciclo actual ('EN_CUSTODIA_ACTUAL' o sin etiqueta de histórico)
  const gastosEnCicloActual = gastos.filter(g => {
    if (g.modalidad_fondo === "ENCARGO") return false;
    if (g.estado_auditoria === "OBSERVADO") return false;
    const ciclo = g.estado_ciclo_caja || "EN_CUSTODIA_ACTUAL";
    return ciclo === "EN_CUSTODIA_ACTUAL";
  });

  const comprobantesPagadosCiclo = gastosEnCicloActual.filter(g => {
    const esVale = g.modalidad_fondo === "VALE_PROVISIONAL" || (g.tipo_comprobante && g.tipo_comprobante.toUpperCase().includes("VALE"));
    return !esVale;
  });

  const valesEnGastos = gastosEnCicloActual.filter(g => {
    const esVale = g.modalidad_fondo === "VALE_PROVISIONAL" || (g.tipo_comprobante && g.tipo_comprobante.toUpperCase().includes("VALE"));
    return esVale;
  });

  // Unificar vales provisionales vigentes sin duplicar por número de vale
  const mapaVales = new Map();
  valesEnGastos.forEach(vg => {
    const num = vg.serie_numero_comprobante || `VP-${vg.id}`;
    mapaVales.set(num, Number(vg.monto_total_soles || 0));
  });
  valesArqueo.forEach(va => {
    const num = va.numero_vale || `VP-${va.id}`;
    if (!mapaVales.has(num)) {
      mapaVales.set(num, Number(va.importe || 0));
    }
  });

  const montoComprobantesCustodia = Number(comprobantesPagadosCiclo.reduce((a, b) => a + Number(b.monto_total_soles || 0), 0).toFixed(2));
  let montoValesVigentes = 0;
  mapaVales.forEach(v => { montoValesVigentes += v; });
  montoValesVigentes = Number(montoValesVigentes.toFixed(2));

  const totalSustentadoCiclo = Number((montoComprobantesCustodia + montoValesVigentes).toFixed(2));
  const efectivoDisponibleActual = f.aperturada
    ? Math.max(0, Number((montoFijoApertura - totalSustentadoCiclo).toFixed(2)))
    : 0.00;

  const gastosHistoricosRepuestos = gastos.filter(g => g.estado_ciclo_caja === "REPUESTO_HISTORICO");

  return {
    aperturada: Boolean(f.aperturada),
    apertura: f.apertura,
    reposiciones: f.reposiciones || [],
    montoFijoApertura,
    montoAperturaBienesServicios: Number(f.montoAperturaBienesServicios || 0),
    montoAperturaViaticos: Number(f.montoAperturaViaticos || 0),
    totalReposiciones: Number(f.totalReposiciones || 0),
    comprobantesPagadosCiclo,
    montoComprobantesCustodia,
    montoValesVigentes,
    totalSustentadoCiclo,
    efectivoDisponibleActual,
    gastosHistoricosRepuestos
  };
};

// Inserción resiliente en anc_caja_movimientos_fondo de Supabase
async function guardarMovimientoFondoEnSupabase(mov) {
  const payloadCompleto = {
    anio_fiscal: mov.anio_fiscal,
    tipo_movimiento: mov.tipo_movimiento,
    fecha_movimiento: mov.fecha_movimiento,
    nro_resolucion_apertura: mov.nro_resolucion_apertura || null,
    nro_rendicion_anexo13: mov.nro_rendicion_anexo13 || null,
    nro_cp_siaf_ope: mov.nro_cp_siaf_ope || null,
    monto_movimiento: mov.monto_movimiento,
    monto_bienes_servicios: mov.monto_bienes_servicios || 0,
    monto_viaticos: mov.monto_viaticos || 0,
    responsable_dni: mov.responsable_dni,
    responsable_nombre: mov.responsable_nombre,
    responsable_cargo: mov.responsable_cargo || "Encargado Único de Caja Chica",
    codigo_dependencia: mov.codigo_dependencia || "AP-UTE",
    observaciones: mov.observaciones || null
  };

  let res = await window.SupabaseANC.request("anc_caja_movimientos_fondo", "POST", "", payloadCompleto);
  if (res.error) {
    // Reintento con columnas esenciales en caso de variación en el esquema SQL
    const payloadAlternativo = {
      anio_fiscal: mov.anio_fiscal,
      tipo_movimiento: mov.tipo_movimiento,
      fecha_movimiento: mov.fecha_movimiento,
      monto_movimiento: mov.monto_movimiento,
      responsable_dni: mov.responsable_dni,
      responsable_nombre: mov.responsable_nombre
    };
    res = await window.SupabaseANC.request("anc_caja_movimientos_fondo", "POST", "", payloadAlternativo);
  }
  return res;
}

// Genera la tarjeta interactiva "🏦 Control de Apertura Inicial y Reposiciones de Caja Chica"
window.generarHTMLControlAperturaYReposiciones = function(prefijoId = "cfg") {
  const r = window.obtenerResumenCicloCajaUnica();
  const hoyISO = new Date().toISOString().slice(0, 10);
  const ap = r.apertura || {};
  const esAdmin = window.esAdministradorActivo();

  const montoDefBS = r.aperturada ? r.montoAperturaBienesServicios : 20000.00;
  const montoDefViat = r.aperturada ? r.montoAperturaViaticos : 5000.00;
  const montoDefTotal = r.aperturada ? r.montoFijoApertura : 25000.00;

  return `
    <div style="background:#FFFDF5; border:2px solid #F59E0B; border-radius:20px; padding:14px; margin-bottom:16px; box-shadow:0 4px 14px rgba(245,158,11,0.08);">
      <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:8px; margin-bottom:10px;">
        <div>
          <h3 style="font-size:0.96rem; font-weight:800; color:#0F172A;">
            🏦 Control de Apertura Inicial y Reposiciones de Caja Chica
          </h3>
          <p style="font-size:0.75rem; color:#475569; font-weight:600; margin-top:2px;">
            Fondo Único de Sede Central ANC-MP (Directiva de Caja Chica V.08 • Tabla <code>anc_caja_movimientos_fondo</code>)
          </p>
        </div>
        <span class="badge-semaforo ${r.aperturada ? 'badge-verde' : 'badge-rojo'}">
          ${r.aperturada ? `✓ CAJA APERTURADA (${window.fmtSoles(r.montoFijoApertura)})` : `🔒 PENDIENTE DE APERTURA INICIAL`}
        </span>
      </div>

      <!-- ECUACIÓN EN VIVO DEL FONDO ÚNICO DE CAJA CHICA -->
      <div style="background:linear-gradient(145deg, #0F172A 0%, #1E293B 100%); color:#FFFFFF; border:1.5px solid #FBBF24; border-radius:16px; padding:12px; margin-bottom:12px; font-size:0.76rem;">
        <div style="font-weight:800; color:#FBBF24; margin-bottom:8px; text-transform:uppercase; letter-spacing:0.02em;">
          📊 Estado del Ciclo Actual del Fondo Fijo (${ap.nro_resolucion_apertura || 'Sin Resolución de Apertura'})
        </div>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px;">
          <div style="background:rgba(255,255,255,0.08); padding:8px 10px; border-radius:10px;">
            <span style="color:#CBD5E1; font-size:0.68rem; font-weight:700;">1. MONTO FIJO APERTURA (X):</span><br/>
            <strong style="font-size:0.96rem; color:#FBBF24;">${window.fmtSoles(r.montoFijoApertura)}</strong>
            <div style="font-size:0.65rem; color:#94A3B8; margin-top:2px;">
              Bienes/Serv.: ${window.fmtSoles(r.montoAperturaBienesServicios)} | Viáticos: ${window.fmtSoles(r.montoAperturaViaticos)}
            </div>
          </div>
          <div style="background:rgba(255,255,255,0.08); padding:8px 10px; border-radius:10px;">
            <span style="color:#CBD5E1; font-size:0.68rem; font-weight:700;">2. EFECTIVO DISPONIBLE HOY:</span><br/>
            <strong style="font-size:0.96rem; color:#6EE7B7;">${window.fmtSoles(r.efectivoDisponibleActual)}</strong>
            <div style="font-size:0.65rem; color:#94A3B8; margin-top:2px;">
              Responsable: ${ap.responsable_nombre || 'No asignado'}
            </div>
          </div>
          <div style="background:rgba(255,255,255,0.08); padding:8px 10px; border-radius:10px;">
            <span style="color:#CBD5E1; font-size:0.68rem; font-weight:700;">3. DOCS. PAGADOS EN CUSTODIA:</span><br/>
            <strong style="font-size:0.9rem; color:#7DD3FC;">${window.fmtSoles(r.montoComprobantesCustodia)}</strong>
            <span style="font-size:0.66rem; color:#CBD5E1;">(${r.comprobantesPagadosCiclo.length} doc.)</span>
          </div>
          <div style="background:rgba(255,255,255,0.08); padding:8px 10px; border-radius:10px;">
            <span style="color:#CBD5E1; font-size:0.68rem; font-weight:700;">4. VALES PROV. + REPOSICIONES:</span><br/>
            <strong style="font-size:0.9rem; color:#FDE68A;">Vales: ${window.fmtSoles(r.montoValesVigentes)}</strong>
            <div style="font-size:0.65rem; color:#94A3B8;">Repuesto acum.: ${window.fmtSoles(r.totalReposiciones)} (${r.reposiciones.length})</div>
          </div>
        </div>
      </div>

      <!-- BOTONES DESPLEGABLES EXCLUSIVOS PARA EL ADMINISTRADOR -->
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-bottom:10px;">
        <button type="button" onclick="toggleFormularioFondoCaja('${prefijoId}', 'APERTURA')" style="background:linear-gradient(135deg, #FBBF24 0%, #F59E0B 100%); color:#0F172A; border:1.5px solid #D97706; border-radius:12px; padding:9px 8px; font-size:0.75rem; font-weight:800; cursor:pointer;">
          🏛️ ${r.aperturada ? 'Actualizar Apertura Inicial' : 'Registrar Apertura Inicial'}
        </button>
        <button type="button" onclick="toggleFormularioFondoCaja('${prefijoId}', 'REPOSICION')" style="background:#10B981; color:#FFFFFF; border:none; border-radius:12px; padding:9px 8px; font-size:0.75rem; font-weight:800; cursor:pointer;">
          🔄 Registrar Reposición Progresiva
        </button>
      </div>

      <!-- FORMULARIO A: APERTURA INICIAL DEL FONDO (tipo_movimiento = 'APERTURA_INICIAL') -->
      <div id="${prefijoId}-form-apertura-caja" style="display:${!r.aperturada && esAdmin ? 'block' : 'none'}; background:#FFFFFF; border:1.5px solid #F59E0B; border-radius:16px; padding:12px; margin-bottom:10px;">
        <div style="font-size:0.82rem; font-weight:800; color:#92400E; margin-bottom:8px;">
          🏛️ A) Registro de Apertura Inicial del Fondo Fijo de Caja Chica (Exclusivo Administrador)
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-bottom:8px;">
          <div>
            <label style="display:block; font-size:0.7rem; font-weight:800; color:#334155; margin-bottom:2px;">FECHA DE APERTURA:</label>
            <input type="date" id="${prefijoId}-ap-fecha" value="${ap.fecha_movimiento || hoyISO}" style="padding:8px; border-radius:10px; border:1.5px solid #CBD5E1; font-weight:700; font-size:0.8rem;" />
          </div>
          <div>
            <label style="display:block; font-size:0.7rem; font-weight:800; color:#334155; margin-bottom:2px;">N° RESOLUCIÓN DE APERTURA:</label>
            <input type="text" id="${prefijoId}-ap-resolucion" value="${ap.nro_resolucion_apertura || 'R.J. N° 001-2026-ANC-MP-OCA'}" placeholder="Ej: R.D. N° 005-2026-ANC-MP" style="padding:8px; border-radius:10px; border:1.5px solid #CBD5E1; font-weight:800; font-size:0.8rem;" />
          </div>
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:8px; margin-bottom:8px;">
          <div>
            <label style="display:block; font-size:0.69rem; font-weight:800; color:#065F46; margin-bottom:2px;">BIENES Y SERVICIOS (S/):</label>
            <input type="number" id="${prefijoId}-ap-monto-bs" value="${montoDefBS.toFixed(2)}" step="100" oninput="recalcularTotalAperturaCaja('${prefijoId}')" style="padding:8px; border-radius:10px; border:1.5px solid #10B981; font-weight:800; font-size:0.82rem; background:#F2FBF7;" />
          </div>
          <div>
            <label style="display:block; font-size:0.69rem; font-weight:800; color:#0284C7; margin-bottom:2px;">VIÁTICOS URGENTES (S/):</label>
            <input type="number" id="${prefijoId}-ap-monto-viat" value="${montoDefViat.toFixed(2)}" step="100" oninput="recalcularTotalAperturaCaja('${prefijoId}')" style="padding:8px; border-radius:10px; border:1.5px solid #0EA5E9; font-weight:800; font-size:0.82rem; background:#F0F8FF;" />
          </div>
          <div>
            <label style="display:block; font-size:0.69rem; font-weight:800; color:#92400E; margin-bottom:2px;">MONTO FIJO TOTAL (X):</label>
            <input type="number" id="${prefijoId}-ap-monto-total" value="${montoDefTotal.toFixed(2)}" step="100" style="padding:8px; border-radius:10px; border:2px solid #D97706; font-weight:900; font-size:0.85rem; background:#FFFBEB;" />
          </div>
        </div>

        <div style="display:grid; grid-template-columns:1.6fr 1fr; gap:8px; margin-bottom:8px;">
          <div>
            <label style="display:block; font-size:0.7rem; font-weight:800; color:#334155; margin-bottom:2px;">ENCARGADO ÚNICO QUE COBRÓ EL FONDO (Autocompletado):</label>
            <input type="text" id="${prefijoId}-ap-resp-nombre" value="${ap.responsable_nombre || ''}" placeholder="Escribe apellido o nombre del servidor..." style="padding:8px; border-radius:10px; border:1.5px solid #F59E0B; font-weight:800; font-size:0.8rem;" />
          </div>
          <div>
            <label style="display:block; font-size:0.7rem; font-weight:800; color:#334155; margin-bottom:2px;">DNI ENCARGADO:</label>
            <input type="text" id="${prefijoId}-ap-resp-dni" value="${ap.responsable_dni || ''}" maxlength="12" placeholder="8 dígitos" style="padding:8px; border-radius:10px; border:1.5px solid #0F172A; font-weight:800; font-size:0.8rem;" />
          </div>
        </div>

        <div style="margin-bottom:10px;">
          <label style="display:block; font-size:0.7rem; font-weight:800; color:#334155; margin-bottom:2px;">CARGO Y UNIDAD DEL ENCARGADO ÚNICO:</label>
          <input type="text" id="${prefijoId}-ap-resp-cargo" value="${ap.responsable_cargo || 'Encargado Único del Manejo de la Caja Chica - Sede Central'}" style="padding:8px; border-radius:10px; border:1.5px solid #CBD5E1; font-weight:700; font-size:0.79rem;" />
        </div>

        <button type="button" onclick="registrarAperturaInicialCajaChica('${prefijoId}')" style="width:100%; background:#0F172A; color:#FBBF24; border:none; border-radius:12px; padding:11px; font-size:0.82rem; font-weight:800; cursor:pointer;">
          💾 Guardar Apertura Inicial del Fondo Fijo en Supabase
        </button>
      </div>

      <!-- FORMULARIO B: REPOSICIÓN PROGRESIVA DEL FONDO (tipo_movimiento = 'REPOSICION') -->
      <div id="${prefijoId}-form-reposicion-caja" style="display:none; background:#F2FBF7; border:1.5px solid #10B981; border-radius:16px; padding:12px; margin-bottom:10px;">
        <div style="font-size:0.82rem; font-weight:800; color:#065F46; margin-bottom:6px;">
          🔄 B) Registrar Reposición Progresiva de Caja Chica (Exclusivo Administrador)
        </div>
        <p style="font-size:0.72rem; color:#047857; margin-bottom:8px; font-weight:600;">
          Al guardar esta reposición, los <strong>${r.comprobantesPagadosCiclo.length} comprobante(s)</strong> pagados en custodia actual (${window.fmtSoles(r.montoComprobantesCustodia)}) pasarán a <code>REPUESTO_HISTORICO</code> y el efectivo disponible se incrementará con el monto ingresado.
        </p>

        <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:8px; margin-bottom:8px;">
          <div>
            <label style="display:block; font-size:0.69rem; font-weight:800; color:#065F46; margin-bottom:2px;">FECHA DE INGRESO:</label>
            <input type="date" id="${prefijoId}-rep-fecha" value="${hoyISO}" style="padding:8px; border-radius:10px; border:1.5px solid #A7F3D0; font-weight:700; font-size:0.8rem; background:#FFFFFF;" />
          </div>
          <div>
            <label style="display:block; font-size:0.69rem; font-weight:800; color:#065F46; margin-bottom:2px;">N° RENDICIÓN (ANEXO 13):</label>
            <input type="text" id="${prefijoId}-rep-anexo13" value="REND-00${r.reposiciones.length + 1}-${window.ANC_STATE.config.anio_fiscal}" style="padding:8px; border-radius:10px; border:1.5px solid #A7F3D0; font-weight:800; font-size:0.8rem; background:#FFFFFF;" />
          </div>
          <div>
            <label style="display:block; font-size:0.69rem; font-weight:800; color:#065F46; margin-bottom:2px;">N° C/P SIAF U OPE:</label>
            <input type="text" id="${prefijoId}-rep-siaf" placeholder="Ej: C/P SIAF 0458-2026" style="padding:8px; border-radius:10px; border:1.5px solid #A7F3D0; font-weight:800; font-size:0.8rem; background:#FFFFFF;" />
          </div>
        </div>

        <div style="display:grid; grid-template-columns:1.5fr 1fr 1fr; gap:8px; margin-bottom:10px;">
          <div>
            <label style="display:block; font-size:0.69rem; font-weight:800; color:#065F46; margin-bottom:2px;">QUIÉN COBRÓ / REPUSO EL FONDO:</label>
            <input type="text" id="${prefijoId}-rep-resp-nombre" value="${ap.responsable_nombre || ''}" placeholder="Nombre o apellido..." style="padding:8px; border-radius:10px; border:1.5px solid #10B981; font-weight:800; font-size:0.8rem; background:#FFFFFF;" />
          </div>
          <div>
            <label style="display:block; font-size:0.69rem; font-weight:800; color:#065F46; margin-bottom:2px;">DNI RESPONSABLE:</label>
            <input type="text" id="${prefijoId}-rep-resp-dni" value="${ap.responsable_dni || ''}" maxlength="12" style="padding:8px; border-radius:10px; border:1.5px solid #10B981; font-weight:800; font-size:0.8rem; background:#FFFFFF;" />
          </div>
          <div>
            <label style="display:block; font-size:0.69rem; font-weight:800; color:#065F46; margin-bottom:2px;">MONTO REPUESTO (S/):</label>
            <input type="number" id="${prefijoId}-rep-monto" value="${r.montoComprobantesCustodia > 0 ? r.montoComprobantesCustodia.toFixed(2) : '0.00'}" step="10" style="padding:8px; border-radius:10px; border:2px solid #059669; font-weight:900; font-size:0.85rem; background:#FFFFFF;" />
          </div>
        </div>

        <button type="button" onclick="registrarReposicionProgresivaCajaChica('${prefijoId}')" style="width:100%; background:#059669; color:#FFFFFF; border:none; border-radius:12px; padding:11px; font-size:0.82rem; font-weight:800; cursor:pointer;">
          ✓ Confirmar Reposición Progresiva y Actualizar Efectivo Disponible
        </button>
      </div>

      <!-- HISTORIAL COMPACTO DE MOVIMIENTOS DEL FONDO (APERTURA + REPOSICIONES) -->
      ${r.reposiciones.length > 0 ? `
        <div style="margin-top:6px; background:#FFFFFF; border:1px solid #E2E8F0; border-radius:12px; padding:8px 10px; font-size:0.73rem;">
          <div style="font-weight:800; color:#0F172A; margin-bottom:4px;">📋 Historial de Reposiciones Recibidas (${r.reposiciones.length}):</div>
          ${r.reposiciones.map((rep, idx) => `
            <div style="display:flex; justify-content:space-between; align-items:center; padding:4px 0; border-top:1px dashed #E2E8F0;">
              <span><strong>#${idx + 1} (${rep.fecha_movimiento}):</strong> ${rep.nro_rendicion_anexo13 || 'Anexo 13'} • ${rep.nro_cp_siaf_ope || 'SIAF'} — <em>${rep.responsable_nombre || ''}</em></span>
              <strong style="color:#059669;">+ ${window.fmtSoles(rep.monto_movimiento)}</strong>
            </div>
          `).join("")}
        </div>
      ` : ""}
    </div>
  `;
};

window.vincularAutocompletadoPanelFondoCaja = function(prefijoId = "cfg") {
  const cbApertura = (srv) => {
    const inpNom = document.getElementById(`${prefijoId}-ap-resp-nombre`);
    const inpDni = document.getElementById(`${prefijoId}-ap-resp-dni`);
    const inpCargo = document.getElementById(`${prefijoId}-ap-resp-cargo`);
    if (inpNom) inpNom.value = srv.apellidos_nombres || "";
    if (inpDni) inpDni.value = srv.dni || "";
    if (inpCargo) inpCargo.value = `${srv.cargo || 'Encargado Único'} (${srv.nombre_dependencia || srv.codigo_dependencia || 'ANC-MP'})`;
  };
  window.conectarAutocompletadoServidorSeguro(`${prefijoId}-ap-resp-nombre`, cbApertura);
  window.conectarAutocompletadoServidorSeguro(`${prefijoId}-ap-resp-dni`, cbApertura);

  const cbReposicion = (srv) => {
    const inpNom = document.getElementById(`${prefijoId}-rep-resp-nombre`);
    const inpDni = document.getElementById(`${prefijoId}-rep-resp-dni`);
    if (inpNom) inpNom.value = srv.apellidos_nombres || "";
    if (inpDni) inpDni.value = srv.dni || "";
  };
  window.conectarAutocompletadoServidorSeguro(`${prefijoId}-rep-resp-nombre`, cbReposicion);
  window.conectarAutocompletadoServidorSeguro(`${prefijoId}-rep-resp-dni`, cbReposicion);
};

window.toggleFormularioFondoCaja = function(prefijoId, tipoForm) {
  if (!window.validarPinExclusivoAdministrador(tipoForm === "APERTURA" ? "gestionar la Apertura Inicial de Caja Chica" : "registrar una Reposición Progresiva de Caja Chica")) {
    return;
  }
  const fAp = document.getElementById(`${prefijoId}-form-apertura-caja`);
  const fRep = document.getElementById(`${prefijoId}-form-reposicion-caja`);
  if (tipoForm === "APERTURA" && fAp) {
    fAp.style.display = fAp.style.display === "none" ? "block" : "none";
    if (fRep) fRep.style.display = "none";
  } else if (tipoForm === "REPOSICION" && fRep) {
    if (!window.estaCajaChicaAperturada()) {
      alert("⚠️ Primero debes registrar la Apertura Inicial de la Caja Chica antes de registrar una reposición.");
      if (fAp) fAp.style.display = "block";
      return;
    }
    fRep.style.display = fRep.style.display === "none" ? "block" : "none";
    if (fAp) fAp.style.display = "none";
  }
  window.vincularAutocompletadoPanelFondoCaja(prefijoId);
};

window.recalcularTotalAperturaCaja = function(prefijoId) {
  const bs = Number(document.getElementById(`${prefijoId}-ap-monto-bs`)?.value || 0);
  const viat = Number(document.getElementById(`${prefijoId}-ap-monto-viat`)?.value || 0);
  const totEl = document.getElementById(`${prefijoId}-ap-monto-total`);
  if (totEl) {
    totEl.value = (bs + viat).toFixed(2);
  }
};

window.registrarAperturaInicialCajaChica = async function(prefijoId = "cfg") {
  if (!window.validarPinExclusivoAdministrador("registrar la Apertura Inicial del Fondo de Caja Chica")) return;

  const fecha = document.getElementById(`${prefijoId}-ap-fecha`)?.value || new Date().toISOString().slice(0, 10);
  const resolucion = document.getElementById(`${prefijoId}-ap-resolucion`)?.value.trim() || "R.J. Apertura Caja Chica 2026";
  const montoBS = Number(document.getElementById(`${prefijoId}-ap-monto-bs`)?.value || 0);
  const montoViat = Number(document.getElementById(`${prefijoId}-ap-monto-viat`)?.value || 0);
  const montoTotal = Number(document.getElementById(`${prefijoId}-ap-monto-total`)?.value || (montoBS + montoViat));
  const respNombre = document.getElementById(`${prefijoId}-ap-resp-nombre`)?.value.trim() || window.ANC_STATE.perfilActivo.usuario_nombre;
  const respDni = document.getElementById(`${prefijoId}-ap-resp-dni`)?.value.trim() || window.ANC_STATE.perfilActivo.usuario_dni;
  const respCargo = document.getElementById(`${prefijoId}-ap-resp-cargo`)?.value.trim() || "Encargado Único de Caja Chica";

  if (montoTotal <= 0) {
    alert("⚠️ El Monto Fijo Total de Apertura (Monto X) debe ser mayor a S/ 0.00.");
    return;
  }
  if (!respNombre || !respDni) {
    alert("⚠️ Por favor, indica el Nombre y DNI del Responsable / Encargado Único que cobró el fondo.");
    return;
  }

  const nuevoMov = {
    id: Date.now(),
    anio_fiscal: window.ANC_STATE.config.anio_fiscal || 2026,
    tipo_movimiento: "APERTURA_INICIAL",
    fecha_movimiento: fecha,
    nro_resolucion_apertura: resolucion,
    nro_rendicion_anexo13: null,
    nro_cp_siaf_ope: null,
    monto_movimiento: Number(montoTotal.toFixed(2)),
    monto_bienes_servicios: Number(montoBS.toFixed(2)),
    monto_viaticos: Number(montoViat.toFixed(2)),
    responsable_dni: respDni,
    responsable_nombre: respNombre,
    responsable_cargo: respCargo,
    codigo_dependencia: window.ANC_STATE.perfilActivo.codigo_dependencia || "AP-UTE",
    observaciones: `Apertura Inicial con ${resolucion} (Bienes/Serv.: ${window.fmtSoles(montoBS)} | Viáticos: ${window.fmtSoles(montoViat)})`
  };

  const res = await guardarMovimientoFondoEnSupabase(nuevoMov);
  if (res.data && res.data.length > 0 && res.data[0].id) {
    nuevoMov.id = res.data[0].id;
  }

  const movsLocal = JSON.parse(localStorage.getItem("anc_caja_movimientos_fondo_v1") || "[]");
  movsLocal.push(nuevoMov);
  localStorage.setItem("anc_caja_movimientos_fondo_v1", JSON.stringify(movsLocal));

  procesarEstadoFondoCajaUnica(movsLocal);
  const resumen = window.obtenerResumenCicloCajaUnica();

  window.ANC_STATE.perfilActivo.presupuesto_caja_chica = resumen.montoFijoApertura;
  window.ANC_STATE.perfilActivo.saldo_caja_chica = resumen.efectivoDisponibleActual;
  guardarEstadoEnLocalStorage();
  actualizarCabeceraYMenu();

  await window.SupabaseANC.request(
    "anc_unidades_organicas",
    "PATCH",
    `codigo=eq.${encodeURIComponent(window.ANC_STATE.perfilActivo.codigo_dependencia)}`,
    {
      presupuesto_caja_chica_mensual: resumen.montoFijoApertura,
      saldo_caja_chica_actual: resumen.efectivoDisponibleActual
    }
  );

  renderizarModuloConfiguracion();
  if (typeof window.renderizarListadoGastosCajaChica === "function") window.renderizarListadoGastosCajaChica();
  if (typeof window.renderizarVistaArqueoIndependiente === "function") window.renderizarVistaArqueoIndependiente();

  alert(`✅ APERTURA INICIAL DE CAJA CHICA REGISTRADA:\n• Resolución: ${resolucion}\n• Monto Fijo Total (X): ${window.fmtSoles(montoTotal)}\n• Encargado Único: ${respNombre} (DNI: ${respDni})\n\nEl registro de gastos y reembolsos de Caja Chica ya se encuentra habilitado.`);
};

window.registrarReposicionProgresivaCajaChica = async function(prefijoId = "cfg") {
  if (!window.validarPinExclusivoAdministrador("registrar una Reposición Progresiva del Fondo de Caja Chica")) return;

  if (!window.estaCajaChicaAperturada()) {
    alert("⚠️ Primero debe registrarse la Apertura Inicial de la Caja Chica.");
    return;
  }

  const fecha = document.getElementById(`${prefijoId}-rep-fecha`)?.value || new Date().toISOString().slice(0, 10);
  const nroAnexo13 = document.getElementById(`${prefijoId}-rep-anexo13`)?.value.trim() || "REND-ANEXO-13";
  const nroSiaf = document.getElementById(`${prefijoId}-rep-siaf`)?.value.trim() || "C/P SIAF S/N";
  const respNombre = document.getElementById(`${prefijoId}-rep-resp-nombre`)?.value.trim() || window.ANC_STATE.fondoCajaUnica?.apertura?.responsable_nombre || window.ANC_STATE.perfilActivo.usuario_nombre;
  const respDni = document.getElementById(`${prefijoId}-rep-resp-dni`)?.value.trim() || window.ANC_STATE.fondoCajaUnica?.apertura?.responsable_dni || window.ANC_STATE.perfilActivo.usuario_dni;
  const montoRepuesto = Number(document.getElementById(`${prefijoId}-rep-monto`)?.value || 0);

  if (montoRepuesto <= 0) {
    alert("⚠️ Ingresa un Monto Repuesto mayor a S/ 0.00.");
    return;
  }

  const nuevoMov = {
    id: Date.now(),
    anio_fiscal: window.ANC_STATE.config.anio_fiscal || 2026,
    tipo_movimiento: "REPOSICION",
    fecha_movimiento: fecha,
    nro_resolucion_apertura: window.ANC_STATE.fondoCajaUnica?.apertura?.nro_resolucion_apertura || null,
    nro_rendicion_anexo13: nroAnexo13,
    nro_cp_siaf_ope: nroSiaf,
    monto_movimiento: Number(montoRepuesto.toFixed(2)),
    monto_bienes_servicios: Number(montoRepuesto.toFixed(2)),
    monto_viaticos: 0,
    responsable_dni: respDni,
    responsable_nombre: respNombre,
    responsable_cargo: "Encargado Único de Caja Chica",
    codigo_dependencia: window.ANC_STATE.perfilActivo.codigo_dependencia || "AP-UTE",
    observaciones: `Reposición según ${nroAnexo13} y ${nroSiaf}`
  };

  const res = await guardarMovimientoFondoEnSupabase(nuevoMov);
  if (res.data && res.data.length > 0 && res.data[0].id) {
    nuevoMov.id = res.data[0].id;
  }

  // Pasar todos los gastos pagados que estaban en 'EN_CUSTODIA_ACTUAL' a 'REPUESTO_HISTORICO'
  await window.SupabaseANC.request(
    "anc_gastos_caja_encargos",
    "PATCH",
    "estado_ciclo_caja=eq.EN_CUSTODIA_ACTUAL",
    { estado_ciclo_caja: "REPUESTO_HISTORICO", nro_reposicion_vinculada: nroAnexo13 }
  );

  if (window.CAJA_STATE && Array.isArray(window.CAJA_STATE.gastosRegistrados)) {
    window.CAJA_STATE.gastosRegistrados = window.CAJA_STATE.gastosRegistrados.map(g => {
      const esVale = g.modalidad_fondo === "VALE_PROVISIONAL" || (g.tipo_comprobante && g.tipo_comprobante.toUpperCase().includes("VALE"));
      if (!esVale && (!g.estado_ciclo_caja || g.estado_ciclo_caja === "EN_CUSTODIA_ACTUAL")) {
        return { ...g, estado_ciclo_caja: "REPUESTO_HISTORICO", nro_reposicion_vinculada: nroAnexo13 };
      }
      return g;
    });
  }

  try {
    const localGastos = JSON.parse(localStorage.getItem("anc_gastos_caja_local_v1") || "[]").map(g => {
      const esVale = g.modalidad_fondo === "VALE_PROVISIONAL" || (g.tipo_comprobante && g.tipo_comprobante.toUpperCase().includes("VALE"));
      if (!esVale && (!g.estado_ciclo_caja || g.estado_ciclo_caja === "EN_CUSTODIA_ACTUAL")) {
        return { ...g, estado_ciclo_caja: "REPUESTO_HISTORICO", nro_reposicion_vinculada: nroAnexo13 };
      }
      return g;
    });
    localStorage.setItem("anc_gastos_caja_local_v1", JSON.stringify(localGastos));
  } catch (e) {
    console.warn("Aviso actualizando ciclo local:", e);
  }

  const movsLocal = JSON.parse(localStorage.getItem("anc_caja_movimientos_fondo_v1") || "[]");
  movsLocal.push(nuevoMov);
  localStorage.setItem("anc_caja_movimientos_fondo_v1", JSON.stringify(movsLocal));

  procesarEstadoFondoCajaUnica(movsLocal);
  const resumen = window.obtenerResumenCicloCajaUnica();

  window.ANC_STATE.perfilActivo.saldo_caja_chica = resumen.efectivoDisponibleActual;
  guardarEstadoEnLocalStorage();
  actualizarCabeceraYMenu();

  await window.SupabaseANC.request(
    "anc_unidades_organicas",
    "PATCH",
    `codigo=eq.${encodeURIComponent(window.ANC_STATE.perfilActivo.codigo_dependencia)}`,
    { saldo_caja_chica_actual: resumen.efectivoDisponibleActual }
  );

  renderizarModuloConfiguracion();
  if (typeof window.renderizarListadoGastosCajaChica === "function") window.renderizarListadoGastosCajaChica();
  if (typeof window.renderizarVistaArqueoIndependiente === "function") window.renderizarVistaArqueoIndependiente();

  alert(`✅ REPOSICIÓN PROGRESIVA REGISTRADA:\n• Rendición: ${nroAnexo13} (${nroSiaf})\n• Monto Repuesto: ${window.fmtSoles(montoRepuesto)}\n• Los comprobantes del ciclo anterior pasaron a REPUESTO_HISTORICO.\n• Nuevo Efectivo Disponible en Caja: ${window.fmtSoles(resumen.efectivoDisponibleActual)}`);
};

// =========================================================================================
// INICIALIZACIÓN AL CARGAR LA PWA
// =========================================================================================
document.addEventListener("DOMContentLoaded", async () => {
  aplicarParcheVisualInstitucionalANC();
  window.asegurarCargaServidoresANC();
  cargarPerfilDesdeLocalStorage();
  await window.sincronizarMovimientosFondoCaja();
  renderizarModuloConfiguracion();
  actualizarCabeceraYMenu();
  await sincronizarDatosEtapa3();
});

function cargarPerfilDesdeLocalStorage() {
  try {
    const guardado = localStorage.getItem("anc_mp_perfil_v1");
    if (guardado) {
      const parsed = JSON.parse(guardado);
      window.ANC_STATE.perfilActivo = { ...window.ANC_STATE.perfilActivo, ...parsed };
    }
    const cfgGuardada = localStorage.getItem("anc_mp_config_v1");
    if (cfgGuardada) {
      window.ANC_STATE.config = { ...window.ANC_STATE.config, ...JSON.parse(cfgGuardada) };
    }
  } catch (e) {
    console.warn("Error leyendo almacenamiento local:", e);
  }
}

function guardarEstadoEnLocalStorage() {
  localStorage.setItem("anc_mp_perfil_v1", JSON.stringify(window.ANC_STATE.perfilActivo));
  localStorage.setItem("anc_mp_config_v1", JSON.stringify(window.ANC_STATE.config));
}

async function sincronizarDatosEtapa3() {
  const badgeEstado = document.getElementById("badge-conexion-supabase");
  if (badgeEstado) {
    badgeEstado.textContent = "🔄 Sincronizando...";
    badgeEstado.className = "badge-semaforo badge-amarillo";
  }

  const resCfg = await window.SupabaseANC.request("anc_configuracion", "GET", "order=id.asc&limit=1");
  if (resCfg.data && resCfg.data.length > 0) {
    const row = resCfg.data[0];
    window.ANC_STATE.config = {
      id: row.id,
      anio_fiscal: Number(row.anio_fiscal) || 2026,
      valor_uit: Number(row.valor_uit) || 5350.00,
      porcentaje_tope_caja_chica: Number(row.porcentaje_tope_caja_chica) || 20.00,
      tope_viaticos_caja_chica: Number(row.tope_viaticos_caja_chica) || 2000.00,
      tipo_cambio_usd: Number(row.tipo_cambio_usd) || 3.750,
      ruc_institucional: row.ruc_institucional || "20131370301",
      pin_administrador: row.pin_administrador || "2026"
    };
  }

  const resUnidades = await window.SupabaseANC.request("anc_unidades_organicas", "GET", "activo=eq.true&order=id.asc");
  if (resUnidades.data && resUnidades.data.length > 0) {
    window.ANC_STATE.unidades = resUnidades.data;
    if (badgeEstado) {
      badgeEstado.textContent = `✓ En línea (${resUnidades.data.length} Despachos / Sedes)`;
      badgeEstado.className = "badge-semaforo badge-verde";
    }
  } else {
    window.ANC_STATE.unidades = ROF_FALLBACK;
    if (badgeEstado) {
      badgeEstado.textContent = "⚠️ Modo Local Activo";
      badgeEstado.className = "badge-semaforo badge-amarillo";
    }
  }

  const unidadEncontrada = window.ANC_STATE.unidades.find(
    (u) => Number(u.id) === Number(window.ANC_STATE.perfilActivo.unidad_id) || u.codigo === window.ANC_STATE.perfilActivo.codigo_dependencia
  ) || window.ANC_STATE.unidades[0];

  if (unidadEncontrada) {
    window.ANC_STATE.perfilActivo.unidad_id = unidadEncontrada.id;
    window.ANC_STATE.perfilActivo.codigo_dependencia = unidadEncontrada.codigo;
    window.ANC_STATE.perfilActivo.categoria_rof = unidadEncontrada.categoria_rof;
    window.ANC_STATE.perfilActivo.nombre_dependencia = unidadEncontrada.nombre_dependencia;
    window.ANC_STATE.perfilActivo.es_adc = Boolean(unidadEncontrada.es_adc);
    window.ANC_STATE.perfilActivo.sede_ubicacion = unidadEncontrada.sede_ubicacion;
    window.ANC_STATE.perfilActivo.presupuesto_viaticos = Number(unidadEncontrada.presupuesto_viaticos_mensual);
    window.ANC_STATE.perfilActivo.saldo_viaticos = Number(unidadEncontrada.saldo_viaticos_actual);

    if (window.estaCajaChicaAperturada()) {
      const resCaja = window.obtenerResumenCicloCajaUnica();
      window.ANC_STATE.perfilActivo.presupuesto_caja_chica = resCaja.montoFijoApertura;
      window.ANC_STATE.perfilActivo.saldo_caja_chica = resCaja.efectivoDisponibleActual;
    } else {
      window.ANC_STATE.perfilActivo.presupuesto_caja_chica = Number(unidadEncontrada.presupuesto_caja_chica_mensual);
      window.ANC_STATE.perfilActivo.saldo_caja_chica = Number(unidadEncontrada.saldo_caja_chica_actual);
    }
  }

  guardarEstadoEnLocalStorage();
  actualizarCabeceraYMenu();
  poblarSelectoresConfiguracion();
  if (typeof window.cargarDatosModuloCaja === "function") window.cargarDatosModuloCaja();
  if (typeof window.cargarDatosModuloViaticos === "function") window.cargarDatosModuloViaticos();
}

// Actualiza Cabecera Superior, Barra integrada "MI PERFIL", Menú Lateral y Tarjeta de Resumen en Inicio
window.actualizarCabeceraYMenu = function() {
  const cfg = window.ANC_STATE.config;
  const p = window.ANC_STATE.perfilActivo;
  const tope20Pct = (cfg.valor_uit * (cfg.porcentaje_tope_caja_chica / 100)).toFixed(2);
  const resCiclo = window.obtenerResumenCicloCajaUnica();
  const saldoMostrar = resCiclo.aperturada ? resCiclo.efectivoDisponibleActual : p.saldo_caja_chica;

  const sub = document.getElementById("header-subtitle");
  if (sub) {
    sub.innerHTML = `${p.codigo_dependencia} • Disponible Caja: <strong>${window.fmtSoles(saldoMostrar)}</strong>`;
  }

  const barPerfil = document.getElementById("header-profile-summary");
  if (barPerfil) {
    barPerfil.innerHTML = `<strong>MI PERFIL:</strong> ${p.usuario_nombre} • ${p.nombre_dependencia}`;
  }

  const drawerUser = document.getElementById("drawer-user-subtitle");
  if (drawerUser) {
    drawerUser.innerHTML = `👤 <strong>${p.usuario_nombre}</strong> (DNI: ${p.usuario_dni})<br/><span style="font-size:0.72rem; color:#475569;">🏛️ ${p.nombre_dependencia}</span>`;
  }

  const lblUitMenu = document.getElementById("lbl-menu-uit");
  if (lblUitMenu) lblUitMenu.textContent = `S/ ${Number(cfg.valor_uit).toLocaleString("es-PE")}`;

  const lblTopeModal = document.getElementById("lbl-tope-modal");
  if (lblTopeModal) lblTopeModal.textContent = Number(tope20Pct).toLocaleString("es-PE", { minimumFractionDigits: 2 });

  const bannerResumenInicio = document.getElementById("banner-resumen-dependencia");
  if (bannerResumenInicio) {
    const etiqRol = p.rol_sistema === "ADMINISTRADOR"
      ? `<span class="badge-semaforo badge-verde" style="font-size:0.66rem;">🛡️ GESTIÓN NACIONAL</span>`
      : (p.rol_sistema === "JEFATURA"
        ? `<span class="badge-semaforo badge-amarillo" style="font-size:0.66rem;">🏛️ PERFIL JEFATURA</span>`
        : `<span class="badge-semaforo badge-azul" style="font-size:0.66rem;">🔒 VISTA PERSONAL (DNI: ${p.usuario_dni})</span>`);

    bannerResumenInicio.style.background = "#FFFDF5";
    bannerResumenInicio.style.border = "1.5px solid #FDE68A";
    bannerResumenInicio.style.borderRadius = "18px";
    bannerResumenInicio.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
        <div style="min-width:0; flex:1;">
          <div style="font-size:0.72rem; font-weight:800; color:#0F172A; display:flex; align-items:center; gap:6px; flex-wrap:wrap;">
            <span>🏛️ ${p.nombre_dependencia}</span>
            ${etiqRol}
          </div>
          <div style="font-size:0.77rem; color:#475569; font-weight:600; margin-top:4px; line-height:1.35;">
            👤 <strong>${p.usuario_nombre}</strong> • Límite por compra urgente: <strong>${window.fmtSoles(tope20Pct)}</strong> <span style="font-size:0.7rem; color:#64748B;">(20% UIT)</span>
          </div>
        </div>
        <button type="button" onclick="navegarVista('config')" style="background:#0F172A; color:#FBBF24; border:none; border-radius:999px; padding:7px 13px; font-size:0.74rem; font-weight:800; cursor:pointer; flex-shrink:0; box-shadow:0 2px 6px rgba(15,23,42,0.15);">
          ⚙️ Mi Despacho
        </button>
      </div>
    `;
  }
};

function renderizarModuloConfiguracion() {
  const cont = document.getElementById("contenedor-modulo-config");
  if (!cont) return;

  cont.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; margin-bottom:14px;">
      <div>
        <h2 style="font-size:1.18rem; font-weight:800; color:#0F172A;">👤 Mi Perfil, Despacho y Parámetros</h2>
        <p style="font-size:0.8rem; color:#475569; font-weight:600; margin-top:2px;">
          Busca tu nombre o DNI en el padrón oficial de la ANC-MP o edita libremente tus datos.
        </p>
      </div>
      <span id="badge-conexion-supabase" class="badge-semaforo badge-verde">✓ Listo</span>
    </div>

    <!-- BLOQUE 1: IDENTIDAD DEL FISCAL / MAGISTRADO / SERVIDOR Y DESPACHO CON AUTOCOMPLETADO -->
    <div style="background:#FFFDF5; border:1.5px solid #FDE68A; border-radius:20px; padding:14px; margin-bottom:16px;">
      <h3 style="font-size:0.95rem; font-weight:800; color:#0F172A; margin-bottom:10px;">
        🏛️ 1. Mis Datos Personales y Despacho Actual (Autocompletado ANC-MP)
      </h3>

      <div style="display:grid; grid-template-columns:1.4fr 1fr; gap:8px; margin-bottom:10px;">
        <div>
          <label style="display:block; font-size:0.73rem; font-weight:800; color:#334155; margin-bottom:3px;">APELLIDOS Y NOMBRES (Predictivo):</label>
          <input type="text" id="cfg-usuario-nombre" autocomplete="off" placeholder="Escribe tu apellido o nombre..." style="width:100%; padding:9px 10px; border-radius:12px; border:1.5px solid #CBD5E1; font-weight:700; font-size:0.84rem; background:#FFFFFF;" />
        </div>
        <div>
          <label style="display:block; font-size:0.73rem; font-weight:800; color:#334155; margin-bottom:3px;">N° DE DNI (Clave de privacidad):</label>
          <input type="text" id="cfg-usuario-dni" autocomplete="off" maxlength="12" placeholder="8 dígitos" style="width:100%; padding:9px 10px; border-radius:12px; border:1.5px solid #F59E0B; font-weight:800; font-size:0.84rem; background:#FFFFFF;" />
        </div>
      </div>

      <div style="margin-bottom:10px;">
        <label style="display:block; font-size:0.73rem; font-weight:800; color:#334155; margin-bottom:3px;">CARGO FUNCIONAL:</label>
        <input type="text" id="cfg-usuario-cargo" placeholder="Ej: Fiscal Superior / Especialista Administrativo" style="width:100%; padding:9px 10px; border-radius:12px; border:1.5px solid #CBD5E1; font-weight:700; font-size:0.83rem; background:#FFFFFF;" />
      </div>

      <div style="margin-bottom:10px;">
        <label style="display:block; font-size:0.73rem; font-weight:800; color:#334155; margin-bottom:3px;">FILTRAR POR TIPO DE ÓRGANO O SEDE NACIONAL:</label>
        <select id="cfg-filtro-categoria-rof" onchange="filtrarUnidadesPorCategoria()" style="width:100%; padding:9px 10px; border-radius:12px; border:1.5px solid #CBD5E1; font-weight:700; font-size:0.82rem; background:#FFFFFF;">
          <option value="TODAS">-- Todos los Despachos y las 34 Sedes Desconcentradas ADC --</option>
          <option value="A. Órganos de Alta Dirección">A. Alta Dirección (Jefatura Nacional / Oficina Central Administrativa)</option>
          <option value="B.1 Órganos de Asesoramiento">B.1 Órganos de Asesoramiento (Asesoría Jurídica / Planeamiento)</option>
          <option value="B.2 Órganos de Apoyo">B.2 Administración, Abastecimiento, Contabilidad, Tesorería, RRHH y Sistemas</option>
          <option value="C. Órganos de Línea">C. Direcciones de Control Funcional, Investigación Preliminar, PAD y Apelaciones</option>
          <option value="D. Órganos Desconcentrados (ADC)">D. Autoridades Desconcentradas de Control (34 Sedes ADC a Nivel Nacional)</option>
        </select>
      </div>

      <div style="margin-bottom:10px;">
        <label style="display:block; font-size:0.73rem; font-weight:800; color:#334155; margin-bottom:3px;">SELECCIONA TU DESPACHO, DIRECCIÓN O SEDE (ADC):</label>
        <select id="cfg-select-unidad" onchange="alCambiarUnidadSeleccionada()" style="width:100%; padding:10px; border-radius:12px; border:1.5px solid #0F172A; font-weight:800; font-size:0.84rem; background:#FFFFFF; color:#0F172A;"></select>
      </div>

      <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-bottom:10px;">
        <div>
          <label style="display:block; font-size:0.73rem; font-weight:800; color:#334155; margin-bottom:3px;">RÉGIMEN O VÍNCULO LABORAL:</label>
          <select id="cfg-usuario-regimen" style="width:100%; padding:9px 10px; border-radius:12px; border:1.5px solid #CBD5E1; font-weight:700; font-size:0.81rem; background:#FFFFFF;">
            <option value="Carrera Fiscal (Ley 30483)">Carrera Fiscal (Magistrado / Fiscal)</option>
            <option value="Carrera Fiscal">Carrera Fiscal</option>
            <option value="D.L. 728">Régimen D.L. N° 728</option>
            <option value="D.L. 276">Régimen D.L. N° 276</option>
            <option value="D.L. 1057 (CAS)">Contrato Administrativo CAS (D.L. 1057)</option>
            <option value="Locador / Proveedor de Servicios">Locador / Servicio por Terceros</option>
          </select>
        </div>
        <div>
          <label style="display:block; font-size:0.73rem; font-weight:800; color:#334155; margin-bottom:3px;">PERFIL DE ACCESO EN LA APP:</label>
          <select id="cfg-usuario-rol" onchange="verificarCambioRolAdmin()" style="width:100%; padding:9px 10px; border-radius:12px; border:1.5px solid #F59E0B; font-weight:800; font-size:0.81rem; background:#FFFBEB;">
            <option value="OPERADOR">👤 Fiscal / Comisionado (Vista personal)</option>
            <option value="JEFATURA">🏛️ Jefatura (Autoriza rendiciones)</option>
            <option value="ADMINISTRADOR">🛡️ Administración (Consolidado con clave)</option>
          </select>
        </div>
      </div>

      <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-bottom:12px;">
        <div>
          <label style="display:block; font-size:0.72rem; font-weight:800; color:#065F46; margin-bottom:3px;">FONDO DISPONIBLE CAJA CHICA (S/):</label>
          <input type="number" id="cfg-saldo-caja" step="10" style="width:100%; padding:9px; border-radius:12px; border:1.5px solid #10B981; font-weight:800; font-size:0.85rem; background:#F2FBF7;" />
        </div>
        <div>
          <label style="display:block; font-size:0.72rem; font-weight:800; color:#0284C7; margin-bottom:3px;">FONDO DISPONIBLE VIÁTICOS (S/):</label>
          <input type="number" id="cfg-saldo-viaticos" step="10" style="width:100%; padding:9px; border-radius:12px; border:1.5px solid #0EA5E9; font-weight:800; font-size:0.85rem; background:#F0F8FF;" />
        </div>
      </div>

      <label style="display:flex; align-items:flex-start; gap:9px; font-size:0.77rem; font-weight:700; color:#9F1239; background:#FFF5F6; padding:10px 12px; border-radius:14px; border:1.5px solid #FECDD3; margin-bottom:14px; cursor:pointer; line-height:1.38;">
        <input type="checkbox" id="cfg-gastos-operativos" style="width:17px; height:17px; margin-top:2px; flex-shrink:0;" />
        <span>
          <strong>Percibo asignación mensual por Gastos Operativos (Magistrado Titular):</strong><br/>
          <span style="font-size:0.72rem; font-weight:600; color:#881337;">Activa un aviso preventivo para evitar solicitar refrigerio por sobretiempo o movilidad local de Caja Chica (R.F.N. N° 190-2022-MP-FN). Sí permite solicitar Viáticos de viaje.</span>
        </span>
      </label>

      <button type="button" onclick="guardarPerfilYDependencia()" style="width:100%; background:linear-gradient(135deg, #FBBF24 0%, #F59E0B 100%); color:#0F172A; border:1.5px solid #D97706; border-radius:14px; padding:12px; font-size:0.9rem; font-weight:800; cursor:pointer; box-shadow:0 4px 12px rgba(245,158,11,0.22);">
        💾 Guardar mis Datos y Volver al Inicio
      </button>
    </div>

    <!-- BLOQUE 2: CONTROL DE APERTURA INICIAL Y REPOSICIONES DE CAJA CHICA -->
    ${window.generarHTMLControlAperturaYReposiciones("cfg")}

    <!-- BLOQUE 3: PARÁMETROS INSTITUCIONALES (VALOR DE LA UIT Y TIPO DE CAMBIO) -->
    <div style="background:#F8FAFC; border:1.5px solid #E2E8F0; border-radius:20px; padding:14px;">
      <h3 style="font-size:0.92rem; font-weight:800; color:#0F172A; margin-bottom:4px;">
        📐 3. Valores de Referencia Anual (UIT y Tipo de Cambio)
      </h3>
      <p style="font-size:0.75rem; color:#475569; margin-bottom:10px; font-weight:600;">
        Estos valores permiten que la aplicación calcule automáticamente los límites permitidos por cada boleta o factura.
      </p>

      <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-bottom:8px;">
        <div>
          <label style="display:block; font-size:0.72rem; font-weight:800; color:#334155; margin-bottom:3px;">AÑO EN CURSO:</label>
          <input type="number" id="cfg-anio-fiscal" value="2026" style="width:100%; padding:8px 10px; border-radius:12px; border:1.5px solid #CBD5E1; font-weight:800; background:#FFFFFF;" />
        </div>
        <div>
          <label style="display:block; font-size:0.72rem; font-weight:800; color:#334155; margin-bottom:3px;">VALOR DE LA UIT (S/):</label>
          <input type="number" id="cfg-valor-uit" step="50" oninput="recalcularTablaTopesUIT()" style="width:100%; padding:8px 10px; border-radius:12px; border:1.5px solid #0F172A; font-weight:800; background:#FFFFFF;" />
        </div>
      </div>

      <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-bottom:10px;">
        <div>
          <label style="display:block; font-size:0.72rem; font-weight:800; color:#334155; margin-bottom:3px;">TIPO DE CAMBIO DÓLAR (S/):</label>
          <input type="number" id="cfg-tc-usd" step="0.005" style="width:100%; padding:8px 10px; border-radius:12px; border:1.5px solid #CBD5E1; font-weight:800; background:#FFFFFF;" />
        </div>
        <div>
          <label style="display:block; font-size:0.72rem; font-weight:800; color:#334155; margin-bottom:3px;">TOPE VIÁTICOS POR CAJA CHICA (S/):</label>
          <input type="number" id="cfg-tope-viaticos" step="100" style="width:100%; padding:8px 10px; border-radius:12px; border:1.5px solid #CBD5E1; font-weight:800; background:#FFFFFF;" />
        </div>
      </div>

      <div id="resumen-topes-uit-dinamico" style="background:#FFFFFF; border:1px solid #E2E8F0; border-radius:14px; padding:10px 12px; margin-bottom:12px; font-size:0.76rem;"></div>

      <button type="button" onclick="guardarParametrosUITSupabase()" style="width:100%; background:#0F172A; color:#FBBF24; border:none; border-radius:14px; padding:11px; font-size:0.84rem; font-weight:800; cursor:pointer;">
        🔄 Actualizar Valores Anuales (Solo Administración)
      </button>
    </div>
  `;

  poblarSelectoresConfiguracion();
  conectarAutocompletadoMiPerfil();
  window.vincularAutocompletadoPanelFondoCaja("cfg");
}

// Conecta el autocompletado de servidores en los campos de "Mi Perfil"
function conectarAutocompletadoMiPerfil() {
  const callbackSeleccionPerfil = (srv) => {
    const elNom = document.getElementById("cfg-usuario-nombre");
    const elDni = document.getElementById("cfg-usuario-dni");
    const elCargo = document.getElementById("cfg-usuario-cargo");
    const elReg = document.getElementById("cfg-usuario-regimen");
    const elFiltroRof = document.getElementById("cfg-filtro-categoria-rof");
    const elUnidad = document.getElementById("cfg-select-unidad");
    const elGastosOp = document.getElementById("cfg-gastos-operativos");

    if (elNom) elNom.value = srv.apellidos_nombres || "";
    if (elDni) elDni.value = srv.dni || "";
    if (elCargo) elCargo.value = srv.cargo || "";

    if (elReg && srv.regimen_vinculo) {
      let existeOp = Array.from(elReg.options).some(o => o.value === srv.regimen_vinculo);
      if (!existeOp) {
        const opt = document.createElement("option");
        opt.value = srv.regimen_vinculo;
        opt.textContent = srv.regimen_vinculo;
        elReg.appendChild(opt);
      }
      elReg.value = srv.regimen_vinculo;
    }

    if (elFiltroRof) elFiltroRof.value = "TODAS";
    poblarSelectoresUnidadesSinResetearCampos(srv.codigo_dependencia);
    if (elUnidad && srv.codigo_dependencia) {
      elUnidad.value = srv.codigo_dependencia;
      alCambiarUnidadSeleccionada();
    }

    if (elGastosOp) {
      elGastosOp.checked = Boolean(srv.percibe_gastos_operativos);
    }
  };

  window.conectarAutocompletadoServidorSeguro("cfg-usuario-nombre", callbackSeleccionPerfil);
  window.conectarAutocompletadoServidorSeguro("cfg-usuario-dni", callbackSeleccionPerfil);
}

function poblarSelectoresUnidadesSinResetearCampos(codigoSeleccionar) {
  const selectUnidad = document.getElementById("cfg-select-unidad");
  if (!selectUnidad) return;

  const filtroCat = document.getElementById("cfg-filtro-categoria-rof")?.value || "TODAS";
  const lista = window.ANC_STATE.unidades.length > 0 ? window.ANC_STATE.unidades : ROF_FALLBACK;
  const filtradas = filtroCat === "TODAS" ? lista : lista.filter((u) => u.categoria_rof === filtroCat);
  const codTarget = codigoSeleccionar || window.ANC_STATE.perfilActivo.codigo_dependencia;

  selectUnidad.innerHTML = filtradas.map((u) => {
    const sel = (u.codigo === codTarget) ? "selected" : "";
    return `<option value="${u.codigo}" ${sel}>[${u.codigo}] ${u.nombre_dependencia}</option>`;
  }).join("");
}

function poblarSelectoresConfiguracion() {
  poblarSelectoresUnidadesSinResetearCampos(window.ANC_STATE.perfilActivo.codigo_dependencia);

  const p = window.ANC_STATE.perfilActivo;
  const cfg = window.ANC_STATE.config;
  const resCiclo = window.obtenerResumenCicloCajaUnica();

  if (document.getElementById("cfg-saldo-caja")) {
    document.getElementById("cfg-saldo-caja").value = resCiclo.aperturada ? resCiclo.efectivoDisponibleActual : p.saldo_caja_chica;
  }
  if (document.getElementById("cfg-saldo-viaticos")) document.getElementById("cfg-saldo-viaticos").value = p.saldo_viaticos;
  if (document.getElementById("cfg-usuario-nombre")) document.getElementById("cfg-usuario-nombre").value = p.usuario_nombre;
  if (document.getElementById("cfg-usuario-dni")) document.getElementById("cfg-usuario-dni").value = p.usuario_dni;
  if (document.getElementById("cfg-usuario-cargo")) document.getElementById("cfg-usuario-cargo").value = p.usuario_cargo || "Fiscal / Especialista ANC-MP";

  const elReg = document.getElementById("cfg-usuario-regimen");
  if (elReg && p.regimen_vinculo) {
    if (!Array.from(elReg.options).some(o => o.value === p.regimen_vinculo)) {
      const opt = document.createElement("option");
      opt.value = p.regimen_vinculo;
      opt.textContent = p.regimen_vinculo;
      elReg.appendChild(opt);
    }
    elReg.value = p.regimen_vinculo;
  }

  if (document.getElementById("cfg-usuario-rol")) document.getElementById("cfg-usuario-rol").value = p.rol_sistema;
  if (document.getElementById("cfg-gastos-operativos")) document.getElementById("cfg-gastos-operativos").checked = Boolean(p.percibe_gastos_operativos);

  if (document.getElementById("cfg-anio-fiscal")) document.getElementById("cfg-anio-fiscal").value = cfg.anio_fiscal;
  if (document.getElementById("cfg-valor-uit")) document.getElementById("cfg-valor-uit").value = cfg.valor_uit;
  if (document.getElementById("cfg-tc-usd")) document.getElementById("cfg-tc-usd").value = cfg.tipo_cambio_usd;
  if (document.getElementById("cfg-tope-viaticos")) document.getElementById("cfg-tope-viaticos").value = cfg.tope_viaticos_caja_chica;

  recalcularTablaTopesUIT();
}

window.filtrarUnidadesPorCategoria = function() {
  poblarSelectoresUnidadesSinResetearCampos();
  alCambiarUnidadSeleccionada();
};

window.alCambiarUnidadSeleccionada = function() {
  const cod = document.getElementById("cfg-select-unidad")?.value;
  const lista = window.ANC_STATE.unidades.length > 0 ? window.ANC_STATE.unidades : ROF_FALLBACK;
  const u = lista.find((item) => item.codigo === cod);
  if (u) {
    if (!window.estaCajaChicaAperturada()) {
      document.getElementById("cfg-saldo-caja").value = u.saldo_caja_chica_actual;
    }
    document.getElementById("cfg-saldo-viaticos").value = u.saldo_viaticos_actual;
  }
};

window.verificarCambioRolAdmin = function() {
  const rolSel = document.getElementById("cfg-usuario-rol");
  if (rolSel && (rolSel.value === "ADMINISTRADOR" || rolSel.value === "JEFATURA")) {
    const pin = prompt("🔐 Ingresa la clave institucional de Jefatura / Administración (Por defecto: 2026):", "");
    if (String(pin || "").trim() !== String(window.ANC_STATE.config.pin_administrador)) {
      alert("❌ Clave incorrecta. Se mantiene el perfil personal de Fiscal / Comisionado (solo visualizas tus propios trámites).");
      rolSel.value = "OPERADOR";
    }
  }
};

window.recalcularTablaTopesUIT = function() {
  const uit = Number(document.getElementById("cfg-valor-uit")?.value || window.ANC_STATE.config.valor_uit);
  const div = document.getElementById("resumen-topes-uit-dinamico");
  if (!div) return;

  div.innerHTML = `
    <div style="font-weight:800; color:#0F172A; margin-bottom:6px;">Límites automáticos vigentes con UIT = ${window.fmtSoles(uit)}:</div>
    <div style="display:grid; grid-template-columns:1fr 1fr; gap:6px; color:#334155;">
      <div>• <strong>Máximo por Factura/Boleta (20% UIT):</strong> ${window.fmtSoles(uit * 0.20)}</div>
      <div>• <strong>Reuniones de Trabajo (10% UIT):</strong> ${window.fmtSoles(uit * 0.10)}</div>
      <div>• <strong>Menaje o Arreglos (0.5 UIT):</strong> ${window.fmtSoles(uit * 0.50)}</div>
      <div>• <strong>Tope Anual por Rubro (8 UIT):</strong> ${window.fmtSoles(uit * 8)}</div>
    </div>
  `;
};

window.guardarPerfilYDependencia = async function() {
  const cod = document.getElementById("cfg-select-unidad").value;
  const lista = window.ANC_STATE.unidades.length > 0 ? window.ANC_STATE.unidades : ROF_FALLBACK;
  const u = lista.find((item) => item.codigo === cod) || lista[0];

  const nuevoSaldoCaja = Number(document.getElementById("cfg-saldo-caja").value) || 0;
  const nuevoSaldoViaticos = Number(document.getElementById("cfg-saldo-viaticos").value) || 0;
  const rolElegido = document.getElementById("cfg-usuario-rol").value;

  window.ANC_STATE.perfilActivo = {
    unidad_id: u.id,
    codigo_dependencia: u.codigo,
    categoria_rof: u.categoria_rof,
    nombre_dependencia: u.nombre_dependencia,
    es_adc: Boolean(u.es_adc),
    sede_ubicacion: u.sede_ubicacion,
    presupuesto_caja_chica: window.estaCajaChicaAperturada() ? window.ANC_STATE.fondoCajaUnica.montoFijoApertura : Number(u.presupuesto_caja_chica_mensual),
    saldo_caja_chica: nuevoSaldoCaja,
    presupuesto_viaticos: Number(u.presupuesto_viaticos_mensual),
    saldo_viaticos: nuevoSaldoViaticos,
    usuario_nombre: document.getElementById("cfg-usuario-nombre").value.trim() || "Usuario Operador ANC",
    usuario_dni: document.getElementById("cfg-usuario-dni").value.trim() || "45000001",
    usuario_cargo: document.getElementById("cfg-usuario-cargo")?.value.trim() || "Fiscal / Especialista ANC-MP",
    regimen_vinculo: document.getElementById("cfg-usuario-regimen").value,
    percibe_gastos_operativos: document.getElementById("cfg-gastos-operativos").checked,
    rol_sistema: rolElegido
  };

  u.saldo_caja_chica_actual = nuevoSaldoCaja;
  u.saldo_viaticos_actual = nuevoSaldoViaticos;
  guardarEstadoEnLocalStorage();
  actualizarCabeceraYMenu();

  await window.SupabaseANC.request(
    "anc_unidades_organicas",
    "PATCH",
    `codigo=eq.${encodeURIComponent(u.codigo)}`,
    { saldo_caja_chica_actual: nuevoSaldoCaja, saldo_viaticos_actual: nuevoSaldoViaticos }
  );

  if (typeof window.cargarDatosModuloCaja === "function") window.cargarDatosModuloCaja();
  if (typeof window.cargarDatosModuloViaticos === "function") window.cargarDatosModuloViaticos();

  alert(`✅ Tu perfil ha sido actualizado:\n• Servidor: ${window.ANC_STATE.perfilActivo.usuario_nombre} (DNI: ${window.ANC_STATE.perfilActivo.usuario_dni})\n• Cargo: ${window.ANC_STATE.perfilActivo.usuario_cargo}\n• Despacho: ${u.nombre_dependencia}`);
  navegarVista("inicio");
};

window.guardarParametrosUITSupabase = async function() {
  if (!window.validarPinJefaturaOAdmin("actualizar los valores anuales de la UIT")) return;

  const anio = Number(document.getElementById("cfg-anio-fiscal").value) || 2026;
  const uit = Number(document.getElementById("cfg-valor-uit").value) || 5350.00;
  const tc = Number(document.getElementById("cfg-tc-usd").value) || 3.750;
  const topeViat = Number(document.getElementById("cfg-tope-viaticos").value) || 2000.00;

  window.ANC_STATE.config.anio_fiscal = anio;
  window.ANC_STATE.config.valor_uit = uit;
  window.ANC_STATE.config.tipo_cambio_usd = tc;
  window.ANC_STATE.config.tope_viaticos_caja_chica = topeViat;

  guardarEstadoEnLocalStorage();
  actualizarCabeceraYMenu();
  recalcularTablaTopesUIT();

  await window.SupabaseANC.request(
    "anc_configuracion",
    "PATCH",
    `id=eq.${window.ANC_STATE.config.id || 1}`,
    { anio_fiscal: anio, valor_uit: uit, tipo_cambio_usd: tc, tope_viaticos_caja_chica: topeViat }
  );

  alert(`✅ Valores anuales actualizados:\n• UIT ${anio}: ${window.fmtSoles(uit)}\n• Límite máximo por comprobante (20% UIT): ${window.fmtSoles(uit * 0.20)}`);
};