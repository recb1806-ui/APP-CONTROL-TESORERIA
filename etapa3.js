// =========================================================================================
// ETAPA 3 (ACTUALIZADA): GESTOR DE ESTADO, AJUSTE VISUAL MÓVIL, PRIVACIDAD POR USUARIO Y ROF
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
window.validarPinJefaturaOAdmin = function(accionDesc = "autorizar esta operación") {
  if (window.puedeHabilitarRendicion()) return true;
  const pin = prompt(`🔐 Se requiere autorización de JEFATURA o ADMINISTRADOR para ${accionDesc}.\nIngrese la Clave / PIN institucional:`, "");
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
// INYECCIÓN AUTOMÁTICA DE ESTILOS VISUALES SUAVES, CABECERA COMPACTA Y ENCUADRE MÓVIL
// =========================================================================================
function aplicarParcheVisualInstitucionalANC() {
  if (document.getElementById("anc-style-patch-v2")) return;

  const styleEl = document.createElement("style");
  styleEl.id = "anc-style-patch-v2";
  styleEl.textContent = `
    :root {
      --anc-navy: #0B2545;
      --anc-blue-soft: #134074;
      --anc-gold: #D4AF37;
      --anc-gold-warm: #EAB308;
      --anc-bg-warm: #F4F6F9;
      --anc-card-border: #DCE3EC;
    }
    html, body {
      max-width: 100vw !important;
      overflow-x: hidden !important;
      background-color: var(--anc-bg-warm) !important;
      color: #1E293B !important;
    }
    /* Cabecera superior compacta (64px-72px) con línea dorada fina */
    .app-header {
      background: linear-gradient(135deg, #0B2545 0%, #134074 100%) !important;
      color: #FFFFFF !important;
      padding: 8px 12px !important;
      min-height: 64px !important;
      max-height: 72px !important;
      border-bottom: 2.5px solid #D4AF37 !important;
      box-shadow: 0 2px 10px rgba(11, 37, 69, 0.18) !important;
    }
    .header-top-row {
      align-items: center !important;
      gap: 8px !important;
      width: 100% !important;
    }
    .header-brand-group {
      align-items: center !important;
      gap: 9px !important;
      min-width: 0 !important;
      flex: 1 !important;
    }
    .header-logo {
      width: 38px !important;
      height: 38px !important;
      border-radius: 9px !important;
      border: 1.5px solid #D4AF37 !important;
      background: #0B2545 !important;
    }
    .header-titles {
      min-width: 0 !important;
      flex: 1 !important;
    }
    .header-view-title {
      font-size: 1.05rem !important;
      font-weight: 800 !important;
      color: #FFFFFF !important;
      white-space: nowrap !important;
      overflow: hidden !important;
      text-overflow: ellipsis !important;
      line-height: 1.15 !important;
    }
    .header-subtitle {
      font-size: 0.72rem !important;
      font-weight: 600 !important;
      color: #E2E8F0 !important;
      line-height: 1.2 !important;
      margin-top: 2px !important;
      white-space: nowrap !important;
      overflow: hidden !important;
      text-overflow: ellipsis !important;
    }
    .header-Quick-actions {
      gap: 6px !important;
      flex-shrink: 0 !important;
    }
    .btn-header-square {
      width: 36px !important;
      height: 36px !important;
      border-radius: 10px !important;
      border: 1.5px solid rgba(255,255,255,0.28) !important;
      background-color: rgba(255,255,255,0.12) !important;
      color: #F8FAFC !important;
      font-size: 1rem !important;
    }
    .btn-header-square.active-home {
      background-color: #D4AF37 !important;
      color: #0B2545 !important;
      border-color: #FFFFFF !important;
    }
    .btn-header-square.btn-whatsapp-top {
      background-color: #25D366 !important;
      border-color: #FFFFFF !important;
      padding: 6px !important;
    }
    /* Pestaña lateral > MENÚ discreta que no invade el texto de las tarjetas */
    .floating-menu-tab {
      top: 76px !important;
      transform: none !important;
      padding: 6px 5px !important;
      border-radius: 0 10px 10px 0 !important;
      background-color: #0B2545 !important;
      border: 1.5px solid #D4AF37 !important;
      border-left: none !important;
      opacity: 0.92 !important;
    }
    .floating-menu-tab .tab-arrow { font-size: 0.95rem !important; }
    .floating-menu-tab .tab-text { font-size: 0.58rem !important; }

    /* Contenedor principal 100% encuadrado sin salirse a los costados */
    .main-container {
      width: 100% !important;
      max-width: 540px !important;
      margin: 0 auto !important;
      padding: 14px 12px 44px 12px !important;
      overflow-x: hidden !important;
    }
    .content-surface-card {
      padding: 14px 12px !important;
      border-radius: 18px !important;
      border: 1px solid var(--anc-card-border) !important;
      box-shadow: 0 3px 12px rgba(11, 37, 69, 0.05) !important;
      overflow-x: hidden !important;
      max-width: 100% !important;
    }
    /* Tarjetas de inicio con colores suaves, cálidos y amigables */
    .home-action-card {
      padding: 18px 14px !important;
      border-radius: 18px !important;
      border-width: 1.5px !important;
    }
    .home-action-card.card-amber {
      background-color: #FAF6EE !important;
      border-color: #E6D5B8 !important;
    }
    .home-action-card.card-emerald {
      background-color: #F2F9F6 !important;
      border-color: #B8E0D2 !important;
    }
    .home-action-card.card-blue {
      background-color: #F2F6FC !important;
      border-color: #C2D6F0 !important;
    }
    .home-action-card.card-navy {
      background-color: #F4F5F8 !important;
      border-color: #CBD5E1 !important;
    }
    .card-icon-box {
      width: 60px !important;
      height: 60px !important;
      border-radius: 16px !important;
      font-size: 1.7rem !important;
      margin-bottom: 10px !important;
    }
    .card-title { font-size: 1.08rem !important; }
    .card-desc { font-size: 0.83rem !important; }

    /* Regla anti-desborde para todos los inputs, selects y grillas en celulares */
    input, select, textarea, button {
      max-width: 100% !important;
      min-width: 0 !important;
      box-sizing: border-box !important;
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
      badgeEstado.textContent = `✓ Conectado (${resUnidades.data.length} Sedes ROF)`;
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

// Cabecera Superior Compacta y Estilizada: 1 sola línea resumida (Sede • Usuario • Saldo Caja Chica)
window.actualizarCabeceraYMenu = function() {
  const cfg = window.ANC_STATE.config;
  const p = window.ANC_STATE.perfilActivo;
  const tope20Pct = (cfg.valor_uit * (cfg.porcentaje_tope_caja_chica / 100)).toFixed(2);

  const sub = document.getElementById("header-subtitle");
  if (sub) {
    sub.innerHTML = `${p.codigo_dependencia} • ${p.usuario_nombre} • Caja: <strong>${window.fmtSoles(p.saldo_caja_chica)}</strong>`;
  }

  const lblUitMenu = document.getElementById("lbl-menu-uit");
  if (lblUitMenu) lblUitMenu.textContent = `S/ ${Number(cfg.valor_uit).toLocaleString("es-PE")}`;

  const lblTopeModal = document.getElementById("lbl-tope-modal");
  if (lblTopeModal) lblTopeModal.textContent = Number(tope20Pct).toLocaleString("es-PE", { minimumFractionDigits: 2 });

  const bannerResumenInicio = document.getElementById("banner-resumen-dependencia");
  if (bannerResumenInicio) {
    const etiqRol = p.rol_sistema === "ADMINISTRADOR"
      ? `<span class="badge-semaforo badge-verde" style="font-size:0.66rem;">🛡️ ADMIN NACIONAL</span>`
      : (p.rol_sistema === "JEFATURA"
        ? `<span class="badge-semaforo badge-amarillo" style="font-size:0.66rem;">🏛️ JEFATURA</span>`
        : `<span class="badge-semaforo" style="background:#E2E8F0; color:#0B2545; font-size:0.66rem;">👤 PRIVADO (DNI: ${p.usuario_dni})</span>`);

    bannerResumenInicio.style.background = "#FFFFFF";
    bannerResumenInicio.style.border = "1.5px solid #DCE3EC";
    bannerResumenInicio.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
        <div style="min-width:0; flex:1;">
          <div style="font-size:0.7rem; font-weight:800; color:#0B2545; text-transform:uppercase; display:flex; align-items:center; gap:6px; flex-wrap:wrap;">
            <span>${p.codigo_dependencia} • ${p.nombre_dependencia}</span>
            ${etiqRol}
          </div>
          <div style="font-size:0.76rem; color:#475569; font-weight:600; margin-top:3px;">
            👤 <strong>${p.usuario_nombre}</strong> • UIT: <strong>${window.fmtSoles(cfg.valor_uit)}</strong> • Tope 20%: <strong>${window.fmtSoles(tope20Pct)}</strong>
          </div>
        </div>
        <button type="button" onclick="navegarVista('config')" style="background:#0B2545; color:#D4AF37; border:1px solid #D4AF37; border-radius:9px; padding:7px 11px; font-size:0.74rem; font-weight:800; cursor:pointer; flex-shrink:0;">
          ⚙️ Mi Perfil / Sede
        </button>
      </div>
    `;
  }
};

