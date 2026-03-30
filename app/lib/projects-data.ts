// app/lib/projects-data.ts
import type { Lang } from './types';

export const PROJECTS_CONTENT: any = {
  'ana-peluquera': {
    es: {
      title: 'AG Beauty Salon', subtitle: 'Reservas & CMS', role: 'Full-Stack Lead Architect',
      objective: 'Digitalización total de un negocio de alta gama. Objetivo: reserva "Cero Fricción" y control "God-Mode" para la dueña.',
      algorithmH: 'Algoritmo Sandwich: Optimización O(n)',
      algorithmP: 'Divide servicios en Active-Wait-Active. Al detectar tiempo de exposición, libera el calendario permitiendo reservas paralelas sin colisiones.',
      supabaseH: 'Firebase + Google Calendar',
      supabaseP: 'Arquitectura NoSQL con sincronización bidireccional atómica mediante Service Accounts y Firestore.',
      outcomeH: 'Impacto Real', outcomeP: 'Facturación +30% y carga inicial < 300ms.',
      codeSpotlight: 'useCreateBooking.ts — Firebase',
      techBadges: ['Atomic Transactions', 'Firebase', 'Google Calendar API', 'Bcrypt']
    },
    en: {
      title: 'AG Beauty Salon', subtitle: 'Booking & CMS', role: 'Full-Stack Lead Architect',
      objective: 'Total digitalization. Goal: "Zero Friction" booking and "God-Mode" control for the owner.',
      algorithmH: 'Sandwich Algorithm: O(n) Optimization',
      algorithmP: 'Splits services into Active-Wait-Active. Frees slots automatically for parallel bookings without collisions.',
      supabaseH: 'Firebase + Google Calendar',
      supabaseP: 'NoSQL architecture with atomic dual-sync via Service Accounts and Firestore.',
      outcomeH: 'Real Impact', outcomeP: 'Revenue +30% and initial load < 300ms.',
      codeSpotlight: 'useCreateBooking.ts — Firebase',
      techBadges: ['Atomic Transactions', 'Firebase', 'Google Calendar API', 'Bcrypt']
    },
    eu: {
      title: 'AG Beauty Salon', subtitle: 'Erreserbak eta CMS', role: 'Full-Stack Lead Architect',
      objective: 'Goi mailako negozio baten digitalizazioa. Erreserba sistema erraza eta jabearentzat kontrol osoa.',
      algorithmH: 'Sandwich Algoritmoa: O(n) Optimizazioa',
      algorithmP: 'Zerbitzuak Active-Wait-Active fasetan banatzen ditu, tarte libreak automatikoki aprobetxatuz.',
      supabaseH: 'Firebase + Google Calendar',
      supabaseP: 'NoSQL arkitektura Firestore bidez eta Google Calendarrekin sinkronizazio atomikoa.',
      outcomeH: 'Eragin Erreala', outcomeP: 'Fakturazioa %30 hazi da eta karga < 300ms.',
      codeSpotlight: 'useCreateBooking.ts — Firebase',
      techBadges: ['Atomic Transactions', 'Firebase', 'Google Calendar API', 'Bcrypt']
    },
    fr: {
      title: 'AG Beauty Salon', subtitle: 'Réservations & CMS', role: 'Full-Stack Lead Architect',
      objective: 'Numérisation totale d\'un salon de luxe. Réservation fluide et contrôle total pour la propriétaire.',
      algorithmH: 'Algorithme Sandwich : Optimisation O(n)',
      algorithmP: 'Divise les services en phases Active-Wait-Active pour libérer des créneaux en parallèle.',
      supabaseH: 'Firebase + Google Calendar',
      supabaseP: 'Architecture NoSQL avec synchronisation bidirectionnelle atomique.',
      outcomeH: 'Impact Réel', outcomeP: 'Chiffre d\'affaires +30%, chargement < 300ms.',
      codeSpotlight: 'useCreateBooking.ts — Firebase',
      techBadges: ['Atomic Transactions', 'Firebase', 'Google Calendar API', 'Bcrypt']
    },
    it: {
      title: 'AG Beauty Salon', subtitle: 'Prenotazioni & CMS', role: 'Full-Stack Lead Architect',
      objective: 'Digitalizzazione totale. Esperienza di prenotazione fluida e gestione completa per la titolare.',
      algorithmH: 'Algoritmo Sandwich: Ottimizzazione O(n)',
      algorithmP: 'Divide i servizi in fasi Active-Wait-Active, liberando slot per prenotazioni parallele.',
      supabaseH: 'Firebase + Google Calendar',
      supabaseP: 'Architettura NoSQL con sincronizzazione atomica bidirezionale.',
      outcomeH: 'Impatto Reale', outcomeP: 'Fatturato +30%, caricamento < 300ms.',
      codeSpotlight: 'useCreateBooking.ts — Firebase',
      techBadges: ['Atomic Transactions', 'Firebase', 'Google Calendar API', 'Bcrypt']
    },
    de: {
      title: 'AG Beauty Salon', subtitle: 'Buchung & CMS', role: 'Full-Stack Lead Architect',
      objective: 'Vollständige Digitalisierung eines Luxus-Salons. Ziel: reibungslose Buchung und volle Kontrolle.',
      algorithmH: 'Sandwich-Algorithmus: O(n) Optimierung',
      algorithmP: 'Teilt Dienste in Active-Wait-Active-Phasen auf, um parallele Termine zu ermöglichen.',
      supabaseH: 'Firebase + Google Calendar',
      supabaseP: 'NoSQL-Architektur mit atomarer bidirektionaler Synchronisierung.',
      outcomeH: 'Echte Wirkung', outcomeP: 'Umsatz +30%, Ladezeit < 300ms.',
      codeSpotlight: 'useCreateBooking.ts — Firebase',
      techBadges: ['Atomic Transactions', 'Firebase', 'Google Calendar API', 'Bcrypt']
    },
    pt: {
      title: 'AG Beauty Salon', subtitle: 'Reservas & CMS', role: 'Full-Stack Lead Architect',
      objective: 'Digitalização total. Foco em experiência de reserva fluida e controle total para o proprietário.',
      algorithmH: 'Algoritmo Sandwich: Otimização O(n)',
      algorithmP: 'Divide serviços em fases para permitir reservas paralelas automaticamente.',
      supabaseH: 'Firebase + Google Calendar',
      supabaseP: 'Arquitetura NoSQL com sincronização bidirecional atómica.',
      outcomeH: 'Impacto Real', outcomeP: 'Faturação +30%, carga < 300ms.',
      codeSpotlight: 'useCreateBooking.ts — Firebase',
      techBadges: ['Atomic Transactions', 'Firebase', 'Google Calendar API', 'Bcrypt']
    },
    ca: {
      title: 'AG Beauty Salon', subtitle: 'Reserves & CMS', role: 'Full-Stack Lead Architect',
      objective: 'Digitalització total d\'un saló de luxe. Reserva sense fricció i control total per a la propietària.',
      algorithmH: 'Algorisme Sandwich: Optimització O(n)',
      algorithmP: 'Divideix serveis en fases per alliberar forats al calendari per a reserves paral·leles.',
      supabaseH: 'Firebase + Google Calendar',
      supabaseP: 'Arquitectura NoSQL amb sincronització bidireccional atòmica.',
      outcomeH: 'Impacte Real', outcomeP: 'Facturació +30%, càrrega < 300ms.',
      codeSpotlight: 'useCreateBooking.ts — Firebase',
      techBadges: ['Atomic Transactions', 'Firebase', 'Google Calendar API', 'Bcrypt']
    },
    gl: {
      title: 'AG Beauty Salon', subtitle: 'Reservas & CMS', role: 'Full-Stack Lead Architect',
      objective: 'Dixitalización total dun salón de luxo. Reserva sen fricción e control total para a dona.',
      algorithmH: 'Algoritmo Sandwich: Optimización O(n)',
      algorithmP: 'Divide servizos en fases para liberar o calendario para reservas en paralelo.',
      supabaseH: 'Firebase + Google Calendar',
      supabaseP: 'Arquitectura NoSQL con sincronización bidireccional atómica.',
      outcomeH: 'Impacto Real', outcomeP: 'Facturación +30%, carga < 300ms.',
      codeSpotlight: 'useCreateBooking.ts — Firebase',
      techBadges: ['Atomic Transactions', 'Firebase', 'Google Calendar API', 'Bcrypt']
    },
    ja: {
      title: 'AG 美容院', subtitle: '予約 & CMS', role: 'フルスタックリードアーキテクト',
      objective: '高級サロンの完全デジタル化。顧客にはシームレスな予約を、オーナーには完全な管理権限を。',
      algorithmH: 'サンドイッチアルゴリズム: O(n) 最適化',
      algorithmP: 'サービスをアクティブ・待機・アクティブに分割し、並行予約を自動的に可能にします。',
      supabaseH: 'Firebase + Google カレンダー',
      supabaseP: 'Firestore を使用した NoSQL アーキテクチャ。Google カレンダー API とのアトミックな同期。',
      outcomeH: '実際の影響', outcomeP: '収益が 30% 増加し、読み込み時間は 300 ミリ秒未満。',
      codeSpotlight: 'useCreateBooking.ts — Firebase',
      techBadges: ['Atomic Transactions', 'Firebase', 'Google Calendar API', 'Bcrypt']
    }
  },

  'who-are-ya-backend': {
    es: {
      title: 'Who Are Ya?', subtitle: 'Football Game Backend', role: 'Backend Architect',
      objective: 'Clon del famoso juego de fútbol. El reto: filtrar miles de jugadores y ligas en milisegundos.',
      algorithmH: 'Arquitectura MVC & MongoDB',
      algorithmP: 'Estructuración de relaciones complejas mediante ObjectIds y Mongoose "populate" para cruce de datos veloz.',
      supabaseH: 'Seguridad JWT & Bcrypt',
      supabaseP: 'Autenticación de administrador blindada y sesiones protegidas en el servidor para el panel CMS.',
      outcomeH: 'Producción Real', outcomeP: 'API REST desplegada en Render con MongoDB Atlas.',
      codeSpotlight: 'players.controller.js — Filter Engine',
      techBadges: ['Node.js', 'MongoDB', 'JWT', 'Bcrypt', 'MVC']
    },
    en: {
      title: 'Who Are Ya?', subtitle: 'Football Game Backend', role: 'Backend Architect',
      objective: 'Clone of the famous game. Challenge: filter thousands of players and leagues in milliseconds.',
      algorithmH: 'MVC Architecture & MongoDB',
      algorithmP: 'Structuring complex relationships using ObjectIds and Mongoose "populate" for high-speed data lookup.',
      supabaseH: 'JWT & Bcrypt Security',
      supabaseP: 'Hardened admin authentication and protected server sessions for the CMS dashboard.',
      outcomeH: 'Real Production', outcomeP: 'REST API deployed on Render with MongoDB Atlas.',
      codeSpotlight: 'players.controller.js — Filter Engine',
      techBadges: ['Node.js', 'MongoDB', 'JWT', 'Bcrypt', 'MVC']
    },
    eu: {
      title: 'Who Are Ya?', subtitle: 'Futbol Jokoaren Backend-a', role: 'Backend Architect',
      objective: 'Futbol joko ezagunaren klona. Erronka: milaka jokalari eta liga milisegundotan filtratzea.',
      algorithmH: 'MVC Arkitektura eta MongoDB',
      algorithmP: 'ObjectId-ak eta Mongoose "populate" erabiliz datu harreman konplexuak eta azkarrak kudeatzea.',
      supabaseH: 'JWT eta Bcrypt Segurtasuna',
      supabaseP: 'Administratzaile autentifikazio segurua eta zerbitzariko saio babestuak CMS panelerako.',
      outcomeH: 'Produkzioan', outcomeP: 'REST API-a Render-en eta MongoDB Atlas-en erabilgarri.',
      codeSpotlight: 'players.controller.js — Filter Engine',
      techBadges: ['Node.js', 'MongoDB', 'JWT', 'Bcrypt', 'MVC']
    },
    fr: {
      title: 'Who Are Ya?', subtitle: 'Backend Jeu de Foot', role: 'Backend Architect',
      objective: 'Clone d\'un jeu célèbre. Défi : filtrer des milliers de joueurs en quelques millisecondes.',
      algorithmH: 'Architecture MVC & MongoDB',
      algorithmP: 'Relations complexes via ObjectIds et Mongoose "populate" pour des recherches ultra-rapides.',
      supabaseH: 'Sécurité JWT & Bcrypt',
      supabaseP: 'Authentification admin robuste et sessions sécurisées pour le tableau de bord CMS.',
      outcomeH: 'Production Réelle', outcomeP: 'API REST déployée sur Render avec MongoDB Atlas.',
      codeSpotlight: 'players.controller.js — Filter Engine',
      techBadges: ['Node.js', 'MongoDB', 'JWT', 'Bcrypt', 'MVC']
    },
    it: {
      title: 'Who Are Ya?', subtitle: 'Backend Gioco Calcio', role: 'Backend Architect',
      objective: 'Clone del famoso gioco. Sfida: filtrare migliaia di giocatori e campionati in millisecondi.',
      algorithmH: 'Architettura MVC & MongoDB',
      algorithmP: 'Relazioni complesse tramite ObjectIds e Mongoose "populate" per ricerche dati veloci.',
      supabaseH: 'Sicurezza JWT & Bcrypt',
      supabaseP: 'Autenticazione amministratore blindata e sessioni server protette per il CMS.',
      outcomeH: 'Produzione', outcomeP: 'API REST su Render con MongoDB Atlas.',
      codeSpotlight: 'players.controller.js — Filter Engine',
      techBadges: ['Node.js', 'MongoDB', 'JWT', 'Bcrypt', 'MVC']
    },
    de: {
      title: 'Who Are Ya?', subtitle: 'Fußballspiel-Backend', role: 'Backend Architect',
      objective: 'Klon des berühmten Spiels. Herausforderung: Tausende Spieler in Millisekunden filtern.',
      algorithmH: 'MVC-Architektur & MongoDB',
      algorithmP: 'Komplexe Beziehungen über ObjectIds und Mongoose "populate" für schnellen Datenzugriff.',
      supabaseH: 'JWT & Bcrypt Sicherheit',
      supabaseP: 'Gesicherte Admin-Authentifizierung und Server-Sitzungen für das CMS.',
      outcomeH: 'Echte Produktion', outcomeP: 'REST API auf Render mit MongoDB Atlas.',
      codeSpotlight: 'players.controller.js — Filter Engine',
      techBadges: ['Node.js', 'MongoDB', 'JWT', 'Bcrypt', 'MVC']
    },
    pt: {
      title: 'Who Are Ya?', subtitle: 'Backend Jogo Futebol', role: 'Backend Architect',
      objective: 'Clone do jogo famoso. Desafio: filtrar milhares de jogadores em milissegundos.',
      algorithmH: 'Arquitetura MVC & MongoDB',
      algorithmP: 'Relacionamentos complexos via ObjectIds e Mongoose "populate" para busca rápida.',
      supabaseH: 'Segurança JWT & Bcrypt',
      supabaseP: 'Autenticação de administrador segura e sessões protegidas para o CMS.',
      outcomeH: 'Produção Real', outcomeP: 'API REST em Render com MongoDB Atlas.',
      codeSpotlight: 'players.controller.js — Filter Engine',
      techBadges: ['Node.js', 'MongoDB', 'JWT', 'Bcrypt', 'MVC']
    },
    ca: {
      title: 'Who Are Ya?', subtitle: 'Backend Joc de Futbol', role: 'Backend Architect',
      objective: 'Clon del famós joc. El repte: filtrar milers de jugadors i lligues en mil·lisegons.',
      algorithmH: 'Arquitectura MVC & MongoDB',
      algorithmP: 'Relacions complexes mitjançant ObjectIds i Mongoose "populate" per a cerques ràpides.',
      supabaseH: 'Seguretat JWT & Bcrypt',
      supabaseP: 'Autenticació admin blindada i sessions protegides per al CMS.',
      outcomeH: 'Producció Real', outcomeP: 'API REST desplegada a Render amb MongoDB Atlas.',
      codeSpotlight: 'players.controller.js — Filter Engine',
      techBadges: ['Node.js', 'MongoDB', 'JWT', 'Bcrypt', 'MVC']
    },
    gl: {
      title: 'Who Are Ya?', subtitle: 'Backend Xogo Fútbol', role: 'Backend Architect',
      objective: 'Clon do famoso xogo. O reto: filtrar miles de xogadores en milisegundos.',
      algorithmH: 'Arquitectura MVC & MongoDB',
      algorithmP: 'Relacións complexas mediante ObjectIds e Mongoose "populate" para buscas veloces.',
      supabaseH: 'Seguridade JWT & Bcrypt',
      supabaseP: 'Autenticación admin protexida e sesións de servidor para o CMS.',
      outcomeH: 'Produción Real', outcomeP: 'API REST en Render con MongoDB Atlas.',
      codeSpotlight: 'players.controller.js — Filter Engine',
      techBadges: ['Node.js', 'MongoDB', 'JWT', 'Bcrypt', 'MVC']
    },
    ja: {
      title: 'Who Are Ya?', subtitle: 'サッカーゲーム バックエンド', role: 'バックエンドアーキテクト',
      objective: '有名なゲームのクローン。数千人のプレイヤーやリーグをミリ秒単位でフィルタリングします。',
      algorithmH: 'MVC アーキテクチャ & MongoDB',
      algorithmP: 'ObjectIds と Mongoose の "populate" を使用して、高速なデータ検索のための複雑な関係を構築。',
      supabaseH: 'JWT & Bcrypt セキュリティ',
      supabaseP: 'CMS ダッシュボード用の管理者認証と保護されたサーバーセッション。',
      outcomeH: '実稼働', outcomeP: 'MongoDB Atlas を使用して Render にデプロイされた REST API。',
      codeSpotlight: 'players.controller.js — Filter Engine',
      techBadges: ['Node.js', 'MongoDB', 'JWT', 'Bcrypt', 'MVC']
    }
  },

  'rides24ofiziala': {
    es: {
      title: 'Rides24', subtitle: 'Sistema Distribuido Java', role: 'Systems Architect',
      objective: 'Ride-sharing distribuido. Reto: consistencia de datos y reservas concurrentes sin errores.',
      algorithmH: 'Transacciones Atómicas & ObjectDB',
      algorithmP: 'Uso de JAX-WS y bloqueos pesimistas (PESSIMISTIC_WRITE) para evitar duplicados en asientos.',
      supabaseH: 'Concurrencia Thread-Safe',
      supabaseP: 'Gestión de monitores de Java para sincronizar peticiones de usuarios simultáneos.',
      outcomeH: 'Consistencia Total', outcomeP: 'Sistema funcional testeado bajo carga con 0 condiciones de carrera.',
      codeSpotlight: 'RideService.java — Atomic Lock',
      techBadges: ['JAX-WS', 'ObjectDB', 'Java Swing', 'Thread-Safe']
    },
    en: {
      title: 'Rides24', subtitle: 'Java Distributed System', role: 'Systems Architect',
      objective: 'Distributed ride-sharing. Challenge: data consistency and concurrent bookings without errors.',
      algorithmH: 'Atomic Transactions & ObjectDB',
      algorithmP: 'Using JAX-WS and pessimistic locks to prevent duplicate seat reservations.',
      supabaseH: 'Thread-Safe Concurrency',
      supabaseP: 'Java monitor management to synchronize simultaneous user requests.',
      outcomeH: 'Total Consistency', outcomeP: 'Functional system load-tested with zero race conditions.',
      codeSpotlight: 'RideService.java — Atomic Lock',
      techBadges: ['JAX-WS', 'ObjectDB', 'Java Swing', 'Thread-Safe']
    },
    eu: {
      title: 'Rides24', subtitle: 'Java Sistema Banatua', role: 'Systems Architect',
      objective: 'Bidaia partekatu banatua. Erronka: datuen koherentzia eta erreserba konkurrenteak errorerik gabe.',
      algorithmH: 'Transakzio Atomikoak eta ObjectDB',
      algorithmP: 'JAX-WS eta blokeo pesimistak erabiliz eserlekuen erreserba bikoitzak saihesteko.',
      supabaseH: 'Thread-Safe Konkurrentzia',
      supabaseP: 'Java monitoreak erabiltzen ditu aldi bereko erabiltzaileen eskaerak sinkronizatzeko.',
      outcomeH: 'Koherentzia Osoa', outcomeP: 'Karga-testetan probatutako sistema, zero lasterketa-baldintzarekin.',
      codeSpotlight: 'RideService.java — Atomic Lock',
      techBadges: ['JAX-WS', 'ObjectDB', 'Java Swing', 'Thread-Safe']
    },
    fr: {
      title: 'Rides24', subtitle: 'Système Distribué Java', role: 'Systems Architect',
      objective: 'Ride-sharing distribué. Défi : cohérence des données et réservations simultanées.',
      algorithmH: 'Transactions Atomiques & ObjectDB',
      algorithmP: 'Utilisation de JAX-WS et verrous pessimistes pour éviter les doubles réservations.',
      supabaseH: 'Concurrence Thread-Safe',
      supabaseP: 'Gestion des moniteurs Java pour synchroniser les requêtes utilisateurs simultanées.',
      outcomeH: 'Cohérence Totale', outcomeP: 'Système testé sous charge avec zéro condition de course.',
      codeSpotlight: 'RideService.java — Atomic Lock',
      techBadges: ['JAX-WS', 'ObjectDB', 'Java Swing', 'Thread-Safe']
    },
    it: {
      title: 'Rides24', subtitle: 'Sistema Distribuito Java', role: 'Systems Architect',
      objective: 'Ride-sharing distribuito. Sfida: coerenza dei dati e prenotazioni simultanee.',
      algorithmH: 'Transazioni Atomiche & ObjectDB',
      algorithmP: 'JAX-WS e blocchi pessimistici per prevenire doppie prenotazioni di posti.',
      supabaseH: 'Concorrenza Thread-Safe',
      supabaseP: 'Gestione monitor Java per sincronizzare le richieste simultanee degli utenti.',
      outcomeH: 'Coerenza Totale', outcomeP: 'Sistema testato sotto carico con zero race conditions.',
      codeSpotlight: 'RideService.java — Atomic Lock',
      techBadges: ['JAX-WS', 'ObjectDB', 'Java Swing', 'Thread-Safe']
    },
    de: {
      title: 'Rides24', subtitle: 'Verteiltes Java-System', role: 'Systems Architect',
      objective: 'Verteiltes Ride-Sharing. Herausforderung: Datenkonsistenz bei gleichzeitigen Buchungen.',
      algorithmH: 'Atomare Transaktionen & ObjectDB',
      algorithmP: 'Einsatz von JAX-WS und pessimistischen Sperren zur Vermeidung von Doppelbuchungen.',
      supabaseH: 'Thread-Safe Nebenläufigkeit',
      supabaseP: 'Java-Monitor-Management zur Synchronisierung gleichzeitiger Anfragen.',
      outcomeH: 'Volle Konsistenz', outcomeP: 'Lastgetestetes System mit Null Race Conditions.',
      codeSpotlight: 'RideService.java — Atomic Lock',
      techBadges: ['JAX-WS', 'ObjectDB', 'Java Swing', 'Thread-Safe']
    },
    pt: {
      title: 'Rides24', subtitle: 'Sistema Distribuído Java', role: 'Systems Architect',
      objective: 'Ride-sharing distribuído. Desafio: consistência de dados e reservas concorrentes.',
      algorithmH: 'Transações Atómicas & ObjectDB',
      algorithmP: 'JAX-WS e bloqueios pessimistas para evitar reservas duplicadas.',
      supabaseH: 'Concorrência Thread-Safe',
      supabaseP: 'Gestão de monitores Java para sincronizar pedidos simultâneos.',
      outcomeH: 'Consistência Total', outcomeP: 'Sistema testado com carga e zero condições de corrida.',
      codeSpotlight: 'RideService.java — Atomic Lock',
      techBadges: ['JAX-WS', 'ObjectDB', 'Java Swing', 'Thread-Safe']
    },
    ca: {
      title: 'Rides24', subtitle: 'Sistema Distribuït Java', role: 'Systems Architect',
      objective: 'Ride-sharing distribuït. Repte: consistència de dades i reserves simultànies.',
      algorithmH: 'Transaccions Atòmiques & ObjectDB',
      algorithmP: 'JAX-WS i bloquejos pessimistes per evitar reserves de seients duplicades.',
      supabaseH: 'Concurrència Thread-Safe',
      supabaseP: 'Gestió de monitors Java per sincronitzar peticions simultànies.',
      outcomeH: 'Consistència Total', outcomeP: 'Sistema provat sota càrrega amb zero condicions de carrera.',
      codeSpotlight: 'RideService.java — Atomic Lock',
      techBadges: ['JAX-WS', 'ObjectDB', 'Java Swing', 'Thread-Safe']
    },
    gl: {
      title: 'Rides24', subtitle: 'Sistema Distribuído Java', role: 'Systems Architect',
      objective: 'Ride-sharing distribuído. Reto: consistencia de datos e reservas concorrentes.',
      algorithmH: 'Transaccións Atómicas & ObjectDB',
      algorithmP: 'JAX-WS e bloqueos pesimistas para evitar reservas duplicadas de asentos.',
      supabaseH: 'Concorrencia Thread-Safe',
      supabaseP: 'Xestión de monitores Java para sincronizar peticións simultáneas.',
      outcomeH: 'Consistencia Total', outcomeP: 'Sistema probado con carga e cero condicións de carreira.',
      codeSpotlight: 'RideService.java — Atomic Lock',
      techBadges: ['JAX-WS', 'ObjectDB', 'Java Swing', 'Thread-Safe']
    },
    ja: {
      title: 'Rides24', subtitle: 'Java 分散システム', role: 'システムアーキテクト',
      objective: '分散型ライドシェアリング。課題：データの一貫性とエラーのない同時予約。',
      algorithmH: 'アトミックトランザクション & ObjectDB',
      algorithmP: 'JAX-WS と悲観的ロックを使用して、座席の重複予約を防ぎます。',
      supabaseH: 'スレッドセーフな並行処理',
      supabaseP: '同時ユーザーリクエストを同期するための Java モニター管理。',
      outcomeH: '完全な一貫性', outcomeP: '競合状態がゼロであることを負荷テストで確認済み。',
      codeSpotlight: 'RideService.java — Atomic Lock',
      techBadges: ['JAX-WS', 'ObjectDB', 'Java Swing', 'Thread-Safe']
    }
  },

  'spotshare-parking': {
    es: {
      title: 'SpotShare', subtitle: 'Cloud Parking Manager', role: 'Cloud Quality Engineer',
      objective: 'Gestión Cloud de aparcamientos. Foco: Calidad del código y escalabilidad.',
      algorithmH: 'SonarCloud Quality Gate',
      algorithmP: 'Rating "A" en SonarCloud: 0 Bugs y Vulnerabilidades. Deuda técnica inferior al 2%.',
      supabaseH: 'Cloud Concurrency',
      supabaseP: 'Uso de Optimistic Locking para gestionar el estado de las plazas en tiempo real.',
      outcomeH: 'Código Empresarial', outcomeP: 'Arquitectura escalable auditada automáticamente en cada PR.',
      codeSpotlight: 'parking.service.ts — Lock Logic',
      techBadges: ['SonarCloud A', 'Cloud', 'CI/CD', 'Optimistic Locking']
    },
    en: {
      title: 'SpotShare', subtitle: 'Cloud Parking Manager', role: 'Cloud Quality Engineer',
      objective: 'Cloud parking management. Focus: Code quality and scalability.',
      algorithmH: 'SonarCloud Quality Gate',
      algorithmP: 'SonarCloud "A" Rating: 0 Bugs and Vulnerabilities. Technical debt under 2%.',
      supabaseH: 'Cloud Concurrency',
      supabaseP: 'Using Optimistic Locking to manage parking spot states in real-time.',
      outcomeH: 'Enterprise Code', outcomeP: 'Scalable architecture automatically audited in every PR.',
      codeSpotlight: 'parking.service.ts — Lock Logic',
      techBadges: ['SonarCloud A', 'Cloud', 'CI/CD', 'Optimistic Locking']
    },
    eu: {
      title: 'SpotShare', subtitle: 'Cloud Aparkaleku Kudeatzailea', role: 'Cloud Quality Engineer',
      objective: 'Aparkalekuen Cloud kudeaketa. Fokua: Kodearen kalitatea eta eskalagarritasuna.',
      algorithmH: 'SonarCloud Quality Gate',
      algorithmP: 'SonarCloud-en "A" balorazioa: 0 Bug eta ahultasun. Zor teknikoa %2 baino txikiagoa.',
      supabaseH: 'Cloud Konkurrentzia',
      supabaseP: 'Optimistic Locking erabiliz aparkaleku-plazen egoera denbora errealean kudeatzeko.',
      outcomeH: 'Enpresa Mailako Kodea', outcomeP: 'Arkitektura eskalagarria PR bakoitzean automatikoki auditaturik.',
      codeSpotlight: 'parking.service.ts — Lock Logic',
      techBadges: ['SonarCloud A', 'Cloud', 'CI/CD', 'Optimistic Locking']
    },
    fr: {
      title: 'SpotShare', subtitle: 'Gestion Parking Cloud', role: 'Cloud Quality Engineer',
      objective: 'Gestion Cloud de parkings. Focus : Qualité du code et évolutivité.',
      algorithmH: 'SonarCloud Quality Gate',
      algorithmP: 'Score "A" sur SonarCloud : 0 bogues et vulnérabilités. Dette technique < 2%.',
      supabaseH: 'Concurrence Cloud',
      supabaseP: 'Utilisation de l\'Optimistic Locking pour l\'état des places en temps réel.',
      outcomeH: 'Code Entreprise', outcomeP: 'Architecture évolutive auditée automatiquement à chaque PR.',
      codeSpotlight: 'parking.service.ts — Lock Logic',
      techBadges: ['SonarCloud A', 'Cloud', 'CI/CD', 'Optimistic Locking']
    },
    it: {
      title: 'SpotShare', subtitle: 'Cloud Parking Manager', role: 'Cloud Quality Engineer',
      objective: 'Gestione parcheggi Cloud. Focus: Qualità del codice e scalabilità.',
      algorithmH: 'SonarCloud Quality Gate',
      algorithmP: 'Rating "A" su SonarCloud: 0 Bug e vulnerabilità. Debito tecnico < 2%.',
      supabaseH: 'Concorrenza Cloud',
      supabaseP: 'Utilizzo di Optimistic Locking per gestire i posti in tempo reale.',
      outcomeH: 'Codice Enterprise', outcomeP: 'Architettura scalabile auditata automaticamente in ogni PR.',
      codeSpotlight: 'parking.service.ts — Lock Logic',
      techBadges: ['SonarCloud A', 'Cloud', 'CI/CD', 'Optimistic Locking']
    },
    de: {
      title: 'SpotShare', subtitle: 'Cloud Parkplatz-Manager', role: 'Cloud Quality Engineer',
      objective: 'Cloud-Parkplatzverwaltung. Fokus: Codequalität und Skalierbarkeit.',
      algorithmH: 'SonarCloud Quality Gate',
      algorithmP: 'Rating "A" in SonarCloud: 0 Bugs und Schwachstellen. Technische Schuld < 2%.',
      supabaseH: 'Cloud-Nebenläufigkeit',
      supabaseP: 'Optimistic Locking zur Echtzeitverwaltung der Parkplätze.',
      outcomeH: 'Business-Code', outcomeP: 'Skalierbare Architektur, automatisch bei jedem PR geprüft.',
      codeSpotlight: 'parking.service.ts — Lock Logic',
      techBadges: ['SonarCloud A', 'Cloud', 'CI/CD', 'Optimistic Locking']
    },
    pt: {
      title: 'SpotShare', subtitle: 'Gestor de Estacionamento Cloud', role: 'Cloud Quality Engineer',
      objective: 'Gestão Cloud. Foco: Qualidade do código e escalabilidade.',
      algorithmH: 'SonarCloud Quality Gate',
      algorithmP: 'Rating "A" no SonarCloud: 0 Bugs e vulnerabilidades. Dívida técnica < 2%.',
      supabaseH: 'Concorrência Cloud',
      supabaseP: 'Uso de Optimistic Locking para gerir lugares em tempo real.',
      outcomeH: 'Código Enterprise', outcomeP: 'Arquitetura escalável auditada em cada PR.',
      codeSpotlight: 'parking.service.ts — Lock Logic',
      techBadges: ['SonarCloud A', 'Cloud', 'CI/CD', 'Optimistic Locking']
    },
    ca: {
      title: 'SpotShare', subtitle: 'Cloud Parking Manager', role: 'Cloud Quality Engineer',
      objective: 'Gestió Cloud d\'aparcaments. Focus: Qualitat del codi i escalabilitat.',
      algorithmH: 'SonarCloud Quality Gate',
      algorithmP: 'Rating "A" a SonarCloud: 0 Bugs i vulnerabilitats. Deute tècnic < 2%.',
      supabaseH: 'Concurrència Cloud',
      supabaseP: 'Ús d\'Optimistic Locking per gestionar l\'estat de les places en temps real.',
      outcomeH: 'Codi Empresarial', outcomeP: 'Arquitectura escalable auditada automàticament en cada PR.',
      codeSpotlight: 'parking.service.ts — Lock Logic',
      techBadges: ['SonarCloud A', 'Cloud', 'CI/CD', 'Optimistic Locking']
    },
    gl: {
      title: 'SpotShare', subtitle: 'Xestor de Parking Cloud', role: 'Cloud Quality Engineer',
      objective: 'Xestión Cloud de aparcadoiros. Foco: Calidade do código e escalabilidade.',
      algorithmH: 'SonarCloud Quality Gate',
      algorithmP: 'Rating "A" en SonarCloud: 0 Bugs e vulnerabilidades. Débeda técnica < 2%.',
      supabaseH: 'Concorrencia Cloud',
      supabaseP: 'Uso de Optimistic Locking para xestionar prazas en tempo real.',
      outcomeH: 'Código Empresarial', outcomeP: 'Arquitectura escalable auditada automaticamente en cada PR.',
      codeSpotlight: 'parking.service.ts — Lock Logic',
      techBadges: ['SonarCloud A', 'Cloud', 'CI/CD', 'Optimistic Locking']
    },
    ja: {
      title: 'SpotShare', subtitle: 'クラウド駐車場管理', role: 'クラウド品質エンジニア',
      objective: '駐車場のクラウド管理。重点：コードの品質とスケーラビリティ。',
      algorithmH: 'SonarCloud クオリティゲート',
      algorithmP: 'SonarCloud で「A」評価：バグと脆弱性ゼロ。テクニカルデット 2% 未満。',
      supabaseH: 'クラウド並行性',
      supabaseP: '駐車スペースの状態をリアルタイムで管理するための楽観的ロックの使用。',
      outcomeH: 'エンタープライズコード', outcomeP: 'すべての PR で自動的に監査されるスケーラブルなアーキテクチャ。',
      codeSpotlight: 'parking.service.ts — Lock Logic',
      techBadges: ['SonarCloud A', 'Cloud', 'CI/CD', 'Optimistic Locking']
    }
  },

  'pke_web': {
    es: {
      title: 'PKE Web', subtitle: 'Accesibilidad & Semántica', role: 'UX/A11Y Developer',
      objective: 'Plataforma web donde la accesibilidad es la base. Cumplimiento WCAG 2.1 AA.',
      algorithmH: 'Focus Trapping & ARIA Roles',
      algorithmP: 'Gestión impecable del DOM para navegación por teclado y lectores de pantalla.',
      supabaseH: 'Diseño Inclusivo',
      supabaseP: 'Análisis de contraste real y soporte nativo para prefers-reduced-motion.',
      outcomeH: '100% Lighthouse A11Y', outcomeP: 'Interfaz utilizable por cualquier persona sin excepciones.',
      codeSpotlight: 'useFocusTrap.ts — React Hook',
      techBadges: ['WCAG 2.1 AA', 'Focus Trap', 'A11Y', 'Semantic HTML']
    },
    en: {
      title: 'PKE Web', subtitle: 'Accessibility & Semantics', role: 'UX/A11Y Developer',
      objective: 'Web platform where accessibility is the foundation. WCAG 2.1 AA compliance.',
      algorithmH: 'Focus Trapping & ARIA Roles',
      algorithmP: 'Flawless DOM management for keyboard navigation and screen readers.',
      supabaseH: 'Inclusive Design',
      supabaseP: 'Real contrast analysis and native support for prefers-reduced-motion.',
      outcomeH: '100% Lighthouse A11Y', outcomeP: 'Interface usable by everyone without exceptions.',
      codeSpotlight: 'useFocusTrap.ts — React Hook',
      techBadges: ['WCAG 2.1 AA', 'Focus Trap', 'A11Y', 'Semantic HTML']
    },
    eu: {
      title: 'PKE Web', subtitle: 'Irisgarritasuna eta Semantika', role: 'UX/A11Y Developer',
      objective: 'Irisgarritasuna oinarri duen plataforma. WCAG 2.1 AA betetzen du.',
      algorithmH: 'Focus Trapping eta ARIA Roles',
      algorithmP: 'DOM kudeaketa egokia teklatu bidezko nabigaziorako eta pantaila-irakurleentzako.',
      supabaseH: 'Diseinu Inklusiboa',
      supabaseP: 'Kontraste analisi erreala eta prefers-reduced-motion-erako euskarri natiboa.',
      outcomeH: '100% Lighthouse A11Y', outcomeP: 'Pertsona guztientzako interfaze erabilgarria, salbuespenik gabe.',
      codeSpotlight: 'useFocusTrap.ts — React Hook',
      techBadges: ['WCAG 2.1 AA', 'Focus Trap', 'A11Y', 'Semantic HTML']
    },
    fr: {
      title: 'PKE Web', subtitle: 'Accessibilité & Sémantique', role: 'UX/A11Y Developer',
      objective: 'Plateforme basée sur l\'accessibilité. Conformité WCAG 2.1 AA.',
      algorithmH: 'Focus Trapping & ARIA Roles',
      algorithmP: 'Gestion parfaite du DOM pour la navigation au clavier et les lecteurs d\'écran.',
      supabaseH: 'Design Inclusif',
      supabaseP: 'Analyse réelle du contraste et support natif de prefers-reduced-motion.',
      outcomeH: '100% Lighthouse A11Y', outcomeP: 'Interface accessible à tous sans exception.',
      codeSpotlight: 'useFocusTrap.ts — React Hook',
      techBadges: ['WCAG 2.1 AA', 'Focus Trap', 'A11Y', 'Semantic HTML']
    },
    it: {
      title: 'PKE Web', subtitle: 'Accessibilità & Semantica', role: 'UX/A11Y Developer',
      objective: 'Piattaforma dove l\'accessibilità è la base. Conformità WCAG 2.1 AA.',
      algorithmH: 'Focus Trapping & ARIA Roles',
      algorithmP: 'Gestione impeccabile del DOM per navigazione da tastiera e screen reader.',
      supabaseH: 'Design Inclusivo',
      supabaseP: 'Analisi reale del contrasto e supporto per prefers-reduced-motion.',
      outcomeH: '100% Lighthouse A11Y', outcomeP: 'Interfaccia utilizzabile da chiunque senza eccezioni.',
      codeSpotlight: 'useFocusTrap.ts — React Hook',
      techBadges: ['WCAG 2.1 AA', 'Focus Trap', 'A11Y', 'Semantic HTML']
    },
    de: {
      title: 'PKE Web', subtitle: 'Barrierefreiheit & Semantik', role: 'UX/A11Y Developer',
      objective: 'Plattform mit Fokus auf Barrierefreiheit. WCAG 2.1 AA-Konformität.',
      algorithmH: 'Focus Trapping & ARIA Roles',
      algorithmP: 'DOM-Management für Tastaturnavigation und Screenreader.',
      supabaseH: 'Inklusives Design',
      supabaseP: 'Echtzeit-Kontrastanalyse und Support für prefers-reduced-motion.',
      outcomeH: '100% Lighthouse A11Y', outcomeP: 'Uneingeschränkt nutzbare Schnittstelle für alle.',
      codeSpotlight: 'useFocusTrap.ts — React Hook',
      techBadges: ['WCAG 2.1 AA', 'Focus Trap', 'A11Y', 'Semantic HTML']
    },
    pt: {
      title: 'PKE Web', subtitle: 'Acessibilidade & Semântica', role: 'UX/A11Y Developer',
      objective: 'Plataforma baseada em acessibilidade. Conformidade WCAG 2.1 AA.',
      algorithmH: 'Focus Trapping & ARIA Roles',
      algorithmP: 'Gestão impecável do DOM para navegação por teclado e leitores de ecrã.',
      supabaseH: 'Design Inclusivo',
      supabaseP: 'Análise de contraste real e suporte nativo para prefers-reduced-motion.',
      outcomeH: '100% Lighthouse A11Y', outcomeP: 'Interface utilizável por todos sem exceções.',
      codeSpotlight: 'useFocusTrap.ts — React Hook',
      techBadges: ['WCAG 2.1 AA', 'Focus Trap', 'A11Y', 'Semantic HTML']
    },
    ca: {
      title: 'PKE Web', subtitle: 'Accessibilitat & Semàntica', role: 'UX/A11Y Developer',
      objective: 'Plataforma basada en l\'accessibilitat. Conformitat WCAG 2.1 AA.',
      algorithmH: 'Focus Trapping & ARIA Roles',
      algorithmP: 'Gestió perfecta del DOM per a navegació per teclat i lectors de pantalla.',
      supabaseH: 'Disseny Inclusiu',
      supabaseP: 'Anàlisi de contrast real i suport natiu per prefers-reduced-motion.',
      outcomeH: '100% Lighthouse A11Y', outcomeP: 'Interfície accessible per a tothom sense excepcions.',
      codeSpotlight: 'useFocusTrap.ts — React Hook',
      techBadges: ['WCAG 2.1 AA', 'Focus Trap', 'A11Y', 'Semantic HTML']
    },
    gl: {
      title: 'PKE Web', subtitle: 'Accesibilidade & Semántica', role: 'UX/A11Y Developer',
      objective: 'Plataforma baseada na accesibilidade. Cumprimento WCAG 2.1 AA.',
      algorithmH: 'Focus Trapping & ARIA Roles',
      algorithmP: 'Xestión perfecta do DOM para navegación por teclado e lectores de pantalla.',
      supabaseH: 'Deseño Inclusivo',
      supabaseP: 'Análise de contraste real e soporte nativo para prefers-reduced-motion.',
      outcomeH: '100% Lighthouse A11Y', outcomeP: 'Interface utilizable por calquera persoa sen excepcións.',
      codeSpotlight: 'useFocusTrap.ts — React Hook',
      techBadges: ['WCAG 2.1 AA', 'Focus Trap', 'A11Y', 'Semantic HTML']
    },
    ja: {
      title: 'PKE Web', subtitle: 'アクセシビリティ & セマンティクス', role: 'UX/A11Y デベロッパー',
      objective: 'アクセシビリティを基盤としたプラットフォーム。WCAG 2.1 AA 準拠。',
      algorithmH: 'フォーカストラップ & ARIA ロール',
      algorithmP: 'キーボードナビゲーションとスクリーンリーダーのための完璧な DOM 管理。',
      supabaseH: 'インクルーシブデザイン',
      supabaseP: '実際のコントラスト分析と prefers-reduced-motion のネイティブサポート。',
      outcomeH: '100% Lighthouse A11Y', outcomeP: '例外なく誰でも利用できるインターフェース。',
      codeSpotlight: 'useFocusTrap.ts — React Hook',
      techBadges: ['WCAG 2.1 AA', 'Focus Trap', 'A11Y', 'Semantic HTML']
    }
  }
};

