const API_URL =
"https://ba2ef2e8c9776ca6c0c521f4.mockapi.io/api/v1/materiais";

const btnCadastrar =
document.getElementById("btn-cadastrar");

btnCadastrar.addEventListener(
    "click",
    cadastrarMaterial
);

function exibirMensagem(texto, tipo){

    const mensagem =
    document.getElementById("mensagem");

    mensagem.textContent = texto;
    mensagem.className = tipo;

    setTimeout(() => {

        mensagem.textContent = "";

    },3000);

}

async function cadastrarMaterial(){

    const nome =
    document.getElementById("input-nome").value.trim();

    const quantidade =
    document.getElementById("input-quantidade").value;

    if(nome === "" || quantidade === ""){

        exibirMensagem(
            "Preencha todos os campos.",
            "erro"
        );

        return;

    }

    const material = {

        nome,
        quantidade:Number(quantidade)

    };

    try{

        await fetch(API_URL,{

            method:"POST",

            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify(material)

        });

        exibirMensagem(
            "Material cadastrado com sucesso.",
            "sucesso"
        );

        limparFormulario();

        carregarMateriais();

    }catch(erro){

        console.error(erro);

        exibirMensagem(
            "Erro ao cadastrar material.",
            "erro"
        );

    }

}

function limparFormulario(){
    function validarRetirada(estoqueAtual, quantidadeRetirada) {

    if (quantidadeRetirada <= 0) {
        return false;
    }

    if (quantidadeRetirada > estoqueAtual) {
        return false;
    }

    return true;

}

    document.getElementById("input-nome").value = "";
    document.getElementById("input-quantidade").value = "";

}

async function carregarMateriais(){

    try{

        const resposta =
        await fetch(API_URL);

        const materiais =
        await resposta.json();

        preencherTabela(materiais);

        atualizarIndicadores(materiais);

    }catch(erro){

        console.error(erro);

    }

}

function preencherTabela(materiais){

    const lista =
    document.getElementById("lista-materiais");

    lista.innerHTML = "";

    materiais.forEach(material => {

        lista.innerHTML += `
        <tr>
           <td>${material.id}</td>
            <td>${material.nome}</td>
            <td>${material.quantidade}</td>
            <td>
                <button class="btn-baixar" data-id="${material.id}">Baixar</button>
                <button class="btn-excluir" data-id="${material.id}">Excluir</button>
            </td>
        </tr>
        `;
       

    });

}

function atualizarIndicadores(materiais){

    document.getElementById(
        "total-materiais"
    ).textContent = materiais.length;

    let totalEstoque = 0;

    materiais.forEach(material => {

        totalEstoque +=
        Number(material.quantidade);

    });

    document.getElementById(
        "total-estoque"
    ).textContent = totalEstoque;

}
    
window.onload = carregarMateriais;