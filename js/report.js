document.addEventListener("DOMContentLoaded", function () {
  let actualDate = formatoFecha(new Date(Date.now()), "yy-mm-dd");
  document.getElementById(
    "fechaDeGeneracion"
  ).innerHTML = `Fecha de generación: ${actualDate}`;

  selectCategoriasInput = document.querySelector("#categoriaIngresosReporte");
  let categorias = JSON.parse(localStorage.getItem(`CategoriasIngresos`)) || [];

  categorias.forEach(function (datoCategoria, index) {
    selectCategoriasInput.innerHTML += `
      <option value="${datoCategoria.nombre}">${datoCategoria.nombre}</option>
    `;
  });

  selectCategoriasInput = document.querySelector("#categoriaEgresosReporte");
  categorias = JSON.parse(localStorage.getItem(`CategoriasEgresos`)) || [];

  categorias.forEach(function (datoCategoria, index) {
    selectCategoriasInput.innerHTML += `
      <option value="${datoCategoria.nombre}">${datoCategoria.nombre}</option>
    `;
  });

  selectCategoriasInput = document.querySelector("#responsableReporte");
  let responsables = JSON.parse(localStorage.getItem(`Responsables`)) || [];

  responsables.forEach(function (datoResponsable, index) {
    selectCategoriasInput.innerHTML += `
      <option value="${datoResponsable.nombre}">${datoResponsable.nombre}</option>
    `;
  });
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

function calcularTotal(dataIngresos, dataEgresos) {
  const totalIngresos = calcularSumaTotal(dataIngresos);
  const totalEgresos = calcularSumaTotal(dataEgresos);
  const total = totalIngresos - totalEgresos;

  document.getElementById('valorTotalIngreso').innerHTML=`$ ${totalIngresos}`;
  document.getElementById('valorTotalEgreso').innerHTML=`$ ${totalEgresos}`;
  document.getElementById('valorSaldoTotal').innerHTML=`$ ${total}`;
}

function calcularSumaTotal(data) {
  return data.reduce((total, dato) => total + parseFloat(dato.monto), 0);
}

function validateRequest() {
  document.getElementById("report_container").style = "display:block";
  const categoriaIngreso = document.querySelector(
    "#categoriaIngresosReporte"
  ).value;
  const categoriaEgreso = document.querySelector(
    "#categoriaEgresosReporte"
  ).value;
  const responsable = document.querySelector("#responsableReporte").value;

  let foundedIngresosData = [];
  let foundedEgresosData = [];

  const dataIngresos = JSON.parse(localStorage.getItem("Ingresos")) || [];
  const dataEgresos = JSON.parse(localStorage.getItem("Egresos")) || [];

  if (responsable === "Todas") {
    foundedIngresosData = filterDataByCategory(dataIngresos, categoriaIngreso);
    foundedEgresosData = filterDataByCategory(dataEgresos, categoriaEgreso);
  } else {
    foundedIngresosData = filterDataByCategoryAndResponsable(
      dataIngresos,
      categoriaIngreso,
      responsable
    );
    foundedEgresosData = filterDataByCategoryAndResponsable(
      dataEgresos,
      categoriaEgreso,
      responsable
    );
  }
  console.log(foundedIngresosData);
  console.log(foundedEgresosData);
  mostrarDatosReporte(foundedIngresosData, foundedEgresosData);
  generateBarPlot(foundedIngresosData, foundedEgresosData);
  generateTendenciaSaldoChart(foundedIngresosData, foundedEgresosData);
  generateLineGraph(foundedIngresosData, foundedEgresosData);
  calcularTotal(dataIngresos, dataEgresos);
}

function mostrarDatosReporte(dataIngresos, dataEgresos) {
  var mostrarDatosBodyTable = document.querySelector(`#mostratDatosReporte`);

  mostrarDatosBodyTable.innerHTML = "";

  dataIngresos.forEach(function (dato, index) {
    mostrarDatosBodyTable.innerHTML += `
    <tr>
        <td>${dato.fecha}</td>
        <td>Ingreso</td>
        <td>${dato.descripcion}</td>
        <td>${dato.categoria}</td>
        <td>${dato.responsable}</td>
        <td>$ ${dato.monto}</td>
    </tr>
    `;
  });
  dataEgresos.forEach(function (dato, index) {
    mostrarDatosBodyTable.innerHTML += `
    <tr>
        <td>${dato.fecha}</td>
        <td>Egreso</td>
        <td>${dato.descripcion}</td>
        <td>${dato.categoria}</td>
        <td>${dato.responsable}</td>
        <td>$ ${dato.monto}</td>
    </tr>
    `;
  });

  mostrarDatosBodyTable.innerHTML += `
    <tr>
        <th colspan=3>Total Ingreso</th>
        <th colspan=3 id="valorTotalIngreso"></th>
    </tr>
    <tr>
        <th colspan=3>Total Egreso</th>
        <th colspan=3 id="valorTotalEgreso"></th>
    </tr>
    <tr>
        <th colspan=3>Saldo Total</th>
        <th colspan=3 id="valorSaldoTotal"></th>
    </tr>
  `;
}

function filterDataByCategory(data, categoria) {
  return categoria === "Todas"
    ? data
    : data.filter((dato) => dato.categoria == categoria);
}

function filterDataByCategoryAndResponsable(data, categoria, responsable) {
  return categoria === "Todas"
    ? data.filter((dato) => dato.responsable === responsable)
    : data.filter(
        (dato) =>
          dato.categoria === categoria && dato.responsable === responsable
      );
}

function validateIngreso(input) {
  if (input.value == "") {
    input.classList.add("is-invalid");
  } else {
    input.classList.remove("is-invalid");
  }
}
// Función para obtener el formato YYYY-MM a partir de una fecha
const getFormattedMonth = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  return `${year}-${month.toString().padStart(2, "0")}`;
};

function generateBarPlot(dataIngresos, dataEgresos) {
  const canvasElement = document.getElementById("ingresosEgresosMixtoChart");

  // Destruir el gráfico existente si hay uno
  if (canvasElement && Chart.getChart(canvasElement)) {
    const ctx = canvasElement.getContext("2d");
    Chart.getChart(ctx).destroy();
  }

  // Preprocesar datos para obtener ingresos y egresos mensuales
  let ingresosMensuales = {};
  let egresosMensuales = {};

  dataIngresos.forEach((ingreso) => {
    const fecha = new Date(ingreso.fecha);
    const mes = getFormattedMonth(fecha);
    ingresosMensuales[mes] =
      (ingresosMensuales[mes] || 0) + parseFloat(ingreso.monto);
  });

  dataEgresos.forEach((egreso) => {
    const fecha = new Date(egreso.fecha);
    const mes = getFormattedMonth(fecha);
    egresosMensuales[mes] =
      (egresosMensuales[mes] || 0) + parseFloat(egreso.monto);
  });

  // Crear etiquetas y datos para el gráfico mixto
  const labels = Object.keys({
    ...ingresosMensuales,
    ...egresosMensuales,
  }).sort();
  const ingresosData = labels.map((mes) => ingresosMensuales[mes] || 0);
  const egresosData = labels.map((mes) => egresosMensuales[mes] || 0);

  // Configurar el gráfico mixto
  const ctx = document
    .getElementById("ingresosEgresosMixtoChart")
    .getContext("2d");
  const myChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Ingresos",
          data: ingresosData,
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        },
        {
          label: "Egresos",
          data: egresosData,
          backgroundColor: "rgba(255, 99, 132, 0.2)",
          borderColor: "rgba(255, 99, 132, 1)",
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
}

function generateTendenciaSaldoChart(dataIngresos, dataEgresos) {
  const canvasElement = document.getElementById("tendenciaSaldoChart");

  // Destruir el gráfico existente si hay uno
  if (canvasElement && Chart.getChart(canvasElement)) {
    const ctx = canvasElement.getContext("2d");
    Chart.getChart(ctx).destroy();
  }
  // Preprocesar datos para obtener la tendencia del saldo
  let tendenciaSaldo = {};
  let saldoActual = 0;

  dataIngresos.forEach((ingreso) => {
    const fecha = new Date(ingreso.fecha);
    const mes = getFormattedMonth(fecha);
    saldoActual += parseFloat(ingreso.monto);
    tendenciaSaldo[mes] = saldoActual;
  });

  dataEgresos.forEach((egreso) => {
    const fecha = new Date(egreso.fecha);
    const mes = getFormattedMonth(fecha);
    saldoActual -= parseFloat(egreso.monto);
    tendenciaSaldo[mes] = saldoActual;
  });

  // Crear etiquetas y datos para el gráfico de líneas
  labels = Object.keys(tendenciaSaldo).sort();
  data = labels.map((mes) => tendenciaSaldo[mes]);

  // Configurar el gráfico de líneas
  ctx = document.getElementById("tendenciaSaldoChart").getContext("2d");
  myChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Tendencia de Saldo",
          data: data,
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 2,
          fill: false,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: false,
        },
      },
    },
  });
}

