// Obtención del contexto del canvas (dibujo 2D)
var c = document.getElementById("Canvas");  // Obtiene el elemento canvas con id "Canvas"
var ctx = c.getContext("2d");  // Obtiene el contexto 2D para dibujar

// Variables para almacenar el tamaño del canvas
var cwidth, cheight;
// Arreglos para almacenar las 'shells' (proyectiles) y las 'pass' (partículas de la explosión)
var shells = [];
var pass = [];

// Colores disponibles para las explosiones
var colors = ['#FF5252', '#FF4081', '#E040FB', '#7C4DFF', '#536DFE', '#448AFF', '#40C4FF', '#18FFFF', '#64FFDA', '#69F0AE', '#B2FF59', '#EEFF41', '#FFFF00', '#FFD740', '#FFAB40', '#FF6E40'];

// Ajusta el tamaño del canvas cuando cambia el tamaño de la ventana
window.onresize = function() { reset(); }
reset(); // Inicializa el tamaño del canvas
function reset() {
  cwidth = window.innerWidth; // Ancho del canvas es el ancho de la ventana
  cheight = window.innerHeight; // Alto del canvas es el alto de la ventana
  c.width = cwidth;  // Asigna el nuevo ancho al canvas
  c.height = cheight;  // Asigna el nuevo alto al canvas
}

// Función para crear un nuevo proyectil ('shell')
function newShell() {
  // Determina si el proyectil va hacia la izquierda o derecha (aleatorio)
  var left = (Math.random() > 0.5);
  var shell = {}; // Objeto para el proyectil
  shell.x = (1 * left);  // Posición horizontal inicial (izquierda o derecha)
  shell.y = 1;  // Posición vertical inicial (arriba)
  shell.xoff = (0.01 + Math.random() * 0.07) * (left ? 1 : -1);  // Desplazamiento horizontal (aleatorio)
  shell.yoff = 0.01 + Math.random() * 0.007;  // Desplazamiento vertical (aleatorio)
  shell.size = Math.random() * 6 + 3;  // Tamaño del proyectil (aleatorio entre 3 y 9)
  shell.color = colors[Math.floor(Math.random() * colors.length)];  // Color aleatorio del proyectil

  // Añade el proyectil al arreglo 'shells'
  shells.push(shell);
}

// Función para crear las partículas de la explosión ('pass') de un proyectil
function newPass(shell) {
  // Número de partículas que dependerá del tamaño del proyectil
  var pasCount = Math.ceil(Math.pow(shell.size, 2) * Math.PI);

  // Crear partículas para la explosión
  for (i = 0; i < pasCount; i++) {
    var pas = {};  // Objeto para cada partícula
    pas.x = shell.x * cwidth;  // Posición horizontal de la partícula
    pas.y = shell.y * cheight;  // Posición vertical de la partícula

    // Dirección y tamaño aleatorio para la partícula
    var a = Math.random() * 4;
    var s = Math.random() * 10;
    pas.xoff = s * Math.sin((5 - a) * (Math.PI / 2));  // Desplazamiento horizontal aleatorio
    pas.yoff = s * Math.sin(a * (Math.PI / 2));  // Desplazamiento vertical aleatorio

    pas.color = shell.color;  // El color de la partícula es el mismo que el del proyectil
    pas.size = Math.sqrt(shell.size);  // El tamaño de la partícula depende del tamaño del proyectil

    // Limita el número de partículas a 1000
    if (pass.length < 1000) { pass.push(pas); }
  }
}

// Variable para controlar el tiempo de ejecución de la animación
var lastRun = 0;

