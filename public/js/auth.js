//Google token : ID_TOKEN
const url = (window.location.hostname.includes('localhost'))
? 'http://localhost:5000/api/auth/'
: 'https://restserver-node-rikrdo1020.herokuapp.com/api/auth/'

const miFormulario = document.querySelector('form');

miFormulario.addEventListener('submit', ev => {
    ev.preventDefault();
    const formData = {}

    for( let el of miFormulario.elements){
        if( el.name.length > 0){
            formData[el.name] = el.value
        }
    }
    
    fetch( url + 'login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(resp => resp.json())
    .then( ({msg, token}) => {
        if(msg){
            return console.error( msg )
        }
        localStorage.setItem( 'token', token )
        window.location = 'dashboard.html'
    })
    .catch( err => {
        console.log(err)
    })
    
})
