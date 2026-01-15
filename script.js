/* =====================================================
   CARREGAMENTO DE CABEÇALHO E RODAPÉ (GLOBAL)
   ===================================================== */
document.addEventListener("DOMContentLoaded", () => {
    const menu = document.getElementById("menu");
    const rodape = document.getElementById("rodape");

    if (menu) {
        const cabecalho = document.body.innerHTML.includes("cabecalhouser")
            ? "cabecalhouser.html"
            : document.body.innerHTML.includes("cabecalhoinicial")
            ? "cabecalhoinicial.html"
            : "cabecalho.html";

        fetch(cabecalho)
            .then(r => r.text())
            .then(html => (menu.innerHTML = html));
    }

    if (rodape) {
        fetch("rodape.html")
            .then(r => r.text())
            .then(html => (rodape.innerHTML = html));
    }
});


/* =====================================================
   LOGIN – login.html
   ===================================================== */
document.addEventListener("DOMContentLoaded", () => {
    const formLogin = document.getElementById("formlogin");
    if (!formLogin) return;

    formLogin.addEventListener("submit", e => {
        e.preventDefault();
        alert("Login efetuado com sucesso!");
        window.location.href = "principal.html";
    });
});


/* =====================================================
   CÓDIGO DE VERIFICAÇÃO – codigo.html
   ===================================================== */
document.addEventListener("DOMContentLoaded", () => {
    const inputs = document.querySelectorAll(".code-input");
    const formCodigo = document.getElementById("formCodigo");

    if (!inputs.length || !formCodigo) return;

    inputs.forEach((input, index) => {
        input.addEventListener("input", () => {
            input.value = input.value.replace(/\D/g, "");
            if (input.value && index < inputs.length - 1) {
                inputs[index + 1].focus();
            }
        });

        input.addEventListener("keydown", e => {
            if (e.key === "Backspace" && !input.value && index > 0) {
                inputs[index - 1].focus();
            }
        });
    });

    formCodigo.addEventListener("submit", e => {
        const codigo = [...inputs].map(i => i.value).join("");
        if (codigo.length !== 4) {
            e.preventDefault();
            alert("Digite os 4 números do código!");
        }
    });
});


/* =====================================================
   REDEFINIR SENHA – redefinirsenha.html
   ===================================================== */
document.addEventListener("DOMContentLoaded", () => {
    const formSenha = document.querySelector("form");
    if (!formSenha || !document.title.includes("Redefinir")) return;

    formSenha.addEventListener("submit", e => {
        e.preventDefault();
        alert("Senha redefinida com sucesso!");
        setTimeout(() => {
            window.location.href = "login.html";
        }, 800);
    });
});


/* =====================================================
   📅 CALENDÁRIO + PRIORIDADES DO MÊS (OFICIAL)
   ===================================================== */

