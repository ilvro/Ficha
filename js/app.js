/* ==========================================================================
   VAESEN — Ficha Digital — LÓGICA DA APLICAÇÃO
   Você não precisa editar este arquivo para adicionar conteúdo de jogo —
   isso é feito em js/data.js. Este arquivo só lê os dados de lá e desenha
   a ficha / cuida de salvar e carregar.
   ========================================================================== */

const TREINOS = [
  { valor: 0,  nome: "Destreinado", icone: "img/icons/untrained.svg" },
  { valor: 5,  nome: "Treinado",    icone: "img/icons/trained.svg" },
  { valor: 10, nome: "Veterano",    icone: "img/icons/veteran.svg" },
  { valor: 15, nome: "Expert",      icone: "img/icons/expert.svg" },
];

function estadoPadrao(){
  const pericias = {};
  PERICIAS.forEach(p => pericias[p.id] = { treino: 0, extra: 0 });
  return {
    nome: "", jogador: "",
    origemId: ORIGENS[0].id,
    classeId: "sobrevivente",
    trilhaId: "",
    nex: 0,
    atributos: { for: 1, agi: 1, vig: 1, int: 1, pre: 1 },
    pv: { atual: null, temp: 0, marcas: 0 },
    pe: { atual: null, temp: 0 },
    san: { atual: null, temp: 0, marcas: 0 },
    deslocamento: "9m (6q)",
    defesaOutros: 0,
    pericias,
    ataques: [],
    poderesEscolhidos: [],
    poderesCustomizados: [],
    poderesParanormais: [],
    rituaisConhecidos: [],
    inventario: [],
    condicoesAtivas: [],
    notas: "",
    theme: "penumbra",
    bonusTransicao: { pv: 0, pe: 0 }, // ganho único ao sair de Sobrevivente (Treinamento Especial)
    preTransicao: null,               // snapshot de antes do Treinamento Especial, pra poder desfazer
  };
}

let state = estadoPadrao();
// Último valor de NEX/Estágio "confirmado" (validado pelas regras de trilha).
// Usado para reverter o slider #fNex se o jogador cancelar a escolha
// obrigatória de trilha no Estágio 2, ou cancelar a perda dela ao voltar pro
// Estágio 1.
let nexConfirmado = state.nex;
function sincronizarNexConfirmado(){ nexConfirmado = state.nex; }

// Liga um evento a um elemento por id SEM quebrar o app inteiro se o
// elemento não existir (ex: alguém copiou um app.js novo com um index.html
// mais antigo, faltando algum id novo). Em vez de travar toda a inicialização
// no meio, só avisa no console e segue o resto normalmente.
function on(id, evento, handler){
  const el = document.getElementById(id);
  if(el){ el.addEventListener(evento, handler); }
  else { console.warn(`Elemento #${id} não encontrado no HTML — esse controle não vai funcionar. Confira se o index.html/css/js são todos da mesma versão (baixe o pacote completo de novo).`); }
  return el;
}

/* ------------------------------------------------------------ derivações */
// "Steps" = quantos aumentos de NEX (de 5 em 5) o personagem já teve desde o
// NEX-base da SUA classe. Combatente/Especialista/Ocultista têm base em
// NEX 5% (como no livro); Sobrevivente tem base em NEX 0% (c.nexBase = 0).
function passosNex(){
  const c = classeAtual();
  const nexBase = (c && typeof c.nexBase === "number") ? c.nexBase : 5;
  return Math.max(0, Math.floor((state.nex - nexBase) / 5));
}
function classeAtual(){ return CLASSES[state.classeId]; }
function classeEhMundana(c){ c = c || classeAtual(); return !!(c && c.mundano); }
// Sobrevivente (mundana) usa "Estágio" (1 a 5) em vez de NEX%. Internamente
// ainda guardamos em state.nex (0,5,10,15,20 = Estágio 1 a 5) para reusar a
// mesma tabelaNex/lógica de trilha das outras classes.
function estagioAtual(){ return Math.floor(state.nex / 5) + 1; }
function nexMinParaClasse(c){ return classeEhMundana(c) ? 0 : 5; }
function nexMaxParaClasse(c){ c = c || classeAtual(); return classeEhMundana(c) ? (c.nexMax || 20) : 99; }
function trilhaAtual(){
  const c = classeAtual();
  if(!c) return null;
  return c.trilhas.find(t => t.id === state.trilhaId) || null;
}
function origemAtual(){ return ORIGENS.find(o => o.id === state.origemId); }

// Regra do Sobrevivente: a trilha só é escolhida (e obrigatória) a partir do
// Estágio 2. Se o personagem voltar para o Estágio 1 (nex < 5), ele perde a
// trilha, como se nunca tivesse escolhido — os poderes/bônus dela (que são
// calculados sempre a partir de trilhaAtual()) somem automaticamente junto.
function aplicarRegraTrilhaSobrevivente(){
  const c = classeAtual();
  if(classeEhMundana(c) && estagioAtual() < 2 && state.trilhaId){
    state.trilhaId = "";
  }
}
// A trilha é obrigatória (Sobrevivente, Estágio 2+) mas ainda não foi escolhida.
function trilhaPendente(){
  const c = classeAtual();
  return classeEhMundana(c) && estagioAtual() >= 2 && !state.trilhaId;
}

// Por padrão (Combatente/Especialista/Ocultista), cada estágio de NEX soma de
// novo o atributo (Vigor/Presença) além do valor fixo "porNex" — assim
// funciona no livro. Uma classe pode desligar isso com
// "escalaAtributoPorNex: false" (usado pela Sobrevivente, cuja homebrew diz
// só "+2 PV" / "+1 PE" fixos por estágio, sem repetir o atributo).
// Soma os valores de um mapa {estagio: valor} para todo estagio já alcançado
// (estagio <= estagioAtualVal), usado pelos bônus/overrides de PV de trilha.
function somaPorEstagioAlcancado(mapa, estagioAtualVal){
  return Object.keys(mapa).reduce((acc, k) => acc + (parseInt(k, 10) <= estagioAtualVal ? mapa[k] : 0), 0);
}

// Alguns poderes de classe (Saúde/Sanidade/Esforço Aprimorado) dão bônus
// permanente de PV/SAN/PE — como são "poderes escolhidos" (e não algo
// automático de trilha), verificamos se o jogador já escolheu esse poder
// específico pelo nome.
function temPoderEscolhido(nome){
  return state.poderesEscolhidos.some(p => p.nome === nome);
}

function pvMax(){
  const c = classeAtual(); const steps = passosNex(); const vig = state.atributos.vig;
  const somaAtributo = c.escalaAtributoPorNex === false ? 0 : vig;
  const t = trilhaAtual();
  const estagio = estagioAtual();

  // Progressão normal de PV por estágio (classe). Uma trilha pode SUBSTITUIR
  // isso por valores fixos próprios usando "pvSubstituiProgressao" (ex:
  // Esotérico do Sobrevivente, que ganha só +1 PV no Estágio 2 e +1 no
  // Estágio 5, em vez do +2/estágio padrão da classe).
  let progressaoPv = steps * (c.pv.porNex + somaAtributo);
  if(t && t.pvSubstituiProgressao){
    progressaoPv = somaPorEstagioAlcancado(t.pvSubstituiProgressao, estagio);
  }

  // Além disso, uma trilha pode dar um bônus de PV fixo por cima da
  // progressão normal, usando "pvBonusPorEstagio" (ex: Durão do
  // Sobrevivente: +4 PV no Estágio 2, +2 PV adicionais no Estágio 3).
  const bonusTrilha = (t && t.pvBonusPorEstagio) ? somaPorEstagioAlcancado(t.pvBonusPorEstagio, estagio) : 0;
  const bonusSaude = temPoderEscolhido("Saúde Aprimorada") ? 5 : 0;

  const bonus = (state.bonusTransicao && state.bonusTransicao.pv) || 0;
  return c.pv.base + vig + progressaoPv + bonusTrilha + bonusSaude + bonus;
}
function peMax(){
  const c = classeAtual(); const steps = passosNex(); const pre = state.atributos.pre;
  const somaAtributo = c.escalaAtributoPorNex === false ? 0 : pre;
  const bonusEsforco = temPoderEscolhido("Esforço Aprimorado") ? 5 : 0;
  const bonus = (state.bonusTransicao && state.bonusTransicao.pe) || 0;
  return c.pe.base + pre + steps * (c.pe.porNex + somaAtributo) + bonusEsforco + bonus;
}
function sanMax(){
  const c = classeAtual(); const steps = passosNex();
  const bonusSanidade = temPoderEscolhido("Sanidade Aprimorada") ? 5 : 0;
  return c.san.base + steps * c.san.porNex + bonusSanidade;
}
// Limite de PE por turno: para o Sobrevivente (classe mundana), o Estágio NÃO
// é NEX de verdade, então o limite fica travado em 2 em qualquer estágio.
// Para as classes reais, volta a ser o valor clássico (2 em NEX 5%, subindo
// +1 a cada NEX seguinte: NEX 10%=3, NEX 15%=4...).
function pePorTurnoMax(){
  const c = classeAtual();
  if(classeEhMundana(c)) return 2;
  return 2 + passosNex();
}
function defesa(){ return 10 + state.atributos.agi + (state.defesaOutros || 0); }

function periciasTreinadasDaOrigem(){
  const o = origemAtual();
  return o ? o.pericias : [];
}

// Garante que as perícias de treino automático da origem fiquem, no mínimo, Treinadas.
function aplicarTreinoDaOrigem(){
  periciasTreinadasDaOrigem().forEach(id => {
    if(state.pericias[id] && state.pericias[id].treino < 5){
      state.pericias[id].treino = 5;
    }
  });
}
// Ao trocar de origem, desfaz o treino automático que a origem ANTERIOR
// tinha concedido — mas só se a perícia ainda estiver exatamente em
// Treinado (5), que é o piso que a origem impõe. Se o jogador já tiver
// subido essa perícia manualmente pra Veterano/Expert, o valor fica maior
// que 5 e não é mexido. Sem isso, trocar de origem repetidas vezes durante
// a criação da ficha ia empilhando o treino de todas as origens já usadas.
function removerTreinoDaOrigemAnterior(idOrigemAnterior){
  const o = ORIGENS.find(x => x.id === idOrigemAnterior);
  if(!o) return;
  o.pericias.forEach(id => {
    if(state.pericias[id] && state.pericias[id].treino === 5){
      state.pericias[id].treino = 0;
    }
  });
}

/* ================================================================ RENDER */

function renderTudo(){
  renderSelects();
  renderIdentidadeCampos();
  renderAtributos();
  renderRecursos();
  renderPericias();
  renderAtaques();
  renderHabilidades();
  renderRituais();
  renderInventario();
  renderCondicoes();
  document.getElementById("fNotas").value = state.notas;
  document.documentElement.dataset.theme = state.theme;
}

