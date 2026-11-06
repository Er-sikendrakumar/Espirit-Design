/**
 * ESPIRIT TECHNOLOGIES - MAIN APPLICATION CONTROLLER
 * Modern 2026/2027 Interactive IT & Digital Engineering Experience
 */

document.addEventListener('DOMContentLoaded', () => {
  const tasks = [
    initTheme,
    initNavbar,
    initCounters,
    initTechFilter,
    initBlogFilter,
    initEstimator,
    initServiceModals,
    initBlogModals,
    initTestimonials,
    initFaqAccordion,
    initModals,
    initForms,
    initScrollReveal,
    initCardSpotlight
  ];

  tasks.forEach(fn => {
    try {
      fn();
    } catch (err) {
      console.warn(`[Espirit] Notice in ${fn.name}:`, err);
    }
  });
});

/* ==========================================================================
   1. THEME SWITCHER (DARK / LIGHT)
   ========================================================================== */
function initTheme() {
  const toggleBtn = document.getElementById('theme-toggle-btn');
  const storedTheme = localStorage.getItem('espirit-theme') || 'dark';
  
  document.documentElement.setAttribute('data-theme', storedTheme);
  updateThemeIcon(storedTheme);

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('espirit-theme', newTheme);
      updateThemeIcon(newTheme);
    });
  }
}

function updateThemeIcon(theme) {
  const icon = document.getElementById('theme-icon');
  if (!icon) return;
  if (theme === 'light') {
    icon.innerHTML = `<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;
  } else {
    icon.innerHTML = `<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;
  }
}

/* ==========================================================================
   2. NAVBAR CONTROLLER & ACTIVE SPY
   ========================================================================== */
function initNavbar() {
  const navbar = document.querySelector('.navbar-wrapper');
  const mobileBtn = document.querySelector('.mobile-menu-btn');
  const drawer = document.querySelector('.mobile-nav-drawer');
  const drawerClose = document.querySelector('.mobile-drawer-close');
  const navLinks = document.querySelectorAll('.nav-link, .mobile-drawer-link');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
    highlightNavOnScroll();
  });

  if (mobileBtn && drawer) {
    mobileBtn.addEventListener('click', () => {
      drawer.classList.add('active');
    });
  }

  if (drawerClose && drawer) {
    drawerClose.addEventListener('click', () => {
      drawer.classList.remove('active');
    });
  }

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      drawer?.classList.remove('active');
    });
  });

  function highlightNavOnScroll() {
    const scrollPos = window.scrollY + 120;
    const sections = document.querySelectorAll('section[id]');
    
    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      const id = sec.getAttribute('id');
      
      if (scrollPos >= top && scrollPos < top + height) {
        document.querySelectorAll('.nav-link').forEach(l => {
          l.classList.remove('active');
          if (l.getAttribute('href') === `#${id}`) {
            l.classList.add('active');
          }
        });
      }
    });
  }
}

/* ==========================================================================
   3. ANIMATED NUMBER COUNTERS
   ========================================================================== */
function initCounters() {
  const counters = document.querySelectorAll('.counter-val');
  let animated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        counters.forEach(counter => {
          const target = parseInt(counter.getAttribute('data-target'), 10);
          const duration = 2000;
          const stepTime = 30;
          const steps = duration / stepTime;
          const increment = target / steps;
          let current = 0;

          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              counter.textContent = target + (counter.getAttribute('data-suffix') || '');
              clearInterval(timer);
            } else {
              counter.textContent = Math.floor(current) + (counter.getAttribute('data-suffix') || '');
            }
          }, stepTime);
        });
      }
    });
  }, { threshold: 0.3 });

  const statsSection = document.querySelector('.hero-stats-row');
  if (statsSection) observer.observe(statsSection);
}

/* ==========================================================================
   4. TECH STACK FILTER TABS
   ========================================================================== */
function initTechFilter() {
  const filterBtns = document.querySelectorAll('.tech-filter-btn');
  const cards = document.querySelectorAll('.tech-suite-card, .tech-item');

  if (!filterBtns.length || !cards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      cards.forEach(card => {
        const cat = card.getAttribute('data-category') || '';
        if (filter === 'all' || cat.includes(filter)) {
          card.classList.remove('d-none');
        } else {
          card.classList.add('d-none');
        }
      });
    });
  });
}

/* ==========================================================================
   5. INTERACTIVE OFFSHORE ESTIMATOR CALCULATOR
   ========================================================================== */
