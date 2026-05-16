//Validação passo 1 - verifica o tamanho do cpf e da data pra poder passar para a proxima tela 
function validarStep1() {
    const cpfInput = document.getElementById("cpf");
    const dataInput = document.getElementById("data");

    if (!cpfInput || !dataInput) {
        console.error("Inputs não encontrados");
        return false;
    }

    const cpf = cpfInput.value.trim();
    const data = dataInput.value.trim();

    // Verifica se os campos estão vazios primeiro
    if (cpf === "") {
        alert("Por favor, preencha o CPF.");
        cpfInput.focus();
        return false;
    }

    if (data === "") {
        alert("Por favor, preencha a data de nascimento.");
        dataInput.focus();
        return false;
    }

    // Verifica o tamanho do CPF 
    if (cpf.length < 14) {
        alert("CPF incompleto ou inválido!");
        cpfInput.focus();
        return false;
    }

    //Verifica o tamanho da Data 
    if (data.length < 10) {
        alert("Data de nascimento incompleta ou inválida!");
        dataInput.focus();
        return false;
    }

    return true;
}

document.addEventListener("DOMContentLoaded", () => {

    const cpfInput = document.getElementById("cpf");
    const dataInput = document.getElementById("data")

    //Mascara de CPF
    if (cpfInput) {
        cpfInput.addEventListener("input", () => {
            let value = cpfInput.value.replace(/\D/g, "").slice(0, 11);

            value = value.replace(/(\d{3})(\d)/, "$1.$2");
            value = value.replace(/(\d{3})(\d)/, "$1.$2");
            value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");

            cpfInput.value = value;
        });
    }

    //Mascara de data
    if (dataInput) {
        dataInput.addEventListener("input", () => {
            let value = dataInput.value.replace(/\D/g, "").slice(0, 8);

            value = value.replace(/(\d{2})(\d)/, "$1/$2");
            value = value.replace(/(\d{2})(\d)/, "$1/$2");

            dataInput.value = value;
        });
    }
});

//Passo 3
const inputsCodigo = document.querySelectorAll("#step3 input");

inputsCodigo.forEach((input, index) => {
    input.addEventListener("input", () => {
        if (input.value.length === 1 && index < inputsCodigo.length - 1) {
            inputsCodigo[index + 1].focus();
        }
    });

    // voltar com backspace
    input.addEventListener("keydown", (e) => {
        if (e.key === "Backspace" && input.value === "" && index > 0) {
            inputsCodigo[index - 1].focus();
        }
    });
});

//Troca de passos (1/2/3)
function nextStep(event, step) {
    event.preventDefault();

    // Validação antes de avançar
    if (step === 2 && !validarStep1()) return;

    // Oculta todas as telas
    document.querySelectorAll("[id^='step']").forEach(el => {
        el.classList.add("d-none");
    });

    // Mostra a desejada
    document.getElementById("step" + step).classList.remove("d-none");
}

// Seleção de Email ou SMS no passo 2
const opcoesContato = document.querySelectorAll('.opcao-contato');

opcoesContato.forEach(opcao => {
    opcao.addEventListener('click', () => {
        // Remove o azul de todas as opções
        opcoesContato.forEach(o => o.classList.remove('active-opcao'));
        
        // Adiciona o azul na opção clicada
        opcao.classList.add('active-opcao');
    });
});


//Finalizar login
function finishLogin(event) {
    event.preventDefault();

    let codigo = "";
    document.querySelectorAll("#step3 input").forEach(input => {
        codigo += input.value;
    });

    // Verifica se o código tem os 5 dígitos
    if (codigo.length < 5) {
        alert("Digite o código completo!");
        return;
    }
    window.location.href = "../pages/index.html";  
    // Se a index estiver uma pasta para trás (comum em projetos organizados):
    // window.location.href = "../index.html";
}





