// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAKttRWq4B9h5-pPRCgLIdcdJ23ZUloxZQ",
    authDomain: "banquethub-a389a.firebaseapp.com",
    projectId: "banquethub-a389a",
    storageBucket: "banquethub-a389a.appspot.com",
    messagingSenderId: "88688959054",
    appId: "1:88688959054:web:f15ccfa9046cdc62d56d1f",
    measurementId: "G-STJLP3HGEB"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Variables del modal y carrito
let basePrice = 0; // Precio base del platillo
let peopleCount = 1; // Número inicial de personas
let cart = [];
let total = 0;

// Función para mostrar platillos en las secciones correspondientes
function mostrarPlatillos() {
    const entradaSection = document.getElementById('entradaSection');
    const platoFuerteSection = document.getElementById('platoFuerteSection');
    const postreSection = document.getElementById('postreSection');

    db.collection("recetas").onSnapshot((querySnapshot) => {
        entradaSection.innerHTML = '';
        platoFuerteSection.innerHTML = '';
        postreSection.innerHTML = '';

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const imageUrl = data.imagenURL || 'default-image.jpg'; // Usa una imagen por defecto si no se proporciona

            const platilloHtml = `
                <div class="gallery-item">
                    <img src="${imageUrl}" alt="${data.platillo}" onclick="showModal('${data.platillo}', '${data.ingredientes}', '${data.tiempo}', '${imageUrl}', '${data.tipoPlatillo}')">
                    <p>${data.platillo}</p>
                </div>
            `;

            if (data.tipoPlatillo === "Entrada") {
                entradaSection.innerHTML += platilloHtml;
            } else if (data.tipoPlatillo === "Plato Fuerte") {
                platoFuerteSection.innerHTML += platilloHtml;
            } else if (data.tipoPlatillo === "Postre") {
                postreSection.innerHTML += platilloHtml;
            }
        });
    });
}

// Mostrar el modal con los detalles del platillo y configuración de precio por personas
function showModal(name, description, price, imageUrl, type) {
    document.getElementById('dishName').textContent = name;
    document.getElementById('dishDescription').textContent = description;
    document.getElementById('dishImage').src = imageUrl;

    basePrice = parseFloat(price); // Establecemos el precio base
    peopleCount = 1; // Reiniciamos la cantidad de personas
    updateTotalPrice(); // Calcula el precio total basado en el número de personas

    document.getElementById('dishModal').style.display = 'flex';

    document.getElementById('addToCartBtn').onclick = function() {
        addToCart(name, basePrice * peopleCount, type, peopleCount);
        closeModal();
    };
}

// Función para actualizar el precio total en el modal
function updateTotalPrice() {
    const totalPrice = basePrice * peopleCount;
    document.getElementById('dishTotalPrice').textContent = totalPrice.toFixed(2); // Precio total en el modal
    document.getElementById('peopleCount').textContent = peopleCount; // Actualiza el número de personas
}

// Funciones para aumentar o disminuir la cantidad de personas
function increasePeople() {
    peopleCount++;
    updateTotalPrice();
}

function decreasePeople() {
    if (peopleCount > 1) {
        peopleCount--;
        updateTotalPrice();
    }
}

// Función para agregar platillo al carrito con el precio total basado en el número de personas
function addToCart(dish, totalPrice, type, quantity) {
    cart.push({ dish, price: totalPrice, type, quantity });
    total += totalPrice;
    renderCart();
}

// Función para renderizar el carrito en el sidebar con categorías y cantidad de personas
function renderCart() {
    const cartDiv = document.getElementById('cart');
    const totalDisplay = document.getElementById('total');
    totalDisplay.textContent = total.toFixed(2);

    // Filtrar y organizar el carrito por tipo de platillo
    const entradas = cart.filter(item => item.type === "Entrada");
    const platosFuertes = cart.filter(item => item.type === "Plato Fuerte");
    const postres = cart.filter(item => item.type === "Postre");

    cartDiv.innerHTML = `
        ${entradas.length > 0 ? `<h3>Platillos de Entrada</h3><ul>${entradas.map(item => `<li>${item.dish} x ${item.quantity} personas - $${item.price.toFixed(2)} MXN</li>`).join('')}</ul>` : ''}
        ${platosFuertes.length > 0 ? `<h3>Plato Fuerte</h3><ul>${platosFuertes.map(item => `<li>${item.dish} x ${item.quantity} personas - $${item.price.toFixed(2)} MXN</li>`).join('')}</ul>` : ''}
        ${postres.length > 0 ? `<h3>Postres</h3><ul>${postres.map(item => `<li>${item.dish} x ${item.quantity} personas - $${item.price.toFixed(2)} MXN</li>`).join('')}</ul>` : ''}
    `;

    if (cart.length === 0) {
        cartDiv.innerHTML = '<p>Tu carrito está vacío.</p>';
    }
}

// Cerrar el modal
function closeModal() {
    document.getElementById('dishModal').style.display = 'none';
}

// Función para abrir y cerrar el sidebar del carrito
document.getElementById('cartButton').addEventListener('click', () => {
    const cartSidebar = document.getElementById('cartSidebar');
    cartSidebar.classList.add('open'); // Abre el sidebar
    document.getElementById('cartButton').classList.add('hidden'); // Oculta el botón del carrito
});

// Cerrar el sidebar con el botón de cierre
document.getElementById('closeSidebar').addEventListener('click', () => {
    document.getElementById('cartSidebar').classList.remove('open');
    document.getElementById('cartButton').classList.remove('hidden'); // Muestra el botón del carrito
});

// Enviar la orden a Firebase Firestore
function submitOrder() {
    const loggedInUserId = localStorage.getItem('loggedInUserId');

    if (loggedInUserId) {
        const orderData = {
            userId: loggedInUserId,
            cart: cart,
            total: total,
            date: new Date()
        };

        db.collection("orders").doc(loggedInUserId + "_" + Date.now()).set(orderData)
            .then(() => {
                alert("¡Orden enviada exitosamente!");
                cart = [];
                total = 0;
                renderCart(); // Limpiar el carrito después de enviar la orden
            })
            .catch((error) => {
                console.error("Error al enviar la orden:", error);
            });
    } else {
        alert("Por favor, inicia sesión para enviar tu orden.");
    }
}

// Inicializar función para mostrar platillos
mostrarPlatillos();



// Evento para enviar la orden
document.getElementById('submitOrderBtn').addEventListener('click', submitOrder);
