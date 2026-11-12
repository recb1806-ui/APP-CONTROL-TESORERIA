// =========================================================================================
// ETAPA 6 (PASO D3 OPTIMIZADO): VISTA PROPIA "ARQUEO DE CAJA" (ANEXOS 02, 14, 15 Y 16)
// + REGISTRO DETALLADO UNO A UNO DE VALES PROVISIONALES Y CÁLCULO DE FALTANTES / CUADRE
// + PANEL ADMINISTRADOR NACIONAL CON IMPRESIÓN LIMPIA (motor_anexos.js) - UE 012: ANC-MP
// =========================================================================================

window.ARQUEO_DENOMINACIONES = {
  monedas: [
    { val: 0.05, label: "S/ 0.05", cant: 0 },
    { val: 0.10, label: "S/ 0.10", cant: 0 },
    { val: 0.20, label: "S/ 0.20", cant: 0 },
    { val: 0.50, label: "S/ 0.50", cant: 0 },
    { val: 1.00, label: "S/ 1.00", cant: 0 },
    { val: 2.00, label: "S/ 2.00", cant: 0 },
    { val: 5.00, label: "S/ 5.00", cant: 0 }
  ],
  billetes: [
    { val: 10.00, label: "S/ 10.00", cant: 0 },
    { val: 20.00, label: "S/ 20.00", cant: 0 },
    { val: 50.00, label: "S/ 50.00", cant: 0 },
    { val: 100.00, label: "S/ 100.00", cant: 0 },
    { val: 200.00, label: "S/ 200.00", cant: 0 }
  ]
};

window.ARQUEO_VALES_PROVISIONALES = JSON.parse(localStorage.getItem("anc_arqueo_vales_prov_v1") || "[]");

window.ADMIN_STATE = {
  tabActiva: "GASTOS_CAJA",
  filtroDependencia: "TODAS",
  filtroEstado: "TODOS",
  busquedaTexto: "",
  gastosConsolidados: [],
  viaticosConsolidados: []
};

document.addEventListener("DOMContentLoaded", () => {
  renderizarVistaArqueoIndependiente();
  renderizarModuloAdministrador();
});

// =========================================================================================
// 1. MÓDULO INDEPENDIENTE: ARQUEO DE CAJA (BOTÓN PROPIO EN EL MENÚ PRINCIPAL)
// Genera exactamente los Anexos 14, 15, 02 y 16 de la Directiva de Caja Chica V.08
// =========================================================================================
function obtenerValesProvisionalesDependenciaActiva() {
  const p = window.ANC_STATE
    ? window.ANC_STATE.perfilActivo
    : { unidad_id: 12, codigo_dependencia: "AP-OAF", nombre_dependencia: "Oficina de Administración y Finanzas" };

  // Sincroniza vales que hayan sido registrados previamente en Caja Chica como VALE_PROVISIONAL
  const misGastosVales = (window.CAJA_STATE?.gastosRegistrados || []).filter(
    g =>
      (Number(g.unidad_organica_id) === Number(p.unidad_id) || g.codigo_dependencia === p.codigo_dependencia) &&
      (g.modalidad_fondo === "VALE_PROVISIONAL" || (g.tipo_comprobante && g.tipo_comprobante.toUpperCase().includes("VALE")))
  );

  misGastosVales.forEach(gv => {
    const numVale = gv.serie_numero_comprobante || `VP-${gv.id}`;
    const yaExiste = window.ARQUEO_VALES_PROVISIONALES.some(
      v => v.numero_vale === numVale && v.codigo_dependencia === p.codigo_dependencia
    );
    if (!yaExiste) {
      window.ARQUEO_VALES_PROVISIONALES.push({
        id: `sync-${gv.id || Date.now()}`,
        codigo_dependencia: p.codigo_dependencia,
        numero_vale: numVale,
        fecha_emision: gv.fecha_emision || new Date().toISOString().slice(0, 10),
        persona_receptora: gv.razon_social_proveedor || "Servidor Comisionado / Receptor",
        funcionario_autoriza: "Administración / OAF",
        concepto_tiempo: `${gv.concepto_detalle || "Gasto urgente por rendir"} (Dentro de las 48h)`,
        importe: Number(gv.monto_total_soles || 0)
      });
    }
  });

  return window.ARQUEO_VALES_PROVISIONALES.filter(
    v => !v.codigo_dependencia || v.codigo_dependencia === p.codigo_dependencia
  );
}

