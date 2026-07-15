# Vaesen — Ficha Digital para Ordem Paranormal RPG

Ficha de personagem digital, feita para mesas presenciais que usam dados
físicos (por isso não há rolador de dados aqui — só a ficha). Roda 100% no
navegador, sem servidor, sem internet, sem login e sem enviar nada para
lugar nenhum. Os personagens são salvos como arquivos `.json` no computador
de cada jogador.

## Como usar

1. Baixe a pasta inteira (`vaesen-ficha/`).
2. Dê duplo-clique em `index.html`. Ele abre no seu navegador (Chrome,
   Firefox, Edge...) e a ficha já funciona.
3. Cada jogador pode ter sua própria cópia da pasta, ou todos podem abrir o
   mesmo `index.html` a partir de um pendrive/pasta compartilhada — a ficha
   não se salva sozinha, então isso é seguro.
4. Para guardar o progresso: botão **💾 Salvar Ficha** baixa um arquivo
   `.json` com o nome do personagem.
5. Para continuar de onde parou: botão **📂 Carregar Ficha** e escolha o
   `.json` salvo antes.
6. Botão **🎨 Estilo** troca entre os 3 temas visuais (Penumbra, Bandagens,
   Hextech) a qualquer momento — a escolha de tema também é salva na ficha.

> Dica: como não há servidor, também dá pra jogar essa pasta direto do
> GitHub Pages (é só subir a pasta pra um repositório e ativar o Pages nas
> configurações) se um dia vocês quiserem um link único pra acessar de
> qualquer lugar — mas isso é 100% opcional, o app já funciona local.

## Estrutura do projeto

```
vaesen-ficha/
├── index.html          → estrutura da ficha (você provavelmente não precisa mexer aqui)
├── css/
│   ├── style.css        → layout, tabelas, cards, hexágonos de atributo
│   └── themes.css        → as cores dos 3 temas (Penumbra / Bandagens / Hextech)
├── js/
│   ├── data.js           ⭐ TODO O CONTEÚDO DO JOGO MORA AQUI — veja abaixo
│   └── app.js            → a lógica da ficha (lê o data.js e desenha a tela)
└── README.md
```

## Como adicionar conteúdo (rituais, origens, poderes, trilhas...)

**Você só precisa editar `js/data.js`.** Abra ele em qualquer editor de texto
(Bloco de Notas já serve, mas recomendo o VS Code, que é gratuito e mostra
erros de digitação). O arquivo é dividido em blocos numerados:

1. `ATRIBUTOS` — os 5 atributos (não deveria precisar mexer aqui)
2. `PERICIAS` — as 28 perícias
3. `ORIGENS` — origens e seus poderes
4. `CLASSES` — Combatente, Especialista, Ocultista: PV/PE/SAN, tabela de NEX,
   poderes gerais de classe e trilhas
5. `PODERES_PARANORMAIS` — poderes que custam Sanidade
6. `RITUAIS` — todos os rituais conhecíveis
7. `CONDICOES` — lista de condições de status

No fim do arquivo `data.js` tem uma seção **"COMO ADICIONAR CONTEÚDO"** com
blocos prontos pra copiar e colar — é só usar como molde. Alguns exemplos
rápidos:

### Adicionar um ritual novo
Ache o array `RITUAIS` e cole um novo objeto entre chaves `{ }`:

```js
{
  id: "meu-ritual-novo",
  nome: "Nome do Ritual",
  elemento: "Sangue",
  circulo: 2,
  custoPE: 4,
  execucao: "Ação padrão",
  alcance: "Curto",
  alvo: "1 criatura",
  duracao: "1 cena",
  resistencia: "Vontade nega",
  descricao: "O que o ritual faz.",
  imagem: "img/rituais/meu-ritual-novo.png",
},
```

Salve o arquivo, atualize a página (F5) — o ritual já aparece na aba
**Rituais** pronto pra ser aprendido.

Os campos `alvo` e `imagem` são opcionais — se não colocar, o ritual aparece
normalmente, só sem essa linha ou sem a imagem. `elemento` deve ser um dos
seguintes, pra ganhar a cor certa: `"Sangue"`, `"Morte"`, `"Energia"`,
`"Conhecimento"` ou `"Medo"` (esse último também é um elemento paranormal
válido, com faixa branca/preta em vez de colorida). Pra `imagem`, coloque o
arquivo na pasta `img/rituais/` (crie ela se não existir) e aponte o caminho
relativo, tipo `"img/rituais/nome-do-arquivo.png"` — também funciona colar
uma URL (`"https://..."`) direto ali.

### Adicionar uma origem nova
No array `ORIGENS`:

```js
{
  id: "minha-origem",
  nome: "Nome da Origem",
  descricao: "Frase curta.",
  pericias: ["intuicao", "vontade"],
  poder: {
    nome: "Nome do Poder",
    bonus: "+2 em Diplomacia", // opcional, veja a seção "Campo bônus" abaixo
    descricao: "O que faz.",
  },
},
```

Os ids de perícia disponíveis estão listados no bloco `PERICIAS` (item 2).

