//Para conocer mas sobre el API de Google Maps, entrar en la siguiente url.
//Vienen tutoriales, reglas y especificaciones, ademas de ejemplos que son los utilizados aqui.
//https://developers.google.com/maps/documentation/javascript/tutorial?hl=es

//Variables
let mapa = null;  //Mapa de Google Maps
//Iniciamos con la ubicaciones de la FEI
let latitud = 19.541142;
let longitud = -96.9271873;
//coordenadas del cliente
let latitudHome;
let lingitudHome;
let transportesSelect = document.getElementById("Transporte");
let rutaCheck = document.querySelector("#Ruta");
let directionsRenderer = new google.maps.DirectionsRenderer();

//Funcion que dibuja el mapa y coloca un marcador seleccionable en la FEI
function dibujaMapa() {
    mapa = $("#mapa").locationpicker({
        location: { latitude: latitud, longitude: longitud },
        radius: 300,
        addressFormat: "point_of_interest",
        inputBinding:{
            latitudeInput: $("#Latitud"),
            longitudeInput: $("#Longitud"),
            locationNameInput: $("#Localizador"),
        },
        enableAutocomplete: true,
        enableReverseGeocode: true,
        onchanged: function (currentLocation, radius, isMarkerDropped){
            latitud = currentLocation.latitude;
            longitud = currentLocation.longitude;
            distancia();
        }
    });
}

function miUbicacion() {
    //Obtiene el mapa
    let mapContext = mapa.locationpicker("map");
    //Probamos el API HTML5 de geolocalizacion esta disponible en el cliente
    if (navigator.geolocation){
        navigator.geolocation.getCurrentPosition(
            (position) => {
                latitudHome = position.coords.latitude;
                longitudHome = position.coords.longitude;
                new google.maps.Marker({
                    position: { lat: latitudHome, lng: longitudHome},
                    map: mapContext.map,
                    title: "Esta es tu ubicación actual",
                    icon: "images/home.png",
                });
                distancia();
            },
            () => {
                $("#Distancia").val("La localización no está activada.");
            }
        );
    } else {
        $("#Distancia").val("El navegador no soporta geolocalización.");
    }
}

function distancia() {
    //Obtiene el mapa 
    let mapContext = mapa.locationpicker("map");

    //Inicia los servicios para la distancia
    const service = new google.maps.DistanceMatrixService();
    const selectedMode = document.getElementById("Transporte").value;

    //Petición para la distancia
    const origen = { lat: latitudHome, lng: longitudHome};
    const destino = { lat: latitud, lng: longitud};
    const request = {
        origins: [origen],
        destinations: [destino],
        travelMode: google.maps.TravelMode[selectedMode],
        unitSystem: google.maps.UnitSystem.METRIC,
        avoidHighways: false,
        avoidTolls: false,
    }

    //Obtiene la distabcia usando Google Matrix
    service.getDistanceMatrix(request).then((response) => {
        if (response.rows.length > 0) {
            $("#Distancia").val(response.rows[0].elements[0].distance.text);
            $("#Tiempo").val(response.rows[0].elements[0].duration.text);
        }
    })

    //Funcion para dibujar la ruta
    if (rutaCheck.checked) {
        const directionsService = new google.maps.DirectionsService();
        directionsRenderer.setMap(mapContext.map);

        directionsService
            .route({
                origin: origen,
                destination: destino,
                travelMode: google.maps.TravelMode[selectedMode],
            })
            .then((response) => {
                directionsRenderer.setDirections(response);
            });
    } else {
        directionsRenderer.setMap(null);
    }
}
    //Calcula la distancia al cambiar el transporte
    [transportesSelect,rutaCheck].forEach(item =>{
        item.addEventListener("change", function() {
            distancia();
        });
    });

    //Se inicia cuando la página ha cargado por completo
    $(function(){
        dibujaMapa();
        miUbicacion();
    });