window.renderizarVistaArqueoIndependiente = function() {
  const cont = document.getElementById("contenedor-modulo-arqueo-caja");
  if (!cont) return;

  const p = window.ANC_STATE
    ? window.ANC_STATE.perfilActivo
    : {
        unidad_id: 12,
        codigo_dependencia: "AP-OAF",
        nombre_dependencia: "Oficina de Administración y Finanzas",
        presupuesto_caja_chica: 15000,
        saldo_caja_chica: 15000,
        usuario_nombre: "Encargado Único"
      };

  const misGastos = (window.CAJA_STATE?.gastosRegistrados || []).filter(
    g => Number(g.unidad_organica_id) === Number(p.unidad_id) || g.codigo_dependencia === p.codigo_dependencia
  );

  const docsRendidosSoles = misGastos
    .filter(g => g.modalidad_fondo !== "VALE_PROVISIONAL" && !(g.tipo_comprobante && g.tipo_comprobante.toUpperCase().includes("VALE")))
    .reduce((a, b) => a + Number(b.monto_total_soles || 0), 0);

  const valesActivos = obtenerValesProvisionalesDependenciaActiva();
  const valesProvSoles = valesActivos.reduce((a, b) => a + Number(b.importe || 0), 0);
  const hoyISO = new Date().toISOString().slice(0, 10);
  const correlativoSugerido = `VP-00${valesActivos.length + 1}-${new Date().getFullYear()}`;

  cont.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; margin-bottom:12px;">
      <div>
        <h2 style="font-size:1.25rem; font-weight:900; color:#0F172A;">🔍 Arqueo de Caja Chica y Viáticos</h2>
        <p style="font-size:0.82rem; color:#475569; font-weight:600;">
          Directiva de Caja Chica V.08 (Numeral 5.2.1.6) • Dependencia: <strong>[${p.codigo_dependencia}] ${p.nombre_dependencia}</strong>
        </p>
      </div>
      <span class="badge-semaforo badge-verde">Anexos 02, 14, 15 y 16</span>
    </div>

    <!-- DATOS GENERALES DEL ACTA DE ARQUEO (ANEXO 16) -->
    <div style="background:#F8FAFC; border:2px solid #CBD5E1; border-radius:14px; padding:12px; margin-bottom:14px;">
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(140px, 1fr)); gap:8px; margin-bottom:8px;">
        <div>
          <label style="font-size:0.7rem; font-weight:800; color:#334155;">1. FONDO ASIGNADO (S/):</label>
          <input type="number" id="arq-ind-asignado" step="0.01" value="${Number(p.presupuesto_caja_chica || 15000).toFixed(2)}" oninput="recalcularArqueoIndependiente()" style="width:100%; padding:8px; border-radius:8px; border:1.5px solid #0F172A; font-weight:900; box-sizing:border-box;" />
        </div>
        <div>
          <label style="font-size:0.7rem; font-weight:800; color:#B45309;">4. VALES PROV. (ANEXO 02):</label>
          <input type="number" id="arq-ind-vales" step="0.01" value="${valesProvSoles.toFixed(2)}" oninput="recalcularArqueoIndependiente()" style="width:100%; padding:8px; border-radius:8px; border:1.5px solid #D97706; background:#FFFBEB; font-weight:900; color:#92400E; box-sizing:border-box;" />
        </div>
        <div>
          <label style="font-size:0.7rem; font-weight:800; color:#1D4ED8;">5. DOCS. RENDIDOS (ANEXO 15):</label>
          <input type="number" id="arq-ind-docs" step="0.01" value="${docsRendidosSoles.toFixed(2)}" oninput="recalcularArqueoIndependiente()" style="width:100%; padding:8px; border-radius:8px; border:1.5px solid #3B82F6; font-weight:800; box-sizing:border-box;" />
        </div>
      </div>
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(210px, 1fr)); gap:8px;">
        <div>
          <label style="font-size:0.7rem; font-weight:800; color:#334155;">FUNCIONARIO / SERVIDOR QUE EFECTÚA EL ARQUEO:</label>
          <input type="text" id="arq-ind-auditor" value="Representante de Contabilidad / Tesorería / Administración" style="width:100%; padding:8px; border-radius:8px; border:1px solid #94A3B8; font-weight:700; font-size:0.8rem; box-sizing:border-box;" />
        </div>
        <div>
          <label style="font-size:0.7rem; font-weight:800; color:#334155;">EXPLICACIÓN DE DIFERENCIA / COMENTARIOS (ACTA ANEXO 16):</label>
          <input type="text" id="arq-ind-obs" value="Arqueo inopinado conforme a los fondos asignados." style="width:100%; padding:8px; border-radius:8px; border:1px solid #94A3B8; font-weight:700; font-size:0.8rem; box-sizing:border-box;" />
        </div>
      </div>
    </div>

    <!-- TARJETA INTERACTIVA: REGISTRO DETALLADO UNO A UNO DE VALES PROVISIONALES EN TRÁMITE (ANEXO 02) -->
    <div style="background:#FFFBEB; border:2px solid #F59E0B; border-radius:14px; padding:12px; margin-bottom:14px;">
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:6px; margin-bottom:10px;">
        <div>
          <div style="font-size:0.86rem; font-weight:900; color:#92400E;">⏳ Registro Detallado de Vales Provisionales en Trámite (Anexo 02)</div>
          <div style="font-size:0.72rem; color:#B45309; font-weight:600;">Agrega uno a uno los vales pendientes de rendición (Plazo máx. 48 horas según Directiva V.08)</div>
        </div>
        <span id="badge-total-vales-arq" style="background:#D97706; color:#FFFFFF; font-size:0.75rem; font-weight:900; padding:4px 10px; border-radius:999px;">
          ${valesActivos.length} Vale(s) • ${window.fmtSoles(valesProvSoles)}
        </span>
      </div>

      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(145px, 1fr)); gap:8px; margin-bottom:8px;">
        <div>
          <label style="font-size:0.68rem; font-weight:800; color:#78350F;">N° de Vale Provisional:</label>
          <input type="text" id="vp-arq-numero" value="${correlativoSugerido}" placeholder="Ej. VP-001-2026" style="width:100%; padding:7px 8px; border-radius:8px; border:1px solid #D97706; font-weight:800; font-size:0.78rem; background:#FFFFFF; box-sizing:border-box;" />
        </div>
        <div>
          <label style="font-size:0.68rem; font-weight:800; color:#78350F;">Fecha de Emisión:</label>
          <input type="date" id="vp-arq-fecha" value="${hoyISO}" style="width:100%; padding:7px 8px; border-radius:8px; border:1px solid #D97706; font-weight:700; font-size:0.78rem; background:#FFFFFF; box-sizing:border-box;" />
        </div>
        <div>
          <label style="font-size:0.68rem; font-weight:800; color:#78350F;">Importe en S/ (PEN):</label>
          <input type="number" id="vp-arq-importe" step="0.01" min="0" placeholder="0.00" style="width:100%; padding:7px 8px; border-radius:8px; border:1.5px solid #B45309; font-weight:900; font-size:0.82rem; background:#FFFFFF; box-sizing:border-box;" />
        </div>
      </div>

      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(180px, 1fr)); gap:8px; margin-bottom:8px;">
        <div>
          <label style="font-size:0.68rem; font-weight:800; color:#78350F;">Nombre de la persona receptora (Usuario):</label>
          <input type="text" id="vp-arq-receptor" placeholder="Nombres y apellidos del servidor" style="width:100%; padding:7px 8px; border-radius:8px; border:1px solid #D97706; font-weight:700; font-size:0.78rem; background:#FFFFFF; box-sizing:border-box;" />
        </div>
        <div>
          <label style="font-size:0.68rem; font-weight:800; color:#78350F;">Funcionario que autorizó:</label>
          <input type="text" id="vp-arq-autoriza" value="Administración / Jefe de ADC" placeholder="Cargo o nombre de quien autoriza" style="width:100%; padding:7px 8px; border-radius:8px; border:1px solid #D97706; font-weight:700; font-size:0.78rem; background:#FFFFFF; box-sizing:border-box;" />
        </div>
      </div>

      <div style="display:grid; grid-template-columns:1fr auto; gap:8px; align-items:end; margin-bottom:10px;">
        <div>
          <label style="font-size:0.68rem; font-weight:800; color:#78350F;">Concepto / Motivo y Tiempo transcurrido:</label>
          <input type="text" id="vp-arq-concepto" value="Dentro de las 48h — Gasto operativo urgente en trámite" placeholder="Ej. Compra urgente de materiales / Dentro de las 48h" style="width:100%; padding:7px 8px; border-radius:8px; border:1px solid #D97706; font-weight:700; font-size:0.78rem; background:#FFFFFF; box-sizing:border-box;" />
        </div>
        <button type="button" onclick="agregarValeProvisionalArqueo()" style="background:#D97706; color:#FFFFFF; border:none; border-radius:9px; padding:9px 14px; font-size:0.78rem; font-weight:900; cursor:pointer; white-space:nowrap; height:36px;">
          + Añadir Vale al Arqueo
        </button>
      </div>

      <div id="contenedor-lista-vales-arq"></div>
    </div>

    <!-- CONTADOR DE MONEDAS Y BILLETES (ANEXO 14: RELACIÓN DE DINERO EN EFECTIVO) -->
    <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(240px, 1fr)); gap:10px; margin-bottom:14px;">
      <div style="background:#FFFFFF; border:1.5px solid #CBD5E1; border-radius:14px; padding:10px;">
        <div style="font-size:0.8rem; font-weight:900; color:#0F172A; margin-bottom:6px;">🪙 MONEDAS (Anexo 14)</div>
        ${window.ARQUEO_DENOMINACIONES.monedas.map((m, i) => `
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px; font-size:0.78rem;">
            <strong>${m.label}</strong>
            <input type="number" id="mon-cant-${i}" value="${m.cant}" min="0" oninput="recalcularArqueoIndependiente()" style="width:68px; padding:4px; text-align:center; border-radius:6px; border:1px solid #94A3B8; font-weight:800;" />
            <span id="mon-sub-${i}" style="width:70px; text-align:right; font-weight:700;">S/ 0.00</span>
          </div>
        `).join("")}
      </div>

      <div style="background:#FFFFFF; border:1.5px solid #CBD5E1; border-radius:14px; padding:10px;">
        <div style="font-size:0.8rem; font-weight:900; color:#0F172A; margin-bottom:6px;">💵 BILLETES (Anexo 14)</div>
        ${window.ARQUEO_DENOMINACIONES.billetes.map((b, i) => `
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px; font-size:0.78rem;">
            <strong>${b.label}</strong>
            <input type="number" id="bil-cant-${i}" value="${b.cant}" min="0" oninput="recalcularArqueoIndependiente()" style="width:68px; padding:4px; text-align:center; border-radius:6px; border:1px solid #94A3B8; font-weight:800;" />
            <span id="bil-sub-${i}" style="width:75px; text-align:right; font-weight:700;">S/ 0.00</span>
          </div>
        `).join("")}
        <button type="button" onclick="autocompletarBilletesConSaldoCaja()" style="width:100%; margin-top:6px; background:#ECFDF5; color:#065F46; border:1px solid #10B981; border-radius:8px; padding:6px; font-size:0.72rem; font-weight:800; cursor:pointer;">
          ⚡ Cuadrar Efectivo con Saldo Disponible
        </button>
      </div>
    </div>

    <!-- CUADRO DE RESULTADO FINAL CONTUNDENTE (CUADRE / FALTANTE / SOBRANTE) -->
    <div id="panel-resumen-arqueo-ind" style="margin-bottom:14px;"></div>

    <!-- BOTONES DE IMPRESIÓN LIMPIA DE LOS ANEXOS DE ARQUEO (CON LOGO OFICIAL ANC-MP) -->
    <div style="display:grid; grid-template-columns:repeat(2, 1fr); gap:8px;">
      <button type="button" onclick="imprimirAnexoArqueoOficial('PAQUETE_ARQUEO')" style="grid-column:span 2; background:#0F172A; color:#F59E0B; border:2px solid #F59E0B; border-radius:12px; padding:13px; font-size:0.88rem; font-weight:900; cursor:pointer;">
        🖨️ Imprimir Expediente Completo de Arqueo (Anexos 16 + 14 + 15 + 02 en PDF)
      </button>
      <button type="button" onclick="imprimirAnexoArqueoOficial('ANEXO_16')" style="background:#7C3AED; color:#FFFFFF; border:none; border-radius:10px; padding:10px; font-size:0.78rem; font-weight:900; cursor:pointer;">
        📄 Anexo 16: Acta de Arqueo
      </button>
      <button type="button" onclick="imprimirAnexoArqueoOficial('ANEXO_14')" style="background:#10B981; color:#FFFFFF; border:none; border-radius:10px; padding:10px; font-size:0.78rem; font-weight:900; cursor:pointer;">
        🪙 Anexo 14: Relación de Efectivo
      </button>
      <button type="button" onclick="imprimirAnexoArqueoOficial('ANEXO_15')" style="background:#3B82F6; color:#FFFFFF; border:none; border-radius:10px; padding:10px; font-size:0.78rem; font-weight:900; cursor:pointer;">
        📑 Anexo 15: Documentos Rendidos
      </button>
      <button type="button" onclick="imprimirAnexoArqueoOficial('ANEXO_02')" style="background:#D97706; color:#FFFFFF; border:none; border-radius:10px; padding:10px; font-size:0.78rem; font-weight:900; cursor:pointer;">
        ⏳ Anexo 02: Control Vales Prov.
      </button>
    </div>
  `;

  renderizarListaValesProvisionalesArqueo();
  autocompletarBilletesConSaldoCaja();
};

window.renderizarListaValesProvisionalesArqueo = function() {
  const contLista = document.getElementById("contenedor-lista-vales-arq");
  if (!contLista) return;

  const valesActivos = obtenerValesProvisionalesDependenciaActiva();
  const sumaVales = valesActivos.reduce((acc, v) => acc + Number(v.importe || 0), 0);

  const badge = document.getElementById("badge-total-vales-arq");
  if (badge) {
    badge.textContent = `${valesActivos.length} Vale(s) • ${window.fmtSoles(sumaVales)}`;
  }

  if (valesActivos.length === 0) {
    contLista.innerHTML = `
      <div style="background:#FFFFFF; border:1px dashed #D97706; border-radius:10px; padding:9px; text-align:center; font-size:0.75rem; color:#78350F; font-weight:600;">
        No hay Vales Provisionales en trámite registrados para este arqueo (Importe Anexo 02: S/ 0.00).
      </div>
    `;
    return;
  }

  contLista.innerHTML = `
    <div style="background:#FFFFFF; border:1.5px solid #F59E0B; border-radius:10px; overflow:hidden;">
      <table style="width:100%; border-collapse:collapse; font-size:0.74rem;">
        <thead>
          <tr style="background:#FEF3C7; color:#78350F; text-align:left;">
            <th style="padding:6px 8px; border-bottom:1px solid #F59E0B;">N° Vale / Fecha</th>
            <th style="padding:6px 8px; border-bottom:1px solid #F59E0B;">Receptor / Autoriza / Motivo</th>
            <th style="padding:6px 8px; border-bottom:1px solid #F59E0B; text-align:right;">Importe</th>
            <th style="padding:6px 6px; border-bottom:1px solid #F59E0B; text-align:center; width:36px;">Quitar</th>
          </tr>
        </thead>
        <tbody>
          ${valesActivos.map(v => `
            <tr style="border-bottom:1px solid #FDE68A;">
              <td style="padding:6px 8px; font-weight:800; color:#0F172A;">
                ${v.numero_vale}<br/>
                <span style="font-size:0.68rem; color:#64748B; font-weight:600;">${v.fecha_emision}</span>
              </td>
              <td style="padding:6px 8px;">
                <strong style="color:#1E293B;">${v.persona_receptora}</strong><br/>
                <span style="font-size:0.68rem; color:#475569;">Aut.: ${v.funcionario_autoriza} • ${v.concepto_tiempo}</span>
              </td>
              <td style="padding:6px 8px; text-align:right; font-weight:900; color:#92400E; white-space:nowrap;">
                ${window.fmtSoles(v.importe)}
              </td>
              <td style="padding:6px 6px; text-align:center;">
                <button type="button" onclick="eliminarValeProvisionalArqueo('${v.id}')" title="Quitar vale del arqueo" style="background:#FEE2E2; color:#991B1B; border:1px solid #EF4444; border-radius:6px; width:26px; height:26px; font-weight:900; cursor:pointer; line-height:1;">
                  ✕
                </button>
              </td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
};

window.agregarValeProvisionalArqueo = function() {
  const p = window.ANC_STATE
    ? window.ANC_STATE.perfilActivo
    : { codigo_dependencia: "AP-OAF" };

  const numInput = document.getElementById("vp-arq-numero");
  const fechaInput = document.getElementById("vp-arq-fecha");
  const receptorInput = document.getElementById("vp-arq-receptor");
  const autorizaInput = document.getElementById("vp-arq-autoriza");
  const conceptoInput = document.getElementById("vp-arq-concepto");
  const importeInput = document.getElementById("vp-arq-importe");

  const numero_vale = (numInput?.value || "").trim() || `VP-00${window.ARQUEO_VALES_PROVISIONALES.length + 1}`;
  const fecha_emision = fechaInput?.value || new Date().toISOString().slice(0, 10);
  const persona_receptora = (receptorInput?.value || "").trim();
  const funcionario_autoriza = (autorizaInput?.value || "").trim() || "Administración / OAF";
  const concepto_tiempo = (conceptoInput?.value || "").trim() || "Dentro de las 48h";
  const importe = Number(importeInput?.value || 0);

  if (!persona_receptora) {
    alert("⚠️ Ingrese el nombre de la persona receptora (usuario) del Vale Provisional.");
    if (receptorInput) receptorInput.focus();
    return;
  }
  if (isNaN(importe) || importe <= 0) {
    alert("⚠️ Ingrese un importe válido mayor a S/ 0.00 para el Vale Provisional.");
    if (importeInput) importeInput.focus();
    return;
  }

  window.ARQUEO_VALES_PROVISIONALES.push({
    id: `vp-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    codigo_dependencia: p.codigo_dependencia,
    numero_vale,
    fecha_emision,
    persona_receptora,
    funcionario_autoriza,
    concepto_tiempo,
    importe: Number(importe.toFixed(2))
  });

  localStorage.setItem("anc_arqueo_vales_prov_v1", JSON.stringify(window.ARQUEO_VALES_PROVISIONALES));

  const valesActivos = obtenerValesProvisionalesDependenciaActiva();
  const sumaVales = valesActivos.reduce((acc, v) => acc + Number(v.importe || 0), 0);

  const inputTotalVales = document.getElementById("arq-ind-vales");
  if (inputTotalVales) {
    inputTotalVales.value = sumaVales.toFixed(2);
  }

  // Limpiar campos para el siguiente registro rápido
  if (numInput) numInput.value = `VP-00${valesActivos.length + 1}-${new Date().getFullYear()}`;
  if (receptorInput) receptorInput.value = "";
  if (importeInput) importeInput.value = "";

  renderizarListaValesProvisionalesArqueo();
  recalcularArqueoIndependiente();
};

