class Persona {
  constructor(nombre, fechanac, telefono, email) {
    this.id = this.generarId();
    this.nombre = nombre;
    this.fechanac = fechanac;
    this.telefono = telefono;
    this.email = email;
  }

  // Método para generar un id aleatorio de 5 caracteres
  generarId() {
    const caracteres =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let id = "";
    for (let i = 0; i < 5; i++) {
      const randomIndex = Math.floor(Math.random() * caracteres.length);
      id += caracteres.charAt(randomIndex);
    }
    return id;
  }

  // Métodos get
  getId() {
    return this.id;
  }

  getNombre() {
    return this.nombre;
  }

  getFechanac() {
    return this.fechanac;
  }

  getTelefono() {
    return this.telefono;
  }

  getEmail() {
    return this.email;
  }

  // Métodos set
  setId(id) {
    this.id = id;
  }

  setNombre(nombre) {
    this.nombre = nombre;
  }

  setFechanac(fechanac) {
    this.fechanac = fechanac;
  }

  setTelefono(telefono) {
    this.telefono = telefono;
  }

  setEmail(email) {
    this.email = email;
  }
}

var actualDate = formatoFecha(new Date(Date.now()), "yy-mm-dd");
var tipoDatoAOperar = "";
document.addEventListener("DOMContentLoaded", function () {
  tipoDatoAOperar = document.getElementById("tipoDato").value;
  if (tipoDatoAOperar == "Ingresos" || tipoDatoAOperar == "Egresos") {
    selectCategoriasInput = document.querySelector("#categoriaIngresoC_N");
    let categorias =
      JSON.parse(localStorage.getItem(`Categorias${tipoDatoAOperar}`)) || [];

    categorias.forEach(function (datoCategoria, index) {
      selectCategoriasInput.innerHTML += `
      <option value="${datoCategoria.nombre}">${datoCategoria.nombre}</option>
    `;
    });

    selectCategoriasInput = document.querySelector("#responsableIngresoC_N");
    let responsables = JSON.parse(localStorage.getItem(`Responsables`)) || [];

    responsables.forEach(function (datoResponsable, index) {
      selectCategoriasInput.innerHTML += `
      <option value="${datoResponsable.nombre}">${datoResponsable.nombre}</option>
    `;
    });

    mostrarIngresos();
  } else if (tipoDatoAOperar == "Categorias") {
    mostrarCategorias("Ingresos");
    mostrarCategorias("Egresos");
  } else if (tipoDatoAOperar == "Responsables") {
    mostrarResponsable();
  }

  document.querySelector("#fechaIngresoC_N").setAttribute("max", actualDate);
});

function formatoFecha(fecha, formato) {
  const map = {
    dd: fecha.getDate().toString().padStart(2, "0"),
    mm: (fecha.getMonth() + 1).toString().padStart(2, "0"),
    yy: fecha.getFullYear().toString(),
    yyyy: fecha.getFullYear(),
  };

  return formato.replace(/dd|mm|yy|yyy/gi, (matched) => map[matched]);
}

function guardarIngreso(data) {
  // Obtener datos existentes del almacenamiento local
  let datosGuardados = JSON.parse(localStorage.getItem(tipoDatoAOperar)) || [];

  // Agregar nuevos datos
  datosGuardados.push({
    fecha: data.fecha,
    descripcion: data.descripcion,
    monto: data.monto,
    categoria: data.categoria,
    responsable: data.responsable,
  });

  // Guardar en el almacenamiento local
  localStorage.setItem(tipoDatoAOperar, JSON.stringify(datosGuardados));

  // Mostrar datos
  //mostrarIngresos();
}

