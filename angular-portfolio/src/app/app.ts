import { AfterViewInit, Component, CUSTOM_ELEMENTS_SCHEMA, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-root',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements AfterViewInit, OnDestroy {
  private cleanupFns: Array<() => void> = [];
  private carouselIntervals: number[] = [];
  private intersectionObserver?: IntersectionObserver;

  ngAfterViewInit(): void {
    this.setupNavbar();
    this.setupMobileMenu();
    this.setupBackToTop();
    this.setupSmoothScroll();
    this.setupProjectFilter();
    this.setupThemeToggle();
    this.setupParallax();
    this.setupScrollReveal();
    this.setupImageCarousel();

    // Animação inicial dos cards (como no JS original)
    window.setTimeout(() => {
      const projectCards = document.querySelectorAll<HTMLElement>('.project-card');
      projectCards.forEach((card, index) => {
        window.setTimeout(() => card.classList.add('revealed'), index * 100);
      });
    }, 500);
  }

  ngOnDestroy(): void {
    this.cleanupFns.forEach(fn => fn());
    this.cleanupFns = [];

    this.carouselIntervals.forEach(id => window.clearInterval(id));
    this.carouselIntervals = [];

    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
      this.intersectionObserver = undefined;
    }
  }

  private onWindow(event: keyof WindowEventMap, handler: (e: Event) => void): void {
    window.addEventListener(event, handler);
    this.cleanupFns.push(() => window.removeEventListener(event, handler));
  }

  private onDocument(event: keyof DocumentEventMap, handler: (e: Event) => void): void {
    document.addEventListener(event, handler);
    this.cleanupFns.push(() => document.removeEventListener(event, handler));
  }

  private setupNavbar(): void {
    const navbar = document.querySelector<HTMLElement>('.navbar');
    if (!navbar) return;

    const onScroll = () => {
      if (window.scrollY > 50) navbar.classList.add('scrolled');
      else navbar.classList.remove('scrolled');
    };

    this.onWindow('scroll', onScroll);
    onScroll();
  }

  private setupMobileMenu(): void {
    const menuToggle = document.querySelector<HTMLElement>('.menu-toggle');
    const navLinks = document.querySelector<HTMLElement>('.nav-links');
    if (!menuToggle || !navLinks) return;

    const onToggle = () => navLinks.classList.toggle('active');
    menuToggle.addEventListener('click', onToggle);
    this.cleanupFns.push(() => menuToggle.removeEventListener('click', onToggle));

    const links = document.querySelectorAll<HTMLElement>('.nav-link');
    links.forEach(link => {
      const onClick = () => navLinks.classList.remove('active');
      link.addEventListener('click', onClick);
      this.cleanupFns.push(() => link.removeEventListener('click', onClick));
    });

    const onDocClick = (e: Event) => {
      const target = e.target as HTMLElement | null;
      if (!target?.closest('.navbar')) navLinks.classList.remove('active');
    };
    this.onDocument('click', onDocClick);
  }

  private setupBackToTop(): void {
    const backToTop = document.getElementById('back-to-top');
    if (!backToTop) return;

    const onScroll = () => {
      if (window.scrollY > 300) backToTop.classList.add('visible');
      else backToTop.classList.remove('visible');
    };
    this.onWindow('scroll', onScroll);
    onScroll();

    const onClick = () => window.scrollTo({ top: 0, behavior: 'smooth' });
    backToTop.addEventListener('click', onClick);
    this.cleanupFns.push(() => backToTop.removeEventListener('click', onClick));
  }

  private setupSmoothScroll(): void {
    const anchors = document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]');
    anchors.forEach(anchor => {
      const handler = (e: Event) => {
        const href = anchor.getAttribute('href');
        if (!href || href === '#' || href === '#!') return;

        const target = document.querySelector<HTMLElement>(href);
        if (!target) return;

        e.preventDefault();
        const targetPosition = target.offsetTop - 80;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        const duration = 1000;

        const easeInOutCubic = (t: number) =>
          t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;

        let start: number | null = null;
        const animation = (currentTime: number) => {
          if (start === null) start = currentTime;
          const timeElapsed = currentTime - start;
          const progress = Math.min(timeElapsed / duration, 1);
          const ease = easeInOutCubic(progress);

          window.scrollTo(0, startPosition + distance * ease);
          if (timeElapsed < duration) requestAnimationFrame(animation);
        };

        requestAnimationFrame(animation);
      };

      anchor.addEventListener('click', handler);
      this.cleanupFns.push(() => anchor.removeEventListener('click', handler));
    });
  }

  private setupProjectFilter(): void {
    const filterButtons = document.querySelectorAll<HTMLButtonElement>('.filter-btn');
    const projectCards = document.querySelectorAll<HTMLElement>('.project-card');

    filterButtons.forEach(btn => {
      const handler = () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');

        projectCards.forEach((card, index) => {
          const category = card.getAttribute('data-category');

          if (filter === 'all' || category === filter) {
            window.setTimeout(() => {
              card.style.display = 'block';
              window.setTimeout(() => card.classList.add('revealed'), 10);
            }, index * 100);
          } else {
            card.classList.remove('revealed');
            window.setTimeout(() => {
              card.style.display = 'none';
            }, 300);
          }
        });
      };

      btn.addEventListener('click', handler);
      this.cleanupFns.push(() => btn.removeEventListener('click', handler));
    });
  }

  private setupThemeToggle(): void {
    const themeToggle = document.getElementById('theme-toggle') as HTMLInputElement | null;
    if (!themeToggle) return;

    const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)')?.matches ?? true;

    let savedTheme: string | null = null;
    try {
      savedTheme = localStorage.getItem('theme');
    } catch {
      savedTheme = null;
    }

    const theme = savedTheme || (prefersDark ? 'dark' : 'light');
    if (theme === 'light') {
      document.body.classList.add('light-mode');
      themeToggle.checked = true;
    }

    const handler = () => {
      document.body.classList.toggle('light-mode');
      const isLight = document.body.classList.contains('light-mode');
      try {
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
      } catch {
        // ignore
      }
    };

    themeToggle.addEventListener('change', handler);
    this.cleanupFns.push(() => themeToggle.removeEventListener('change', handler));
  }

  private setupParallax(): void {
    const hero = document.querySelector<HTMLElement>('.hero');
    if (!hero) return;

    let ticking = false;

    const onScroll = () => {
      if (ticking) return;
      window.requestAnimationFrame(() => {
        const scrolled = window.pageYOffset;
        hero.style.backgroundPosition = `center ${scrolled * 0.3}px`;

        const particles = document.querySelectorAll<HTMLElement>('.particle');
        particles.forEach((particle, index) => {
          const speed = 0.1 + index * 0.05;
          const yPos = -(scrolled * speed);
          particle.style.transform = `translateY(${yPos}px)`;
        });

        ticking = false;
      });
      ticking = true;
    };

    this.onWindow('scroll', onScroll);
    onScroll();
  }

  private setupScrollReveal(): void {
    const elements = document.querySelectorAll<HTMLElement>('.reveal');
    if (!elements.length) return;

    const observerOptions: IntersectionObserverInit = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px',
    };

    this.intersectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        const el = entry.target as HTMLElement;
        const section = el.closest('.section');
        const elementsInSection = section ? Array.from(section.querySelectorAll<HTMLElement>('.reveal')) : [];
        const indexInSection = elementsInSection.indexOf(el);

        window.setTimeout(() => el.classList.add('revealed'), Math.max(0, indexInSection) * 100);
        this.intersectionObserver?.unobserve(el);
      });
    }, observerOptions);

    elements.forEach(el => this.intersectionObserver?.observe(el));
  }

  private setupImageCarousel(): void {
    const carousels = document.querySelectorAll<HTMLElement>('.carousel-container');

    carousels.forEach(carousel => {
      const images = Array.from(carousel.querySelectorAll<HTMLElement>('.carousel-image'));
      const indicators = Array.from(carousel.querySelectorAll<HTMLElement>('.indicator'));
      if (images.length === 0) return;

      let currentIndex = 0;
      let isHovering = false;

      const changeImage = (newIndex: number) => {
        images.forEach(img => img.classList.remove('active'));
        indicators.forEach(ind => ind.classList.remove('active'));
        images[newIndex]?.classList.add('active');
        indicators[newIndex]?.classList.add('active');
        currentIndex = newIndex;
      };

      const intervalId = window.setInterval(() => {
        if (isHovering) return;
        changeImage((currentIndex + 1) % images.length);
      }, 10000);
      this.carouselIntervals.push(intervalId);

      indicators.forEach((indicator, idx) => {
        const onClick = () => changeImage(idx);
        indicator.addEventListener('click', onClick);
        this.cleanupFns.push(() => indicator.removeEventListener('click', onClick));
      });

      const onEnter = () => (isHovering = true);
      const onLeave = () => (isHovering = false);
      carousel.addEventListener('mouseenter', onEnter);
      carousel.addEventListener('mouseleave', onLeave);
      this.cleanupFns.push(() => carousel.removeEventListener('mouseenter', onEnter));
      this.cleanupFns.push(() => carousel.removeEventListener('mouseleave', onLeave));
    });
  }
}
