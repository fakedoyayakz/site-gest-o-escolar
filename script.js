const modal = document.getElementById('loginModal');
const title = document.getElementById('loginTitle');

const btnProfessor = document.getElementById('btnProfessor');
const btnDirecao = document.getElementById('btnDirecao');

const closeModal = document.getElementById('closeModal');
const loginForm = document.getElementById('loginForm');

let currentRole = null;

function safeAddEventListener(el, event, handler) {
    if (el) el.addEventListener(event, handler);
}


function openLogin(role){

currentRole = role;

title.textContent =
role === 'professor'
? 'Login - Professor'
: 'Login - Direção';

modal.classList.remove('hide');

}

function closeLogin(){

modal.classList.add('hide');

loginForm.reset();

currentRole = null;

}


safeAddEventListener(btnProfessor, 'click', function(e){

e.preventDefault();

openLogin('professor');

});


safeAddEventListener(btnDirecao, 'click', function(e){

e.preventDefault();

openLogin('direcao');

});


safeAddEventListener(closeModal, 'click', closeLogin);


safeAddEventListener(modal, 'click', function(e){

if(e.target === modal){

closeLogin();

}

});


safeAddEventListener(loginForm, 'submit', function(e){

e.preventDefault();

const user = document.getElementById('username').value;
const pass = document.getElementById('password').value;

if(currentRole){

alert(
'Entrando como ' +
title.textContent +
'\nUsuário: ' + user
);

closeLogin();

}else{

alert('Dados inválidos');

}

});


const menuToggle = document.querySelector('.menu-toggle');
const headerNav = document.querySelector('.home-header nav');

safeAddEventListener(menuToggle, 'click', function(){
    if (headerNav) headerNav.classList.toggle('show');

});