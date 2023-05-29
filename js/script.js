// ********************************************************************************************************************
//
// CÓDIGO PARA DESLIZAR O SALTAR DE UNA PÁGINA A OTRA
//
// ********************************************************************************************************************
// Si ejecuto FireFox directamente haciendo click sobre index.html parece que no quedara bien definido el script
// Si recargo o ya tengo abierto el navegador funciona sin problema. No sucede ese problema con Chrome...
// Tal vez es algún mecanismo de seguridad, tengo muchos bloqueadores y defensas en FireFox
//

// Lista de elementos de la clase "paginas"
// NOTA: Metiéndola dentro de la función "transformación" podría ubicar el script al principio del html
const listaDePaginas = document.querySelectorAll(".paginas");
// Representa en cuál cantidad (en porcentaje de tamaño de pantalla) puede ser una traslación
const cantidadDeTraslacion = 100;

// Una variable GLOBAL que puede ir acumulando traslaciones
// Una vez cargado el script esta variable existe y se va modificando cada vez que se invoca "deslizar" o "saltar"
let traslacion = 0; // Obligadamente se define por fuera de la función

// En el .html se tienen cosas como
// <button onClick="deslizar('retroceder')">Previo</button>
// <button onClick="deslizar('avanzar')">Siguiente</button>
function deslizar(accion)
{
  // === es igualdad estricta, compara el tipo de dato, contrario a == el cual considera que '1' y 1 son lo mismo
  // Así que, como diría el chavo, === es la igualdad "de a deveras" 
  if (accion === "avanzar")
  {
    traslacion -= cantidadDeTraslacion
  } else if (accion === "retroceder")
  {
    traslacion += cantidadDeTraslacion
  } else {return null}; // Nunca debería llegar acá pero si sucede aborta la función
  transformacion();
};

// En el .html se tienen cosas como
// <button onClick="saltar('pagina1')">Inicio</button>
// <button onClick="saltar('pagina2')">Descripción</button>
// <button onClick="saltar('pagina3')">Ubicación</button>
// <button onClick="saltar('pagina4')">Reserva</button>
function saltar(ubicacion)
{
  switch (ubicacion){
    case 'pagina1':
      traslacion= 0;
      break;
    case 'pagina2':
      traslacion= -cantidadDeTraslacion;
      break;
    case 'pagina3':
      traslacion= -cantidadDeTraslacion*2;
      break;
    case 'pagina4':
      traslacion= -cantidadDeTraslacion*3;
      break;
    default:
      return null; // Nunca debería llegar acá pero si sucede aborta la función
      break;
  };
  transformacion();
};

// Ya sea 'deslizar' o 'saltar' finalmente realizan esta transformación
function transformacion()
{
  // El método forEach() ejecuta la función indicada una vez por cada elemento del listaDePaginas.
  // Es decir, ejecuta la función por cada página (sección) del sitio
  // En este caso el argumento de la función es un parámetro al que se ha llamado "pagina"
  // Que efectivamente, por el uso de forEach(), es una de las páginas de la lista de páginas
  // Esa página se refiere a una sección del documento html que pertenece a la clase "paginas"
  listaDePaginas.forEach(pagina => {
    pagina.scrollTop = 0; // Resetea el scroll 
    pagina.style.transform = `translateX(${traslacion}%)`; // Ver detalle en el comentario que sigue...
  });
  // .style.transfom es un métodos que aplica una transformación 2D o 3D especificada
  // translateX es una traslación en el eje X, en este caso una cantidad igual a "traslacion"
  // NOTA: Las instrucción para trasladar a una nueva posición no toma como referencia
  //       una previamente ya transformada en alguna traslación previa.
  //       Siempre toma la misma posición de referencia inicial para realizar la transformación
  //       Es por eso que la acumulación se contabiliza con la variable "traslacion"
  //       No obstante, la animación sí sucede desde la última posición (y entonces se ve bien)
};

// ********************************************************************************************************************
//
// CÓDIGO PARA CONSUMIR LA API DE LEAFLET (EL MAPA)
//
// ********************************************************************************************************************

// La clase principal de la API
var mapa = L.map('mapaUbicacion', { // Instancia un objeto llamado "mapa" dándole el ID del div contenedor
  center: [-37.989414, -57.5587], // Locación geográfica (levemente desplazada) que me interesa señalar
  zoom: 15
});

// Se agrega una "capa" con el mapa, obtenido de openstreetmap.org, también algo de data de atribución/reconocimiento
L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
  attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>', 
  maxZoom: 18} // Información del máximo nivel de zoom soportado por la capa
  ).addTo(mapa);
// En reconocimiento le hice copy-paste de un ejemplo para asegurarse de dejarlo como a los autores les gusta más.
// El formato "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" la verdad yo lo deje default
// Se explica con más detalle en la documentación oficial:
// {s} means one of the available subdomains (used sequentially to help with browser parallel requests per domain limitation;
// subdomain values are specified in options; a, b or c by default, can be omitted), {z} — zoom level, {x} and {y} — tile coordinates.
// {r} can be used to add "@2x" to the URL to load retina tiles.

// Agrega una pequeña barra para estimar la escala de las distancias, útil si uno desea ubicarse mejor en el mapa
L.control.scale().addTo(mapa);

