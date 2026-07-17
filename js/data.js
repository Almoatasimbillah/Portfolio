// ===================== STATIC DATA (fallback / initial load) =====================
// This data will be replaced by API calls once backend is running

const PORTFOLIO_DATA = {

  skills: [
    {
      icon: "🛡️",
      title: "Cybersecurity",
      title_ar: "الأمن السيبراني",
      tags: ["Penetration Testing", "OWASP Top 10", "Web Security", "Burp Suite", "Nmap", "Nuclei", "Vulnerability Assessment", "CTF Challenges"]
    },
    {
      icon: "💻",
      title: "Software Engineering",
      title_ar: "هندسة البرمجيات",
      tags: ["Java", "OOP Concepts", "Software Testing", "ISTQB Fundamentals", "Test Case Design", "Bug Tracking", "SDLC"]
    },
    {
      icon: "🐍",
      title: "Scripting & Automation",
      title_ar: "البرمجة النصية والأتمتة",
      tags: ["Python", "Bash Scripting", "Automation Scripts", "CLI Tools", "Task Automation"]
    },
    {
      icon: "🌐",
      title: "Networking",
      title_ar: "الشبكات",
      tags: ["TCP/IP", "Routers & Switches", "IP Configuration", "Network Troubleshooting", "VPN", "Firewalls", "Wireshark"]
    },
    {
      icon: "🖥️",
      title: "Systems & IT",
      title_ar: "الأنظمة وتقنية المعلومات",
      tags: ["Windows Server", "Linux (Kali/Ubuntu)", "Virtualization (VMware/VirtualBox)", "Hardware Maintenance", "Active Directory"]
    },
    {
      icon: "🔧",
      title: "Tools & Platforms",
      title_ar: "الأدوات والمنصّات",
      tags: ["Git & GitHub", "VS Code", "Metasploit", "OWASP ZAP", "Postman", "Jira", "Trello"]
    }
  ],

  experience: [
    {
      date: "Nov 2025 – May 2026",
      title: "Software Engineer Trainee",
      title_ar: "متدرّب مهندس برمجيات",
      company: "DEPI (Digital Egypt Pioneers Initiative) — Online",
      company_ar: "مبادرة رواد مصر الرقمية (DEPI) — عن بُعد",
      description: [
        "Trained in Software Testing fundamentals and best practices",
        "Studied Java programming and OOP concepts in depth",
        "Passed the ISTQB Foundation Level certification exam",
        "Developed soft skills: communication, presentation, and teamwork"
      ],
      description_ar: [
        "تدرّبت على أساسيات اختبار البرمجيات وأفضل الممارسات",
        "درست لغة Java ومفاهيم البرمجة الكائنية بعمق",
        "اجتزت امتحان شهادة ISTQB Foundation Level",
        "طوّرت مهارات التواصل والعرض والعمل الجماعي"
      ]
    },
    {
      date: "Jun 2025 – Oct 2025",
      title: "PM Engineer",
      title_ar: "مهندس دعم فنّي",
      company: "Afro Egypt — Downtown, El Alamein",
      company_ar: "أفرو إيجيبت — الداون تاون، العلمين",
      description: [
        "Provided technical support by diagnosing and resolving hardware, software, and network issues",
        "Installed, configured, and maintained computers, printers, and peripheral devices",
        "Assisted non-technical users, significantly reducing downtime and improving productivity",
        "Performed routine system checks and updates to ensure stable daily IT operations"
      ],
      description_ar: [
        "قدّمت دعمًا فنيًا بتشخيص وحلّ مشاكل الأجهزة والبرمجيات والشبكات",
        "ركّبت وأعددت وصنت الحواسيب والطابعات والأجهزة الطرفية",
        "ساعدت المستخدمين غير التقنيين، ممّا قلّل التعطّل ورفع الإنتاجية بوضوح",
        "أجريت فحوصات وتحديثات دورية لضمان استقرار التشغيل اليومي"
      ]
    },
    {
      date: "Jan 2019 – Jan 2021",
      title: "IT Helpdesk",
      title_ar: "دعم فنّي لتقنية المعلومات",
      company: "MISC (Part-Time) — Awlad Saqr, Sharkia",
      company_ar: "MISC (دوام جزئي) — أولاد صقر، الشرقية",
      description: [
        "Provided first-line technical support to employees for hardware and software issues",
        "Managed installation and configuration of workstations and network peripherals",
        "Documented recurring issues and developed resolution guides to improve team efficiency"
      ],
      description_ar: [
        "قدّمت الدعم الفنّي المباشر للموظفين في مشاكل الأجهزة والبرمجيات",
        "أدرت تركيب وإعداد محطات العمل وأجهزة الشبكة الطرفية",
        "وثّقت المشاكل المتكررة وأعددت أدلّة حلول لرفع كفاءة الفريق"
      ]
    }
  ],

  certifications: [
    {
      icon: "🎓",
      name: "Bachelor's Degree — Computer Engineering",
      name_ar: "بكالوريوس — هندسة الحاسبات",
      org: "BHI University",
      org_ar: "جامعة بهاء الدين الدولية",
      year: "2018 – 2023",
      status: "completed",
      note: "GPA: Good | Graduation Project: A+",
      note_ar: "التقدير: جيد | مشروع التخرّج: A+"
    },
    {
      icon: "🛡️",
      name: "ISTQB Foundation Level",
      name_ar: "ISTQB المستوى التأسيسي",
      org: "ISTQB — International Software Testing Qualifications Board",
      org_ar: "ISTQB — المجلس الدولي لمؤهلات اختبار البرمجيات",
      year: "May 2026",
      status: "certified",
      note: "Exam passed · certificate pending",
      note_ar: "اجتزت الامتحان · الشهادة قيد الإصدار"
    },
    {
      icon: "⚡",
      name: "Software Engineering Training",
      name_ar: "تدريب هندسة البرمجيات",
      org: "DEPI — Digital Egypt Pioneers Initiative",
      org_ar: "DEPI — مبادرة رواد مصر الرقمية",
      year: "Nov 2025 – May 2026",
      status: "completed"
    },
    {
      icon: "🔐",
      name: "Web Application Penetration Testing",
      name_ar: "اختبار اختراق تطبيقات الويب",
      org: "Self-Study & Practical Labs",
      org_ar: "دراسة ذاتية ومعامل تطبيقية",
      year: "2024 – Present",
      status: "active"
    },
    {
      icon: "🏛️",
      name: "Egyptian Engineers Syndicate",
      name_ar: "نقابة المهندسين المصرية",
      org: "Egyptian Engineers Syndicate",
      org_ar: "نقابة المهندسين المصرية",
      year: "2023",
      status: "completed"
    },
    {
      icon: "⚔️",
      name: "Military Service",
      name_ar: "الخدمة العسكرية",
      org: "Egyptian Armed Forces",
      org_ar: "القوات المسلحة المصرية",
      year: "Jan 2024 – Mar 2025",
      status: "completed"
    }
  ],

  projects: [
      {
          "title": "BoxStore",
          "type": "E-commerce platform",
          "type_ar": "منصّة تجارة إلكترونية",
          "year": 2024,
          "category": "web",
          "description": "A full e-commerce platform built for small and mid-size retailers. Order management, product catalog, WhatsApp ordering, and Zid marketplace sync — designed for shop owners who don't want to live in a dashboard.",
          "description_ar": "منصّة تجارة إلكترونية متكاملة للمحلات الصغيرة والمتوسطة. إدارة الطلبات، وكتالوج المنتجات، والطلب عبر واتساب، ومزامنة مع منصّة زد — مصمّمة لأصحاب المحلات اللي مش عايزين يعيشوا داخل لوحة تحكّم معقّدة.",
          "tech": [
              "PHP",
              "Laravel",
              "MySQL",
              "JavaScript",
              "WhatsApp API",
              "Zid API"
          ],
          "github": null,
          "demo": null,
          "gallery": [
              {
                  "video": "videos/boxstore-1-main.mp4",
                  "poster": "videos/posters/boxstore-1-main-poster.jpg",
                  "caption": "Main storefront + admin",
                  "caption_ar": "الواجهة الرئيسية + لوحة التحكّم"
              },
              {
                  "video": "videos/boxstore-2-demo.mp4",
                  "poster": "videos/posters/boxstore-2-demo-poster.jpg",
                  "caption": "Live demo walkthrough",
                  "caption_ar": "جولة عرض حيّة"
              },
              {
                  "video": "videos/boxstore-3-trial-1.mp4",
                  "poster": "videos/posters/boxstore-3-trial-1-poster.jpg",
                  "caption": "Trial build — iteration 1",
                  "caption_ar": "نسخة تجريبية — الإصدار 1"
              },
              {
                  "video": "videos/boxstore-4-trial-2.mp4",
                  "poster": "videos/posters/boxstore-4-trial-2-poster.jpg",
                  "caption": "Trial build — iteration 2",
                  "caption_ar": "نسخة تجريبية — الإصدار 2"
              },
              {
                  "video": "videos/boxstore-5-whatsapp.mp4",
                  "poster": "videos/posters/boxstore-5-whatsapp-poster.jpg",
                  "caption": "WhatsApp checkout integration",
                  "caption_ar": "تكامل الدفع عبر واتساب"
              },
              {
                  "video": "videos/boxstore-6-zid.mp4",
                  "poster": "videos/posters/boxstore-6-zid-poster.jpg",
                  "caption": "Zid marketplace sync",
                  "caption_ar": "المزامنة مع منصّة زد"
              }
          ],
          "caseStudy": {
              "problem": "Small retailers in the region need an online presence but most platforms are too heavy or too generic. BoxStore had to feel familiar (WhatsApp-first), respect local payment habits, and be cheap to host.",
              "problem_ar": "محلات التجزئة الصغيرة في المنطقة محتاجة وجود أونلاين، لكن أغلب المنصّات تقيلة أو عامّة أوي. BoxStore كان لازم يكون مألوف (واتساب أولاً)، ويحترم عادات الدفع المحلية، ويكون رخيص في الاستضافة.",
              "approach": [
                  "Built the storefront and admin in Laravel with a clean MVC structure",
                  "Wrote a WhatsApp integration so customers can place orders without an account",
                  "Synced inventory and orders bi-directionally with Zid marketplace",
                  "Kept the admin UI simple — owners can publish products in under a minute"
              ],
              "approach_ar": [
                  "بنيت الواجهة ولوحة التحكّم بـ Laravel ببنية MVC نضيفة",
                  "كتبت تكاملًا مع واتساب عشان العملاء يقدروا يطلبوا من غير حساب",
                  "زامنت المخزون والطلبات في الاتجاهين مع منصّة زد",
                  "خلّيت لوحة التحكّم بسيطة — صاحب المحلّ يقدر ينشر منتج في أقل من دقيقة"
              ],
              "outcome": "Production storefront running for multiple clients. WhatsApp flow proved out the conversion-first hypothesis.",
              "outcome_ar": "واجهة متجر شغّالة فعليًا لأكتر من عميل. ومسار واتساب أثبت فرضية «التحويل أولاً»."
          }
      },
      {
          "title": "Salsabeel",
          "type": "Restaurant operations system",
          "type_ar": "نظام تشغيل مطاعم",
          "year": 2024,
          "category": "web",
          "description": "Order management, menu data ingestion, and an operations dashboard for a regional restaurant chain. Handles live orders, kitchen routing, and a scraper that keeps the public menu in sync.",
          "description_ar": "إدارة الطلبات، وسحب بيانات المنيو، ولوحة تشغيل لسلسلة مطاعم إقليمية. بيتعامل مع الطلبات الحيّة، وتوجيه المطبخ، وأداة سحب (scraper) بتحافظ على تحديث المنيو العام.",
          "tech": [
              "React",
              "Node.js",
              "Express",
              "MongoDB",
              "Web Scraping",
              "REST"
          ],
          "github": null,
          "demo": null,
          "gallery": [
              {
                  "video": "videos/salsabeel-1-main.mp4",
                  "poster": "videos/posters/salsabeel-1-main-poster.jpg",
                  "caption": "Main operations dashboard",
                  "caption_ar": "لوحة التشغيل الرئيسية"
              },
              {
                  "video": "videos/salsabeel-2-scraping.mp4",
                  "poster": "videos/posters/salsabeel-2-scraping-poster.jpg",
                  "caption": "Menu scraper running",
                  "caption_ar": "أداة سحب المنيو أثناء العمل"
              },
              {
                  "video": "videos/salsabeel-3.mp4",
                  "poster": "videos/posters/salsabeel-3-poster.jpg",
                  "caption": "Order screen — branch view",
                  "caption_ar": "شاشة الطلبات — عرض الفرع"
              },
              {
                  "video": "videos/salsabeel-4.mp4",
                  "poster": "videos/posters/salsabeel-4-poster.jpg",
                  "caption": "Kitchen routing",
                  "caption_ar": "توجيه المطبخ"
              },
              {
                  "video": "videos/salsabeel-5.mp4",
                  "poster": "videos/posters/salsabeel-5-poster.jpg",
                  "caption": "Reports & daily totals",
                  "caption_ar": "التقارير والإجماليات اليومية"
              },
              {
                  "video": "videos/salsabeel-6.mp4",
                  "poster": "videos/posters/salsabeel-6-poster.jpg",
                  "caption": "Mobile manager flow",
                  "caption_ar": "واجهة المدير على الموبايل"
              }
          ],
          "caseStudy": {
              "problem": "Salsabeel was managing a multi-branch restaurant with phone orders, paper tickets, and a slow public menu. Branches couldn't see live order load and the kitchen had no priority signal.",
              "problem_ar": "سلسبيل كان بيدير مطعمًا متعدّد الفروع بطلبات تليفونية، وتذاكر ورقية، ومنيو عام بطيء. الفروع ما كانتش بتشوف حِمل الطلبات الحيّ، والمطبخ ماكانش عنده إشارة أولوية.",
              "approach": [
                  "Built a React dashboard centered on the live order queue and per-branch load",
                  "Wrote a scraper that pulls the public menu into MongoDB on a schedule",
                  "Added kitchen routing rules and per-station priority",
                  "Shipped a manager-only mobile flow for end-of-day reports"
              ],
              "approach_ar": [
                  "بنيت لوحة React محورها طابور الطلبات الحيّ وحِمل كل فرع",
                  "كتبت أداة سحب بتجيب المنيو العام إلى MongoDB بشكل مجدول",
                  "أضفت قواعد توجيه للمطبخ وأولوية لكل محطة",
                  "أطلقت واجهة موبايل للمدير فقط لتقارير نهاية اليوم"
              ],
              "outcome": "Branches stopped using paper. Average ticket time dropped during peak hours. The menu now updates without manual data entry.",
              "outcome_ar": "الفروع بطّلت ورق. ومتوسّط زمن التذكرة قلّ في ساعات الذروة. والمنيو دلوقتي بيتحدّث من غير إدخال بيانات يدوي."
          }
      },
      {
          "title": "Ali Baba POS",
          "title_ar": "كاشير علي بابا",
          "type": "Point of sale system",
          "type_ar": "نظام نقاط بيع",
          "year": 2024,
          "category": "tool",
          "description": "Multi-terminal POS built for a wholesale and retail operation. Handles cashier flow, returns, layaway, daily Z-report, and printer integration.",
          "description_ar": "نظام كاشير متعدّد الأجهزة لمنشأة جملة وتجزئة. بيتعامل مع حركة الكاشير، والمرتجعات، والبيع بالتقسيط، وتقرير Z اليومي، وربط الطابعات.",
          "tech": [
              "JavaScript",
              "Node.js",
              "PostgreSQL",
              "Electron",
              "ESC/POS printing"
          ],
          "github": null,
          "demo": null,
          "gallery": [
              {
                  "video": "videos/alibaba-1-pos.mp4",
                  "poster": "videos/posters/alibaba-1-pos-poster.jpg",
                  "caption": "Cashier flow — full sale",
                  "caption_ar": "حركة الكاشير — عملية بيع كاملة"
              },
              {
                  "video": "videos/alibaba-2.mp4",
                  "poster": "videos/posters/alibaba-2-poster.jpg",
                  "caption": "Returns and refund flow",
                  "caption_ar": "المرتجعات واسترداد المبالغ"
              },
              {
                  "video": "videos/alibaba-3.mp4",
                  "poster": "videos/posters/alibaba-3-poster.jpg",
                  "caption": "Stock check and adjustments",
                  "caption_ar": "جرد المخزون وتعديلاته"
              },
              {
                  "video": "videos/alibaba-4.mp4",
                  "poster": "videos/posters/alibaba-4-poster.jpg",
                  "caption": "Reports and Z-report",
                  "caption_ar": "التقارير وتقرير Z"
              },
              {
                  "video": "videos/alibaba-5.mp4",
                  "poster": "videos/posters/alibaba-5-poster.jpg",
                  "caption": "Multi-terminal sync",
                  "caption_ar": "مزامنة الأجهزة المتعدّدة"
              }
          ],
          "caseStudy": {
              "problem": "The client was running 3 cashier terminals on a shared spreadsheet. Daily reconciliation took hours and no one trusted the numbers.",
              "problem_ar": "العميل كان بيشغّل 3 أجهزة كاشير على شيت إكسل مشترك. التسوية اليومية كانت بتاخد ساعات ومحدش بيثق في الأرقام.",
              "approach": [
                  "Built an Electron-based POS so it ships as a single installer for Windows tills",
                  "Used PostgreSQL with a clean transaction model — every sale is one atomic write",
                  "Added printer drivers for the standard ESC/POS receipt hardware",
                  "Wrote a daily Z-report that exports per-terminal and consolidated"
              ],
              "approach_ar": [
                  "بنيت نظام كاشير بـ Electron عشان ينزل كـ installer واحد لأجهزة ويندوز",
                  "استخدمت PostgreSQL بنموذج معاملات نضيف — كل عملية بيع كتابة واحدة ذرّية",
                  "أضفت تعريفات طابعات لأجهزة إيصالات ESC/POS القياسية",
                  "كتبت تقرير Z يومي بيصدّر لكل جهاز ومجمّع كمان"
              ],
              "outcome": "Daily close went from ~90 minutes to under 10. No more spreadsheet sync errors.",
              "outcome_ar": "إقفال اليوم نزل من ~90 دقيقة لأقل من 10. وخلاص مفيش أخطاء مزامنة إكسل."
          }
      },
      {
          "title": "Clothes POS",
          "title_ar": "كاشير محلّ ملابس",
          "type": "Apparel point of sale",
          "type_ar": "نقاط بيع للملابس",
          "year": 2024,
          "category": "tool",
          "description": "A POS specialized for clothing retailers. Size and color matrix, supplier tracking, and a fast barcode-driven cashier flow tuned for changing-room returns.",
          "description_ar": "نظام كاشير متخصّص لمحلات الملابس. مصفوفة مقاسات وألوان، وتتبّع للموردين، وحركة كاشير سريعة بالباركود مضبوطة على مرتجعات غرفة القياس.",
          "tech": [
              "JavaScript",
              "PHP",
              "MySQL",
              "Barcode scanning"
          ],
          "github": null,
          "demo": null,
          "gallery": [
              {
                  "video": "videos/clothes-pos.mp4",
                  "poster": "videos/posters/clothes-pos-poster.jpg",
                  "caption": "Cashier flow with size/color",
                  "caption_ar": "حركة الكاشير بالمقاس واللون"
              }
          ],
          "caseStudy": {
              "problem": "Generic POS systems don't model the size × color matrix that apparel retailers actually need. The client kept reconciling stock manually.",
              "problem_ar": "أنظمة الكاشير العامّة مابتمثّلش مصفوفة المقاس × اللون اللي محلات الملابس محتاجاها فعلاً. فالعميل كان بيسوّي المخزون يدويًا على طول.",
              "approach": [
                  "Modeled SKUs as a (style × size × color) tuple from day one",
                  "Built a fast scan-driven cashier that handles the common changing-room return",
                  "Added supplier purchase orders and a low-stock alert per variant"
              ],
              "approach_ar": [
                  "مثّلت أصناف المخزون كـ (موديل × مقاس × لون) من أول يوم",
                  "بنيت كاشير سريع بالباركود بيتعامل مع مرتجعات غرفة القياس الشائعة",
                  "أضفت أوامر شراء للموردين وتنبيه نقص مخزون لكل صنف فرعي"
              ],
              "outcome": "Stock reconciliation moved from weekly to live.",
              "outcome_ar": "تسوية المخزون اتحوّلت من أسبوعية إلى لحظية."
          }
      },
      {
          "title": "Al-Noor Private School",
          "title_ar": "مدرسة النور الأهلية",
          "type": "School website",
          "type_ar": "موقع مدرسة",
          "year": 2024,
          "category": "web",
          "description": "Public website for Al-Noor Private School. Admissions intake, news, calendar, and a parent portal — built to be fast on slow mobile connections.",
          "description_ar": "موقع عام لمدرسة النور الأهلية. تقديم الالتحاق، والأخبار، والتقويم الدراسي، وبوّابة لأولياء الأمور — مبني ليكون سريعًا على شبكات الموبايل البطيئة.",
          "tech": [
              "HTML/CSS",
              "JavaScript",
              "PHP",
              "MySQL"
          ],
          "github": null,
          "demo": null,
          "gallery": [
              {
                  "video": "videos/alnoor-school.mp4",
                  "poster": "videos/posters/alnoor-school-poster.jpg",
                  "caption": "Site walkthrough",
                  "caption_ar": "جولة في الموقع"
              }
          ],
          "caseStudy": {
              "problem": "The school's old site was a Word document exported to PDF. Parents called the office for everything because the site told them nothing.",
              "problem_ar": "موقع المدرسة القديم كان ملف Word متصدّر PDF. أولياء الأمور كانوا بيتّصلوا بالمكتب في كل حاجة لأن الموقع ماكانش بيقول لهم أي حاجة.",
              "approach": [
                  "Rebuilt as a fast, mobile-first site with a clear admissions funnel",
                  "Added a simple parent portal — login, view child's class, see the calendar",
                  "Kept the editorial workflow lightweight so the office can publish news without IT"
              ],
              "approach_ar": [
                  "أعدت بناءه كموقع سريع يبدأ من الموبايل بمسار التحاق واضح",
                  "أضفت بوّابة بسيطة لولي الأمر — تسجيل دخول، ومتابعة فصل ابنه، والتقويم",
                  "خلّيت نشر المحتوى خفيفًا عشان المكتب ينشر الأخبار من غير قسم تقني"
              ],
              "outcome": "Office calls for routine info dropped noticeably. Admissions intake is now online end-to-end.",
              "outcome_ar": "مكالمات المكتب للاستفسارات الروتينية قلّت بوضوح. والتحاق الطلاب بقى أونلاين من أوّله لآخره."
          }
      },
      {
          "title": "CW Point of Sale",
          "title_ar": "كاشير عالم الكمبيوتر",
          "type": "Computer-shop POS",
          "type_ar": "كاشير محلّ كمبيوتر",
          "year": 2024,
          "category": "tool",
          "description": "Full POS system built for a computer and electronics retailer. Cashier flow with barcode scanning, returns and warranty tracking, supplier orders, daily Z-report — designed to run the shop floor end-to-end.",
          "description_ar": "نظام كاشير متكامل لمحلّ كمبيوتر وإلكترونيات. حركة كاشير بقراءة الباركود، وتتبّع المرتجعات والضمان، وطلبات الموردين، وتقرير Z اليومي — مصمّم ليدير المحلّ من أوّله لآخره.",
          "tech": [
              "React",
              "Node.js",
              "Express",
              "MongoDB",
              "Barcode scanning"
          ],
          "github": null,
          "demo": null,
          "gallery": [
              {
                  "video": "videos/cw-app.mp4",
                  "poster": "videos/posters/cw-app-poster.jpg",
                  "caption": "Cashier + admin walkthrough",
                  "caption_ar": "جولة الكاشير ولوحة التحكّم"
              }
          ],
          "caseStudy": {
              "problem": "A computer shop was juggling sales on paper receipts and a spreadsheet — no real stock view, no warranty trail, and reconciliation took hours every day.",
              "problem_ar": "محلّ كمبيوتر كان بيدير المبيعات بإيصالات ورقية وشيت إكسل — من غير رؤية حقيقية للمخزون، ولا سجلّ للضمان، والتسوية كانت بتاخد ساعات كل يوم.",
              "approach": [
                  "Built a cashier flow tuned for barcode scanning and quick keyboard entry",
                  "Modeled stock by serial number so warranty + returns are traceable per unit",
                  "Added a supplier-order screen with a simple receive-into-stock workflow",
                  "Generated a daily Z-report exporting per-cashier and consolidated totals"
              ],
              "approach_ar": [
                  "بنيت حركة كاشير مضبوطة على قراءة الباركود والإدخال السريع بالكيبورد",
                  "مثّلت المخزون بالرقم التسلسلي عشان الضمان والمرتجعات يتتبّعوا لكل وحدة",
                  "أضفت شاشة طلبات موردين بمسار بسيط لاستلام البضاعة في المخزون",
                  "أنتجت تقرير Z يومي بيصدّر إجماليات كل كاشير والإجمالي المجمّع"
              ],
              "outcome": "Replaced the paper + spreadsheet system entirely. Daily reconciliation went from hours to under 15 minutes. Stock now lives in one place, accurate, with warranty history intact.",
              "outcome_ar": "استبدل نظام الورق والإكسل بالكامل. والتسوية اليومية نزلت من ساعات لأقل من 15 دقيقة. والمخزون بقى في مكان واحد، دقيق، وبسجلّ ضمان محفوظ."
          }
      },
      {
          "title": "Portfolio Evolution",
          "title_ar": "تطوّر البورتفوليو",
          "type": "Personal portfolio iterations",
          "type_ar": "نسخ متتابعة من البورتفوليو",
          "year": 2024,
          "category": "web",
          "description": "Five iterations of my own portfolio site. Each one explores a different identity — terminal aesthetic, editorial layout, scroll-driven storytelling, and the calmer version you're reading now.",
          "description_ar": "خمس نسخ من موقع البورتفوليو الخاص بي. كل نسخة بتجرّب هويّة مختلفة — طابع الترمينال، وتخطيط تحريري، وسرد قصصي مدفوع بالتمرير، والنسخة الأهدأ اللي بتقرأها دلوقتي.",
          "tech": [
              "HTML",
              "CSS",
              "JavaScript",
              "FFmpeg",
              "Custom animations"
          ],
          "github": null,
          "demo": null,
          "gallery": [
              {
                  "video": "videos/portfolio-iter-1.mp4",
                  "poster": "videos/posters/portfolio-iter-1-poster.jpg",
                  "caption": "Iteration 1 — the long version",
                  "caption_ar": "الإصدار 1 — النسخة الطويلة"
              },
              {
                  "video": "videos/portfolio-iter-2.mp4",
                  "poster": "videos/posters/portfolio-iter-2-poster.jpg",
                  "caption": "Iteration 2 — early identity",
                  "caption_ar": "الإصدار 2 — هويّة مبكّرة"
              },
              {
                  "video": "videos/portfolio-iter-3.mp4",
                  "poster": "videos/posters/portfolio-iter-3-poster.jpg",
                  "caption": "Iteration 3 — refinement",
                  "caption_ar": "الإصدار 3 — تحسين وصقل"
              },
              {
                  "video": "videos/portfolio-iter-4.mp4",
                  "poster": "videos/posters/portfolio-iter-4-poster.jpg",
                  "caption": "Iteration 4 — motion experiments",
                  "caption_ar": "الإصدار 4 — تجارب الحركة"
              },
              {
                  "video": "videos/portfolio-iter-5.mp4",
                  "poster": "videos/posters/portfolio-iter-5-poster.jpg",
                  "caption": "Iteration 5 — current direction",
                  "caption_ar": "الإصدار 5 — الاتجاه الحالي"
              }
          ],
          "caseStudy": {
              "problem": "Designing for yourself is the hardest project. Every iteration was an honest attempt to answer 'what do I actually want to say?'",
              "problem_ar": "التصميم لنفسك أصعب مشروع. كل إصدار كان محاولة صادقة للإجابة على سؤال «أنا عايز أقول إيه فعلاً؟»",
              "approach": [
                  "Started with a heavy cyber/terminal aesthetic — read as 'AI-generated'",
                  "Pulled back, moved to a warm editorial palette and serif typography",
                  "Locked a single accent color and stopped fighting the system",
                  "Kept the technical signals (terminal, glitch, scroll-scrub) but tuned the volume down"
              ],
              "approach_ar": [
                  "بدأت بطابع سايبر/ترمينال تقيل — طلع شكله «مولّد بالذكاء الاصطناعي»",
                  "رجعت خطوة لورا، وتحوّلت لألوان تحريرية دافئة وخطوط serif",
                  "ثبّتت لون تمييز واحد وبطّلت أحارب النظام",
                  "احتفظت بالإشارات التقنية (ترمينال، جليتش، تمرير) بس خفّضت صوتها"
              ],
              "outcome": "What you're looking at now. Calmer, more confident, more me.",
              "outcome_ar": "اللي بتشوفه دلوقتي. أهدأ، وأكتر ثقة، وأقرب ليّا."
          }
      },
      {
          "title": "Web Vulnerability Scanner",
          "title_ar": "ماسح ثغرات الويب",
          "type": "Security tool",
          "type_ar": "أداة أمنية",
          "year": 2024,
          "description": "A Python-based automated tool that scans web applications for common vulnerabilities including XSS, SQL injection, and open redirects using OWASP methodologies.",
          "description_ar": "أداة آلية مبنية بلغة Python بتفحص تطبيقات الويب للبحث عن الثغرات الشائعة زي XSS وحقن SQL والتحويل المفتوح، باستخدام منهجيات OWASP.",
          "category": "security",
          "tech": [
              "Python",
              "Requests",
              "BeautifulSoup",
              "OWASP"
          ],
          "github": "https://github.com/Almoatasimbillah",
          "demo": null,
          "gallery": [],
          "caseStudy": {
              "problem": "Manual web app testing is slow and inconsistent — testers miss the same classes of issues repeatedly. I wanted a tool that ran the OWASP top-10 checklist automatically against any URL.",
              "problem_ar": "اختبار تطبيقات الويب يدويًا بطيء وغير متّسق — المختبِرين بيفوّتوا نفس أنواع المشاكل مرّة ورا مرّة. كنت عايز أداة تشغّل قائمة OWASP العشرة تلقائيًا على أي رابط.",
              "approach": [
                  "Built a modular Python scanner with one detector per OWASP category",
                  "Used Requests + BeautifulSoup for crawling and form discovery",
                  "Tested heuristics on intentionally vulnerable apps (DVWA, Juice Shop)",
                  "Generated a structured report with severity rankings and remediation hints"
              ],
              "approach_ar": [
                  "بنيت ماسحًا معياريًا بـ Python بكاشف مستقل لكل فئة من OWASP",
                  "استخدمت Requests + BeautifulSoup للزحف واكتشاف النماذج",
                  "جرّبت الاستدلالات على تطبيقات ضعيفة عمدًا (DVWA، Juice Shop)",
                  "أنتجت تقريرًا منظّمًا بترتيب للخطورة وتلميحات للمعالجة"
              ],
              "outcome": "Catches XSS, SQLi, and open-redirect issues across a corpus of test apps. Used as a learning lab and a starting point for engagements.",
              "outcome_ar": "بيمسك ثغرات XSS وحقن SQL والتحويل المفتوح عبر مجموعة تطبيقات اختبار. بستخدمه كمعمل تعلّم ونقطة بداية للمهام."
          }
      },
      {
          "title": "Network Monitoring Dashboard",
          "title_ar": "لوحة مراقبة الشبكة",
          "type": "Network ops",
          "type_ar": "تشغيل شبكات",
          "year": 2023,
          "description": "Real-time network monitoring tool that tracks device connectivity, bandwidth usage, and alerts on suspicious traffic patterns across local networks.",
          "description_ar": "أداة مراقبة شبكة لحظية بتتبّع اتصال الأجهزة، واستهلاك النطاق، وبتنبّه على أنماط المرور المشبوهة عبر الشبكات المحلية.",
          "category": "tool",
          "tech": [
              "Python",
              "Nmap",
              "Bash",
              "Linux"
          ],
          "github": "https://github.com/Almoatasimbillah",
          "demo": null,
          "gallery": [],
          "caseStudy": {
              "problem": "Small-office networks often go down without anyone noticing until users complain. Needed lightweight, real-time visibility without enterprise tooling.",
              "problem_ar": "شبكات المكاتب الصغيرة كتير بتقع من غير ما حد ياخد باله لحدّ ما المستخدمين يشتكوا. كنت محتاج رؤية لحظية خفيفة من غير أدوات المؤسّسات الضخمة.",
              "approach": [
                  "Polled key hosts on the LAN using Nmap host-discovery + ping",
                  "Tracked bandwidth via interface counters on the local gateway",
                  "Alerted on disconnects, latency spikes, and traffic anomalies",
                  "Rendered the data in a simple terminal-style live dashboard"
              ],
              "approach_ar": [
                  "فحصت الأجهزة المهمّة على الشبكة باستخدام اكتشاف Nmap + ping",
                  "تتبّعت استهلاك النطاق عبر عدّادات الواجهات على البوّابة المحلية",
                  "نبّهت على الانقطاعات، وقفزات التأخير، وشذوذ المرور",
                  "عرضت البيانات في لوحة حيّة بسيطة بطابع الترمينال"
              ],
              "outcome": "Replaced 'is the internet down?' guessing with a continuously updated map of which hosts are alive and how the link is performing.",
              "outcome_ar": "استبدلت تخمين «هل النت واقع؟» بخريطة بتتحدّث باستمرار توضّح أي أجهزة شغّالة وحالة الاتصال."
          }
      },
      {
          "title": "CTF Challenge Writeups",
          "title_ar": "حلول تحدّيات CTF",
          "type": "CTF research",
          "type_ar": "أبحاث CTF",
          "year": 2024,
          "description": "Collection of Capture The Flag challenge solutions covering web exploitation, binary exploitation, cryptography, and forensics from various platforms.",
          "description_ar": "مجموعة من حلول تحدّيات Capture The Flag بتغطّي استغلال الويب، واستغلال الثنائيات، والتشفير، والأدلة الجنائية الرقمية من منصّات مختلفة.",
          "category": "security",
          "tech": [
              "Burp Suite",
              "Python",
              "GDB",
              "Wireshark"
          ],
          "github": "https://github.com/Almoatasimbillah",
          "demo": null,
          "gallery": [],
          "caseStudy": {
              "problem": "CTF challenges teach a lot, but the learning evaporates without writeups. Wanted a personal knowledge base of exploitation patterns.",
              "problem_ar": "تحدّيات CTF بتعلّم كتير، بس التعلّم بيتبخّر من غير توثيق. كنت عايز قاعدة معرفة شخصية لأنماط الاستغلال.",
              "approach": [
                  "Solved challenges across web, binary, crypto, and forensics categories",
                  "Documented each one with the reconnaissance steps, key insight, and final payload",
                  "Built a tooling kit (Burp configs, Python helpers, GDB recipes) reused across solves",
                  "Organized writeups in a searchable repo"
              ],
              "approach_ar": [
                  "حلّيت تحدّيات في فئات الويب والثنائيات والتشفير والأدلة الجنائية",
                  "وثّقت كل واحد بخطوات الاستطلاع، والفكرة المفتاحية، والحمولة النهائية",
                  "بنيت عُدّة أدوات (إعدادات Burp، مساعدات Python، وصفات GDB) بعيد استخدامها في الحلول",
                  "نظّمت التوثيقات في مستودع قابل للبحث"
              ],
              "outcome": "Sharpened web-app pentesting reflexes and built a reference library used in later engagements.",
              "outcome_ar": "شحذ ردود فعلي في اختبار اختراق الويب، وبنى مكتبة مرجعية بستخدمها في المهام اللاحقة."
          }
      },
      {
          "title": "Penetration Testing Lab",
          "title_ar": "معمل اختبار الاختراق",
          "type": "Lab environment",
          "type_ar": "بيئة معمل",
          "year": 2024,
          "description": "A fully configured virtual lab environment for practicing penetration testing techniques including Kali Linux, Metasploitable, and various CTF machines.",
          "description_ar": "بيئة معمل افتراضية مُعدّة بالكامل للتدرّب على تقنيات اختبار الاختراق، وفيها Kali Linux وMetasploitable وأجهزة CTF متنوّعة.",
          "category": "security",
          "tech": [
              "VMware",
              "Kali Linux",
              "Metasploit",
              "Nmap"
          ],
          "github": null,
          "demo": null,
          "gallery": [],
          "caseStudy": {
              "problem": "Practicing offensive techniques on live systems is illegal. Needed a controlled lab where I could break things without consequences.",
              "problem_ar": "التدرّب على التقنيات الهجومية على أنظمة حيّة غير قانوني. كنت محتاج معملًا مضبوطًا أقدر أكسّر فيه حاجات من غير عواقب.",
              "approach": [
                  "Built a multi-VM environment in VMware: Kali + Metasploitable + DVWA",
                  "Configured isolated host-only networking for safe traffic capture",
                  "Set up snapshots so I could roll back after destructive payloads",
                  "Documented the lab so I can rebuild it on a fresh machine in minutes"
              ],
              "approach_ar": [
                  "بنيت بيئة أجهزة افتراضية متعدّدة في VMware: Kali + Metasploitable + DVWA",
                  "أعددت شبكة معزولة (host-only) لالتقاط المرور بأمان",
                  "جهّزت لقطات (snapshots) عشان أرجّع الحالة بعد الحمولات المدمّرة",
                  "وثّقت المعمل عشان أقدر أعيد بناءه على جهاز جديد في دقائق"
              ],
              "outcome": "Daily playground for OWASP, Metasploit, and red-team techniques.",
              "outcome_ar": "ملعب يومي لتقنيات OWASP وMetasploit والفريق الأحمر."
          }
      }
  ],

  // Real testimonials only — kept empty until people I've actually worked
  // with send their own words. Visitors can submit via the "Add yours" form
  // and it shows up in their browser instantly (also emailed to me).
  testimonials: []
};


