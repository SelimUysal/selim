/*
 * Portfolio content — one source of truth for both languages and both audiences.
 * Verified links, documents and content for both audience views are maintained here.
 * A project is shown only when its showOn list includes that page.
 */
export const profile = {
  name: 'Selim Uysal',
  github: 'https://github.com/SelimUysal',
  email: 'uys.selim@gmail.com',
  academicCvPdf: './assets/cv/selim-uysal-academic-cv.pdf',
  linktree: 'https://linktr.ee/selim_uysal',
  education: { school: 'Atılım University', degree: 'B.Sc. in Software Engineering', year: '2025' },
};

export const projects = [
  {
    "id": "teknofest",
    "showOn": [
      "academic"
    ],
    "theme": "indigo",
    "symbol": "✧",
    "year": "2024",
    "type": {
      "en": "AI competition · undergraduate team",
      "tr": "Yapay zekâ yarışması · lisans ekibi"
    },
    "name": {
      "en": "AI in Transportation · TEKNOFEST",
      "tr": "Ulaşımda Yapay Zekâ · TEKNOFEST"
    },
    "description": {
      "en": "SEE AI team project studying aerial detection of people, vehicles and landing zones, comparing YOLOv8/YOLOv9 and SAHI alongside research into visual positioning. Our team ranked 11th of 198 teams in the preliminary design report evaluation; this was not the final competition ranking.",
      "tr": "SEE AI ekibinde havadan insan, araç ve iniş alanı tespiti için YOLOv8/YOLOv9 ile SAHI karşılaştırmaları ve görsel konum kestirimi araştırması. Ön tasarım raporu değerlendirmesinde 198 takım arasında 11. olduk; bu sonuç yarışmanın genel final sıralaması değildir."
    },
    "stack": [
      "YOLOv8 / YOLOv9",
      "SAHI",
      "Computer Vision",
      "Research Report"
    ],
    "links": [
      {
        "kind": "report",
        "url": "./assets/reports/teknofest-ai-transportation.pdf"
      }
    ]
  },
  {
    "id": "oracle",
    "showOn": [
      "academic"
    ],
    "theme": "copper",
    "symbol": "▦",
    "year": "2024",
    "type": {
      "en": "CMPE341 · course project",
      "tr": "CMPE341 · ders projesi"
    },
    "name": {
      "en": "SEEapp · Student Information System Database",
      "tr": "SEEapp · Öğrenci Bilgi Sistemi Veritabanı"
    },
    "description": {
      "en": "Oracle-based relational database coursework covering a stakeholder requirements survey, ER/EER and logical diagrams, normalized data relationships, Oracle SQL implementation and example queries for academic records.",
      "tr": "Paydaş gereksinimi anketi, ER/EER ve mantıksal tasarım, ilişkisel veri yapıları, Oracle SQL ile fiziksel uygulama ve örnek sorgular içeren öğrenci bilgi sistemi çalışması."
    },
    "stack": [
      "Oracle SQL",
      "ER / EER",
      "Relational Modeling",
      "SQL Queries"
    ],
    "links": [
      {
        "kind": "report",
        "url": "./assets/reports/oracle-student-information-system.pdf"
      }
    ]
  },
  {
    "id": "patterns",
    "showOn": [
      "academic"
    ],
    "theme": "teal",
    "symbol": "◇",
    "year": "Undergraduate",
    "type": {
      "en": "SE461 · technical coursework",
      "tr": "SE461 · teknik ders çalışması"
    },
    "name": {
      "en": "Object-Oriented Design & Design Patterns",
      "tr": "Nesne Yönelimli Tasarım ve Tasarım Kalıpları"
    },
    "description": {
      "en": "An illustrated technical study of SOLID principles, creational, structural and behavioral design patterns, their engineering trade-offs and anti-patterns, supported by original C++ examples. This is undergraduate coursework, not a peer-reviewed publication.",
      "tr": "SOLID ilkeleri, oluşturucu, yapısal ve davranışsal tasarım kalıpları, tasarım ödünleşimleri ve anti-pattern konularını C++ örnekleriyle inceleyen teknik lisans raporu. Hakemli yayın değildir."
    },
    "stack": [
      "C++",
      "SOLID",
      "Design Patterns",
      "Maintainability"
    ],
    "links": [
      {
        "kind": "report",
        "url": "./assets/reports/se461-design-patterns.pdf"
      }
    ]
  },
  {
    "id": "hayat",
    "showOn": [
      "industry"
    ],
    "theme": "mint",
    "symbol": "✦",
    "year": "Web application",
    "type": {
      "en": "Live web application",
      "tr": "Yayında olan web uygulaması"
    },
    "name": {
      "en": "Hayat Rehberi",
      "tr": "Hayat Rehberi"
    },
    "description": {
      "en": "Designed and developed a responsive, multi-module web platform with prayer schedules, Quran reading and audio, memorization practice, progress tracking, Islamic learning resources and integrated search.",
      "tr": "Namaz vakitleri, Kur’an okuma ve dinleme, ezber alıştırmaları, ilerleme takibi, eğitsel kaynaklar ve entegre aramayı birleştiren çok modüllü, mobil uyumlu web platformu."
    },
    "stack": [
      "React",
      "TypeScript",
      "Vite",
      "Tailwind CSS"
    ],
    "links": [
      {
        "kind": "live",
        "url": "https://selimuysal.github.io/hayat-rehberi/"
      },
      {
        "kind": "source",
        "url": "https://github.com/SelimUysal/hayat-rehberi"
      }
    ]
  },
  {
    "id": "video",
    "showOn": [
      "industry"
    ],
    "theme": "violet",
    "symbol": "▷",
    "year": "Browser extension",
    "type": {
      "en": "Published Chrome extension",
      "tr": "Yayımlanmış Chrome eklentisi"
    },
    "name": {
      "en": "Video Speed",
      "tr": "Video Speed"
    },
    "description": {
      "en": "Published a Chrome extension for controlling HTML5 video speed with 0.1× adjustments, keyboard shortcuts, 10-second skips, movable overlay controls and saved per-site preferences.",
      "tr": "HTML5 videolar için 0,1× hassasiyetli hız ayarı, klavye kısayolları, 10 saniyelik ileri/geri sarma, taşınabilir kontrol paneli ve siteye özel tercih saklama sunan Chrome eklentisi."
    },
    "stack": [
      "JavaScript",
      "Manifest V3",
      "HTML / CSS",
      "Browser APIs"
    ],
    "links": [
      {
        "kind": "store",
        "url": "https://chromewebstore.google.com/detail/video-speed/cmjafmcaccbhfgcjnfldaahebnbbppje"
      },
      {
        "kind": "source",
        "url": "https://github.com/SelimUysal/video-speed"
      }
    ]
  },
  {
    "id": "telegram",
    "showOn": [
      "industry"
    ],
    "theme": "blue",
    "symbol": "↗",
    "year": "Automation prototype",
    "type": {
      "en": "Educational automation prototype",
      "tr": "Eğitsel otomasyon prototipi"
    },
    "name": {
      "en": "News-to-Telegram Automation",
      "tr": "Telegram Haber Otomasyonu"
    },
    "description": {
      "en": "Built a Node.js and Python news aggregation prototype using web scraping, JSON persistence, duplicate checking and Telegram Bot API messaging. Includes a recorded walkthrough; requires local configuration to run.",
      "tr": "Web kazıma, JSON kayıt, tekrar eden haberleri ayıklama ve Telegram Bot API ile iletim iş akışlarını birleştiren Node.js/Python haber toplama prototipi. Video anlatımı bulunur; çalıştırmak için yerel yapılandırma gerektirir."
    },
    "stack": [
      "Node.js",
      "Python",
      "Puppeteer",
      "Telegram Bot API"
    ],
    "links": [
      {
        "kind": "source",
        "url": "https://github.com/SelimUysal/telegramaHaberGonder"
      },
      {
        "kind": "video",
        "url": "https://www.youtube.com/watch?v=R9HX1uPrGEg"
      }
    ]
  },
  {
    "id": "quran",
    "showOn": [
      "industry"
    ],
    "theme": "amber",
    "symbol": "⌘",
    "year": "Web application",
    "type": {
      "en": "Live interactive web application",
      "tr": "Canlı etkileşimli web uygulaması"
    },
    "name": {
      "en": "Quran Memorization & Arabic Analysis",
      "tr": "Kur’an Ezber ve Arapça Analiz"
    },
    "description": {
      "en": "Interactive Quran reading and memorization with selectable Arabic text, audio repetition and speed controls, reading preferences, and optional Gemini-powered linguistic analysis.",
      "tr": "Seçilebilir Arapça metinler, sesli tekrar ve hız ayarları, okuma tercihleri ve isteğe bağlı Gemini destekli dil çözümlemesi sunan etkileşimli Kur’an okuma ve ezber uygulaması."
    },
    "stack": [
      "JavaScript",
      "ES Modules",
      "Audio APIs",
      "Gemini API"
    ],
    "links": [
      {
        "kind": "live",
        "url": "https://selimuysal.github.io/kuran-ezber/"
      },
      {
        "kind": "source",
        "url": "https://github.com/SelimUysal/kuran-ezber"
      }
    ]
  }
];

