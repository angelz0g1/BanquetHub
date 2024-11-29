// Importar funciones necesarias desde Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import { getFirestore, setDoc, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

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

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

// Función para mostrar mensajes en pantalla
function showMessage(message, divId) {
    const messageDiv = document.getElementById(divId);
    messageDiv.style.display = "block";
    messageDiv.innerHTML = message;
    messageDiv.style.opacity = 1;
    setTimeout(() => {
        messageDiv.style.opacity = 0;
    }, 5000);
}



// Registro de nuevo usuario
const signUp = document.getElementById('submitSignUp');
signUp.addEventListener('click', (event) => {
    event.preventDefault();
    const email = document.getElementById('rEmail').value;
    const password = document.getElementById('rPassword').value;
    const firstName = document.getElementById('fName').value;
    const lastName = document.getElementById('lName').value;

    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        const user = userCredential.user;
        const userData = {
            email: email,
            firstName: firstName,
            lastName: lastName
        };
        showMessage('Cuenta creada exitosamente', 'signUpMessage');

        const docRef = doc(db, "users", user.uid);
        setDoc(docRef, userData)
        .then(() => {
            // Guardar datos en localStorage
            localStorage.setItem('profileName', `${firstName} ${lastName}`);
            localStorage.setItem('profilePicture', 'default-avatar.jpg');
            localStorage.setItem('loggedInUserId', user.uid);
            window.location.href = 'homepage.html';
        })
        .catch((error) => {
            console.error("Error al escribir el documento", error);
        });
    })
    .catch((error) => {
        const errorCode = error.code;
        showMessage(errorCode === 'auth/email-already-in-use' ? 'El correo ya está en uso' : 'No se pudo crear el usuario', 'signUpMessage');
    });
});

// Inicio de sesión de usuario existente
const signIn = document.getElementById('submitSignIn');
signIn.addEventListener('click', (event) => {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        const user = userCredential.user;
        const userDocRef = doc(db, "users", user.uid);

        getDoc(userDocRef).then((docSnap) => {
            if (docSnap.exists()) {
                const userData = docSnap.data();
                localStorage.setItem('profileName', `${userData.firstName} ${userData.lastName}`);
                localStorage.setItem('profilePicture', userData.profilePicture || 'default-avatar.jpg');
                localStorage.setItem('loggedInUserId', user.uid);
                showMessage('Inicio de sesión exitoso', 'signInMessage');
                window.location.href = 'homepage.html';
            }
        }).catch(error => {
            console.error("Error al obtener el perfil:", error);
        });
    })
    .catch((error) => {
        const errorCode = error.code;
        showMessage(errorCode === 'auth/invalid-credential' ? 'Correo o contraseña incorrectos' : 'La cuenta no existe', 'signInMessage');
    });
});

// Función de cerrar sesión (asegúrate de añadir el botón con el ID 'logoutBtn' en cada página que necesite esta funcionalidad)
document.getElementById('logoutBtn')?.addEventListener('click', () => {
    auth.signOut().then(() => {
        localStorage.removeItem('loggedInUserId');
        localStorage.removeItem('profileName');
        localStorage.removeItem('profilePicture');
        window.location.href = 'login.html';
    });
});
