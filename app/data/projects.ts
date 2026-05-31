// app/lib/projects-data.ts
import type { Lang } from "../types";

export interface ProjectContent {
  title: string;
  subtitle: string;
  role: string;
  objective: string;
  algorithmH: string;
  algorithmP: string;
  supabaseH: string;
  supabaseP: string;
  outcomeH: string;
  outcomeP: string;
  codeSpotlight: string;
  techBadges: string[];
}

export const PROJECTS_CONTENT: Record<
  string,
  Partial<Record<Lang, ProjectContent>>
> = {
  "ana-peluquera": {
    es: {
      title: "AG Beauty Salon",
      subtitle: "Booking Orchestration & CMS",
      role: "Full-Stack Lead Architect",
      objective:
        "Digitalizar un negocio premium sin perder sensaciones de lujo: reserva sin fricción, control total para la propietaria y una interfaz que transmite confianza desde el primer segundo.",
      algorithmH: "Algoritmo Sandwich: Scheduling Inteligente",
      algorithmP:
        "La disponibilidad se divide en fases Active-Wait-Active para liberar huecos con precisión y permitir reservas paralelas sin colisiones.",
      supabaseH: "Firebase + Google Calendar",
      supabaseP:
        "Arquitectura NoSQL con sincronización atómica bidireccional, Service Accounts y Firestore para mantener calendario y reservas siempre alineados.",
      outcomeH: "Impacto Real",
      outcomeP:
        "Facturación +30%, carga inicial < 300ms y un flujo de reserva que se siente instantáneo.",
      codeSpotlight: "useCreateBooking.ts — Booking Core",
      techBadges: [
        "Atomic Transactions",
        "Firebase",
        "Google Calendar API",
        "Bcrypt",
      ],
    },
    en: {
      title: "AG Beauty Salon",
      subtitle: "Booking Orchestration & CMS",
      role: "Full-Stack Lead Architect",
      objective:
        "Digitize a premium business without losing the luxury feel: zero-friction booking, full-owner control, and an interface that builds trust instantly.",
      algorithmH: "Sandwich Algorithm: Smart Scheduling",
      algorithmP:
        "Availability is split into Active-Wait-Active phases to release slots with precision and enable parallel bookings without collisions.",
      supabaseH: "Firebase + Google Calendar",
      supabaseP:
        "Atomic bidirectional sync across Service Accounts and Firestore keeps the calendar and reservations perfectly aligned.",
      outcomeH: "Real Impact",
      outcomeP:
        "Revenue +30%, initial load < 300ms and a booking flow that feels immediate.",
      codeSpotlight: "useCreateBooking.ts — Booking Core",
      techBadges: [
        "Atomic Transactions",
        "Firebase",
        "Google Calendar API",
        "Bcrypt",
      ],
    },
    eu: {
      title: "AG Beauty Salon",
      subtitle: "Erreserbak eta CMS",
      role: "Full-Stack Lead Architect",
      objective:
        "Goi mailako negozio baten digitalizazioa. Erreserba sistema erraza eta jabearentzat kontrol osoa.",
      algorithmH: "Sandwich Algoritmoa: O(n) Optimizazioa",
      algorithmP:
        "Zerbitzuak Active-Wait-Active fasetan banatzen ditu, tarte libreak automatikoki aprobetxatuz.",
      supabaseH: "Firebase + Google Calendar",
      supabaseP:
        "NoSQL arkitektura Firestore bidez eta Google Calendarrekin sinkronizazio atomikoa.",
      outcomeH: "Eragin Erreala",
      outcomeP: "Fakturazioa %30 hazi da eta karga < 300ms.",
      codeSpotlight: "useCreateBooking.ts — Firebase",
      techBadges: [
        "Atomic Transactions",
        "Firebase",
        "Google Calendar API",
        "Bcrypt",
      ],
    },
    fr: {
      title: "AG Beauty Salon",
      subtitle: "Réservations & CMS",
      role: "Full-Stack Lead Architect",
      objective:
        "Numérisation totale d'un salon de luxe. Réservation fluide et contrôle total pour la propriétaire.",
      algorithmH: "Algorithme Sandwich : Optimisation O(n)",
      algorithmP:
        "Divise les services en phases Active-Wait-Active pour libérer des créneaux en parallèle.",
      supabaseH: "Firebase + Google Calendar",
      supabaseP:
        "Architecture NoSQL avec synchronisation bidirectionnelle atomique.",
      outcomeH: "Impact Réel",
      outcomeP: "Chiffre d'affaires +30%, chargement < 300ms.",
      codeSpotlight: "useCreateBooking.ts — Firebase",
      techBadges: [
        "Atomic Transactions",
        "Firebase",
        "Google Calendar API",
        "Bcrypt",
      ],
    },
    it: {
      title: "AG Beauty Salon",
      subtitle: "Prenotazioni & CMS",
      role: "Full-Stack Lead Architect",
      objective:
        "Digitalizzazione totale. Esperienza di prenotazione fluida e gestione completa per la titolare.",
      algorithmH: "Algoritmo Sandwich: Ottimizzazione O(n)",
      algorithmP:
        "Divide i servizi in fasi Active-Wait-Active, liberando slot per prenotazioni parallele.",
      supabaseH: "Firebase + Google Calendar",
      supabaseP:
        "Architettura NoSQL con sincronizzazione atomica bidirezionale.",
      outcomeH: "Impatto Reale",
      outcomeP: "Fatturato +30%, caricamento < 300ms.",
      codeSpotlight: "useCreateBooking.ts — Firebase",
      techBadges: [
        "Atomic Transactions",
        "Firebase",
        "Google Calendar API",
        "Bcrypt",
      ],
    },
    de: {
      title: "AG Beauty Salon",
      subtitle: "Buchung & CMS",
      role: "Full-Stack Lead Architect",
      objective:
        "Vollständige Digitalisierung eines Luxus-Salons. Ziel: reibungslose Buchung und volle Kontrolle.",
      algorithmH: "Sandwich-Algorithmus: O(n) Optimierung",
      algorithmP:
        "Teilt Dienste in Active-Wait-Active-Phasen auf, um parallele Termine zu ermöglichen.",
      supabaseH: "Firebase + Google Calendar",
      supabaseP:
        "NoSQL-Architektur mit atomarer bidirektionaler Synchronisierung.",
      outcomeH: "Echte Wirkung",
      outcomeP: "Umsatz +30%, Ladezeit < 300ms.",
      codeSpotlight: "useCreateBooking.ts — Firebase",
      techBadges: [
        "Atomic Transactions",
        "Firebase",
        "Google Calendar API",
        "Bcrypt",
      ],
    },
    pt: {
      title: "AG Beauty Salon",
      subtitle: "Reservas & CMS",
      role: "Full-Stack Lead Architect",
      objective:
        "Digitalização total. Foco em experiência de reserva fluida e controle total para o proprietário.",
      algorithmH: "Algoritmo Sandwich: Otimização O(n)",
      algorithmP:
        "Divide serviços em fases para permitir reservas paralelas automaticamente.",
      supabaseH: "Firebase + Google Calendar",
      supabaseP: "Arquitetura NoSQL com sincronização bidirecional atómica.",
      outcomeH: "Impacto Real",
      outcomeP: "Faturação +30%, carga < 300ms.",
      codeSpotlight: "useCreateBooking.ts — Firebase",
      techBadges: [
        "Atomic Transactions",
        "Firebase",
        "Google Calendar API",
        "Bcrypt",
      ],
    },
    ca: {
      title: "AG Beauty Salon",
      subtitle: "Reserves & CMS",
      role: "Full-Stack Lead Architect",
      objective:
        "Digitalització total d'un saló de luxe. Reserva sense fricció i control total per a la propietària.",
      algorithmH: "Algorisme Sandwich: Optimització O(n)",
      algorithmP:
        "Divideix serveis en fases per alliberar forats al calendari per a reserves paral·leles.",
      supabaseH: "Firebase + Google Calendar",
      supabaseP: "Arquitectura NoSQL amb sincronització bidireccional atòmica.",
      outcomeH: "Impacte Real",
      outcomeP: "Facturació +30%, càrrega < 300ms.",
      codeSpotlight: "useCreateBooking.ts — Firebase",
      techBadges: [
        "Atomic Transactions",
        "Firebase",
        "Google Calendar API",
        "Bcrypt",
      ],
    },
    gl: {
      title: "AG Beauty Salon",
      subtitle: "Reservas & CMS",
      role: "Full-Stack Lead Architect",
      objective:
        "Dixitalización total dun salón de luxo. Reserva sen fricción e control total para a dona.",
      algorithmH: "Algoritmo Sandwich: Optimización O(n)",
      algorithmP:
        "Divide servizos en fases para liberar o calendario para reservas en paralelo.",
      supabaseH: "Firebase + Google Calendar",
      supabaseP: "Arquitectura NoSQL con sincronización bidireccional atómica.",
      outcomeH: "Impacto Real",
      outcomeP: "Facturación +30%, carga < 300ms.",
      codeSpotlight: "useCreateBooking.ts — Firebase",
      techBadges: [
        "Atomic Transactions",
        "Firebase",
        "Google Calendar API",
        "Bcrypt",
      ],
    },
    ja: {
      title: "AG 美容院",
      subtitle: "予約 & CMS",
      role: "フルスタックリードアーキテクト",
      objective:
        "高級サロンの完全デジタル化。顧客にはシームレスな予約を、オーナーには完全な管理権限を。",
      algorithmH: "サンドイッチアルゴリズム: O(n) 最適化",
      algorithmP:
        "サービスをアクティブ・待機・アクティブに分割し、並行予約を自動的に可能にします。",
      supabaseH: "Firebase + Google カレンダー",
      supabaseP:
        "Firestore を使用した NoSQL アーキテクチャ。Google カレンダー API とのアトミックな同期。",
      outcomeH: "実際の影響",
      outcomeP: "収益が 30% 増加し、読み込み時間は 300 ミリ秒未満。",
      codeSpotlight: "useCreateBooking.ts — Firebase",
      techBadges: [
        "Atomic Transactions",
        "Firebase",
        "Google Calendar API",
        "Bcrypt",
      ],
    },
    zh: {
      title: "AG 美容沙龙",
      subtitle: "预约编排与内容管理系统",
      role: "全栈首席架构师",
      objective:
        "在不失奢华感的前提下实现高端业务数字化：无缝预约流程、为店主提供完全管理权限，以及从首秒起便传递信任的精致界面。",
      algorithmH: "三明治算法：智能调度",
      algorithmP:
        "将服务时长拆分为“活跃-等待-活跃”三阶段，以精确释放空闲时段，允许无冲突的并行预约。",
      supabaseH: "Firebase + 谷歌日历",
      supabaseP:
        "通过服务账号与 Firestore 实现原子级的双向同步，确保日历和预订始终保持完美一致。",
      outcomeH: "真实成效",
      outcomeP:
        "营收提升 30%，首屏加载时间小于 300 毫秒，且预约操作如丝般顺滑。",
      codeSpotlight: "useCreateBooking.ts — 核心预订引擎",
      techBadges: [
        "Atomic Transactions",
        "Firebase",
        "Google Calendar API",
        "Bcrypt",
      ],
    },
    ar: {
      title: "AG Beauty Salon",
      subtitle: "تنسيق الحجوزات ونظام إدارة المحتوى",
      role: "كبير مهندسي البرمجيات متكامل الخدمات",
      objective:
        "رقمنة صالون تجميل راقٍ دون فقدان الطابع الفاخر: تجربة حجز خالية من العوائق، تحكم كامل للمالكة، وواجهة مريحة تبني الثقة فوراً.",
      algorithmH: "خوارزمية الساندوتش: جدولة ذكية",
      algorithmP:
        "يتم تقسيم توافر الوقت إلى مراحل (نشط - انتظار - نشط) لتحرير الخانات بدقة وإتاحة حجوزات متوازية دون تضارب.",
      supabaseH: "Firebase + Google Calendar",
      supabaseP:
        "بنية NoSQL مع تزامن ثنائي الاتجاه من خلال حسابات الخدمة و Firestore للحفاظ على محاذاة التقويم والحجوزات بدقة.",
      outcomeH: "الأثر الفعلي",
      outcomeP:
        "زيادة الإيرادات بنسبة 30٪، وقت تحميل أولي أقل من 300 مللي ثانية، وتدفق حجز فوري للغاية.",
      codeSpotlight: "useCreateBooking.ts — محرك الحجوزات الأساسи",
      techBadges: [
        "Atomic Transactions",
        "Firebase",
        "Google Calendar API",
        "Bcrypt",
      ],
    },
    ru: {
      title: "AG Beauty Salon",
      subtitle: "Оркестрация бронирования и CMS",
      role: "Ведущий архитектор Full-Stack",
      objective:
        "Оцифровать бизнес премиум-класса без потери атмосферы роскоши: бронирование без трения, полный контроль для владельца и интерфейс, вызывающий мгновенное доверие.",
      algorithmH: "Алгоритм Sandwich: интеллектуальное планирование",
      algorithmP:
        "Доступность делится на фазы Active-Wait-Active для точного высвобождения слотов и параллельного бронирования без конфликтов.",
      supabaseH: "Firebase + Google Calendar",
      supabaseP:
        "Атомарная двунаправленная синхронизация между сервисными аккаунтами и Firestore поддерживает календарь и бронирования в идеальном соответствии.",
      outcomeH: "Реальный эффект",
      outcomeP:
        "+30% к выручке, начальная загрузка < 300 мс и мгновенный процесс бронирования.",
      codeSpotlight: "useCreateBooking.ts — Ядро бронирования",
      techBadges: [
        "Atomic Transactions",
        "Firebase",
        "Google Calendar API",
        "Bcrypt",
      ],
    },
    ko: {
      title: "AG Beauty Salon",
      subtitle: "예약 오케스트레이션 & CMS",
      role: "풀스택 수석 아키텍트",
      objective:
        "고급스러운 느낌을 유지하며 프리미엄 비즈니스를 디지털화합니다. 마찰 없는 예약, 완벽한 소유자 제어, 즉각적인 신뢰를 주는 인터페이스를 제공합니다.",
      algorithmH: "샌드위치 알고리즘: 스마트 스케줄링",
      algorithmP:
        "예약 가능 시간을 Active-Wait-Active 단계로 분할하여 슬롯을 정밀하게 해제하고 충돌 없는 병렬 예약을 가능하게 합니다.",
      supabaseH: "Firebase + Google Calendar",
      supabaseP:
        "서비스 계정과 Firestore 간의 원자적 양방향 동기화로 캘린더와 예약 현황을 완벽하게 동기화합니다.",
      outcomeH: "실제 효과",
      outcomeP:
        "매출 30% 증가, 초기 로딩 속도 300ms 미만, 즉각적인 예약 흐름 구현.",
      codeSpotlight: "useCreateBooking.ts — 예약 코어",
      techBadges: [
        "Atomic Transactions",
        "Firebase",
        "Google Calendar API",
        "Bcrypt",
      ],
    },
    hi: {
      title: "AG Beauty Salon",
      subtitle: "बुकिंग ऑर्केस्ट्रेशन और सीएमएस",
      role: "फुल-स्टैक लीड आर्किटेक्ट",
      objective:
        "लक्ज़री अनुभव को खोए बिना एक प्रीमियम व्यवसाय को डिजिटल बनाना: घर्षण-रहित बुकिंग, मालिक का पूर्ण नियंत्रण और एक ऐसा इंटरफ़ेस जो तुरंत विश्वास जगाए।",
      algorithmH: "सैंडविच एल्गोरिथम: स्मार्ट शेड्यूलिंग",
      algorithmP:
        "उपलब्धता को एक्टिव-वेट-एक्टिव चरणों में विभाजित किया जाता है ताकि सटीकता से स्लॉट जारी किए जा सकें और बिना किसी टकराव के समानांतर बुकिंग की जा सके।",
      supabaseH: "Firebase + Google Calendar",
      supabaseP:
        "सर्विस अकाउंट्स और फायरस्टोर में परमाणु द्वि-दिशात्मक सिंक्रناइज़ेशन कैलेंडर और बुकिंग को पूरी तरह से संरेखित रखता है।",
      outcomeH: "वास्तविक प्रभाव",
      outcomeP:
        "राजस्व में 30% की वृद्धि, प्रारंभिक लोड समय 300ms से कम और बुकिंग प्रक्रिया जो तुरंत काम करती है।",
      codeSpotlight: "useCreateBooking.ts — बुकिंग कोर",
      techBadges: [
        "Atomic Transactions",
        "Firebase",
        "Google Calendar API",
        "Bcrypt",
      ],
    },
    tr: {
      title: "AG Beauty Salon",
      subtitle: "Rezervasyon Orkestrasyonu & CMS",
      role: "Full-Stack Baş Mimar",
      objective:
        "Lüks hissini kaybetmeden premium bir işletmeyi dijitalleştirmek: sıfır sürtünmeli rezervasyon, tam sahip kontrolü ve anında güven inşa eden bir arayüz.",
      algorithmH: "Sandviç Algoritması: Akıllı Planlama",
      algorithmP:
        "Çakışma olmadan paralel rezervasyonları etkinleştirmek ve zaman dilimlerini hassasiyetle serbest bırakmak için kullanılabilirlik Aktif-Bekleme-Aktif aşamalarına ayrılır.",
      supabaseH: "Firebase + Google Calendar",
      supabaseP:
        "Servis Hesapları ve Firestore arasındaki atomik çift yönlü senkronizasyon, takvimi ve rezervasyonları mükemmel şekilde uyumlu tutar.",
      outcomeH: "Gerçek Etki",
      outcomeP:
        "Ciro +30%, ilk yükleme < 300ms ve anında hissettiren bir rezervasyon akışı.",
      codeSpotlight: "useCreateBooking.ts — Rezervasyon Çekirdeği",
      techBadges: [
        "Atomic Transactions",
        "Firebase",
        "Google Calendar API",
        "Bcrypt",
      ],
    },
    nl: {
      title: "AG Beauty Salon",
      subtitle: "Boeking Orchestratie & CMS",
      role: "Full-Stack Hoofdarchitect",
      objective:
        "Digitaliseer een premium bedrijf zonder het luxe gevoel te verliezen: wrijvingsloos boeken, volledige controle voor de eigenaar en een interface die direct vertrouwen wekt.",
      algorithmH: "Sandwich-algoritme: Slimme Planning",
      algorithmP:
        "Beschikbaarheid wordt opgesplitst in Actief-Wacht-Actief fasen om slots nauwkeurig vrij te geven en parallelle boekingen zonder botsingen mogelijk te maken.",
      supabaseH: "Firebase + Google Calendar",
      supabaseP:
        "Atomische bidirectionele synchronisatie via Service Accounts en Firestore houdt de kalender en reserveringen perfect op elkaar afgestemd.",
      outcomeH: "Echte Impact",
      outcomeP:
        "Omzet +30%, initiële laadtijd < 300ms en een boekingsstroom die onmiddellijk aanvoelt.",
      codeSpotlight: "useCreateBooking.ts — Boekingskern",
      techBadges: [
        "Atomic Transactions",
        "Firebase",
        "Google Calendar API",
        "Bcrypt",
      ],
    },
    sv: {
      title: "AG Beauty Salon",
      subtitle: "Bokningsorkestrering & CMS",
      role: "Full-Stack Chefsarkitekt",
      objective:
        "Digitalisera en premiumverksamhet utan att förlora lyxkänslan: friktionsfri bokning, full kontroll för ägaren och ett gränssnitt som bygger förtroende direkt.",
      algorithmH: "Sandwich-algoritmen: Smart Schemaläggning",
      algorithmP:
        "Tillgänglighet delas upp i Aktiv-Vänta-Aktiv-faser för att frigöra tidsluckor med precision och möjliggöra parallella bokningar utan krockar.",
      supabaseH: "Firebase + Google Calendar",
      supabaseP:
        "Atomisk dubbelriktad synkronisering via servicekonton och Firestore håller kalern och bokningarna perfekt samordnade.",
      outcomeH: "Verklig Effekt",
      outcomeP:
        "Omsättning +30%, initial laddning < 300ms och ett bokningsflöde som känns omedelbart.",
      codeSpotlight: "useCreateBooking.ts — Bokningskärna",
      techBadges: [
        "Atomic Transactions",
        "Firebase",
        "Google Calendar API",
        "Bcrypt",
      ],
    },
    pl: {
      title: "AG Beauty Salon",
      subtitle: "Orkiestracja Rezerwacji & CMS",
      role: "Główny Architekt Full-Stack",
      objective:
        "Cyfryzacja biznesu premium bez utraty poczucia luksusu: bezproblemowa rezerwacja, pełna kontrola właściciela i interfejs, który błyskawicznie buduje zaufanie.",
      algorithmH: "Algorytm Sandwich: Inteligentne Planowanie",
      algorithmP:
        "Dostępność jest dzielona na fazy Aktywna-Czekanie-Aktywna, co pozwala precyzyjnie zwalniać terminy i umożliwia równoległe rezerwacje bez kolizji.",
      supabaseH: "Firebase + Google Calendar",
      supabaseP:
        "Atomiczna dwukierunkowa synchronizacja między kontami usług a Firestore utrzymuje kalendarz i rezerwacje w doskonałej zgodności.",
      outcomeH: "Realny Wpływ",
      outcomeP:
        "Przychody +30%, czas ładowania początkowego < 300ms i natychmiastowy proces rezerwacji.",
      codeSpotlight: "useCreateBooking.ts — Rdzeń Rezerwacji",
      techBadges: [
        "Atomic Transactions",
        "Firebase",
        "Google Calendar API",
        "Bcrypt",
      ],
    },
    vi: {
      title: "AG Beauty Salon",
      subtitle: "Hệ thống Quản lý Đặt lịch & CMS",
      role: "Kiến trúc sư trưởng Full-Stack",
      objective:
        "Số hóa một doanh nghiệp cao cấp mà không làm mất đi cảm giác sang trọng: quy trình đặt lịch không ma sát, chủ sở hữu toàn quyền kiểm soát và giao diện tạo dựng niềm tin ngay lập tức.",
      algorithmH: "Thuật toán Sandwich: Lập lịch Thông minh",
      algorithmP:
        "Thời gian trống được chia thành các giai đoạn Hoạt động-Chờ-Hoạt động để giải phóng vị trí chính xác và cho phép đặt lịch song song không xung đột.",
      supabaseH: "Firebase + Google Calendar",
      supabaseP:
        "Đồng bộ hóa hai chiều nguyên tử (atomic) giữa Service Accounts và Firestore giúp lịch trình và các lượt đặt lịch luôn khớp hoàn hảo.",
      outcomeH: "Tác động Thực tế",
      outcomeP:
        "Doanh thu tăng 30%, tải trang ban đầu < 300ms và luồng đặt lịch diễn ra ngay tức thì.",
      codeSpotlight: "useCreateBooking.ts — Nhân đặt lịch core",
      techBadges: [
        "Atomic Transactions",
        "Firebase",
        "Google Calendar API",
        "Bcrypt",
      ],
    },
  },

  "who-are-ya-backend": {
    es: {
      title: "Who Are Ya?",
      subtitle: "Football Identity Engine",
      role: "Backend Architect",
      objective:
        "Construir el backend de un juego con ritmo de producto real: búsquedas rápidas, datos consistentes y una base preparada para escalar sin perder control.",
      algorithmH: "MVC & MongoDB Intelligence",
      algorithmP:
        "ObjectIds, populate y filtros compuestos se combinan para cruzar miles de jugadores con latencia mínima.",
      supabaseH: "JWT + Bcrypt Security Layer",
      supabaseP:
        "Autenticación blindada para el panel CMS con sesiones protegidas y control estricto de acceso al servidor.",
      outcomeH: "Producción Real",
      outcomeP:
        "API REST desplegada en Render con MongoDB Atlas y preparada para operar como producto estable.",
      codeSpotlight: "players.controller.js — Filter Engine",
      techBadges: ["Node.js", "MongoDB", "JWT", "Bcrypt", "MVC"],
    },
    en: {
      title: "Who Are Ya?",
      subtitle: "Football Identity Engine",
      role: "Backend Architect",
      objective:
        "Build the backend of a game with the feel of a real product: fast search, consistent data, and a foundation that can scale without losing control.",
      algorithmH: "MVC & MongoDB Intelligence",
      algorithmP:
        "ObjectIds, populate and compound filters work together to cross-match thousands of players with minimal latency.",
      supabaseH: "JWT + Bcrypt Security Layer",
      supabaseP:
        "Hardened CMS authentication with protected sessions and strict server-side access control.",
      outcomeH: "Real Production",
      outcomeP:
        "REST API deployed on Render with MongoDB Atlas and ready to operate as a stable product.",
      codeSpotlight: "players.controller.js — Filter Engine",
      techBadges: ["Node.js", "MongoDB", "JWT", "Bcrypt", "MVC"],
    },
    eu: {
      title: "Who Are Ya?",
      subtitle: "Futbol Jokoaren Backend-a",
      role: "Backend Architect",
      objective:
        "Futbol joko ezagunaren klona. Erronka: milaka jokalari eta liga milisegundotan filtratzea.",
      algorithmH: "MVC Arkitektura eta MongoDB",
      algorithmP:
        'ObjectId-ak eta Mongoose "populate" erabiliz datu harreman konplexuak eta azkarrak kudeatzea.',
      supabaseH: "JWT eta Bcrypt Segurtasuna",
      supabaseP:
        "Administratzaile autentifikazio segurua eta zerbitzariko saio babestuak CMS panelerako.",
      outcomeH: "Produkzioan",
      outcomeP: "REST API-a Render-en eta MongoDB Atlas-en erabilgarri.",
      codeSpotlight: "players.controller.js — Filter Engine",
      techBadges: ["Node.js", "MongoDB", "JWT", "Bcrypt", "MVC"],
    },
    fr: {
      title: "Who Are Ya?",
      subtitle: "Backend Jeu de Foot",
      role: "Backend Architect",
      objective:
        "Clone d'un jeu célèbre. Défi : filtrer des milliers de joueurs en quelques millisecondes.",
      algorithmH: "Architecture MVC & MongoDB",
      algorithmP:
        'Relations complexes via ObjectIds et Mongoose "populate" pour des recherches ultra-rapides.',
      supabaseH: "Sécurité JWT & Bcrypt",
      supabaseP:
        "Authentification admin robuste et sessions sécurisées pour le tableau de bord CMS.",
      outcomeH: "Production Réelle",
      outcomeP: "API REST déployée sur Render avec MongoDB Atlas.",
      codeSpotlight: "players.controller.js — Filter Engine",
      techBadges: ["Node.js", "MongoDB", "JWT", "Bcrypt", "MVC"],
    },
    it: {
      title: "Who Are Ya?",
      subtitle: "Backend Gioco Calcio",
      role: "Backend Architect",
      objective:
        "Clone del famoso gioco. Sfida: filtrare migliaia di giocatori e campionati in millisecondi.",
      algorithmH: "Architettura MVC & MongoDB",
      algorithmP:
        'Relazioni complesse tramite ObjectIds e Mongoose "populate" per ricerche dati veloci.',
      supabaseH: "Sicurezza JWT & Bcrypt",
      supabaseP:
        "Autenticazione amministratore blindata e sessioni server protette per il CMS.",
      outcomeH: "Produzione",
      outcomeP: "API REST su Render con MongoDB Atlas.",
      codeSpotlight: "players.controller.js — Filter Engine",
      techBadges: ["Node.js", "MongoDB", "JWT", "Bcrypt", "MVC"],
    },
    de: {
      title: "Who Are Ya?",
      subtitle: "Fußballspiel-Backend",
      role: "Backend Architect",
      objective:
        "Klon des berühmten Spiels. Herausforderung: Tausende Spieler in Millisekunden filtern.",
      algorithmH: "MVC-Architektur & MongoDB",
      algorithmP:
        'Komplexe Beziehungen über ObjectIds und Mongoose "populate" für schnellen Datenzugriff.',
      supabaseH: "JWT & Bcrypt Sicherheit",
      supabaseP:
        "Gesicherte Admin-Authentifizierung und Server-Sitzungen für das CMS.",
      outcomeH: "Echte Produktion",
      outcomeP: "REST API auf Render mit MongoDB Atlas.",
      codeSpotlight: "players.controller.js — Filter Engine",
      techBadges: ["Node.js", "MongoDB", "JWT", "Bcrypt", "MVC"],
    },
    pt: {
      title: "Who Are Ya?",
      subtitle: "Backend Jogo Futebol",
      role: "Backend Architect",
      objective:
        "Clone do jogo famoso. Desafio: filtrar milhares de jogadores em milissegundos.",
      algorithmH: "Arquitetura MVC & MongoDB",
      algorithmP:
        'Relacionamentos complexos via ObjectIds e Mongoose "populate" para busca rápida.',
      supabaseH: "Segurança JWT & Bcrypt",
      supabaseP:
        "Autenticação de administrador segura e sessões protegidas para o CMS.",
      outcomeH: "Produção Real",
      outcomeP: "API REST em Render com MongoDB Atlas.",
      codeSpotlight: "players.controller.js — Filter Engine",
      techBadges: ["Node.js", "MongoDB", "JWT", "Bcrypt", "MVC"],
    },
    ca: {
      title: "Who Are Ya?",
      subtitle: "Backend Joc de Futbol",
      role: "Backend Architect",
      objective:
        "Clon del famós joc. El repte: filtrar milers de jugadors i lligues en mil·lisegons.",
      algorithmH: "Arquitectura MVC & MongoDB",
      algorithmP:
        'Relacions complexes mitjançant ObjectIds i Mongoose "populate" per a cerques ràpides.',
      supabaseH: "Seguretat JWT & Bcrypt",
      supabaseP:
        "Autenticació admin blindada i sessions protegides per al CMS.",
      outcomeH: "Producció Real",
      outcomeP: "API REST desplegada a Render amb MongoDB Atlas.",
      codeSpotlight: "players.controller.js — Filter Engine",
      techBadges: ["Node.js", "MongoDB", "JWT", "Bcrypt", "MVC"],
    },
    gl: {
      title: "Who Are Ya?",
      subtitle: "Backend Xogo Fútbol",
      role: "Backend Architect",
      objective:
        "Clon do famoso xogo. O reto: filtrar miles de xogadores en milisegundos.",
      algorithmH: "Arquitectura MVC & MongoDB",
      algorithmP:
        'Relacións complexas mediante ObjectIds e Mongoose "populate" para buscas veloces.',
      supabaseH: "Seguridade JWT & Bcrypt",
      supabaseP:
        "Autenticación admin protexida e sesións de servidor para o CMS.",
      outcomeH: "Produción Real",
      outcomeP: "API REST en Render con MongoDB Atlas.",
      codeSpotlight: "players.controller.js — Filter Engine",
      techBadges: ["Node.js", "MongoDB", "JWT", "Bcrypt", "MVC"],
    },
    ja: {
      title: "Who Are Ya?",
      subtitle: "サッカーゲーム バックエンド",
      role: "バックエンドアーキテクト",
      objective:
        "有名なゲームのクローン。数千人のプレイヤーやリーグをミリ秒単位でフィルタリングします。",
      algorithmH: "MVC アーキテクチャ & MongoDB",
      algorithmP:
        'ObjectIds と Mongoose の "populate" を使用して、高速なデータ検索のための複雑な関係を構築。',
      supabaseH: "JWT & Bcrypt セキュリティ",
      supabaseP:
        "CMS ダッシュボード用の管理者認証と保護されたサーバーセッション。",
      outcomeH: "実稼働",
      outcomeP: "MongoDB Atlas を使用して Render にデプロイされた REST API。",
      codeSpotlight: "players.controller.js — Filter Engine",
      techBadges: ["Node.js", "MongoDB", "JWT", "Bcrypt", "MVC"],
    },
    zh: {
      title: "Who Are Ya?",
      subtitle: "足球身份竞猜引擎",
      role: "后端架构师",
      objective:
        "以真实产品标准打造游戏后端：闪电般的检索速度、高一致性数据架构，以及支持平滑扩展的稳固基石。",
      algorithmH: "MVC 架构与 MongoDB 高效索引",
      algorithmP:
        "巧妙结合 ObjectIds、关联填充(populate)和复合过滤器，以极低延迟对数千名球员进行交叉匹配。",
      supabaseH: "JWT + Bcrypt 安全屏障",
      supabaseP:
        "为内容管理系统(CMS)后台提供严密的身份验证、受保护的会话以及严格的服务器端访问控制。",
      outcomeH: "实战交付",
      outcomeP:
        "在 Render 平台部署了基于 MongoDB Atlas 的 REST API，并已做好了作为稳定产品运营的准备。",
      codeSpotlight: "players.controller.js — 过滤器引擎",
      techBadges: ["Node.js", "MongoDB", "JWT", "Bcrypt", "MVC"],
    },
    ar: {
      title: "Who Are Ya?",
      subtitle: "محرك هوية كرة القدم",
      role: "مهندس الخلفية البرمجية",
      objective:
        "بناء الخلفية البرمجية للعبة تشعر كأنها منتج حقيقي: بحث سريع، بيانات متسقة، وأساس متين يمكنه التوسع بسهولة.",
      algorithmH: "هيكلية MVC وذكاء MongoDB",
      algorithmP:
        "تتحد معرّفات الكائنات ObjectIds والتعبئة (populate) والفلاتر المركبة للبحث المتقاطع بين آلاف اللاعبين بحد أدنى من زمن الوصول.",
      supabaseH: "طبقة الحماية عبر JWT + Bcrypt",
      supabaseP:
        "مصادقة قوية للغاية للوحة تحكم إدارة المحتوى (CMS) مع جلسات محمية وتحكم صارم في الوصول على جانب الخادم.",
      outcomeH: "الإنتاج الفعلي",
      outcomeP:
        "واجهة برمجة تطبيقات REST تم نشرها على Render مع MongoDB Atlas وجاهزة للعمل كمنتج مستقر.",
      codeSpotlight: "players.controller.js — محرك التصفية",
      techBadges: ["Node.js", "MongoDB", "JWT", "Bcrypt", "MVC"],
    },
    ru: {
      title: "Who Are Ya?",
      subtitle: "Football Identity Engine",
      role: "Backend Architect",
      objective:
        "Создать бэкенд для игры с динамикой реального продукта: быстрый поиск, согласованные данные и основа, готовая к масштабированию без потери контроля.",
      algorithmH: "Интеллект MVC и MongoDB",
      algorithmP:
        "Сочетание ObjectIds, populate и составных фильтров позволяет сопоставлять тысячи игроков с минимальной задержкой.",
      supabaseH: "Слой безопасности JWT + Bcrypt",
      supabaseP:
        "Защищенная аутентификация для панели CMS с защищенными сессиями и строгим контролем доступа на стороне сервера.",
      outcomeH: "Реальный продакшн",
      outcomeP:
        "REST API развернуто на Render с использованием MongoDB Atlas и готово к работе в качестве стабильного продукта.",
      codeSpotlight: "players.controller.js — Движок фильтрации",
      techBadges: ["Node.js", "MongoDB", "JWT", "Bcrypt", "MVC"],
    },
    ko: {
      title: "Who Are Ya?",
      subtitle: "축구 아이덴티티 엔진",
      role: "백엔드 아키텍트",
      objective:
        "실제 제품 수준의 게임 백엔드 구축: 신속한 검색, 일관된 데이터, 제어력을 유지하며 확장이 가능한 아키텍처.",
      algorithmH: "MVC & MongoDB 인텔리전스",
      algorithmP:
        "ObjectIds, populate 및 복합 필터가 함께 작동하여 최소한의 지연 시간으로 수천 명의 선수를 교차 검색합니다.",
      supabaseH: "JWT + Bcrypt 보안 레이어",
      supabaseP:
        "보호된 세션과 엄격한 서버 측 액세스 제어를 지원하는 CMS 패널용 강화된 인증 시스템.",
      outcomeH: "실제 프로덕션",
      outcomeP:
        "MongoDB Atlas를 사용하여 Render에 배포되어 안정적인 운영이 가능한 REST API.",
      codeSpotlight: "players.controller.js — 필터 엔진",
      techBadges: ["Node.js", "MongoDB", "JWT", "Bcrypt", "MVC"],
    },
    hi: {
      title: "Who Are Ya?",
      subtitle: "फुटबॉल पहचान इंजन",
      role: "बैकएंड आर्किटेक्ट",
      objective:
        "एक वास्तविक उत्पाद की तरह खेल का बैकएंड बनाना: तेज़ खोज, सुसंगत डेटा और बिना नियंत्रण खोए स्केल करने के लिए तैयार आधार।",
      algorithmH: "MVC और MongoDB इंटेलिजेंस",
      algorithmP:
        "ObjectIds, populate और मिश्रित फ़िल्टर मिलकर न्यूनतम विलंबता के साथ हजारों खिलाड़ियों के मिलान का काम करते हैं।",
      supabaseH: "JWT + Bcrypt सुरक्षा परत",
      supabaseP:
        "सुरक्षित सत्र और सख्त सर्वर-side एक्सेस नियंत्रण के साथ सीएमएस पैनल के लिए मजबूत प्रमाणीकरण।",
      outcomeH: "वास्तविक उत्पादन",
      outcomeP:
        "MongoDB Atlas के साथ Render पर तैनात REST API जो एक स्थिर उत्पाद के रूप में काम करने के लिए तैयार है।",
      codeSpotlight: "players.controller.js — फ़िल्टर इंजन",
      techBadges: ["Node.js", "MongoDB", "JWT", "Bcrypt", "MVC"],
    },
    tr: {
      title: "Who Are Ya?",
      subtitle: "Futbol Kimlik Motoru",
      role: "Backend Mimarı",
      objective:
        "Gerçek bir ürün hissi veren bir oyunun backend'ini oluşturmak: hızlı arama, tutarlı veriler ve kontrolü kaybetmeden ölçeklenebilen bir temel.",
      algorithmH: "MVC & MongoDB Zekası",
      algorithmP:
        "ObjectIds, populate ve bileşik filtreler, binlerce oyuncuyu minimum gecikmeyle çapraz sorgulamak için birlikte çalışır.",
      supabaseH: "JWT + Bcrypt Güvenlik Katmanı",
      supabaseP:
        "Korumalı oturumlar ve katı sunucu tarafı erişim kontrolü ile güçlendirilmiş CMS kimlik doğrulaması.",
      outcomeH: "Gerçek Üretim",
      outcomeP:
        "MongoDB Atlas ile Render'da konuşlandırılmış ve kararlı bir ürün olarak çalışmaya hazır REST API.",
      codeSpotlight: "players.controller.js — Filtre Motoru",
      techBadges: ["Node.js", "MongoDB", "JWT", "Bcrypt", "MVC"],
    },
    nl: {
      title: "Who Are Ya?",
      subtitle: "Voetbal Identiteit Engine",
      role: "Backend Architect",
      objective:
        "Bouw de backend van een spel dat aanvoelt als een echt product: snel zoeken, consistente gegevens en een basis die kan schalen zonder de controle te verloren.",
      algorithmH: "MVC & MongoDB Intelligentie",
      algorithmP:
        "ObjectIds, populate en samengestelde filters werken samen om duizenden spelers te matchen met minimale latentie.",
      supabaseH: "JWT + Bcrypt Beveiligingslaag",
      supabaseP:
        "Beveiligde CMS-authenticatie met beschermde sessies en strikte toegangscontrole aan de serverzijde.",
      outcomeH: "Echte Productie",
      outcomeP:
        "REST API geïmplementeerd op Render met MongoDB Atlas, klaar om als stabiel product te draaien.",
      codeSpotlight: "players.controller.js — Filter Engine",
      techBadges: ["Node.js", "MongoDB", "JWT", "Bcrypt", "MVC"],
    },
    sv: {
      title: "Who Are Ya?",
      subtitle: "Fotbollsidentitetsmotor",
      role: "Backend-arkitekt",
      objective:
        "Bygg backend för ett spel med känsla av en riktig produkt: snabb sökning, konsistent data och en grund som kan skalas utan att förlora kontrollen.",
      algorithmH: "MVC & MongoDB Intelligens",
      algorithmP:
        "ObjectIds, populate och sammansatta filter samverkar för att matcha tusentals spelare med minimal latens.",
      supabaseH: "JWT + Bcrypt Säkerhetsskikt",
      supabaseP:
        "Härdad CMS-autentisering med skyddade sessioner och strikt åtkomstkontroll på serverns sida.",
      outcomeH: "Verklig Produktion",
      outcomeP:
        "REST API distribuerat på Render med MongoDB Atlas, redo att köras som en stabil produkt.",
      codeSpotlight: "players.controller.js — Filtermotor",
      techBadges: ["Node.js", "MongoDB", "JWT", "Bcrypt", "MVC"],
    },
    pl: {
      title: "Who Are Ya?",
      subtitle: "Silnik Tożsamości Piłkarskiej",
      role: "Architekt Backend",
      objective:
        "Budowa backendu gry o standardzie rzeczywistego produktu: szybkie wyszukiwanie, spójne dane i fundament gotowy na skalowanie bez utraty kontroli.",
      algorithmH: "Inteligencja MVC & MongoDB",
      algorithmP:
        "ObjectIds, populate i filtry złożone współpracują ze sobą, aby dopasowywać tysiące graczy z minimalnym opóźnieniem.",
      supabaseH: "Warstwa Bezpieczeństwa JWT + Bcrypt",
      supabaseP:
        "Zabezpieczone uwierzytelnianie CMS z chronionymi sesjami i ścisłą kontrolą dostępu po stronie serwera.",
      outcomeH: "Realna Produkcja",
      outcomeP:
        "REST API wdrożone na platformie Render z MongoDB Atlas, gotowe do działania jako stabilny produkt.",
      codeSpotlight: "players.controller.js — Silnik Filtrujący",
      techBadges: ["Node.js", "MongoDB", "JWT", "Bcrypt", "MVC"],
    },
    vi: {
      title: "Who Are Ya?",
      subtitle: "Công cụ Định danh Bóng đá",
      role: "Kiến trúc sư Backend",
      objective:
        "Xây dựng backend cho một trò chơi với trải nghiệm sản phẩm thực tế: tìm kiếm nhanh, dữ liệu nhất quán và nền tảng sẵn sàng mở rộng mà không mất kiểm soát.",
      algorithmH: "Giải pháp thông minh MVC & MongoDB",
      algorithmP:
        "Sự kết hợp giữa ObjectIds, populate và các bộ lọc phức hợp giúp đối chiếu thông tin hàng nghìn cầu thủ với độ trễ tối thiểu.",
      supabaseH: "Lớp Bảo mật JWT + Bcrypt",
      supabaseP:
        "Xác thực CMS được thắt chặt bảo mật với các phiên hoạt động được bảo vệ và kiểm soát truy cập nghiêm ngặt từ phía máy chủ.",
      outcomeH: "Triển khai Thực tế",
      outcomeP:
        "REST API được triển khai trên Render với MongoDB Atlas và sẵn sàng vận hành ổn định.",
      codeSpotlight: "players.controller.js — Công cụ bộ lọc",
      techBadges: ["Node.js", "MongoDB", "JWT", "Bcrypt", "MVC"],
    },
  },

  rides24ofiziala: {
    es: {
      title: "Rides24",
      subtitle: "Sistema Distribuido Java",
      role: "Systems Architect",
      objective:
        "Ride-sharing distribuido. Reto: consistencia de datos y reservas concurrentes sin errores.",
      algorithmH: "Transacciones Atómicas & ObjectDB",
      algorithmP:
        "Uso de JAX-WS y bloqueos pesimistas (PESSIMISTIC_WRITE) para evitar duplicados en asientos.",
      supabaseH: "Concurrencia Thread-Safe",
      supabaseP:
        "Gestión de monitores de Java para sincronizar peticiones de usuarios simultáneos.",
      outcomeH: "Consistencia Total",
      outcomeP:
        "Sistema funcional testeado bajo carga con 0 condiciones de carrera.",
      codeSpotlight: "RideService.java — Atomic Lock",
      techBadges: ["JAX-WS", "ObjectDB", "Java Swing", "Thread-Safe"],
    },
    en: {
      title: "Rides24",
      subtitle: "Java Distributed System",
      role: "Systems Architect",
      objective:
        "Distributed ride-sharing. Challenge: data consistency and concurrent bookings without errors.",
      algorithmH: "Atomic Transactions & ObjectDB",
      algorithmP:
        "Using JAX-WS and pessimistic locks to prevent duplicate seat reservations.",
      supabaseH: "Thread-Safe Concurrency",
      supabaseP:
        "Java monitor management to synchronize simultaneous user requests.",
      outcomeH: "Total Consistency",
      outcomeP: "Functional system load-tested with zero race conditions.",
      codeSpotlight: "RideService.java — Atomic Lock",
      techBadges: ["JAX-WS", "ObjectDB", "Java Swing", "Thread-Safe"],
    },
    eu: {
      title: "Rides24",
      subtitle: "Java Sistema Banatua",
      role: "Systems Architect",
      objective:
        "Bidaia partekatu banatua. Erronka: datuen koherentzia eta erreserba konkurrenteak errorerik gabe.",
      algorithmH: "Transakzio Atomikoak eta ObjectDB",
      algorithmP:
        "JAX-WS eta blokeo pesimistak erabiliz eserlekuen erreserba bikoitzak saihesteko.",
      supabaseH: "Thread-Safe Konkurrentzia",
      supabaseP:
        "Java monitoreak erabiltzen ditu aldi bereko erabiltzaileen eskaerak sinkronizatzeko.",
      outcomeH: "Koherentzia Osoa",
      outcomeP:
        "Karga-testetan probatutako sistema, zero lasterketa-baldintzarekin.",
      codeSpotlight: "RideService.java — Atomic Lock",
      techBadges: ["JAX-WS", "ObjectDB", "Java Swing", "Thread-Safe"],
    },
    fr: {
      title: "Rides24",
      subtitle: "Système Distribué Java",
      role: "Systems Architect",
      objective:
        "Ride-sharing distribué. Défi : cohérence des données et réservations simultanées.",
      algorithmH: "Transactions Atomiques & ObjectDB",
      algorithmP:
        "Utilisation de JAX-WS et verrous pessimistes pour éviter les doubles réservations.",
      supabaseH: "Concurrence Thread-Safe",
      supabaseP:
        "Gestion des moniteurs Java pour synchroniser les requêtes utilisateurs simultanées.",
      outcomeH: "Cohérence Totale",
      outcomeP: "Système testé sous charge avec zéro condition de course.",
      codeSpotlight: "RideService.java — Atomic Lock",
      techBadges: ["JAX-WS", "ObjectDB", "Java Swing", "Thread-Safe"],
    },
    it: {
      title: "Rides24",
      subtitle: "Sistema Distribuito Java",
      role: "Systems Architect",
      objective:
        "Ride-sharing distribuito. Sfida: coerenza dei dati e prenotazioni simultanee.",
      algorithmH: "Transazioni Atomiche & ObjectDB",
      algorithmP:
        "JAX-WS e blocchi pessimistici per prevenire doppie prenotazioni di posti.",
      supabaseH: "Concorrenza Thread-Safe",
      supabaseP:
        "Gestione monitor Java per sincronizzare le richieste simultanee degli utenti.",
      outcomeH: "Coerenza Totale",
      outcomeP: "Sistema testato sotto carico con zero race conditions.",
      codeSpotlight: "RideService.java — Atomic Lock",
      techBadges: ["JAX-WS", "ObjectDB", "Java Swing", "Thread-Safe"],
    },
    de: {
      title: "Rides24",
      subtitle: "Verteiltes Java-System",
      role: "Systems Architect",
      objective:
        "Verteiltes Ride-Sharing. Herausforderung: Datenkonsistenz bei gleichzeitigen Buchungen.",
      algorithmH: "Atomare Transaktionen & ObjectDB",
      algorithmP:
        "Einsatz von JAX-WS und pessimistischen Sperren zur Vermeidung von Doppelbuchungen.",
      supabaseH: "Thread-Safe Nebenläufigkeit",
      supabaseP:
        "Java-Monitor-Management zur Synchronisierung gleichzeitiger Anfragen.",
      outcomeH: "Volle Konsistenz",
      outcomeP: "Lastgetestetes System mit Null Race Conditions.",
      codeSpotlight: "RideService.java — Atomic Lock",
      techBadges: ["JAX-WS", "ObjectDB", "Java Swing", "Thread-Safe"],
    },
    pt: {
      title: "Rides24",
      subtitle: "Sistema Distribuído Java",
      role: "Systems Architect",
      objective:
        "Ride-sharing distribuído. Desafio: consistência de dados e reservas concorrentes.",
      algorithmH: "Transações Atómicas & ObjectDB",
      algorithmP:
        "JAX-WS e bloqueios pessimistas para evitar reservas duplicadas.",
      supabaseH: "Concorrência Thread-Safe",
      supabaseP:
        "Gestão de monitores Java para sincronizar pedidos simultâneos.",
      outcomeH: "Consistência Total",
      outcomeP: "Sistema testado com carga e zero condições de corrida.",
      codeSpotlight: "RideService.java — Atomic Lock",
      techBadges: ["JAX-WS", "ObjectDB", "Java Swing", "Thread-Safe"],
    },
    ca: {
      title: "Rides24",
      subtitle: "Sistema Distribuït Java",
      role: "Systems Architect",
      objective:
        "Ride-sharing distribuït. Repte: consistència de dades i reserves simultànies.",
      algorithmH: "Transaccions Atòmiques & ObjectDB",
      algorithmP:
        "JAX-WS i bloquejos pessimistes per evitar reserves de seients duplicades.",
      supabaseH: "Concurrència Thread-Safe",
      supabaseP:
        "Gestió de monitors Java per sincronitzar peticions simultànies.",
      outcomeH: "Consistència Total",
      outcomeP: "Sistema provat sota càrrega amb zero condicions de carrera.",
      codeSpotlight: "RideService.java — Atomic Lock",
      techBadges: ["JAX-WS", "ObjectDB", "Java Swing", "Thread-Safe"],
    },
    gl: {
      title: "Rides24",
      subtitle: "Sistema Distribuído Java",
      role: "Systems Architect",
      objective:
        "Ride-sharing distribuído. Reto: consistencia de datos e reservas concorrentes.",
      algorithmH: "Transaccións Atómicas & ObjectDB",
      algorithmP:
        "JAX-WS e bloqueos pesimistas para evitar reservas duplicadas de asentos.",
      supabaseH: "Concorrencia Thread-Safe",
      supabaseP:
        "Xestión de monitores Java para sincronizar peticións simultáneas.",
      outcomeH: "Consistencia Total",
      outcomeP: "Sistema probado con carga e cero condicións de carreira.",
      codeSpotlight: "RideService.java — Atomic Lock",
      techBadges: ["JAX-WS", "ObjectDB", "Java Swing", "Thread-Safe"],
    },
    ja: {
      title: "Rides24",
      subtitle: "Java 分散システム",
      role: "システムアーキテクト",
      objective:
        "分散型ライドシェアリング。課題：データの一貫性とエラーのない同時予約。",
      algorithmH: "アトミックトランザクション & ObjectDB",
      algorithmP: "JAX-WS と悲観的ロックを使用して、座席の重複予約を防ぎます。",
      supabaseH: "スレッドセーフな並行処理",
      supabaseP: "同時ユーザーリクエストを同期するための Java モニター管理。",
      outcomeH: "完全な一貫性",
      outcomeP: "競合状態がゼロであることを負荷テストで確認済み。",
      codeSpotlight: "RideService.java — Atomic Lock",
      techBadges: ["JAX-WS", "ObjectDB", "Java Swing", "Thread-Safe"],
    },
    zh: {
      title: "Rides24",
      subtitle: "Java 分布式系统",
      role: "系统架构师",
      objective:
        "打造分布式拼车出行平台。核心挑战：确保高并发预订下的数据绝对一致性与零差错。",
      algorithmH: "原子事务与 ObjectDB 数据库",
      algorithmP:
        "采用 JAX-WS 和悲观锁(PESSIMISTIC_WRITE)机制，彻底杜绝座位重复预订问题。",
      supabaseH: "线程安全并发控制",
      supabaseP:
        "运用 Java 监视器(Monitor)模式，同步多用户并发请求，确保安全。",
      outcomeH: "极致一致性",
      outcomeP: "在高负载测试下表现卓越的可用系统，实现零竞态条件。",
      codeSpotlight: "RideService.java — 原子锁实现",
      techBadges: ["JAX-WS", "ObjectDB", "Java Swing", "Thread-Safe"],
    },
    ar: {
      title: "Rides24",
      subtitle: "نظام Java الموزع",
      role: "مهندس النظم والشبكات",
      objective:
        "مشاركة الرحلات الموزعة. التحدي: اتساق البيانات المطلقة وإتمام الحجوزات المتزامنة دون أي أخطاء.",
      algorithmH: "المعاملات الذرية وقاعدة بيانات ObjectDB",
      algorithmP:
        "استخدام JAX-WS والأقفال المتشائمة (PESSIMISTIC_WRITE) لمنع تكرار حجز نفس المقعد بشكل متزامن.",
      supabaseH: "التعامل المتزامن الآمن خيطياً Thread-Safe",
      supabaseP:
        "إدارة مراقبي Java (Java Monitors) لمزامنة طلبات المستخدمين المتزامنة بأمان تام.",
      outcomeH: "الاتساق المطلق",
      outcomeP:
        "نظام تشغيلي متكامل تم اختباره تحت أقصى درجات الحمل مع حدوث صفر ظروف تسابق.",
      codeSpotlight: "RideService.java — القفل الذري المتزامن",
      techBadges: ["JAX-WS", "ObjectDB", "Java Swing", "Thread-Safe"],
    },
    ru: {
      title: "Rides24",
      subtitle: "Распределенная система Java",
      role: "Архитектор систем",
      objective:
        "Распределенный карпулинг. Задача: обеспечение согласованности данных и бесконфликтность одновременных бронирований.",
      algorithmH: "Атомарные транзакции и ObjectDB",
      algorithmP:
        "Использование JAX-WS и пессимистических блокировок (PESSIMISTIC_WRITE) для предотвращения дублирования бронирования мест.",
      supabaseH: "Потокобезопасная многопоточность",
      supabaseP:
        "Управление мониторами Java для синхронизации запросов от нескольких пользователей одновременно.",
      outcomeH: "Полная согласованность",
      outcomeP:
        "Функциональная система, протестированная под нагрузкой с нулевым уровнем состояний гонки.",
      codeSpotlight: "RideService.java — Атомарная блокировка",
      techBadges: ["JAX-WS", "ObjectDB", "Java Swing", "Thread-Safe"],
    },
    ko: {
      title: "Rides24",
      subtitle: "Java 분산 시스템",
      role: "시스템 아키텍트",
      objective:
        "분산형 라이드 셰어링. 과제: 데이터 일관성 유지 및 오류 없는 동시 예약 처리.",
      algorithmH: "원자적 트랜잭션 & ObjectDB",
      algorithmP:
        "JAX-WS 및 비관적 잠금(pessimistic lock)을 사용하여 중복 좌석 예약을 방지합니다.",
      supabaseH: "스레드 안전 동시성",
      supabaseP: "동시 사용자 요청을 동기화하기 위한 Java 모니터 관리.",
      outcomeH: "완벽한 일관성",
      outcomeP:
        "레이스 컨디션이 전혀 발생하지 않도록 부하 테스트를 거친 기능 시스템.",
      codeSpotlight: "RideService.java — 원자적 잠금",
      techBadges: ["JAX-WS", "ObjectDB", "Java Swing", "Thread-Safe"],
    },
    hi: {
      title: "Rides24",
      subtitle: "जावा वितरित प्रणाली",
      role: "सिस्टम आर्किটেक्ट",
      objective:
        "वितरित राइड-शेयरिंग। चुनौती: डेटा स्थिरता और बिना त्रुटियों के समवर्ती बुकिंग।",
      algorithmH: "परमाणу लेनदेन और ObjectDB",
      algorithmP:
        "सीटों की दोहरी बुकिंग को रोकने के लिए JAX-WS और निराशावादी लॉक (pessimistic locks) का उपयोग करना।",
      supabaseH: "थ्रेड-सुरक्षित समवर्ती",
      supabaseP:
        "एक साथ आने वाले उपयोगकर्ता अनुरोधों को सिंक्रनाइज़ करने के लिए जावा मॉनिटर प्रबंधन।",
      outcomeH: "पूर्ण स्थिरता",
      outcomeP:
        "लोड-परीक्षण के तहत काम करने वाली प्रणाली जिसमें कोई रेс कंडीशन (race conditions) नहीं है।",
      codeSpotlight: "RideService.java — परमाणु लॉक",
      techBadges: ["JAX-WS", "ObjectDB", "Java Swing", "Thread-Safe"],
    },
    tr: {
      title: "Rides24",
      subtitle: "Java Dağıtık Sistem",
      role: "Sistem Mimarı",
      objective:
        "Dağıtık yolculuk paylaşımı. Zorluk: veri tutarlılığı ve hatasız eşzamanlı rezervasyonlar.",
      algorithmH: "Atomik İşlemler & ObjectDB",
      algorithmP:
        "Çift koltuk rezervasyonunu önlemek için JAX-WS ve kötümser kilitlerin (pessimistic locks) kullanılması.",
      supabaseH: "Thread-Safe Eşzamanlılık",
      supabaseP:
        "Eşzamanlı kullanıcı isteklerini senkronize etmek için Java monitör yönetimi.",
      outcomeH: "Tam Tutarlılık",
      outcomeP:
        "Sıfır yarış durumu (race condition) ile yük altında test edilmiş çalışan sistem.",
      codeSpotlight: "RideService.java — Atomik Kilit",
      techBadges: ["JAX-WS", "ObjectDB", "Java Swing", "Thread-Safe"],
    },
    nl: {
      title: "Rides24",
      subtitle: "Java Gedistribueerd Systeem",
      role: "Systeemarchitect",
      objective:
        "Gedistribueerd ritten delen. Uitdaging: dataconsistentie en gelijktijdige boekingen zonder fouten.",
      algorithmH: "Atomische Transacties & ObjectDB",
      algorithmP:
        "Gebruik van JAX-WS en pessimistische vergrendelingen om dubbele stoelreserveringen te voorkomen.",
      supabaseH: "Thread-Safe Concurrency",
      supabaseP:
        "Java-monitorbeheer om gelijktijdige gebruikersverzoeken te synchroniseren.",
      outcomeH: "Totale Consistentie",
      outcomeP:
        "Functioneel systeem getest onder belasting met nul racecondities.",
      codeSpotlight: "RideService.java — Atomische Vergrendeling",
      techBadges: ["JAX-WS", "ObjectDB", "Java Swing", "Thread-Safe"],
    },
    sv: {
      title: "Rides24",
      subtitle: "Java Distribuerat System",
      role: "Systemarkitekt",
      objective:
        "Distribuerad samåkning. Utmaning: datakonsistens och samtidiga bokningar utan fel.",
      algorithmH: "Atomiska Transaktioner & ObjectDB",
      algorithmP:
        "Användning av JAX-WS och pessimistiska lås för att förhindra dubbelbokning av platser.",
      supabaseH: "Trådsäker Samtidighet",
      supabaseP:
        "Java-monitorhantering för att synkronisera samtidiga användarförfrågningar.",
      outcomeH: "Total Konsistens",
      outcomeP:
        "Funktionellt system belastningstestat med noll kapplöpningssymptom (race conditions).",
      codeSpotlight: "RideService.java — Atomiskt Lås",
      techBadges: ["JAX-WS", "ObjectDB", "Java Swing", "Thread-Safe"],
    },
    pl: {
      title: "Rides24",
      subtitle: "System Rozproszony Java",
      role: "Architekt Systemowy",
      objective:
        "Rozproszone współdzielenie przejazdów. Wyzwanie: spójność danych i współbieżne rezerwacje bez błędów.",
      algorithmH: "Transakcje Atomowe & ObjectDB",
      algorithmP:
        "Użycie JAX-WS oraz blokad pesymistycznych w celu zapobiegania podwójnym rezerwacjom miejsc.",
      supabaseH: "Współbieżność Bezpieczna Wątkowo",
      supabaseP:
        "Zarządzanie monitorami Javy do synchronizacji jednoczesnych żądań użytkowników.",
      outcomeH: "Całkowita Spójność",
      outcomeP:
        "Funkcjonalny system przetestowany pod obciążeniem z zerowym poziomem wyścigów (race conditions).",
      codeSpotlight: "RideService.java — Blokada Atomowa",
      techBadges: ["JAX-WS", "ObjectDB", "Java Swing", "Thread-Safe"],
    },
    vi: {
      title: "Rides24",
      subtitle: "Hệ thống Phân tán Java",
      role: "Kiến trúc sư Hệ thống",
      objective:
        "Hệ thống chia sẻ chuyến đi phân tán. Thách thức: tính nhất quán dữ liệu và các lượt đặt chỗ đồng thời không xảy ra lỗi.",
      algorithmH: "Giao dịch Nguyên tử & ObjectDB",
      algorithmP:
        "Sử dụng JAX-WS và khóa bi quan (pessimistic lock) để ngăn ngừa tình trạng đặt trùng ghế.",
      supabaseH: "Đồng thời Thread-Safe",
      supabaseP:
        "Quản lý giám sát Java để đồng bộ hóa các yêu cầu người dùng đồng thời.",
      outcomeH: "Nhất quán Toàn diện",
      outcomeP:
        "Hệ thống hoạt động ổn định đã được kiểm tra tải trọng với không xảy ra race conditions.",
      codeSpotlight: "RideService.java — Khóa nguyên tử",
      techBadges: ["JAX-WS", "ObjectDB", "Java Swing", "Thread-Safe"],
    },
  },

  "spotshare-parking": {
    es: {
      title: "SpotShare",
      subtitle: "Cloud Parking Intelligence",
      role: "Cloud Quality Engineer",
      objective:
        "Convertir el parking en una experiencia de alta densidad y baja fricción: disponibilidad en tiempo real, confianza visual y cero ambigüedad operativa.",
      algorithmH: "Quality Gate de Precisión",
      algorithmP:
        "Pipelines con SonarCloud, validaciones de cobertura y disciplina técnica para mantener una base de código que escala sin perder control.",
      supabaseH: "Estado en Tiempo Real",
      supabaseP:
        "Optimistic Locking para reservar plazas sin colisiones, con cambios atómicos y reflejo inmediato en el panel operativo.",
      outcomeH: "Escala con Elegancia",
      outcomeP:
        "Sistema preparado para crecer con auditorías automáticas, métricas claras y una experiencia limpia en cada interacción.",
      codeSpotlight: "parking.service.ts — Reservation Core",
      techBadges: [
        "SonarCloud A",
        "Cloud Native",
        "CI/CD",
        "Optimistic Locking",
      ],
    },
    en: {
      title: "SpotShare",
      subtitle: "Cloud Parking Intelligence",
      role: "Cloud Quality Engineer",
      objective:
        "Turn parking into a high-density, low-friction experience: real-time availability, visual trust, and zero operational ambiguity.",
      algorithmH: "Precision Quality Gate",
      algorithmP:
        "SonarCloud pipelines, coverage checks and technical discipline keep the codebase scalable without losing control.",
      supabaseH: "Real-Time State",
      supabaseP:
        "Optimistic Locking prevents reservation collisions, with atomic updates and instant reflection in the operator dashboard.",
      outcomeH: "Scale with Elegance",
      outcomeP:
        "A system built for growth, with automatic audits, clear metrics, and a clean experience at every interaction.",
      codeSpotlight: "parking.service.ts — Reservation Core",
      techBadges: [
        "SonarCloud A",
        "Cloud Native",
        "CI/CD",
        "Optimistic Locking",
      ],
    },
    eu: {
      title: "SpotShare",
      subtitle: "Cloud Aparkaleku Kudeatzailea",
      role: "Cloud Quality Engineer",
      objective:
        "Aparkalekuen Cloud kudeaketa. Fokua: Kodearen kalitatea eta eskalagarritasuna.",
      algorithmH: "SonarCloud Quality Gate",
      algorithmP:
        'SonarCloud-en "A" balorazioa: 0 Bug eta ahultasun. Zor teknikoa %2 baino txikiagoa.',
      supabaseH: "Cloud Konkurrentzia",
      supabaseP:
        "Optimistic Locking erabiliz aparkaleku-plazen egoera denbora errealean kudeatzeko.",
      outcomeH: "Enpresa Mailako Kodea",
      outcomeP:
        "Arkitektura eskalagarria PR bakoitzean automatikoki auditaturik.",
      codeSpotlight: "parking.service.ts — Lock Logic",
      techBadges: ["SonarCloud A", "Cloud", "CI/CD", "Optimistic Locking"],
    },
    fr: {
      title: "SpotShare",
      subtitle: "Gestion Parking Cloud",
      role: "Cloud Quality Engineer",
      objective:
        "Gestion Cloud de parkings. Focus : Qualité du code et évolutivité.",
      algorithmH: "SonarCloud Quality Gate",
      algorithmP:
        'Score "A" sur SonarCloud : 0 bogues et vulnérabilités. Dette technique < 2%.',
      supabaseH: "Concurrence Cloud",
      supabaseP:
        "Utilisation de l'Optimistic Locking pour l'état des places en temps réel.",
      outcomeH: "Code Entreprise",
      outcomeP: "Architecture évolutive auditée automatiquement à chaque PR.",
      codeSpotlight: "parking.service.ts — Lock Logic",
      techBadges: ["SonarCloud A", "Cloud", "CI/CD", "Optimistic Locking"],
    },
    it: {
      title: "SpotShare",
      subtitle: "Cloud Parking Manager",
      role: "Cloud Quality Engineer",
      objective:
        "Gestione parcheggi Cloud. Focus: Qualità del codice e scalabilità.",
      algorithmH: "SonarCloud Quality Gate",
      algorithmP:
        'Rating "A" su SonarCloud: 0 Bug e vulnerabilità. Debito tecnico < 2%.',
      supabaseH: "Concorrenza Cloud",
      supabaseP:
        "Utilizzo di Optimistic Locking per gestire i posti in tempo reale.",
      outcomeH: "Codice Enterprise",
      outcomeP: "Architettura scalabile auditata automaticamente in ogni PR.",
      codeSpotlight: "parking.service.ts — Lock Logic",
      techBadges: ["SonarCloud A", "Cloud", "CI/CD", "Optimistic Locking"],
    },
    de: {
      title: "SpotShare",
      subtitle: "Cloud Parkplatz-Manager",
      role: "Cloud Quality Engineer",
      objective:
        "Cloud-Parkplatzverwaltung. Fokus: Codequalität und Skalierbarkeit.",
      algorithmH: "SonarCloud Quality Gate",
      algorithmP:
        'Rating "A" in SonarCloud: 0 Bugs und Schwachstellen. Technische Schuld < 2%.',
      supabaseH: "Cloud-Nebenläufigkeit",
      supabaseP: "Optimistic Locking zur Echtzeitverwaltung der Parkplätze.",
      outcomeH: "Business-Code",
      outcomeP: "Skalierbare Architektur, automatisch bei jedem PR geprüft.",
      codeSpotlight: "parking.service.ts — Lock Logic",
      techBadges: ["SonarCloud A", "Cloud", "CI/CD", "Optimistic Locking"],
    },
    pt: {
      title: "SpotShare",
      subtitle: "Gestor de Estacionamento Cloud",
      role: "Cloud Quality Engineer",
      objective: "Gestão Cloud. Foco: Qualidade do código e escalabilidade.",
      algorithmH: "SonarCloud Quality Gate",
      algorithmP:
        'Rating "A" no SonarCloud: 0 Bugs e vulnerabilidades. Dívida técnica < 2%.',
      supabaseH: "Concorrência Cloud",
      supabaseP: "Uso de Optimistic Locking para gerir lugares em tempo real.",
      outcomeH: "Código Enterprise",
      outcomeP: "Arquitetura escalável auditada em cada PR.",
      codeSpotlight: "parking.service.ts — Lock Logic",
      techBadges: ["SonarCloud A", "Cloud", "CI/CD", "Optimistic Locking"],
    },
    ca: {
      title: "SpotShare",
      subtitle: "Cloud Parking Manager",
      role: "Cloud Quality Engineer",
      objective:
        "Gestió Cloud d'aparcaments. Focus: Qualitat del codi i escalabilitat.",
      algorithmH: "SonarCloud Quality Gate",
      algorithmP:
        'Rating "A" a SonarCloud: 0 Bugs i vulnerabilitats. Deute tècnic < 2%.',
      supabaseH: "Concurrència Cloud",
      supabaseP:
        "Ús d'Optimistic Locking per gestionar l'estat de les places en temps real.",
      outcomeH: "Codi Empresarial",
      outcomeP: "Arquitectura escalable auditada automàticament en cada PR.",
      codeSpotlight: "parking.service.ts — Lock Logic",
      techBadges: ["SonarCloud A", "Cloud", "CI/CD", "Optimistic Locking"],
    },
    gl: {
      title: "SpotShare",
      subtitle: "Xestor de Parking Cloud",
      role: "Cloud Quality Engineer",
      objective:
        "Xestión Cloud de aparcadoiros. Foco: Calidade do código e escalabilidade.",
      algorithmH: "SonarCloud Quality Gate",
      algorithmP:
        'Rating "A" en SonarCloud: 0 Bugs e vulnerabilidades. Débeda técnica < 2%.',
      supabaseH: "Concorrencia Cloud",
      supabaseP:
        "Uso de Optimistic Locking para xestionar prazas en tempo real.",
      outcomeH: "Código Empresarial",
      outcomeP: "Arquitectura escalable auditada automaticamente en cada PR.",
      codeSpotlight: "parking.service.ts — Lock Logic",
      techBadges: ["SonarCloud A", "Cloud", "CI/CD", "Optimistic Locking"],
    },
    ja: {
      title: "SpotShare",
      subtitle: "クラウド駐車場管理",
      role: "クラウド品質エンジニア",
      objective: "駐車場のクラウド管理。重点：コードの品質とスケーラビリティ。",
      algorithmH: "SonarCloud クオリティゲート",
      algorithmP:
        "SonarCloud で「A」評価：バグと脆弱性ゼロ。テクニカルデット 2% 未満。",
      supabaseH: "クラウド並行性",
      supabaseP:
        "駐車スペースの状態をリアルタイムで管理するための楽観的ロックの使用。",
      outcomeH: "エンタープライズコード",
      outcomeP:
        "すべての PR で自動的に監査されるスケーラブルなアーキテクチャ。",
      codeSpotlight: "parking.service.ts — Lock Logic",
      techBadges: ["SonarCloud A", "Cloud", "CI/CD", "Optimistic Locking"],
    },
    zh: {
      title: "SpotShare",
      subtitle: "云端智能车位管理系统",
      role: "云端质量工程师",
      objective:
        "将停车体验转变为高密度、低摩擦的现代服务：实时泊位查询、可视化信任感以及零操作含糊性。",
      algorithmH: "精准质量关卡(Quality Gate)",
      algorithmP:
        "在流水线中集成 SonarCloud、单元测试覆盖率校验及严格的代码规范，确保代码库的高质量可扩展性。",
      supabaseH: "实时状态同步",
      supabaseP:
        "采用乐观锁(Optimistic Locking)技术实现无冲突车位预约，支持原子更新并瞬时同步到管理后台。",
      outcomeH: "优雅扩展",
      outcomeP:
        "具备自动化审计、清晰度量指标及丝滑交互体验的现代化高成长性系统。",
      codeSpotlight: "parking.service.ts — 核心预约逻辑",
      techBadges: [
        "SonarCloud A",
        "Cloud Native",
        "CI/CD",
        "Optimistic Locking",
      ],
    },
    ar: {
      title: "SpotShare",
      subtitle: "ذكاء مواقف السيارات السحابية",
      role: "مهندس جودة الحوسبة السحابية",
      objective:
        "تحويل مواقف السيارات إلى تجربة عالية الكثافة وسهلة الاستخدام: توفر فوري في الوقت الفعلي، وموثوقية بصرية، وصفر غموض تشغيلي.",
      algorithmH: "بوابة جودة دقيقة (Quality Gate)",
      algorithmP:
        "خطوط أنابيب CI/CD مع SonarCloud، وفحوصات التغطية والانضباط التقني العالي للحفاظ على بنية برمجية قابلة للتوسع.",
      supabaseH: "حالة الوقت الفعلي الفورية",
      supabaseP:
        "يمنع القفل المتفائل (Optimistic Locking) تضارب الحجوزات للمواقف، مع تحديثات ذرية تنعكس فوراً على لوحة التشغيل.",
      outcomeH: "التوسع بأناقة وسلاسة",
      outcomeP:
        "نظام مُهيأ للنمو المستقبلي، مدعوم بعمليات تدقيق تلقائية، ومقاييس أداء واضحة، وتجربة مستخدم متميزة.",
      codeSpotlight: "parking.service.ts — منطق الحجز والتحقق",
      techBadges: [
        "SonarCloud A",
        "Cloud Native",
        "CI/CD",
        "Optimistic Locking",
      ],
    },
    ru: {
      title: "SpotShare",
      subtitle: "Интеллектуальная облачная парковка",
      role: "Инженер по качеству облачных решений",
      objective:
        "Превратить парковку в высокоплотное решение с низким трением: доступность в реальном времени, визуальное доверие и отсутствие операционной двусмысленности.",
      algorithmH: "Точные ворота качества",
      algorithmP:
        "Конвейеры SonarCloud, проверка покрытия и техническая дисциплина поддерживают кодовую базу в масштабируемом состоянии без потери контроля.",
      supabaseH: "Состояние в реальном времени",
      supabaseP:
        "Оптимистическая блокировка (Optimistic Locking) предотвращает коллизии бронирований с атомарными обновлениями и мгновенным отражением в панели оператора.",
      outcomeH: "Элегантное масштабирование",
      outcomeP:
        "Система создана для роста, с автоматическим аудитом, четкими метриками и чистым интерфейсом взаимодействия.",
      codeSpotlight: "parking.service.ts — Ядро резервирования",
      techBadges: [
        "SonarCloud A",
        "Cloud Native",
        "CI/CD",
        "Optimistic Locking",
      ],
    },
    ko: {
      title: "SpotShare",
      subtitle: "클라우드 스마트 주차 시스템",
      role: "클라우드 품질 엔지니어",
      objective:
        "주차를 고밀도, 저마찰 환경으로 전환: 실시간 가용성 확보, 시각적 신뢰성 제공, 운영 상 모호함 제로.",
      algorithmH: "정밀 품질 게이트",
      algorithmP:
        "SonarCloud 파이프라인, 커버리지 검사 및 기술적 규율을 통해 제어력을 잃지 않고 코드베이스를 확장 가능한 상태로 유지합니다.",
      supabaseH: "실시간 상태 관리",
      supabaseP:
        "낙관적 잠금(Optimistic Locking)을 사용하여 예약 충돌을 방지하며, 원자적 업데이트가 운영 대시보드에 즉각 반영됩니다.",
      outcomeH: "우아한 확장성",
      outcomeP:
        "자동 감사, 명확한 지표, 모든 상호작용에서의 정갈한 경험을 통해 성장에 맞춰 빌드된 시스템.",
      codeSpotlight: "parking.service.ts — 예약 코어",
      techBadges: [
        "SonarCloud A",
        "Cloud Native",
        "CI/CD",
        "Optimistic Locking",
      ],
    },
    hi: {
      title: "SpotShare",
      subtitle: "क्लाउड पार्किंग इंटेलिजेंस",
      role: "क्लाउड गुणवत्ता इंजीनियर",
      objective:
        "पार्किंग को एक उच्च-घनत्व, कम-घर्षण अनुभव में बदलना: वास्तविक समय में उपलब्धता, दृश्य विश्वास और शून्य परिचालन अस्पष्टता।",
      algorithmH: "परिशुद्धता गुणवत्ता गेट",
      algorithmP:
        "SonarCloud पाइपलाइन, कवरेज चेक और तकनीकी अनुशासन नियंत्रण खोए बिना कोड베이스 को स्केलेबल बनाए रखते हैं।",
      supabaseH: "वास्तविक समय की स्थिति",
      supabaseP:
        "ऑप्टिमिस्टिक लॉकिंग (Optimistic Locking) परमाणु अपडेट और ऑपरेटर डैशबोर्ड में तुरंत प्रभाव के साथ आरक्षण टकराव को रोकता है।",
      outcomeH: "सुरुचिपूर्ण पैमाना",
      outcomeP:
        "विकास के लिए निर्मित प्रणाली, जिसमें स्वचालित ऑडिट, स्पष्ट मेट्रिक्स और हर बातचीत में एक साफ अनुभव है।",
      codeSpotlight: "parking.service.ts — आरक्षण कोर",
      techBadges: [
        "SonarCloud A",
        "Cloud Native",
        "CI/CD",
        "Optimistic Locking",
      ],
    },
    tr: {
      title: "SpotShare",
      subtitle: "Bulut Otopark Zekası",
      role: "Bulut Kalite Mühendisi",
      objective:
        "Otoparkı yüksek yoğunluklu, düşük sürtünmeli bir deneyime dönüştürmek: gerçek zamanlı kullanılabilirlik, görsel güven ve sıfır operasyonel belirsizlik.",
      algorithmH: "Hassas Kalite Kapısı",
      algorithmP:
        "SonarCloud boru hatları, kapsam kontrolleri ve teknik disiplin, kontrolü kaybetmeden kod tabanını ölçeklenebilir tutar.",
      supabaseH: "Gerçek Zamanlı Durum",
      supabaseP:
        "İyimser Kilitleme (Optimistic Locking), atomik güncellemeler ve operatör panelinde anında yansıma ile rezervasyon çakışmalarını önler.",
      outcomeH: "Zarafetle Ölçekle",
      outcomeP:
        "Otomatik denetimler, net metrikler ve her etkileşimde temiz bir deneyim ile büyüme için oluşturulmuş bir sistem.",
      codeSpotlight: "parking.service.ts — Rezervasyon Çekirdeği",
      techBadges: [
        "SonarCloud A",
        "Cloud Native",
        "CI/CD",
        "Optimistic Locking",
      ],
    },
    nl: {
      title: "SpotShare",
      subtitle: "Cloud Parkeer Intelligentie",
      role: "Cloud Kwaliteitsingenieur",
      objective:
        "Verander parkeren in een ervaring met hoge dichtheid en weinig wrijving: realtime beschikbaarheid, visueel vertrouwen en nul operationele ambiguïteit.",
      algorithmH: "Precisie Kwaliteitspoort",
      algorithmP:
        "SonarCloud-pipelines, dekkingcontroles en technische discipline houden de codebase schaalbaar zonder controle te verliezen.",
      supabaseH: "Realtime Status",
      supabaseP:
        "Optimistic Locking voorkomt reserveringsbotsingen, met atomische updates en onmiddellijke weergave in het dashboard van de operator.",
      outcomeH: "Schaal met Elegantie",
      outcomeP:
        "Een systeem gebouwd voor groei, met automatische audits, duidelijke statistieken en een schone ervaring bij elke interactie.",
      codeSpotlight: "parking.service.ts — Reserveringskern",
      techBadges: [
        "SonarCloud A",
        "Cloud Native",
        "CI/CD",
        "Optimistic Locking",
      ],
    },
    sv: {
      title: "SpotShare",
      subtitle: "Intelligent Molnparkering",
      role: "Kvalitetsingenjör för Molnet",
      objective:
        "Förvandla parkering till en högdensitets-, lågfriktionsupplevelse: tillgänglighet i realtid, visuell tillit och noll operativ oklarhet.",
      algorithmH: "Precision Quality Gate",
      algorithmP:
        "SonarCloud-pipelines, täckningskontroller och teknisk disciplin håller kodbasen skalbar utan att förlora kontrollen.",
      supabaseH: "Realtidsstatus",
      supabaseP:
        "Optimistisk Låsning (Optimistic Locking) förhindrar bokningskollisioner, med atomiska uppdateringar och omedelbar spegling i operatörspanelen.",
      outcomeH: "Skala med Elegans",
      outcomeP:
        "Ett system byggt för tillväxt, med automatiska granskningar, tydliga mätvärden och en ren upplevelse vid varje interaktion.",
      codeSpotlight: "parking.service.ts — Bokningskärna",
      techBadges: [
        "SonarCloud A",
        "Cloud Native",
        "CI/CD",
        "Optimistic Locking",
      ],
    },
    pl: {
      title: "SpotShare",
      subtitle: "Inteligentny Parking w Chmurze",
      role: "Inżynier ds. Jakości Chmury",
      objective:
        "Przekształcenie parkingu w doświadczenie o wysokiej gęstości i niskim tarciu: dostępność w czasie rzeczywistym, wizualne zaufanie i zerowa niejednoznaczność operacyjna.",
      algorithmH: "Precyzyjna Bramka Jakości",
      algorithmP:
        "Potoki SonarCloud, kontrole pokrycia kodu i dyscyplina techniczna pozwalają zachować skalowalność bazy kodu bez utraty kontroli.",
      supabaseH: "Status w Czasie Rzeczywistym",
      supabaseP:
        "Blokowanie optymistyczne (Optimistic Locking) zapobiega kolizjom rezerwacji, zapewniając atomowe aktualizacje i natychmiastowe odzwierciedlenie w panelu operatora.",
      outcomeH: "Skalowanie z Elegancją",
      outcomeP:
        "System stworzony z myślą o rozwoju, z automatycznymi audytami, jasnymi metrykami i czystym interfejsem przy każdej interakcji.",
      codeSpotlight: "parking.service.ts — Rdzeń Rezerwacji",
      techBadges: [
        "SonarCloud A",
        "Cloud Native",
        "CI/CD",
        "Optimistic Locking",
      ],
    },
    vi: {
      title: "SpotShare",
      subtitle: "Hệ thống Đỗ xe Đám mây Thông minh",
      role: "Kỹ sư Chất lượng Đám mây",
      objective:
        "Biến việc đỗ xe thành trải nghiệm mật độ cao và ít ma sát: tình trạng chỗ trống theo thời gian thực, sự tin cậy về mặt trực quan và không mập mờ trong vận hành.",
      algorithmH: "Cổng kiểm soát chất lượng chính xác",
      algorithmP:
        "Các đường ống SonarCloud, kiểm tra độ phủ (coverage) và kỷ luật kỹ thuật giúp mã nguồn dễ dàng mở rộng mà không mất kiểm soát.",
      supabaseH: "Trạng thái Thời gian Thực",
      supabaseP:
        "Khóa lạc quan (Optimistic Locking) ngăn ngừa xung đột đặt chỗ, với các bản cập nhật nguyên tử và hiển thị ngay lập tức trên bảng điều khiển vận hành.",
      outcomeH: "Mở rộng Tinh tế",
      outcomeP:
        "Hệ thống được thiết kế để tăng trưởng, tích hợp kiểm tra tự động, số liệu rõ ràng và trải nghiệm gọn gàng trong mỗi lần tương tác.",
      codeSpotlight: "parking.service.ts — Nhân đặt chỗ",
      techBadges: [
        "SonarCloud A",
        "Cloud Native",
        "CI/CD",
        "Optimistic Locking",
      ],
    },
  },

  "pke-web": {
    es: {
      title: "PKE Web",
      subtitle: "Accessible Semantics by Default",
      role: "UX/A11Y Developer",
      objective:
        "Construir una interfaz donde la accesibilidad no sea una capa extra sino la propia arquitectura: teclado, lector de pantalla, contraste y movimiento reducido.",
      algorithmH: "Focus Architecture & ARIA",
      algorithmP:
        "Gestión rigurosa del DOM para crear una navegación predecible, silenciosa y completamente controlable por teclado.",
      supabaseH: "Diseño Inclusivo",
      supabaseP:
        "Contrastes auditados, estados visibles y respeto total por prefers-reduced-motion para una experiencia que no excluye a nadie.",
      outcomeH: "A11Y sin Compromisos",
      outcomeP:
        "Una base semántica preparada para crecer con componentes accesibles y una puntuación Lighthouse consistente.",
      codeSpotlight: "useFocusTrap.ts — Accessibility Core",
      techBadges: ["WCAG-conscious", "Focus Trap", "A11Y", "Semantic HTML"],
    },
    en: {
      title: "PKE Web",
      subtitle: "Accessible Semantics by Default",
      role: "UX/A11Y Developer",
      objective:
        "Build an interface where accessibility is not a layer on top but the actual architecture: keyboard, screen readers, contrast, and reduced motion.",
      algorithmH: "Focus Architecture & ARIA",
      algorithmP:
        "Strict DOM control creates a navigation model that feels predictable, quiet, and fully keyboard-driven.",
      supabaseH: "Inclusive Design",
      supabaseP:
        "Audited contrast, visible states, and full respect for prefers-reduced-motion to avoid excluding anyone.",
      outcomeH: "A11Y without Compromise",
      outcomeP:
        "A semantic base ready to scale with accessible components and a consistently strong Lighthouse score.",
      codeSpotlight: "useFocusTrap.ts — Accessibility Core",
      techBadges: ["WCAG-conscious", "Focus Trap", "A11Y", "Semantic HTML"],
    },
    eu: {
      title: "PKE Web",
      subtitle: "Irisgarritasuna eta Semantika",
      role: "UX/A11Y Developer",
      objective:
        "Irisgarritasuna oinarri duen plataforma, irisgarritasun jarraibideak kontuan hartuz diseinatua.",
      algorithmH: "Focus Trapping eta ARIA Roles",
      algorithmP:
        "DOM kudeaketa egokia teklatu bidezko nabigaziorako eta pantaila-irakurleentzako.",
      supabaseH: "Diseinu Inklusiboa",
      supabaseP:
        "Kontraste analisi erreala eta prefers-reduced-motion-erako euskarri natiboa.",
      outcomeH: "100% Lighthouse A11Y",
      outcomeP:
        "Pertsona guztientzako interfaze erabilgarria, salbuespenik gabe.",
      codeSpotlight: "useFocusTrap.ts — React Hook",
      techBadges: ["WCAG-conscious", "Focus Trap", "A11Y", "Semantic HTML"],
    },
    fr: {
      title: "PKE Web",
      subtitle: "Accessibilité & Sémantique",
      role: "UX/A11Y Developer",
      objective:
        "Plateforme conçue avec des considérations d'accessibilité (WCAG-conscious).",
      algorithmH: "Focus Trapping & ARIA Roles",
      algorithmP:
        "Gestion parfaite du DOM pour la navigation au clavier et les lecteurs d'écran.",
      supabaseH: "Design Inclusif",
      supabaseP:
        "Analyse réelle du contraste et support natif de prefers-reduced-motion.",
      outcomeH: "100% Lighthouse A11Y",
      outcomeP: "Interface accessible à tous sans exception.",
      codeSpotlight: "useFocusTrap.ts — React Hook",
      techBadges: ["WCAG-conscious", "Focus Trap", "A11Y", "Semantic HTML"],
    },
    it: {
      title: "PKE Web",
      subtitle: "Accessibilità & Semantica",
      role: "UX/A11Y Developer",
      objective:
        "Piattaforma progettata con considerazioni sull'accessibilità.",
      algorithmH: "Focus Trapping & ARIA Roles",
      algorithmP:
        "Gestione impeccabile del DOM per navigazione da tastiera e screen reader.",
      supabaseH: "Design Inclusivo",
      supabaseP:
        "Analisi reale del contrasto e supporto per prefers-reduced-motion.",
      outcomeH: "100% Lighthouse A11Y",
      outcomeP: "Interfaccia utilizzabile da chiunque senza eccezioni.",
      codeSpotlight: "useFocusTrap.ts — React Hook",
      techBadges: ["WCAG-conscious", "Focus Trap", "A11Y", "Semantic HTML"],
    },
    de: {
      title: "PKE Web",
      subtitle: "Barrierefreiheit & Semantik",
      role: "UX/A11Y Developer",
      objective:
        "Plattform mit Fokus auf Barrierefreiheit, unter Berücksichtigung von A11y-Richtlinien.",
      algorithmH: "Focus Trapping & ARIA Roles",
      algorithmP: "DOM-Management für Tastaturnavigation und Screenreader.",
      supabaseH: "Inklusives Design",
      supabaseP:
        "Echtzeit-Kontrastanalyse und Support für prefers-reduced-motion.",
      outcomeH: "100% Lighthouse A11Y",
      outcomeP: "Uneingeschränkt nutzbare Schnittstelle für alle.",
      codeSpotlight: "useFocusTrap.ts — React Hook",
      techBadges: ["WCAG-conscious", "Focus Trap", "A11Y", "Semantic HTML"],
    },
    pt: {
      title: "PKE Web",
      subtitle: "Acessibilidade & Semântica",
      role: "UX/A11Y Developer",
      objective:
        "Plataforma projetada com considerações de acessibilidade (WCAG-conscious).",
      algorithmH: "Focus Trapping & ARIA Roles",
      algorithmP:
        "Gestão impecável do DOM para navegação por teclado e leitores de ecrã.",
      supabaseH: "Design Inclusivo",
      supabaseP:
        "Análise de contraste real e suporte nativo para prefers-reduced-motion.",
      outcomeH: "100% Lighthouse A11Y",
      outcomeP: "Interface utilizável por todos sem exceções.",
      codeSpotlight: "useFocusTrap.ts — React Hook",
      techBadges: ["WCAG-conscious", "Focus Trap", "A11Y", "Semantic HTML"],
    },
    ca: {
      title: "PKE Web",
      subtitle: "Accessibilitat & Semàntica",
      role: "UX/A11Y Developer",
      objective: "Plataforma dissenyada amb consideracions d'accessibilitat.",
      algorithmH: "Focus Trapping & ARIA Roles",
      algorithmP:
        "Gestió perfecta del DOM per a navegació per teclat i lectors de pantalla.",
      supabaseH: "Disseny Inclusiu",
      supabaseP:
        "Anàlisi de contrast real i suport natiu per prefers-reduced-motion.",
      outcomeH: "100% Lighthouse A11Y",
      outcomeP: "Interfície accessible per a tothom sense excepcions.",
      codeSpotlight: "useFocusTrap.ts — React Hook",
      techBadges: ["WCAG-conscious", "Focus Trap", "A11Y", "Semantic HTML"],
    },
    gl: {
      title: "PKE Web",
      subtitle: "Accesibilidade & Semántica",
      role: "UX/A11Y Developer",
      objective: "Plataforma deseñada con consideracións de accesibilidade.",
      algorithmH: "Focus Trapping & ARIA Roles",
      algorithmP:
        "Xestión perfecta do DOM para navegación por teclado e lectores de pantalla.",
      supabaseH: "Deseño Inclusivo",
      supabaseP:
        "Análise de contraste real e soporte nativo para prefers-reduced-motion.",
      outcomeH: "100% Lighthouse A11Y",
      outcomeP: "Interface utilizable por calquera persoa sen excepcións.",
      codeSpotlight: "useFocusTrap.ts — React Hook",
      techBadges: ["WCAG-conscious", "Focus Trap", "A11Y", "Semantic HTML"],
    },
    ja: {
      title: "PKE Web",
      subtitle: "アクセシビリティ & セマンティクス",
      role: "UX/A11Y デベロッパー",
      objective: "アクセシビリティに配慮して設計されたプラットフォーム。",
      algorithmH: "フォーカストラップ & ARIA ロール",
      algorithmP:
        "キーボードナビゲーションとスクリーンリーダーのための完璧な DOM 管理。",
      supabaseH: "インクルーシブデザイン",
      supabaseP:
        "実際のコントラスト分析と prefers-reduced-motion のネイティブサポート。",
      outcomeH: "100% Lighthouse A11Y",
      outcomeP: "例外なく誰でも利用できるインターフェース。",
      codeSpotlight: "useFocusTrap.ts — React Hook",
      techBadges: ["WCAG-conscious", "Focus Trap", "A11Y", "Semantic HTML"],
    },
    zh: {
      title: "PKE 网页端",
      subtitle: "默认无障碍(A11y)语义化网页",
      role: "UX 与无障碍开发专家",
      objective:
        "打造无障碍设计并非点缀而是核心架构的标杆界面：全键盘导航、屏幕阅读器高度适配、强对比度以及尊重减弱动画偏好。",
      algorithmH: "焦点管理与 ARIA 规范架构",
      algorithmP:
        "对 DOM 进行精准控制，构建出行为可预测、静默且完全由键盘驱动的完美无障碍浏览路径。",
      supabaseH: "极致包容性设计",
      supabaseP:
        "通过严格的对比度审计、可见焦点状态提示以及对 prefers-reduced-motion 的原生适配，确保人人皆可平等享用。",
      outcomeH: "无妥协的无障碍体验",
      outcomeP:
        "语义化基石保障系统轻松承载无障碍组件，提供始终满分的 Lighthouse A11Y 表现。",
      codeSpotlight: "useFocusTrap.ts — 核心无障碍 Hook",
      techBadges: ["WCAG-conscious", "Focus Trap", "A11Y", "Semantic HTML"],
    },
    ar: {
      title: "PKE Web",
      subtitle: "دلالات سهولة الوصول بشكل افتراضي",
      role: "مطور واجهات المستخدم وإمكانية الوصول (A11Y)",
      objective:
        "بناء واجهة لا تكون فيها إمكانية الوصول مجرد طبقة إضافية بل هي صلب البنية الهيكلية: لوحة المفاتيح، قارئات الشاشة، والتباين العالي.",
      algorithmH: "بنية إدارة التركيز وأدوار ARIA",
      algorithmP:
        "التحكم الصارم في شجرة DOM لإنشاء مسار تنقل متوقع، هادئ، ويمكن التحكم فيه بالكامل عبر لوحة المفاتيح.",
      supabaseH: "التصميم الشامل للجميع",
      supabaseP:
        "عمليات تدقيق التباين، والتركيز المرئي النشط، والاحترام الكامل لإعدادات prefers-reduced-motion لتجربة لا تستثني أحداً.",
      outcomeH: "إمكانية وصول بلا مساومات",
      outcomeP:
        "قاعدة دلالية متينة جاهزة للنمو مع مكونات سهلة الاستخدام ودرجة Lighthouse قوية وثابتة.",
      codeSpotlight: "useFocusTrap.ts — إدارة التركيز الفعالة",
      techBadges: ["WCAG-conscious", "Focus Trap", "A11Y", "Semantic HTML"],
    },
    ru: {
      title: "PKE Web",
      subtitle: "Доступная семантика по умолчанию",
      role: "Разработчик UX/A11Y",
      objective:
        "Создать интерфейс, в котором доступность является не дополнительным слоем, а самой архитектурой: клавиатура, экранные дикторы, контрастность и уменьшенное движение.",
      algorithmH: "Архитектура фокуса и ARIA",
      algorithmP:
        "Строгий контроль DOM для создания предсказуемой, тихой и полностью управляемой с клавиатуры модели навигации.",
      supabaseH: "Инклюзивный дизайн",
      supabaseP:
        "Проверенная контрастность, видимые состояния и полное уважение к prefers-reduced-motion, чтобы никто не остался в стороне.",
      outcomeH: "A11Y без компромиссов",
      outcomeP:
        "Семантическая база, готовая к масштабированию с помощью доступных компонентов и стабильно высокой оценки Lighthouse.",
      codeSpotlight: "useFocusTrap.ts — Ядро доступности",
      techBadges: ["WCAG-conscious", "Focus Trap", "A11Y", "Semantic HTML"],
    },
    ko: {
      title: "PKE Web",
      subtitle: "기본적으로 보장되는 접근성 및 시맨틱",
      role: "UX/A11Y 개발자",
      objective:
        "접근성을 추가 레이어가 아닌 시스템 자체의 아키텍처로 구축: 키보드 제어, 스크린 리더 지원, 높은 대비, 움직임 줄이기 지원.",
      algorithmH: "포커스 아키텍처 및 ARIA",
      algorithmP:
        "엄격한 DOM 제어를 통해 예측 가능하고 차분하며, 완전히 키보드로 작동하는 내비게이션 모델을 생성합니다.",
      supabaseH: "포용적인 디자인",
      supabaseP:
        "누구도 소외되지 않도록 검증된 대비도, 명확한 포커스 상태, prefers-reduced-motion 미디어 쿼리에 대한 완벽한 배려.",
      outcomeH: "타협 없는 A11Y",
      outcomeP:
        "접근성 컴포넌트와 지속적으로 우수한 Lighthouse 접근성 점수를 기반으로 확장 가능한 시맨틱 아키텍처.",
      codeSpotlight: "useFocusTrap.ts — 접근성 코어",
      techBadges: ["WCAG-conscious", "Focus Trap", "A11Y", "Semantic HTML"],
    },
    hi: {
      title: "PKE Web",
      subtitle: "डिफ़ॉल्ट रूप से सुलभ शब्दार्थ (Accessible Semantics)",
      role: "UX/A11Y डेवलपर",
      objective:
        "एक ऐसा इंटरफ़ेस बनाना जहाँ सुलभता केवल एक अतिरिक्त परत न होकर वास्तविक आर्किटेक्चर हो: कीबोर्ड, स्क्रीन रीडर, कंट्रास्ट और कम गति।",
      algorithmH: "फ़ोकस आर्किटेक्चर और ARIA",
      algorithmP:
        "एक ऐसा नेविगेशन 모델 बनाने के लिए सख्त DOM नियंत्रण जो पूर्वानुमेय, शांत और पूरी तरह से कीबोर्ड-चालित हो।",
      supabaseH: "समावेशी डिजाइन",
      supabaseP:
        "ऑडिट किया गया कंट्रास्ट, दृश्यमान स्थितियां, और prefers-reduced-motion का पूर्ण सम्मान ताकि कोई भी बाहर न छूटे।",
      outcomeH: "बिنا किसी समझौते के A11Y",
      outcomeP:
        "सुलभ घटकों और लगातार मजबूत Lighthouse स्कोर के साथ स्केल करने के लिए तैयार एक सिमेंटिक आधार।",
      codeSpotlight: "useFocusTrap.ts — सुलभता कोर",
      techBadges: ["WCAG-conscious", "Focus Trap", "A11Y", "Semantic HTML"],
    },
    tr: {
      title: "PKE Web",
      subtitle: "Varsayılan Olarak Erişilebilir Anlambilim",
      role: "UX/A11Y Geliştirici",
      objective:
        "Erişilebilirliğin ek bir katman değil, mimarinin kendisi olduğu bir arayüz oluşturmak: klavye, ekran okuyucular, kontrast ve azaltılmış hareket.",
      algorithmH: "Odak Mimarisi & ARIA",
      algorithmP:
        "Öngörülebilir, sessiz ve tamamen klavye odaklı bir gezinme modeli oluşturmak için katı DOM kontrolü.",
      supabaseH: "Kapsayıcı Tasarım",
      supabaseP:
        "Hiç kimseyi dışarıda bırakmamak için denetlenmiş kontrast, görünür durumlar ve prefers-reduced-motion'a tam saygı.",
      outcomeH: "Tavizsiz A11Y",
      outcomeP:
        "Erişilebilir bileşenler ve sürekli olarak yüksek bir Lighthouse puanı ile ölçeklenmeye hazır anlamsal bir temel.",
      codeSpotlight: "useFocusTrap.ts — Erişilebilirlik Çekirdeği",
      techBadges: ["WCAG-conscious", "Focus Trap", "A11Y", "Semantic HTML"],
    },
    nl: {
      title: "PKE Web",
      subtitle: "Standaard Toegankelijke Semantiek",
      role: "UX/A11Y Ontwikkelaar",
      objective:
        "Bouw een interface waarin toegankelijkheid geen extra laag is, maar de architectuur zelf: toetsenbord, schermlezers, contrast en verminderde beweging.",
      algorithmH: "Focusarchitectuur & ARIA",
      algorithmP:
        "Strikte DOM-controle zorgt voor een navigatiemodel dat voorspelbaar, stil en volledig toetsenbordgestuurd aanvoelt.",
      supabaseH: "Inclusief Ontwerp",
      supabaseP:
        "Gecontroleerd contrast, zichtbare staten en volledig respect voor prefers-reduced-motion om uitsluiting te voorkomen.",
      outcomeH: "A11Y zonder Compromissen",
      outcomeP:
        "Een semantische basis die klaar is om te schalen met toegankelijke componenten en een consistent sterke Lighthouse-score.",
      codeSpotlight: "useFocusTrap.ts — Toegankelijkheidskern",
      techBadges: ["WCAG-conscious", "Focus Trap", "A11Y", "Semantic HTML"],
    },
    sv: {
      title: "PKE Web",
      subtitle: "Tillgänglig Semantik som Standard",
      role: "UX/A11Y-utvecklare",
      objective:
        "Bygg ett gränssnitt där tillgänglighet inte är ett lager ovanpå utan själva arkitekturen: tangentbord, skärmläsare, kontrast och reducerad rörelse.",
      algorithmH: "Fokusarkitektur & ARIA",
      algorithmP:
        "Strikd DOM-kontroll skapar en navigeringsmodell som känns förutsägbar, tyst och helt tangentbordsstyrd.",
      supabaseH: "Inkluderande Design",
      supabaseP:
        "Granskad kontrast, synliga tillstånd och full respekt för prefers-reduced-motion för att undvika att utesluta någon.",
      outcomeH: "A11Y utan Kompromisser",
      outcomeP:
        "En semantisk bas redo att skalas med tillgängliga komponenter och ett konsekvent högt Lighthouse-resultat.",
      codeSpotlight: "useFocusTrap.ts — Tillgänglighetskärna",
      techBadges: ["WCAG-conscious", "Focus Trap", "A11Y", "Semantic HTML"],
    },
    pl: {
      title: "PKE Web",
      subtitle: "Domyślnie Dostępna Semantyka",
      role: "Deweloper UX/A11Y",
      objective:
        "Budowa interfejsu, w którym dostępność nie jest dodatkową warstwą, lecz samą architekturą: obsługa klawiatury, czytniki ekranu, kontrast i zredukowany ruch.",
      algorithmH: "Architektura Focusa & ARIA",
      algorithmP:
        "Rygorystyczna kontrola DOM tworzy model nawigacji, który jest przewidywalny, cichy i w pełni sterowany klawiaturą.",
      supabaseH: "Projektowanie Inkluzywne",
      supabaseP:
        "Audytowany kontrast, widoczne stany i pełne poszanowanie prefers-reduced-motion, aby nikogo nie wykluczać.",
      outcomeH: "A11Y bez Kompromisów",
      outcomeP:
        "Baza semantyczna gotowa na rozwój dzięki dostępnym komponentom i stale wysokiemu wynikowi Lighthouse.",
      codeSpotlight: "useFocusTrap.ts — Rdzeń Dostępności",
      techBadges: ["WCAG-conscious", "Focus Trap", "A11Y", "Semantic HTML"],
    },
    vi: {
      title: "PKE Web",
      subtitle: "Truy cập ngữ nghĩa theo mặc định",
      role: "Lập trình viên UX/A11Y",
      objective:
        "Truy cập ngữ nghĩa theo mặc định để người khuyết tật cũng dễ dàng sử dụng.",
      algorithmH: "Kiến trúc Focus & ARIA",
      algorithmP:
        "Kiểm soát DOM nghiêm ngặt để tạo ra mô hình điều hướng dễ dự đoán, mượt mà và hoàn toàn điều khiển bằng bàn phím.",
      supabaseH: "Thiết kế Đa dạng Hóa",
      supabaseP:
        "Độ tương phản được kiểm tra kỹ, hiển thị rõ ràng các trạng thái, tôn trọng hoàn toàn thuộc tính prefers-reduced-motion để không bỏ lại bất cứ ai.",
      outcomeH: "A11Y không thỏa hiệp",
      outcomeP:
        "Nền tảng ngữ nghĩa sẵn sàng mở rộng cùng các thành phần tiếp cận và điểm số Lighthouse cao nhất quán.",
      codeSpotlight: "useFocusTrap.ts — Nhân Focus Trap",
      techBadges: ["WCAG-conscious", "Focus Trap", "A11Y", "Semantic HTML"],
    },
  },
};

