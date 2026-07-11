/* ==========================================================================
   VAESEN — Ficha Digital para Ordem Paranormal RPG
   ARQUIVO DE CONTEÚDO (DADOS DO JOGO)
   ==========================================================================

   ESTE É O ÚNICO ARQUIVO QUE VOCÊ PRECISA MEXER PARA ADICIONAR CONTEÚDO.
   O app.js só LÊ estas listas e monta a ficha sozinho — ou seja, para
   adicionar um ritual novo, um poder novo, uma origem nova, uma trilha nova
   ou mudar a progressão de uma classe (sua homebrew), basta copiar um dos
   objetos de exemplo abaixo, colar dentro do array certo e mudar os campos.

   Não é necessário entender o resto do código para editar isto aqui.
   Sempre respeite as vírgulas entre os objetos "{ ... }, { ... }" dentro
   dos arrays "[ ... ]".

   Ao final do arquivo há um guia rápido "COMO ADICIONAR CONTEÚDO" com
   exemplos prontos para copiar e colar.

   AVISO: os dados abaixo (perícias, tabelas de NEX, poderes, rituais) foram
   compilados a partir de resumos públicos do sistema Ordem Paranormal para
   servir de ESQUELETO funcional da ficha. Como vocês jogam com homebrew,
   revise e ajuste os valores/textos contra o livro de vocês — o importante
   aqui é a ESTRUTURA (o app já entende ela), não decorar o texto oficial
   palavra por palavra.
   ========================================================================== */


/* --------------------------------------------------------------------------
   1. ATRIBUTOS
   -------------------------------------------------------------------------- */
const ATRIBUTOS = [
  { id: "for", nome: "Força",     abrev: "FOR" },
  { id: "agi", nome: "Agilidade", abrev: "AGI" },
  { id: "vig", nome: "Vigor",     abrev: "VIG" },
  { id: "int", nome: "Intelecto", abrev: "INT" },
  { id: "pre", nome: "Presença",  abrev: "PRE" },
];


/* --------------------------------------------------------------------------
   2. PERÍCIAS
   Campo "atributo" usa o "id" definido em ATRIBUTOS acima.
   Campo "somenteTreinado": true = só pode ser testada se treinada (ex: Ciências).
   -------------------------------------------------------------------------- */
const PERICIAS = [
  { id: "acrobacia",       nome: "Acrobacia",        atributo: "agi" },
  { id: "adestramento",    nome: "Adestramento",     atributo: "pre" },
  { id: "artes",           nome: "Artes",            atributo: "pre" },
  { id: "atletismo",       nome: "Atletismo",        atributo: "for" },
  { id: "atualidades",     nome: "Atualidades",      atributo: "int" },
  { id: "ciencias",        nome: "Ciências",         atributo: "int", somenteTreinado: true },
  { id: "crime",           nome: "Crime",            atributo: "agi" },
  { id: "diplomacia",      nome: "Diplomacia",       atributo: "pre" },
  { id: "enganacao",       nome: "Enganação",        atributo: "pre" },
  { id: "fortitude",       nome: "Fortitude",        atributo: "vig" },
  { id: "furtividade",     nome: "Furtividade",      atributo: "agi" },
  { id: "intimidacao",     nome: "Intimidação",      atributo: "pre" },
  { id: "intuicao",        nome: "Intuição",         atributo: "pre" },
  { id: "investigacao",    nome: "Investigação",     atributo: "int" },
  { id: "luta",            nome: "Luta",             atributo: "for" },
  { id: "medicina",        nome: "Medicina",         atributo: "int", somenteTreinado: true },
  { id: "ocultismo",       nome: "Ocultismo",        atributo: "int", somenteTreinado: true },
  { id: "percepcao",       nome: "Percepção",        atributo: "pre" },
  { id: "pilotagem",       nome: "Pilotagem",        atributo: "agi", somenteTreinado: true },
  { id: "pontaria",        nome: "Pontaria",         atributo: "agi" },
  { id: "profissao",       nome: "Profissão",        atributo: "int", somenteTreinado: true },
  { id: "reflexos",        nome: "Reflexos",         atributo: "agi" },
  { id: "religiao",        nome: "Religião",         atributo: "pre", somenteTreinado: true },
  { id: "sobrevivencia",   nome: "Sobrevivência",    atributo: "int" },
  { id: "tatica",          nome: "Tática",           atributo: "int", somenteTreinado: true },
  { id: "tecnologia",      nome: "Tecnologia",       atributo: "int", somenteTreinado: true },
  { id: "vontade",         nome: "Vontade",          atributo: "pre" },
];


/* --------------------------------------------------------------------------
   3. ORIGENS
   "pericias": array de ids de PERICIAS que a origem treina automaticamente.
   "poder": a habilidade única de origem.
   "itemInicial": texto livre (opcional).
   -------------------------------------------------------------------------- */
