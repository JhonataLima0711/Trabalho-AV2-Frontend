// ================================
// 🌙 TEMA GLOBAL (CLARO / ESCURO)
// ================================

// aplica o tema salvo ao carregar qualquer página
document.addEventListener("DOMContentLoaded", () => {
  const tema = localStorage.getItem("tema");

  if (tema === "dark") {
    document.body.classList.add("dark-mode");
  }

  // se existir o switch (só na tela de configurações)
  const temaSwitch = document.getElementById("temaSwitch");

  if (temaSwitch) {
    temaSwitch.checked = tema === "dark";

    temaSwitch.addEventListener("change", alternarTema);
  }
});

// alterna tema e salva
function alternarTema() {
  document.body.classList.toggle("dark-mode");

  if (document.body.classList.contains("dark-mode")) {
    localStorage.setItem("tema", "dark");
  } else {
    localStorage.setItem("tema", "light");
  }
}