// Firebase configuration and initialization
const firebaseConfig = {
    apiKey: "AIzaSyCcEL2HPZYPkb9JZJF3heXeS7UNFuHyMgw",
    authDomain: "vg-sport.firebaseapp.com",
    projectId: "vg-sport",
    storageBucket: "vg-sport.appspot.com",
    messagingSenderId: "346733324533",
    appId: "1:346733324533:web:85034f6b0461d65926fdbc"
};
firebase.initializeApp(firebaseConfig);

// Firestore and Storage references
const db = firebase.firestore();
const storage = firebase.storage();

// Authentication state listener to update login information
firebase.auth().onAuthStateChanged(user => {
    const userLink = document.getElementById("a");
    
    if (user) {
        const name = user.email.replace("@gmail.com", "");
        userLink.innerHTML = name;
        userLink.setAttribute("href", "pages/User/index.html");
    } else {
        userLink.innerHTML = "Iniciar Sessão";
        userLink.setAttribute("href", "pages/Login/login.html");
    }
});

// Prevent default action and redirect based on login status
document.getElementById("a").addEventListener("click", function(event) {
    const user = firebase.auth().currentUser;
    if (!user) {
        window.location.href = "pages/Login/login.html"; // Redirect to login if not logged in
    } else {
        window.location.href = "pages/User/index.html"; // Redirect to user page if logged in
    }
});

function carregarProdutos() {
    const container = document.getElementById('produtos-container');

    db.collection('produtos').get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            const produto = doc.data();

            const produtoFrame = document.createElement('div');
            produtoFrame.classList.add('produto-frame');

            const produtoDiv = document.createElement('div');
            produtoDiv.classList.add('produto');

            const img = document.createElement('img');
            img.src = produto.imagemUrl;
            img.alt = produto.nome;

            const nome = document.createElement('h2');
            nome.classList.add('nome');
            nome.textContent = produto.nome;

            const descricao = document.createElement('p');
            descricao.classList.add('descricao');
            descricao.textContent = produto.descricao;

            const valor = document.createElement('p');
            valor.classList.add('valor');
            valor.textContent = `R$ ${produto.preco}`;

            produtoDiv.appendChild(img);
            produtoDiv.appendChild(nome);
            produtoDiv.appendChild(descricao);
            produtoDiv.appendChild(valor);

            produtoFrame.appendChild(produtoDiv);
            container.appendChild(produtoFrame);
        });
    }).catch((error) => {
        console.log("Erro ao carregar produtos: ", error);
    });
}

window.onload = carregarProdutos;

// Function to display products in the "Destaques" section
function displayProductInDestaques(productData) {
    const container = document.getElementById('produtos-container');

    const productDiv = document.createElement('div');
    productDiv.classList.add('Produto');

    const productImage = document.createElement('img');
    const photoPath = `images/${productData.foto}.jpeg`;
    const photoRef = storage.ref(photoPath);

    photoRef.getDownloadURL().then((url) => {
        productImage.src = url;
        productImage.style.width = "200px";
        productImage.style.height = "100px";
    }).catch((error) => {
        console.error("Erro ao carregar a imagem:", error);
    });

    const productInfoDiv = document.createElement('div');
    productInfoDiv.classList.add('infor');

    const productName = document.createElement('h1');
    productName.classList.add('nome');
    productName.innerHTML = productData.nome;

    const productPrice = document.createElement('h1');
    productPrice.classList.add('valor');
    productPrice.innerHTML = `R$: ${productData.valor}`;

    productInfoDiv.appendChild(productName);
    productInfoDiv.appendChild(productPrice);
    productDiv.appendChild(productImage);
    productDiv.appendChild(productInfoDiv);

    container.appendChild(productDiv);
}

db.collection("sapatos").get().then((querySnapshot) => {
    if (querySnapshot.empty) {
        console.log("Nenhum produto encontrado!");
        const container = document.getElementById('produtos-container');
        const noProductsMessage = document.createElement('p');
        noProductsMessage.textContent = "Nenhum produto disponível no momento.";
        container.appendChild(noProductsMessage);
    } else {
        querySnapshot.forEach((doc) => {
            if (doc.exists) {
                const productData = doc.data();
                displayProductInDestaques(productData);
            } else {
                console.log("Documento não encontrado!");
            }
        });
    }
}).catch((error) => {
    console.error("Erro ao obter documentos:", error);
});
