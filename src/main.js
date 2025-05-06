import * as ss from "simple-statistics";
import Chart from "chart.js/auto";
import datosInmobiliarios from "./datos_inmobiliarios.json"; // Esto importa { "Hoja1": [...] }

// ------------------- PARTE 1: Pesos de Personas -------------------
// ... (El código de la Parte 1 no cambia y se mantiene igual) ...
const pesos = [
  60, 66, 77, 70, 66, 68, 57, 70, 66, 52, 75, 65, 69, 71, 58, 66, 67, 74, 61,
  63, 69, 80, 59, 66, 70, 67, 78, 75, 64, 71, 81, 62, 64, 69, 68, 72, 83, 56,
  65, 74, 67, 54, 65, 65, 69, 61, 67, 73, 57, 62, 67, 68, 63, 67, 71, 68, 76,
  61, 62, 63, 76, 61, 67, 67, 64, 72, 64, 73, 79, 58, 67, 71, 68, 59, 69, 70,
  66, 62, 63, 66,
];
const minPeso = Math.min(...pesos);
const maxPeso = Math.max(...pesos);
const anchoIntervalo = 10;
const intervalos = [];
for (let inicio = 50; inicio <= 80; inicio += anchoIntervalo) {
  intervalos.push([inicio, inicio + anchoIntervalo - 1]);
}
const frecuencias = intervalos.map(([ini, fin]) =>
  pesos.filter((p) => p >= ini && p <= fin).length
);
const frecuenciaAcumulada = [];
frecuencias.reduce((acc, curr, i) => {
  frecuenciaAcumulada[i] = acc + curr;
  return frecuenciaAcumulada[i];
}, 0);
const totalPesos = pesos.length;
const frecuenciaRelativa = frecuencias.map((f) => f / totalPesos);
const frecuenciaPorcentual = frecuenciaRelativa.map((fr) => fr * 100);
const tablaPesosDiv = document.getElementById("tablaPesos");
let tablaPesosHTML = `
  <table border="1" cellpadding="4">
    <tr>
      <th>Intervalo</th>
      <th>Fa</th>
      <th>Fr</th>
      <th>Fp (%)</th>
      <th>Fa Acum</th>
    </tr>
`;
intervalos.forEach(([ini, fin], i) => {
  tablaPesosHTML += `
    <tr>
      <td>${ini} - ${fin}</td>
      <td>${frecuencias[i]}</td>
      <td>${frecuenciaRelativa[i].toFixed(2)}</td>
      <td>${frecuenciaPorcentual[i].toFixed(2)}</td>
      <td>${frecuenciaAcumulada[i]}</td>
    </tr>
  `;
});
tablaPesosHTML += "</table>";
tablaPesosDiv.innerHTML = tablaPesosHTML;
const menos65 = pesos.filter((p) => p < 65).length;
const porcentajeMenos65 = ((menos65 / totalPesos) * 100).toFixed(2);
const entre70y85 = pesos.filter((p) => p >= 70 && p < 85).length;
const mediaPesos = ss.mean(pesos);
const medianaPesos = ss.median(pesos);
const modaPesos = ss.mode(pesos);
const varianzaPesos = ss.variance(pesos);
const desviacionPesos = ss.standardDeviation(pesos);
const curtosisPesos = ss.sampleKurtosis(pesos);
const resultadosPesosDiv = document.getElementById("resultadosPesos");
resultadosPesosDiv.innerHTML = `
  <ul>
    <li><b>Media:</b> ${mediaPesos.toFixed(2)} kg</li>
    <li><b>Mediana:</b> ${medianaPesos.toFixed(2)} kg</li>
    <li><b>Moda:</b> ${modaPesos} kg</li>
    <li><b>Varianza:</b> ${varianzaPesos.toFixed(2)}</li>
    <li><b>Desviación estándar:</b> ${desviacionPesos.toFixed(2)}</li>
    <li><b>Curtosis:</b> ${curtosisPesos.toFixed(4)} (${interpretarCurtosis(curtosisPesos)})</li>
    <li><b>Porcentaje de personas con menos de 65 kg:</b> ${porcentajeMenos65}%</li>
    <li><b>Personas entre 70 y 85 kg:</b> ${entre70y85}</li>
  </ul>
`;
const ctxPesos = document.getElementById("histogramaPesos");
const labelsPesos = intervalos.map(([ini, fin]) => `${ini}-${fin}`);
new Chart(ctxPesos, {
  type: "bar",
  data: {
    labels: labelsPesos,
    datasets: [
      {
        label: "Frecuencia (Fa)",
        data: frecuencias,
        backgroundColor: "rgba(75,192,192,0.6)",
        borderColor: "rgba(75,192,192,1)",
        borderWidth: 1,
        order: 2,
      },
      {
        label: "Polígono de Frecuencia",
        data: frecuencias,
        type: "line",
        borderColor: "rgba(255,99,132,1)",
        backgroundColor: "rgba(255,99,132,0.2)",
        tension: 0.1,
        order: 1,
      },
    ],
  },
  options: {
    scales: {
      y: { beginAtZero: true },
    },
  },
});
// ------------------- PARTE 2: Datos Inmobiliarios -------------------

