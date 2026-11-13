// =========================================================================================
// ETAPA 3 (RENOVADA): GESTOR DE ESTADO, INTERFAZ CÁLIDA MÓVIL, PRIVACIDAD POR DNI Y ROF
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
    regimen_vinculo: "D.L. 728",
    percibe_gastos_operativos: false,
    rol_sistema: "OPERADOR" // 'OPERADOR', 'JEFATURA', 'ADMINISTRADOR'
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
// FUNCIONES DE SEGURIDAD, PRIVACIDAD POR USUARIO (DNI) Y ROLES (JEFATURA / ADMINISTRADOR)
// =========================================================================================

// Verifica si el usuario activo tiene privilegios de Administrador General (con clave/PIN)
window.esAdministradorActivo = function() {
  return window.ANC_STATE?.perfilActivo?.rol_sistema === "ADMINISTRADOR";
};

// Verifica si el usuario activo es Jefatura o Administrador (puede habilitar/bloquear rendiciones)
window.puedeHabilitarRendicion = function() {
  const rol = window.ANC_STATE?.perfilActivo?.rol_sistema || "OPERADOR";
  const cod = window.ANC_STATE?.perfilActivo?.codigo_dependencia || "";
  return rol === "ADMINISTRADOR" || rol === "JEFATURA" || cod === "AD-JEF" || cod === "AD-OCA";
};

// Solicita validación de PIN para acciones exclusivas de Jefatura o Administrador si aún es Operador
window.validarPinJefaturaOAdmin = function(accionDesc = "autorizar esta gestión") {
  if (window.puedeHabilitarRendicion()) return true;
  const pin = prompt(`🔐 Se requiere autorización de JEFATURA o ADMINISTRACIÓN para ${accionDesc}.\nPor favor, ingresa la clave institucional:`, "");
  if (pin !== null && String(pin).trim() === String(window.ANC_STATE?.config?.pin_administrador || "2026")) {
    return true;
  }
  alert("❌ Clave incorrecta o acción cancelada.");
  return false;
};

// Verifica estrictamente si un gasto de Caja Chica o Comisión pertenece al usuario activo en su equipo
window.esRegistroDelUsuarioActivo = function(item) {
  if (!item) return false;
  if (window.esAdministradorActivo()) return true;

  const p = window.ANC_STATE?.perfilActivo || {};
  const miDni = String(p.usuario_dni || "").trim().toLowerCase();
  const miNombre = String(p.usuario_nombre || "").trim().toLowerCase();

  // 1. Coincidencia en Gastos de Caja Chica (registrado por el propio usuario o con su DNI)
  const regDniUsuario = String(item.usuario_dni_registro || "").trim().toLowerCase();
  const regUsuario = String(item.usuario_registro || "").trim().toLowerCase();
  const regDniRuc = String(item.ruc_dni_proveedor || "").trim().toLowerCase();

  if (miDni && (regDniUsuario === miDni || regDniRuc === miDni || regUsuario.includes(miDni))) {
    return true;
  }
  if (miNombre && regUsuario && regUsuario === miNombre) {
    return true;
  }

  // 2. Coincidencia en Comisiones de Viáticos (creada por el usuario o donde está incluido por su DNI)
  const creadorDni = String(item.usuario_creador_dni || "").trim().toLowerCase();
  const creadorNom = String(item.usuario_creador || "").trim().toLowerCase();

  if (miDni && creadorDni === miDni) return true;
  if (miNombre && creadorNom && creadorNom === miNombre) return true;

  // Si el usuario tiene rol JEFATURA y la comisión pertenece a su dependencia o la gestiona
  if (p.rol_sistema === "JEFATURA" && (Number(item.unidad_organica_id) === Number(p.unidad_id) || item.codigo_dependencia === p.codigo_dependencia)) {
    return true;
  }

  // Verificar si el DNI o nombre del usuario activo figura dentro de la lista de comisionados
  if (Array.isArray(item.comisionados)) {
    const estaIncluido = item.comisionados.some(c => {
      const cDni = String(c?.com?.dni || c?.dni_comisionado || "").trim().toLowerCase();
      const cNom = String(c?.com?.nombres || c?.apellidos_nombres || "").trim().toLowerCase();
      return (miDni && cDni === miDni) || (miNombre && cNom && cNom === miNombre);
    });
    if (estaIncluido) return true;
  }

  return false;
};

