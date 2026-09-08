/**
 * VEDALAKSHMI B S - DEVELOPER PORTFOLIO JAVASCRIPT
 * Engineered for high responsiveness, smooth accessibility, and interactive polish.
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initCanvasBackground();
  initNavigation();
  initTypewriter();
  initSkillsFilter();
  initProjectModal();
  initClipboardButtons();
  initContactForm();
  initScrollReveal();
});

/* --------------------------------------------------------------------------
   1. Theme Switcher (Dark Mode by Default)
   -------------------------------------------------------------------------- */
function initTheme() {
  const themeToggleBtn = document.getElementById('theme-toggle');
  const storedTheme = localStorage.getItem('veda-portfolio-theme') || 'dark';

  document.documentElement.setAttribute('data-theme', storedTheme);
  updateThemeIcon(storedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('veda-portfolio-theme', newTheme);
      updateThemeIcon(newTheme);
      window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme: newTheme } }));
    });
  }
}

function updateThemeIcon(theme) {
  const themeToggleBtn = document.getElementById('theme-toggle');
  if (!themeToggleBtn) return;
  if (theme === 'light') {
    themeToggleBtn.innerHTML = `
      <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true">
        <path stroke-linecap="round" stroke-linejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
      </svg>
    `;
    themeToggleBtn.setAttribute('aria-label', 'Switch to dark theme');
  } else {
    themeToggleBtn.innerHTML = `
      <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="5"/>
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
      </svg>
    `;
    themeToggleBtn.setAttribute('aria-label', 'Switch to light theme');
  }
}

/* --------------------------------------------------------------------------
   2. Subtle Interactive Canvas Background (Constellation Effect)
   -------------------------------------------------------------------------- */
