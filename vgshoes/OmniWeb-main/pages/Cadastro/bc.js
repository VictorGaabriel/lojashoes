// Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyCcEL2HPZYPkb9JZJF3heXeS7UNFuHyMgw",
    authDomain: "vg-sport.firebaseapp.com",
    databaseURL: "https://vg-sport-default-rtdb.firebaseio.com",
    projectId: "vg-sport",
    storageBucket: "vg-sport.appspot.com",
    messagingSenderId: "346733324533",
    appId: "1:346733324533:web:85034f6b0461d65926fdbc",
    measurementId: "G-BS8DN1JBJ8"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const storage = firebase.storage();

// Verificar autenticação
firebase.auth().onAuthStateChanged(user => {
    if (user) {
        var name = user.email.replace("@gmail.com", "");
        document.getElementById("a").innerHTML = name;
        var link = document.getElementById("a");
        link.setAttribute("href", "pages/User/user.html");
        console.log(user);
    } else {
        document.getElementById("a").innerHTML = "Iniciar Sessão";
    }
});

// Função cadastrar
function cadastrar() {
    const nome = document.getElementById("nome").value;
    const id = document.getElementById("id").value;
    const valor = document.getElementById("valor").value;
    const desc = document.getElementById("desc").value;
    const foto = document.getElementById("foto").files[0];

    // Upload da foto
    const storageref = firebase.storage().ref();
    const fotoref = storageref.child(`images/${nome}.jpeg`);

    fotoref.put(foto).then(snapshot => {
        return snapshot.ref.getDownloadURL();
    }).then(fotoURL => {
        db.collection("sapatos").doc(id).set({
            desc: desc,
            valor: valor,
            foto: nome,
            nome: nome,
            id: id
        });
    }).catch(error => {
        console.error("Erro ao cadastrar: ", error);
    });

    alert("Produto cadastrado");
    document.getElementById("nome").value = "";
    document.getElementById("id").value = "";
    document.getElementById("valor").value = 0;
    document.getElementById("desc").value = "";
    document.getElementById("foto").value = "";
}

// Função pesquisar
function pesquisar() {
    const id = document.getElementById("id_p").value;

    db.collection("sapatos").doc(id).get().then(function (doc) {
        if (doc.exists) {
            const dados = doc.data();
            document.getElementById("desc_p").value = dados.desc;
            document.getElementById("valor_p").value = dados.valor;
            document.getElementById("nome_p").value = dados.nome;

            const div = document.getElementById("image");
            const photoPath = `images/${dados.foto}.jpeg`;
            const photoRef = storage.ref(photoPath);

            photoRef.getDownloadURL().then((url) => {
                const img = document.getElementById("img");
                img.src = url;
                img.style.width = "100%";
                div.appendChild(img);
            }).catch((error) => {
                console.error("Erro ao carregar a imagem: ", error);
            });
        } else {
            alert("Esse documento não existe");
        }
    }).catch((error) => {
        console.error("Erro ao buscar documento: ", error);
    });
}

// Função alterar
function alterar() {
    const nome = document.getElementById("nome_p").value;
    const id = document.getElementById("id_p").value;
    const valor = document.getElementById("valor_p").value;
    const desc = document.getElementById("desc_p").value;

    const storageref = firebase.storage().ref();
    const fotoref = storageref.child(`images/${nome}.jpge`);

    fotoref.put(foto).then(snapshot => {
        return snapshot.ref.getDownloadURL();
    }).then(fotoURL => {
        db.collection("sapatos").doc(id).update({
            desc: desc,
            valor: valor,
            foto: nome,
            nome: nome,
            id: id
        });
    }).catch(error => {
        console.error("Erro ao alterar: ", error);
    });

    alert("Produto alterado");
}
