/* ══════════════════════════════════════
ESTADO GLOBAL
══════════════════════════════════════ */
let diaSel = null, mesCal, anoCal, horaSel = null;

const MESES = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

const HORARIOS = {
    1: ['09:00H', '10:30H', '14:00H', '16:30H', '18:00H'],
    2: ['08:30H', '10:00H', '13:00H', '15:00H'],
    3: ['09:00H', '11:00H', '14:30H', '17:00H'],
    4: ['08:00H', '10:30H', '13:30H', '16:00H'],
    5: ['09:30H', '11:30H', '14:00H', '15:30H', '17:30H'],
};

/* ══════════════════════════════════════
MÁSCARA
══════════════════════════════════════ */
function mascaraCPF(el) {
    let v = el.value.replace(/\D/g, '').slice(0, 11);
    if (v.length > 9) v = v.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, '$1.$2.$3-$4');
    else if (v.length > 6) v = v.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3');
    else if (v.length > 3) v = v.replace(/(\d{3})(\d{1,3})/, '$1.$2');
    el.value = v;
}

/* ══════════════════════════════════════
DROPDOWN GENÉRICO
══════════════════════════════════════ */
function toggleDrop(listId, wrapId) {
    // fecha todos
    document.querySelectorAll('.dropdown-list').forEach(l => {
        if (l.id !== listId) l.classList.remove('open');
    });
    document.getElementById(listId).classList.toggle('open');
}
function selecionarDrop(inputId, listId, valor, wrapId) {
    document.getElementById(inputId).value = valor;
    document.getElementById(listId).classList.remove('open');
    if (wrapId) limparErro(wrapId);
}
document.addEventListener('click', function (e) {
    if (!e.target.closest('.dropdown-wrap'))
        document.querySelectorAll('.dropdown-list').forEach(l => l.classList.remove('open'));
});

/* ══════════════════════════════════════
CALENDÁRIO
══════════════════════════════════════ */
function iniciarCal() {
    const hoje = new Date();
    anoCal = hoje.getFullYear();
    mesCal = hoje.getMonth();
    renderCal();
}
function mudarMes(d) {
    mesCal += d;
    if (mesCal > 11) { mesCal = 0; anoCal++; }
    if (mesCal < 0) { mesCal = 11; anoCal--; }
    diaSel = null; horaSel = null;
    renderCal();
}
function renderCal() {
    document.getElementById('calTitulo').textContent = MESES[mesCal] + ' ' + anoCal;
    const grid = document.getElementById('calGrid');
    grid.innerHTML = '';
    const dias = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    dias.forEach(d => {
        const cel = document.createElement('div');
        cel.className = 'cal-day-name'; cel.textContent = d;
        grid.appendChild(cel);
    });
    const hoje = new Date();
    const primDia = new Date(anoCal, mesCal, 1).getDay();
    const totalDias = new Date(anoCal, mesCal + 1, 0).getDate();
    for (let i = 0; i < primDia; i++) {
        const c = document.createElement('div'); c.className = 'cal-day empty'; grid.appendChild(c);
    }
    for (let d = 1; d <= totalDias; d++) {
        const cel = document.createElement('div');
        const data = new Date(anoCal, mesCal, d);
        const passado = data < new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
        const ds = data.getDay();
        const fds = ds === 0 || ds === 6;
        cel.className = 'cal-day';
        cel.textContent = d;
        if (passado || fds) {
            cel.classList.add('disabled');
        } else {
            if (diaSel === d) cel.classList.add('selected');
            cel.addEventListener('click', () => clicarDia(d, ds, cel));
        }
        grid.appendChild(cel);
    }
}
function clicarDia(dia, ds, cel) {
    document.querySelectorAll('.cal-day').forEach(c => c.classList.remove('selected'));
    cel.classList.add('selected');
    diaSel = dia; horaSel = null;
}

/* ══════════════════════════════════════
VALIDAÇÃO
══════════════════════════════════════ */
function marcarErro(id) {
    document.getElementById(id).classList.add('show-error');
    const inp = document.querySelector('#' + id + ' .field-input');
    if (inp) inp.classList.add('has-error');
}
function limparErro(id) {
    document.getElementById(id).classList.remove('show-error');
    const inp = document.querySelector('#' + id + ' .field-input');
    if (inp) inp.classList.remove('has-error');
}

/* ══════════════════════════════════════
STEPS BAR
══════════════════════════════════════ */
function atualizarSteps(etapa) {
    for (let i = 1; i <= 4; i++) {
        const sc = document.getElementById('sc' + i);
        const sl = document.getElementById('sl' + i);
        sc.classList.remove('ativo', 'concluido');
        sl.classList.remove('ativo');
        if (i < etapa) { sc.classList.add('concluido'); sc.innerHTML = '✓'; }
        else if (i === etapa) { sc.classList.add('ativo'); sc.textContent = i; sl.classList.add('ativo'); }
        else { sc.textContent = i; }
        if (i < 4) {
            const line = document.getElementById('line' + i);
            line.classList.toggle('ativo', i < etapa);
        }
    }
}

