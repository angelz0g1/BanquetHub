
//NAVBAR
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

const testimonials = [
    {
        text: '"BanquetHub hizo que planificar nuestro evento fuera muy fácil y eficiente. ¡Definitivamente lo recomiendo!"',
        author: '- Nathan Williams',
        bgImage: 'img/chef.webp', 
        textColor: 'white'
    },
    {
        text: '"La calculadora de costos nos ayudó a mantenernos dentro del presupuesto. ¡Fantástico servicio!"',
        author: '- Laura García',
        bgImage: 'img/chefmujer.webp', 
        textColor: 'white'
    },
    {
        text: '"El soporte en vivo fue increíble, resolvieron todas nuestras dudas en minutos."',
        author: '- Miguel López',
        bgImage: 'img/persona2.jpg', 
        textColor: 'white'
    }
];

let currentIndex = 0;

function showTestimonial() {
    const testimonialText = document.getElementById('testimonial-text');
    const testimonialAuthor = document.getElementById('testimonial-author');
    const testimonialsContainer = document.querySelector('.testimonials');

    // Cambiar texto y autor del testimonio
    testimonialText.innerHTML = testimonials[currentIndex].text;
    testimonialAuthor.innerHTML = testimonials[currentIndex].author;

    // Cambiar la imagen de fondo del pseudo-elemento antes
    testimonialsContainer.style.setProperty('--bg-image', `url(${testimonials[currentIndex].bgImage})`);
    
    // Cambiar color del texto
    testimonialsContainer.style.color = testimonials[currentIndex].textColor;

    // Mover al siguiente testimonio
    currentIndex++;
    if (currentIndex >= testimonials.length) {
        currentIndex = 0; // Reiniciar ciclo
    }

    // Cambiar de testimonio cada 5 segundos
    setTimeout(showTestimonial, 5000);
}

// Iniciar el slider
showTestimonial();

// Obtener el modal
var modal = document.getElementById("contactModal");

// Obtener el botón que abre el modal
var btn = document.getElementById("contactButton");

// Obtener el <span> que cierra el modal
var span = document.getElementsByClassName("close")[0];

// Cuando el usuario hace clic en el botón, abre el modal
btn.onclick = function() {
    modal.style.display = "block";
}

// Cuando el usuario hace clic en <span> (x), cierra el modal
span.onclick = function() {
    modal.style.display = "none";
}

// Cuando el usuario hace clic fuera del modal, también se cierra
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

//Modal menu
// Obtener el modal de menu
var menuModal = document.getElementById("menuModal");

// Obtener el botón que abre el modal de menu
var menuButton = document.getElementById("menuButton");

// Obtener el <span> que cierra el modal de menu
var closeMenu = document.getElementsByClassName("close")[1];

// Cuando el usuario hace clic en el botón, abre el modal de menu
menuButton.onclick = function() {
    menuModal.style.display = "block";
}

// Cuando el usuario hace clic en <span> (x), cierra el modal de menu
closeMenu.onclick = function() {
    menuModal.style.display = "none";
}







/*
// Mostrar el formulario con transición suave
document.getElementById('openFormBtn').addEventListener('click', function() {
    var form = document.getElementById('registrationForm');
    form.classList.add('show');
    form.classList.remove('hidden');
});

// Ocultar el formulario con transición suave
document.getElementById('closeFormBtn').addEventListener('click', function() {
    var form = document.getElementById('registrationForm');
    form.classList.remove('show');
    setTimeout(function() {
        form.classList.add('hidden'); // Añade 'hidden' después de la transición
    }, 500); // Espera la duración de la transición (0.5s)
});
*/