### Campo `bonus` (selo de bônus nos cards de poder)
Qualquer poder — de origem, geral, de classe, de trilha, paranormal ou
customizado (criado direto na ficha) — pode receber um campo opcional
`bonus`, que aparece como um selo destacado (✦) no card do poder, tanto na
aba Habilidades quanto no Compêndio. Ele aceita duas formas:

**1) Texto livre** — pra qualquer bônus, inclusive os que não são um número
fixo de perícia (metade de Sanidade, RD, PV, PE, dano...). É só descrever:

```js
poder: {
  nome: "Traços do Outro Lado",
  bonus: "Poder paranormal à escolha; Sanidade inicial pela metade",
  descricao: "Você possui um poder paranormal à sua escolha. Porém, ...",
},
```

Esse é o caso, por exemplo, da origem **Cultista Arrependido**.

**2) Objeto** — só pra bônus numérico *de perícia* que deve ser somado
automaticamente ao total da perícia na aba Perícias, escalando com o NEX
(funciona em poder de origem, de classe/geral escolhido, e de trilha):

```js
bonus: { pericia: "diplomacia", formula: "fixo", valor: 2 }
```

Fórmulas aceitas:
- `"fixo"` → soma `valor` direto, uma vez só (não escala com NEX)
- `"porNex5"` → soma `valor` a cada 5% de NEX (1 por estágio)
- `"porNexImpar"` → soma `valor` a cada NEX ímpar alcançado (5%, 15%, 25%...)

Se não tiver certeza de qual forma usar, use texto livre — é sempre seguro
e cobre qualquer poder, mesmo os que não são um número de perícia.

### Adicionar um poder de classe ou de trilha
Dentro de `CLASSES.combatente` (ou `especialista`/`ocultista`):

- Poder geral de classe → array `poderes`
- Poder de uma trilha específica → dentro de `trilhas`, no array `poderes`
  daquela trilha (cada um tem um `nex` de quando fica disponível)

Ambos aceitam o campo opcional `bonus` (veja a seção acima).

### Mudar a progressão de NEX (sua homebrew)
Edite `CLASSES.<classe>.tabelaNex`. Cada linha representa o que a classe
ganha naquele NEX — pode ser `"fixo"` (automático), `"escolha"` (jogador
escolhe um poder da lista de poderes da classe) ou `"trilha"` (escolhe um
poder da trilha). Você também pode mudar os PV/PE/SAN base e por-NEX logo
acima da tabela.

### Adicionar uma trilha nova
Dentro de `CLASSES.<classe>.trilhas`, copie um bloco de trilha e ajuste os
poderes/NEX.

## Imagens do pentágono de atributos e das barras de recurso

A ficha espera (opcionalmente) estes arquivos, que você mesmo coloca:

```
img/
├── attributes.png            → arte do pentágono de atributos (só o desenho,
│                                sem números — o app desenha os números por cima)
├── veins-texture-bars.svg    → textura de fundo das barras de Vida/Sanidade/Esforço
└── icons/
    ├── pv-full.svg / pv-half.svg / pv-low.svg
    ├── sanity-full.svg / sanity-half.svg / sanity-low.svg
    └── effort-full.svg / effort-half.svg / effort-empty.svg
```

O ícone de cada medalhão troca sozinho conforme o estado atual do recurso:
- **Vida/Sanidade**: acima de 50% = `full`, entre 25% e 50% = `half`, 25% ou
  menos = `low`.
- **Esforço**: acima de 50% = `full`, entre 0% e 50% = `half`, exatamente 0 =
  `empty`.

Se algum arquivo não existir, o navegador só mostra um ícone quebrado no
lugar — não trava o resto da ficha.

Os números do pentágono são posicionados por porcentagem sobre a imagem, em
`css/style.css` (procure por `.attr-valor-agi`, `.attr-valor-for` etc.). Se
o seu `attributes.png` tiver os hexágonos em posições ou proporção
diferentes do que veio configurado, ajuste esses valores de `top`/`left` (e
o `aspect-ratio` da regra `.attr-cluster` logo acima) até bater com a sua
imagem.

## Sobre a exatidão das regras

O conteúdo de `data.js` (rituais, tabelas de NEX, poderes) foi montado como
uma **base funcional** a partir de resumos públicos do sistema — a estrutura
já está pronta e testada, mas como vocês jogam com homebrew, vale revisar os
números e textos contra o material de vocês e ajustar o que for preciso
direto no arquivo. É só texto e números dentro de `{ }`, sem lógica de
programação — não tem como quebrar o app editando esses valores.

## O que a ficha calcula automaticamente

- PV, PE e Sanidade máximos (a partir da classe, do NEX e dos atributos)
- Defesa (10 + Agilidade)
- Limite de PE por turno
- Quantidade de dados rolados por perícia (baseado no atributo)
- Quais habilidades de NEX já estão desbloqueadas (comparando com o NEX atual)
- Bônus de perícia vindos de poderes com o campo `bonus` no formato objeto
  (origem, de classe/geral escolhido ou de trilha), somando ao total da
  perícia na aba Perícias e escalando com o NEX quando aplicável

## Privacidade

Nada é enviado para nenhum servidor. Toda a ficha vive na memória do seu
navegador até você clicar em "Salvar Ficha", que apenas baixa um arquivo pro
seu computador.