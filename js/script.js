/*
    Atenção: neste teste, estamos colocando a apiKey no JS do front-end.
    Isso é uma falha de segurança. O ideal é colocá-lo no back-end (NodeJS, por exemplo) e,
    a partir de uma API construída para a aplicação, fazer o acesso ao Firebase.
*/

// Initialize Firebase
var config = {
apiKey: "AIzaSyAIWqnR2BvX9y6i_zzTx6D613s92k6gaYU",
authDomain: "hospital-infantil-ff230.firebaseapp.com",
databaseURL: "https://hospital-infantil-ff230.firebaseio.com",
projectId: "hospital-infantil-ff230",
storageBucket: "hospital-infantil-ff230.appspot.com",
messagingSenderId: "173783525224"
};
firebase.initializeApp(config);

let repositorio = new Repositorio();

let menuLogin = document.querySelector("#login");
let menuLogout = document.querySelector("#logout");
let menuNovo = document.querySelector("#novo");
let menuVoltar = document.querySelector("#voltar");
let menuLoading = document.querySelector("#loading");
let divMensagem = document.querySelector("div.mensagem");
let divErro = document.querySelector("div.erro");
let divTabela = document.querySelector("#listagem");
let tabela = document.querySelector("#listagem > table");
let loadingTabela = document.querySelector("#listagem > img");
let formulario = document.querySelector("#formulario");
let botaoExcluir = document.querySelector('#excluir');
let inputImagem = document.querySelector('#imagem');

inputImagem.addEventListener('change', readFile);

menuLogin.addEventListener('click',function(){
    login();
});

menuLogout.addEventListener('click',function(){
    logout();
});

menuNovo.addEventListener('click',function(){
    limparFormulario();
    toggle();
});

menuVoltar.addEventListener('click',function(){
    toggle();
});

botaoExcluir.addEventListener('click',excluir);
formulario.addEventListener('submit',salvar);

obterUsuarioLogado();

function renderizarErro(msg) {
    divErro.textContent = msg;
    divErro.classList.remove('esconder');
    window.scrollTo(0, 0);
}

function obterUsuarioLogado(callback) {
    menuLoading.classList.remove('esconder');
    firebase.auth().onAuthStateChanged(function(user) {
        esconderLoading('auth');
        if (user) {
            repositorio.usuario = user;
            menuLogin.classList.add('esconder');
            menuLogout.classList.remove('esconder');
            menuNovo.classList.remove('esconder');
            let primeiroNome = user.displayName.split(' ')[0];
            divMensagem.textContent = `Bem-vindo ${primeiroNome}!`;
            divMensagem.classList.remove('esconder');
            tabela.classList.add('usuario-logado');
        } else {
            menuLogin.classList.remove('esconder');
            menuLogout.classList.add('esconder');
            menuNovo.classList.add('esconder');
            divMensagem.classList.add('esconder');
            tabela.classList.remove('usuario-logado');
        }
    });
}

let jaBuscouDadosNoServidor = {
    auth: false,
    data: false
}

function esconderLoading(key) {
    jaBuscouDadosNoServidor[key] = true;

    if (jaBuscouDadosNoServidor.auth && jaBuscouDadosNoServidor.data) {
        if (!menuLoading.classList.contains('esconder')) {
            menuLoading.classList.add('esconder');
        }
    }
}

repositorio.callbackListar().on('value',function(snapshot) {

    let lista = snapshot.val();
    let tbody = tabela.querySelector('tbody');
    tbody.innerHTML = '';
    let medicamentos = {};

    Object.keys(lista).forEach((key,index,array) => {

        let medicamento = new Medicamento();
        medicamento.factoryJSON(lista[key]);
        medicamentos[key] = medicamento;

        if (medicamento.ativo) {
            let tr = medicamento.renderizarLinha(key);
            tr.querySelector('td > img').addEventListener('click',function(){
                editar(key,medicamento);
            });
            tbody.appendChild(tr);
        }
        if (index == (array.length-1)) {
            repositorio.medicamentos = medicamentos;
            if (!loadingTabela.classList.contains('esconder')) {
                loadingTabela.classList.toggle('esconder');
                tabela.classList.toggle('esconder');
            }
            esconderLoading('data');
        }
    });
});

function excluir(event) {
    event.preventDefault();    
    let formulario = event.target.parentNode;
    atualizarRegistro(formulario,true);
}

function salvar(event) {
    event.preventDefault();
    let formulario = event.target;
    atualizarRegistro(formulario,false);
}

function atualizarRegistro(formulario,excluir) {

    if (!divErro.classList.contains('esconder')) {
        divErro.classList.add('esconder');
    }

    try {
        let medicamento = new Medicamento();
        let base64 = document.getElementById("exibir-imagem").src;
        medicamento.factoryFormulario(formulario,base64);

        if (excluir) {
            medicamento.ativo = false;
        } else {
            medicamento.validar();
        }

        loadingTabela.classList.toggle('esconder');
        tabela.classList.toggle('esconder');
        repositorio.salvar(formulario.codigo.value,medicamento);
        toggle();
    } catch (e) {
        renderizarErro(e);
    }
}

function editar(key,medicamento) {
    if (repositorio.usuarioEstaLogado()) {
        limparFormulario();

        formulario.codigo.value = key;
        document.getElementById("exibir-imagem").src = medicamento.imagem;
        formulario.nome.value = medicamento.nome;
        formulario.principio.value = medicamento.principio;
        formulario.laboratorio.value = medicamento.laboratorio;
        formulario.estoque.value = medicamento.estoque;
        formulario.preco.value = medicamento.preco;

        let classificacoes = formulario.classificacao.options;
        for (let i=0; i< classificacoes.length; i++) {
            if (classificacoes[i].value === medicamento.classificacao) {
                formulario.classificacao.selectedIndex = i;
                break;
            }
        }

        let tipos = formulario.tipo.options;
        for (let i=0; i< tipos.length; i++) {
            if (tipos[i].value === medicamento.tipo) {
                formulario.tipo.selectedIndex = i;
                break;
            }
        }

        toggle();
        botaoExcluir.classList.remove('esconder');
    }
}

function limparFormulario() {
    definirImagemDefault();
    formulario.codigo.value = '';
    formulario.nome.value = '';
    formulario.principio.value = '';
    formulario.laboratorio.value = '';
    formulario.estoque.value = '';
    formulario.preco.value = '';
    formulario.classificacao.selectedIndex = 0;
    formulario.tipo.selectedIndex = 0;
}

function toggle() {
    divTabela.classList.toggle('esconder');
    formulario.classList.toggle('esconder');
    menuNovo.classList.toggle('esconder');
    menuVoltar.classList.toggle('esconder');

    if (!botaoExcluir.classList.contains('esconder')) {
        botaoExcluir.classList.add('esconder');
    }
}

function login() {
    let provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('https://www.googleapis.com/auth/plus.login');
    firebase.auth().signInWithRedirect(provider);
}

function logout() {
    repositorio.usuario = undefined;
    firebase.auth().signOut();
}

definirImagemDefault();