// =====================================================================
// CASE STUDIES — merged into PORTFOLIO_DATA.projects by title
// =====================================================================
const PROJECT_CASE_STUDIES = {
  "Web Vulnerability Scanner": {
    "problem": "Manual web app testing is slow and inconsistent — testers miss the same classes of issues repeatedly. I wanted a tool that ran the OWASP top-10 check list automatically against any URL.",
    "approach": [
      "Built a modular Python scanner with one detector per OWASP category",
      "Used Requests + BeautifulSoup for crawling and form discovery",
      "Tested heuristics on intentionally vulnerable apps (DVWA, OWASP Juice Shop, SauceDemo)",
      "Generated a structured report with severity rankings and remediation hints"
    ],
    "outcome": "Catches XSS, SQLi, and open-redirect issues across a corpus of test apps. Used as a learning lab and a starting point for engagements."
  },
  "Network Monitoring Dashboard": {
    "problem": "Small-office networks often go down without anyone noticing until users complain. Needed lightweight, real-time visibility without enterprise tooling.",
    "approach": [
      "Polled key hosts on the LAN using Nmap host-discovery + ping",
      "Tracked bandwidth via interface counters on the local gateway",
      "Alerted on disconnects, latency spikes, and traffic anomalies",
      "Rendered the data in a simple terminal-style live dashboard"
    ],
    "outcome": "Replaced 'is the internet down?' guessing with a continuously updated map of which hosts are alive and how the link is performing."
  },
  "Graduation Project — Smart System": {
    "problem": "Demonstrate embedded-systems and software-integration competence as the capstone for the Computer Engineering degree.",
    "approach": [
      "Designed an embedded C application targeting a microcontroller platform",
      "Integrated hardware sensors with a clean abstraction layer",
      "Wrote test scaffolding to validate behavior before final assembly",
      "Documented the design and presented to faculty"
    ],
    "outcome": "Graduated with A+ on the project. Registered with the Egyptian Engineers Syndicate."
  },
  "CTF Challenge Writeups": {
    "problem": "CTF challenges teach a lot, but the learning evaporates without writeups. Wanted a personal knowledge base of exploitation patterns.",
    "approach": [
      "Solved challenges across web, binary, crypto, and forensics categories",
      "Documented each one with the reconnaissance steps, key insight, and final payload",
      "Built a tooling kit (Burp configs, Python helpers, GDB recipes) reused across solves",
      "Organized writeups in a searchable repo"
    ],
    "outcome": "Sharpened web-app pentesting reflexes and built a reference library used in later engagements."
  },
  "IT Helpdesk Automation Scripts": {
    "problem": "Same support tickets, same fixes, day after day. The fix was easy — the repetition was the problem.",
    "approach": [
      "Identified the top recurring issues across the helpdesk queue",
      "Wrote Bash + Python scripts for the most common ones (account resets, network resets, log collection)",
      "Wrapped them in a simple menu CLI for non-technical use",
      "Documented each script and added it to the team toolbox"
    ],
    "outcome": "Cut resolution time for common tickets significantly and freed senior staff for harder problems."
  },
  "Penetration Testing Lab Setup": {
    "problem": "Practicing offensive techniques on live systems is illegal. Needed a controlled lab where I could break things without consequences.",
    "approach": [
      "Built a multi-VM environment in VMware: Kali (attacker) + Metasploitable, DVWA, vulnerable Windows targets",
      "Configured isolated host-only networking for safe traffic capture",
      "Set up snapshots so I could roll back after destructive payloads",
      "Documented the lab so I can rebuild it on a fresh machine in minutes"
    ],
    "outcome": "Daily playground for OWASP, Metasploit, and red-team techniques. Every CTF and engagement practice runs through it."
  }
};