// Accede al array dentro de la clave "Hoja1"
const datosHoja1 = datosInmobiliarios.Hoja1;

// 1. Extraer precios (usando datosHoja1)
const precios = datosHoja1
  .map((row) => row["Precio Venta"])
  .filter((p) => p !== null && p !== undefined && !isNaN(p));

// Verifica si hay precios válidos
if (precios.length === 0) {
  console.error("No se encontraron precios válidos en datosInmobiliarios.Hoja1");
  // Podrías mostrar un mensaje en el HTML aquí
} else {
  // 2. Tabla de frecuencias para precios
  const minPrecio = Math.min(...precios);
  const maxPrecio = Math.max(...precios);
  const numIntervalos = 7;
  const anchoIntervaloPrecio = Math.ceil((maxPrecio - minPrecio) / numIntervalos);

  const intervalosPrecios = [];
  for (
    let ini = minPrecio;
    ini < maxPrecio;
    ini += anchoIntervaloPrecio
  ) {
    intervalosPrecios.push([ini, Math.min(ini + anchoIntervaloPrecio - 1, maxPrecio)]);
  }

  const frecuenciasPrecios = intervalosPrecios.map(([ini, fin]) =>
    precios.filter((p) => p >= ini && p <= fin).length
  );

  const frecuenciaAcumuladaPrecios = [];
  frecuenciasPrecios.reduce((acc, curr, i) => {
    frecuenciaAcumuladaPrecios[i] = acc + curr;
    return frecuenciaAcumuladaPrecios[i];
  }, 0);

  const frecuenciaRelativaPrecios = frecuenciasPrecios.map((f) => f / precios.length);
  const frecuenciaPorcentualPrecios = frecuenciaRelativaPrecios.map((fr) => fr * 100);

  // Mostrar tabla de frecuencias de precios
  const tablaPreciosDiv = document.getElementById("tablaPrecios");
  let tablaPreciosHTML = `
    <table border="1" cellpadding="4">
      <tr>
        <th>Intervalo</th>
        <th>Fa</th>
        <th>Fr</th>
        <th>Fp (%)</th>
        <th>Fa Acum</th>
      </tr>
  `;
  intervalosPrecios.forEach(([ini, fin], i) => {
    tablaPreciosHTML += `
      <tr>
        <td>${ini.toLocaleString("es-CO")} - ${fin.toLocaleString("es-CO")}</td>
        <td>${frecuenciasPrecios[i]}</td>
        <td>${frecuenciaRelativaPrecios[i].toFixed(2)}</td>
        <td>${frecuenciaPorcentualPrecios[i].toFixed(2)}</td>
        <td>${frecuenciaAcumuladaPrecios[i]}</td>
      </tr>
    `;
  });
  tablaPreciosHTML += "</table>";
  tablaPreciosDiv.innerHTML = tablaPreciosHTML;

  // 3. Estadísticas descriptivas de precios
  const mediaPrecio = ss.mean(precios);
  const medianaPrecio = ss.median(precios);
  const modaPrecio = ss.mode(precios);
  const varianzaPrecio = ss.variance(precios);
  const desviacionPrecio = ss.standardDeviation(precios);
  const curtosisPrecio = ss.sampleKurtosis(precios);

  // Mostrar resultados de precios
  const resultadosPropiedadesDiv = document.getElementById("resultadosPropiedades");
  resultadosPropiedadesDiv.innerHTML = `
    <ul>
      <li><b>Media:</b> ${mediaPrecio.toLocaleString("es-CO", { style: "currency", currency: "COP" })}</li>
      <li><b>Mediana:</b> ${medianaPrecio.toLocaleString("es-CO", { style: "currency", currency: "COP" })}</li>
      <li><b>Moda:</b> ${modaPrecio.toLocaleString("es-CO", { style: "currency", currency: "COP" })}</li>
      <li><b>Varianza:</b> ${varianzaPrecio.toFixed(2)}</li>
      <li><b>Desviación estándar:</b> ${desviacionPrecio.toLocaleString("es-CO", { style: "currency", currency: "COP" })}</li>
      <li><b>Curtosis:</b> ${curtosisPrecio.toFixed(4)} (${interpretarCurtosis(curtosisPrecio)})</li>
    </ul>
  `;

  // 4. Histograma y polígono de frecuencia de precios
  const ctxPrecios = document.getElementById("histogramaPrecios");
  const labelsPrecios = intervalosPrecios.map(
    ([ini, fin]) =>
      `${ini.toLocaleString("es-CO", { maximumFractionDigits: 0 })} - ${fin.toLocaleString("es-CO", { maximumFractionDigits: 0 })}`
  );

  new Chart(ctxPrecios, {
    type: "bar",
    data: {
      labels: labelsPrecios,
      datasets: [
        {
          label: "Frecuencia (Fa)",
          data: frecuenciasPrecios,
          backgroundColor: "rgba(54,162,235,0.6)",
          borderColor: "rgba(54,162,235,1)",
          borderWidth: 1,
          order: 2,
        },
        {
          label: "Polígono de Frecuencia",
          data: frecuenciasPrecios,
          type: "line",
          borderColor: "rgba(255,99,132,1)",
          backgroundColor: "rgba(255,99,132,0.2)",
          tension: 0.1,
          order: 1,
        },
      ],
    },
    options: {
      scales: {
        y: { beginAtZero: true },
      },
    },
  });

  // 5. Tabla de contingencia (Tipo vs Ciudad) (usando datosHoja1)
  const tipos = [...new Set(datosHoja1.map((d) => d["Tipo"]))];
  const ciudades = [...new Set(datosHoja1.map((d) => d["Ciudad"]))];

  let tablaContHTML = `
    <table border="1" cellpadding="4">
      <tr>
        <th>Tipo / Ciudad</th>
        ${ciudades.map((c) => `<th>${c}</th>`).join("")}
        <th>Total</th>
      </tr>
  `;

  tipos.forEach((tipo) => {
    let totalTipo = 0;
    tablaContHTML += `<tr><td>${tipo}</td>`;
    ciudades.forEach((ciudad) => {
      const count = datosHoja1.filter( // <--- Cambio aquí
        (d) => d["Tipo"] === tipo && d["Ciudad"] === ciudad
      ).length;
      totalTipo += count;
      tablaContHTML += `<td>${count}</td>`;
    });
    tablaContHTML += `<td>${totalTipo}</td></tr>`;
  });

  // Fila de totales por ciudad
  tablaContHTML += `<tr><td><b>Total</b></td>`;
  let totalGeneral = 0;
  ciudades.forEach((ciudad) => {
    const count = datosHoja1.filter((d) => d["Ciudad"] === ciudad).length; // <--- Cambio aquí
    totalGeneral += count;
    tablaContHTML += `<td>${count}</td>`;
  });
  // Asegúrate de que el total general se calcule correctamente si usas datosHoja1.length
  tablaContHTML += `<td>${datosHoja1.length}</td></tr>`; // Usar datosHoja1.length es más directo
  tablaContHTML += "</table>";

  document.getElementById("tablaContingencia").innerHTML = tablaContHTML;

  // 6. Conclusiones (ejemplo) (usando datosHoja1)
  resultadosPropiedadesDiv.innerHTML += `
    <h3>Conclusiones:</h3>
    <ol>
      <li>La mayoría de las propiedades tienen precios entre ${labelsPrecios[0]} y ${labelsPrecios[1]}.</li>
      <li>El tipo de propiedad más frecuente es <b>${moda(datosHoja1.map(d => d["Tipo"]))}</b>.</li>
      <li>La curtosis de los precios indica que la distribución es ${interpretarCurtosis(curtosisPrecio).toLowerCase()}.</li>
    </ol>
  `;
} // Fin del bloque else (si hay precios válidos)

// ------------------- FUNCIONES AUXILIARES -------------------

function interpretarCurtosis(k) {
  if (Math.abs(k) < 0.5) return "Mesocúrtica (similar a normal)";
  if (k > 0.5) return "Leptocúrtica (más puntiaguda)";
  return "Platicúrtica (más plana)";
}

function moda(arr) {
  if (!arr || arr.length === 0) return "N/A"; // Manejar array vacío
  const freq = {};
  arr.forEach((v) => (freq[v] = (freq[v] || 0) + 1));
  let max = 0;
  let modas = [];
  for (const k in freq) {
    if (freq[k] > max) {
      max = freq[k];
      modas = [k];
    } else if (freq[k] === max) {
      modas.push(k);
    }
  }
  // Si todas las frecuencias son 1, no hay moda clara
  if (modas.length === arr.length) return "Sin moda clara";
  return modas.join(", "); // Devuelve todas las modas si hay empate
}