window.eliminarValeProvisionalArqueo = function(idVale) {
  window.ARQUEO_VALES_PROVISIONALES = window.ARQUEO_VALES_PROVISIONALES.filter(
    v => String(v.id) !== String(idVale)
  );
  localStorage.setItem("anc_arqueo_vales_prov_v1", JSON.stringify(window.ARQUEO_VALES_PROVISIONALES));

  const valesActivos = obtenerValesProvisionalesDependenciaActiva();
  const sumaVales = valesActivos.reduce((acc, v) => acc + Number(v.importe || 0), 0);

  const inputTotalVales = document.getElementById("arq-ind-vales");
  if (inputTotalVales) {
    inputTotalVales.value = sumaVales.toFixed(2);
  }

  renderizarListaValesProvisionalesArqueo();
  recalcularArqueoIndependiente();
};

window.autocompletarBilletesConSaldoCaja = function() {
  const p = window.ANC_STATE ? window.ANC_STATE.perfilActivo : { presupuesto_caja_chica: 15000, saldo_caja_chica: 15000 };
  const asignado = Number(document.getElementById("arq-ind-asignado")?.value || p.presupuesto_caja_chica || 15000);
  const vales = Number(document.getElementById("arq-ind-vales")?.value || 0);
  const docs = Number(document.getElementById("arq-ind-docs")?.value || 0);

  // Calcula el saldo teórico en efectivo descontando documentos rendidos y vales provisionales
  let resto = Math.max(0, Number((asignado - vales - docs).toFixed(2)));

  for (let i = window.ARQUEO_DENOMINACIONES.billetes.length - 1; i >= 0; i--) {
    const val = window.ARQUEO_DENOMINACIONES.billetes[i].val;
    const cant = Math.floor(resto / val);
    resto = Number((resto - cant * val).toFixed(2));
    const el = document.getElementById(`bil-cant-${i}`);
    if (el) el.value = cant;
  }
  for (let j = window.ARQUEO_DENOMINACIONES.monedas.length - 1; j >= 0; j--) {
    const val = window.ARQUEO_DENOMINACIONES.monedas[j].val;
    const cant = Math.floor((resto + 0.001) / val);
    resto = Number((resto - cant * val).toFixed(2));
    const el = document.getElementById(`mon-cant-${j}`);
    if (el) el.value = cant;
  }
  recalcularArqueoIndependiente();
};

