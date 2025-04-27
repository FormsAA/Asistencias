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

  await fetch("https://script.google.com/macros/s/AKfycbx3DNI9EBJ6c7P27b4vFJDzL_emUsZkhV2yFheED94qR0AvDrJQbJD-c81rdiEtatNYuA/exec", {
    method: "POST",
    body: formData
  });

  alert("✅ ¡Asistencia registrada correctamente!");
  document.getElementById('asistenciaForm').reset();
});
