const mockDB = [
    {
        cpf: '567.968.999-00', nasc: '05/10/1985', nome: 'José Oliveira Santos',
        consultas: [
            { id: 1, medico: 'Dra. Camila Souza', crm: 'CRM 45.231', especialidade: 'Odontologia', icone: 'bi-tooth', data: '2025-07-18', hora: '14:30', unidade: 'Unidade Paulista', tipo: 'Consulta de rotina', status: 'agendado' },
            { id: 2, medico: 'Dr. Rafael Costa', crm: 'CRM 38.102', especialidade: 'Dermatologia', icone: 'bi-clipboard2-pulse', data: '2025-08-05', hora: '09:00', unidade: 'Unidade Faria Lima', tipo: 'Avaliação inicial', status: 'agendado' },
            { id: 3, medico: 'Dra. Patrícia Lima', crm: 'CRM 52.887', especialidade: 'Clínica Geral', icone: 'bi-heart-pulse', data: '2025-06-10', hora: '11:15', unidade: 'Unidade Paulista', tipo: 'Retorno', status: 'cancelado' }
        ]
    },
    {
        cpf: '123.456.789-09', nasc: '15/03/1990', nome: 'Maria Silva',
        consultas: [
            { id: 4, medico: 'Dr. André Martins', crm: 'CRM 29.445', especialidade: 'Ortodontia', icone: 'bi-stars', data: '2025-07-22', hora: '10:00', unidade: 'Unidade Itaim', tipo: 'Ajuste de aparelho', status: 'agendado' }
        ]
    }
];

let currentConsultas = [], consultaToCancel = null;

function maskCPF(input) {
    let v = input.value.replace(/\D/g, '').slice(0, 11);
    if (v.length > 9) v = v.replace(/^(\d{3})(\d{3})(\d{3})(\d{0,2})/, '$1.$2.$3-$4');
    else if (v.length > 6) v = v.replace(/^(\d{3})(\d{3})(\d{0,3})/, '$1.$2.$3');
    else if (v.length > 3) v = v.replace(/^(\d{3})(\d{0,3})/, '$1.$2');
    input.value = v; clearErr('CPF');
}
function maskDate(input) {
    let v = input.value.replace(/\D/g, '').slice(0, 8);
    if (v.length > 4) v = v.replace(/^(\d{2})(\d{2})(\d{0,4})/, '$1/$2/$3');
    else if (v.length > 2) v = v.replace(/^(\d{2})(\d{0,2})/, '$1/$2');
    input.value = v; clearErr('Nasc');
}
function clearErr(f) {
    document.getElementById('err' + f).style.display = 'none';
    document.getElementById('input' + f).classList.remove('error');
}
function showErr(f, msg) {
    const e = document.getElementById('err' + f);
    e.querySelector('span').textContent = msg; e.style.display = 'flex';
    document.getElementById('input' + f).classList.add('error');
}

function toggleDropdown() { document.getElementById('navDropdown').classList.toggle('show'); }
document.addEventListener('click', e => { if (!e.target.closest('.dropdown-nav')) document.getElementById('navDropdown').classList.remove('show'); });

function showPage(id) { document.querySelectorAll('.page').forEach(p => p.classList.remove('active')); document.getElementById(id).classList.add('active'); window.scrollTo(0, 0); }

function voltarForm(e) { if (e) e.preventDefault(); document.getElementById('navDropdown').classList.remove('show'); showPage('pageForm'); }

function buscarConsulta() {
    const cpf = document.getElementById('inputCPF').value.trim();
    const nasc = document.getElementById('inputNasc').value.trim();
    let ok = true;
    if (!cpf || cpf.replace(/\D/g, '').length !== 11) { showErr('CPF', 'Insira um CPF válido com 11 dígitos.'); ok = false; }
    if (!nasc || nasc.length !== 10) { showErr('Nasc', 'Insira a data no formato DD/MM/AAAA.'); if (ok) ok = false; }
    if (!ok) return;
    const btn = document.getElementById('btnContinuar');
    btn.classList.add('loading'); btn.disabled = true;
    setTimeout(() => {
        btn.classList.remove('loading'); btn.disabled = false;
        const found = mockDB.find(p => p.cpf.replace(/\D/g, '') === cpf.replace(/\D/g, '') && p.nasc === nasc);
        if (found) {
            currentConsultas = found.consultas.map(c => ({ ...c }));
            renderConsultas(found.nome, cpf);
            showPage('pageConsultas');
        } else {
            document.getElementById('modalNotFound').classList.add('show');
        }
    }, 1600);
}