export const archive = [
  {
    "id": "python-exercises",
    "name": {
      "en": "Python Programming Exercises",
      "tr": "Python Programlama Alıştırmaları"
    },
    "description": {
      "en": "Four educational Python exercises exploring recursion, parsing, functions and text processing.",
      "tr": "Özyineleme, ayrıştırma, fonksiyonlar ve metin işlemeyi kapsayan dört eğitsel Python alıştırması."
    },
    "technology": "Python",
    "url": "https://github.com/SelimUysal/Python-simple-code"
  },
  {
    "id": "c-exercises",
    "name": {
      "en": "C Programming Exercises",
      "tr": "C Programlama Alıştırmaları"
    },
    "description": {
      "en": "An archive of 89 C exercises, string processing examples and one C++ example.",
      "tr": "89 adet C alıştırması, metin işleme örnekleri ve bir C++ örneği içeren arşiv."
    },
    "technology": "C / C++",
    "url": "https://github.com/SelimUysal/C-dili-ornekler"
  },
  {
    "id": "sql-resources",
    "name": {
      "en": "SQL Practice Resources",
      "tr": "SQL Çalışma Kaynakları"
    },
    "description": {
      "en": "SQL practice examples and learning materials; a resource repository rather than a software product.",
      "tr": "Bir yazılım ürünü değil; SQL sorgu örnekleri ve çalışma dokümanları koleksiyonu."
    },
    "technology": "SQL",
    "url": "https://github.com/SelimUysal/SQL-examples"
  }
];