function renderSelects(){
  const fOrigem = document.getElementById("fOrigem");
  fOrigem.innerHTML = ORIGENS.map(o => `<option value="${o.id}">${o.nome}</option>`).join("");
  fOrigem.value = state.origemId;

  const fClasse = document.getElementById("fClasse");
  fClasse.innerHTML = Object.keys(CLASSES).map(id => `<option value="${id}">${CLASSES[id].nome}</option>`).join("");
  fClasse.value = state.classeId;

  const fTrilha = document.getElementById("fTrilha");
  const trilhas = classeAtual().trilhas;
  fTrilha.innerHTML = `<option value="">— nenhuma ainda —</option>` +
    trilhas.map(t => `<option value="${t.id}">${t.nome}</option>`).join("");
  fTrilha.value = state.trilhaId;

  const pendente = trilhaPendente();
  fTrilha.classList.toggle("campo-obrigatorio", pendente);
  const aviso = document.getElementById("fTrilhaAviso");
  if(aviso) aviso.style.display = pendente ? "block" : "none";
}

function renderIdentidadeCampos(){
  document.getElementById("fNome").value = state.nome;
  document.getElementById("fJogador").value = state.jogador;

  const c = classeAtual();
  const mundana = classeEhMundana(c);
  const fNex = document.getElementById("fNex");
  fNex.min = nexMinParaClasse(c);
  fNex.max = nexMaxParaClasse(c);
  // segurança: se o valor guardado estiver fora do intervalo da classe atual
  // (ex: ficha antiga carregada), encaixa no limite mais próximo.
  if(state.nex < fNex.min) state.nex = parseInt(fNex.min, 10);
  if(state.nex > fNex.max) state.nex = parseInt(fNex.max, 10);
  fNex.value = state.nex;

  document.getElementById("fNexLabel").textContent = mundana ? "Estágio (Sobrevivente)" : "Nível de Exposição (NEX)";
  document.getElementById("fNexValue").textContent = mundana ? ("Estágio " + estagioAtual() + " de 5") : (state.nex + "%");

  document.getElementById("fDeslocamento").value = state.deslocamento;
}

// O pentágono de atributos usa a imagem "img/attributes.png" — o app só
// sobrepõe os NÚMEROS por cima, cada grupo (◀ número ▶) posicionado (via
// CSS, em % — ver ".attr-item-*" em style.css) no hexágono certo. Clique/
// toque no número pra digitar direto, ou use as setinhas — mesmo padrão das
// barras de recurso. NEX/NVL ficam nos círculos separados de novo (a arte
// tem hexágonos pra eles nos cantos de cima, mas ficaram pequenos demais
// pra caber o texto "Estágio X" — por enquanto voltou pro círculo à parte).
function renderAtributos(){
  const el = document.getElementById("attrCluster");
  el.innerHTML = `
    <img src="img/attributes.png" alt="Atributos" class="attr-imagem">
    ${ATRIBUTOS.map(a => `
      <div class="attr-item attr-item-${a.id}">
        <button type="button" class="attr-btn attr-btn-dec" data-attr="${a.id}">◀</button>
        <input type="number" class="attr-valor" data-attr="${a.id}" value="${state.atributos[a.id]}" min="0">
        <button type="button" class="attr-btn attr-btn-inc" data-attr="${a.id}">▶</button>
      </div>
    `).join("")}
  `;

  const mundana = classeEhMundana();
  const hexNex = document.getElementById("hexNexValor");
  hexNex.textContent = mundana ? ("Estágio " + estagioAtual()) : (state.nex + "%");
  hexNex.classList.toggle("hex-badge-val-compacto", mundana);
  document.getElementById("hexNvlValor").textContent = Math.floor(state.nex / 5);

  function commitAtributo(attr, valor){
    state.atributos[attr] = Math.max(0, valor);
    renderRecursos(); renderPericias();
  }
  el.querySelectorAll(".attr-valor").forEach(inp => {
    inp.addEventListener("input", e => {
      commitAtributo(e.target.dataset.attr, parseInt(e.target.value, 10) || 0);
    });
  });
  el.querySelectorAll(".attr-btn-inc").forEach(b => {
    b.addEventListener("click", () => {
      const attr = b.dataset.attr;
      const inp = el.querySelector(`.attr-valor[data-attr="${attr}"]`);
      const novo = (state.atributos[attr] || 0) + 1;
      inp.value = novo;
      commitAtributo(attr, novo);
    });
  });
  el.querySelectorAll(".attr-btn-dec").forEach(b => {
    b.addEventListener("click", () => {
      const attr = b.dataset.attr;
      const inp = el.querySelector(`.attr-valor[data-attr="${attr}"]`);
      const novo = Math.max(0, (state.atributos[attr] || 0) - 1);
      inp.value = novo;
      commitAtributo(attr, novo);
    });
  });
}

// Ícones dos medalhões de Vida/Sanidade/Esforço — trocam de imagem conforme
// o estado atual (cheio / metade / crítico / zerado).
// Os arquivos ficam em img/icons/ — troque pelos seus próprios se quiser.
const ICONES_RECURSO = {
  pv:  { full: "img/icons/pv-full.svg",     half: "img/icons/pv-half.svg",     low: "img/icons/pv-low.svg",     empty: "img/icons/pv-empty.svg" },
  san: { full: "img/icons/sanity-full.svg", half: "img/icons/sanity-half.svg", low: "img/icons/sanity-low.svg", empty: "img/icons/sanity-empty.svg" },
  pe:  { full: "img/icons/effort-full.svg", half: "img/icons/effort-half.svg", empty: "img/icons/effort-empty.svg" },
};

// Define qual estágio do ícone usar, pra cada recurso.
// PV/Sanidade: cheio (>50%) / metade (25–50%, igual ao Machucado/Perturbado)
// / crítico (0–25%) / zerado (exatamente 0, ícone próprio).
// Esforço: cheio (>50%) / metade (>0–50%) / vazio (exatamente 0).
function tierRecurso(chave, atual, max){
  const pct = max > 0 ? (atual / max) * 100 : 0;
  if(atual <= 0) return "empty";
  if(chave === "pe") return pct > 50 ? "full" : "half";
  if(pct > 50) return "full";
  if(pct > 25) return "half";
  return "low";
}

const RECURSOS_CONFIG = [
  { chave: "pv", nome: "Vida", statusEl: "pvStatus", iconeMarca: "img/icons/empty-skull-icon.svg" },
  { chave: "san", nome: "Sanidade", statusEl: "sanStatus", iconeMarca: "img/icons/empty-brain-icon.svg" },
  { chave: "pe", nome: "Esforço", statusEl: null, iconeMarca: null },
];

const MAXFN_RECURSO = { pv: pvMax, pe: peMax, san: sanMax };

// Atualização "leve" de um recurso (só a barra e o status), usada enquanto o
// jogador digita no campo de PV/PE/SAN atual — evita recriar o <input> a
// cada tecla (o que resetaria o cursor no meio da digitação).
function atualizarBarraRecurso(chave, cardEl){
  const max = MAXFN_RECURSO[chave]();
  const atual = Math.min(state[chave].atual, max);
  cardEl.querySelector(".r-fill").style.width = Math.max(0, (atual / max) * 100) + "%";
  cardEl.querySelector(".r-max").textContent = max;

  const iconeEl = cardEl.querySelector(".r-medalhao img");
  if(iconeEl) iconeEl.src = ICONES_RECURSO[chave][tierRecurso(chave, atual, max)];

  const curarBtn = cardEl.querySelector(".r-curar-btn");
  if(curarBtn) curarBtn.style.display = atual <= 0 ? "" : "none";

  if(chave === "pv"){
    const st = document.getElementById("pvStatus");
    if(atual <= 0){ st.textContent = "Morrendo"; st.classList.add("show"); }
    else if(atual <= max / 2){ st.textContent = "Machucado"; st.classList.add("show"); }
    else st.classList.remove("show");
  }
  if(chave === "san"){
    const st = document.getElementById("sanStatus");
    if(atual <= 0){ st.textContent = "Insano"; st.classList.add("show"); }
    else if(atual <= max / 2){ st.textContent = "Perturbado"; st.classList.add("show"); }
    else st.classList.remove("show");
  }
}

// Redesenha só o miolo de ".r-marcas" (as caveiras/cérebros de
// Morrendo/Enlouquecendo) de um recurso específico, sem mexer no resto da
// barra — chamado depois de curar ou de remover uma marca manualmente.
function renderMarcasRecurso(chave, cardEl){
  const cfg = RECURSOS_CONFIG.find(c => c.chave === chave);
  const marcasEl = cardEl.querySelector(".r-marcas");
  if(!cfg || !cfg.iconeMarca || !marcasEl) return;
  const marcas = state[chave].marcas || 0;
  marcasEl.innerHTML = Array.from({ length: marcas }).map(() => `
    <button type="button" class="r-marca-btn" data-res="${chave}" title="Remover marca">
      <img src="${cfg.iconeMarca}" alt="marca">
    </button>
  `).join("");
  marcasEl.querySelectorAll(".r-marca-btn").forEach(b => {
    b.addEventListener("click", () => {
      state[chave].marcas = Math.max(0, (state[chave].marcas || 0) - 1);
      renderMarcasRecurso(chave, cardEl);
    });
  });
}

