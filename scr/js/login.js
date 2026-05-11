// =========================
// TROCA DE ETAPAS
// =========================
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

// =========================
// FINALIZAR LOGIN
// =========================
function finishLogin(event) {
    event.preventDefault();

    let codigo = "";
    document.querySelectorAll("#step3 input").forEach(input => {
        codigo += input.value;
    });

    if (codigo.length < 5 || codigo.includes("")) {
        alert("Digite o código completo!");
        return;
    }

    alert("Login realizado com sucesso ✅");
}


// =========================
// VALIDAÇÃO STEP 1
// =========================
function validarStep1() {
    const cpfInput = document.getElementById("cpf");
    const dataInput = document.getElementById("data");

    if (!cpfInput || !dataInput) {
        console.error("Inputs não encontrados");
        return false;
    }

    const cpf = cpfInput.value;
    const data = dataInput.value;

    if (cpf.length < 14) {
        alert("CPF inválido!");
        return false;
    }

    if (data.length < 10) {
        alert("Data inválida!");
        return false;
    }

    return true;
}

document.addEventListener("DOMContentLoaded", () => {

    const cpfInput = document.getElementById("cpf");
    const dataInput = document.getElementById("data")

    // =========================
    // MÁSCARA CPF
    // =========================
    if (cpfInput) {
        cpfInput.addEventListener("input", () => {
            let value = cpfInput.value.replace(/\D/g, "").slice(0, 11);

            value = value.replace(/(\d{3})(\d)/, "$1.$2");
            value = value.replace(/(\d{3})(\d)/, "$1.$2");
            value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");

            cpfInput.value = value;
        });
    }

    // =========================
    // MÁSCARA DATA
    // =========================
    if (dataInput) {
        dataInput.addEventListener("input", () => {
            let value = dataInput.value.replace(/\D/g, "").slice(0, 8);

            value = value.replace(/(\d{2})(\d)/, "$1/$2");
            value = value.replace(/(\d{2})(\d)/, "$1/$2");

            dataInput.value = value;
        });
    }
});
// =========================
// AUTO AVANÇO DO CÓDIGO
// =========================
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