function renderizarModuloConfiguracion() {
  const cont = document.getElementById("contenedor-modulo-config");
  if (!cont) return;

  cont.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; margin-bottom:12px;">
      <div>
        <h2 style="font-size:1.12rem; font-weight:900; color:#0B2545;">⚙️ Mi Perfil, Sede ROF y Parámetros UIT</h2>
        <p style="font-size:0.76rem; color:#475569; font-weight:600;">
          Privacidad activa: cada usuario visualiza únicamente los registros asociados a su propio DNI.
        </p>
      </div>
      <span id="badge-conexion-supabase" class="badge-semaforo badge-verde">✓ Listo</span>
    </div>

    <!-- BLOQUE 1: IDENTIDAD DEL USUARIO Y DEPENDENCIA ROF -->
    <div style="background:#F8FAFC; border:1.5px solid #DCE3EC; border-radius:14px; padding:12px; margin-bottom:14px;">
      <h3 style="font-size:0.9rem; font-weight:900; color:#0B2545; margin-bottom:10px;">
        👤 1. Identificación del Usuario y Dependencia Activa
      </h3>

      <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-bottom:10px;">
        <div>
          <label style="display:block; font-size:0.72rem; font-weight:800; color:#334155; margin-bottom:3px;">APELLIDOS Y NOMBRES:</label>
          <input type="text" id="cfg-usuario-nombre" placeholder="Ej: Juan Pérez" style="width:100%; padding:9px; border-radius:8px; border:1px solid #94A3B8; font-weight:700; font-size:0.83rem;" />
        </div>
        <div>
          <label style="display:block; font-size:0.72rem; font-weight:800; color:#334155; margin-bottom:3px;">DNI N° (Identificador Único):</label>
          <input type="text" id="cfg-usuario-dni" maxlength="12" placeholder="8 dígitos" style="width:100%; padding:9px; border-radius:8px; border:1.5px solid #0B2545; font-weight:800; font-size:0.83rem;" />
        </div>
      </div>

      <div style="margin-bottom:10px;">
        <label style="display:block; font-size:0.72rem; font-weight:800; color:#334155; margin-bottom:3px;">FILTRAR ÓRGANO DEL ROF ANC-MP:</label>
        <select id="cfg-filtro-categoria-rof" onchange="filtrarUnidadesPorCategoria()" style="width:100%; padding:9px; border-radius:8px; border:1px solid #94A3B8; font-weight:700; font-size:0.82rem; background:#FFF;">
          <option value="TODAS">-- Todas las Dependencias y 34 ADC (69 unidades) --</option>
          <option value="A. Órganos de Alta Dirección">A. Órganos de Alta Dirección (Jefatura / OCA)</option>
          <option value="B.1 Órganos de Asesoramiento">B.1 Órganos de Asesoramiento (OAJ / OPP)</option>
          <option value="B.2 Órganos de Apoyo">B.2 Órganos de Apoyo (OAF, Abastecimiento, Contabilidad, Tesorería, RRHH, OTI)</option>
          <option value="C. Órganos de Línea">C. Órganos de Línea (Gestión Funcional, PAD, Apelaciones)</option>
          <option value="D. Órganos Desconcentrados (ADC)">D. Órganos Desconcentrados (Las 34 ADC a Nivel Nacional)</option>
        </select>
      </div>

      <div style="margin-bottom:10px;">
        <label style="display:block; font-size:0.72rem; font-weight:800; color:#334155; margin-bottom:3px;">UNIDAD ORGÁNICA O ADC ACTIVA:</label>
        <select id="cfg-select-unidad" onchange="alCambiarUnidadSeleccionada()" style="width:100%; padding:9px; border-radius:8px; border:1.5px solid #0B2545; font-weight:800; font-size:0.83rem; background:#FFFFFF; color:#0B2545;"></select>
      </div>

      <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-bottom:10px;">
        <div>
          <label style="display:block; font-size:0.72rem; font-weight:800; color:#334155; margin-bottom:3px;">RÉGIMEN / MODALIDAD:</label>
          <select id="cfg-usuario-regimen" style="width:100%; padding:9px; border-radius:8px; border:1px solid #94A3B8; font-weight:700; font-size:0.81rem;">
            <option value="D.L. 728">D.L. N° 728</option>
            <option value="Carrera Fiscal (Ley 30483)">Carrera Fiscal</option>
            <option value="D.L. 276">D.L. N° 276</option>
            <option value="D.L. 1057 (CAS)">D.L. N° 1057 (CAS)</option>
            <option value="Locador / Proveedor de Servicios">Locador / Proveedor</option>
          </select>
        </div>
        <div>
          <label style="display:block; font-size:0.72rem; font-weight:800; color:#334155; margin-bottom:3px;">NIVEL DE ACCESO / ROL:</label>
          <select id="cfg-usuario-rol" onchange="verificarCambioRolAdmin()" style="width:100%; padding:9px; border-radius:8px; border:1.5px solid #0B2545; font-weight:800; font-size:0.81rem; background:#F1F5F9;">
            <option value="OPERADOR">👤 Usuario Operador (Solo ve lo suyo)</option>
            <option value="JEFATURA">🏛️ Jefatura (Habilita Rendiciones)</option>
            <option value="ADMINISTRADOR">🛡️ Administrador General (Con Clave)</option>
          </select>
        </div>
      </div>

      <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-bottom:10px;">
        <div>
          <label style="display:block; font-size:0.72rem; font-weight:800; color:#334155; margin-bottom:3px;">SALDO CAJA CHICA (S/):</label>
          <input type="number" id="cfg-saldo-caja" step="10" style="width:100%; padding:8px; border-radius:8px; border:1px solid #10B981; font-weight:800; font-size:0.85rem; background:#F2F9F6;" />
        </div>
        <div>
          <label style="display:block; font-size:0.72rem; font-weight:800; color:#334155; margin-bottom:3px;">SALDO VIÁTICOS (S/):</label>
          <input type="number" id="cfg-saldo-viaticos" step="10" style="width:100%; padding:8px; border-radius:8px; border:1px solid #3B82F6; font-weight:800; font-size:0.85rem; background:#F2F6FC;" />
        </div>
      </div>

      <label style="display:flex; align-items:center; gap:8px; font-size:0.76rem; font-weight:700; color:#991B1B; background:#FEF2F2; padding:8px 10px; border-radius:8px; border:1px solid #FCA5A5; margin-bottom:12px; cursor:pointer;">
        <input type="checkbox" id="cfg-gastos-operativos" style="width:16px; height:16px; flex-shrink:0;" />
        <span>Fiscal con Gastos Operativos (Bloquea Alimentos S/24 y Movilidad DJ según RFN 190-2022-MP-FN)</span>
      </label>

      <button type="button" onclick="guardarPerfilYDependencia()" style="width:100%; background:#0B2545; color:#FFFFFF; border:1px solid #D4AF37; border-radius:10px; padding:12px; font-size:0.86rem; font-weight:800; cursor:pointer;">
        💾 Guardar Mi Perfil y Dependencia Activa
      </button>
    </div>

    <!-- BLOQUE 2: PARÁMETROS ANUALES UIT Y TIPO DE CAMBIO -->
    <div style="background:#FAF6EE; border:1.5px solid #E6D5B8; border-radius:14px; padding:12px;">
      <h3 style="font-size:0.9rem; font-weight:900; color:#0B2545; margin-bottom:8px;">
        📐 2. Parámetros Anuales (UIT y Tipo de Cambio USD)
      </h3>

      <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-bottom:8px;">
        <div>
          <label style="display:block; font-size:0.72rem; font-weight:800; color:#334155; margin-bottom:3px;">AÑO FISCAL:</label>
          <input type="number" id="cfg-anio-fiscal" value="2026" style="width:100%; padding:8px; border-radius:8px; border:1px solid #CBD5E1; font-weight:800;" />
        </div>
        <div>
          <label style="display:block; font-size:0.72rem; font-weight:800; color:#334155; margin-bottom:3px;">VALOR UIT (S/):</label>
          <input type="number" id="cfg-valor-uit" step="50" oninput="recalcularTablaTopesUIT()" style="width:100%; padding:8px; border-radius:8px; border:1.5px solid #0B2545; font-weight:900; background:#FFF;" />
        </div>
      </div>

      <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-bottom:10px;">
        <div>
          <label style="display:block; font-size:0.72rem; font-weight:800; color:#334155; margin-bottom:3px;">T.C. USD (Bco. Nación):</label>
          <input type="number" id="cfg-tc-usd" step="0.005" style="width:100%; padding:8px; border-radius:8px; border:1px solid #CBD5E1; font-weight:800;" />
        </div>
        <div>
          <label style="display:block; font-size:0.72rem; font-weight:800; color:#334155; margin-bottom:3px;">TOPE VIÁTICOS CAJA (S/):</label>
          <input type="number" id="cfg-tope-viaticos" step="100" style="width:100%; padding:8px; border-radius:8px; border:1px solid #CBD5E1; font-weight:800;" />
        </div>
      </div>

      <div id="resumen-topes-uit-dinamico" style="background:#FFFFFF; border:1px solid #E2E8F0; border-radius:10px; padding:10px; margin-bottom:10px; font-size:0.75rem;"></div>

      <button type="button" onclick="guardarParametrosUITSupabase()" style="width:100%; background:#134074; color:#FFFFFF; border:none; border-radius:10px; padding:11px; font-size:0.85rem; font-weight:800; cursor:pointer;">
        🔄 Actualizar UIT y Parámetros en Supabase
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
    const pin = prompt("🔐 Ingrese Clave / PIN de autorización (Por defecto: 2026):", "");
    if (String(pin || "").trim() !== String(window.ANC_STATE.config.pin_administrador)) {
      alert("❌ Clave incorrecta. Se mantiene el perfil de Usuario Operador (solo visualiza sus propios registros).");
      rolSel.value = "OPERADOR";
    }
  }
};

