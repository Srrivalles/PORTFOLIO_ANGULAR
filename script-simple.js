/**
 * PORTFÓLIO MODERNO - VERSÃO 2.0
 * Com Parallax, Animações Sofisticadas e Efeitos Avançados
 */

class Portfolio {
  constructor() {
    this.navbar = document.querySelector('.navbar');
    this.menuToggle = document.querySelector('.menu-toggle');
    this.navLinks = document.querySelector('.nav-links');
    this.backToTop = document.getElementById('back-to-top');
    
    this.init();
  }

  init() {
    this.setupNavbar();
    this.setupMobileMenu();
    this.setupBackToTop();
    this.setupVideoModals();
    this.setupSmoothScroll();
    this.setupProjectFilter();
    this.setupTypewriter();
    this.setupThemeToggle();
    this.setupParallax();
  }

  // === NAVBAR ===
  setupNavbar() {
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
      const currentScroll = window.scrollY;
      
      if (currentScroll > 50) {
        this.navbar.classList.add('scrolled');
      } else {
        this.navbar.classList.remove('scrolled');
      }
      
      lastScroll = currentScroll;
    });
  }

  // === MENU MOBILE ===
  setupMobileMenu() {
    if (!this.menuToggle || !this.navLinks) return;
    
    this.menuToggle.addEventListener('click', () => {
      this.navLinks.classList.toggle('active');
    });
    
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        this.navLinks.classList.remove('active');
      });
    });
    
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.navbar')) {
        this.navLinks.classList.remove('active');
      }
    });
  }

  // === BACK TO TOP ===
  setupBackToTop() {
    if (!this.backToTop) return;
    
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        this.backToTop.classList.add('visible');
      } else {
        this.backToTop.classList.remove('visible');
      }
    });
    
    this.backToTop.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // === VIDEO MODALS ===
  setupVideoModals() {
    const previewButtons = document.querySelectorAll('.preview-button');
    
    previewButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        const videoSrc = button.getAttribute('data-video');
        this.openVideoModal(videoSrc);
      });
    });
  }

  openVideoModal(videoSrc) {
    const existingModal = document.querySelector('.video-modal-overlay');
    if (existingModal) existingModal.remove();
    
    const modal = document.createElement('div');
    modal.className = 'video-modal-overlay';
    modal.innerHTML = `
      <div class="video-modal-content">
        <video controls autoplay>
          <source src="${videoSrc}" type="video/mp4">
          Seu navegador não suporta vídeo.
        </video>
        <button class="close-button" aria-label="Fechar">&times;</button>
      </div>
    `;
    
    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('active'), 10);
    document.body.style.overflow = 'hidden';
    
    const closeBtn = modal.querySelector('.close-button');
    closeBtn.addEventListener('click', () => this.closeVideoModal(modal));
    
    modal.addEventListener('click', (e) => {
      if (e.target === modal) this.closeVideoModal(modal);
    });
    
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        this.closeVideoModal(modal);
        document.removeEventListener('keydown', handleEsc);
      }
    };
    document.addEventListener('keydown', handleEsc);
  }

  closeVideoModal(modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
    setTimeout(() => modal.remove(), 300);
  }

  // === SMOOTH SCROLL APRIMORADO ===
  setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        
        if (href === '#' || href === '#!') return;
        
        e.preventDefault();
        const target = document.querySelector(href);
        
        if (target) {
          const targetPosition = target.offsetTop - 80;
          const startPosition = window.pageYOffset;
          const distance = targetPosition - startPosition;
          const duration = 1000;
          let start = null;
          
          // Easing personalizado
          const easeInOutCubic = (t) => {
            return t < 0.5 
              ? 4 * t * t * t 
              : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
          };
          
          const animation = (currentTime) => {
            if (start === null) start = currentTime;
            const timeElapsed = currentTime - start;
            const progress = Math.min(timeElapsed / duration, 1);
            const ease = easeInOutCubic(progress);
            
            window.scrollTo(0, startPosition + distance * ease);
            
            if (timeElapsed < duration) {
              requestAnimationFrame(animation);
            }
          };
          
          requestAnimationFrame(animation);
        }
      });
    });
  }

  // === FILTRO DE PROJETOS ===
  setupProjectFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const filter = btn.getAttribute('data-filter');
        
        projectCards.forEach((card, index) => {
          const category = card.getAttribute('data-category');
          
          if (filter === 'all' || category === filter) {
            // Animação de entrada com delay
            setTimeout(() => {
              card.style.display = 'block';
              setTimeout(() => card.classList.add('revealed'), 10);
            }, index * 100);
          } else {
            card.classList.remove('revealed');
            setTimeout(() => {
              card.style.display = 'none';
            }, 300);
          }
        });
      });
    });
  }

  // === TYPEWRITER APRIMORADO ===
  setupTypewriter() {
    const title = document.getElementById('typewriter-title');
    if (!title) return;
    
    const text = title.textContent;
    title.textContent = '';
    title.style.display = 'inline-block';
    
    let i = 0;
    let isDeleting = false;
    
    const typeWriter = () => {
      if (!isDeleting && i < text.length) {
        title.textContent += text.charAt(i);
        i++;
        setTimeout(typeWriter, 80 + Math.random() * 40);
      } else if (i === text.length) {
        // Mantém o texto completo
        return;
      }
    };
    
    // Inicia após um delay
    setTimeout(typeWriter, 500);
  }

  // === THEME TOGGLE ===
  setupThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return;
    
    // Verifica preferência do sistema
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Tenta carregar do localStorage, senão usa preferência do sistema
    let savedTheme;
    try {
      savedTheme = localStorage.getItem('theme');
    } catch (e) {
      savedTheme = null;
    }
    
    const theme = savedTheme || (prefersDark ? 'dark' : 'light');
    
    if (theme === 'light') {
      document.body.classList.add('light-mode');
      themeToggle.checked = true;
    }
    
    themeToggle.addEventListener('change', () => {
      document.body.classList.toggle('light-mode');
      const isLight = document.body.classList.contains('light-mode');
      
      try {
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
      } catch (e) {
        console.log('LocalStorage não disponível');
      }
    });
  }

  // === PARALLAX EFFECT ===
  setupParallax() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
    let ticking = false;
    
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrolled = window.pageYOffset;
          
          // Parallax no background do hero
          const parallaxBg = hero.querySelector('::before');
          if (hero) {
            hero.style.backgroundPosition = `center ${scrolled * 0.3}px`;
          }
          
          // Parallax nas partículas
          const particles = document.querySelectorAll('.particle');
          particles.forEach((particle, index) => {
            const speed = 0.1 + (index * 0.05);
            const yPos = -(scrolled * speed);
            particle.style.transform = `translateY(${yPos}px)`;
          });
          
          ticking = false;
        });
        
        ticking = true;
      }
    });
  }
}

