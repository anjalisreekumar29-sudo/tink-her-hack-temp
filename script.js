// ===== DOM READY =====
document.addEventListener('DOMContentLoaded', () => {

  // ===== PAGE LOADER =====
  const loader = document.getElementById('pageLoader');
  window.addEventListener('load', () => {
    setTimeout(() => loader.classList.add('hidden'), 800);
  });

  // ===== NAVBAR SCROLL =====
  const navbar = document.getElementById('navbar');
  const handleScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
    // Back to top
    const btn = document.getElementById('backToTop');
    btn.classList.toggle('visible', window.scrollY > 600);
  };
  window.addEventListener('scroll', handleScroll, { passive: true });

  // ===== MOBILE MENU =====
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileClose = document.getElementById('mobileClose');

  hamburger.addEventListener('click', () => mobileMenu.classList.add('open'));
  mobileClose.addEventListener('click', () => mobileMenu.classList.remove('open'));
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => mobileMenu.classList.remove('open'));
  });

  // ===== DARK MODE TOGGLE =====
  const themeToggle = document.getElementById('themeToggle');
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
    themeToggle.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
  }

  themeToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    themeToggle.textContent = next === 'dark' ? '☀️' : '🌙';
  });

  // ===== MONTH TIMELINE =====
  const timelineNav = document.getElementById('timelineNav');
  const timelineBtns = timelineNav.querySelectorAll('.timeline-btn');
  const timelineContents = document.querySelectorAll('.timeline-content');

  timelineBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const month = btn.dataset.month;

      // Update buttons
      timelineBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Update content
      timelineContents.forEach(content => {
        content.classList.toggle('active', content.dataset.month === month);
      });

      // Reset info tabs for the active month
      const activeCard = document.querySelector(`.timeline-content[data-month="${month}"]`);
      if (activeCard) {
        const tabs = activeCard.querySelectorAll('.info-tab');
        const panels = activeCard.querySelectorAll('.info-panel');
        tabs.forEach((t, i) => t.classList.toggle('active', i === 0));
        panels.forEach((p, i) => p.classList.toggle('active', i === 0));
      }
    });
  });

  // ===== INFO TABS (Month card sub-tabs) =====
  document.addEventListener('click', (e) => {
    if (!e.target.classList.contains('info-tab')) return;

    const card = e.target.closest('.month-card');
    if (!card) return;

    const tab = e.target.dataset.tab;
    const tabs = card.querySelectorAll('.info-tab');
    const panels = card.querySelectorAll('.info-panel');

    tabs.forEach(t => t.classList.toggle('active', t.dataset.tab === tab));
    panels.forEach(p => p.classList.toggle('active', p.dataset.tab === tab));
  });

  // ===== SYMPTOM CHECKER =====
  const trimesterTabs = document.querySelectorAll('.trimester-tab');
  const symptomGrids = document.querySelectorAll('.symptom-grid');
  const symptomAdvice = document.getElementById('symptomAdvice');
  const symptomAdviceText = document.getElementById('symptomAdviceText');

  trimesterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const trimester = tab.dataset.trimester;
      trimesterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      symptomGrids.forEach(grid => {
        grid.classList.toggle('active', grid.dataset.trimester === trimester);
      });
      // Reset checks and advice
      document.querySelectorAll('.symptom-item').forEach(item => item.classList.remove('checked'));
      symptomAdvice.classList.remove('visible');
    });
  });

  document.querySelectorAll('.symptom-item').forEach(item => {
    item.addEventListener('click', () => {
      item.classList.toggle('checked');
      const advice = item.dataset.advice;

      if (item.classList.contains('checked') && advice) {
        symptomAdviceText.textContent = advice;
        symptomAdvice.classList.add('visible');
      } else {
        // Show advice from another checked item if available
        const checked = document.querySelector('.symptom-grid.active .symptom-item.checked');
        if (checked) {
          symptomAdviceText.textContent = checked.dataset.advice;
        } else {
          symptomAdvice.classList.remove('visible');
        }
      }
    });
  });

  // ===== TESTIMONIALS CAROUSEL =====
  const track = document.getElementById('testimonialsTrack');
  const dots = document.querySelectorAll('.testimonial-dot');
  const prevBtn = document.getElementById('prevTestimonial');
  const nextBtn = document.getElementById('nextTestimonial');
  let currentSlide = 0;
  const totalSlides = document.querySelectorAll('.testimonial-card').length;

  const goToSlide = (index) => {
    currentSlide = ((index % totalSlides) + totalSlides) % totalSlides;
    track.style.transform = `translateX(-${currentSlide * 100}%)`;
    dots.forEach((dot, i) => dot.classList.toggle('active', i === currentSlide));
  };

  prevBtn.addEventListener('click', () => goToSlide(currentSlide - 1));
  nextBtn.addEventListener('click', () => goToSlide(currentSlide + 1));
  dots.forEach(dot => {
    dot.addEventListener('click', () => goToSlide(parseInt(dot.dataset.index)));
  });

  // Auto-advance every 5 seconds
  let autoSlide = setInterval(() => goToSlide(currentSlide + 1), 5000);
  const slider = document.querySelector('.testimonials-slider');
  slider.addEventListener('mouseenter', () => clearInterval(autoSlide));
  slider.addEventListener('mouseleave', () => {
    autoSlide = setInterval(() => goToSlide(currentSlide + 1), 5000);
  });

  // ===== FAQ ACCORDION =====
  document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', () => {
      const item = question.parentElement;
      const wasOpen = item.classList.contains('open');

      // Close all
      document.querySelectorAll('.faq-item').forEach(faq => faq.classList.remove('open'));

      // Toggle current
      if (!wasOpen) item.classList.add('open');
    });
  });

  // ===== GET STARTED — PERSONALIZED JOURNEY =====
  const form = document.getElementById('newsletterForm');
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameInput = form.querySelector('input[type="text"]');
    const dateInput = form.querySelector('input[type="date"]');
    const emailInput = form.querySelector('input[type="email"]');
    const btn = form.querySelector('button');

    const userName = nameInput.value.trim();
    const dueDate = new Date(dateInput.value);
    const today = new Date();

    // Validate
    if (!userName || !dateInput.value) return;

    // Calculate pregnancy month (pregnancy is ~40 weeks / 280 days)
    const dueDateMs = dueDate.getTime();
    const todayMs = today.getTime();
    const msPerDay = 1000 * 60 * 60 * 24;
    const daysUntilDue = Math.round((dueDateMs - todayMs) / msPerDay);
    const totalPregnancyDays = 280;
    const daysPregnant = totalPregnancyDays - daysUntilDue;
    const weeksPregnant = Math.max(1, Math.min(40, Math.round(daysPregnant / 7)));
    const currentMonth = Math.max(1, Math.min(9, Math.ceil(weeksPregnant / 4.44)));

    // Trimester calculation
    let trimester, trimesterLabel;
    if (currentMonth <= 3) { trimester = 1; trimesterLabel = '1st Trimester'; }
    else if (currentMonth <= 6) { trimester = 2; trimesterLabel = '2nd Trimester'; }
    else { trimester = 3; trimesterLabel = '3rd Trimester'; }

    // Weeks remaining
    const weeksLeft = Math.max(0, Math.round(daysUntilDue / 7));

    // Format due date
    const dueFormatted = dueDate.toLocaleDateString('en-US', {
      month: 'long', day: 'numeric', year: 'numeric'
    });

    // Remove existing welcome banner if any
    const existingBanner = document.getElementById('personalizedBanner');
    if (existingBanner) existingBanner.remove();

    // Create personalized welcome banner
    const banner = document.createElement('div');
    banner.id = 'personalizedBanner';
    banner.innerHTML = `
      <div class="container">
        <button class="banner-close" id="bannerClose" aria-label="Close banner">✕</button>
        <div class="banner-content">
          <div class="banner-greeting">
            <span class="banner-wave">👋</span>
            <h2>Welcome, ${userName}!</h2>
          </div>
          <p class="banner-subtitle">Here's your personalized pregnancy dashboard</p>
          <div class="banner-stats-grid">
            <div class="banner-stat-card">
              <div class="banner-stat-icon">📅</div>
              <div class="banner-stat-value">Month ${currentMonth}</div>
              <div class="banner-stat-label">Current Month</div>
            </div>
            <div class="banner-stat-card">
              <div class="banner-stat-icon">📆</div>
              <div class="banner-stat-value">Week ${weeksPregnant}</div>
              <div class="banner-stat-label">of Pregnancy</div>
            </div>
            <div class="banner-stat-card">
              <div class="banner-stat-icon">🤰🏻</div>
              <div class="banner-stat-value">${trimesterLabel}</div>
              <div class="banner-stat-label">Current Phase</div>
            </div>
            <div class="banner-stat-card highlight">
              <div class="banner-stat-icon">🎯</div>
              <div class="banner-stat-value">${dueFormatted}</div>
              <div class="banner-stat-label">${weeksLeft} weeks to go!</div>
            </div>
          </div>
          <p class="banner-cta-text">We've selected <strong>Month ${currentMonth}</strong> for you below — scroll down to explore your current stage! 🌸</p>
        </div>
      </div>
    `;

    // Insert banner before the journey section
    const journeySection = document.getElementById('journey');
    journeySection.parentNode.insertBefore(banner, journeySection);

    // Close banner button
    document.getElementById('bannerClose').addEventListener('click', () => {
      banner.style.animation = 'fadeOutBanner 0.4s ease forwards';
      setTimeout(() => banner.remove(), 400);
    });

    // Auto-select the correct month in the timeline
    const targetBtn = document.querySelector(`.timeline-btn[data-month="${currentMonth}"]`);
    if (targetBtn) {
      timelineBtns.forEach(b => b.classList.remove('active'));
      targetBtn.classList.add('active');
      timelineContents.forEach(content => {
        content.classList.toggle('active', content.dataset.month === String(currentMonth));
      });
    }

    // Button success state
    btn.textContent = '✓ Personalizing...';
    btn.style.background = 'var(--color-sage)';

    // Smooth scroll to the banner
    setTimeout(() => {
      banner.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 300);

    // Reset button after delay
    setTimeout(() => {
      btn.textContent = 'Get Started';
      btn.style.background = '';
    }, 3000);
  });

  // ===== SCROLL REVEAL =====
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  revealElements.forEach(el => revealObserver.observe(el));

  // ===== BACK TO TOP =====
  document.getElementById('backToTop').addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ===== SMOOTH SCROLL FOR ALL ANCHOR LINKS =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // ===== NAVBAR ACTIVE LINK HIGHLIGHT =====
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a:not(.nav-cta):not(.theme-toggle)');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.style.color = '';
          if (link.getAttribute('href') === `#${id}`) {
            link.style.color = 'var(--color-coral)';
          }
        });
      }
    });
  }, { threshold: 0.3 });

  sections.forEach(section => sectionObserver.observe(section));

  // ===== COUNTER ANIMATION =====
  const counters = document.querySelectorAll('.hero-stat .number');
  const animateCounter = (el) => {
    const text = el.textContent;
    const hasPlus = text.includes('+');
    const hasK = text.includes('K');
    const num = parseInt(text.replace(/[^0-9]/g, ''));

    if (isNaN(num)) return;

    let current = 0;
    const increment = Math.ceil(num / 60);
    const timer = setInterval(() => {
      current += increment;
      if (current >= num) {
        current = num;
        clearInterval(timer);
      }
      let display = current.toString();
      if (hasK) display = current + 'K';
      if (hasPlus) display += '+';
      el.textContent = display;
    }, 30);
  };

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => counterObserver.observe(counter));

  // ===== AI CHATBOT =====
  const chatbot = document.getElementById('chatbot');
  const chatToggle = document.getElementById('chatToggle');
  const chatMinimize = document.getElementById('chatMinimize');
  const chatForm = document.getElementById('chatForm');
  const chatInput = document.getElementById('chatInput');
  const chatMessages = document.getElementById('chatMessages');
  const chatSuggestions = document.getElementById('chatSuggestions');

  // Toggle chat open/close
  chatToggle.addEventListener('click', () => {
    chatbot.classList.toggle('open');
    chatToggle.classList.toggle('active');
    if (chatbot.classList.contains('open')) {
      chatInput.focus();
    }
  });

  chatMinimize.addEventListener('click', () => {
    chatbot.classList.remove('open');
    chatToggle.classList.remove('active');
  });

  // Suggestion buttons
  chatSuggestions.querySelectorAll('.chat-suggestion').forEach(btn => {
    btn.addEventListener('click', () => {
      const q = btn.dataset.q;
      chatInput.value = q;
      chatForm.dispatchEvent(new Event('submit'));
    });
  });

  // Pregnancy Knowledge Base
  const knowledgeBase = [
    {
      keywords: ['eat', 'food', 'diet', 'nutrition', 'meal', 'hungry', 'cook'],
      answer: "Great question! 🥗 During pregnancy, focus on:\n\n• **Folate-rich foods**: spinach, lentils, broccoli\n• **Iron**: red meat, beans, fortified cereals\n• **Calcium**: yogurt, cheese, almonds\n• **Omega-3**: salmon, walnuts, chia seeds\n• **Protein**: eggs, chicken, quinoa\n\nAvoid raw fish, unpasteurized dairy, deli meats, and limit caffeine to 200mg/day. Eat small, frequent meals for best energy!",
      followUp: "Want to know about foods to avoid?"
    },
    {
      keywords: ['avoid', 'dangerous food', 'not eat', 'harmful', 'unsafe food'],
      answer: "🚫 Foods to avoid during pregnancy:\n\n• **Raw/undercooked meat, fish, eggs**\n• **Unpasteurized dairy and juices**\n• **High-mercury fish**: shark, swordfish, king mackerel\n• **Deli meats** (unless heated to steaming)\n• **Raw sprouts**\n• **Excess caffeine** (limit 200mg/day)\n• **Alcohol** – avoid completely\n\nWhen in doubt, cook it well and wash produce thoroughly!",
      followUp: "Would you like nutrition tips instead?"
    },
    {
      keywords: ['morning sickness', 'nausea', 'vomit', 'throw up', 'queasy', 'sick'],
      answer: "Morning sickness affects up to 80% of pregnant women — you're not alone! 🤢\n\n**Tips to manage it:**\n• Eat small meals every 2-3 hours\n• Keep crackers by your bed to eat before rising\n• Sip ginger tea or ginger ale\n• Avoid strong smells and greasy foods\n• Try vitamin B6 supplements (ask your doctor)\n• Stay hydrated with small sips\n\nIt usually improves by week 12-14. If you can't keep anything down, contact your doctor — you may have hyperemesis gravidarum.",
      followUp: "Shall I share tips for fatigue too?"
    },
    {
      keywords: ['exercise', 'workout', 'gym', 'yoga', 'walk', 'swim', 'active', 'fitness'],
      answer: "Exercise is wonderful during pregnancy! 🧘‍♀️\n\n**Safe exercises:**\n• Walking (30 min/day is great)\n• Swimming & water aerobics\n• Prenatal yoga\n• Stationary cycling\n• Light strength training\n\n**Avoid:**\n• Contact sports\n• Hot yoga or hot tubs\n• Lying flat on your back (after 1st trimester)\n• Heavy lifting\n• Activities with fall risk\n\nAim for 150 minutes of moderate activity per week. Always consult your doctor first!",
      followUp: "Want to learn about prenatal yoga specifically?"
    },
    {
      keywords: ['hospital', 'labor', 'contraction', 'water broke', 'delivery', 'birth', 'due'],
      answer: "🏥 **When to go to the hospital:**\n\nUse the **5-1-1 rule**: Go when contractions are:\n• **5 minutes** apart\n• Lasting **1 minute** each\n• For at least **1 hour**\n\n**Go immediately if:**\n• Your water breaks\n• Heavy vaginal bleeding\n• Severe headache or vision changes\n• Decreased baby movement\n• Fever above 100.4°F\n\nKeep your hospital bag packed from week 36!",
      followUp: "Need help with a birth plan?"
    },
    {
      keywords: ['sleep', 'insomnia', 'tired', 'fatigue', 'exhausted', 'rest', 'nap'],
      answer: "Sleep can be challenging during pregnancy! 😴\n\n**Tips for better sleep:**\n• Sleep on your left side (best blood flow)\n• Use a pregnancy pillow between knees\n• Avoid screens 1 hour before bed\n• Keep a consistent bedtime routine\n• Limit fluids before bedtime\n• Try gentle stretching or meditation\n• Keep your room cool and dark\n\nFatigue is especially common in the 1st and 3rd trimesters. Nap when you can — your body needs it!",
      followUp: "Want to know about safe sleeping positions?"
    },
    {
      keywords: ['vitamin', 'supplement', 'prenatal', 'folic acid', 'iron', 'calcium', 'pill'],
      answer: "💊 **Essential prenatal supplements:**\n\n• **Folic acid**: 400-800 mcg/day (prevents neural tube defects)\n• **Iron**: 27 mg/day (prevents anemia)\n• **Calcium**: 1000 mg/day (for baby's bones)\n• **Vitamin D**: 600 IU/day\n• **DHA/Omega-3**: 200-300 mg/day (brain development)\n• **Iodine**: 220 mcg/day\n\nStart a prenatal vitamin as early as possible — ideally before conception. Your doctor may recommend specific brands based on your needs.",
      followUp: "Want to know which foods are rich in folic acid?"
    },
    {
      keywords: ['kick', 'movement', 'baby move', 'flutter', 'kick count'],
      answer: "Feeling baby's movements is magical! 🤸\n\n• **First movements**: Usually felt between weeks 16-25\n• **First-time moms**: May feel them later (week 20-25)\n• **Kick counts**: Starting week 28, count 10 movements in 2 hours daily\n• Most active after meals and in the evening\n\n**When to call your doctor:**\n• Significant decrease in movement\n• No movements for 2+ hours after week 28\n• Sudden change in pattern\n\nTry drinking cold water or lying on your side to encourage movement.",
      followUp: "Want month-by-month development details?"
    },
    {
      keywords: ['weight', 'gain', 'heavy', 'pounds', 'overweight', 'bmi'],
      answer: "⚖️ **Healthy weight gain during pregnancy:**\n\n• **Underweight (BMI < 18.5)**: 28-40 lbs\n• **Normal weight (BMI 18.5-24.9)**: 25-35 lbs\n• **Overweight (BMI 25-29.9)**: 15-25 lbs\n• **Obese (BMI > 30)**: 11-20 lbs\n\n**Trimester breakdown:**\n• 1st trimester: 1-5 lbs total\n• 2nd & 3rd trimester: about 1 lb per week\n\nFocus on nutrient quality, not quantity. Your doctor will monitor your weight at each visit.",
      followUp: "Need nutrition guidance for your trimester?"
    },
    {
      keywords: ['headache', 'head', 'migraine', 'pain head'],
      answer: "🤕 **Headaches during pregnancy:**\n\nCommon causes: hormones, dehydration, stress, low blood sugar, caffeine withdrawal.\n\n**Safe relief:**\n• Rest in a dark, quiet room\n• Apply cold compress to forehead\n• Stay hydrated\n• Eat regular meals\n• Acetaminophen (Tylenol) is generally safe\n\n**⚠️ Call your doctor immediately if:**\n• Severe or sudden headache\n• Accompanied by vision changes\n• With swelling or high blood pressure\n• After 20 weeks (could indicate preeclampsia)",
      followUp: "Want to know about other common symptoms?"
    },
    {
      keywords: ['back pain', 'backache', 'sore back', 'back hurt'],
      answer: "🔙 **Back pain is very common in pregnancy!**\n\n**Relief tips:**\n• Practice good posture\n• Wear flat, supportive shoes\n• Use a pregnancy support belt\n• Sleep with a pillow between your knees\n• Try prenatal yoga stretches\n• Apply heat or cold packs\n• Get a prenatal massage\n• Strengthen your core with gentle exercises\n\nAvoid standing for long periods and lifting heavy objects. If pain is severe or accompanied by cramping, contact your doctor.",
      followUp: "Want safe exercise recommendations?"
    },
    {
      keywords: ['cramp', 'leg cramp', 'charlie horse', 'muscle'],
      answer: "🦵 **Leg cramps during pregnancy:**\n\nCommon especially at night, starting in the 2nd trimester.\n\n**Prevention:**\n• Stretch calves before bed\n• Stay well hydrated\n• Eat magnesium-rich foods (nuts, bananas, dark chocolate)\n• Ensure adequate calcium intake\n• Walk daily to improve circulation\n• Avoid pointing your toes when stretching\n\n**Quick relief:** Flex your foot upward and massage the muscle. A warm towel can also help.",
      followUp: "Need tips for better sleep?"
    },
    {
      keywords: ['heartburn', 'acid reflux', 'indigestion', 'stomach burn'],
      answer: "🔥 **Heartburn during pregnancy:**\n\nCaused by hormones relaxing the valve between stomach and esophagus, plus your growing uterus.\n\n**Relief tips:**\n• Eat smaller, more frequent meals\n• Avoid spicy, fatty, and acidic foods\n• Don't lie down right after eating\n• Elevate your head while sleeping\n• Wear loose clothing\n• Try milk or yogurt to neutralize acid\n• Ask your doctor about safe antacids\n\nOften gets better after baby 'drops' in the third trimester.",
      followUp: "Need nutrition tips for easier digestion?"
    },
    {
      keywords: ['mood', 'anxiety', 'depression', 'sad', 'cry', 'emotional', 'stress', 'mental health', 'worry'],
      answer: "💙 **Mental health during pregnancy matters!**\n\nHormonal changes can cause mood swings, anxiety, and emotional sensitivity — this is completely normal.\n\n**Self-care tips:**\n• Talk about your feelings with someone you trust\n• Gentle exercise (proven mood booster)\n• Maintain a sleep routine\n• Practice deep breathing or meditation\n• Join a pregnancy support group\n• Keep a gratitude journal\n\n**⚠️ Seek help if you experience:**\n• Persistent sadness lasting 2+ weeks\n• Loss of interest in things you enjoy\n• Thoughts of self-harm\n\nPostpartum Support Helpline: **1-800-944-4773**",
      followUp: "Want to learn about relaxation techniques?"
    },
    {
      keywords: ['sex', 'intimacy', 'intercourse', 'safe sex'],
      answer: "💕 **Intimacy during pregnancy:**\n\nIn most cases, sex is perfectly safe throughout pregnancy! The baby is well-protected by amniotic fluid and your cervix.\n\n**Tips:**\n• Communicate openly with your partner\n• Try comfortable positions (side-lying works well)\n• The 2nd trimester is often the most comfortable time\n• It's normal for desire to fluctuate\n\n**Avoid if your doctor has warned about:**\n• Placenta previa\n• Preterm labor risk\n• Cervical insufficiency\n• Unexplained vaginal bleeding\n\nAlways follow your doctor's specific advice for your situation.",
      followUp: "Any other concerns I can help with?"
    },
    {
      keywords: ['medicine', 'medication', 'drug', 'tylenol', 'ibuprofen', 'antibiotic', 'safe medicine'],
      answer: "💊 **Medication safety during pregnancy:**\n\n**Generally safe:**\n• Acetaminophen (Tylenol) for pain/fever\n• Tums for heartburn\n• Certain allergy meds (ask your doctor)\n\n**AVOID:**\n• Ibuprofen (Advil/Motrin)\n• Aspirin (unless prescribed)\n• Most herbal supplements without doctor approval\n\n**Always ask your doctor before taking ANY medication**, including over-the-counter drugs, vitamins, and herbal remedies. What's safe in one trimester may not be in another.",
      followUp: "Need info about prenatal vitamins?"
    },
    {
      keywords: ['ultrasound', 'scan', 'sonogram', 'anatomy scan'],
      answer: "🔬 **Ultrasound schedule during pregnancy:**\n\n• **Week 6-8**: Dating ultrasound (confirms pregnancy, due date)\n• **Week 11-14**: NT scan (nuchal translucency screening)\n• **Week 18-22**: Anatomy scan (detailed check of baby's organs, often learn gender!)\n• **Week 32-36**: Growth scan (checking baby's size and position)\n\nAdditional scans may be needed for high-risk pregnancies. These are safe — ultrasound uses sound waves, not radiation.",
      followUp: "Want to know about genetic testing?"
    },
    {
      keywords: ['gender', 'boy', 'girl', 'find out sex', 'reveal'],
      answer: "👶 **Finding out your baby's gender:**\n\n• **Blood test (NIPT)**: As early as week 10 (also screens for chromosomal conditions)\n• **Anatomy scan**: Usually weeks 18-22 (most common method)\n• **Some signs are myths!** Carrying high/low, heart rate, and food cravings do NOT predict gender\n\nIt's your choice whether to find out! Some parents love the surprise, while others prefer to prepare. Either way is wonderful! 🎀💙",
      followUp: "Need help preparing the nursery?"
    },
    {
      keywords: ['travel', 'fly', 'airplane', 'vacation', 'trip', 'drive'],
      answer: "✈️ **Traveling during pregnancy:**\n\n**Safest time**: Weeks 14-28 (2nd trimester)\n\n**Tips:**\n• Check airline policies (most restrict after 36 weeks)\n• Wear compression socks for flights\n• Walk every 2 hours to prevent blood clots\n• Stay hydrated\n• Carry medical records and your doctor's contact\n• Wear seatbelt below your belly\n\n**Avoid travel if:**\n• High-risk pregnancy\n• After 36 weeks\n• To areas with Zika virus\n\nAlways get your doctor's clearance before traveling.",
      followUp: "Any other pregnancy questions?"
    },
    {
      keywords: ['hospital bag', 'pack', 'bag', 'prepare', 'what to bring'],
      answer: "🧳 **Hospital bag checklist:**\n\n**For mom:**\n• ID, insurance cards, birth plan\n• Comfortable robe and slippers\n• Nursing bra and breast pads\n• Toiletries and lip balm\n• Phone charger\n• Going-home outfit (maternity size!)\n• Snacks and drinks\n\n**For baby:**\n• Going-home outfit + extra (2 sizes)\n• Blanket and hat\n• Car seat (installed before!)\n\n**For partner:**\n• Change of clothes\n• Snacks and drinks\n• Camera/phone charger\n\nPack by week 36!",
      followUp: "Need help creating a birth plan?"
    },
    {
      keywords: ['birth plan', 'delivery plan', 'natural birth', 'c-section', 'epidural'],
      answer: "📝 **Creating your birth plan:**\n\n**Consider including:**\n• Pain management preferences (epidural, natural, etc.)\n• Who you want in the room\n• Preferred labor positions\n• Music or lighting preferences\n• Delayed cord clamping\n• Skin-to-skin contact immediately after birth\n• Breastfeeding preferences\n• Photography/video preferences\n\n**Remember:** Birth plans are guidelines, not guarantees. Flexibility is key — the priority is a safe delivery for you and baby. Discuss your plan with your doctor at week 32-36.",
      followUp: "Want to pack your hospital bag?"
    },
    {
      keywords: ['breastfeed', 'nursing', 'milk', 'formula', 'feed baby', 'lactation'],
      answer: "🤱 **Breastfeeding basics:**\n\n• Breast milk provides perfect nutrition and immunity\n• First milk (colostrum) is liquid gold — very important!\n• Feed on demand, typically every 2-3 hours\n• Ensure proper latch to prevent pain\n• Stay hydrated and well-nourished\n\n**Getting help:**\n• Attend a breastfeeding class before birth\n• Ask for a lactation consultant in the hospital\n• La Leche League helpline: **1-877-452-5324**\n\nBoth breastfeeding and formula feeding are valid choices — do what works best for your family! 💛",
      followUp: "Any other questions about newborn care?"
    },
    {
      keywords: ['swelling', 'swollen', 'edema', 'puffy', 'feet swell'],
      answer: "🦶 **Swelling during pregnancy:**\n\nMild swelling (edema) is normal, especially in feet, ankles, and hands during the 3rd trimester.\n\n**Relief tips:**\n• Elevate your feet when sitting\n• Avoid standing for long periods\n• Wear comfortable, loose shoes\n• Stay hydrated (it actually reduces swelling!)\n• Reduce sodium intake\n• Wear compression stockings\n• Sleep on your left side\n\n**⚠️ Call your doctor if:**\n• Sudden severe swelling\n• Swelling in face or around eyes\n• Accompanied by headache or vision changes\n(Could indicate preeclampsia)",
      followUp: "Want to check other symptoms?"
    },
    {
      keywords: ['test', 'screening', 'genetic', 'blood test', 'glucose', 'diabetes'],
      answer: "🔬 **Important pregnancy tests:**\n\n**1st Trimester:**\n• Blood type and Rh factor\n• Complete blood count (CBC)\n• NIPT (non-invasive prenatal testing, week 10+)\n\n**2nd Trimester:**\n• Anatomy scan (week 18-22)\n• Glucose screening (gestational diabetes, week 24-28)\n• Quad screen\n\n**3rd Trimester:**\n• Group B Strep test (week 36-37)\n• Non-stress test (if needed)\n\nYour doctor will guide you on which tests are recommended for your specific situation.",
      followUp: "Need info about ultrasound schedules?"
    },
    {
      keywords: ['hi', 'hello', 'hey', 'good morning', 'good evening', 'how are you'],
      answer: "Hello! 👋🌸 Welcome to BloomMama AI! I'm here to answer all your pregnancy questions. You can ask me about:\n\n• 🥗 Nutrition & diet\n• 🤒 Symptoms & remedies\n• 🧘 Exercise & fitness\n• 👶 Baby development\n• 🏥 When to see a doctor\n• 💊 Vitamins & medications\n• 🧳 Hospital bag & birth plan\n\nWhat would you like to know?",
      followUp: ""
    },
    {
      keywords: ['thank', 'thanks', 'helpful', 'great', 'awesome', 'perfect'],
      answer: "You're so welcome! 😊🌸 I'm always here if you have more questions. Wishing you a healthy and happy pregnancy journey! Remember, no question is too small — I'm just a click away. 💕",
      followUp: ""
    }
  ];

  // Find best matching answer
  function getAnswer(question) {
    const q = question.toLowerCase();
    let bestMatch = null;
    let bestScore = 0;

    for (const entry of knowledgeBase) {
      let score = 0;
      for (const keyword of entry.keywords) {
        if (q.includes(keyword)) {
          score += keyword.length; // longer keyword matches = higher relevance
        }
      }
      if (score > bestScore) {
        bestScore = score;
        bestMatch = entry;
      }
    }

    if (bestMatch && bestScore > 0) {
      return bestMatch;
    }

    return {
      answer: "That's a great question! 🤔 While I don't have specific information on that topic, here are some things I can help with:\n\n• Pregnancy nutrition and diet\n• Common symptoms and remedies\n• Safe exercises\n• Baby development month by month\n• When to contact your doctor\n• Hospital bag and birth plan\n• Prenatal vitamins and medications\n\nTry asking about one of these topics, or consult your healthcare provider for personalized medical advice! 💙",
      followUp: ""
    };
  }

  // Format text with bold markdown
  function formatMessage(text) {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br>');
  }

  // Add message to chat
  function addMessage(text, type) {
    const msg = document.createElement('div');
    msg.className = `chat-msg ${type}`;
    msg.innerHTML = `
      <div class="chat-msg-avatar">${type === 'bot' ? '🌸' : '👤'}</div>
      <div class="chat-msg-bubble">
        <p>${type === 'bot' ? formatMessage(text) : text}</p>
      </div>
    `;
    chatMessages.appendChild(msg);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // Show typing indicator
  function showTyping() {
    const typing = document.createElement('div');
    typing.className = 'chat-msg bot';
    typing.id = 'typingIndicator';
    typing.innerHTML = `
      <div class="chat-msg-avatar">🌸</div>
      <div class="chat-msg-bubble">
        <div class="chat-typing"><span></span><span></span><span></span></div>
      </div>
    `;
    chatMessages.appendChild(typing);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function removeTyping() {
    const typing = document.getElementById('typingIndicator');
    if (typing) typing.remove();
  }

  // Handle form submit
  chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const question = chatInput.value.trim();
    if (!question) return;

    // Add user message
    addMessage(question, 'user');
    chatInput.value = '';

    // Hide suggestions after first question
    chatSuggestions.style.display = 'none';

    // Show typing then respond
    showTyping();

    setTimeout(() => {
      removeTyping();
      const result = getAnswer(question);
      addMessage(result.answer, 'bot');

      // Add follow-up suggestion if available
      if (result.followUp) {
        setTimeout(() => {
          addMessage(result.followUp, 'bot');
        }, 500);
      }
    }, 1000 + Math.random() * 800); // Simulate thinking time
  });

});
