import { Target, Code2, Zap, Users, BookOpen, Heart } from 'lucide-react';
import type { Lang, Tx, Val } from '../types';

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

const VALS_EU: Val[] = [
  { icon: Target,   t: 'Xehetasunekiko arreta',   d: 'Xehetasun txikiek bereizten dute lana oroigarri bilakatzetik. Inork eskatu baino lehen hautematen ditut.' },
  { icon: Code2,    t: 'Kode garbia beti',        d: 'Sei hilabete barru inork irakurri ezin duen kodea zor teknikoa da. Gizakiontzat idazten dut.' },
  { icon: Zap,      t: 'Errendimendua balio gisa',d: 'Abiadura errespetua da. Milisegundo bakoitzak garrantzia du.' },
  { icon: Users,    t: 'Elkarlan erreala',        d: 'Pair programming saio bakarrean aste osoan bakarrik baino gehiago ikasten dut.' },
  { icon: BookOpen, t: 'Etengabeko ikaskuntza',    d: 'Teknologiak astero egiten du aurrera. Garrantzitsua zergatik den ulertzen ematen dut denbora.' },
  { icon: Heart,    t: 'Arazoen konponbidea',     d: 'Konplexutasunari metodoz egiten diot aurre. Ondo definitutako arazoa erdi konponduta dago.' },
];

const VALS_FR: Val[] = [
  { icon: Target,   t: 'Souci du détail',         d: "Les petits détails séparent le bon du mémorable. Je les remarque avant qu'on ne le demande." },
  { icon: Code2,    t: 'Code propre toujours',    d: "Le code que personne ne peut lire dans 6 mois est une dette technique. J'écris pour les humains." },
  { icon: Zap,      t: 'La performance comme valeur', d: "La vitesse est une forme de respect. Chaque milliseconde compte." },
  { icon: Users,    t: 'Collaboration réelle',    d: "J'apprends plus lors d'une session de pair programming qu'en une semaine en solo." },
  { icon: BookOpen, t: 'Apprentissage continu',   d: "La technologie évolue chaque semaine. Je prends le temps de comprendre pourquoi c'est important." },
  { icon: Heart,    t: 'Résolution de problèmes', d: "Je fais face à la complexité avec méthode. Un problème bien défini est déjà à moitié résolu." },
];

const VALS_IT: Val[] = [
  { icon: Target,   t: 'Orientamento al dettaglio', d: 'I piccoli dettagli separano il buono dal memorabile. Li noto prima che chiunque altro lo chieda.' },
  { icon: Code2,    t: 'Sempre codice pulito',     d: 'Il codice che nessuno riesce a leggere dopo 6 mesi è debito tecnico. Scrivo per gli umani.' },
  { icon: Zap,      t: 'Prestazioni come valore', d: 'La velocità è rispetto. Ogni millisecondo conta.' },
  { icon: Users,    t: 'Collaborazione reale',    d: 'Imparo di più in una sessione di pair programming che in una settimana da solo.' },
  { icon: BookOpen, t: 'Apprendimento continuo',  d: 'La tecnologia evolve ogni settimana. Dedico del tempo a capire perché è importante.' },
  { icon: Heart,    t: 'Risoluzione dei problemi', d: 'Affronto la complessità con metodo. Un problema ben definito è già risolto a metà.' },
];

const VALS_DE: Val[] = [
  { icon: Target,   t: 'Detailorientiert',        d: 'Kleine Details unterscheiden das Gute vom Denkwürdigen. Ich bemerke sie, bevor jemand danach fragt.' },
  { icon: Code2,    t: 'Immer sauberer Code',      d: 'Code, den in 6 Monaten niemand lesen kann, ist technische Schuld. Ich schreibe für Menschen.' },
  { icon: Zap,      t: 'Leistung als Wert',       d: 'Geschwindigkeit bedeutet Respekt. Jede Millisekunde zählt.' },
  { icon: Users,    t: 'Echte Zusammenarbeit',    d: 'Ich lerne in einer Pair-Programming-Sitzung mehr als in einer Woche allein.' },
  { icon: BookOpen, t: 'Lebenslanges Lernen',     d: 'Technologie entwickelt sich jede Woche weiter. Ich nehme mir die Zeit zu verstehen, warum es wichtig ist.' },
  { icon: Heart,    t: 'Problemlösung',           d: 'Ich begegne Komplexität mit Methode. Ein gut definiertes Problem ist bereits halb gelöst.' },
];