if (typeof PORTFOLIO_DATA !== 'undefined' && PORTFOLIO_DATA.projects) {
  PORTFOLIO_DATA.projects.forEach(p => {
    if (PROJECT_CASE_STUDIES[p.title] && !p.caseStudy) p.caseStudy = PROJECT_CASE_STUDIES[p.title];
  });
}

// Expose data globally for the project modal
window.PORTFOLIO_DATA = PORTFOLIO_DATA;


// =====================================================================
// SHOWCASE META — extra display fields for the new gallery
// Add a video and poster to each project to make it shine.
// File paths are relative: images/projects/<slug>.mp4 + <slug>-poster.jpg
// =====================================================================
const PROJECT_META = {
  "Web Vulnerability Scanner": {
    year: 2024, type: "Security tool", icon: "🛡",
    video:  "images/projects/web-vuln-scanner.mp4",
    poster: "images/projects/web-vuln-scanner-poster.jpg"
  },
  "Network Monitoring Dashboard": {
    year: 2023, type: "Network ops", icon: "🌐",
    video:  "images/projects/network-monitor.mp4",
    poster: "images/projects/network-monitor-poster.jpg"
  },
  "Graduation Project — Smart System": {
    year: 2023, type: "Embedded", icon: "🎛",
    video:  "images/projects/grad-smart-system.mp4",
    poster: "images/projects/grad-smart-system-poster.jpg"
  },
  "CTF Challenge Writeups": {
    year: 2024, type: "CTF research", icon: "🏳",
    video:  "images/projects/ctf-writeups.mp4",
    poster: "images/projects/ctf-writeups-poster.jpg"
  },
  "IT Helpdesk Automation Scripts": {
    year: 2021, type: "Automation", icon: "⚙",
    video:  "images/projects/it-automation.mp4",
    poster: "images/projects/it-automation-poster.jpg"
  },
  "Penetration Testing Lab Setup": {
    year: 2024, type: "Lab", icon: "🔌",
    video:  "images/projects/pentest-lab.mp4",
    poster: "images/projects/pentest-lab-poster.jpg"
  }
};

if (typeof PORTFOLIO_DATA !== 'undefined' && PORTFOLIO_DATA.projects) {
  PORTFOLIO_DATA.projects.forEach(p => {
    if (PROJECT_META[p.title]) Object.assign(p, PROJECT_META[p.title]);
  });
}
