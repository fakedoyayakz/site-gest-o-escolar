// ===== DADOS =====
let aulas = [];

// Carregar dados do backend
async function carregarDados() {
    try {
        const response = await fetch('listar_aulas.php');
        aulas = await response.json();
        atualizarInterface();
    } catch (error) {
        console.error("Erro ao carregar dados:", error);
    }
}

// Atualizar interface
function atualizarInterface() {
    if (typeof preencherFiltros === 'function') preencherFiltros();
    if (typeof exibirHorarios === 'function') exibirHorarios();
    if (typeof preencherTabela === 'function') preencherTabela();
}

// ===== MENU MOBILE =====
const menuToggle = document.querySelector('.menu-toggle');
const headerNav = document.querySelector('.home-header nav');

if (menuToggle && headerNav) {
    menuToggle.addEventListener('click', function () {
        headerNav.classList.toggle('show');
    });
}

// ===== NAVEGAÇÃO ENTRE ABAS =====
document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {

        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));

        btn.classList.add('active');

        const viewId = btn.getAttribute('data-view');
        document.getElementById(viewId).classList.add('active');

        if (viewId === 'horarios') {
            preencherFiltros();
            exibirHorarios();
        }

        if (viewId === 'gerenciar') {
            preencherTabela();
        }

    });
});

// ===== FORMULÁRIO DE ADICIONAR =====
document.getElementById('formAula').addEventListener('submit', (e) => {

    e.preventDefault();

    const dados = {
        dia: document.getElementById('dia').value,
        horario: document.getElementById('horario').value,
        duracao: document.getElementById('duracao').value,
        turma: document.getElementById('turma').value,
        professor: document.getElementById('professor').value,
        materia: document.getElementById('materia').value,
        sala: document.getElementById('sala').value,
        observacoes: document.getElementById('observacoes').value
    };

    salvarAula(dados);
});

// ===== SALVAR AULA =====
async function salvarAula(dados) {

    try {

        const resposta = await fetch('salvar_aula.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams(dados).toString()
        });

        const json = await resposta.json();

        if (json.status === 'success') {

            await carregarDados();

            document.getElementById('formAula').reset();

            const msg = document.getElementById('mensagemSucesso');
            msg.style.display = 'block';

            setTimeout(() => {
                msg.style.display = 'none';
            }, 3000);

        } else {
            alert("Erro ao salvar aula");
        }

    } catch (error) {
        console.error(error);
        alert("Erro no servidor");
    }

}

// ===== FILTROS =====
function preencherFiltros() {

    const turmasUnicas = [...new Set(aulas.map(a => a.turma))].sort();

    const selectTurma = document.getElementById('filterTurma');

    const valorAtual = selectTurma.value;

    while (selectTurma.options.length > 1) {
        selectTurma.remove(1);
    }

    turmasUnicas.forEach(turma => {

        const option = document.createElement('option');

        option.value = turma;
        option.textContent = turma;

        selectTurma.appendChild(option);

    });

    selectTurma.value = valorAtual;

}

// ===== EXIBIR HORÁRIOS =====
function exibirHorarios() {

    const grid = document.getElementById('horariosGrid');
    grid.innerHTML = '';

    const turmaFiltro = document.getElementById('filterTurma').value;
    const diaFiltro = document.getElementById('filterDia').value;

    let aulasFiltradas = aulas;

    if (turmaFiltro) {
        aulasFiltradas = aulasFiltradas.filter(a => a.turma === turmaFiltro);
    }

    if (diaFiltro) {
        aulasFiltradas = aulasFiltradas.filter(a => a.dia === diaFiltro);
    }

    const diasOrder = { Segunda: 0, Terça: 1, Quarta: 2, Quinta: 3, Sexta: 4 };

    aulasFiltradas.sort((a, b) => {

        if (diasOrder[a.dia] !== diasOrder[b.dia]) {
            return diasOrder[a.dia] - diasOrder[b.dia];
        }

        return a.horario.localeCompare(b.horario);

    });

    if (aulasFiltradas.length === 0) {

        grid.innerHTML =
            '<p style="grid-column:1/-1;text-align:center;padding:40px;">Nenhuma aula encontrada</p>';

        return;

    }

    aulasFiltradas.forEach(aula => {

        const card = document.createElement('div');
        card.className = 'horario-card disponivel';

        const horarioFim = calcularHorarioFim(aula.horario, aula.duracao);

        card.innerHTML = `
        <div class="card-header">
            <span class="card-dia">${aula.dia}</span>
        </div>

        <div class="card-horario">${aula.horario} - ${horarioFim}</div>

        <div class="card-campo">
            <strong>Professor:</strong> ${aula.professor}
        </div>

        <div class="card-campo">
            <strong>Matéria:</strong> ${aula.materia}
        </div>

        <div class="card-campo">
            <strong>Turma:</strong> ${aula.turma}
        </div>

        <div class="card-campo">
            <strong>Sala:</strong> ${aula.sala}
        </div>

        `;

        grid.appendChild(card);

    });

}

// ===== CALCULAR HORÁRIO FINAL =====
function calcularHorarioFim(inicio, duracao) {

    const [h, m] = inicio.split(':').map(Number);

    const total = h * 60 + m + Number(duracao);

    const hf = Math.floor(total / 60);
    const mf = total % 60;

    return String(hf).padStart(2, '0') + ':' + String(mf).padStart(2, '0');

}

// ===== LIMPAR FILTROS =====
function limparFiltros() {

    document.getElementById('filterTurma').value = '';
    document.getElementById('filterDia').value = '';

    exibirHorarios();

}

// ===== TABELA DE GERENCIAMENTO =====
function preencherTabela() {

    const tbody = document.getElementById('tabelaCorpo');
    tbody.innerHTML = '';

    if (aulas.length === 0) {

        tbody.innerHTML =
            '<tr><td colspan="7" style="text-align:center;padding:40px;">Nenhuma aula</td></tr>';

        return;

    }

    aulas.forEach(aula => {

        const tr = document.createElement('tr');

        const horarioFim = calcularHorarioFim(aula.horario, aula.duracao);

        tr.innerHTML = `

        <td>${aula.dia}</td>

        <td>${aula.horario} - ${horarioFim}</td>

        <td>${aula.turma}</td>

        <td>${aula.professor}</td>

        <td>${aula.materia}</td>

        <td>${aula.sala}</td>

        <td>

        <button onclick="editarAula('${aula.id}')">Editar</button>

        <button onclick="deletarAula('${aula.id}')">Deletar</button>

        </td>

        `;

        tbody.appendChild(tr);

    });

}

// ===== DELETAR =====
async function deletarAula(id) {

    if (!confirm("Deseja deletar esta aula?")) return;

    const resposta = await fetch('deletar_aula.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'id=' + encodeURIComponent(id)
    });

    const json = await resposta.json();

    if (json.status === 'success') {
        carregarDados();
    }

}

// ===== LIMPAR TODOS =====
async function limparTodosDados() {

    if (!confirm("Apagar todas as aulas?")) return;

    const resposta = await fetch('deletar_todas_aulas.php', {
        method: 'POST'
    });

    const json = await resposta.json();

    if (json.status === 'success') {
        carregarDados();
    }

}

// ===== MODAL =====
function abrirModal() {
    document.getElementById('modalEditar').style.display = 'flex';
}

function fecharModal() {
    document.getElementById('modalEditar').style.display = 'none';
}

// ===== CARREGAR SISTEMA =====
document.addEventListener('DOMContentLoaded', () => {

    carregarDados();

});