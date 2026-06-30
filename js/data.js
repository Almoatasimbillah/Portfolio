// ===================== STATIC DATA (fallback / initial load) =====================
// This data will be replaced by API calls once backend is running

const PORTFOLIO_DATA = {

  skills: [
    {
      icon: "🛡️",
      title: "Cybersecurity",
      tags: ["Penetration Testing", "OWASP Top 10", "Web Security", "Burp Suite", "Nmap", "Nuclei", "Vulnerability Assessment", "CTF Challenges"]
    },
    {
      icon: "💻",
      title: "Software Engineering",
      tags: ["Java", "OOP Concepts", "Software Testing", "ISTQB Fundamentals", "Test Case Design", "Bug Tracking", "SDLC"]
    },
    {
      icon: "🐍",
      title: "Scripting & Automation",
      tags: ["Python", "Bash Scripting", "Automation Scripts", "CLI Tools", "Task Automation"]
    },
    {
      icon: "🌐",
      title: "Networking",
      tags: ["TCP/IP", "Routers & Switches", "IP Configuration", "Network Troubleshooting", "VPN", "Firewalls", "Wireshark"]
    },
    {
      icon: "🖥️",
      title: "Systems & IT",
      tags: ["Windows Server", "Linux (Kali/Ubuntu)", "Virtualization (VMware/VirtualBox)", "Hardware Maintenance", "Active Directory"]
    },
    {
      icon: "🔧",
      title: "Tools & Platforms",
      tags: ["Git & GitHub", "VS Code", "Metasploit", "OWASP ZAP", "Postman", "Jira", "Trello"]
    }
  ],

  experience: [
    {
      date: "Nov 2025 – May 2026",
      title: "Software Engineer Trainee",
      company: "DEPI (Digital Egypt Pioneers Initiative) — Online",
      description: [
        "Trained in Software Testing fundamentals and best practices",
        "Studied Java programming and OOP concepts in depth",
        "Passed the ISTQB Foundation Level certification exam",
        "Developed soft skills: communication, presentation, and teamwork"
      ]
    },
    {
      date: "Jun 2025 – Oct 2025",
      title: "PM Engineer",
      company: "Afro Egypt — Downtown, El Alamein",
      description: [
        "Provided technical support by diagnosing and resolving hardware, software, and network issues",
        "Installed, configured, and maintained computers, printers, and peripheral devices",
        "Assisted non-technical users, significantly reducing downtime and improving productivity",
        "Performed routine system checks and updates to ensure stable daily IT operations"
      ]
    },
    {
      date: "Jan 2019 – Jan 2021",
      title: "IT Helpdesk",
      company: "MISC (Part-Time) — Awlad Saqr, Sharkia",
      description: [
        "Provided first-line technical support to employees for hardware and software issues",
        "Managed installation and configuration of workstations and network peripherals",
        "Documented recurring issues and developed resolution guides to improve team efficiency"
      ]
    }
  ],

  certifications: [
    {
      icon: "🎓",
      name: "Bachelor's Degree — Computer Engineering",
      org: "BHI University",
      year: "2018 – 2023",
      status: "completed",
      note: "GPA: Good | Graduation Project: A+"
    },
    {
      icon: "🛡️",
      name: "ISTQB Foundation Level",
      org: "ISTQB — International Software Testing Qualifications Board",
      year: "May 2026",
      status: "certified",
      note: "Exam passed · certificate pending"
    },
    {
      icon: "⚡",
      name: "Software Engineering Training",
      org: "DEPI — Digital Egypt Pioneers Initiative",
      year: "Nov 2025 – May 2026",
      status: "completed"
    },
    {
      icon: "🔐",
      name: "Web Application Penetration Testing",
      org: "Self-Study & Practical Labs",
      year: "2024 – Present",
      status: "active"
    },
    {
      icon: "🏛️",
      name: "Egyptian Engineers Syndicate",
      org: "Egyptian Engineers Syndicate",
      year: "2023",
      status: "completed"
    },
    {
      icon: "⚔️",
      name: "Military Service",
      org: "Egyptian Armed Forces",
      year: "Jan 2024 – Mar 2025",
      status: "completed"
    }
  ],

  projects: [
      {
          "title": "BoxStore",
          "type": "E-commerce platform",
          "year": 2024,
          "category": "web",
          "description": "A full e-commerce platform built for small and mid-size retailers. Order management, product catalog, WhatsApp ordering, and Zid marketplace sync — designed for shop owners who don't want to live in a dashboard.",
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
                  "caption": "Main storefront + admin"
              },
              {
                  "video": "videos/boxstore-2-demo.mp4",
                  "poster": "videos/posters/boxstore-2-demo-poster.jpg",
                  "caption": "Live demo walkthrough"
              },
              {
                  "video": "videos/boxstore-3-trial-1.mp4",
                  "poster": "videos/posters/boxstore-3-trial-1-poster.jpg",
                  "caption": "Trial build — iteration 1"
              },
              {
                  "video": "videos/boxstore-4-trial-2.mp4",
                  "poster": "videos/posters/boxstore-4-trial-2-poster.jpg",
                  "caption": "Trial build — iteration 2"
              },
              {
                  "video": "videos/boxstore-5-whatsapp.mp4",
                  "poster": "videos/posters/boxstore-5-whatsapp-poster.jpg",
                  "caption": "WhatsApp checkout integration"
              },
              {
                  "video": "videos/boxstore-6-zid.mp4",
                  "poster": "videos/posters/boxstore-6-zid-poster.jpg",
                  "caption": "Zid marketplace sync"
              }
          ],
          "caseStudy": {
              "problem": "Small retailers in the region need an online presence but most platforms are too heavy or too generic. BoxStore had to feel familiar (WhatsApp-first), respect local payment habits, and be cheap to host.",
              "approach": [
                  "Built the storefront and admin in Laravel with a clean MVC structure",
                  "Wrote a WhatsApp integration so customers can place orders without an account",
                  "Synced inventory and orders bi-directionally with Zid marketplace",
                  "Kept the admin UI simple — owners can publish products in under a minute"
              ],
              "outcome": "Production storefront running for multiple clients. WhatsApp flow proved out the conversion-first hypothesis."
          }
      },
      {
          "title": "Salsabeel",
          "type": "Restaurant operations system",
          "year": 2024,
          "category": "web",
          "description": "Order management, menu data ingestion, and an operations dashboard for a regional restaurant chain. Handles live orders, kitchen routing, and a scraper that keeps the public menu in sync.",
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
                  "caption": "Main operations dashboard"
              },
              {
                  "video": "videos/salsabeel-2-scraping.mp4",
                  "poster": "videos/posters/salsabeel-2-scraping-poster.jpg",
                  "caption": "Menu scraper running"
              },
              {
                  "video": "videos/salsabeel-3.mp4",
                  "poster": "videos/posters/salsabeel-3-poster.jpg",
                  "caption": "Order screen — branch view"
              },
              {
                  "video": "videos/salsabeel-4.mp4",
                  "poster": "videos/posters/salsabeel-4-poster.jpg",
                  "caption": "Kitchen routing"
              },
              {
                  "video": "videos/salsabeel-5.mp4",
                  "poster": "videos/posters/salsabeel-5-poster.jpg",
                  "caption": "Reports & daily totals"
              },
              {
                  "video": "videos/salsabeel-6.mp4",
                  "poster": "videos/posters/salsabeel-6-poster.jpg",
                  "caption": "Mobile manager flow"
              }
          ],
          "caseStudy": {
              "problem": "Salsabeel was managing a multi-branch restaurant with phone orders, paper tickets, and a slow public menu. Branches couldn't see live order load and the kitchen had no priority signal.",
              "approach": [
                  "Built a React dashboard centered on the live order queue and per-branch load",
                  "Wrote a scraper that pulls the public menu into MongoDB on a schedule",
                  "Added kitchen routing rules and per-station priority",
                  "Shipped a manager-only mobile flow for end-of-day reports"
              ],
              "outcome": "Branches stopped using paper. Average ticket time dropped during peak hours. The menu now updates without manual data entry."
          }
      },
      {
          "title": "Ali Baba POS",
          "type": "Point of sale system",
          "year": 2024,
          "category": "tool",
          "description": "Multi-terminal POS built for a wholesale and retail operation. Handles cashier flow, returns, layaway, daily Z-report, and printer integration.",
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
                  "caption": "Cashier flow — full sale"
              },
              {
                  "video": "videos/alibaba-2.mp4",
                  "poster": "videos/posters/alibaba-2-poster.jpg",
                  "caption": "Returns and refund flow"
              },
              {
                  "video": "videos/alibaba-3.mp4",
                  "poster": "videos/posters/alibaba-3-poster.jpg",
                  "caption": "Stock check and adjustments"
              },
              {
                  "video": "videos/alibaba-4.mp4",
                  "poster": "videos/posters/alibaba-4-poster.jpg",
                  "caption": "Reports and Z-report"
              },
              {
                  "video": "videos/alibaba-5.mp4",
                  "poster": "videos/posters/alibaba-5-poster.jpg",
                  "caption": "Multi-terminal sync"
              }
          ],
          "caseStudy": {
              "problem": "The client was running 3 cashier terminals on a shared spreadsheet. Daily reconciliation took hours and no one trusted the numbers.",
              "approach": [
                  "Built an Electron-based POS so it ships as a single installer for Windows tills",
                  "Used PostgreSQL with a clean transaction model — every sale is one atomic write",
                  "Added printer drivers for the standard ESC/POS receipt hardware",
                  "Wrote a daily Z-report that exports per-terminal and consolidated"
              ],
              "outcome": "Daily close went from ~90 minutes to under 10. No more spreadsheet sync errors."
          }
      },
      {
          "title": "Clothes POS",
          "type": "Apparel point of sale",
          "year": 2024,
          "category": "tool",
          "description": "A POS specialized for clothing retailers. Size and color matrix, supplier tracking, and a fast barcode-driven cashier flow tuned for changing-room returns.",
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
                  "caption": "Cashier flow with size/color"
              }
          ],
          "caseStudy": {
              "problem": "Generic POS systems don't model the size × color matrix that apparel retailers actually need. The client kept reconciling stock manually.",
              "approach": [
                  "Modeled SKUs as a (style × size × color) tuple from day one",
                  "Built a fast scan-driven cashier that handles the common changing-room return",
                  "Added supplier purchase orders and a low-stock alert per variant"
              ],
              "outcome": "Stock reconciliation moved from weekly to live."
          }
      },
      {
          "title": "Al-Noor Private School",
          "type": "School website",
          "year": 2024,
          "category": "web",
          "description": "Public website for Al-Noor Private School. Admissions intake, news, calendar, and a parent portal — built to be fast on slow mobile connections.",
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
                  "caption": "Site walkthrough"
              }
          ],
          "caseStudy": {
              "problem": "The school's old site was a Word document exported to PDF. Parents called the office for everything because the site told them nothing.",
              "approach": [
                  "Rebuilt as a fast, mobile-first site with a clear admissions funnel",
                  "Added a simple parent portal — login, view child's class, see the calendar",
                  "Kept the editorial workflow lightweight so the office can publish news without IT"
              ],
              "outcome": "Office calls for routine info dropped noticeably. Admissions intake is now online end-to-end."
          }
      },
      {
          "title": "CW Point of Sale",
          "type": "Computer-shop POS",
          "year": 2024,
          "category": "tool",
          "description": "Full POS system built for a computer and electronics retailer. Cashier flow with barcode scanning, returns and warranty tracking, supplier orders, daily Z-report — designed to run the shop floor end-to-end.",
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
                  "caption": "Cashier + admin walkthrough"
              }
          ],
          "caseStudy": {
              "problem": "A computer shop was juggling sales on paper receipts and a spreadsheet — no real stock view, no warranty trail, and reconciliation took hours every day.",
              "approach": [
                  "Built a cashier flow tuned for barcode scanning and quick keyboard entry",
                  "Modeled stock by serial number so warranty + returns are traceable per unit",
                  "Added a supplier-order screen with a simple receive-into-stock workflow",
                  "Generated a daily Z-report exporting per-cashier and consolidated totals"
              ],
              "outcome": "Replaced the paper + spreadsheet system entirely. Daily reconciliation went from hours to under 15 minutes. Stock now lives in one place, accurate, with warranty history intact."
          }
      },
      {
          "title": "Portfolio Evolution",
          "type": "Personal portfolio iterations",
          "year": 2024,
          "category": "web",
          "description": "Five iterations of my own portfolio site. Each one explores a different identity — terminal aesthetic, editorial layout, scroll-driven storytelling, and the calmer version you're reading now.",
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
                  "caption": "Iteration 1 — the long version"
              },
              {
                  "video": "videos/portfolio-iter-2.mp4",
                  "poster": "videos/posters/portfolio-iter-2-poster.jpg",
                  "caption": "Iteration 2 — early identity"
              },
              {
                  "video": "videos/portfolio-iter-3.mp4",
                  "poster": "videos/posters/portfolio-iter-3-poster.jpg",
                  "caption": "Iteration 3 — refinement"
              },
              {
                  "video": "videos/portfolio-iter-4.mp4",
                  "poster": "videos/posters/portfolio-iter-4-poster.jpg",
                  "caption": "Iteration 4 — motion experiments"
              },
              {
                  "video": "videos/portfolio-iter-5.mp4",
                  "poster": "videos/posters/portfolio-iter-5-poster.jpg",
                  "caption": "Iteration 5 — current direction"
              }
          ],
          "caseStudy": {
              "problem": "Designing for yourself is the hardest project. Every iteration was an honest attempt to answer 'what do I actually want to say?'",
              "approach": [
                  "Started with a heavy cyber/terminal aesthetic — read as 'AI-generated'",
                  "Pulled back, moved to a warm editorial palette and serif typography",
                  "Locked a single accent color and stopped fighting the system",
                  "Kept the technical signals (terminal, glitch, scroll-scrub) but tuned the volume down"
              ],
              "outcome": "What you're looking at now. Calmer, more confident, more me."
          }
      },
      {
          "title": "Web Vulnerability Scanner",
          "type": "Security tool",
          "year": 2024,
          "description": "A Python-based automated tool that scans web applications for common vulnerabilities including XSS, SQL injection, and open redirects using OWASP methodologies.",
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
              "approach": [
                  "Built a modular Python scanner with one detector per OWASP category",
                  "Used Requests + BeautifulSoup for crawling and form discovery",
                  "Tested heuristics on intentionally vulnerable apps (DVWA, Juice Shop)",
                  "Generated a structured report with severity rankings and remediation hints"
              ],
              "outcome": "Catches XSS, SQLi, and open-redirect issues across a corpus of test apps. Used as a learning lab and a starting point for engagements."
          }
      },
      {
          "title": "Network Monitoring Dashboard",
          "type": "Network ops",
          "year": 2023,
          "description": "Real-time network monitoring tool that tracks device connectivity, bandwidth usage, and alerts on suspicious traffic patterns across local networks.",
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
              "approach": [
                  "Polled key hosts on the LAN using Nmap host-discovery + ping",
                  "Tracked bandwidth via interface counters on the local gateway",
                  "Alerted on disconnects, latency spikes, and traffic anomalies",
                  "Rendered the data in a simple terminal-style live dashboard"
              ],
              "outcome": "Replaced 'is the internet down?' guessing with a continuously updated map of which hosts are alive and how the link is performing."
          }
      },
      {
          "title": "CTF Challenge Writeups",
          "type": "CTF research",
          "year": 2024,
          "description": "Collection of Capture The Flag challenge solutions covering web exploitation, binary exploitation, cryptography, and forensics from various platforms.",
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
              "approach": [
                  "Solved challenges across web, binary, crypto, and forensics categories",
                  "Documented each one with the reconnaissance steps, key insight, and final payload",
                  "Built a tooling kit (Burp configs, Python helpers, GDB recipes) reused across solves",
                  "Organized writeups in a searchable repo"
              ],
              "outcome": "Sharpened web-app pentesting reflexes and built a reference library used in later engagements."
          }
      },
      {
          "title": "Penetration Testing Lab",
          "type": "Lab environment",
          "year": 2024,
          "description": "A fully configured virtual lab environment for practicing penetration testing techniques including Kali Linux, Metasploitable, and various CTF machines.",
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
              "approach": [
                  "Built a multi-VM environment in VMware: Kali + Metasploitable + DVWA",
                  "Configured isolated host-only networking for safe traffic capture",
                  "Set up snapshots so I could roll back after destructive payloads",
                  "Documented the lab so I can rebuild it on a fresh machine in minutes"
              ],
              "outcome": "Daily playground for OWASP, Metasploit, and red-team techniques."
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
    if (PROJECT_CASE_STUDIES[p.title]) p.caseStudy = PROJECT_CASE_STUDIES[p.title];
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