/* ══════════════════════════════════════
NAVEGAÇÃO ENTRE ETAPAS
══════════════════════════════════════ */
function irEtapa2() {
    const nome = document.getElementById('inp-nome').value.trim();
    const email = document.getElementById('inp-email').value.trim();
    const cpf = document.getElementById('inp-cpf').value.trim();
    const local = document.getElementById('inp-local').value.trim();
    let ok = true;

    if (!nome) { marcarErro('wrap-nome'); ok = false; } else limparErro('wrap-nome');
    if (!email || !email.includes('@')) { marcarErro('wrap-email'); ok = false; } else limparErro('wrap-email');
    if (!cpf || cpf.length < 14) { marcarErro('wrap-cpf'); ok = false; } else limparErro('wrap-cpf');
    if (!local) { marcarErro('wrap-local1'); ok = false; } else limparErro('wrap-local1');
    if (!diaSel) { alert('Selecione uma data no calendário.'); ok = false; }

    if (!ok) return;

    // repassa dados
    document.getElementById('r-nome').value = nome;
    document.getElementById('r-email').value = email;
    document.getElementById('r-cpf').value = cpf;

    mostrarEtapa(2);
}

function irEtapa3() {
    const esp = document.getElementById('inp-esp').value.trim();
    if (!esp) { marcarErro('wrap-esp'); return; } else limparErro('wrap-esp');

    // repassa
    document.getElementById('r2-nome').value = document.getElementById('inp-nome').value;
    document.getElementById('r2-email').value = document.getElementById('inp-email').value;
    document.getElementById('r2-cpf').value = document.getElementById('inp-cpf').value;
    document.getElementById('inp-esp2').value = esp;

    // preenche local
    const localV = document.getElementById('inp-local').value;
    document.getElementById('inp-local2').value = localV;

    // resumo do dia selecionado
    const diaStr = diaSel + '/' + String(mesCal + 1).padStart(2, '0') + '/' + anoCal;
    document.getElementById('dataResumoBadge').textContent = diaSel + ' DE ' + MESES[mesCal].toUpperCase() + ':';

    // horários
    const ds = new Date(anoCal, mesCal, diaSel).getDay();
    const hors = HORARIOS[ds] || ['09:00H', '10:30H', '14:00H', '16:30H'];
    const grid3 = document.getElementById('horariosGrid3');
    grid3.innerHTML = '';
    hors.forEach(h => {
        const btn = document.createElement('button');
        btn.className = 'horario-btn';
        btn.textContent = h;
        btn.onclick = () => {
            document.querySelectorAll('#horariosGrid3 .horario-btn').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            horaSel = h;
            limparErro('wrap-hora');
            document.getElementById('inp-dataHoraFinal').value =
                diaSel + '/' + String(mesCal + 1).padStart(2, '0') + '/' + anoCal + ' às ' + h;
        };
        grid3.appendChild(btn);
    });

    mostrarEtapa(3);
}

function irEtapa4() {
    const local2 = document.getElementById('inp-local2').value.trim();
    const esp2 = document.getElementById('inp-esp2').value.trim();
    let ok = true;
    if (!horaSel) { marcarErro('wrap-hora'); ok = false; } else limparErro('wrap-hora');
    if (!local2) { marcarErro('wrap-local2'); ok = false; } else limparErro('wrap-local2');
    if (!esp2) { marcarErro('wrap-esp2'); ok = false; } else limparErro('wrap-esp2');
    if (!ok) return;

    document.getElementById('conf-nome').textContent = document.getElementById('inp-nome').value;
    document.getElementById('conf-email').textContent = document.getElementById('inp-email').value;
    document.getElementById('conf-esp').textContent = esp2.toUpperCase();
    document.getElementById('conf-local').textContent = local2.toUpperCase();
    document.getElementById('conf-data').textContent = diaSel + ' de ' + MESES[mesCal] + ' de ' + anoCal;
    document.getElementById('conf-hora').textContent = horaSel;
    document.getElementById('conf-protocolo').textContent = 'XXXXXXXX';

    mostrarEtapa(4);
}

function mostrarEtapa(n) {
    [1, 2, 3, 4].forEach(i =>
        document.getElementById('etapa' + i).style.display = (i === n ? 'block' : 'none')
    );
    atualizarSteps(n);
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function reiniciar() {
    ['inp-nome', 'inp-email', 'inp-cpf', 'inp-local',
        'inp-esp', 'inp-local2', 'inp-esp2'].forEach(id =>
            document.getElementById(id).value = '');
    diaSel = null; horaSel = null;
    iniciarCal();
    mostrarEtapa(1);
}

/* ══════════════════════════════════════
INIT
══════════════════════════════════════ */
iniciarCal();
atualizarSteps(1);