function obtenerDatosCalculadosArqueo() {
  let totMonedas = 0;
  window.ARQUEO_DENOMINACIONES.monedas.forEach((m, i) => {
    const c = Number(document.getElementById(`mon-cant-${i}`)?.value || 0);
    m.cant = c;
    const sub = Number((c * m.val).toFixed(2));
    totMonedas += sub;
    const lbl = document.getElementById(`mon-sub-${i}`);
    if (lbl) lbl.textContent = `S/ ${sub.toFixed(2)}`;
  });

  let totBilletes = 0;
  window.ARQUEO_DENOMINACIONES.billetes.forEach((b, i) => {
    const c = Number(document.getElementById(`bil-cant-${i}`)?.value || 0);
    b.cant = c;
    const sub = Number((c * b.val).toFixed(2));
    totBilletes += sub;
    const lbl = document.getElementById(`bil-sub-${i}`);
    if (lbl) lbl.textContent = `S/ ${sub.toFixed(2)}`;
  });

  const efectivoTotal = Number((totMonedas + totBilletes).toFixed(2));
  const asignado = Number(document.getElementById("arq-ind-asignado")?.value || 0);
  const vales = Number(document.getElementById("arq-ind-vales")?.value || 0);
  const docs = Number(document.getElementById("arq-ind-docs")?.value || 0);
  const totalArqueado = Number((efectivoTotal + vales + docs).toFixed(2));
  const diferencia = Number((totalArqueado - asignado).toFixed(2));

  return { totMonedas, totBilletes, efectivoTotal, asignado, vales, docs, totalArqueado, diferencia };
}

window.recalcularArqueoIndependiente = function() {
  const d = obtenerDatosCalculadosArqueo();
  const panel = document.getElementById("panel-resumen-arqueo-ind");
  if (!panel) return;

  const esCuadrado = Math.abs(d.diferencia) < 0.01;
  const esFaltante = d.diferencia <= -0.01;
  const montoAbs = Math.abs(d.diferencia).toFixed(2);

  let bgColor = "#ECFDF5";
  let borderColor = "#10B981";
  let textColor = "#065F46";
  let tituloResultado = "✓ ARQUEO CUADRADO Y CONFORME (DIFERENCIA: S/ 0.00 - SIN FALTANTES)";
  let subtextoResultado = "La suma del efectivo físico contado, comprobantes rendidos y vales provisionales concilia exactamente con el Fondo Asignado por Resolución.";

  if (esFaltante) {
    bgColor = "#FEF2F2";
    borderColor = "#EF4444";
    textColor = "#991B1B";
    tituloResultado = `⚠️ FALTANTE DETECTADO EN CAJA: - S/ ${montoAbs}`;
    subtextoResultado = "El Total Arqueado es menor al Fondo Asignado por Resolución. Debe consignarse obligatoriamente el motivo del faltante en el Acta de Arqueo (Anexo 16).";
  } else if (!esCuadrado && d.diferencia >= 0.01) {
    bgColor = "#FFFBEB";
    borderColor = "#F59E0B";
    textColor = "#92400E";
    tituloResultado = `⚠️ SOBRANTE DETECTADO EN CAJA: + S/ ${montoAbs}`;
    subtextoResultado = "El Total Arqueado supera el Fondo Asignado por Resolución. Verifique el conteo físico de efectivo o comprobantes pendientes de registro.";
  }

  panel.innerHTML = `
    <div style="background:${bgColor}; border:2.5px solid ${borderColor}; border-radius:14px; padding:14px; font-size:0.82rem; box-shadow:0 4px 12px rgba(15,23,42,0.06);">
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(150px, 1fr)); gap:8px; padding-bottom:10px; margin-bottom:10px; border-bottom:1px solid ${borderColor}; font-weight:800; color:#0F172A;">
        <div>🪙 Efectivo (Anexo 14):<br/><span style="font-size:0.95rem;">${window.fmtSoles(d.efectivoTotal)}</span></div>
        <div>📑 Docs. Rendidos (Anexo 15):<br/><span style="font-size:0.95rem;">${window.fmtSoles(d.docs)}</span></div>
        <div>⏳ Vales Prov. (Anexo 02):<br/><span style="font-size:0.95rem;">${window.fmtSoles(d.vales)}</span></div>
        <div>📊 Total Arqueado vs Fondo:<br/><span style="font-size:0.95rem;">${window.fmtSoles(d.totalArqueado)} / ${window.fmtSoles(d.asignado)}</span></div>
      </div>
      <div style="font-size:0.94rem; font-weight:900; color:${textColor}; letter-spacing:0.01em;">
        ${tituloResultado}
      </div>
      <div style="margin-top:4px; font-size:0.76rem; font-weight:700; color:${textColor}; opacity:0.92;">
        ${subtextoResultado}
      </div>
    </div>
  `;
};

