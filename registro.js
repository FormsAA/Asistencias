const urlParams = new URLSearchParams(window.location.search);
const sessionId = urlParams.get('id');
document.getElementById('id').value = sessionId;

const registrarBtn = document.getElementById('registrarBtn');
const limpiarFirmaBtn = document.getElementById('limpiarFirma');
const firmaCanvas = document.getElementById('firmaCanvas');
const firmaCtx = firmaCanvas.getContext('2d');
const firmaDataURLInput = document.getElementById('firmaDataURL');

let drawing = false;

firmaCanvas.addEventListener('mousedown', (e) => {
  drawing = true;
  firmaCtx.beginPath();
  firmaCtx.moveTo(e.offsetX, e.offsetY);
});

firmaCanvas.addEventListener('mousemove', (e) => {
  if (!drawing) return;
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

  if (!nombre || !area) {
    alert("Por favor completa todos los campos (Nombre Completo, Área / Departamento).");
    return;
  }

  // Obtener la Data URL de la firma
  const firmaDataURL = firmaCanvas.toDataURL();
  firmaDataURLInput.value = firmaDataURL;

  registrarBtn.disabled = true;
  registrarBtn.textContent = 'Registrando...';

  const formData = new URLSearchParams({
    accion: "registrarAsistente",
    id: sessionId,
    nombre: nombre,
    puesto: "N/A", // Se envía "N/A" para el campo puesto que ya no se recolecta
    area: area,
    firma: firmaDataURL // Enviar la Data URL
  });

  try {
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
      alert("❌ Ocurrió un error al registrar la asistencia: " + (data.error || 'Error desconocido'));
      console.error("Error:", data);
    }
    registrarBtn.disabled = false;
    registrarBtn.textContent = 'Registrar Asistencia';

  } catch (error) {
    alert("❌ Ocurrió un error al registrar la asistencia. Por favor, inténtalo de nuevo.");
    console.error("Error:", error);
    registrarBtn.disabled = false;
    registrarBtn.textContent = 'Registrar Asistencia';
  }
});