export const CODE_SNIPPETS: Record<string, string> = {
  "ana-peluquera": `// useCreateBooking.ts — Firebase Orchestrator
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

  "who-are-ya-backend": `// players.controller.js — MongoDB Filter Engine
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

  rides24ofiziala: `// RideService.java — JAX-WS Atomic Seat Lock
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

  "spotshare-parking": `// parking.service.ts — Optimistic Locking
@Injectable()
export class ParkingService {
  async reserveSpot(spotId: string, userId: string, currentVersion: number) {
    const result = await this.db.spots.updateOne(
      { _id: spotId, version: currentVersion, status: 'AVAILABLE' },
      { $set: { status: 'OCCUPIED', reservedBy: userId, reservedAt: new Date() }, $inc: { version: 1 } }
    );
    if (result.modifiedCount === 0) throw new ConcurrencyException('Spot already updated');
    return { ok: true, spotId, reservedBy: userId };
  }
}`,

  "pke-web": `// useFocusTrap.ts — Accessibility/A11y Focus Hook
export const useFocusTrap = (ref: RefObject<HTMLElement>, isActive: boolean) => {
  useEffect(() => {
    if (!isActive || !ref.current) return;
    const focusable = ref.current.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    const first = focusable[0] as HTMLElement;
    const last = focusable[focusable.length - 1] as HTMLElement;
    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', handleTab);
    return () => document.removeEventListener('keydown', handleTab);
  }, [isActive, ref]);
};`,
};
