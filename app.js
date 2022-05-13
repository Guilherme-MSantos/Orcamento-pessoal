class Despesas {
  constructor(ano, mes, dia, tipo, descricao, valor) {
    this.ano = ano;
    this.mes = mes;
    this.dia = dia;
    this.tipo = tipo;
    this.descricao = descricao;
    this.valor = valor;
  }
  validarDados(){
    for (let i in this ) {
      if(this[i] == undefined || this[i] == ''|| this[i] == null){
        return false;
      } else {
        return true;
      }
    }
  }
}

class Bd {

  constructor() {
    let id = localStorage.getItem("id");

    if (id === null) {
      localStorage.setItem("id", 0);
    }
  }

  getProximoId() {
    let proximoId = localStorage.getItem("id");
    return parseInt(proximoId) + 1;
  }

  gravar(d) {
    let id = this.getProximoId();

    localStorage.setItem(id, JSON.stringify(d));

    localStorage.setItem("id", id);

    
  }

  recuperarTodosRegistros() {
    //array de despesas
    let despesas = Array();

    let id = localStorage.getItem("id");

    //recuperar todas as despesas cadastradas em localStorage
    for (let i = 1; i <= id; i++) {
      //recuperar a despesa
      let despesa = JSON.parse(localStorage.getItem(i));

      //existe a possibilidade de haver índices que foram pulados/removidos
      //nestes casos nós vamos pular esses índices
      if (despesa === null) {
        continue;
      }
      despesa.id = i
      despesas.push(despesa);
    }

    return despesas;
  }
  pesquisar(despesa) {
    let despesasFiltradas = Array();
    despesasFiltradas = this.recuperarTodosRegistros();

    console.log(despesa);
    console.log(despesasFiltradas);

    // Filtros de pesquisa

    //ano
    if (despesa.ano != "") {
      despesasFiltradas = despesasFiltradas.filter((d) => d.ano == despesa.ano);
    }

    //mes
    if (despesa.mes != "") {
      despesasFiltradas = despesasFiltradas.filter((d) => d.mes == despesa.mes);
    }

    //dia
    if (despesa.dia != "") {
      despesasFiltradas = despesasFiltradas.filter((d) => d.dia == despesa.dia);
    }

    //tipo
    if (despesa.tipo != "") {
      despesasFiltradas = despesasFiltradas.filter(
        (d) => d.tipo == despesa.tipo
      );
    }

    //descricao
    if (despesa.descricao != "") {
      despesasFiltradas = despesasFiltradas.filter(
        (d) => d.descricao == despesa.descricao
      );
    }

    //valor
    if (despesa.valor != "") {
      despesasFiltradas = despesasFiltradas.filter(
        (d) => d.valor == despesa.valor
      );
    } 
    return despesasFiltradas;
  }
  remover(id){
    localStorage.removeItem(id)
  }
}

let bd = new Bd();

function CadastrarDespesa() {
  let ano = document.getElementById("ano");
  let mes = document.getElementById("mes");
  let dia = document.getElementById("dia");
  let tipo = document.getElementById("tipo");
  let descricao = document.getElementById("descricao");
  let valor = document.getElementById("valor");

  let despesa = new Despesas(
    ano.value,
    mes.value,
    dia.value,
    tipo.value,
    descricao.value,
    valor.value
  );


  // Modal para validação
   
   let conteudo = document.getElementById("conteudo");
   let ModalHeader = document.getElementById("ModalHeader")
   let ModalFooter = document.getElementById("ModalFooter");

    if(despesa.validarDados()){
        bd.gravar(despesa);
       
          ano.value = '',
          mes.value = '',
          dia.value = '',
          tipo.value = '',
          descricao.value = '',
          valor.value = '';
        
       ModalHeader.innerHTML = `<h5 class="modal-title text-success" id="titulo"> Gravação feita com Sucesso </h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>`;
       
       conteudo.innerHTML = `Os campos obrigatórios  foram preenchidos`;
       ModalFooter.innerHTML = `<button type="button" class="btn btn-success" data-bs-dismiss="modal" id="botao">Voltar</button>`;

           

       $("#modalRegistraDespesa").modal("show");
    } else {

       ModalHeader.innerHTML = `<h5 class="modal-title text-danger" id="titulo">Houve um erro na gravação </h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>`;

       conteudo.innerHTML = `Os campos obrigatórios não foram preenchidos`;
       ModalFooter.innerHTML = `<button type="button" class="btn btn-danger" data-bs-dismiss="modal" id="botao">Voltar e corrigir</button>`;
      
      
      $("#modalRegistraDespesa").modal("show");
    }
}

function carregarListaDespesas(despesas = Array(),filtro=false){
 if (despesas.length == 0 && filtro == false){
   despesas = bd.recuperarTodosRegistros()
 }
 
 let listaDespesas = document.getElementById('listaDespesas')

listaDespesas.innerHTML = "";

 despesas.forEach(function(d){

   //criando uma linha na tabela(tr)
   let linha = listaDespesas.insertRow()

   // criar colunas 
   linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}`
   
   
   // ajustar o tipo 
   switch (d.tipo) {
     case "1":
       d.tipo = "Alimentação";
       break;

     case "2":
       d.tipo = "Educação";
       break;

     case "3":
       d.tipo = "Lazer";
       break;

     case "4":
       d.tipo = "Saúde";
       break;

     case "5":
       d.tipo = "Transporte";
       break;
   };

   linha.insertCell(1).innerHTML = d.tipo;
   linha.insertCell(2).innerHTML = d.descricao;
   linha.insertCell(3).innerHTML = d.valor;

   // criar botão de exclusão 
   let btn = document.createElement("button")
   btn.className = 'btn btn-danger'
   btn.innerHTML = '<i class ="fas fa-times"></i>'
   btn.id = `id_despesa_${d.id}`
   btn.onclick = function(){
     // remover a despesa
     let id = this.id.replace('id_despesa_','')

     bd.remover(id)

     window.location.reload()
   }
   linha.insertCell(4).append(btn)
   
 })
}

 function pesquisarDespesa (){

    let ano = document.getElementById("ano").value;
    let mes = document.getElementById("mes").value;
    let dia = document.getElementById("dia").value;
    let tipo = document.getElementById("tipo").value;
    let descricao = document.getElementById("descricao").value;
    let valor = document.getElementById("valor").value;

    let despesa = new Despesas (ano,mes,dia,tipo,descricao,valor)

    let despesas = bd.pesquisar(despesa)

    this.carregarListaDespesas(despesas,true)
 }