export const research = [
  {symbol:'◈',title:{en:'Machine Learning & LLMs',tr:'Makine Öğrenmesi ve LLM’ler'},description:{en:'Learning how models are evaluated, adapted and integrated into usable systems.',tr:'Modellerin nasıl değerlendirildiğini, uyarlandığını ve kullanılabilir sistemlere entegre edildiğini araştırmak.'}},
  {symbol:'⌁',title:{en:'Intelligent Agents',tr:'Akıllı Ajanlar'},description:{en:'Multi-step reasoning, tool use and coordination in AI-enabled workflows.',tr:'Yapay zekâ destekli iş akışlarında çok adımlı akıl yürütme, araç kullanımı ve koordinasyon.'}},
  {symbol:'▥',title:{en:'Software Quality & Systems',tr:'Yazılım Kalitesi ve Sistemler'},description:{en:'Maintainability, architecture, reliability and practical engineering trade-offs.',tr:'Sürdürülebilirlik, mimari, güvenilirlik ve pratik mühendislik ödünleşimleri.'}},
  {symbol:'◎',title:{en:'Autonomous Systems',tr:'Otonom Sistemler'},description:{en:'Applied AI for decision-making and systems operating under constraints.',tr:'Karar verme ve kısıtlı koşullarda çalışan sistemler için uygulamalı yapay zekâ.'}}
];

