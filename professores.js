const menuToggle = document.querySelector('.menu-toggle');
const headerNav = document.querySelector('.home-header nav');

if(menuToggle && headerNav){
menuToggle.addEventListener('click',function(){
headerNav.classList.toggle('show');
});
}


// ===== DADOS =====

let aulas = [];


function carregarDados(){

const dados = localStorage.getItem("aulas");

if(dados){

aulas = JSON.parse(dados);

}

}


function salvarDados(){

localStorage.setItem("aulas", JSON.stringify(aulas));

}


function gerarId(){

return "_" + Math.random().toString(36).substr(2,9);

}