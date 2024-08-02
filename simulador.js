let chart = null;

document.getElementById('calcular').addEventListener('click', ejecutarSimulador);

async function cargarDatosIniciales() {
    const response = await fetch('data.json');
    const data = await response.json();
    console.log(data); // Mostrar los datos cargados en la consola para verificar
    return data.simulationData[0];
}

async function inicializarSimulador() {
    const datosIniciales = await cargarDatosIniciales();
    // Mostrar los datos en la consola, pero no prellenar los campos de entrada
    console.log("Datos iniciales cargados:", datosIniciales);
}

function obtenerValor(id, errorId) {
    const valor = parseFloat(document.getElementById(id).value);
    const errorElement = document.getElementById(errorId);

    if (isNaN(valor) || valor <= 0) {
        errorElement.textContent = 'Por favor, ingrese un valor válido';
        return null;
    } else {
        errorElement.textContent = '';
        return valor;
    }
}

function calcularInteresCompuesto(montoInicial, cantidadAnios, montoAnualAgregado, tasaInteres) {
    let montoTotal = montoInicial;
    let resultadosAnuales = [];

    for (let i = 0; i < cantidadAnios; i++) {
        montoTotal = (montoTotal + montoAnualAgregado) * (1 + tasaInteres / 100);
        resultadosAnuales.push(montoTotal);
    }
    return resultadosAnuales;
}

function mostrarResultado(resultadosAnuales) {
    const resumen = document.getElementById('resumen');
    const tablaResultados = document.getElementById('tablaResultados').querySelector('tbody');
    const gastoPromedio = document.getElementById('gastoPromedio');

    resumen.textContent = `Después de ${resultadosAnuales.length} años, el monto total es de $${resultadosAnuales[resultadosAnuales.length - 1].toFixed(2)}.`;

    tablaResultados.innerHTML = '';

    resultadosAnuales.forEach((resultado, index) => {
        const row = tablaResultados.insertRow();
        const cellAnio = row.insertCell(0);
        const cellMonto = row.insertCell(1);
        cellAnio.textContent = `Año ${index + 1}`;
        cellMonto.textContent = `$${resultado.toFixed(2)}`;
    });

    const ultimoAnio = resultadosAnuales[resultadosAnuales.length - 1];
    const gastoPromedioAnual = ultimoAnio / 20;
    gastoPromedio.innerHTML = `Gasto promedio anual para vivir durante 20 años (tipo jubilación): $${gastoPromedioAnual.toFixed(2)}`;

    mostrarGrafico(resultadosAnuales);
}

function mostrarGrafico(resultadosAnuales) {
    const ctx = document.getElementById('chartCanvas').getContext('2d');
    const labels = resultadosAnuales.map((_, index) => `Año ${index + 1}`);
    const data = {
        labels: labels,
        datasets: [{
            label: 'Monto Anual',
            data: resultadosAnuales,
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderWidth: 2,
            pointBackgroundColor: 'rgba(75, 192, 192, 1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(75, 192, 192, 1)',
            pointRadius: 5,
            pointHoverRadius: 7
        }]
    };

    if (chart) {
        chart.destroy(); // Destruir el gráfico existente antes de crear uno nuevo
    }

    chart = new Chart(ctx, {
        type: 'line',
        data: data,
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function guardarEnLocalStorage(montoInicial, cantidadAnios, montoAnualAgregado, tasaInteres, resultadosAnuales) {
    const simulacion = {
        montoInicial,
        cantidadAnios,
        montoAnualAgregado,
        tasaInteres,
        resultadosAnuales
    };
    localStorage.setItem('simulacion', JSON.stringify(simulacion));
}

function ejecutarSimulador() {
    const montoInicial = obtenerValor('montoInicial', 'errorMontoInicial');
    const cantidadAnios = obtenerValor('cantidadAnios', 'errorCantidadAnios');
    const montoAnualAgregado = obtenerValor('montoAnualAgregado', 'errorMontoAnualAgregado');
    const tasaInteres = obtenerValor('tasaInteres', 'errorTasaInteres');

    if (montoInicial && cantidadAnios && montoAnualAgregado && tasaInteres) {
        const resultadosAnuales = calcularInteresCompuesto(montoInicial, cantidadAnios, montoAnualAgregado, tasaInteres);
        guardarEnLocalStorage(montoInicial, cantidadAnios, montoAnualAgregado, tasaInteres, resultadosAnuales);
        mostrarResultado(resultadosAnuales);
    }
}

inicializarSimulador();
