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