function initEstimator() {
  const projectBtns = document.querySelectorAll('.calc-opt-project');
  const teamBtns = document.querySelectorAll('.calc-opt-team');
  const timelineBtns = document.querySelectorAll('.calc-opt-timeline');

  let state = {
    project: 'web',      // web, mobile, cloud, ai, squad
    team: 'mid',         // small (1-2), mid (3-5), enterprise (6-10)
    timeline: '3mos'     // mvp (6wks), 3mos, 6mos
  };

  const costRates = {
    web: { baseRate: 3800 },
    mobile: { baseRate: 4200 },
    cloud: { baseRate: 4800 },
    ai: { baseRate: 5400 },
    squad: { baseRate: 4000 }
  };

  const teamMultiplier = {
    small: 1.5,
    mid: 3.5,
    enterprise: 7.5
  };

  const timelineMonths = {
    mvp: 1.5,
    '3mos': 3,
    '6mos': 6
  };

  function updateEstimate() {
    const base = costRates[state.project].baseRate;
    const teamMult = teamMultiplier[state.team];
    const months = timelineMonths[state.timeline];

    const monthlyCost = Math.round(base * teamMult);
    const totalEstimate = Math.round(monthlyCost * months);
    
    // US Domestic comparison (roughly 2.6x to 3x)
    const usDomesticCost = Math.round(totalEstimate * 2.85);
    const savings = usDomesticCost - totalEstimate;
    const savingsPercent = Math.round((savings / usDomesticCost) * 100);

    const estimateEl = document.getElementById('calc-estimate-display');
    const savingsEl = document.getElementById('calc-savings-display');
    const timelineValEl = document.getElementById('calc-timeline-display');
    const velocityEl = document.getElementById('calc-velocity-display');

    if (estimateEl) {
      estimateEl.textContent = `$${(totalEstimate).toLocaleString()}`;
    }
    if (savingsEl) {
      savingsEl.textContent = `Save ~${savingsPercent}% ($${(savings).toLocaleString()} vs US Local Hiring)`;
    }
    if (timelineValEl) {
      timelineValEl.textContent = `${months * 4} Sprints (${months} Months)`;
    }
    if (velocityEl) {
      velocityEl.textContent = state.team === 'small' ? '40-60 Story Pts/mo' : (state.team === 'mid' ? '120-180 Pts/mo' : '280+ Pts/mo');
    }
  }

  function handleOptionSelection(buttons, key) {
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        buttons.forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        state[key] = btn.getAttribute('data-val');
        updateEstimate();
      });
    });
  }

  handleOptionSelection(projectBtns, 'project');
  handleOptionSelection(teamBtns, 'team');
  handleOptionSelection(timelineBtns, 'timeline');

  updateEstimate();

  const claimTrialBtn = document.getElementById('calc-claim-trial-btn');
  if (claimTrialBtn) {
    claimTrialBtn.addEventListener('click', () => {
      const modal = document.getElementById('quote-modal');
      const serviceSelect = document.getElementById('modal-service-select');
      if (serviceSelect) {
        serviceSelect.value = state.project;
      }
      modal?.classList.add('active');
    });
  }
}

/* ==========================================================================
   6. SERVICE DEEP-DIVE MODALS
   ========================================================================== */
