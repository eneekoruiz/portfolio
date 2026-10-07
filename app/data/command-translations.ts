import type { Lang } from "../types";

interface CommandCopy {
  hint: string;
  touchHint: string;
  options: string;
  noResults: string;
  retry: string;
}

export const COMMAND_COPY: Record<Lang, CommandCopy> = {
  es: {
    hint: "Usa ↑ ↓ y Enter para navegar",
    touchHint: "Selecciona una opción",
    options: "opciones",
    noResults: "Sin resultados",
    retry: "Prueba otra búsqueda o pulsa Esc para cerrar.",
  },
  en: {
    hint: "Use ↑ ↓ and Enter to navigate",
    touchHint: "Select an option",
    options: "options",
    noResults: "No results",
    retry: "Try another search or press Esc to close.",
  },
  eu: {
    hint: "Erabili ↑ ↓ eta Enter nabigatzeko",
    touchHint: "Aukeratu aukera bat",
    options: "aukera",
    noResults: "Ez dago emaitzarik",
    retry: "Saiatu beste bilaketa batekin edo sakatu Esc ixteko.",
  },
  fr: {
    hint: "Utilisez ↑ ↓ et Entrée pour naviguer",
    touchHint: "Sélectionnez une option",
    options: "options",
    noResults: "Aucun résultat",
    retry: "Essayez une autre recherche ou appuyez sur Échap pour fermer.",
  },
  it: {
    hint: "Usa ↑ ↓ e Invio per navigare",
    touchHint: "Seleziona un’opzione",
    options: "opzioni",
    noResults: "Nessun risultato",
    retry: "Prova un’altra ricerca o premi Esc per chiudere.",
  },
  de: {
    hint: "Mit ↑ ↓ und Enter navigieren",
    touchHint: "Wähle eine Option",
    options: "Optionen",
    noResults: "Keine Ergebnisse",
    retry: "Versuche eine andere Suche oder drücke Esc zum Schließen.",
  },
  pt: {
    hint: "Usa ↑ ↓ e Enter para navegar",
    touchHint: "Seleciona uma opção",
    options: "opções",
    noResults: "Sem resultados",
    retry: "Tenta outra pesquisa ou prime Esc para fechar.",
  },
  ca: {
    hint: "Fes servir ↑ ↓ i Retorn per navegar",
    touchHint: "Selecciona una opció",
    options: "opcions",
    noResults: "Cap resultat",
    retry: "Prova una altra cerca o prem Esc per tancar.",
  },
  gl: {
    hint: "Usa ↑ ↓ e Intro para navegar",
    touchHint: "Selecciona unha opción",
    options: "opcións",
    noResults: "Sen resultados",
    retry: "Proba outra busca ou preme Esc para pechar.",
  },
  ja: {
    hint: "↑ ↓ と Enter で選択",
    touchHint: "項目を選択",
    options: "件の項目",
    noResults: "結果がありません",
    retry: "別の語句で検索するか、Esc で閉じてください。",
  },
  zh: {
    hint: "使用 ↑ ↓ 和 Enter 进行选择",
    touchHint: "选择一个选项",
    options: "个选项",
    noResults: "没有结果",
    retry: "尝试其他搜索词，或按 Esc 关闭。",
  },
  ar: {
    hint: "استخدم ↑ ↓ وEnter للتنقل",
    touchHint: "اختر خيارًا",
    options: "خيارات",
    noResults: "لا توجد نتائج",
    retry: "جرّب بحثًا آخر أو اضغط Esc للإغلاق.",
  },
  ru: {
    hint: "Выбирайте с помощью ↑ ↓ и Enter",
    touchHint: "Выберите вариант",
    options: "вариантов",
    noResults: "Ничего не найдено",
    retry: "Измените запрос или нажмите Esc, чтобы закрыть.",
  },
  ko: {
    hint: "↑ ↓와 Enter로 선택",
    touchHint: "옵션을 선택하세요",
    options: "개 옵션",
    noResults: "검색 결과가 없습니다",
    retry: "다른 검색어를 입력하거나 Esc를 눌러 닫으세요.",
  },
  hi: {
    hint: "चुनने के लिए ↑ ↓ और Enter का उपयोग करें",
    touchHint: "एक विकल्प चुनें",
    options: "विकल्प",
    noResults: "कोई परिणाम नहीं मिला",
    retry: "दूसरा खोज शब्द आज़माएँ या बंद करने के लिए Esc दबाएँ।",
  },
  tr: {
    hint: "Gezinmek için ↑ ↓ ve Enter kullanın",
    touchHint: "Bir seçenek seçin",
    options: "seçenek",
    noResults: "Sonuç bulunamadı",
    retry: "Başka bir arama deneyin veya kapatmak için Esc tuşuna basın.",
  },
  nl: {
    hint: "Navigeer met ↑ ↓ en Enter",
    touchHint: "Kies een optie",
    options: "opties",
    noResults: "Geen resultaten",
    retry: "Probeer een andere zoekterm of druk op Esc om te sluiten.",
  },
  sv: {
    hint: "Navigera med ↑ ↓ och Enter",
    touchHint: "Välj ett alternativ",
    options: "alternativ",
    noResults: "Inga resultat",
    retry: "Prova en annan sökning eller tryck på Esc för att stänga.",
  },
  pl: {
    hint: "Wybieraj za pomocą ↑ ↓ i Enter",
    touchHint: "Wybierz opcję",
    options: "opcji",
    noResults: "Brak wyników",
    retry: "Spróbuj innego wyszukiwania lub naciśnij Esc, aby zamknąć.",
  },
  vi: {
    hint: "Dùng ↑ ↓ và Enter để chọn",
    touchHint: "Chọn một tùy chọn",
    options: "tùy chọn",
    noResults: "Không có kết quả",
    retry: "Thử từ khóa khác hoặc nhấn Esc để đóng.",
  },
};
