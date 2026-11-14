// =========================================================================================
// ETAPA 5B (RENOVADA): GUÍA PRÁCTICA "¿QUÉ GASTOS PUEDO CUBRIR?" Y FONDOS POR ENCARGO
// Diseño Cálido y Lenguaje Claro para Magistrados, Fiscales y Servidores de la ANC-MP
// Directiva Caja Chica V.08 + Directiva Fondos por Encargo V.06 - UE 012: ANC-MP
// Incluye Diccionario Ampliado de Palabras Clave Coloquiales e Insensibilidad a Tildes
// =========================================================================================

// Normalizador de texto insensible a tildes, diacríticos y mayúsculas/minúsculas
window.normalizarTextoSinTildes = function(texto) {
  return String(texto || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
};

window.EVALUADOR_CATALOGO = [
  // 1. BIENES Y SERVICIOS PERMITIDOS EN CAJA CHICA (CON Y SIN REQUISITO PREVIO)
  {
    codigo: "CC-ALI-01", modalidad: "CAJA_CHICA", semaforo: "AMARILLO", icono: "🍽️",
    nombre: "Refrigerio por labores fuera del horario normal (+4 horas adicionales)",
    keywords: "almuerzo menú menu cena desayuno comida refrigerio sobretiempo horas adicionales extras turno administrativo alimentos alimentacion racion",
    especifica: "2.3.1.1.1.1", tipoTopeComp: "FIJO", valorTopeComp: 24.00,
    topeAnualUitSede: null, topeAnualUitAdc: null,
    requisito: "Hasta S/ 24.00 por servidor administrativo que realice más de 4 horas adicionales fuera del horario laboral, con autorización de su jefe inmediato y reporte de asistencia. No aplica para Magistrados que perciben asignación por Gastos Operativos.",
    baseLegal: "Directiva Caja Chica V.08 - Numeral 5.2.1.3.1 (a, b, d) y R.F.N. N° 190-2022-MP-FN"
  },
  {
    codigo: "CC-ALI-02", modalidad: "CAJA_CHICA", semaforo: "AMARILLO", icono: "☕",
    nombre: "Atención de reuniones oficiales de trabajo o coordinación institucional",
    keywords: "reunion reuniones trabajo bocaditos cafe galletas agua gaseosa jugo sanguchito sandwich desayuno comida refrigerio atencion oficial protocolo",
    especifica: "2.3.1.1.1.1", tipoTopeComp: "PCT_UIT", valorTopeComp: 10.0,
    topeAnualUitSede: 1.20, topeAnualUitAdc: 1.20,
    requisito: "Se cubre hasta el 10% de la UIT al mes. Solo necesitas anotar al dorso o anverso de la boleta/factura el motivo o agenda de la reunión de trabajo y firmarla.",
    baseLegal: "Directiva Caja Chica V.08 - Numeral 5.2.1.3.1 (e, g)"
  },
  {
    codigo: "CC-ALI-03", modalidad: "CAJA_CHICA", semaforo: "VERDE", icono: "💧",
    nombre: "Compra de bidones de agua de mesa para el despacho",
    keywords: "agua bidón bidon bidones garrafon garrafón botella agua de mesa bebida hidratacion dispensador",
    especifica: "2.3.1.1.1.1", tipoTopeComp: "PCT_UIT", valorTopeComp: 20.0,
    topeAnualUitSede: 8.00, topeAnualUitAdc: 8.00,
    requisito: "Está permitido cuando el despacho o sede ADC no cuente con suministro contratado vigente. Límite: 20% de la UIT por comprobante.",
    baseLegal: "Directiva Caja Chica V.08 - Numeral 5.2.1.3.1 (h)"
  },
  {
    codigo: "CC-COM-01", modalidad: "CAJA_CHICA", semaforo: "AMARILLO", icono: "⛽",
    nombre: "Combustible y lubricantes para vehículo oficial o grupo electrógeno",
    keywords: "gasolina petróleo petroleo diesel glp gnv gas grifo combustible lubricante aceite hidrolina vehiculo oficial camioneta auto grupo electrogeno",
    especifica: "2.3.1.3.1.1", tipoTopeComp: "PCT_UIT", valorTopeComp: 20.0,
    topeAnualUitSede: 8.00, topeAnualUitAdc: 8.00,
    requisito: "Debes consignar en la factura el número de placa del vehículo oficial y el kilometraje, con la firma del conductor y del responsable del despacho.",
    baseLegal: "Directiva Caja Chica V.08 - Numeral 5.2.1.3.2 (a, b, c)"
  },
  {
    codigo: "CC-MAT-01", modalidad: "CAJA_CHICA", semaforo: "AMARILLO", icono: "📎",
    nombre: "Útiles de oficina urgentes (papel bond, lapiceros, archivadores, folders)",
    keywords: "papel bond hojas a4 lapicero lapiceros boligrafo folder folders manila archivador archivadores palanca utiles oficina escritorio papeleria grapas engrapador perforador resaltador post it cinta",
    especifica: "2.3.1.5.1.2", tipoTopeComp: "PCT_UIT", valorTopeComp: 20.0,
    topeAnualUitSede: 8.00, topeAnualUitAdc: 8.00,
    requisito: "Requiere adjuntar la constancia del pedido (PECOSA) sellada por Almacén indicando que no hay stock disponible en ese momento.",
    baseLegal: "Directiva Caja Chica V.08 - Numeral 5.2.1.3.3 (a)"
  },
  {
    codigo: "CC-MAT-02", modalidad: "CAJA_CHICA", semaforo: "AMARILLO", icono: "🖨️",
    nombre: "Compra urgente de tóner o tintas para impresora del despacho",
    keywords: "tóner toner tinta tintas cartucho tambor drum cinta impresora impresion multifuncional",
    especifica: "2.3.1.5.1.2", tipoTopeComp: "PCT_UIT", valorTopeComp: 20.0,
    topeAnualUitSede: 8.00, topeAnualUitAdc: 8.00,
    requisito: "Requiere adjuntar la constancia (PECOSA) de Almacén que acredite que no hay stock disponible del modelo de tóner o tinta requerido.",
    baseLegal: "Directiva Caja Chica V.08 - Numeral 5.2.1.3.3 (f)"
  },
  {
    codigo: "CC-MAT-03", modalidad: "CAJA_CHICA", semaforo: "VERDE", icono: "🧹",
    nombre: "Artículos de limpieza, lejía, candados, cerraduras, llaves, chapas y ferretería menor",
    keywords: "limpieza lejía lejia detergente desinfectante pino ambientador escoba trapeador papel higienico jabon candado cerradura llave llaves duplicado chapa chapas bisagra ferreteria epp mascarilla guantes",
    especifica: "2.3.1.5.3.1", tipoTopeComp: "PCT_UIT", valorTopeComp: 20.0,
    topeAnualUitSede: 8.00, topeAnualUitAdc: 8.00,
    requisito: "Los artículos de limpieza proceden cuando no estén incluidos en el servicio contratado de la sede. Límite por boleta/factura: 20% de la UIT.",
    baseLegal: "Directiva Caja Chica V.08 - Numeral 5.2.1.3.3 (b, d, e)"
  },
  {
    codigo: "CC-MAT-04", modalidad: "CAJA_CHICA", semaforo: "AMARILLO", icono: "💡",
    nombre: "Focos, cables, enchufes, memorias USB, disco duro externo, token y firma digital",
    keywords: "foco focos fluorescente led luminaria cable cables extension supresor pico enchufe tomacorriente interruptor usb pendrive memoria disco duro externo ssd adaptador teclado mouse token firma digital certificado digital reniec informatico electricidad",
    especifica: "2.3.1.5.4.1", tipoTopeComp: "PCT_UIT", valorTopeComp: 20.0,
    topeAnualUitSede: 8.00, topeAnualUitAdc: 8.00,
    requisito: "El comprobante de pago debe contar con el visto bueno (firma) del personal técnico o de soporte (OTI/Sistemas) que realizó la instalación, validación o emisión del certificado/token.",
    baseLegal: "Directiva Caja Chica V.08 - Numeral 5.2.1.3.3 (c) y 5.2.1.3.12 (h)"
  },
  {
    codigo: "CC-OTB-01", modalidad: "CAJA_CHICA", semaforo: "VERDE", icono: "📰",
    nombre: "Compra del Diario Oficial 'El Peruano' o diario local",
    keywords: "el peruano diario periodico periódico normas legales separata publicacion",
    especifica: "2.3.1.99.1.3", tipoTopeComp: "PCT_UIT", valorTopeComp: 20.0,
    topeAnualUitSede: 1.00, topeAnualUitAdc: 1.00,
    requisito: "Permitido para Alta Dirección y despachos que requieran el ejemplar físico o no cuenten con acceso a internet. Tope anual: 1 UIT.",
    baseLegal: "Directiva Caja Chica V.08 - Numeral 5.2.1.3.4"
  },
  {
    codigo: "CC-OTB-02", modalidad: "CAJA_CHICA", semaforo: "AMARILLO", icono: "🇵🇪",
    nombre: "Banderas, símbolos patrios, solapines, distintivos y suscripciones",
    keywords: "bandera banderas pabellon nacional asta escudo estandarte medalla solapin credencial fotocheck cinta suscripcion diario imagen",
    especifica: "2.3.1.99.1.99", tipoTopeComp: "PCT_UIT", valorTopeComp: 20.0,
    topeAnualUitSede: 4.00, topeAnualUitAdc: 4.00,
    requisito: "Atención excepcional para ceremonias protocolares, Alta Dirección e Imagen Institucional. Tope acumulado anual: 4 UIT.",
    baseLegal: "Directiva Caja Chica V.08 - Numeral 5.2.1.3.4"
  },
  {
    codigo: "CC-REP-01", modalidad: "CAJA_CHICA", semaforo: "AMARILLO", icono: "🛞",
    nombre: "Repuestos urgentes, llantas o baterías para vehículos oficiales",
    keywords: "repuesto repuestos filtro pastilla freno embrague bujia llanta llantas neumatico bateria batería plumilla autoparte auto camioneta vehiculo oficial",
    especifica: "2.3.1.6.1.1", tipoTopeComp: "PCT_UIT", valorTopeComp: 20.0,
    topeAnualUitSede: 8.00, topeAnualUitAdc: 8.00,
    requisito: "Procede ante averías imprevistas de vehículos oficiales cuando el repuesto no exista en el Almacén institucional.",
    baseLegal: "Directiva Caja Chica V.08 - Numeral 5.2.1.3.5"
  },
  {
    codigo: "CC-ENS-01", modalidad: "CAJA_CHICA", semaforo: "AMARILLO", icono: "☕",
    nombre: "Utensilios menores de cafetería o menaje para el despacho (taza, vaso, plato, hervidor)",
    keywords: "taza tazas vaso vasos plato platos cucharita cubiertos jarra azucarera bandeja termo hervidor cafetera menaje cocina cafeteria enseres",
    especifica: "2.3.1.99.1.99", tipoTopeComp: "FIJO", valorTopeComp: 700.00,
    topeAnualUitSede: 0.50, topeAnualUitAdc: 0.50,
    requisito: "Permitido hasta por S/ 700.00 al mes por comprobante, sin superar media (0.5) UIT en todo el año.",
    baseLegal: "Directiva Caja Chica V.08 - Numeral 5.2.1.3.6"
  },
  {
    codigo: "CC-MED-01", modalidad: "CAJA_CHICA", semaforo: "VERDE", icono: "🩹",
    nombre: "Insumos básicos para botiquín de primeros auxilios (alcohol, algodón, gasas)",
    keywords: "botiquín botiquin alcohol algodón algodon gasa gasas agua oxigenada esparadrapo curita vendas termometro primeros auxilios topico",
    especifica: "2.3.1.8.1.2", tipoTopeComp: "PCT_UIT", valorTopeComp: 20.0,
    topeAnualUitSede: 4.00, topeAnualUitAdc: 4.00,
    requisito: "Destinado a mantener abastecido el botiquín de emergencias de los despachos y sedes ADC.",
    baseLegal: "Directiva Caja Chica V.08 - Numeral 5.2.1.3.7"
  },
  {
    codigo: "CC-MOV-01", modalidad: "CAJA_CHICA", semaforo: "VERDE", icono: "🚕",
    nombre: "Movilidad local y taxi para diligencias, notificaciones o labores fuera de horario",
    keywords: "taxi movilidad local pasaje urbano colectivo bus tren metropolitano diligencia notificacion desplazamiento urbano anexo 08 anexo 09",
    especifica: "2.3.2.1.2.99", tipoTopeComp: "TARIFARIO", valorTopeComp: 46.00,
    topeAnualUitSede: null, topeAnualUitAdc: null,
    requisito: "Se sustenta con la Declaración Jurada (Anexo 08) aplicando la tarifa oficial por distrito (Anexo 09). No aplica para Fiscales Titulares que perciben Gastos Operativos.",
    baseLegal: "Directiva Caja Chica V.08 - Numeral 5.2.1.3.8 (b, c)"
  },
  {
    codigo: "CC-MEN-01", modalidad: "CAJA_CHICA", semaforo: "AMARILLO", icono: "✉️",
    nombre: "Servicio urgente de courier o mensajería (Olva, Serpost) para expedientes o notificaciones",
    keywords: "courier mensajeria mensajería olva serpost dhl encomienda envio sobre paquete valija documentos expediente notificacion",
    especifica: "2.3.2.2.3.1", tipoTopeComp: "PCT_UIT", valorTopeComp: 20.0,
    topeAnualUitSede: 8.00, topeAnualUitAdc: 8.00,
    requisito: "Procede cuando la sede no cuente con contrato de courier vigente y no sea posible notificar por casilla o correo electrónico (Ley N° 32068).",
    baseLegal: "Directiva Caja Chica V.08 - Numeral 5.2.1.3.10"
  },
  {
    codigo: "CC-MAN-01", modalidad: "CAJA_CHICA", semaforo: "AMARILLO", icono: "🛠️",
    nombre: "Reparación urgente de baño, gasfitero, aire acondicionado, ventilador, SOAT o revisión técnica",
    keywords: "baño bano inodoro caño griferia tuberia desague fuga agua gasfitero gasfiteria aire acondicionado ventilador cerrajero chapa cerradura llave taller vehicular lavado engrase parchado llanta alineamiento soat revisión técnica revision tecnica impresora fotocopiadora mueble puerta ventana",
    especifica: "2.3.2.4.7.1", tipoTopeComp: "PCT_UIT", valorTopeComp: 20.0,
    topeAnualUitSede: 8.00, topeAnualUitAdc: 8.00,
    requisito: "En reparaciones de vehículos se debe detallar por separado el costo del repuesto y la mano de obra. Si la factura supera S/ 700, Administración aplicará la detracción del 10%.",
    baseLegal: "Directiva Caja Chica V.08 - Numeral 5.2.1.3.11 (a-f)"
  },
  {
    codigo: "CC-OTS-01", modalidad: "CAJA_CHICA", semaforo: "VERDE", icono: "🚚",
    nombre: "Peajes, notaría, carta notarial, SUNARP, extintor, fumigación, fotocopias y flete",
    keywords: "flete carga mudanza estiba grua remolque cochera estacionamiento peaje peajes sunarp registral partida copia literal notaría notaria legalizacion firma carta notarial extintor extintores recarga fumigación fumigacion desinfeccion fotocopia fotocopias anillado escaneo",
    especifica: "2.3.2.7.11.99", tipoTopeComp: "PCT_UIT", valorTopeComp: 20.0,
    topeAnualUitSede: 8.00, topeAnualUitAdc: 8.00,
    requisito: "Permitido para atenciones inmediatas del despacho hasta el 20% de la UIT por comprobante. El fotocopiado procede cuando no exista máquina operativa en la sede.",
    baseLegal: "Directiva Caja Chica V.08 - Numeral 5.2.1.3.12 (a, b, e)"
  },
  {
    codigo: "CC-OTS-03", modalidad: "CAJA_CHICA", semaforo: "AMARILLO", icono: "💐",
    nombre: "Arreglos florales, coronas por protocolo institucional o condolencias (difunto)",
    keywords: "flores arreglo floral corona lagrima condolencias difunto fallecimiento sepelio velorio misa capilla protocolo defuncion",
    especifica: "2.3.1.99.1.99", tipoTopeComp: "PCT_UIT", valorTopeComp: 20.0,
    topeAnualUitSede: 2.00, topeAnualUitAdc: 0.50,
    requisito: "Para actividades oficiales o sensibles fallecimientos. Límite anual: hasta 2 UIT en Sede Central y hasta media (0.5) UIT en cada sede ADC.",
    baseLegal: "Directiva Caja Chica V.08 - Numeral 5.2.1.3.12 (c)"
  },
  {
    codigo: "CC-OTS-04", modalidad: "CAJA_CHICA", semaforo: "VERDE", icono: "🧺",
    nombre: "Lavandería de cortinas/banderas, traductor/intérprete, empastado e impresión de banners",
    keywords: "lavandería lavanderia lavado cortina cortinas persiana alfombra mantel bandera banderola traductor intérprete interprete traduccion quechua aimara lengua extranjera impresion banner gigantografia letrero afiche empastado encuadernado caratula",
    especifica: "2.3.2.7.11.99", tipoTopeComp: "PCT_UIT", valorTopeComp: 20.0,
    topeAnualUitSede: 4.00, topeAnualUitAdc: 4.00,
    requisito: "Atenciones permitidas hasta el 20% de la UIT por comprobante (Lavandería hasta 2 UIT al año; Traducciones hasta 3 UIT; Impresiones y empastados hasta 4 UIT).",
    baseLegal: "Directiva Caja Chica V.08 - Numeral 5.2.1.3.12 (d, f, g)"
  },

  // 2. MODALIDAD DE FONDOS POR ENCARGO (Directiva de Encargos V.06 - OGFIN/DIR-01)
  {
    codigo: "ENC-GEN-01", modalidad: "ENCARGO", semaforo: "AMARILLO", icono: "🏛️",
    nombre: "Fondo Especial por Encargo: Eventos, capacitaciones, acondicionamiento de locales o tasas municipales",
    keywords: "encargo evento taller seminario congreso capacitacion expositor ponente acondicionamiento local pintura drywall tabiqueria mantenimiento fotocopiadora licencia municipal arbitrios",
    especifica: "2.3.2.7.10.1", tipoTopeComp: "PCT_UIT", valorTopeComp: 1000.0,
    topeAnualUitSede: 10.00, topeAnualUitAdc: 10.00,
    requisito: "Cuando un gasto especial supera el límite de Caja Chica, puede gestionarse como 'Encargo' hasta por 10 UIT (o 3 UIT para honorarios de expositores). Si supera 1 UIT requiere 3 cotizaciones. El responsable designado debe pertenecer al régimen D.L. 728 o D.L. 276 y se rinde en 3 días hábiles.",
    baseLegal: "Directiva de Encargos V.06 - Numerales 5.1.2, 5.1.7, 5.2.1 y 5.2.4"
  },

  // 3. GASTOS NO PERMITIDOS POR NORMA (SEMÁFORO ROJO - AVISO PREVENTIVO)
  {
    codigo: "PRO-BAS-01", modalidad: "PROHIBIDO", semaforo: "ROJO", icono: "🚫",
    nombre: "Recibos de servicios públicos (Luz, agua potable, teléfono fijo, celular o internet)",
    keywords: "luz electricidad agua sedapal teléfono telefono fijo celular linea movil internet wifi recibo enel luz del sur movistar claro entel bitel servicio basico",
    especifica: "2.3.2.2.1.1", tipoTopeComp: "BLOQUEADO", valorTopeComp: 0,
    topeAnualUitSede: 0, topeAnualUitAdc: 0,
    requisito: "NO PERMITIDO EN CAJA CHICA: Los servicios básicos se pagan de forma centralizada por Administración y Finanzas, no mediante reembolso de Caja Chica.",
    baseLegal: "Directiva Caja Chica V.08 - Numeral 5.2.1.3.9 y R.D. N° 008-2024-EF/52.01"
  },
  {
    codigo: "PRO-ACT-01", modalidad: "PROHIBIDO", semaforo: "ROJO", icono: "🪑",
    nombre: "Compra de silla, escritorio, mueble, laptop, impresora o cámara (Bienes patrimoniales)",
    keywords: "escritorio silla sillon butaca mesa estante armario credenza ropero mueble muebles mobiliario impresora escaner computadora pc laptop monitor celular tablet cámara camara fotografica filmadora proyector televisor frigobar microondas activo fijo",
    especifica: "2.6.3.2.1.1", tipoTopeComp: "BLOQUEADO", valorTopeComp: 0,
    topeAnualUitSede: 0, topeAnualUitAdc: 0,
    requisito: "NO PERMITIDO EN CAJA CHICA NI ENCARGOS: Por tratarse de bienes inventariables (activos fijos), deben solicitarse mediante requerimiento regular a la Unidad de Abastecimiento.",
    baseLegal: "Directiva Caja Chica V.08 - Numeral 5.2.1.9.2 y 5.2.1.9.5 / Directiva Encargos 5.2.1.d"
  },
  {
    codigo: "PRO-MOT-01", modalidad: "PROHIBIDO", semaforo: "ROJO", icono: "🔧",
    nombre: "Reparación mayor de motor de vehículos (> 25% UIT) o gastos en vehículos particulares",
    keywords: "motor bajada motor rectificacion culata caja cambios vehiculo particular auto propio",
    especifica: "2.3.2.4.5.1", tipoTopeComp: "BLOQUEADO", valorTopeComp: 0,
    topeAnualUitSede: 0, topeAnualUitAdc: 0,
    requisito: "NO PERMITIDO: No se cubren reparaciones de motor mayores a 1/4 de la UIT por Caja Chica, ni combustible o mantenimiento de vehículos particulares.",
    baseLegal: "Directiva Caja Chica V.08 - Numeral 5.2.1.9.4 y 5.2.1.9.6"
  },
  {
    codigo: "PRO-OBR-01", modalidad: "PROHIBIDO", semaforo: "ROJO", icono: "🧱",
    nombre: "Obras de construcción (Cambio total de pisos, veredas o remodelación de fachadas)",
    keywords: "obra construccion vereda cambio piso mayolica porcelanato enchapado fachada pared muro techo",
    especifica: "2.6.2.2.1.1", tipoTopeComp: "BLOQUEADO", valorTopeComp: 0,
    topeAnualUitSede: 0, topeAnualUitAdc: 0,
    requisito: "NO PERMITIDO EN CAJA CHICA: Las remodelaciones mayores de infraestructura corresponden al rubro de Obras y se contratan por procedimiento regular.",
    baseLegal: "Directiva Caja Chica V.08 - Numeral 5.2.1.9.3"
  },
  {
    codigo: "PRO-AGA-01", modalidad: "PROHIBIDO", semaforo: "ROJO", icono: "🎂",
    nombre: "Agasajos, tortas, brindis o presentes por fechas festivas",
    keywords: "agasajo agasajos fiesta recepcion brindis vino champagne licor torta pastel bocaditos regalo presente obsequio canasta cumpleanos dia madre padre trabajador mujer secretaria navidad aniversario",
    especifica: "2.3.1.1.1.1", tipoTopeComp: "BLOQUEADO", valorTopeComp: 0,
    topeAnualUitSede: 0, topeAnualUitAdc: 0,
    requisito: "NO PERMITIDO POR NORMA DE AUSTERIDAD: Los fondos públicos no pueden destinarse a celebraciones o agasajos por fechas festivas.",
    baseLegal: "Directiva Caja Chica V.08 - Numeral 5.2.1.9.7"
  },
  {
    codigo: "PRO-PRO-01", modalidad: "PROHIBIDO", semaforo: "ROJO", icono: "🚫",
    nombre: "Propinas o recargos voluntarios en boletas de restaurante, hotel o taxi",
    keywords: "propina propinas tip recargo servicio voluntario mozo mesero botones consumo restaurante hotel taxi",
    especifica: "2.3.2.1.2.2", tipoTopeComp: "BLOQUEADO", valorTopeComp: 0,
    topeAnualUitSede: 0, topeAnualUitAdc: 0,
    requisito: "NO RECONOCIDO: Si una boleta o factura incluye un monto por propina, dicho importe debe descontarse al momento de registrar la rendición.",
    baseLegal: "Resolución N° 000038-2025-MP-FN-GG-OGFIN"
  }
];

window.MOSTRAR_TODOS_SUPUESTOS_EVAL = false;
window.FILTRO_SEMAFORO_ACTUAL = "NINGUNO";

document.addEventListener("DOMContentLoaded", () => {
  renderizarModuloEvaluadorNormativo();
});

function renderizarModuloEvaluadorNormativo() {
  const cont = document.getElementById("contenedor-modulo-evaluador");
  if (!cont) return;

  const cfg = window.ANC_STATE ? window.ANC_STATE.config : { valor_uit: 5350 };
  const uit = Number(cfg.valor_uit || 5350);

  cont.innerHTML = `
    <div style="margin-bottom:14px;">
      <h2 style="font-size:1.22rem; font-weight:800; color:#0F172A;">💡 ¿Qué Gastos Puedo Cubrir?</h2>
      <p style="font-size:0.82rem; color:#475569; font-weight:600; margin-top:2px;">
        Consulta de forma sencilla qué bienes o servicios están permitidos, qué requisitos necesitas adjuntar y las tarifas de movilidad por distrito
      </p>
    </div>

    <!-- PESTAÑAS INTERNAS CÁLIDAS DEL EVALUADOR -->
    <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:6px; margin-bottom:16px;">
      <button type="button" id="tab-eval-semaforo" onclick="cambiarTabEvaluador('SEMAFORO')" style="background:linear-gradient(135deg, #FBBF24 0%, #F59E0B 100%); color:#0F172A; border:1.5px solid #D97706; border-radius:12px; padding:10px 6px; font-size:0.76rem; font-weight:800; cursor:pointer;">
        🔎 Consultar Gasto o Requisito
      </button>
      <button type="button" id="tab-eval-encargos" onclick="cambiarTabEvaluador('ENCARGOS')" style="background:#FFFFFF; color:#0F172A; border:1.5px solid #CBD5E1; border-radius:12px; padding:10px 6px; font-size:0.76rem; font-weight:800; cursor:pointer;">
        🏛️ Eventos y Encargos Especiales
      </button>
      <button type="button" id="tab-eval-anexos" onclick="cambiarTabEvaluador('ANEXOS')" style="background:#FFFFFF; color:#0F172A; border:1.5px solid #CBD5E1; border-radius:12px; padding:10px 6px; font-size:0.76rem; font-weight:800; cursor:pointer;">
        🚕 Tarifas de Taxi por Distrito
      </button>
    </div>

    <!-- SUB-VISTA 1: BUSCADOR AMIGABLE BAJO DEMANDA CON INSENSIBILIDAD A TILDES -->
    <div id="subvista-eval-semaforo">
      <div style="background:#FFFDF5; border:1.5px solid #FDE68A; border-radius:20px; padding:14px; margin-bottom:14px;">
        <label style="display:block; font-size:0.76rem; font-weight:800; color:#0F172A; margin-bottom:6px;">
          🔍 ESCRIBE LO QUE NECESITAS COMPRAR O CONTRATAR (Con o sin tilde):
        </label>
        <input type="text" id="input-buscador-evaluador" oninput="alEscribirBusquedaEvaluador()" placeholder="Ej: menú, tóner, bidón, taxi, peaje, gasfitero, olva, sunarp, hervidor, silla..." style="width:100%; padding:11px 12px; border-radius:14px; border:1.5px solid #F59E0B; font-size:0.88rem; font-weight:700; margin-bottom:10px; background:#FFFFFF;" />

        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:6px;">
          <div style="display:flex; flex-wrap:wrap; gap:6px;">
            <button type="button" onclick="setFiltroSemaforo('VERDE')" class="chip-option" style="background:#10B981; color:#FFF; border:none;">🟢 Directos</button>
            <button type="button" onclick="setFiltroSemaforo('AMARILLO')" class="chip-option" style="background:#FEF3C7; color:#92400E; border:1px solid #F59E0B;">🟡 Con Requisito</button>
            <button type="button" onclick="setFiltroSemaforo('ROJO')" class="chip-option" style="background:#FFF5F6; color:#9F1239; border:1px solid #FECDD3;">🔴 No Permitidos</button>
          </div>
          <button type="button" id="btn-toggle-todos-supuestos" onclick="alternarMostrarTodosSupuestos()" style="background:#0F172A; color:#FBBF24; border:none; border-radius:10px; padding:7px 12px; font-size:0.74rem; font-weight:800; cursor:pointer;">
            📋 Ver guía completa (${window.EVALUADOR_CATALOGO.length})
          </button>
        </div>
      </div>

      <div id="lista-resultados-evaluador" style="display:flex; flex-direction:column; gap:12px;"></div>
    </div>

    <!-- SUB-VISTA 2: SIMULADOR AMIGABLE DE FONDOS POR ENCARGO + GENERACIÓN DE FORMATOS OFICIALES PDF -->
    <div id="subvista-eval-encargos" style="display:none;">
      <div style="background:#FFFDF5; border:1.5px solid #FDE68A; border-radius:20px; padding:15px;">
        <h3 style="font-size:1rem; font-weight:800; color:#0F172A; margin-bottom:4px;">
          🏛️ Solicitud de Fondos Especiales por Encargo (Eventos, Talleres y Acondicionamiento)
        </h3>
        <p style="font-size:0.78rem; color:#475569; margin-bottom:12px; line-height:1.4; font-weight:600;">
          Cuando una actividad oficial o mantenimiento urgente supera el límite de Caja Chica, puedes verificar aquí sus requisitos (hasta 10 UIT = ${window.fmtSoles(uit * 10)}) y descargar sus formatos listos para firmar.
        </p>

        <div style="margin-bottom:10px;">
          <label style="display:block; font-size:0.73rem; font-weight:800; color:#334155; margin-bottom:3px;">¿QUÉ ACTIVIDAD O SERVICIO ESPECIAL SE REQUIERE?:</label>
          <select id="enc-tipo-supuesto" onchange="evaluarSimuladorEncargo()" style="width:100%; padding:10px; border-radius:12px; border:1.5px solid #F59E0B; font-weight:800; font-size:0.82rem; background:#FFFFFF; color:#0F172A;">
            <option value="CAPACITACION" data-max-uit="10" data-clase="BIEN">1. Materiales e insumos para eventos de capacitación, talleres o jornadas oficiales (Hasta 10 UIT)</option>
            <option value="EXPOSITOR" data-max-uit="3" data-clase="SERVICIO">2. Honorarios para Expositores o Ponentes de talleres y capacitaciones (Hasta 3 UIT por expositor)</option>
            <option value="INVESTIGACION" data-max-uit="10" data-clase="SERVICIO">3. Diligencias especiales de investigación, peritajes o ceremonias oficiales (Hasta 10 UIT)</option>
            <option value="MANTENIMIENTO_LOCAL" data-max-uit="10" data-clase="SERVICIO">4. Acondicionamiento urgente de ambientes del despacho o reparación vehicular en provincias (Hasta 10 UIT)</option>
            <option value="FOTOCOPIADORAS" data-max-uit="10" data-clase="SERVICIO">5. Mantenimiento y reparación integral de fotocopiadoras de la sede (Hasta 10 UIT • Requiere 3 cotizaciones)</option>
            <option value="TASAS_ESTUDIOS" data-max-uit="10" data-clase="SERVICIO">6. Pago de tasas municipales, licencias, conexiones de servicios o estudios técnicos urgentes (Hasta 10 UIT)</option>
            <option value="ACTIVO_FIJO" data-max-uit="0" data-clase="PROHIBIDO">7. Compra de muebles, sillas, computadoras o equipos (No permitido por Encargo - Solicitar a Abastecimiento)</option>
          </select>
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-bottom:10px;">
          <div>
            <label style="display:block; font-size:0.73rem; font-weight:800; color:#334155; margin-bottom:3px;">MONTO ESTIMADO (S/):</label>
            <input type="number" id="enc-monto-soles" value="6500" step="100" oninput="evaluarSimuladorEncargo()" style="width:100%; padding:9px 10px; border-radius:12px; border:1.5px solid #0F172A; font-weight:800; font-size:0.92rem; background:#FFFFFF;" />
          </div>
          <div>
            <label style="display:block; font-size:0.73rem; font-weight:800; color:#334155; margin-bottom:3px;">VÍNCULO DEL SERVIDOR RESPONSABLE:</label>
            <select id="enc-regimen-resp" onchange="evaluarSimuladorEncargo()" style="width:100%; padding:9px 10px; border-radius:12px; border:1.5px solid #CBD5E1; font-weight:800; font-size:0.81rem; background:#FFFFFF;">
              <option value="DL_728_276">Magistrado / Servidor D.L. 728 o D.L. 276 (Habilitado)</option>
              <option value="CAS_1057">Contrato CAS - D.L. 1057 (No habilitado por norma)</option>
              <option value="LOCADOR">Locador / Tercero (No habilitado por norma)</option>
            </select>
          </div>
        </div>

        <div style="display:grid; grid-template-columns:1.3fr 1fr; gap:8px; margin-bottom:10px;">
          <div>
            <label style="display:block; font-size:0.73rem; font-weight:800; color:#334155; margin-bottom:3px;">NOMBRE DEL RESPONSABLE DESIGNADO:</label>
            <input type="text" id="enc-nombre-resp" autocomplete="off" value="${window.ANC_STATE?.perfilActivo?.usuario_nombre || 'Servidor Responsable ANC'}" style="width:100%; padding:9px 10px; border-radius:12px; border:1.5px solid #CBD5E1; font-weight:700; font-size:0.82rem; background:#FFFFFF;" />
          </div>
          <div>
            <label style="display:block; font-size:0.73rem; font-weight:800; color:#334155; margin-bottom:3px;">PROVEEDOR O EXPOSITOR:</label>
            <input type="text" id="enc-proveedor" value="Servicios Generales y Técnicos S.A.C." style="width:100%; padding:9px 10px; border-radius:12px; border:1.5px solid #CBD5E1; font-weight:700; font-size:0.82rem; background:#FFFFFF;" />
          </div>
        </div>

        <div style="margin-bottom:12px;">
          <label style="display:block; font-size:0.73rem; font-weight:800; color:#334155; margin-bottom:3px;">DESCRIPCIÓN BREVE DE LA NECESIDAD:</label>
          <input type="text" id="enc-descripcion" value="Acondicionamiento urgente de ambientes para despacho de control funcional" style="width:100%; padding:9px 10px; border-radius:12px; border:1.5px solid #CBD5E1; font-weight:700; font-size:0.82rem; background:#FFFFFF;" />
        </div>

        <!-- Orientación Automática del Evaluador de Encargos -->
        <div id="dictamen-simulador-encargo" style="margin-bottom:12px;"></div>

        <!-- Botones de Guardado y Descarga de Formatos Oficiales de Encargos (Directiva V.06) -->
        <div style="display:grid; grid-template-columns:repeat(2, 1fr); gap:8px;">
          <button type="button" id="btn-registrar-encargo" onclick="registrarSolicitudEncargo()" style="background:#10B981; color:#FFFFFF; border:none; border-radius:12px; padding:12px; font-size:0.8rem; font-weight:800; cursor:pointer; box-shadow:0 3px 10px rgba(16,185,129,0.2);">
            💾 Guardar Solicitud de Encargo
          </button>
          <button type="button" onclick="imprimirReporteEvaluacionEncargoPDF('INFORME_Y_FORMATOS')" style="background:linear-gradient(135deg, #FBBF24 0%, #F59E0B 100%); color:#0F172A; border:1.5px solid #D97706; border-radius:12px; padding:12px; font-size:0.8rem; font-weight:800; cursor:pointer;">
            🖨️ Descargar Expediente Completo (PDF)
          </button>
          <button type="button" onclick="imprimirReporteEvaluacionEncargoPDF('FORMATO_1_2_3_4')" style="background:#FFFDF5; color:#92400E; border:1.5px solid #FDE68A; border-radius:12px; padding:10px; font-size:0.75rem; font-weight:800; cursor:pointer;">
            📋 Solicitud y Conformidad (Formatos 1-4)
          </button>
          <button type="button" onclick="imprimirReporteEvaluacionEncargoPDF('FORMATO_6')" style="background:#F0F8FF; color:#0284C7; border:1.5px solid #BAE6FD; border-radius:12px; padding:10px; font-size:0.75rem; font-weight:800; cursor:pointer;">
            📑 Formato de Rendición (Formato N° 6)
          </button>
        </div>
      </div>
    </div>

    <!-- SUB-VISTA 3: CONSULTA RÁPIDA DEL TARIFARIO DE MOVILIDAD (44 DISTRITOS) Y TABLA DE DETRACCIONES -->
    <div id="subvista-eval-anexos" style="display:none;">
      <div style="background:#FFFFFF; border:1.5px solid #E2E8F0; border-radius:20px; padding:14px; margin-bottom:16px;">
        <h3 style="font-size:0.96rem; font-weight:800; color:#0F172A; margin-bottom:4px;">
          🚕 Tarifario Oficial de Movilidad Local por Distrito (Anexo 09 - 44 Destinos)
        </h3>
        <p style="font-size:0.75rem; color:#475569; margin-bottom:8px; font-weight:600;">
          Consulta el monto reconocido para diligencias desde la Sede Central hacia cualquier distrito de Lima y Callao.
        </p>
        <input type="text" id="input-buscar-distrito-anexo09" oninput="filtrarTablaAnexo09()" placeholder="🔍 Escribe el distrito (ej: Miraflores, Callao, Surco, Ancón, Lurín)..." style="width:100%; padding:10px 12px; border-radius:12px; border:1.5px solid #0EA5E9; margin-bottom:10px; font-weight:700; background:#F0F8FF;" />
        <div style="max-height:280px; overflow-y:auto;">
          <table class="anc-list-table">
            <thead>
              <tr>
                <th style="width:14%;">N°</th>
                <th style="width:46%;">DISTRITO / DESTINO</th>
                <th style="width:20%;">DÍA (Antes 7pm)</th>
                <th style="width:20%;">NOCHE (Desde 7pm)</th>
              </tr>
            </thead>
            <tbody id="tbody-consulta-anexo09"></tbody>
          </table>
        </div>
      </div>

      <div style="background:#F8FAFC; border:1.5px solid #E2E8F0; border-radius:20px; padding:14px;">
        <h3 style="font-size:0.92rem; font-weight:800; color:#0F172A; margin-bottom:4px;">
          🏦 Referencia para Administración: Servicios con Detracción SUNAT (Facturas mayores a S/ 700)
        </h3>
        <p style="font-size:0.74rem; color:#475569; margin-bottom:8px; font-weight:600;">
          Tabla informativa del porcentaje que Tesorería/Administración deposita en el Banco de la Nación cuando un servicio supera S/ 700.00 (Anexo 03).
        </p>
        <table class="anc-list-table">
          <thead>
            <tr>
              <th style="width:16%;">CÓD.</th>
              <th style="width:64%;">TIPO DE SERVICIO</th>
              <th style="width:20%;">TASA (%)</th>
            </tr>
          </thead>
          <tbody>
            <tr><td><strong>012</strong></td><td>Intermediación laboral y tercerización</td><td><strong>10%</strong></td></tr>
            <tr><td><strong>019</strong></td><td>Alquiler de bienes muebles o inmuebles</td><td><strong>10%</strong></td></tr>
            <tr><td><strong>020</strong></td><td>Mantenimiento y reparación de vehículos, equipos, aire acondicionado o mobiliario</td><td><strong>10%</strong></td></tr>
            <tr><td><strong>021</strong></td><td>Servicio de estiba, desestiba o movimiento de carga</td><td><strong>10%</strong></td></tr>
            <tr><td><strong>022</strong></td><td>Fotocopiado, impresiones, empastados, traducciones y servicios profesionales</td><td><strong>12%</strong></td></tr>
            <tr><td><strong>026</strong></td><td>Servicio de transporte de personas</td><td><strong>10%</strong></td></tr>
            <tr><td><strong>027</strong></td><td>Servicio de flete o transporte de bienes por vía terrestre</td><td><strong>4%</strong></td></tr>
            <tr><td><strong>030</strong></td><td>Acondicionamiento de ambientes o contratos de construcción</td><td><strong>4%</strong></td></tr>
            <tr><td><strong>037</strong></td><td>Lavandería de cortinas/banderas y demás servicios gravados con IGV</td><td><strong>12%</strong></td></tr>
          </tbody>
        </table>
      </div>
    </div>
  `;

  if (typeof window.conectarAutocompletadoServidorSeguro === "function") {
    window.conectarAutocompletadoServidorSeguro("enc-nombre-resp", (srv) => {
      const inpNom = document.getElementById("enc-nombre-resp");
      const selReg = document.getElementById("enc-regimen-resp");
      if (inpNom) inpNom.value = srv.apellidos_nombres || "";
      if (selReg) {
        const reg = String(srv.regimen_vinculo || "").toUpperCase();
        selReg.value = reg.includes("1057") || reg.includes("CAS") ? "CAS_1057" : "DL_728_276";
        evaluarSimuladorEncargo();
      }
    });
  }

  window.MOSTRAR_TODOS_SUPUESTOS_EVAL = false;
  window.FILTRO_SEMAFORO_ACTUAL = "NINGUNO";
  filtrarCatalogoEvaluador();
  evaluarSimuladorEncargo();
  filtrarTablaAnexo09();
}

window.cambiarTabEvaluador = function(tab) {
  document.getElementById("subvista-eval-semaforo").style.display = tab === "SEMAFORO" ? "block" : "none";
  document.getElementById("subvista-eval-encargos").style.display = tab === "ENCARGOS" ? "block" : "none";
  document.getElementById("subvista-eval-anexos").style.display = tab === "ANEXOS" ? "block" : "none";

  const b1 = document.getElementById("tab-eval-semaforo");
  const b2 = document.getElementById("tab-eval-encargos");
  const b3 = document.getElementById("tab-eval-anexos");

  [b1, b2, b3].forEach(b => {
    if (b) {
      b.style.background = "#FFFFFF";
      b.style.color = "#0F172A";
      b.style.borderColor = "#CBD5E1";
    }
  });

  const activeBtn = tab === "SEMAFORO" ? b1 : (tab === "ENCARGOS" ? b2 : b3);
  if (activeBtn) {
    activeBtn.style.background = "linear-gradient(135deg, #FBBF24 0%, #F59E0B 100%)";
    activeBtn.style.color = "#0F172A";
    activeBtn.style.borderColor = "#D97706";
  }
};

window.alEscribirBusquedaEvaluador = function() {
  window.FILTRO_SEMAFORO_ACTUAL = "NINGUNO";
  filtrarCatalogoEvaluador();
};

window.setFiltroSemaforo = function(color) {
  window.FILTRO_SEMAFORO_ACTUAL = color;
  window.MOSTRAR_TODOS_SUPUESTOS_EVAL = false;
  actualizarTextoBotonTodosSupuestos();
  filtrarCatalogoEvaluador();
};

window.alternarMostrarTodosSupuestos = function() {
  window.MOSTRAR_TODOS_SUPUESTOS_EVAL = !window.MOSTRAR_TODOS_SUPUESTOS_EVAL;
  if (window.MOSTRAR_TODOS_SUPUESTOS_EVAL) {
    window.FILTRO_SEMAFORO_ACTUAL = "TODOS";
  } else {
    window.FILTRO_SEMAFORO_ACTUAL = "NINGUNO";
  }
  actualizarTextoBotonTodosSupuestos();
  filtrarCatalogoEvaluador();
};

function actualizarTextoBotonTodosSupuestos() {
  const btn = document.getElementById("btn-toggle-todos-supuestos");
  if (!btn) return;
  btn.textContent = window.MOSTRAR_TODOS_SUPUESTOS_EVAL
    ? `🔼 Ocultar guía completa`
    : `📋 Ver guía completa (${window.EVALUADOR_CATALOGO.length})`;
}

// Buscador bajo demanda con normalización de tildes y coincidencia por palabras
window.filtrarCatalogoEvaluador = function() {
  const cont = document.getElementById("lista-resultados-evaluador");
  if (!cont) return;

  const qRaw = document.getElementById("input-buscador-evaluador")?.value || "";
  const qNorm = window.normalizarTextoSinTildes(qRaw);
  const color = window.FILTRO_SEMAFORO_ACTUAL;

  if (!qNorm && !window.MOSTRAR_TODOS_SUPUESTOS_EVAL && color === "NINGUNO") {
    cont.innerHTML = `
      <div style="text-align:center; padding:26px 16px; background:#FFFFFF; border:1.5px dashed #FDE68A; border-radius:20px; color:#475569;">
        <div style="font-size:2rem; margin-bottom:8px;">💡</div>
        <strong style="color:#0F172A; font-size:0.98rem;">¿Tienes duda sobre algún gasto urgente de tu despacho?</strong><br/>
        <span style="font-size:0.83rem; line-height:1.45; display:inline-block; margin-top:4px; max-width:420px;">
          Escribe arriba cualquier palabra coloquial (como <em>menú, tóner, bidón, taxi, gasfitero, olva, sunarp, flores, silla o propina</em>) para ver al instante si está permitido y qué requisito adjuntar, o toca <strong>"📋 Ver guía completa"</strong>.
        </span>
      </div>
    `;
    return;
  }

  const cfg = window.ANC_STATE ? window.ANC_STATE.config : { valor_uit: 5350 };
  const p = window.ANC_STATE ? window.ANC_STATE.perfilActivo : { es_adc: false, unidad_id: 12 };
  const uit = Number(cfg.valor_uit || 5350);

  const gastosDep = (window.CAJA_STATE?.gastosRegistrados || []).filter(
    g => Number(g.unidad_organica_id) === Number(p.unidad_id) || g.codigo_dependencia === p.codigo_dependencia
  );

  const tokensBusqueda = qNorm.split(/\s+/).filter(Boolean);

  const filtrados = window.EVALUADOR_CATALOGO.filter(item => {
    const pasaColor = color === "TODOS" || color === "NINGUNO" || item.semaforo === color;
    const textoIndexado = window.normalizarTextoSinTildes(
      `${item.nombre} ${item.keywords} ${item.requisito} ${item.especifica} ${item.codigo}`
    );
    const pasaTexto = tokensBusqueda.length === 0 || tokensBusqueda.every(tok => textoIndexado.includes(tok));
    return pasaColor && pasaTexto;
  });

  if (filtrados.length === 0) {
    cont.innerHTML = `
      <div style="text-align:center; padding:22px; color:#475569; background:#FFFDF5; border:1.5px solid #FDE68A; border-radius:18px; font-size:0.84rem;">
        No encontramos ese término exacto en Caja Chica. Prueba con otra palabra clave o consulta la pestaña <strong>"🏛️ Eventos y Encargos Especiales"</strong>.
      </div>
    `;
    return;
  }

  cont.innerHTML = filtrados.map(item => {
    const badgeClass = item.semaforo === "VERDE" ? "badge-verde" : (item.semaforo === "AMARILLO" ? "badge-amarillo" : "badge-rojo");
    const badgeTexto = item.semaforo === "VERDE" ? "🟢 PERMITIDO DIRECTO" : (item.semaforo === "AMARILLO" ? "🟡 PERMITIDO CON REQUISITO" : "🔴 NO PERMITIDO EN CAJA CHICA");

    let topeCompSoles = 0;
    if (item.tipoTopeComp === "PCT_UIT") topeCompSoles = (uit * (item.valorTopeComp / 100));
    else if (item.tipoTopeComp === "FIJO") topeCompSoles = item.valorTopeComp;
    else if (item.tipoTopeComp === "TARIFARIO") topeCompSoles = 46.00;

    const topeUitAnual = p.es_adc ? item.topeAnualUitAdc : item.topeAnualUitSede;
    const topeAnualSoles = topeUitAnual ? (topeUitAnual * uit) : null;

    const gastadoRubro = gastosDep
      .filter(g => (g.concepto_detalle && g.concepto_detalle.includes(item.codigo)) || g.especifica_gasto === item.especifica)
      .reduce((acc, g) => acc + Number(g.monto_total_soles || 0), 0);

    const pctConsumidoAnual = topeAnualSoles ? Math.min(100, Math.round((gastadoRubro / topeAnualSoles) * 100)) : 0;

    const bgCard = item.semaforo === "ROJO" ? "#FFF5F6" : (item.semaforo === "AMARILLO" ? "#FFFDF5" : "#F2FBF7");
    const borderCard = item.semaforo === "ROJO" ? "#FECDD3" : (item.semaforo === "AMARILLO" ? "#FDE68A" : "#A7F3D0");

    return `
      <div style="background:${bgCard}; border:1.5px solid ${borderCard}; border-radius:18px; padding:14px; box-shadow:0 3px 10px rgba(15,23,42,0.03);">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:8px; margin-bottom:8px; flex-wrap:wrap;">
          <div style="font-size:0.95rem; font-weight:800; color:#0F172A; flex:1; min-width:180px;">
            ${item.icono} ${item.nombre}
          </div>
          <span class="badge-semaforo ${badgeClass}">${badgeTexto}</span>
        </div>

        <div style="font-size:0.82rem; color:#1E293B; background:#FFFFFF; padding:10px 12px; border-radius:12px; border:1px solid rgba(15,23,42,0.06); margin-bottom:8px; line-height:1.42;">
          <strong>¿Qué debes tener en cuenta?:</strong> ${item.requisito}
        </div>

        ${item.semaforo !== "ROJO" ? `
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; font-size:0.78rem; color:#0F172A; margin-bottom:6px;">
            <div>
              • <strong>Monto máximo por boleta/factura:</strong> ${window.fmtSoles(topeCompSoles)}
              ${topeUitAnual ? ` | <strong>Tope anual de la sede:</strong> ${topeUitAnual} UIT (${window.fmtSoles(topeAnualSoles)})` : ""}
            </div>
            ${topeAnualSoles ? `
              <div style="font-weight:800; color:${pctConsumidoAnual > 85 ? '#E11D48' : '#059669'};">
                Utilizado en sede: ${window.fmtSoles(gastadoRubro)} (${pctConsumidoAnual}%)
              </div>
            ` : ""}
          </div>
        ` : ""}

        <div style="font-size:0.68rem; font-weight:700; color:#64748B;">
          Referencia interna para Administración: Cód. ${item.codigo} • Partida: ${item.especifica} • ${item.baseLegal}
        </div>
      </div>
    `;
  }).join("");
};

// Simulador amigable de Fondos por Encargo (Directiva V.06)
window.evaluarSimuladorEncargo = function() {
  const cfg = window.ANC_STATE ? window.ANC_STATE.config : { valor_uit: 5350 };
  const uit = Number(cfg.valor_uit || 5350);

  const selSupuesto = document.getElementById("enc-tipo-supuesto");
  const monto = Number(document.getElementById("enc-monto-soles")?.value || 0);
  const regimen = document.getElementById("enc-regimen-resp")?.value || "DL_728_276";
  const divDictamen = document.getElementById("dictamen-simulador-encargo");
  const btnReg = document.getElementById("btn-registrar-encargo");
  if (!selSupuesto || !divDictamen || !btnReg) return;

  const supuesto = selSupuesto.value;
  const maxUitSupuesto = Number(selSupuesto.options[selSupuesto.selectedIndex].getAttribute("data-max-uit") || 10);
  const topeSolesSupuesto = maxUitSupuesto * uit;
  const equivUit = Number((monto / uit).toFixed(2));

  const alertas = [];
  let viable = true;

  if (supuesto === "ACTIVO_FIJO") {
    viable = false;
    alertas.push("🚫 <strong>No aplicable por Encargo:</strong> La compra de muebles, escritorios, sillas, computadoras o equipos inventariables se canaliza mediante requerimiento regular a la Unidad de Abastecimiento <small>(Numeral 5.2.1.d Directiva de Encargos V.06)</small>.");
  }

  if (regimen !== "DL_728_276") {
    viable = false;
    alertas.push("🚫 <strong>Requisito del responsable designado:</strong> Por disposición de la Directiva de Encargos V.06 <small>(Numeral 5.1.7)</small>, el servidor a cuyo nombre se habilita el fondo debe pertenecer al régimen D.L. N° 728 o D.L. N° 276.");
  }

  if (monto > topeSolesSupuesto && supuesto !== "ACTIVO_FIJO") {
    viable = false;
    alertas.push(`🚫 <strong>Supera el límite máximo (${maxUitSupuesto} UIT = ${window.fmtSoles(topeSolesSupuesto)}):</strong> El monto estimado (${window.fmtSoles(monto)} = ${equivUit} UIT) excede el tope permitido para esta modalidad.`);
  }

  if (monto >= uit || supuesto === "FOTOCOPIADORAS") {
    alertas.push(`📋 <strong>Requisito de cotizaciones (Mayor o igual a 1 UIT = ${window.fmtSoles(uit)}):</strong> Para tramitar este encargo se requiere adjuntar <strong>tres (03) cotizaciones</strong>, un cuadro comparativo simple y las características técnicas.`);
  }

  if (supuesto === "EXPOSITOR" && monto > 1500.00) {
    alertas.push(`ℹ️ <strong>Nota sobre Recibo por Honorarios (> S/ 1,500.00):</strong> Aplica retención del 8% de Impuesto a la Renta (${window.fmtSoles(monto * 0.08)}), salvo que el ponente adjunte su Constancia de Suspensión de 4ta Categoría.`);
  }

  alertas.push(`⏳ <strong>Plazo para rendir cuentas:</strong> Una vez concluida la actividad o evento, la rendición documentada (Formato N° 06) se presenta dentro de los <strong>tres (03) días hábiles</strong> siguientes.`);

  divDictamen.innerHTML = `
    <div style="background:${viable ? '#F2FBF7' : '#FFF5F6'}; border:1.5px solid ${viable ? '#A7F3D0' : '#FECDD3'}; border-radius:16px; padding:12px 14px; font-size:0.79rem; color:#0F172A; line-height:1.42;">
      <div style="font-weight:800; font-size:0.88rem; margin-bottom:6px; color:${viable ? '#065F46' : '#9F1239'};">
        ${viable ? `✓ SOLICITUD DE ENCARGO PROCEDENTE (${equivUit} UIT de un máximo de ${maxUitSupuesto} UIT)` : `✕ OBSERVACIÓN PREVIA A SUBSANAR`}
      </div>
      ${alertas.map(a => `<div style="margin-bottom:5px;">${a}</div>`).join("")}
    </div>
  `;

  btnReg.disabled = !viable;
  btnReg.style.opacity = viable ? "1" : "0.45";
};

// Generador Limpio de los Formatos Oficiales de la Directiva de Fondos por Encargo V.06 (Páginas 13, 14 y 16)
window.imprimirReporteEvaluacionEncargoPDF = function(modoImpresion) {
  const cfg = window.ANC_STATE ? window.ANC_STATE.config : { valor_uit: 5350, anio_fiscal: 2026 };
  const p = window.ANC_STATE ? window.ANC_STATE.perfilActivo : { codigo_dependencia: "ANC", nombre_dependencia: "Sede Central ANC-MP" };
  const uit = Number(cfg.valor_uit || 5350);

  const selSupuesto = document.getElementById("enc-tipo-supuesto");
  const supuestoTexto = selSupuesto ? selSupuesto.options[selSupuesto.selectedIndex].text : "Encargo Interno";
  const claseBienServ = selSupuesto ? selSupuesto.options[selSupuesto.selectedIndex].getAttribute("data-clase") : "SERVICIO";
  const maxUit = Number(selSupuesto ? selSupuesto.options[selSupuesto.selectedIndex].getAttribute("data-max-uit") : 10);

  const monto = Number(document.getElementById("enc-monto-soles")?.value || 0);
  const equivUit = (monto / uit).toFixed(2);
  const respNombre = document.getElementById("enc-nombre-resp")?.value || p.usuario_nombre;
  const provNombre = document.getElementById("enc-proveedor")?.value || "Proveedor / Locador";
  const desc = document.getElementById("enc-descripcion")?.value || "Atención por modalidad de Encargo";
  const fechaHoy = new Date().toLocaleDateString("es-PE");
  const especifica = selSupuesto?.value === "EXPOSITOR" ? "2.3.2.7.10.1" : (claseBienServ === "BIEN" ? "2.3.1.5.1.2" : "2.3.2.4.2.1");

  const cabEnc = window.MotorAnexosANC.cabeceraDirectivaHTML("OGFIN/DIR-01", "NORMAS PARA LA ENTREGA DE FONDOS POR LA MODALIDAD DE ENCARGOS", "06");

  // 1. Formato N° 1 y 2 (Bienes) o Formato N° 3 y 4 (Servicios) - Páginas 13 y 14 Directiva Encargos V.06
  const htmlFormatos1a4 = claseBienServ === "BIEN" ? `
    <div class="hoja-oficial">
      ${cabEnc}
      <div class="titulo-anexo-num">FORMATO N° 1</div>
      <div class="titulo-anexo-nombre">SOLICITUD DE BIENES (MODALIDAD DE ENCARGOS)</div>
      <div style="border:1.5px solid #000; padding:14px; margin-bottom:20px;">
        <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
          <span><strong>Sr. Jefe de la Oficina de Administración y Finanzas / Administrador ADC:</strong></span>
          <span><strong>Fecha:</strong> ${fechaHoy}</span>
        </div>
        <div style="margin-bottom:8px;"><strong>Área Usuaria Solicitante:</strong> [${p.codigo_dependencia}] ${p.nombre_dependencia}</div>
        <div style="margin-bottom:10px;"><strong>Responsable del Manejo del Encargo (D.L. 728 / D.L. 276):</strong> ${respNombre}</div>
        <p style="margin-bottom:8px;">Por medio de la presente se solicita atender bajo la modalidad de ENCARGO (Directiva V.06) los siguientes bienes:</p>
        <table class="tabla-directiva">
          <thead>
            <tr>
              <th style="width:15%; text-align:center;">CANTIDAD</th>
              <th style="width:65%;">DESCRIPCIÓN DEL BIEN / REQUERIMIENTO</th>
              <th style="width:20%; text-align:right;">IMPORTE ESTIMADO (S/)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="text-align:center;">01 Global</td>
              <td>${desc}<br/><small>Supuesto Normativo: ${supuestoTexto} (${equivUit} UIT de máx. ${maxUit} UIT)</small></td>
              <td style="text-align:right; font-weight:bold;">${window.fmtSoles(monto)}</td>
            </tr>
          </tbody>
        </table>
        <div style="margin-top:8px;"><strong>MOTIVO DE LA SOLICITUD:</strong> Cumplimiento de metas institucionales conforme al numeral 5.2.1 de la Directiva de Encargos V.06.</div>
        <div class="bloque-firmas" style="margin-top:42px;">
          <div class="linea-firma" style="width:42%;"><strong>AUTORIZADO: ADMINISTRADOR / OAF / OCA</strong><br/>(FIRMA Y SELLO)</div>
          <div class="linea-firma" style="width:42%;"><strong>Firma del Responsable del Área Usuaria</strong><br/>${p.nombre_dependencia}</div>
        </div>
      </div>

      <div class="titulo-anexo-num">FORMATO N° 2</div>
      <div class="titulo-anexo-nombre">RECEPCIÓN SATISFACTORIA DE BIENES (ENCARGOS)</div>
      <div style="border:1.5px solid #000; padding:14px;">
        <div style="text-align:right; margin-bottom:8px;"><strong>Fecha:</strong> ${fechaHoy}</div>
        <p style="margin-bottom:8px;">Por medio de la presente se da <strong>CONFORMIDAD</strong> por la recepción satisfactoria de los siguientes bienes adquiridos mediante Encargo:</p>
        <table class="tabla-directiva">
          <thead>
            <tr>
              <th style="width:15%; text-align:center;">CANTIDAD</th>
              <th style="width:85%;">DESCRIPCIÓN</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="text-align:center;">01 Global</td>
              <td>${desc} — Proveedor: ${provNombre} (${window.fmtSoles(monto)})</td>
            </tr>
          </tbody>
        </table>
        <div class="bloque-firmas" style="margin-top:42px;">
          <div class="linea-firma" style="width:50%;"><strong>Firma y Sello del Responsable del Área Usuaria</strong><br/>${p.nombre_dependencia}</div>
        </div>
      </div>
    </div>
  ` : `
    <div class="hoja-oficial">
      ${cabEnc}
      <div class="titulo-anexo-num">FORMATO N° 3</div>
      <div class="titulo-anexo-nombre">SOLICITUD DE SERVICIOS (MODALIDAD DE ENCARGOS)</div>
      <div style="border:1.5px solid #000; padding:14px; margin-bottom:20px;">
        <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
          <span><strong>Sr. Jefe de la Oficina de Administración y Finanzas / Administrador ADC:</strong></span>
          <span><strong>Fecha:</strong> ${fechaHoy}</span>
        </div>
        <div style="margin-bottom:8px;"><strong>Área Usuaria Solicitante:</strong> [${p.codigo_dependencia}] ${p.nombre_dependencia}</div>
        <div style="margin-bottom:10px;"><strong>Responsable del Manejo del Encargo (D.L. 728 / D.L. 276):</strong> ${respNombre}</div>
        <p style="margin-bottom:8px;">Por medio de la presente solicitamos se sirvan autorizar bajo la modalidad de ENCARGO el servicio de:</p>
        <div style="border:1px solid #000; padding:10px; margin-bottom:10px;">
          <strong>Objeto del Servicio:</strong> ${desc}<br/>
          <strong>Supuesto Normativo (Numeral 5.2.1):</strong> ${supuestoTexto}<br/>
          <strong>Monto Estimado:</strong> ${window.fmtSoles(monto)} (Equivalente a <strong>${equivUit} UIT</strong> — Tope máximo permitido: ${maxUit} UIT)<br/>
          <strong>Requisitos de Transparencia:</strong> ${monto >= uit ? 'Cuenta con tres (03) cotizaciones detalladas, Cuadro Comparativo e Informe Técnico previo.' : 'Menor a 1 UIT (Con RUC habido y activo en SUNAT).'}
        </div>
        <div class="bloque-firmas" style="margin-top:42px;">
          <div class="linea-firma" style="width:42%;"><strong>AUTORIZADO POR: ADMINISTRADOR / OAF / OCA</strong><br/>(FIRMA Y SELLO)</div>
          <div class="linea-firma" style="width:42%;"><strong>Firma y Sello del Responsable del Área Usuaria</strong><br/>${p.nombre_dependencia}</div>
        </div>
      </div>

      <div class="titulo-anexo-num">FORMATO N° 4</div>
      <div class="titulo-anexo-nombre">CONFORMIDAD DE SERVICIOS (MODALIDAD DE ENCARGOS)</div>
      <div style="border:1.5px solid #000; padding:14px;">
        <div style="text-align:right; margin-bottom:8px;"><strong>Fecha:</strong> ${fechaHoy}</div>
        <p style="margin-bottom:8px;">Por medio del presente, se otorga la <strong>CONFORMIDAD DEL SERVICIO</strong>, por los trabajos recibidos a satisfacción bajo la modalidad de Encargo:</p>
        <div style="border:1px solid #000; padding:10px; min-height:48px;">
          ${desc} — Ejecutado por: <strong>${provNombre}</strong> por el monto de <strong>${window.fmtSoles(monto)}</strong>.
        </div>
        <div class="bloque-firmas" style="margin-top:42px;">
          <div class="linea-firma" style="width:50%;"><strong>Firma y Sello del Responsable del Área Usuaria</strong><br/>${p.nombre_dependencia}</div>
        </div>
      </div>
    </div>
  `;

  // 2. Formato N° 6 Exacto: RENDICIÓN DE FONDOS POR ENCARGO DEL DISTRITO FISCAL Y/O DEPENDENCIA (Página 16 Directiva Encargos V.06)
  const htmlFormato6 = `
    <div class="hoja-oficial">
      ${cabEnc}
      <div class="titulo-anexo-num">FORMATO N° 6</div>
      <div class="titulo-anexo-nombre">RENDICIÓN DE FONDOS POR ENCARGO DEL DISTRITO FISCAL Y/O DEPENDENCIA</div>
      <div style="margin-bottom:8px; font-weight:bold;">Dependencia: [${p.codigo_dependencia}] ${p.nombre_dependencia} • Responsable del Encargo: ${respNombre}</div>

      <table class="tabla-directiva">
        <thead>
          <tr>
            <th rowspan="2" style="width:4%;">N°</th>
            <th colspan="3" style="text-align:center;">DOCUMENTO</th>
            <th rowspan="2" style="width:18%;">PROVEEDOR / LOCADOR</th>
            <th rowspan="2" style="width:10%;">RUC</th>
            <th rowspan="2" style="width:22%;">DETALLE DEL GASTO</th>
            <th rowspan="2" style="width:8%;">Específica de Gasto</th>
            <th style="width:9%; text-align:center;">Acciones Centrales (9001)</th>
            <th style="width:9%; text-align:center;">Justicia Penal / ADC (0086)</th>
            <th rowspan="2" style="width:10%; text-align:right;">Total por específicas (S/)</th>
          </tr>
          <tr>
            <th style="width:7%;">Fecha</th>
            <th style="width:6%;">Clase</th>
            <th style="width:7%;">N°</th>
            <th style="text-align:center;">Gestión Adm.</th>
            <th style="text-align:center;">ADC</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="text-align:center;">1</td>
            <td style="text-align:center;">${fechaHoy}</td>
            <td style="text-align:center;">${selSupuesto?.value === 'EXPOSITOR' ? 'RHE' : 'FACT'}</td>
            <td style="text-align:center;">001-001</td>
            <td>${provNombre}</td>
            <td style="text-align:center;">-</td>
            <td>${desc}</td>
            <td style="text-align:center; font-weight:bold;">${especifica}</td>
            <td style="text-align:right;">${!p.es_adc ? monto.toFixed(2) : "0.00"}</td>
            <td style="text-align:right;">${p.es_adc ? monto.toFixed(2) : "0.00"}</td>
            <td style="text-align:right; font-weight:bold;">${monto.toFixed(2)}</td>
          </tr>
          <tr class="fila-total-general">
            <td colspan="8" style="text-align:right;">Total General S/</td>
            <td style="text-align:right;">${!p.es_adc ? monto.toFixed(2) : "0.00"}</td>
            <td style="text-align:right;">${p.es_adc ? monto.toFixed(2) : "0.00"}</td>
            <td style="text-align:right;">${window.fmtSoles(monto)}</td>
          </tr>
        </tbody>
      </table>

      <div style="display:flex; justify-content:space-between; align-items:flex-end; margin-top:18px;">
        <table class="tabla-directiva" style="width:320px; margin-bottom:0;">
          <thead><tr><th colspan="2">MOVIMIENTO DEL DINERO EN EFECTIVO (PLAZO MÁX. 3 DÍAS HÁBILES)</th></tr></thead>
          <tbody>
            <tr><td>Monto Transferido con Resolución S/</td><td style="text-align:right;">${window.fmtSoles(monto)}</td></tr>
            <tr><td>Importe de la presente Rendición S/</td><td style="text-align:right;">- ${window.fmtSoles(monto)}</td></tr>
            <tr class="fila-total-general"><td>SALDO A DEVOLVER (HOJA T-6) S/</td><td style="text-align:right;">S/ 0.00</td></tr>
          </tbody>
        </table>

        <div class="bloque-firmas" style="width:60%; margin-top:0;">
          <div class="linea-firma" style="width:45%;"><strong>Administrador del Distrito Fiscal y/o Dependencia</strong><br/>${p.nombre_dependencia}</div>
          <div class="linea-firma" style="width:45%;"><strong>Encargado Único / Responsable del Fondo por Encargo</strong><br/>${respNombre}</div>
        </div>
      </div>
    </div>
  `;

  let htmlFinal = "";
  let orientacion = "portrait";
  if (modoImpresion === "FORMATO_1_2_3_4") {
    htmlFinal = htmlFormatos1a4;
  } else if (modoImpresion === "FORMATO_6") {
    htmlFinal = htmlFormato6;
    orientacion = "landscape";
  } else {
    htmlFinal = htmlFormatos1a4 + htmlFormato6;
  }

  window.MotorAnexosANC.imprimirDocumentoOficial(`Formatos_Encargo_${p.codigo_dependencia}`, htmlFinal, orientacion);
};

window.registrarSolicitudEncargo = async function() {
  const cfg = window.ANC_STATE.config;
  const p = window.ANC_STATE.perfilActivo;
  const monto = Number(document.getElementById("enc-monto-soles").value || 0);
  const supuesto = document.getElementById("enc-tipo-supuesto").value;
  const desc = document.getElementById("enc-descripcion").value.trim() || "Requerimiento por modalidad de Encargo";
  const respNombre = document.getElementById("enc-nombre-resp")?.value || p.usuario_nombre;

  const nuevoEncargo = {
    anio_fiscal: cfg.anio_fiscal,
    mes_ejecucion: `Año ${cfg.anio_fiscal}`,
    unidad_organica_id: p.unidad_id,
    modalidad_fondo: "ENCARGO",
    tipo_comprobante: "Resolución / Solicitud de Encargo",
    serie_numero_comprobante: `ENC-${cfg.anio_fiscal}-${Math.floor(100 + Math.random() * 900)}`,
    fecha_emision: new Date().toISOString().slice(0, 10),
    ruc_dni_proveedor: p.usuario_dni,
    razon_social_proveedor: `Resp. Encargo: ${respNombre}`,
    concepto_detalle: `[ENCARGO - ${supuesto}] ${desc}`,
    especifica_gasto: supuesto === "EXPOSITOR" ? "2.3.2.7.10.1" : "2.3.2.4.2.1",
    categoria_presupuestal: p.es_adc ? "0086. Mejora de los Servicios del Sistema de Justicia Penal" : "9001. Acciones Centrales",
    moneda: "PEN",
    precio_unitario: monto,
    cantidad: 1,
    monto_total_soles: monto,
    aplica_retencion_igv_3pct: false,
    monto_retencion_igv: 0,
    aplica_retencion_4ta_8pct: supuesto === "EXPOSITOR" && monto > 1500,
    monto_retencion_4ta: (supuesto === "EXPOSITOR" && monto > 1500) ? Number((monto * 0.08).toFixed(2)) : 0,
    aplica_detraccion: false,
    porcentaje_detraccion: 0,
    monto_detraccion: 0,
    neto_pagar_proveedor: monto,
    usuario_registro: `${respNombre} (DNI: ${p.usuario_dni})`,
    estado_auditoria: "APROBADO"
  };

  await window.SupabaseANC.request("anc_gastos_caja_encargos", "POST", "", nuevoEncargo);

  const localGuardados = JSON.parse(localStorage.getItem("anc_gastos_caja_local_v1") || "[]");
  localGuardados.unshift({
    ...nuevoEncargo,
    id: Date.now(),
    usuario_dni_registro: p.usuario_dni,
    codigo_dependencia: p.codigo_dependencia,
    nombre_dependencia: p.nombre_dependencia
  });
  localStorage.setItem("anc_gastos_caja_local_v1", JSON.stringify(localGuardados));

  if (typeof window.cargarDatosModuloCaja === "function") window.cargarDatosModuloCaja();
  alert(`✅ Tu Solicitud de Fondo por Encargo (${window.fmtSoles(monto)}) ha sido registrada. Toca '🖨️ Descargar Expediente Completo (PDF)' para obtener los formatos listos para firmar.`);
};

window.filtrarTablaAnexo09 = function() {
  const tbody = document.getElementById("tbody-consulta-anexo09");
  if (!tbody || !window.CAJA_CATALOGOS) return;

  const qRaw = document.getElementById("input-buscar-distrito-anexo09")?.value || "";
  const qNorm = window.normalizarTextoSinTildes(qRaw);
  const lista = window.CAJA_CATALOGOS.tarifarioAnexo09.filter(
    d => !qNorm || window.normalizarTextoSinTildes(d.distrito).includes(qNorm)
  );

  tbody.innerHTML = lista.map(d => `
    <tr>
      <td><strong style="color:#0F172A;">#${d.item}</strong></td>
      <td><strong style="color:#0F172A;">${d.distrito}</strong></td>
      <td><span class="badge-semaforo badge-verde">S/ ${d.dia.toFixed(2)}</span></td>
      <td><span class="badge-semaforo badge-amarillo">S/ ${d.noche.toFixed(2)}</span></td>
    </tr>
  `).join("");
};