const VALS_PT: Val[] = [
  { icon: Target,   t: 'Orientado ao detalhe',    d: 'Os pequenos detalhes separam o bom do memorável. Noto-os antes de qualquer pessoa pedir.' },
  { icon: Code2,    t: 'Código limpo sempre',     d: 'O código que ninguém consegue ler em 6 meses é dívida técnica. Escrevo para humanos.' },
  { icon: Zap,      t: 'Desempenho como valor',   d: 'Velocidade é respeito. Cada milissegundo conta.' },
  { icon: Users,    t: 'Colaboração real',        d: 'Aprendo mais numa sessão de pair programming do que numa semana sozinho.' },
  { icon: BookOpen, t: 'Aprendizagem contínua',   d: 'A tecnologia evolui todas as semanas. Dedico tempo a compreender por que razão é importante.' },
  { icon: Heart,    t: 'Resolução de problemas',  d: 'Enfrento a complexidade com método. Um problema bem definido já está meio resolvido.' },
];

const VALS_CA: Val[] = [
  { icon: Target,   t: 'Orientat al detall',      d: 'Els petits detalls separen el que és bo de lo memorable. Els noto abans que ningú els demani.' },
  { icon: Code2,    t: 'Codi net sempre',         d: 'El codi que ningú pot llegir en 6 mesos és deute tècnic. Escric per a humans.' },
  { icon: Zap,      t: 'Rendiment com a valor',   d: 'La velocitat és respecte. Cada mil·lisegon importa.' },
  { icon: Users,    t: 'Col·laboració real',      d: 'Aprenc més en una sessió de pair programming que en una setmana en solitari.' },
  { icon: BookOpen, t: 'Aprenentatge continu',    d: 'La tecnologia evoluciona cada setmana. Dedico temps a entendre per què importa.' },
  { icon: Heart,    t: 'Resolució de problemes',  d: 'Enfronto la complexitat amb mètode. Un problema ben definit ja està mig resolt.' },
];

const VALS_GL: Val[] = [
  { icon: Target,   t: 'Orientado ao detalle',    d: 'Os pequenos detalles separan o bo do memorable. Notoos antes de que ninguén os pida.' },
  { icon: Code2,    t: 'Código limpo sempre',     d: 'O código que ninguén pode ler en 6 meses é débeda técnica. Escribo para humanos.' },
  { icon: Zap,      t: 'Rendemento como valor',   d: 'A velocidade é respecto. Cada milisegundo importa.' },
  { icon: Users,    t: 'Colaboración real',       d: 'Aprendo máis nunha sesión de pair programming que nunha semana en solitario.' },
  { icon: BookOpen, t: 'Aprendizaxe continua',    d: 'A tecnoloxía evoluciona cada semana. Dedico tempo a entender por que importa.' },
  { icon: Heart,    t: 'Resolución de problemas', d: 'Enfronto a complexidade con método. Un problema ben definido xa está medio resolto.' },
];

