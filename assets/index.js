const cambiarMoneda = async function (event){
    event.preventDefault();
    try {
        const res = await fetch("https://mindicador.cl/api/");
        const data = await res.json();

        const valor = document.querySelector("#valor").value
        const moneda = document.querySelector("#inputMoneda").value

        document.querySelector("#tipoMoneda").innerHTML = moneda

        let resultado = 0;
        if(moneda === "dolar"){
            resultado = valor / data.dolar.valor
            document.querySelector("#numero").innerHTML = `$${resultado.toFixed(2)}`
        }else if(moneda === 'euro'){
            resultado = valor / data.euro.valor
            document.querySelector("#numero").innerHTML = `€${resultado.toFixed(2)}`
        }else if(moneda === 'bitcoin'){
            resultado = valor / data.bitcoin.valor
            document.querySelector("#numero").innerHTML = `₿${resultado.toFixed(2)}`
        }

        getValores(moneda);

    } catch (error) {
        document.querySelector("#numero").innerHTML = "Hubo un problema";
        console.log(error);
    }
}

async function getValores(moneda){
    try {
        const res = await fetch(`https://mindicador.cl/api/${moneda}/2024`);
        const data = await res.json();

        const valores = data.serie.slice(0, 10).map(values => {

            const fecha = new Date(values.fecha).toLocaleDateString('es-CL', {
                day: '2-digit',
                month: '2-digit'
            });

            return {
                fecha,
                valor: values.valor
            };
        });

        renderTabla(valores, moneda);

    } catch (error) {
        console.log(error);
    }
    
}

let chart;

function renderTabla(valores, moneda){
    const ctx = document.getElementById('myChart');

    if (chart) {
        chart.destroy();
    }

    chart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: valores.map(valor => valor.fecha),
        datasets: [{
            label: `Ultimos 10 registros de ${moneda}`,
            data: valores.map(valor => valor.valor),
            fill: false,
            borderColor: 'black',
            tension: 0.1
        }]
    },
    options: {
        scales: {
        y: {
            beginAtZero: false
        }
        }
    }
    });
}