function mostrarIngresos() {
  var datosGuardados = JSON.parse(localStorage.getItem(tipoDatoAOperar)) || [];

  let categoriasGuardadas =
    JSON.parse(localStorage.getItem(`Categorias${tipoDatoAOperar}`)) || [];
  let responsablesGuardados =
    JSON.parse(localStorage.getItem(`Responsables`)) || [];

  var mostrarDatosBodyTable = document.getElementById("mostrarDatos");

  mostrarDatosBodyTable.innerHTML = "";

  datosGuardados.forEach(function (dato, index) {
    let CategoriasOptions = "";
    let ResponsablesOptions = "";
    let categoriaActual = dato.categoria;
    let responsableActual = dato.responsable;

    categoriasGuardadas.forEach(function (datoCategoria, index) {
      if (datoCategoria.nombre == categoriaActual) {
        CategoriasOptions += `
        <option selected value="${datoCategoria.nombre}">${datoCategoria.nombre}</option>
      `;
      } else {
        CategoriasOptions += `
      <option value="${datoCategoria.nombre}">${datoCategoria.nombre}</option>
    `;
      }
    });

    responsablesGuardados.forEach(function (datoResponsable, index) {
      if (datoResponsable.nombre == responsableActual) {
        ResponsablesOptions += `
        <option selected value="${datoResponsable.nombre}">${datoResponsable.nombre}</option>
      `;
      } else {
        ResponsablesOptions += `
      <option value="${datoResponsable.nombre}">${datoResponsable.nombre}</option>
    `;
      }
    });

    mostrarDatosBodyTable.innerHTML += `
        <tr>
            <td>${dato.fecha}</td>
            <td>${dato.descripcion}</td>
            <td>${dato.categoria}</td>
            <td>${dato.responsable}</td>
            <td>$ ${dato.monto}</td>
            <td>
                <button class="btn btn-primary me-2" data-bs-toggle="modal" data-bs-target="#ingresoModalEdit${index}">Editar</button>
                <button class="btn btn-danger" onclick="eliminarIngreso(${index})">Eliminar</button>
            </td>
        </tr>
      <div
      class="modal fade"
      id="ingresoModalEdit${index}"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      tabindex="-1"
      aria-labelledby="staticBackdropLabel"
      aria-hidden="true"
      >
        <div class="modal-dialog" style="background:#ffffff00">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5" id="staticBackdropLabel">
                Editar Ingreso
              </h1>

              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <form action="" onsubmit="event.preventDefault()" id="formUpdate_${index}">
              <div class="modal-body">
                <div class="input-group mb-3">
                  <label class="input-group-text" for="fechaIngresoU_${index}"
                    >Fecha*</label
                  >
                  <input
                    id="fechaIngresoU_${index}"
                    name="fechaIngresoU_${index}"
                    aria-describedby="fechaIngresoU_${index}"
                    type="date"
                    class="form-control campoFecha"
                    oninput="validateIngreso(this)"
                    value="${dato.fecha}"
                    max="${actualDate}"
                    required
                  />
                  <div class="invalid-feedback">Este campo es obligatorio</div>
                </div>

                <div class="input-group mb-3">
                  <label class="input-group-text" for="descripcionIngresoU_${index}"
                    >Descripción</label
                  >
                  <input
                    id="descripcionIngresoU_${index}"
                    name="descripcionIngresoU_${index}"
                    aria-describedby="descripcionIngresoU_${index}"
                    type="text"
                    class="form-control"
                    value="${dato.descripcion}"
                    placeholder="Sueldo de horas extra"
                  />
                </div>

                <div class="input-group mb-3">
                  <label class="input-group-text" for="montoIngresoU_${index}">$</label>
                  <input
                    id="montoIngresoU_${index}"
                    name="montoIngresoU_${index}"
                    aria-describedby="montoIngresoU_${index}"
                    type="text"
                    class="form-control"
                    placeholder="3250.22"
                    title="ingrese un formato válido. Ej: 3240.22"
                    oninput="validateIngreso(this);validarMontoInput(this,${index})"
                    value="${dato.monto}"
                    required
                  />
                  <label class="input-group-text" for="montoIngresoU_${index}"
                    >Monto*</label
                  >

                  <div class="alerts_monto_container">
                    <div class="text-danger" id="validacion_monto_1_${index}">
                      Este campo es obligatorio.
                    </div>
                    <div class="text-danger" id="validacion_monto_2_${index}">
                      Use el formato adecuado (00000.00).
                    </div>
                    <div class="text-danger" id="validacion_monto_3_${index}">
                      Debe ser un valor mayor que 0
                    </div>
                  </div>
                  
                </div>

                <div class="input-group mb-3">
                  <label class="input-group-text" for="categoriaIngresoU_${index}"
                    >Categoría*</label
                  >
                  <select
                    class="form-select"
                    id="categoriaIngresoU_${index}"
                    name="categoriaIngresoU_${index}"
                    oninput="validateIngreso(this)"
                    required
                  >
                    <option value="" selected>-- Elegir --</option>
                    
                    ${CategoriasOptions}
                    
                  </select>
                  <div class="invalid-feedback">Este campo es obligatorio</div>
                </div>
                
                <div class="input-group mb-3">
                  <label class="input-group-text" for="responsableIngresoU_${index}"
                    >Responsable*</label
                  >
                  <select
                    class="form-select"
                    id="responsableIngresoU_${index}"
                    name="responsableIngresoU_${index}"
                    oninput="validateIngreso(this)"
                    required
                  >
                    <option value="" selected>-- Elegir --</option>
                    ${ResponsablesOptions}
                  </select>
                  <div class="invalid-feedback">Este campo es obligatorio</div>
                </div>

                <div class="input-group mb-3">
                  <input type="hidden" id="form_invalidU_${index}" class="form-control" />
                  <div class="invalid-feedback">Hay campos obligatorios sin llenar</div>
                </div>
              </div>

              <div class="modal-footer">
                <button
                  type="button"
                  class="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  class="btn btn-primary"
                  onclick="validateCamposIngreso('update', ${index});"
                >
                  Agregar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

        `;
  });
}