const ORIGENS = [
  {
    id: "acadêmico",
    nome: "Acadêmico",
    descricao: "Você era um pesquisador ou professor universitário. De forma proposital ou não, seus estudos tocaram em assuntos misteriosos e chamaram a atenção da Ordo Realitas.",
    pericias: ["ciencias", "investigacao"],
    poder: {
      nome: "Saber é Poder",
      descricao: "Quando faz um teste usando Intelecto, você pode gastar 2 PE para receber +5 nesse teste.",
    },
  },

  {
    "id": "agente-de-saúde",
    "nome": "Agente de Saúde",
    "descricao": "Você era um profissional da saúde, como um enfermeiro, farmacêutico, médico, psicólogo ou socorrista, treinado no atendimento e cuidado de pessoas. Você pode ter sido surpreendido por um evento paranormal durante o trabalho ou mesmo cuidado de um agente da Ordem em uma emergência, que ficou surpreso com o quão bem você lidou com a situação.",
    "pericias": ["intuicao", "medicina"],
    "poder": {
      "nome": "Técnica Medicinal",
      "descricao": "Sempre que cura um personagem, você adiciona seu Intelecto no total de PV curados."
    }
  },
  {
    "id": "amigo-dos-animais",
    "nome": "Amigo dos Animais",
    "descricao": "Você desenvolveu uma conexão muito forte com outros seres: os animais. Seja por nunca ter se dado muito bem com humanos ou por preferir a companhia de um melhor amigo de quatro patas, você leva sua vida ao lado de um bichano e até mesmo aprende com a natureza perceptiva deles.",
    "pericias": ["adestramento", "percepcao"],
    "poder": {
      "nome": "Companheiro Animal",
      "descricao": "Você consegue entender as intenções e sentimentos de animais, e pode usar Adestramento para mudar a atitude deles. Além disso, você possui um melhor amigo, um animal que cresceu com você e pelo qual tem profundo apego. Ele conta como um aliado que fornece +2 em uma perícia a sua escolha (aprovada pelo mestre). Quando você alcança NEX 35%, ele também passa a fornecer o bônus de um aliado de um tipo a sua escolha (aprovado pelo mestre). Por fim, quando você alcança NEX 70%, ele fornece a habilidade do tipo de aliado escolhido. Perder seu parceiro é muito doloroso. Se ele morrer, você perde 10 pontos de Sanidade permanentemente, além de ficar perturbado até o fim da cena. Como encontrar um novo companheiro fica a critério do mestre, mas geralmente será uma ação entre missões."
    }
  },
  {
    "id": "amnésico",
    "nome": "Amnésico",
    "descricao": "Você perdeu a maior parte da memória. Sabe apenas o próprio nome, ou nem isso. Sua amnésia pode ser resultado de um trauma paranormal ou mesmo de um ritual. Talvez você tenha sido vítima de cultistas? Talvez você tenha sido um cultista? Seja como for, hoje a Ordem é a única família que conhece. Quem sabe, cumprindo missões, você descubra algo sobre seu passado.",
    "pericias": ["à escolha do mestre (2)"],
    "poder": {
      "nome": "Vislumbres do Passado",
      "descricao": "Uma vez por sessão, você pode fazer um teste de Intelecto (DT 10) para reconhecer pessoas ou lugares familiares, que tenha encontrado antes de perder a memória. Se passar, recebe 1d4 PE temporários e, a critério do mestre, uma informação útil."
    }
  },
  {
    "id": "artista",
    "nome": "Artista",
    "descricao": "Você era um ator, músico, escritor, dançarino, influenciador… Seu trabalho pode ter sido inspirado por uma experiência paranormal do passado e o que o público acha que é pura criatividade, a Ordem sabe que tem um lado mais sombrio.",
    "pericias": ["artes", "enganacao"],
    "poder": {
      "nome": "Magnum Opus",
      "descricao": "Você é famoso por uma de suas obras. Uma vez por missão, pode determinar que uma pessoa envolvida em uma cena de interação o reconheça. Você recebe +5 em testes de Presença e de perícias baseadas em Presença contra aquela pessoa. A critério do mestre, pode receber esse bônus em outras situações nas quais seria reconhecido."
    }
  },
  {
    "id": "astronauta",
    "nome": "Astronauta",
    "descricao": "Outrora limitada a membros de algumas agências espaciais estatais, a profissão de explorador espacial se tornou mais acessível conforme mais países, e até mesmo empresas privadas, se envolveram com viagens na fronteira final. Como um astronauta, você se acostumou à pressão de ser responsável pela vida de seus colegas e por experimentos de milhões de reais. E foi na escuridão do espaço que você descobriu que não estamos sozinhos.",
    "pericias": ["ciencias", "fortitude"],
    "poder": {
      "nome": "Acostumado ao Extremo",
      "descricao": "Quando sofre dano de fogo, de frio ou mental, você pode gastar 1 PE para reduzir esse dano em 5. A cada vez que usa esta habilidade novamente na mesma cena, seu custo aumenta em +1 PE."
    }
  },
  {
    "id": "atleta",
    "nome": "Atleta",
    "descricao": "Você competia em um esporte individual ou coletivo, como natação ou futebol. Seu desempenho pode ser fruto de uma influência paranormal que nem mesmo você conhecia ou você pode ter se envolvido em algum evento relacionado ao Outro Lado em uma de suas competições.",
    "pericias": ["acrobacia", "atletismo"],
    "poder": {
      "nome": "110%",
      "descricao": "Quando faz um teste de perícia usando Força ou Agilidade (exceto Luta e Pontaria) você pode gastar 2 PE para receber +5 nesse teste."
    }
  },
  {
    "id": "barman",
    "nome": "Barman",
    "descricao": "Você trabalhava atrás do balcão, ouvindo histórias e confissões de todos os tipos. Em uma noite, coisas ilógicas aconteceram em seu local de trabalho, talvez um cliente tenha deixado um item misterioso para trás, ou você escutou algo que não deveria.",
    "pericias": ["diplomacia", "profissao"],
    "poder": {
      "nome": "Senhor dos Coquetéis",
      "descricao": "Em cenas de interlúdio, você pode fazer a ação alimentar-se para preparar uma bebida especial. Você e todos os aliados que fizerem a ação alimentar-se recebem os efeitos do prato energético e recebem +2 em testes de vontade e resistência mental até falharem em um teste desta perícia."
    }
  },
  {
    "id": "bombeiro",
    "nome": "Bombeiro",
    "descricao": "Você passou anos apagando incêndios, salvando vidas e enfrentando situações de extremo perigo. Durante um resgate em um prédio antigo, encontrou algo que mudou sua perspectiva para sempre. Talvez descobriu um misterioso símbolo esculpido nas paredes chamuscadas, ou percebeu que as chamas não eram realmente fogo, e sim energias malignas de demônios que sussurravam entre as “chamas”. Sua bravura e habilidades de proteção podem ser a salvação de cidadãos e agentes em meio ao paranormal.",
    "pericias": ["atletismo", "iniciativa"],
    "poder": {
      "nome": "Resgate",
      "descricao": "Quando um personagem em até alcance longo estiver machucado ou perturbado, você pode gastar 2 PE para utilizar Corrida como ação de movimento até o alvo para ajudá-lo, recebendo +2 em quaisquer testes necessários, como agarrar e derrubar algo no caminho."
    }
  },
  {
    "id": "caçador",
    "nome": "Caçador",
    "descricao": "Você cresceu nas florestas, aprendendo a caçar e rastrear desde jovem. Talvez tenha encontrado uma criatura que desafiava a lógica e a natureza ou até mesmo descoberto algo estranho entre ass cavernas e árvores. De qualquer forma, sobreviver a esse encontro mudou sua vida para sempre.",
    "pericias": ["furtividade", "sobrevivencia"],
    "poder": {
      "nome": "Sentido de Predador",
      "descricao": "Você pode gastar 2 PE para fazer um teste de Percepção (DT 20) e observar durante uma ação de movimento onde acertar ou a melhor posição para atirar, recebendo +1d20 no próximo teste de ataque."
    }
  },
  {
    "id": "chef",
    "nome": "Chef",
    "descricao": "Você é um cozinheiro amador ou profissional. Talvez trabalhasse em um restaurante, talvez simplesmente gostasse de cozinhar para a família e amigos. Como sua comida fez com que você se envolvesse com o paranormal? Ninguém sabe. Mas os outros agentes adoram quando você vai para a missão!",
    "pericias": ["fortitude", "profissao"],
    "poder": {
      "nome": "Ingrediente Secreto",
      "descricao": "Em cenas de interlúdio, você pode fazer a ação alimentar-se para cozinhar um prato especial. Você, e todos os membros do grupo que fizeram a ação alimentar-se, recebem o benefício de dois pratos (caso o mesmo benefício seja escolhido duas vezes, seus efeitos se acumulam)."
    }
  },
  {
    "id": "chef-do-outro-lado",
    "nome": "Chef do Outro Lado",
    "descricao": "Você nunca foi muito bom na culinária convencional. Depois de sobreviver ao paranormal, entretanto, descobriu um talento que é considerado um grande tabu até mesmo pelos ocultistas mais experientes: cozinhar e ingerir entidades do Outro Lado. Acreditando estar realizando algum tipo de arte gastronômica esotérica, ou simplesmente por se render a impulsos incontroláveis, você elabora pratos nunca vistos antes misturando ingredientes comuns da Realidade com aquilo que não deveria existir. Você é a prova viva do ditado popular: \"tem gosto pra tudo\".",
    "pericias": ["ocultismo", "profissao"],
    "poder": {
      "nome": "Fome do Outro Lado",
      "descricao": "Você pode usar partes de criaturas do Outro Lado como ingredientes culinários. No início de cada missão você pode solicitar essas partes como itens de Categoria I que ocupam 0,5 espaço, e pode obtê-las de criaturas derrotadas (cada criatura Pequena ou maior fornece 1 ingrediente paranormal). Você pode gastar uma ação de interlúdio e 1 ingrediente para preparar um prato especial; faça um teste de Profissão (cozinheiro) com DT 15 + O (o mestre oculta o resultado do teste até alguém comer o prato). Se você passar no teste, o prato fornece RD 10 contra o tipo de dano do elemento da criatura cujo ingrediente foi usado. Caso contrário, o prato causa vulnerabilidade a esse tipo de dano. Os efeitos duram até o fim da próxima cena. Independentemente do resultado, se alimentar do paranormal, por menor que seja a porção, gera consequências brutais e permanentes em seu organismo, sendo uma das formas mais rápidas de destruir sua mente. A cada refeição consumida, você perde 1 ponto permanente de Sanidade. Além disso, se estiver usando a regra opcional Nível de Experiência e Nível de Exposição (p. 98), o NEX do personagem aumenta em 3% para cada parte de criatura diferente que ingerir (mesmo que não esteja usando essa regra, use as alterações descritas na regra para personagens que ingerem partes de criaturas dessa forma). A coragem para se beneficiar desses pratos é algo muito mais presente em grupos de cultistas e, por todas essas razões, não é uma ação apoiada pela Ordo Realitas."
    }
  },
  {
    "id": "cientista-forense",
    "nome": "Cientista Forense",
    "descricao": "Você trabalhava coletando provas para a solução de crimes, seja para a polícia, seja para uma empresa privada de investigação. Usava métodos e técnicas adquiridos através de uma graduação em uma área científica ou médica, além de cursos específicos. Recrutado para a Ordem pelos seus conhecimentos técnicos, seu trabalho não mudou muito - mas o tipo de crime que você investiga, sim.",
    "pericias": ["ciencias", "investigacao"],
    "poder": {
      "nome": "Fome do Outro Lado",
      "descricao": "Você pode usar partes de criaturas do Outro Lado como ingredientes culinários. No início de cada missão você pode solicitar essas partes como itens de Categoria I que ocupam 0,5 espaço, e pode obtê-las de criaturas derrotadas (cada criatura Pequena ou maior fornece 1 ingrediente paranormal). Você pode gastar uma ação de interlúdio e 1 ingrediente para preparar um prato especial; faça um teste de Profissão (cozinheiro) com DT 15 + O (o mestre oculta o resultado do teste até alguém comer o prato). Se você passar no teste, o prato fornece RD 10 contra o tipo de dano do elemento da criatura cujo ingrediente foi usado. Caso contrário, o prato causa vulnerabilidade a esse tipo de dano. Os efeitos duram até o fim da próxima cena. Independentemente do resultado, se alimentar do paranormal, por menor que seja a porção, gera consequências brutais e permanentes em seu organismo, sendo uma das formas mais rápidas de destruir sua mente. A cada refeição consumida, você perde 1 ponto permanente de Sanidade. Além disso, se estiver usando a regra opcional Nível de Experiência e Nível de Exposição (p. 98), o NEX do personagem aumenta em 3% para cada parte de criatura diferente que ingerir (mesmo que não esteja usando essa regra, use as alterações descritas na regra para personagens que ingerem partes de criaturas dessa forma). A coragem para se beneficiar desses pratos é algo muito mais presente em grupos de cultistas e, por todas essas razões, não é uma ação apoiada pela Ordo Realitas."
    }
  },
  {
    "id": "criminoso",
    "nome": "Criminoso",
    "descricao": "Você vivia uma vida fora da lei, seja como mero batedor de carteiras, seja como membro de uma facção criminosa. Em algum momento, você se envolveu em um assunto da Ordem — talvez tenha roubado um item amaldiçoado? A organização, por sua vez, achou melhor recrutar seus talentos do que ter você como um estorvo.",
    "pericias": ["crime", "furtividade"],
    "poder": {
      "nome": "O Crime Compensa",
      "descricao": "No final de uma missão, escolha um item encontrado na missão. Em sua próxima missão, você pode incluir esse item em seu inventário sem que ele conte em seu limite de itens por patente."
    }
  },
  {
    "id": "cultista-arrependido",
    "nome": "Cultista Arrependido",
    "descricao": "Você fez parte de um culto paranormal. Talvez fossem ignorantes iludidos, que acreditavam estar contatando entidades benevolentes. Talvez soubessem exatamente o que estavam fazendo. Seja como for, algo abriu seus olhos e agora você luta pelo lado certo — embora carregue para sempre traços de sua vida pregressa. Outros membros da Ordem podem desconfiar de sua conversão e você sabe que precisará se esforçar para conquistar a confiança de todos.",
    "pericias": ["ocultismo", "religiao"],
    "poder": {
      "nome": "Traços do Outro Lado",
      "descricao": "Você possui um poder paranormal à sua escolha. Porém, começa o jogo com metade da Sanidade normal para sua classe."
    }
  },
  {
    "id": "desgarrado",
    "nome": "Desgarrado",
    "descricao": "Você não vivia de acordo com as normas da sociedade. Podia ser um eremita, uma pessoa em situação de rua ou simplesmente alguém que descobriu o paranormal e abandonou sua rotina — sabendo o quão frágil era a existência humana, não conseguia simplesmente continuar indo para o trabalho todo dia. De qualquer forma, a vida sem os confortos modernos o deixou mais forte.",
    "pericias": ["fortitude", "sobrevivencia"],
    "poder": {
      "nome": "Calejado",
      "descricao": "Você recebe +1 PV para cada 5% de NEX."
    }
  },
  {
    "id": "diplomata",
    "nome": "Diplomata",
    "descricao": "Você atuava em uma área onde as habilidades sociais e políticas eram ferramentas indispensáveis. Talvez fosse representante comercial de uma empresa, membro de um partido político ou embaixador do governo. Em algum momento, entretanto, você teve uma experiência paranormal que revelou entidades com as quais não se é possível negociar. Agora, você usa os contatos que adquiriu para combater o Outro Lado.",
    "pericias": ["atualidades", "diplomacia"],
    "poder": {
      "nome": "Conexões",
      "descricao": "Você recebe +2 em Diplomacia. Além disso, se puder contatar um NPC capaz de lhe auxiliar, você pode gastar 10 minutos e 2 PE para substituir um teste de uma perícia relacionada ao conhecimento desse NPC, feito até o fim da cena, por um teste de Diplomacia."
    }
  },
  {
    "id": "engenheiro",
    "nome": "Engenheiro",
    "descricao": "Pedreiro, industriário, operador de máquinas em uma fábrica, inventor, artesão… Você passou uma parte de sua vida em um emprego braçal ou intelectual, desempenhando atividades práticas que lhe deram uma visão pragmática do mundo. Sua rotina mundana, entretanto, foi confrontada de alguma forma pelo paranormal, e você não consegue mais esquecer tudo que viu sobre os mistérios do mundo.",
    "pericias": ["ciencias", "tecnologia"],
    "poder": {
      "nome": "Invenção",
      "descricao": "Em uma cena de interlúdio, você pode gastar uma de suas ações para transformar uma arma improvisada em uma arma comum, ou transformar uma armadura improvisada em uma vestimenta."
    }
  },
  {
    "id": "executivo",
    "nome": "Executivo",
    "descricao": "Você possuía um trabalho de escritório em uma grande empresa, banco ou corporação. Era um administrador, advogado, contador ou de qualquer outra profissão que lida com papelada e burocracia. Sua vida era bastante normal, até que você descobriu algo que não devia. Talvez o sucesso da empresa residisse em um ritual? Talvez toda a corporação fosse fachada para um culto e o presidente, um líder cultista envolvido com entidades paranormais? Após essa descoberta, você foi recrutado pela Ordem e trocou seu trabalho de escritório por missões de campo — hoje, sua vida é tudo, menos normal.",
    "pericias": ["diplomacia", "profissao"],
    "poder": {
      "nome": "Processo Otimizado",
      "descricao": "Sempre que faz um teste de perícia durante um teste estendido, ou uma ação para revisar documentos (físicos ou digitais), pode pagar 2 PE para receber +5 nesse teste."
    }
  },
  {
    "id": "experimento",
    "nome": "Experimento",
    "descricao": "Você foi uma cobaia em um experimento físico. Pode ter sido um voluntário em um procedimento experimental legítimo, ou submetido a experimentos científicos ou paranormais contra sua vontade. Qualquer que seja a natureza desse evento, causou alterações permanentes em seu corpo, como um cheiro forte de químicos, cicatrizes ou manchas estranhas, ou outra metamorfose claramente antinatural. Elas concedem capacidades extraordinárias, mas trazem um estigma que provoca reações negativas em outras pessoas.",
    "pericias": ["atletismo", "fortitude"],
    "poder": {
      "nome": "Mutação",
      "descricao": "Você recebe resistência a dano 2 e +2 em uma perícia à sua escolha que seja originalmente baseada em Força, Agilidade ou Vigor. Entretanto, sofre −O em Diplomacia."
    }
  },
  {
    "id": "explorador",
    "nome": "Explorador",
    "descricao": "Você é uma pessoa que se interessa muito por história ou geografia, frequentemente embarcando em trilhas e explorações para enriquecer seus estudos. Suas aventuras tornaram seu corpo mais resistente e capaz de se manter firme mesmo nas situações mais adversas. No entanto, um encontro trágico com o paranormal marcou sua jornada.",
    "pericias": ["fortitude", "sobrevivencia"],
    "poder": {
      "nome": "Manual do Sobrevivente",
      "descricao": "Ao fazer um teste para resistir a armadilhas, clima, doenças, fome, sede, fumaça, sono, sufocamento ou veneno, incluindo de fontes paranormais, você pode gastar 2 PE para receber +5 nesse teste. Além disso, em cenas de interlúdio, você considera condições de sono precárias como normais."
    }
  },
  {
    "id": "fanático-por-criaturas",
    "nome": "Fanático por Criaturas",
    "descricao": "Você sempre foi obcecado pelo sobrenatural. Desde que pode se lembrar, a ideia de encontrar uma criatura o fascina tanto quanto o assusta. Essa faísca fez você se tornar um \"caçador de monstros\", dedicando-se a localizar as feras citadas em documentários sensacionalistas. Para você, todo rumor e crendice pode esconder um fundo de verdade. Talvez uma de suas pesquisas o tenha levado diretamente a uma criatura paranormal, ou talvez elas tenham encontrado você primeiro. Afinal, você nunca esteve se escondendo.",
    "pericias": ["investigacao", "ocultismo"],
    "poder": {
      "nome": "Investigação Científica",
      "descricao": "Uma vez por cena de investigação, você pode gastar uma ação livre para procurar pistas, usando Ciências no lugar da perícia que seria usada para tentar encontrar a pista em questão."
    }
  },
  {
    "id": "fotógrafo",
    "nome": "Fotógrafo",
    "descricao": "Você é um artista visual que usa câmeras para capturar momentos e transmitir histórias através de imagens estáticas. Costumeiramente movido pela paixão de observar o mundo ao seu redor, buscando ângulos únicos e perspectivas singulares para documentar a vida e a sociedade, você não fazia ideia de que encontraria elementos paranormais através de sua lente.",
    "pericias": ["artes", "percepcao"],
    "poder": {
      "nome": "Através da Lente",
      "descricao": "Quando faz um teste de Investigação ou de Percepção ou para adquirir pistas olhando através de uma câmera ou analisando fotos, você pode gastar 2 PE para receber +5 nesse teste (um personagem que se move olhando através de uma lente anda à metade de seu deslocamento)."
    }
  },
  {
    "id": "inventor-paranormal",
    "nome": "Inventor Paranormal",
    "descricao": "A curiosidade e a criatividade fizeram de você uma pessoa que busca constantemente desafiar limites e criar soluções inovadoras, sendo mais de uma vez intitulado como um \"cientista louco\". Você teve contato com o paranormal por meio de seus experimentos ou foi procurado pela Ordem porque suas pesquisas chamaram atenção demais. De qualquer forma, o Outro Lado inspira você a utilizar o desconhecido em suas invenções.",
    "pericias": ["profissao", "vontade"],
    "poder": {
      "nome": "Invenção Paranormal",
      "descricao": "Escolha um ritual de 1º círculo. Você possui um invento paranormal, um item de categoria 0 que ocupa 1 espaço e que permite que você execute o efeito do ritual escolhido. Para ativar o invento, você gasta uma ação padrão (ou a ação necessária para lançar o ritual, o que for maior) e faz um teste de Profissão (engenheiro) com DT 15 +5 para cada ativação na mesma missão. Se passar, o item faz o equivalente a conjurar o ritual em sua forma básica sem pagar seu custo em PE. Se falhar, ele enguiça. Você pode gastar uma ação de interlúdio para fazer a manutenção do seu invento; fazer isso o conserta e redefine sua DT de ativação para 15. Você pode trocar o ritual contido em seu invento no início de cada missão."
    }
  },
  {
    "id": "investigador",
    "nome": "Investigador",
    "descricao": "Você era um investigador do governo, como um perito forense ou policial federal, ou privado, como um detetive particular. Pode ter tido contato com o paranormal em algum caso ou ter sido recrutado pela Ordem por suas habilidades de resolução de mistérios.",
    "pericias": ["investigacao", "percepcao"],
    "poder": {
      "nome": "Faro para Pistas",
      "descricao": "Uma vez por cena, quando fizer um teste para procurar pistas, você pode gastar 1 PE para receber +5 nesse teste."
    }
  },
  {
    "id": "jornalista",
    "nome": "Jornalista",
    "descricao": "Uma espécie ameaçada de extinção, você atuava investigando notícias para um jornal, rede de televisão, blog, canal de YouTube… Você se juntou a Ordem porque descobriu algo relacionado ao paranormal, ou foi recrutado para investigar um caso específico. Seja como for, continua buscando a verdade - não mais para informar as pessoas, mas sim para protegê-las.",
    "pericias": ["atualidades", "investigacao"],
    "poder": {
      "nome": "Fontes Confiáveis",
      "descricao": "Uma vez por sessão de jogo, você pode gastar 1 PE para contatar suas fontes - pessoas com acesso a informações nas quais você confia. Isso permite que você role novamente um teste já realizado para encontrar uma pista, com +5 de bônus, ou receba outra informação relevante (a critério do mestre)."
    }
  },
  {
    "id": "jovem-místico",
    "nome": "Jovem Místico",
    "descricao": "Você possui uma profunda conexão com sua espiritualidade, suas crenças ou o próprio universo. Essa conexão faz com que você veja o mundo e viva sua vida de forma diferente e peculiar, características que o tornaram mais suscetível a um encontro com o paranormal.",
    "pericias": ["ocultismo", "religiao"],
    "poder": {
      "nome": "A Culpa é das Estrelas",
      "descricao": "Escolha um número da sorte entre 1 e 6. No início de cada cena, você pode gastar 1 PE e rolar 1d6. Se o resultado for seu número da sorte, você recebe +2 em testes de perícia até o fim da cena. Caso contrário, na próxima vez que usar esta habilidade, escolha mais um número como número da sorte. Quando rolar um de seus números da sorte, a quantidade de números volta a 1."
    }
  },
  {
    "id": "legista-do-turno-da-noite",
    "nome": "Legista do Turno da Noite",
    "descricao": "Em um trabalho como o seu, é de se esperar que você já tenha visto muita coisa. No entanto, quando o sol se põe, seus colegas vão embora e a luz artificial deixa cantos sombrios do necrotério, talvez você veja mais do que gostaria. Os sons que poderiam ter sido fruto de sua imaginação se revelaram mais do que um truque da sua própria mente, fazendo você descobrir que nem sempre a morte é o fim de tudo.",
    "pericias": ["ciencias", "medicina"],
    "poder": {
      "nome": "Luto Habitual",
      "descricao": "Você sofre apenas a metade do dano mental por presenciar uma cena que, a critério do mestre, esteja relacionada à rotina de um legista (como presenciar uma morte, ver um cadáver ou encontrar órgãos humanos). Além disso, quando faz um teste de Medicina para primeiros socorros ou necropsia, você pode gastar 2 PE para receber +5 nesse teste."
    }
  },
  {
    "id": "lutador",
    "nome": "Lutador",
    "descricao": "Você pratica uma arte marcial ou esporte de luta, ou cresceu em um bairro perigoso onde aprendeu briga de rua. Já quebrou muitos ossos, tanto seus quanto dos outros. Pode ter conhecido a Ordem após um torneio secreto envolvendo entidades do Outro Lado ou ter sido recrutado pela sua capacidade de luta.",
    "pericias": ["luta", "reflexos"],
    "poder": {
      "nome": "Mão Pesada",
      "descricao": "Você recebe +2 em rolagens de dano com ataques corpo a corpo."
    }
  },
  {
    "id": "magnata",
    "nome": "Magnata",
    "descricao": "Você possui muito dinheiro ou patrimônio. Pode ser o herdeiro de uma família antiga ligada ao oculto, ter criado e vendido uma empresa e decidido usar sua riqueza para uma causa maior, ou ter ganho uma loteria após inadvertidamente escolher números amaldiçoados que formavam um ritual.",
    "pericias": ["diplomacia", "pilotagem"],
    "poder": {
      "nome": "Patrocinador da Ordem",
      "descricao": "Seu limite de crédito é sempre considerado um acima do atual. Caso não esteja usando o sistema de limite de créditos, você ganha um desconto de 25% em todas as compras."
    }
  },
  {
    "id": "mateiro",
    "nome": "Mateiro",
    "descricao": "Você conhece áreas rurais e selvagens. Você pode ser um guia florestal, um biólogo de campo ou simplesmente um entusiasta da vida selvagem. Qualquer que seja sua relação com a natureza, ela foi sua porta para o contato com o Outro Lado.",
    "pericias": ["percepcao", "sobrevivencia"],
    "poder": {
      "nome": "Mapa Celeste",
      "descricao": "Desde que possa ver o céu, você sempre sabe as direções dos pontos cardeais e consegue chegar sem se perder em qualquer lugar que já tenha visitado ao menos uma vez. Quando faz um teste de Sobrevivência, você pode gastar 2 PE para rolar o teste novamente e escolher o melhor entre os dois resultados. Além disso, em cenas de interlúdio, você considera condições de sono precárias como normais."
    }
  },
  {
    "id": "mercenário",
    "nome": "Mercenário",
    "descricao": "Você é um soldado de aluguel, que trabalha sozinho ou como parte de alguma organização que vende serviços militares. Escoltas e assassinatos fizeram parte de sua rotina por tempo o suficiente para você se envolver em alguma situação com o paranormal. Você é o que os conspiradores mais temem. Seu nome e rosto já foram apagados de diversos registros - a sua identidade atual é realmente sua?",
    "pericias": ["iniciativa", "intimidacao"],
    "poder": {
      "nome": "Posição de Combate",
      "descricao": "Você tem experiência em como chegar em um alvo em meio a uma multidão ou sem causar alarde. Você recebe +5 em testes de Investigação, Diplomacia e Enganação contra alvos que estejam Indiferentes a sua presença."
    }
  },
  {
    "id": "mergulhador",
    "nome": "Mergulhador",
    "descricao": "Seja por profissão ou por hobby, você é um aventureiro subaquático que explora os mistérios e maravilhas do mundo submerso. Trajando seu equipamento de mergulho, você consegue se aventurar a grandes profundidades para descobrir um mundo totalmente diferente daquele que conhecemos na superfície. Infelizmente, no dia em que você olhou para o abismo, ele encarou você de volta.",
    "pericias": ["atletismo", "fortitude"],
    "poder": {
      "nome": "Fôlego de Nadador",
      "descricao": "Você recebe +5 PV e pode prender a respiração por um número de rodadas igual ao dobro do seu Vigor. Além disso, quando passa em um teste de Atletismo para natação, você avança seu deslocamento normal (em vez da metade)."
    }
  },
  {
    "id": "militar",
    "nome": "Militar",
    "descricao": "Você serviu em uma força militar, como o exército ou a marinha. Passou muito tempo treinando com armas de fogo, até se tornar um perito no uso delas. Acostumado a obedecer ordens e partir em missões, está em casa na Ordo Realitas. O inimigo é diferente, mas um tiro bem dado continua resolvendo o problema.",
    "pericias": ["pontaria", "tatica"],
    "poder": {
      "nome": "Para Bellum",
      "descricao": "Você recebe +2 em rolagens de dano com armas de fogo."
    }
  },
  {
    "id": "motorista",
    "nome": "Motorista",
    "descricao": "Você é um caminhoneiro, motorista de aplicativo, motoboy, piloto de corrida, motorista de ambulância ou qualquer outro tipo de condutor profissional. Você levava a vida transportando cargas ou passageiros, até o dia em que suas viagens cruzaram o caminho do Outro Lado.",
    "pericias": ["pilotagem", "reflexos"],
    "poder": {
      "nome": "Mãos no Volante",
      "descricao": "Você não sofre penalidades em testes de ataque por estar em um veículo em movimento e, sempre que estiver pilotando e tiver que fazer um teste de Pilotagem ou resistência, pode gastar 2 PE para receber +5 nesse teste."
    }
  },
  {
    "id": "nerd-entusiasta",
    "nome": "Nerd Entusiasta",
    "descricao": "Você dedicou muito do seu tempo aprendendo sobre videogames, RPGs de mesa, ficção científica ou qualquer outro assunto considerado \"nerd\". Sua obsessão em pesquisar fundo seus assuntos de interesse e sua capacidade em lidar com os mais variados temas chamou a atenção de organizações paranormais.",
    "pericias": ["ciencias", "tecnologia"],
    "poder": {
      "nome": "O Inteligentão",
      "descricao": "O bônus que você recebe ao utilizar a ação de interlúdio ler aumenta em +1 dado (de +1d6 para +2d6)."
    }
  },
  {
    "id": "operário",
    "nome": "Operário",
    "descricao": "Pedreiro, industriário, operador de máquinas em uma fábrica… Você passou uma parte de sua vida em um emprego braçal, desempenhando atividades práticas que lhe deram uma visão pragmática do mundo. Sua rotina mundana, entretanto, foi confrontada de alguma forma pelo paranormal, e você não consegue mais esquecer tudo que viu sobre os mistérios do mundo.",
    "pericias": ["fortitude", "profissao"],
    "poder": {
      "nome": "Ferramenta de Trabalho",
      "descricao": "Escolha uma arma simples ou tática que, a critério do mestre, poderia ser usada como ferramenta em sua profissão (como uma marreta para um pedreiro). Você sabe usar a arma escolhida e recebe +1 em testes de ataque, rolagens de dano e margem de ameaça com ela."
    }
  },
  {
    "id": "policial",
    "nome": "Policial",
    "descricao": "Você fez parte de uma força de segurança pública, civil ou militar. Em alguma patrulha ou chamado se deparou com um caso paranormal e sobreviveu para contar a história.",
    "pericias": ["percepcao", "pontaria"],
    "poder": {
      "nome": "Patrulha",
      "descricao": "Você recebe +2 em Defesa."
    }
  },
  {
    "id": "politico",
    "nome": "Político",
    "descricao": "Você fez parte de uma força de segurança pública, civil ou militar. Em alguma patrulha ou chamado se deparou com um caso paranormal e sobreviveu para contar a história.",
    "pericias": ["diplomacia", "enganacao"],
    "poder": {
      "nome": "Lavagem de Mãos",
      "descricao": "O dinheiro que tem ao seu dispor sempre te ajudou a conquistar o que queria. Sempre que estiver em uma cena que dependa de interação com NPCs para adquirir informações, você pode subornar a pessoa para conseguir dois sucessos. Este dinheiro teve que sair de algum lugar, por isso, na sua próxima missão, você e seu grupo, diminuem em uma patente o limite de crédito que possuem para está missão. Alternativamente, você também pode não receber um item da maior categoria de prestígio que possuir em sua próxima missão, para anular a penalidade de seu grupo. Esta penalidade é cumulativa."
    }
  },
  {
    "id": "professor",
    "nome": "Professor",
    "descricao": "Você leciona em uma escola ou universidade, ensinando ciências, artes ou outro campo do saber. Sua profissão é uma das mais nobres de todas e o colocou em contato com muitas pessoas e conhecimentos.",
    "pericias": ["ciencias", "diplomacia"],
    "poder": {
      "nome": "Professor",
      "descricao": "Você sabe extrair o melhor das pessoas. Uma vez por cena, pode gastar uma ação padrão e 2 PE para fornecer +1 em um atributo de outro personagem em alcance curto até o fim da cena."
    }
  },
  {
    "id": "profetizado",
    "nome": "Profetizado",
    "descricao": "Como qualquer pessoa, você vai morrer. Entretanto, diferente delas, você sabe como isso vai acontecer. De algum jeito, seja por pesadelos, pensamentos intrusivos ou até visões inesperadas, você tem uma premonição clara — ou misteriosa e enigmática — de como serão seus últimos momentos de vida. O mestre pode determinar essa \"cena de morte\" em segredo e revelar apenas os detalhes que você já premuniu ou ambos podem determinar as condições para esse inevitável falecimento. A cena pode ser bem detalhada ou conter apenas alguns sinais. Por exemplo: \"você se vê pendurado em um gancho de carne, sangrando até desfalecer, no subsolo de um açougue\" ou \"a única coisa de que se lembra é da visão de um gancho\". Será que você é capaz de mudar seu próprio destino?",
    "pericias": ["vontade", "à escolha (relacionada à premonição)"],
    "poder": {
      "nome": "Luta ou Fuga",
      "descricao": "Conhecer os sinais de sua morte o deixa mais confiante, principalmente quando eles não estão presentes. Você recebe +2 em Vontade. Quando surge uma referência a sua premonição (um objeto semelhante a um gancho, por exemplo, para alguém cuja morte está ligada a morrer em um gancho de carne), uma onda de adrenalina toma seu corpo e seus instintos de luta ou fuga se intensificam. Além do bônus em Vontade, você recebe +2 PE temporários que duram até o fim da cena."
    }
  },
  {
    "id": "psicólogo",
    "nome": "Psicólogo",
    "descricao": "Você se especializou no estudo e tratamento das questões mentais do ser humano. Em sua prática profissional, você teve contato com o paranormal e descobriu que algumas aflições mentais possuem origens sombrias e perigosas. Agora, você emprega seus conhecimentos para enfrentar o Outro Lado.",
    "pericias": ["intuicao", "profissao"],
    "poder": {
      "nome": "Terapia",
      "descricao": "Você pode usar Profissão (psicólogo) como Diplomacia. Além disso, uma vez por rodada, quando você ou um aliado em alcance curto falha em um teste de resistência contra um efeito que causa dano mental, você pode gastar 2 PE para fazer um teste de Profissão (psicólogo) e usar o resultado desse teste no lugar do teste de resistência falho."
    }
  },
  {
    "id": "religioso",
    "nome": "Religioso",
    "descricao": "Você é devoto ou sacerdote de uma fé. Independentemente da religião que pratica, se dedica a auxiliar as pessoas com problemas espirituais. A partir disso, teve contato com o paranormal, o que fez com que fosse convocado pela Ordem.",
    "pericias": ["religiao", "vontade"],
    "poder": {
      "nome": "Acalentar",
      "descricao": "Você recebe +5 em testes de Religião para acalmar. Além disso, quando acalma uma pessoa, ela recebe um número de pontos de Sanidade igual a 1d6 + a sua Presença."
    }
  },
  {
    "id": "repórter-investigativo",
    "nome": "Repórter Investigativo",
    "descricao": "Você está sempre em busca de histórias significativas, investigando eventos, entrevistando fontes e analisando dados para descobrir a verdade por trás dos acontecimentos. Profissionais do seu ramo costumam ser curiosos, persistentes e, em muitos casos, éticos em sua busca pela verdade. Por outro lado, essa profissão leva pessoas ao encontro do indescritível, e com você não foi diferente.",
    "pericias": ["atualidades", "investigacao"],
    "poder": {
      "nome": "Encontrar a Verdade",
      "descricao": "Você pode usar Investigação no lugar de Diplomacia ao fazer testes para persuadir e mudar atitude e, quando faz um teste de Investigação, pode gastar 2 PE para receber +5 nesse teste."
    }
  },
  {
    "id": "servidor-público",
    "nome": "Servidor Público",
    "descricao": "Você possuía carreira em um órgão do governo, lidando com burocracia e atendendo pessoas. Sua rotina foi quebrada quando você viu que o prefeito era um cultista ou que a câmara de vereadores se reunia à noite para realizar rituais. Quando os próprios representantes do povo estão dispostos a sacrificá-lo para entidades malignas, onde reside nossa esperança? Hoje, você sabe a resposta para essa pergunta: na Ordo Realitas.",
    "pericias": ["intuicao", "vontade"],
    "poder": {
      "nome": "Espírito Cívico",
      "descricao": "Sempre que faz um teste para ajudar, você pode gastar 1 PE para aumentar o bônus concedido em +2."
    }
  },
  {
    "id": "teórico-da-conspiração",
    "nome": "Teórico da Conspiração",
    "descricao": "A humanidade nunca pisou na lua. Reptilianos ocupam importantes cargos públicos. A Terra é plana… E secretamente governada pelos Illuminati. Você sabe isso tudo, pois investigou a fundo esses importantes assuntos. Quando sua pesquisa esbarrou no paranormal, você foi recrutado. Na Ordem, sua loucura determinação será usada para um bom propósito.",
    "pericias": ["investigacao", "ocultismo"],
    "poder": {
      "nome": "Eu Já Sabia",
      "descricao": "Você não se abala tanto com entidades ou anomalias. Afinal, sempre soube que isso tudo existia. Você recebe resistência a dano mental igual ao seu Intelecto."
    }
  },
  {
    "id": "t.i.",
    "nome": "T.I.",
    "descricao": "Programador, engenheiro de software ou simplesmente \"o cara da T.I.\", você tem treinamento e experiência para lidar com sistemas informatizados. Seu talento (ou curiosidade exagerada) chamou a atenção da Ordem.",
    "pericias": ["investigacao", "tecnologia"],
    "poder": {
      "nome": "Motor de Busca",
      "descricao": "A critério do mestre, sempre que tiver acesso a internet, você pode gastar 2 PE para substituir um teste de perícia qualquer por um teste de Tecnologia."
    }
  },
  {
    "id": "trabalhador-rural",
    "nome": "Trabalhador Rural",
    "descricao": "Você trabalhava no campo ou em áreas isoladas, como fazendeiro, pescador, biólogo, veterinário… Você se acostumou com o convívio com a natureza e os animais e talvez tenha ouvido uma ou outra história de fantasmas ao redor da fogueira. Em algum momento da sua vida, porém, descobriu que muitas dessas histórias são verdadeiras.",
    "pericias": ["adestramento", "sobrevivencia"],
    "poder": {
      "nome": "Desbravador",
      "descricao": "Quando faz um teste de Adestramento ou Sobrevivência, você pode gastar 2 PE para receber +5 nesse teste. Além disso, você não sofre penalidade em deslocamento por terreno difícil."
    }
  },
  {
    "id": "trambiqueiro",
    "nome": "Trambiqueiro",
    "descricao": "Uma vida digna exige muito trabalho, então é melhor nem tentar. Você vivia de pequenos golpes, jogatina ilegal e falcatruas. Certo dia, enganou a pessoa errada; no dia seguinte, se viu servindo à Ordem. Pelo menos agora tem a chance de usar sua lábia para o bem.",
    "pericias": ["crime", "enganacao"],
    "poder": {
      "nome": "Impostor",
      "descricao": "Uma vez por cena, você pode gastar 2 PE para substituir um teste de perícia qualquer por um teste de Enganação."
    }
  },
  {
    "id": "transtornado-arrependido",
    "nome": "Transtornado Arrependido",
    "descricao": "(Essa origem é o exemplo de um Cultista Arrependido. Você já caminhou entre os Transtornados. Talvez tenha sido um seguidor cego, seduzido pelas promessas de transcendência por meio da carne e da dor. Talvez tenha conhecido a natureza visceral do culto desde o início e ainda assim escolheu mergulhar no delírio. Seja como for, em algum momento algo rompeu o ciclo. Você se libertou, mas ainda sente o eco dos rituais e a presença do Sangue sussurrando na própria carne.",
    "pericias": ["luta", "ocultismo"],
    "poder": {
      "nome": "Sofrimento de Sangue",
      "descricao": "Eles podem tentar, mas já não dói mais. Você recebe RD 2 a dano físico. Para cada dois rituais de Sangue que possua, ou para cada poder paranormal de Sangue que possua, essa RD aumenta em +1. Contudo, a lembrança das desgraças que você viveu ou fez te causa pesadelos terríveis. Sua condição de descanso é sempre uma categoria pior (luxuosa se torna confortável, confortável se torna normal e normal se torna precária). A critério da sua história, você também pode escolher outro elemento para funcionar com esse poder."
    }
  },
  {
    "id": "tripulante",
    "nome": "Tripulante",
    "descricao": "Você era um trabalhador em navios de cruzeiro, pesqueiros, militares ou até mesmo  piratas. Por isso, se acostumou às viagens marítimas, desbravando os mares deste mundo, lidando com seus perigos amedrontadores e lendas de outros mundos.",
    "pericias": ["percepcao", "vontade"],
    "poder": {
      "nome": "Lutando pelo Povo",
      "descricao": "Como um membro da marinha ou guarda-costeira, você viaja pelo mar brandindo a justiça de seu país, seja em guerras contra outros países, ou de piratas causando o caos pelas águas. Em situações como estas, suas maiores forças afloram, conseguindo se sobressair mesmo em emboscadas e com desvantagem numérica. Caso esteja em desvantagem em uma cena de combate, você recebe 2 PV temporários para cada ser que os inimigos possuírem de vantagem numérica."
    }
  },
  {
    "id": "universitário",
    "nome": "Universitário",
    "descricao": "Você era aluno de uma faculdade. Em sua rotina de estudos, provas e festas, acabou descobrindo algo — talvez um livro amaldiçoado na antiga biblioteca do campus? Por seu achado, foi convocado pela Ordem. Agora, estuda com mais afinco: nesse novo curso, ouviu dizer que as provas podem ser mortais.",
    "pericias": ["atualidades", "investigacao"],
    "poder": {
      "nome": "Dedicação",
      "descricao": "Você recebe +1 PE, e mais 1 PE adicional a cada NEX ímpar (15%, 25%…). Além disso, seu limite de PE por turno aumenta em 1 (em NEX 5% seu limite é 2, em NEX 10% é 3 e assim por diante; isso não afeta a DT de seus efeitos)."
    }
  },
  {
    "id": "vítima",
    "nome": "Vítima",
    "descricao": "Em algum momento de sua vida — infância, juventude ou início da vida adulta — você encontrou o paranormal… E a experiência não foi nada boa. Você viu os espíritos dos mortos, foi atacado por uma entidade ou mesmo foi sequestrado para ser sacrificado em um ritual impedido no último momento. A experiência foi traumática, mas você não se abateu; em vez disso, decidiu lutar para impedir que outros inocentes passem pelo mesmo. E, já tendo sido vítima do paranormal, se tornou habilidoso em evitar perigos.",
    "pericias": ["reflexos", "vontade"],
    "poder": {
      "nome": "Cicatrizes Psicológicas",
      "descricao": "Você recebe +1 de Sanidade para cada 5% de NEX."
    }
  }
];