const MONTHS = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
const MONTHS_FULL = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

function renderConsultas(nome, cpf) {
    document.getElementById('patientName').textContent = nome;
    document.getElementById('patientCPFLabel').textContent = 'CPF: ' + cpf;
    const list = document.getElementById('consultasList');
    const empty = document.getElementById('emptyState');
    list.innerHTML = '';
    const ativas = currentConsultas.filter(c => c.status === 'agendado');
    const canceladas = currentConsultas.filter(c => c.status === 'cancelado');
    document.getElementById('foundCount').textContent = ativas.length;
    const all = [...ativas, ...canceladas];
    if (!all.length) { empty.style.display = 'block'; return; }
    empty.style.display = 'none';
    all.forEach((c, i) => {
        const d = new Date(c.data + 'T00:00:00');
        const day = d.getDate().toString().padStart(2, '0');
        const month = MONTHS[d.getMonth()];
        const year = d.getFullYear();
        const isCancelled = c.status === 'cancelado';
        const card = document.createElement('div');
        card.className = 'consulta-card' + (isCancelled ? ' cancelled' : '');
        card.style.animationDelay = (i * .08) + 's';
        card.id = 'card-' + c.id;
        card.innerHTML = `
      <div class="consulta-date-box">
        <div class="consulta-day">${day}</div>
        <div class="consulta-month">${month}</div>
        <div class="consulta-year">${year}</div>
      </div>
      <div class="consulta-info">
        <div class="consulta-especialidade"><i class="bi ${c.icone}"></i> ${c.especialidade}</div>
        <div class="consulta-medico">${c.medico}</div>
        <div class="consulta-meta">
          <div class="consulta-meta-item"><i class="bi bi-clock"></i> ${c.hora}</div>
          <div class="consulta-meta-item"><i class="bi bi-geo-alt"></i> ${c.unidade}</div>
          <div class="consulta-meta-item"><i class="bi bi-card-text"></i> ${c.tipo}</div>
          <div class="consulta-meta-item"><i class="bi bi-person-badge"></i> ${c.crm}</div>
        </div>
      </div>
      <div class="consulta-card-actions">
        <div class="consulta-status ${isCancelled ? 'status-cancelado' : 'status-agendado'}">
          <i class="bi ${isCancelled ? 'bi-x-circle-fill' : 'bi-check-circle-fill'}"></i>
          ${isCancelled ? 'Cancelado' : 'Agendado'}
        </div>
        ${!isCancelled ? `<button class="btn-cancelar-consulta" onclick="abrirConfirm(${c.id})"><i class="bi bi-x-circle"></i> Cancelar</button>` : ''}
      </div>`;
        list.appendChild(card);
    });
}

function abrirConfirm(id) {
    const c = currentConsultas.find(x => x.id === id);
    if (!c) return;
    consultaToCancel = c;
    const d = new Date(c.data + 'T00:00:00');
    const dataFmt = d.getDate() + ' de ' + MONTHS_FULL[d.getMonth()] + ' de ' + d.getFullYear();
    document.getElementById('sumMedico').textContent = c.medico;
    document.getElementById('sumEsp').textContent = c.especialidade;
    document.getElementById('sumData').textContent = dataFmt;
    document.getElementById('sumHora').textContent = c.hora;
    document.getElementById('sumUnidade').textContent = c.unidade;
    document.getElementById('modalConfirm').classList.add('show');
}
function fecharConfirm() { document.getElementById('modalConfirm').classList.remove('show'); consultaToCancel = null; }

function confirmarCancelamento() {
    if (!consultaToCancel) return;
    const idx = currentConsultas.findIndex(c => c.id === consultaToCancel.id);
    if (idx !== -1) currentConsultas[idx].status = 'cancelado';
    fecharConfirm();
    const nome = document.getElementById('patientName').textContent;
    const cpf = document.getElementById('patientCPFLabel').textContent.replace('CPF: ', '');
    renderConsultas(nome, cpf);
    setTimeout(() => document.getElementById('modalSuccess').classList.add('show'), 300);
}
function fecharSuccess() { document.getElementById('modalSuccess').classList.remove('show'); }
function remarcar() { window.location.href = 'reagendamento.html'; }
function fecharNotFound() { document.getElementById('modalNotFound').classList.remove('show'); document.getElementById('inputCPF').focus(); }

document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { fecharConfirm(); fecharSuccess(); fecharNotFound(); document.getElementById('navDropdown').classList.remove('show'); }
});