window.recalcularTablaTopesUIT = function() {
  const uit = Number(document.getElementById("cfg-valor-uit")?.value || window.ANC_STATE.config.valor_uit);
  const div = document.getElementById("resumen-topes-uit-dinamico");
  if (!div) return;

  div.innerHTML = `
    <div style="font-weight:800; color:#0B2545; margin-bottom:4px;">Topes calculados con UIT = ${window.fmtSoles(uit)}:</div>
    <div style="display:grid; grid-template-columns:1fr 1fr; gap:4px; color:#334155;">
      <div>• <strong>20% UIT (Comprob.):</strong> ${window.fmtSoles(uit * 0.20)}</div>
      <div>• <strong>10% UIT (Reuniones):</strong> ${window.fmtSoles(uit * 0.10)}</div>
      <div>• <strong>0.5 UIT (Enseres/Flor.):</strong> ${window.fmtSoles(uit * 0.50)}</div>
      <div>• <strong>8 UIT (Rubros Anual):</strong> ${window.fmtSoles(uit * 8)}</div>
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

  alert(`✅ Perfil activo guardado:\nUsuario: ${window.ANC_STATE.perfilActivo.usuario_nombre} (DNI: ${window.ANC_STATE.perfilActivo.usuario_dni})\nDependencia: ${u.nombre_dependencia}\nNivel: ${window.ANC_STATE.perfilActivo.rol_sistema}`);
  navegarVista("inicio");
};

window.guardarParametrosUITSupabase = async function() {
  if (!window.validarPinJefaturaOAdmin("modificar parámetros anuales UIT")) return;

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

  alert(`✅ Parámetros actualizados:\n• UIT ${anio}: ${window.fmtSoles(uit)}\n• Tope 20%: ${window.fmtSoles(uit * 0.20)}`);
};