function renderRecursos(){
  if(state.pv.atual === null) state.pv.atual = pvMax();
  if(state.pe.atual === null) state.pe.atual = peMax();
  if(state.san.atual === null) state.san.atual = sanMax();

  const container = document.getElementById("resourcesContainer");
  container.innerHTML = RECURSOS_CONFIG.map(cfg => {
    const max = MAXFN_RECURSO[cfg.chave]();
    const atual = Math.min(state[cfg.chave].atual, max);
    const temp = state[cfg.chave].temp || 0;
    const pct = Math.max(0, Math.min(100, (atual / max) * 100));
    const icone = ICONES_RECURSO[cfg.chave][tierRecurso(cfg.chave, atual, max)];
    const marcas = state[cfg.chave].marcas || 0;
    return `
      <div class="resource ${cfg.chave} ${temp > 0 ? "tem-temp" : ""}" data-res="${cfg.chave}">
        <div class="r-medalhao"><img src="${icone}" alt="${cfg.nome}"></div>
        <div class="r-corpo">
          <div class="r-head">
            <span class="r-name">${cfg.nome}</span>
            ${cfg.iconeMarca ? `
              <span class="r-marcas" data-res="${cfg.chave}">
                ${Array.from({ length: marcas }).map(() => `
                  <button type="button" class="r-marca-btn" data-res="${cfg.chave}" title="Remover marca">
                    <img src="${cfg.iconeMarca}" alt="marca">
                  </button>
                `).join("")}
              </span>
            ` : ""}
            ${cfg.statusEl ? `<span class="r-status" id="${cfg.statusEl}"></span>` : ""}
          </div>
          <div class="r-track">
            <div class="r-fill" style="width:${pct}%"></div>
            <div class="r-valor-overlay">
              <button type="button" class="r-atual-btn r-atual-dec" data-res="${cfg.chave}">◀</button>
              <input type="number" class="r-input-atual" data-res="${cfg.chave}" value="${atual}">
              <span class="r-barra-sep">/</span>
              <span class="r-max">${max}</span>
              <button type="button" class="r-atual-btn r-atual-inc" data-res="${cfg.chave}">▶</button>
            </div>
          </div>
          <div class="r-temp">
            <span class="r-temp-label">Temp.</span>
            <button type="button" class="r-temp-btn r-temp-dec" data-res="${cfg.chave}">◀</button>
            <span class="r-temp-val">${temp}</span>
            <button type="button" class="r-temp-btn r-temp-inc" data-res="${cfg.chave}">▶</button>
            <button type="button" class="r-curar-btn" data-res="${cfg.chave}" style="${atual <= 0 ? "" : "display:none;"}">
              <img src="img/icons/heal-icon.svg" alt=""> Curar
            </button>
          </div>
        </div>
      </div>
    `;
  }).join("");

  container.querySelectorAll(".r-input-atual").forEach(inp => {
    inp.addEventListener("input", e => {
      const chave = e.target.dataset.res;
      const max = MAXFN_RECURSO[chave]();
      state[chave].atual = Math.min(Math.max(0, parseInt(e.target.value, 10) || 0), max);
      atualizarBarraRecurso(chave, e.target.closest(".resource"));
    });
  });
  // Setas de +1/-1 no valor atual (ao lado do valor, dentro da barra) — usam
  // atualizarBarraRecurso (só mexe no DOM já existente) em vez de redesenhar
  // tudo, assim a barra anima suavemente em vez de "pular" pro novo tamanho.
  container.querySelectorAll(".r-atual-inc").forEach(b => {
    b.addEventListener("click", () => {
      const chave = b.dataset.res;
      const max = MAXFN_RECURSO[chave]();
      state[chave].atual = Math.min(max, (state[chave].atual || 0) + 1);
      const cardEl = b.closest(".resource");
      cardEl.querySelector(".r-input-atual").value = state[chave].atual;
      atualizarBarraRecurso(chave, cardEl);
    });
  });
  container.querySelectorAll(".r-atual-dec").forEach(b => {
    b.addEventListener("click", () => {
      const chave = b.dataset.res;
      const max = MAXFN_RECURSO[chave]();
      state[chave].atual = Math.max(0, (state[chave].atual || 0) - 1);
      const cardEl = b.closest(".resource");
      cardEl.querySelector(".r-input-atual").value = state[chave].atual;
      atualizarBarraRecurso(chave, cardEl);
    });
  });
  container.querySelectorAll(".r-temp-inc").forEach(b => {
    b.addEventListener("click", () => {
      const chave = b.dataset.res;
      state[chave].temp = (state[chave].temp || 0) + 1;
      const cardEl = b.closest(".resource");
      cardEl.querySelector(".r-temp-val").textContent = state[chave].temp;
      cardEl.classList.toggle("tem-temp", state[chave].temp > 0);
    });
  });
  container.querySelectorAll(".r-temp-dec").forEach(b => {
    b.addEventListener("click", () => {
      const chave = b.dataset.res;
      state[chave].temp = Math.max(0, (state[chave].temp || 0) - 1);
      const cardEl = b.closest(".resource");
      cardEl.querySelector(".r-temp-val").textContent = state[chave].temp;
      cardEl.classList.toggle("tem-temp", state[chave].temp > 0);
    });
  });
  // Botão "Curar" só aparece quando o recurso está zerado — clicar nele dá
  // 1 ponto de volta (o suficiente pra sair do zero) e, pra Vida/Sanidade,
  // marca 1 "falha" (caveira/cérebro, até 3 — testes de Morrendo/Enlouquecendo).
  // Esforço não tem essa marca, só volta o ponto mesmo.
  container.querySelectorAll(".r-curar-btn").forEach(b => {
    b.addEventListener("click", () => {
      const chave = b.dataset.res;
      state[chave].atual = 1;
      if(chave === "pv" || chave === "san"){
        state[chave].marcas = Math.min(3, (state[chave].marcas || 0) + 1);
      }
      const cardEl = b.closest(".resource");
      cardEl.querySelector(".r-input-atual").value = state[chave].atual;
      atualizarBarraRecurso(chave, cardEl);
      renderMarcasRecurso(chave, cardEl);
    });
  });
  container.querySelectorAll(".r-marca-btn").forEach(b => {
    b.addEventListener("click", () => {
      const chave = b.dataset.res;
      state[chave].marcas = Math.max(0, (state[chave].marcas || 0) - 1);
      renderMarcasRecurso(chave, b.closest(".resource"));
    });
  });

  document.getElementById("cdDefesa").textContent = defesa();
  document.getElementById("defesaAgiLabel").textContent = `+ AGI (${state.atributos.agi})`;
  document.getElementById("defesaAgiVal").textContent = state.atributos.agi;
  document.getElementById("fDefesaOutros").value = state.defesaOutros || 0;
  document.getElementById("cdPePorTurno").textContent = pePorTurnoMax();

  const qtdTreinadas = Object.values(state.pericias).filter(p => p.treino > 0).length;
  document.getElementById("cdPericiasQtd").textContent = qtdTreinadas;
}

// Qualquer poder (de origem, geral, de classe, de trilha, paranormal ou
// customizado) pode ter um campo opcional "bonus" em data.js, que aparece
// como um selo destacado no card do poder. Ele aceita duas formas:
//
// 1) TEXTO LIVRE — pra qualquer bônus, inclusive os que não são um número
//    fixo de perícia (ex: metade de Sanidade inicial, RD, PV, PE...):
//      bonus: "+2 em Diplomacia"
//      bonus: "Sanidade inicial pela metade"
//
// 2) OBJETO — só pra bônus numérico DE PERÍCIA que deve ser somado
//    automaticamente ao total da perícia na aba Perícias, escalando com o
//    NEX (ex: "Resistente" — +1 de Fortitude a cada NEX ímpar). Funciona
//    apenas em poderes de classe/gerais escolhidos e em poderes de trilha
//    (veja bonusPoderesPorPericia, abaixo) — poder de origem, paranormal e
//    customizado só mostram o selo, sem somar automaticamente:
//      bonus: { pericia: "fortitude", formula: "porNexImpar", valor: 1 }
//    Fórmulas aceitas:
//      "fixo"         -> soma "valor" direto, uma vez só (não escala com NEX)
//      "porNex5"      -> soma "valor" pra cada 5% de NEX (1 por estágio)
//      "porNexImpar"  -> soma "valor" a cada NEX ímpar alcançado (5%, 15%,
//                        25%, 35%... — os múltiplos de 5 com final ímpar)
function contarNexImpar(nex){
  let count = 0;
  for(let n = 5; n <= nex; n += 10) count++;
  return count;
}
function valorBonusPoder(bonus){
  if(!bonus) return 0;
  if(bonus.formula === "fixo") return bonus.valor;
  if(bonus.formula === "porNex5") return Math.floor(state.nex / 5) * bonus.valor;
  if(bonus.formula === "porNexImpar") return contarNexImpar(state.nex) * bonus.valor;
  return 0;
}
// Transforma o campo "bonus" (texto livre OU objeto {pericia,formula,valor})
// no texto exibido no selo do card. Usado por bonusBadge, abaixo.
function bonusLabel(bonus){
  if(!bonus) return "";
  if(typeof bonus === "string") return bonus;
  if(bonus.pericia){
    const per = PERICIAS.find(p => p.id === bonus.pericia);
    const nomePer = per ? per.nome : bonus.pericia;
    if(bonus.formula === "fixo") return `+${bonus.valor} em ${nomePer}`;
    return `+${valorBonusPoder(bonus)} em ${nomePer} (escala com NEX)`;
  }
  return "";
}
// HTML do selo de bônus pra colar dentro de um card de poder. Retorna ""
// se o poder não tiver campo "bonus".
function bonusBadge(bonus){
  const label = bonusLabel(bonus);
  return label ? `<div class="card-bonus">✦ ${label}</div>` : "";
}
// Varre poderes escolhidos (classe/geral) + habilidades de trilha já
// desbloqueadas, somando os bônus de cada perícia. Retorna um objeto tipo
// { fortitude: 3, reflexos: 1 }.
function bonusPoderesPorPericia(){
  const soma = {};
  function considerar(fonte){
    if(!fonte || !fonte.bonus || !fonte.bonus.pericia) return;
    const v = valorBonusPoder(fonte.bonus);
    if(v) soma[fonte.bonus.pericia] = (soma[fonte.bonus.pericia] || 0) + v;
  }
  const o = origemAtual();
  if(o) considerar(o.poder);
  state.poderesEscolhidos.forEach(considerar);
  state.poderesParanormais.forEach(considerar);
  state.poderesCustomizados.forEach(considerar);
  const t = trilhaAtual();
  if(t) t.poderes.filter(p => p.nex <= state.nex).forEach(considerar);
  return soma;
}

