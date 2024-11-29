// Importaciones de Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import { getFirestore, collection, query, orderBy, getDocs } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

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

// Inicialización de Firebase
const app = initializeApp(firebaseConfig);  // Inicializa Firebase con la configuración especificada
const auth = getAuth();                    // Obtiene el servicio de autenticación
const db = getFirestore();                 // Obtiene el servicio de Firestore

// Referencia al cuerpo de la tabla donde se mostrarán las órdenes
const ordersTableBody = document.querySelector("#ordersTable tbody");

// Función para cargar todas las órdenes desde Firestore y mostrarlas en la tabla
async function loadOrders() {
    try {
        // Referencia a la colección "orders" en Firestore
        const ordersRef = collection(db, "orders");

        // Crea una consulta para ordenar las órdenes por fecha (descendente)
        const ordersQuery = query(
            ordersRef,
            orderBy("date", "desc")  // Ordena por fecha en orden descendente
        );

        // Ejecuta la consulta y obtiene un snapshot de todos los documentos en la colección
        const querySnapshot = await getDocs(ordersQuery);

        // Itera sobre cada documento en el snapshot
        querySnapshot.forEach((doc) => {
            const orderData = doc.data();  // Obtiene los datos de la orden
            const { cart, date, total, userId } = orderData;  // Desestructura los campos de la orden

            // Convierte la fecha de Firebase a un formato legible
            const orderDate = new Date(date.seconds * 1000).toLocaleString();

            // Crea una lista de los elementos del carrito en formato "platillo - precio"
            const cartDetails = cart.map(item => `${item.dish} - $${item.price}`).join('<br>');

            // Crea una nueva fila en la tabla con los datos de la orden
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${userId}</td>
                <td>${orderDate}</td>
                <td>$${total}</td>
                <td>${cartDetails}</td>
            `;

            // Agrega la fila al cuerpo de la tabla
            ordersTableBody.appendChild(row);
        });

    } catch (error) {
        console.error("Error al cargar órdenes:", error);  // Muestra el error en la consola si ocurre alguno
    }
}

// Llama a la función para cargar las órdenes al iniciar la página
loadOrders();

// Evento para cerrar sesión
document.getElementById('logout').addEventListener('click', () => {
    signOut(auth).then(() => {
        localStorage.removeItem('profilePicture');  // Remueve la imagen de perfil guardada en el almacenamiento local
        window.location.href = 'login.html';        // Redirecciona a la página de login
    });
});

// Evento para ir a la página principal
document.getElementById('goToHome').addEventListener('click', () => {
    window.location.href = 'index.html';  // Redirecciona a la página de inicio
});

// Evento para mostrar/ocultar el menú desplegable
document.getElementById('menuButton').addEventListener('click', () => {
    const menuDropdown = document.getElementById('menuDropdown');
    // Alterna la visibilidad del menú desplegable
    menuDropdown.style.display = menuDropdown.style.display === 'block' ? 'none' : 'block';
});

// Evento para cerrar el menú desplegable al hacer clic fuera de él
window.addEventListener('click', (event) => {
    const menuButton = document.getElementById('menuButton');
    const menuDropdown = document.getElementById('menuDropdown');
    
    // Cierra el menú si el clic se realiza fuera del botón o del menú desplegable
    if (event.target !== menuButton && !menuButton.contains(event.target) && !menuDropdown.contains(event.target)) {
        menuDropdown.style.display = 'none';
    }
});