document.addEventListener("DOMContentLoaded", () => {
    const corpoCalendario = document.getElementById("corpoCalendario");
    const prioridadesMes = document.getElementById("prioridadesMes");
    const mesAno = document.getElementById("mesAno");
    const btnAnterior = document.getElementById("btnAnterior");
    const btnProximo = document.getElementById("btnProximo");
    const btnGerenciarEventos = document.getElementById("btnGerenciarEventos");
    const listaEventosModal = document.getElementById("listaEventosModal");

    if (!corpoCalendario || !prioridadesMes) return;

    let dataAtual = new Date();
    const hoje = new Date();

    let eventos = JSON.parse(localStorage.getItem("eventosAgenda")) || [];

    function salvarEventos() {
        localStorage.setItem("eventosAgenda", JSON.stringify(eventos));
    }

    function renderizar() {
        corpoCalendario.innerHTML = "";
        prioridadesMes.innerHTML = "";

        const ano = dataAtual.getFullYear();
        const mes = dataAtual.getMonth();

        const nomeMes = dataAtual.toLocaleDateString("pt-BR", {
            month: "long",
            year: "numeric"
        });

        mesAno.textContent =
            nomeMes.charAt(0).toUpperCase() + nomeMes.slice(1);

        const primeiroDia = new Date(ano, mes, 1).getDay();
        const totalDias = new Date(ano, mes + 1, 0).getDate();

        let linha = document.createElement("tr");

        for (let i = 0; i < primeiroDia; i++) {
            linha.appendChild(document.createElement("td"));
        }

        for (let dia = 1; dia <= totalDias; dia++) {
            const td = document.createElement("td");
            td.innerHTML = `<strong>${dia}</strong>`;

            const dataISO = `${ano}-${String(mes + 1).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;
            const eventosDoDia = eventos.filter(e => e.data === dataISO);

            if (eventosDoDia.length) {
                const bolinhas = document.createElement("div");
                bolinhas.className = "bolinhas";

                eventosDoDia.forEach(ev => {
                    const b = document.createElement("div");
                    b.className = `bolinha ${ev.prioridade}`;
                    b.title = `${ev.nome} - ${ev.horario}`;
                    bolinhas.appendChild(b);
                });

                td.appendChild(bolinhas);
            }

            // destaque do dia atual
            if (
                dia === hoje.getDate() &&
                mes === hoje.getMonth() &&
                ano === hoje.getFullYear()
            ) {
                td.classList.add("hoje");
            }

            linha.appendChild(td);

            if ((primeiroDia + dia) % 7 === 0) {
                corpoCalendario.appendChild(linha);
                linha = document.createElement("tr");
            }
        }

        corpoCalendario.appendChild(linha);

        const eventosDoMes = eventos
            .filter(e => {
                const d = new Date(e.data);
                return d.getMonth() === mes && d.getFullYear() === ano;
            })
            .sort((a, b) => a.data.localeCompare(b.data));

        eventosDoMes.forEach(ev => {
            const li = document.createElement("li");
            li.className = "list-group-item d-flex align-items-center gap-2";

            li.innerHTML = `
                <span class="bolinha ${ev.prioridade}"></span>
                <div>
                    <strong>${ev.nome}</strong><br>
                    <small>${ev.data.split("-").reverse().join("/")} • ${ev.horario}</small>
                </div>
            `;

            prioridadesMes.appendChild(li);
        });
    }

    // navegação
    btnAnterior.onclick = () => {
        dataAtual.setMonth(dataAtual.getMonth() - 1);
        renderizar();
    };

    btnProximo.onclick = () => {
        dataAtual.setMonth(dataAtual.getMonth() + 1);
        renderizar();
    };

    mesAno.onclick = () => {
        dataAtual = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
        renderizar();
    };

    // modal de eventos
    btnGerenciarEventos.onclick = () => {
        listaEventosModal.innerHTML = "";

        if (!eventos.length) {
            listaEventosModal.innerHTML =
                `<li class="list-group-item text-center text-muted">
                    Nenhum evento cadastrado
                </li>`;
        }

        eventos.forEach((ev, index) => {
            const li = document.createElement("li");
            li.className =
                "list-group-item d-flex justify-content-between align-items-center";

            li.innerHTML = `
                <div>
                    <strong>${ev.nome}</strong><br>
                    <small>${ev.data.split("-").reverse().join("/")} • ${ev.horario}</small>
                </div>
                <button class="btn btn-sm btn-danger">Excluir</button>
            `;

            li.querySelector("button").onclick = () => {
                eventos.splice(index, 1);
                salvarEventos();
                renderizar();
                btnGerenciarEventos.click();
            };

            listaEventosModal.appendChild(li);
        });

        new bootstrap.Modal(
            document.getElementById("modalEventos")
        ).show();
    };

    renderizar();
});


/* =====================================
    Script usoarios - usoario.html
   =====================================*/

   document.addEventListener("DOMContentLoaded", () => {
    const tabela = document.getElementById("listaUsuarios");
    const btnEditar = document.getElementById("btnEditar");
    const btnExcluir = document.getElementById("btnExcluir");
    const checkAll = document.getElementById("checkAll");

    if (!tabela) return;

    // ==============================
    // CARREGAR USUÁRIOS
    // ==============================
    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    function renderizarTabela() {
        tabela.innerHTML = "";

        usuarios.forEach((u, index) => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>
                    <input type="checkbox" class="user-check" data-index="${index}">
                </td>
                <td>${u.nome}</td>
                <td>${u.email}</td>
                <td>${u.perfil}</td>
            `;
            tabela.appendChild(tr);
        });
    }

    renderizarTabela();

    // ==============================
    // CHECK ALL
    // ==============================
    checkAll?.addEventListener("change", () => {
        document.querySelectorAll(".user-check").forEach(c => {
            c.checked = checkAll.checked;
        });
    });

    function getSelecionados() {
        return [...document.querySelectorAll(".user-check")]
            .filter(c => c.checked)
            .map(c => Number(c.dataset.index));
    }

    // ==============================
    // EDITAR
    // ==============================
    btnEditar.addEventListener("click", () => {
        const selecionados = getSelecionados();

        if (selecionados.length === 0) {
            alert("Selecione ao menos um usuário para editar.");
            return;
        }

        if (selecionados.length > 1) {
            alert("Selecione apenas UM usuário para editar.");
            return;
        }

        localStorage.setItem("usuarioEditando", selecionados[0]);
        window.location.href = "editar.html";
    });

    // ==============================
    // EXCLUIR
    // ==============================
    btnExcluir.addEventListener("click", () => {
        const selecionados = getSelecionados();

        if (selecionados.length === 0) {
            alert("Selecione ao menos um usuário para excluir.");
            return;
        }

        if (!confirm("Tem certeza que deseja excluir?")) return;

        usuarios = usuarios.filter((_, index) => !selecionados.includes(index));
        localStorage.setItem("usuarios", JSON.stringify(usuarios));
        renderizarTabela();
    });
});

