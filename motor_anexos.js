// =========================================================================================
// MOTOR DE IMPRESIÓN LIMPIA Y FORMATOS OFICIALES EXACTOS (motor_anexos.js)
// UE 012: AUTORIDAD NACIONAL DE CONTROL DEL MINISTERIO PÚBLICO (ANC-MP)
// Imprime ÚNICAMENTE el Anexo Oficial con el Logo Oficial de la ANC-MP en una ventana limpia,
// sin arrastrar menús ni formularios de la aplicación y sin acumular vistas abajo.
// =========================================================================================

(function inicializarLogoOficialANCBase64() {
  try {
    const canvas = document.createElement("canvas");
    // Dimensiones recortadas sin márgenes blancos excesivos (proporción horizontal compacta y nítida)
    canvas.width = 680;
    canvas.height = 340;
    const ctx = canvas.getContext("2d");

    // 1. Fondo Blanco Puro Oficial (#FFFFFF)
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 2. Escudo Dorado del Ministerio Público (Izquierda Superior)
    const cx = 135;
    const cy = 118;

    // Argolla superior de la medalla
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(cx, 22, 22, 11, 0, 0, Math.PI * 2);
    ctx.lineWidth = 5.5;
    ctx.strokeStyle = "#B48327";
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(cx, 22, 22, 11, 0, 0, Math.PI * 2);
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#F3D37A";
    ctx.stroke();

    // Corona exterior de laureles y espigas doradas
    const gradOro = ctx.createLinearGradient(cx - 65, cy - 85, cx + 65, cy + 85);
    gradOro.addColorStop(0, "#E6C15A");
    gradOro.addColorStop(0.35, "#FFF0A8");
    gradOro.addColorStop(0.7, "#C5922B");
    gradOro.addColorStop(1, "#8F6314");

    ctx.beginPath();
    ctx.ellipse(cx, cy, 62, 82, 0, 0, Math.PI * 2);
    ctx.fillStyle = gradOro;
    ctx.fill();
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = "#8C6218";
    ctx.stroke();

    // Detalles de hojas de laurel (izquierda) y espigas (derecha)
    ctx.strokeStyle = "#78510F";
    ctx.lineWidth = 1.6;
    for (let a = -1.25; a <= 1.25; a += 0.25) {
      const lx = cx - 54 * Math.cos(a * 0.85);
      const ly = cy + 68 * Math.sin(a);
      ctx.beginPath();
      ctx.arc(lx, ly, 6, 0, Math.PI);
      ctx.stroke();

      const rx = cx + 54 * Math.cos(a * 0.85);
      const ry = cy + 68 * Math.sin(a);
      ctx.beginPath();
      ctx.arc(rx, ry, 6, 0, Math.PI);
      ctx.stroke();
    }

    // Óvalo interior del escudo
    const gradInterno = ctx.createRadialGradient(cx, cy, 8, cx, cy, 66);
    gradInterno.addColorStop(0, "#FCE79C");
    gradInterno.addColorStop(0.7, "#D9A83E");
    gradInterno.addColorStop(1, "#9B6D1B");

    ctx.beginPath();
    ctx.ellipse(cx, cy, 46, 66, 0, 0, Math.PI * 2);
    ctx.fillStyle = gradInterno;
    ctx.fill();
    ctx.lineWidth = 2.2;
    ctx.strokeStyle = "#6E470B";
    ctx.stroke();

    // Banda perimetral de lemas (AMA SUA, AMA QUILLA, AMA LLULLA / MINISTERIO PUBLICO)
    ctx.beginPath();
    ctx.ellipse(cx, cy, 37, 54, 0, 0, Math.PI * 2);
    ctx.lineWidth = 1.4;
    ctx.strokeStyle = "#784F10";
    ctx.stroke();

    ctx.fillStyle = "#4A2E04";
    ctx.font = "bold 7.5px Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("AMA QUILLA", cx, cy - 56);
    ctx.fillText("MINISTERIO PUBLICO", cx, cy + 61);

    ctx.save();
    ctx.translate(cx - 41, cy);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText("AMA SUA", 0, 0);
    ctx.restore();

    ctx.save();
    ctx.translate(cx + 41, cy);
    ctx.rotate(Math.PI / 2);
    ctx.fillText("AMA LLULLA", 0, 0);
    ctx.restore();

    // Sol radiante de fondo en el escudo
    ctx.strokeStyle = "#8B5E14";
    ctx.lineWidth = 1.1;
    for (let r = 0; r < Math.PI * 2; r += Math.PI / 12) {
      ctx.beginPath();
      ctx.moveTo(cx, cy - 4);
      ctx.lineTo(cx + Math.cos(r) * 32, cy - 4 + Math.sin(r) * 42);
      ctx.stroke();
    }

    // Espada / Fasces vertical central y Balanza de la Justicia
    ctx.fillStyle = "#5C3A06";
    ctx.fillRect(cx - 3.5, cy - 40, 7, 82);
    ctx.fillRect(cx - 28, cy - 18, 56, 4);

    // Platillos de la balanza
    ctx.lineWidth = 1.8;
    ctx.strokeStyle = "#4A2E04";
    // Platillo izquierdo
    ctx.beginPath();
    ctx.moveTo(cx - 24, cy - 16);
    ctx.lineTo(cx - 33, cy + 8);
    ctx.lineTo(cx - 15, cy + 8);
    ctx.closePath();
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx - 24, cy + 8, 10, 0, Math.PI);
    ctx.fillStyle = "#784F10";
    ctx.fill();

    // Platillo derecho
    ctx.beginPath();
    ctx.moveTo(cx + 24, cy - 16);
    ctx.lineTo(cx + 15, cy + 8);
    ctx.lineTo(cx + 33, cy + 8);
    ctx.closePath();
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx + 24, cy + 8, 10, 0, Math.PI);
    ctx.fillStyle = "#784F10";
    ctx.fill();

    // Lazo inferior del escudo
    ctx.beginPath();
    ctx.moveTo(cx - 14, cy + 86);
    ctx.lineTo(cx, cy + 79);
    ctx.lineTo(cx + 14, cy + 86);
    ctx.lineWidth = 3.5;
    ctx.strokeStyle = "#3B2304";
    ctx.stroke();
    ctx.restore();

    // 3. Siglas "ANC" en Negro Sólido a la Derecha del Escudo
    ctx.fillStyle = "#000000";
    ctx.font = "900 158px Arial, Helvetica, sans-serif";
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
    ctx.fillText("ANC", 232, 184);

    // 4. Línea Divisoria Horizontal Negra
    ctx.fillStyle = "#000000";
    ctx.fillRect(58, 214, 564, 4.5);

    // 5. Texto Inferior: "Autoridad Nacional de Control" / "MINISTERIO PÚBLICO"
    ctx.fillStyle = "#000000";
    ctx.textAlign = "center";
    ctx.font = "bold 38px Arial, Helvetica, sans-serif";
    ctx.fillText("Autoridad Nacional de Control", 340, 266);

    ctx.font = "400 35px Arial, Helvetica, sans-serif";
    ctx.fillText("MINISTERIO PÚBLICO", 340, 314);

    // Exportación directa a cadena Base64 data:image/jpeg;base64,...
    window.LOGO_ANC_BASE64 = canvas.toDataURL("image/jpeg", 0.96);
  } catch (err) {
    console.warn("Fallback logo Base64:", err);
    window.LOGO_ANC_BASE64 = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/wAALCAABAAEBAREA/8QAFAABAAAAAAAAAAAAAAAAAAAACf/EABQQAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQEAAD8AVN//2Q==";
  }
})();