// Mete marcador en la locación geográfica
L.marker([-37.989414, -57.562955],{
  draggable: false, // Marcador fijo no-movible, por que solo me interesa informar ubicación 
  title:"Pampa y la vía"} // texto que se visualiza al posarle el puntero del mouse encima
  ).addTo(mapa);

// Esto agrega una imagen con una leyenda
L.imageOverlay("images/leyenda.png",[[-37.982, -57.562], [-37.987, -57.548]]).addTo(mapa);
// Los bordes de la imagen se dan con coordenadas geográficas por que queda incrustada en el mapa
// Si uno mueve el mapa o hace zoom esa leyenda se queda en un lugar geográfico como si fuera parte del terreno.


// ********************************************************************************************************************
//
// CÓDIGO PARA VALIDAR FORMULARIO
//
// ********************************************************************************************************************

// EN BREVE, aquí se espera que el documento sea procesado/analizado/parseado,
// y una vez sucedido eso se define que hacer cuando se presiona la tecla de envío en el formulario.
//
// Esa espera, supongo, es por que se tiene en mente la posible carga del script antes de definir el formulario.
// Y, supongo, no tiene sentido definir la acción de un formulario que ni siquiera existe... Bah, creo que es por eso ¿no?
//
// Algunas definiciones:        
// DOM=Document Object Model, es definitiva termina siendo la estructura que posee un documento HTML.
// En este contexto se habla de "parsear" ("to parse" en inglés) un documento HTML.
// Eso significa analizarlo e interpretarlo como una estructura más manejable para el navegador, concretamente como un "árbol DOM"
// [Las etiquetas HTML, anidadas una dentro de otra, forman un árbol de etiquetas, denominado árbol DOM (o simplemente DOM)]
//
// En general para registrar un evento dentro de un objetivo (target) especifico se utiliza el 
// target.addEventListener(tipo, listener[, useCapture]); 
// Donde el "listener" es una función que se ejecuta al dispararse ese evento.
// A su vez "tipo" es una cadena representando el tipo de evento a escuchar.
//
// Acá, para comenzar, consideramos un target que es el documento mismo, y el tipo es: DOMContentLoaded
// Entonces el evento DOMContentLoaded se dispara cuando el documento HTML ha sido completamente "parseado"
// y todos los scripts han sido cargados (pero no necesariamente imágenes, hojas de estilo, subframes. etc)
//
// La función disparada luego del parseo establece otro disparador por evento,
// pero en ese caso el target es el fomulario,
// mientras que el evento es haber presionado el botón de envío (el input de tipo "submit")
//
document.addEventListener("DOMContentLoaded", function() {document.getElementById("formulario").addEventListener('submit',validarFormulario);});
// Se establece que la función a ejecutar al enviar el formulario será: validarFormulario

// Según la documentación (w3schools), al ocurrir el evento un "event object" es pasado como 1er parámetro a la función
function validarFormulario(evento) {
    // Este es un método que cancela la acción por defecto del evento
    // En este caso el evento es "submit"
    // En este caso la acción es mandar un mail
    evento.preventDefault();

    // Si no se ingresa un nombre no deja mandar formulario
    var nombre = document.getElementById('nombreInput').value;
    if(nombre.length == 0) {
        alert('Falta especificar nombre del comensal.');
        return;
    };

    // Si se eligió algo devuelve true, caso contrario false
    // Esta función (closure) presupone que:
    // - Todos los elementos de una clase son las opciones radio de una misma pregunta
    // - El nombre de la clase se ingresa en el 1er parámetro, como una string
    // - El 2do parámetro es un mensaje, en formato string, solicitando marcar una elección
    function chequearMarcado(clase, mensaje){
        var algoMarcado = false; // Hasta que se demuestre lo contrario se supone no elegido nada
        var elementos = document.getElementsByClassName(clase); // Un array con todos elementos radio de una clase
        for (const elemento of elementos) {
            if (elemento.checked) {
                algoMarcado = true;
                break;
            };
        };
        if (algoMarcado) {
            return true;                    
        } else {
            alert(mensaje);
            return false;                    
        };
    };

    // Un chequeo de que en las opciones radio obligatorias algo ha sido marcado
    // Si no es así no se deja mandar formulario
    if (!chequearMarcado("platos", "Falta especificar un plato base.")||
    !chequearMarcado("horarios", "Falta indicar horario de arribo.")||
    !chequearMarcado("mediosDePago", "Confirmá entender que solo aceptamos efectivo.")) {
        return;
    };

    // Si se ingresa una pretención de consideración especial no deja mandar formulario
    var pretenciones = document.getElementById('peticionesInput').value;
    pretenciones=pretenciones.toLowerCase(); // Paso a minúsculas
    if(pretenciones != "ninguna") {
        alert(`¿Qué te creés con pretenciones?, la única consideración especial aceptada es "Ninguna"`);
        return;
    };

    // Si llegó a este punto es por que todo está validado y se envía el formulario
    this.submit();
    // En este contexto, estamos "dentro" de un método "manejador de evento" perteneciente al formulario
    // Por que aunque la definamos acá, validarFuncionario es un callback que le pasamos a ese método
    // Por ese motivo "this" se refiere al formulario y this.submit() vuelve a reanudar el envío
    // (pero de algún modo ahora ya sin volver a pasar por acá, sin disparar el detector de evento)
    alert("La reserva se ha validado con éxito. Continúe enviando el mail.");
}