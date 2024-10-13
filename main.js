
//NAVBAR
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});
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



