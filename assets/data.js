/* Project content sourced from confirmed GitHub repositories and supplied documents. */
export const DATA = {
  "profile": {
    "name": "Selim Uysal",
    "github": "https://github.com/SelimUysal",
    "email": "uys.selim@gmail.com",
    "academicCvPdf": "./assets/cv/selim-uysal-academic-cv.pdf",
    "linktree": "https://linktr.ee/selim_uysal",
    "education": {
      "school": "Atılım University",
      "degree": "B.Sc. in Software Engineering",
      "year": "2025"
    }
  },
  "projects": [
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
      ],
      "category": "research",
      "icon": "✧"
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
      ],
      "category": "research",
      "icon": "▦"
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
        "en": "An illustrated technical study of SOLID principles, creational, structural and behavioral design patterns, their engineering trade-offs and anti-patterns, supported by original C++ examples.",
        "tr": "SOLID ilkeleri, oluşturucu, yapısal ve davranışsal tasarım kalıpları, tasarım ödünleşimleri ve anti-pattern konularını C++ örnekleriyle inceleyen teknik lisans raporu."
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
      ],
      "category": "research",
      "icon": "⌘"
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
        },
        {
          "kind": "video",
          "url": "https://youtu.be/V_ogWBPFksc"
        }
      ],
      "category": "software",
      "icon": "🌱"
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
      ],
      "category": "software",
      "icon": "▶"
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
        "en": "Telegram News Automation",
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
      ],
      "category": "software",
      "icon": "➤"
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
      ],
      "category": "software",
      "icon": "◈"
    }
  ],
  "archive": [
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
  ],
  "research": [
    {
      "symbol": "◈",
      "title": {
        "en": "Machine Learning & LLMs",
        "tr": "Makine Öğrenmesi ve LLM’ler"
      },
      "description": {
        "en": "Learning how models are evaluated, adapted and integrated into usable systems.",
        "tr": "Modellerin nasıl değerlendirildiğini, uyarlandığını ve kullanılabilir sistemlere entegre edildiğini araştırmak."
      }
    },
    {
      "symbol": "⌁",
      "title": {
        "en": "Intelligent Agents",
        "tr": "Akıllı Ajanlar"
      },
      "description": {
        "en": "Multi-step reasoning, tool use and coordination in AI-enabled workflows.",
        "tr": "Yapay zekâ destekli iş akışlarında çok adımlı akıl yürütme, araç kullanımı ve koordinasyon."
      }
    },
    {
      "symbol": "▥",
      "title": {
        "en": "Software Quality & Systems",
        "tr": "Yazılım Kalitesi ve Sistemler"
      },
      "description": {
        "en": "Maintainability, architecture, reliability and practical engineering trade-offs.",
        "tr": "Sürdürülebilirlik, mimari, güvenilirlik ve pratik mühendislik ödünleşimleri."
      }
    },
    {
      "symbol": "◎",
      "title": {
        "en": "Autonomous Systems",
        "tr": "Otonom Sistemler"
      },
      "description": {
        "en": "Applied AI for decision-making and systems operating under constraints.",
        "tr": "Karar verme ve kısıtlı koşullarda çalışan sistemler için uygulamalı yapay zekâ."
      }
    }
  ],
  "researchStatement": {
    "en": "I want to investigate how computer vision can become more reliable and practical for autonomous systems, particularly for object detection and visual position estimation from aerial imagery. This direction grew out of my TEKNOFEST 2024 AI in Transportation work with the SEE AI team, where I explored YOLOv8, YOLOv9, SAHI and downward-facing camera approaches. In graduate study, I aim to evaluate accuracy, robustness and computational trade-offs under changing visual conditions, and connect these findings to maintainable software systems.",
    "tr": "Otonom sistemlerde bilgisayarlı görü yöntemlerinin, özellikle havadan alınan görüntülerde nesne tespiti ve görsel konum kestirimi için nasıl daha güvenilir ve uygulanabilir hâle getirilebileceğini araştırmak istiyorum. Bu yönelim, SEE AI ekibiyle yürüttüğümüz TEKNOFEST 2024 Ulaşımda Yapay Zekâ çalışmasında YOLOv8, YOLOv9, SAHI ve aşağı bakan kamera yaklaşımlarını incelememle gelişti. Yüksek lisansta değişen görüntüleme koşullarında doğruluk, dayanıklılık ve hesaplama maliyeti arasındaki ödünleşimleri değerlendirmeyi ve bulguları sürdürülebilir yazılım sistemleriyle ilişkilendirmeyi hedefliyorum."
  },
  "experiences": [
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
      },
      "video": "https://www.youtube.com/watch?v=ZgHwIUqJTao",
      "project": {
        "en": "RIMS — ROPKON Inventory Management System",
        "tr": "RIMS — ROPKON Envanter Yönetim Sistemi"
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
      "date": "Sep 2022 – Jan 2024",
      "kind": {
        "en": "STEM Instructor",
        "tr": "STEM Eğitmeni"
      },
      "description": {
        "en": "Taught software, robotics, electronics and introductory IoT to middle- and high-school students; mentored student projects, competition preparation and took part in project juries.",
        "tr": "Ortaokul ve lise öğrencilerine yazılım, robotik, elektronik ve temel IoT eğitimi verdi; öğrenci projeleri ve yarışma hazırlıklarında mentorluk yaptı, proje jürilerinde görev aldı."
      },
      "credential": "./assets/certificates/deneyap-advanced-robotics-instructor.pdf"
    }
  ],
  "honors": [
    {
      "date": "2025",
      "tag": {
        "en": "Education",
        "tr": "Eğitim"
      },
      "name": {
        "en": "B.Sc. Software Engineering",
        "tr": "Yazılım Mühendisliği Lisans"
      },
      "detail": {
        "en": "Atılım University",
        "tr": "Atılım Üniversitesi"
      }
    },
    {
      "date": "2024",
      "tag": {
        "en": "Competition milestone",
        "tr": "Yarışma aşaması"
      },
      "name": {
        "en": "11th of 198 teams · preliminary design",
        "tr": "198 takım arasında 11. · ön tasarım"
      },
      "detail": {
        "en": "TEKNOFEST AI in Transportation — preliminary design report evaluation only",
        "tr": "TEKNOFEST Ulaşımda Yapay Zekâ — yalnızca ön tasarım raporu değerlendirmesi"
      }
    },
    {
      "date": "2023",
      "tag": {
        "en": "Recognition",
        "tr": "Başarı belgesi"
      },
      "name": {
        "en": "Fall Semester Honor Certificate",
        "tr": "Güz Dönemi Onur Belgesi"
      },
      "detail": {
        "en": "Atılım University",
        "tr": "Atılım Üniversitesi"
      }
    }
  ],
  "certificates": [
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
    },
    {
      "id": "deneyap-instructor",
      "title": {
        "en": "Advanced Robotics Instructor Recognition",
        "tr": "DENEYAP İleri Robotik Eğitmenliği Teşekkür Belgesi"
      },
      "issuer": "DENEYAP Technology Workshops",
      "year": "2023",
      "kind": "recognition",
      "pdf": "./assets/certificates/deneyap-advanced-robotics-instructor.pdf"
    }
  ]
};
