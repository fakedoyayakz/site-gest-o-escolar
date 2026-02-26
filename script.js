// ===== DADOS =====
let aulas = [];

// Carregar dados do localStorage ao iniciar
function carregarDados() {
    const dadosArmazenados = localStorage.getItem('aulas');
    if (dadosArmazenados) {
        aulas = JSON.parse(dadosArmazenados);
    }
}

// Salvar dados no localStorage
function salvarDados() {
    localStorage.setItem('aulas', JSON.stringify(aulas));
}

// Gerar ID único
function gerarId() {
    return '_' + Math.random().toString(36).substr(2, 9);
}

// ===== NAVEGAÇÃO =====
document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        // Remover classe ativa de todos os botões
        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));

        // Adicionar classe ativa ao botão clicado
        btn.classList.add('active');
        const viewId = btn.getAttribute('data-view');
        document.getElementById(viewId).classList.add('active');

        // Atualizar conteúdo
        if (viewId === 'horarios') {
            preencherFlitros();
            exibirHorarios();
        } else if (viewId === 'gerenciar') {
            preencherTabela();
        }
    });
});

// ===== FORMULÁRIO DE ADICIONAR AULA =====
document.getElementById('formAula').addEventListener('submit', (e) => {
    e.preventDefault();

    const novaAula = {
        id: gerarId(),
        dia: document.getElementById('dia').value,
        horario: document.getElementById('horario').value,
        duracao: parseInt(document.getElementById('duracao').value),
        turma: document.getElementById('turma').value,
        professor: document.getElementById('professor').value,
        materia: document.getElementById('materia').value,
        sala: document.getElementById('sala').value,
        observacoes: document.getElementById('observacoes').value
    };

    aulas.push(novaAula);
    salvarDados();

    // Mostrar mensagem de sucesso
    const msg = document.getElementById('mensagemSucesso');
    msg.style.display = 'block';
    setTimeout(() => {
        msg.style.display = 'none';
    }, 3000);

    // Limpar formulário
    document.getElementById('formAula').reset();
});

