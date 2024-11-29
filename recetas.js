firebase.initializeApp({
    apiKey: "AIzaSyAKttRWq4B9h5-pPRCgLIdcdJ23ZUloxZQ",
    authDomain: "banquethub-a389a.firebaseapp.com",
    projectId: "banquethub-a389a",
    storageBucket: "banquethub-a389a.appspot.com"
});

var db = firebase.firestore();
var storage = firebase.storage();

// Función para guardar receta con imagen y tipo de platillo
function guardar() {
    var nplatillo = document.getElementById('platillo').value;
    var nporcion = document.getElementById('porcion').value;
    var ningredientes = document.getElementById('ingredientes').value;
    var ntiempo = document.getElementById('tiempo').value;
    var ntipoPlatillo = document.getElementById('tipoPlatillo').value; // Nuevo campo de tipo de platillo
    var imagenFile = document.getElementById('imagen').files[0];

    if (imagenFile) {
        var storageRef = storage.ref('recetas/' + imagenFile.name);
        var uploadTask = storageRef.put(imagenFile);

        uploadTask.on('state_changed', null, (error) => {
            console.error("Error al cargar la imagen: ", error);
        }, () => {
            uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                db.collection("recetas").add({
                    platillo: nplatillo,
                    porciones: nporcion,
                    ingredientes: ningredientes,
                    tiempo: ntiempo,
                    tipoPlatillo: ntipoPlatillo, // Guardar tipo de platillo en Firestore
                    imagenURL: downloadURL,
                    imagenRef: 'recetas/' + imagenFile.name
                })
                .then((docRef) => {
                    console.log("Documento escrito con ID: ", docRef.id);
                    document.getElementById('platillo').value = '';
                    document.getElementById('porcion').value = '';
                    document.getElementById('ingredientes').value = '';
                    document.getElementById('tiempo').value = '';
                    document.getElementById('tipoPlatillo').value = '';
                    document.getElementById('imagen').value = '';
                })
                .catch((error) => {
                    console.error("Error al agregar documento: ", error);
                });
            });
        });
    } else {
        console.error("No se ha seleccionado una imagen.");
    }
}

// Función para mostrar recetas con el tipo de platillo
var ntabla = document.getElementById('tabla');
db.collection("recetas").onSnapshot((querySnapshot) => {
    ntabla.innerHTML = '';
    querySnapshot.forEach((doc) => {
        const data = doc.data();
        ntabla.innerHTML += `
        <tr>
            <th scope="row">${doc.id}</th>
            <td>${data.platillo}</td>
            <td>${data.porciones}</td>
            <td>${data.ingredientes}</td>
            <td>$${data.tiempo}MXN</td>
            <td>${data.tipoPlatillo}</td> <!-- Mostrar el tipo de platillo en la tabla -->
            <td><img src="${data.imagenURL}" alt="${data.platillo}" style="width: 100px; height: auto;"></td>
            <td><button class="btn btn-danger" onclick="eliminar('${doc.id}', '${data.imagenRef}')">Eliminar</button></td>
            <td><button class="btn btn-warning" onclick="editar('${doc.id}', '${data.platillo}', '${data.porciones}', '${data.ingredientes}', '${data.tiempo}', '${data.tipoPlatillo}', '${data.imagenRef}')">Editar</button></td>
        </tr>
        `;
    });
});

// Función para editar una receta con actualización de imagen opcional
function editar(id, nplatillo, nporcion, ningredientes, ntiempo, ntipoPlatillo, imagenRef) {
    document.getElementById('platillo').value = nplatillo;
    document.getElementById('porcion').value = nporcion;
    document.getElementById('ingredientes').value = ningredientes;
    document.getElementById('tiempo').value = ntiempo;
    document.getElementById('tipoPlatillo').value = ntipoPlatillo; // Asignar el valor del tipo de platillo
    document.getElementById('imagen').value = '';

    var boton = document.getElementById('boton');
    boton.innerHTML = 'Guardar Cambios';
    boton.onclick = function () {
        var platillo = document.getElementById('platillo').value;
        var porcion = document.getElementById('porcion').value;
        var ingredientes = document.getElementById('ingredientes').value;
        var tiempo = document.getElementById('tiempo').value;
        var tipoPlatillo = document.getElementById('tipoPlatillo').value;
        var nuevaImagenFile = document.getElementById('imagen').files[0];
        var docRef = db.collection("recetas").doc(id);

        if (nuevaImagenFile) {
            var nuevoStorageRef = storage.ref('recetas/' + nuevaImagenFile.name);
            nuevoStorageRef.put(nuevaImagenFile).then((snapshot) => {
                snapshot.ref.getDownloadURL().then((newDownloadURL) => {
                    storage.ref(imagenRef).delete(); // Borrar la imagen antigua
                    docRef.update({
                        platillo: platillo,
                        porciones: porcion,
                        ingredientes: ingredientes,
                        tiempo: tiempo,
                        tipoPlatillo: tipoPlatillo,
                        imagenURL: newDownloadURL,
                        imagenRef: 'recetas/' + nuevaImagenFile.name
                    });
                });
            });
        } else {
            docRef.update({
                platillo: platillo,
                porciones: porcion,
                ingredientes: ingredientes,
                tiempo: tiempo,
                tipoPlatillo: tipoPlatillo
            });
        }
        
        boton.innerHTML = 'Agregar';
        boton.onclick = guardar;
        document.getElementById('platillo').value = '';
        document.getElementById('porcion').value = '';
        document.getElementById('ingredientes').value = '';
        document.getElementById('tiempo').value = '';
        document.getElementById('tipoPlatillo').value = '';
        document.getElementById('imagen').value = '';
    };
}

// Función para eliminar una receta y su imagen
function eliminar(id, imagenRef) {
    db.collection("recetas").doc(id).delete().then(() => {
        if (imagenRef) {
            storage.ref(imagenRef).delete().then(() => {
                console.log("Imagen eliminada correctamente.");
            }).catch((error) => {
                console.error("Error al eliminar la imagen: ", error);
            });
        }
        console.log("Receta eliminada correctamente.");
    }).catch((error) => {
        console.error("Error al eliminar la receta: ", error);
    });
}