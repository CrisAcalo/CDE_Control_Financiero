function validarCorreo(inputElement) {
  const correo = inputElement.value;

  // Expresión regular para validar el formato de correo electrónico
  const regexCorreo = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

  if (regexCorreo.test(correo)) {
    // El formato del correo es válido
    inputElement.classList.remove('is-invalid');
  } else {
    // El formato del correo no es válido
    inputElement.classList.add('is-invalid');
  }
}

function validarAlfabeticos(inputElement) {
  const valor = inputElement.value;

  // Permitir borrar y teclas de flechas
  if (/^[a-zA-Z\b]+$/.test(valor)) {
      inputElement.classList.remove('is-invalid');
  } else {
      inputElement.value = valor.replace(/[^a-zA-Z]/g, ''); // Eliminar caracteres no alfabéticos
      inputElement.classList.add('is-invalid');
  }
}

function validarTelefono(input) {
  let inputValue = input.value;
  console.log(inputValue);
  console.log(inputValue[0]);

  if (input.value == "") {
    input.classList.add("is-invalid");
  } else {
    input.classList.remove("is-invalid");
  }

  if (input.value[0] != 0 || input.value[1] != 9) {
    input.classList.add("is-invalid");
  } else {
    input.classList.remove("is-invalid");
  }

  if (input.value.length > 10) {
    input.classList.add("is-invalid");
  } else {
    input.classList.remove("is-invalid");
  }

  // Permitir borrar y teclas de flechas
  if (/^[0-9\b]+$/.test(input.value)) {
    // Validar la estructura del número de teléfono (iniciar con '09' y tener 10 dígitos)
    if (!/^09[0-9]{8}$/.test(input.value)) {
      input.classList.add("is-invalid");
    } else {
      input.classList.remove("is-invalid");
    }
  } else {
    document.getElementById("telefonoResponsable_C_N").value =
      inputValue.replace(/[^\d]/g, ""); // Eliminar caracteres no numéricos
  }
}

let prevValue = "";

function validarMontoInput(input, index) {
  const valor = input.value.replace(/[^0-9.]/g, "");

  const inputValue = input.value;
  const selectionStart = input.selectionStart;

  if (input.value <= 0) {
    input.classList.add("is-invalid");
    document.getElementById(`validacion_monto_3_${index}`).style =
      "display:block;";
  } else {
    input.classList.remove("is-invalid");
    document.getElementById(`validacion_monto_3_${index}`).style =
      "display:none;";
  }

  if (input.value == "") {
    input.classList.add("is-invalid");
    document.getElementById(`validacion_monto_1_${index}`).style =
      "display:block;";
  } else {
    input.classList.remove("is-invalid");
    document.getElementById(`validacion_monto_1_${index}`).style =
      "display:none;";
  }

  // Verificar si se eliminó un carácter
  if (inputValue.length < prevValue.length) {
    prevValue = inputValue;
    return;
  }

  // Verificar si se intenta ingresar más de dos decimales después del punto
  const decimalIndex = inputValue.indexOf(".");
  if (decimalIndex !== -1 && inputValue.substr(decimalIndex).length > 3) {
    input.value = prevValue;
    input.setSelectionRange(selectionStart, selectionStart);
    return;
  }

  // Permitir teclas numéricas, un único punto decimal, retroceso, suprimir y flechas de navegación
  if (
    !/^\d*(\.\d{0,2})?$/.test(inputValue) || // Caracteres no permitidos
    (inputValue === "." && prevValue !== "") || // Punto al principio
    (decimalIndex !== -1 && inputValue.substr(decimalIndex).length > 3) // Más de dos decimales después del punto
  ) {
    input.value = prevValue;
    input.setSelectionRange(selectionStart, selectionStart);
  }

  if (/^\d{1,100}(\.\d{0,2})?$/.test(valor)) {
    document.getElementById(`validacion_monto_2_${index}`).style =
      "display:none;";
    input.classList.remove("is-invalid");
  } else {
    document.getElementById(`validacion_monto_2_${index}`).style =
      "display:block;";
    input.classList.add("is-invalid");
  }

  prevValue = input.value;
}

function validateIngreso(input) {
  if (input.value == "") {
    input.classList.add("is-invalid");
  } else {
    input.classList.remove("is-invalid");
  }
}