export const engineering = [
  {symbol:'⌘',title:{en:'Product-oriented Web Development',tr:'Ürün Odaklı Web Geliştirme'},description:{en:'Responsive interfaces and user-centered application design.',tr:'Mobil uyumlu arayüzler ve kullanıcı merkezli uygulama tasarımı.'}},
  {symbol:'◇',title:{en:'Browser & Client-side Tools',tr:'Tarayıcı ve İstemci Araçları'},description:{en:'Extensions, interaction design and browser-side functionality.',tr:'Eklentiler, etkileşim tasarımı ve tarayıcı tarafında çalışan işlevler.'}},
  {symbol:'↗',title:{en:'Automation & Integration',tr:'Otomasyon ve Entegrasyon'},description:{en:'Scripting, data workflows, external APIs and scheduled processes.',tr:'Betikler, veri iş akışları, harici API’ler ve zamanlanmış süreçler.'}},
  {symbol:'✦',title:{en:'Applied AI Features',tr:'Uygulamalı Yapay Zekâ Özellikleri'},description:{en:'Exploring where AI-assisted experiences create practical value.',tr:'Yapay zekâ destekli deneyimlerin pratik değer üretebildiği alanları geliştirmek.'}}
];

export const experiences = [
  {
    "name": "AYESAŞ",
    "date": "Jul 2024 – Jan 2025",
    "kind": {
      "en": "Full-Stack Software Development Intern",
      "tr": "Full-Stack Yazılım Geliştirme Stajyeri"
    },
    "description": {
      "en": "Designed a web-based device and component management application with a React interface, Spring Boot REST APIs, PostgreSQL and PDF/HTML/JSON export functionality.",
      "tr": "React arayüzü, Spring Boot REST API’leri, PostgreSQL ve PDF/HTML/JSON dışa aktarma özellikleriyle web tabanlı cihaz ve bileşen yönetimi uygulaması geliştirdi."
    }
  },
  {
    "name": "LENTATEK",
    "date": "Sep 2022 – Jun 2024",
    "kind": {
      "en": "Embedded Systems Intern",
      "tr": "Gömülü Sistemler Stajyeri"
    },
    "description": {
      "en": "Developed Qt-based interfaces, worked with serial communications and configured Ubuntu environments for embedded systems workflows.",
      "tr": "Qt tabanlı arayüzler geliştirdi; seri haberleşme ve Ubuntu ortamının gömülü sistemler için yapılandırılması üzerinde çalıştı."
    }
  },
  {
    "name": "DENEYAP Technology Workshops",
    "date": "~18 months",
    "kind": {
      "en": "STEM Instructor",
      "tr": "STEM Eğitmeni"
    },
    "description": {
      "en": "Taught software, robotics, electronics and introductory IoT to middle- and high-school students; mentored student projects, competition preparation and took part in project juries.",
      "tr": "Ortaokul ve lise öğrencilerine yazılım, robotik, elektronik ve temel IoT eğitimi verdi; öğrenci projeleri ve yarışma hazırlıklarında mentorluk yaptı, proje jürilerinde görev aldı."
    }
  }
];

export const honors = [
  {date:'2025',tag:{en:'Education',tr:'Eğitim'},name:{en:'B.Sc. Software Engineering',tr:'Yazılım Mühendisliği Lisans'},detail:{en:'Atılım University',tr:'Atılım Üniversitesi'}},
  {date:'2024',tag:{en:'Competition milestone',tr:'Yarışma aşaması'},name:{en:'11th of 198 teams · preliminary design',tr:'198 takım arasında 11. · ön tasarım'},detail:{en:'TEKNOFEST AI in Transportation — preliminary design report evaluation only',tr:'TEKNOFEST Ulaşımda Yapay Zekâ — yalnızca ön tasarım raporu değerlendirmesi'}},
  {date:'2023',tag:{en:'Recognition',tr:'Başarı belgesi'},name:{en:'Fall Semester Honor Certificate',tr:'Güz Dönemi Onur Belgesi'},detail:{en:'Atılım University',tr:'Atılım Üniversitesi'}}
];

