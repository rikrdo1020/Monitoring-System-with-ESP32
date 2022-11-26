const url = (window.location.hostname.includes('localhost'))
? 'http://localhost:5000/api/auth/'
: 'https://restserver-node-rikrdo1020.herokuapp.com/api/auth/'

const txtTemp = document.querySelector("#temp");
const txtHum  = document.querySelector("#hum");
const txtHic = document.querySelector('#hic');
const deviceOnline = document.querySelector('#deviceOnline');
const deviceOffline = document.querySelector('#deviceOffline');
const btnSignout = document.querySelector('#signout');

btnSignout.addEventListener('click', (e) =>{
  e.preventDefault();

  localStorage.removeItem( 'token' )
  window.location = "index.html"
})

//Validate token from localstorage
const validateJWT = async() =>{
  const token = localStorage.getItem('token') || '';

  if (token.length <= 10){
      window.location = 'index.html'
      throw new Error('No hay token en el servidor')
  }

  const resp = await fetch(url, {
      headers:{
          "x-token": token
      }
  });

  const { user: userDB, token: tokenDB } = await resp.json();
  localStorage.setItem('token', tokenDB)
  user = userDB

  document.title = user.name;
  
  connectSocket();
}

const socket = io();


//Inicializando charts
var options = {
    series: [0],
    dataLabels: {
        name: false
    },
    chart: {
    type: 'radialBar',
    offsetY: -20,
    sparkline: {
      enabled: true
    }
    },
    plotOptions: {
        radialBar: {
        startAngle: -90,
        endAngle: 90,
        track: {
            background: "#e7e7e7",
            strokeWidth: '97%',
            margin: 5, // margin is in pixels
            dropShadow: {
            enabled: true,
            top: 2,
            left: 0,
            color: '#999',
            opacity: 1,
            blur: 2
            }
        },
        dataLabels: {
            name: {
            show: false
            },
            value: {
            offsetY: -2,
            fontSize: '22px'
            }
        }
        }
    },
    grid: {
        padding: {
        top: -10
        }
    },
    fill: {
        type: 'gradient',
        gradient: {
        shade: 'light',
        shadeIntensity: 0.4,
        inverseColors: false,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 50, 53, 91]
        },
    },
    labels: [''],
    };
var humChart = new ApexCharts(txtHum, options);
//var hicChart = new ApexCharts(txtHic, options);


humChart.render();

//drawLevel(0, txtHum);


socket.on('connect', () => {
  //console.log('Conectado')';
})

socket.on('message', ( {humidity, temperature, hic} )=>{
  //console.log(temperature);

  txtTemp.innerHTML = temperature
  humChart.updateSeries([humidity])
  txtHic.innerHTML = Math.round(hic)
  //drawLevel(humidity, txtHum, true);
})




function drawLevel(value, ref, update) {
    var options = {
        series: [value],
        chart: {
        type: 'radialBar',
        offsetY: -20,
        sparkline: {
          enabled: true
        }
      },
      plotOptions: {
        radialBar: {
          startAngle: -90,
          endAngle: 90,
          track: {
            background: "#e7e7e7",
            strokeWidth: '97%',
            margin: 5, // margin is in pixels
            dropShadow: {
              enabled: true,
              top: 2,
              left: 0,
              color: '#999',
              opacity: 1,
              blur: 2
            }
          },
          dataLabels: {
            name: {
              show: false
            },
            value: {
              offsetY: -2,
              fontSize: '22px'
            }
          }
        }
      },
      grid: {
        padding: {
          top: -10
        }
      },
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'light',
          shadeIntensity: 0.4,
          inverseColors: false,
          opacityFrom: 1,
          opacityTo: 1,
          stops: [0, 50, 53, 91]
        },
      },
      labels: ['Average Results'],
    };
    var chart = new ApexCharts(ref, options);

    // if(update){
    //     options.series = [value];
    //     chart.update();
    //     return
    // }
  
  if(update){
    chart.updateSeries([{}], true)
    return
  }
  chart.render();
}

const main = async() =>{

  validateJWT();
}

main();