function renderPericias(){
  const busca = (document.getElementById("pericBusca").value || "").toLowerCase();
  const tbody = document.getElementById("pericTableBody");
  const origemTreinadas = periciasTreinadasDaOrigem();
  const bonusPoderes = bonusPoderesPorPericia();

  tbody.innerHTML = PERICIAS
    .filter(p => p.nome.toLowerCase().includes(busca))
    .map(p => {
      const st = state.pericias[p.id];
      const atrVal = state.atributos[p.atributo];
      const dados = Math.max(atrVal, 1);
      const bonusPoder = bonusPoderes[p.id] || 0;
      const total = st.treino + st.extra + bonusPoder;
      const viaOrigem = origemTreinadas.includes(p.id);
      const treinoAtual = TREINOS.find(t => t.valor === st.treino) || TREINOS[0];
      return `
        <div class="pericia-row" data-pericia="${p.id}">
          <div class="pr-nome">
            <span class="pr-icone" aria-hidden="true"></span>
            <div class="pr-nome-col">
              <div class="pr-nome-txt">${p.nome}${viaOrigem ? ' <span class="tag accent">origem</span>' : ''}${p.somenteTreinado ? ' <span class="tag ember">só treinado</span>' : ''}</div>
              <div class="pericia-dados" title="${dados}d20">
                <span class="pericia-dados-txt">${dados}d20</span>
                <div class="dado-pips">${'<span class="dado-pip"></span>'.repeat(dados)}</div>
              </div>
            </div>
          </div>
          <div class="pr-treino">
            <div class="treino-dropdown">
              <button type="button" class="treino-toggle" title="${treinoAtual.nome}">
                <img src="${treinoAtual.icone}" alt="${treinoAtual.nome}" class="treino-icon">
              </button>
              <div class="treino-menu" role="listbox">
                ${TREINOS.map(t => `
                  <button type="button" class="treino-opcao ${st.treino===t.valor ? 'selecionada':''}" data-valor="${t.valor}" role="option" title="${t.nome}">
                    <img src="${t.icone}" alt="${t.nome}" class="treino-icon">
                    <span>${t.nome}</span>
                  </button>
                `).join("")}
              </div>
            </div>
          </div>
          <div class="pr-atrib">${ATRIBUTOS.find(a=>a.id===p.atributo).abrev}</div>
          <div class="pr-extra"><input type="number" class="pericia-extra" value="${st.extra}"></div>
          <div class="pr-total">${total}${bonusPoder ? `<small class="p-bonus-poder" title="Bônus automático de poder/habilidade">+${bonusPoder} poder</small>` : ""}</div>
        </div>
      `;
    }).join("");

  tbody.querySelectorAll(".treino-toggle").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const dropdown = btn.closest(".treino-dropdown");
      const jaAberto = dropdown.classList.contains("open");
      tbody.querySelectorAll(".treino-dropdown.open").forEach(d => d.classList.remove("open"));
      if(!jaAberto) dropdown.classList.add("open");
    });
  });
  tbody.querySelectorAll(".treino-opcao").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const id = e.target.closest(".pericia-row").dataset.pericia;
      state.pericias[id].treino = parseInt(btn.dataset.valor, 10);
      renderPericias(); renderRecursos();
    });
  });
  tbody.querySelectorAll(".pericia-extra").forEach(inp => {
    inp.addEventListener("input", (e) => {
      const id = e.target.closest(".pericia-row").dataset.pericia;
      state.pericias[id].extra = parseInt(e.target.value, 10) || 0;
      renderPericias();
    });
  });
}

function renderAtaques(){
  const el = document.getElementById("ataquesList");
  if(state.ataques.length === 0){
    el.innerHTML = `<div class="empty-note">Nenhum ataque cadastrado ainda. Use "+ Adicionar Ataque".</div>`;
    return;
  }
  el.innerHTML = state.ataques.map((at, i) => `
    <div class="card arma-card ${at.aberto === false ? "" : "aberto"}" data-idx="${i}">
      <div class="arma-card-head atk-toggle">
        <span class="arma-icone">⚔</span>
        <input type="text" class="atk-nome arma-nome-input" placeholder="Nome da arma/ataque" value="${at.nome || ""}">
        <button type="button" class="icon-btn arma-chevron">▾</button>
      </div>
      <div class="arma-card-corpo">
        <div class="arma-stats">
          <div class="arma-stat"><input type="text" class="atk-ataque" value="${at.ataque || ""}" placeholder="3d20+5"><label>Ataque</label></div>
          <div class="arma-stat"><input type="text" class="atk-dano" value="${at.dano || ""}" placeholder="1d8+2"><label>Dano</label></div>
          <div class="arma-stat"><input type="text" class="atk-critico" value="${at.critico || ""}" placeholder="x2"><label>Crítico</label></div>
        </div>
        <div class="arma-divisor"></div>
        <div class="arma-campos">
          <div class="field"><label>Tipo</label><input type="text" class="atk-tipo" value="${at.tipo || ""}" placeholder="Corte, Fogo, Perfuração..."></div>
          <div class="field"><label>Alcance</label><input type="text" class="atk-alcance" value="${at.alcance || ""}" placeholder="Curto, Médio, Longo..."></div>
          <div class="field"><label>Munição</label><input type="text" class="atk-municao" value="${at.municao || ""}" placeholder="ex: Balas Longas"></div>
          <div class="field"><label>Empunhadura</label><input type="text" class="atk-empunhadura" value="${at.empunhadura || ""}" placeholder="Uma Mão, Duas Mãos..."></div>
        </div>
        <div class="field"><label>Descrição</label><textarea class="atk-descricao" placeholder="Descrição, efeitos especiais...">${at.descricao || ""}</textarea></div>
        <div class="field"><label>Tags (separadas por vírgula)</label><input type="text" class="atk-tags" value="${at.tags || ""}" placeholder="ex: Alongada, Calibre Grosso"></div>
        ${at.tags ? `<div class="card-tags">${at.tags.split(",").map(t => t.trim()).filter(Boolean).map(t => `<span class="tag">${t}</span>`).join("")}</div>` : ""}
        <div class="arma-acoes"><button class="icon-btn danger atk-remove">✕ Remover</button></div>
      </div>
    </div>
  `).join("");

  el.querySelectorAll(".card").forEach(card => {
    const i = parseInt(card.dataset.idx, 10);
    card.querySelector(".atk-nome").addEventListener("input", e => state.ataques[i].nome = e.target.value);
    card.querySelector(".atk-ataque").addEventListener("input", e => state.ataques[i].ataque = e.target.value);
    card.querySelector(".atk-dano").addEventListener("input", e => state.ataques[i].dano = e.target.value);
    card.querySelector(".atk-critico").addEventListener("input", e => state.ataques[i].critico = e.target.value);
    card.querySelector(".atk-tipo").addEventListener("input", e => state.ataques[i].tipo = e.target.value);
    card.querySelector(".atk-alcance").addEventListener("input", e => state.ataques[i].alcance = e.target.value);
    card.querySelector(".atk-municao").addEventListener("input", e => state.ataques[i].municao = e.target.value);
    card.querySelector(".atk-empunhadura").addEventListener("input", e => state.ataques[i].empunhadura = e.target.value);
    card.querySelector(".atk-descricao").addEventListener("input", e => state.ataques[i].descricao = e.target.value);
    card.querySelector(".atk-tags").addEventListener("input", e => state.ataques[i].tags = e.target.value);
    card.querySelector(".atk-remove").addEventListener("click", () => { state.ataques.splice(i,1); renderAtaques(); });
    card.querySelector(".atk-toggle").addEventListener("click", (e) => {
      if(e.target.closest(".arma-nome-input")) return; // clicar pra digitar o nome não deve fechar o card
      state.ataques[i].aberto = !(state.ataques[i].aberto !== false);
      renderAtaques();
    });
  });
}

function renderHabilidades(){
  // poder de origem
  const o = origemAtual();
  document.getElementById("origemPoderCard").innerHTML = `
    <div class="card">
      <div class="card-head"><span class="card-title">${o.poder.nome}</span><span class="card-meta">${o.nome}</span></div>
      ${bonusBadge(o.poder.bonus)}
      <div class="card-desc">${o.poder.descricao}</div>
    </div>
  `;

  // progressão NEX (ou Estágio, se a classe for mundana como a Sobrevivente)
  const c = classeAtual();
  const mundana = classeEhMundana(c);
  document.getElementById("nexTrackTitle").textContent = mundana ? "Progressão de Estágio" : "Progressão de NEX";
  document.getElementById("nexTrack").innerHTML = c.tabelaNex.map(step => `
    <div class="nex-step ${step.nex <= state.nex ? 'unlocked':''}">
      <span class="nex-badge">${mundana ? ("Estágio " + (Math.floor(step.nex/5)+1)) : (step.nex + "%")}</span>
      <span class="nex-type">${step.tipo}</span>
      <span class="nex-text">${step.texto}</span>
    </div>
  `).join("");

  // habilidades de trilha — são FIXAS (não escolhidas): assim que a trilha é
  // selecionada, cada uma delas aparece sozinha aqui ao alcançar o NEX/Estágio
  // exigido, sem precisar "adicionar" nada manualmente.
  const trilhaHabEl = document.getElementById("trilhaHabilidadesList");
  const t = trilhaAtual();
  if(!t){
    trilhaHabEl.innerHTML = `<div class="empty-note">${trilhaPendente() ? "Escolha uma trilha para ver suas habilidades." : "Nenhuma trilha escolhida ainda."}</div>`;
  } else {
    const desbloqueadas = t.poderes.filter(p => p.nex <= state.nex);
    trilhaHabEl.innerHTML = desbloqueadas.length ? desbloqueadas.map(p => `
      <div class="card">
        <div class="card-head"><span class="card-title">${p.nome}</span><span class="card-meta">Trilha: ${t.nome}</span></div>
        ${bonusBadge(p.bonus)}
        <div class="card-desc">${p.descricao}</div>
      </div>
    `).join("") : `<div class="empty-note">Nenhuma habilidade de ${t.nome} desbloqueada ainda.</div>`;
  }

  // poderes escolhidos
  const listEl = document.getElementById("poderesEscolhidosList");
  if(state.poderesEscolhidos.length === 0){
    listEl.innerHTML = `<div class="empty-note">Nenhum poder escolhido ainda.</div>`;
  } else {
    listEl.innerHTML = state.poderesEscolhidos.map((p, i) => `
      <div class="card" data-idx="${i}">
        <div class="card-head">
          <span class="card-title">${p.nome}</span>
          <button class="icon-btn danger poder-remove">✕</button>
        </div>
        <div class="card-meta">${p.origemTipo}</div>
        ${p.preRequisito ? `<div class="card-meta card-prereq">Pré-requisito: ${p.preRequisito}</div>` : ""}
        ${bonusBadge(p.bonus)}
        <div class="card-desc">${p.descricao}</div>
      </div>
    `).join("");
    listEl.querySelectorAll(".poder-remove").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const i = parseInt(e.target.closest(".card").dataset.idx, 10);
        state.poderesEscolhidos.splice(i,1);
        renderHabilidades(); renderRecursos(); renderPericias();
      });
    });
  }

  // select de poderes disponíveis — poderes de CLASSE + poderes GERAIS
  // (coisas que o jogador escolhe, ex: Golpe Pesado, Incansável,
  // Transcender, e os Gerais como Sorte, Diplomata etc, que qualquer classe
  // pode pegar). Habilidades de trilha NÃO entram aqui: elas são fixas e
  // aparecem sozinhas acima.
  const sel = document.getElementById("selectPoderDisponivel");
  const jaEscolhidos = new Set(state.poderesEscolhidos.map(p => p.nome));
  const opcoesClasse = c.poderes
    .filter(p => !jaEscolhidos.has(p.nome))
    .map(p => ({ label: p.nome, nome: p.nome, descricao: p.descricao, preRequisito: p.preRequisito, origemTipo: `Poder de ${c.nome}`, bonus: p.bonus || null }));
  const opcoesGerais = PODERES_GERAIS
    .filter(p => !jaEscolhidos.has(p.nome))
    .map(p => ({ label: `${p.nome} (Geral)`, nome: p.nome, descricao: p.descricao, preRequisito: p.preRequisito, origemTipo: "Poder Geral", bonus: p.bonus || null }));
  const opcoesPoder = [...opcoesClasse, ...opcoesGerais];
  sel.innerHTML = opcoesPoder.map((p, i) => `<option value="${i}">${p.label}</option>`).join("") ||
    `<option value="">— nenhum disponível —</option>`;
  sel._opcoes = opcoesPoder;

  // poderes paranormais
  const ppEl = document.getElementById("poderesParanormaisList");
  if(state.poderesParanormais.length === 0){
    ppEl.innerHTML = `<div class="empty-note">Nenhum poder paranormal adquirido ainda.</div>`;
  } else {
    ppEl.innerHTML = state.poderesParanormais.map((p, i) => `
      <div class="card" data-idx="${i}">
        <div class="card-head"><span class="card-title">${p.nome}</span><button class="icon-btn danger pp-remove">✕</button></div>
        ${elementoBanner(p.elemento)}
        ${p.custoSAN ? `<div class="card-meta">Custo: ${p.custoSAN} SAN</div>` : ""}
        ${bonusBadge(p.bonus)}
        <div class="card-desc">${p.descricao}</div>
      </div>
    `).join("");
    ppEl.querySelectorAll(".pp-remove").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const i = parseInt(e.target.closest(".card").dataset.idx, 10);
        state.poderesParanormais.splice(i,1);
        renderHabilidades();
      });
    });
  }
  const selPP = document.getElementById("selectPoderParanormal");
  const jaPP = new Set(state.poderesParanormais.map(p => p.nome));
  const disponiveisPP = PODERES_PARANORMAIS.filter(p => !jaPP.has(p.nome));
  selPP.innerHTML = disponiveisPP.map((p,i) => `<option value="${i}">${p.nome} (${p.elemento})</option>`).join("") ||
    `<option value="">— nenhum disponível —</option>`;
  selPP._opcoes = disponiveisPP;

  renderPoderesCustomizados();
}

