import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import { getFirestore, collection, addDoc, onSnapshot, query, where, orderBy, doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-storage.js";

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

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();
const storage = getStorage();

onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log("Usuario autenticado:", user.uid); // Depuración

        const userId = user.uid;
        const userDocRef = doc(db, "users", userId);
        
        // Cargar perfil de usuario
        getDoc(userDocRef).then((docSnap) => {
            if (docSnap.exists()) {
                const userData = docSnap.data();
                document.getElementById('loggedUserFName').innerText = userData.firstName;
                document.getElementById('loggedUserLName').innerText = userData.lastName;
                document.getElementById('loggedUserEmail').innerText = userData.email;
                document.getElementById('profileImage').src = userData.profilePicture || "default-avatar.jpg";
                document.getElementById('bioDisplay').innerText = userData.bio || "Agrega una descripción a tu perfil.";
                document.getElementById('bioInput').value = userData.bio || "";
            }
        }).catch(error => {
            console.error("Error al cargar el perfil:", error);
        });

        // Funcionalidad para editar la biografía
        const bioDisplay = document.getElementById('bioDisplay');
        const bioInput = document.getElementById('bioInput');
        const editBioBtn = document.getElementById('editBioBtn');
        const saveBioBtn = document.getElementById('saveBioBtn');

        editBioBtn.addEventListener('click', () => {
            bioDisplay.style.display = 'none';
            bioInput.style.display = 'block';
            saveBioBtn.style.display = 'inline';
            editBioBtn.style.display = 'none';
        });

        saveBioBtn.addEventListener('click', async () => {
            const newBio = bioInput.value;
            try {
                await updateDoc(userDocRef, { bio: newBio });
                bioDisplay.innerText = newBio;
                bioDisplay.style.display = 'block';
                bioInput.style.display = 'none';
                saveBioBtn.style.display = 'none';
                editBioBtn.style.display = 'inline';
                alert("Descripción guardada exitosamente.");
            } catch (error) {
                console.error("Error al guardar la biografía:", error);
            }
        });

        // Funcionalidad para crear publicaciones
        document.getElementById('publishPostBtn').addEventListener('click', async () => {
            const postText = document.getElementById('postText').value;
            const postImageFile = document.getElementById('postImage').files[0];
            if (!postText && !postImageFile) {
                alert("Escribe algo o selecciona una imagen para publicar.");
                return;
            }

            let imageUrl = "";
            if (postImageFile) {
                const imageRef = ref(storage, `postImages/${userId}/${Date.now()}_${postImageFile.name}`);
                const snapshot = await uploadBytes(imageRef, postImageFile);
                imageUrl = await getDownloadURL(snapshot.ref);
            }

            try {
                await addDoc(collection(db, "posts"), {
                    userId: userId,
                    text: postText,
                    imageUrl: imageUrl,
                    timestamp: new Date()
                });
                document.getElementById('postText').value = '';
                document.getElementById('postImage').value = '';
                alert("¡Publicación creada exitosamente!");
            } catch (error) {
                console.error("Error al crear la publicación:", error);
            }
        });

        // Función para mostrar publicaciones en tiempo real
        function loadPosts() {
            console.log("Cargando publicaciones para el usuario:", userId); // Depuración
            const postsContainer = document.getElementById('postsContainer');
            const postsQuery = query(
                collection(db, "posts"),
                where("userId", "==", userId), // Filtro para cargar solo las publicaciones del usuario actual
                orderBy("timestamp", "desc")
            );

            onSnapshot(postsQuery, (snapshot) => {
                postsContainer.innerHTML = '';
                snapshot.forEach((doc) => {
                    const postData = doc.data();
                    const postElement = document.createElement('div');
                    postElement.classList.add('post');

                    const postText = document.createElement('p');
                    postText.textContent = postData.text || "";
                    postElement.appendChild(postText);

                    if (postData.imageUrl) {
                        const postImage = document.createElement('img');
                        postImage.src = postData.imageUrl;
                        postImage.alt = "Imagen de la publicación";
                        postImage.classList.add('post-image');
                        postElement.appendChild(postImage);
                    }

                    postsContainer.appendChild(postElement);
                });

                if (snapshot.empty) {
                    console.log("No se encontraron publicaciones para este usuario."); // Depuración
                } else {
                    console.log("Publicaciones cargadas exitosamente."); // Depuración
                }
            }, (error) => {
                console.error("Error al cargar las publicaciones:", error);
            });
        }

        // Cargar publicaciones cuando el usuario está autenticado
        loadPosts();

        // Funcionalidad para cerrar sesión
        document.getElementById('logout').addEventListener('click', () => {
            signOut(auth).then(() => {
                localStorage.removeItem('profilePicture');
                window.location.href = 'login.html';
            });
        });

        // Funcionalidad para cargar foto de perfil
        document.getElementById('uploadPicBtn').addEventListener('click', () => {
            document.getElementById('uploadProfilePic').click();
        });

        document.getElementById('uploadProfilePic').addEventListener('change', async (event) => {
            const file = event.target.files[0];
            if (file) {
                const imageRef = ref(storage, `profilePictures/${userId}`);
                try {
                    await uploadBytes(imageRef, file);
                    const downloadURL = await getDownloadURL(imageRef);
                    await updateDoc(userDocRef, { profilePicture: downloadURL });
                    document.getElementById('profileImage').src = downloadURL;
                    alert("¡Foto de perfil actualizada exitosamente!");
                } catch (error) {
                    console.error("Error al subir la foto de perfil:", error);
                    alert("Ocurrió un error al subir la foto de perfil.");
                }
            }
        });

        // Funcionalidad para ir a la página de inicio
        document.getElementById('goToHome').addEventListener('click', () => {
            window.location.href = 'index.html';
        });

    } else {
        console.log("Usuario no autenticado, redirigiendo a la página de login."); // Depuración
        window.location.href = 'login.html';
    }
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