const VALS_JA: Val[] = [
  { icon: Target,   t: '細部へのこだわり',         d: '小さなディテールが良い作品と心に残る作品を分けます。言われる前に気づきます。' },
  { icon: Code2,    t: '常にクリーンコード',       d: '半年後に誰も読めないコードは技術的負債です。私は人間のためにコードを書きます。' },
  { icon: Zap,      t: '価値としてのパフォーマンス', d: '速度は敬意です。1ミリ秒が極めて重要です。' },
  { icon: Users,    t: '真のコラボレーション',     d: '一人で1週間悩むより、ペアプログラミングセッションの1時間で多くを学びます。' },
  { icon: BookOpen, t: '継続的な学習',             d: '技術は毎週進化します。なぜそれが重要なのかを理解するために時間を割きます。' },
  { icon: Heart,    t: '課題解決力',               d: '複雑な問題にはメソッドを持って立ち向かいます。明確に定義された課題は、すでに半分解決されています。' },
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
  skLb: string,
  skH: string,
  skCats: string[],
  woLb: string,
  woH: string,
  projectWhoDesc: string,
  projectRidesDesc: string,
  projectServerDesc: string,
  projectTags: string[],
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
  printContact: string,
  back: string,
  openDirect: string
): Tx {
  const hrefs = ['#hero', '#skills', '#work', '#about', '#values', '#contact'];
  return {
    times, iam, greetingFn, role, tagline, status, ctaWork, ctaContact, ctaCv, scroll, menu, hrefs, 
    abLb, abH, mf, metrics, skLb, skH, skCats, woLb, woH, 
    projectWhoDesc, projectRidesDesc, projectServerDesc, projectTags,
    ghLb, moreGh, loading, coLb, coH, coP, valLb, valH, vals, cmdPh, cmdLang, cmdNav, tabAway, tabBack, footerTech, footerSrc, printContact,
    back, openDirect
  };
}

