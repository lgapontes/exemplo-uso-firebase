function Medicamento() {}

Medicamento.prototype.factoryFormulario = function(formulario, imagem) {
    let selectClassificacao = formulario.classificacao;
    let classificacao = selectClassificacao.options[ selectClassificacao.selectedIndex ].value;
    let selectTipo = formulario.tipo;
    let tipo = selectTipo.options[ selectTipo.selectedIndex ].value;
    let estoque = formulario.estoque.value;

    this.imagem = imagem;
    this.nome = formulario.nome.value;
    this.principio = formulario.principio.value;
    this.laboratorio = formulario.laboratorio.value;
    this.estoque = estoque;
    this.preco = formulario.preco.value;
    this.classificacao = classificacao;
    this.tipo = tipo;
    this.ativo = true;
}

Medicamento.prototype.factoryJSON = function(json) {
    this.imagem = json.imagem;
    this.nome = json.nome;
    this.principio = json.principio;
    this.laboratorio = json.laboratorio;
    this.estoque = json.estoque;
    this.preco = json.preco;
    this.classificacao = json.classificacao;
    this.tipo = json.tipo;
    this.ativo = json.ativo;
}

Medicamento.prototype.renderizarLinha = function(codigo) {
    let tagTr = document.createElement('tr');
    tagTr.id = codigo;

    tagTr.renderizarColuna = function(valor) {
        let tagTd = document.createElement('td');
        tagTd.textContent = valor;
        this.appendChild(tagTd);
    }

    tagTr.renderizarColuna(this.nome);
    tagTr.renderizarColuna(this.laboratorio);
    tagTr.renderizarColuna('R$ ' + this.preco);
    tagTr.renderizarColuna(this.tipo);
    tagTr.renderizarColuna(this.estoque);

    let tagTd = document.createElement('td');
    let tagImg = document.createElement('img');
    tagImg.src = 'img/alterar.png';
    tagImg.alt = 'Alterar';
    tagTd.appendChild(tagImg);
    tagTr.appendChild(tagTd);

    return tagTr;
}

Medicamento.prototype.validar = function() {
    if (stringEhInvalida(this.nome)) {
        throw 'Nome do medicamento inválido!';
    }

    if (stringEhInvalida(this.principio)) {
        throw 'Princípio do medicamento inválido!';
    }

    if (stringEhInvalida(this.laboratorio)) {
        throw 'Laboratório do medicamento inválido!';
    }

    if (stringEhInvalida(this.estoque)) {
        throw 'Estoque do medicamento inválido!';
    }

    if (!ehInteiro(this.estoque) || (this.estoque < 0)) {
        throw 'O estoque deve ser um número inteiro maior ou igual a zero!';
    }

    if (stringEhInvalida(this.preco)) {
        throw 'Preço do medicamento inválido!';
    }
}