// === SCROLL REVEAL APRIMORADO ===
class ScrollReveal {
  constructor() {
    this.elements = document.querySelectorAll('.reveal');
    this.init();
  }

  init() {
    if (!this.elements.length) return;
    
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          // Delay cascata para elementos na mesma seção
          const section = entry.target.closest('.section');
          const elementsInSection = section ? 
            Array.from(section.querySelectorAll('.reveal')) : [];
          const indexInSection = elementsInSection.indexOf(entry.target);
          
          setTimeout(() => {
            entry.target.classList.add('revealed');
          }, indexInSection * 100);
          
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);
    
    this.elements.forEach(el => observer.observe(el));
  }
}

// === CARROSSEL DE IMAGENS APRIMORADO ===
class ImageCarousel {
  constructor() {
    this.carousels = document.querySelectorAll('.carousel-container');
    this.intervals = new Map();
    this.init();
  }

  init() {
    this.carousels.forEach((carousel) => {
      const images = carousel.querySelectorAll('.carousel-image');
      const indicators = carousel.querySelectorAll('.indicator');
      
      if (images.length === 0) return;
      
      let currentIndex = 0;
      let isHovering = false;
      
      const changeImage = (newIndex) => {
        images.forEach(img => img.classList.remove('active'));
        indicators.forEach(ind => ind.classList.remove('active'));
        
        images[newIndex].classList.add('active');
        indicators[newIndex].classList.add('active');
        
        currentIndex = newIndex;
      };
      
      // Auto-rotate
      const startAutoRotate = () => {
        const intervalId = setInterval(() => {
          if (!isHovering) {
            const nextIndex = (currentIndex + 1) % images.length;
            changeImage(nextIndex);
          }
        }, 10000);
        
        this.intervals.set(carousel, intervalId);
      };
      
      startAutoRotate();
      
      // Click nos indicadores
      indicators.forEach((indicator, idx) => {
        indicator.addEventListener('click', () => {
          clearInterval(this.intervals.get(carousel));
          changeImage(idx);
          
          if (!isHovering) {
            startAutoRotate();
          }
        });
      });
      
      // Pausa/Resume no hover
      carousel.addEventListener('mouseenter', () => {
        isHovering = true;
      });
      
      carousel.addEventListener('mouseleave', () => {
        isHovering = false;
      });
    });
  }
  