// Poderes escritos do zero pelo próprio jogador (personagens com poderes
// exclusivos/homebrew) — ficam só na ficha, nunca aparecem no Compêndio,
// porque o Compêndio só lê o conteúdo fixo de data.js.
function renderPoderesCustomizados(){
  const pcEl = document.getElementById("poderesCustomizadosList");
  if(state.poderesCustomizados.length === 0){
    pcEl.innerHTML = `<div class="empty-note">Nenhum poder customizado criado ainda.</div>`;
  } else {
    pcEl.innerHTML = state.poderesCustomizados.map((p, i) => `
      <div class="card" data-idx="${i}">
        <div class="card-head">
          <input type="text" class="pc-nome" data-idx="${i}" value="${p.nome}" placeholder="Nome do poder">
          <button class="icon-btn danger pc-remove" data-idx="${i}">✕</button>
        </div>
        <input type="text" class="pc-bonus" data-idx="${i}" value="${p.bonus || ""}" placeholder="Bônus (opcional, ex: +2 em Diplomacia)">
        <textarea class="pc-descricao" data-idx="${i}" placeholder="Descrição do poder...">${p.descricao}</textarea>
      </div>
    `).join("");
    pcEl.querySelectorAll(".pc-nome").forEach(inp => {
      inp.addEventListener("input", e => { state.poderesCustomizados[e.target.dataset.idx].nome = e.target.value; });
    });
    pcEl.querySelectorAll(".pc-bonus").forEach(inp => {
      inp.addEventListener("input", e => { state.poderesCustomizados[e.target.dataset.idx].bonus = e.target.value; });
    });
    pcEl.querySelectorAll(".pc-descricao").forEach(ta => {
      ta.addEventListener("input", e => { state.poderesCustomizados[e.target.dataset.idx].descricao = e.target.value; });
    });
    pcEl.querySelectorAll(".pc-remove").forEach(btn => {
      btn.addEventListener("click", e => {
        state.poderesCustomizados.splice(parseInt(e.target.closest("button").dataset.idx, 10), 1);
        renderPoderesCustomizados();
      });
    });
  }
}

// Corpo de um card de ritual (banner do elemento, campos empilhados como no
// livro, e imagem opcional). Compartilhado entre a aba Rituais da ficha e o
// Compêndio, pra manter os dois com a mesma cara.
// Campos aceitos no objeto do ritual (em data.js):
//   execucao, alcance, duracao, resistencia — texto livre.
//   alvo OU area — use um ou outro (a maioria dos rituais tem só um dos dois).
//   elementoSecundario — pra rituais que podem ser de mais de um elemento
//     (ex: você escolhe entre Sangue ou Energia ao aprender). Mostra os dois
//     nomes juntos na faixa colorida, tipo "SANGUE / ENERGIA 4".
//   discente / verdadeiro — as versões aprimoradas do ritual, cada uma com
//     { custoPE, descricao }. "descricao" é só o efeito extra (o "+X PE" e
//     o rótulo já são montados automaticamente); inclua frases tipo
//     "Requer 3º círculo" ou "Requer afinidade" no fim da descrição, igual
//     ao livro.
//   imagem (opcional — URL ou caminho de arquivo, ex: "img/rituais/toque-sombrio.png").
// Sem "Custo" (PE base) aqui de propósito, pra bater com a página de
// descrição do livro (o custo em PE não aparece nela, só nas versões
// Discente/Verdadeiro, que SÃO custo adicional).
function ritualCardHtml(r){
  const campos = [
    ["Execução", r.execucao],
    ["Alcance", r.alcance],
    ["Alvo", r.alvo],
    ["Área", r.area],
    ["Duração", r.duracao],
    ["Resistência", r.resistencia],
  ].filter(([, valor]) => valor);
  const nomeExibido = r.elementoSecundario ? `${r.elemento} / ${r.elementoSecundario}` : r.elemento;
  return `
    ${r.imagem ? `<img src="${r.imagem}" alt="${r.nome}" class="ritual-imagem" onerror="this.style.display='none'">` : ""}
    ${elementoBanner(r.elemento, r.circulo, " ", nomeExibido)}
    <div class="ritual-campos-lista">
      ${campos.map(([label, valor]) => `<div><strong>${label}:</strong> ${valor}</div>`).join("")}
    </div>
    <div class="card-desc">${r.descricao}</div>
    ${r.discente ? `<div class="ritual-upgrade"><strong>Discente (+${r.discente.custoPE} PE):</strong> ${r.discente.descricao}</div>` : ""}
    ${r.verdadeiro ? `<div class="ritual-upgrade"><strong>Verdadeiro (+${r.verdadeiro.custoPE} PE):</strong> ${r.verdadeiro.descricao}</div>` : ""}
  `;
}

function renderRituais(){
  const sel = document.getElementById("selectRitual");
  const conhecidosIds = new Set(state.rituaisConhecidos);
  const disponiveis = RITUAIS.filter(r => !conhecidosIds.has(r.id));
  sel.innerHTML = disponiveis
    .map(r => `<option value="${r.id}">Círculo ${r.circulo} · ${r.nome} (${r.elemento})</option>`).join("") ||
    `<option value="">— todos os rituais já conhecidos —</option>`;

  const listEl = document.getElementById("rituaisList");
  const conhecidos = RITUAIS.filter(r => conhecidosIds.has(r.id)).sort((a,b)=>a.circulo-b.circulo);
  if(conhecidos.length === 0){
    listEl.innerHTML = `<div class="empty-note">Nenhum ritual conhecido ainda.</div>`;
    return;
  }
  listEl.innerHTML = conhecidos.map(r => `
    <div class="card" data-ritual="${r.id}">
      <div class="card-head">
        <span class="card-title">${r.nome}</span>
        <button class="icon-btn danger ritual-remove">✕</button>
      </div>
      ${ritualCardHtml(r)}
    </div>
  `).join("");

  listEl.querySelectorAll(".ritual-remove").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const id = e.target.closest(".card").dataset.ritual;
      state.rituaisConhecidos = state.rituaisConhecidos.filter(r => r !== id);
      renderRituais();
    });
  });
}

function renderInventario(){
  const el = document.getElementById("inventarioList");
  if(state.inventario.length === 0){
    el.innerHTML = `<div class="empty-note">Inventário vazio.</div>`;
    return;
  }
  el.innerHTML = state.inventario.map((it, i) => `
    <div class="card arma-card ${it.aberto === false ? "" : "aberto"}" data-idx="${i}">
      <div class="arma-card-head atk-toggle">
        <span class="arma-icone">${it.arma ? "⚔" : "🎒"}</span>
        <input type="text" class="inv-nome arma-nome-input" placeholder="Nome do item" value="${it.nome || ""}">
        <span class="inv-qtd-badge">×${it.qtd || 1}</span>
        <button type="button" class="icon-btn arma-chevron">▾</button>
      </div>
      <div class="arma-card-corpo">
        <label class="inv-arma-toggle"><input type="checkbox" class="inv-arma-check" ${it.arma ? "checked" : ""}> É uma arma</label>
        ${it.arma ? `
          <div class="arma-stats">
            <div class="arma-stat"><input type="text" class="inv-ataque" value="${it.ataque || ""}" placeholder="3d20+5"><label>Ataque</label></div>
            <div class="arma-stat"><input type="text" class="inv-dano" value="${it.dano || ""}" placeholder="1d8+2"><label>Dano</label></div>
            <div class="arma-stat"><input type="text" class="inv-critico" value="${it.critico || ""}" placeholder="x2"><label>Crítico</label></div>
          </div>
          <div class="arma-divisor"></div>
        ` : ""}
        <div class="arma-campos">
          <div class="field"><label>Quantidade</label><input type="number" class="inv-qtd" value="${it.qtd || 1}"></div>
          <div class="field"><label>Espaço</label><input type="text" class="inv-espaco" value="${it.espaco || ""}" placeholder="ex: 1"></div>
          ${it.arma ? `
            <div class="field"><label>Tipo</label><input type="text" class="inv-tipo" value="${it.tipo || ""}" placeholder="Corte, Fogo, Perfuração..."></div>
            <div class="field"><label>Categoria</label><input type="text" class="inv-categoria" value="${it.categoria || ""}" placeholder="Simples, Tática, Pesada..."></div>
            <div class="field"><label>Alcance</label><input type="text" class="inv-alcance" value="${it.alcance || ""}" placeholder="Curto, Médio, Longo..."></div>
            <div class="field"><label>Munição</label><input type="text" class="inv-municao" value="${it.municao || ""}" placeholder="ex: Balas Longas"></div>
            <div class="field"><label>Empunhadura</label><input type="text" class="inv-empunhadura" value="${it.empunhadura || ""}" placeholder="Uma Mão, Duas Mãos..."></div>
          ` : ""}
        </div>
        <div class="field"><label>${it.arma ? "Descrição" : "Notas"}</label><textarea class="inv-notas" placeholder="Descrição, efeitos, observações...">${it.notas || ""}</textarea></div>
        ${it.arma ? `
          <div class="field"><label>Tags (separadas por vírgula)</label><input type="text" class="inv-tags" value="${it.tags || ""}" placeholder="ex: Alongada, Calibre Grosso"></div>
          ${it.tags ? `<div class="card-tags">${it.tags.split(",").map(t => t.trim()).filter(Boolean).map(t => `<span class="tag">${t}</span>`).join("")}</div>` : ""}
        ` : ""}
        <div class="arma-acoes"><button class="icon-btn danger inv-remove">✕ Remover</button></div>
      </div>
    </div>
  `).join("");

  el.querySelectorAll(".card").forEach(card => {
    const i = parseInt(card.dataset.idx, 10);
    card.querySelector(".inv-nome").addEventListener("input", e => state.inventario[i].nome = e.target.value);
    card.querySelector(".inv-qtd").addEventListener("input", e => {
      state.inventario[i].qtd = parseInt(e.target.value,10)||1;
      card.querySelector(".inv-qtd-badge").textContent = "×" + state.inventario[i].qtd;
    });
    card.querySelector(".inv-espaco").addEventListener("input", e => state.inventario[i].espaco = e.target.value);
    card.querySelector(".inv-notas").addEventListener("input", e => state.inventario[i].notas = e.target.value);
    card.querySelector(".inv-arma-check").addEventListener("change", e => {
      state.inventario[i].arma = e.target.checked;
      renderInventario();
    });
    const camposArma = {
      ".inv-ataque": "ataque", ".inv-dano": "dano", ".inv-critico": "critico",
      ".inv-tipo": "tipo", ".inv-categoria": "categoria", ".inv-alcance": "alcance",
      ".inv-municao": "municao", ".inv-empunhadura": "empunhadura", ".inv-tags": "tags",
    };
    Object.entries(camposArma).forEach(([seletor, campo]) => {
      const campoEl = card.querySelector(seletor);
      if(campoEl) campoEl.addEventListener("input", e => state.inventario[i][campo] = e.target.value);
    });
    card.querySelector(".inv-remove").addEventListener("click", () => { state.inventario.splice(i,1); renderInventario(); });
    card.querySelector(".atk-toggle").addEventListener("click", (e) => {
      if(e.target.closest(".arma-nome-input")) return;
      state.inventario[i].aberto = !(state.inventario[i].aberto !== false);
      renderInventario();
    });
  });
}