window.imprimirAnexoArqueoOficial = function(tipo) {
  const p = window.ANC_STATE
    ? window.ANC_STATE.perfilActivo
    : {
        unidad_id: 12,
        codigo_dependencia: "AP-OAF",
        nombre_dependencia: "Oficina de Administración y Finanzas",
        sede_ubicacion: "Lima",
        usuario_nombre: "Encargado Único"
      };
  const d = obtenerDatosCalculadosArqueo();
  const auditor = document.getElementById("arq-ind-auditor")?.value || "Auditor Contabilidad / Tesorería";
  const obs = document.getElementById("arq-ind-obs")?.value || "Sin observaciones.";
  const cab = window.MotorAnexosANC.cabeceraDirectivaHTML("OGFIN/DIR-01", "MANEJO DE LA CAJA CHICA DEL MINISTERIO PÚBLICO", "08");
  const fechaHoy = new Date().toLocaleDateString("es-PE");
  const horaHoy = new Date().toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" });

  const misGastos = (window.CAJA_STATE?.gastosRegistrados || []).filter(
    g => Number(g.unidad_organica_id) === Number(p.unidad_id) || g.codigo_dependencia === p.codigo_dependencia
  );
  const docsRendidosLista = misGastos.filter(
    g => g.modalidad_fondo !== "VALE_PROVISIONAL" && !(g.tipo_comprobante && g.tipo_comprobante.toUpperCase().includes("VALE"))
  );
  const valesLista = obtenerValesProvisionalesDependenciaActiva();

  // Estado del cuadro final para el Anexo 16 impreso
  const esCuadrado = Math.abs(d.diferencia) < 0.01;
  const esFaltante = d.diferencia <= -0.01;
  const montoAbs = Math.abs(d.diferencia).toFixed(2);

  let dictamenTextoImpreso = "✓ ARQUEO CUADRADO Y CONFORME (DIFERENCIA: S/ 0.00 - SIN FALTANTES)";
  let dictamenBgImpreso = "#ECFDF5";
  let dictamenBordeImpreso = "#10B981";
  let dictamenColorImpreso = "#065F46";

  if (esFaltante) {
    dictamenTextoImpreso = `⚠️ FALTANTE DETECTADO EN CAJA: - S/ ${montoAbs} (Consignar motivo obligatorio en el Acta Anexo 16)`;
    dictamenBgImpreso = "#FEF2F2";
    dictamenBordeImpreso = "#EF4444";
    dictamenColorImpreso = "#991B1B";
  } else if (!esCuadrado && d.diferencia >= 0.01) {
    dictamenTextoImpreso = `⚠️ SOBRANTE DETECTADO EN CAJA: + S/ ${montoAbs}`;
    dictamenBgImpreso = "#FFFBEB";
    dictamenBordeImpreso = "#F59E0B";
    dictamenColorImpreso = "#92400E";
  }

  // ANEXO 14 EXACTO (Página 51 Directiva V.08)
  const htmlAnexo14 = `
    <div class="hoja-oficial">
      ${cab}
      <div class="titulo-anexo-num">ANEXO 14</div>
      <div class="titulo-anexo-nombre">FORMATO DE RELACIÓN DE DINERO EN EFECTIVO</div>
      <p style="margin-bottom:10px;"><strong>Dependencia / ADC:</strong> ${p.nombre_dependencia} • En la ciudad de ${p.sede_ubicacion}, a las ${horaHoy} horas del día ${fechaHoy}:</p>
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:14px;">
        <table class="tabla-directiva">
          <thead><tr><th>MONEDAS (Denominación)</th><th style="text-align:center;">Cantidad</th><th style="text-align:right;">Importe S/</th></tr></thead>
          <tbody>
            ${window.ARQUEO_DENOMINACIONES.monedas.map(m => `<tr><td>${m.label}</td><td style="text-align:center;">${m.cant}</td><td style="text-align:right;">${(m.cant * m.val).toFixed(2)}</td></tr>`).join("")}
            <tr class="fila-subtotal"><td colspan="2">SUBTOTAL MONEDAS S/</td><td style="text-align:right;">${d.totMonedas.toFixed(2)}</td></tr>
          </tbody>
        </table>
        <table class="tabla-directiva">
          <thead><tr><th>BILLETES (Denominación)</th><th style="text-align:center;">Cantidad</th><th style="text-align:right;">Importe S/</th></tr></thead>
          <tbody>
            ${window.ARQUEO_DENOMINACIONES.billetes.map(b => `<tr><td>${b.label}</td><td style="text-align:center;">${b.cant}</td><td style="text-align:right;">${(b.cant * b.val).toFixed(2)}</td></tr>`).join("")}
            <tr class="fila-subtotal"><td colspan="2">SUBTOTAL BILLETES S/</td><td style="text-align:right;">${d.totBilletes.toFixed(2)}</td></tr>
            <tr class="fila-total-general"><td colspan="2">TOTAL GENERAL EFECTIVO S/</td><td style="text-align:right;">${window.fmtSoles(d.efectivoTotal)}</td></tr>
          </tbody>
        </table>
      </div>
      <div class="bloque-firmas"><div class="linea-firma"><strong>Funcionario / Servidor que efectúa el arqueo</strong><br/>${auditor}</div><div class="linea-firma"><strong>Encargado Único de Caja Chica</strong><br/>${p.usuario_nombre}</div></div>
    </div>
  `;

  // ANEXO 15 EXACTO (Página 52 Directiva V.08)
  const htmlAnexo15 = `
    <div class="hoja-oficial">
      ${cab}
      <div class="titulo-anexo-num">ANEXO 15</div>
      <div class="titulo-anexo-nombre">FORMATO DE RELACIÓN DE DOCUMENTOS RENDIDOS</div>
      <p style="margin-bottom:8px;"><strong>Dependencia / ADC:</strong> [${p.codigo_dependencia}] ${p.nombre_dependencia} • Fecha: ${fechaHoy}</p>
      <table class="tabla-directiva">
        <thead><tr><th style="width:6%;">N°</th><th style="width:12%;">FECHA</th><th style="width:18%;">CLASE / N° DOC.</th><th style="width:48%;">Detalle del Gasto</th><th style="width:16%; text-align:right;">Importe S/</th></tr></thead>
        <tbody>
          ${docsRendidosLista.length === 0
            ? `<tr><td colspan="5" style="text-align:center;">Sin documentos definitivos rendidos en custodia al momento del arqueo.</td></tr>`
            : docsRendidosLista.map((g, i) => `<tr><td style="text-align:center;">${i + 1}</td><td style="text-align:center;">${g.fecha_emision}</td><td>${g.tipo_comprobante} ${g.serie_numero_comprobante}</td><td>${g.razon_social_proveedor} — ${g.concepto_detalle}</td><td style="text-align:right;">${Number(g.monto_total_soles).toFixed(2)}</td></tr>`).join("")
          }
          <tr class="fila-total-general"><td colspan="4" style="text-align:right;">Total Documentos Rendidos S/</td><td style="text-align:right;">${window.fmtSoles(d.docs)}</td></tr>
        </tbody>
      </table>
      <div class="bloque-firmas"><div class="linea-firma"><strong>Funcionario / Servidor que efectúa el arqueo</strong><br/>${auditor}</div><div class="linea-firma"><strong>Encargado Único del manejo de la Caja Chica</strong><br/>${p.usuario_nombre}</div></div>
    </div>
  `;

  // ANEXO 02 EXACTO (Página 39 Directiva V.08) POBLADO CON LOS VALES REGISTRADOS UNO A UNO
  const htmlAnexo02 = `
    <div class="hoja-oficial">
      ${cab}
      <div class="titulo-anexo-num">ANEXO 02</div>
      <div class="titulo-anexo-nombre">FORMATO CONTROL DE EMISIÓN DE VALES PROVISIONALES</div>
      <p style="margin-bottom:8px;"><strong>Dependencia / ADC:</strong> [${p.codigo_dependencia}] ${p.nombre_dependencia} • Fecha de Control: ${fechaHoy}</p>
      <table class="tabla-directiva">
        <thead>
          <tr>
            <th>Fecha de Emisión</th>
            <th>N° de Vale Provisional</th>
            <th>Nombre de la persona receptora</th>
            <th style="text-align:right;">Importe S/</th>
            <th>Funcionario que autorizó</th>
            <th>Concepto / Tiempo transcurrido</th>
            <th>N° comprobante rendido</th>
            <th style="text-align:right;">Importe rendición S/</th>
          </tr>
        </thead>
        <tbody>
          ${valesLista.length === 0
            ? `<tr><td colspan="8" style="text-align:center;">Sin vales provisionales pendientes a la fecha del arqueo.</td></tr>`
            : valesLista.map(v => `
              <tr>
                <td style="text-align:center;">${v.fecha_emision}</td>
                <td style="text-align:center; font-weight:bold;">${v.numero_vale}</td>
                <td>${v.persona_receptora}</td>
                <td style="text-align:right; font-weight:bold;">${Number(v.importe).toFixed(2)}</td>
                <td>${v.funcionario_autoriza}</td>
                <td>${v.concepto_tiempo}</td>
                <td style="text-align:center;">En trámite (Por rendir)</td>
                <td style="text-align:right;">${Number(v.importe).toFixed(2)}</td>
              </tr>
            `).join("")
          }
          <tr class="fila-total-general">
            <td colspan="3" style="text-align:right;">TOTAL VALES PROVISIONALES EN TRÁMITE (ANEXO 02) S/</td>
            <td style="text-align:right;">${window.fmtSoles(d.vales)}</td>
            <td colspan="3" style="text-align:right;">TOTAL POR RENDIR S/</td>
            <td style="text-align:right;">${window.fmtSoles(d.vales)}</td>
          </tr>
        </tbody>
      </table>
      <div class="bloque-firmas"><div class="linea-firma"><strong>Encargado Único de la Caja Chica</strong><br/>${p.usuario_nombre}</div><div class="linea-firma"><strong>Oficina de Tesorería / Administración</strong><br/>${p.nombre_dependencia}</div></div>
    </div>
  `;

  // ANEXO 16 EXACTO (Página 53 Directiva V.08) CON CUADRO DE RESULTADO FINAL DE CUADRE / FALTANTE / SOBRANTE
  const htmlAnexo16 = `
    <div class="hoja-oficial">
      ${cab}
      <div class="titulo-anexo-num">ANEXO 16</div>
      <div class="titulo-anexo-nombre">FORMATO ACTA DE ARQUEO DE LA CAJA CHICA / VIÁTICOS</div>
      <p style="font-size:11px; line-height:1.55; margin-bottom:12px;">
        En la ciudad de <strong>${p.sede_ubicacion}</strong>, a las <strong>${horaHoy}</strong> horas del día <strong>${fechaHoy}</strong>, reunidos en la oficina de <strong>[${p.codigo_dependencia}] ${p.nombre_dependencia}</strong>, se procedió a realizar el Arqueo de Fondos conforme al siguiente detalle:
      </p>
      <table class="tabla-directiva">
        <tbody>
          <tr><td style="width:65%;"><strong>1. Fondo asignado con Resolución:</strong></td><td style="width:15%; text-align:center;">Res. Apertura</td><td style="width:20%; text-align:right; font-weight:bold;">${window.fmtSoles(d.asignado)}</td></tr>
          <tr><td><strong>2. Resolución de ampliación de Fondos:</strong></td><td style="text-align:center;">-</td><td style="text-align:right;">S/ 0.00</td></tr>
          <tr><td><strong>3. Recuento de dinero en efectivo:</strong></td><td style="text-align:center;">Anexo 14</td><td style="text-align:right;">${window.fmtSoles(d.efectivoTotal)}</td></tr>
          <tr><td><strong>4. Vales provisionales (${valesLista.length} en trámite):</strong></td><td style="text-align:center;">Anexo 02</td><td style="text-align:right;">${window.fmtSoles(d.vales)}</td></tr>
          <tr><td><strong>5. Relación de documentos rendidos:</strong></td><td style="text-align:center;">Anexo 15</td><td style="text-align:right;">${window.fmtSoles(d.docs)}</td></tr>
          <tr><td><strong>6. Documentos para reembolso:</strong></td><td style="text-align:center;">-</td><td style="text-align:right;">S/ 0.00</td></tr>
          <tr><td><strong>7. Otros:</strong></td><td style="text-align:center;">-</td><td style="text-align:right;">S/ 0.00</td></tr>
          <tr class="fila-subtotal"><td colspan="2">Total rendición / arqueado (3 + 4 + 5 + 6 + 7):</td><td style="text-align:right;">${window.fmtSoles(d.totalArqueado)}</td></tr>
          <tr class="fila-total-general"><td colspan="2">Diferencia (Total Arqueado - Fondo Asignado):</td><td style="text-align:right;">${window.fmtSoles(d.diferencia)}</td></tr>
        </tbody>
      </table>
      <div style="margin-top:10px; padding:9px 11px; border:2px solid ${dictamenBordeImpreso}; background-color:${dictamenBgImpreso} !important; -webkit-print-color-adjust:exact; print-color-adjust:exact; color:${dictamenColorImpreso}; font-weight:900; font-size:11px; text-align:center;">
        ${dictamenTextoImpreso}
      </div>
      <div class="notas-pie" style="margin-top:10px;">
        <strong>Explicaciones de la diferencia (Motivo) / Comentarios:</strong> ${obs}
      </div>
      <p style="margin-top:12px; font-size:10.5px;">Siendo las ${horaHoy} horas del mismo día se dio por terminado el arqueo, firmándose en señal de conformidad.</p>
      <div class="bloque-firmas"><div class="linea-firma"><strong>Funcionario / Servidor que efectúa el arqueo</strong><br/>${auditor}</div><div class="linea-firma"><strong>Encargado Único del manejo de la Caja Chica</strong><br/>${p.usuario_nombre}</div></div>
    </div>
  `;

  const mapa = { "ANEXO_16": htmlAnexo16, "ANEXO_14": htmlAnexo14, "ANEXO_15": htmlAnexo15, "ANEXO_02": htmlAnexo02 };
  const htmlFinal = mapa[tipo] || (htmlAnexo16 + htmlAnexo14 + htmlAnexo15 + htmlAnexo02);
  window.MotorAnexosANC.imprimirDocumentoOficial(`Arqueo_Caja_${p.codigo_dependencia}`, htmlFinal, "portrait");
};