function editarIngreso(newData, index) {
  var datosGuardados = JSON.parse(localStorage.getItem(tipoDatoAOperar)) || [];

  // Actualizar datos en la posición 'index'
  datosGuardados[index].fecha = newData.fecha;
  datosGuardados[index].descripcion = newData.descripcion;
  datosGuardados[index].monto = newData.monto;
  datosGuardados[index].categoria = newData.categoria;
  datosGuardados[index].responsable = newData.responsable;

  // Guardar en el almacenamiento local
  localStorage.setItem(tipoDatoAOperar, JSON.stringify(datosGuardados));

  // Mostrar datos actualizados
  mostrarIngresos();
}

function eliminarIngreso(index) {
  var datosGuardados = JSON.parse(localStorage.getItem(tipoDatoAOperar)) || [];
  datosGuardados.splice(index, 1);
  localStorage.setItem(tipoDatoAOperar, JSON.stringify(datosGuardados));

  mostrarIngresos();
}

function validateCamposIngreso(operation, index) {
  let idOperation = "";
  if (operation == "create") {
    idOperation = "C";
    var errorMessage = document.querySelector(
      `#form_invalid${idOperation}_${index}`
    );
  } else if (operation == "update") {
    idOperation = "U";
    var errorMessage = document.querySelector(
      `#form_invalid${idOperation}_${index}`
    );
  }
  const fechaIngreso = document.querySelector(
    `#fechaIngreso${idOperation}_${index}`
  );
  const montoIngreso = document.querySelector(
    `#montoIngreso${idOperation}_${index}`
  );
  const descripcionIngreso = document.querySelector(
    `#descripcionIngreso${idOperation}_${index}`
  );
  const categoriaIngreso = document.querySelector(
    `#categoriaIngreso${idOperation}_${index}`
  );
  const responsableIngreso = document.querySelector(
    `#responsableIngreso${idOperation}_${index}`
  );

  if (responsableIngreso.value == "" || responsableIngreso.value == null) {
    responsableIngreso.classList.add("is-invalid");
    responsableIngreso.focus();
  }

  if (categoriaIngreso.value == "" || categoriaIngreso.value == null) {
    categoriaIngreso.classList.add("is-invalid");
    categoriaIngreso.focus();
  }

  if (montoIngreso.value <= 0) {
    montoIngreso.focus();
    montoIngreso.classList.add("is-invalid");
    document.getElementById(`validacion_monto_3_${index}`).style =
      "display:block;";
  } else {
    montoIngreso.classList.remove("is-invalid");
    document.getElementById(`validacion_monto_3_${index}`).style =
      "display:none;";
  }

  if (montoIngreso.value == "") {
    montoIngreso.focus();
    montoIngreso.classList.add("is-invalid");
    document.getElementById(`validacion_monto_1_${index}`).style =
      "display:block;";
  } else {
    montoIngreso.classList.remove("is-invalid");
    document.getElementById(`validacion_monto_1_${index}`).style =
      "display:none;";
  }

  if (fechaIngreso.value == "" || fechaIngreso.value == null) {
    fechaIngreso.classList.add("is-invalid");
    fechaIngreso.focus();
  }

  const data = {
    fecha: fechaIngreso.value,
    monto: montoIngreso.value,
    descripcion: descripcionIngreso.value,
    categoria: categoriaIngreso.value,
    responsable: responsableIngreso.value,
  };

  if (
    fechaIngreso.value == "" ||
    montoIngreso.value == "" ||
    categoriaIngreso.value == "" ||
    responsableIngreso.value == "" ||
    montoIngreso.value <= 0
  ) {
    errorMessage.classList.add("is-invalid");
  } else {
    errorMessage.classList.remove("is-invalid");
    if (operation == "create") {
      guardarIngreso(data);

      // Cerrar el modal
      //const ingresoModal = new bootstrap.Modal(document.getElementById('ingresoModal'),null);
      //ingresoModal.hide();

      // Restablecer el formulario (si es necesario)
      document.getElementById(`formIngreso`).reset();
      window.location.reload();
    } else if (operation == "update") {
      editarIngreso(data, index);
      document.getElementById(`formUpdate_${index}`).reset();

      window.location.reload();
    }
  }
}