/* --------------------------------------------------------------------------
   4. CLASSES
   Cada classe tem:
     - stats base/por-NEX de PV, PE, SAN
     - proficiencias (texto livre)
     - periciasIniciaisTexto (texto explicando quantas perícias treinar)
     - tabelaNex: o que a classe ganha em cada NEX (5% a 99%)
         tipo: "fixo"      -> ganha automaticamente (mostra o texto)
         tipo: "escolha"   -> jogador escolhe 1 item da lista "poderes" da classe
         tipo: "trilha"    -> jogador escolha 1 poder da trilha escolhida
     - poderes: lista de "Poder de Classe" que o jogador pode escolher
         sempre que a tabelaNex tiver um passo do tipo "escolha"
     - trilhas: subclasses, cada uma com sua lista de poderes por NEX
   -------------------------------------------------------------------------- */
const CLASSES = {

  combatente: {
    nome: "Combatente",
    resumo: "Perito em armas brancas e de fogo, a linha de frente contra o Outro Lado.",
    pv: { base: 20, porNex: 4 },
    pe: { base: 2, porNex: 2 },
    san: { base: 12, porNex: 3 },
    proficiencias: "Armas simples, armas táticas e proteções leves (e pesadas, a partir de certo NEX).",
    periciasIniciaisTexto: "Luta ou Pontaria, e Fortitude ou Reflexos, mais 1 + Intelecto perícias à escolha.",

    tabelaNex: [
      { nex: 5,  tipo: "fixo",    texto: "Ataque especial (2 PE, +5)" },
      { nex: 10, tipo: "trilha",  texto: "Escolha de trilha" },
      { nex: 15, tipo: "escolha", texto: "Poder de combatente" },
      { nex: 20, tipo: "fixo",    texto: "Aumento de Atributo" },
      { nex: 25, tipo: "escolha", texto: "Poder de combatente, habilidade de trilha" },
      { nex: 30, tipo: "escolha", texto: "Ataque especial (3 PE, +10)" },
      { nex: 35, tipo: "fixo",    texto: "Grau de treinamento" },
      { nex: 40, tipo: "trilha",  texto: "Poder de combatente, habilidade de trilha" },
      { nex: 45, tipo: "escolha", texto: "Aumento de atributo" },
      { nex: 50, tipo: "fixo",    texto: "Ataque especial (4 PE, +15)" },
      { nex: 55, tipo: "escolha", texto: "Poder de combatente" },
      { nex: 60, tipo: "escolha", texto: "Perícia adicional ou +2 em perícia treinada" },
      { nex: 65, tipo: "trilha",  texto: "Poder de combatente, habilidade de trilha" },
      { nex: 70, tipo: "fixo",    texto: "Grau de treinamento" },
      { nex: 75, tipo: "escolha", texto: "Ataque especial (5 PE, +20)" },
      { nex: 80, tipo: "fixo",    texto: "Aumento de atributo" },
      { nex: 85, tipo: "escolha", texto: "+5 PV, +5 PE" },
      { nex: 90, tipo: "escolha", texto: "Poder de combatente" },
      { nex: 95, tipo: "fixo",    texto: "Aumento de atributo" },
      { nex: 99, tipo: "trilha",  texto: "Poder de combatente, habilidade de trilha" },
    ],

    poderes: [
        { "nome": "Acuidade Armamentista", "preRequisito": null, "descricao": "Armas leves tem seu dano aumentado em um passo (de d6 para d8, de d8 para d10, de d10 para d12)." },

        { "nome": "Armamento Pesado", "preRequisito": "FOR 2", "descricao": "Você recebe proficiência com armas pesadas." },

        { "nome": "Artista Marcial", "preRequisito": null, "descricao": "Seus ataques desarmados causam 1d6 pontos de dano, podem causar dano letal e se tornam ágeis (veja p. 59). Em NEX 35%, o dano aumenta para 1d8 e, em NEX 70%, para 1d10." },

        { "nome": "Ataque de Oportunidade", "preRequisito": null, "descricao": "Sempre que um ser sair voluntariamente de um espaço adjacente ao seu, você pode gastar uma reação e 1 PE para fazer um ataque corpo a corpo contra ele." },

        { "nome": "Atirador Rudimentar", "preRequisito": null, "descricao": "O dano das suas armas de disparo (exceto armas de fogo) aumenta em um dado do mesmo tipo." },

        { "nome": "Combate Defensivo", "preRequisito": "INT 2", "descricao": "Quando usa a ação agredir, você pode combater defensivamente. Se fizer isso, até seu próximo turno, sofre –O em todos os testes de ataque, mas recebe +5 na Defesa." },

        { "nome": "Combater com Duas Armas", "preRequisito": "AGI 3, Treinado em Luta ou Pontaria", "descricao": "Se estiver empunhando duas armas (e pelo menos uma for leve) e fizer a ação agredir, você pode fazer dois ataques, um com cada arma. Se fizer isso, sofre –O em todos os testes de ataque até o seu próximo turno." },

        { "nome": "Corte Arterial", "preRequisito": null, "descricao": "Ao acertar um ataque crítico usando uma arma cortante, você pode gastar 1 PE para deixar o alvo sangrando." },

        { "nome": "Empunhadura Pesada", "preRequisito": "Veterano em Luta", "descricao": "Quando causa dano com uma arma corpo a corpo de duas mãos, você pode rolar novamente qualquer resultado 1 ou 2 das rolagens de dano da arma." },

        { "nome": "Especialista em Proteção Leve", "preRequisito": null, "descricao": "Você sabe usufruir do que a proteção leve tem de melhor. Se estiver usando uma proteção leve, você recebe +2 na Defesa e em Reflexos." },

        { "nome": "Especialização em Armadura", "preRequisito": "VIG 2, Proteção Pesada, Treinado em Luta", "descricao": "Itens que concedem bônus na defesa te concedem metade do seu bônus em RD física." },

        { "nome": "Esquiva Ofensiva", "preRequisito": null, "descricao": " Sempre que esquivar com sucesso, você pode realizar uma manobra de desarmar ou derrubar como ação de movimento." },

        { "nome": "Estilo de Arma e Escudo", "preRequisito": "Treinado em Luta, Proteção Pesada", "descricao": "Se estiver usando um escudo, o bônus na Defesa e RD que ele fornece aumenta em +2." },

        { "nome": "Golpe Demolidor", "preRequisito": "FOR 2, Treinado em Luta", "descricao": "Quando usa a manobra quebrar ou ataca um objeto, você pode gastar 1 PE para causar dois dados de dano extra do mesmo tipo de sua arma." },

        { "nome": "Golpe Pesado", "preRequisito": null, "descricao": "O dano dos seus ataques corpo a corpo aumenta em um dado do mesmo tipo." },

        { "nome": "Golpes de Arena", "preRequisito": "Wing Chun", "descricao": "Você aprendeu como se briga de verdade. Quando acerta um ataque corpo a corpo, você pode gastar 2 PE para fazer um ataque corpo a corpo adicional ou uma manobra de combate." },

        { "nome": "Incansável", "preRequisito": null, "descricao": "Uma vez por cena, você pode usar uma habilidade ou poder de classe sem gastar nenhum PE." },

        { "nome": "Inexpugnável", "preRequisito": "Proteção Pesada", "descricao": "Se estiver usando uma armadura pesada, você recebe +2 em testes de resistência. Esse bônus aumenta em +2 para cada poder que tem como pré-requisito proteção pesada." },

        { "nome": "Muay Thai", "preRequisito": "VIG 2, Artista Marcial", "descricao": "Quando fizer um bloqueio e reduzir o dano a metade, você pode gastar 2 PE como reação livre para fazer um ataque desarmado contra o atacante." },

        { "nome": "Presteza Atlética", "preRequisito": null, "descricao": "Quando faz um teste de facilitar a investigação, você pode gastar 1 PE para usar Força ou Agilidade no lugar do atributo-base da perícia. Se passar no teste, o próximo aliado que usar seu bônus também recebe +O no teste." },

        { "nome": "Proteção Pesada", "preRequisito": "NEX 30%", "descricao": "Você recebe proficiência com Proteções Pesadas." },

        { "nome": "Reflexos Defensivos", "preRequisito": "AGI 2", "descricao": "Você recebe +2 em Defesa e em testes de resistência." },

        { "nome": "Saque Rápido", "preRequisito": "Treinado em Iniciativa", "descricao": "Além do normal, também concede +2 em Iniciativa." },

        { "nome": "Samba", "preRequisito": null, "descricao": "Você recebe +1d20 em testes de manobras de agarrar, derrubar e desarmar." },

        { "nome": "Segurar o Gatilho", "preRequisito": "NEX 60%", "descricao": "Sempre que acerta um ataque com uma arma de fogo, pode fazer outro ataque com a mesma arma contra o mesmo alvo, pagando 2 PE por cada ataque já realizado no turno. Ou seja, pode fazer o primeiro ataque extra gastando 2 PE e, se acertar, pode fazer um segundo ataque extra gastando mais 4 PE e assim por diante, até errar um ataque ou atingir o limite de seus PE por rodada." },

        { "nome": "Sentido Tático", "preRequisito": "INT 2, Treinado em Percepção e Tática", "descricao": "Você pode gastar uma ação de movimento e 2 PE para analisar o ambiente. Se fizer isso, recebe um bônus em Defesa e em testes de resistência igual ao seu Intelecto até o final da cena." },

        { "nome": "Sobrevivente", "preRequisito": "VIG 3, Veterano em Fortitude", "descricao": "Você caminha para o pico da resiliência.  Você soma sua Fortitude nos seus PVs." },

        { "nome": "Tanque de Guerra", "preRequisito": "Proteção Pesada", "descricao": "Se estiver usando uma proteção pesada, a Defesa e a resistência a dano que ela fornece aumentam em +2." },

        { "nome": "Tática Paranormal", "preRequisito": null, "descricao": "Você recebe +2 em testes de ataque para cada ser sob efeito de um ritual seu." },

        { "nome": "Tiro Certeiro", "preRequisito": "Treinado em Pontaria", "descricao": "Se estiver usando uma arma de disparo, você soma sua Agilidade nas rolagens de dano e ignora a penalidade contra alvos envolvidos em combate corpo a corpo (mesmo se não usar a ação mirar)." },

        { "nome": "Tiro de Cobertura", "preRequisito": null, "descricao": "Você pode gastar uma ação padrão e 1 PE para disparar uma arma de fogo na direção de um ser no alcance da arma para forçá-lo a se proteger. Faça um teste de Pontaria contra a Vontade do alvo. Se vencer, até o início do seu próximo turno o alvo não pode sair do lugar onde está e sofre –5 em testes de ataque. A critério do mestre, o alvo recebe +5 no teste de Vontade se estiver em um lugar extremamente perigoso, como uma casa em chamas ou um barco afundando. Este é um efeito de medo." },

        { "nome": "Transcender", "preRequisito": null, "descricao": "Escolha um poder paranormal (veja a página 114). Você recebe o poder escolhido, mas não ganha Sanidade neste aumento de NEX. Você pode escolher este poder várias vezes." },

        { "nome": "Treinamento em Perícia", "preRequisito": null, "descricao": "Escolha duas perícias. Você se torna treinado nessas perícias. A partir de NEX 35%, você pode escolher perícias nas quais já é treinado para se tornar veterano. A partir de NEX 70%, pode escolher perícias nas quais já é veterano para se tornar expert. Você pode escolher este poder várias vezes." },

        { "nome": "Wing Chun", "preRequisito": "VIG 2, Artista Marcial", "descricao": "Ao fazer um ataque crítico com um ataque desarmado, você pode gastar 1 PE para fazer outro ataque desarmado como uma ação livre. O ataque pode ter qualquer alvo, contanto que esteja dentro do alcance do seu ataque." }
        ],

    trilhas: [
      {
        id: "duelista",
        nome: "Duelista",
        descricao: "Combate corpo a corpo com estilo e precisão, um contra um.",
        poderes: [
          { nex: 10, nome: "Estilo de Combate", descricao: "Escolha um estilo de arma; recebe um bônus específico ao lutar com ela." },
          { nex: 40, nome: "Reflexos de Duelo", descricao: "Recebe +2 na Defesa contra o primeiro ataque de cada oponente na cena." },
          { nex: 65, nome: "Golpe Certeiro", descricao: "Uma vez por cena, transforma um acerto em acerto crítico automático." },
          { nex: 99, nome: "Maestria Marcial", descricao: "Seus ataques corpo a corpo ignoram uma quantidade de redução de dano igual ao seu Vigor." },
        ],
      },
      {
        id: "tatico",
        nome: "Tático",
        descricao: "Comanda o campo de batalha, coordenando o grupo com precisão militar.",
        poderes: [
          { nex: 10, nome: "Comando", descricao: "Como ação livre, pode gastar 1 PE para dar +1d a um aliado no próximo teste dele." },
          { nex: 40, nome: "Coordenação Avançada", descricao: "Aliados que agem depois de você em Iniciativa recebem +2 em testes de ataque contra o mesmo alvo." },
          { nex: 65, nome: "Manobra Perfeita", descricao: "Uma vez por cena, concede uma ação padrão extra a um aliado." },
          { nex: 99, nome: "General de Campo", descricao: "Você e seus aliados em alcance curto ignoram os efeitos de Abalado." },
        ],
      },
    ],
  },

  especialista: {
    nome: "Especialista",
    resumo: "Versátil e engenhoso, especializado em resolver problemas com perícia e inteligência.",
    pv: { base: 16, porNex: 3 },
    pe: { base: 3, porNex: 3 },
    san: { base: 16, porNex: 4 },
    proficiencias: "Armas simples e proteções leves.",
    periciasIniciaisTexto: "7 + Intelecto perícias à escolha.",

    tabelaNex: [
        { nex: 5,  tipo: "fixo",    texto: "Eclético, perito (2 PE, +1d6)" },
        { nex: 10, tipo: "trilha",  texto: "Escolha de trilha" },
        { nex: 15, tipo: "escolha", texto: "Poder de especialista" },
        { nex: 20, tipo: "fixo",    texto: "Aumento de atributo" },
        { nex: 25, tipo: "trilha",  texto: "Poder de especialista, habilidade de trilha" },
        { nex: 30, tipo: "fixo",    texto: "Perito (3 PE, +1d8)" },
        { nex: 35, tipo: "fixo",    texto: "Grau de treinamento" },
        { nex: 40, tipo: "trilha",  texto: "Engenhosidade (veterano), poder de especialista, trilha" },
        { nex: 45, tipo: "fixo",    texto: "Aumento de atributo" },
        { nex: 50, tipo: "fixo",    texto: "Perito (4 PE, +1d10)" },
        { nex: 55, tipo: "escolha", texto: "Poder de especialista" },
        { nex: 60, tipo: "fixo",    texto: "Slot adicional de perito" },
        { nex: 65, tipo: "trilha",  texto: "Poder de especialista, habilidade de trilha" },
        { nex: 70, tipo: "fixo",    texto: "Grau de treinamento" },
        { nex: 75, tipo: "fixo",    texto: "Engenhosidade (expert), perito (5 PE, +1d12)" },
        { nex: 80, tipo: "fixo",    texto: "Aumento de atributo" },
        { nex: 85, tipo: "fixo",    texto: "+5 PV, +5 PE" },
        { nex: 90, tipo: "escolha", texto: "Poder de especialista" },
        { nex: 95, tipo: "fixo",    texto: "Aumento de atributo" },
        { nex: 99, tipo: "trilha",  texto: "Poder de especialista, habilidade de trilha" }
        ],

    poderes: [
        {
            "nome": "Adepto do Escuro",
            "preRequisito": null,
            "descricao": "Seus olhos se adaptaram a verem melhor no escuro. Você ignora camuflagem leve e total por escuridão. Além disso, recebe +2 em testes de Investigação e Percepção feitos em ambientes com pouca ou sem nenhuma luz."
        },

        {
            "nome": "Analítico",
            "preRequisito": null,
            "descricao": "Você pode usar Perito em Luta e Pontaria."
        },

        {
            "nome": "Análise de Combate",
            "preRequisito": "Treinado em Tática e Percepção",
            "descricao": "Você pode gastar uma ação de movimento e 1 PE para fazer uma análise completa do estilo de luta de um inimigo em alcance curto. Até o fim da cena, você adiciona seu Intelecto em testes de ataque, rolagens de dano e Defesa contra o alvo analisado. Além disso, Ao utilizar Tática para Analisar Terreno, você também adiciona seu Intelecto em testes de ataque ao usar a vantagem descrita. Para cada 5 pontos que superar a DT, recebe +2 pontos adicionais deste poder."
        },

        {
            "nome": "Arqueiro",
            "preRequisito": null,
            "descricao": "Você soma seu Intelecto em rolagens de dano e em ataques com armas de disparo (exceto armas de fogo)."
        },

        {
            "nome": "Artista Marcial",
            "preRequisito": null,
            "descricao": "Seus ataques desarmados causam 1d6 pontos de dano, podem causar dano letal e contam como armas ágeis. Em NEX 35%, o dano aumenta para 1d8 e, em NEX 70%, para 1d10."
        },

        {
            "nome": "Atirador Rudimentar",
            "preRequisito": null,
            "descricao": "O dano das suas armas de disparo (exceto armas de fogo) aumenta em um dado do mesmo tipo."
        },

        {
            "nome": "Balística Avançada",
            "preRequisito": null,
            "descricao": "Você recebe proficiência com armas táticas de fogo e +2 em rolagens de dano com armas de fogo."
        },

        {
            "nome": "Caçador",
            "preRequisito": null,
            "descricao": "O bônus de ataque em posição elevada aumenta para +2d20."
        },

        {
            "nome": "Conhecimento Aplicado",
            "preRequisito": "INT 2",
            "descricao": "Quando faz um teste de perícia (exceto Luta e Pontaria), você pode gastar 2 PE para mudar o atributo-base da perícia para Int."
        },

        {
            "nome": "Criatividade Técnica",
            "preRequisito": null,
            "descricao": "Se estiver usando um item que te concede um bônus de perícia baseada em Agilidade, você pode gastar 1 PE para usar esse bônus em outra perícia baseada em Agilidade."
        },

        {
            "nome": "Doutor",
            "preRequisito": null,
            "descricao": "Você é extremamente estudado e letrado em conhecimentos científicos. Você pode gastar 2 PE rerolar um dado de Medicina, Ciências ou Paramédico."
        },

        {
            "nome": "Fórmula Secreta",
            "preRequisito": null,
            "descricao": "Você soma seu Intelecto no dano e DT dos seus venenos."
        },

        {
            "nome": "Hacker",
            "preRequisito": "Treinado em Tecnologia",
            "descricao": "Você recebe +5 em testes de Tecnologia para invadir sistemas e diminui o tempo necessário para hackear qualquer sistema para uma ação completa."
        },

        {
            "nome": "Mão na Boca",
            "preRequisito": "Treinado em Luta, NEX 25%",
            "descricao": "Você recebe +2 em testes de agarrar. Quando faz um ataque furtivo contra um ser desprevenido, você pode fazer uma manobra de combate como ação livre. Se conseguir agarrar, ele não poderá falar enquanto estiver agarrado."
        },

        {
            "nome": "Mãos Rápidas",
            "preRequisito": "AGI 3, Treinado em Crime ou Furtividade",
            "descricao": "Ao fazer um teste de Crime ou qualquer ação com objetos pequenos (como munição, veneno) você pode gastar 1 PE para fazê-la como uma ação livre e furtivamente, se quiser. Além disso, você recebe +1d20 em todos os testes de Crime."
        },

        {
            "nome": "Médico da Salvação",
            "preRequisito": "Paramédico",
            "descricao": "Você se especializou em salvar vidas. Os dados de sua habilidade de médico de campo Paramédico aumentam de d10 para d12. Além disso, quando usa a habilidade Paramédico, você pode gastar 3 PE, uma vez por rodada, para usá-la como uma ação de movimento em vez de ação padrão."
        },

        {
            "nome": "Mente Criminosa",
            "preRequisito": null,
            "descricao": "Você soma seu Intelecto em testes de Crime e Furtividade."
        },

        {
            "nome": "Mochila de Utilidades",
            "preRequisito": null,
            "descricao": "Um item a sua escolha (exceto armas) conta como uma categoria abaixo e ocupa 1 espaço a menos."
        },

        {
            "nome": "Movimento Tático",
            "preRequisito": "Treinado em Atletismo",
            "descricao": "Você pode gastar 1 PE para ignorar a penalidade em deslocamento por terreno difícil e por escalar até o final do turno."
        },

        {
            "nome": "Na Trilha Certa",
            "preRequisito": null,
            "descricao": "Sempre que tiver sucesso em um teste para procurar pistas, você pode gastar 1 PE para receber +O no próximo teste. Os custos e os bônus são cumulativos (se passar num segundo teste, pode pagar 2 PE para receber um total de +OO no próximo teste, e assim por diante)."
        },

        {
            "nome": "Nerd",
            "preRequisito": null,
            "descricao": "Você é um repositório de conhecimento útil (e inútil). Uma vez por cena, pode gastar 2 PE para fazer um teste de Atualidades (DT 20). Se passar, recebe uma informação útil para essa cena (se for uma investigação, uma dica para uma pista; se for um combate, uma fraqueza de um inimigo, e assim por diante). A fonte da informação pode ser desde um livro antigo que você leu na biblioteca até um episódio de sua série de ficção favorita."
        },

        {
            "nome": "Ninja Urbano",
            "preRequisito": null,
            "descricao": "Você recebe proficiência com armas táticas de ataque corpo a corpo e de disparo (exceto de fogo) e +2 em rolagens de dano com armas de corpo a corpo e de disparo."
        },

        {
            "nome": "Oculto e Letal",
            "preRequisito": null,
            "descricao": "Você tem um crítico garantido ao fazer um ataque em um inimigo que não está ciente de você."
        },

        {
            "nome": "Pensamento Ágil",
            "preRequisito": null,
            "descricao": "Uma vez por rodada, durante uma cena de investigação, você pode gastar 2 PE para fazer uma ação de procurar pistas adicional."
        },

        {
            "nome": "Perito em Explosivos",
            "preRequisito": null,
            "descricao": "Você soma seu Intelecto na DT para resistir aos seus explosivos e pode excluir dos efeitos da explosão um número de alvos igual ao seu valor de Intelecto."
        },

        {
            "nome": "Precisão Máxima",
            "preRequisito": null,
            "descricao": "Ao mirar, você pode gastar 2 PE para receber +1d20 no teste de ataque."
        },

        {
            "nome": "Primeira Impressão",
            "preRequisito": null,
            "descricao": "Você recebe +OO no primeiro teste de Diplomacia, Enganação, Intimidação ou Intuição que fizer em uma cena."
        },

        {
            "nome": "Transcender",
            "preRequisito": null,
            "descricao": "Escolha um poder paranormal (veja a página 114). Você recebe o poder escolhido, mas não ganha Sanidade neste aumento de NEX. Você pode escolher este poder várias vezes."
        },

        {
            "nome": "Treinamento em Perícia",
            "preRequisito": null,
            "descricao": "Escolha duas perícias. Você se torna treinado nessas perícias. A partir de NEX 35%, você pode escolher perícias nas quais já é treinado para se tornar veterano. A partir de NEX 70%, pode escolher perícias nas quais já é veterano para se tornar expert. Você pode escolher este poder várias vezes."
        }
        ],

    trilhas: [
      {
        id: "infiltrador",
        nome: "Infiltrador",
        descricao: "Especialista em passar despercebido e resolver problemas nas sombras.",
        poderes: [
          { nex: 10, nome: "Passos Silenciosos", descricao: "Recebe +1d em testes de Furtividade enquanto não estiver em combate aberto." },
          { nex: 40, nome: "Golpe Furtivo", descricao: "Causa dano extra ao atacar um alvo desprevenido ou surpreso." },
          { nex: 65, nome: "Sombra entre Sombras", descricao: "Pode gastar 2 PE para se tornar invisível a observadores casuais por uma cena." },
          { nex: 99, nome: "Fantasma", descricao: "Nunca deixa rastros; testes para rastreá-lo sofrem -10." },
        ],
      },
      {
        id: "negociador",
        nome: "Negociador",
        descricao: "Resolve conflitos com palavras antes de recorrer à força.",
        poderes: [
          { nex: 10, nome: "Leitura Social", descricao: "Pode gastar 1 PE para descobrir a atitude inicial de um NPC em relação ao grupo." },
          { nex: 40, nome: "Acordo Vantajoso", descricao: "Uma vez por cena, converte um sucesso simples em uma vantagem extra na negociação." },
          { nex: 65, nome: "Palavra Final", descricao: "Uma vez por sessão, um NPC neutro ou hostil se torna amistoso após uma conversa." },
          { nex: 99, nome: "Mestre da Persuasão", descricao: "Testes de resistência contra suas habilidades sociais sofrem -5." },
        ],
      },
    ],
  },

  ocultista: {
    nome: "Ocultista",
    resumo: "Estuda e domina o paranormal para usá-lo como arma, aprendendo a conjurar Rituais.",
    pv: { base: 16, porNex: 3 },
    pe: { base: 4, porNex: 4 },
    san: { base: 12, porNex: 3 },
    proficiencias: "Armas simples e proteções leves.",
    periciasIniciaisTexto: "5 + Intelecto perícias à escolha, sempre incluindo Ocultismo.",

    tabelaNex: [
        { nex: 5,  tipo: "fixo",    texto: "Escolhido pelo Outro Lado (1º círculo)" },
        { nex: 10, tipo: "trilha",  texto: "Escolha de trilha" },
        { nex: 15, tipo: "escolha", texto: "Poder de ocultista" },
        { nex: 20, tipo: "fixo",    texto: "Aumento de atributo" },
        { nex: 25, tipo: "trilha",  texto: "Escolhido pelo Outro Lado (2º círculo), habilidade de trilha" },
        { nex: 30, tipo: "escolha", texto: "Poder de ocultista" },
        { nex: 35, tipo: "fixo",    texto: "Grau de treinamento" },
        { nex: 40, tipo: "trilha",  texto: "Poder de ocultista, habilidade de trilha" },
        { nex: 45, tipo: "fixo",    texto: "Aumento de atributo" },
        { nex: 50, tipo: "fixo",    texto: "Escolhido pelo Outro Lado (3 círculo)" },
        { nex: 55, tipo: "escolha", texto: "Poder de ocultista" },
        { nex: 60, tipo: "fixo",    texto: "Perícia adicional ou +2 em perícia treinada" },
        { nex: 65, tipo: "trilha",  texto: "Poder de ocultista, habilidade de trilha" },
        { nex: 70, tipo: "fixo",    texto: "Grau de treinamento" },
        { nex: 75, tipo: "fixo",    texto: "Escolhido pelo Outro Lado (4 círculo)" },
        { nex: 80, tipo: "fixo",    texto: "Aumento de atributo" },
        { nex: 85, tipo: "fixo",    texto: "+8 de PE" },
        { nex: 90, tipo: "escolha", texto: "Poder de ocultista" },
        { nex: 95, tipo: "fixo",    texto: "Aumento de atributo" },
        { nex: 99, tipo: "trilha",  texto: "Poder de ocultista, habilidade de trilha" }
    ],

    poderes: [
        {
            "nome": "Afinidade Elemental",
            "preRequisito": null,
            "descricao": "A execução de rituais é diminuída em um passo (de completa para padrão, de padrão para movimento) quando sobre uma superfície relacionada ao ritual (Transfigurar Água em um rio, rituais de Sangue em superfícies de sangue, por exemplo)."
        },

        {
            "nome": "Camuflar Ocultismo",
            "preRequisito": null,
            "descricao": "Você pode gastar uma ação livre para esconder símbolos e sigilos que estejam desenhados ou gravados em objetos ou em sua pele, tornando-os invisíveis para outras pessoas além de você mesmo. Além disso, quando lança um ritual, pode gastar +2 PE para lançá-lo sem usar componentes ritualísticos e sem gesticular (o que permite conjurar um ritual com as mãos presas), usando apenas concentração. Outros seres só perceberão que você lançou um ritual se passarem num teste de Ocultismo (DT 25)."
        },

        {
            "nome": "Consumo Prolongado",
            "preRequisito": null,
            "descricao": "Você passa a poder obter os efeitos de um catalisador comum em até dois rituais antes do item se desfazer. Além disso, pode gastar seus componentes ritualísticos para utilizá-los como um catalisador improvisado."
        },

        {
            "nome": "Criar Selo",
            "preRequisito": null,
            "descricao": "Você sabe fabricar selos paranormais de rituais que conheça (veja a página 151). Fabricar um selo gasta uma ação de interlúdio e um número de PE iguais ao custo de conjurar o ritual. Você pode ter um número máximo de selos criados ao mesmo tempo igual à sua Presença."
        },

        {
            "nome": "Envolto em Mistério",
            "preRequisito": null,
            "descricao": "Sua aparência e postura assombrosas o permitem manipular e assustar pessoas ignorantes ou supersticiosas. O mestre define o que exatamente você pode fazer e quem se encaixa nessa descrição. Como regra geral, você recebe +5 em Enganação e Intimidação contra pessoas não treinadas em Ocultismo."
        },

        {
            "nome": "Especialista em Elemento",
            "preRequisito": null,
            "descricao": "Escolha um elemento. A DT para resistir aos seus rituais desse elemento aumenta em +2."
        },

        {
            "nome": "Ferramentas Paranormais",
            "preRequisito": null,
            "descricao": "Você reduz a categoria de um item paranormal em I e pode ativar itens paranormais sem pagar seu custo em PE."
        },

        {
            "nome": "Fluxo de Poder",
            "preRequisito": "NEX 60%",
            "descricao": "Você pode manter dois efeitos sustentados de rituais ativos ao mesmo tempo com apenas uma ação livre, pagando o custo de cada efeito separadamente."
        },

        {
            "nome": "Fortalecimento Ritualístico",
            "preRequisito": "NEX 25%, INT 2",
            "descricao": "Você soma seu Intelecto na DT dos seus rituais."
        },

        {
            "nome": "Guiado pelo Paranormal",
            "preRequisito": null,
            "descricao": "Uma vez por cena, você pode gastar 2 PE para fazer uma ação de investigação adicional."
        },

        {
            "nome": "Guerrilheiro Paranormal",
            "preRequisito": null,
            "descricao": "Ao conjurar o ritual Amaldiçoar Arma em uma arma tática, pode usá-la como se fosse proficiente com ela até o fim do ritual."
        },

        {
            "nome": "Identificação Paranormal",
            "preRequisito": null,
            "descricao": "Você recebe +10 em testes de Ocultismo para identificar criaturas, objetos ou rituais."
        },

        {
            "nome": "Improvisar Componentes",
            "preRequisito": null,
            "descricao": "Uma vez por cena, você pode gastar uma ação completa para fazer um teste de Investigação (DT 15). Se passar, encontra objetos que podem servir como componentes ritualísticos de um elemento à sua escolha. O mestre define se é possível usar esse poder na cena atual."
        },

        {
            "nome": "Intuição Paranormal",
            "preRequisito": null,
            "descricao": "Sempre que usa a ação facilitar investigação, você soma seu Intelecto ou Presença no teste (à sua escolha)."
        },

        {
            "nome": "Maldição Protetora",
            "preRequisito": null,
            "descricao": "Caso esteja usando um item amaldiçoado, você soma sua Presença ou Intelecto na sua Defesa."
        },

        {
            "nome": "Manobra Rochosa",
            "preRequisito": null,
            "descricao": "Ao conjurar Transfigurar Terra, você pode gastar 2 PE para realizar qualquer manobra que não seja quebrar no oponente afetado."
        },

        {
            "nome": "Mestre em Elemento",
            "preRequisito": "Especialista em Elemento no elemento escolhido, NEX 45%",
            "descricao": "Escolha um elemento. O custo para lançar rituais desse elemento diminui em –1 PE."
        },

        {
            "nome": "Ritual Intenso",
            "preRequisito": "INT 2 ou PRE 2",
            "descricao": "Você soma sua Presença ou Intelecto nas rolagens de dano e de cura dos seus rituais."
        },

        {
            "nome": "Ritual Potente",
            "preRequisito": "INT 2",
            "descricao": "Você soma seu Intelecto nas rolagens de dano ou nos efeitos de cura de seus rituais."
        },

        {
            "nome": "Ritual Predileto",
            "preRequisito": null,
            "descricao": "Escolha um ritual que você conhece. Você reduz em –1 PE o custo do ritual. Essa redução se acumula com reduções fornecidas por outras fontes."
        },

        {
            "nome": "Tática Paranormal",
            "preRequisito": null,
            "descricao": "Você recebe +2 em testes de ataque para cada ser sob efeito de um ritual seu."
        },

        {
            "nome": "Tatuagem Ritualística",
            "preRequisito": null,
            "descricao": "Símbolos marcados em sua pele reduzem em –1 PE o custo de rituais de alcance pessoal que têm você como alvo."
        },

        {
            "nome": "Transcender",
            "preRequisito": null,
            "descricao": "Escolha um poder paranormal (veja a página 114). Você recebe o poder escolhido, mas não ganha Sanidade neste aumento de NEX. Você pode escolher este poder várias vezes."
        },

        {
            "nome": "Treinamento em Perícia",
            "preRequisito": null,
            "descricao": "Escolha duas perícias. Você se torna treinado nessas perícias. A partir de NEX 35%, você pode escolher perícias nas quais já é treinado para se tornar veterano. A partir de NEX 70%, pode escolher perícias nas quais já é veterano para se tornar expert. Você pode escolher este poder várias vezes."
        }
        ],

    trilhas: [
      {
        id: "arauto",
        nome: "Arauto",
        descricao: "Canal direto para o Outro Lado, carregando parte de seu poder na própria voz e presença.",
        poderes: [
          { nex: 10, nome: "Sussurros do Além", descricao: "Pode gastar 1 PE para ouvir um sussurro do Outro Lado com uma pista sobre a cena atual." },
          { nex: 40, nome: "Presença Perturbadora", descricao: "Inimigos em alcance curto sofrem -2 em testes de Vontade contra seus rituais." },
          { nex: 65, nome: "Voz do Outro Lado", descricao: "Pode conjurar um ritual conhecido sem gastar PE, uma vez por sessão." },
          { nex: 99, nome: "Avatar Paranormal", descricao: "Por uma cena, todos os seus rituais custam metade do PE normal." },
        ],
      },
      {
        id: "cientista-oculto",
        nome: "Cientista Oculto",
        descricao: "Estuda o paranormal com método e precisão, tratando o Outro Lado como um objeto de pesquisa.",
        poderes: [
          { nex: 10, nome: "Análise Paranormal", descricao: "Pode gastar 2 PE para descobrir uma fraqueza de uma entidade paranormal observada." },
          { nex: 40, nome: "Improviso Ritualístico", descricao: "Pode substituir componentes materiais de um ritual por um teste de Ciências (DT 20)." },
          { nex: 65, nome: "Catalisador", descricao: "Uma vez por cena, pode dobrar a duração de um ritual conjurado." },
          { nex: 99, nome: "Compreensão Total", descricao: "Conhece automaticamente qualquer ritual de círculo 1 ou 2 que encontrar." },
        ],
      },
    ],
  },

  /* ------------------------------------------------------------------------
     SOBREVIVENTE (homebrew) — classe "mundana" para personagens em NEX 0%.
     nexBase: 0  → diz ao app.js que os valores de "base" desta classe já
     correspondem ao NEX 0%, e não ao NEX 5% como nas outras 3 classes.
     escalaAtributoPorNex: false → nas outras classes, cada aumento de NEX
     soma DE NOVO o atributo (Vigor/Presença) ao PV/PE, além do valor fixo
     "porNex" (assim funciona o livro para Combatente/Especialista/Ocultista).
     Na sua homebrew de Sobrevivente, o texto diz só "+2 PV" e "+1 PE" por
     estágio, sem somar o atributo de novo — por isso este flag desliga
     esse comportamento só para esta classe.
     ------------------------------------------------------------------------ */
  sobrevivente: {
    nome: "Sobrevivente",
    mundano: true,   // classe "mundana": usa Estágio (1–5) em vez de NEX%, e é travada em nexMax até o jogador fazer Treinamento Especial (trocar de classe)
    nexMax: 20,       // último estágio (5) = NEX 20% internamente
    nexBase: 0,
    escalaAtributoPorNex: false,
    resumo: "Uma pessoa comum, com uma ocupação regular — mas essa normalidade não vai durar muito.",
    pv: { base: 10, porNex: 2 },   // PV inicial = 10+VIGOR; a cada estágio +2
    pe: { base: 4, porNex: 1 },    // PE inicial = 4+PRESENÇA; a cada estágio +1
    san: { base: 10, porNex: 2 },  // SAN inicial = 10; a cada estágio +2
    proficiencias: "Nenhuma proficiência especial (a menos que a origem conceda alguma).",
    periciasIniciaisTexto: "2 + Intelecto perícias à escolha. Além disso, todo Sobrevivente escolhe uma das habilidades gerais abaixo (na aba Habilidades) e começa com um Poder Geral.",

    tabelaNex: [
      { nex: 0,  tipo: "fixo",   texto: "Estágio 1 — Empenho: gaste 1 PE para receber +2 em um teste de perícia." },
      { nex: 5,  tipo: "trilha", texto: "Estágio 2 — Escolha uma trilha (Durão, Esperto ou Esotérico) e recebe o 1º poder dela." },
      { nex: 10, tipo: "fixo",   texto: "Estágio 3 — Aumento de Atributo: +1 em um atributo à escolha (não pode passar de 3 por este método)." },
      { nex: 15, tipo: "trilha", texto: "Estágio 4 — Recebe o 2º (e último) poder da trilha escolhida." },
      { nex: 20, tipo: "fixo",   texto: "Estágio 5 — Cicatrizado: escolha um elemento de perigo paranormal já enfrentado; sofre –O em resistência contra ele, mas 1x/sessão pode sacrificar 1 PV perm. para ignorar dano mental/gasto de PE, ou 1 PE perm. para reduzir dano físico à metade." },
    ],

    // "Poder Geral" inicial (escolha 1) + Poder Geral mundano avulso — usados
    // através do mesmo seletor de poderes de classe da aba Habilidades.
    poderes: [
      { nome: "Saúde Aprimorada", preRequisito: null, descricao: "Habilidade inicial (escolha 1 entre as 4). Você recebe +5 PV iniciais." },
      { nome: "Sanidade Aprimorada", preRequisito: null, descricao: "Habilidade inicial (escolha 1 entre as 4). Você recebe +5 SAN iniciais." },
      { nome: "Esforço Aprimorado", preRequisito: null, descricao: "Habilidade inicial (escolha 1 entre as 4). Você recebe +5 PE iniciais." },
      { nome: "Treinamento Aprimorado", preRequisito: null, descricao: "Habilidade inicial (escolha 1 entre as 4). Você recebe uma quantidade de perícias treinadas igual ao seu Intelecto." },
    ],

    trilhas: [
      {
        id: "durao",
        nome: "Durão",
        descricao: "Um indivíduo resistente, que consegue defender a si mesmo ou aos outros em situações de perigo — atleta, segurança, trabalhador da construção civil etc.",
        // pvBonusPorEstagio: bônus de PV fixo concedido por esta trilha, somado
        // por cima da progressão normal da classe, acumulado conforme o
        // Estágio atual (chaves = nº do Estágio, valores = PV ganho naquele
        // Estágio). Aqui: +4 PV ao entrar no Estágio 2 (quando escolhe a
        // trilha) e mais +2 PV ao chegar no Estágio 3 — não tem relação com
        // NEX real, é só a numeração do Estágio (1 a 5) do Sobrevivente.
        pvBonusPorEstagio: { 2: 4, 3: 2 },
        poderes: [
          { nex: 5,  nome: "Durão", descricao: "Você recebe +4 PV. Quando subir para o 3º estágio, recebe +2 PV adicionais." },
          { nex: 15, nome: "Pancada Forte", descricao: "Quando faz um ataque, pode gastar 1 PE para receber +O no teste de ataque. Se se tornar um combatente, perde esta habilidade, mas reduz o custo de ativação de Ataque Especial em –1 PE." },
        ],
      },
      {
        id: "esperto",
        nome: "Esperto",
        descricao: "Estudante, técnico, engenheiro ou outra pessoa equipada com conhecimento, inteligência e persuasão.",
        poderes: [
          { nex: 5,  nome: "Esperto", descricao: "Você se torna treinado em uma perícia adicional à sua escolha." },
          { nex: 15, nome: "Entendido", descricao: "Escolha duas perícias treinadas (exceto Luta e Pontaria). Ao testar uma delas, pode gastar 1 PE para somar +1d4 no resultado. Se se tornar um especialista, perde esta habilidade, mas reduz o custo de ativação de Perito em –1 PE." },
        ],
      },
      {
        id: "esoterico",
        nome: "Esotérico",
        descricao: "Uma pessoa ligada a aspectos espirituais do mundo (religiões, astrologia, cartomancia) ou que possui um sexto sentido em relação ao paranormal e ao Outro Lado.",
        // pvSubstituiProgressao: nerf desta trilha — em vez de ganhar o PV
        // normal de estágio da classe (+2 por Estágio, escalando com todos os
        // Estágios), o Esotérico ganha só +1 PV fixo ao entrar no Estágio 2 e
        // +1 PV fixo ao entrar no Estágio 5 (chaves = nº do Estágio). Isso
        // SUBSTITUI totalmente a progressão normal de PV da classe, só para
        // quem está nesta trilha.
        pvSubstituiProgressao: { 2: 1, 5: 1 },
        poderes: [
          { nex: 5,  nome: "Esotérico", descricao: "Pode gastar uma ação padrão e 1 PE para sentir energias paranormais em alcance curto. O mestre dirá quais informações você consegue obter, se houver." },
          { nex: 15, nome: "Iniciado", descricao: "Você aprende e pode conjurar um ritual de 1º círculo à sua escolha. Se se tornar um ocultista, soma este ritual aos três que aprende com Escolhido pelo Outro Lado." },
        ],
      },
    ],
  },
};