// =========================================================================================
// 2. PANEL EXCLUSIVO DEL ADMINISTRADOR NACIONAL (CONSOLIDADO MULTI-SEDE Y 34 ADC)
// =========================================================================================
window.desbloquearPanelAdminConPin = function() {
  const pin = document.getElementById("admin-input-pin-acceso")?.value.trim();
  if (pin === String(window.ANC_STATE?.config?.pin_administrador || "2026")) {
    window.ANC_STATE.perfilActivo.rol_sistema = "ADMINISTRADOR";
    localStorage.setItem("anc_mp_perfil_v1", JSON.stringify(window.ANC_STATE.perfilActivo));
    if (typeof window.actualizarCabeceraYMenu === "function") window.actualizarCabeceraYMenu();
    renderizarModuloAdministrador();
    cargarConsolidadoNacionalAdmin();
  } else {
    alert("❌ PIN incorrecto (Por defecto: 2026).");
  }
};

window.cargarConsolidadoNacionalAdmin = async function() {
  const p = window.ANC_STATE ? window.ANC_STATE.perfilActivo : { rol_sistema: "OPERADOR" };
  if (p.rol_sistema !== "ADMINISTRADOR") {
    renderizarModuloAdministrador();
    return;
  }
  const localGastos = JSON.parse(localStorage.getItem("anc_gastos_caja_local_v1") || "[]");
  const resG = await window.SupabaseANC.request("anc_gastos_caja_encargos", "GET", "order=id.desc&limit=300");
  window.ADMIN_STATE.gastosConsolidados = enriquecerConDependencia((resG.data && resG.data.length > 0) ? resG.data : localGastos);

  const localViat = JSON.parse(localStorage.getItem("anc_viaticos_local_v1") || "[]");
  const resV = await window.SupabaseANC.request("anc_viaticos_solicitudes", "GET", "order=id.desc&limit=200");
  window.ADMIN_STATE.viaticosConsolidados = enriquecerConDependencia((resV.data && resV.data.length > 0) ? resV.data : localViat);

  actualizarKPIsYTablasAdmin();
};

function enriquecerConDependencia(lista) {
  const unidades = window.ANC_STATE?.unidades || [];
  return lista.map(item => {
    const u = unidades.find(x => Number(x.id) === Number(item.unidad_organica_id) || x.codigo === item.codigo_dependencia);
    return {
      ...item,
      codigo_dependencia: item.codigo_dependencia || (u ? u.codigo : "ANC-SEDE"),
      nombre_dependencia: item.nombre_dependencia || (u ? u.nombre_dependencia : "Unidad Orgánica ANC-MP"),
      es_adc: u ? Boolean(u.es_adc) : false
    };
  });
}