function validarCategoria(operation, tipoCategoria, index, prevValue) {
  let nombre = document.querySelector(
    `#nombreCategoria_${operation}_${tipoCategoria}_${index}`
  );

  if (nombre.value == "") {
    nombre.classList.add("is-invalid");
  } else {
    nombre.classList.remove("is-invalid");
    // Obtener datos existentes del almacenamiento local
    if (operation == "C") {
      let datosGuardados =
        JSON.parse(
          localStorage.getItem(`${tipoDatoAOperar}${tipoCategoria}`)
        ) || [];

      // Agregar nuevos datos
      datosGuardados.push({
        nombre: nombre.value,
      });

      // Guardar en el almacenamiento local
      localStorage.setItem(
        `${tipoDatoAOperar}${tipoCategoria}`,
        JSON.stringify(datosGuardados)
      );
      nombre.value = "";
    } else if (operation == "U") {
      updateCategoria(index, nombre, tipoCategoria, prevValue);
    }

    // Mostrar datos
    mostrarCategorias(tipoCategoria);
  }
}

function updateCategoria(index, nombre, tipoCategoria, prevValue) {
  let categoriasGuardados =
    JSON.parse(localStorage.getItem(`${tipoDatoAOperar}${tipoCategoria}`)) ||
    [];

  var datosGuardados = JSON.parse(localStorage.getItem(tipoCategoria)) || [];

  datosGuardados.forEach(function (dato, index) {
    if (dato.categoria == prevValue) {
      dato.categoria = nombre.value;
    }
  });

  // Guardar Datos de Ingresos/Egresos en el almacenamiento local
  localStorage.setItem(tipoCategoria, JSON.stringify(datosGuardados));

  // Actualizar datos en la posición 'index'
  categoriasGuardados[index].nombre = nombre.value;

  // Guardar Categorias en el almacenamiento local
  localStorage.setItem(
    `${tipoDatoAOperar}${tipoCategoria}`,
    JSON.stringify(categoriasGuardados)
  );
  window.location.reload();
}

function eliminarCategoria(tipoCategoria, index) {
  var datosGuardados =
    JSON.parse(localStorage.getItem(`${tipoDatoAOperar}${tipoCategoria}`)) ||
    [];
  datosGuardados.splice(index, 1);
  localStorage.setItem(
    `${tipoDatoAOperar}${tipoCategoria}`,
    JSON.stringify(datosGuardados)
  );

  mostrarCategorias(tipoCategoria);
}

