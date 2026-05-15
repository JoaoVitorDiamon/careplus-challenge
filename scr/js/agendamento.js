/* ══════════════════════════════════════
MÁSCARAS
══════════════════════════════════════ */
function mascaraCPF(el) {
    let v = el.value.replace(/\D/g, '').slice(0, 11);
    if (v.length > 9) v = v.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, '$1.$2.$3-$4');
    else if (v.length > 6) v = v.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3');
    else if (v.length > 3) v = v.replace(/(\d{3})(\d{1,3})/, '$1.$2');
    el.value = v;
}
function mascaraTel(el) {
    let v = el.value.replace(/\D/g, '').slice(0, 11);
    if (v.length > 7) v = v.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
    else if (v.length > 2) v = v.replace(/(\d{2})(\d{0,5})/, '($1) $2');
    el.value = v;
}

/* ══════════════════════════════════════
DROPDOWN LOCAL
══════════════════════════════════════ */
function toggleLocalList() {
    document.getElementById('localList').classList.toggle('open');
    document.getElementById('espList').classList.remove('open');
}
function selecionarLocal(valor) {
    document.getElementById('inp-local').value = valor;
    document.getElementById('localList').classList.remove('open');
    limparErro('wrap-local');
}

/* ══════════════════════════════════════
DROPDOWN ESPECIALIDADE
══════════════════════════════════════ */
function toggleEspList() {
    document.getElementById('espList').classList.toggle('open');
    document.getElementById('localList').classList.remove('open');
}
function selecionarEsp(valor) {
    document.getElementById('inp-esp').value = valor;
    document.getElementById('espList').classList.remove('open');
    limparErro('wrap-esp');
}

/* fecha dropdowns ao clicar fora */
document.addEventListener('click', function (e) {
    if (!document.getElementById('localDropdown').contains(e.target))
        document.getElementById('localList').classList.remove('open');
    if (!document.getElementById('espDropdown').contains(e.target))
        document.getElementById('espList').classList.remove('open');
});

/* ══════════════════════════════════════
CALENDÁRIO
══════════════════════════════════════ */
const DIAS_NOME = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const MESES = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

const HORARIOS_POR_DIA = {
    1: ['09:00H', '10:30H', '14:00H', '16:30H', '18:00H'],
    2: ['08:30H', '10:00H', '13:00H', '15:00H'],
    3: ['09:00H', '11:00H', '14:30H', '17:00H'],
    4: ['08:00H', '10:30H', '13:30H', '16:00H'],
    5: ['09:30H', '11:30H', '14:00H', '15:30H', '17:30H'],
};

let calAno, calMes, diaSelecionado = null, horaSelecionada = null;

function iniciarCalendario() {
    const hoje = new Date();
    calAno = hoje.getFullYear();
    calMes = hoje.getMonth();
    renderCalendario();
}

function mudarMes(delta) {
    calMes += delta;
    if (calMes > 11) { calMes = 0; calAno++; }
    if (calMes < 0) { calMes = 11; calAno--; }
    diaSelecionado = null;
    horaSelecionada = null;
    document.getElementById('horariosWrap').style.display = 'none';
    document.getElementById('dataHoraDisplay').textContent = 'SELECIONE DATA E HORA';
    document.getElementById('dataHoraDisplay').classList.remove('filled');
    renderCalendario();
}

function renderCalendario() {
    document.getElementById('calTitulo').textContent =
        MESES[calMes] + ' ' + calAno;

    const grid = document.getElementById('calGrid');
    grid.innerHTML = '';

    // cabeçalho dias
    DIAS_NOME.forEach(d => {
        const cel = document.createElement('div');
        cel.className = 'cal-day-name';
        cel.textContent = d;
        grid.appendChild(cel);
    });

    const hoje = new Date();
    const primeiroDia = new Date(calAno, calMes, 1).getDay();
    const totalDias = new Date(calAno, calMes + 1, 0).getDate();

    // células vazias
    for (let i = 0; i < primeiroDia; i++) {
        const cel = document.createElement('div');
        cel.className = 'cal-day empty';
        grid.appendChild(cel);
    }

    for (let d = 1; d <= totalDias; d++) {
        const cel = document.createElement('div');
        const data = new Date(calAno, calMes, d);
        const passado = data < new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
        const diaSemana = data.getDay();
        const fimSemana = diaSemana === 0 || diaSemana === 6;

        cel.className = 'cal-day';
        cel.textContent = d;

        if (passado || fimSemana) {
            cel.classList.add('disabled');
        } else {
            if (diaSelecionado === d && calMes === calMes) cel.classList.add('selected');
            cel.addEventListener('click', () => selecionarDia(d, diaSemana, cel));
        }
        grid.appendChild(cel);
    }
}

