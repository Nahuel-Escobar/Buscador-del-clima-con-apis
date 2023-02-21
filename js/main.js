// Llamo a todos las clases e ids que necesito usar 
const resultado = document.querySelector(".result")
const formulario = document.querySelector(".get-weather")
const nombreCiudad = document.querySelector("#city")
const nombrePais = document.querySelector("#country")


// Le agrego un evento de submit al boton del formulario
formulario.addEventListener("submit", (e)=>{
    e.preventDefault(); // Esto hace que no nos mande a un link al darle al submit
    // Hago un if para que avise los inputs estan vacios 
    if(nombreCiudad.value === '' || nombrePais.value === ''){
        showError('Ambos campos son obligatorios..')
        return
    } 

    // Funcion de API para que tome los valores de los inputs de ciudad y pais
    callAPI(nombreCiudad.value, nombrePais.value)

})


// Creamos la funcion para llamar a las api
function callAPI(ciudad, pais){
    const apiId = '61faaab3280efb89af740709056eb119' //Agrego la keyApi de la API del clima
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad},${pais}&appid=${apiId}` // Agrego la API y le agrego la keyAPI
    //EJ= `https://api.openweathermap.org/data/2.5/weather?q=bogota,Colombia&appid=61faaab3280efb89af740709056eb119` Copiar y pegar en buscador 
    // Usamos un fetch para traer la API de OpenWeather
    fetch(url)
        .then(data => {
            return data.json() //Parseamos los datos a un Json para que sea legible
        })
        .then(dataJSON => {
            if (dataJSON.cod === '404') {
                showError('Ciudad no encotrada')
            } else{
                clearHTML()
                showWeather(dataJSON)
                Swal.fire({ //SweetAlert para avisar que se proceso la solicitud
                    position: 'center',
                    icon: 'success',
                    title: 'Se ah procesado su solicitud del clima',
                    showConfirmButton: false,
                    timer: 1200
                })
            }
            // console.log(dataJSON);
        })
        .catch(error => { //Si hay un error lo va a mostrar
            console.log(error);
        })
}


function showWeather(data){
    const {
        name, 
        main:{
            temp, 
            temp_min,
            temp_max
        }, 
        weather:[arr]
    } = data //Accedemos a los datos que necesitamos del Json
    
    // Redondeamos los grados
    const grados = kelvinToCentigrade(temp)
    const gradosMin = kelvinToCentigrade(temp_min)
    const gradosMax = kelvinToCentigrade(temp_max)

    const content = document.createElement('div')
    content.innerHTML =  `
        <h5>Clima en ${name}</h5>
        <img src="https://openweathermap.org/img/wn/${arr.icon}@2x.png" alt="Icono Clima">
        <h2>${grados}°</h2>
        <p>Max: ${gradosMax}°</p>
        <p>Min: ${gradosMin}°</p>
    `

    resultado.appendChild(content)

    /*Muestra en Consola todos los datos que necesitaba saber
        console.log(name);
        console.log(temp);
        console.log(temp_max);
        console.log(temp_min);
        console.log(arr.icon);
    */
}


// Creamos la funcion para mostrar error si el usuario no llena los campos que se necesitan
function showError(mensaje){
    console.log(mensaje)
    const alert = document.createElement('p')
    alert.classList.add('alert-message')

    alert.innerHTML= mensaje

    formulario.appendChild(alert)

    setTimeout(()=>{
        alert.remove()
    }, 2000)
}


// Creamos la function que pasa a grados la temperatura
function kelvinToCentigrade (temp){
    return parseInt(temp - 273.15)  // Ecuacion para pasar de kelvin a grados celcius
}

// Creamos una function que se encarga de limpiar 
function clearHTML(){
    resultado.innerHTML= "" //Elimina todo el HTML del div Result
}