function mostrarCategorias(tipoCategoria) {
  var datosGuardados =
    JSON.parse(localStorage.getItem(`${tipoDatoAOperar}${tipoCategoria}`)) ||
    [];

  var mostrarDatosBodyTable = document.querySelector(
    `#mostrarCategorias${tipoCategoria}`
  );

  mostrarDatosBodyTable.innerHTML = "";

  datosGuardados.forEach(function (dato, index) {
    mostrarDatosBodyTable.innerHTML += `
      <div class="d-flex justify-content-between categoria_element">
        <span>${dato.nombre}</span>

        <div>
          <button class="btn btn-sm btn-success me-2" data-bs-toggle="modal" data-bs-target="#categoria${tipoCategoria}ModalEdit${index}"><i class="bi bi-pencil-square"></i></button>
          <button class="btn btn-sm btn-danger" onclick="eliminarCategoria('${tipoCategoria}',${index})"><i class="bi bi-trash3-fill"></i></button>
        </div>
      </div>


      <div
      class="modal fade"
      id="categoria${tipoCategoria}ModalEdit${index}"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      tabindex="-1"
      aria-labelledby="staticBackdropLabel"
      aria-hidden="true"
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5" id="staticBackdropLabel">
                Editar Categoría
              </h1>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <form action="" onsubmit="event.preventDefault()" id="formUpdateCategoria${tipoCategoria}_${index}">
              <div class="modal-body">
                
                <div class="input-group mb-3">
                  <label class="input-group-text" for="nombreCategoria_U_${tipoCategoria}_${index}">Nombre</label>
                  <input
                    id="nombreCategoria_U_${tipoCategoria}_${index}"
                    name="nombreCategoria_U_${tipoCategoria}_${index}"
                    aria-describedby="nombreCategoria_U_${tipoCategoria}_${index}"
                    type="text"
                    class="form-control"
                    placeholder="Nombre de la Categoría"
                    title="ingrese un formato válido. Ej: Educación"
                    oninput="validateIngreso(this);"
                    value="${dato.nombre}"
                    required
                  />
                </div>

                <div class="input-group mb-3">
                  <input type="hidden" id="form_invalidU_${index}" class="form-control" />
                  <div class="invalid-feedback">Hay campos obligatorios sin llenar</div>
                </div>
              </div>

              <div class="modal-footer">
                <button
                  type="button"
                  class="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  class="btn btn-primary"
                  onclick="validarCategoria('U', ${index},'${dato.nombre}');"
                  >Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

        `;
  });
}

function validarResponsable(operation, index, prevValue) {
  const regexCorreo =
    /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;

  let nombre = document.querySelector(
    `#nombreResponsable_${operation}_${index}`
  );
  let fechaNacimiento = document.querySelector(
    `#fechaNacResponsable_${operation}_${index}`
  );
  let email = document.querySelector(`#emailResponsable_${operation}_${index}`);
  let telefono = document.querySelector(
    `#telefonoResponsable_${operation}_${index}`
  );
  let invalidForm = document.querySelector(`#invalidForm`);

  if (telefono.value == "" || telefono.value.length > 10) {
    telefono.classList.add("is-invalid");
    telefono.focus();
  } else {
    telefono.classList.remove("is-invalid");
  }

  if (email.value == "" || !regexCorreo.test(email.value)) {
    email.classList.add("is-invalid");
    email.focus();
  } else {
    email.classList.remove("is-invalid");
  }

  if (fechaNacimiento.value == "") {
    fechaNacimiento.classList.add("is-invalid");
    fechaNacimiento.focus();
  } else {
    fechaNacimiento.classList.remove("is-invalid");
  }

  if (nombre.value == "") {
    nombre.classList.add("is-invalid");
    nombre.focus();
  } else {
    nombre.classList.remove("is-invalid");
  }

  if (
    nombre.value == "" ||
    fechaNacimiento.value == "" ||
    email.value == "" ||
    !regexCorreo.test(email.value) ||
    telefono.value == "" ||
    telefono.value.length > 10
  ) {
    invalidForm.classList.add("is-invalid");
  } else {
    invalidForm.classList.remove("is-invalid");

    let newPersona = new Persona(
      nombre.value,
      fechaNacimiento.value,
      telefono.value,
      email.value
    );

    nombre.classList.remove("is-invalid");
    // Obtener datos existentes del almacenamiento local
    if (operation == "C") {
      let datosGuardados =
        JSON.parse(localStorage.getItem(`${tipoDatoAOperar}`)) || [];

      // Agregar nuevos datos
      datosGuardados.push(newPersona);

      // Guardar en el almacenamiento local
      localStorage.setItem(
        `${tipoDatoAOperar}`,
        JSON.stringify(datosGuardados)
      );
      nombre.value = "";
      fechaNacimiento.value = "";
      email.value = "";
      telefono.value = "";
    } else if (operation = "U") {
      updateResponsable(index, newPersona, prevValue);
    }

    // Mostrar datos
    mostrarResponsable();
  }
}