/* Leave empty until you provide certificate names, issuers, dates and evidence links. */
export const certificates = [
  {
    "id": "genai-llm",
    "title": {
      "en": "Generative AI with Large Language Models",
      "tr": "Büyük Dil Modelleriyle Üretken Yapay Zekâ"
    },
    "issuer": "DeepLearning.AI · AWS · Coursera",
    "year": "02 Feb 2024",
    "url": "https://www.coursera.org/verify/FZD64R69X7BA",
    "pdf": "./assets/certificates/generative-ai-llms-coursera.pdf"
  },
  {
    "id": "oracle-sql",
    "title": {
      "en": "Oracle SQL: From Beginner to Advanced",
      "tr": "Sıfırdan İleri Seviye Oracle-SQL"
    },
    "issuer": "BTK Akademi",
    "year": "16 Jan 2024",
    "pdf": "./assets/certificates/oracle-sql-btk-akademi.pdf"
  }
];

export const translations = {
  en:{
    aboutNav:'About',unifiedFooter:'Software engineering · Applications · Research interests',
    directoryNav:'All projects',directoryTeaser:'Want to compare projects and open their evidence in one place?',directoryCTA:'Browse all projects',directoryTitle:'Selected work. One place.',directoryIntro:'A navigable record of undergraduate studies, working software, browser tools and experiments. Open a live app, install an extension, review source code or read original course reports directly from each project.',directorySearch:'Search projects, technologies…',directorySearchLabel:'Search project directory',directoryFilter:'Filter project category',directoryAll:'All projects',directoryFeatured:'featured projects',directoryArchiveCount:'learning repositories',directorySource:'Links maintained in one central source file',directoryEmpty:'No projects match your search.',
    skip:'Skip to content',academic:'Academic',industry:'Industry',navWork:'Work',navFocus:'Focus',navExperience:'Experience',navContact:'Contact',menu:'Open menu',closeMenu:'Close menu',switchTheme:'Switch color theme',themeLight:'Light appearance',themeDark:'Dark appearance',language:'Language',cv:'Résumé / CV',external:'Opens in a new tab',
    academicEyebrow:'ACADEMIC PORTFOLIO',industryEyebrow:'SOFTWARE ENGINEERING PORTFOLIO',
    academicHeroTop:'Curiosity in research.',academicHeroBottom:'Clarity in engineering.',industryHeroTop:'Built for people.',industryHeroBottom:'Engineered with care.',
    academicLead:'A software engineering graduate exploring machine learning, language models, intelligent agents and software systems — with a growing focus on graduate-level research.',
    industryLead:'I turn ideas into working software: web applications, browser extensions and automation tools, with an emphasis on usability and practical engineering.',
    academicEducation:'B.Sc. Software Engineering · Atılım University · 2025',industryEducation:'Software Engineering Graduate · Atılım University · 2025',
    viewWork:'Explore selected work',viewCV:'View résumé',github:'GitHub profile',linktree:'Find me online',
    panelAcademic:'AREAS OF EXPLORATION',panelIndustry:'FEATURED ENGINEERING WORK',
    panelAcademicHead:'From foundations to intelligent systems.',panelIndustryHead:'Made to work beyond the mockup.',
    panelAcademicFoot:'Academic interests · not claims of published research',panelIndustryFoot:'Explore working applications and source code below',
    highlight1Academic:'2025',highlight1AcademicSub:'Software engineering graduate',highlight2Academic:'2023',highlight2AcademicSub:'Fall semester honor',highlight3Academic:'11 / 198',highlight3AcademicSub:'TEKNOFEST preliminary design · 2024',
    highlight1Industry:'Applications',highlight1IndustrySub:'Live, web-based experiences',highlight2Industry:'Extensions',highlight2IndustrySub:'Published browser tool',highlight3Industry:'Automation',highlight3IndustrySub:'APIs, scripts & workflows',
    workKicker:'01 / SELECTED WORK',workTitleAcademic:'Academic & technical projects',workTitleIndustry:'Selected software projects',
    workIntroAcademic:'Undergraduate work selected for its relationship to research, design and engineering foundations.',workIntroIndustry:'A focused selection of products, experiments and open-source work — with direct evidence wherever available.',
    focusKicker:'02 / AREAS OF INTEREST',focusKickerIndustry:'02 / ENGINEERING PRACTICE',focusTitleAcademic:'Questions I want to explore.',focusTitleIndustry:'How I approach building.',
    focusIntroAcademic:'Research directions I am actively learning about, rather than a list of completed research contributions.',focusIntroIndustry:'Skills applied across small products, experiments and practical software workflows.',
    backgroundKicker:'03 / ACADEMIC BACKGROUND',backgroundTitle:'Education & recognition',backgroundIntro:'Milestones presented with their precise context.',
    experienceKickerAcademic:'04 / TEACHING & EXPERIENCE',experienceKickerIndustry:'03 / EXPERIENCE',experienceTitle:'Experience & teaching',experienceIntro:'A mix of education, teamwork and early professional exposure.',
    contactKickerAcademic:'05 / NEXT CONVERSATION',contactKickerIndustry:'04 / NEXT CONVERSATION',contactTitleAcademic:'Research starts with a conversation.',contactTitleIndustry:'Have a project in mind?',
    contactIntroAcademic:'Interested in graduate research, AI systems or software engineering collaboration? I would be glad to connect.',contactIntroIndustry:'Open to thoughtful conversations about software engineering, applications and collaboration.',
    contactButton:'Connect on GitHub',contactOther:'More contact links',
    archiveTitle:'More from GitHub',archiveIntro:'Learning repositories and code exercises — separate from deployed products.', archiveKicker:'PROJECT ARCHIVE',cardReport:'Read project report',cardDocument:'Open document',cardCertificate:'View certificate (PDF)',cardVerify:'Verify on Coursera',cardSource:'Source code',cardLive:'Live application',cardStore:'Chrome Web Store',cardVideo:'Watch walkthrough',
    certificatesTitle:'Certificates',certificatesIntro:'Selected, documented certificates relevant to software and AI.',
    footer:'Designed as one identity, for two audiences.',footerLocation:'Based in Türkiye · Open to international opportunities',
    print:'Print / Save as PDF',back:'Back to portfolio',cvAcademic:'Academic résumé',cvIndustry:'Industry résumé',cvSummaryAcademic:'Software engineering graduate focused on graduate study and research directions in AI-enabled systems.',cvSummaryIndustry:'Software engineering graduate building interactive applications, browser tools and automation workflows.',
    education:'Education',honorsTitle:'Honors & recognition',projects:'Selected projects',experience:'Experience',interests:'Interests / competencies',linkLabel:'Profile links',printNote:'Portfolio snapshot. Verify and supplement with your full application materials before official use.',
    cvAcademicTitle:'Academic CV',cvIndustryTitle:'Industry résumé'
  },
  tr:{
    aboutNav:'Hakkımda',unifiedFooter:'Yazılım mühendisliği · Uygulamalar · Araştırma ilgileri',
    directoryNav:'Tüm projeler',directoryTeaser:'Projeleri ve kanıt bağlantılarını tek bir yerde mi incelemek istiyorsunuz?',directoryCTA:'Bütün projeleri incele',directoryTitle:'Tüm çalışmalar. Tek yerde.',directoryIntro:'Lisans çalışmaları, çalışan yazılımlar, tarayıcı araçları ve deneysel projelerin düzenli arşivi. Her karttan canlı uygulamaya, mağazaya, kaynak kodlara veya ders raporlarına ulaşabilirsiniz.',directorySearch:'Proje veya teknoloji ara…',directorySearchLabel:'Proje dizininde arama',directoryFilter:'Proje kategorisi filtresi',directoryAll:'Tüm projeler',directoryFeatured:'öne çıkan proje',directoryArchiveCount:'öğrenme deposu',directorySource:'Bağlantılar tek bir merkezi dosyadan yönetilir',directoryEmpty:'Aramanızla eşleşen proje yok.',
    skip:'İçeriğe geç',academic:'Akademik',industry:'Sektörel',navWork:'Projeler',navFocus:'Odak alanları',navExperience:'Deneyim',navContact:'İletişim',menu:'Menüyü aç',closeMenu:'Menüyü kapat',switchTheme:'Görünüm temasını değiştir',themeLight:'Aydınlık görünüm',themeDark:'Karanlık görünüm',language:'Dil',cv:'Özgeçmiş / CV',external:'Yeni sekmede açılır',
    academicEyebrow:'AKADEMİK PORTFOLYO',industryEyebrow:'YAZILIM MÜHENDİSLİĞİ PORTFOLYOSU',
    academicHeroTop:'Araştırmada merak.',academicHeroBottom:'Mühendislikte açıklık.',industryHeroTop:'İnsanlar için tasarla.',industryHeroBottom:'Özenle mühendislik yap.',
    academicLead:'Makine öğrenmesi, büyük dil modelleri, akıllı ajanlar ve yazılım sistemleriyle ilgilenen; lisansüstü araştırmalara yönelen bir yazılım mühendisliği mezunuyum.',
    industryLead:'Fikirleri kullanılabilir yazılımlara dönüştürüyorum: web uygulamaları, tarayıcı eklentileri ve otomasyon araçları. Odağım kullanılabilirlik ve gerçek mühendislik problemleri.',
    academicEducation:'Yazılım Mühendisliği Lisans · Atılım Üniversitesi · 2025',industryEducation:'Yazılım Mühendisliği Mezunu · Atılım Üniversitesi · 2025',
    viewWork:'Seçilmiş projeleri incele',viewCV:'Özgeçmişi görüntüle',github:'GitHub profilim',linktree:'Diğer bağlantılarım',
    panelAcademic:'ARAŞTIRMA İLGİ ALANLARI',panelIndustry:'ÖNE ÇIKAN YAZILIMLAR',
    panelAcademicHead:'Temellerden akıllı sistemlere.',panelIndustryHead:'Tasarımdan çalışan ürüne.',
    panelAcademicFoot:'Akademik ilgi alanları · yayımlanmış araştırma iddiası değildir',panelIndustryFoot:'Canlı uygulamaları ve kaynak kodlarını aşağıda inceleyebilirsiniz',
    highlight1Academic:'2025',highlight1AcademicSub:'Yazılım mühendisliği mezuniyeti',highlight2Academic:'2023',highlight2AcademicSub:'Güz dönemi onur belgesi',highlight3Academic:'11 / 198',highlight3AcademicSub:'TEKNOFEST ön tasarım · 2024',
    highlight1Industry:'Uygulamalar',highlight1IndustrySub:'Yayında olan web deneyimleri',highlight2Industry:'Eklentiler',highlight2IndustrySub:'Yayımlanmış tarayıcı aracı',highlight3Industry:'Otomasyon',highlight3IndustrySub:'API, betik ve iş akışları',
    workKicker:'01 / SEÇİLMİŞ ÇALIŞMALAR',workTitleAcademic:'Akademik ve teknik projeler',workTitleIndustry:'Seçilmiş yazılım projeleri',
    workIntroAcademic:'Araştırma, tasarım ve mühendisliğin temelleriyle ilişkili lisans dönemi çalışmaları.',workIntroIndustry:'Kanıt bağlantılarıyla birlikte sunulan ürünler, prototipler ve açık kaynak çalışmaları.',
    focusKicker:'02 / İLGİ ALANLARI',focusKickerIndustry:'02 / MÜHENDİSLİK YAKLAŞIMI',focusTitleAcademic:'Araştırmak istediğim konular.',focusTitleIndustry:'Yazılım geliştirirken yaklaşımım.',
    focusIntroAcademic:'Tamamlanmış bilimsel katkılar değil, üzerinde öğrenim ve araştırmalarımı sürdürdüğüm yönelimler.',focusIntroIndustry:'Ürünlerde, deneysel projelerde ve pratik yazılım iş akışlarında kullandığım yetkinlikler.',
    backgroundKicker:'03 / AKADEMİK GEÇMİŞ',backgroundTitle:'Eğitim ve başarılar',backgroundIntro:'Doğru bağlamıyla ifade edilmiş kilometre taşları.',
    experienceKickerAcademic:'04 / EĞİTMENLİK VE DENEYİM',experienceKickerIndustry:'03 / DENEYİM',experienceTitle:'Deneyim ve eğitmenlik',experienceIntro:'Eğitim, takım çalışması ve profesyonel iş ortamlarından deneyimler.',
    contactKickerAcademic:'05 / İLETİŞİM',contactKickerIndustry:'04 / İLETİŞİM',contactTitleAcademic:'Araştırma bir konuşmayla başlar.',contactTitleIndustry:'Aklınızda bir proje mi var?',
    contactIntroAcademic:'Lisansüstü araştırmalar, yapay zekâ sistemleri veya yazılım mühendisliği çalışmaları hakkında iletişime geçebilirsiniz.',contactIntroIndustry:'Yazılım mühendisliği, uygulama geliştirme ve ortak çalışmalar üzerine iletişime geçebilirsiniz.',
    contactButton:'GitHub üzerinden iletişim',contactOther:'Diğer iletişim bağlantıları',
    archiveTitle:'GitHub’dan diğer çalışmalar',archiveIntro:'Yayımlanmış ürünlerden ayrı, öğrenme depoları ve kod alıştırmaları.',archiveKicker:'PROJE ARŞİVİ',cardReport:'Proje raporunu oku',cardDocument:'Belgeyi aç',cardCertificate:'Sertifikayı görüntüle (PDF)',cardVerify:'Coursera’da doğrula',cardSource:'Kaynak kod',cardLive:'Canlı uygulama',cardStore:'Chrome Web Store',cardVideo:'Video anlatım',
    certificatesTitle:'Sertifikalar',certificatesIntro:'Yazılım ve yapay zekâ ile ilişkili seçilmiş belgeli eğitimler.',
    footer:'Tek kimlik, iki farklı hedef kitle için tasarlandı.',footerLocation:'Türkiye merkezli · Uluslararası fırsatlara açık',
    print:'Yazdır / PDF olarak kaydet',back:'Portfolyoya dön',cvAcademic:'Akademik özgeçmiş',cvIndustry:'Sektörel özgeçmiş',cvSummaryAcademic:'Yapay zekâ destekli sistemler ve lisansüstü araştırma konularına yönelen yazılım mühendisliği mezunu.',cvSummaryIndustry:'Etkileşimli uygulamalar, tarayıcı araçları ve otomasyon iş akışları geliştiren yazılım mühendisliği mezunu.',
    education:'Eğitim',honorsTitle:'Başarı ve ödüller',projects:'Seçilmiş projeler',experience:'Deneyim',interests:'İlgi alanları / yetkinlikler',linkLabel:'Profil bağlantıları',printNote:'Bu sürüm portfolyo özetidir. Resmî başvurudan önce bütün belgelerle karşılaştırılarak tamamlanmalıdır.',
    cvAcademicTitle:'Akademik CV',cvIndustryTitle:'Sektörel özgeçmiş'
  }
};