/* =====================================================
   ➕ ADICIONAR EVENTO – agenda.html
   ===================================================== */

document.addEventListener("DOMContentLoaded", () => {
    const formAgenda = document.getElementById("formAgenda");
    if (!formAgenda) return; // só roda na página certa

    formAgenda.addEventListener("submit", (e) => {
        e.preventDefault();

        const nome = document.getElementById("nomeEvento").value.trim();
        const horario = document.getElementById("horario").value;
        const descricao = document.getElementById("descricao").value.trim();
        const prioridade = document.getElementById("prioridade").value;
        const data = document.getElementById("data").value;

        // 🔒 validação
        if (!nome || !horario || !prioridade || !data) {
            alert("⚠️ Preencha todos os campos obrigatórios.");
            return;
        }

        const novoEvento = {
            nome,
            horario,
            descricao,
            prioridade,
            data
        };

        const eventos = JSON.parse(localStorage.getItem("eventosAgenda")) || [];
        eventos.push(novoEvento);
        localStorage.setItem("eventosAgenda", JSON.stringify(eventos));

        alert("✅ Evento salvo com sucesso!");

        
        window.location.href = "principal.html";
    });
});


//================================================
//    balão de como o usoario pode mexer no site
//================================================

document.addEventListener("DOMContentLoaded", () => {

    const btnAdd = document.getElementById("btnAdd");
    const btnRemove = document.getElementById("btnGerenciarEventos");

    if (!btnAdd || !btnRemove) return;

    const dicaAdd = new bootstrap.Tooltip(btnAdd, {
        title: "Clique aqui para adicionar um lembrete",
        placement: "bottom",
        trigger: "manual"
    });

    const dicaRemove = new bootstrap.Tooltip(btnRemove, {
        title: "Clique aqui para remover um lembrete ou evento",
        placement: "bottom",
        trigger: "manual"
    });

    
    const tempoAntesAdd = 2000;    
    const tempoAddVisivel = 3000;  

    const tempoAntesRemove = 6000; 
    const tempoRemoveVisivel = 3000;

    setTimeout(() => {
        dicaAdd.show();

        setTimeout(() => {
            dicaAdd.hide();
        }, tempoAddVisivel);

    }, tempoAntesAdd);

    setTimeout(() => {
        dicaRemove.show();

        setTimeout(() => {
            dicaRemove.hide();
        }, tempoRemoveVisivel);

    }, tempoAntesRemove);

});