function selecionarDia(dia, diaSemana, cel) {
    document.querySelectorAll('.cal-day').forEach(c => c.classList.remove('selected'));
    cel.classList.add('selected');
    diaSelecionado = dia;
    horaSelecionada = null;

    const horariosDisponiveis = HORARIOS_POR_DIA[diaSemana] || ['09:00H', '10:30H', '14:00H', '16:30H'];
    const labelEl = document.getElementById('horarioDiaLabel');
    labelEl.textContent = dia + ' DE ' + MESES[calMes].toUpperCase() + ':';

    const grid = document.getElementById('horariosGrid');
    grid.innerHTML = '';
    horariosDisponiveis.forEach(h => {
        const btn = document.createElement('button');
        btn.className = 'horario-btn';
        btn.textContent = h;
        btn.onclick = () => selecionarHorario(h, btn);
        grid.appendChild(btn);
    });

    document.getElementById('horariosWrap').style.display = 'block';
    document.getElementById('dataHoraDisplay').textContent = 'SELECIONE O HORÁRIO';
    document.getElementById('dataHoraDisplay').classList.remove('filled');
}

function selecionarHorario(hora, btn) {
    document.querySelectorAll('.horario-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    horaSelecionada = hora;

    const resumo = diaSelecionado + '/' + String(calMes + 1).padStart(2, '0') + '/' + calAno + ' às ' + hora;
    const el = document.getElementById('dataHoraDisplay');
    el.textContent = resumo;
    el.classList.add('filled');
    limparErro('wrap-dataHora');
}

/* ══════════════════════════════════════
VALIDAÇÃO E ENVIO
══════════════════════════════════════ */
function marcarErro(wrapId) {
    document.getElementById(wrapId).classList.add('show-error');
    const inp = document.querySelector('#' + wrapId + ' .field-input');
    if (inp) inp.classList.add('has-error');
}
function limparErro(wrapId) {
    document.getElementById(wrapId).classList.remove('show-error');
    const inp = document.querySelector('#' + wrapId + ' .field-input');
    if (inp) inp.classList.remove('has-error');
}

function agendar() {
    let ok = true;

    const nome = document.getElementById('inp-nome').value.trim();
    const email = document.getElementById('inp-email').value.trim();
    const tel = document.getElementById('inp-tel').value.trim();
    const cpf = document.getElementById('inp-cpf').value.trim();
    const local = document.getElementById('inp-local').value.trim();
    const esp = document.getElementById('inp-esp').value.trim();

    if (!nome) { marcarErro('wrap-nome'); ok = false; } else limparErro('wrap-nome');
    if (!email || !email.includes('@')) { marcarErro('wrap-email'); ok = false; } else limparErro('wrap-email');
    if (!tel) { marcarErro('wrap-tel'); ok = false; } else limparErro('wrap-tel');
    if (!cpf || cpf.length < 14) { marcarErro('wrap-cpf'); ok = false; } else limparErro('wrap-cpf');
    if (!local) { marcarErro('wrap-local'); ok = false; } else limparErro('wrap-local');
    if (!esp) { marcarErro('wrap-esp'); ok = false; } else limparErro('wrap-esp');
    if (!diaSelecionado || !horaSelecionada) { marcarErro('wrap-dataHora'); ok = false; } else limparErro('wrap-dataHora');

    if (!ok) return;

    /* Preenche confirmação */
    document.getElementById('conf-nome').textContent = nome;
    document.getElementById('conf-email').textContent = email;
    document.getElementById('conf-tel').textContent = tel;
    document.getElementById('conf-cpf').textContent = cpf;
    document.getElementById('conf-esp').textContent = esp.toUpperCase();
    document.getElementById('conf-local').textContent = local.toUpperCase();
    document.getElementById('conf-data').textContent =
        diaSelecionado + ' de ' + MESES[calMes] + ' de ' + calAno;
    document.getElementById('conf-hora').textContent = horaSelecionada;
    document.getElementById('conf-protocolo').textContent = 'XXXXXXXX';

    document.getElementById('etapa1').style.display = 'none';
    document.getElementById('etapa2').style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function novoAgendamento() {
    document.getElementById('etapa2').style.display = 'none';
    document.getElementById('etapa1').style.display = 'block';
    /* limpa campos */
    ['inp-nome', 'inp-email', 'inp-tel', 'inp-cpf', 'inp-local', 'inp-esp'].forEach(id =>
        document.getElementById(id).value = '');
    diaSelecionado = null; horaSelecionada = null;
    document.getElementById('horariosWrap').style.display = 'none';
    document.getElementById('dataHoraDisplay').textContent = 'SELECIONE DATA E HORA';
    document.getElementById('dataHoraDisplay').classList.remove('filled');
    iniciarCalendario();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ══════════════════════════════════════
INIT
══════════════════════════════════════ */
iniciarCalendario();