function renderCondicoes(){
  document.getElementById("condicoesPool").innerHTML = CONDICOES.map(c => `
    <button class="ghost condicao-add" data-nome="${c}">${c}</button>
  `).join("");
  document.querySelectorAll(".condicao-add").forEach(btn => {
    btn.addEventListener("click", () => {
      if(!state.condicoesAtivas.includes(btn.dataset.nome)){
        state.condicoesAtivas.push(btn.dataset.nome);
        renderCondicoes();
      }
    });
  });

  const ativasEl = document.getElementById("condicoesAtivas");
  ativasEl.innerHTML = state.condicoesAtivas.map(c => `
    <span class="chip" data-nome="${c}">${c} <button class="chip-remove">✕</button></span>
  `).join("") || `<span class="empty-note">Nenhuma condição ativa.</span>`;
  ativasEl.querySelectorAll(".chip-remove").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const nome = e.target.closest(".chip").dataset.nome;
      state.condicoesAtivas = state.condicoesAtivas.filter(c => c !== nome);
      renderCondicoes();
    });
  });
}

/* ================================================================ EVENTOS */

function bindEventosEstaticos(){
  // Fecha qualquer dropdown de treino de perícia aberto ao clicar fora dele.
  document.addEventListener("click", () => {
    document.querySelectorAll(".treino-dropdown.open").forEach(d => d.classList.remove("open"));
  });

  on("fNome", "input", e => state.nome = e.target.value);
  on("fJogador", "input", e => state.jogador = e.target.value);
  on("fNotas", "input", e => state.notas = e.target.value);
  on("fDeslocamento", "input", e => state.deslocamento = e.target.value);

  on("fOrigem", "change", e => {
    const idAntiga = state.origemId;
    state.origemId = e.target.value;
    removerTreinoDaOrigemAnterior(idAntiga);
    aplicarTreinoDaOrigem();
    renderPericias(); renderHabilidades();
  });
  on("fClasse", "change", async e => {
    const novoId = e.target.value;
    const idAntiga = state.classeId;
    if(novoId === idAntiga) return;
    const classeAntiga = CLASSES[idAntiga];
    const classeNova = CLASSES[novoId];

    // Bônus de transição (uma vez só), somados a PV/PE por classe de destino.
    const BONUS_TREINAMENTO_ESPECIAL = {
      combatente:   { pv: 4, pe: 3 },
      especialista: { pv: 3, pe: 3 },
      ocultista:    { pv: 2, pe: 4 },
    };

    if(classeEhMundana(classeAntiga) && !classeEhMundana(classeNova)){
      // Saindo de Sobrevivente para uma classe "de verdade" = Treinamento Especial
      e.target.value = idAntiga; // volta o select até o jogador confirmar
      const ok = await mostrarModalConfirmacao({
        titulo: "Treinamento Especial",
        mensagem: `Seu personagem deixa de ser Sobrevivente e vira ${classeNova.nome}.\n\nA partir de agora ele evolui por NEX (%) em vez de Estágio, começando em NEX 5% (ou mantendo o NEX atual, se já for maior). Ele também recebe um bônus único de PV/PE pela transição.\n\nVocê pode desfazer isso depois voltando para Sobrevivente na lista de classes.`,
        confirmar: "Confirmar Treinamento Especial",
        cancelar: "Cancelar",
      });
      if(!ok) return;

      // snapshot completo de como ele estava sendo Sobrevivente, pra poder desfazer depois
      state.preTransicao = JSON.parse(JSON.stringify({
        nex: state.nex,
        trilhaId: state.trilhaId,
        poderesEscolhidos: state.poderesEscolhidos,
        poderesParanormais: state.poderesParanormais,
        rituaisConhecidos: state.rituaisConhecidos,
        atributos: state.atributos,
      }));

      const vig = state.atributos.vig, pre = state.atributos.pre;
      const b = BONUS_TREINAMENTO_ESPECIAL[novoId] || { pv: 0, pe: 0 };
      state.bonusTransicao = { pv: b.pv + vig, pe: b.pe + pre };

      state.classeId = novoId;
      state.trilhaId = "";
      // Sempre começa em NEX 5% ao virar uma classe "de verdade" — o Estágio
      // do Sobrevivente (0/5/10/15/20 internamente) não é NEX real, então não
      // faz sentido carregar esse valor para a nova classe.
      state.nex = 5;

    } else if(!classeEhMundana(classeAntiga) && classeEhMundana(classeNova)){
      // Voltar a ser Sobrevivente = desfazer o Treinamento Especial
      e.target.value = idAntiga;
      const ok = await mostrarModalConfirmacao({
        titulo: "Voltar a ser Sobrevivente?",
        mensagem: "Isso desfaz o Treinamento Especial: remove os poderes, a trilha, os rituais e o bônus de PV/PE ganhos como classe real, e volta seu personagem para o Estágio de Sobrevivente que ele tinha antes de evoluir.\n\nUse isso se você confirmou o Treinamento Especial por engano.",
        confirmar: "Sim, voltar a ser Sobrevivente",
        cancelar: "Cancelar",
        perigo: true,
      });
      if(!ok) return;

      if(state.preTransicao){
        state.nex = state.preTransicao.nex;
        state.trilhaId = state.preTransicao.trilhaId;
        state.poderesEscolhidos = state.preTransicao.poderesEscolhidos;
        state.poderesParanormais = state.preTransicao.poderesParanormais;
        state.rituaisConhecidos = state.preTransicao.rituaisConhecidos;
        state.atributos = state.preTransicao.atributos;
      } else {
        // ficha antiga sem snapshot (ex: carregada de um save de antes desta versão)
        state.nex = 0;
        state.trilhaId = "";
      }
      state.classeId = novoId;
      state.bonusTransicao = { pv: 0, pe: 0 };
      state.preTransicao = null;
      aplicarRegraTrilhaSobrevivente();

    } else {
      state.classeId = novoId;
      state.trilhaId = "";
    }
    sincronizarNexConfirmado();

    renderSelects(); renderIdentidadeCampos(); renderRecursos(); renderHabilidades(); renderAtributos();
  });
  on("fTrilha", "change", e => {
    state.trilhaId = e.target.value;
    sincronizarNexConfirmado();
    renderIdentidadeCampos(); renderRecursos(); renderHabilidades();
  });
  on("fNex", "input", e => {
    // Atualização "ao vivo" enquanto o slider é arrastado — só visual, sem
    // aplicar as regras de trilha ainda (isso só acontece ao soltar, no
    // "change" abaixo), pra não perder a trilha só de passar pelo Estágio 1
    // no meio do arraste.
    state.nex = parseInt(e.target.value, 10);
    const mundana = classeEhMundana();
    document.getElementById("fNexValue").textContent = mundana ? ("Estágio " + estagioAtual() + " de 5") : (state.nex + "%");
    renderAtributos(); renderRecursos(); renderHabilidades(); renderPericias();
  });
  on("fNex", "change", async () => {
    await validarMudancaDeEstagio();
    const mundana = classeEhMundana();
    document.getElementById("fNex").value = state.nex;
    document.getElementById("fNexValue").textContent = mundana ? ("Estágio " + estagioAtual() + " de 5") : (state.nex + "%");
    renderSelects(); renderIdentidadeCampos(); renderAtributos(); renderRecursos(); renderHabilidades(); renderPericias();
  });

  on("fDefesaOutros", "input", e => {
    state.defesaOutros = parseInt(e.target.value, 10) || 0;
    document.getElementById("cdDefesa").textContent = defesa();
  });

  on("pericBusca", "input", renderPericias);

  on("btnAddAtaque", "click", () => {
    state.ataques.push({ nome:"", ataque:"", dano:"", critico:"", tipo:"", alcance:"", municao:"", empunhadura:"", descricao:"", tags:"", aberto:true });
    renderAtaques();
  });

  on("btnAddPoder", "click", () => {
    const sel = document.getElementById("selectPoderDisponivel");
    const opcoes = sel._opcoes || [];
    if(sel.value === "" || !opcoes[sel.value]) return;
    const escolhido = opcoes[parseInt(sel.value,10)];
    state.poderesEscolhidos.push({
      nome: escolhido.nome, descricao: escolhido.descricao,
      preRequisito: escolhido.preRequisito, origemTipo: escolhido.origemTipo,
      bonus: escolhido.bonus || null,
    });
    renderHabilidades(); renderRecursos(); renderPericias();
  });

  on("btnAddPoderParanormal", "click", () => {
    const sel = document.getElementById("selectPoderParanormal");
    const opcoes = sel._opcoes || [];
    if(sel.value === "" || !opcoes[sel.value]) return;
    const escolhido = opcoes[parseInt(sel.value,10)];
    state.poderesParanormais.push({ ...escolhido });
    renderHabilidades();
  });

  on("btnAddPoderCustomizado", "click", () => {
    state.poderesCustomizados.push({ nome: "", descricao: "", bonus: "" });
    renderPoderesCustomizados();
  });

  on("btnAddRitual", "click", () => {
    const sel = document.getElementById("selectRitual");
    if(!sel.value) return;
    state.rituaisConhecidos.push(sel.value);
    renderRituais();
  });

  on("btnAddItem", "click", () => {
    state.inventario.push({
      nome:"", qtd:1, espaco:"", notas:"", aberto:true,
      arma:false, ataque:"", dano:"", critico:"", tipo:"", categoria:"", alcance:"", municao:"", empunhadura:"", tags:"",
    });
    renderInventario();
  });

  // abas
  document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
      document.querySelectorAll(".tab-panel").forEach(p => p.classList.remove("active"));
      btn.classList.add("active");
      document.getElementById("tab-" + btn.dataset.tab).classList.add("active");
    });
  });

  // tema
  const themeMenu = document.getElementById("themeMenu");
  on("btnTheme", "click", (e) => {
    e.stopPropagation();
    themeMenu.classList.toggle("open");
  });
  document.addEventListener("click", () => themeMenu.classList.remove("open"));
  document.querySelectorAll("[data-theme-choice]").forEach(btn => {
    btn.addEventListener("click", () => {
      state.theme = btn.dataset.themeChoice;
      document.documentElement.dataset.theme = state.theme;
      themeMenu.classList.remove("open");
    });
  });

  // nova ficha
  on("btnNovo", "click", async () => {
    const ok = await mostrarModalConfirmacao({
      titulo: "Nova Ficha",
      mensagem: "Isso vai limpar a ficha atual (não salva). Deseja continuar?",
      confirmar: "Limpar Ficha",
      cancelar: "Cancelar",
      perigo: true,
    });
    if(ok){
      const themeAtual = state.theme;
      state = estadoPadrao();
      state.theme = themeAtual;
      aplicarTreinoDaOrigem();
      sincronizarNexConfirmado();
      limparRascunho();
      renderTudo();
    }
  });

  // salvar
  on("btnSalvar", "click", () => {
    const nomeArquivo = (state.nome || "ficha-vaesen").replace(/[^\w\-]+/g, "_");
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = nomeArquivo + ".json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });

  // carregar
  const inputCarregar = document.getElementById("inputCarregar");
  on("btnCarregar", "click", () => inputCarregar.click());
  inputCarregar.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if(!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try{
        const carregado = JSON.parse(ev.target.result);
        state = Object.assign(estadoPadrao(), carregado);
        // garante que toda pericia exista mesmo se o data.js ganhou pericias novas depois do save
        PERICIAS.forEach(p => { if(!state.pericias[p.id]) state.pericias[p.id] = { treino:0, extra:0 }; });
        aplicarRegraTrilhaSobrevivente();
        sincronizarNexConfirmado();
        limparRascunho();
        renderTudo();
      } catch(err){
        mostrarModalConfirmacao({
          titulo: "Erro ao carregar",
          mensagem: "Não foi possível ler este arquivo. Verifique se é um JSON de ficha válido.",
          confirmar: "Ok",
          somenteOk: true,
          perigo: true,
        });
      }
      inputCarregar.value = "";
    };
    reader.readAsText(file);
  });

  bindCompendio();
  bindRascunho();
}

