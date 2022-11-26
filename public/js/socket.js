const url = (window.location.hostname.includes('localhost'))
? 'http://localhost:5000/api/auth/'
: 'https://restserver-node-rikrdo1020.herokuapp.com/api/auth/'

const txtTemp = document.querySelector("#temp");
const txtHum  = document.querySelector("#hum");
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
drawTempLevel(0);
drawHumLevel(0);

socket.on('connect', () => {
  //console.log('Conectado')';
})

socket.on('message', ( {humidity, temperature, hic} )=>{
  console.log(temperature);

  drawTempLevel(temperature);
  drawHumLevel(humidity);
})


function drawTempLevel(temp) {
  var options = {
    series: [temp],
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

  var tempChart = new ApexCharts(document.querySelector("#temp"), options);
  tempChart.render();
}

function updateConfigAsNewObject(chart) {
  chart.options = {
      responsive: true,
      plugins: {
          title: {
              display: true,
              text: 'Chart.js'
          }
      },
      scales: {
          x: {
              display: true
          },
          y: {
              display: true
          }
      }
  };
  chart.update();
}

function drawHumLevel(hum) {
  var options = {
    series: [hum],
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

  var humChart = new ApexCharts(document.querySelector("#hum"), options);
  humChart.render();
}

const main = async() =>{

  validateJWT();
}

main();