// =========================================================================================
// INYECCIÓN AUTOMÁTICA DE ESTILOS CÁLIDOS, TIPOGRAFÍA SUAVE Y ENCUADRE MÓVIL
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
    /* Cabecera superior cálida Ámbar / Dorado suave */
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
    /* Contenedor principal 100% encuadrado sin salirse a los costados */
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
    /* Tarjetas de inicio con bordes redondeados suaves (24px) y colores pastel cálidos */
    .home-action-card {
      border-radius: 24px !important;
      border-width: 1.5px !important;
      box-shadow: 0 6px 18px rgba(15, 23, 42, 0.05) !important;
    }
    .home-action-card.card-amber {
      background-color: #FFFDF5 !important;
      border-color: #FDE68A !important;
    }
    .home-action-card.card-emerald,
    .home-action-card.card-mint {
      background-color: #F2FBF7 !important;
      border-color: #A7F3D0 !important;
    }
    .home-action-card.card-blue,
    .home-action-card.card-sky {
      background-color: #F0F8FF !important;
      border-color: #BAE6FD !important;
    }
    .home-action-card.card-coral,
    .home-action-card.card-rose {
      background-color: #FFF5F6 !important;
      border-color: #FECDD3 !important;
    }
    .home-action-card.card-lavender {
      background-color: #F5F3FF !important;
      border-color: #DDD6FE !important;
    }
    .home-action-card.card-navy,
    .home-action-card.card-pearl {
      background-color: #F8FAFC !important;
      border-color: #CBD5E1 !important;
    }
    div[style*="grid-template-columns"] {
      max-width: 100% !important;
      box-sizing: border-box !important;
    }
    @media (max-width: 480px) {
      div[style*="grid-template-columns:1fr 1fr 1fr"],
      div[style*="grid-template-columns: 1fr 1fr 1fr"],
      div[style*="grid-template-columns:1.4fr 1fr 1fr"],
      div[style*="grid-template-columns:1.5fr 1fr 1fr"],
      div[style*="grid-template-columns:1fr 1.4fr 1.2fr"] {
        grid-template-columns: 1fr !important;
      }
      div[style*="grid-template-columns:repeat(4, 1fr)"],
      div[style*="grid-template-columns:1fr 1fr 1fr 1fr"],
      div[style*="grid-template-columns:2fr 1fr"] {
        grid-template-columns: 1fr 1fr !important;
      }
      .anc-list-table {
        width: 100% !important;
        table-layout: fixed !important;
      }
      .anc-list-table th, .anc-list-table td {
        padding: 8px 5px !important;
        font-size: 0.74rem !important;
        word-break: break-word !important;
      }
    }
  `;
  document.head.appendChild(styleEl);

  // Asegurar ícono vectorial SVG Oficial de WhatsApp en la cabecera y en el Drawer
  const svgWhatsAppOficial = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="19" height="19" fill="#FFFFFF" style="vertical-align:middle; flex-shrink:0;"><path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/></svg>`;

  const btnTopWa = document.getElementById("btn-top-whatsapp");
  if (btnTopWa) {
    btnTopWa.innerHTML = svgWhatsAppOficial;
  }
  document.querySelectorAll(".btn-share-whatsapp").forEach(btn => {
    btn.innerHTML = `${svgWhatsAppOficial} <span>Compartir Instalador por WhatsApp</span>`;
  });
}