// Función principal que maneja la animación
Run();
function Run() {
  var dt = 1;  // Delta time (tiempo que ha pasado entre frames)
  if (lastRun != 0) { 
    dt = Math.min(50, (performance.now() - lastRun));  // Calcula el tiempo transcurrido en milisegundos
  }
  lastRun = performance.now();  // Actualiza el tiempo de ejecución

  // Limpia el canvas con un fondo negro semitransparente (para crear un efecto de estela)
  ctx.fillStyle = "rgba(0,0,0,0.25)";
  ctx.fillRect(0, 0, cwidth, cheight);

  // Si hay menos de 10 proyectiles, crea uno nuevo aleatoriamente
  if ((shells.length < 10) && (Math.random() > 0.96)) { 
    newShell(); 
  }

  // Dibuja los proyectiles en pantalla
  for (let ix in shells) {
    var shell = shells[ix];

    // Dibuja el proyectil como un círculo
    ctx.beginPath();
    ctx.arc(shell.x * cwidth, shell.y * cheight, shell.size, 0, 2 * Math.PI);
    ctx.fillStyle = shell.color;
    ctx.fill();

    // Actualiza la posición del proyectil con el desplazamiento
    shell.x -= shell.xoff;
    shell.y -= shell.yoff;
    shell.xoff -= (shell.xoff * dt * 0.015);  // Reduce el desplazamiento horizontal con el tiempo
    shell.yoff -= ((shell.yoff + 0.2) * dt * 0.00005);  // Reduce el desplazamiento vertical

    // Si el proyectil ha llegado al límite, genera las partículas de explosión
    if (shell.yoff < -0.000505555550) {
      newPass(shell);
      shells.splice(ix, 1);  // Elimina el proyectil del arreglo
    }
  }

  // Dibuja las partículas de la explosión
  for (let ix in pass) {
    var pas = pass[ix];

    // Dibuja cada partícula como un círculo
    ctx.beginPath();
    ctx.arc(pas.x, pas.y, pas.size, 0, 2 * Math.PI);
    ctx.fillStyle = pas.color;
    ctx.fill();

    // Actualiza la posición de las partículas
    pas.x -= pas.xoff;
    pas.y -= pas.yoff;
    pas.xoff -= (pas.xoff * dt * 0.001);  // Reduce el desplazamiento horizontal
    pas.yoff -= ((pas.yoff + 5) * dt * 0.0005);  // Reduce el desplazamiento vertical
    pas.size -= (dt * 0.002 * Math.random())  // Reduce el tamaño de las partículas

    // Si las partículas salen de la pantalla o desaparecen, se eliminan
    if ((pas.y > cheight) || (pas.y < -50) || (pas.size <= 0)) {
        pass.splice(ix, 1);
    }
  }

  // Pide que se ejecute la animación en el siguiente frame
  requestAnimationFrame(Run);
}

$(document).ready(function() {
    // Tiempo de espera antes de mostrar el texto (en milisegundos)
    setTimeout(function() {
        // Muestra el contenedor de texto con el efecto de desvanecimiento
        $('.contenedorInicial').fadeIn(2000);  // 2000 milisegundos = 2 segundos
    }, 3000); // 3000 milisegundos = 3 segundos

    // Muestra un swal (SweetAlert) cuando se hace clic
    $('#iniciar').click(function() {
        $('.contenedorInicial').css('display', 'none');
        Swal.fire({
            title: 'Geniaaaal! Año 2025 iniciadoooo!!!',
            text: '¡Jun te manda un enorme abrazo 💜💜💜!',
            icon: 'success',  // Icono que muestra el mensaje (puede ser "success", "error", "warning", etc.)
            confirmButtonText: 'Devolver abrazo',  // Texto del botón de confirmación
            cancelButtonText: 'No devolver abrazo',  // Texto del botón de cancelar
            showCancelButton: true,  // Muestra el botón de cancelar
            reverseButtons: false,  // Invierte el orden de los botones (cancelar primero)
        }).then((result) => {
            if (result.isConfirmed) {
                // Acción cuando el usuario hace clic en "Devolver abrazo"
                Swal.fire({
                    title: '¡No me ha llegado 🥹!',
                    text: '¡El abrazo se ha perdido! 🥹',
                    icon: 'warning',
                    showConfirmButton: false,  // No muestra el botón de confirmación
                    timer: 2000  // Se cierra automáticamente después de 2 segundos
                }).then(() => {
                    $('.contenedorInicial').fadeIn(2000);  // 2000 milisegundos = 2 segundos
                });
            } else if (result.isDismissed) {
                // Acción cuando el usuario hace clic en "Cancelar"
                Swal.fire({
                    title: '¡Como que no 🤕!',
                    text: '¡Es porque te caigo mal verdad 😔',
                    icon: 'error',  // Usamos "error" para indicar un mal sentimiento
                    showConfirmButton: false,  // No muestra el botón de confirmación
                    timer: 2000  // Se cierra automáticamente después de 2 segundos
                }).then(() => {
                    $('.contenedorInicial').fadeIn(2000);  // 2000 milisegundos = 2 segundos
                });
            }
        });
    });
});