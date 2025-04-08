// Leer el parámetro ID desde la URL
const urlParams = new URLSearchParams(window.location.search);
const sessionId = urlParams.get('id');

if (sessionId && localStorage.getItem(sessionId)) {
  const data = JSON.parse(localStorage.getItem(sessionId));

  document.getElementById('tipo').textContent = data.tipo;
  document.getElementById('tema').textContent = data.tema;
  document.getElementById('subtemas').textContent = data.subtemas;
  document.getElementById('fecha').textContent = data.fecha;
  document.getElementById('hora').textContent = data.hora;
  document.getElementById('duracion').textContent = data.duracion;
  document.getElementById('facilitador').textContent = data.facilitador;
} else {
  alert("Datos del evento no encontrados.");
}

// Generar filas para asistencia
const tabla = document.getElementById('tablaAsistencia');
for (let i = 1; i <= 15; i++) {
  const row = document.createElement('tr');
  row.innerHTML = `
    <td data-label="#">${i}</td>
    <td data-label="Nombre"><input type="text" placeholder="Nombre completo" /></td>
    <td data-label="Puesto"><input type="text" /></td>
    <td data-label="Área / Departamento"><input type="text" /></td>
    <td data-label="Firma"><input type="text" /></td>
  `;
  tabla.appendChild(row);
}