/* --------------------------------------------------------------------------
   5. PODERES PARANORMAIS (obtidos ao Transcender / poder de ocultista, custam Sanidade)
   -------------------------------------------------------------------------- */
const PODERES_PARANORMAIS = [
  {
    "nome": "Adrenalina",
    "elemento": "Sangue",
    "custoSAN": null,
    "descricao": "A dor de ter sua carne machucada de forma extrema lhe deixa eufórico. Você recebe 1 PE temporário toda vez que sofre dano de corte ou perfuração.\nAfinidade: Você passa a receber 1 PE temporário e 1 PV temporário toda vez que é alvo de qualquer dano físico que te acerte, mesmo que tenha reduzido esse dano a zero.\nPré-requisito:  Sangue 1."
  },
  {
    "nome": "Anatomia Insana",
    "elemento": "Sangue",
    "custoSAN": null,
    "descricao": "O seu corpo é transfigurado e parece desenvolver um instinto próprio separado da sua consciência. Você tem 50% de chance (resultado par em 1d4) de ignorar o dano adicional de um acerto crítico ou ataque furtivo.\nPré-requisito: Sangue 2.\nAfinidade: você é imune aos efeitos de acertos críticos e ataques furtivos."
  },
  {
    "nome": "Arma de Sangue",
    "elemento": "Sangue",
    "custoSAN": null,
    "descricao": "O Sangue devora parte de seu corpo e se manifesta como parte de você. Você pode gastar uma ação de movimento e 2 PD para produzir garras, chifres ou uma lâmina de sangue cristalizado que brota de seu antebraço. Qualquer que seja sua escolha, é considerada uma arma simples, corpo a corpo e leve, que você não precisa empunhar e causa 1d10 pontos de dano de Sangue, que aumenta para 1d12+2 quando estiver machucado, com crítico 20/x2. Uma vez por turno, quando você usa a ação agredir, pode gastar 1 PE para fazer um ataque adicional com essa arma, ou pode gastar 2 PE para recuperar PVs equivalentes ao dano dado. Essas duas habilidades podem ser usadas em conjunto.  A arma dura até o final da cena, e então se desfaz numa poça de sangue coagulado.\nAfinidade: A arma se torna permanentemente parte de você. O crítico se torna 18, o dano base aumenta para 1d12+2, e quando estiver machucado o dano base aumenta para 2d10+1. Ao acertar um ataque, você pode gastar 2 PE para fincar a arma de sangue no alvo, que, após uma rodada, explode em sangue, causando 4d8 de dano de Sangue. Após usar essa habilidade, a arma entra em estado de regeneração e não pode ser usada por 2 rodadas."
  },
  {
    "nome": "Armadura Viva",
    "elemento": "Sangue",
    "custoSAN": null,
    "descricao": "Camadas de quitina surgem logo abaixo da última cada da sua pele, tornando-a grossa e rígida, e a sua pele se torna parecida como uma armadura. Você recebe RD 2 para dano físico, aumentando em +1 para cada poder paranormal de Sangue que tiver.\nAfinidade: A RD aumenta para 5."
  },
  {
    "nome": "Carapaça Espinhenta",
    "elemento": "Sangue",
    "custoSAN": null,
    "descricao": "Uma vez por cena, quando for o alvo de um ataque corpo a corpo, você pode gastar uma reação defensiva e 5 PVs para invocar espinhos que saem de sua pele e perfuram o atacante, fazendo com que ele receba metade do dano físico total causado a você na cena como dano de Sangue. Você pode escolher deixar o alvo agarrado nos seus espinhos durante uma rodada, à sua escolha.\nAfinidade: Você pode usar essa reação múltiplas vezes por cena. No entanto, em vez do normal, o alvo passa a sofrer metade do dano que ele causa no ataque à você."
  },
  {
    "nome": "Espreitar da Besta",
    "elemento": "Sangue",
    "custoSAN": null,
    "descricao": "O Sangue do Outro Lado deu a você o poder de controlar seu corpo e se mover exatamente como as bestas predadoras fazem. Você recebe +5 em Furtividade. Em cenas de perseguição (p. 90), se for o caçador, pode usar Furtividade em vez de Atletismo. Em cenas de furtividade (p. 92), seus movimentos são calculados pelos seus instintos, o que permite que faça ações discretas sem sofrer –O de penalidade.\nAfinidade: o bônus em Furtividade aumenta para +10."
  },
  {
    "nome": "Instintos Sanguinários",
    "elemento": "Sangue",
    "custoSAN": null,
    "descricao": "Ao se conectar com o Sangue do Outro Lado, você desperta instintos animalescos paranormais. Você recebe visão no escuro e faro.\nAfinidade: seus instintos aguçados transformam o terror da perseguição em uma tempestade viciante de adrenalina. Você não pode mais ser flanqueado, não fica desprevenido e recebe +5 em testes de resistência contra armadilhas da realidade ou paranormais."
  },
  {
    "nome": "Sangue de Ferro",
    "elemento": "Sangue",
    "custoSAN": null,
    "descricao": "O seu sangue flui de forma paranormal e agressiva, concedendo vigor não natural. Você recebe +2 pontos de vida por NEX. Quando sobe de NEX, os PV que recebe por este poder aumentam de acordo. Por exemplo, se escolher este poder em NEX 50%, recebe 20 PV. Quando subir para NEX 55%, recebe +2 PV, e assim por diante.\nAfinidade: você recebe +5 em Fortitude e se torna imune a venenos e doenças."
  },
  {
    "nome": "Sangue Fervente",
    "elemento": "Sangue",
    "custoSAN": null,
    "descricao": "A intensidade da dor desperta em você sentimentos bestiais e prazerosos que você nem imaginava que existiam. Enquanto estiver machucado, você recebe +1 em Agilidade ou Força, à sua escolha (escolha sempre que este efeito for ativado).\nPré-requisito: Sangue 2.\nAfinidade: o bônus que você recebe em Agilidade ou Força aumenta para +2."
  },
  {
    "nome": "Sangue Prazeroso",
    "elemento": "Sangue",
    "custoSAN": null,
    "descricao": "Sua conexão com o Sangue permite que você resista a dor apenas para que consiga sentir ela por mais tempo. Enquanto estiver machucado, você recebe resistência a dano 5.\nAfinidade: Na primeira vez que entrar no estado de machucado em uma cena, você recebe +20 PV temporários até o fim da cena.\nPré-requisito:  Sangue 1."
  },
  {
    "nome": "Sangue Vivo",
    "elemento": "Sangue",
    "custoSAN": null,
    "descricao": "A carnificina não pode parar, o Sangue precisa continuar fluindo. Na primeira vez que ficar machucado durante uma cena, você recebe cura acelerada 2 (veja a página 179). Esse efeito nunca cura você acima da metade dos PV máximos (ou seja, você nunca deixa de estar machucado) e termina no fim da cena ou caso você perca a condição machucado.\nPré-requisito: Sangue 1.\nAfinidade: a cura acelerada aumenta para 5."
  },
  {
    "nome": "Absorver Conhecimento",
    "elemento": "Conhecimento",
    "custoSAN": null,
    "descricao": "Você se conecta com o Conhecimento do Outro Lado para adquirir informação de forma paranormal, sem precisar gastar tempo de pesquisa. Se estiver empunhando uma fonte de conhecimento escrito (como um livro, um texto aberto em um celular ou uma pedra de runas), você pode gastar 1 PE e uma ação completa para fazer uma pergunta a esta fonte. Se a resposta estiver armazenada na fonte, você a obtém automaticamente. Se usar este poder em conjunto com a ação de interlúdio ler, você aumenta o dado de bônus recebido por esta ação em um passo (de d6 para 1d8, por exemplo).\nAfinidade: quando usa um ritual de Conhecimento que tenha como alvo 1 pessoa (exceto você), se puder tocar o alvo o custo desse ritual é reduzido em –1 PE."
  },
  {
    "nome": "Apatia Herege",
    "elemento": "Conhecimento",
    "custoSAN": null,
    "descricao": "Saber tudo é perder tudo. Contudo, não se deve subestimar a capacidade de adaptação humana. Ao se conectar com o Conhecimento do Outro Lado, você usa as experiências grotescas que já viveu para desligar suas emoções e blindar sua mente. Quando faz um teste contra uma condição de medo, você pode gastar 2 PE para rolar o teste novamente. Você deve aceitar o resultado da segunda rolagem, mesmo que seja menor que a primeira.\nPré-requisito: Conhecimento 1.\nAfinidade: você pode usar esse poder depois de saber se passou no teste, além de poder escolher a melhor rolagem entre as duas."
  },
  {
    "nome": "Expansão de Conhecimento",
    "elemento": "Conhecimento",
    "custoSAN": null,
    "descricao": "Você se conecta com o Conhecimento do Outro Lado, rompendo os limites de sua compreensão. Você aprende um poder de classe que não pertença à sua classe (caso o poder possua pré-requisitos, você precisa preenchê-los).\nPré-requisito: Conhecimento 1.\nAfinidade: você aprende um segundo poder de classe que não pertença à sua classe."
  },
  {
    "nome": "Faça Eles Sentirem",
    "elemento": "Conhecimento",
    "custoSAN": null,
    "descricao": "Eles que deviam estar sofrendo o que você sofreu. Uma vez por cena, você escolhe um alvo para sofrer dano de Conhecimento igual à sua perda de Sanidade (máxima - atual).\nAfinidade: Você pode usar esse poder duas vezes por cena."
  },
  {
    "nome": "Infecção Gnóstica",
    "elemento": "Conhecimento",
    "custoSAN": null,
    "descricao": "Você absorve o sofrimento daqueles ao seu ao redor. Para cada ser na cena que ficar Perturbado, Enlouquecendo ou Insano, você recebe um bônus de 1d4+1 de dano de Conhecimento, com limite de dados igual à sua Presença ou Intelecto, oque for maior.\nAfinidade: Você passa a receber +1d6 de dano de Conhecimento em seus ataques a cada 5 pontos de dano mental sofridos em uma cena."
  },
  {
    "nome": "Percepção Paranormal",
    "elemento": "Conhecimento",
    "custoSAN": null,
    "descricao": "O Conhecimento sussurra em sua mente. Em cenas de investigação, sempre que fizer um teste para procurar pistas, você pode rolar novamente um dado com resultado menor que 10. Você deve aceitar a segunda rolagem, mesmo que seja menor que a primeira.\nAfinidade: você pode rolar novamente até dois dados com resultado menor que 10."
  },
  {
    "nome": "Precognição",
    "elemento": "Conhecimento",
    "custoSAN": null,
    "descricao": "Você possui um “sexto sentido” que o avisa do perigo antes que ele aconteça. Você recebe +5 em Defesa e em testes de resistência.\nAfinidade: Você fica imune à condição desprevenido."
  },
  {
    "nome": "Sensitivo",
    "elemento": "Conhecimento",
    "custoSAN": null,
    "descricao": "Você consegue sentir as emoções e intenções de outros seres, como medo, raiva ou malícia, recebendo +5 em testes de Diplomacia, Intimidação e Intuição.\nAfinidade: quando você faz um teste oposto usando uma dessas perícias, o oponente sofre –O."
  },
  {
    "nome": "Versatilidade Amplificada",
    "elemento": "Conhecimento",
    "custoSAN": null,
    "descricao": "Você avança um nível de trilha OU escolhe uma terceira trilha para seu personagem, à sua escolha."
  },
  {
    "nome": "Visão do Oculto",
    "elemento": "Conhecimento",
    "custoSAN": null,
    "descricao": "Você não enxerga mais pelos olhos, mas sim pela percepção do Conhecimento em sua mente. Você recebe +5 em testes de Percepção e enxerga no escuro.\nAfinidade: você ignora camuflagem."
  },
  {
    "nome": "Afortunado",
    "elemento": "Energia",
    "custoSAN": null,
    "descricao": "A Energia considera resultados medíocres entediantes. Uma vez por rolagem, você pode rolar novamente um resultado 1 em qualquer dado que não seja d20.\nAfinidade: além disso, uma vez por teste, você pode rolar novamente um resultado 1 em d20."
  },
  {
    "nome": "Campo Protetor",
    "elemento": "Energia",
    "custoSAN": null,
    "descricao": "Você consegue gerar um campo de Energia que o protege de perigos. Quando usa a ação esquiva, você pode gastar 1 PE para receber +5 em Defesa.\nPré-requisito: Energia 1.\nAfinidade: quando usa este poder, você também recebe +5 em Reflexo e, até o início de seu próximo turno, se passar em um teste de Reflexo que reduziria o dano à metade, em vez disso não sofre nenhum dano."
  },
  {
    "nome": "Causalidade Fortuita",
    "elemento": "Energia",
    "custoSAN": null,
    "descricao": "A Energia o conduz rumo a descobertas. Em cenas de investigação, a DT para procurar pistas diminui em –5 para você até você encontrar uma pista.\nAfinidade: a DT para procurar pistas sempre diminui em –5 para você."
  },
  {
    "nome": "Conexão Empática",
    "elemento": "Energia",
    "custoSAN": null,
    "descricao": "Você consegue usar a Energia do Outro Lado para se conectar com objetos tecnológicos energizados. Você pode gastar uma ação completa e 2 PE para tocar um objeto elétrico que esteja ligado, como um celular, uma batedeira ou uma máquina de lavar roupa. Até o fim da cena, ou até deixar de tocá-lo, você pode conversar com o objeto como se ele fosse um ser senciente, e de algum jeito consegue escutar respostas. Um objeto tem percepção limitada de seus arredores, e sua personalidade e memórias são definidas apenas pelos arquivos ou programas que contém registrado em si; um objeto não tem lembranças do que ocorreu em seus arredores a não ser que tenha uma câmera e arquivos de vídeo em seu sistema, por exemplo. O objeto possui uma atitude inicial indiferente, mas pode ser persuadido com testes de Diplomacia (objetos normalmente têm Vontade 1, mas objetos particularmente sofisticados ou protegidos podem ter Vontade 2 ou 3, a critério do mestre). Apenas você é capaz de “ouvir” o objeto e precisa falar em voz alta para que ele te “escute”. Quando o efeito termina, o item emite um lamento enquanto experimenta uma sensação traumática de morte; se você tentar falar novamente com ele, sua atitude será hostil devido ao sofrimento ao qual foi exposto.\nPré-requisito: Energia 1.\nAfinidade: você recebe +5 em testes de perícias baseadas em Intelecto ou Presença com o item."
  },
  {
    "nome": "Fotossíntese",
    "elemento": "Energia",
    "custoSAN": null,
    "descricao": "Sua pele passa a canalizar fontes de energia que o sustentam de pé. Ao estar exposto a uma fonte de sol ou o ritual Luz, você recebe cura acelerada 1.\nAfinidade: Seu corpo passa a se nutrir majoritariamente por luz solar. A cura acelerada sob o efeito de Fotossíntese aumenta para 2. Além disso, você demora mais para sofrer efeitos de fome e sono caso tenha se exposto ao sol nesse dia - mecanicamente, você tem direito aos efeitos de uma ação de Interlúdio à sua escolha entre Alimentar-se, Dormir e Relaxar durante longos períodos de exposição ao sol como em uma viagem, mesmo que não tenha parado para descansar."
  },
  {
    "nome": "Golpe de Sorte",
    "elemento": "Energia",
    "custoSAN": null,
    "descricao": "Seus ataques recebem +1 na margem de ameaça.\nPré-requisito: Energia 1.\nAfinidade: seus ataques recebem +1 no multiplicador de crítico."
  },
  {
    "nome": "Inércia",
    "elemento": "Energia",
    "custoSAN": null,
    "descricao": "Quando as forças da Energia agem sobre um ser, é improvável que ele fique parado. Seu deslocamento aumenta em 3 metros.\nAfinidade: Ganha +1.5 metros, totalizando 4.5m."
  },
  {
    "nome": "Manipular Entropia",
    "elemento": "Energia",
    "custoSAN": null,
    "descricao": "Nada diverte mais a Energia do que a possibilidade de um desastre ainda maior. Quando outro ser em alcance curto faz um teste de perícia, você pode gastar 2 PE para fazê-lo rolar novamente um dos dados desse teste.\nPré-requisito: Energia 1.\nAfinidade: o alvo rola novamente todos os dados que você escolher."
  },
  {
    "nome": "Mão Espectral",
    "elemento": "Energia",
    "custoSAN": null,
    "descricao": "A energia te concede um novo amigo, uma mão fantasmagórica que parece ter consciência própria. A mão se torna parte de você permanentemente e pode realizar suas próprias ações a vontade dela. Você pode esconder e mostrar ela como ação livre, de acordo com o humor da mão, além de poder agarrar objetos em até 3m de distância. Em termos de regras, você ganha uma mão livre extra. A mão não tem voz e se comunica através de gestos.\nAfinidade: Você também recebe +2 de Percepção e Defesa.\nEsse poder também pode ser um poder paranormal de Conhecimento."
  },
  {
    "nome": "Presságio",
    "elemento": "Energia",
    "custoSAN": null,
    "descricao": "Você sente a ramificação no destino quando suas ações criam novas possibilidades, como um “sexto sentido”. Toda vez que você fizer uma ação drástica ou arriscada que muda completamente a história de uma sessão, você é recompensado pela Energia e recebe +1d20 para “guardar” que pode ser usado em qualquer teste à sua escolha. Esse bônus é cumulativo e deve ser separado entre testes; ou seja, caso ative o gatilho e ainda não tenha usado o +1d20, você recebe +1d20 adicional. Você pode ter um máximo de d20 acumulados igual a sua Presença ou igual a quantidade de Poderes Paranormais de Energia que você tiver, o que for maior.\nAfinidade: O bônus aumenta para +2d20."
  },
  {
    "nome": "Valer-se do Caos",
    "elemento": "Energia",
    "custoSAN": null,
    "descricao": "Você pode tentar manipular o caos do mundo ao seu redor, um ato que fornece grande poder às custas da ordem de sua mente. Quando faz um teste, você pode escolher tentar controlar o caos. Se fizer isso, você recebe +O nesse teste. Entretanto, se o teste for uma falha, ou se o resultado desse d20 adicional (use um dado de cor diferente para identificá-lo) for igual ou menor que 5, você perde 1d4 pontos de Sanidade.\nAfinidade: você perde Sanidade se o teste for uma falha ou se o resultado do O extra for 1 ou 2."
  },
{
    "nome": "Antecipar Vitalidade",
    "elemento": "Morte",
    "custoSAN": null,
    "descricao": "Sua ligação com a Morte permite que você sacrifique sua vitalidade futura para auxiliar seu presente. Quando faz um teste, você pode acumular uma carga de antecipação para adicionar +O a esse teste. Você pode acumular um máximo de cargas de antecipação igual ao seu Vigor. Enquanto tiver uma carga de antecipação, em sua próxima ação de interlúdio dormir em vez de recuperar pontos de vida você perde uma dessas cargas.\nAfinidade: você amplia sua capacidade de sacrificar o presente pelo futuro. O limite de cargas de antecipação que você pode acumular aumenta em +2 e você passa a perder 2 cargas por ação dormir."
  },
  {
    "nome": "Aura de Pavor",
    "elemento": "Morte",
    "custoSAN": null,
    "descricao": "Ao receber esse poder, você é tomado por uma aura de Morte que nunca mais o abandona. Do ponto de vista dos outros, é como se o mundo ao seu redor perdesse as cores e se tornasse mais opressor. Você pode gastar 2 PE e uma ação de movimento para deixar uma pessoa ou animal em alcance médio apavorado (Vontade DT Pre reduz para abalado). O alvo não precisa ser capaz de ver você. Esta condição termina ao fim da cena, se o alvo se afastar de você além de alcance médio ou se você usar este efeito em outro alvo. Uma mesma pessoa ou animal só pode sofrer o efeito deste poder uma vez por dia.\nAfinidade: a DT para resistir ao poder aumenta em +5 e o número de alvos muda para quaisquer pessoas ou animais escolhidos no alcance."
  },
  {
    "nome": "Consumir Entropia",
    "elemento": "Morte",
    "custoSAN": null,
    "descricao": "A Morte sussurra nos espaços entre os segundos, e você aprendeu a beber do desgaste inevitável do mundo. Oportunidades premeditadas e vidas desperdiçadas; você não vai deixar elas irem em vão. Sempre que um ser é finalizado em alcance curto, você absorve seu tempo desperdiçado, recuperando metade dos seus PVs máximos ou 2d8 PEs, à sua escolha.\nAfinidade: Quando esse poder é ativado, você também passa a recuperar uma ação padrão naquele turno."
  },
  {
    "nome": "Curado pelo Tempo",
    "elemento": "Morte",
    "custoSAN": null,
    "descricao": "Não há nada que o tempo não cura. Uma vez por cena, você pode gastar uma ação padrão para se concentrar na espiral infinita da Morte na sua mente, removendo todas as condições negativas que você esteja sobre efeito (exceto enlouquecendo, morrendo, perturbado e machucado).\nAfinidade: Muda para duas vezes por cena.\nPré-requisito: Morte 1."
  },
  {
    "nome": "Encarar a Morte",
    "elemento": "Morte",
    "custoSAN": null,
    "descricao": "Sua conexão com a Morte faz com que você não hesite em situações de perigo. Durante cenas de ação, seu limite de gasto de PE aumenta em +1 (isso não afeta a DT de seus efeitos).\nAfinidade: durante cenas de ação, seu limite de gasto de PE aumenta em +2 (para um total de +3)."
  },
  {
    "nome": "Escapar da Morte",
    "elemento": "Morte",
    "custoSAN": null,
    "descricao": "A Morte tem um interesse especial em sua caminhada. Uma vez por cena, quando receber dano que o deixaria com 0 PV, você fica com 1 PV. Não funciona em caso de dano massivo.\nPré-requisito: Morte 1.\nAfinidade: em vez do normal, você evita completamente o dano. Em caso de dano massivo, você fica com 1 PV."
  },
  {
    "nome": "Potencial Aprimorado",
    "elemento": "Morte",
    "custoSAN": null,
    "descricao": "A Morte lhe concede potencial latente de momentos roubados de outro lugar. Você recebe +1 ponto de esforço por NEX. Quando sobe de NEX, os PE que recebe por este poder aumentam de acordo. Por exemplo, se escolher este poder em NEX 30%, recebe 6 PE. Quando subir para NEX 35%, recebe +1 PE adicional, e assim por diante.\nAfinidade: você recebe +1 PE adicional por NEX (para um total de +2 PE por NEX)."
  },
  {
    "nome": "Potencial Reaproveitado",
    "elemento": "Morte",
    "custoSAN": null,
    "descricao": "Você absorve os momentos desperdiçados de outros seres. Uma vez por rodada, quando passa num teste de resistência, você ganha 2 PE temporários cumulativos. Os pontos desaparecem no final da cena.\nAfinidade: você ganha 3 PE temporários, em vez de 2."
  },
  {
    "nome": "Surto Temporal",
    "elemento": "Morte",
    "custoSAN": null,
    "descricao": "A sua percepção temporal se torna distorcida e espiralizada, fazendo com que a noção de passagem do tempo nunca mais seja a mesma para você. Uma vez por cena, durante seu turno, você pode gastar 3 PE para realizar uma ação padrão adicional.\nPré-requisito: Morte 2.\nAfinidade: em vez de uma vez por cena, você pode usar este poder uma vez por turno."
  },
  {
    "nome": "Tempo Aproveitado",
    "elemento": "Morte",
    "custoSAN": null,
    "descricao": "Você aproveita melhor cada segundo que passa na sua vida. Você recebe +1 ação em interlúdios.\nAfinidade: Você recebe +1 ação em interlúdios (totalizando +2). Além disso, relaxar recupera +2 pontos de Sanidade adicionais."
  }
];