function initCanvasBackground() {
  const canvas = document.getElementById('canvas-bg');
  if (!canvas) return;

  // Check reduced motion preference
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    canvas.style.display = 'none';
    return;
  }

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particleCount = Math.min(Math.floor((width * height) / 22000), 55);
  const particles = [];

  let mouse = { x: null, y: null, maxDist: 120 };
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });
  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.45;
      this.vy = (Math.random() - 0.5) * 0.45;
      this.radius = Math.random() * 1.5 + 1;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      // Mouse influence
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.maxDist) {
          const force = (mouse.maxDist - dist) / mouse.maxDist;
          this.x -= (dx / dist) * force * 1.2;
          this.y -= (dy / dist) * force * 1.2;
        }
      }
    }
    draw(isDark) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = isDark ? 'rgba(56, 189, 248, 0.45)' : 'rgba(2, 132, 199, 0.4)';
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw(isDark);

      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 95) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          const alpha = (1 - dist / 95) * (isDark ? 0.18 : 0.12);
          ctx.strokeStyle = isDark ? `rgba(56, 189, 248, ${alpha})` : `rgba(2, 132, 199, ${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);
}

/* --------------------------------------------------------------------------
   3. Sticky Navigation, Scroll Spy & Mobile Menu
   -------------------------------------------------------------------------- */
function initNavigation() {
  const hamburger = document.getElementById('hamburger-btn');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  // Hamburger Toggle
  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      hamburger.classList.toggle('active', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen);
    });

    // Close on navigation click
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
        navMenu.classList.remove('open');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('open')) {
        navMenu.classList.remove('open');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.focus();
      }
    });
  }

  // Active section scroll spy
  function updateActiveLink() {
    const scrollY = window.pageYOffset;
    sections.forEach((section) => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 110;
      const sectionId = section.getAttribute('id');
      const targetLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

      if (targetLink) {
        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
          navLinks.forEach((l) => l.classList.remove('active'));
          targetLink.classList.add('active');
        }
      }
    });
  }

  window.addEventListener('scroll', updateActiveLink, { passive: true });
  updateActiveLink();
}

/* --------------------------------------------------------------------------
   4. Hero Typewriter Effect
   -------------------------------------------------------------------------- */
function initTypewriter() {
  const typedSpan = document.getElementById('typed-text');
  if (!typedSpan) return;

  const roles = [
    'Computer Science Student',
    'Full-Stack Web Developer',
    'UI Development Intern',
    'Assistive Tech Builder',
    'Problem Solver & Programmer'
  ];

  let roleIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  let typingSpeed = 90;

  function type() {
    const currentRole = roles[roleIdx];

    if (isDeleting) {
      typedSpan.textContent = currentRole.substring(0, charIdx - 1);
      charIdx--;
      typingSpeed = 45;
    } else {
      typedSpan.textContent = currentRole.substring(0, charIdx + 1);
      charIdx++;
      typingSpeed = 90;
    }

    if (!isDeleting && charIdx === currentRole.length) {
      typingSpeed = 1800; // Pause at completion
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
      typingSpeed = 400; // Pause before next word
    }

    setTimeout(type, typingSpeed);
  }

  setTimeout(type, 600);
}

/* --------------------------------------------------------------------------
   5. Interactive Technical Skills Filter
   -------------------------------------------------------------------------- */
function initSkillsFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const skillCards = document.querySelectorAll('.skill-card');

  if (!filterBtns.length || !skillCards.length) return;

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      skillCards.forEach((card) => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   6. Project Deep Dive Modal System
   -------------------------------------------------------------------------- */
const projectData = {
  ktu: {
    title: 'KTU Activity Point Calculator Portal',
    category: 'Full-Stack Web Portal · Academic Graduation Workflow',
    overview: 'A robust web portal built to automate and streamline the calculation and auditing of APJ Abdul Kalam Technological University (KTU) activity points required for engineering students.',
    features: [
      'Developed responsive multi-tier interfaces tailored for Student, Teacher, and Administrative users.',
      'Dynamic dashboard layouts and student document upload modules with validation rules.',
      'Backend routing and calculation services created with Node.js and Express.',
      'Version controlled with Git/GitHub and continuously deployed for fast accessibility via Vercel.',
      'Mobile-first responsive UX crafted with React components and custom CSS.'
    ],
    tech: ['React', 'Node.js', 'Express.js', 'HTML5', 'CSS3', 'Git', 'Vercel'],
    demoUrl: 'https://clawhub.ai/veda1823/veda-greetings',
    repoUrl: 'https://github.com/veda1823'
  },
  sign: {
    title: 'Sign Language Detector',
    category: 'Computer Vision & Assistive AI System',
    overview: 'An intelligent assistive computer vision application designed to empower individuals with speech and hearing impairments by converting hand gestures into audible speech.',
    features: [
      'Real-time hand gesture recognition processing live camera frames via OpenCV.',
      'High-precision 21 3D hand landmark tracking powered by Google MediaPipe.',
      'Integrated text-to-speech (TTS) synthesis engine that articulates recognized gestures out loud.',
      'Optimized frame latency for immediate feedback and intuitive human-computer interaction.'
    ],
    tech: ['Python', 'OpenCV', 'MediaPipe', 'Text-to-Speech (TTS)', 'NumPy'],
    demoUrl: null,
    repoUrl: 'https://github.com/veda1823'
  },
  hostel: {
    title: 'Hostel Allocator & Management System',
    category: 'Relational Database Management System',
    overview: 'A complete institutional hostel administration database solution for student registration, room allotment algorithms, and real-time occupancy monitoring.',
    features: [
      'Engineered normalized relational database schema in MySQL preventing room over-allocation and conflicts.',
      'Automated room allocation logic matching student preferences and room availability.',
      'Comprehensive administrative dashboard monitoring room occupancy, block capacity, and student records.',
      'Built with strong transactional integrity (ACID properties) and optimized SQL queries.'
    ],
    tech: ['SQL', 'MySQL', 'DBMS', 'Relational Schemas', 'Query Optimization'],
    demoUrl: null,
    repoUrl: 'https://github.com/veda1823'
  },
  workspace: {
    title: 'Team Workspace Manager',
    category: 'Collaborative Web Application',
    overview: 'A productivity platform engineered for distributed developer teams to coordinate tasks, assign workspaces, and track project status in real-time.',
    features: [
      'Interactive workspace boards for task prioritization and delegation.',
      'Dynamic state management with vanilla JavaScript and responsive DOM rendering.',
      'Clean modular code architecture designed for collaborative teamwork workflows.'
    ],
    tech: ['JavaScript', 'HTML5', 'CSS3', 'DOM APIs', 'Git'],
    demoUrl: null,
    repoUrl: 'https://github.com/veda1823/Team-Workspace-Manager'
  },
  movie: {
    title: 'Movie Ticket Booking System',
    category: 'Backend Architecture & Transactional API',
    overview: 'A scalable backend system supporting cinema ticketing operations, showtime scheduling, and real-time seat reservation locks.',
    features: [
      'Architected RESTful endpoints for theater listings, movies, and schedule browsing.',
      'Transactional seat-locking mechanism preventing duplicate bookings during checkout.',
      'Robust error handling and validation middleware for request reliability.'
    ],
    tech: ['JavaScript', 'Node.js', 'Express.js', 'REST APIs', 'Backend Architecture'],
    demoUrl: null,
    repoUrl: 'https://github.com/veda1823/Movie-Ticket-Booking-System'
  },
  course: {
    title: 'Course Selling Platform',
    category: 'E-Learning Web Application',
    overview: 'A web platform for exploring, enrolling, and purchasing structured educational courses with user authorization and catalog browsing.',
    features: [
      'Interactive course catalog with rich course metadata, curricula, and filtering.',
      'User authentication and role separation for instructors and students.',
      'Clean checkout workflow and enrollment dashboard.'
    ],
    tech: ['JavaScript', 'Node.js', 'Full-Stack Architecture', 'CSS3', 'REST APIs'],
    demoUrl: null,
    repoUrl: 'https://github.com/veda1823/course-selling-application'
  }
};

function initProjectModal() {
  const modalBackdrop = document.getElementById('project-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const detailButtons = document.querySelectorAll('[data-project-id]');

  if (!modalBackdrop) return;

  function openModal(projectId) {
    const data = projectData[projectId];
    if (!data) return;

    document.getElementById('modal-title').textContent = data.title;
    document.getElementById('modal-category').textContent = data.category;
    document.getElementById('modal-overview').textContent = data.overview;

    const featureList = document.getElementById('modal-features');
    featureList.innerHTML = '';
    data.features.forEach((feat) => {
      const li = document.createElement('li');
      li.textContent = feat;
      featureList.appendChild(li);
    });

    const techTags = document.getElementById('modal-tech-tags');
    techTags.innerHTML = '';
    data.tech.forEach((t) => {
      const span = document.createElement('span');
      span.className = 'tech-tag';
      span.textContent = t;
      techTags.appendChild(span);
    });

    const actionsContainer = document.getElementById('modal-actions');
    actionsContainer.innerHTML = '';

    if (data.demoUrl) {
      const demoBtn = document.createElement('a');
      demoBtn.href = data.demoUrl;
      demoBtn.target = '_blank';
      demoBtn.rel = 'noopener noreferrer';
      demoBtn.className = 'btn-project-link';
      demoBtn.innerHTML = `
        <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"/></svg>
        Live Demo
      `;
      actionsContainer.appendChild(demoBtn);
    }

    if (data.repoUrl) {
      const repoBtn = document.createElement('a');
      repoBtn.href = data.repoUrl;
      repoBtn.target = '_blank';
      repoBtn.rel = 'noopener noreferrer';
      repoBtn.className = 'btn-project-link';
      repoBtn.innerHTML = `
        <svg width="14" height="14" fill="currentColor" viewBox="0 0 16 16"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/></svg>
        GitHub Code
      `;
      actionsContainer.appendChild(repoBtn);
    }

    modalBackdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modalBackdrop.classList.remove('open');
    document.body.style.overflow = '';
  }

  detailButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const pId = btn.getAttribute('data-project-id');
      openModal(pId);
    });
  });

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeModal);
  }

  modalBackdrop.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalBackdrop.classList.contains('open')) {
      closeModal();
    }
  });
}

/* --------------------------------------------------------------------------
   7. Copy to Clipboard with Toast Notification
   -------------------------------------------------------------------------- */
function showToast(message) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `
    <svg width="18" height="18" fill="none" stroke="#10b981" stroke-width="2.5" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
    </svg>
    <span>${message}</span>
  `;

  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 2800);
}

function initClipboardButtons() {
  const copyButtons = document.querySelectorAll('[data-copy]');
  copyButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const textToCopy = btn.getAttribute('data-copy');
      if (!textToCopy) return;

      navigator.clipboard.writeText(textToCopy).then(() => {
        showToast(`Copied to clipboard: ${textToCopy}`);
      }).catch(() => {
        // Fallback
        const textarea = document.createElement('textarea');
        textarea.value = textToCopy;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showToast(`Copied to clipboard: ${textToCopy}`);
      });
    });
  });
}

/* --------------------------------------------------------------------------
   8. Contact Form Handling
   -------------------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameInput = document.getElementById('contact-name');
    const emailInput = document.getElementById('contact-email');
    const subjectInput = document.getElementById('contact-subject');
    const messageInput = document.getElementById('contact-message');

    const name = nameInput ? nameInput.value.trim() : '';
    const email = emailInput ? emailInput.value.trim() : '';
    const subject = subjectInput ? subjectInput.value.trim() : 'Portfolio Inquiry';
    const message = messageInput ? messageInput.value.trim() : '';

    if (!name || !email || !message) {
      showToast('Please fill in all required fields.');
      return;
    }

    // Construct mailto link
    const mailtoUrl = `mailto:vedalakshmi777@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    )}`;

    // Show toast and open default mail client
    showToast('Launching your email client to send message...');
    window.location.href = mailtoUrl;

    form.reset();
  });
}

/* --------------------------------------------------------------------------
   9. Scroll Reveal Animations via Intersection Observer
   -------------------------------------------------------------------------- */
function initScrollReveal() {
  const revealElements = document.querySelectorAll(
    '.highlight-card, .edu-card, .skill-card, .experience-card, .project-card, .cert-card, .achievement-card'
  );

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  revealElements.forEach((el) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(16px)';
    el.style.transition = 'opacity 0.4s ease-out, transform 0.4s ease-out';
    observer.observe(el);
  });
}
