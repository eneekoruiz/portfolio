import { Target, Code2, Zap, Users, BookOpen, Heart } from 'lucide-react';
import type { Lang, Tx, Val } from './types';

const VALS_ES: Val[] = [
  { icon: Target,   t: 'Orientado al detalle',    d: 'Los pequeños detalles separan lo bueno de lo memorable. Los noto antes de que nadie los pida.' },
  { icon: Code2,    t: 'Clean Code siempre',      d: 'El código que nadie puede leer en 6 meses es deuda técnica. Escribo para humanos.' },
  { icon: Zap,      t: 'Rendimiento como valor',  d: 'La velocidad es respeto. Cada milisegundo importa.' },
  { icon: Users,    t: 'Colaboración real',       d: 'Aprendo más en una sesión de pair programming que en una semana en solitario.' },
  { icon: BookOpen, t: 'Aprendizaje continuo',    d: 'La tecnología evoluciona cada semana. Dedico tiempo a entender por qué importa.' },
  { icon: Heart,    t: 'Resolución de problemas', d: 'Enfrento la complejidad con método. Un problema bien definido ya está medio resuelto.' },
];

const VALS_EN: Val[] = [
  { icon: Target,   t: 'Detail oriented',      d: 'Small details separate good from memorable. I notice them before anyone asks.' },
  { icon: Code2,    t: 'Clean Code always',    d: 'Code nobody can read in 6 months is technical debt. I write for humans.' },
  { icon: Zap,      t: 'Performance as value', d: 'Speed is respect. Every millisecond matters.' },
  { icon: Users,    t: 'Real collaboration',   d: 'I learn more in a pair programming session than a week alone.' },
  { icon: BookOpen, t: 'Lifelong learner',     d: 'Technology evolves every week. I spend time understanding why it matters.' },
  { icon: Heart,    t: 'Problem solving',      d: 'I face complexity with method. A well-defined problem is already half solved.' },
];

function mkTx(
  times: [string, string, string],
  iam: string,
  greetingFn: (t: string) => string,
  role: string,
  tagline: string,
  status: string,
  ctaWork: string,
  ctaContact: string,
  ctaCv: string,
  scroll: string,
  menu: string[],
  abLb: string,
  abH: string,
  mf: string,
  metrics: [string, string][],
  skH: string,
  woLb: string,
  woH: string,
  // Nuevas descripciones de proyectos
  projectWhoDesc: string,
  projectRidesDesc: string,
  projectServerDesc: string,
  ghLb: string,
  moreGh: string,
  loading: string,
  coLb: string,
  coH: string,
  coP: string,
  valLb: string,
  valH: string,
  vals: Val[],
  cmdPh: string,
  cmdLang: string,
  cmdNav: string,
  tabAway: string,
  tabBack: string,
  footerTech: string,
  footerSrc: string,
  printContact: string
): Tx {
  const hrefs = ['#hero', '#skills', '#work', '#about', '#contact'];
  return {
    times, iam, greetingFn, role, tagline, status, ctaWork, ctaContact, ctaCv, scroll, menu, hrefs, 
    abLb, abH, mf, metrics, skLb: 'Stack', skH, woLb, woH, 
    projectWhoDesc, projectRidesDesc, projectServerDesc,
    ghLb, moreGh, loading, coLb, coH, coP, valLb, valH, vals, cmdPh, cmdLang, cmdNav, tabAway, tabBack, footerTech, footerSrc, printContact
  };
}

