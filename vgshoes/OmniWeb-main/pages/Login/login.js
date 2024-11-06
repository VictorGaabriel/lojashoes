const firebaseConfig = {
    apiKey: "AIzaSyCcEL2HPZYPkb9JZJF3heXeS7UNFuHyMgw", // Sua chave API
    authDomain: "vg-sport.firebaseapp.com",
    databaseURL: "https://vg-sport-default-rtdb.firebaseio.com",
    projectId: "vg-sport",
    storageBucket: "vg-sport.appspot.com",
    messagingSenderId: "346733324533",
    appId: "1:346733324533:web:85034f6b0461d65926fdbc",
    measurementId: "G-BS8DN1JBJ8"
};
firebase.initializeApp(firebaseConfig);

firebase.auth().onAuthStateChanged(user => {
    if (user) {
        window.location.href = "../../index.html";
    }
});

// Função para sair do login
function logout() {
    firebase.auth().signOut().then(() => {
        window.location.href = "../../index.html"; // Redireciona para a página inicial após sair
    }).catch((error) => {
        console.error("Erro ao sair:", error);
    });
}

// Adiciona o evento de clique ao botão de logout
document.getElementById("logout-button").addEventListener("click", logout);

function showLoading() {
    const div = document.createElement("div");
    div.classList.add("loading", "centralize");
    const label = document.createElement("label");
    label.innerText = "Carregando...";
    div.appendChild(label);
    document.body.appendChild(div);
}

function hideLoading() {
    const loadings = document.getElementsByClassName("loading");
    if (loadings.length) {
        loadings[0].remove();
    }
}

function onChangeEmail() {
    toggleButtonsDisable();
}

function onChangePassword() {
    toggleButtonsDisable();
}

function login() {
    showLoading();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    firebase.auth().signInWithEmailAndPassword(email, password).then(() => {
        hideLoading();
        window.location.href = "../../index.html";
    }).catch(error => {
        hideLoading();
        console.log(error);
        alert(getErrorMessage(error));
    });
}

function getErrorMessage(error) {
    switch (error.code) {
        case "auth/invalid-email":
            return "Email Inválido";
        case "auth/user-not-found":
            return "Usuário não encontrado";
        case "auth/wrong-password":
            return "Senha incorreta";
        default:
            return error.message;
    }
}

function register() {
    showLoading();
    const email = document.getElementById("emailReg").value;
    const password = document.getElementById("passwordReg").value;
    firebase.auth().createUserWithEmailAndPassword(email, password).then(() => {
        hideLoading();
        window.location.href = "../../index.html";
    }).catch(error => {
        hideLoading();
        alert(getErrorMessage(error));
    });
}

function recoverPassword() {
    showLoading();
    const email = document.getElementById("emailRec").value;
    firebase.auth().sendPasswordResetEmail(email).then(() => {
        hideLoading();
        alert('Email enviado com sucesso');
    }).catch(error => {
        hideLoading();
        alert("Usuário não encontrado");
    });
}

function toggleButtonsDisable() {
    const emailValid = validateEmail(document.getElementById("email").value);
    const passwordValid = document.getElementById("password").value.trim() !== "";
    document.getElementById("login-button").disabled = !emailValid || !passwordValid;
}

function validateEmail(email) {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
}