const serviceData = {
  'custom-software': {
    title: 'Custom Enterprise Software & Cloud Architectures',
    subtitle: 'Scalable, fault-tolerant enterprise software engineered for high concurrency and resilience.',
    overview: 'Since 2008, Espirit Technologies has engineered complex mission-critical platforms for enterprise clients across banking, logistics, healthcare, and retail. We build high-throughput microservices, API gateways, and distributed systems with zero-trust security.',
    deliverables: [
      'Microservices Architecture & Event-Driven Systems (Kafka / RabbitMQ)',
      'Enterprise APIs (RESTful & GraphQL) with Swagger / OpenAPI Specs',
      'Containerized Orchestration (Docker, Kubernetes, AWS EKS, Azure AKS)',
      'Legacy Modernization: Monolith to Cloud-Native Refactoring',
      'High-Availability Database Design (PostgreSQL, MongoDB, Redis, Snowflake)'
    ],
    tech: ['Java / Spring Boot', '.NET Core', 'Python / FastAPI', 'Node.js', 'AWS / Azure / GCP', 'PostgreSQL', 'Docker / K8s']
  },
  'web-apps': {
    title: 'Modern Web Application Development',
    subtitle: 'Ultra-fast, responsive web applications engineered with Next.js, React, Angular, and robust backends.',
    overview: 'We construct hyper-responsive single-page applications and server-side rendered platforms with sub-second page loads, SEO optimization, and accessible component libraries built for millions of concurrent users.',
    deliverables: [
      'Modern Frontend Architecture (React, Next.js, Angular, Vue 3)',
      'Robust Backend APIs (Node.js, Laravel, Python, PHP 8+)',
      'Design System Implementation & Atomic Components (Tailwind / Storybook)',
      'Progressive Web Apps (PWA) with Offline Synchronization',
      'Performance Optimization achieving 95+ Lighthouse Score'
    ],
    tech: ['React / Next.js', 'Angular', 'TypeScript', 'Node.js / Express', 'PHP / Laravel', 'Tailwind CSS', 'GraphQL']
  },
  'mobile-apps': {
    title: 'Cross-Platform & Native Mobile Engineering',
    subtitle: 'Fluid iOS and Android applications delivering 60fps native performance.',
    overview: 'From enterprise mobile field apps to consumer fintech wallets, we build cross-platform apps using Flutter and React Native as well as high-performance native Swift and Kotlin applications.',
    deliverables: [
      'Cross-Platform Development (Single Codebase Flutter & React Native)',
      'Native iOS (Swift & SwiftUI) & Android (Kotlin & Jetpack Compose)',
      'Offline-First Data Storage (SQLite, Realm, WatermelonDB)',
      'Biometric Authentication, Apple Pay, Google Pay, and Push Notifications',
      'Full App Store & Google Play Release Pipeline with Automated CI/CD'
    ],
    tech: ['Flutter', 'React Native', 'Swift / iOS', 'Kotlin / Android', 'Firebase', 'App Store CI/CD']
  },
  'ai-data': {
    title: 'AI Engineering, LLM Fine-Tuning & Data Annotation',
    subtitle: 'Empowering your digital ecosystem with intelligent machine learning and pristine datasets.',
    overview: 'Espirit Technologies provides end-to-end AI engineering—from fine-tuning domain-specific LLMs and Retrieval-Augmented Generation (RAG) pipelines to enterprise-grade high-precision data labeling and annotation for computer vision and NLP models.',
    deliverables: [
      'Custom LLM Fine-Tuning & Domain-Specific RAG Architectures',
      'High-Precision Data Labeling, Bounding Boxes, & Semantic Segmentation',
      'Audio & Video Annotation for Autonomous Systems and Healthcare AI',
      'Predictive Analytics & Recommendation Engine Modeling',
      'MLOps Pipelines: Automated Training, Model Validation & Drift Detection'
    ],
    tech: ['Python / PyTorch', 'LangChain / LlamaIndex', 'OpenAI / Claude APIs', 'CVAT / Label Studio', 'Pinecone / Milvus', 'MLflow']
  },
  'it-staffing': {
    title: 'Dedicated Offshore Squads & Global IT Staffing',
    subtitle: 'Deploy top 1% senior engineering talent directly into your agile sprints within 48-72 hours.',
    overview: 'Eliminate hiring friction. Espirit delivers pre-vetted, English-fluent senior software engineers, tech leads, QA architects, and DevOps specialists with guaranteed 4-6 hour timezone overlap with US and European business hours.',
    deliverables: [
      'Rapid Onboarding (Interviews within 48 hours, deployment in 1 week)',
      'Direct Jira / GitHub / Slack Integration with your in-house teams',
      '2-Week Risk-Free Trial Sprint: Zero financial obligation if unsatisfied',
      'Flexible Scaling: Upsize or downsize squads on 15 days notice',
      'Complete IP Protection with Bilateral NDAs and SOC2 Compliant Workstations'
    ],
    tech: ['Full Stack Engineers', 'DevOps & SREs', 'Cloud Architects', 'QA Engineers', 'Scrum Masters', 'UI/UX Leads']
  },
  'qa-testing': {
    title: 'Full-Spectrum QA Automation & Security Audits',
    subtitle: 'Zero-defect releases through continuous automated testing and comprehensive vulnerability audits.',
    overview: 'Deliver flawless software with our testing center of excellence. We craft resilient automated test suites, conduct stress and load benchmarking, and perform OWASP Top 10 penetration testing to safeguard your brand.',
    deliverables: [
      'Automated End-to-End Test Frameworks (Cypress, Playwright, Selenium)',
      'API Automation & Contract Testing (Postman, REST-Assured)',
      'Performance, Load, and Stress Testing (JMeter, k6)',
      'Security Penetration Testing & OWASP Vulnerability Assessments',
      'Continuous Testing Integrated into CI/CD Pipelines (GitHub Actions / Jenkins)'
    ],
    tech: ['Playwright', 'Cypress', 'Selenium', 'JMeter', 'k6', 'OWASP ZAP', 'Postman']
  },
  'ui-ux': {
    title: 'UI/UX Strategy & Digital Product Design',
    subtitle: 'Human-centric user experiences engineered to drive engagement and conversion.',
    overview: 'We transform complex enterprise workflows into intuitive, elegant digital interfaces. Our design process combines rigorous user research, wireframing, interactive Figma prototypes, and living design systems.',
    deliverables: [
      'User Journey Mapping & Information Architecture',
      'High-Fidelity Interactive Prototypes in Figma',
      'Comprehensive Design Systems with Tokens for Engineering Hand-off',
      'Usability Testing & Accessibility Compliance (WCAG 2.1 AA)',
      'Conversion Rate Optimization (CRO) & Micro-Interactions'
    ],
    tech: ['Figma', 'FigJam', 'Adobe Creative Cloud', 'Storybook', 'WCAG 2.1', 'Lottie Animations']
  },
  'devops-cloud': {
    title: 'DevOps, Kubernetes & 24/7 Managed Cloud Support',
    subtitle: 'Automate deployments, optimize cloud expenditures, and achieve 99.99% infrastructure uptime.',
    overview: 'Modernize your infrastructure with cloud-native DevOps. We construct automated CI/CD pipelines, implement Infrastructure as Code (Terraform), and provide round-the-clock 24/7 SRE monitoring and incident response.',
    deliverables: [
      'Infrastructure as Code (Terraform, AWS CloudFormation, Pulumi)',
      'CI/CD Pipeline Engineering (GitHub Actions, GitLab CI, ArgoCD)',
      'Kubernetes Cluster Architecture, Service Mesh & Auto-scaling',
      'Cloud FinOps: Average 30-45% Reduction in AWS / Azure Billing',
      '24/7/365 SRE Monitoring, Alerting (Datadog, Prometheus, Grafana), & SLAs'
    ],
    tech: ['AWS / Azure / GCP', 'Kubernetes / Docker', 'Terraform', 'GitHub Actions', 'Prometheus / Grafana', 'Datadog']
  }
};