/* ================================================================ COMPÊNDIO */
// Visualizador de referência, só leitura: origens, classes/trilhas, poderes
// paranormais, rituais e condições — pra consultar sem precisar ter escolhido
// nada ainda na ficha (ex: decidir origem/trilha, ou olhar rituais na mesa).
function bindCompendio(){
  const overlay = document.getElementById("compendioOverlay");
  on("btnCompendio", "click", () => {
    overlay.classList.add("open");
    renderCompendio();
  });
  on("btnFecharCompendio", "click", () => overlay.classList.remove("open"));
  overlay.addEventListener("click", e => { if(e.target === overlay) overlay.classList.remove("open"); });
  document.querySelectorAll("#compendioTabs .tab-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("#compendioTabs .tab-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      compendioElementoFiltro = "todos";
      compendioCirculoFiltro = "todos";
      renderCompendio();
    });
  });
  on("compendioBusca", "input", renderCompendio);
}

// Elementos do Outro Lado (Sangue/Morte/Energia/Conhecimento) — usados pra
// colorir poderes paranormais e rituais no Compêndio, igual ao livro.
function slugElemento(nome){
  return (nome || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, "");
}
function elementoBanner(nome, extra, separador, textoExibido){
  if(!nome) return "";
  separador = separador === undefined ? " · " : separador;
  const texto = (textoExibido || nome).toUpperCase();
  return `<div class="elemento-banner elemento-${slugElemento(nome)}">${texto}${extra ? separador + extra : ""}</div>`;
}
const ELEMENTOS_FILTRO = ["Sangue", "Morte", "Energia", "Conhecimento", "Medo"];
let compendioElementoFiltro = "todos";
function elementoFiltroHtml(){
  return `<div class="elemento-filtro">
    <button type="button" class="elemento-filtro-btn ${compendioElementoFiltro === "todos" ? "ativo" : ""}" data-elfiltro="todos">Todos</button>
    ${ELEMENTOS_FILTRO.map(el => `<button type="button" class="elemento-filtro-btn elemento-${slugElemento(el)} ${compendioElementoFiltro === el ? "ativo" : ""}" data-elfiltro="${el}">${el}</button>`).join("")}
  </div>`;
}
function bindElementoFiltro(body){
  body.querySelectorAll("[data-elfiltro]").forEach(b => {
    b.addEventListener("click", () => { compendioElementoFiltro = b.dataset.elfiltro; renderCompendio(); });
  });
}

// Filtro por Círculo (1º a 4º), só usado na aba de Rituais.
let compendioCirculoFiltro = "todos";
function circuloFiltroHtml(){
  return `<div class="elemento-filtro">
    <button type="button" class="elemento-filtro-btn ${compendioCirculoFiltro === "todos" ? "ativo" : ""}" data-circfiltro="todos">Todos os Círculos</button>
    ${[1, 2, 3, 4].map(n => `<button type="button" class="elemento-filtro-btn ${compendioCirculoFiltro === n ? "ativo" : ""}" data-circfiltro="${n}">${n}º Círculo</button>`).join("")}
  </div>`;
}
function bindCirculoFiltro(body){
  body.querySelectorAll("[data-circfiltro]").forEach(b => {
    b.addEventListener("click", () => {
      const v = b.dataset.circfiltro;
      compendioCirculoFiltro = v === "todos" ? "todos" : parseInt(v, 10);
      renderCompendio();
    });
  });
}

function renderCompendio(){
  const aba = document.querySelector("#compendioTabs .tab-btn.active").dataset.ctab;
  const busca = (document.getElementById("compendioBusca").value || "").trim().toLowerCase();
  const body = document.getElementById("compendioBody");
  const bate = (texto) => !busca || (texto || "").toLowerCase().includes(busca);

  if(aba === "origens"){
    const itens = ORIGENS.filter(o => bate(o.nome));
    body.innerHTML = itens.map(o => `
      <div class="card">
        <div class="card-head"><span class="card-title">${o.nome}</span></div>
        <div class="card-desc">${o.descricao}</div>
        <div class="card-tags">${o.pericias.map(pid => {
          const p = PERICIAS.find(x => x.id === pid);
          return `<span class="tag accent">${p ? p.nome : pid}</span>`;
        }).join("")}</div>
        <div class="card" style="margin-top:8px;background:var(--panel-alt);">
          <div class="card-head"><span class="card-title" style="font-size:.85rem;">${o.poder.nome}</span></div>
          ${bonusBadge(o.poder.bonus)}
          <div class="card-desc">${o.poder.descricao}</div>
        </div>
      </div>
    `).join("") || `<div class="empty-note">Nenhuma origem encontrada.</div>`;
  }

  else if(aba === "classes"){
    const geraisFiltrados = PODERES_GERAIS.filter(p => bate(p.nome));
    const cardGerais = (busca && geraisFiltrados.length === 0) ? "" : `
      <div class="card">
        <div class="card-head"><span class="card-title">Poderes Gerais</span><span class="card-meta">Qualquer classe</span></div>
        ${geraisFiltrados.map(p => `
          <div class="card" style="background:var(--panel-alt);">
            <div class="card-head"><span class="card-title" style="font-size:.85rem;">${p.nome}</span></div>
            ${p.preRequisito ? `<div class="card-meta card-prereq">Pré-requisito: ${p.preRequisito}</div>` : ""}
            ${bonusBadge(p.bonus)}
            <div class="card-desc">${p.descricao}</div>
          </div>
        `).join("") || `<div class="empty-note">Nenhum poder geral encontrado.</div>`}
      </div>
    `;
    body.innerHTML = cardGerais + Object.values(CLASSES).map(c => {
      const poderesClasse = c.poderes.filter(p => bate(p.nome) || bate(c.nome));
      const trilhas = c.trilhas.filter(t => bate(t.nome) || bate(c.nome) || t.poderes.some(p => bate(p.nome)));
      if(busca && !bate(c.nome) && poderesClasse.length === 0 && trilhas.length === 0) return "";
      return `
        <div class="card">
          <div class="card-head"><span class="card-title">${c.nome}</span><span class="card-meta">${c.mundano ? "Estágio 1–5" : ("NEX " + (c.nexBase || 5) + "%–99%")}</span></div>
          <h4 class="compendio-subtitulo">Poderes de Classe</h4>
          ${poderesClasse.map(p => `
            <div class="card" style="background:var(--panel-alt);">
              <div class="card-head"><span class="card-title" style="font-size:.85rem;">${p.nome}</span></div>
              ${p.preRequisito ? `<div class="card-meta card-prereq">Pré-requisito: ${p.preRequisito}</div>` : ""}
              ${bonusBadge(p.bonus)}
              <div class="card-desc">${p.descricao}</div>
            </div>
          `).join("") || `<div class="empty-note">Nenhum poder de classe encontrado.</div>`}
          <h4 class="compendio-subtitulo">Trilhas</h4>
          ${trilhas.map(t => `
            <div class="card" style="background:var(--panel-alt);">
              <div class="card-head"><span class="card-title" style="font-size:.85rem;">${t.nome}</span></div>
              <div class="card-desc">${t.descricao}</div>
              ${t.poderes.filter(p => !busca || bate(p.nome) || bate(t.nome)).map(p => `
                <div style="margin-top:8px;">
                  <strong style="font-size:.78rem;">${p.nome}</strong>
                  <span class="tag">${c.mundano ? ("Estágio " + (Math.floor(p.nex / 5) + 1)) : ("NEX " + p.nex + "%")}</span>
                  ${bonusBadge(p.bonus)}
                  <div class="card-desc" style="font-size:.8rem;">${p.descricao}</div>
                </div>
              `).join("")}
            </div>
          `).join("") || `<div class="empty-note">Nenhuma trilha encontrada.</div>`}
        </div>
      `;
    }).join("") || `<div class="empty-note">Nada encontrado.</div>`;
  }

  else if(aba === "paranormais"){
    const itens = PODERES_PARANORMAIS.filter(p => bate(p.nome) && (compendioElementoFiltro === "todos" || p.elemento === compendioElementoFiltro));
    body.innerHTML = elementoFiltroHtml() + (itens.map(p => `
      <div class="card">
        <div class="card-head"><span class="card-title">${p.nome}</span>${p.custoSAN ? `<span class="card-meta">${p.custoSAN} SAN</span>` : ""}</div>
        ${elementoBanner(p.elemento)}
        ${bonusBadge(p.bonus)}
        <div class="card-desc">${p.descricao}</div>
      </div>
    `).join("") || `<div class="empty-note">Nenhum poder paranormal encontrado.</div>`);
    bindElementoFiltro(body);
  }

  else if(aba === "rituais"){
    const itens = RITUAIS.filter(r =>
      bate(r.nome) &&
      (compendioElementoFiltro === "todos" || r.elemento === compendioElementoFiltro) &&
      (compendioCirculoFiltro === "todos" || r.circulo === compendioCirculoFiltro)
    ).sort((a, b) => a.circulo - b.circulo);
    body.innerHTML = elementoFiltroHtml() + circuloFiltroHtml() + (itens.map(r => `
      <div class="card">
        <div class="card-head"><span class="card-title">${r.nome}</span></div>
        ${ritualCardHtml(r)}
      </div>
    `).join("") || `<div class="empty-note">Nenhum ritual encontrado.</div>`);
    bindElementoFiltro(body);
    bindCirculoFiltro(body);
  }

  else if(aba === "condicoes"){
    const itens = CONDICOES.filter(c => bate(c));
    body.innerHTML = itens.map(c => `<div class="card"><span class="card-title">${c}</span></div>`).join("") ||
      `<div class="empty-note">Nenhuma condição encontrada.</div>`;
  }
}