  destroy() {
    this.intervals.forEach(interval => clearInterval(interval));
    this.intervals.clear();
  }
}

// === CURSOR CUSTOMIZADO (OPCIONAL) ===
class CustomCursor {
  constructor() {
    this.cursor = null;
    this.init();
  }

  init() {
    // Cria o cursor apenas em desktop
    if (window.innerWidth < 768) return;
    
    this.cursor = document.createElement('div');
    this.cursor.className = 'custom-cursor';
    this.cursor.style.cssText = `
      position: fixed;
      width: 20px;
      height: 20px;
      border: 2px solid var(--clr-accent);
      border-radius: 50%;
      pointer-events: none;
      z-index: 9999;
      transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      mix-blend-mode: difference;
      display: none;
    `;
    
    document.body.appendChild(this.cursor);
    
    document.addEventListener('mousemove', (e) => {
      this.cursor.style.display = 'block';
      this.cursor.style.left = e.clientX - 10 + 'px';
      this.cursor.style.top = e.clientY - 10 + 'px';
    });
    
    // Efeito em elementos clicáveis
    const clickables = document.querySelectorAll('a, button, .btn');
    clickables.forEach(el => {
      el.addEventListener('mouseenter', () => {
        this.cursor.style.transform = 'scale(2)';
        this.cursor.style.borderColor = 'var(--clr-accent-alt)';
      });
      
      el.addEventListener('mouseleave', () => {
        this.cursor.style.transform = 'scale(1)';
        this.cursor.style.borderColor = 'var(--clr-accent)';
      });
    });
  }
}

// === INICIALIZAÇÃO ===
document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 Portfólio v2.0 carregado!');
  
  new Portfolio();
  new ScrollReveal();
  new ImageCarousel();
  
  // Cursor customizado (opcional - descomente para ativar)
  // new CustomCursor();
  
  // Animação inicial dos cards
  setTimeout(() => {
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach((card, index) => {
      setTimeout(() => {
        card.classList.add('revealed');
      }, index * 100);
    });
  }, 500);
});

// === PERFORMANCE ===
if ('fonts' in document) {
  Promise.all([
    document.fonts.load('700 1em Space Grotesk'),
    document.fonts.load('400 1em Inter')
  ]).then(() => {
    document.body.classList.add('fonts-loaded');
  });
}

// Lazy loading de imagens
if ('loading' in HTMLImageElement.prototype) {
  const images = document.querySelectorAll('img[loading="lazy"]');
  images.forEach(img => {
    if (img.dataset.src) {
      img.src = img.dataset.src;
    }
  });
} else {
  const script = document.createElement('script');
  script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
  document.body.appendChild(script);
}

// Prevent Flash of Unstyled Content
document.documentElement.style.visibility = 'visible';