function initServiceModals() {
  const serviceCards = document.querySelectorAll('.service-card[data-service]');
  const modal = document.getElementById('service-detail-modal');

  serviceCards.forEach(card => {
    card.addEventListener('click', () => {
      const serviceKey = card.getAttribute('data-service');
      const data = serviceData[serviceKey];
      if (!data || !modal) return;

      document.getElementById('service-modal-title').textContent = data.title;
      document.getElementById('service-modal-subtitle').textContent = data.subtitle;
      document.getElementById('service-modal-overview').textContent = data.overview;

      const deliverablesList = document.getElementById('service-modal-deliverables');
      deliverablesList.innerHTML = '';
      data.deliverables.forEach(item => {
        const li = document.createElement('li');
        li.innerHTML = `<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" style="color:var(--accent-emerald);margin-right:8px;vertical-align:middle;"><polyline points="20 6 9 17 4 12"></polyline></svg>${item}`;
        deliverablesList.appendChild(li);
      });

      const techContainer = document.getElementById('service-modal-tech');
      techContainer.innerHTML = '';
      data.tech.forEach(t => {
        const span = document.createElement('span');
        span.className = 'service-tag';
        span.textContent = t;
        techContainer.appendChild(span);
      });

      modal.classList.add('active');
    });
  });
}

/* ==========================================================================
   7. TESTIMONIALS SLIDER
   ========================================================================== */
