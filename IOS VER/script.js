// Inputs
const inpPara = document.getElementById('inpPara');
const inpCuanto = document.getElementById('inpCuanto');
const inpNumero = document.getElementById('inpNumero');
const inpFecha = document.getElementById('inpFecha');
const favoritos = document.getElementById('favoritos');

const preview = document.getElementById('ticketPreview');
const tPara = preview.querySelector('.t-para');
const tCuanto = preview.querySelector('.t-cuanto');
const tNumero = preview.querySelector('.t-numero');
const tFecha = preview.querySelector('.t-fecha');

const btnRender = document.getElementById('btnRender');
const btnDownload = document.getElementById('btnDownload');
const resultImg = document.getElementById('resultImg');

// Datos de favoritos
const datosFavoritos = {
  '1': { para: 'Julio Alberto Ramirez Suarez', numero: '310 296 0186'},
  '2': { para: 'Danilo Lopez', numero: '311 530 6423'},
  '3': { para: 'Marlon Dallehd Rios Rojas', numero: 'JASKASJASK'},
  '4': { para: 'Dolly Aguilera Forero', numero: '314 226 0851'},
  '5': { para: 'Yineth Munoz Perez', numero: '321 385 2262'},
  '6': { para: 'Jose Eulises Gonzalez Menjura', numero: '321 957 6016'},
  '7': { para: 'Dumar Alberto Sierra Fresneda', numero: '322 263 4983'}
};

// Rellenar campos al seleccionar favorito
favoritos.addEventListener('change', () => {
  const seleccion = favoritos.value;
  // Corregir la validación y asignación
  if (datosFavoritos[seleccion]) {  // Eliminar el = y usar directamente la validación
    inpPara.value = datosFavoritos[seleccion].para;
    inpNumero.value = datosFavoritos[seleccion].numero;
    actualizarOverlay();
  } else {
    // Vaciar campos si no hay selección válida
    inpPara.value = '';
    inpNumero.value = '';
    actualizarOverlay();
  }
});

// Botones de suma rápida
function formatearDinero(valor) {
    // Formatear sin decimales primero
    const formatted = new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(valor).replace('COP', '$');
    
    // Agregar ,00 al final
    return `${formatted},00`;
}

function sumarValor(event) {
    const incremento = parseInt(event.target.getAttribute('data-valor'));
    
    // Obtener valor actual y convertirlo a número
    let valorActual = inpCuanto.value
        .replace(/[$.]/g, '')     // quitar $ y puntos
        .replace(/\s/g, '')       // quitar espacios
        .replace(/,00/g, '')      // quitar ,00
        .replace(/,/g, '')        // quitar otras comas
        .trim();                  // quitar espacios extras
    
    // Convertir a número (sin multiplicar por 100)
    valorActual = parseInt(valorActual) || 0;
    
    // Sumar el incremento
    const nuevoValor = valorActual + incremento;
    
    // Formatear y actualizar el input
    inpCuanto.value = formatearDinero(nuevoValor);
    
    // Actualizar el overlay
    actualizarOverlay();
}

// Asignar eventos a los botones de suma rápida
document.querySelectorAll('.sumarBtn').forEach(btn => {
    btn.addEventListener('click', sumarValor);
});

function agregarFechaActual() {
  const meses = [
    'enero','febrero','marzo','abril','mayo','junio',
    'julio','agosto','septiembre','octubre','noviembre','diciembre'
  ];

  const ahora = new Date();
  const dia = String(ahora.getDate()).padStart(2, '0');
  const mes = meses[ahora.getMonth()];
  const anio = ahora.getFullYear();

  const hora24 = ahora.getHours();
  const hora12 = String((hora24 % 12) || 12).padStart(2, '0'); // convierte a 12h y mantiene cero inicial
  const minutos = String(ahora.getMinutes()).padStart(2, '0');
  const ampm = hora24 >= 12 ? 'p.m.' : 'a.m.';

  const fechaFormateada = `${dia} de ${mes} de ${anio} a las ${hora12}:${minutos} ${ampm}`;
  inpFecha.value = fechaFormateada;
  actualizarOverlay();
}

document.getElementById('btnFecha').addEventListener('click', agregarFechaActual);

// Cambiar de ID a clase
document.querySelector('.limpiarBtn').addEventListener('click', () => {
    // Limpiar todos los inputs
    inpPara.value = '';
    inpCuanto.value = '';
    inpNumero.value = '';
    inpFecha.value = '';
    favoritos.value = ''; // Resetear selector de favoritos

    // Actualizar el overlay después de limpiar
    actualizarOverlay();
});

// Actualizar preview
function actualizarOverlay() {
  tPara.textContent = inpPara.value || '';
  tCuanto.textContent = inpCuanto.value || '';
  tNumero.textContent = inpNumero.value || '';
  tFecha.textContent = inpFecha.value || '';
}

// Actualizar preview en tiempo real
[inpPara, inpCuanto, inpNumero, inpFecha].forEach(i =>
  i.addEventListener('input', actualizarOverlay)
);

// Botón Limpiar


// --- FUNCIÓN PRINCIPAL ---
async function generarComprobante() {
  actualizarOverlay();

  // Crear comprobante HD invisible
  const ticketFull = document.createElement('div');
  ticketFull.style.cssText = `
    position: fixed;
    top: -9999px;
    left: -9999px;
    width: 828px;
    height: 1792px;
    background: url('baseIphone.jpg') center top / contain no-repeat;
    font-family: 'Manrope', sans-serif;
    color: #200020;
  `;

  ticketFull.innerHTML = `
    <div style="position:absolute;top:852px;left:65px;font-size:29px;font-weight:400;">${inpPara.value}</div>
    <div style="position:absolute;top:958px;left:65px;font-size:29px;font-weight:400;">${inpCuanto.value}</div>
    <div style="position:absolute;top:1064px;left:65px;font-size:29px;font-weight:400;">${inpNumero.value}</div>
    <div style="position:absolute;top:1170px;left:65px;font-size:29px;font-weight:400;">${inpFecha.value}</div>
  `;
  document.body.appendChild(ticketFull);

  const canvas = await html2canvas(ticketFull, { scale: 2 });
  ticketFull.remove();

  return canvas;
}

// --- Botón "Generar + Mostrar" ---
// btnRender.addEventListener('click', async () => {
//   const canvas = await generarComprobante();
//   resultImg.src = canvas.toDataURL('image/png');
//   resultImg.style.display = 'block';
//   window._lastCanvas = canvas;
// });

// --- Botón "Descargar" (ahora genera y descarga directamente) ---
btnDownload.addEventListener('click', async () => {
  const canvas = await generarComprobante();
  canvas.toBlob((blob) => saveAs(blob, 'comprobante-nequi.png'));
});