function generateLineGraph(dataIngresos, dataEgresos) {
  const canvasElement = document.getElementById("mixtoIngresosEgresosChart");

  // Destruir el gráfico existente si hay uno
  if (canvasElement && Chart.getChart(canvasElement)) {
    const ctx = canvasElement.getContext("2d");
    Chart.getChart(ctx).destroy();
  }
  // Preprocesar datos para la tendencia de ingresos y egresos
  let tendenciaIngresos = {};
  let tendenciaEgresos = {};
  let saldoActual = 0;

  // Función para obtener el formato YYYY-MM a partir de una fecha
  const getFormattedMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    return `${year}-${month.toString().padStart(2, "0")}`;
  };

  dataIngresos.forEach((ingreso) => {
    const fecha = new Date(ingreso.fecha);
    const mes = getFormattedMonth(fecha);
    saldoActual += parseFloat(ingreso.monto);
    tendenciaIngresos[mes] = saldoActual;
  });

  saldoActual = 0; // Reiniciar saldo para calcular la tendencia de egresos

  dataEgresos.forEach((egreso) => {
    const fecha = new Date(egreso.fecha);
    const mes = getFormattedMonth(fecha);
    saldoActual += parseFloat(egreso.monto);
    tendenciaEgresos[mes] = saldoActual;
  });

  // Crear etiquetas y datos para el gráfico mixto de líneas
  const labels = Object.keys({
    ...tendenciaIngresos,
    ...tendenciaEgresos,
  }).sort();
  const ingresosData = labels.map((mes) => tendenciaIngresos[mes] || 0);
  const egresosData = labels.map((mes) => tendenciaEgresos[mes] || 0);

  // Configurar el gráfico mixto de líneas
  const ctx = document
    .getElementById("mixtoIngresosEgresosChart")
    .getContext("2d");
  const myChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Ingresos",
          data: ingresosData,
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 2,
          fill: false,
        },
        {
          label: "Egresos",
          data: egresosData,
          borderColor: "rgba(255, 99, 132, 1)",
          borderWidth: 2,
          fill: false,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: false,
        },
      },
    },
  });
}

function printHTML() {
  if (window.print) {
    window.print();
  }
}

function limpiarDatosReporte() {
  window.location.reload();
}
