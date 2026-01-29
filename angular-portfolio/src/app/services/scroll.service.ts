import { Injectable } from '@angular/core';
import { APP_CONFIG } from './constants';

@Injectable({
  providedIn: 'root'
})
export class ScrollService {
  private cleanupFns: Array<() => void> = [];

  initialize(): void {
    this.setupBackToTop();
    this.setupSmoothScroll();
  }

  private setupBackToTop(): void {
    const backToTop = document.getElementById('back-to-top');
    if (!backToTop) return;

    const onScroll = () => {
      if (window.scrollY > APP_CONFIG.SCROLL_BACK_TO_TOP_THRESHOLD) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    };

    window.addEventListener('scroll', onScroll);
    this.cleanupFns.push(() => window.removeEventListener('scroll', onScroll));
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
        this.smoothScrollTo(target);
      };

      anchor.addEventListener('click', handler);
      this.cleanupFns.push(() => anchor.removeEventListener('click', handler));
    });
  }

  private smoothScrollTo(target: HTMLElement): void {
    const targetPosition = target.offsetTop - APP_CONFIG.SMOOTH_SCROLL_OFFSET;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;

    const easeInOutCubic = (t: number) =>
      t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;

    let start: number | null = null;
    const animation = (currentTime: number) => {
      if (start === null) start = currentTime;
      const timeElapsed = currentTime - start;
      const progress = Math.min(timeElapsed / APP_CONFIG.SMOOTH_SCROLL_DURATION, 1);
      const ease = easeInOutCubic(progress);

      window.scrollTo(0, startPosition + distance * ease);
      if (timeElapsed < APP_CONFIG.SMOOTH_SCROLL_DURATION) {
        requestAnimationFrame(animation);
      }
    };

    requestAnimationFrame(animation);
  }

  cleanup(): void {
    this.cleanupFns.forEach(fn => fn());
    this.cleanupFns = [];
  }
}
