// Espera a que el DOM esté completamente cargado antes de ejecutar cualquier código
window.addEventListener('DOMContentLoaded', () => {

  // --- DEFINICIÓN DE CONSTANTES Y ELEMENTOS ---
  const inpPara = document.getElementById('inpPara');
  const inpCuanto = document.getElementById('inpCuanto');
  const inpNumero = document.getElementById('inpNumero');
  const inpFecha = document.getElementById('inpFecha');
  const favoritos = document.getElementById('favoritos');
  const preview = document.getElementById('ticketPreview'); // puede ser null
  const tPara = preview ? preview.querySelector('.t-para') : null;
  const tCuanto = preview ? preview.querySelector('.t-cuanto') : null;
  const tNumero = preview ? preview.querySelector('.t-numero') : null;
  const tFecha = preview ? preview.querySelector('.t-fecha') : null;
  const btnDownload = document.getElementById('btnDownload');
  const versionRadios = document.querySelectorAll('input[name="version"]');
  const headerTitle = document.querySelector('.controls h2');
  const limpiarBtn = document.querySelector('.limpiarBtn');

  // --- CAPACITOR PLUGINS ---
  // Se eliminan de aquí para definirlos justo antes de usarlos y evitar errores de tiempo.

  // --- DATOS Y CONFIGURACIÓN ---
  const datosFavoritos = {
    '1': { para: 'Julio Alberto Ramirez Suarez', numero: '310 296 0186'},
    '2': { para: 'Danilo Lopez', numero: '311 530 6423'},
    '3': { para: 'Marlon Dallehd Rios Rojas', numero: 'JASKASJASK'},
    '4': { para: 'Dolly Aguilera Forero', numero: '314 226 0851'},
    '5': { para: 'Yineth Munoz Perez', numero: '321 385 2262'},
    '6': { para: 'Jose Eulises Gonzalez Menjura', numero: '321 957 6016'},
    '7': { para: 'Dumar Alberto Sierra Fresneda', numero: '322 263 4983'}
  };

  const versionConfig = {
    android: {
      backgroundImage: 'baseAndroid.jpg',
      previewHeight: '800px',
      output: { width: 1080, height: 2400 },
      positions: {
        para: { top: '1128px', left: '86px', fontSize: '39px' },
        cuanto: { top: '1279px', left: '86px', fontSize: '39px' },
        numero: { top: '1423px', left: '86px', fontSize: '39px' },
        fecha: { top: '1570px', left: '86px', fontSize: '39px' }
      },
      preview: {
        para: { top: '47%', left: '8%', fontSize: '14px' },
        cuanto: { top: '53.3%', left: '8%', fontSize: '14px' },
        numero: { top: '59.3%', left: '8%', fontSize: '14px' },
        fecha: { top: '65.4%', left: '8%', fontSize: '14px' }
      }
    },
    iphone: {
      backgroundImage: 'baseIphone.jpg',
      previewHeight: '800px',
      output: { width: 828, height: 1792 },
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

  // --- DEFINICIÓN DE FUNCIONES ---
  function actualizarOverlay() {
    if (tPara) tPara.textContent = inpPara.value || '';
    if (tCuanto) tCuanto.textContent = inpCuanto.value || '';
    if (tNumero) tNumero.textContent = inpNumero.value || '';
    if (tFecha) tFecha.textContent = inpFecha.value || '';
  }

  function formatearDinero(valor) {
    const formatted = new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(valor).replace('COP', '$');
    return `${formatted},00`;
  }

  function sumarValor(event) {
    const incremento = parseInt(event.target.getAttribute('data-valor'));
    let valorActual = inpCuanto.value.replace(/[$.]/g, '').replace(/\s/g, '').replace(/,00/g, '').replace(/,/g, '').trim();
    valorActual = parseInt(valorActual) || 0;
    const nuevoValor = valorActual + incremento;
    inpCuanto.value = formatearDinero(nuevoValor);
    actualizarOverlay();
  }

  function agregarFechaActual() {
    const meses = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
    const ahora = new Date();
    const dia = String(ahora.getDate()).padStart(2, '0');
    const mes = meses[ahora.getMonth()];
    const anio = ahora.getFullYear();
    const hora24 = ahora.getHours();
    const hora12 = String((hora24 % 12) || 12).padStart(2, '0');
    const minutos = String(ahora.getMinutes()).padStart(2, '0');
    const ampm = hora24 >= 12 ? 'p.m.' : 'a.m.';
    inpFecha.value = `${dia} de ${mes} de ${anio} a las ${hora12}:${minutos} ${ampm}`;
    actualizarOverlay();
  }

  async function generarComprobante() {
    actualizarOverlay();
    const version = document.querySelector('input[name="version"]:checked').value;
    const config = versionConfig[version];
    const outW = config.output.width;
    const outH = config.output.height;
    const ticketFull = document.createElement('div');
    ticketFull.style.cssText = `position: fixed; top: -9999px; left: -9999px; width: ${outW}px; height: ${outH}px; background: url('${config.backgroundImage}') center top / contain no-repeat; font-family: 'Manrope', sans-serif; color: ${getComputedStyle(document.documentElement).getPropertyValue('--text-color') || '#200020'}; overflow: hidden;`;
    const mk = (key) => {
      const p = config.positions[key];
      const v = (key === 'para' ? inpPara.value : key === 'cuanto' ? inpCuanto.value : key === 'numero' ? inpNumero.value : inpFecha.value);
      const fs = p.fontSize || '30px';
      return `<div style="position:absolute; top:${p.top}; left:${p.left}; font-size:${fs}; font-weight:400; white-space:nowrap;">${v}</div>`;
    };
    ticketFull.innerHTML = `${mk('para')}${mk('cuanto')}${mk('numero')}${mk('fecha')}`;
    document.body.appendChild(ticketFull);
    const canvas = await html2canvas(ticketFull, { scale: 2, useCORS: true, backgroundColor: null });
    ticketFull.remove();
    return canvas;
  }

  function actualizarVersion() {
    const version = document.querySelector('input[name="version"]:checked').value;
    const config = versionConfig[version];
    if (preview) {
      preview.style.background = `url('${config.backgroundImage}') center top / cover no-repeat`;
      preview.style.height = config.previewHeight;
      if (tPara && config.preview.para) Object.assign(tPara.style, config.preview.para);
      if (tCuanto && config.preview.cuanto) Object.assign(tCuanto.style, config.preview.cuanto);
      if (tNumero && config.preview.numero) Object.assign(tNumero.style, config.preview.numero);
      if (tFecha && config.preview.fecha) Object.assign(tFecha.style, config.preview.fecha);
    }
    if (headerTitle) {
      headerTitle.textContent = version === 'iphone' ? '-> Apple Version <-' : '-> Android Version <-';
    }
    actualizarOverlay();
  }

  // --- ASIGNACIÓN DE EVENT LISTENERS ---
  favoritos.addEventListener('change', () => {
    const seleccion = favoritos.value;
    if (datosFavoritos[seleccion]) {
      inpPara.value = datosFavoritos[seleccion].para;
      inpNumero.value = datosFavoritos[seleccion].numero;
    } else {
      inpPara.value = '';
      inpNumero.value = '';
    }
    actualizarOverlay();
  });

  document.querySelectorAll('.sumarBtn').forEach(btn => btn.addEventListener('click', sumarValor));
  document.getElementById('btnFecha').addEventListener('click', agregarFechaActual);
  [inpPara, inpCuanto, inpNumero, inpFecha].forEach(i => i.addEventListener('input', actualizarOverlay));
  versionRadios.forEach(radio => radio.addEventListener('change', actualizarVersion));

  if (limpiarBtn) {
    limpiarBtn.addEventListener('click', () => {
      inpPara.value = '';
      inpCuanto.value = '';
      inpNumero.value = '';
      inpFecha.value = '';
      favoritos.value = '';
      actualizarOverlay();
    });
  }

btnDownload.addEventListener('click', async () => {
    btnDownload.disabled = true;
    try {
//1. CORRECCIÓN: Obtener tanto Filesystem como Directory del objeto global.
    // Directory es una enumeración, no una propiedad de la instancia de Filesystem.
    const Filesystem = window.Capacitor.Plugins.Filesystem;
    const Directory = window.Capacitor.Plugins.Filesystem.Directory;

    if (!Filesystem || !Directory) {
      const errorMsg = 'Error CRÍTICO: El plugin Filesystem o la enumeración Directory no están cargados. Sincroniza y reconstruye el proyecto.';
      alert(errorMsg);
      console.error(errorMsg);
      throw new Error(errorMsg);
    }

    // 2. Solicitar permisos (opcional pero recomendado)
    // En Android 10+, `requestPermissions` es necesario para directorios públicos.
    // Para `Documents`, podría no ser estrictamente necesario en todas las versiones,
    // pero es una buena práctica.
    await Filesystem.requestPermissions();

    // 3. Generar la imagen
    const canvas = await generarComprobante();
    const base64Data = canvas.toDataURL('image/png').split(',')[1];

    // 4. Preparar y escribir el archivo
    const version = document.querySelector('input[name="version"]:checked').value;
    const filename = `nequi-${version}-${Date.now()}.png`;

    // Ahora 'Directory' está definido y 'Directory.Documents' funcionará.
    const result = await Filesystem.writeFile({
      path: filename,
      data: base64Data,
      directory: Directory.Documents, // Esta línea ya no dará error
      recursive: true // Buena práctica para asegurar que el directorio de destino exista
    
  });
    console.log('Archivo guardado, URI:', result.uri);
    alert(`Comprobante guardado en la carpeta de Documentos.\nRuta: ${result.uri}`);

  } catch (err) {
    console.error('Error en el proceso de guardado:', err);
    // Evita mostrar el mensaje genérico si ya mostramos el de "Error CRÍTICO"
    if (err.message && !err.message.includes('Error CRÍTICO')) {
      alert(`Error al guardar el archivo: ${err.message}`);
    }
  } finally {
    btnDownload.disabled = false;
  }

  });
});  