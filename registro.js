const urlParams = new URLSearchParams(window.location.search);
const sessionId = urlParams.get('id');
document.getElementById('id').value = sessionId;

document.getElementById('asistenciaForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const nombre = document.getElementById('nombre').value.trim();
  const puesto = document.getElementById('puesto').value.trim();
  const area = document.getElementById('area').value.trim();
  const firma = document.getElementById('firma').value.trim();

  if (!nombre || !puesto || !area || !firma) {
    alert("Por favor completa todos los campos.");
    return;
  }

  const formData = new URLSearchParams({
    accion: "registrarAsistente",
    id: sessionId,
    nombre,
    puesto,
    area,
    firma
  });

  await fetch("https://script.google.com/macros/s/AKfycbz79zURcTLHlaaZv5CJy_I8mRx-Hjle2ekNf3toH_qg-7ujVFuBxCVBUKLuSiyEEzlcVw/exec", {
    method: "POST",
    body: formData
  });

  alert("✅ ¡Asistencia registrada correctamente!");
  document.getElementById('asistenciaForm').reset();
});
