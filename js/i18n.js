/* =========================================================
   i18n.js
   ·  EN / AR dictionary
   ·  applyI18n(lang) — swaps every [data-i18n] and flips dir
   ·  persists choice in localStorage
   ·  The `|...|` marker inside a string wraps the part in <em>
   ========================================================= */

window.I18N = {
  en: {
    'lang.switch':     'AR',
    'nav.skip':        'Skip to content',
    'nav.anatomy':     'Story',
    'nav.experience':  'Experience',
    'nav.about':       'About',
    'nav.skills':      'Skills',
    'nav.work':        'Work',
    'nav.contact':     'Contact',

    'hero.edition':    'Edition',
    'hero.issue':      'No. 01 · 2026',
    'hero.sub':        "Software engineer who tests what others ship. Penetration tester who looks for what breaks before it does. Working from Sharkia with companies that take quality seriously.",
    'hero.cta':        'See the work',
    'hero.cta2':       'or get in touch',
    'hero.scroll':     'scroll',

    'intro1.kicker':   "hi, I'm",
    'intro2.line1':    'AlMoatasimbillah',
    'intro2.line2':    'Medhat|.|',
    'intro3.body':     'A software engineer who tests what others ship. A penetration tester who looks for what breaks before it does.',
    'intro4.body':     'From Sharkia. |Available to work.|',

    'phase1.kicker':   'chapter one · the machine',
    'phase1.title':    'A machine, |opened up.|',
    'phase1.body':     "Scroll to take it apart. Every part inside has a counterpart in how I work — the chapters ahead will name them.",
    'phase2.kicker':   'chapter two · the processor',
    'phase2.title':    'The mind, |behind the work.|',
    'phase2.body':     'Where decisions happen. Five years of choices — IT helpdesk floors to engineering. ISTQB methodologies, OWASP discipline.',
    'phase3.kicker':   'chapter three · the memory',
    'phase3.title':    'Active memory, |always on.|',
    'phase3.body':     'Forty tools across six categories. Java, Python, Burp Suite, Nmap, Metasploit, Wireshark — what gets loaded in when work starts.',
    'phase4.kicker':   'chapter four · the storage',
    'phase4.title':    'Long-term storage, |the receipts.|',
    'phase4.body':     'Eleven projects, written to disk. POS systems, e-commerce platforms, a school site, security tooling.',
    'phase5.kicker':   'chapter five · the board',
    'phase5.title':    'The board |that ties it together.|',
    'phase5.body':     'Where everything connects — education, certifications, experience in the field.',

    'handoff.kicker':  'so —',
    'handoff.title':   "Enough machine. |Let's talk about the work.|",
    'handoff.cta':     'Start with who I am',

    'about.kicker':    'about',
    'about.title':     'A short |answer.|',
    'about.body1':     "I'm AlMoatasimbillah — most people call me |Al-Mu'tasim|. A Computer Engineering graduate working on both sides of software: building it carefully, and stress-testing what already exists.",
    'about.body2':     'Five years on the job — from IT helpdesk floors to engineering. ISTQB methodologies, OWASP discipline, hands-on lab practice. Completed the DEPI software engineering programme in May 2026, with ISTQB Foundation certification.',
    'about.now':       '|Now:| refactoring a client POS database and prepping for ISTQB Advanced.',
    'about.now.label': 'Now ·',
    'stat.years':      'years on the job',
    'stat.projects':   'projects shipped',
    'stat.creds':      'credentials',

    'cap.kicker':      'capabilities',
    'cap.title':       'The kit |I work with.|',
    'cap.body':        "Six categories, forty tools. The list below is what I reach for in production — not what's on the résumé.",
    'sphere.hint':     'drag to rotate',

    'exp.kicker':      'experience',
    'exp.title':       'Where I have |been.|',

    'cred.kicker':     'credentials',
    'cred.title':      'On |paper.|',

    'work.kicker':     'selected work',
    'work.title':      'The work |that ships.|',
    'work.body':       'Hover any frame to preview. Click for the case study.',

    'test.kicker':     'kind words',
    'test.title':      "From people |I've worked with.|",
    'test.add':        'Add your testimonial',
    'test.modal.kicker': 'your turn',
    'test.modal.title':  'Share a few words.',
    'test.modal.body':   "Your quote shows up below right away. A copy is emailed to me so I can keep it for good.",
    'test.modal.name':   'Your name',
    'test.modal.role':   'Role, Company (optional)',
    'test.modal.text':   'What was it like working with me?',
    'test.modal.submit': 'Add it',
    'test.modal.thanks': 'Added below — thank you.',
    'test.modal.error':  'Something went wrong. Try again.',
    'test.modal.short':  'A little more detail, please.',
    'test.yours':        'your draft',
    'test.delete':       'remove',
    'test.empty.kicker': 'nothing here yet',
    'test.empty.body':   "I'm holding this space for the people I've actually worked with — once they send words, they go here. Until then, the floor is open.",
    'test.empty.cta':    'You can be the first.',

    'contact.kicker':  'get in touch',
    'contact.title':   'Got something |that needs careful eyes?|',
    'contact.body':    'Fastest way to reach me is a quick message. I read everything and reply within a day.',
    'contact.cv':      'Download CV',
    'contact.cvfmt':   'PDF',

    'footer.tag':      'Designed and built in Sharkia · v.1',
    'footer.zone':     'EET · Sharkia',
    'footer.hint':     'open terminal',

    'marquee.line':    'AVAILABLE TO WORK · |Sharkia| · 2026 · BUILDING · |& breaking| · ENGINEERING · |SECURITY| · QUALITY · |handcrafted| ·',

    'form.name':       'Your name',
    'form.email':      'Email',
    'form.subject':    'Subject',
    'form.message':    'Message',
    'form.send':       'Send message',
    'form.sent':       'sent — talk soon.',
    'form.error':      'something went wrong. try again or email me directly.',
    'form.sending':    'sending...',

    'gh.label':        'live · github.com/Almoatasimbillah',
    'gh.repos':        'public repos',
    'gh.followers':    'followers',
    'gh.stars':        'stars earned',
    'gh.since':        'on GitHub since',
    'gh.heatmap':      'contributions, last 12 months',
    'gh.less':         'less',
    'gh.more':         'more',
    'gh.contributions': 'contributions',
    'share.label':     'share',
    'share.copy':      'copy',
    'share.copied':    'copied!',
    'modal.problem':   'The problem',
    'modal.approach':  'Approach',
    'modal.outcome':   'Outcome',
    'lang.suggest':    'Looks like your browser prefers Arabic. Want to switch?',
    'lang.suggest.accept': 'Switch to العربية',
    'lang.suggest.deny':   'Keep English',

    'avatar.kicker':         'welcome',
    'avatar.kicker.morning': 'good morning',
    'avatar.kicker.midday':  'good afternoon',
    'avatar.kicker.evening': 'good evening',
    'avatar.kicker.night':   'still up?',
    'avatar.title':    "You're at the door. |Make yourself at home.|",
    'avatar.sub.cursor': "That's me — move your cursor and he follows. Scroll for the actual introduction.",
    'avatar.sub.touch':  "That's me — my 3D twin, saying hi. Scroll for the actual introduction.",
    'avatar.loading':    'meeting the host',
    'avatar.error.lead': "He's stuck backstage.",
    'avatar.error.body': "The 3D scene didn't load — the introduction continues below.",
    'about.deskcap':     'still me — modeled and rendered in Blender',
    'avatar.body':     'Scroll to meet me',
    'avatar.scroll':   'scroll',
    'avatar.badge1':   '5+ years on the job',
    'avatar.badge2':   '11 projects shipped',
    'avatar.badge3':   'ISTQB-certified',

    'install.title':   'Install this portfolio',
    'install.sub':     'Add to your home screen — opens like an app.',
    'install.accept':  'Install',
    'install.dismiss': 'Maybe later',
  },

  ar: {
    'lang.switch':     'EN',
    'nav.skip':        'تخطَّ إلى المحتوى',
    'nav.anatomy':     'القصة',
    'nav.experience':  'الخبرة',
    'nav.about':       'عنّي',
    'nav.skills':      'المهارات',
    'nav.work':        'الأعمال',
    'nav.contact':     'تواصل',

    'hero.edition':    'إصدار',
    'hero.issue':      'العدد ٠١ · ٢٠٢٦',
    'hero.sub':        'مهندس برمجيات يختبر ما يطلقه الآخرون. مختبر اختراق يبحث عمّا قد ينكسر قبل أن ينكسر فعلاً. أعمل من الشرقية مع شركات تأخذ الجودة على محمل الجد.',
    'hero.cta':        'تصفّح الأعمال',
    'hero.cta2':       'أو تواصل معي',
    'hero.scroll':     'انزل',

    'intro1.kicker':   'أهلاً، أنا',
    'intro2.line1':    'المعتصم بالله',
    'intro2.line2':    'محمد حسنين|.|',
    'intro3.body':     'مهندس برمجيات يختبر ما يطلقه الآخرون. مختبر اختراق يبحث عمّا قد ينكسر قبل أن ينكسر فعلاً.',
    'intro4.body':     'من الشرقية. |متاح للعمل.|',

    'phase1.kicker':   'الفصل الأول · الآلة',
    'phase1.title':    'آلةٌ |تُفتح أمامك.|',
    'phase1.body':     'انزل لتفكيكها قطعة قطعة. كل جزء بالداخل له ما يقابله في طريقة عملي — والفصول القادمة سَتُسمّيه.',
    'phase2.kicker':   'الفصل الثاني · المعالج',
    'phase2.title':    'العقل، |خلف العمل.|',
    'phase2.body':     'حيث تُتَّخَذ القرارات. خمس سنوات من الخيارات — من الدعم الفنّي حتى الهندسة. منهجيات ISTQB، انضباط OWASP.',
    'phase3.kicker':   'الفصل الثالث · الذاكرة',
    'phase3.title':    'ذاكرة نشطة، |دائمًا مستيقظة.|',
    'phase3.body':     'أربعون أداة في ست فئات. Java، Python، Burp Suite، Nmap، Metasploit، Wireshark — ما يُحَمَّل لحظة بدء العمل.',
    'phase4.kicker':   'الفصل الرابع · التخزين',
    'phase4.title':    'تخزينٌ بعيد المدى، |سِجِلُّ الأعمال.|',
    'phase4.body':     'أحد عشر مشروعًا، مكتوبة على القرص. أنظمة نقاط بيع، منصّات تجارة إلكترونية، موقع مدرسة، أدوات أمنية.',
    'phase5.kicker':   'الفصل الخامس · اللوحة الأم',
    'phase5.title':    'اللوحة |التي تجمع كل شيء.|',
    'phase5.body':     'حيث يتصل كل شيء — التعليم، الشهادات، الخبرة في الميدان.',

    'handoff.kicker':  'إذن —',
    'handoff.title':   'كفى آلات. |لنتحدث عن العمل.|',
    'handoff.cta':     'ابدأ بمن أكون',

    'about.kicker':    'عنّي',
    'about.title':     'إجابة |مختصرة.|',
    'about.body1':     'أنا المعتصم بالله — يناديني الكثيرون |المعتصم|. خرّيج هندسة حاسبات، أعمل على جانبَي البرمجيات: أبنيها بعناية، وأختبر ما يبنيه الآخرون.',
    'about.body2':     'خمس سنوات على رأس العمل — من قاعات الدعم الفنّي حتى الهندسة. منهجيات ISTQB، انضباط OWASP، ممارسة عملية. أنهيتُ برنامج DEPI في مايو ٢٠٢٦، وحصلتُ على شهادة ISTQB Foundation.',
    'about.now':       '|الآن:| إعادة هيكلة قاعدة بيانات POS لعميل، والتحضير لـ ISTQB Advanced.',
    'about.now.label': 'الآن ·',
    'stat.years':      'سنوات على رأس العمل',
    'stat.projects':   'مشروعًا شُحن',
    'stat.creds':      'شهادات',

    'cap.kicker':      'القدرات',
    'cap.title':       'الأدوات |التي أعمل بها.|',
    'cap.body':        'ست فئات، أربعون أداة. القائمة بالأسفل هي ما أستخدمه فعلاً في الإنتاج — لا ما يُكتب في السيرة.',
    'sphere.hint':     'اسحب للتدوير',

    'exp.kicker':      'الخبرة',
    'exp.title':       'المسار |حتى الآن.|',

    'cred.kicker':     'الاعتمادات',
    'cred.title':      'على |الورق.|',

    'work.kicker':     'أعمال مختارة',
    'work.title':      'الأعمال |التي شُحنت.|',
    'work.body':       'مرّر فوق أي إطار للمعاينة. اضغط لقراءة الحالة.',

    'test.kicker':     'كلمات لطيفة',
    'test.title':      'من أشخاص |عملتُ معهم.|',
    'test.add':        'أضف رأيك',
    'test.modal.kicker': 'دورك',
    'test.modal.title':  'شارك ببضع كلمات.',
    'test.modal.body':   'رأيك يظهر بالأسفل فورًا. ونسخة تصلني بالبريد لأحتفظ بها.',
    'test.modal.name':   'اسمك',
    'test.modal.role':   'الدور والشركة (اختياري)',
    'test.modal.text':   'كيف كانت تجربة العمل معي؟',
    'test.modal.submit': 'أضِف',
    'test.modal.thanks': 'أُضيفَ بالأسفل — شكرًا لك.',
    'test.modal.error':  'حدث خطأ. حاول مرة أخرى.',
    'test.modal.short':  'القليل من التفصيل، من فضلك.',
    'test.yours':        'مسودّتك',
    'test.delete':       'احذف',
    'test.empty.kicker': 'لا شيء هنا بعد',
    'test.empty.body':   'أحجز هذه المساحة لمن عملتُ معهم فعلاً — حين يرسلون كلماتهم، تظهر هنا. حتى ذلك الحين، المكان متاح.',
    'test.empty.cta':    'كن أنت الأول.',

    'contact.kicker':  'تواصل معي',
    'contact.title':   'عندك شيءٌ |يحتاج إلى نظرٍ دقيق؟|',
    'contact.body':    'أسرع طريقة للوصول إليّ هي رسالة قصيرة. أقرأ كل شيء وأرد خلال يوم.',
    'contact.cv':      'حمّل السيرة الذاتية',
    'contact.cvfmt':   'PDF',

    'footer.tag':      'مُصمَّم ومُنفَّذ في الشرقية · إصدار ١',
    'footer.zone':     'بتوقيت القاهرة · الشرقية',
    'footer.hint':     'افتح الـ terminal',

    'marquee.line':    'متاح للعمل · |الشرقية| · ٢٠٢٦ · بناء · |وكسر| · هندسة · |أمن| · جودة · |حِرفة| ·',

    'form.name':       'الاسم',
    'form.email':      'البريد',
    'form.subject':    'الموضوع',
    'form.message':    'الرسالة',
    'form.send':       'إرسال الرسالة',
    'form.sent':       'تم الإرسال — نتكلم قريب.',
    'form.error':      'في خطأ. حاول تاني أو راسلني على الإيميل.',
    'form.sending':    'جاري الإرسال...',

    'gh.label':        'مباشر · github.com/Almoatasimbillah',
    'gh.repos':        'مستودع عام',
    'gh.followers':    'متابع',
    'gh.stars':        'نجمة',
    'gh.since':        'على GitHub منذ',
    'gh.heatmap':      'مساهمات آخر ١٢ شهرًا',
    'gh.less':         'أقل',
    'gh.more':         'أكثر',
    'gh.contributions': 'مساهمة',
    'share.label':     'شارك',
    'share.copy':      'انسخ',
    'share.copied':    'تم النسخ!',
    'modal.problem':   'المشكلة',
    'modal.approach':  'المقاربة',
    'modal.outcome':   'النتيجة',
    'lang.suggest':    'يبدو أن متصفحك يفضّل الإنجليزية. تحويل؟',
    'lang.suggest.accept': 'Switch to English',
    'lang.suggest.deny':   'ابقَ في العربية',

    'avatar.kicker':         'أهلاً',
    'avatar.kicker.morning': 'صباح الخير',
    'avatar.kicker.midday':  'مساء الخير',
    'avatar.kicker.evening': 'مساء الخير',
    'avatar.kicker.night':   'لسه صاحي؟',
    'avatar.title':    'أنت عند الباب. |على راحتك.|',
    'avatar.sub.cursor': 'هذا أنا — حرّك المؤشر وهو يتابعك بعينيه. انزل لتبدأ المقدمة الحقيقية.',
    'avatar.sub.touch':  'هذا أنا — توأمي ثلاثي الأبعاد يرحب بك. انزل لتبدأ المقدمة الحقيقية.',
    'avatar.loading':    'جارٍ تجهيز المضيف',
    'avatar.error.lead': 'علِق خلف الكواليس.',
    'avatar.error.body': 'لم يُحمَّل المشهد ثلاثي الأبعاد — المقدمة تكمل بالأسفل.',
    'about.deskcap':     'ما زال أنا — مبنيّ ومُصيَّر في بليندر',
    'avatar.body':     'انزل لتعرفني',
    'avatar.scroll':   'انزل',
    'avatar.badge1':   'أكثر من ٥ سنوات في الميدان',
    'avatar.badge2':   '١١ مشروعًا شُحن',
    'avatar.badge3':   'حاصل على ISTQB',

    'install.title':   'ثبّت هذا البورتفوليو',
    'install.sub':     'أضفه إلى شاشتك — يُفتح كتطبيق.',
    'install.accept':  'تثبيت',
    'install.dismiss': 'لاحقًا',
  }
};

