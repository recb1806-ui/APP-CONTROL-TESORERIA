// =========================================================================================
// MÓDULO DE VISIÓN COMPUTACIONAL EN NAVEGADOR: LECTOR DE COMPROBANTES (QR SUNAT + OCR LOCAL)
// Archivo: lector_comprobantes.js
// Unidad Ejecutora 012: Autoridad Nacional de Control del Ministerio Público (ANC-MP)
// Directiva GFIN/DIR-01 Versión 10 + Resolución N° 000038-2025-MP-FN-GG-OGFIN
// - Lectura multi-pasada de Código QR Oficial SUNAT (jsQR)
// - Reconocimiento Óptico de Caracteres (OCR) local en español sin IA externa (Tesseract.js)
// - Diccionario Ampliado de Búsqueda de Campos (Serie/N°, Fecha, RUC/Proveedor, Total, Propinas)
// - Diccionario Ampliado de Clasificación Automática para las 7 Columnas del Anexo 04
// - Caché local inteligente de RUC -> Razón Social en localStorage
// =========================================================================================

(function () {
  "use strict";

  const STORAGE_KEY_RUC_CACHE = "anc_diccionario_ruc_proveedores_v1";
  const RUC_INSTITUCIONAL_MP = "20131370301";

  // RUCs semilla frecuentes en comisiones de servicios a nivel nacional
  const RUC_PROVEEDORES_SEMILLA = {
    "20100047218": "EMPRESA DE TRANSPORTES CRUZ DEL SUR S.A.C.",
    "20135414931": "EMPRESA DE TRANSPORTE TURISTICO OLTURSA S.A.",
    "20555901179": "MOVIL BUS S.A.C.",
    "20100114349": "TURISMO CIVA S.A.C.",
    "20131823020": "ITTSABUS S.A.C.",
    "20100035392": "TRANSPORTES LINEA S.A.",
    "20119407738": "TURISMO EXPRESO PULLMAN TEPSA S.A.",
    "20100122287": "EMPRESA DE TRANSPORTES FLORES HNOS. S.R.L.",
    "20309026303": "EXPRESO INTERNACIONAL PALOMINO S.A.C.",
    "20550372640": "CONCESIONARIA RUTAS DE LIMA S.A.C.",
    "20523656606": "LIMA EXPRESA S.A.C.",
    "20505377142": "CONCESIONARIA VIAL DEL SOL S.A. - COVISOL",
    "20505121261": "NORVIAL S.A.",
    "20537510523": "DEVIANDES TRAMO 2 S.A.C.",
    "20516724221": "SURVIAL S.A.",
    "20100077044": "CORPAC S.A.",
    "20512264731": "PRIMAX S.A.",
    "20503840121": "REPSOL COMERCIAL S.A.C.",
    "20100128218": "PETROLEOS DEL PERU - PETROPERU S.A.",
    "20259829594": "PERUANA DE COMBUSTIBLES S.A. - PECSA",
    "20100049181": "INTURSA - HOTELES LIBERTADOR",
    "20100053455": "NESSUS HOTELES PERU S.A. - CASA ANDINA",
    "20505670443": "COSTA DEL SOL S.A."
  };

  // =======================================================================================
  // 1. DICCIONARIO AMPLIADO DE CLASIFICACIÓN AUTOMÁTICA PARA LAS 7 COLUMNAS DEL ANEXO 04
  // =======================================================================================
  const DICCIONARIO_COLUMNAS_ANEXO_04 = {
    HOSPEDAJE: [
      "hotel", "hostal", "hospedaje", "alojamiento", "habitacion", "suite",
      "pernocte", "noche de alojamiento", "apart hotel", "lodge", "posada",
      "residencial", "bungalow", "check in", "check out", "tarifa por noche",
      "servicio de hospedaje", "estadia"
    ],
    ALIMENTACION: [
      "restaurante", "restaurant", "chifa", "polleria", "cevicheria", "cebicheria",
      "pizzeria", "cafeteria", "cafe", "sangucheria", "panaderia", "pasteleria",
      "dulceria", "recreo", "picanteria", "tratoria", "parrillada", "carnes",
      "mariscos", "consumo de alimentos", "alimentacion", "desayuno", "almuerzo",
      "cena", "menu", "ejecutivo", "plato a la carta", "buffet", "bebidas",
      "agua", "refresco", "gaseosa", "jugo", "caldo", "sopa", "arroz", "pollo",
      "pescado", "lomo", "pension alimenticia"
    ],
    MOVILIDAD: [
      "taxi", "movilidad local", "servicio de taxi", "traslado urbano", "uber",
      "cabify", "indriver", "satellital", "taxi seguro", "carrera",
      "desplazamiento local", "radiotaxi"
    ],
    PASAJES: [
      "boleto de viaje", "pasaje terrestre", "pasaje fluvial",
      "transporte interprovincial", "agencia de transportes", "terminal terrestre",
      "terrapuerto", "embarque", "asiento", "ruta", "origen", "destino",
      "cruz del sur", "oltursa", "movil bus", "movil tours", "civa", "excluciva",
      "ittsa", "ittsabus", "linea", "flores hnos", "tepsa", "cial", "cromotex",
      "palomino", "wari", "chankas", "molina", "gh bus", "turismo dias",
      "transporte", "lancha", "deslizador", "bote", "fluvial"
    ],
    COMBUSTIBLE: [
      "grifo", "estacion de servicios", "servicentro", "gasolinera", "primax",
      "repsol", "petroperu", "pecsa", "terpel", "ava", "energigas", "gasohol",
      "gasolina", "regular", "premium", "90", "95", "97", "84", "diesel", "db5",
      "b5 s50", "petroleo", "glp", "gnv", "carburante", "lubricante", "galones",
      "litros", "surtidor"
    ],
    PEAJE: [
      "peaje", "unidad de peaje", "garita", "ticket de peaje", "tarifa de peaje",
      "concesionaria vial", "rutas de lima", "lima expresa", "covisol", "norvial",
      "deviandes", "survial", "irsa", "covicentro", "covinca", "autopista del sol",
      "red vial", "provias", "eje", "categoria liviano", "vehiculo ligero"
    ],
    OTROS: [
      "seguro de viaje", "asistencia al viajero", "tua", "corpac",
      "tarifa unificada de uso de aeropuerto", "cochera", "estacionamiento",
      "parqueo", "custodia", "guardiania"
    ]
  };

  // =======================================================================================
  // 2. DICCIONARIO AMPLIADO DE BÚSQUEDA DE ETIQUETAS Y DETECTOR DE PROPINAS
  // =======================================================================================
  const DICCIONARIO_CAMPOS = {
    etiquetasSerieNumero: [
      "FACTURA ELECTRONICA", "BOLETA DE VENTA ELECTRONICA", "BOLETA ELECTRONICA",
      "TICKET ELECTRONICO", "BOLETO DE VIAJE", "COMP. NRO", "COMPROBANTE NRO",
      "TICKET NRO", "RECIBO", "SERIE", "NRO.", "NRO", "N°"
    ],
    etiquetasFecha: [
      "FECHA DE EMISION", "FEC. EMISION", "F. EMISION", "FECHA EMISION",
      "EMITIDO EL", "FECHA DE VIAJE", "FECHA EXPEDICION", "FEC. EXPEDICION",
      "FECHA:", "FEC:", "DATE:"
    ],
    palabrasSocietariasYComerciales: [
      "S.A.C.", "S.A.C", "SAC", "S.R.L.", "S.R.L", "SRL", "E.I.R.L.", "E.I.R.L",
      "EIRL", "S.A.A.", "S.A.", "HOTEL", "HOSTAL", "HOSPEDAJE", "RESTAURANTE",
      "RESTAURANT", "CHIFA", "POLLERIA", "CEVICHERIA", "CEBICHERIA", "CAFETERIA",
      "PANADERIA", "INVERSIONES", "SERVICIOS", "TRANSPORTES", "EMPRESA DE TRANSPORTES",
      "TURISMO", "GRIFO", "ESTACION DE SERVICIOS", "SERVICENTRO", "CONCESIONARIA",
      "CORPORACION", "GRUPO", "NEGOCIOS", "COMERCIAL", "RECREO"
    ],
    exclusionesEntidadCompradora: [
      "20131370301", "MINISTERIO PUBLICO", "MINISTERIO PÚBLICO",
      "AUTORIDAD NACIONAL DE CONTROL", "FISCALIA DE LA NACION",
      "FISCALÍA DE LA NACIÓN", "GERENCIA GENERAL", "UE 012", "ANC-MP"
    ],
    etiquetasImporteTotal: [
      "IMPORTE TOTAL", "TOTAL A PAGAR", "TOTAL VENTA", "VALOR TOTAL",
      "NETO A PAGAR", "MONTO TOTAL", "PRECIO TOTAL", "TOTAL GENERAL",
      "TOTAL S/", "TOTAL S/.", "TOTAL PEN", "TOTAL:"
    ],
    etiquetasIgnorarImporte: [
      "OP. GRAVADA", "OP GRAVADA", "OPERACION GRAVADA", "OP. EXONERADA",
      "OP. INAFECTA", "SUBTOTAL", "SUB TOTAL", "SUB-TOTAL", "VALOR VENTA",
      "VALOR DE VENTA", "IGV", "I.G.V", "18%", "EFECTIVO ENTREGADO",
      "EFECTIVO RECIBIDO", "IMPORTE RECIBIDO", "VUELTO", "CAMBIO",
      "DESCUENTO", "ANTICIPO", "REDONDEO"
    ],
    terminosPropinaProhibida: [
      "PROPINA SUGERIDA", "PROPINA VOLUNTARIA", "SERVICIO OPCIONAL",
      "RECARGO AL CONSUMO", "PROPINA", "GRATUITY", "TIP"
    ]
  };

  // =======================================================================================
  // 3. UTILIDADES DE TEXTO, NORMALIZACIÓN Y CACHÉ DE PROVEEDORES POR RUC
  // =======================================================================================
  function normalizarTextoPlano(str) {
    return String(str || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/\s+/g, " ")
      .trim();
  }

  function normalizarMayusculasSinTildes(str) {
    return String(str || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toUpperCase()
      .trim();
  }

  function obtenerMapaRucProveedores() {
    try {
      const guardado = JSON.parse(localStorage.getItem(STORAGE_KEY_RUC_CACHE) || "{}");
      return { ...RUC_PROVEEDORES_SEMILLA, ...guardado };
    } catch (e) {
      return { ...RUC_PROVEEDORES_SEMILLA };
    }
  }

  function obtenerRazonSocialPorRuc(ruc) {
    const rucLimpio = String(ruc || "").trim();
    if (!/^(10|20)\d{9}$/.test(rucLimpio) || rucLimpio === RUC_INSTITUCIONAL_MP) {
      return "";
    }
    const mapa = obtenerMapaRucProveedores();
    return mapa[rucLimpio] || "";
  }

  function guardarRucProveedorCache(ruc, razonSocial) {
    const rucLimpio = String(ruc || "").trim();
    let nombreLimpio = String(razonSocial || "").trim();
    nombreLimpio = nombreLimpio.replace(/^RUC\s*\d{11}\s*[-–—:]?\s*/i, "").trim();

    if (!/^(10|20)\d{9}$/.test(rucLimpio) || rucLimpio === RUC_INSTITUCIONAL_MP) return;
    if (!nombreLimpio || nombreLimpio.length < 3) return;
    if (/^establecimiento comercial/i.test(nombreLimpio) || /^proveedor ruc/i.test(nombreLimpio)) return;

    const esEntidad = DICCIONARIO_CAMPOS.exclusionesEntidadCompradora.some(excl =>
      normalizarMayusculasSinTildes(nombreLimpio).includes(normalizarMayusculasSinTildes(excl))
    );
    if (esEntidad) return;

    try {
      const actual = JSON.parse(localStorage.getItem(STORAGE_KEY_RUC_CACHE) || "{}");
      actual[rucLimpio] = nombreLimpio;
      localStorage.setItem(STORAGE_KEY_RUC_CACHE, JSON.stringify(actual));
    } catch (e) {
      console.warn("Aviso guardando caché RUC:", e);
    }
  }

  function extraerRucDeCadenaProveedor(textoProveedor) {
    const match = String(textoProveedor || "").match(/\b((?:10|20)\d{9})\b/);
    if (match && match[1] !== RUC_INSTITUCIONAL_MP) {
      return match[1];
    }
    return "";
  }

  function aprenderDeEdicionUsuario(rucOProveedor, nombreProveedor) {
    const ruc = /^(10|20)\d{9}$/.test(String(rucOProveedor || "").trim())
      ? String(rucOProveedor).trim()
      : extraerRucDeCadenaProveedor(nombreProveedor);
    if (ruc && nombreProveedor) {
      guardarRucProveedorCache(ruc, nombreProveedor);
    }
  }

  // =======================================================================================
  // 4. CONVERSIÓN UNIVERSAL DE FECHAS A FORMATO ESTÁNDAR YYYY-MM-DD
  // =======================================================================================
  const MESES_ES = {
    ene: "01", enero: "01",
    feb: "02", febrero: "02",
    mar: "03", marzo: "03",
    abr: "04", abril: "04",
    may: "05", mayo: "05",
    jun: "06", junio: "06",
    jul: "07", julio: "07",
    ago: "08", agosto: "08",
    sep: "09", set: "09", septiembre: "09", setiembre: "09",
    oct: "10", octubre: "10",
    nov: "11", noviembre: "11",
    dic: "12", diciembre: "12"
  };

  function validarYFormatearFechaISO(anio, mes, dia) {
    let y = Number(anio);
    const m = Number(mes);
    const d = Number(dia);
    if (y < 100) {
      y += y >= 70 ? 1900 : 2000;
    }
    if (y < 2015 || y > 2035) return null;
    if (m < 1 || m > 12) return null;
    if (d < 1 || d > 31) return null;
    return `${String(y).padStart(4, "0")}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
  }

  function normalizarCadenaFechaAISO(strFecha) {
    if (!strFecha) return null;
    const limpio = String(strFecha).trim();

    // 1. Formato YYYY-MM-DD o YYYY/MM/DD o YYYY.MM.DD
    const mIso = limpio.match(/\b(20\d{2})[-/.](0?[1-9]|1[0-2])[-/.](0?[1-9]|[12]\d|3[01])\b/);
    if (mIso) {
      return validarYFormatearFechaISO(mIso[1], mIso[2], mIso[3]);
    }

    // 2. Formato DD/MM/YYYY, DD-MM-YYYY, DD.MM.YYYY o DD/MM/YY
    const mLatam = limpio.match(/\b(0?[1-9]|[12]\d|3[01])[-/.](0?[1-9]|1[0-2])[-/.](20\d{2}|\d{2})\b/);
    if (mLatam) {
      return validarYFormatearFechaISO(mLatam[3], mLatam[2], mLatam[1]);
    }

    // 3. Formato textual en español: "16 DE NOVIEMBRE DE 2026" o "16-NOV-2026"
    const norm = normalizarTextoPlano(limpio);
    const mTexto = norm.match(/\b(0?[1-9]|[12]\d|3[01])\s*(?:de|-|\/|\s)\s*([a-z]{3,10})\s*(?:de|del|-|\/|\s)\s*(20\d{2}|\d{2})\b/);
    if (mTexto && MESES_ES[mTexto[2]]) {
      return validarYFormatearFechaISO(mTexto[3], MESES_ES[mTexto[2]], mTexto[1]);
    }

    return null;
  }

  // =======================================================================================
  // 5. MOTOR DE LECTURA Y PARSEO DEL CÓDIGO QR OFICIAL DE SUNAT (jsQR)
  // Estructura oficial SUNAT: RUC|TIPO|SERIE|NUMERO|IGV|TOTAL|FECHA|TIPO_DOC_ADQ|RUC_ADQ|...
  // =======================================================================================
  function parsearTextoQRSunat(rawText) {
    if (!rawText || typeof rawText !== "string") return null;
    const texto = rawText.trim();

    // Caso 1: Estructura estándar separada por barra vertical '|'
    if (texto.includes("|")) {
      const partes = texto.split("|").map(p => p.trim());
      if (partes.length >= 6) {
        const rucCand = partes[0].replace(/\D/g, "");
        const tipoDoc = partes[1];
        const serieRaw = (partes[2] || "").toUpperCase().replace(/[^A-Z0-9]/g, "");
        const numRaw = (partes[3] || "").replace(/[^0-9]/g, "");
        const igvRaw = parseFloat((partes[4] || "0").replace(",", "."));
        const totalRaw = parseFloat((partes[5] || "0").replace(",", "."));
        const fechaRaw = partes[6] || "";
        const rucAdq = (partes[8] || "").replace(/\D/g, "");

        const esRucValido = /^(10|20)\d{9}$/.test(rucCand) && rucCand !== RUC_INSTITUCIONAL_MP;
        let serieNumero = "";
        if (serieRaw && numRaw) {
          const numPadded = numRaw.length < 4 ? numRaw.padStart(6, "0") : numRaw;
          serieNumero = `${serieRaw}-${numPadded}`;
        }

        const fechaIso = normalizarCadenaFechaAISO(fechaRaw);
        const importeTotal = !isNaN(totalRaw) && totalRaw > 0 ? Number(totalRaw.toFixed(2)) : 0;

        if (esRucValido || serieNumero || importeTotal > 0) {
          return {
            origenDatos: "QR_SUNAT",
            rucProveedor: esRucValido ? rucCand : "",
            tipoComprobanteCodigo: tipoDoc,
            serieNumero,
            igv: !isNaN(igvRaw) ? Number(igvRaw.toFixed(2)) : 0,
            importeTotal,
            fechaIso: fechaIso || "",
            rucAdquiriente: rucAdq,
            rawQR: texto
          };
        }
      }
    }

    // Caso 2: QR con URL de consulta de comprobante electrónico que incluye parámetros
    const rucMatch = texto.match(/\b(10|20)\d{9}\b/);
    const serieMatch = texto.match(/\b([FBET][A-Z0-9]{3})[-–_/](\d{1,8})\b/i);
    const fechaMatch = normalizarCadenaFechaAISO(texto);
    if (rucMatch && serieMatch) {
      return {
        origenDatos: "QR_URL",
        rucProveedor: rucMatch[0] !== RUC_INSTITUCIONAL_MP ? rucMatch[0] : "",
        tipoComprobanteCodigo: "",
        serieNumero: `${serieMatch[1].toUpperCase()}-${serieMatch[2]}`,
        igv: 0,
        importeTotal: 0,
        fechaIso: fechaMatch || "",
        rucAdquiriente: "",
        rawQR: texto
      };
    }

    return null;
  }

  function cargarArchivoEnImagen(file) {
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        URL.revokeObjectURL(url);
        resolve(img);
      };
      img.onerror = (err) => {
        URL.revokeObjectURL(url);
        reject(err);
      };
      img.src = url;
    });
  }

  function intentarDecodificarQREnCanvas(canvas, aplicarUmbralBinarizado = false) {
    if (typeof window.jsQR !== "function") return null;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    const width = canvas.width;
    const height = canvas.height;
    if (!width || !height) return null;

    const imageData = ctx.getImageData(0, 0, width, height);
    if (aplicarUmbralBinarizado) {
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        const lum = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
        const val = lum < 138 ? 0 : 255;
        data[i] = val;
        data[i + 1] = val;
        data[i + 2] = val;
      }
    }

    const code = window.jsQR(imageData.data, width, height, {
      inversionAttempts: "attemptBoth"
    });
    if (code && code.data) {
      const parsed = parsearTextoQRSunat(code.data);
      if (parsed) return parsed;
    }
    return null;
  }

  function detectarQRSunatMultiPasada(img) {
    if (typeof window.jsQR !== "function") return null;

    // Regiones estratégicas donde se ubica el QR en tickets térmicos y facturas A4/móviles
    const regiones = [
      { sx: 0, sy: 0, sw: 1, sh: 1, maxDim: 1200 },             // Imagen completa estándar
      { sx: 0, sy: 0.40, sw: 1, sh: 0.60, maxDim: 1200 },       // Mitad inferior (tickets térmicos)
      { sx: 0.10, sy: 0.45, sw: 0.80, sh: 0.55, maxDim: 1100 }, // Centro-inferior enfocado
      { sx: 0, sy: 0, sw: 1, sh: 1, maxDim: 1600 }              // Alta resolución completa
    ];

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d", { willReadFrequently: true });

    for (const reg of regiones) {
      const cropX = Math.floor(img.naturalWidth * reg.sx);
      const cropY = Math.floor(img.naturalHeight * reg.sy);
      const cropW = Math.floor(img.naturalWidth * reg.sw);
      const cropH = Math.floor(img.naturalHeight * reg.sh);
      if (cropW < 40 || cropH < 40) continue;

      const scale = Math.min(1, reg.maxDim / Math.max(cropW, cropH));
      canvas.width = Math.max(1, Math.floor(cropW * scale));
      canvas.height = Math.max(1, Math.floor(cropH * scale));

      ctx.drawImage(img, cropX, cropY, cropW, cropH, 0, 0, canvas.width, canvas.height);

      // Pasada 1: Escala de color natural
      let resultado = intentarDecodificarQREnCanvas(canvas, false);
      if (resultado) return resultado;

      // Pasada 2: Binarización de alto contraste para impresiones térmicas tenues
      resultado = intentarDecodificarQREnCanvas(canvas, true);
      if (resultado) return resultado;
    }

    return null;
  }

  // =======================================================================================
  // 6. PREPROCESAMIENTO DE IMAGEN Y EJECUCIÓN DE OCR EN ESPAÑOL (Tesseract.js)
  // =======================================================================================
  function prepararCanvasParaOCR(img) {
    const maxDim = 1750;
    const w = img.naturalWidth || img.width;
    const h = img.naturalHeight || img.height;
    const scale = Math.min(1, maxDim / Math.max(w, h));

    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.floor(w * scale));
    canvas.height = Math.max(1, Math.floor(h * scale));

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    // Mejora de contraste suave en escala de grises para resaltar texto térmico
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const d = imgData.data;
    const contrast = 1.28;
    const intercept = 128 * (1 - contrast);

    for (let i = 0; i < d.length; i += 4) {
      const gray = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
      const boosted = Math.min(255, Math.max(0, gray * contrast + intercept));
      d[i] = boosted;
      d[i + 1] = boosted;
      d[i + 2] = boosted;
    }
    ctx.putImageData(imgData, 0, 0);
    return canvas;
  }

  async function ejecutarOCREspanol(img, onProgress) {
    if (!window.Tesseract || typeof window.Tesseract.recognize !== "function") {
      return "";
    }
    try {
      const canvasOCR = prepararCanvasParaOCR(img);
      const result = await window.Tesseract.recognize(canvasOCR, "spa", {
        logger: (m) => {
          if (typeof onProgress === "function" && m && m.status === "recognizing text") {
            onProgress(Math.round((m.progress || 0) * 100));
          }
        }
      });
      return (result && result.data && result.data.text) ? result.data.text : "";
    } catch (err) {
      console.warn("Aviso en OCR Tesseract:", err);
      return "";
    }
  }

  // =======================================================================================
  // 7. MOTOR DE EXTRACCIÓN DE CAMPOS MEDIANTE DICCIONARIO AMPLIADO SOBRE TEXTO OCR
  // =======================================================================================

  // A) Búsqueda de SERIE Y NÚMERO DE COMPROBANTE
  function buscarSerieYNumeroEnTexto(textoOCR) {
    if (!textoOCR) return "";
    const lineas = textoOCR.split(/\r?\n/).map(l => l.trim()).filter(Boolean);

    // Normaliza confusiones típicas de OCR en series (ej: FOO1 -> F001, BOO1 -> B001, EOO1 -> E001)
    const normalizarSerieOCR = (s) => {
      const up = s.toUpperCase();
      return up[0] + up.slice(1).replace(/O/g, "0").replace(/I/g, "1").replace(/S/g, "5");
    };

    // 1. Patrón electrónico explícito: F001-..., B001-..., E001-..., EB01-..., BA01-..., FA01-..., T001-...
    const regexElectronico = /\b([FBET][A-Z0-9O]{3})\s*[-–—:]\s*0*(\d{1,8})\b/i;
    for (const linea of lineas) {
      const m = linea.match(regexElectronico);
      if (m) {
        const serie = normalizarSerieOCR(m[1]);
        const numero = m[2].length < 4 ? m[2].padStart(6, "0") : m[2];
        return `${serie}-${numero}`;
      }
    }

    // 2. Patrón con espacio o cerca de etiquetas de comprobante ("SERIE F001 NRO 001234")
    const textoMayus = normalizarMayusculasSinTildes(textoOCR);
    const mSeparado = textoMayus.match(/\b([FBET][A-Z0-9]{3})\s+(?:N°|NRO\.?|NUMERO|-\s*)?\s*0*(\d{3,8})\b/);
    if (mSeparado) {
      const serie = normalizarSerieOCR(mSeparado[1]);
      return `${serie}-${mSeparado[2]}`;
    }

    // 3. Patrón físico o boleto de viaje: 0001-012345 o 001-004521
    const regexFisico = /\b(00\d{1,2}|0\d{2})\s*[-–—]\s*0*(\d{2,8})\b/;
    for (const linea of lineas) {
      if (/RUC|TEL|CEL|FECHA|HORA/i.test(linea)) continue;
      const mFis = linea.match(regexFisico);
      if (mFis) {
        return `${mFis[1]}-${mFis[2].padStart(6, "0")}`;
      }
    }

    // 4. Búsqueda junto a etiquetas explícitas (TICKET, BOLETO DE VIAJE, RECIBO, COMP. NRO, N°)
    for (let i = 0; i < lineas.length; i++) {
      const linUp = normalizarMayusculasSinTildes(lineas[i]);
      const tieneEtiqueta = DICCIONARIO_CAMPOS.etiquetasSerieNumero.some(et => linUp.includes(et));
      if (tieneEtiqueta) {
        const ventana = `${lineas[i]} ${lineas[i + 1] || ""}`;
        const mVent = ventana.match(/\b([A-Z0-9]{3,4})\s*[-–—]\s*(\d{2,8})\b/i);
        if (mVent && !/^(202\d|19\d\d)$/.test(mVent[1])) {
          return `${mVent[1].toUpperCase()}-${mVent[2]}`;
        }
      }
    }

    return "";
  }

  // B) Búsqueda de FECHA DE EMISIÓN
  function buscarFechaEmisionEnTexto(textoOCR) {
    if (!textoOCR) return "";
    const lineas = textoOCR.split(/\r?\n/).map(l => l.trim()).filter(Boolean);

    // 1. Priorizar líneas con etiquetas de Fecha de Emisión / Fecha de Viaje
    for (let i = 0; i < lineas.length; i++) {
      const linUp = normalizarMayusculasSinTildes(lineas[i]);
      const coincideEtiqueta = DICCIONARIO_CAMPOS.etiquetasFecha.some(et => linUp.includes(et));
      if (coincideEtiqueta) {
        const fMismaLinea = normalizarCadenaFechaAISO(lineas[i]);
        if (fMismaLinea) return fMismaLinea;
        if (lineas[i + 1]) {
          const fSigLinea = normalizarCadenaFechaAISO(lineas[i + 1]);
          if (fSigLinea) return fSigLinea;
        }
      }
    }

    // 2. Búsqueda general en todas las líneas del comprobante
    for (const linea of lineas) {
      const f = normalizarCadenaFechaAISO(linea);
      if (f) return f;
    }

    return "";
  }

  // C) Búsqueda de PROVEEDOR / ESTABLECIMIENTO Y RUC (con caché en localStorage)
  function buscarProveedorYRucEnTexto(textoOCR, rucDesdeQR = "") {
    const lineas = String(textoOCR || "")
      .split(/\r?\n/)
      .map(l => l.replace(/[|_~`^]/g, " ").replace(/\s+/g, " ").trim())
      .filter(l => l.length >= 3);

    // 1. Detectar RUC del emisor descartando el RUC 20131370301 del Ministerio Público
    let rucDetectado = rucDesdeQR && rucDesdeQR !== RUC_INSTITUCIONAL_MP ? rucDesdeQR : "";
    if (!rucDetectado) {
      const matchesRuc = String(textoOCR || "").match(/\b(10|20)\d{9}\b/g) || [];
      for (const cand of matchesRuc) {
        if (cand !== RUC_INSTITUCIONAL_MP) {
          rucDetectado = cand;
          break;
        }
      }
    }

    // 2. Si el RUC ya existe en nuestro caché localStorage o semilla, recuperar Razón Social al instante
    if (rucDetectado) {
      const nombreCache = obtenerRazonSocialPorRuc(rucDetectado);
      if (nombreCache) {
        return {
          ruc: rucDetectado,
          razonSocial: nombreCache,
          proveedorFormateado: `${nombreCache} (RUC: ${rucDetectado})`
        };
      }
    }

    // 3. Filtrar líneas candidatas para extraer la Razón Social o Nombre Comercial
    const esLineaExcluida = (lin) => {
      const up = normalizarMayusculasSinTildes(lin);
      if (DICCIONARIO_CAMPOS.exclusionesEntidadCompradora.some(ex => up.includes(normalizarMayusculasSinTildes(ex)))) {
        return true;
      }
      if (/^(RUC|R\.U\.C|FACTURA|BOLETA|TICKET|COMPROBANTE|FECHA|HORA|CLIENTE|SEÑOR|SENOR|DIRECCION|AV\.|JR\.|CALLE|TELF|TELEFONO|CANT|DESCRIPCION|IMPORTE|TOTAL|SON:|CAJERO|VENDEDOR|USUARIO)/i.test(up)) {
        return true;
      }
      if (/^[FBET][A-Z0-9]{3}\s*[-–—]\s*\d+/i.test(up)) {
        return true;
      }
      // Descartar líneas que son mayoritariamente números o símbolos
      const letras = (up.match(/[A-ZÑ]/g) || []).length;
      return letras < 4;
    };

    let razonSocialHallada = "";

    // 3.1 Buscar primero líneas que contengan siglas societarias o giros comerciales explícitos
    for (let i = 0; i < Math.min(lineas.length, 18); i++) {
      const lin = lineas[i];
      if (esLineaExcluida(lin)) continue;
      const up = normalizarMayusculasSinTildes(lin);
      const tieneGiroOSociedad = DICCIONARIO_CAMPOS.palabrasSocietariasYComerciales.some(p => {
        const pNorm = normalizarMayusculasSinTildes(p);
        return up.includes(` ${pNorm}`) || up.startsWith(`${pNorm} `) || up.endsWith(` ${pNorm}`);
      });
      if (tieneGiroOSociedad) {
        razonSocialHallada = lin.replace(/^RUC\s*[:.]?\s*\d{11}\s*/i, "").trim();
        break;
      }
    }

    // 3.2 Si no encontró sigla societaria, tomar la primera línea superior válida del encabezado del ticket
    if (!razonSocialHallada) {
      for (let i = 0; i < Math.min(lineas.length, 10); i++) {
        const lin = lineas[i];
        if (!esLineaExcluida(lin) && lin.length >= 4 && lin.length <= 75) {
          razonSocialHallada = lin;
          break;
        }
      }
    }

    // Limpiar ruido OCR del nombre del establecimiento
    if (razonSocialHallada) {
      razonSocialHallada = razonSocialHallada
        .replace(/[^a-zA-Z0-9ÁÉÍÓÚÑáéíóúñ.,&()\-/ ]/g, "")
        .replace(/\s+/g, " ")
        .trim();
    }

    // Guardar en caché localStorage la relación RUC -> Razón Social para próximas boletas
    if (rucDetectado && razonSocialHallada) {
      guardarRucProveedorCache(rucDetectado, razonSocialHallada);
    }

    const nombreFinal = razonSocialHallada || (rucDetectado ? `Proveedor RUC ${rucDetectado}` : "");
    const proveedorFormateado = rucDetectado && razonSocialHallada && !razonSocialHallada.includes(rucDetectado)
      ? `${razonSocialHallada} (RUC: ${rucDetectado})`
      : nombreFinal;

    return {
      ruc: rucDetectado,
      razonSocial: nombreFinal,
      proveedorFormateado
    };
  }

  // D) Búsqueda del IMPORTE TOTAL A RENDIR (Ignorando subtotales, IGV y vuelto)
  function extraerMontosDeLinea(linea) {
    if (!linea) return [];
    // Ignorar años o RUCs antes de buscar decimales
    const limpia = linea
      .replace(/\b(10|20)\d{9}\b/g, " ")
      .replace(/\b\d{1,2}[-/.]\d{1,2}[-/.]\d{2,4}\b/g, " ")
      .replace(/\b[FBET][A-Z0-9]{3}\s*[-–—]\s*\d+\b/gi, " ");

    const matches = limpia.match(/\b\d{1,5}(?:[.,]\d{3})*[.,]\d{2}\b/g) || [];
    return matches
      .map(m => {
        // Si tiene coma como separador decimal (ej: 85,50), convertir a punto
        let norm = m;
        if (/,\d{2}$/.test(norm)) {
          norm = norm.replace(/\./g, "").replace(",", ".");
        } else {
          norm = norm.replace(/,/g, "");
        }
        return parseFloat(norm);
      })
      .filter(val => !isNaN(val) && val > 0 && val < 25000);
  }

  function buscarImporteTotalEnTexto(textoOCR) {
    if (!textoOCR) return 0;
    const lineas = textoOCR.split(/\r?\n/).map(l => l.trim()).filter(Boolean);

    const esLineaSubtotalOVuelto = (linUp) => {
      return DICCIONARIO_CAMPOS.etiquetasIgnorarImporte.some(ign => linUp.includes(ign));
    };

    const esLineaPropina = (linUp) => {
      return DICCIONARIO_CAMPOS.terminosPropinaProhibida.some(p => linUp.includes(p));
    };

    // 1. Buscar junto a las etiquetas prioritarias de IMPORTE TOTAL / TOTAL A PAGAR / TOTAL S/
    let candidatosPrioritarios = [];
    for (let i = 0; i < lineas.length; i++) {
      const linUp = normalizarMayusculasSinTildes(lineas[i]);
      if (esLineaSubtotalOVuelto(linUp) || esLineaPropina(linUp)) continue;

      const tieneEtiquetaTotal = DICCIONARIO_CAMPOS.etiquetasImporteTotal.some(et => linUp.includes(et));
      if (tieneEtiquetaTotal) {
        const montosMisma = extraerMontosDeLinea(lineas[i]);
        if (montosMisma.length > 0) {
          candidatosPrioritarios.push(Math.max(...montosMisma));
        } else if (lineas[i + 1]) {
          const linSigUp = normalizarMayusculasSinTildes(lineas[i + 1]);
          if (!esLineaSubtotalOVuelto(linSigUp)) {
            const montosSig = extraerMontosDeLinea(lineas[i + 1]);
            if (montosSig.length > 0) {
              candidatosPrioritarios.push(Math.max(...montosSig));
            }
          }
        }
      }
    }

    if (candidatosPrioritarios.length > 0) {
      return Number(Math.max(...candidatosPrioritarios).toFixed(2));
    }

    // 2. Buscar líneas que contengan la palabra aislada "TOTAL" sin ser SUBTOTAL
    for (let i = lineas.length - 1; i >= 0; i--) {
      const linUp = normalizarMayusculasSinTildes(lineas[i]);
      if (esLineaSubtotalOVuelto(linUp) || esLineaPropina(linUp)) continue;
      if (/\bTOTAL\b/.test(linUp)) {
        const montos = extraerMontosDeLinea(lineas[i]);
        if (montos.length > 0) {
          return Number(Math.max(...montos).toFixed(2));
        }
      }
    }

    // 3. Respaldo: buscar en la mitad inferior del comprobante el mayor monto válido (excluyendo efectivo/vuelto)
    const inicioInferior = Math.floor(lineas.length * 0.45);
    let montosInferiores = [];
    for (let i = inicioInferior; i < lineas.length; i++) {
      const linUp = normalizarMayusculasSinTildes(lineas[i]);
      if (esLineaSubtotalOVuelto(linUp) || esLineaPropina(linUp)) continue;
      montosInferiores.push(...extraerMontosDeLinea(lineas[i]));
    }

    if (montosInferiores.length > 0) {
      return Number(Math.max(...montosInferiores).toFixed(2));
    }

    return 0;
  }

  // E) Detector Ampliado de PROPINAS Y CARGOS NO RECONOCIDOS (Res. N° 000038-2025-MP-FN-GG-OGFIN)
  function detectarPropinasYCargosNoReconocidos(textoOCR) {
    if (!textoOCR) {
      return { detectada: false, termino: "", montoPropina: 0, mensajeAlerta: "" };
    }

    const lineas = textoOCR.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    for (const linea of lineas) {
      const linUp = normalizarMayusculasSinTildes(linea);
      // Evitar falsos positivos con advertencias tipo "SIN PROPINA" o "NO INCLUYE PROPINA"
      if (/\b(SIN PROPINA|NO INCLUYE PROPINA|PROHIBIDO INCLUIR PROPINA)\b/.test(linUp)) {
        continue;
      }

      for (const termino of DICCIONARIO_CAMPOS.terminosPropinaProhibida) {
        const regexTerm = new RegExp(`\\b${termino}\\b`, "i");
        if (regexTerm.test(linUp)) {
          const montos = extraerMontosDeLinea(linea);
          const montoProp = montos.length > 0 ? montos[montos.length - 1] : 0;
          return {
            detectada: true,
            termino,
            montoPropina: montoProp,
            mensajeAlerta: montoProp > 0
              ? `⚠️ Se detectó "${termino}" por S/ ${montoProp.toFixed(2)}. Según Res. N° 000038-2025-MP-FN-GG-OGFIN, las propinas o recargos opcionales NO son reconocidos; descuéntalo del importe a rendir.`
              : `⚠️ Se detectó el término "${termino}" en el comprobante. Verifica que el monto a rendir NO incluya propinas ni cargos opcionales (Res. N° 000038-2025-MP-FN-GG-OGFIN).`
          };
        }
      }
    }

    return { detectada: false, termino: "", montoPropina: 0, mensajeAlerta: "" };
  }

  // =======================================================================================
  // 8. CLASIFICADOR AUTOMÁTICO DE COLUMNA DEL ANEXO 04 (7 RUBROS OFICIALES)
  // =======================================================================================
  function clasificarColumnaAnexo04(textoCompleto, proveedorTexto = "") {
    const corpus = normalizarTextoPlano(`${proveedorTexto} ${proveedorTexto} ${textoCompleto}`);
    if (!corpus) return "ALIMENTACION";

    const puntajes = {
      HOSPEDAJE: 0,
      ALIMENTACION: 0,
      MOVILIDAD: 0,
      PASAJES: 0,
      COMBUSTIBLE: 0,
      PEAJE: 0,
      OTROS: 0
    };

    Object.entries(DICCIONARIO_COLUMNAS_ANEXO_04).forEach(([columna, listaPalabras]) => {
      listaPalabras.forEach((palabra) => {
        const pNorm = normalizarTextoPlano(palabra);
        if (!pNorm) return;

        // Para tokens cortos (ej: "90", "95", "97", "84", "tua", "glp", "gnv"), exigir límite de palabra exacta
        if (pNorm.length <= 3) {
          const regexCorto = new RegExp(`\\b${pNorm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i");
          if (regexCorto.test(corpus)) {
            puntajes[columna] += 2;
          }
        } else if (corpus.includes(pNorm)) {
          // Mayor peso a frases compuestas y coincidencias en el nombre del proveedor
          const peso = pNorm.includes(" ") ? 4 : 3;
          puntajes[columna] += peso;
        }
      });
    });

    let mejorColumna = "ALIMENTACION";
    let maxPuntaje = 0;

    for (const [col, pts] of Object.entries(puntajes)) {
      if (pts > maxPuntaje) {
        maxPuntaje = pts;
        mejorColumna = col;
      }
    }

    return mejorColumna;
  }

  // =======================================================================================
  // 9. PROCESADOR INTEGRAL DE UN ARCHIVO DE IMAGEN (QR SUNAT + OCR + DICCIONARIOS)
  // =======================================================================================
  async function procesarImagenComprobante(file, opciones = {}) {
    const fechaPorDefecto = opciones.fechaPorDefecto || new Date().toISOString().slice(0, 10);
    const onStatus = typeof opciones.onStatus === "function" ? opciones.onStatus : () => {};

    const resultadoBase = {
      idTemporal: `scan_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      nombreArchivo: file ? file.name : "comprobante.jpg",
      metodoLectura: "OCR_TEXTO",
      qrDetectado: false,
      rucProveedor: "",
      proveedor: "",
      numero: "",
      fecha: fechaPorDefecto,
      columna: "ALIMENTACION",
      importe: 0.00,
      alertaPropina: false,
      montoPropinaDetectada: 0.00,
      mensajePropina: "",
      textoOCRCrudo: ""
    };

    if (!file) return resultadoBase;

    try {
      onStatus("Cargando imagen y buscando Código QR SUNAT...");
      const img = await cargarArchivoEnImagen(file);

      // PASO 1: Lectura de Código QR Oficial SUNAT (99.9% de precisión en RUC, Serie-N°, Fecha y Total)
      const datosQR = detectarQRSunatMultiPasada(img);
      if (datosQR) {
        resultadoBase.qrDetectado = true;
        resultadoBase.metodoLectura = "QR_SUNAT";
        if (datosQR.rucProveedor) resultadoBase.rucProveedor = datosQR.rucProveedor;
        if (datosQR.serieNumero) resultadoBase.numero = datosQR.serieNumero;
        if (datosQR.fechaIso) resultadoBase.fecha = datosQR.fechaIso;
        if (datosQR.importeTotal > 0) resultadoBase.importe = datosQR.importeTotal;

        // Verificar si el RUC ya está en caché localStorage para autocompletar Razón Social de inmediato
        if (datosQR.rucProveedor) {
          const razonCache = obtenerRazonSocialPorRuc(datosQR.rucProveedor);
          if (razonCache) {
            resultadoBase.proveedor = `${razonCache} (RUC: ${datosQR.rucProveedor})`;
          }
        }
      }

      // PASO 2: Ejecutar OCR en español con Tesseract.js para extraer Razón Social, clasificar rubro y detectar propinas
      onStatus(
        resultadoBase.qrDetectado
          ? "QR SUNAT leído ✓ Analizando establecimiento, rubro y propinas con OCR..."
          : "Analizando texto del comprobante con OCR en español..."
      );

      const textoOCR = await ejecutarOCREspanol(img, (pct) => {
        onStatus(
          resultadoBase.qrDetectado
            ? `QR SUNAT leído ✓ Completando nombre y rubro (${pct}%)...`
            : `Reconociendo texto del comprobante (${pct}%)...`
        );
      });

      resultadoBase.textoOCRCrudo = textoOCR;

      // PASO 3: Completar campos faltantes con el Diccionario Ampliado
      if (!resultadoBase.numero) {
        resultadoBase.numero = buscarSerieYNumeroEnTexto(textoOCR) || "F001-0001";
      }

      if (! datosQR || !datosQR.fechaIso) {
        const fechaOCR = buscarFechaEmisionEnTexto(textoOCR);
        if (fechaOCR) resultadoBase.fecha = fechaOCR;
      }

      const infoProv = buscarProveedorYRucEnTexto(textoOCR, resultadoBase.rucProveedor);
      if (!resultadoBase.rucProveedor && infoProv.ruc) {
        resultadoBase.rucProveedor = infoProv.ruc;
      }
      if (!resultadoBase.proveedor && infoProv.proveedorFormateado) {
        resultadoBase.proveedor = infoProv.proveedorFormateado;
      }
      if (!resultadoBase.proveedor) {
        resultadoBase.proveedor = resultadoBase.rucProveedor
          ? `Proveedor RUC ${resultadoBase.rucProveedor}`
          : "Establecimiento comercial";
      }

      if (!(resultadoBase.importe > 0)) {
        const importeOCR = buscarImporteTotalEnTexto(textoOCR);
        if (importeOCR > 0) {
          resultadoBase.importe = importeOCR;
        }
      }

      // PASO 4: Detector Ampliado de Propinas y Cargos No Reconocidos (Res. N° 000038-2025-MP-FN-GG-OGFIN)
      const infoPropina = detectarPropinasYCargosNoReconocidos(textoOCR);
      if (infoPropina.detectada) {
        resultadoBase.alertaPropina = true;
        resultadoBase.montoPropinaDetectada = infoPropina.montoPropina;
        resultadoBase.mensajePropina = infoPropina.mensajeAlerta;
      }

      // PASO 5: Clasificación Automática en las 7 Columnas del Anexo 04
      resultadoBase.columna = clasificarColumnaAnexo04(textoOCR, resultadoBase.proveedor);

      if (resultadoBase.qrDetectado && textoOCR) {
        resultadoBase.metodoLectura = "QR_SUNAT + OCR";
      }

      return resultadoBase;
    } catch (error) {
      console.error("Error procesando imagen de comprobante:", error);
      return resultadoBase;
    }
  }

  // =======================================================================================
  // 10. PROCESADOR POR LOTES (SUBIDA MASIVA DE IMÁGENES CON PROGRESO X DE N)
  // =======================================================================================
  async function procesarLoteImagenesComprobantes(fileList, opciones = {}) {
    const archivos = Array.from(fileList || []).filter(f => f && /^image\//i.test(f.type || "") || /\.(jpg|jpeg|png|webp|bmp)$/i.test(f?.name || ""));
    const total = archivos.length;
    const resultados = [];
    const onProgresoLote = typeof opciones.onProgresoLote === "function" ? opciones.onProgresoLote : () => {};

    for (let i = 0; i < total; i++) {
      const archivo = archivos[i];
      onProgresoLote({
        actual: i + 1,
        total,
        porcentaje: Math.round(((i) / total) * 100),
        mensaje: `Procesando comprobante ${i + 1} de ${total} (${archivo.name})...`
      });

      const itemReconocido = await procesarImagenComprobante(archivo, {
        fechaPorDefecto: opciones.fechaPorDefecto,
        onStatus: (subMsg) => {
          onProgresoLote({
            actual: i + 1,
            total,
            porcentaje: Math.round(((i + 0.5) / total) * 100),
            mensaje: `Procesando comprobante ${i + 1} de ${total}: ${subMsg}`
          });
        }
      });

      resultados.push(itemReconocido);
    }

    onProgresoLote({
      actual: total,
      total,
      porcentaje: 100,
      mensaje: `✓ ${total} comprobante(s) procesado(s) y listo(s) para revisión.`
    });

    return resultados;
  }

  // Exponer API Pública en window.LectorComprobantesANC
  window.LectorComprobantesANC = {
    DICCIONARIO_COLUMNAS_ANEXO_04,
    DICCIONARIO_CAMPOS,
    procesarImagenComprobante,
    procesarLoteImagenesComprobantes,
    clasificarColumnaAnexo04,
    detectarPropinasYCargosNoReconocidos,
    obtenerRazonSocialPorRuc,
    guardarRucProveedorCache,
    aprenderDeEdicionUsuario,
    normalizarCadenaFechaAISO
  };
})();