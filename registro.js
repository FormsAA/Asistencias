const urlParams = new URLSearchParams(window.location.search);
const sessionId = urlParams.get('id');
document.getElementById('id').value = sessionId;

const registrarBtn = document.getElementById('registrarBtn');
const limpiarFirmaBtn = document.getElementById('limpiarFirma');
const firmaCanvas = document.getElementById('firmaCanvas');
const firmaCtx = firmaCanvas.getContext('2d');
const firmaDataURLInput = document.getElementById('firmaDataURL');

// Configuración inicial del contexto del canvas para la firma
firmaCtx.lineWidth = 2; // Grosor de la línea
firmaCtx.lineCap = 'round'; // Borde redondeado
firmaCtx.strokeStyle = 'black'; // Color de la línea (negro)

let drawing = false;

firmaCanvas.addEventListener('mousedown', (e) => {
  drawing = true;
  firmaCtx.beginPath();
  // Ajustar la posición inicial del dibujo al inicio del trazo del ratón
  firmaCtx.moveTo(e.offsetX, e.offsetY);
});

firmaCanvas.addEventListener('mousemove', (e) => {
  if (!drawing) return;
  // Dibujar una línea desde la posición anterior hasta la actual
  firmaCtx.lineTo(e.offsetX, e.offsetY);
  firmaCtx.stroke();
});

firmaCanvas.addEventListener('mouseup', () => {
  drawing = false;
});

firmaCanvas.addEventListener('mouseout', () => {
  drawing = false;
});

limpiarFirmaBtn.addEventListener('click', () => {
  firmaCtx.clearRect(0, 0, firmaCanvas.width, firmaCanvas.height);
  firmaDataURLInput.value = ''; // Limpiar el Data URL también
});

document.getElementById('asistenciaForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const nombre = document.getElementById('nombre').value.trim();
  const area = document.getElementById('area').value.trim();

  // Validar que se haya dibujado algo en el canvas
  const isCanvasBlank = !(firmaCtx.getImageData(0, 0, firmaCanvas.width, firmaCanvas.height).data.some(channel => channel !== 0));

  if (!nombre || !area) {
    alert("Por favor completa los campos 'Nombre Completo' y 'Área / Departamento'.");
    return;
  }
  if (isCanvasBlank) {
    alert("Por favor, dibuja tu firma en el campo de firma.");
    return;
  }

  // Obtener la Data URL de la firma
  const firmaDataURL = firmaCanvas.toDataURL('image/png'); // Asegúrate de que sea PNG
  firmaDataURLInput.value = firmaDataURL;

  registrarBtn.disabled = true;
  registrarBtn.textContent = 'Registrando...';

  const formData = new URLSearchParams({
    accion: "registrarAsistente",
    id: sessionId,
    nombre: nombre,
    puesto: "N/A", // Se mantiene "N/A" por si el Apps Script aún espera esta columna
    area: area,
    firma: firmaDataURL // Enviar la Data URL
  });

  try {
    // Es crucial que esta URL sea la de TU Web App de Google Apps Script
    const response = await fetch("https://script.google.com/macros/s/AKfycbz79zURcTLHlaaZv5CJy_I8mRx-Hjle2ekNf3toH_qg-7ujVFuBxCVBUKLuSiyEEzlcVw/exec", {
      method: "POST",
      body: formData
    });
    const data = await response.json();

    if (data.result === "success") {
      alert("✅ ¡Asistencia registrada correctamente!");
      document.getElementById('asistenciaForm').reset();
      firmaCtx.clearRect(0, 0, firmaCanvas.width, firmaCanvas.height); // Limpiar el canvas después de éxito
      firmaDataURLInput.value = '';
    } else {
      alert("❌ Ocurrió un error al registrar la asistencia: " + (data.error || 'Error desconocido. Revisa la consola para más detalles.'));
      console.error("Error del servidor (Apps Script):", data);
    }
    registrarBtn.disabled = false;
    registrarBtn.textContent = 'Registrar Asistencia';

  } catch (error) {
    alert("❌ Ocurrió un error de red al registrar la asistencia. Por favor, inténtalo de nuevo.");
    console.error("Error de red/fetch:", error);
    registrarBtn.disabled = false;
    registrarBtn.textContent = 'Registrar Asistencia';
  }
});
