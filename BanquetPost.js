import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import { getFirestore, collection, query, orderBy, limit, getDocs, startAfter, doc } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

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
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

let lastVisible = null; // Último documento cargado para la paginación
let usersData = {}; // Caché de datos de usuario
let isLoading = false; // Bandera para controlar cargas múltiples

// Función para cargar todos los usuarios y almacenarlos en un mapa
async function loadUsers() {
    const usersSnapshot = await getDocs(collection(db, "users"));
    usersSnapshot.forEach(doc => {
        usersData[doc.id] = doc.data(); // Mapeo de ID de usuario a datos de usuario
    });
}

// Función para cargar publicaciones
async function loadPosts() {
    if (isLoading) return; // Si ya estamos cargando, salir de la función
    isLoading = true; // Establecer bandera para evitar cargas múltiples

    const postsContainer = document.getElementById("postsContainer");
    const postsRef = collection(db, "posts");
    let postsQuery = query(postsRef, orderBy("timestamp", "desc"), limit(5));

    if (lastVisible) {
        postsQuery = query(postsRef, orderBy("timestamp", "desc"), startAfter(lastVisible), limit(5));
    }

    const snapshot = await getDocs(postsQuery);

    if (!snapshot.empty) {
        lastVisible = snapshot.docs[snapshot.docs.length - 1];

        snapshot.forEach((doc) => {
            const post = doc.data();
            const postElement = document.createElement("div");
            postElement.classList.add("post");

            // Obtener datos de usuario desde el caché
            const userData = usersData[post.userId] || {};

            // Crear contenedor para la información del usuario
            const userInfoElement = document.createElement("div");
            userInfoElement.classList.add("user-info");

            // Crear imagen de perfil
            const userImage = document.createElement("img");
            userImage.classList.add("user-image");
            userImage.src = userData.profilePicture || "default-avatar.jpg";

            // Crear nombre del usuario
            const userName = document.createElement("span");
            userName.classList.add("user-name");
            userName.textContent = `${userData.firstName || "Nombre"} ${userData.lastName || "Apellido"}`;

            // Añadir imagen y nombre al contenedor de información de usuario
            userInfoElement.appendChild(userImage);
            userInfoElement.appendChild(userName);

            // Agregar información de usuario al elemento de la publicación
            postElement.appendChild(userInfoElement);

            // Agregar el texto de la publicación
            const postText = document.createElement("p");
            postText.classList.add("post-text");
            postText.textContent = post.text || "";
            postElement.appendChild(postText);

            // Agregar imagen de la publicación, si existe
            if (post.imageUrl) {
                const postImage = document.createElement("img");
                postImage.classList.add("post-image");
                postImage.src = post.imageUrl;
                postElement.appendChild(postImage);
            }

            postsContainer.appendChild(postElement);
        });
    }
    
    isLoading = false; // Restablecer bandera después de que la carga esté completa
}

// Cargar usuarios una sola vez y luego cargar publicaciones
window.onload = async () => {
    await loadUsers();
    loadPosts();
};

// Cargar más publicaciones al hacer scroll
window.addEventListener("scroll", () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
        loadPosts();
    }
});

// Funcionalidad para cerrar sesión
document.getElementById('logout').addEventListener('click', () => {
    signOut(auth).then(() => {
        localStorage.removeItem('profilePicture');
        window.location.href = 'login.html';
    });
});

// Funcionalidad para ir a la página de inicio
document.getElementById('goToHome').addEventListener('click', () => {
    window.location.href = 'index.html';
});

// Botón del menú
document.getElementById('menuButton').addEventListener('click', () => {
    const menuDropdown = document.getElementById('menuDropdown');
    menuDropdown.style.display = menuDropdown.style.display === 'block' ? 'none' : 'block';
});

// Oculta el menú cuando se hace clic fuera de él
window.addEventListener('click', (event) => {
    const menuButton = document.getElementById('menuButton');
    const menuDropdown = document.getElementById('menuDropdown');
    
    if (event.target !== menuButton && !menuButton.contains(event.target) && !menuDropdown.contains(event.target)) {
        menuDropdown.style.display = 'none';
    }
});