function initTestimonials() {
  const slides = document.querySelectorAll('.testimonial-card');
  const dots = document.querySelectorAll('.test-dot');
  const prevBtn = document.querySelector('.test-prev');
  const nextBtn = document.querySelector('.test-next');

  if (!slides.length) return;
  let currentIndex = 0;
  let autoTimer = null;

  function showSlide(index) {
    slides.forEach(s => s.classList.remove('active'));
    dots.forEach(d => d.classList.remove('active'));

    currentIndex = (index + slides.length) % slides.length;
    slides[currentIndex].classList.add('active');
    if (dots[currentIndex]) dots[currentIndex].classList.add('active');
  }

  function startAutoSlide() {
    autoTimer = setInterval(() => {
      showSlide(currentIndex + 1);
    }, 7000);
  }

  function resetAutoSlide() {
    clearInterval(autoTimer);
    startAutoSlide();
  }

  prevBtn?.addEventListener('click', () => {
    showSlide(currentIndex - 1);
    resetAutoSlide();
  });

  nextBtn?.addEventListener('click', () => {
    showSlide(currentIndex + 1);
    resetAutoSlide();
  });

  dots.forEach((dot, idx) => {
    dot.addEventListener('click', () => {
      showSlide(idx);
      resetAutoSlide();
    });
  });

  startAutoSlide();
}

/* ==========================================================================
   8. INTERACTIVE FAQ ACCORDION
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      faqItems.forEach(other => {
        other.classList.remove('active');
        const otherAns = other.querySelector('.faq-answer');
        if (otherAns) otherAns.style.maxHeight = null;
      });

      if (!isActive) {
        item.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 30 + 'px';
      }
    });
  });
}

/* ==========================================================================
   9. MODALS MANAGEMENT
   ========================================================================== */
function initModals() {
  const openModalBtns = document.querySelectorAll('[data-open-modal]');
  const closeBtns = document.querySelectorAll('.modal-close-btn, [data-close-modal]');
  const overlays = document.querySelectorAll('.modal-overlay');

  openModalBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const modalId = btn.getAttribute('data-open-modal');
      const target = document.getElementById(modalId);
      if (target) target.classList.add('active');
    });
  });

  closeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      overlays.forEach(o => o.classList.remove('active'));
    });
  });

  overlays.forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.classList.remove('active');
      }
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      overlays.forEach(o => o.classList.remove('active'));
      document.querySelector('.mobile-nav-drawer')?.classList.remove('active');
    }
  });
}

/* ==========================================================================
   10. FORMS & RFP LEAD CAPTURE
   ========================================================================== */
function initForms() {
  const contactForms = document.querySelectorAll('.ajax-contact-form');

  contactForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;

      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg class="spinner" width="20" height="20" viewBox="0 0 50 50" style="animation:spin 1s linear infinite;vertical-align:middle;margin-right:8px;">
          <circle cx="25" cy="25" r="20" fill="none" stroke="currentColor" stroke-width="5" stroke-dasharray="31.4 31.4"></circle>
        </svg> Submitting Proposal...
      `;

      // Mock API latency
      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        form.reset();

        // Close active modal if form was inside one
        document.querySelectorAll('.modal-overlay').forEach(o => o.classList.remove('active'));

        showToast('Thank you! Your inquiry has been submitted. Our Senior Solutions Architect will contact you within 4 hours.');
      }, 1200);
    });
  });
}

function showToast(message) {
  let toast = document.querySelector('.toast-msg');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast-msg';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `
    <svg width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" style="color:var(--accent-emerald);">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
    <span>${message}</span>
  `;

  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 5000);
}

/* ==========================================================================
   11. SCROLL REVEAL OBSERVER
   ========================================================================== */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  
  // Immediately reveal elements visible in or near the initial viewport
  reveals.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight + 50) {
      el.classList.add('active');
    }
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, { threshold: 0.1 });

  reveals.forEach(el => observer.observe(el));
}

/* ==========================================================================
   12. 3D CARD SPOTLIGHT HOVER EFFECT
   ========================================================================== */
function initCardSpotlight() {
  const cards = document.querySelectorAll('.glass-card, .service-card, .tech-item, .team-card, .blog-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });
}

/* ==========================================================================
   13. BLOG FILTER & MODAL READER
   ========================================================================== */
function initBlogFilter() {
  const filterBtns = document.querySelectorAll('.blog-filter-btn');
  const blogCards = document.querySelectorAll('.blog-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      blogCards.forEach(card => {
        const cat = card.getAttribute('data-category') || '';
        if (filter === 'all' || cat.includes(filter)) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.35s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

function initBlogModals() {
  const blogCards = document.querySelectorAll('.blog-card');
  blogCards.forEach(card => {
    card.style.cursor = 'pointer';
    card.addEventListener('click', (e) => {
      // If clicked on an explicit anchor, let it navigate naturally
      if (e.target.tagName.toLowerCase() === 'a') return;
      
      const blogId = card.getAttribute('data-blog-id') || '1';
      window.location.href = `blog-details.html?id=${blogId}`;
    });
  });
}

