// ===== DADOS =====

let aulas = []


function carregarDados(){

const dadosArmazenados = localStorage.getItem("aulas")

if(dadosArmazenados){

aulas = JSON.parse(dadosArmazenados)

}

}


function salvarDados(){

localStorage.setItem("aulas",JSON.stringify(aulas))

}


function gerarId(){

return "_" + Math.random().toString(36).substr(2,9)

}



// MENU MOBILE

const menuToggle = document.querySelector(".menu-toggle")
const headerNav = document.querySelector(".home-header nav")

if(menuToggle && headerNav){

menuToggle.addEventListener("click",function(){

headerNav.classList.toggle("show")

})

}



// INICIALIZAÇÃO

document.addEventListener("DOMContentLoaded",()=>{

carregarDados()

})