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

const versionRadios = document.querySelectorAll('input[name="version"]');

// Datos de favoritos
const datosFavoritos = {
  '1': { para: 'Julio Alberto Ramirez Suarez', numero: '310 296 0186'},
  '2': { para: 'Danilo Lopez', numero: '311 530 6423'},
  '3': { para: 'Nelly Urquijo', numero: '310 484 0242'},
  '4': { para: 'Dolly Aguilera Forero', numero: '314 226 0851'},
  '5': { para: 'Kather Ortiz', numero: '321 236 5990'},
  '6': { para: 'Jose Eulises Gonzalez Menjura', numero: '321 957 6016'},
  '7': { para: 'Dumar Sierra', numero: '322 263 4983'},
  '8': { para: 'Julio Orjuela', numero: '324 681 5878'},
  '9': { para: 'Lenny Cardenas', numero: '312 526 8819'}
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
  // actualiza overlay antes de renderizar
  actualizarOverlay();

  const version = document.querySelector('input[name="version"]:checked').value;
  const config = versionConfig[version];
  const outW = config.output.width;
  const outH = config.output.height;

  // crear contenedor fuera de la pantalla con tamaño de salida exacto
  const ticketFull = document.createElement('div');
  ticketFull.style.cssText = `
    position: fixed;
    top: -9999px;
    left: -9999px;
    width: ${outW}px;
    height: ${outH}px;
    background: url('${config.backgroundImage}') center top / contain no-repeat;
    font-family: 'Manrope', sans-serif;
    color: ${getComputedStyle(document.documentElement).getPropertyValue('--text-color') || '#200020'};
    overflow: hidden;
  `;

  // Añadir los textos usando las posiciones definidas en config.positions (ya vienen en px)
  const mk = (key) => {
    const p = config.positions[key];
    const v = (key === 'para' ? inpPara.value : key === 'cuanto' ? inpCuanto.value : key === 'numero' ? inpNumero.value : inpFecha.value);
    const fs = p.fontSize || '30px';
    return `<div style="position:absolute; top:${p.top}; left:${p.left}; font-size:${fs}; font-weight:400; white-space:nowrap;">${v}</div>`;
  };

  ticketFull.innerHTML = `
    ${mk('para')}
    ${mk('cuanto')}
    ${mk('numero')}
    ${mk('fecha')}
  `;

  document.body.appendChild(ticketFull);

  // renderizar con html2canvas; usar scale para mayor resolución si quieres
  const canvas = await html2canvas(ticketFull, { scale: 2, useCORS: true, backgroundColor: null });
  ticketFull.remove();
  return canvas;
}

// --- descarga ---
btnDownload.addEventListener('click', async () => {
  try {
    btnDownload.disabled = true;
    const canvas = await generarComprobante();
    canvas.toBlob(blob => {
      if (!blob) {
        btnDownload.disabled = false;
        return;
      }
      const now = new Date();
      const day = String(now.getDate()).padStart(2, '0');
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const year = String(now.getFullYear()).slice(2); // solo los dos últimos dígitos
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');

      const version = document.querySelector('input[name="version"]:checked').value;
      const filename = `nequi-${version}-${day}${month}${year}${hours}${minutes}.png`;
      saveAs(blob, filename);
      btnDownload.disabled = false;
    }, 'image/png');
  } catch (err) {
    console.error(err);
    btnDownload.disabled = false;
  }
});

// --- actualizo versionConfig: agrego tamaño de salida (output) ---
const versionConfig = {
  android: {
    backgroundImage: 'baseAndroid.jpg',
    previewHeight: '800px',
    output: { width: 720, height: 1610 }, // tamaño real para la descarga
    positions: {
      para: { top: '757px', left: '57px', fontSize: '28px' },
      cuanto: { top: '858px', left: '57px', fontSize: '28px' },
      numero: { top: '955px', left: '57px', fontSize: '28px' },
      fecha: { top: '1053px', left: '57px', fontSize: '29px' }
    },
    preview: {
      para: { top: '47.6%', left: '8%', fontSize: '14px' },
      cuanto: { top: '53.9%', left: '8%', fontSize: '14px' },
      numero: { top: '59.9%', left: '8%', fontSize: '14px' },
      fecha: { top: '65.9%', left: '8%', fontSize: '14px' }
    }
  },
  iphone: {
    backgroundImage: 'baseIphone.jpg',
    previewHeight: '800px',
    output: { width: 828, height: 1792 }, // ejemplo para iPhone (ajusta si tienes otro)
    positions: {
      para: { top: '852px', left: '65px', fontSize: '29px' },
      cuanto: { top: '958px', left: '65px', fontSize: '29px' },
      numero: { top: '1064px', left: '65px', fontSize: '29px' },
      fecha: { top: '1170px', left: '65px', fontSize: '29px' }
    },
    preview: {
      para: { top: '47.5%', left: '6.6%', fontSize: '13px' },
      cuanto: { top: '53.5%', left: '6.6%', fontSize: '13px' },
      numero: { top: '59.4%', left: '6.6%', fontSize: '13px' },
      fecha: { top: '65.3%', left: '6.6%', fontSize: '13px' }
    }
  }
};

// elemento del título (para actualizar el texto según versión)
const headerTitle = document.querySelector('.controls h2');

// Función para actualizar la versión (preview + título)
function actualizarVersion() {
  const version = document.querySelector('input[name="version"]:checked').value;
  const config = versionConfig[version];

  // actualizar preview background y altura
  preview.style.background = `url('${config.backgroundImage}') center top / cover no-repeat`;
  preview.style.height = config.previewHeight;

  // actualizar posiciones del preview (usa las propiedades del objeto preview)
  Object.assign(tPara.style, config.preview.para);
  Object.assign(tCuanto.style, config.preview.cuanto);
  Object.assign(tNumero.style, config.preview.numero);
  Object.assign(tFecha.style, config.preview.fecha);

  // actualizar texto del h2 según versión
  if (headerTitle) {
    headerTitle.textContent = version === 'iphone' ? '-> Apple Version <-' : '-> Android Version <-';
  }

  // actualizar overlay por si hay texto ya ingresado
  actualizarOverlay();
}

// Asegurar que los radios disparen la actualización
versionRadios.forEach(radio => {
  radio.addEventListener('change', actualizarVersion);
});

// Llamar a actualizarVersion al cargar la página
actualizarVersion();