/* ---------- runtime ---------- */
(() => {
  const STORAGE = 'portfolio-lang';

  function escapeHtml(s) {
    return String(s ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }
  // wrap |word| segments in <em>
  function render(str) {
    return escapeHtml(str).split('|').map((part, i) =>
      i % 2 === 0 ? part : `<em>${part}</em>`
    ).join('');
  }

  window.applyI18n = function applyI18n(lang) {
    if (!window.I18N[lang]) lang = 'en';
    document.documentElement.lang = lang;
    document.documentElement.dir  = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.dataset.lang = lang;

    const dict = window.I18N[lang];
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const txt = dict[key] || window.I18N.en[key] || '';
      el.innerHTML = render(txt);
    });

    // Toggle button label = the OTHER language code
    document.querySelectorAll('[data-i18n-toggle]').forEach(el => {
      el.textContent = lang === 'en' ? 'AR' : 'EN';
      el.setAttribute('aria-label', lang === 'en' ? 'تغيير اللغة إلى العربية' : 'Switch language to English');
    });

    localStorage.setItem(STORAGE, lang);
    document.dispatchEvent(new CustomEvent('i18n:changed', { detail: { lang } }));
  };

  window.getLang = () => document.documentElement.dataset.lang || 'en';

  // initial language pick — the ?lang= URL param wins (the hreflang alternate
  // advertised in <head> is /?lang=ar; without this, visitors landing on it
  // from an Arabic search still saw English), then the saved choice
  const urlLang = new URLSearchParams(location.search).get('lang');
  const initial = (urlLang === 'ar' || urlLang === 'en')
    ? urlLang
    : (localStorage.getItem(STORAGE) || 'en');
  // apply once DOM is ready (script is at end of body so DOM is ready, but for safety)
  if (document.readyState !== 'loading') window.applyI18n(initial);
  else document.addEventListener('DOMContentLoaded', () => window.applyI18n(initial));
})();