function renderizarModuloAdministrador() {
  const cont = document.getElementById("contenedor-modulo-admin");
  if (!cont) return;
  const p = window.ANC_STATE ? window.ANC_STATE.perfilActivo : { rol_sistema: "OPERADOR" };

  if (p.rol_sistema !== "ADMINISTRADOR") {
    cont.innerHTML = `
      <div style="text-align:center; padding:22px 12px;">
        <h2 style="font-size:1.25rem; font-weight:900; color:#0F172A; margin-bottom:8px;">🔐 Acceso Administrador Nacional ANC-MP</h2>
        <p style="font-size:0.84rem; color:#475569; margin-bottom:14px;">Exclusivo para OCA / OAF (Abastecimiento, Contabilidad y Tesorería).</p>
        <div style="max-width:280px; margin:0 auto;">
          <input type="password" id="admin-input-pin-acceso" value="2026" style="width:100%; padding:11px; border-radius:10px; border:2px solid #D97706; text-align:center; font-size:1.1rem; font-weight:900; margin-bottom:10px;" />
          <button type="button" onclick="desbloquearPanelAdminConPin()" style="width:100%; background:#0F172A; color:#F59E0B; border:none; border-radius:10px; padding:12px; font-weight:900; cursor:pointer;">🛡️ Desbloquear Consolidado</button>
        </div>
      </div>
    `;
    return;
  }

  const unidades = window.ANC_STATE?.unidades || [];
  cont.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
      <h2 style="font-size:1.22rem; font-weight:900; color:#0F172A;">📊 Panel Administrador y Auditoría Nacional</h2>
      <button type="button" onclick="cargarConsolidadoNacionalAdmin()" style="background:#0F172A; color:#F59E0B; border:none; border-radius:8px; padding:7px 12px; font-size:0.76rem; font-weight:800; cursor:pointer;">🔄 Refrescar</button>
    </div>

    <div id="admin-kpis-nacionales" style="display:grid; grid-template-columns:repeat(2, 1fr); gap:8px; margin-bottom:12px;"></div>

    <div style="background:#F8FAFC; border:1.5px solid #CBD5E1; border-radius:12px; padding:10px; margin-bottom:12px;">
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-bottom:8px;">
        <select id="admin-filtro-dep" onchange="aplicarFiltrosAdmin()" style="padding:8px; border-radius:8px; border:1px solid #94A3B8; font-weight:700; font-size:0.8rem;">
          <option value="TODAS">-- Todas las Dependencias y 34 ADC --</option>
          <option value="SOLO_SEDE">🏢 Solo Sede Central</option>
          <option value="SOLO_ADC">🏛️ Solo 34 ADC Regiones</option>
          ${unidades.map(u => `<option value="${u.codigo}">[${u.codigo}] ${u.nombre_dependencia}</option>`).join("")}
        </select>
        <select id="admin-filtro-estado" onchange="aplicarFiltrosAdmin()" style="padding:8px; border-radius:8px; border:1px solid #94A3B8; font-weight:700; font-size:0.8rem;">
          <option value="TODOS">-- Todos los Estados --</option>
          <option value="APROBADO">✓ Aprobados</option>
          <option value="OBSERVADO">⚠️ Observados</option>
        </select>
      </div>
      <input type="text" id="admin-input-busqueda" oninput="aplicarFiltrosAdmin()" placeholder="🔍 Filtrar por RUC, proveedor, locador, específica o comprobante..." style="width:100%; padding:9px; border-radius:8px; border:1.5px solid #D97706; font-size:0.82rem; font-weight:700;" />
    </div>

    <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-bottom:12px;">
      <button type="button" onclick="exportarConsolidadoExcelCSV()" style="background:#10B981; color:#FFF; border:none; border-radius:9px; padding:10px; font-size:0.78rem; font-weight:900; cursor:pointer;">📥 Exportar Consolidado (Excel CSV)</button>
      <button type="button" onclick="imprimirReporteConsolidadoAdminPDF()" style="background:#0F172A; color:#F59E0B; border:1.5px solid #F59E0B; border-radius:9px; padding:10px; font-size:0.78rem; font-weight:900; cursor:pointer;">🖨️ Reporte Nacional Auditoría (PDF)</button>
    </div>

    <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:6px; margin-bottom:12px;">
      <button type="button" id="btn-adm-tab-caja" onclick="cambiarTabAdmin('GASTOS_CAJA')" style="background:#0F172A; color:#F59E0B; border:1px solid #0F172A; border-radius:8px; padding:8px; font-size:0.74rem; font-weight:900; cursor:pointer;">🧾 Caja y Encargos</button>
      <button type="button" id="btn-adm-tab-viat" onclick="cambiarTabAdmin('VIATICOS_NAC')" style="background:#FFF; color:#0F172A; border:1px solid #CBD5E1; border-radius:8px; padding:8px; font-size:0.74rem; font-weight:800; cursor:pointer;">✈️ Planillas Viáticos</button>
      <button type="button" id="btn-adm-tab-uit" onclick="cambiarTabAdmin('CONTROL_UIT')" style="background:#FFF; color:#0F172A; border:1px solid #CBD5E1; border-radius:8px; padding:8px; font-size:0.74rem; font-weight:800; cursor:pointer;">📐 Topes Anuales UIT</button>
    </div>

    <div id="admin-contenedor-tabla-principal"></div>
  `;
  cargarConsolidadoNacionalAdmin();
}

window.cambiarTabAdmin = function(nuevaTab) {
  window.ADMIN_STATE.tabActiva = nuevaTab;
  const mapa = { "GASTOS_CAJA": "btn-adm-tab-caja", "VIATICOS_NAC": "btn-adm-tab-viat", "CONTROL_UIT": "btn-adm-tab-uit" };
  Object.entries(mapa).forEach(([t, id]) => {
    const el = document.getElementById(id);
    if (el) { el.style.background = t === nuevaTab ? "#0F172A" : "#FFF"; el.style.color = t === nuevaTab ? "#F59E0B" : "#0F172A"; }
  });
  actualizarKPIsYTablasAdmin();
};

window.aplicarFiltrosAdmin = function() {
  window.ADMIN_STATE.filtroDependencia = document.getElementById("admin-filtro-dep")?.value || "TODAS";
  window.ADMIN_STATE.filtroEstado = document.getElementById("admin-filtro-estado")?.value || "TODOS";
  window.ADMIN_STATE.busquedaTexto = (document.getElementById("admin-input-busqueda")?.value || "").toLowerCase().trim();
  actualizarKPIsYTablasAdmin();
};

function obtenerListasFiltradasAdmin() {
  const fDep = window.ADMIN_STATE.filtroDependencia;
  const fEst = window.ADMIN_STATE.filtroEstado;
  const q = window.ADMIN_STATE.busquedaTexto;

  const gastos = window.ADMIN_STATE.gastosConsolidados.filter(g => {
    const okDep = fDep === "TODAS" || (fDep === "SOLO_SEDE" && !g.es_adc) || (fDep === "SOLO_ADC" && g.es_adc) || g.codigo_dependencia === fDep;
    const okEst = fEst === "TODOS" || (g.estado_auditoria || "APROBADO") === fEst;
    const txt = `${g.codigo_dependencia} ${g.nombre_dependencia} ${g.ruc_dni_proveedor} ${g.razon_social_proveedor} ${g.especifica_gasto} ${g.serie_numero_comprobante} ${g.concepto_detalle}`.toLowerCase();
    return okDep && okEst && (!q || txt.includes(q));
  });

  const viaticos = window.ADMIN_STATE.viaticosConsolidados.filter(v => {
    const okDep = fDep === "TODAS" || (fDep === "SOLO_SEDE" && !v.es_adc) || (fDep === "SOLO_ADC" && v.es_adc) || v.codigo_dependencia === fDep;
    const okEst = fEst === "TODOS" || (v.estado_solicitud || "APROBADO") === fEst;
    const txt = `${v.codigo_planilla} ${v.codigo_dependencia} ${v.nombre_dependencia} ${v.destino_comision} ${v.motivo_comision}`.toLowerCase();
    return okDep && okEst && (!q || txt.includes(q));
  });

  return { gastos, viaticos };
}

function actualizarKPIsYTablasAdmin() {
  const kpiDiv = document.getElementById("admin-kpis-nacionales");
  const contTabla = document.getElementById("admin-contenedor-tabla-principal");
  if (!kpiDiv || !contTabla) return;

  const uit = Number(window.ANC_STATE?.config?.valor_uit || 5350);
  const { gastos, viaticos } = obtenerListasFiltradasAdmin();

  const totalCaja = gastos.filter(g => g.modalidad_fondo !== "ENCARGO" && g.estado_auditoria !== "OBSERVADO").reduce((a, b) => a + Number(b.monto_total_soles || 0), 0);
  const totalEnc = gastos.filter(g => g.modalidad_fondo === "ENCARGO" && g.estado_auditoria !== "OBSERVADO").reduce((a, b) => a + Number(b.monto_total_soles || 0), 0);
  const totalViat = viaticos.filter(v => v.estado_solicitud !== "OBSERVADO").reduce((a, b) => a + Number(b.monto_total_solicitud || 0), 0);

  kpiDiv.innerHTML = `
    <div style="background:#ECFDF5; border:1px solid #10B981; border-radius:10px; padding:8px 10px;">
      <div style="font-size:0.68rem; font-weight:800; color:#065F46;">CAJA CHICA EJECUTADO</div>
      <div style="font-size:1.1rem; font-weight:900;">${window.fmtSoles(totalCaja)} (${(totalCaja / uit).toFixed(2)} UIT)</div>
    </div>
    <div style="background:#FFFBEB; border:1px solid #F59E0B; border-radius:10px; padding:8px 10px;">
      <div style="font-size:0.68rem; font-weight:800; color:#92400E;">VIÁTICOS Y ENCARGOS</div>
      <div style="font-size:1.1rem; font-weight:900;">${window.fmtSoles(totalViat + totalEnc)}</div>
    </div>
  `;

  const tab = window.ADMIN_STATE.tabActiva;
  if (tab === "GASTOS_CAJA") {
    contTabla.innerHTML = `
      <table class="anc-list-table">
        <thead><tr><th>DEPENDENCIA / ESTADO</th><th>PROVEEDOR / LOCADOR Y DETALLE</th><th>IMPORTE Y ACCIÓN</th></tr></thead>
        <tbody>
          ${gastos.map(g => {
            const obs = g.estado_auditoria === "OBSERVADO";
            return `<tr>
              <td><span class="badge-semaforo ${obs ? 'badge-rojo' : 'badge-verde'}">${obs ? 'OBSERVADO' : 'APROBADO'}</span><br/><strong>[${g.codigo_dependencia}]</strong><br/><small>${g.nombre_dependencia}</small></td>
              <td><strong>${g.razon_social_proveedor}</strong> (${g.ruc_dni_proveedor})<br/><small>${g.tipo_comprobante} ${g.serie_numero_comprobante} • Esp. ${g.especifica_gasto}</small><br/><small>${g.concepto_detalle}</small></td>
              <td><strong>${window.fmtSoles(g.monto_total_soles)}</strong><div style="display:flex; gap:4px; margin-top:4px;"><button onclick="cambiarEstadoAuditoriaGasto(${g.id},'APROBADO')" style="background:#10B981;color:#FFF;border:none;border-radius:5px;padding:3px 6px;font-size:0.68rem;cursor:pointer;">Aprobar</button><button onclick="cambiarEstadoAuditoriaGasto(${g.id},'OBSERVADO')" style="background:#EF4444;color:#FFF;border:none;border-radius:5px;padding:3px 6px;font-size:0.68rem;cursor:pointer;">Observar</button></div></td>
            </tr>`;
          }).join("")}
        </tbody>
      </table>
    `;
  } else if (tab === "VIATICOS_NAC") {
    contTabla.innerHTML = `
      <table class="anc-list-table">
        <thead><tr><th>PLANILLA / DEPENDENCIA</th><th>RUTA Y AUTORIZACIÓN</th><th>TOTAL</th></tr></thead>
        <tbody>
          ${viaticos.map(v => `<tr><td><strong>${v.codigo_planilla}</strong><br/><small>[${v.codigo_dependencia}] ${v.nombre_dependencia}</small></td><td><strong>${v.origen_comision} → ${v.destino_comision}</strong><br/><small>${v.documento_autorizacion} — ${v.motivo_comision}</small></td><td><strong>${window.fmtSoles(v.monto_total_solicitud)}</strong></td></tr>`).join("")}
        </tbody>
      </table>
    `;
  } else {
    const rubros = [
      { n: "Agua en Bidones (5.2.1.3.1.h)", e: "2.3.1.1.1.1", u: 8 },
      { n: "Combustible y Lubricantes (5.2.1.3.2)", e: "2.3.1.3.1.1", u: 8 },
      { n: "Útiles, Tóner y Materiales (5.2.1.3.3)", e: "2.3.1.5.1.2", u: 8 },
      { n: "Mantenimiento y Reparaciones (5.2.1.3.11)", e: "2.3.2.4.7.1", u: 8 }
    ];
    contTabla.innerHTML = `<table class="anc-list-table"><thead><tr><th>RUBRO</th><th>TOPE ANUAL</th><th>EJECUTADO</th></tr></thead><tbody>${rubros.map(r => {
      const ej = gastos.filter(g => g.especifica_gasto === r.e && g.estado_auditoria !== "OBSERVADO").reduce((a, b) => a + Number(b.monto_total_soles || 0), 0);
      return `<tr><td><strong>${r.n}</strong> (${r.e})</td><td>${r.u} UIT (${window.fmtSoles(r.u * uit)})</td><td><strong>${window.fmtSoles(ej)}</strong> (${(ej / uit).toFixed(2)} UIT)</td></tr>`;
    }).join("")}</tbody></table>`;
  }
}

window.cambiarEstadoAuditoriaGasto = async function(idGasto, nuevoEstado) {
  let obs = nuevoEstado === "OBSERVADO" ? prompt("Motivo de observación:", "Subsanar sustento") : null;
  await window.SupabaseANC.request("anc_gastos_caja_encargos", "PATCH", `id=eq.${idGasto}`, { estado_auditoria: nuevoEstado, observacion_administrador: obs });
  window.ADMIN_STATE.gastosConsolidados = window.ADMIN_STATE.gastosConsolidados.map(g => Number(g.id) === Number(idGasto) ? { ...g, estado_auditoria: nuevoEstado, observacion_administrador: obs } : g);
  localStorage.setItem("anc_gastos_caja_local_v1", JSON.stringify(window.ADMIN_STATE.gastosConsolidados));
  actualizarKPIsYTablasAdmin();
};

window.exportarConsolidadoExcelCSV = function() {
  const { gastos, viaticos } = obtenerListasFiltradasAdmin();
  const cab = ["TIPO", "DEPENDENCIA", "FECHA", "DOCUMENTO", "RUC_DNI", "PROVEEDOR_LOCADOR", "ESPECIFICA", "DETALLE", "TOTAL_SOLES", "ESTADO"];
  const filas = [
    ...gastos.map(g => [g.modalidad_fondo, g.nombre_dependencia, g.fecha_emision, `${g.tipo_comprobante} ${g.serie_numero_comprobante}`, g.ruc_dni_proveedor, g.razon_social_proveedor, g.especifica_gasto, g.concepto_detalle, Number(g.monto_total_soles || 0).toFixed(2), g.estado_auditoria]),
    ...viaticos.map(v => ["VIATICOS", v.nombre_dependencia, (v.fecha_hora_salida || "").slice(0, 10), v.codigo_planilla, "-", v.destino_comision, "2.3.2.1.2.2", v.motivo_comision, Number(v.monto_total_solicitud || 0).toFixed(2), v.estado_solicitud])
  ];
  window.MotorAnexosANC.exportarExcelCSV("Consolidado_Nacional_ANC_MP.csv", cab, filas);
};

window.imprimirReporteConsolidadoAdminPDF = function() {
  const { gastos, viaticos } = obtenerListasFiltradasAdmin();
  const totG = gastos.reduce((a, b) => a + Number(b.monto_total_soles || 0), 0);
  const totV = viaticos.reduce((a, b) => a + Number(b.monto_total_solicitud || 0), 0);
  const cab = window.MotorAnexosANC.cabeceraDirectivaHTML("OGFIN/DIR-01", "REPORTE CONSOLIDADO NACIONAL DE AUDITORÍA (CAJA CHICA, VIÁTICOS Y ENCARGOS)", "08");
  const html = `
    <div class="hoja-oficial">
      ${cab}
      <div class="titulo-anexo-nombre">CONSOLIDADO NACIONAL DE EJECUCIÓN Y AUDITORÍA - UE 012: ANC-MP</div>
      <table class="tabla-directiva">
        <thead><tr><th>DEPENDENCIA / ADC</th><th>DOCUMENTO</th><th>PROVEEDOR / LOCADOR</th><th>ESPECÍFICA / DETALLE</th><th>ESTADO</th><th style="text-align:right;">IMPORTE (S/)</th></tr></thead>
        <tbody>
          ${gastos.map(g => `<tr><td>[${g.codigo_dependencia}] ${g.nombre_dependencia}</td><td>${g.tipo_comprobante} ${g.serie_numero_comprobante}</td><td>${g.razon_social_proveedor} (${g.ruc_dni_proveedor})</td><td>${g.especifica_gasto} — ${g.concepto_detalle}</td><td>${g.estado_auditoria}</td><td style="text-align:right;">${Number(g.monto_total_soles).toFixed(2)}</td></tr>`).join("")}
          <tr class="fila-subtotal"><td colspan="5" style="text-align:right;">TOTAL CONSOLIDADO CAJA CHICA Y ENCARGOS:</td><td style="text-align:right;">${window.fmtSoles(totG)}</td></tr>
          <tr class="fila-total-general"><td colspan="5" style="text-align:right;">TOTAL CONSOLIDADO PLANILLAS DE VIÁTICOS (${viaticos.length}):</td><td style="text-align:right;">${window.fmtSoles(totV)}</td></tr>
        </tbody>
      </table>
    </div>
  `;
  window.MotorAnexosANC.imprimirDocumentoOficial("Reporte_Nacional_Auditoria_ANC_MP", html, "landscape");
};