function updateResponsable(index, nombre, prevValue) {
  let responsablesGuardados =
    JSON.parse(localStorage.getItem(`${tipoDatoAOperar}`)) || [];

  var datosIngresos = JSON.parse(localStorage.getItem("Ingresos")) || [];
  var datosEgresos = JSON.parse(localStorage.getItem("Egresos")) || [];

  datosIngresos.forEach(function (dato, index) {
    if (dato.responsable == prevValue) {
      dato.responsable = nombre.value;
    }
  });

  datosEgresos.forEach(function (dato, index) {
    if (dato.responsable == prevValue) {
      dato.responsable = nombre.value;
    }
  });

  // Guardar Datos de Ingresos/Egresos en el almacenamiento local
  localStorage.setItem("Ingresos", JSON.stringify(datosIngresos));
  localStorage.setItem("Egresos", JSON.stringify(datosEgresos));

  // Actualizar datos en la posición 'index'
  responsablesGuardados[index].nombre = nombre.value;

  // Guardar Responsables en el almacenamiento local
  localStorage.setItem(
    `${tipoDatoAOperar}`,
    JSON.stringify(responsablesGuardados)
  );
  window.location.reload();
}

function eliminarResponsable(index) {
  var datosGuardados =
    JSON.parse(localStorage.getItem(`${tipoDatoAOperar}`)) || [];
  datosGuardados.splice(index, 1);
  localStorage.setItem(`${tipoDatoAOperar}`, JSON.stringify(datosGuardados));

  mostrarResponsable();
}

function mostrarResponsable() {
  var datosGuardados =
    JSON.parse(localStorage.getItem(`${tipoDatoAOperar}`)) || [];

  var mostrarDatosBodyTable = document.querySelector(`#mostrarResponsables`);

  mostrarDatosBodyTable.innerHTML = "";

  datosGuardados.forEach(function (dato, index) {
    mostrarDatosBodyTable.innerHTML += `
    <tr>
        <td>${dato.id}</td>
        <td>${dato.nombre}</td>
        <td>${dato.fechanac}</td>
        <td>${dato.telefono}</td>
        <td>$ ${dato.email}</td>
        <td>
        <!--<button class="btn btn-sm btn-success me-2" data-bs-toggle="modal" data-bs-target="#responsableModalEdit${index}"><i class="bi bi-pencil-square"></i></button>-->
          <button class="btn btn-sm btn-danger" onclick="eliminarResponsable(${index})"><i class="bi bi-trash3-fill"></i></button>
        </td>
    </tr>  

      <div
      class="modal fade"
      id="responsableModalEdit${index}"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      tabindex="-1"
      aria-labelledby="staticBackdropLabel"
      aria-hidden="true"
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5" id="staticBackdropLabel">
                Editar Responsable
              </h1>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <form action="" onsubmit="event.preventDefault()" id="formUpdateResponsable_${index}">
              <div class="modal-body">
                
                <div class="input-group mb-3">
                  <label class="input-group-text" for="nombreResponsable_U_${index}">Nombre</label>
                  <input
                    id="nombreResponsable_U_${index}"
                    name="nombreResponsable_U_${index}"
                    aria-describedby="nombreResponsable_U_${index}"
                    type="text"
                    class="form-control"
                    placeholder="Nombre de la Categoría"
                    title="Ingrese el nuevo nombre del responsable"
                    oninput="validateIngreso(this);"
                    value="${dato.nombre}"
                    required
                  />
                </div>

                <div class="input-group mb-3">
                  <input type="hidden" id="form_invalidU_${index}" class="form-control" />
                  <div class="invalid-feedback">Hay campos obligatorios sin llenar</div>
                </div>
              </div>

              <div class="modal-footer">
                <button
                  type="button"
                  class="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  class="btn btn-primary"
                  onclick="validarResponsable('U', ${index},'${dato.nombre}');"
                  >Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

        `;
  });
}