export const TX: Record<Lang, Tx> = {
  es: mkTx(
    ['Buenos días', 'Buenas tardes', 'Buenas noches'], 'soy', (t) => `${t}, soy`,
    'Ingeniero Informático · Full Stack Developer', 'Me obsesiono con los detalles que nadie nota pero todo el mundo siente.', 'Disponible',
    'Ver proyectos', 'Contactar', 'Descargar CV', 'DESPLAZA', ['Inicio', 'Stack', 'Proyectos', 'Sobre mí', 'Contacto'],
    'Sobre mí', 'Entiendo lo\nque necesitas.', 'He aprendido que el código más valioso no es el más elegante — es el que resuelve exactamente el problema de quien lo usa. Backend sólido. Frontend que se siente bien. Sin dogmas.',
    [['5+', 'Proyectos activos'], ['100%', 'Foco en calidad'], ['∞', 'Arquitectura sólida']],
    'Tecnologías que domino.', 'Proyectos', 'Selected Works.',
    'Backend de un juego de adivinar futbolistas con Node.js, Express y MongoDB.',
    'Plataforma de ride-sharing en Java con arquitectura de 3 capas y JAX-WS.',
    'API REST ligera en Node.js para gestión de recursos en memoria.',
    'GitHub · Actividad reciente', 'Más en GitHub', 'Cargando repos…', 'Contacto', 'Hablemos.', 'Busco prácticas o posición junior. Si construyes algo que valga la pena, me interesa.',
    'Filosofía', 'Más allá del código.', VALS_ES, 'Buscar secciones…', 'IDIOMA', 'NAVEGAR', 'Vuelve pronto | Eneko Ruiz', 'Eneko Ruiz | Full Stack Developer',
    'Diseñado y desarrollado con obsesión en Donostia. Next.js 14, Tailwind CSS y GSAP.', 'Ver código fuente', 'eneekoruiz@gmail.com · github.com/eneekoruiz · linkedin.com/in/eneekoruiz'
  ),

  en: mkTx(
    ['Good morning', 'Good afternoon', 'Good evening'], "I'm", (t) => `${t}, I'm`,
    'Computer Engineer · Full Stack Developer', 'I agonise over the details no one notices — and that everyone ends up feeling.', 'Available',
    'See work', 'Contact', 'Download CV', 'SCROLL', ['Home', 'Stack', 'Projects', 'About', 'Contact'],
    'About', 'I understand\nwhat you need.', "The most valuable code is never the cleverest — it is the one that dissolves the precise frustration of the person using it. Robust backend. Frontend that feels alive. No dogma.",
    [['5+', 'Active projects'], ['100%', 'Quality focus'], ['∞', 'Solid architecture']],
    'Technologies I master.', 'Projects', 'Selected Works.',
    'Backend server for a football player guessing game built with Node.js, Express, and MongoDB.',
    'Ride-sharing platform built with Java, featuring 3-tier architecture and JAX-WS.',
    'Lightweight REST API in Node.js for in-memory resource management.',
    'GitHub · Recent activity', 'More on GitHub', 'Loading…', 'Contact', "Let's talk.", "Looking for internship or junior position. If you're building something worth building, I'm in.",
    'Philosophy', 'Beyond the code.', VALS_EN, 'Search sections…', 'LANGUAGE', 'NAVIGATE', 'Come back soon | Eneko Ruiz', 'Eneko Ruiz | Full Stack Developer',
    'Designed and built with obsession in Donostia. Next.js 14, Tailwind CSS and GSAP.', 'View source code', 'eneekoruiz@gmail.com · github.com/eneekoruiz · linkedin.com/in/eneekoruiz'
  ),

  eu: mkTx(
    ['Egun on', 'Arratsalde on', 'Gabon'], 'naiz', (t) => `${t} ·`,
    'Informatika Ingeniaria · Full Stack Developer', 'Inork nabaritzen ez dituen, baina denek sentitzen dituzten xehetasunetan jartzen dut arreta.', 'Eskuragarri',
    'Lanak ikusi', 'Idatzi', 'CV deskargatu', 'MUGITU', ['Hasiera', 'Stack', 'Nire lan garrantzitsuenak', 'Ni buruz', 'Kontaktua'],
    'Ni buruz', 'Zer behar duzun\nexaktuki ulertzen dut.', 'Nik ikasi dudana hauxe da: kode baliotsuena ez da inoiz azpimarragarriena — erabiltzailearen arazo zehatza modu natural batez konpontzen duena baizik. Backend sendoa. Ondo sentitzen den interfaze bat. Dogmarik gabe.',
    [['5+', 'Proiektu aktibo'], ['100%', 'Kalitate ardatza'], ['∞', 'Arkitektura sendo']],
    'Menperatzen ditudan teknologiak.', 'Proiektuak', 'Hautatutako lanak.',
    'Futbolariak asmatzeko joko baten backend zerbitzaria, Node.js, Express eta MongoDBrekin eraikia.',
    'Ride-sharing plataforma Java bidez, 3 geruzako arkitektura eta JAX-WS zerbitzuekin.',
    'Node.js bidezko API REST arina, memoria-baliabideak kudeatzeko.',
    'GitHub · Azken jarduera', 'Gehiago GitHuben', 'Kargatzen…', 'Kontaktua', 'Elkarrizketatu gaitezen.', 'Praktikak edo junior lanpostua bilatzen ari naiz. Merezi duen zerbait eraikitzen ari bazara, ni prest nago.',
    'Filosofia', 'Kodearen harantzago.', VALS_ES, 'Bilatu…', 'HIZKUNTZA', 'NABIGATU', 'Laster itzuli | Eneko Ruiz', 'Eneko Ruiz | Full Stack Developer',
    'Donostian obsesioz diseinatua eta garatua.', 'Iturburu-kodea ikusi', 'eneekoruiz@gmail.com · github.com/eneekoruiz'
  ),

  fr: mkTx(
    ['Bonjour', 'Bon après-midi', 'Bonsoir'], 'je suis', (t) => `${t}, je suis`,
    'Ingénieur Informatique · Full Stack Developer', "Je m'obsède sur les détails que personne ne remarque mais que tous ressentent.", 'Disponible',
    'Voir proyectos', 'Contacter', 'Télécharger CV', 'DÉFILER', ['Accueil', 'Stack', 'Projets', 'À propos', 'Contact'],
    'À propos', 'Je comprends\nce dont vous avez besoin.', "Le code le plus précieux n'est pas le plus élégant.",
    [['5+', 'Projets actifs'], ['100%', 'Focus qualité'], ['∞', 'Architecture solide']],
    'Technologies que je maîtrise.', 'Projets', 'Travaux sélectionnés.',
    'Serveur backend pour un jeu de football (Node.js, Express, MongoDB).',
    'Plateforme de covoiturage Java avec architecture 3-tiers.',
    'API REST Node.js pour la gestion des ressources en mémoire.',
    'GitHub · Activité récente', 'Plus sur GitHub', 'Chargement…', 'Contact', 'Parlons-en.', "Je cherche un stage ou un poste junior.",
    'Philosophie', 'Au-delà du code.', VALS_EN, 'Rechercher…', 'LANGUE', 'NAVIGUER', 'Revenez bientôt | Eneko Ruiz', 'Eneko Ruiz | Full Stack Developer',
    'Conçu à Donostia avec obsession.', 'Voir le code source', 'eneekoruiz@gmail.com · github.com/eneekoruiz'
  ),

  it: mkTx(
    ['Buongiorno', 'Buon pomeriggio', 'Buonasera'], 'sono', (t) => `${t}, sono`,
    'Ingegnere Informatico · Full Stack Developer', "Mi ossessiono sui dettagli che nessuno nota ma tutti sentono.", 'Disponibile',
    'Vedi progetti', 'Contattare', 'Scarica CV', 'SCORRI', ['Inizio', 'Stack', 'Progetti', 'Chi sono', 'Contatto'],
    'Chi sono', 'Capisco cosa\nhai bisogno.', "Il codice più prezioso non è il più elegante.",
    [['5+', 'Progetti attivi'], ['100%', 'Focus qualità'], ['∞', 'Architettura solida']],
    'Tecnologie che padroneggio.', 'Progetti', 'Lavori selezionati.',
    'Server backend per gioco di calcio (Node.js, Express, MongoDB).',
    'Piattaforma ride-sharing Java con architettura a 3 livelli.',
    'API REST Node.js per gestione risorse in memoria.',
    'GitHub · Attività recente', 'Altro su GitHub', 'Caricamento…', 'Contatto', 'Parliamone.', "Cerco uno stage o una posizione junior.",
    'Filosofia', 'Oltre il codice.', VALS_EN, 'Cerca…', 'LINGUA', 'NAVIGA', 'Torna presto | Eneko Ruiz', 'Eneko Ruiz | Full Stack Developer',
    'Progettato a Donostia con ossessione.', 'Vedi il codice sorgente', 'eneekoruiz@gmail.com · github.com/eneekoruiz'
  ),

  de: mkTx(
    ['Guten Morgen', 'Guten Tag', 'Guten Abend'], 'ich bin', (t) => `${t}, ich bin`,
    'Informatikingenieur · Full Stack Developer', 'Ich obsessiere über Details, die niemand bemerkt.', 'Verfügbar',
    'Projekte', 'Kontakt', 'CV herunterladen', 'SCROLLEN', ['Start', 'Stack', 'Projekte', 'Über mich', 'Kontakt'],
    'Über mich', 'Ich verstehe,\nwas Sie brauchen.', "Der wertvollste Code ist nicht der eleganteste.",
    [['5+', 'Aktive Projekte'], ['100%', 'Qualitätsfokus'], ['∞', 'Solide Architektur']],
    'Technologien, die ich beherrsche.', 'Projekte', 'Ausgewählte Arbeiten.',
    'Backend-Server für Fußball-Ratespiel (Node.js, Express, MongoDB).',
    'Java-Mitfahrplattform mit 3-Schicht-Architektur.',
    'Node.js REST-API für In-Memory-Ressourcenmanagement.',
    'GitHub · Letzte Aktivität', 'Mehr auf GitHub', 'Lädt…', 'Kontakt', 'Sprechen wir.', "Ich suche ein Praktikum oder Junior-Stelle.",
    'Philosophie', 'Über den Code hinaus.', VALS_EN, 'Suchen…', 'SPRACHE', 'NAVIGIEREN', 'Komm bald zurück | Eneko Ruiz', 'Eneko Ruiz | Full Stack Developer',
    'In Donostia mit Obsession entworfen.', 'Quellcode ansehen', 'eneekoruiz@gmail.com · github.com/eneekoruiz'
  ),

  pt: mkTx(
    ['Bom dia', 'Boa tarde', 'Boa noite'], 'sou', (t) => `${t}, sou`,
    'Engenheiro Informático · Full Stack Developer', 'Obsessiono-me com detalhes que ninguém nota.', 'Disponível',
    'Ver projetos', 'Contactar', 'Baixar CV', 'ROLAR', ['Início', 'Stack', 'Projetos', 'Sobre mim', 'Contato'],
    'Sobre mim', 'Entendo o que\nvocê precisa.', "O código mais valioso não é o mais elegante.",
    [['5+', 'Projetos ativos'], ['100%', 'Foco en qualidade'], ['∞', 'Arquitectura sólida']],
    'Tecnologias que domino.', 'Proyectos', 'Trabalhos selecionados.',
    'Servidor backend para jogo de futebol (Node.js, Express, MongoDB).',
    'Plataforma ride-sharing Java com arquitetura 3-tier.',
    'API REST Node.js para gestão de recursos em memória.',
    'GitHub · Atividade recente', 'Mais no GitHub', 'Carregando…', 'Contato', 'Vamos conversar.', "Procuro estágio ou posição júnior.",
    'Filosofia', 'Além do código.', VALS_EN, 'Pesquisar…', 'IDIOMA', 'NAVEGAR', 'Volte em breve | Eneko Ruiz', 'Eneko Ruiz | Full Stack Developer',
    'Desenhado em Donostia com obsessão.', 'Ver código fonte', 'eneekoruiz@gmail.com · github.com/eneekoruiz'
  ),

  ca: mkTx(
    ['Bon dia', 'Bona tarda', 'Bona nit'], 'sóc', (t) => `${t}, sóc`,
    'Enginyer Informàtic · Full Stack Developer', "M'obsessiono amb detalls que ningú nota.", 'Disponible',
    'Projectes', 'Contactar', 'CV descarregar', 'DESPLAÇA', ['Inici', 'Stack', 'Projectes', 'Sobre mi', 'Contacte'],
    'Sobre mi', 'Entenc el que\nnecessites.', "El codi més valuós no és el més elegant.",
    [['5+', 'Projectes actius'], ['100%', 'Focus en qualitat'], ['∞', 'Arquitectura sòlida']],
    'Tecnologies que domino.', 'Projectes', 'Treballs seleccionats.',
    'Servidor backend per a joc de futbol (Node.js, Express, MongoDB).',
    'Plataforma de viatges compartits Java amb arquitectura de 3 capes.',
    'API REST Node.js per a gestió de recursos en memòria.',
    'GitHub · Activitat recent', 'Més a GitHub', 'Carregant…', 'Contacte', 'Parlem.', "Busco pràctiques o posició júnior.",
    'Filosofia', 'Més enllà del codi.', VALS_EN, 'Cercar…', 'IDIOMA', 'NAVEGAR', 'Torna aviat | Eneko Ruiz', 'Eneko Ruiz | Full Stack Developer',
    'Dissenyat a Donostia amb obsessió.', 'Veure codi font', 'eneekoruiz@gmail.com · github.com/eneekoruiz'
  ),

  gl: mkTx(
    ['Bos días', 'Boa tarde', 'Boa noite'], 'son', (t) => `${t}, son`,
    'Enxeñeiro Informático · Full Stack Developer', 'Obsesiónome cos detalles que ninguén nota.', 'Dispoñible',
    'Proxectos', 'Contactar', 'Descargar CV', 'DESPRAZAR', ['Inicio', 'Stack', 'Proxectos', 'Sobre min', 'Contacto'],
    'Sobre min', 'Entendo o que\nnecesitas.', "O código máis valioso no é o máis elegante.",
    [['5+', 'Proxectos activos'], ['100%', 'Foco en calidade'], ['∞', 'Arquitectura sólida']],
    'Tecnoloxías que domino.', 'Proxectos', 'Traballos seleccionados.',
    'Servidor backend para xogo de fútbol (Node.js, Express, MongoDB).',
    'Plataforma ride-sharing Java con arquitectura 3-tier.',
    'API REST Node.js para xestión de recursos en memoria.',
    'GitHub · Actividade recente', 'Máis en GitHub', 'Cargando…', 'Contacto', 'Falemos.', "Busco prácticas ou posición junior.",
    'Filosofía', 'Máis alá do código.', VALS_EN, 'Buscar…', 'IDIOMA', 'NAVEGAR', 'Volve pronto | Eneko Ruiz', 'Eneko Ruiz | Full Stack Developer',
    'Deseñado en Donostia con obsesión.', 'Ver código fonte', 'eneekoruiz@gmail.com · github.com/eneekoruiz'
  ),

  ja: mkTx(
    ['おはようございます', 'こんにちは', 'こんばんは'], 'と申します', (t) => `${t}、`,
    'コンピューター工学 · フルスタック開発者', '気づく人はいない。でも、必ず感じる。そんな細部に、全力を注ぎます。', '採用枠あり',
    '作品を見る', '連絡する', '履歴書を見る', 'スクロール', ['ホーム', 'スタック', 'プロジェクト', '私について', 'お問い合わせ'],
    '自己紹介', 'あなたが\n本当に必要なものを理解しています。', '価値あるコードとは、もっとも洗練されたものではありません。',
    [['5+', '進行中プロジェクト'], ['100%', '品質へのこだわり'], ['∞', '堅牢な設計']],
    '習得済みの技術スタック。', 'プロジェクト', '厳選した作品。',
    'サッカー選手当てゲームのバックエンド（Node.js、Express、MongoDB）。',
    '3層アーキテクチャを採用したJava製ライドシェアプラットフォーム。',
    'インメモリ・リソース管理用の軽量Node.js REST API。',
    'GitHub · 最新の活動', 'GitHubでもっと見る', '取得中…', 'お問い合わせ', 'ぜひお話しましょう。', 'インターンまたはジュニアポジションを探しています。',
    'エンジニアとしての信条', 'コードを超えた世界観。', VALS_EN, 'セクションを検索…', '言語', 'ナビゲート', 'またお越しください | Eneko Ruiz', 'Eneko Ruiz | フルスタック開発者',
    'ドノスティアで、こだわり抜いて設計・開発。', 'ソースコードを見る', 'eneekoruiz@gmail.com · github.com/eneekoruiz'
  ),
};

export { LANG_LABELS } from './constants';