// Inicialización al cargar la PWA
document.addEventListener("DOMContentLoaded", async () => {
  aplicarParcheVisualInstitucionalANC();
  cargarPerfilDesdeLocalStorage();
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
    window.ANC_STATE.perfilActivo.presupuesto_caja_chica = Number(unidadEncontrada.presupuesto_caja_chica_mensual);
    window.ANC_STATE.perfilActivo.saldo_caja_chica = Number(unidadEncontrada.saldo_caja_chica_actual);
    window.ANC_STATE.perfilActivo.presupuesto_viaticos = Number(unidadEncontrada.presupuesto_viaticos_mensual);
    window.ANC_STATE.perfilActivo.saldo_viaticos = Number(unidadEncontrada.saldo_viaticos_actual);
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

  // 1. Subtítulo superior de la cabecera
  const sub = document.getElementById("header-subtitle");
  if (sub) {
    sub.innerHTML = `${p.codigo_dependencia} • Disponible Caja: <strong>${window.fmtSoles(p.saldo_caja_chica)}</strong>`;
  }

  // 2. Barra integrada compacta "MI PERFIL: [ Nombre del Fiscal / Despacho ]" en la cabecera
  const barPerfil = document.getElementById("header-profile-summary");
  if (barPerfil) {
    barPerfil.innerHTML = `<strong>MI PERFIL:</strong> ${p.usuario_nombre} • ${p.nombre_dependencia}`;
  }

  // 3. Subtítulo de usuario dentro del Menú Lateral ("PANEL DE OPCIONES")
  const drawerUser = document.getElementById("drawer-user-subtitle");
  if (drawerUser) {
    drawerUser.innerHTML = `👤 <strong>${p.usuario_nombre}</strong> (DNI: ${p.usuario_dni})<br/><span style="font-size:0.72rem; color:#475569;">🏛️ ${p.nombre_dependencia}</span>`;
  }

  const lblUitMenu = document.getElementById("lbl-menu-uit");
  if (lblUitMenu) lblUitMenu.textContent = `S/ ${Number(cfg.valor_uit).toLocaleString("es-PE")}`;

  const lblTopeModal = document.getElementById("lbl-tope-modal");
  if (lblTopeModal) lblTopeModal.textContent = Number(tope20Pct).toLocaleString("es-PE", { minimumFractionDigits: 2 });

  // 4. Tarjeta cálida de bienvenida y resumen de despacho en la pantalla de Inicio
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
          Tus trámites son privados: en este equipo solo visualizarás las comisiones y gastos registrados con tu DNI.
        </p>
      </div>
      <span id="badge-conexion-supabase" class="badge-semaforo badge-verde">✓ Listo</span>
    </div>

    <!-- BLOQUE 1: IDENTIDAD DEL FISCAL / MAGISTRADO / SERVIDOR Y DESPACHO -->
    <div style="background:#FFFDF5; border:1.5px solid #FDE68A; border-radius:20px; padding:14px; margin-bottom:16px;">
      <h3 style="font-size:0.95rem; font-weight:800; color:#0F172A; margin-bottom:10px;">
        🏛️ 1. Mis Datos Personales y Despacho Actual
      </h3>

      <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-bottom:10px;">
        <div>
          <label style="display:block; font-size:0.73rem; font-weight:800; color:#334155; margin-bottom:3px;">APELLIDOS Y NOMBRES:</label>
          <input type="text" id="cfg-usuario-nombre" placeholder="Ej: Dr. Carlos Mendoza" style="width:100%; padding:9px 10px; border-radius:12px; border:1.5px solid #CBD5E1; font-weight:700; font-size:0.84rem; background:#FFFFFF;" />
        </div>
        <div>
          <label style="display:block; font-size:0.73rem; font-weight:800; color:#334155; margin-bottom:3px;">N° DE DNI (Clave de privacidad):</label>
          <input type="text" id="cfg-usuario-dni" maxlength="12" placeholder="8 dígitos" style="width:100%; padding:9px 10px; border-radius:12px; border:1.5px solid #F59E0B; font-weight:800; font-size:0.84rem; background:#FFFFFF;" />
        </div>
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

    <!-- BLOQUE 2: PARÁMETROS INSTITUCIONALES (VALOR DE LA UIT Y TIPO DE CAMBIO) -->
    <div style="background:#F8FAFC; border:1.5px solid #E2E8F0; border-radius:20px; padding:14px;">
      <h3 style="font-size:0.92rem; font-weight:800; color:#0F172A; margin-bottom:4px;">
        📐 2. Valores de Referencia Anual (UIT y Tipo de Cambio)
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
}

function poblarSelectoresConfiguracion() {
  const selectUnidad = document.getElementById("cfg-select-unidad");
  if (!selectUnidad) return;

  const filtroCat = document.getElementById("cfg-filtro-categoria-rof")?.value || "TODAS";
  const lista = window.ANC_STATE.unidades.length > 0 ? window.ANC_STATE.unidades : ROF_FALLBACK;
  const filtradas = filtroCat === "TODAS" ? lista : lista.filter((u) => u.categoria_rof === filtroCat);

  selectUnidad.innerHTML = filtradas.map((u) => {
    const sel = (Number(u.id) === Number(window.ANC_STATE.perfilActivo.unidad_id) || u.codigo === window.ANC_STATE.perfilActivo.codigo_dependencia) ? "selected" : "";
    return `<option value="${u.codigo}" ${sel}>[${u.codigo}] ${u.nombre_dependencia}</option>`;
  }).join("");

  const p = window.ANC_STATE.perfilActivo;
  const cfg = window.ANC_STATE.config;

  if (document.getElementById("cfg-saldo-caja")) document.getElementById("cfg-saldo-caja").value = p.saldo_caja_chica;
  if (document.getElementById("cfg-saldo-viaticos")) document.getElementById("cfg-saldo-viaticos").value = p.saldo_viaticos;
  if (document.getElementById("cfg-usuario-nombre")) document.getElementById("cfg-usuario-nombre").value = p.usuario_nombre;
  if (document.getElementById("cfg-usuario-dni")) document.getElementById("cfg-usuario-dni").value = p.usuario_dni;
  if (document.getElementById("cfg-usuario-regimen")) document.getElementById("cfg-usuario-regimen").value = p.regimen_vinculo;
  if (document.getElementById("cfg-usuario-rol")) document.getElementById("cfg-usuario-rol").value = p.rol_sistema;
  if (document.getElementById("cfg-gastos-operativos")) document.getElementById("cfg-gastos-operativos").checked = Boolean(p.percibe_gastos_operativos);

  if (document.getElementById("cfg-anio-fiscal")) document.getElementById("cfg-anio-fiscal").value = cfg.anio_fiscal;
  if (document.getElementById("cfg-valor-uit")) document.getElementById("cfg-valor-uit").value = cfg.valor_uit;
  if (document.getElementById("cfg-tc-usd")) document.getElementById("cfg-tc-usd").value = cfg.tipo_cambio_usd;
  if (document.getElementById("cfg-tope-viaticos")) document.getElementById("cfg-tope-viaticos").value = cfg.tope_viaticos_caja_chica;

  recalcularTablaTopesUIT();
}

window.filtrarUnidadesPorCategoria = function() {
  poblarSelectoresConfiguracion();
  alCambiarUnidadSeleccionada();
};

window.alCambiarUnidadSeleccionada = function() {
  const cod = document.getElementById("cfg-select-unidad")?.value;
  const lista = window.ANC_STATE.unidades.length > 0 ? window.ANC_STATE.unidades : ROF_FALLBACK;
  const u = lista.find((item) => item.codigo === cod);
  if (u) {
    document.getElementById("cfg-saldo-caja").value = u.saldo_caja_chica_actual;
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
    presupuesto_caja_chica: Number(u.presupuesto_caja_chica_mensual),
    saldo_caja_chica: nuevoSaldoCaja,
    presupuesto_viaticos: Number(u.presupuesto_viaticos_mensual),
    saldo_viaticos: nuevoSaldoViaticos,
    usuario_nombre: document.getElementById("cfg-usuario-nombre").value.trim() || "Usuario Operador ANC",
    usuario_dni: document.getElementById("cfg-usuario-dni").value.trim() || "45000001",
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

  alert(`✅ Tu perfil ha sido actualizado:\n• Nombre: ${window.ANC_STATE.perfilActivo.usuario_nombre} (DNI: ${window.ANC_STATE.perfilActivo.usuario_dni})\n• Despacho: ${u.nombre_dependencia}`);
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