/* --------------------------------------------------------------------------
   6. RITUAIS
   "elemento": Sangue, Morte, Conhecimento, Energia, Medo, Fúria (ajuste como preferir).
   "circulo": 1 a 4.
   "execucao": "ação padrão", "ação completa", "reação", "1 minuto"...
   -------------------------------------------------------------------------- */
const RITUAIS = [
  {
    id: "toque-sombrio",
    nome: "Toque Sombrio",
    elemento: "Morte",
    circulo: 1,
    custoPE: 2,
    execucao: "Ação padrão",
    alcance: "Toque",
    alvo: "1 criatura",
    duracao: "Instantânea",
    resistencia: "Fortitude reduz o dano à metade",
    descricao: "Você toca um alvo, causando 2d6 de dano de Morte.",
  },
  {
    id: "coincidencia-forcada",
    nome: "Coincidência Forçada",
    elemento: "Conhecimento",
    circulo: 1,
    custoPE: 2,
    execucao: "Ação padrão",
    alcance: "Pessoal",
    duracao: "1 cena",
    resistencia: "Nenhuma",
    descricao: "Pequenos eventos ao seu redor se alinham a seu favor; recebe +1d em um teste de perícia à sua escolha durante a cena.",
  },
  {
    id: "amaldicoar-arma",
    nome: "Amaldiçoar Arma",
    elemento: "Sangue",
    circulo: 1,
    custoPE: 3,
    execucao: "Ação padrão",
    alcance: "Toque",
    alvo: "1 arma",
    duracao: "1 cena",
    resistencia: "Nenhuma",
    descricao: "Uma arma se torna amaldiçoada, causando 1d6 de dano de Sangue adicional em acertos.",
  },
  {
    id: "forma-fantasmagorica",
    nome: "Forma Fantasmagórica",
    elemento: "Morte",
    circulo: 2,
    custoPE: 4,
    execucao: "Ação padrão",
    alcance: "Pessoal (e um alvo tocado)",
    duracao: "1 rodada / nível de circulo",
    resistencia: "Nenhuma",
    descricao: "Você e um alvo tocado se tornam incorpóreos, podendo atravessar obstáculos sólidos.",
  },
  {
    id: "chamas-do-abismo",
    nome: "Chamas do Abismo",
    elemento: "Energia",
    circulo: 2,
    custoPE: 5,
    execucao: "Ação padrão",
    alcance: "Curto (em área)",
    duracao: "Instantânea",
    resistencia: "Reflexos reduz o dano à metade",
    descricao: "Uma explosão de chamas negras atinge uma área curta, causando 4d6 de dano de Energia.",
  },
  {
    id: "grito-do-terror",
    nome: "Grito do Terror",
    elemento: "Medo",
    circulo: 2,
    custoPE: 4,
    execucao: "Ação padrão",
    alcance: "Curto (em área)",
    duracao: "1 cena",
    resistencia: "Vontade nega",
    descricao: "Alvos na área ficam Apavorados por uma cena, tendo que fugir da fonte do medo.",
  },
  {
    id: "vinculo-de-sangue",
    nome: "Vínculo de Sangue",
    elemento: "Sangue",
    circulo: 3,
    custoPE: 6,
    execucao: "1 minuto",
    alcance: "Toque",
    duracao: "24 horas",
    resistencia: "Vontade nega (alvo involuntário)",
    descricao: "Cria uma ligação com um alvo, permitindo sentir sua localização aproximada e estado geral de saúde.",
  },
  {
    id: "porta-para-o-alem",
    nome: "Porta para o Além",
    elemento: "Morte",
    circulo: 3,
    custoPE: 7,
    execucao: "Ação completa",
    alcance: "Curto",
    duracao: "1 rodada",
    resistencia: "Nenhuma",
    descricao: "Abre uma passagem temporária para o Outro Lado, permitindo teleportar seu grupo por um curto trajeto.",
  },
  {
    id: "mente-em-chamas",
    nome: "Mente em Chamas",
    elemento: "Energia",
    circulo: 3,
    custoPE: 6,
    execucao: "Ação padrão",
    alcance: "Médio",
    duracao: "Instantânea",
    resistencia: "Vontade reduz o dano à metade",
    descricao: "Ataca a mente de um alvo à distância, causando 6d6 de dano de Energia que ignora redução de dano física.",
  },
  {
    id: "colheita-de-almas",
    nome: "Colheita de Almas",
    elemento: "Morte",
    circulo: 4,
    custoPE: 9,
    execucao: "Ação completa",
    alcance: "Curto",
    duracao: "Instantânea",
    resistencia: "Fortitude nega",
    descricao: "Drena a força vital de um alvo, causando dano massivo e curando o conjurador em metade do dano causado.",
  },
  {
    id: "juizo-final",
    nome: "Juízo Final",
    elemento: "Fúria",
    circulo: 4,
    custoPE: 10,
    execucao: "Ação completa",
    alcance: "Longo (em área)",
    duracao: "Instantânea",
    resistencia: "Reflexos reduz o dano à metade",
    descricao: "Convoca uma manifestação violenta do Outro Lado sobre uma grande área, causando dano catastrófico.",
  },
  {
    id: "olhos-do-outro-lado",
    nome: "Olhos do Outro Lado",
    elemento: "Conhecimento",
    circulo: 4,
    custoPE: 8,
    execucao: "1 minuto",
    alcance: "Especial",
    duracao: "1 cena",
    resistencia: "Nenhuma",
    descricao: "Você enxerga através dos olhos de qualquer entidade paranormal que já tenha encontrado, em qualquer lugar do mundo.",
  },
];