window.LOGO_ANC_SVG_INLINE = `<img src="${window.LOGO_ANC_BASE64}" style="max-height:56px; width:auto; display:block; margin:0 auto;" alt="ANC-MP" />`;

window.MotorAnexosANC = {
  // Abre una ventana emergente limpia o iframe dedicado SOLO con el formato oficial de la Directiva
  imprimirDocumentoOficial(tituloVentana, htmlContenido, orientacion = "portrait") {
    const estilosBase = `
      @page { size: A4 ${orientacion}; margin: 12mm 14mm; }
      * { box-sizing: border-box; margin: 0; padding: 0; }
      body {
        font-family: Arial, Helvetica, sans-serif;
        color: #000000;
        background: #FFFFFF;
        font-size: 11px;
        line-height: 1.35;
      }
      .hoja-oficial {
        width: 100%;
        page-break-after: always;
      }
      .hoja-oficial:last-child {
        page-break-after: auto;
      }
      .encabezado-directiva {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 12px;
      }
      .encabezado-directiva td {
        border: 1.5px solid #000;
        padding: 6px 8px;
        vertical-align: middle;
        background-color: #FFFFFF;
      }
      .titulo-anexo-num {
        text-align: center;
        font-size: 13px;
        font-weight: 900;
        margin: 8px 0 2px 0;
        text-transform: uppercase;
      }
      .titulo-anexo-nombre {
        text-align: center;
        font-size: 12.5px;
        font-weight: 900;
        text-decoration: underline;
        margin-bottom: 12px;
        text-transform: uppercase;
      }
      table.tabla-directiva {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 10px;
      }
      table.tabla-directiva th, table.tabla-directiva td {
        border: 1px solid #000;
        padding: 5px 6px;
        font-size: 10.5px;
        vertical-align: middle;
      }
      table.tabla-directiva th {
        background-color: #E2E8F0 !important;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
        font-weight: 900;
        text-transform: uppercase;
      }
      .fila-subtotal {
        background-color: #F1F5F9 !important;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
        font-weight: bold;
      }
      .fila-total-general {
        background-color: #FEF3C7 !important;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
        font-weight: 900;
        font-size: 11.5px;
      }
      .bloque-firmas {
        display: flex;
        justify-content: space-around;
        align-items: flex-end;
        margin-top: 46px;
        text-align: center;
        page-break-inside: avoid;
      }
      .linea-firma {
        width: 30%;
        border-top: 1.5px solid #000;
        padding-top: 5px;
        font-size: 10px;
      }
      .notas-pie {
        font-size: 9.2px;
        line-height: 1.32;
        border: 1px solid #000;
        padding: 7px 9px;
        margin-top: 8px;
        text-align: justify;
      }
      .barra-acciones-vista {
        background: #0F172A;
        color: #FFFFFF;
        padding: 10px 16px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 14px;
        border-bottom: 3px solid #D97706;
      }
      .btn-print-top {
        background: #F59E0B;
        color: #0F172A;
        border: none;
        padding: 8px 16px;
        border-radius: 8px;
        font-weight: 900;
        cursor: pointer;
        font-size: 12px;
      }
      @media print {
        .barra-acciones-vista { display: none !important; }
      }
    `;

    const docHTML = `<!DOCTYPE html>
      <html lang="es-PE">
      <head>
        <meta charset="UTF-8"/>
        <title>${tituloVentana}</title>
        <style>${estilosBase}</style>
      </head>
      <body>
        <div class="barra-acciones-vista">
          <div><strong>UE 012: ANC-MP</strong> • Vista Previa de Impresión Oficial (${tituloVentana})</div>
          <div style="display:flex; gap:8px;">
            <button class="btn-print-top" onclick="window.print()">🖨️ Imprimir / Guardar PDF</button>
            <button class="btn-print-top" style="background:#334155; color:#FFF;" onclick="window.close()">✕ Cerrar</button>
          </div>
        </div>
        ${htmlContenido}
        <script>
          window.onload = function() {
            setTimeout(function() { window.print(); }, 250);
          };
        <\/script>
      </body>
      </html>`;

    const win = window.open("", "_blank", "width=920,height=780,scrollbars=yes");
    if (win) {
      win.document.open();
      win.document.write(docHTML);
      win.document.close();
    } else {
      // Fallback mediante iframe oculto si el navegador bloquea popups
      let iframe = document.getElementById("iframe-impresion-anc");
      if (!iframe) {
        iframe = document.createElement("iframe");
        iframe.id = "iframe-impresion-anc";
        iframe.style.position = "fixed";
        iframe.style.right = "0";
        iframe.style.bottom = "0";
        iframe.style.width = "0";
        iframe.style.height = "0";
        iframe.style.border = "0";
        document.body.appendChild(iframe);
      }
      const doc = iframe.contentWindow.document;
      doc.open();
      doc.write(docHTML);
      doc.close();
    }
  },

  // Genera el cuadro de cabecera idéntico a las Directivas del MP con el Logo Oficial ANC-MP en Base64 JPEG sobre fondo blanco
  cabeceraDirectivaHTML(codigoDoc, nombreDirectiva, versionDoc) {
    return `
      <table class="encabezado-directiva">
        <tr>
          <td style="width:24%; text-align:center; background-color:#FFFFFF;">
            <img src="${window.LOGO_ANC_BASE64}" style="max-height:56px; width:auto; display:block; margin:0 auto;" alt="ANC-MP" />
          </td>
          <td style="width:52%; text-align:center;">
            <div style="font-size:9.5px; font-weight:bold; border-bottom:1px solid #000; padding-bottom:3px; margin-bottom:4px;">
              DOCUMENTO INTERNO
            </div>
            <div style="font-size:11px; font-weight:900; text-transform:uppercase;">
              DIRECTIVA<br/>${nombreDirectiva}
            </div>
          </td>
          <td style="width:24%; font-size:10px;">
            <div><strong>Código:</strong> ${codigoDoc}</div>
            <div><strong>Versión:</strong> ${versionDoc}</div>
            <div><strong>Fecha:</strong> ${new Date().toLocaleDateString("es-PE")}</div>
          </td>
        </tr>
      </table>
    `;
  },

  // Exportador universal a Excel (CSV UTF-8 con separador ';' para Microsoft Excel en español)
  exportarExcelCSV(nombreArchivo, cabeceras, filasDatos) {
    const escapar = (val) => {
      const s = String(val ?? "").replace(/"/g, '""');
      return `"${s}"`;
    };
    const lineas = [
      cabeceras.map(escapar).join(";"),
      ...filasDatos.map(fila => fila.map(escapar).join(";"))
    ];
    const contenido = "\uFEFF" + lineas.join("\r\n");
    const blob = new Blob([contenido], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = nombreArchivo.endsWith(".csv") ? nombreArchivo : `${nombreArchivo}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};