/* ================================================================ RASCUNHO (AUTOSAVE LOCAL) */
// Salva um rascunho no localStorage do navegador (não é o mesmo que o botão
// "Salvar Ficha", que baixa um .json) — só pra não perder o progresso se a
// aba fechar sem querer. Fica só nesse navegador/computador, nada é enviado
// pra lugar nenhum.
const RASCUNHO_CHAVE = "vaesen-ficha-rascunho";
let rascunhoTimer = null;

function salvarRascunho(){
  clearTimeout(rascunhoTimer);
  rascunhoTimer = setTimeout(() => {
    try{ localStorage.setItem(RASCUNHO_CHAVE, JSON.stringify(state)); }
    catch(err){ /* localStorage indisponível (modo privado etc) — sem problema, só não autosalva */ }
  }, 600);
}
function limparRascunho(){
  try{ localStorage.removeItem(RASCUNHO_CHAVE); } catch(err){}
}
function bindRascunho(){
  // salva um rascunho a cada mudança relevante (bem simples: escuta qualquer
  // input/change dentro da ficha, com debounce, exceto dentro dos modais)
  document.querySelector(".app-shell").addEventListener("input", salvarRascunho);
  document.querySelector(".app-shell").addEventListener("change", salvarRascunho);

  const aviso = document.getElementById("rascunhoAviso");
  let rascunhoSalvo = null;
  try{ rascunhoSalvo = localStorage.getItem(RASCUNHO_CHAVE); } catch(err){}
  if(!rascunhoSalvo) return;

  aviso.style.display = "flex";
  on("btnRestaurarRascunho", "click", () => {
    try{
      const carregado = JSON.parse(rascunhoSalvo);
      state = Object.assign(estadoPadrao(), carregado);
      PERICIAS.forEach(p => { if(!state.pericias[p.id]) state.pericias[p.id] = { treino:0, extra:0 }; });
      aplicarRegraTrilhaSobrevivente();
      sincronizarNexConfirmado();
      renderTudo();
    } catch(err){ /* rascunho corrompido — ignora silenciosamente */ }
    aviso.style.display = "none";
  });
  on("btnDescartarRascunho", "click", () => {
    limparRascunho();
    aviso.style.display = "none";
  });
}

/* ================================================================ REGRA DE TRILHA (SOBREVIVENTE) */
// Chamada quando o slider #fNex é solto (evento "change"). Garante que:
// - ao entrar no Estágio 2+ sem trilha, o jogo BLOQUEIA com um modal de
//   escolha obrigatória (não existe Estágio 2 sem trilha no livro);
// - ao voltar pro Estágio 1 com uma trilha já escolhida, pede confirmação
//   antes de removê-la (perde tudo que veio dela).
// Em ambos os casos, cancelar reverte o slider pro último valor confirmado.
async function validarMudancaDeEstagio(){
  if(!classeEhMundana()){ sincronizarNexConfirmado(); return; }

  if(estagioAtual() < 2){
    if(state.trilhaId){
      const t = trilhaAtual();
      const ok = await mostrarModalConfirmacao({
        titulo: "Voltar ao Estágio 1?",
        mensagem: `Voltar para o Estágio 1 remove a trilha "${t.nome}" e tudo que veio dela (habilidades e bônus), como se você nunca tivesse escolhido.\n\nDeseja continuar?`,
        confirmar: "Sim, remover trilha",
        cancelar: "Cancelar",
        perigo: true,
      });
      if(!ok){ state.nex = nexConfirmado; return; }
      state.trilhaId = "";
    }
    sincronizarNexConfirmado();
    return;
  }

  if(!state.trilhaId){
    const escolhida = await pedirEscolhaDeTrilha();
    if(!escolhida){ state.nex = nexConfirmado; return; }
    state.trilhaId = escolhida;
  }
  sincronizarNexConfirmado();
}

// Modal bloqueante de escolha de trilha: sem clique fora, sem ESC — só
// escolher uma trilha e confirmar, ou cancelar (o que reverte o Estágio).
// Retorna uma Promise<string|null>: id da trilha escolhida, ou null se cancelou.
function pedirEscolhaDeTrilha(){
  return new Promise(resolve => {
    const overlay = document.getElementById("modalTrilhaOverlay");
    const opcoesEl = document.getElementById("modalTrilhaOpcoes");
    const btnConfirmar = document.getElementById("modalTrilhaConfirmar");
    const btnCancelar = document.getElementById("modalTrilhaCancelar");
    const trilhas = classeAtual().trilhas;
    let selecionada = null;

    opcoesEl.innerHTML = trilhas.map(t => `
      <button type="button" class="trilha-opcao" data-id="${t.id}">
        <span class="trilha-opcao-nome">${t.nome}</span>
        <span class="trilha-opcao-desc">${t.descricao}</span>
      </button>
    `).join("");
    btnConfirmar.disabled = true;

    function limpar(resultado){
      overlay.classList.remove("open");
      opcoesEl.querySelectorAll(".trilha-opcao").forEach(b => b.removeEventListener("click", onEscolher));
      btnConfirmar.removeEventListener("click", onConfirmar);
      btnCancelar.removeEventListener("click", onCancelar);
      resolve(resultado);
    }
    function onEscolher(e){
      selecionada = e.currentTarget.dataset.id;
      opcoesEl.querySelectorAll(".trilha-opcao").forEach(b => b.classList.toggle("selecionada", b.dataset.id === selecionada));
      btnConfirmar.disabled = false;
    }
    function onConfirmar(){ if(selecionada) limpar(selecionada); }
    function onCancelar(){ limpar(null); }

    opcoesEl.querySelectorAll(".trilha-opcao").forEach(b => b.addEventListener("click", onEscolher));
    btnConfirmar.addEventListener("click", onConfirmar);
    btnCancelar.addEventListener("click", onCancelar);
    overlay.classList.add("open");
  });
}

/* ================================================================ MODAL */
// Modal de confirmação/aviso dentro do próprio site (substitui confirm()/alert()
// nativos do navegador). Retorna uma Promise<boolean>: true = confirmou/ok,
// false = cancelou. Use com "await" dentro de uma função async.
function mostrarModalConfirmacao({ titulo, mensagem, confirmar = "Confirmar", cancelar = "Cancelar", somenteOk = false, perigo = false }){
  return new Promise(resolve => {
    const overlay = document.getElementById("modalOverlay");
    const box = document.getElementById("modalBox");
    document.getElementById("modalTitulo").textContent = titulo;
    document.getElementById("modalMensagem").textContent = mensagem;

    const btnConfirmar = document.getElementById("modalBtnConfirmar");
    const btnCancelar = document.getElementById("modalBtnCancelar");
    btnConfirmar.textContent = confirmar;
    btnConfirmar.classList.toggle("danger", !!perigo);
    btnCancelar.style.display = somenteOk ? "none" : "";
    if(!somenteOk) btnCancelar.textContent = cancelar;

    box.classList.toggle("perigo", !!perigo);
    overlay.classList.add("open");

    function limpar(resultado){
      overlay.classList.remove("open");
      btnConfirmar.removeEventListener("click", onConfirmar);
      btnCancelar.removeEventListener("click", onCancelar);
      overlay.removeEventListener("click", onClickFora);
      document.removeEventListener("keydown", onEsc);
      resolve(resultado);
    }
    function onConfirmar(){ limpar(true); }
    function onCancelar(){ limpar(false); }
    function onClickFora(e){ if(e.target === overlay && !somenteOk) limpar(false); }
    function onEsc(e){ if(e.key === "Escape" && !somenteOk) limpar(false); }

    btnConfirmar.addEventListener("click", onConfirmar);
    btnCancelar.addEventListener("click", onCancelar);
    overlay.addEventListener("click", onClickFora);
    document.addEventListener("keydown", onEsc);
  });
}

/* ================================================================ INIT */
document.addEventListener("DOMContentLoaded", () => {
  try{
    bindEventosEstaticos();
  } catch(err){
    console.error("Erro ao ligar os eventos da ficha — algum botão/campo pode não funcionar. Confira se index.html, css/*.css e js/*.js são todos da mesma versão (baixe o pacote completo de novo se tiver dúvida).", err);
  }
  try{
    aplicarTreinoDaOrigem();
    aplicarRegraTrilhaSobrevivente();
    sincronizarNexConfirmado();
    renderTudo();
  } catch(err){
    console.error("Erro ao desenhar a ficha.", err);
  }
});