/* --------------------------------------------------------------------------
   7. CONDIÇÕES (para a aba "Condições e Efeitos")
   -------------------------------------------------------------------------- */
const CONDICOES = [
  "Abalado", "Agarrado", "Apavorado", "Atordoado", "Caído", "Cego",
  "Confuso", "Desprevenido", "Enredado", "Exausto", "Fascinado",
  "Fatigado", "Ferimento Debilitante", "Enjoado", "Envenenado",
  "Imóvel", "Inconsciente", "Insano", "Surdo", "Vulnerável",
];


/* --------------------------------------------------------------------------
   COMO ADICIONAR CONTEÚDO — GUIA RÁPIDO
   --------------------------------------------------------------------------

   ➤ ADICIONAR UM RITUAL NOVO:
   Copie e cole dentro do array RITUAIS (item 6 acima), entre dois objetos
   existentes, e edite os valores:

     {
       id: "meu-ritual-novo",              // único, sem espaços/acentos
       nome: "Nome do Ritual",
       elemento: "Sangue",                 // Sangue, Morte, Conhecimento, Energia, Medo, Fúria...
       circulo: 2,                         // 1 a 4
       custoPE: 4,
       execucao: "Ação padrão",
       alcance: "Curto",
       duracao: "1 cena",
       resistencia: "Vontade nega",
       descricao: "Efeito do ritual aqui.",
     },

   ➤ ADICIONAR UMA ORIGEM NOVA:
   Copie e cole dentro do array ORIGENS (item 3):

     {
       id: "minha-origem",
       nome: "Nome da Origem",
       descricao: "Frase curta descrevendo a origem.",
       pericias: ["intuicao", "vontade"],   // ids de PERICIAS (veja item 2)
       poder: { nome: "Nome do Poder", descricao: "O que o poder faz." },
     },

   ➤ ADICIONAR UM PODER GERAL DE CLASSE (o "Poder de Combatente/Especialista/
     Ocultista" que o jogador escolhe nos NEX marcados como "escolha"):
   Vá até CLASSES.<classe>.poderes (item 4) e adicione:

     { nome: "Nome do Poder", preRequisito: "Ex: For 3", descricao: "O que faz." },

   Se não houver pré-requisito, use preRequisito: null.

   ➤ ADICIONAR UMA TRILHA NOVA (subclasse):
   Vá até CLASSES.<classe>.trilhas (item 4) e adicione um novo objeto de trilha:

     {
       id: "minha-trilha",
       nome: "Nome da Trilha",
       descricao: "Frase curta sobre o estilo da trilha.",
       poderes: [
         { nex: 10, nome: "Poder Inicial", descricao: "O que faz." },
         { nex: 40, nome: "Poder Intermediário", descricao: "O que faz." },
         { nex: 65, nome: "Poder Avançado", descricao: "O que faz." },
         { nex: 99, nome: "Poder Final", descricao: "O que faz." },
       ],
     },

   ➤ MUDAR A PROGRESSÃO DE UMA CLASSE (sua homebrew):
   Edite diretamente CLASSES.<classe>.tabelaNex (item 4). Cada linha é:

     { nex: 20, tipo: "fixo", texto: "O que o personagem ganha automaticamente." }
     { nex: 20, tipo: "escolha", texto: "Descrição — o jogador escolhe um poder da lista 'poderes'." }
     { nex: 20, tipo: "trilha", texto: "Descrição — o jogador escolhe um poder da trilha." }

   Você também pode mudar PV/PE/SAN base e por-NEX em CLASSES.<classe>.pv/pe/san.

   ➤ ADICIONAR UMA PERÍCIA NOVA (caso sua homebrew tenha uma):
   Copie e cole dentro do array PERICIAS (item 2):

     { id: "minha-pericia", nome: "Minha Perícia", atributo: "int" },

   Lembre-se: o "id" precisa ser único e é usado internamente; o "nome" é o
   que aparece na ficha.

   ========================================================================== */