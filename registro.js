const urlParams = new URLSearchParams(window.location.search);
const sessionId = urlParams.get('id');
document.getElementById('id').value = sessionId;

document.getElementById('asistenciaForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const nombre = document.getElementById('nombre').value.trim();

  if (!nombre) {
    alert("Por favor escribe tu nombre.");
    return;
  }

  const formData = new URLSearchParams({
    accion: "registrarAsistente",
    id: sessionId,
    nombre
  });

  await fetch("https://script.google.com/macros/s/AKfycbyZ7cy1GJs1afq7pN8ufhsHagQ6Qz5HvzRVKQTFU63SBVb-x-9OyNW2O0N4OoyQlGev6A/exec", {
    method: "POST",
    body: formData
  });

  alert("✅ ¡Asistencia registrada correctamente!");
  document.getElementById('asistenciaForm').reset();
});
