document.getElementById('eventoForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const btn = e.target.querySelector('button[type="submit"]');
  btn.disabled = true;
  btn.textContent = "Generando QR...";

  const datos = {
    tipo: document.getElementById('tipo').value,
    tema: document.getElementById('tema').value,
    subtemas: document.getElementById('subtemas').value,
    fecha: document.getElementById('fecha').value,
    hora: document.getElementById('hora').value,
    duracion: document.getElementById('duracion').value,
    facilitador: document.getElementById('facilitador').value,
    id: Date.now().toString(36)
  };

  const formData = new URLSearchParams({
    accion: "guardarEvento",
    ...datos
  });

  await fetch("https://script.google.com/macros/s/AKfycbx3DNI9EBJ6c7P27b4vFJDzL_emUsZkhV2yFheED94qR0AvDrJQbJD-c81rdiEtatNYuA/exec", {
    method: 'POST',
    body: formData
  });

  const qrUrl = `https://formsaa.github.io/Asistencias/asistencia.html?id=${datos.id}`;
  document.getElementById("codigoQR").style.display = "block";
  document.getElementById("urlTexto").textContent = qrUrl;
  QRCode.toCanvas(document.getElementById("qrCanvas"), qrUrl);

  document.getElementById("cerrarAsistencia").onclick = async () => {
    const foto1 = document.getElementById("foto1").files[0];
    const foto2 = document.getElementById("foto2").files[0];

    if (!foto1 || !foto2) {
      alert("Debes subir ambas fotos antes de cerrar la asistencia.");
      return;
    }

    if (!confirm("¿Deseas cerrar la asistencia y enviar el correo al supervisor?")) return;

    const formData = new FormData();
    formData.append("accion", "cerrar");
    formData.append("id", datos.id);
    formData.append("foto1", foto1);
    formData.append("foto2", foto2);

    await fetch("https://script.google.com/macros/s/AKfycbx3DNI9EBJ6c7P27b4vFJDzL_emUsZkhV2yFheED94qR0AvDrJQbJD-c81rdiEtatNYuA/exec", {
      method: "POST",
      body: formData
    });

    alert("✅ Asistencia cerrada y correo enviado.");
  };
});