export const researchStatement={en:'I want to investigate how computer vision can become more reliable and practical for autonomous systems, particularly for object detection and visual position estimation from aerial imagery. This direction grew out of my TEKNOFEST 2024 AI in Transportation work with the SEE AI team, where I explored YOLOv8, YOLOv9, SAHI and downward-facing camera approaches. In graduate study, I aim to evaluate accuracy, robustness and computational trade-offs under changing visual conditions, and connect these findings to maintainable software systems.',tr:'Otonom sistemlerde bilgisayarlı görü yöntemlerinin, özellikle havadan alınan görüntülerde nesne tespiti ve görsel konum kestirimi için nasıl daha güvenilir ve uygulanabilir hâle getirilebileceğini araştırmak istiyorum. Bu yönelim, SEE AI ekibiyle yürüttüğümüz TEKNOFEST 2024 Ulaşımda Yapay Zekâ çalışmasında YOLOv8, YOLOv9, SAHI ve aşağı bakan kamera yaklaşımlarını incelememle gelişti. Yüksek lisansta değişen görüntüleme koşullarında doğruluk, dayanıklılık ve hesaplama maliyeti arasındaki ödünleşimleri değerlendirmeyi ve bulguları sürdürülebilir yazılım sistemleriyle ilişkilendirmeyi hedefliyorum.'};
