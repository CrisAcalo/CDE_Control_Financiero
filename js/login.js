function validateForm() {
  var username = document.getElementById("username").value;
  var password = document.getElementById("password").value;
  var errorMessageElement = document.getElementById("errorMessage");

  if (username === "" || password === "") {
    errorMessageElement.innerText = "Por favor, complete ambos campos.";
    return false;
  }

  // Validar las credenciales
  if (username === "admin" && password === "admin") {
    // Credenciales correctas, redirigir a otra página
    window.location.href = "./html/slider.html";
  } else {
    // Credenciales incorrectas, mostrar mensaje de error
    errorMessageElement.innerText =
      "Credenciales incorrectas. Por favor, inténtelo de nuevo.";
  }

  return false;
}

function validarAlfabeticos(inputElement) {
  const valor = inputElement.value;

  // Permitir borrar y teclas de flechas
  if (!/^[a-zA-Z\b]+$/.test(valor)) {
    inputElement.value = valor.replace(/[^a-zA-Z]/g, "");
  }
}