export const TX: Record<Lang, Tx> = {
  es: mkTx(
    ['Buenos días', 'Buenas tardes', 'Buenas noches'], 'soy', (t) => `${t}, soy`,
    'Ingeniero Informático · Full Stack Developer', 'Me obsesiono con los detalles que nadie nota pero todo el mundo siente.', 'Disponible',
    'Ver proyectos', 'Contactar', 'Ver Currículum', 'DESPLAZA', ['Inicio', 'Stack', 'Proyectos', 'Sobre mí', 'Filosofía', 'Contacto'],
    'Sobre mí', 'Entiendo lo que necesitas.', 'He aprendido que el código más valioso no es el más elegante — es el que resuelve exactamente el problema de quien lo usa. Backend sólido. Frontend que se siente bien. Sin dogmas.',
    [['5+', 'Proyectos activos'], ['100%', 'Foco en calidad'], ['∞', 'Arquitectura sólida']],
    'Stack', 'Tecnologías que domino.', ['Backend', 'Frontend', 'DevOps y Sistemas', 'Datos y Herramientas', 'IA y Agentes LLM'],
    'Proyectos', 'Selected Works.',
    'Backend de un juego de adivinar futbolistas con Node.js, Express y MongoDB.',
    'Plataforma de ride-sharing en Java con arquitectura de 3 capas y JAX-WS.',
    'API REST ligera en Node.js para gestión de recursos en memoria.',
    ['Arquitecto Lead', 'Backend / API', 'Ingeniero de Sistemas', 'Ingeniero Cloud', 'Especialista A11y'],
    'GitHub · Actividad reciente', 'Más en GitHub', 'Cargando repos…', 'Contacto', 'Hablemos.', 'Busco prácticas o posición junior. Si construyes algo que valga la pena, me interesa.',
    'Filosofía', 'Más allá del código.', VALS_ES, 'Buscar secciones…', 'IDIOMA', 'NAVEGAR', 'Vuelve pronto | Eneko Ruiz', 'Eneko Ruiz | Full Stack Developer',
    'Diseñado y desarrollado con obsesión en Donostia. Next.js 16, Tailwind CSS y GSAP.', 'Ver código fuente', 'eneekoruiz@gmail.com · github.com/eneekoruiz · linkedin.com/in/eneekoruiz',
    'Volver', 'Abrir Directo'
  ),

  en: mkTx(
    ['Good morning', 'Good afternoon', 'Good evening'], "I'm", (t) => `${t}, I'm`,
    'Computer Engineer · Full Stack Developer', 'I agonise over the details no one notices — and that everyone ends up feeling.', 'Available',
    'See work', 'Contact', 'View Curriculum', 'SCROLL', ['Home', 'Stack', 'Projects', 'About', 'Philosophy', 'Contact'],
    'About', 'I understand what you need.', "The most valuable code is never the cleverest — it is the one that dissolves the precise frustration of the person using it. Robust backend. Frontend that feels alive. No dogma.",
    [['5+', 'Active projects'], ['100%', 'Quality focus'], ['∞', 'Solid architecture']],
    'Stack', 'Technologies I master.', ['Backend', 'Frontend', 'DevOps & Systems', 'Data & Tools', 'AI & LLM Agents'],
    'Projects', 'Selected Works.',
    'Backend server for a football player guessing game built with Node.js, Express, and MongoDB.',
    'Ride-sharing platform built with Java, featuring 3-tier architecture and JAX-WS.',
    'Lightweight REST API in Node.js for in-memory resource management.',
    ['Lead Architect', 'Backend / API', 'System Engineer', 'Cloud Engineer', 'A11y Specialist'],
    'GitHub · Recent activity', 'More on GitHub', 'Loading…', 'Contact', "Let's talk.", "Looking for internship or junior position. If you're building something worth building, I'm in.",
    'Philosophy', 'Beyond the code.', VALS_EN, 'Search sections…', 'LANGUAGE', 'NAVIGATE', 'Come back soon | Eneko Ruiz', 'Eneko Ruiz | Full Stack Developer',
    'Designed and built with obsession in Donostia. Next.js 16, Tailwind CSS and GSAP.', 'View source code', 'eneekoruiz@gmail.com · github.com/eneekoruiz · linkedin.com/in/eneekoruiz',
    'Back', 'Open Direct'
  ),

  eu: mkTx(
    ['Egun on', 'Arratsalde on', 'Gabon'], 'naiz', (t) => `${t} ·`,
    'Informatika Ingeniaria · Full Stack Developer', 'Inork nabaritzen ez dituen, baina denek sentitzen dituzten xehetasunetan jartzen dut arreta.', 'Eskuragarri',
    'Lanak ikusi', 'Idatzi', 'Curriculuma ikusi', 'MUGITU', ['Hasiera', 'Stack', 'Proiektuak', 'Ni buruz', 'Filosofia', 'Kontaktua'],
    'Ni buruz', 'Zer behar duzun exaktuki ulertzen dut.', 'Nik ikasi dudana hauxe da: kode baliotsuena ez da inoiz azpimarragarriena — erabiltzailearen arazo zehatza modu natural batez konpontzen duena baizik. Backend sendoa. Ondo sentitzen den interfaze bat. Dogmarik gabe.',
    [['5+', 'Proiektu aktibo'], ['100%', 'Kalitate ardatza'], ['∞', 'Arkitektura sendo']],
    'Stack', 'Menperatzen ditudan teknologiak.', ['Backend', 'Frontend', 'DevOps eta Sistemak', 'Datuak eta Tresnak', 'AI eta Agente LLM'],
    'Proiektuak', 'Hautatutako lanak.',
    'Futbolariak asmatzeko joko baten backend zerbitzaria, Node.js, Express eta MongoDBrekin eraikia.',
    'Ride-sharing plataforma Java bidez, 3 geruzako arkitektura eta JAX-WS zerbitzuekin.',
    'Node.js bidezko API REST arina, memoria-baliabideak kudeatzeko.',
    ['Arkitekto Burua', 'Backend / API', 'Sistemen Ingeniaria', 'Cloud Ingeniaria', 'A11y Espezialista'],
    'GitHub · Azken jarduera', 'Gehiago GitHuben', 'Kargatzen…', 'Kontaktua', 'Elkarrizketatu gaitezen.', 'Praktikak edo junior lanpostua bilatzen ari naiz. Merezi duen zerbait eraikitzen ari bazara, ni prest nago.',
    'Filosofia', 'Kodearen harantzago.', VALS_EU, 'Bilatu…', 'HIZKUNTZA', 'NABIGATU', 'Laster itzuli | Eneko Ruiz', 'Eneko Ruiz | Full Stack Developer',
    'Donostian obsesioz diseinatua eta garatua. Next.js 16, Tailwind CSS eta GSAP.', 'Iturburu-kodea ikusi', 'eneekoruiz@gmail.com · github.com/eneekoruiz · linkedin.com/in/eneekoruiz',
    'Itzuli', 'Ireki Zuzenean'
  ),

  fr: mkTx(
    ['Bonjour', 'Bon après-midi', 'Bonsoir'], 'je suis', (t) => `${t}, je suis`,
    'Ingénieur Informatique · Développeur Full Stack', "Je m'obsède sur les détails que personne ne remarque mais que tout le monde ressent.", 'Disponible',
    'Voir projets', 'Contact', 'Voir Curriculum', 'DÉFILER', ['Accueil', 'Stack', 'Projets', 'À propos', 'Philosophie', 'Contact'],
    'À propos', 'Je comprends\nce dont vous avez besoin.', "J'ai appris que le code le plus précieux n'est pas le plus élégant — c'est celui qui résout exactement le problème de l'utilisateur. Backend solide. Frontend fluide. Sans dogme.",
    [['5+', 'Projets actifs'], ['100%', 'Focus qualité'], ['∞', 'Architecture solide']],
    'Stack', 'Technologies que je maîtrise.', ['Backend', 'Frontend', 'DevOps & Systèmes', 'Données & Outils', 'IA & Agents LLM'],
    'Projets', 'Travaux sélectionnés.',
    'Serveur backend pour un jeu de football (Node.js, Express, MongoDB).',
    'Plateforme de covoiturage Java avec architecture 3-tiers.',
    'API REST Node.js pour la gestion des ressources en mémoire.',
    ['Architecte Lead', 'Backend / API', 'Ingénieur Systèmes', 'Ingénieur Cloud', 'Spécialiste A11y'],
    'GitHub · Activité récente', 'Plus sur GitHub', 'Chargement…', 'Contact', 'Parlons-en.', "Je cherche un stage ou un poste junior. Si vous construisez quelque chose qui en vaut la peine, je suis partant.",
    'Philosophie', 'Au-delà du code.', VALS_FR, 'Rechercher…', 'LANGUE', 'NAVIGUER', 'À bientôt | Eneko Ruiz', 'Eneko Ruiz | Développeur Full Stack',
    'Conçu et développé à Donostia avec obsession. Next.js 16, Tailwind CSS et GSAP.', 'Voir le code source', 'eneekoruiz@gmail.com · github.com/eneekoruiz · linkedin.com/in/eneekoruiz',
    'Retour', 'Ouvrir en direct'
  ),

  it: mkTx(
    ['Buongiorno', 'Buon pomeriggio', 'Buonasera'], 'sono', (t) => `${t}, sono`,
    'Ingegnere Informatico · Sviluppatore Full Stack', "Mi ossessiono sui dettagli que nessuno nota ma che tutti percepiscono.", 'Disponibile',
    'Vedi progetti', 'Contatto', 'Vedi Curriculum', 'SCORRI', ['Inizio', 'Stack', 'Progetti', 'Chi sono', 'Filosofia', 'Contatto'],
    'Chi sono', 'Capisco cosa\nhai bisogno.', "Ho imparato che il codice più prezioso non è il più elegante — è quello que risolve esattamente il problema dell'utente. Backend solido. Frontend coinvolgente. Senza dogmi.",
    [['5+', 'Progetti attivi'], ['100%', 'Focus qualità'], ['∞', 'Architettura solida']],
    'Stack', 'Tecnologie che padroneggio.', ['Backend', 'Frontend', 'DevOps e Sistemi', 'Dati e Strumenti', 'IA e Agenti LLM'],
    'Progetti', 'Lavori selezionati.',
    'Server backend per gioco di calcio (Node.js, Express, MongoDB).',
    'Piattaforma ride-sharing Java con architettura a 3 livelli.',
    'API REST Node.js per gestione risorse in memoria.',
    ['Architetto Lead', 'Backend / API', 'Ingegnere di Sistemi', 'Ingegnere Cloud', 'Specialista A11y'],
    'GitHub · Attività recente', 'Altro su GitHub', 'Caricamento…', 'Contatto', 'Parliamone.', "Cerco uno stage o una posizione junior. Se stai costruendo qualcosa di valore, sono dei vostri.",
    'Filosofia', 'Oltre il codice.', VALS_IT, 'Cerca…', 'LINGUA', 'NAVIGA', 'Torna presto | Eneko Ruiz', 'Eneko Ruiz | Sviluppatore Full Stack',
    'Progettato e sviluppato a Donostia con ossessione. Next.js 16, Tailwind CSS e GSAP.', 'Vedi il codice sorgente', 'eneekoruiz@gmail.com · github.com/eneekoruiz · linkedin.com/in/eneekoruiz',
    'Indietro', 'Apri Direttamente'
  ),

  de: mkTx(
    ['Guten Morgen', 'Guten Tag', 'Guten Abend'], 'ich bin', (t) => `${t}, ich bin`,
    'Informatikingenieur · Full Stack Entwickler', 'Ich obsessiere über Details, die niemand bemerkt, aber jeder spürt.', 'Verfügbar',
    'Projekte', 'Kontakt', 'Curriculum ansehen', 'SCROLLEN', ['Start', 'Stack', 'Projekte', 'Über mich', 'Philosophie', 'Kontakt'],
    'Über mich', 'Ich verstehe,\nwas Sie brauchen.', "Ich habe gelernt, dass der wertvollste Code nicht der eleganteste ist — es ist derjenige, der das Problem des Benutzers exakt löst. Stabiles Backend. Lebendiges Frontend. Ohne Dogmen.",
    [['5+', 'Aktive Projekte'], ['100%', 'Qualitätsfokus'], ['∞', 'Solide Architektur']],
    'Stack', 'Technologien, die ich beherrsche.', ['Backend', 'Frontend', 'DevOps & Systeme', 'Daten & Tools', 'KI & LLM Agenten'],
    'Projekte', 'Ausgewählte Arbeiten.',
    'Backend-Server für Fußball-Ratespiel (Node.js, Express, MongoDB).',
    'Java-Mitfahrplattform mit 3-Schicht-Architektur.',
    'Node.js REST-API for In-Memory-Ressourcenmanagement.',
    ['Lead Architekt', 'Backend / API', 'Systemingenieur', 'Cloud Ingenieur', 'A11y Spezialist'],
    'GitHub · Letzte Aktivität', 'Mehr auf GitHub', 'Lädt…', 'Kontakt', 'Sprechen wir.', "Ich suche ein Praktikum oder eine Junior-Stelle. Wenn Sie etwas bauen, das es wert ist, bin ich dabei.",
    'Philosophie', 'Über den Code hinaus.', VALS_DE, 'Suchen…', 'SPRACHE', 'NAVIGIEREN', 'Bis bald | Eneko Ruiz', 'Eneko Ruiz | Full Stack Entwickler',
    'In Donostia mit Leidenschaft entworfen und entwickelt. Next.js 16, Tailwind CSS und GSAP.', 'Quellcode ansehen', 'eneekoruiz@gmail.com · github.com/eneekoruiz · linkedin.com/in/eneekoruiz',
    'Zurück', 'Direkt öffnen'
  ),

  pt: mkTx(
    ['Bom dia', 'Boa tarde', 'Boa noite'], 'sou', (t) => `${t}, sou`,
    'Engenheiro Informático · Desenvolvedor Full Stack', 'Obsessiono-me com detalhes que ninguém nota, mas que todos sentem.', 'Disponível',
    'Ver projetos', 'Contacto', 'Ver Currículum', 'ROLAR', ['Início', 'Stack', 'Projetos', 'Sobre mim', 'Filosofia', 'Contato'],
    'Sobre mim', 'Entendo o que\nvocê precisa.', "Aprendi que o código mais valioso não é o más elegante — é aquele que resolve exatamente o problema do utilizador. Backend sólido. Frontend intuitivo. Sem dogmas.",
    [['5+', 'Projetos ativos'], ['100%', 'Foco na qualidade'], ['∞', 'Arquitetura sólida']],
    'Stack', 'Tecnologias que domino.', ['Backend', 'Frontend', 'DevOps e Sistemas', 'Dados e Ferramentas', 'IA e Agentes LLM'],
    'Projetos', 'Trabalhos selecionados.',
    'Servidor backend para jogo de futebol (Node.js, Express, MongoDB).',
    'Plataforma ride-sharing Java com arquitetura 3-tier.',
    'API REST Node.js para gestão de recursos em memória.',
    ['Arquiteto Lead', 'Backend / API', 'Engenheiro de Sistemas', 'Engenheiro Cloud', 'Especialista A11y'],
    'GitHub · Atividade recente', 'Mais no GitHub', 'Carregando…', 'Contato', 'Vamos conversar.', "Procuro estágio ou posição júnior. Se está a construir algo que valha a pena, conte comigo.",
    'Filosofia', 'Além do código.', VALS_PT, 'Pesquisar…', 'IDIOMA', 'NAVEGAR', 'Volte em breve | Eneko Ruiz', 'Eneko Ruiz | Desenvolvedor Full Stack',
    'Desenhado e desarrollado em Donostia con obsessão. Next.js 16, Tailwind CSS e GSAP.', 'Ver código fonte', 'eneekoruiz@gmail.com · github.com/eneekoruiz · linkedin.com/in/eneekoruiz',
    'Voltar', 'Abrir Direto'
  ),

  ca: mkTx(
    ['Bon dia', 'Bona tarda', 'Bona nit'], 'sóc', (t) => `${t}, sóc`,
    'Enginyer Informàtic · Desenvolupador Full Stack', "M'obsessiono amb detalls que ningú nota, però que tothom sent.", 'Disponible',
    'Projectes', 'Contacte', 'Veure Currículum', 'DESPLAÇA', ['Inici', 'Stack', 'Projectes', 'Sobre mi', 'Filosofia', 'Contacte'],
    'Sobre mi', 'Entenc el que\nnecessites.', "He après que el codi més valuós no és el més elegant — és el que resol exactament el problema de l'usuari. Backend sòlid. Frontend que se sent bé. Sense dogmes.",
    [['5+', 'Projectes actius'], ['100%', 'Focus en qualitat'], ['∞', 'Arquitectura sòlida']],
    'Stack', 'Tecnologies que domino.', ['Backend', 'Frontend', 'DevOps i Sistemes', 'Dades i Eines'],
    'Projectes', 'Treballs seleccionats.',
    'Servidor backend per a joc de futbol (Node.js, Express, MongoDB).',
    'Plataforma de viatges compartits Java amb arquitectura de 3 capes.',
    'API REST Node.js per a gestió de recursos en memòria.',
    ['Arquitecte Lead', 'Backend / API', 'Enginyer de Sistemes', 'Enginyer Cloud', 'Especialista A11y'],
    'GitHub · Activitat recent', 'Més a GitHub', 'Carregant…', 'Contacte', 'Parlem-ne.', "Busco pràctiques o posició júnior. Si construeixes alguna cosa que valgui la pena, m'interessa.",
    'Filosofia', 'Més enllà del codi.', VALS_CA, 'Cercar…', 'IDIOMA', 'NAVEGAR', 'Torna aviat | Eneko Ruiz', 'Eneko Ruiz | Desenvolupador Full Stack',
    'Dissenyat i desenvolupat a Donostia amb obsessió. Next.js 16, Tailwind CSS i GSAP.', 'Veure codi font', 'eneekoruiz@gmail.com · github.com/eneekoruiz · linkedin.com/in/eneekoruiz',
    'Tornar', 'Obrir Directe'
  ),

  gl: mkTx(
    ['Bos días', 'Boa tarde', 'Boa noite'], 'son', (t) => `${t}, son`,
    'Enxeñeiro Informático · Desenvolvedor Full Stack', 'Obsesiónome cos detalles que ninguén nota, pero que todos senten.', 'Dispoñible',
    'Proxectos', 'Contacto', 'Ver Currículum', 'DESPRAZAR', ['Inicio', 'Stack', 'Proxectos', 'Sobre min', 'Filosofia', 'Contacto'],
    'Sobre min', 'Entendo o que\nnecesitas.', "Aprendín que o código máis valioso non é o máis elegante — é o que resolve exactamente o problema de quen o usa. Backend sólido. Frontend intuitivo. Sen dogmas.",
    [['5+', 'Proxectos activos'], ['100%', 'Foco en calidade'], ['∞', 'Arquitectura sólida']],
    'Stack', 'Tecnoloxías que domino.', ['Backend', 'Frontend', 'DevOps e Sistemas', 'Datos e Ferramentas'],
    'Proxectos', 'Traballos seleccionados.',
    'Servidor backend para xogo de fútbol (Node.js, Express, MongoDB).',
    'Plataforma ride-sharing Java con arquitectura 3-tier.',
    'API REST Node.js para xestión de recursos en memoria.',
    ['Arquitecto Lead', 'Backend / API', 'Enxeñeiro de Sistemas', 'Enxeñeiro Cloud', 'Especialista A11y'],
    'GitHub · Actividade recente', 'Máis en GitHub', 'Cargando…', 'Contacto', 'Falemos.', "Busco prácticas ou posición junior. Se constrúes algo que valla a pena, conta comigo.",
    'Filosofia', 'Máis alá do código.', VALS_GL, 'Buscar…', 'IDIOMA', 'NAVEGAR', 'Volve pronto | Eneko Ruiz', 'Eneko Ruiz | Desenvolvedor Full Stack',
    'Deseñado e desenvolvido en Donostia con obsesión. Next.js 16, Tailwind CSS e GSAP.', 'Ver código fonte', 'eneekoruiz@gmail.com · github.com/eneekoruiz · linkedin.com/in/eneekoruiz',
    'Voltar', 'Abrir Directo'
  ),

  ja: mkTx(
    ['おはようございます', 'こんにちは', 'こんばんは'], 'と申します', (t) => `${t}、`,
    'コンピューター工学 · フルスタック開発者', '誰も気づかない。言われる前に気づく。そんな細部に全力を注ぎます。', '採用枠あり',
    '作品を見る', '連絡する', '履歴書を見る', 'スクロール', ['ホーム', 'スタック', 'プロジェクト', '私について', 'エンジニアとしての信条', 'お問い合わせ'],
    '自己紹介', 'あなたが\n本当に必要なものを理解しています。', 'もっとも価値あるコードとは、単に洗練されたものではなく、利用者の課題を正確に解決するものです。堅牢なバックエンド、直感的なフロントエンド。教条主義にとらわれません。',
    [['5+', '進行中プロジェクト'], ['100%', '品質へのこだわり'], ['∞', '堅牢な設計']],
    'スタック', '習得済みの技術スタック。', ['バックエンド', 'フロントエンド', 'デブオプス & システム', 'データ & ツール'],
    'プロジェクト', '厳選した作品。',
    'Node.js、Express、MongoDBで構築されたサッカー選手推測ゲームのバックエンドサーバー。',
    '3層アーキテクチャを採用したJava製ライドシェアプラットフォーム。',
    'インメモリ・リソース管理用の軽量Node.js REST API。',
    ['リードアーキテクト', 'バックエンド / API', 'システムエンジニア', 'クラウドエンジニア', 'アクセシビリティスペシャリスト'],
    'GitHub · 最新の活動', 'GitHubでもっと見る', '取得中…', 'お問い合わせ', 'ぜひお話しましょう。', 'インターンまたはジュニアポジションを探しています。価値ある挑戦をお待ちしています。',
    'エンジニアとしての信条', 'コードを超えた世界観。', VALS_JA, 'セクションを検索…', '言語', 'ナビゲート', 'またお越しください | Eneko Ruiz', 'Eneko Ruiz | フルスタック開発者',
    'ドノスティアで、こだわり抜いて設計・開発。Next.js 16, Tailwind CSS & GSAP。', 'ソースコードを見る', 'eneekoruiz@gmail.com · github.com/eneekoruiz · linkedin.com/in/eneekoruiz',
    '戻る', '直接開く'
  ),
};

export { LANG_LABELS } from '../lib/constants';