// ===== VISUALIZAR HORÁRIOS =====
function preencherFlitros() {
    const turmasUnicas = [...new Set(aulas.map(a => a.turma))].sort();
    const selectTurma = document.getElementById('filterTurma');
    
    // Preservar o valor selecionado
    const valorAtual = selectTurma.value;
    
    // Limpar options (exceto a primeira)
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

    // Ordenar por dia e horário
    aulasFiltradas.sort((a, b) => {
        const diasOrder = { 'Segunda': 0, 'Terça': 1, 'Quarta': 2, 'Quinta': 3, 'Sexta': 4 };
        if (diasOrder[a.dia] !== diasOrder[b.dia]) {
            return diasOrder[a.dia] - diasOrder[b.dia];
        }
        return a.horario.localeCompare(b.horario);
    });

    if (aulasFiltradas.length === 0) {
        grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 40px; color: #95a5a6;">Nenhuma aula encontrada</p>';
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
                <div class="card-label">👤 Professor(a)</div>
                <div class="card-valor">${aula.professor}</div>
            </div>
            <div class="card-campo">
                <div class="card-label">📚 Matéria</div>
                <div class="card-valor">${aula.materia}</div>
            </div>
            <div class="card-campo">
                <div class="card-label">👥 Turma</div>
                <div class="card-valor">${aula.turma}</div>
            </div>
            <div class="card-campo">
                <div class="card-label">🚪 Sala</div>
                <div class="card-valor">${aula.sala}</div>
            </div>
            ${aula.observacoes ? `
            <div class="card-campo">
                <div class="card-label">📝 Observações</div>
                <div class="card-valor">${aula.observacoes}</div>
            </div>
            ` : ''}
        `;

        grid.appendChild(card);
    });
}

function calcularHorarioFim(horarioInicio, duracao) {
    const [horas, minutos] = horarioInicio.split(':').map(Number);
    const totalMinutos = horas * 60 + minutos + duracao;
    const horasFim = Math.floor(totalMinutos / 60) % 24;
    const minutosFim = totalMinutos % 60;
    return `${String(horasFim).padStart(2, '0')}:${String(minutosFim).padStart(2, '0')}`;
}

function limparFiltros() {
    document.getElementById('filterTurma').value = '';
    document.getElementById('filterDia').value = '';
    exibirHorarios();
}

// ===== GERENCIAR AULAS =====
function preencherTabela() {
    const tbody = document.getElementById('tabelaCorpo');
    tbody.innerHTML = '';

    if (aulas.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 40px;">Nenhuma aula adicionada</td></tr>';
        return;
    }

    // Ordenar aulas
    const aulasOrdenadas = [...aulas].sort((a, b) => {
        const diasOrder = { 'Segunda': 0, 'Terça': 1, 'Quarta': 2, 'Quinta': 3, 'Sexta': 4 };
        if (diasOrder[a.dia] !== diasOrder[b.dia]) {
            return diasOrder[a.dia] - diasOrder[b.dia];
        }
        return a.horario.localeCompare(b.horario);
    });

    aulasOrdenadas.forEach(aula => {
        const horarioFim = calcularHorarioFim(aula.horario, aula.duracao);
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${aula.dia}</td>
            <td>${aula.horario} - ${horarioFim}</td>
            <td>${aula.turma}</td>
            <td>${aula.professor}</td>
            <td>${aula.materia}</td>
            <td>${aula.sala}</td>
            <td>
                <div class="acoes-coluna">
                    <button class="btn btn-warning" onclick="editarAula('${aula.id}')">✏️ Editar</button>
                    <button class="btn btn-danger" onclick="deletarAula('${aula.id}')">🗑️ Deletar</button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function editarAula(id) {
    const aula = aulas.find(a => a.id === id);
    if (!aula) return;

    document.getElementById('editarId').value = id;
    document.getElementById('editarDia').value = aula.dia;
    document.getElementById('editarHorario').value = aula.horario;
    document.getElementById('editarDuracao').value = aula.duracao;
    document.getElementById('editarTurma').value = aula.turma;
    document.getElementById('editarProfessor').value = aula.professor;
    document.getElementById('editarMateria').value = aula.materia;
    document.getElementById('editarSala').value = aula.sala;
    document.getElementById('editarObservacoes').value = aula.observacoes;

    abrirModal();
}

function deletarAula(id) {
    if (confirm('Tem certeza que deseja deletar essa aula?')) {
        aulas = aulas.filter(a => a.id !== id);
        salvarDados();
        preencherTabela();
        exibirHorarios();
        preencherFlitros();
    }
}

function limparTodosDados() {
    if (confirm('Tem certeza que deseja deletar TODAS as aulas? Esta ação não pode ser desfeita!')) {
        aulas = [];
        salvarDados();
        preencherTabela();
        exibirHorarios();
        preencherFlitros();
    }
}

// ===== MODAL =====
function abrirModal() {
    document.getElementById('modalEditar').style.display = 'flex';
}

function fecharModal() {
    document.getElementById('modalEditar').style.display = 'none';
}

document.getElementById('formEditar').addEventListener('submit', (e) => {
    e.preventDefault();

    const id = document.getElementById('editarId').value;
    const aula = aulas.find(a => a.id === id);

    if (aula) {
        aula.dia = document.getElementById('editarDia').value;
        aula.horario = document.getElementById('editarHorario').value;
        aula.duracao = parseInt(document.getElementById('editarDuracao').value);
        aula.turma = document.getElementById('editarTurma').value;
        aula.professor = document.getElementById('editarProfessor').value;
        aula.materia = document.getElementById('editarMateria').value;
        aula.sala = document.getElementById('editarSala').value;
        aula.observacoes = document.getElementById('editarObservacoes').value;

        salvarDados();
        preencherTabela();
        exibirHorarios();
        preencherFlitros();
        fecharModal();
    }
});

// Fechar modal ao clicar fora
window.addEventListener('click', (e) => {
    const modal = document.getElementById('modalEditar');
    if (e.target === modal) {
        fecharModal();
    }
});

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', () => {
    carregarDados();
    preencherFlitros();
    exibirHorarios();
});