export const CODE_SNIPPETS: Record<string, string> = {
  'ana-peluquera': `// useCreateBooking.ts — Firebase Orchestrator
export const handleBooking = async (bookingData: BookingPayload) => {
  const { service, startTime, phase2Min } = bookingData;
  const docRef = await db.collection("bookings").add({ ...bookingData, status: "confirmed", createdAt: serverTimestamp() });
  const phase1End = addMinutes(startTime, service.activeMin);
  const phase2End = addMinutes(phase1End, phase2Min);
  await calendar.events.insert({
    calendarId: process.env.GOOGLE_CALENDAR_ID!,
    requestBody: { summary: \`✂ \${service.name}\`, start: { dateTime: startTime.toISOString() }, end: { dateTime: phase1End.toISOString() } },
  });
  return { success: true, id: docRef.id, freeSlot: { phase1End, phase2End } };
};`,

  'who-are-ya-backend': `// players.controller.js — MongoDB Filter Engine
export const getPlayers = async (req, res) => {
  try {
    const { name, team, position } = req.query;
    const filter = {};
    if (name) filter.name = { $regex: name, $options: 'i' };
    if (team) {
      const teamDoc = await Team.findOne({ name: { $regex: team, $options: 'i' } });
      if (teamDoc) filter.teamId = teamDoc._id;
    }
    const players = await Player.find(filter).populate('teamId', 'name logo').populate('leagueId', 'name country').lean();
    res.json(players);
  } catch (error) { res.status(500).json({ message: 'Error', error }); }
};`,

  'rides24ofiziala': `// RideService.java — JAX-WS Atomic Seat Lock
@WebMethod
public synchronized BookingResult reserveSeat(String rideId, String userId, int seat) {
  EntityTransaction tx = em.getTransaction();
  try {
    tx.begin();
    Ride ride = em.find(Ride.class, rideId, LockModeType.PESSIMISTIC_WRITE);
    if (ride.getSeats().get(seat).isOccupied()) {
      tx.rollback();
      return BookingResult.error("Taken");
    }
    ride.occupySeat(seat, userId);
    em.merge(ride);
    tx.commit();
    return BookingResult.success(rideId, seat);
  } catch (Exception e) { if (tx.isActive()) tx.rollback(); throw new WebServiceException(e); }
}`,

  'spotshare-parking': `// parking.service.ts — Optimistic Locking
@Injectable()
export class ParkingService {
  async reserveSpot(spotId: string, userId: string, currentVersion: number) {
    const result = await this.db.spots.updateOne(
      { _id: spotId, version: currentVersion, status: 'AVAILABLE' },
      { $set: { status: 'OCCUPIED', reservedBy: userId }, $inc: { version: 1 } }
    );
    if (result.modifiedCount === 0) throw new ConcurrencyException('State mutated');
    return true;
  }
}`,

  'pke_web': `// useFocusTrap.ts — WCAG 2.1 AA Hook
export const useFocusTrap = (ref: RefObject<HTMLElement>, isActive: boolean) => {
  useEffect(() => {
    if (!isActive || !ref.current) return;
    const focusable = ref.current.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    const first = focusable[0] as HTMLElement;
    const last = focusable[focusable.length - 1] as HTMLElement;
    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', handleTab);
    return () => document.removeEventListener('keydown', handleTab);
  }, [isActive, ref]);
};`
};