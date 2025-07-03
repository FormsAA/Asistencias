const urlParams = new URLSearchParams(window.location.search);
const sessionId = urlParams.get('id');
document.getElementById('id').value = sessionId;

const registrarBtn = document.getElementById('registrarBtn');
// Variables y lógica para el canvas de firma se han eliminado

document.getElementById('asistenciaForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const nombre = document.getElementById('nombre').value.trim();
  const area = document.getElementById('area').value.trim();
  const firma = document.getElementById('firma').value.trim(); // Se obtiene la firma como texto

  if (!nombre || !area || !firma) {
    alert("Por favor completa los campos 'Nombre Completo', 'Área / Departamento' y 'Firma'.");
    return;
  }

  registrarBtn.disabled = true;
  registrarBtn.textContent = 'Registrando...';

  const formData = new URLSearchParams({
    accion: "registrarAsistente",
    id: sessionId,
    nombre: nombre,
    puesto: "N/A", // Se mantiene "N/A" por si el Apps Script aún lo espera, pero ya no se recolecta del formulario.
    area: area,
    firma: firma // Enviar la firma como texto
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
      // Ya no se limpia el canvas
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
